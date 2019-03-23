<?php
/**
 * Some function that ModifyFGO needs.
 * 
 * PHP version 7.2.12
 * 
 * @category ModifyFGO
 * @package  ModifyFGO
 * @author   heqyou_free <heqyoufreedom@126.com>
 * @license  http://www.gnu.org/licenses/old-licenses/gpl-2.0-standalone.html  GNU General Public License, version 2
 * @link     https://github.com/heqyoufree/ModifyFGO
 */
require_once 'value.php';
$encode = ['%22', '%27', '%3a', '%2c', '%5b', '%5d', '%7b', '%7d'];
$decode = ['"', '\'', ':', ',', '[', ']', '{', '}'];

/**
 * Read user setting
 * 
 * @param string $uid id of user
 * 
 * @return array json array of user setting which belongs to the id that is given
 */
function readJSON($uid)
{
    return json_decode(file_get_contents($setting_path.$uid.".json"), true);
}

/**
 * Write user setting
 * 
 * @param string $uid     id of user
 * @param string $content setting content
 * 
 * @return boolean is succuessful
 */
function writeJSON($uid, $content)
{
    return file_put_contents($setting_path.$uid.".json", $content);
}

/**
 * Replace the data of svt
 * 
 * @param string $sv original data
 * @param string $id id of svt
 * 
 * @return null
 */
function replaceSvt($sv, $id)
{
    $svtData = json_decode(file_get_contents("svtData.json"), true);
    $sv['svtId'] = $svtData['svt'][$id]['id'];
    $sv['treasureDeviceId'] = $svtData['svt'][$id]['tdid'];
    $sv['skillId1'] = $svtData['svt'][$id]['sk1'];
    $sv['skillId2'] = $svtData['svt'][$id]['sk2'];
    $sv['skillId3'] = $svtData['svt'][$id]['sk3'];
    $sv['hp'] = $svtData['svt'][$id]['hp'];
    $sv['atk'] = $svtData['svt'][$id]['atk'];
    if ($svtData['svt'][$id]['limit']) {
        $sv['limitCount'] = 0;
        $sv['dispLimitCount'] = 0;
        $sv['commandCardLimitCount'] = 0;
        $sv['iconLimitCount'] = 0;
    }
    if ($svtData['svt'][$id]['operation'] !== "") {
        eval($svtData['svt'][$id]['operation']);
    }
}

/** 
 * URL encode data
 * 
 * @param string $data data that need to be encode
 * 
 * @return string data that has been encoded
 */
function customURLencode($data)
{
    return str_replace($decode, $encode, $data);
}

/** 
 * URL decode data
 * 
 * @param string $data data that need to be decode
 * 
 * @return string data that has been decoded
 */
function customURLdecode($data)
{
    return str_replace($encode, $decode, $data);
}
?>