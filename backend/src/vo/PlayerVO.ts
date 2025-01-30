import {Message, Roles} from "../manager/AiManager";

export default class PlayerVO{
    // 身份 0 平民 1 卧底
    identity: Identity = Identity.commoner;
    // 玩家名字
    name: string = "";
    // 房间内的编号 （1～6）
    number: number = 0;
    // 词语
    word: string = "";
    // // 各轮描述
    // desc: string[] = [];
    // // 投票前按顺序进行的发言
    // speak: string[] = [];
    // 当前是否是AI
    isAi: boolean = false;

    // 当前是否已被投出局
    dead: boolean = false;

    // 之前的聊天记录
    messages: Message[] = [];

    // 全名
    getFullName(): string {
        return "玩家"+this.number + "-" + this.name;
    }

}
export enum Identity{
    commoner,
    undercover
}
