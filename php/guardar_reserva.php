<?php
session_start();
include "conexion.php";

if(!isset($_SESSION["usuario"])) {
    echo json_encode(["status" => "error", "mensaje" => "no_logueado"]);
    exit;
}

$usuario_email = $_SESSION["usuario"];

$fecha = $_POST["fecha"];
$hora = $_POST["hora"]; 

// comprobar si ya existe una reserva en esa fecha y hora
$consulta = $conn -> query("SELECT id_reserva FROM tabla_reserva WHERE fecha = '$fecha' AND hora = '$hora' AND estado != 'cancelado'");

if($consulta -> num_rows > 0) {
    echo json_encode(["status" => "ocupado"]);
    exit;
}

$nombre_tutor = $_POST["nombre_tutor"];
$dni = $_POST["dni"];
$telefono = $_POST["telefono"];
$email = $_POST["email"];

$nombre_cumple = $_POST["nombre_cumple"];
$edad = $_POST["edad"];

$cantidad = $_POST["cantidad"];

$tipo_merienda = $_POST["tipo_merienda"];
$alergias = $_POST["alergias"];
$bolsa = $_POST["bolsa_chuches"];

//Insertamos tutor
$conn -> query("INSERT INTO tabla_tutor(nombre, dni, telefono, email) VALUES ('$nombre_tutor', '$dni', '$telefono', '$email')");
$id_tutor = $conn -> insert_id;

//Insertamos cumpleañero
$conn -> query("INSERT INTO tabla_cumpleanero(nombre, edad) VALUES ('$nombre_cumple', '$edad')");
$id_cumple = $conn -> insert_id;

//Insertamos invitados
$conn -> query("INSERT INTO tabla_invitados(cantidad) VALUES ('$cantidad')");
$id_invitados = $conn -> insert_id;

//Insertamos cafetería
$conn -> query("INSERT INTO tabla_cafeteria(tipo_merienda, alergias, bolsa_chuches) VALUES ('$tipo_merienda', '$alergias', '$bolsa')");
$id_cafeteria = $conn -> insert_id;

//Insertamos reserva, la tabla principal donde todas las demás confluyen
$conn -> query("INSERT INTO tabla_reserva(fecha, hora, estado, id_tutor, id_cumpleanero, id_invitados, id_cafeteria, usuario_email) VALUES ('$fecha', '$hora', 'pendiente', $id_tutor, $id_cumple, $id_invitados, $id_cafeteria, '$usuario_email')");

echo json_encode(["status" => "ok", "mensaje" => "Reserva guardada correctamente"]);

?>