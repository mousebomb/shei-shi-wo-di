import { ApiCall } from "tsrpc";
import { ReqStartGame, ResStartGame } from "../shared/protocols/PtlStartGame";
import {RoomManager} from "../manager/RoomManager";
import {RoomVO} from "../vo/RoomVO";
import {AiManager} from "../manager/AiManager";
import {server} from "../index";

export default async function (call: ApiCall<ReqStartGame, ResStartGame>) {
    /*
    开始游戏，创建房间，拉入5个AI玩家，记录信息
     */
    const userId = await call.getSession("userId");

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
    await call.succ({});
    // 开始游戏一轮


    RoomManager.getInstance().nextRound(room);
    call.logger.log("ApiStartGame/default/描述环节");
    // 开始 按序号描述，直到玩家时 返回并等待玩家输入
    for (let i=0;i<room.players.length;i++){
        if ( !room.players[i].isAi )
        {
            // 玩家，则等待玩家输入
            // todo
            // console.log("ApiStartGame/default 需要玩家输入"           );
        }
        if (!room.players[i].dead){
            //AI 玩家 则开始描述
            console.log("ApiStartGame/default 玩家"+(i+1) + room.players[i].name+"描述请求中");
            const describeContent = await AiManager.getInstance().agentDescribeWord(room.players[i],room.round,i+1);
            console.log("ApiStartGame/default 玩家"+(i+1) + room.players[i].name+"描述："+describeContent);
            // 广播同步给所有player的历史消息
            for (let j =0;j<room.players.length;j++)
            {
                if ( room.players[j].isAi )
                {
                    AiManager.getInstance().appendAiMessage(room.round,i+1,room.players[i],describeContent,room.players[j]);
                }else{
                    // 广播给玩家
                    server.broadcastMsg("Chat",{
                        content:
                            "第"+room.round+"轮 【描述阶段】，玩家"+room.players[i].number+" "+
                            room.players[i].name+"描述道:\""+describeContent +"\"。"
                        ,
                        time:new Date(),
                    })
                }
            }

        }
    }
    call.logger.log("ApiStartGame/default/描述完毕");

    // 描述完毕后，开始投票
    for (let i=0;i<room.players.length;i++){
        if (!room.players[i].isAi )
        {
            // 玩家，则等待玩家输入
            // todo
            // console.log("ApiStartGame/default 需要玩家输入"           );
        }
        if (!room.players[i].dead){
            //AI 玩家 则开始描述
            console.log("ApiStartGame/default 玩家"+(i+1) + room.players[i].name+"投票请求中");
            const voteContent = await AiManager.getInstance().agentVote(room.players[i],room);
            console.log("ApiStartGame/default 玩家"+(i+1) + room.players[i].name+"投票："+voteContent);

            // 广播同步给所有player的历史消息
            for (let j =0;j<room.players.length;j++)
            {
                if ( room.players[j].isAi)
                {
                    AiManager.getInstance().appendAiVoteMessage(room.round,room.players[i],voteContent,room.players[j]);
                }else{
                    // 广播给玩家
                    server.broadcastMsg("Chat",{
                        content:
                            "第"+room.round+"轮 【投票阶段】，玩家"+room.players[i].getFullName()+"投票给玩家"+room.players[voteContent.voteToPlayer-1].getFullName() +" 理由："+voteContent.reason +"。"
                        ,
                        time:new Date(),
                    });
                }
            }
        }
    }
    call.logger.log("ApiStartGame/default/投票完毕");


}
