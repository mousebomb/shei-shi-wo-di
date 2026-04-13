import { OpenAPI } from '../voicebox/core/OpenAPI';
import { DefaultService } from '../voicebox/services/DefaultService';
import { VOICEBOX_API, VOICEBOX_HOST_PROFILE_ID } from '../constants';

export default class VoiceManager {
    private static instance: VoiceManager;
    private initialized = false;

    private constructor() {}

    public static getInstance(): VoiceManager {
        if (!VoiceManager.instance) {
            VoiceManager.instance = new VoiceManager();
        }
        return VoiceManager.instance;
    }

    /** 初始化 voicebox SDK 的 base URL（只执行一次） */
    private init() {
        if (this.initialized) return;
        OpenAPI.BASE = VOICEBOX_API;
        this.initialized = true;
    }

    /**
     * 合成语音，返回音频二进制数据
     * @param text 需要合成的文本
     * @param profileId 声音 profile_id（留空时使用主持人默认音色）
     */
    async synthesize(text: string, profileId?: string): Promise<Uint8Array> {
        this.init();
        try {
            const effectiveProfileId = profileId || VOICEBOX_HOST_PROFILE_ID;
            // 未配置 profile_id 时跳过合成，避免接口报错
            if (!effectiveProfileId) {
                return null;
            }

            // 调用 voicebox 生成语音，固定参数：中文、1.7B 模型、qwen 引擎
            const resp = await DefaultService.streamSpeechGenerateStreamPost({
                profile_id: effectiveProfileId,
                text,
                language: 'zh',
                model_size: '1.7B',
                engine: 'qwen',
            });

            // Node.js 下 SDK 返回的是 Uint8Array/Buffer/ArrayBuffer，而不是浏览器 ReadableStream
            const audioData = this.normalizeAudioData(resp);
            if (!audioData) {
                // TODO: 后续可增加监控上报，记录异常响应格式
                throw new Error('语音流响应格式不支持，无法转换为 Uint8Array');
            }
            return audioData;

            // 如果接口设计是先返回 generation id 再拉取音频，则需要下面的步骤

            // // 通过 generation id 拉取音频二进制数据
            // const audioResp = await axios.get(
            //     `${VOICEBOX_API}/audio/${resp.id}`,
            //     { responseType: 'arraybuffer' }
            // );
            // return new Uint8Array(audioResp.data);
        } catch (error) {
            console.error('VoiceManager: 语音合成失败', error);
            return null;
        }
    }

    /**
     * 将不同二进制响应格式统一转成 Uint8Array
     */
    private normalizeAudioData(data: any): Uint8Array | null {
        if (!data) {
            return null;
        }

        if (data instanceof Uint8Array) {
            return data;
        }

        if (Buffer.isBuffer(data)) {
            return new Uint8Array(data);
        }

        if (data instanceof ArrayBuffer) {
            return new Uint8Array(data);
        }

        // 兼容 DataView / TypedArray 等 ArrayBufferView
        if (ArrayBuffer.isView(data)) {
            return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        }

        // 兼容某些序列化后的 Buffer 结构：{ type: 'Buffer', data: number[] }
        if (typeof data === 'object' && data.type === 'Buffer' && Array.isArray(data.data)) {
            return Uint8Array.from(data.data);
        }

        return null;
    }

}
