import {PROMPT_GAME_RULES, PROMPT_ZhuChiRen} from "../constants/prompts";
import axios from 'axios';

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

    createRobot() {

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
        return [];
    }

    llmRequest(messages: { role: Roles, content: string }[],):Promise<PredictionResponse> {
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

export enum Roles {
    system = 'system',
    user = 'user',
    assistant = 'assistant'
}

