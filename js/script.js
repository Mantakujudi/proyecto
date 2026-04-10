let calendar = document.getElementById("calendar");
let horasDiv = document.getElementById("horas");
let form = document.getElementById("formReserva");
let confirmacionDiv = document.getElementById("confirmacion");
let fechaActual = new Date();
let mes = fechaActual.getMonth();
let año = fechaActual.getFullYear();

const nombreMeses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

let fechaSeleccionada = null;
let horaSeleccionada = null;

// -------------------------------------- Bloque para generar el Calendario ------------------------------------

function generarCalendario() {

    calendar.innerHTML="";

    document.getElementById("mesActual").innerText = nombreMeses[mes] + " " + año;

    let primerDia = new Date(año, mes, 1).getDay();

    if(primerDia === 0){
        primerDia = 7;
    }

    let diasMes = new Date(año, mes + 1, 0).getDate();

    let diasMesAnterior = new Date(año, mes, 0).getDate();

    // días del mes anterior
    for(let i = primerDia - 1; i > 0; i--) {
        let div = document.createElement("div");
        div.classList.add("dia", "otro-mes");
        div.innerText = diasMesAnterior - i + 1;
        calendar.appendChild(div);
    }

    // días del mes actual
    for(let i = 1; i <= diasMes; i++) {

        let fecha = new Date(año, mes, i);
        let div = document.createElement("div");

        div.classList.add("dia");
        div.innerText = i;

        let diaSemana = fecha.getDay();

        if (diaSemana === 5 || diaSemana === 6) {
            div.onclick = () => seleccionarDia(fecha);
        }else {
            div.classList.add("no-disponible");
        }
        calendar.appendChild(div);
    }

    // completar con días del mes siguiente
    let totalCeldas = calendar.children.length;
    let faltan = 42 - totalCeldas;

    for(let i = 1; i <= faltan; i++) {

        let div = document.createElement("div");
        div.classList.add("dia", "otro-mes");
        div.innerText = i;
        calendar.appendChild(div);
    }

}

// ----------------------------------------- Función para las flechas de mes anterior y mes siguiente ----------------------------------
function formatearFecha(fechaISO){

    let partes = fechaISO.split("-");
    let año = partes[0];
    let mes = parseInt(partes[1]) - 1;
    let dia = parseInt(partes[2]);

    return dia + " de " + nombreMeses[mes] + " de " + año;
}

document.getElementById("nextMes").onclick = function() {
    mes++;
    if(mes > 11){
        mes = 0;
        año++;
    }
    generarCalendario();
}

document.getElementById("prevMes").onclick = function() {
    mes--;
    if(mes < 0){
        mes = 11;
        año--;
    }
    generarCalendario();
}

// ------------------------------------------------- Función para seleccionar día y hora ---------------------------------------

function seleccionarDia(dia) {

    fechaSeleccionada = dia;

    horasDiv.innerHTML="";
    horasDiv.classList.remove("hidden");

    let año = dia.getFullYear();
    let mes = String(dia.getMonth() + 1).padStart(2,'0');
    let diaNum = String(dia.getDate()).padStart(2,'0');

    let fechaISO = `${año}-${mes}-${diaNum}`;

    fetch("php/obtener_reservas.php?fecha=" + fechaISO)
    .then(res => res.json())
    .then(horasOcupadas => {

        horasOcupadas = horasOcupadas.map(h => typeof h === "object" ? h.hora : h);

        let diaSemana = dia.getDay();
        let horas=[];

        if(diaSemana === 5) {
            horas = ["16:00","18:15"];
        }

        if(diaSemana === 6) {
            horas = ["11:30","13:30"];
        }

        horas.forEach(h => {

            let horaSQL = h + ":00";
            let btn = document.createElement("button");
            
            btn.innerText = h;

            if(horasOcupadas.includes(horaSQL)) {
                btn.disabled = true;
                btn.innerText= h + " (ocupado)";
                btn.classList.add("hora-ocupada");
            }else {
                btn.onclick = () => seleccionarHora(h);
            }
            horasDiv.appendChild(btn);
        });
    });
}

function seleccionarHora(hora){

    horaSeleccionada=hora;

    let año = fechaSeleccionada.getFullYear();
    let mes = String(fechaSeleccionada.getMonth() + 1).padStart(2,'0');
    let dia = String(fechaSeleccionada.getDate()).padStart(2,'0');

    let fechaLocal = `${año}-${mes}-${dia}`;

    document.getElementById("fechaSeleccionada").value = fechaLocal;
    document.getElementById("horaSeleccionada").value = hora;
    document.getElementById("bloqueCalendario").style.display="none";
    horasDiv.style.display = "none";
    form.classList.remove("hidden");

}

//----------------------------------------- Función para enviar los datos del formulario y que aparezca la confirmación -----------------------------

form.addEventListener("submit",function (e) {

    e.preventDefault();

    let datos = new FormData(form);

    let fecha = document.getElementById("fechaSeleccionada").value;
    let hora = document.getElementById("horaSeleccionada").value;

    console.log("Fecha:", fecha);
    console.log("Hora:", hora);

    let tutor = datos.get("nombre_tutor");
    let dni = datos.get("dni");
    let telefono = datos.get("telefono");
    let email = datos.get("email");
    let cumple = datos.get("nombre_cumple");
    let edad = datos.get("edad");
    let invitados = datos.get("cantidad");
    let merienda = datos.get("tipo_merienda");
    let alergias = datos.get("alergias");
    let chuches = datos.get("bolsa_chuches");

    form.classList.add("hidden");

    let confirmacion = document.getElementById("confirmacionReserva");
    confirmacion.classList.remove("hidden");

    document.getElementById("confFecha").innerText = formatearFecha(fecha);
    document.getElementById("confHora").innerText = hora;

    document.getElementById("confTutor").innerText = tutor;
    document.getElementById("confDni").innerText = dni;
    document.getElementById("confTelefono").innerText = telefono;
    document.getElementById("confEmail").innerText = email;

    document.getElementById("confCumple").innerText = cumple;
    document.getElementById("confEdad").innerText = edad;

    document.getElementById("confInvitados").innerText = invitados;

    document.getElementById("confMerienda").innerText = merienda;
    document.getElementById("confAlergias").innerText = alergias;
    document.getElementById("confChuches").innerText = chuches;

    document.getElementById("btnReservar").onclick = () => guardarReserva(datos);

});

//----------------------------------------------------Función para guardar la reserva del cumpleaños -------------------------------

function guardarReserva(datos) {

    let metodo = document.querySelector('input[name="pago"]:checked');

    if (!metodo) {
        alert("Seleccione un método de pago");
        return;
    }

    datos.append("metodo_pago", metodo.value);

    fetch("php/guardar_reserva.php", {
        method: "POST",
        body: datos
    })

    .then(res => res.json())
    .then(respuesta => {

        if(respuesta.status === "ocupado") {
            alert("Lo sentimos, esa fecha ya no está disponible.");
            return;
        }

        if(respuesta.status === "error" && respuesta.mensaje === "no_logueado") {
            alert("Debes iniciar sesión para reservar");
            return;
        }

        if(respuesta.status === "ok") {
            alert("Su reserva se ha realizado correctamente. Proceda a realizar el pago correspondiente según el método elegido. ¡Muchas gracias!");
            location.reload();
        }
        
    })
    .catch(error => {
        console.error(error);
        alert("Error al guardar la reserva");
    });
}

//----------------------------------------Botón logotipo AquaBirthDay calendario-----------------------------------

document.getElementById("alertaInfo").onclick = function() {
    alert(`¡Bienvenido/a a AquaBirthDay!
Primer paso: elige la fecha y la hora de tu cumpleaños.
Segundo paso: rellena el formulario.
Tercer paso: comprueba que todo está correcto, elige la modalidad de pago, descarga nuestra normativa, y ¡listo! ¡Tu reserva estará completa!
También puedes pinchar en el logotipo de AquaBirthDay para volver hacia atrás si lo necesitas.`);

}

//-----------------------------------------Botón logotipo AquaBirthDay formulario----------------------------------- 

document.getElementById("btnVolverCalendario").onclick = function() {

    // ocultar formulario
    form.classList.add("hidden");

    // mostrar calendario completo
    document.getElementById("bloqueCalendario").style.display = "block";

    // resetear horarios
    horasDiv.innerHTML = "";
    horasDiv.classList.add("hidden");
    horasDiv.style.display = "";

}

//----------------------------------------Botón logotipo AquaBirthDay confirmación----------------------------------

document.getElementById("btnVolver").onclick = function() {

    let confirmacion = document.getElementById("confirmacionReserva");

    confirmacion.classList.add("hidden");
    form.classList.remove("hidden");

}

generarCalendario();

//------------------------------------------Función para enlazar la categoría con su info------------------------------

let botones = document.querySelectorAll("#categorias p");
let contenidos = document.querySelectorAll("#info > div");
let categoriaSelect = document.getElementById("categoriaSelect");

const seccionPorClave = {
    registro: "infoRegistro",
    aquabirthday: "infoAquabirthday",
    comoReservo: "infoReserva",
    misReservas: "infoMisReservas",
    tarifas: "infoTarifas",
    normas: "infoNormativa",
    contacto: "infoContacto"
};

function ocultarTodo() {
    contenidos.forEach(div => div.classList.add("hidden"));
}

//-------------------------------------Funcionalidad para el responsive de la página-----------------------------------

function opcionSelectDisponible(clave) {
    let opt = categoriaSelect && categoriaSelect.querySelector(`option[value="${clave}"]`);
    return opt && !opt.hidden;
}

function mostrarSeccionPorClave(clave) {
    let idInfo = seccionPorClave[clave];
    if (!idInfo) return;
    ocultarTodo();
    document.getElementById(idInfo).classList.remove("hidden");
    if (clave === "misReservas") {
        cargarMisReservas();
    }
    if (categoriaSelect && opcionSelectDisponible(clave)) {
        categoriaSelect.value = clave;
    }
}

function setOpcionMisReservasVisible(visible) {
    let opt = document.querySelector(".opcion-mis-reservas");
    if (opt) {
        opt.hidden = !visible;
    }
    if (!visible && categoriaSelect && categoriaSelect.value === "misReservas") {
        mostrarSeccionPorClave("registro");
    }
}

botones.forEach(boton => {
    boton.onclick = () => {
        let clave = null;
        if (boton.classList.contains("registro")) clave = "registro";
        if (boton.classList.contains("aquabirthday")) clave = "aquabirthday";
        if (boton.classList.contains("comoReservo")) clave = "comoReservo";
        if (boton.classList.contains("misReservas")) clave = "misReservas";
        if (boton.classList.contains("tarifas")) clave = "tarifas";
        if (boton.classList.contains("normas")) clave = "normas";
        if (boton.classList.contains("contacto")) clave = "contacto";
        if (clave) {
            mostrarSeccionPorClave(clave);
        }
    };
});

if (categoriaSelect) {
    categoriaSelect.addEventListener("change", () => {
        mostrarSeccionPorClave(categoriaSelect.value);
    });
}

mostrarSeccionPorClave("registro");
setOpcionMisReservasVisible(false);


//----------------------------------------Registro y Login de los usuarios---------------------------------

let btnRegistro = document.getElementById("btnRegistro");
let btnLogin = document.getElementById("btnLogin");
let mensajeAuth = document.getElementById("mensajeAuth");

//---------------------------------------Funcionalidad para el registro de usuarios------------------

btnRegistro.onclick = async () => {

    let email = document.getElementById("emailUsuario").value;
    let password = document.getElementById("passwordUsuario").value;

    //-------Validación de Contraseña mediante Expresión Regular--------------
    const regex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

    if (!regex.test(password)) {
        mensajeAuth.innerText = "La contraseña debe contener mínimo 8 caracteres, una mayúscula y un símbolo. ";
        return;
    }

    let datos = new FormData();
    datos.append("email", email);
    datos.append("password", password);
    datos.append("accion", "registro");

    let res = await fetch("php/auth.php", {
        method: "POST",
        body: datos
    });

    let data = await res.json();

    mensajeAuth.innerText = data.mensaje;

    if(data.mensaje.includes("correctamente")) {
        comprobarSesion();
    }
};

//--------------------------------------Funcionalidad para el login de usuarios-----------------------------------

btnLogin.onclick = async () => {

    let email = document.getElementById("emailUsuario").value;
    let password = document.getElementById("passwordUsuario").value;

    let datos = new FormData();
    datos.append("email", email);
    datos.append("password", password);
    datos.append("accion", "login");

    let res = await fetch("php/auth.php", {
        method: "POST",
        body: datos
    });

    let data = await res.json();

    mensajeAuth.innerText = data.mensaje;

    if(data.mensaje === "Login correcto") {
        comprobarSesion();
    }

};

//------------------------------------Función para cerrar sesión (logout)-------------------------

let btnLogout = document.getElementById("btnLogout");

btnLogout.onclick = async () => {

    let res = await fetch("php/logout.php");
    let data = await res.json();

    mensajeAuth.innerText = data.mensaje;

    document.querySelector(".registro").classList.remove("hidden");
    document.querySelector(".misReservas").classList.add("hidden");

    document.getElementById("btnLogout").classList.add("hidden");

    setOpcionMisReservasVisible(false);
    mostrarSeccionPorClave("registro");

};

//----------------------------------Control de sesiones activas-------------------------------

async function comprobarSesion() {

    let res = await fetch("php/check_session.php");
    let data = await res.json();

    if(data.logueado) {

        document.querySelector(".misReservas").classList.remove("hidden");
        document.getElementById("mensajeAuth").innerText = "Bienvenido/a, " + data.email;

        document.getElementById("btnLogout").classList.remove("hidden");

        setOpcionMisReservasVisible(true);
        mostrarSeccionPorClave("misReservas");
        
    } else {
        document.querySelector(".misReservas").classList.add("hidden");
        setOpcionMisReservasVisible(false);
    }
}

comprobarSesion();

//-------------------------------Función para visualizar las reservas en Mis Reservas----------------

async function cargarMisReservas() {

    let res = await fetch("php/obtener_mis_reservas.php");
    let reservas = await res.json();

    let contenedor = document.getElementById("contenedorReservas");
    contenedor.innerHTML = "";

    if(reservas.length === 0) {
        contenedor.innerHTML = "<p>No tienes ninguna reserva realizada aún</p>";
        return;
    }
    
    reservas.forEach(r => {

        let div = document.createElement("div");

        div.innerHTML = `
            <p><b>Fecha:</b> ${r.fecha}</p>
            <p><b>Hora:</b> ${r.hora}</p>
            <p><b>Tutor:</b> ${r.nombre}</p>
            <p><b>Cumpleañero:</b> ${r.cumple}</p>
            <p><b>Invitados:</b> ${r.cantidad}</p>
            
            <button onclick="cancelarReserva(${r.id_reserva})">Cancelar reserva</button>
            <hr>
        `;

        contenedor.appendChild(div);

    });

}

//------------------------------------Función para cancelar reservas en Mis Reservas-------------------------------

async function cancelarReserva(id) {

    let confirmar = confirm("¿Está seguro de cancelar esta reserva?");
    if(!confirmar) return;

    let datos = new FormData();
    datos.append("id_reserva", id);

    let res = await fetch("php/cancelar_reserva.php", {
        method: "POST",
        body: datos
    });

    let data = await res.json();

    if(data.status === "ok") {
        alert("Reserva cancelada con éxito");
        cargarMisReservas();
    } else{
        alert("Error al cancelar la reserva");

        cancelarReserva();
    }
}

document.querySelector(".misReservas").classList.add("hidden");

