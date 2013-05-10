<?php

include_once "database.php";

$levname = $_GET["levname"];
$score = $_GET["score"];
$name = $_GET["name"];
$points = $_GET["points"];

if($levname && $score && $name && $points) {
    
    $mydb = new DB_MySQL("SERVER", "DB", "USER", "PWD");
    $mydb->query("INSERT INTO highscore(levname, name, score, points) VALUES ('$levname', '$name', $score, '$points')");
    
}

?>