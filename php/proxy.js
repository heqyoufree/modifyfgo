/**
 * Available on anyproxy
 */

'use strict'
const AnyProxy = require('anyproxy')
const exec = require('child_process').exec
const http = require('http')

// USER SETTING
// Server Host
const host = '127.0.0.1'
// Proxy Port
const proxyPort = 8001
// Web UI
const webInterface = false
// Web Port
const webInterfacePort = 8002
// show anyproxy log in console
const silent = true

// check cert
if (!AnyProxy.utils.certMgr.ifRootCAFileExists()) {
  AnyProxy.utils.certMgr.generateRootCA((error, keyPath) => {
    if (!error) {
      const certDir = require('path').dirname(keyPath)
      console.log('根证书生成成功，请在手机上安装,证书本地路径: ', certDir)
      const isWin = /^win/.test(process.platform)
      if (isWin) {
        exec('start .', { cwd: certDir })
      }
    } else {
      console.error('根证书生成失败', error)
    }
  })
}

const options = {
  port: proxyPort,
  webInterface: {
    enable: webInterface,
    webPort: webInterfacePort
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
      response.body = new Buffer(sendPOST(response.body.toString(), '/battleSetup.php'))
      return {
        response: response
      }
    },

    * beforeDealHttpsRequest (requestDetail) {
      return !requestDetail.host.indexOf('bilibiligame.net') > 0
    }
  },
  silent: silent
}
const proxyServer = new AnyProxy.ProxyServer(options)
proxyServer.start()
console.log('科技客户端已启动')
console.log('端口号：' + proxyPort)
console.log('网页端口号：' + webInterfacePort)

function sendPOST (request, path) {
  var options = {
    host: host,
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
