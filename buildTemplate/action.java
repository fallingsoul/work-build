package <%= package%>;
import com.yiwisdom.base.BaseAction;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Resource;
import java.util.Date;

@SuppressWarnings("serial")
public class <%= _.upperFirst(name)%>Action extends BaseAction {
    private Logger log = LoggerFactory.getLogger(getClass());
    @Resource(name="<%= package+'.'+_.lowerFirst(name)+'Service'%>")
    <%= _.upperFirst(name)%>Service <%= _.lowerFirst(name)%>Service;
	public Integer pageNum;
    public Integer pageSize;

    public String search;
    public Date beginDate;
    public Date endDate;
    public String status;
    <% _.forEach(methods,function(m){%>
    public String <%=m%>() throws Exception{
        return BaseAction.SUCCESS;
    }
    <% }); %>
}