# ModifyFGO
## 协议
[GNU General Public License, version 2](http://www.gnu.org/licenses/old-licenses/gpl-2.0-standalone.html)
## 使用教程
此版本适用于台服等  
### php
需要搭建php环境，具体百度  
要求：
- 使用POST
- headers中 Content-Type 为 application/x-www-form-urlencoded
- 参数 requestData 为未解密的battlesetup或battleCancel数据
### anyproxy
1. 安装[Node.js](https://nodejs.org)
2. 执行下列命令  
``bash
npm install -g install anyproxy  
node fgo.js
``
3. 设置代理
4. 在手机\模拟器上安装证书
### mitmproxy
待填坑
