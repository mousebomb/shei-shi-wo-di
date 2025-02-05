import React, { useEffect, useRef, useState } from "react";
import { getClient } from "../getClient";
import { MsgChat } from "../shared/protocols/MsgChat";
import './index.less';
import {Radio, RadioGroup, Spin, Toast} from "@douyinfe/semi-ui";

export const Chatroom = (props: {}) => {
    const [input, setInput] = useState('');
    const [list, setList] = useState([] as MsgChat[]);
    const [client] = useState(getClient());
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [word, setWord] = useState("");
    const [players,setPlayers] = useState([] as {name : string, num : number}[]);
    const [isWaitingMeVote, setIsWaitingMeVote] = useState(false);
    const [isWaitingMeDescribe, setIsWaitingMeDescribe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [voteToPlayer, setVoteToPlayer] = useState(0);
    const [voteOptions , setVoteOptions] = useState([] as number[]);

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

    // 音频播放队列
    const audioQueue = useRef<{ blob: Blob, audio: HTMLAudioElement }[]>([]);
    // 当前正在播放的音频
    const currentAudio = useRef<HTMLAudioElement | null>(null);
    // 播放音频队列中的下一个音频
    const playNextAudio = () => {
        if (audioQueue.current.length > 0) {
            const nextAudio = audioQueue.current.shift();
            if (nextAudio) {
                currentAudio.current = nextAudio.audio;
                currentAudio.current.play();
                currentAudio.current.onended = playNextAudio;
            }
        } else {
            currentAudio.current = null;
        }
    };

    // on mounted
    useEffect(() => {
        // Connect at startup
        client.connect().then(v => {
            if (!v.isSucc) {
                Toast.error('= Client Connect Error =\n' + v.errMsg);
            }
        });

        // Listen Msg
        client.listenMsg('Chat', v => {
            setList(oldList => [...oldList, v]);
            if ( v.voice ) {
                // 将音频数据转换为Blob对象
                const blob = new Blob([v.voice], { type: 'audio/wav' });
                const audio = new Audio(URL.createObjectURL(blob));
                audioQueue.current.push({ blob, audio });
                if (!currentAudio.current) {
                    playNextAudio();
                }
            }
        })
        client.listenMsg('GameStarted', v => {
            setWord(v.word);
            setIsGameStarted(true);
            setPlayers(v.players);
            Toast.success("游戏开始，你的词是：" + v.word);
        })
        client.listenMsg('PlsVote', v => {
            setIsWaitingMeVote(true);
            setInput('');
            setVoteOptions(v.options);
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
        // voteToPlayer必须属于 voteOptions之一
         if (!voteOptions.includes(voteToPlayer)) {
             Toast.error("投票必须是"+voteOptions.join(",")+"中的数字");
             return;
         }
        setIsLoading(true);
        let ret = await client.callApi('SendVote', {
            voteToPlayer: voteToPlayer,
            reason:input
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
            isWaitingMeVote && (
                <>
                    <RadioGroup type='button' buttonSize='middle' defaultValue={0} aria-label="投票给玩家序号"
                                style={{textAlign: "center"}}
                                onChange={e => setVoteToPlayer(e.target.value)}>
                        <Radio value={1}>1</Radio>
                        <Radio value={2}>2</Radio>
                        <Radio value={3}>3</Radio>
                        <Radio value={4}>4</Radio>
                        <Radio value={5}>5</Radio>
                        <Radio value={6}>6</Radio>
                    </RadioGroup>
                    <div className="send">
                        <input placeholder={`${voteToPlayer}是卧底的理由`} value={input}
                               onChange={e => {
                                   setInput(e.target.value)
                               }}
                               onKeyPress={e => e.key === 'Enter' && sendVote()}
                        />
                        <button onClick={sendVote}>确认投票</button>
                    </div>
                </>
            )

        }
        {isLoading && <div className="full-loading">
          <Spin size={"large"}/>
        </div>}
    </div>
}
