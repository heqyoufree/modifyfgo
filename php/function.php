<?php
    include_once "value.php";
    function readJSON($uid){
        return json_decode(file_get_contents($setting_path.$uid.".json"), true);
    }
    function writeJSON($uid, $content){
        file_put_contents($setting_path.$uid.".json", $content);
    }
    function replaceSvt($sv, $id){
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
    }
?>