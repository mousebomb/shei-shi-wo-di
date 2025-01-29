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

    // 调用大模型生成词语
    const fetchWords = await AiManager.getInstance().createWord();
    call.logger.log("fetchWords: ",fetchWords);
    // 创建房间
    const room :RoomVO = RoomManager.getInstance().createRoom(userId,fetchWords);
    // 初始化智能体的最初prompt
    for (let i = 0; i < room.players.length; i++) {
        await AiManager.getInstance().agentInit(room,i+1);
    }
    await call.setSession("room",room);
    await call.succ({});
    // 开始游戏一轮
console.log("ApiStartGame/default/");

    RoomManager.getInstance().nextRound(room);
    // 开始 按序号描述，直到玩家时 返回并等待玩家输入
    for (let i=0;i<room.players.length;i++){
        if ( !room.players[i].isAi )
        {
            // 玩家，则等待玩家输入
            console.log("ApiStartGame/default 需要玩家输入"           );
        }
        if (!room.players[i].dead){
            //AI 玩家 则开始描述
            const describeContent = await AiManager.getInstance().agentDescribeWord(room.players[i],room.round,i+1);
            // 广播同步给所有player的历史消息
            for (let j =0;j<room.players.length;j++)
            {
                AiManager.getInstance().appendAiMessage(room.players[i],describeContent,room.players[j]);
            }
        }
    }
    console.log("ApiStartGame/default2/");


}
