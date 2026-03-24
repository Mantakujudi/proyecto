<?php

session_start();
include("conexion.php");

if(!isset($_SESSION["usuarios"])) {
    echo json_encode([]);
    exit;
}

$email = $_SESSION["usuarios"];

$sql = "SELECT r.id_reserva, r.fecha, r.hora, t.nombre, c.nombre AS cumple, i.cantidad 
FROM tabla_reserva r
JOIN tabla_tutor t ON r.id_tutor = t.id_tutor
JOIN tabla_cumpleanero c ON r.id_cumpleanero = c.id_cumpleanero
JOIN tabla_invitados i ON r.id_invitados = i.id_invitados
WHERE r.usuario_email = ? AND  r.estado != 'cancelado'";

$stmt = $conn -> prepare($sql);
$stmt -> bind_param("s", $email);
$stmt -> execute();

$resultado = $stmt -> get_result();

$reservas = [];

while($fila = $resultado -> fetch_assoc()) {
    $reservas[] = $fila;
}

echo json_encode($reservas);

?>