<?php
session_start();
include("conexion.php");

$email = $_POST["email"];
$password = $_POST["password"];
$accion = $_POST["accion"];

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

if($accion === "registro") {

    $sql = "SELECT * FROM usuarios WHERE email = ?";
    $stmt = $conn -> prepare($sql);
    $stmt -> bind_param("s", $email);
    $stmt -> execute();
    $resultado = $stmt -> get_result();

    if($resultado -> num_rows > 0) {
        echo json_encode(["mensaje" => "El usuario ya existe"]);
        exit;
    }

    $sql = "INSERT INTO usuarios (email, password) VALUES (?, ?)";
    $stmt = $conn -> prepare($sql);
    $stmt -> bind_param("ss", $email, $passwordHash);
    $stmt -> execute();

    $_SESSION["usuario"] = $email;

    echo json_encode(["mensaje" => "Te has registrado correctamente"]);

}

if($accion === "login") {

    $sql = "SELECT * FROM usuarios WHERE email = ?";
    $stmt = $conn -> prepare($sql);
    $stmt -> bind_param("s", $email);
    $stmt -> execute();
    $resultado = $stmt -> get_result();

    if($resultado -> num_rows === 0) {
        echo json_encode(["mensaje" => "Usuario no encontrado"]);
        exit;
    }

    $usuario = $resultado -> fetch_assoc();

    if(password_verify($password, $usuario["password"])) {

        $_SESSION["usuario"] = $email;

        echo json_encode(["mensaje" => "Login correcto"]);

    }else {

        echo json_encode(["mensaje" => "Contraseña incorrecta"]);
    }
}

?>