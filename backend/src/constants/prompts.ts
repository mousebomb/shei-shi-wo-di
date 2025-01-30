import * as fs from 'fs';
import * as path from 'path';

// 读取 txt 文件的函数
function readTextFile(filePath: string): string {
    try {
        // 同步读取文件内容
        const data = fs.readFileSync(filePath, 'utf8');
        return data;
    } catch (error) {
        console.error('Error reading the file:', error);
        return '';
    }
}


// 导出为常量
export const PROMPT_GAME_RULES = readTextFile(path.join(__dirname, 'GAME_RULE.md'));
export const PROMPT_ZhuChiRen = readTextFile(path.join(__dirname, 'ZhuChiRen.md'));
export const PROMPT_UnderCover = readTextFile(path.join(__dirname, 'WoDi.md'));
export const PROMPT_Commoner = readTextFile(path.join(__dirname, 'PingMin.md'));
export const PROMPT_DescribeYourWord =`第【round】轮 【描述阶段】，第【order】位发言者是你，请你现在对你分配到的词“【词】”用一个短语进行描述，避免说出"【词】"，如果万不得已必须要提到“【词】”则用“我的这个词”代替。注意：千万不要流露出内心想法，能说出来的必须是在这场游戏中可以公开讲的内容。回复格式要求：只要回复你的描述短语，不要有任何多余内容。短语不超过10个字，不要和已有描述重复。`;
