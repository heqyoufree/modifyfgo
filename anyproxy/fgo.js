#!/usr/bin/env node
/*
 * ATTENTION!!!
 * This script cannot get sign.
 * Thanks for using.
 */

'use strict'
const packageInfo = require('./package.json')
const AnyProxy = require('anyproxy')
const program = require('commander')
const value = require('./setting.json')
const exec = require('child_process').exec
const rule = require('./rule.js')
const rl = require('readline-sync')
const fs = require('fs')

program
  .version(packageInfo.version)
  .option('-c, --change', 'change global setting')
  .option('-u, --usersetting [value]', 'change setting by uid')
  .parse(process.argv)

// check cert
if (!AnyProxy.utils.certMgr.ifRootCAFileExists()) {
  AnyProxy.utils.certMgr.generateRootCA((error, keyPath) => {
    if (!error) {
      const certDir = require('path').dirname(keyPath)
      console.log('根证书生成成功，请从xfgo模块中安装证书，证书本地路径: ', certDir)
      if (/^win/.test(process.platform)) {
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

if (program.change || value.setted) {
  var setting = require('./setting.json')
  set('path of profile?', setting.profile, 's')
  set('port of proxy server?', setting.proxyPort, 'n')
  set('enable web ui? ', setting.webInterface, 'b')
  if (setting.webInterface) {
    set('port of web ui? ', setting.webInterfacePort, 'b')
  }
  set('enable silent?', setting.silent, '')
  set('keyword of updateing user setting?', setting.updateKeyword, 's')
  delete setting.setted
  JSON.stringify(setting, (key, value) => {
    console.log(value)
  })
  setting.setted = true
  if (rl.question('confirm your setting [y/n]') === 'y') {
    fs.writeFileSync('./setting.json', JSON.stringify(setting))
  }
  process.exit()
}

if (program.usersetting) {
  var path = value.profile + program.usersetting + 'options.json'
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, '')
  }
  var usersetting = require(path)
  set('password of current user?', usersetting.pw, 's')
  set('main switch?', usersetting.main, 'b')
  set('battle cancel', usersetting.battleCancel, 'b')
  set('act num of enemy', usersetting.eActNum, 'n')
  set('charge turn of enemy', usersetting.eChargeTurn, 'n')
  set('hp times of svts', usersetting.uHp, 'n')
  set('atk times of svts', usersetting.uAtk, 'n')
  set('skill lv switch', usersetting.uSkillLv, 'b')
  set('treasure lv switch', usersetting.uTdLv, 'b')
  set('limitcount switch', usersetting.uLimitCount, 'b')
  set('replace svt total switch', usersetting.uRpSvt, 'b')
  set('replace svt switch 1', usersetting.uRpSvt1, 'b')
  set('replace svt switch 2', usersetting.uRpSvt2, 'b')
  set('replace svt switch 3', usersetting.uRpSvt3, 'b')
  set('replace svt switch 4', usersetting.uRpSvt4, 'b')
  set('replace svt switch 5', usersetting.uRpSvt5, 'b')
  set('replace svt switch 6', usersetting.uRpSvt6, 'b')
  set('replace svt spinner', usersetting.uRpSvtSpinner, 'n')
  set('replace craft switch', usersetting.uRpCraft, 'b')
  set('replace craft spinner', usersetting.uRpCraftSpinner, 'n')
  JSON.stringify(usersetting, (key, value) => {
    console.log(value)
  })
  if (rl.question('confirm your setting [y/n]') === 'y') {
    fs.writeFileSync(path, JSON.stringify(usersetting))
  }
  process.exit()
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
value.webInterface && console.log('网页端口号：' + value.webInterfacePort)

function set (question, key, type) {
  if (type === 'n') {
    key = Number(rl.question(question + ' (' + key + ') ') || key)
  } else if (type === 'b') {
    var str = rl.question(question + ' (' + key + ') [true/false] ')
    if (str === 'true') {
      key = true
    } else if (str === 'false') {
      key = false
    }
  } else {
    key = rl.question(question + ' (' + key + ') ') || key
  }
}
