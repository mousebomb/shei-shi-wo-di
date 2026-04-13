/**
 * request.ts - Node.js 兼容版本
 * 原版本由 openapi-typescript-codegen 生成，已适配 Node.js/浏览器通用环境
 * 主要变更：使用 axios 替换浏览器原生 fetch / Headers / FormData / Blob API
 */
import axios from 'axios';
import type { AxiosResponse, CancelTokenSource } from 'axios';
import { ApiError } from './ApiError';
import type { ApiRequestOptions } from './ApiRequestOptions';
import type { ApiResult } from './ApiResult';
import { CancelablePromise } from './CancelablePromise';
import type { OnCancel } from './CancelablePromise';
import type { OpenAPIConfig } from './OpenAPI';

// ---- 通用工具函数 ----

export const isDefined = <T>(value: T | null | undefined): value is Exclude<T, null | undefined> => {
    return value !== undefined && value !== null;
};

export const isString = (value: any): value is string => {
    return typeof value === 'string';
};

export const isStringWithValue = (value: any): value is string => {
    return isString(value) && value !== '';
};

/**
 * 检测 Blob/File 类型，兼容 Node.js（Buffer、Uint8Array）和浏览器（Blob、File）
 */
export const isBlob = (value: any): boolean => {
    // Node.js Buffer / Uint8Array
    if (Buffer.isBuffer(value) || value instanceof Uint8Array) return true;
    // 浏览器原生 Blob / File
    if (typeof Blob !== 'undefined' && value instanceof Blob) return true;
    // duck-typing（兼容其他 Blob 实现）
    return (
        typeof value === 'object' &&
        typeof value.type === 'string' &&
        typeof value.arrayBuffer === 'function'
    );
};

/**
 * 检测 FormData，兼容浏览器原生和 form-data 库（有 getHeaders 方法）
 */
export const isFormData = (value: any): boolean => {
    if (typeof FormData !== 'undefined' && value instanceof FormData) return true;
    // form-data 包的特征方法
    return typeof value === 'object' && typeof value.getHeaders === 'function';
};

export const base64 = (str: string): string => {
    try {
        return btoa(str);
    } catch {
        return Buffer.from(str).toString('base64');
    }
};

export const getQueryString = (params: Record<string, any>): string => {
    const qs: string[] = [];

    const append = (key: string, value: any) => {
        qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    };

    const process = (key: string, value: any) => {
        if (isDefined(value)) {
            if (Array.isArray(value)) {
                value.forEach(v => process(key, v));
            } else if (typeof value === 'object') {
                Object.entries(value).forEach(([k, v]) => process(`${key}[${k}]`, v));
            } else {
                append(key, value);
            }
        }
    };

    Object.entries(params).forEach(([key, value]) => process(key, value));

    return qs.length > 0 ? `?${qs.join('&')}` : '';
};

const getUrl = (config: OpenAPIConfig, options: ApiRequestOptions): string => {
    const encoder = config.ENCODE_PATH || encodeURI;

    const path = options.url
        .replace('{api-version}', config.VERSION)
        .replace(/{(.*?)}/g, (substring: string, group: string) => {
            if (options.path?.hasOwnProperty(group)) {
                return encoder(String(options.path[group]));
            }
            return substring;
        });

    const url = `${config.BASE}${path}`;
    return options.query ? `${url}${getQueryString(options.query)}` : url;
};

export const getFormData = (options: ApiRequestOptions): FormData | undefined => {
    if (options.formData) {
        const formData = new FormData();

        const process = (key: string, value: any) => {
            if (isString(value) || isBlob(value)) {
                formData.append(key, value);
            } else {
                formData.append(key, JSON.stringify(value));
            }
        };

        Object.entries(options.formData)
            .filter(([_, value]) => isDefined(value))
            .forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v => process(key, v));
                } else {
                    process(key, value);
                }
            });

        return formData;
    }
    return undefined;
};

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;

export const resolve = async <T>(options: ApiRequestOptions, resolver?: T | Resolver<T>): Promise<T | undefined> => {
    if (typeof resolver === 'function') {
        return (resolver as Resolver<T>)(options);
    }
    return resolver;
};

/**
 * 构建请求头，返回普通对象（兼容 axios，不依赖浏览器 Headers 类）
 */
export const getHeaders = async (config: OpenAPIConfig, options: ApiRequestOptions): Promise<Record<string, string>> => {
    const [token, username, password, additionalHeaders] = await Promise.all([
        resolve(options, config.TOKEN),
        resolve(options, config.USERNAME),
        resolve(options, config.PASSWORD),
        resolve(options, config.HEADERS),
    ]);

    const headers = Object.entries({
        Accept: 'application/json',
        ...additionalHeaders,
        ...options.headers,
    })
        .filter(([_, value]) => isDefined(value))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: String(value) }), {} as Record<string, string>);

    if (isStringWithValue(token)) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (isStringWithValue(username) && isStringWithValue(password)) {
        const credentials = base64(`${username}:${password}`);
        headers['Authorization'] = `Basic ${credentials}`;
    }

    if (options.body) {
        if (options.mediaType) {
            headers['Content-Type'] = options.mediaType;
        } else if (isBlob(options.body)) {
            headers['Content-Type'] = (options.body as any).type || 'application/octet-stream';
        } else if (isString(options.body)) {
            headers['Content-Type'] = 'text/plain';
        } else if (!isFormData(options.body)) {
            headers['Content-Type'] = 'application/json';
        }
    }

    return headers;
};

export const getRequestBody = (options: ApiRequestOptions): any => {
    if (options.body !== undefined) {
        if (options.mediaType?.includes('/json')) {
            return JSON.stringify(options.body);
        } else if (isString(options.body) || isBlob(options.body) || isFormData(options.body)) {
            return options.body;
        } else {
            return JSON.stringify(options.body);
        }
    }
    return undefined;
};

const isBinaryAccept = (accept?: string): boolean => {
    if (!accept) {
        return false;
    }
    const value = accept.toLowerCase();
    return (
        value.includes('audio/') ||
        value.includes('video/') ||
        value.includes('image/') ||
        value.includes('application/octet-stream')
    );
};

const getAxiosResponseType = (headers: Record<string, string>): 'arraybuffer' | 'json' => {
    const accept = headers['Accept'] || headers['accept'];
    return isBinaryAccept(accept) ? 'arraybuffer' : 'json';
};

/**
 * 发送 HTTP 请求（axios 实现，兼容 Node.js）
 * validateStatus 设为始终返回 true，由 catchErrorCodes 统一处理错误状态码
 */
export const sendRequest = async (
    config: OpenAPIConfig,
    options: ApiRequestOptions,
    url: string,
    body: any,
    formData: any | undefined,
    headers: Record<string, string>,
    onCancel: OnCancel
): Promise<AxiosResponse> => {
    const source: CancelTokenSource = axios.CancelToken.source();

    onCancel(() => source.cancel('Request cancelled'));

    return await axios.request({
        url,
        method: options.method,
        headers,
        data: body ?? formData,
        responseType: getAxiosResponseType(headers),
        cancelToken: source.token,
        withCredentials: config.WITH_CREDENTIALS,
        // 不让 axios 自动抛出 HTTP 错误，交由 catchErrorCodes 处理
        validateStatus: () => true,
    });
};

export const getResponseHeader = (response: AxiosResponse, responseHeader?: string): string | undefined => {
    if (responseHeader) {
        // axios headers 的 key 均为小写
        const content = response.headers[responseHeader.toLowerCase()];
        if (isString(content)) {
            return content;
        }
    }
    return undefined;
};

export const getResponseBody = (response: AxiosResponse): any => {
    if (response.status !== 204) {
        const data = response.data;
        const rawContentType = response.headers['content-type'];
        const contentType = (Array.isArray(rawContentType) ? rawContentType[0] : rawContentType || '').toLowerCase();

        if (Buffer.isBuffer(data)) {
            if (contentType.startsWith('application/json') || contentType.startsWith('application/problem+json')) {
                try {
                    return JSON.parse(data.toString('utf-8'));
                } catch {
                    return data.toString('utf-8');
                }
            }
            if (contentType.startsWith('text/')) {
                return data.toString('utf-8');
            }
            return new Uint8Array(data);
        }

        if (data instanceof ArrayBuffer) {
            return new Uint8Array(data);
        }

        return data;
    }
    return undefined;
};

export const catchErrorCodes = (options: ApiRequestOptions, result: ApiResult): void => {
    const errors: Record<number, string> = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        ...options.errors,
    };

    const error = errors[result.status];
    if (error) {
        throw new ApiError(options, result, error);
    }

    if (!result.ok) {
        const errorStatus = result.status ?? 'unknown';
        const errorStatusText = result.statusText ?? 'unknown';
        const errorBody = (() => {
            try {
                return JSON.stringify(result.body, null, 2);
            } catch {
                return undefined;
            }
        })();

        throw new ApiError(options, result,
            `Generic Error: status: ${errorStatus}; status text: ${errorStatusText}; body: ${errorBody}`
        );
    }
};

/**
 * 通用请求方法（Node.js 兼容版，基于 axios）
 * @param config OpenAPI 配置对象
 * @param options 请求选项
 * @returns CancelablePromise<T>
 * @throws ApiError
 */
export const request = <T>(config: OpenAPIConfig, options: ApiRequestOptions): CancelablePromise<T> => {
    return new CancelablePromise(async (resolve, reject, onCancel) => {
        try {
            const url = getUrl(config, options);
            const formData = getFormData(options);
            const body = getRequestBody(options);
            const headers = await getHeaders(config, options);

            if (!onCancel.isCancelled) {
                const response = await sendRequest(config, options, url, body, formData, headers, onCancel);
                const responseBody = getResponseBody(response);
                const responseHeader = getResponseHeader(response, options.responseHeader);

                const result: ApiResult = {
                    url,
                    ok: response.status >= 200 && response.status < 300,
                    status: response.status,
                    statusText: response.statusText,
                    body: responseHeader ?? responseBody,
                };

                catchErrorCodes(options, result);
                resolve(result.body);
            }
        } catch (error) {
            reject(error);
        }
    });
};
