<?php

include "conexion.php";

$fecha = $_GET["fecha"];

$resultado = $conn->query("SELECT hora FROM tabla_reserva WHERE fecha ='$fecha' AND estado !='cancelado'");

$horas = [];

while ($fila = $resultado->fetch_assoc()) {
    $horas[] = $fila["hora"];
}

echo json_encode($horas);

?>