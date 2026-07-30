const btnHamburguesa = document.getElementById("btn-hamburguesa");
const menuNavegacion = document.getElementById("menu-navegacion");
const enlacesMenu = document.querySelectorAll("#menu-navegacion a");
const imgFondo = document.getElementById("logo");
const btnInicio = document.getElementById("btn-inicio");

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
    // Oculta el menú desplegable
    menuNavegacion.classList.add("oculto");
    // Animación hacia el inicio
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});



