const btnHamburguesa = document.getElementById("btn-hamburguesa");
const menuNavegacion = document.getElementById("menu-navegacion");
const enlacesMenu = document.querySelectorAll("#menu-navegacion a");
const imgFondo = document.getElementById("logo");
const btnInicio = document.getElementById("btn-inicio");
const secPersonajes = document.getElementById("personajes");

// Abrir / Cerrar menú hamburguesa
btnHamburguesa.addEventListener("click", function() {
    menuNavegacion.classList.toggle("oculto");
});

// Evento para los enlaces del menú
enlacesMenu.forEach(function (enlace) {
    enlace.addEventListener("click", function () {
        menuNavegacion.classList.add("oculto");
        if (enlace !== btnInicio) {
            imgFondo.style.display = "none";
        }

    });
});

// Evento  para el botón INICIO
btnInicio.addEventListener("click", function (e) {
    e.preventDefault(); 

    // muestra la imagen
    imgFondo.style.display = "block";
    // oculta seccion personajes
    secPersonajes.classList.add("oculto");
    // Oculta el menú desplegable
    menuNavegacion.classList.add("oculto");

    // Animación hacia el inicio
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Función para cambiar de sección
function mostrarSeccion(idSeccion) {
    // 1. Ocultar todas las secciones
    const secciones = document.querySelectorAll(".seccion-vista");
    secciones.forEach(sec => sec.classList.add("oculto"));

    // 2. Mostrar la sección seleccionada
    const seccionActiva = document.getElementById(idSeccion);
    if (seccionActiva) {
        seccionActiva.classList.remove("oculto");
    }

    
}

// Actualización del evento para los enlaces del menú
enlacesMenu.forEach(function (enlace) {
    enlace.addEventListener("click", function (e) {
        e.preventDefault();
        menuNavegacion.classList.add("oculto");

        const destino = enlace.getAttribute("href").replace("#", "");

        if (destino === "inicio") {
            imgFondo.style.display = "block";
            mostrarSeccion("Fondo");
        } else {
            imgFondo.style.display = "none";
            mostrarSeccion(destino);
        }

        window.scrollTo({
                top: 0,
                behavior: "smooth" // "smooth" para desplazamiento suave, o "instant" si quieres que sea de golpe
            });
        
    });
});


