import PlayerVO from "./PlayerVO";

export class RoomVO{
    // 房间号 一个user一个房间号，因此userId直接映射到房间号
    roomId:number;
    // 房间承载了一场"谁是卧底"游戏的信息
    // 5个智能体玩家
    // 1个人类玩家
    // 游戏的当前玩家
    players:PlayerVO[];
    // 人类玩家的序号 (1开始)
    humanPlayer:number;
    // 卧底玩家的序号 (1开始)
    undercoverPlayer:number;

    //  平民词语、卧底词语
    words:string[];
    // 游戏的当前轮次 (1开始)
    round:number;
    // 游戏的当前轮次内轮到的玩家序号 (1开始)
    currentPlayer:number;


}
