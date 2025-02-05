export interface MsgGameStarted {
    // 玩家分配的词
    word : string;
    players: {name :string, num : number}[];
}
