import {ApiCall} from "tsrpc";
import {ReqSendDescribe, ResSendDescribe} from "../shared/protocols/PtlSendDescribe";
import GameManager from "../manager/GameManager";

export default async function (call: ApiCall<ReqSendDescribe, ResSendDescribe>) {
    const room =await call.getSession("room");
    if ( room == null )
    {
        return call.error("room is null");
    }
    await call.succ({time: new Date()});
    await GameManager.getInstance().userInputDescribe(call.req.content,room,call.conn);
}
