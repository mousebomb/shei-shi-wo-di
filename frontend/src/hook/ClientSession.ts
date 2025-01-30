import {HttpClient, WsClient} from "tsrpc-browser";

const SessionStorageKey = 'MB_SESSION_TOKEN';

/**
 * 启用会话支持，本地存储sessionId
 * @param client
 */
export function enableSession(client: WsClient<any>) {
    // Send
    client.flows.preCallApiFlow.push(v => {
        let sessionId = localStorage.getItem(SessionStorageKey);
        v.req.sessionId = sessionId ? sessionId : undefined;
        return v;
    })

    // Return
    client.flows.preApiReturnFlow.push(v => {
        if (v.return.isSucc) {
            if (v.return.res.sessionId) {
                localStorage.setItem(SessionStorageKey, v.return.res.sessionId);
            }
        }

        return v;
    })
}
