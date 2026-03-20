CREATE DATABASE reservas_cumple;

USE reservas_cumple;

CREATE TABLE tabla_tutor(
    id_tutor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    dni VARCHAR(20),
    telefono VARCHAR(20),
    email VARCHAR(100)
);

CREATE TABLE tabla_cumpleanero(
    id_cumpleanero INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    edad INT
);

CREATE TABLE tabla_invitados(
    id_invitados INT AUTO_INCREMENT PRIMARY KEY,
    cantidad INT
);

CREATE TABLE tabla_cafeteria(
    id_cafeteria INT AUTO_INCREMENT PRIMARY KEY,
    tipo_merienda VARCHAR(100),
    alergias TEXT,
    bolsa_chuches VARCHAR(10)
);

CREATE TABLE tabla_reserva(
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE,
    hora TIME,
    estado VARCHAR(20),

    id_tutor INT,
    id_cumpleanero INT,
    id_invitados INT,
    id_cafeteria INT,

    FOREIGN KEY (id_tutor) REFERENCES tabla_tutor(id_tutor),
    FOREIGN KEY (id_cumpleanero) REFERENCES tabla_cumpleanero(id_cumpleanero),
    FOREIGN KEY (id_invitados) REFERENCES tabla_invitados(id_invitados),
    FOREIGN KEY (id_cafeteria) REFERENCES tabla_cafeteria(id_cafeteria)
);