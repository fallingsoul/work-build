package <%= package%>;

import com.yiwisdom.base.BaseServiceImpl;
import org.springframework.stereotype.Service;
import org.apache.log4j.Logger;
@Service("<%= package+'.'+_.lowerFirst(name)+'Service'%>")
public class <%= _.upperFirst(name)%>ServiceImpl extends BaseServiceImpl implements <%= _.upperFirst(name)%>Service {
    public Logger log = Logger.getLogger(getClass());
}
