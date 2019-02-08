'use strict'
const functions = require('./functions.js')
const color = require('colorful')
const value = require('./setting.json')
const fs = require('fs')

module.exports = {
  summary: 'ModifyFGO by heqyou_free',
  * beforeSendRequest (requestDetail) {
    if (requestDetail.url.test('ac.php') && requestDetail.requestData.test('key=battleresult')) {
      var uid = requestDetail.url.match(/(?<=userId=)\d{12}/gi)
      var options = require(value.profile + uid + 'options.json')
      if (options.main && options.battleCancel === true) {
        console.log(color.green(new Date().getTime() + '-' + uid + '撤退胜利'))
        var data = requestDetail.requestData.toString().split('&')
        data[11] = functions.customURLdecode(data[11])
        var json = JSON.parse(data[11].substring(7))
        if (json.battleResult === 3) {
          json.battleResult = 1
          json.elapsedTurn = 11
          json.aliveUniqueIds = []
          var temp = JSON.stringify(json)
          data[11] = 'result=' + functions.customURLencode(temp)
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
    if (requestDetail.url.test(value.updateKeyword)) {
      var newSetting = JSON.parse(functions.customURLdecode(requestDetail.requestData))
      if (fs.existsSync(value.profile + newSetting['uid'] + 'options.json')) {
        var oldSetting = require(value.profile + newSetting['uid'] + 'options.json')
        if (oldSetting['pw'] === newSetting['pw']) {
          fs.writeFileSync(value.profile + newSetting['uid'] + 'options.json', functions.customURLdecode(requestDetail.requestData))
          console.log(color.green(new Date().getTime() + '-' + uid + '更新设置'))
        }
      } else {
        fs.writeFileSync(value.profile + newSetting['uid'] + 'options.json', functions.customURLdecode(requestDetail.requestData))
        console.log(color.green(new Date().getTime() + '-' + uid + '添加设置'))
      }
    }
  },

  * beforeSendResponse (requestDetail, responseDetail) {
    if ((requestDetail.requestData.test('key=battlesetup') || requestDetail.requestData.test('key=battleresume')) && requestDetail.url.test('ac.php')) {
      var response = Object.assign({}, responseDetail.response)
      var rawBody = response.body.toString()
      rawBody = rawBody.replace(/%3D/g, '=')
      var jsonStr = Buffer.from(rawBody, 'base64').toString()
      var decJson = JSON.parse(jsonStr)

      decJson.sign = ''

      var uid = requestDetail.url.match(/(?<=userId=)\d{12}/gi)
      var options = require(value.profile + uid + 'options.json')

      if (options.main && decJson['response'][0]['resCode'] === '00') {
        if (decJson['cache']['replaced']['battle'] !== undefined) {
          console.log(color.green(new Date().getTime() + '-' + uid + '进入战斗'))
          var svts = decJson['cache']['replaced']['battle'][0]['battleInfo']['userSvt']
          for (var i = 0; i < svts.length; i++) {
            var sv = svts[i]
            if (sv['hpGaugeType'] !== undefined) {
              if (options.eActNum > -1) {
                sv['maxActNum'] = options.eActNum
              }
              if (options.eChargeTurn > -1) {
                sv['chargeTurn'] = options.eChargeTurn
              }
              continue
            }

            if (sv['status'] !== undefined && sv['userId'] !== undefined && sv['userId'] !== '0' && sv['userId'] !== 0) {
              if (typeof sv['hp'] === 'number') {
                sv['hp'] = parseInt(sv['hp']) * options.uHp
              } else {
                sv['hp'] = String(parseInt(sv['hp']) * options.uHp)
              }
              if (typeof sv['atk'] === 'number') {
                sv['atk'] = parseInt(sv['atk']) * options.uAtk
              } else {
                sv['atk'] = String(parseInt(sv['atk']) * options.uAtk)
              }

              if (options.uSkillLv) {
                sv['skillLv1'] = 10
                sv['skillLv2'] = 10
                sv['skillLv3'] = 10
              }

              if (options.uTdLv) {
                sv['treasureDeviceLv'] = 5
              }

              if (options.uLimitCount) {
                sv['limitCount'] = 4
                sv['dispLimitCount'] = 4
                sv['commandCardLimitCount'] = 3
                sv['iconLimitCount'] = 4
              }

              if (options.uRpSvt) {
                if ((options.uRpSvt1 && sv['svtId'] === '600200') || options.uRpSvtSpinner === 1) {
                  functions.replaceSvt(sv, 0)
                }
                if ((options.uRpSvt2 && sv['svtId'] === '600100') || options.uRpSvtSpinner === 2) {
                  functions.replaceSvt(sv, 1)
                }
                if ((options.uRpSvt3 && sv['svtId'] === '601400') || options.uRpSvtSpinner === 3) {
                  functions.replaceSvt(sv, 2)
                }
                if ((options.uRpSvt4 && sv['svtId'] === '700900') || options.uRpSvtSpinner === 4) {
                  functions.replaceSvt(sv, 3)
                }
                if ((options.uRpSvt5 && sv['svtId'] === '700500') || options.uRpSvtSpinner === 5) {
                  functions.replaceSvt(sv, 4)
                }
                if ((options.uRpSvt6 && sv['svtId'] === '701500') || options.uRpSvtSpinner === 6) {
                  functions.replaceSvt(sv, 5)
                  sv['treasureDeviceLv'] = 1
                }
                continue
              }
            }

            if (options.uRpCraft && sv['parentSvtId'] !== undefined) {
              var carftMap = require('data.json')
              sv['skillId1'] = carftMap.craft[options.uRpCraftSpinner - 1]
            }
          }
        }
      }

      var newJsonStr = JSON.stringify(decJson)
      var cnReg = /[\u0391-\uFFE5]/gm
      if (cnReg.test(newJsonStr)) {
        newJsonStr = newJsonStr.replace(cnReg,
          function (str) {
            return '\\u' + str.charCodeAt(0).toString(16)
          })
      }
      newJsonStr = newJsonStr.replace(/\//g, '\\/')
      var newBodyStr = Buffer.from(newJsonStr).toString('base64')
      newBodyStr = newBodyStr.replace(/=/g, '%3D')
      var newBody = Buffer.from(newBodyStr)
      response.body = newBody
      return {
        response: response
      }
    }
  }
}
