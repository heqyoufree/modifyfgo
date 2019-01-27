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
