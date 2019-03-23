<?php
/**
 * Modify the data of battle setup.
 * 
 * PHP version 7.2.12
 * 
 * @category ModifyFGO
 * @package  ModifyFGO
 * @author   heqyou_free <heqyoufreedom@126.com>
 * @license  http://www.gnu.org/licenses/old-licenses/gpl-2.0-standalone.html  GNU General Public License, version 2
 * @link     https://github.com/heqyoufree/ModifyFGO
 */
require_once 'function.php';
$body_json_decoded = json_decode(base64_decode(customURLdecode($_POST["requestData"]), true));
    
$setting = readJSON($body_json_decoded['cache']['replaced']['battle']['userId']);

foreach ($body_json_decoded['cache']['replaced']['battle'][0]['battleInfo']['userSvt'] as $svts) {
    foreach ($svts as $sv) {
        if (isset($sv['hpGaugeType'])) {
            if ($setting['eActNum'] > -1) {
                $sv['maxActNum'] = $setting['eActNum'];
            }
            if ($setting['eChargeTurn'] > -1) {
                $sv['chargeTurn'] = $setting['eChargeTurn'];
            }
            continue;
        }

        if (isset($sv['status']) && isset($sv['userId']) && $sv['status'] != 0 && $sv['userId'] !=0) {
            $sv['hp'] = $sv['hp']*$setting['uHp'];
            $sv['atk'] = $sv['atk']*$setting['uAtk'];

            if ($setting['uSkillLv']) {
                $sv['skillLv1'] = 10;
                $sv['skillLv2'] = 10;
                $sv['skillLv3'] = 10;
            }

            if ($setting['uTdLv']) {
                $sv['treasureDeviceLv'] = 5;
            }

            if ($setting['uLimitCount']) {
                $sv['limitCount'] = 4;
                $sv['dispLimitCount'] = 4;
                $sv['commandCardLimitCount'] = 3;
                $sv['iconLimitCount'] = 4;
            }

            if ($setting['uRpSvt']) {
                $svtId = [600200,600100,601400,700900,700500,701500];
                for ($i = 0; $i < $svtId.length; $i++) {
                    if ((eval('options.uRpSvt'+i) && $sv['svtId'] == $svtId[i]) || $setting['uRpSvtSpinner'] == i+1) {
                        replaceSvt($sv, $i);
                    }
                }
                continue;
            }
        }
        if ($setting['uRpCarft'] && isset($sv["parentSvtId"])) {
            $carftMap = [990068,990645,990066,990062,990131,990095,990113,990064,990333,990629,990327,990306];
            $sv["skillId1"] = $carftMap[$setting['uRpcarftSpinner']-1];
        }
    }
}
unset($sv);
unset($svts);
echo customURLencode(base64_encode(json_encode($body_json_decoded)));
?>