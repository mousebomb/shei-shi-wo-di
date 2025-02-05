// 定义请求的 URL
import {CosyVoice_API, LLM_API} from "../constants";
import axios from "axios";
import FormData from 'form-data';

const url = CosyVoice_API;


export default class VoiceManager {
    constructor() {
    }

    private static instance: VoiceManager;

    public static getInstance(): VoiceManager {
        if (!VoiceManager.instance) {
            VoiceManager.instance = new VoiceManager();
        }
        return VoiceManager.instance;
    }


    async synthesize(text: string): Promise<Uint8Array> {
        try {
            // 用axios请求cosyvoice 获得音频二进制数据
            // 创建FormData对象
            const formData = new FormData();
            formData.append('text', text);

            // 发送POST请求到Python服务器
            const response = await axios.post(CosyVoice_API, formData, {responseType: 'arraybuffer'});
            if (response.status === 200) {
                const audioBuffer = response.data;
                const uint8Array = new Uint8Array(audioBuffer);

                return uint8Array;
            } else {
                throw new Error(`音频合成失败: 服务器返回状态码 ${response.status}`);
            }
        } catch (error) {
            console.error('音频合成请求失败:', error);
            throw error;
        }
    }

}
