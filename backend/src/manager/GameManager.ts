import {RoomRoundStep, RoomVO} from "../vo/RoomVO";
import {server} from "../index";
import PlayerVO from "../vo/PlayerVO";
import {AiManager} from "./AiManager";
import {BaseConnection} from "tsrpc";

export default class GameManager {
    private static instance: GameManager;

    private constructor() {
    }

    public static getInstance(): GameManager {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    /**
     * 游戏的下一步运行；
     *  用于玩家输入后，继续进行游戏的下一步迭代
     *   会根据当前用户的房间状态做不同的处理
     */
    public async gameNext(room:RoomVO,conn :BaseConnection<any>){
        let canGoNext = true;
        while(canGoNext){
            if ( room.currentPlayerInputing) {
                // 玩家正在输入，不做处理
                return;
            }
            // 如果尚未开始，则进入第一轮
            if ( room.round == 0 )
            {
                room.round=1;
                room.currentRoundStep = RoomRoundStep.describe;
                room.currentPlayer = 1;
                // 开始 按序号描述，直到玩家时 返回并等待玩家输入
                server.broadcastMsg("Chat",{
                    content:
                        "第"+room.round+"轮 【描述阶段】，开始。"
                    ,
                    time:new Date(),
                });
            }
            // 当前轮的阶段
            if ( room.currentRoundStep == RoomRoundStep.describe )
            {
                // 描述阶段
                const describeIsWaiting = await this.gamePlayerDescribe(room,room.currentPlayer,conn);
                // 如果玩家正在输入，则等待玩家输入，退出本次处理，交由玩家输入后再次发起gameNext()
                if ( describeIsWaiting ) return;
                if ( room.currentPlayerInputing ) return;
                // 玩家输入完毕，进入下一个玩家
                if ( ++room.currentPlayer > room.players.length )
                {//如果所有玩家都已结束，则进入下一环节
                    room.currentRoundStep = RoomRoundStep.vote;
                    room.currentPlayer = 1;
                    // 开始 投票
                    server.broadcastMsg("Chat",{
                        content:
                            "第"+room.round+"轮 【投票阶段】，开始。"
                      ,
                        time:new Date(),
                    });
                }


            }
            //当前阶段
            if ( room.currentRoundStep == RoomRoundStep.vote )
            {
                // 投票阶段
                const voteIsWaiting = await this.gamePlayerVote(room,room.currentPlayer,conn);
                if ( voteIsWaiting ) return;
                if ( room.currentPlayerInputing ) return;
                // 玩家输入完毕，进入下一个玩家
                if(++room.currentPlayer > room.players.length )
                {
                    // 所有玩家都已结束，则计票，并淘汰一名投票最多的玩家。

                    // 若仍有足够玩家，卧底仍在，则进入下一轮
                    room.round++;
                    room.currentRoundStep = RoomRoundStep.describe;
                    room.currentPlayer = 1;
                    // 开始 按序号描述
                    server.broadcastMsg("Chat",{
                        content:
                            "第"+room.round+"轮 【描述阶段】，开始。"
                        ,
                        time:new Date(),
                    });
                }
            }
        }


    }


    /**
     * 轮到下一个玩家描述 ，返回是否等待玩家输入
     * @param room
     * @param currentPlayer
     * @private
     */
    private async gamePlayerDescribe(room:RoomVO,currentPlayer:number,conn :BaseConnection<any>):Promise<boolean>{
        const i = currentPlayer-1;
        const player = room.players[i];
        if ( !player.isAi )
        {
            // 玩家，则等待玩家输入
            room.currentPlayerInputing = true;
            // 广播给玩家
            await conn.sendMsg("PlsDescribe",{});
            return true;
        }
        if ( player.dead )
        {
            //AI玩家 且已出局，跳过，直接完成本玩家输入
            room.currentPlayerInputing = false;
            return false;
        }else{
            //AI玩家 且没出局 则开始描述
            room.currentPlayerInputing = true;
            conn.logger.log("GameManager/default "+ player.getFullName()+"描述请求中");
            const describeContent = await AiManager.getInstance().agentDescribeWord(player,room.round,i+1);
            conn.logger.log("GameManager/default "+ player.getFullName()+"描述："+describeContent);
            // 广播同步给所有player的历史消息
            for (let j =0;j<room.players.length;j++)
            {
                //跳过自己
                if(i==j) continue;
                if ( room.players[j].isAi )
                {
                    AiManager.getInstance().appendAiMessage(room.round,i+1,player,describeContent,room.players[j]);
                }else{
                    // 广播给玩家
                    server.broadcastMsg("Chat",{
                        content: player.getFullName()+"描述道:\""+describeContent +"\"。"
                        ,
                        time:new Date(),
                    })
                }
            }
            room.currentPlayerInputing = false;
            return false;
        }
    }
    private async gamePlayerVote(room:RoomVO,currentPlayer:number,conn :BaseConnection<any>):Promise<boolean>{
        const i = currentPlayer-1;
        const player = room.players[i];
        if ( !player.isAi )
        {
            // 玩家，则等待玩家输入
            room.currentPlayerInputing = true;
            // 广播给玩家
            await conn.sendMsg("PlsVote",{});
            return true;
        }
        if ( player.dead )
        {
            //AI玩家 且已出局，跳过，直接完成本玩家输入
            room.currentPlayerInputing = false;
            return false;
        }else{
            //AI玩家 且没出局 则开始投票
            conn.logger.log("GameManager/default 玩家"+(i+1) + room.players[i].name+"投票请求中");
            const voteContent = await AiManager.getInstance().agentVote(room.players[i],room);
            conn.logger.log("GameManager/default 玩家"+(i+1) + room.players[i].name+"投票："+voteContent.voteToPlayer);
            // 广播同步给所有player的历史消息
            for (let j =0;j<room.players.length;j++)
            {
                //跳过自己
                if(i==j) continue;
                if ( room.players[j].isAi )
                {
                    AiManager.getInstance().appendAiVoteMessage(room.round,room.players[i],voteContent,room.players[j]);
                }else{
                    // 广播给玩家
                    server.broadcastMsg("Chat",{
                        content: room.players[i].getFullName()+"投票给玩家"+room.players[voteContent.voteToPlayer-1].getFullName() +" 理由："+voteContent.reason +"。",
                        time:new Date(),
                    })
                }
            }
            room.currentPlayerInputing = false;
            return false;

        }

    }

}
