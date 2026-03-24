<?php
session_start();
include ("conexion.php");

if(!isset($_SESSION["usuarios"])) {
    echo json_encode(["status" => "error"]);
    exit;
}

$id = $_POST["id_reserva"];
$email = $_SESSION["usuarios"];

$sql = "UPDATE tabla_reserva SET estado = 'cancelado' WHERE id_reserva = ? AND usuario_email = ?";

$stmt = $conn -> prepare($sql);
$stmt -> bind_param("is", $id, $email);
$stmt -> execute();

if($stmt -> affected_rows > 0 ) {
    echo json_encode(["status" => "ok"]);
} else {
    echo json_encode(["status" => "error"]);
}
?>