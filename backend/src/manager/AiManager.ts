import {
    DESCRIBE_ANGLE,
    PROMPT_Commoner,
    PROMPT_DescribeYourWord,
    PROMPT_GAME_RULES,
    PROMPT_UnderCover, PROMPT_Vote, PROMPT_Vote_UnderCover,
    PROMPT_ZhuChiRen
} from "../constants/prompts";
import axios from 'axios';
import {RoomVO} from "../vo/RoomVO";
import PlayerVO, {Identity} from "../vo/PlayerVO";
import {LLM_API, LLM_LOG_V, LLM_MODEL} from "../constants";

// 定义请求的 URL
const url = LLM_API;

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
        content=content.replace('【名字】',player.getFullName());
        content=content.replace(/【词】/g,player.word);
        //其他人的名字
        let othersNames = "";
        for (let i = 0; i < room.players.length; i++) {
            if (i !== currentPlayer-1) {
                othersNames += room.players[i].getFullName() + ',';
            }
        }
        content=content.replace('【其他人的名字】',othersNames.substring(0, othersNames.length - 1));
        player.messages.push({role: Roles.system, content: content+'\n\n'+PROMPT_GAME_RULES});


    }

    //region 描述阶段

    // 让玩家发言描述自己的词
    async agentDescribeWord(player: PlayerVO,round:number,order :number) {
        // 断言 player.messages.length>0
        if (player.messages.length == 0) {
            throw new Error("AiManager/agentDescribeWord player.messages.length == 0");
        }
        // 构造消息
        let content = PROMPT_DescribeYourWord.replace('【round】',round.toString());
        content=content.replace('【order】',order.toString());
        content=content.replace(/【词】/g,player.word);
        // 随机选择一个角度
        const angle = DESCRIBE_ANGLE[Math.floor(Math.random()*DESCRIBE_ANGLE.length)];
        content=content.replace('【角度】',angle);
        player.messages.push ({role: Roles.user, content: content});
        let respContent = await this.llmRequest(player.messages);
        // AI 总是时不时犯规，所以要做一次处理，如果暴露了自己的词，强行替换
        if (respContent.content.indexOf(player.word) !== -1) {
            // 全局替换
            respContent.content = respContent.content.replace(new RegExp(player.word, 'g'),'我的这个词');
        }
        // AI自己的发言记录到自己的messages中
        player.messages.push({role: Roles.assistant, content:respContent.content});
        return respContent.content;
    }

    //维护messages，追加一条ai发言
    appendAiDescribeMessage(round:number, order:number, player: PlayerVO, content:string, toPlayer:PlayerVO){
        toPlayer.messages.push({role: Roles.system, content:
                "第"+round+"轮 【描述阶段】，玩家"+player.getFullName()+"描述道：\""+content +"\"。"
        });
    }
    //endregion

    //region 投票阶段
    // 让玩家投票
    async agentVote(player: PlayerVO, room:RoomVO) {
        // 构造消息
        let content = player.identity== Identity.undercover?PROMPT_Vote_UnderCover:PROMPT_Vote;
        content=content.replace('【round】',room.round.toString());
        content = content.replace('【词】',player.word);
        // player.messages.push({role: Roles.user, content: content});
        // 改成 只在请求时加上提示message，但是不记录到历史
        const messages = player.messages.concat([{role: Roles.user, content: content}]);
        let respContent = await this.llmRequest(messages);
        // AI 总是时不时犯规，所以要做一次处理，如果暴露了自己的词，强行替换
        if (respContent.content.indexOf(player.word) !== -1) {
            // 全局替换
            respContent.content = respContent.content.replace(new RegExp(player.word, 'g'),'我的这个词');
        }
        // 返回的内容可能是```json {jsonContent}``` 也可能是{jsonContent}，需要去掉可能存在的```json ```
        respContent.content = respContent.content.replace(/```json/g, '');
        respContent.content = respContent.content.replace(/```/g, '');
        // // AI自己的发言记录到自己的messages中
        // player.messages.push({role: Roles.assistant, content:respContent.content});
        //json解析 ; AI有时候不稳定，返回的格式不是json，需要try catch，如果返回不合法，就重新生成
        try {
            let jsonContent = JSON.parse(respContent.content);
            return jsonContent as {voteToPlayer:number,reason: string};
        }catch (e) {
            console.log("AiManager/AiManager/agentVote json parse failed, retry",e);
            // 重新生成
            // 先得回滚两条消息 (上面改成了不push到自己的messages中，所以这里不需要回滚了)
            // player.messages.length = player.messages.length - 2;
            return await this.agentVote(player, room);
        }
    }
    //维护messages，追加一条ai投票
    appendAiVoteMessage(round:number,player: PlayerVO,content:{voteToPlayer:number,reason: string},toPlayer:PlayerVO){
        toPlayer.messages.push({role: Roles.system, content:
                "第"+round+"轮 【投票阶段】，玩家"+player.getFullName()+"投给玩家"+content.voteToPlayer+"，理由:\""+content.reason +"\"。"
        });
    }
    //endregion
    //region 通用写入信息
    appendAiMessage(toPlayer: PlayerVO,content : string) {
        // 发生的历史记录为user口吻的描述，所以要判断最后一条消息是否是user，如果不是，就追加一条user的，后续就追加到content里
        const lastMessage = toPlayer.messages[toPlayer.messages.length-1];
        if ( lastMessage.role !== Roles.user)
        {
            toPlayer.messages.push({role: Roles.user, content});
        }else{
            this.appendAiMessagePart(toPlayer,content);
        }
    }
    appendAiMessagePart(toPlayer: PlayerVO,content : string) {
        const lastMessage = toPlayer.messages[toPlayer.messages.length-1];
        lastMessage.content += "\n"+content;
    }

    //endregion

    /**************** 生成词语 ******************/
    //region 生成词语

    // 生成词语，一个平民词语，一个卧底词语
    async createWord(): Promise<string[]> {
        let messages = [
            {role: Roles.system, content: PROMPT_ZhuChiRen},
            // {role: Roles.system, content: PROMPT_GAME_RULES},
        ]
        const resp = await this.llmRequest(messages);
        if (resp.content) {
            const words = resp.content.split(',');
            return words;
        }
        throw new Error("AiManager/AiManager/createWord failed");
    }
    //endregion


    /**************** 调用大模型 ******************/
    //region 调用大模型

    /**
     * 调用大模型
     * @param messages 消息
     */
    llmRequest(messages: Message[],):Promise<{raw:string,content:string}> {
        return new Promise((resolve, reject) => {

            // 定义请求的 body
            const data = {
                model: LLM_MODEL,
                messages: messages,
                temperature: 0.7,
                max_tokens: -1,
                stream: false,
            };
            if(LLM_LOG_V) {
                console.log("AiManager/AiManager/llmRequest", messages);
            }

            // 发起 POST 请求
            axios.post(url, data, {headers})
                .then(response => {
                    // 请求成功，打印响应数据
                    // console.log('Response:', response.data as PredictionResponse);
                    const respData = response.data as PredictionResponse;
                    if (respData) {
                        const raw = respData.choices[0].message.content;
                        let content = raw;
                        if ( content.length==0 )
                        {
                            // 大模型损坏
                            reject('大模型服务损坏，返回空字符串');
                        }
                        if(LLM_LOG_V) {
                            console.log("AiManager/AiManager/llmRequest->Resp Raw:",content);
                        }
                        // 剔除think部分，只要think之后的内容
                        const thinkIndex = content.lastIndexOf('</think>');
                        if(thinkIndex !== -1) {
                            content = respData.choices[0].message.content.substring(thinkIndex + '</think>'.length);
                        }
                        // 剔除\n
                        content = content.replace(/\n/g, '');
                        // console.log("AiManager/AiManager/llmRequest->Resp:",content                        );
                        resolve({raw,content});
                    }

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

