import {RoomVO} from "../vo/RoomVO";
import PlayerVO, {Identity} from "../vo/PlayerVO";
import {AiManager} from "./AiManager";

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
    createRoom(userId : number): RoomVO {

        const room = new RoomVO();
        //为room创建玩家
        room.roomId = userId;
        room.round =1;
        room.players = [];
        //创建5个AI玩家和1个人类玩家
        for (let i = 0; i < 6; i++) {
            const player = new PlayerVO();
            player.identity = Identity.commoner;
            player.number = i + 1;
            player.isAi = true;
            player.dead = false;
            player.word = "";
            player.desc = [];
            player.speak = [];
            room.players.push(player);
        }
        // 随机决定人类玩家的编号
        const humanNumber = Math.floor(Math.random() * 6) + 1;
        //1个人类玩家的字段覆盖
        room.players[humanNumber - 1].isAi = false;
        // 调用大模型，获取词语
        AiManager.getInstance()

        // 为6个玩家分配身份和词




        return room;

    }
}
