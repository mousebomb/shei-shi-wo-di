import { ApiCall } from "tsrpc";
import { ReqSendVote, ResSendVote } from "../shared/protocols/PtlSendVote";

export default async function (call: ApiCall<ReqSendVote, ResSendVote>) {
    // TODO
    call.error('API Not Implemented');
}