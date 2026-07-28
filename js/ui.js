const btnHamburguesa = document.getElementById("btn-hamburguesa");
const menuNavegacion = document.getElementById("menu-navegacion");

btnHamburguesa.addEventListener("click", function(){
    menuNavegacion.classList.toggle("oculto");
});



