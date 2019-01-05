<?php
/**
 * Modify the data of battle cancel.
 * 
 * PHP version 7.2.12
 * 
 * @category ModifyFGO
 * @package  ModifyFGO
 * @author   heqyou_free <heqyoufreedom@126.com>
 * @license  http://www.gnu.org/licenses/old-licenses/gpl-2.0-standalone.html  GNU General Public License, version 2
 * @link     https://github.com/heqyoufree/ModifyFGO
 */
require_once "function.php";
$body = customURLdecode($_POST['requestData']);
$body_array = explode("&", $body);

$setting = readJSON(substr($body_array[12], 7));

if ($setting['uBatCancel']) {
    $body_result = substr($body_array[11], 7);
    $result_json_decoded = json_decode($body_result, true);
    $result_json_decoded['battleResult'] = 1;
    $result_json_decoded['elapsedTurn'] = random_int(5, 15);
    $result_json_decoded['aliveUniqueIds'] = [];
    $result_json_encoded = json_encode($result_json_decoded);
    $body_array[11] = "result=".customURLencode($result_json_encoded);
    foreach ($body_array as $body_arr) {
        $newbody = $newbody.$body_arr."&";
    }
    $newbody = substr($newbody, 0, -1);
    echo $newbody;
}
?>