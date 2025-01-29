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
}
