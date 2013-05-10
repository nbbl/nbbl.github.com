<?php

$MAX_RES = 3; // Anzahl an Scores pro Level

include_once "database.php";

$mydb = new DB_MySQL("SERVER", "DB", "USER", "PWD");
$mydb->query("SELECT * FROM highscore ORDER BY levname, score");

$res = "{";

$tmpln = "";
$lnCnt = 0;
while($row = $mydb->fetchRow()) {
    $ln = $row["levname"];
    $name = $row["name"];
    $score = $row["score"];
    $points = $row["points"];
    
    // Check ob Anzahl pro Key erreicht
    if($ln == $tmpln && $lnCnt >= $MAX_RES) {
        continue;
    }
    
    // Objekt Key aufmachen
    if($ln != $tmpln) {
        if($tmpln != "") {
            $res .= "],";
        }
        $res .= "'$ln' : [";
        $tmpln = $ln;
        $lnCnt = 1;
    }
    // Objekte durch Komma trennen
    else {
        $res .= ",";
        $lnCnt++;
    }
    
    // Array füllen
    $res .= "{'name' : '$name', 'score' : '$score', 'points' : '$points'}";
}

$res .= "]}";

$res = str_replace("'", '"', $res);

$res = json_encode($res);

echo "getResults($res);";
?>