import { ApiCall } from "tsrpc";
import { ReqStartGame, ResStartGame } from "../shared/protocols/PtlStartGame";
import {RoomManager} from "../manager/RoomManager";
import {RoomVO} from "../vo/RoomVO";
import {AiManager} from "../manager/AiManager";
import {server} from "../index";
import GameManager from "../manager/GameManager";

export default async function (call: ApiCall<ReqStartGame, ResStartGame>) {
    /*
    开始游戏，创建房间，拉入5个AI玩家，记录信息
     */
    const userId = await call.getSession("userId");
    await call.succ({});

    // 调用大模型生成词语
    const fetchWords = await AiManager.getInstance().createWord();
    call.logger.log("fetchWords: ",fetchWords);
    if ( fetchWords.length!=2)
    {
        return call.error("AiManager/createWord failed");
        // throw new Error("AiManager/createWord failed");
    }
    // 创建房间
    const room :RoomVO = RoomManager.getInstance().createRoom(userId,fetchWords);
    // 初始化智能体的最初prompt
    for (let i = 0; i < room.players.length; i++) {
        await AiManager.getInstance().agentInit(room,i+1);
    }
    await call.setSession("room",room);
    await call.conn.sendMsg("GameStarted",{
        word : room.players[room.humanPlayer-1].word
    })
    // 开始游戏一轮
    await GameManager.getInstance().gameNext(room,call.conn);



}
