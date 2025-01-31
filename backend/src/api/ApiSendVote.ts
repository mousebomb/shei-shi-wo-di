import { ApiCall } from "tsrpc";
import { ReqSendVote, ResSendVote } from "../shared/protocols/PtlSendVote";
import GameManager from "../manager/GameManager";

export default async function (call: ApiCall<ReqSendVote, ResSendVote>) {

    const room = await call.getSession("room");
    if (room == null) {
        return call.error("room is null");
    }
    await call.succ({ time: new Date()});
    await GameManager.getInstance().userInputVote(call.req.voteToPlayer,"觉得他的词和我的特征不符合",room,call.conn);

}
