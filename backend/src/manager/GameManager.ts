import {RoomRoundStep, RoomVO} from "../vo/RoomVO";
import {server} from "../index";
import PlayerVO, {Identity} from "../vo/PlayerVO";
import {AiManager} from "./AiManager";
import {BaseConnection} from "tsrpc";
import {RoomManager} from "./RoomManager";

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
        console.log("GameManager/GameManager/gameNext 游戏继续进行");
        let canGoNext = true;
        while(canGoNext){
            if ( room.currentPlayerInputing) {
                // 玩家正在输入，不做处理
                console.log("GameManager/GameManager/gameNext 玩家正在输入，不做处理");
                return;
            }
            // 如果尚未开始，则进入第一轮
            if ( room.round == 0 )
            {
                await this.gameNewRoundBegin(room,conn);
            }
            // 当前轮的阶段
            if ( room.currentRoundStep == RoomRoundStep.describe )
            {
                // 描述阶段
                // 检测是否全员描述完毕，进入下一个环节
                if ( room.currentPlayer > room.players.length )
                {   //如果所有玩家都已结束，则进入下一环节
                    room.currentRoundStep = RoomRoundStep.vote;
                    room.currentPlayer = 1;
                    // 开始 投票
                    this.broadcastToRoom(room, -1, "第"+room.round+"轮 【投票阶段】，开始。", conn);
                    RoomManager.getInstance().beginVote(room);
                }else{

                    // 请当前玩家描述
                    const describeIsWaiting = await this.gamePlayerDescribe(room,room.currentPlayer,conn);
                    // 如果玩家正在输入，则等待玩家输入，退出本次处理，交由玩家输入后再次发起gameNext()
                    if ( describeIsWaiting ) return;
                    if ( room.currentPlayerInputing ) return;
                }


            }
            //当前阶段
            if ( room.currentRoundStep == RoomRoundStep.vote )
            {
                // 投票阶段
                // 环节检测 是否全员投票完毕，进入下一个环节
                if(room.currentPlayer > room.players.length )
                {
                    // 所有玩家都已结束，则计票，并淘汰一名投票最多的玩家。
                    const isGameEnd = await this.gameRoundResult(room, conn);
                    if(isGameEnd){
                        // 游戏结束 跳出循环
                        return;
                    }else{
                        // 若仍有足够玩家，卧底仍在，则进入下一轮
                        await this.gameNewRoundBegin(room,conn);
                    }
                }else{
                    // 投票阶段，请当前玩家投票
                    const voteIsWaiting = await this.gamePlayerVote(room,room.currentPlayer,conn);
                    if ( voteIsWaiting ) return;
                    if ( room.currentPlayerInputing ) return;
                }
            }
        }
    }

    /** 投票结束后 一轮的结果， 以及是否游戏结束
     * 返回 游戏是否结束 */
    async gameRoundResult(room:RoomVO,conn :BaseConnection<any>):Promise<boolean> {
        // 淘汰一名投票最多的玩家。
        const eliminatedPlayer = RoomManager.getInstance().voteResult(room);
        const thePlayer = room.players[eliminatedPlayer-1];
        // 此时淘汰玩家已被标记为淘汰
        let content = thePlayer.getFullName() + "得票最高，被淘汰。他是" + (thePlayer.identity == Identity.commoner ? "平民" : "卧底") + "。";
        let isGameEnd = false;
        // 开始盘点人数
        const aliveUndercoverCount = RoomManager.getInstance().calcUndercoverAlive(room);
        const aliveCommonerCount = RoomManager.getInstance().calcCommonerAlive(room);
        // 如果卧底人数为0，则游戏结束； 如果平民人数小于或等于存活的卧底人数，则游戏结束
        if (aliveUndercoverCount == 0) {
            // 游戏结束 平民胜利
            content += "平民胜利。";
            isGameEnd = true;
        } else if (aliveCommonerCount <= aliveUndercoverCount) {
            // 游戏结束 卧底胜利
            content += "卧底胜利。";
            isGameEnd = true;
        }

        // 广播 : 对玩家，发送msg；对AI，追加aimessage ； 包括自己
        this.broadcastToRoom(room, -1, content, conn);

        if (isGameEnd) {
            // 游戏结束 公布人员身份和词
            await conn.sendMsg("Chat", {
                content: "游戏结束。平民词是" + room.words[0] +
                    "，卧底词是" + room.words[1] +
                    "。卧底是" + room.players[room.undercoverPlayer - 1].getFullName() + "。",
                time: new Date(),
            });
        } else {
            // 若仍有足够玩家，卧底仍在，则进入下一轮
            this.broadcastToRoom(room, -1, "游戏继续。", conn);
        }
        return isGameEnd;

    }

    async gameNewRoundBegin(room:RoomVO,conn :BaseConnection<any>)
    {
        // 若仍有足够玩家，卧底仍在，则进入下一轮
        room.round++;
        room.currentRoundStep = RoomRoundStep.describe;
        room.currentPlayer = 1;
        // 开始 按序号描述
        // 对玩家，发送msg；对AI，追加aimessage ； 包括自己
        const content = "第" + room.round + "轮 【描述阶段】，开始。";
        this.broadcastToRoom(room, -1, content, conn);
    }

    // 广播给房间的所有玩家 （如果要不包括自己，则传入要跳过的玩家序号，否则传入-1，正常玩家序号是1～6）
    broadcastToRoom(room: RoomVO, skipPlayerNumber: number, content: string, conn: BaseConnection<any>) {
        RoomManager.getInstance().broadcast(room, skipPlayerNumber, (ai) => {
            AiManager.getInstance().appendAiMessage(ai, content);
        }, (human) => {
            // 广播给玩家
            conn.sendMsg("Chat", {content: content, time: new Date(),});
        });
    }

    // 人类玩家输入描述
    public async userInputDescribe(describeContent : string,room:RoomVO,conn :BaseConnection<any>){
        //同步给所有玩家 AI和人类
        const player = room.players[room.currentPlayer-1];
        // 广播同步给所有player的历史消息
        const messageContent = player.getFullName() + "描述道:" + describeContent;
        // 对玩家，发送msg；对AI，追加aimessage ； 包括自己
        this.broadcastToRoom(room, -1, messageContent, conn);
        room.currentPlayerInputing = false;
        room.currentPlayer++;
        //继续游戏
        await this.gameNext(room,conn);
    }
    // 玩家投票
    public async userInputVote(voteToPlayer : number,reason : string,room:RoomVO,conn :BaseConnection<any>){
        //同步给所有玩家 AI和人类
        const player = room.players[room.currentPlayer-1];
        // 广播同步给所有player的历史消息 包括自己
        const messageContent = player.getFullName() + "投票给玩家" + voteToPlayer + "，理由:\"" + reason + "\"。";
        // 对玩家，发送msg；对AI，追加aimessage ； 包括自己
        this.broadcastToRoom(room, -1, messageContent, conn);
        //计票
        RoomManager.getInstance().vote(room,voteToPlayer);
        //标记玩家已完成输入
        room.currentPlayerInputing = false;
        room.currentPlayer++;
        //继续游戏
        await this.gameNext(room,conn);
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
        if ( player.dead )
        {
            //玩家 已出局，跳过，直接完成本玩家输入
            room.currentPlayerInputing = false;
            room.currentPlayer++;
            return false;
        }
        if ( !player.isAi )
        {
            // 人类玩家且没出局，则等待玩家输入
            room.currentPlayerInputing = true;
            // 广播给玩家
            await conn.sendMsg("PlsDescribe",{});
            return true;
        }else{
            //AI玩家 且没出局 则开始描述
            room.currentPlayerInputing = true;
            conn.logger.log("GameManager/default "+ player.getFullName()+"描述请求中");
            const describeContent = await AiManager.getInstance().agentDescribeWord(player,room.round,i+1);
            conn.logger.log("GameManager/default "+ player.getFullName()+"描述："+describeContent);
            // 广播同步给所有player的历史消息
            const messageContent = player.getFullName() + "描述道:" + describeContent;
            // 跳过ai自己，因为自己的已经在agentDescribeWord中记录到自己的messages中了
            this.broadcastToRoom(room, player.number, messageContent, conn);
            room.currentPlayerInputing = false;
            room.currentPlayer++;
            return false;
        }
    }
    private async gamePlayerVote(room:RoomVO,currentPlayer:number,conn :BaseConnection<any>):Promise<boolean>{
        const i = currentPlayer-1;
        const player = room.players[i];
        if ( player.dead )
        {
            //玩家 已出局，跳过，直接完成本玩家输入
            room.currentPlayerInputing = false;
            room.currentPlayer++;
            return false;
        }
        if ( !player.isAi )
        {
            // 人类玩家，则等待玩家输入
            room.currentPlayerInputing = true;
            // 广播给玩家
            await conn.sendMsg("PlsVote",{
                options:room.players.filter((vo)=>!vo.dead).map(vo=>vo.number)
            });
            return true;
        }else{
            //AI玩家 且没出局 则开始投票
            conn.logger.log("GameManager/default 玩家" + (i + 1) + player.name + "投票请求中");
            const voteContent = await AiManager.getInstance().agentVote(player, room);
            conn.logger.log("GameManager/default 玩家" + (i + 1) + player.name + "投票：" + voteContent.voteToPlayer);
            // 计票
            RoomManager.getInstance().vote(room,voteContent.voteToPlayer);
            // 广播同步给所有player的历史消息
            const messageContent = player.getFullName() + "投票给玩家" + room.players[voteContent.voteToPlayer - 1].getFullName() + "，理由:\"" + voteContent.reason + "\"。";
            // 对玩家，发送msg；对AI，追加aimessage ； 包括AI自己；因为虽然自己的已经在agentVote中记录到自己的messages中了，但记录计票的文案有所不同
            this.broadcastToRoom(room, -1, messageContent, conn);
            room.currentPlayerInputing = false;
            room.currentPlayer++;
            return false;

        }

    }

}
