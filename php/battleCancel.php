<?php
    include_once "function.php";
    $body = urldecode($_POST['requestData']);
    $body_array = explode("&",$body);
    
    $setting = readJSON(substr($body_array[12], 7));

    if ($setting['battleCancel']) {
        $body_result = substr($body_array[11], 7);
        $result_json_decoded = json_decode($body_result, true);
        $result_json_decoded['battleResult'] = 1;
        $result_json_decoded['elapsedTurn'] = random_int(5, 15);
        $result_json_decoded['aliveUniqueIds'] = [];
        $result_json_encoded = json_encode($result_json_decoded);
        $body_array[11] = "result=".urlencode($result_json_encoded);
        foreach ($body_array as $body_arr){
            $newbody = $newbody.$body_arr."&";
        }
        $newbody = substr($newbody, 0, -1);
        echo $newbody;
    }
?>