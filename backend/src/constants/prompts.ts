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
export const PROMPT_GAME_RULES = readTextFile(path.join(__dirname, 'GAME_RULE.txt'));
export const PROMPT_ZhuChiRen = readTextFile(path.join(__dirname, 'ZhuChiRen.md'));
export const PROMPT_WoDi = readTextFile(path.join(__dirname, 'WoDi.md'));
export const PROMPT_PingMin = readTextFile(path.join(__dirname, 'PingMin.md'));
