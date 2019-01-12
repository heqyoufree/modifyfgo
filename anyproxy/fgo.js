/*
 * ATTENTION!!!
 * This script cannot get sign.
 * Thanks for using.
 */

'use strict'
const AnyProxy = require('anyproxy')
const exec = require('child_process').exec
const fs = require('fs')

// USER SETTING
// user setting path
const profile = 'profile/'
// Proxy Port
const proxyPort = 8001
// Web UI
const webInterface = false
// Web Port
const webInterfacePort = 8002
// show anyproxy log in console
const silent = true

// PROGRAM STATIC VARIABLES
const decode = ['"', "'", ':', ',', '\\[', '\\]', '\\{', '\\}']
const encode = ['%22', '%27', '%3a', '%2c', '%5b', '%5d', '%7b', '%7d']

// check cert
if (!AnyProxy.utils.certMgr.ifRootCAFileExists()) {
  AnyProxy.utils.certMgr.generateRootCA((error, keyPath) => {
    if (!error) {
      const certDir = require('path').dirname(keyPath)
      console.log('根证书生成成功，请从xfgo模块中安装证书，证书本地路径: ', certDir)
      const isWin = /^win/.test(process.platform)
      if (isWin) {
        exec('start .', { cwd: certDir })
      }
    } else {
      console.error('根证书生成失败', error)
    }
  })
}

// check setting folder
if (!fs.existsSync(profile)) {
  fs.mkdirSync(profile)
}

const options = {
  port: proxyPort,
  webInterface: {
    enable: webInterface,
    webPort: webInterfacePort
  },
  rule: {
    summary: 'ModifyFGO by heqyou_free',
    * beforeSendRequest (requestDetail) {
      if (requestDetail.url.indexOf('ac.php') > 0 && requestDetail.requestData.indexOf('key=battleresult') > 0) {
        // get userid
        var uid = requestDetail.url.match(/(?<=userId=)\d{12}/gi)
        // read setting
        var options = readJSON(profile + uid + 'options.json')
        if (options.battleCancel === true) {
          console.log(new Date().getTime() + '-' + uid + '撤退胜利')
          // split request data with &
          var data = requestDetail.requestData.toString().split('&')
          // url decode
          data[11] = replaceWithArray(data[11], encode, decode)
          // get result
          var json = JSON.parse(data[11].substring(7))
          if (json.battleResult === 3) {
            // set result to win
            json.battleResult = 1
            // set turn num to 11
            json.elapsedTurn = 11
            // clear alive beast
            json.aliveUniqueIds = []
            // change JSON object into String
            var temp = JSON.stringify(json)
            // encode result
            data[11] = 'result=' + replaceWithArray(temp, decode, encode)
            // connect array with &
            var newRequestData = ''
            data.forEach(value => {
              newRequestData += value
              for (var i = 1; i < data.length; i++) {
                newRequestData += '&'
              }
            })
          }
          return {
            requestData: newRequestData
          }
        }
      }
    },

    * beforeSendResponse (requestDetail, responseDetail) {
      if ((requestDetail.requestData.indexOf('key=battlesetup') > 0 || requestDetail.requestData.indexOf('key=battleresume') > 0) && requestDetail.url.indexOf('ac.php') > 0) {
        var response = Object.assign({}, responseDetail.response)
        // get response body
        var rawBody = response.body.toString()
        // replace %3D to =
        rawBody = rawBody.replace(/%3D/g, '=')
        // base64 encode
        var jsonStr = new Buffer(rawBody, 'base64').toString()
        // change into JSON object
        var decJson = JSON.parse(jsonStr)

        // needs you get sign by yourself
        // decJson.sign = getsign()

        // get setting
        var uid = requestDetail.url.match(/(?<=userId=)\d{12}/gi)
        var options = readJSON(profile + uid + 'options.json')

        if (decJson['cache']['replaced']['battle'] !== undefined) {
          console.log(new Date().getTime() + '-' + uid + '进入战斗')
          // foreach does not work here, i have no idea about this.
          var svts = decJson['cache']['replaced']['battle'][0]['battleInfo']['userSvt']
          for (var i = 0; i < svts.length; i++) {
            var sv = svts[i]
            // ----------------------------------------
            // enemy
            if (sv['hpGaugeType'] !== undefined) {
              // replace enemy act num
              if (options.enemyActNumSwitch) {
                sv['maxActNum'] = options.enemyActNumTo
              }
              // replace enemy charge turn
              if (options.enemyChargeTurnSwitch) {
                sv['chargeTurn'] = options.enemyChargeTurnto
              }
              continue
            }
            // ----------------------------------------

            // ----------------------------------------
            // svt
            if (sv['status'] !== undefined && sv['userId'] !== undefined && sv['userId'] !== '0' && sv['userId'] !== 0) {
              // replace svt hp
              if (typeof sv['hp'] === 'number') {
                sv['hp'] = parseInt(sv['hp']) * options.uHp
              } else {
                sv['hp'] = String(parseInt(sv['hp']) * options.uHp)
              }
              // replace svt atk
              if (typeof sv['atk'] === 'number') {
                sv['atk'] = parseInt(sv['atk']) * options.uAtk
              } else {
                sv['atk'] = String(parseInt(sv['atk']) * options.uAtk)
              }

              // replace skill level
              if (options.skillLv) {
                sv['skillLv1'] = 10
                sv['skillLv2'] = 10
                sv['skillLv3'] = 10
              }

              // replace treasure device level
              if (options.tdLv) {
                sv['treasureDeviceLv'] = 5
              }

              // replace limit count
              if (options.limitCountSwitch) {
                sv['limitCount'] = 4
                sv['dispLimitCount'] = 4
                sv['commandCardLimitCount'] = 3
                sv['iconLimitCount'] = 4
              }

              // replace svt
              if (options.replaceSvtSwitch) {
                if ((options.replaceSvt1 && sv['svtId'] === '600200') || options.replaceSvtSpinner === 1) {
                  replaceSvt(sv, 0)
                }
                if ((options.replaceSvt2 && sv['svtId'] === '600100') || options.replaceSvtSpinner === 2) {
                  replaceSvt(sv, 1)
                }
                if ((options.replaceSvt3 && sv['svtId'] === '601400') || options.replaceSvtSpinner === 3) {
                  replaceSvt(sv, 2)
                }
                if ((options.replaceSvt4 && sv['svtId'] === '700900') || options.replaceSvtSpinner === 4) {
                  replaceSvt(sv, 3)
                }
                if ((options.replaceSvt5 && sv['svtId'] === '700500') || options.replaceSvtSpinner === 5) {
                  replaceSvt(sv, 4)
                }
                if ((options.replaceSvt6 && sv['svtId'] === '701500') || options.replaceSvtSpinner === 6) {
                  // replaceSvt(sv, 9939320, 507, 960840, 960845, 89550, 3215000, 3215000, true)
                  // replaceSvt(sv, 9939360, 100, 35551, 960845, 89550, 3215000, 3215000, true)
                  // replaceSvt(sv, 9939370, 9939371, 960842, 960843, 36450, 3215000, 3215000, true)
                  // replaceSvt(sv, 900300, 900301, 5150, 0, 0,168780, 12005, true)
                  // replaceSvt(sv, 9935410, 441, 960416, 960417, 960418, 704822, 124440, true)
                  replaceSvt(sv, 5)
                  sv['treasureDeviceLv'] = 1
                }
                continue
              }
            }
            // ----------------------------------------

            // ----------------------------------------
            // carft
            if (options.replaceCraftSwitch && sv['parentSvtId'] !== undefined) {
              var carftMap = readJSON('data.json')
              sv['skillId1'] = carftMap.craft[options.replaceCraftSpinner - 1]
            }
            // ----------------------------------------
          }
        }

        // change JSON object into String
        var newJsonStr = JSON.stringify(decJson)
        // change chinese into unicode
        var cnReg = /[\u0391-\uFFE5]/gm
        if (cnReg.test(newJsonStr)) {
          newJsonStr = newJsonStr.replace(cnReg,
            function (str) {
              return '\\u' + str.charCodeAt(0).toString(16)
            })
        }
        // replace / to \/
        newJsonStr = newJsonStr.replace(/\//g, '\\/')
        // base64 decode
        var newBodyStr = new Buffer(newJsonStr).toString('base64')
        // replace = to %3D
        newBodyStr = newBodyStr.replace(/=/g, '%3D')
        var newBody = new Buffer(newBodyStr)
        response.body = newBody
        return {
          response: response
        }
      }
    },

    // when get https request only deal with fgo
    * beforeDealHttpsRequest (requestDetail) {
      return !requestDetail.host.indexOf('bilibiligame.net') > 0
    }
  },
  silent: silent
}
const proxyServer = new AnyProxy.ProxyServer(options)
proxyServer.start()
console.log('科技服务端已启动')
console.log('端口号：' + proxyPort)
console.log('网页端口号：' + webInterfacePort)

function replaceWithArray (data, array1, array2) {
  for (var i = 0; i < array1.length; i++) {
    data = data.replace(new RegExp(array1[i], 'g'), array2[i])
  }
  data = data.replace(/\\/g, '')
  return data
}

function replaceSvt (sv, id) {
  var data = readJSON('data.json')
  sv['svtId'] = data.svt[id].id
  sv['treasureDeviceId'] = data.svt[id].tdid
  sv['skillId1'] = data.svt[id].sk1
  sv['skillId2'] = data.svt[id].sk2
  sv['skillId3'] = data.svt[id].sk3
  sv['hp'] = data.svt[id].hp
  sv['atk'] = data.svt[id].atk
  if (data.svt[id].limit) {
    sv['limitCount'] = 0
    sv['dispLimitCount'] = 0
    sv['commandCardLimitCount'] = 0
    sv['iconLimitCount'] = 0
  }
}

function readJSON (file) {
  return JSON.parse(fs.readFileSync(file))
}

/*
function getsign () {
}
*/
