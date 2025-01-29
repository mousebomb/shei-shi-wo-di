import {WsServer} from "tsrpc";
import {BaseConf} from "../shared/protocols/base";
import {ErrorCode} from "../constants";

export function enableAuthentication(server: WsServer) {
    server.flows.preApiCallFlow.push(async call => {
        let conf: BaseConf | undefined = call.service.conf;

        if ( conf?.needAdmin )
        {
            let isAdmin = await call.getSession("isAdmin");
            // NeedLogin
            if ( !isAdmin) {
                call.error('需要先登录管理账号', { code: ErrorCode.NOT_LOGIN });
                return undefined;
            }
        }
        if ( conf?.needUser )
        {
            let isUser = await call.getSession("isUser");
            // NeedLogin
            if (!isUser) {
                call.error('需要先登录用户账号', { code: ErrorCode.NOT_LOGIN });
                return undefined;
            }
        }


        return call;
    })
}
