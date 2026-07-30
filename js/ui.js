// ==========================================
// SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================
const btnHamburguesa = document.getElementById("btn-hamburguesa");
const menuNavegacion = document.getElementById("menu-navegacion");
const enlacesMenu = document.querySelectorAll("#menu-navegacion a");
const imgFondo = document.getElementById("logo");
const contenedorTarjetas = document.getElementById("lista-personajes");
const loader = document.getElementById("loader");

// LOS 3 CONTROLES
const inputBusqueda = document.getElementById("input-busqueda");
const filtroGenero = document.getElementById("filtro-genero");
const selectOrden = document.getElementById("select-orden");

// Arreglo para almacenar la lista original descargada de la API
let personajesGuardados = [];

// ==========================================
// CONTROL DE MENÚ Y NAVEGACIÓN
// ==========================================

btnHamburguesa.addEventListener("click", function() {
    menuNavegacion.classList.toggle("oculto");
});

function mostrarSeccion(idSeccion) {
    const secciones = document.querySelectorAll(".seccion-vista");
    secciones.forEach(sec => sec.classList.add("oculto"));

    const seccionActiva = document.getElementById(idSeccion);
    if (seccionActiva) {
        seccionActiva.classList.remove("oculto");
    }
}

enlacesMenu.forEach(function (enlace) {
    enlace.addEventListener("click", function (e) {
        e.preventDefault();
        menuNavegacion.classList.add("oculto");

        const href = enlace.getAttribute("href");
        const destino = href ? href.replace("#", "") : "inicio";

        if (destino === "inicio") {
            imgFondo.style.display = "block";
            mostrarSeccion("Fondo");
        } else {
            imgFondo.style.display = "none";
            mostrarSeccion(destino);

            if (destino === "personajes") {
                cargarVistaPersonajes();
            }
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});

// ==========================================
// RENDERIZADO Y API
// ==========================================

function renderizarPersonajes(listaPersonajes) {
    contenedorTarjetas.innerHTML = "";

    if (!listaPersonajes || listaPersonajes.length === 0) {
        contenedorTarjetas.innerHTML = "<p class='mensaje'>No se encontraron personajes que coincidan.</p>";
        return;
    }

    listaPersonajes.forEach((personaje) => {
        const id = personaje.url.split("/").filter(Boolean).pop();
        const urlImagen = `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`;

        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta");

        tarjeta.innerHTML = `
            <img src="${urlImagen}" alt="${personaje.name}" onerror="this.src='./assets/img/Logo-Starwars.png';">
            <h3>${personaje.name}</h3>
            <p><strong>Género:</strong> ${personaje.gender}</p>
            <p><strong>Altura:</strong> ${personaje.height} cm</p>
            <p><strong>Peso:</strong> ${personaje.mass} kg</p>
            <p><strong>Nacimiento:</strong> ${personaje.birth_year}</p>
            <button class="btn-detalle" data-id="${id}">Ver detalles</button>
        `;

        contenedorTarjetas.appendChild(tarjeta);
    });
}

async function cargarVistaPersonajes() {
    try {
        if (loader) loader.classList.remove("oculto");
        if (contenedorTarjetas) contenedorTarjetas.innerHTML = "";

        // Guardamos la copia original de la API
        personajesGuardados = await obtenerPersonajes();

        // Limpiamos los controles a sus valores por defecto
        if (inputBusqueda) inputBusqueda.value = "";
        if (filtroGenero) filtroGenero.value = "todos";
        if (selectOrden) selectOrden.value = "a-z";

        // Aplicamos renderizado inicial con orden A-Z
        aplicarFiltrosYOrden();

    } catch (error) {
        if (contenedorTarjetas) {
            contenedorTarjetas.innerHTML = "<p class='mensaje'>Error al cargar los personajes.</p>";
        }
    } finally {
        if (loader) loader.classList.add("oculto");
    }
}

// Función auxiliar para construir la URL de la imagen según el ID
function obtenerUrlImagen(urlPersonaje) {
    // Extraemos el número del final de la URL
    const id = urlPersonaje.split("/").filter(Boolean).pop();
    return `https://starwars-visualguide.com/assets/img/characters/${id}.jpg`;
}



// ==========================================
// LÓGICA DE BÚSQUEDA, FILTRO Y ORDEN (UNIFICADA)
// ==========================================

function aplicarFiltrosYOrden() {
    if (!personajesGuardados || personajesGuardados.length === 0) return;

    // Empezamos con una copia limpia de la lista original
    let resultado = [...personajesGuardados];

    // 1. FILTRO POR TECLADO (Búsqueda por texto)
    const texto = inputBusqueda ? inputBusqueda.value.toLowerCase().trim() : "";
    if (texto !== "") {
        resultado = resultado.filter(personaje => 
            personaje.name.toLowerCase().includes(texto)
        );
    }

    // 2. FILTRO POR GÉNERO
    const generoSeleccionado = filtroGenero ? filtroGenero.value : "todos";
    if (generoSeleccionado !== "todos") {
        resultado = resultado.filter(personaje => 
            personaje.gender.toLowerCase() === generoSeleccionado.toLowerCase()
        );
    }

    // 3. ORDENAMIENTO (A-Z / Z-A)
    const orden = selectOrden ? selectOrden.value : "a-z";
    if (orden === "a-z") {
        resultado.sort((a, b) => a.name.localeCompare(b.name));
    } else if (orden === "z-a") {
        resultado.sort((a, b) => b.name.localeCompare(a.name));
    }

    // Renderizamos el resultado final filtrado y ordenado
    renderizarPersonajes(resultado);
}

// Escuchadores de eventos (sin necesidad de botones)
if (inputBusqueda) {
    // Escucha cada tecla presionada en el teclado en tiempo real
    inputBusqueda.addEventListener("input", aplicarFiltrosYOrden);
}

if (filtroGenero) {
    // Escucha cuando cambias la opción del desplegable de género
    filtroGenero.addEventListener("change", aplicarFiltrosYOrden);
}

if (selectOrden) {
    // Escucha cuando cambias el orden A-Z o Z-A
    selectOrden.addEventListener("change", aplicarFiltrosYOrden);
}