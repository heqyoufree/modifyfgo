'use strict'
const AnyProxy = require('anyproxy')
const exec = require('child_process').exec
const fs = require('fs')

// user setting path
const profile = 'profile/'
// Proxy Port
const proxyPort = 25565
// Web UI
const webInterface = true
// Web Port, when unavailble
const webInterfacePort = 8002
// show anyproxy log in console
const silent = true

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
        var uid = getUserID(requestDetail.url)
        // read setting
        var options = readSetting(uid)
        if (options.battleCancel === true) {
          console.log(getTimestamp() + '-' + uid + '撤退胜利')
          // split request data with &
          var data = requestDetail.requestData.toString().split('&')
          // url decode
          data[11] = customUrlDecode(data[11])
          // get result
          var json = JSON.parse(data[11].substring(7))
          if (json.battleResult === 3) {
            // set result to win
            json.battleResult = 1
            // set turn num to random
            json.elapsedTurn = 11
            // clear alive beast
            json.aliveUniqueIds = []
            // change JSON object into String
            var temp = JSON.stringify(json)
            // encode result
            data[11] = 'result=' + customUrlEncode(temp)
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
        var jsonStr = Buffer.alloc(rawBody, 'base64').toString()
        // change into JSON object
        var decJson = JSON.parse(jsonStr)

        // need XFGO
        decJson.sign = ''

        // get setting
        var uid = getUserID(requestDetail.url)
        var options = readSetting(uid)
        var uHp = options.uHp
        var uAtk = options.uAtk
        var limitCountSwitch = options.limitCountSwitch
        var skillLv = options.skillLv
        var tdLv = options.tdLv
        var enemyActNumSwitch = options.enemyActNumSwitch
        var enemyActNumTo = options.enemyActNumTo
        var enemyChargeTurnSwitch = options.enemyChargeTurnSwitch
        var enemyChargeTurnto = options.enemyChargeTurnto
        var replaceSvtSwitch = options.replaceSvtSwitch
        var replaceSvtSpinner = options.replaceSvtSpinner
        var replaceSvt1 = options.replaceSvt1
        var replaceSvt2 = options.replaceSvt2
        var replaceSvt3 = options.replaceSvt3
        var replaceSvt4 = options.replaceSvt4
        var replaceSvt5 = options.replaceSvt5
        var replaceSvt6 = options.replaceSvt6
        var replaceCraftSwitch = options.replaceCraftSwitch
        var replaceCraftSpinner = options.replaceCraftSpinner

        if (decJson['cache']['replaced']['battle'] !== undefined) {
          console.log(getTimestamp() + '-' + uid + '进入战斗')
          // foreach does not work here, i have no idea about this.
          var svts = decJson['cache']['replaced']['battle'][0]['battleInfo']['userSvt']
          for (var i = 0; i < svts.length; i++) {
            var sv = svts[i]
            // ----------------------------------------
            // enemy
            if (sv['hpGaugeType'] !== undefined) {
              // replace enemy act num
              if (enemyActNumSwitch) {
                sv['maxActNum'] = enemyActNumTo
              }
              // replace enemy charge turn
              if (enemyChargeTurnSwitch) {
                sv['chargeTurn'] = enemyChargeTurnto
              }
              continue
            }
            // ----------------------------------------

            // ----------------------------------------
            // svt
            if (sv['status'] !== undefined && sv['userId'] !== undefined && sv['userId'] !== '0' && sv['userId'] !== 0) {
              // replace svt hp
              if (typeof sv['hp'] === 'number') {
                sv['hp'] = parseInt(sv['hp']) * uHp
              } else {
                sv['hp'] = String(parseInt(sv['hp']) * uHp)
              }
              // replace svt atk
              if (typeof sv['atk'] === 'number') {
                sv['atk'] = parseInt(sv['atk']) * uAtk
              } else {
                sv['atk'] = String(parseInt(sv['atk']) * uAtk)
              }

              // replace skill level
              if (skillLv) {
                sv['skillLv1'] = 10
                sv['skillLv2'] = 10
                sv['skillLv3'] = 10
              }

              // replace treasure device level
              if (tdLv) {
                sv['treasureDeviceLv'] = 5
              }

              // replace limit count
              if (limitCountSwitch) {
                sv['limitCount'] = 4
                sv['dispLimitCount'] = 4
                sv['commandCardLimitCount'] = 3
                sv['iconLimitCount'] = 4
              }

              // replace svt
              if (replaceSvtSwitch) {
                if ((replaceSvt1 && sv['svtId'] === '600200') || replaceSvtSpinner === 1) {
                  replaceSvt(sv, 0)
                }
                if ((replaceSvt2 && sv['svtId'] === '600100') || replaceSvtSpinner === 2) {
                  replaceSvt(sv, 1)
                }
                if ((replaceSvt3 && sv['svtId'] === '601400') || replaceSvtSpinner === 3) {
                  replaceSvt(sv, 2)
                }
                if ((replaceSvt4 && sv['svtId'] === '700900') || replaceSvtSpinner === 4) {
                  replaceSvt(sv, 3)
                }
                if ((replaceSvt5 && sv['svtId'] === '700500') || replaceSvtSpinner === 5) {
                  replaceSvt(sv, 4)
                }
                if ((replaceSvt6 && sv['svtId'] === '701500') || replaceSvtSpinner === 6) {
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
            if (replaceCraftSwitch && sv['parentSvtId'] !== undefined) {
              var carftMap = [990068, 990645, 990066, 990062, 990131, 990095, 990113, 990064, 990333, 990629, 990327, 990306]
              sv['skillId1'] = carftMap[replaceCraftSpinner - 1]
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
        var newBodyStr = Buffer.alloc(newJsonStr).toString('base64')
        // replace = to %3D
        newBodyStr = newBodyStr.replace(/=/g, '%3D')
        var newBody = Buffer.alloc(newBodyStr)
        response.body = newBody
        return {
          response: response
        }
      }
    },

    // when get https request only deal with fgo
    * beforeDealHttpsRequest (requestDetail) {
      return requestDetail.host.indexOf('bilibiligame.net') > 0
    }
  },
  silent: silent
}
const proxyServer = new AnyProxy.ProxyServer(options)
proxyServer.start()
console.log('科技服务端已启动')
console.log('端口号：' + proxyPort)
console.log('网页端口号：' + webInterfacePort)

function customUrlEncode (data) {
  data = data.replace(/"/g, '%22')
  data = data.replace(/'/g, '%27')
  data = data.replace(/:/g, '%3a')
  data = data.replace(/,/g, '%2c')
  data = data.replace(/\[/g, '%5b')
  data = data.replace(/]/g, '%5d')
  data = data.replace(/{/g, '%7b')
  data = data.replace(/}/g, '%7d')
  return data
}
function customUrlDecode (data) {
  data = data.replace(/%22/g, '"')
  data = data.replace(/%27/g, "'")
  data = data.replace(/%3a/g, ':')
  data = data.replace(/%2c/g, ',')
  data = data.replace(/%5b/g, '[')
  data = data.replace(/%5d/g, ']')
  data = data.replace(/%7b/g, '{')
  data = data.replace(/%7d/g, '}')
  return data
}

function replaceSvt (sv, id) {
  var str = '{"svt":[{"id":602500,"tdid":602501,"sk1":41650,"sk2":13553,"sk3":324650,"hp":14246,"atk":12767,"limit":false},{"id":500800,"tdid":500801,"sk1":321550,"sk2":322550,"sk3":323650,"hp":15259,"atk":11546,"limit":false},{"id":501900,"tdid":501901,"sk1":82550,"sk2":100551,"sk3":101551,"hp":14409,"atk":11598,"limit":false},{"id":500300,"tdid":500302,"sk1":23650,"sk2":25550,"sk3":108655,"hp":15359,"atk":11546,"limit":false},{"id":702300,"tdid":702301,"sk1":89550,"sk2":224550,"sk3":225550,"hp":14500,"atk":12556,"limit":false},{"id":9935510,"tdid":9935511,"sk1":89550,"sk2":321550,"sk3":108655,"hp":3215500,"atk":3215500,"limit":true}]}'
  var data = JSON.parse(str)
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

function readSetting (uid) {
  if (uid != null) {
    var options = JSON.parse(fs.readFileSync(profile + uid + 'options.json'))
  }
  return options
}

function getUserID (url) {
  var uidreg = /(?<=userId=)\d{12}/gi
  var uid = url.match(uidreg)
  return uid
}

function getTimestamp () {
  return new Date().getTime()
}
