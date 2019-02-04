#!/usr/bin/env node
/*
 * ATTENTION!!!
 * This script cannot get sign.
 * Thanks for using.
 */

'use strict'
const AnyProxy = require('anyproxy')
const exec = require('child_process').exec
const fs = require('fs')
const rule = require('./rule.js')
const value = require('./value.js')
const program = require('commander')
const packageInfo = require('./package.json')
const rl = require('readline-sync')

program
  .version(packageInfo.version)
  .option('-c, --change', 'change user setting')
  .parse(process.argv)

// check cert
if (!AnyProxy.utils.certMgr.ifRootCAFileExists()) {
  AnyProxy.utils.certMgr.generateRootCA((error, keyPath) => {
    if (!error) {
      const certDir = require('path').dirname(keyPath)
      console.log('根证书生成成功，请从xfgo模块中安装证书，证书本地路径: ', certDir)
      const isWin = /^win/.test(process.platform)
      if (isWin) {
        exec('start .', {
          cwd: certDir
        })
      }
    } else {
      console.error('根证书生成失败', error)
    }
  })
}

// check setting folder
if (!fs.existsSync(value.profile)) {
  fs.mkdirSync(value.profile)
}

if (program.change) {
  set()
}

const options = {
  port: value.proxyPort,
  webInterface: {
    enable: value.webInterface,
    webPort: value.webInterfacePort
  },
  rule: rule,
  silent: value.silent
}
const proxyServer = new AnyProxy.ProxyServer(options)
proxyServer.start()
console.log('科技服务端已启动')
console.log('端口号：' + value.proxyPort)
console.log('网页端口号：' + value.webInterfacePort)

function set () {
  var setting = require('./setting.json')
  setting.profile = rl.question('path of profile? (' + setting.profile + ') ') || setting.profile
  setting.proxyPort = Number(rl.question('port of proxy server? (' + setting.proxyPort + ') ')) || setting.proxyPort
  setting.webInterface = rl.question('enable web ui? (' + setting.webInterface + ') [true/false] ') === 'true' || setting.webInterface
  if (setting.webInterface) {
    setting.webInterfacePort = Number(rl.question('port of web ui? (' + setting.webInterfacePort + ') ')) || setting.webInterfacePort
  }
  setting.silent = rl.question('enable silent? (' + setting.silent + ') [true/false] ') === 'true' || setting.silent
  setting.updateKeyword = rl.question('keyword of updateing user setting? (' + setting.updateKeyword + ') ') || setting.updateKeyword
  JSON.stringify(setting, (key, value) => {
    console.log(value)
  })
  if (rl.question('confirm your setting [y/n]') === 'y') {
    fs.writeFileSync('./setting.json', JSON.stringify(setting))
  }
  process.exit()
}
