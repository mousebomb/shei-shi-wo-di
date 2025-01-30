import { BaseRequest, BaseResponse, BaseConf } from "./base";

export interface ReqSendVote extends BaseRequest {
    voteToPlayer:number;
    reason?:string;
}

export interface ResSendVote extends BaseResponse {
    time: Date
}

export const conf: BaseConf = {

}
