import {Message, Roles} from "../manager/AiManager";
import {Persona} from "../constants/personas";

export default class PlayerVO{
    // 身份 0 平民 1 卧底
    identity: Identity = Identity.commoner;
    // 玩家名字
    name: string = "";
    // 房间内的编号 （1～6）
    number: number = 0;
    // 词语
    word: string = "";
    // AI 人格（仅AI玩家有值）
    persona?: Persona;
    // AI 角色库 ID（仅AI玩家有值）
    roleId?: string;
    // AI 独立音色 profile_name（仅AI玩家有值）
    voiceProfileName?: string;
    // 当前是否是AI
    isAi: boolean = false;

    // 当前是否已被投出局
    dead: boolean = false;
    // 本轮内被投票卧底的计票
    voteCount: number = 0;

    // 之前的聊天记录
    messages: Message[] = [];

    // 全名
    getFullName(): string {
        return "玩家"+this.number + "(" + this.name+")";
    }

}
export enum Identity{
    commoner,
    undercover
}
