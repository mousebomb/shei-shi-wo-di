import { OpenAPI } from '../voicebox/core/OpenAPI';
import { DefaultService } from '../voicebox/services/DefaultService';
import {VOICEBOX_API, VOICEBOX_ENGINE, VOICEBOX_HOST_PROFILE_NAME, VOICEBOX_MODEL_SIZE} from '../constants';
import { getAiRoleProfileNames } from '../constants/aiRoles';

export default class VoiceManager {
    private static instance: VoiceManager;
    private initialized = false;
    private readonly profileNameToId = new Map<string, string>();
    private warmupPromise?: Promise<void>;

    private constructor() {}

    public static getInstance(): VoiceManager {
        if (!VoiceManager.instance) {
            VoiceManager.instance = new VoiceManager();
        }
        return VoiceManager.instance;
    }

    /** 初始化 voicebox SDK 的 base URL（只执行一次） */
    private initSdk() {
        if (this.initialized) return;
        OpenAPI.BASE = VOICEBOX_API;
        this.initialized = true;
    }

    /**
     * 启动时预加载 profile_name -> profile_id 映射
     */
    async warmupProfileMap(): Promise<void> {
        this.initSdk();
        if (!this.warmupPromise) {
            this.warmupPromise = this.loadProfileMap();
        }
        await this.warmupPromise;
    }

    private async loadProfileMap(): Promise<void> {
        const profiles = await DefaultService.listProfilesProfilesGet();
        this.profileNameToId.clear();
        for (const profile of profiles) {
            if (!this.profileNameToId.has(profile.name)) {
                this.profileNameToId.set(profile.name, profile.id);
            } else {
                // 同名 profile 只保留第一条，避免运行时不确定性
                console.warn(`VoiceManager: 发现重复 profile_name，已忽略后续项: ${profile.name}`);
            }
        }

        // 按配置名校验并尝试补齐（满足“按 profile name 自动找到 profileId”）
        const configuredNames = new Set([VOICEBOX_HOST_PROFILE_NAME, ...getAiRoleProfileNames()].filter(Boolean));
        for (const profileName of configuredNames) {
            if (this.profileNameToId.has(profileName)) {
                continue;
            }
            try {
                // 名称不存在时尝试自动创建 profile，并立即登记其 id
                const created = await DefaultService.createProfileProfilesPost({
                    name: profileName,
                    description: '由游戏服务启动时自动创建',
                    language: 'zh',
                });
                this.profileNameToId.set(created.name, created.id);
                console.log(`VoiceManager: 已自动创建 profile: ${created.name} -> ${created.id}`);
            } catch (error) {
                console.error(`VoiceManager: profile_name 不存在且自动创建失败: ${profileName}`, error);
            }
        }

        console.log(`VoiceManager: profile 映射加载完成，共 ${this.profileNameToId.size} 条`);
    }

    private async resolveProfileIdByName(profileName: string): Promise<string | null> {
        await this.warmupProfileMap();
        return this.profileNameToId.get(profileName) || null;
    }

    /**
     * 合成语音，返回音频二进制数据
     * @param text 需要合成的文本
     * @param profileName 声音 profile_name（留空时使用主持人默认音色）
     */
    async synthesize(text: string, profileName?: string): Promise<Uint8Array> {
        this.initSdk();
        try {
            const effectiveProfileName = profileName || VOICEBOX_HOST_PROFILE_NAME;
            if (!effectiveProfileName) {
                return null;
            }

            const effectiveProfileId = await this.resolveProfileIdByName(effectiveProfileName);
            // profile_name 无法解析到 profile_id 时跳过合成，避免接口报错
            if (!effectiveProfileId) {
                console.error(`VoiceManager: 未找到 profile_name 对应的 profile_id: ${effectiveProfileName}`);
                return null;
            }

            // 调用 voicebox 生成语音，固定参数：中文、1.7B 模型、qwen 引擎
            const resp = await DefaultService.streamSpeechGenerateStreamPost({
                profile_id: effectiveProfileId,
                text,
                language: 'zh',
                model_size: VOICEBOX_MODEL_SIZE,
                engine: VOICEBOX_ENGINE,
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
