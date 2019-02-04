# ModifyFGO

## 0x00 给点早餐钱？

![Please Donate](https://github.com/heqyoufree/ModifyFGO/raw/master/%E6%B1%82%E7%82%B9%E6%97%A9%E9%A4%90%E9%92%B1.png)

## 0x01 开源协议

[GNU General Public License, version 2](http://www.gnu.org/licenses/old-licenses/gpl-2.0-standalone.html)
禁止商业用途

## 0x02 使用教程

此版本适用于台服等  
国服无解

### 0x021 php

需要搭建php环境，具体百度  
要求：

- 使用POST
- headers中 Content-Type 为 application/x-www-form-urlencoded
- 参数 requestData 为未解密的battlesetup或battleCancel数据

### 0x022 anyproxy

1. 安装[Node.js](https://nodejs.org)
2. 在命令行中执行下列命令
  ``bash
  npm install -g modifyfgo
  modifyfgo
  ``
3. 设置代理
4. 在手机\模拟器上安装证书

修改设置可以直接修改%appdata%/npm/node_modules/modifyfgo下的setting.json，也可以使用`modifyfgo -c`

### 0x023 mitmproxy

待填坑

## 0x03 目前状况

因为要准备中考，所以最近更新不会很频繁。目前主要以优化代码为主