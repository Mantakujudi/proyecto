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

document.getElementById("nextMes").onclick=function() {
    mes++;
    if(mes > 11){
        mes = 0;
        año++;
    }
    generarCalendario();
}

document.getElementById("prevMes").onclick=function() {
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
            horas=["16:00","18:15"];
        }

        if(diaSemana === 6) {
            horas=["11:30","13:30"];
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

//----------------------------------------------------------- Función para guardar la reserva del cumpleaños -------------------------------

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

    .then(res => res.text())
    .then(respuesta => {

        if(respuesta === "ocupado") {
            alert("Lo sentimos, esa fecha ya no está disponible.");
            location.reload();
            return;
        }

        alert("Su reserva se ha realizado correctamente. Proceda a realizar el pago correspondiente según el método elegido. ¡Muchas gracias!");
        location.reload();
    })
    .catch(error => {
        console.error(error);
        alert("Error al guardar la reserva");
    });
}

document.getElementById("alertaInfo").onclick = function() {
    alert(`¡Bienvenido/a a AquaBirthDay!
Primer paso: elige la fecha y la hora de tu cumpleaños.
Segundo paso: rellena el formulario.
Tercer paso: comprueba que todo está correcto, elige la modalidad de pago, descarga nuestra normativa, y ¡listo! ¡Tu reserva estará completa!
También puedes pinchar en el logotipo de AquaBirthDay para volver hacia atrás si lo necesitas.`);

}

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

document.getElementById("btnVolver").onclick = function() {

    let confirmacion = document.getElementById("confirmacionReserva");

    confirmacion.classList.add("hidden");
    form.classList.remove("hidden");

}

generarCalendario();
