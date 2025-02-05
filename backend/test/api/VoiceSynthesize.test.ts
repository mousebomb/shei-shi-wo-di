import assert from 'assert';
import { TsrpcError, WsClient } from 'tsrpc';
import { serviceProto } from '../../src/shared/protocols/serviceProto';
import VoiceManager from "../../src/manager/VoiceManager";

// 1. EXECUTE `npm run dev` TO START A LOCAL DEV SERVER
// 2. EXECUTE `npm test` TO START UNIT TEST

describe('VoiceSynthesize', function () {


    it('合成测试', async function () {
        let ret = await VoiceManager.getInstance().synthesize("测试成功");
        assert.ok(ret.length)
    })

})
