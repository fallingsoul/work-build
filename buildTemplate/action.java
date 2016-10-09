package <%= package%>;
import com.yiwisdom.base.BaseAction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Resource;

@SuppressWarnings("serial")
public class <%= _.upperFirst(name)%>Action extends BaseAction {
    private Logger log = LoggerFactory.getLogger(getClass());
    @Resource(name="<%= package+'.'+_.lowerFirst(name)+'Service'%>")
    <%= _.upperFirst(name)%>Service <%= _.lowerFirst(name)%>Service;
    <% _.forEach(methods,function(m){%>
    public String <%=m%>(){
        return BaseAction.SUCCESS;
    }
    <% }); %>
}