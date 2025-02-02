# 谁是卧底

## 需求

睿睿想玩谁是卧底总是凑不齐人， 我想帮她开发一个在家里能玩的，AI玩的自闭环的，鲁棒性好一点的，《谁是卧底》游戏机器人。 计划用Deepseek 部署在LMStudio + LMStudio的API，可以实现调用对话。然后可以写一个服务器端来驱动规则，我们几个人都可以玩。还需要寻找一个开源方案的配音AI来根据文本合成语音，扮演不同的机器人，每个机器人分配一个独特的嗓音。 服务端采用nodejs开发，为人类提供一个网页页面来为人类玩家分配各自的题目词，每个人独自看自己的界面，机器人不需要界面。



方案2: 用deepseek R1 本地部署 + CosyVoice 本地部署。

后来发现R1思维模式不适合本地部署玩这游戏，因为它每次输出tokens太多了，会需要等待更久。



## LM Studio接入

开启server

![image-20250201102953699](README.assets/image-20250201102953699.png)

LM Studio默认可能是4096tokens，要手动改高一点，deepseek-r1-distill-qwen-7b 可以最大128K。



# 服务流程：

```mermaid
sequenceDiagram
    participant C as 客户端
    participant S as 服务端
    participant R as 智能体
    %% 游戏准备阶段
    C->>S: 发送加入游戏请求
    S->>S: 分配卧底、平民词语，创建5个智能体，并发送词语给5个智能体
    S->>S: 创建智能体、准备智能体初始化提示词、记录各自词语。
    S->>C: 将玩家分配到的词语、场上5位智能体的名字信息发送给玩家
    %% 首轮描述阶段
    C->>S: 发送开始一轮游戏请求
    loop 遍历所有智能体、玩家
    	alt 智能体
    		S->>R: 发送提示词，让智能体进行描述
    		R->>S: 返回各自的描述
            S->>C: 智能体描述自己的词
    	else 
            S->>C: 提示用户输入
  	        C->>S: 发送对词语的描述		
    	end
    end
    %% 按顺序发言阶段
    loop 按顺序每个玩家
        S->>C: 通知轮到该玩家发言
        S->>R: 通知轮到该玩家发言
        C->>S: 发送发言内容
        S->>C: 确认发言接收
        S->>C: 转发该玩家发言内容
    end
    %% 投票阶段
    S->>C: 通知进入投票阶段
    loop 遍历所有玩家
        C->>S: 发送投票对象（玩家编号）
        S->>C: 确认投票接收
    end
    S->>C: 公布得票最多玩家（若平票，通知相关玩家再次描述）
    %% 后续轮次
    alt 游戏未结束
        %% 重复描述、发言、投票阶段
        loop 后续轮次
            %% 描述阶段
            loop 遍历所有玩家
                C->>S: 发送对词语的描述
                S->>C: 确认描述接收
            end
            %% 按顺序发言阶段
            loop 按顺序每个玩家
                S->>C: 通知轮到该玩家发言
                C->>S: 发送发言内容
                S->>C: 确认发言接收
                S->>R: 转发该玩家发言内容
            end
            %% 投票阶段
            S->>C: 通知进入投票阶段
            loop 遍历所有玩家
                C->>S: 发送投票对象（玩家编号）
                S->>C: 确认投票接收
            end
            S->>C: 公布得票最多玩家（若平票，通知相关玩家再次描述）
        end
    else
        S->>C: 公布游戏结果（平民或卧底获胜），房间解散
    end
```


# CosyVoice接入
CosyVoice 是一个开源的语音合成工具，它可以根据文本生成高质量的语音。它支持多种语言和风格，并且可以根据用户的需求进行自定义。CosyVoice 可以在 Windows、Linux 和 macOS 上运行。
按照官方文档部署到conda环境。
然后把restapi.py放到cosyvoice目录下，然后安装库`pip install Flask`，
运行`python restapi.py`。

# 运行

本地运行LMStudio，下载好模型，开启开发者服务器。

客户端: `cd frontend && npm run-script dev`

服务端：`cd backend && npm run-script dev`

