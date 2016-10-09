/**
 * Created by no fight no free on 2016/9/29.
 * 由于非常厌倦java web的每次都要建立一堆的  package service action test js css html 等等，每次都要copy
 * 项目管理需要，结构是一样的，其实就是复制就好了
 * 那为什么不维护一个项目工程目录的json ，以及 对应文件的模板呢！！
 * 直接生成所有文件，然后写业务代码就好了
 * let us begin!!
 * cnpm install --save-dev gulp gulp-exec gulp-filter gulp-foreach gulp-rename gulp-inject-string
 * cnpm install --save-dev gulp-template gulp-concat gulp-conflict gulp-each gulp-rename gulp-flatten
 *
 * https://www.npmjs.com/package/package_name/
 * https://lodash.com/docs/4.16.2#template
 */

"use strict";
var util = require('util'),
    replaceDefault = {
        action: 'n',
        service: 'n',
        test: 'n',
        xml: 'n',
        html: 'n',
        js: 'n',
        scss: 'n',
    },
    methodsDefault = {
        view: 1,
        list: 1,
        add: 1,
        edit: 1,
    };
var gulp = require('gulp'),
    template = require('gulp-template'),
    concat = require('gulp-concat'),
    conflict = require('gulp-conflict'),
    each = require('gulp-each'),
    flatten = require('gulp-flatten'),
    rename = require('gulp-rename');

gulp.task('buildFiles', function () {
    "use strict";
    gulp.src('buildProject.json')
        .pipe(each(function (content, file, callback) {
            const buildData = JSON.parse(content);
            leaf(buildData.core, '', []);
            function leaf(o, path, packages) {
                const pathArray = path.split('/');
                for (var k in o) {
                    if (o[k]['@@leaf']) {
                        const replace = Object.assign({}, replaceDefault, o[k]['@@replace']);
                        const corePath = buildData.basePath + buildData.corePath + path;
                        gulp.src(['./buildTemplate/action.java'])
                            .pipe(template({
                                package: packages.join('.'),
                                name: k,
                                methods: (function (k) {
                                    var r = [],
                                        backends = Object.assign({}, methodsDefault, o[k]['@backend']);
                                    for (var k in backends) {
                                        if (backends[k]) {
                                            r.push(k);
                                        }
                                    }
                                    return r;
                                }(k))
                            }))
                            .pipe(rename(k[0].toUpperCase() + k.substr(1, k.length) + 'Action.java'))
                            .pipe(conflict(corePath, {
                                defaultChoice: replace.action //y,n,d    replace skip diff
                            }))
                            .pipe(gulp.dest(corePath));

                        gulp.src(['./buildTemplate/service.java'])
                            .pipe(template({
                                package: packages.join('.'),
                                name: k
                            }))
                            .pipe(rename(k[0].toUpperCase() + k.substr(1, k.length)
                                + 'Service.java'))
                            .pipe(conflict(corePath, {
                                defaultChoice: replace.service //y,n,d    replace skip diff
                            }))
                            .pipe(gulp.dest(corePath));

                        gulp.src(['./buildTemplate/serviceImpl.java'])
                            .pipe(template({
                                package: packages.join('.'),
                                name: k
                            }))
                            .pipe(rename(k[0].toUpperCase() + k.substr(1, k.length)
                                + 'ServiceImpl.java'))
                            .pipe(conflict(corePath, {
                                defaultChoice: replace.service //y,n,d    replace skip diff
                            }))
                            .pipe(gulp.dest(corePath));

                        const testPath = buildData.basePath + buildData.testPath + path;
                        gulp.src(['./buildTemplate/actionTest.java'])
                            .pipe(template({
                                package: packages.join('.'),
                                name: k,
                                methods: (function (k) {
                                    var r = [],
                                        backends = Object.assign({}, methodsDefault, o[k]['@backend']);
                                    for (var k in backends) {
                                        if (backends[k]) {
                                            r.push(k);
                                        }
                                    }
                                    return r;
                                }(k))
                            }))
                            .pipe(rename(k[0].toUpperCase() + k.substr(1, k.length)
                                + 'ActionTest.java'))
                            .pipe(conflict(testPath, {
                                defaultChoice: replace.test //y,n,d    replace skip diff
                            }))
                            .pipe(gulp.dest(testPath));
                        //xml
                        const xmlPackage = pathArray.slice(pathArray.length - 4, pathArray.length - 1);
                        xmlPackage.unshift('struts');
                        const xmlPath = buildData.basePath + buildData.xmlPath + pathArray[pathArray.length - 4] + '/';
                        gulp.src(['./buildTemplate/struts-business.xml'])
                            .pipe(template({
                                package: packages.join('.'),
                                name: k,
                                methods: (function (k) {
                                    var r = [],
                                        backends = Object.assign({}, methodsDefault, o[k]['@backend']);
                                    for (var k in backends) {
                                        if (backends[k]) {
                                            r.push(k);
                                        }
                                    }
                                    return r;
                                }(k))
                            }))
                            .pipe(rename(xmlPackage.join('-') + '.xml'))
                            .pipe(conflict(xmlPath, {
                                defaultChoice: replace.xml //y,n,d    replace skip diff
                            }))
                            .pipe(gulp.dest(xmlPath));
                        //web html js scss
                        const webPackage = pathArray.slice(pathArray.length - 4, pathArray.length);
                        const webPath = buildData.basePath + buildData.webappPath + webPackage.join('/');
                        const frontend = o[k]['@frontend'];
                        for (var fk in frontend) {
                            if (frontend[fk]) {
                                gulp.src(['./buildTemplate/list.html'])
                                    .pipe(template({
                                        'cssClass': webPackage.join('-') + fk.toLowerCase()
                                    }))
                                    .pipe(rename(fk + '.html'))
                                    .pipe(conflict(webPath, {
                                        defaultChoice: replace.html //y,n,d    replace skip diff
                                    }))
                                    .pipe(gulp.dest(webPath));
                                gulp.src(['./buildTemplate/list.js'])
                                    .pipe(template({
                                        'controllerAs': (function () {
                                            var a = webPackage.slice(0, webPackage.length - 1);
                                            a.push(fk);
                                            a.push('controller');
                                            return a.map(function (v, i) {
                                                if (i === 0)return v;
                                                return v.charAt(0).toUpperCase() + v.substr(1, v.length);
                                            }).join('');
                                        }())
                                    }))
                                    .pipe(rename(fk + '.js'))
                                    .pipe(conflict(webPath, {
                                        defaultChoice: replace.js //y,n,d    replace skip diff
                                    }))
                                    .pipe(gulp.dest(webPath));
                                gulp.src(['./buildTemplate/list.scss'])
                                    .pipe(template({
                                        'cssClass': webPackage.join('-') + fk.toLowerCase()
                                    }))
                                    .pipe(rename(fk + '.scss'))
                                    .pipe(conflict(webPath, {
                                        defaultChoice: replace.scss //y,n,d    replace skip diff
                                    }))
                                    .pipe(gulp.dest(webPath));
                            }
                        }
                    } else if (o[k] && o[k].constructor === Object && o[k]['@@leaf'] === undefined) {
                        packages.push(k);
                        leaf(o[k], path + k + '/', packages);
                        packages.pop();
                    }
                }
            }

            callback(null, content);
        }))

});
gulp.task('includeXML', function () {
    "use strict";
    gulp.src('buildProject.json')
        .pipe(each(function (content1, file, callback) {
            const xy = JSON.parse(content1).core.com.yiwisdom.xy;
            for (var k in xy) {
                (function (k) {
                    var includes = '';
                    gulp.src(['../resources/struts/' + k + '/struts-*.xml'])
                        .pipe(each(function (content2, file, callback) {
                            var a = file.history[0].split('\\');
                            includes += '<include file="' + a.slice(a.length - 3, a.length).join('/') + '"></include>\n    ';
                            callback(null, content2);
                        }))
                        .pipe(concat('struts.xml'))
                        .pipe(each(function (content3, file, callback) {
                            gulp.src(['./buildTemplate/struts.xml'])
                                .pipe(template({
                                    includes: includes
                                }))
                                // .pipe(conflict(corePath, {
                                //     defaultChoice: replace.action //y,n,d    replace skip diff
                                // }))
                                .pipe(rename('struts.xml'))
                                .pipe(gulp.dest('../resources/struts/' + k + '/'));
                            callback(null, content3);
                        }));
                })(k);
            }
            callback(null, content1);
        }));

});
gulp.task('resource', function () {
    var resources = [
        'bower_components/angular/angular.js',
        'bower_components/angular-animate/angular-animate.js',
        'bower_components/angular-touch/angular-touch.js',
        'bower_components/angular-bootstrap/ui-bootstrap.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
        'bower_components/angular-ui-router/release/angular-ui-router.js',
        'bower_components/oclazyload/dist/ocLazyLoad.js',
        'node_modules/sass.js/dist/sass.sync.js',
    ],basePath = 'xy/src/main/webapp/com-pc/ref/angular';
    gulp.src(resources)
        .pipe(flatten())
        .pipe(gulp.dest(basePath));
    gulp.src([
        'bower_components/bootstrap/dist/css/bootstrap.css',
        'bower_components/bootstrap/dist/css/bootstrap-theme.css',
    ])
        .pipe(flatten())
        .pipe(gulp.dest(basePath+'/css'));
    gulp.src([
        'bower_components/bootstrap/dist/fonts/**/*.*',
    ])
        .pipe(gulp.dest(basePath+'/fonts'));
});
gulp.task('default', function () {
    gulp.start('buildFiles', 'includeXML');
});