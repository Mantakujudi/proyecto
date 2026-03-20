<?php

include "conexion.php";

$id_reserva = $_POST["id_reserva"];
$metodo = $_POST["metodo"];

if ($metodo == "bizum") {
    $estado = "pagado";
} else {
    $estado = "pendiente";
}

$conn->query("UPDATE tabla_reserva SET estado = '$estado' WHERE id_reserva = $id_reserva");

echo "Reserva confirmada";

?>