from flask import Flask, request, send_file
import tempfile
import os
import sys
sys.path.append('third_party/Matcha-TTS')
from cosyvoice.cli.cosyvoice import CosyVoice, CosyVoice2
from cosyvoice.utils.file_utils import load_wav
import torchaudio

app = Flask(__name__)

# 初始化CosyVoice2模型
cosyvoice = CosyVoice2('pretrained_models/CosyVoice2-0.5B', load_jit=False, load_trt=False, fp16=False)

@app.route('/synthesize', methods=['POST'])
def synthesize():
    # 获取请求中的文本
    text = request.form.get('text')
    if not text:
        return "请提供文本", 400

    # 加载提示语音
    prompt_speech_16k = load_wav('./asset/zero_shot_prompt.wav', 16000)

    # 进行语音合成
    for i, j in enumerate(cosyvoice.inference_zero_shot(text, '希望你以后能够做的比我还好呦。', prompt_speech_16k, stream=False)):
        # 将合成的语音保存到临时文件
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
            torchaudio.save(temp_file.name, j['tts_speech'], cosyvoice.sample_rate)
            temp_file_path = temp_file.name

    # 返回合成的语音文件
    return send_file(temp_file_path, as_attachment=True, download_name='synthesized.wav')

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000,debug=True)
