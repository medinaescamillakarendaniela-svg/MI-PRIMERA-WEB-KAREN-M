// ===== Preguntas de cada módulo =====
const juegos = {
    ingles: {
        titulo: "🇬🇧 Inglés",
        preguntas: [
            { texto: "¿Cómo se dice 'gato' en inglés?", opciones: ["Dog", "Cat", "Bird"], correcta: 1 },
            { texto: "¿Qué significa 'red'?", opciones: ["Azul", "Verde", "Rojo"], correcta: 2 },
            { texto: "¿Cómo se dice 'manzana' en inglés?", opciones: ["Apple", "Banana", "Orange"], correcta: 0 }
        ]
    },
    matematicas: {
        titulo: "➕ Matemáticas",
        preguntas: [
            { texto: "¿Cuánto es 5 + 3?", opciones: ["7", "8", "9"], correcta: 1 },
            { texto: "¿Cuánto es 10 - 4?", opciones: ["6", "5", "7"], correcta: 0 },
            { texto: "¿Cuánto es 3 x 3?", opciones: ["6", "12", "9"], correcta: 2 }
        ]
    },
    sociales: {
        titulo: "🌎 Sociales",
        preguntas: [
            { texto: "¿Cuál es la capital de Colombia?", opciones: ["Medellín", "Bogotá", "Cali"], correcta: 1 },
            { texto: "¿En qué continente está Colombia?", opciones: ["América", "Europa", "Asia"], correcta: 0 },
            { texto: "¿Cuántos colores tiene la bandera de Colombia?", opciones: ["2", "4", "3"], correcta: 2 }
        ]
    },
    lenguaje: {
        titulo: "📖 Lenguaje",
        preguntas: [
            { texto: "¿Cuál palabra está bien escrita?", opciones: ["Casa", "Kasa", "Cassa"], correcta: 0 },
            { texto: "¿Cuántas vocales tiene el abecedario?", opciones: ["4", "5", "6"], correcta: 1 },
            { texto: "¿Cuál es el plural de 'lápiz'?", opciones: ["Lápices", "Lápizes", "Lápiz"], correcta: 0 }
        ]
    }
};

// ===== Elementos de la página =====
const seccionLogin = document.getElementById("login");
const seccionRegistro = document.getElementById("registro");
const seccionModulos = document.getElementById("modulos");
const seccionJuego = document.getElementById("juego");

const formLogin = document.getElementById("formLogin");
const formRegistro = document.getElementById("formRegistro");
const mensajeLogin = document.getElementById("mensajeLogin");
const mensajeRegistro = document.getElementById("mensajeRegistro");
const bienvenida = document.getElementById("bienvenida");

const tituloJuego = document.getElementById("tituloJuego");
const puntajeElemento = document.getElementById("puntaje");
const preguntaElemento = document.getElementById("pregunta");
const opcionesElemento = document.getElementById("opciones");
const resultadoElemento = document.getElementById("resultado");

let juegoActual = null;
let indicePregunta = 0;
let puntaje = 0;

// ===== Usuarios guardados en el navegador (localStorage) =====
function obtenerUsuarios() {
    const guardados = localStorage.getItem("usuariosAprendeJugando");
    return guardados ? JSON.parse(guardados) : [];
}

function guardarUsuarios(usuarios) {
    localStorage.setItem("usuariosAprendeJugando", JSON.stringify(usuarios));
}

// ===== Cambiar entre login y registro =====
document.getElementById("irRegistro").addEventListener("click", function (evento) {
    evento.preventDefault();
    mensajeLogin.textContent = "";
    seccionLogin.classList.add("oculto");
    seccionRegistro.classList.remove("oculto");
});

document.getElementById("irLogin").addEventListener("click", function (evento) {
    evento.preventDefault();
    mensajeRegistro.textContent = "";
    seccionRegistro.classList.add("oculto");
    seccionLogin.classList.remove("oculto");
});

// ===== Registrar usuario =====
formRegistro.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nombre = document.getElementById("regNombre").value.trim();
    const grado = document.getElementById("regGrado").value;
    const usuario = document.getElementById("regUsuario").value.trim();
    const contrasena = document.getElementById("regContrasena").value.trim();
    const confirmar = document.getElementById("regConfirmar").value.trim();

    if (nombre === "" || grado === "" || usuario === "" || contrasena === "" || confirmar === "") {
        mensajeRegistro.textContent = "Debes completar todos los campos.";
        return;
    }

    if (contrasena.length < 4) {
        mensajeRegistro.textContent = "La contraseña debe tener mínimo 4 caracteres.";
        return;
    }

    if (contrasena !== confirmar) {
        mensajeRegistro.textContent = "Las contraseñas no coinciden.";
        return;
    }

    const usuarios = obtenerUsuarios();
    const yaExiste = usuarios.some(function (u) {
        return u.usuario.toLowerCase() === usuario.toLowerCase();
    });

    if (yaExiste) {
        mensajeRegistro.textContent = "Ese usuario ya existe, elige otro.";
        return;
    }

    usuarios.push({ nombre: nombre, grado: grado, usuario: usuario, contrasena: contrasena });
    guardarUsuarios(usuarios);

    formRegistro.reset();
    mensajeRegistro.textContent = "";
    seccionRegistro.classList.add("oculto");
    seccionLogin.classList.remove("oculto");
    mensajeLogin.textContent = "¡Registro exitoso! Ahora puedes ingresar. ✅";
});

// ===== Login =====
formLogin.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();

    if (usuario === "" || contrasena === "") {
        mensajeLogin.textContent = "Debes escribir usuario y contraseña.";
        return;
    }

    const encontrado = obtenerUsuarios().find(function (u) {
        return u.usuario.toLowerCase() === usuario.toLowerCase() && u.contrasena === contrasena;
    });

    if (!encontrado) {
        mensajeLogin.textContent = "Usuario o contraseña incorrectos.";
        return;
    }

    mensajeLogin.textContent = "";
    bienvenida.textContent = "¡Hola, " + encontrado.nombre + "! 👋 (" + encontrado.grado + ")";
    seccionLogin.classList.add("oculto");
    seccionModulos.classList.remove("oculto");
    formLogin.reset();
});

// ===== Cerrar sesión =====
document.getElementById("btnSalir").addEventListener("click", function () {
    seccionModulos.classList.add("oculto");
    seccionLogin.classList.remove("oculto");
});

// ===== Elegir un módulo =====
document.querySelectorAll(".btn-modulo").forEach(function (boton) {
    boton.addEventListener("click", function () {
        const materia = boton.dataset.materia;
        juegoActual = juegos[materia];
        indicePregunta = 0;
        puntaje = 0;

        tituloJuego.textContent = juegoActual.titulo;
        seccionModulos.classList.add("oculto");
        seccionJuego.classList.remove("oculto");
        mostrarPregunta();
    });
});

// ===== Mostrar una pregunta =====
function mostrarPregunta() {
    resultadoElemento.textContent = "";
    opcionesElemento.innerHTML = "";

    if (indicePregunta >= juegoActual.preguntas.length) {
        preguntaElemento.textContent = "🎉 ¡Terminaste el juego!";
        puntajeElemento.textContent =
            "Puntaje final: " + puntaje + " de " + juegoActual.preguntas.length;
        return;
    }

    const pregunta = juegoActual.preguntas[indicePregunta];
    puntajeElemento.textContent = "Puntaje: " + puntaje;
    preguntaElemento.textContent = pregunta.texto;

    pregunta.opciones.forEach(function (texto, indice) {
        const boton = document.createElement("button");
        boton.textContent = texto;
        boton.addEventListener("click", function () {
            responder(indice, boton);
        });
        opcionesElemento.appendChild(boton);
    });
}

// ===== Revisar la respuesta =====
function responder(indiceElegido, boton) {
    const pregunta = juegoActual.preguntas[indicePregunta];
    const botones = opcionesElemento.querySelectorAll("button");

    botones.forEach(function (b) {
        b.disabled = true;
    });

    if (indiceElegido === pregunta.correcta) {
        boton.classList.add("correcta");
        resultadoElemento.textContent = "¡Correcto! ⭐";
        puntaje++;
    } else {
        boton.classList.add("incorrecta");
        botones[pregunta.correcta].classList.add("correcta");
        resultadoElemento.textContent = "Ups, intenta con la siguiente 💪";
    }

    indicePregunta++;
    setTimeout(mostrarPregunta, 1500);
}

// ===== Volver a los módulos =====
document.getElementById("btnVolver").addEventListener("click", function () {
    seccionJuego.classList.add("oculto");
    seccionModulos.classList.remove("oculto");
});
