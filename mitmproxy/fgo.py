"""Import http module from mitmproxy."""
from mitmproxy import http
import re
import json
import base64
import urllib
import datetime


def load(load):
  """Load."""
  load.add_option('block_global', bool, False, 'disable block_global')
  # load.add_option('mode', str, 'socks5', 'set proxy mode')


def request(flow):
  """Replace the data of request."""
  if flow.request.url.find('ac.php') > -1 and flow.request.url.find('key=battleresult') > -1:
    uid = re.search(r'/\d{12}/gi', flow.request.url)
      with open('./settings/' + re.search(r'/\d{12}/gi', flow.request.url) + '.json', 'r') as f:
        options = json.loads(f.read())
      if (options.battleCancel == True):
        print(datetime.datetime.now().strftime('%H:%M:%S') + '-' + json_data['cache']['replaced']['battle']['userId'] + 'cancel battle')
        data = flow.request.url.content.split('&')
        data[11] = urllib.parse.unquote(data[11])
        json = json.loads(urllib.parse.unquote(data[11])[7:])
        if (json.battleResult == 3):
          json.battleResult = 1
          json.elapsedTurn = 11
          json.aliveUniqueIds = []
          data[11] = 'result=' + urllib.parse.quote(json.dumps(json))
          for da in data:
            string = string + da
            for d in data:
              string = string + '&'
        flow.requaet.content = bytes(urllib.parse.quote(str(base64.b64encode(bytes(json.dumps(json_data).replace(' ', ''), encoding='utf-8')), encoding='utf-8')), encoding='utf-8')


def response(flow):
  """Replace the data of response."""
  if flow.request.url.find('ac.php') > -1:
    if flow.request.urlencoded_form['key'] == 'battlesetup' or flow.request.urlencoded_form['key'] == 'battleresume':
      json_data = json.loads(str(base64.b64decode(urllib.parse.unquote(str(flow.response.content, encoding='utf-8'))), encoding='utf-8'))
      with open('./settings/' + json_data['cache']['replaced']['battle']['userId'] + '.json', 'r') as f:
        options = json.loads(f.read())
      if options['main']:
        if isset(json_data['cache']['replaced']['battle']):
          print(datetime.datetime.now().strftime('%H:%M:%S') + '-' + json_data['cache']['replaced']['battle']['userId'] + 'start battle')
          for sv in json_data['cache']['replaced']['battle'][0]['battleInfo']['userSvt']:
            if isset(sv['hpGaugeType']):
              if options['enemyActNumSwitch']:
                sv['maxActNum'] = options['enemyActNumTo']
              if options['enemyChargeTurnSwitch']:
                sv['chargeTurn'] = options['enemyChargeTurnto']
              continue
            if isset(sv['status']) and isset(sv['userId']) and sv['userId'] != '0' and sv['userId'] != 0:
              if isinstance(sv['hp'], int):
                sv['hp'] = int(sv['hp']) * options['uHp']
              else:
                sv['hp'] = str(int(sv['hp']) * options['uHp'])

              if isinstance(sv['atk'], int):
                sv['atk'] = int(sv['atk']) * options['uAtk']
              else:
                sv['atk'] = str(int(sv['atk']) * options['uAtk'])

              if options['skillLv']:
                sv['skillLv1'] = 10
                sv['skillLv2'] = 10
                sv['skillLv3'] = 10

              if options['tdLv']:
                sv['treasureDeviceLv'] = 5

              if options['limitCountSwitch']:
                sv['limitCount'] = 4
                sv['dispLimitCount'] = 4
                sv['commandCardLimitCount'] = 3
                sv['iconLimitCount'] = 4

              if options['replaceSvtSwitch']:
                if (options['replaceSvt1'] and sv['svtId'] == '600200') or options['replaceSvtSpinner'] == 1:
                  replaceSvt(sv, 0)
                if (options['replaceSvt2'] and sv['svtId'] == '600100') or options['replaceSvtSpinner'] == 2:
                  replaceSvt(sv, 1)
                if (options['replaceSvt3'] and sv['svtId'] == '601400') or options['replaceSvtSpinner'] == 3:
                  replaceSvt(sv, 2)
                if (options['replaceSvt4'] and sv['svtId'] == '700900') or options['replaceSvtSpinner'] == 4:
                  replaceSvt(sv, 3)
                if (options['replaceSvt5'] and sv['svtId'] == '700500') or options['replaceSvtSpinner'] == 5:
                  replaceSvt(sv, 4)
                if (options['replaceSvt6'] and sv['svtId'] == '701500') or options['replaceSvtSpinner'] == 6:
                  replaceSvt(sv, 5)
                  sv['treasureDeviceLv'] = 1
                continue

            if options['replaceCraftSwitch'] and isset(sv['parentSvtId']):
              with open('./data.json', 'r') as f:
                carftMap = json.loads(f.read())
              sv['skillId1'] = carftMap['craft'][options['replaceCraftSpinner'] - 1]

        flow.response.content = bytes(urllib.parse.quote(str(base64.b64encode(bytes(json.dumps(json_data).replace(' ', ''), encoding='utf-8')), encoding='utf-8')), encoding='utf-8')


def isset(var):
  """Check if the is set.

  Keyword arguments:
  var -- the var that to be checked
  """
  try:
    var
  except NameError:
    return False
  else:
    return True


def replaceSvt(sv, id):
  """Replace the data of current svt.

  Keyword arguments:
  sv -- the reference var
  id -- the id of the svt that is used to replace
  """
  with open('./data.json', 'r') as f:
    data = json.loads(f.read())
  sv['svtId'] = data['svt'][id]['id']
  sv['treasureDeviceId'] = data['svt'][id]['tdid']
  sv['skillId1'] = data['svt'][id]['sk1']
  sv['skillId2'] = data['svt'][id]['sk2']
  sv['skillId3'] = data['svt'][id]['sk3']
  sv['hp'] = data['svt'][id]['hp']
  sv['atk'] = data['svt'][id]['atk']
  if data['svt'][id]['limit']:
    sv['limitCount'] = 0
    sv['dispLimitCount'] = 0
    sv['commandCardLimitCount'] = 0
    sv['iconLimitCount'] = 0
