import {RoomVO} from "../vo/RoomVO";
import PlayerVO, {Identity} from "../vo/PlayerVO";
import {AiManager} from "./AiManager";
import {AiPlayerNames} from "../constants";

export class RoomManager {
    private static instance: RoomManager;

    private constructor() {
    }

    public static getInstance(): RoomManager {
        if (!RoomManager.instance) {
            RoomManager.instance = new RoomManager();
        }
        return RoomManager.instance;
    }

    /// 开始游戏，创建房间，拉入5个AI玩家，记录信息
    createRoom(userId : number,words:string[]): RoomVO {

        const room = new RoomVO();
        //为room创建玩家
        room.roomId = userId;
        // 初始值为0 表示未开始
        room.round = 0;
        room.players = [];
        // 初始值为0 表示未开始
        room.currentPlayer = 0;

        //创建5个AI玩家和1个人类玩家，先全部设置为统一样子：平民、AI、未出局
        for (let i = 0; i < 6; i++) {
            const player = new PlayerVO();
            player.identity = Identity.commoner;
            player.name = AiPlayerNames[i];
            player.number = i + 1;
            player.isAi = true;
            player.dead = false;
            player.word = words[0];
            // player.desc = [];
            // player.speak = [];
            room.players.push(player);
        }
        // 随机决定人类玩家的编号
        const humanNumber = Math.floor(Math.random() * 6) + 1;
        //1个人类玩家的字段覆盖
        room.players[humanNumber - 1].isAi = false;
        room.players[humanNumber - 1].name = "桂花糕";

        // 随机决定卧底玩家的编号
        const undercoverNumber = Math.floor(Math.random() * 6) + 1;
        // 1个卧底玩家的字段覆盖
        room.players[undercoverNumber - 1].identity = Identity.undercover;
        room.players[undercoverNumber - 1].word = words[1];

        // 记录人类玩家和卧底玩家的编号
        room.undercoverPlayer = undercoverNumber;
        room.humanPlayer = humanNumber;

        return room;

    }

    nextRound (room:RoomVO)
    {
        room.round++;
        room.currentPlayer = 1;

    }

    beginVote(room:RoomVO)
    {
        for (let i = 0; i < room.players.length; i++) {
            room.players[i].voteCount = 0;
        }
    }
    //计票
    vote(room:RoomVO,playerNumber:number)
    {
        room.players[playerNumber-1].voteCount++;
    }
    //计票结果，返回计票最多的玩家编号
    voteResult(room:RoomVO):number
    {
        let max = 0;
        let maxPlayer = 0;
        for (let i = 0; i < room.players.length; i++) {
            if (room.players[i].voteCount > max) {
                max = room.players[i].voteCount;
                maxPlayer = i;
            }
        }
        //把玩家标记为出局
        room.players[maxPlayer].dead = true;
        //返回计票最多的玩家编号
        return maxPlayer+1;
    }

    // 盘点当前人数，看游戏是否继续
    checkGameOver(room:RoomVO):boolean
    {
        let aliveCount = 0;
        for (let i = 0; i < room.players.length; i++) {
            if (!room.players[i].dead) {
                aliveCount++;
            }
        }
        // 如果卧底人数为0，则游戏结束； 如果平民人数小于或等于存活的卧底人数，则游戏结束
        if (room.players[room.undercoverPlayer-1].dead) {
            return true;
        }
        return aliveCount <= 2;
    }

    // 盘点当前存活卧底数量
    calcUndercoverAlive(room:RoomVO):number
    {
        let aliveCount = 0;
        for (let i = 0; i < room.players.length; i++) {
            if (!room.players[i].dead && room.players[i].identity == Identity.undercover) {
                aliveCount++;
            }
        }
        return aliveCount;
    }

    // 盘点当前存活平民数量
    calcCommonerAlive(room:RoomVO):number
    {
        let aliveCount = 0;
        for (let i = 0; i < room.players.length; i++) {
            if (!room.players[i].dead && room.players[i].identity == Identity.commoner) {
                aliveCount++;
            }
        }
        return aliveCount;
    }


    // 广播消息
    broadcast(room : RoomVO,skipPlayerNumber:number, aiCb : (ai:PlayerVO)=>void, humanCb : (human:PlayerVO)=>void )
    {
        for (let i = 0; i < room.players.length; i++) {
            // 有时候要求跳过AI，传入要跳过的玩家序号
            if (room.players[i].number == skipPlayerNumber) {
                continue;
            }
            if (!room.players[i].dead) {
                if (room.players[i].isAi) {
                    aiCb(room.players[i]);
                }else {
                    humanCb(room.players[i]);
                }
            }
        }
    }
}
