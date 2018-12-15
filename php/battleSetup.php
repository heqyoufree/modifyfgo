<?php
/**
 * Modify the data of battle setup.
 * 
 * @category ModifyFGO
 * @package  ModifyFGO
 * @author   heqyou_free <heqyoufreedom@126.com>
 * @license  http://www.gnu.org/licenses/old-licenses/gpl-2.0-standalone.html  GNU General Public License, version 2
 * @link     https://github.com/heqyoufree/ModifyFGO
 */
require_once 'function.php';
echo var_dump($_POST);
$body = urldecode($_POST["requestData"]);
$body_decoded = base64_decode($body);
$body_json_decoded = json_decode($body_decoded, true);
    
$setting = readJSON($body_json_decoded['cache']['replaced']['battle']['userId']);

foreach ($body_json_decoded['cache']['replaced']['battle'][0]['battleInfo']['userSvt'] as $svts) {
    foreach ($svts as $sv) {
        if (isset($sv['hpGaugeType'])) {
            if ($setting['enemyActNumSwitch']) {
                $sv['maxActNum'] = $setting['enemyActNumto'];
            }
            if ($setting['enemyChargeTurnSwitch']) {
                $sv['chargeTurn'] = $setting['enemyChargeTurnto'];
            }
            continue;
        }

        if (isset($sv['status']) && isset($sv['userId']) && $sv['status'] != 0 && $sv['userId'] !=0) {
            $sv['hp'] = $sv['hp']*$setting['uHp'];
            $sv['atk'] = $sv['atk']*$setting['uAtk'];

            if ($setting['skillLv']) {
                $sv['skillLv1'] = 10;
                $sv['skillLv2'] = 10;
                $sv['skillLv3'] = 10;
            }

            if ($setting['tdLv']) {
                $sv['treasureDeviceLv'] = 5;
            }

            if ($setting['limitCountSwitch']) {
                $sv['limitCount'] = 4;
                $sv['dispLimitCount'] = 4;
                $sv['commandCardLimitCount'] = 3;
                $sv['iconLimitCount'] = 4;
            }

            if ($setting['replaceSvtSwitch']) {
                if (($setting['replaceSvt1'] && $sv['svtId'] == "600200") || $setting['replaceSvtSpinner'] == 1) {
                       replaceSvt($sv, 0);
                }
                if (($setting['replaceSvt2'] && $sv['svtId'] == "600100") || $setting['replaceSvtSpinner'] == 2) {
                        replaceSvt($sv, 1);
                }
                if (($setting['replaceSvt3'] && $sv['svtId'] == "601400") || $setting['replaceSvtSpinner'] == 3) {
                    replaceSvt($sv, 2);
                }
                if (($setting['replaceSvt4'] && $sv['svtId'] == "700900") || $setting['replaceSvtSpinner'] == 4) {
                    replaceSvt($sv, 3);
                }
                if (($setting['replaceSvt5'] && $sv['svtId'] == "700500") || $setting['replaceSvtSpinner'] == 5) {
                    replaceSvt($sv, 4);
                }
                if (($setting['replaceSvt6'] && $sv['svtId'] == "701500") || $setting['replaceSvtSpinner'] == 6) {
                       replaceSvt($sv, 5);
                    $sv['treasureDeviceLv'] = 1;
                }
                continue;
            }
        }
        if ($setting['replaceCraftSwitch'] && isset($sv["parentSvtId"])) {
            $carftMap = [990068,990645,990066,990062,990131,990095,990113,990064,990333,990629,990327,990306];
            $sv["skillId1"] = $carftMap[$setting['replaceCraftSpinner']-1];
        }
    }
}
unset($sv);
unset($svts);
$response_json_encoded = json_encode($body_json_decoded);
$response_encoded = base64_encode($response_json_encoded);
//$response = urlencode($response_encoded);
echo $response_encoded;
?>