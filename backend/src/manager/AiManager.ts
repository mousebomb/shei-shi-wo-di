import {PROMPT_GAME_RULES, PROMPT_Commoner, PROMPT_UnderCover, PROMPT_ZhuChiRen} from "../constants/prompts";
import axios from 'axios';
import {RoomVO} from "../vo/RoomVO";
import {Identity} from "../vo/PlayerVO";
import {AiPlayerNames} from "../constants";

// 定义请求的 URL
const url = 'http://192.168.50.8:1234/api/v0/chat/completions';

// 定义请求的 headers
const headers = {
    'Content-Type': 'application/json',
};


export class AiManager {
    private static instance: AiManager;

    private constructor() {
    }

    public static getInstance(): AiManager {
        if (!AiManager.instance) {
            AiManager.instance = new AiManager();
        }
        return AiManager.instance;
    }

    // 开始游戏时，智能体的初始化
    async agentInit (room:RoomVO,currentPlayer : number){
        const player = room.players[currentPlayer-1];
        player.messages = [
            {role: Roles.system, content: PROMPT_GAME_RULES},
        ];
        //替换角色描述
        let content="";
        if ( player.identity == Identity.commoner)
        {
            content=PROMPT_Commoner;
        }else if (player.identity == Identity.undercover)
        {
            content=PROMPT_UnderCover;
        }
        content=content.replace('【名字】',player.name);
        content=content.replace('【词】',player.word);
        //其他人的名字
        let othersNames = "";
        for (let i = 0; i < room.players.length; i++) {
            if (i !== currentPlayer-1) {
                othersNames += room.players[i].name + ',';
            }
        }
        content=content.replace('【其他人的名字】',othersNames.substring(0, othersNames.length - 1));
        player.messages.push({role: Roles.system, content: content});

    }

    // 让玩家发言描述自己的词
    async agentDescribeWord(room:RoomVO,round : number,currentPlayer:number) {
        room.round = round;
        room.currentPlayer = currentPlayer;
        let player = room.players[currentPlayer];

        let messages = [
            {role: Roles.system, content: PROMPT_GAME_RULES},
            {role: Roles.system, content: PROMPT_ZhuChiRen},
        ]
    }


    // 生成词语，一个平民词语，一个卧底词语
    async createWord(): Promise<string[]> {
        let messages = [
            {role: Roles.system, content: PROMPT_GAME_RULES},
            {role: Roles.system, content: PROMPT_ZhuChiRen},
        ]
        const respData = await this.llmRequest(messages);
        if (respData) {
            console.log("AiManager/AiManager/createWord",respData);
            let content = respData.choices[0].message.content;
            // 剔除think部分，只要think之后的内容
            const thinkIndex = content.indexOf('</think>');
            if(thinkIndex !== -1) {
                content = respData.choices[0].message.content.substring(thinkIndex + '</think>'.length);
            }
            // 剔除\n
            content = content.replace(/\n/g, '');
            const words = content.split(',');
            return words;
        }
        throw new Error("AiManager/AiManager/createWord failed");
    }

    /**************** 调用大模型 ******************/
    //region 调用大模型

    /**
     * 调用大模型
     * @param messages 消息
     */
    llmRequest(messages: Message[],):Promise<PredictionResponse> {
        return new Promise((resolve, reject) => {

            // 定义请求的 body
            const data = {
                model: 'deepseek-r1-distill-qwen-7b',
                messages: messages,
                temperature: 0.7,
                max_tokens: -1,
                stream: false,
            };

            // 发起 POST 请求
            axios.post(url, data, {headers})
                .then(response => {
                    // 请求成功，打印响应数据
                    console.log('Response:', response.data as PredictionResponse);
                    resolve(response.data as PredictionResponse);
                })
                .catch(error => {
                    // 请求失败，打印错误信息
                    if (error.response) {
                        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                        console.log('Error response data:', error.response.data);
                        console.log('Error response status:', error.response.status);
                        console.log('Error response headers:', error.response.headers);
                        reject('Error response data:'+ error.response.data);
                    } else if (error.request) {
                        // 请求已发出，但没有收到响应
                        console.log('No response received:', error.request);
                        reject('No response received');
                    } else {
                        // 在设置请求时发生错误
                        console.log('Error setting up the request:', error.message);
                        reject('Error setting up the request:'+ error.message);
                    }
                });

        })
    }

    //endregion


}

export interface PredictionResponse{
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        index: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export interface Message {
    role: Roles;
    content: string;
}
export enum Roles {
    system = 'system',
    user = 'user',
    assistant = 'assistant'
}

