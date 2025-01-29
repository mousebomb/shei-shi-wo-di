import {HttpServer, WsServer} from "tsrpc";
import * as uuid from "uuid";
import {BaseRequest, BaseResponse} from "../shared/protocols/base";
import {SessionData} from "./SessionData";

// This example store session data to memory for convinience.
// You can store it into database or redis as you need.
export class ServerSession {

    async enable(server: WsServer) {
        // 对request 初始化session，注入sessionId和getSession和setSession
        server.flows.preApiCallFlow.push(async v => {
            // Init Session
            let req = v.req as BaseRequest;
            let { sessionId } = await this.initSession(req.sessionId)
            req.sessionId = sessionId;

            // ApiCall: Get & Set Session
            v.getSession = this.getSession.bind(this, sessionId);
            v.setSession = this.setSession.bind(this, sessionId);

            return v;
        });

        // response 追加sessionId或保持不变
        server.flows.preApiReturnFlow.push(v => {
            if (v.return.isSucc) {
                let req = v.call.req as BaseRequest;
                let res = v.return.res as BaseResponse;
                res.sessionId = req.sessionId;
                v.call.logger.log("sessionId=" + req.sessionId);
            }
            return v;
        });

    }

    // Test session storage
    private _sessionData: {
        [sessionId: string]: SessionData;
    } = {};

    // Storage in server memory 将会话存储在内存，有则返回，无则创建
    async initSession(sessionId?: string) {
        // Existed sessionId
        if (sessionId) {
            if (this._sessionData[sessionId]) {
                return {
                    sessionId: sessionId
                }
            }
        }

        sessionId = uuid.v4();
        this._sessionData[sessionId] = {};
        return {
            sessionId: sessionId
        };
    }
    async getSession<T extends keyof SessionData>(sessioinId: string, key: T): Promise<SessionData[T]> {
        return this._sessionData[sessioinId][key];
    }
    async setSession<T extends keyof SessionData>(sessioinId: string, key: T, value: SessionData[T]): Promise<void> {
        this._sessionData[sessioinId][key] = value;
    }
}

declare module 'tsrpc' {
    export interface ApiCall {
        getSession: <T extends keyof SessionData>(key: T) => Promise<SessionData[T]>,
        setSession: <T extends keyof SessionData>(key: T, value: SessionData[T]) => Promise<void>
    }
}

