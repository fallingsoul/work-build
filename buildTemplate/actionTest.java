package <%= package%>;

import com.yiwisdom.xy.StrutsSpringTestCaseLoad;
import org.json.simple.JSONObject;
import org.junit.FixMethodOrder;
import org.junit.runners.MethodSorters;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class <%= _.upperFirst(name)%>ActionTest extends StrutsSpringTestCaseLoad{
<% _.forEach(methods,function(m){%>
    public void test<%= _.upperFirst(m)%>() throws Exception {
        JSONObject jsonResult = exc("/<%= _.join(_.takeRight(_.split(package,'.'),3),'/') + '/'+m%>");
        assertEquals(jsonResult.get("ljt_error_code"),0L);
    }
<% }); %>
}
