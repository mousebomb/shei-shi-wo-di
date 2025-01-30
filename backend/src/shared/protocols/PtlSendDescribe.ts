import { BaseRequest, BaseResponse, BaseConf } from "./base";

export interface ReqSendDescribe extends BaseRequest {
    content : string;
}

export interface ResSendDescribe extends BaseResponse {
    time: Date
}

export const conf: BaseConf = {

}
