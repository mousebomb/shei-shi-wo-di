/**
 * 服务器的配置常量
 */

//开发环境
export const IS_DEV= process.env.NODE_ENV==='development';
console.debug ("IS_DEV: "+IS_DEV);
//
export enum ErrorCode {
    USER_NOT_FOUND = "USER_NOT_FOUND",
    TOKEN_EXPIRED = "TOKEN_EXPIRED",
    INVALID_TOKEN = "INVALID_TOKEN",
    DB_ERR = "DB_ERR",
    NOT_LOGIN = "NOT_LOGIN",
}

// export const LLM_MODEL =  'deepseek-r1-distill-qwen-7b';
// export const LLM_MODEL =  'qwen2.5-7b-instruct-1m';
export const LLM_MODEL =  'qwen2.5-14b-instruct';
// export const LLM_MODEL =  'qwen2.5-32b-instruct-mlx';
// export const LLM_MODEL =  'deepseek-r1-distill-qwen-32b';
// export const LLM_API = 'http://192.168.50.8:1234/api/v0/chat/completions';
export const LLM_API = 'http://192.168.50.3:1234/api/v0/chat/completions';
export const LLM_LOG_V = true;

export const AiPlayerNames =[
    "猴哥",
    "八戒",
    // "沙僧",
    // "唐僧",
    "吕布",
    "曹操",
    "关羽",
    "刘备",
]

export const CosyVoice_API = 'http://192.168.50.8:5000/synthesize';
