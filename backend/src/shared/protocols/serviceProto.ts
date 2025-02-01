import { ServiceProto } from 'tsrpc-proto';
import { MsgChat } from './MsgChat';
import { MsgGameStarted } from './MsgGameStarted';
import { MsgPlsDescribe } from './MsgPlsDescribe';
import { MsgPlsVote } from './MsgPlsVote';
import { ReqSend, ResSend } from './PtlSend';
import { ReqSendDescribe, ResSendDescribe } from './PtlSendDescribe';
import { ReqSendVote, ResSendVote } from './PtlSendVote';
import { ReqStartGame, ResStartGame } from './PtlStartGame';

export interface ServiceType {
    api: {
        "Send": {
            req: ReqSend,
            res: ResSend
        },
        "SendDescribe": {
            req: ReqSendDescribe,
            res: ResSendDescribe
        },
        "SendVote": {
            req: ReqSendVote,
            res: ResSendVote
        },
        "StartGame": {
            req: ReqStartGame,
            res: ResStartGame
        }
    },
    msg: {
        "Chat": MsgChat,
        "GameStarted": MsgGameStarted,
        "PlsDescribe": MsgPlsDescribe,
        "PlsVote": MsgPlsVote
    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 4,
    "services": [
        {
            "id": 0,
            "name": "Chat",
            "type": "msg"
        },
        {
            "id": 3,
            "name": "GameStarted",
            "type": "msg"
        },
        {
            "id": 4,
            "name": "PlsDescribe",
            "type": "msg"
        },
        {
            "id": 5,
            "name": "PlsVote",
            "type": "msg"
        },
        {
            "id": 1,
            "name": "Send",
            "type": "api"
        },
        {
            "id": 6,
            "name": "SendDescribe",
            "type": "api",
            "conf": {}
        },
        {
            "id": 7,
            "name": "SendVote",
            "type": "api",
            "conf": {}
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
        "MsgGameStarted/MsgGameStarted": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "word",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "numPlayers",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "MsgPlsDescribe/MsgPlsDescribe": {
            "type": "Interface"
        },
        "MsgPlsVote/MsgPlsVote": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "options",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Number"
                        }
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
        "PtlSendDescribe/ReqSendDescribe": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
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
        "PtlSendDescribe/ResSendDescribe": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
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
        },
        "PtlSendVote/ReqSendVote": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "voteToPlayer",
                    "type": {
                        "type": "Number"
                    }
                },
                {
                    "id": 1,
                    "name": "reason",
                    "type": {
                        "type": "String"
                    },
                    "optional": true
                }
            ]
        },
        "PtlSendVote/ResSendVote": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
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
        }
    }
};