<?php

$host = "localhost";
$user = "root";
$password = "";
$db = "reservas_cumple";
$port = 3306;

$conn = new mysqli($host,$user,$password,$db, $port);

if($conn->connect_error){
    die("Error de conexión: " . $conn->connect_error);
}

?>