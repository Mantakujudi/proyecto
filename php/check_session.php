<?php
session_start();

if(isset($_SESSION["usuario"])) {
    echo json_encode([
        "logueado" => true,
        "email" => $_SESSION["usuario"]
    ]);
} else{
    echo json_encode([
        "logueado" => false
    ]);
}
?>