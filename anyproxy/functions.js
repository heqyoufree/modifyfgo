module.exports = {
  * customURLencode (data) {
    data = data.replace(/"/g, '%22')
    data = data.replace(/'/g, '%27')
    data = data.replace(/:/g, '%3a')
    data = data.replace(/,/g, '%2c')
    data = data.replace(/\[/g, '%5b')
    data = data.replace(/]/g, '%5d')
    data = data.replace(/{/g, '%7b')
    data = data.replace(/}/g, '%7d')
    return data
  },

  * customURLdecode (data) {
    data = data.replace(/%22/g, '"')
    data = data.replace(/%27/g, "'")
    data = data.replace(/%3a/g, ':')
    data = data.replace(/%2c/g, ',')
    data = data.replace(/%5b/g, '[')
    data = data.replace(/%5d/g, ']')
    data = data.replace(/%7b/g, '{')
    data = data.replace(/%7d/g, '}')
    return data
  },

  * replaceSvt (sv, id) {
    var data = require('data.json')
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
}
