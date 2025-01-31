import React, { useEffect, useRef, useState } from "react";
import { getClient } from "../getClient";
import { MsgChat } from "../shared/protocols/MsgChat";
import './index.less';
import {Spin, Toast} from "@douyinfe/semi-ui";

export const Chatroom = (props: {}) => {
    const [input, setInput] = useState('');
    const [list, setList] = useState([] as MsgChat[]);
    const [client] = useState(getClient());
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [word, setWord] = useState("");
    const [numPlayers, setNumPlayers] = useState(0);
    const [isWaitingMeVote, setIsWaitingMeVote] = useState(false);
    const [isWaitingMeDescribe, setIsWaitingMeDescribe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function startGame(){
        setIsLoading(true);
        const startGameResp = await client.callApi("StartGame", {});
        if (!startGameResp.isSucc) {
            Toast.error("开始游戏失败" + startGameResp.err.message);
            setIsLoading(false);
            return;
        }
        setIsLoading(false);
        setIsGameStarted(true);
    }

    // on mounted
    useEffect(() => {
        // Connect at startup
        client.connect().then(v => {
            if (!v.isSucc) {
                Toast.error('= Client Connect Error =\n' + v.errMsg);
            }
        });

        // Listen Msg
        client.listenMsg('Chat', v => { setList(oldList => [...oldList, v]) })
        client.listenMsg('GameStarted', v => {
            setWord(v.word);
            setIsGameStarted(true);
            setNumPlayers(v.numPlayers);
            Toast.success("游戏开始，你的词是：" + v.word);
        })
        client.listenMsg('PlsVote', v => {
            setIsWaitingMeVote(true);
            setInput('');
            Toast.success("请投票");
        })
        client.listenMsg('PlsDescribe', v => {
            setIsWaitingMeDescribe(true);
            setInput('');
            Toast.success("请描述");
        })


        // When disconnected
        client.flows.postDisconnectFlow.push(v => {
            Toast.error('Server disconnected');
            return v;
        })
    }, [client]);

    async function sendDescribe(){
        if (input.length == 0) {
            Toast.error("描述不能为空");
            return;
        }
        setIsLoading(true);
        let ret = await client.callApi('SendDescribe', {
            content: input
        });
        setIsLoading(false);
        // Error
        if (!ret.isSucc) {
            Toast.error("发送描述失败" + ret.err.message);
            return;
        }
        // Success
        setInput('');
        setIsWaitingMeDescribe(false);
    }
    async function sendVote(){
        if (input.length == 0) {
            Toast.error("投票不能为空");
            return;
        }
        let voteToPlayer = parseInt(input);
        if (isNaN(voteToPlayer)) {
            Toast.error("投票必须是数字");
            return;
        }
        //必须是1～6之间的数字
        if (voteToPlayer < 1 || voteToPlayer > numPlayers) {
            Toast.error("投票必须是1～"+numPlayers+"之间的数字");
            return;
        }
        setIsLoading(true);
        let ret = await client.callApi('SendVote', {
            voteToPlayer: voteToPlayer
        });
        setIsLoading(false);
        // Error
        if (!ret.isSucc) {
            Toast.error("发送投票失败" + ret.err.message);
            return;
        }
        // Success
        setInput('');
        setIsWaitingMeVote(false);
    }

    // Scroll to bottom when new message come
    const ul = useRef<HTMLUListElement>(null);
    useEffect(() => {
        ul.current?.scrollTo(0, ul.current.scrollHeight);
    }, [list.length])

    return <div className="Chatroom">
        <header>我的词：{word}</header>
        <ul className="list" ref={ul}>
            {list.map((v, i) =>
                <li key={i}>
                    <div className='content'>{v.content}</div>
                    <div className='time'>{v.time.toLocaleTimeString()}</div>
                </li>
            )}
        </ul>
        {isGameStarted ? (
<></>
        ) : (

            <div className="send">
                <button onClick={startGame}>开始游戏</button>
            </div>
        )}
        {isWaitingMeDescribe && <div className="send">
          <input placeholder={`描述你的词语${word}`} value={input}
                 onChange={e => {
                     setInput(e.target.value)
                 }}
                 onKeyPress={e => e.key === 'Enter' && sendDescribe()}
          />
          <button onClick={sendDescribe}>发送描述</button>

        </div>}
        {
            isWaitingMeVote && <div className="send">
                <input placeholder={`请输入你要投票的玩家的序号`} value={input}
                       onChange={e => {
                           setInput(e.target.value)
                       }}
                       onKeyPress={e => e.key === 'Enter' && sendVote()}
                />
                <button onClick={sendVote}>确认投票</button>
            </div>
        }
        {isLoading && <div className="full-loading">
            <Spin size={"large"}/>
        </div>}
    </div>
}
