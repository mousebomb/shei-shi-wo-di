import { ServiceProto } from 'tsrpc-proto';
import { MsgChat } from './MsgChat';
import { ReqSend, ResSend } from './PtlSend';
import { ReqStartGame, ResStartGame } from './PtlStartGame';

export interface ServiceType {
    api: {
        "Send": {
            req: ReqSend,
            res: ResSend
        },
        "StartGame": {
            req: ReqStartGame,
            res: ResStartGame
        }
    },
    msg: {
        "Chat": MsgChat
    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 1,
    "services": [
        {
            "id": 0,
            "name": "Chat",
            "type": "msg"
        },
        {
            "id": 1,
            "name": "Send",
            "type": "api"
        },
        {
            "id": 2,
            "name": "StartGame",
            "type": "api",
            "conf": {}
        }
    ],
    "types": {
        "MsgChat/MsgChat": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "content",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "time",
                    "type": {
                        "type": "Date"
                    }
                }
            ]
        },
        "PtlSend/ReqSend": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "content",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "PtlSend/ResSend": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "time",
                    "type": {
                        "type": "Date"
                    }
                }
            ]
        },
        "PtlStartGame/ReqStartGame": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "base/BaseRequest": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "sessionId",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "PtlStartGame/ResStartGame": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ]
        },
        "base/BaseResponse": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "sessionId",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        }
    }
};