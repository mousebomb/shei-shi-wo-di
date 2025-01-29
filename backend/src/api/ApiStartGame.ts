import { ApiCall } from "tsrpc";
import { ReqStartGame, ResStartGame } from "../shared/protocols/PtlStartGame";
import {RoomManager} from "../manager/RoomManager";
import {RoomVO} from "../vo/RoomVO";
import {AiManager} from "../manager/AiManager";

export default async function (call: ApiCall<ReqStartGame, ResStartGame>) {
    /*
    开始游戏，创建房间，拉入5个AI玩家，记录信息
     */
    const userId = await call.getSession("userId");

    // 创建房间
    const room :RoomVO = RoomManager.getInstance().createRoom(userId);
    // 调用大模型生成词语
    const fetchWords = await AiManager.getInstance().createWord();
    call.logger.log("fetchWords: ",fetchWords);

    call.succ({
    });
}
