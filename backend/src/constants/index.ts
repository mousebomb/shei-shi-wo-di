import 'dotenv/config';

/**
 * 服务器的配置常量
 */

export const IS_DEV = process.env.NODE_ENV === 'development';
console.debug("IS_DEV: " + IS_DEV);

export enum ErrorCode {
    USER_NOT_FOUND = "USER_NOT_FOUND",
    TOKEN_EXPIRED = "TOKEN_EXPIRED",
    INVALID_TOKEN = "INVALID_TOKEN",
    DB_ERR = "DB_ERR",
    NOT_LOGIN = "NOT_LOGIN",
}

export const LLM_MODEL = process.env.LLM_MODEL || 'doubao-seed-1-6-flash-250828';
export const LLM_API = process.env.LLM_API || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
export const LLM_API_KEY = process.env.LLM_API_KEY || "";
export const LLM_LOG_V = process.env.LLM_LOG_V === 'true';

export const AiPlayerNames = (process.env.AI_PLAYER_NAMES || '猴哥,八戒,吕布,曹操,关羽,刘备').split(',');

export const CosyVoice_API = process.env.COSYVOICE_API || 'http://192.168.50.8:5000/synthesize';
