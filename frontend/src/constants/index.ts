/**
 * 客户端配置常量
 */
//开发环境 ： 因为craco调试模式会强制设置development 所以这里需要改成从URL中判断，如果是localhost 或 局域网IP 就看作是开发环境
export const IS_DEV = window.location.hostname === "localhost" ||
    window.location.hostname.startsWith("192.168") ||
    window.location.hostname.startsWith("127.0.0.1");
//常量
export const SERVER: string = IS_DEV ? "ws://127.0.0.1:3000" : "ws://192.168.50.3:3000";

