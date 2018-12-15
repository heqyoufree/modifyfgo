<?php
/**
 * Update the user setting.
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
require_once 'function.php';

$body = urldecode($_POST["requestData"]);
$setting_new = json_decode($body, true);
if (file_exists($setting_path.$setting_new['uid'].'json')) {
    $setting_old = readJSON($setting_new['uid']);
    if ($setting_new['pw'] == $setting_old['pw']) {
        writeJSON($setting_path.$setting_new['uid']);
    }
} else {
    writeJSON($setting_path.$setting_new['uid']);
}
?>