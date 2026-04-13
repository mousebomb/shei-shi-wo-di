import assert from 'assert';
import { TsrpcError, WsClient } from 'tsrpc';
import { serviceProto } from '../../src/shared/protocols/serviceProto';
import VoiceManager from "../../src/manager/VoiceManager";

// 1. EXECUTE `npm run dev` TO START A LOCAL DEV SERVER
// 2. EXECUTE `npm test` TO START UNIT TEST

describe('VoiceSynthesize', function () {


    it('合成测试', async function () {
        let ret = await VoiceManager.getInstance().synthesize("测试成功","732d78a5-dd84-479e-bd5d-2c241a4bf93a");
        assert.ok(ret.length)
    })

})
