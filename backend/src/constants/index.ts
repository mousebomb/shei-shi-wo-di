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

// 优先使用 OpenAI 兼容环境变量；若使用旧配置，则自动从 LLM_API 推导 baseURL
const LEGACY_LLM_API = process.env.LLM_API;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || process.env.LLM_BASE_URL;

export const LLM_MODEL = process.env.LLM_MODEL || process.env.OPENAI_MODEL || 'MiniMax-M2.7';
export const LLM_BASE_URL = OPENAI_BASE_URL
    || (LEGACY_LLM_API ? LEGACY_LLM_API.replace(/\/chat\/completions\/?$/, '') : 'https://api.minimaxi.com/v1');
export const LLM_API_KEY = process.env.OPENAI_API_KEY || process.env.LLM_API_KEY || "";
export const LLM_LOG_V = process.env.LLM_LOG_V === 'true';

const DEFAULT_LLM_RETRY_DELAYS_MS = [1000, 3000, 10000];

function parseRetryDelays(raw: string | undefined): number[] {
    if (!raw) {
        return DEFAULT_LLM_RETRY_DELAYS_MS;
    }
    const delays = raw
        .split(',')
        .map(v => Number(v.trim()))
        .filter(v => Number.isFinite(v) && v >= 0);
    return delays.length > 0 ? delays : DEFAULT_LLM_RETRY_DELAYS_MS;
}

// LLM 过载重试延迟（毫秒），例如："1000,3000,10000"
export const LLM_RETRY_DELAYS_MS = parseRetryDelays(process.env.LLM_RETRY_DELAYS_MS);


// Voicebox TTS 配置
export const VOICEBOX_API = process.env.VOICEBOX_API || 'http://127.0.0.1:17493';
/** 主持人/系统播报用的默认声音 profile_name（兼容旧的 VOICEBOX_HOST_PROFILE_ID） */
export const VOICEBOX_HOST_PROFILE_NAME =
    process.env.VOICEBOX_HOST_PROFILE_NAME || process.env.VOICEBOX_HOST_PROFILE_ID || 'Rhett-2025';

/** AI 人格默认声音 profile_name（未单独配置时复用主持人音色） */
export const VOICEBOX_AI_PROFILE_NAME = process.env.VOICEBOX_AI_PROFILE_NAME || VOICEBOX_HOST_PROFILE_NAME;
