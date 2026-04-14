import { VOICEBOX_AI_PROFILE_NAME } from './index';

/**
 * AI 角色定义：每个角色绑定固定姓名、人格和音色
 */
export interface AiRole {
    /** 角色 ID */
    id: string;
    /** 角色姓名（展示名） */
    name: string;
    /** 绑定的人格 ID（来自 personas.ts） */
    personaId: string;
    /** 角色使用的 voicebox profile_name */
    voiceProfileName: string;
}

/**
 * AI 角色库
 *
 * 说明：当前统一使用 VOICEBOX_AI_PROFILE_NAME，后续可按角色拆分为不同 profile_name。
 */
export const AI_ROLES: AiRole[] = [
    { id: 'monkey_king', name: '猴哥', personaId: 'lively_monkey', voiceProfileName: "猴哥" },
    { id: 'zhu_bajie', name: '八戒', personaId: 'chill_player', voiceProfileName: "八戒" },
    { id: 'lv_bu', name: '吕布', personaId: 'intuition_player', voiceProfileName: "吕布" },
    { id: 'cao_cao', name: '曹操', personaId: 'steady_veteran', voiceProfileName: "曹操" },
    { id: 'guan_yu', name: '关羽', personaId: 'observer', voiceProfileName: "关羽" },
    { id: 'liu_bei', name: '刘备', personaId: 'humor_master', voiceProfileName: "刘备" },
];

/**
 * 从角色库中随机选择不重复角色
 * @param count 需要的角色数量
 */
export function selectRandomRoles(count: number): AiRole[] {
    const shuffled = [...AI_ROLES].sort(() => Math.random() - 0.5);
    if (count <= shuffled.length) {
        return shuffled.slice(0, count);
    }

    const result: AiRole[] = [];
    for (let i = 0; i < count; i++) {
        result.push(shuffled[i % shuffled.length]);
    }
    return result;
}

/**
 * 获取角色库里配置过的 profile_name（去重）
 */
export function getAiRoleProfileNames(): string[] {
    return [...new Set(AI_ROLES.map(role => role.voiceProfileName).filter(Boolean))];
}


