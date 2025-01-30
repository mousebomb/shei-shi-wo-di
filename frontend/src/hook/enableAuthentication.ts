import {HttpClient} from "tsrpc-browser";
import {useHistory} from "react-router-dom";

// 检测请求的接口，如果返回错误是未登录，则跳转到登录界面
export default function (client: HttpClient<any>) {

    client.flows.preApiReturnFlow.push(v => {
        if ( !v.return .isSucc)
        {
            if (v.return.err?.code == "NOT_LOGIN") {
                // 未登录 ，弹回登录界面
                // GlobalFacade.history.replace("/login");
            }
            //如果不成功，顺便提示错误信息
            // Toast.error(v.return.err?.message);
        }
        return v;
    })
}