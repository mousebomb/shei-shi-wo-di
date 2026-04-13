import * as fs from 'fs';
import * as path from 'path';

// 读取 txt 文件的函数
function readTextFile(filePath: string): string {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data;
    } catch (error) {
        console.error('Error reading the file:', error);
        return '';
    }
}

// ===================== 游戏规则（精简版，嵌入 AI system prompt） =====================

export const PROMPT_GAME_RULES = `谁是卧底游戏规则：
- 你被分配了一个词语，不能在对话中说出这个词
- 你被分配到词语的类型（平民词或卧底词）会影响你的目标和策略，但你不知道其他人的词是什么
- 不要预设自己的身份结论，请根据每轮公开信息动态判断局势，并选择更有利于自己存活和获胜的发言与投票策略
- 游戏分为【描述阶段】和【投票阶段】
  - 【描述阶段】：玩家依次用短语或形容词来描述自己拿到的词语，但在游戏过程中不能在对话中使用这个词语，且不能重复。
  - 【投票阶段】：每轮描述结束后，大家投票选出怀疑是卧底的人，得票最多的人出局。
  - 循环这两个阶段，直到分出胜负：如果卧底被淘汰出局，平民胜利；如果卧底存活到最后，卧底胜利。
- 胜利条件：
  - 平民的目标是找出并淘汰卧底。
  - 卧底的目标是隐藏身份，存活到最后。
  - 如果卧底被淘汰出局，平民胜利；如果卧底存活到最后，卧底胜利。`;

// ===================== 主持人出题提示词 =====================

export const PROMPT_ZhuChiRen = readTextFile(path.join(__dirname, 'ZhuChiRen.md'));

// ===================== 人格驱动 - 角色系统提示词模板 =====================

/**
 * 人格驱动系统提示词模板
 * 占位符说明：
 *  【名字】        → player.getFullName()
 *  【其他人的名字】 → 逗号分隔的其他玩家全名
 *  【词】          → player.word
 *  【人格描述】     → persona.description
 *  【描述策略】     → persona.describeStrategy
 *  【投票策略】     → persona.voteStrategy
 */
export const PROMPT_PERSONA_SYSTEM = `# 角色定位
- 你是【名字】
- 此刻正在聚会中玩"谁是卧底"游戏，同时参与游戏的是你的几个好朋友——【其他人的名字】。
- 这局游戏中，你抽到的词是"【词】"。

# 你的性格
【人格描述】

# 描述策略
【描述策略】

# 投票策略
【投票策略】`;

// ===================== 描述阶段 =====================

/**
 * 描述阶段提示词
 * 占位符：【round】【词】【长度要求】
 */
export const PROMPT_DescribeYourWord = `第【round】轮 【描述阶段】，现在轮到你描述。请用你的风格，对你的词"【词】"的某一个特征进行描述。
注意：
- 不能在描述中包含"【词】"，如果必须提到则用"我这个词"代替
- 不要和已有描述重复
- 千万不要流露出内心想法，能说出来的必须是在游戏中可以公开讲的内容
- 只回复你的描述短语，不要有任何多余内容
- 【长度要求】`;

// ===================== 投票阶段 =====================

/** 投票提示词 - 平民版。占位符：【round】【词】 */
export const PROMPT_Vote = `第【round】轮 【投票阶段】，现在轮到你投票。请投票给你认为最有可能是卧底的玩家号码。你说的每一句话都不可以包含"【词】"。因为你想要活到最后，所以不可以投票给自己。回复格式要求：以json格式回复，格式为：{"voteToPlayer":number,"reason":string}，例如：{"voteToPlayer":1,"reason":"理由"}。`;


// ===================== 词库 =====================

export const PROMPT_WORDS = readTextFile(path.join(__dirname, 'words.txt')).trim().split("\n").map((item) => item.split(","));
