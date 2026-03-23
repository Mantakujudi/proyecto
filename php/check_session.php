<?php
session_start();

if(isset($_SESSION["usuarios"])) {
    echo json_encode([
        "logueado" => true,
        "email" => $_SESSION["usuarios"]
    ]);
} else{
    echo json_encode([
        "logueado" => false
    ]);
}
?>