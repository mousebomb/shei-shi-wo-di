// This is a demo code file
// Feel free to delete it

export interface MsgChat {
    content: string,
    time: Date,
    // 发送者id (0或空表示系统，1～n表示玩家)
    senderId: number,
    voice?: Uint8Array
}
