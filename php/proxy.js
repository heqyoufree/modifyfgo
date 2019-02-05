#!/usr/bin/env node
/**
 * Available on anyproxy
 */

'use strict'
const AnyProxy = require('anyproxy')
const program = require('commander')
const value = require('./setting.json')
const exec = require('child_process').exec
const http = require('http')
const rl = require('readline-sync')
const fs = require('fs')

program
  .option('-c, --change', 'change global setting')
  .parse(process.argv)

// check cert
if (!AnyProxy.utils.certMgr.ifRootCAFileExists()) {
  AnyProxy.utils.certMgr.generateRootCA((error, keyPath) => {
    if (!error) {
      const certDir = require('path').dirname(keyPath)
      console.log('根证书生成成功，请在手机上安装,证书本地路径: ', certDir)
      if (/^win/.test(process.platform)) {
        exec('start .', { cwd: certDir })
      }
    } else {
      console.error('根证书生成失败', error)
    }
  })
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

const options = {
  port: value.proxyPort,
  webInterface: {
    enable: value.webInterface,
    webPort: value.webInterfacePort
  },
  rule: {
    summary: 'ModifyFGO Client by heqyou_free',
    * beforeSendRequest (requestDetail) {
      return {
        requestData: sendPOST(requestDetail.requestData.toString(), '/battleCancel.php')
      }
    },

    * beforeSendResponse (requestDetail, responseDetail) {
      var response = Object.assign({}, responseDetail.response)
      response.body = Buffer.from(sendPOST(response.body.toString(), '/battleSetup.php'))
      return {
        response: response
      }
    },

    * beforeDealHttpsRequest (requestDetail) {
      return !requestDetail.host.indexOf('bilibiligame.net') > 0
    }
  },
  silent: value.silent
}
const proxyServer = new AnyProxy.ProxyServer(options)
proxyServer.start()
console.log('科技客户端已启动')
console.log('端口号：' + value.proxyPort)
console.log('网页端口号：' + value.webInterfacePort)

function sendPOST (request, path) {
  var options = {
    host: value.host,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': request.length
    }
  }
  var req = http.request(options, function (res) {
    res.setEncoding('utf8')
    res.on('data', function (data) {
      return data
    })
  })
  req.write(request)
  req.end()
}

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
