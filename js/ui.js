// ==========================================
// 1. ELEMENTOS DEL DOM
// ==========================================
const btnHamburguesa = document.getElementById("btn-hamburguesa");
const menuNavegacion = document.getElementById("menu-navegacion");
const enlacesMenu = document.querySelectorAll("#menu-navegacion a");
const imgFondo = document.getElementById("logo");

const contenedorTarjetas = document.getElementById("lista-personajes");
const loader = document.getElementById("loader");

const inputBusqueda = document.getElementById("input-busqueda");
const filtroGenero = document.getElementById("filtro-genero");
const selectOrden = document.getElementById("select-orden");

const panelDetalle = document.getElementById("panel-detalle");
const btnCerrarPanel = document.getElementById("btn-cerrar-panel");
const detalleNombre = document.getElementById("detalle-nombre");
const detalleInfo = document.getElementById("detalle-info");

// Guardará la lista original de la API
let personajesGuardados = [];

// ==========================================
// 2. NAVEGACIÓN Y MENÚ
// ==========================================
btnHamburguesa.addEventListener("click", () => {
    menuNavegacion.classList.toggle("oculto");
});

function mostrarSeccion(idSeccion) {
    const secciones = document.querySelectorAll(".seccion-vista");
    secciones.forEach(sec => sec.classList.add("oculto"));

    const seccionActiva = document.getElementById(idSeccion);
    if (seccionActiva) seccionActiva.classList.remove("oculto");
}

enlacesMenu.forEach(enlace => {
    enlace.addEventListener("click", (e) => {
        e.preventDefault();
        menuNavegacion.classList.add("oculto");

        const destino = enlace.getAttribute("href").replace("#", "");

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

        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});

// ==========================================
// 3. CARGA Y FILTRADO
// ==========================================
async function cargarVistaPersonajes() {
    try {
        if (loader) loader.classList.remove("oculto");
        contenedorTarjetas.innerHTML = "";

        // Petición a la API mediante la función de api.js
        personajesGuardados = await obtenerPersonajes();

        // Reseteamos los filtros a sus valores iniciales
        if (inputBusqueda) inputBusqueda.value = "";
        if (filtroGenero) filtroGenero.value = "todos";
        if (selectOrden) selectOrden.value = "a-z";

        aplicarFiltros();

    } catch (error) {
        contenedorTarjetas.innerHTML = "<p class='mensaje'>Error al cargar los personajes.</p>";
    } finally {
        if (loader) loader.classList.add("oculto");
    }
}

function aplicarFiltros() {
    let lista = [...personajesGuardados];

    // 1. Buscador por texto
    const texto = inputBusqueda.value.toLowerCase().trim();
    if (texto) {
        lista = lista.filter(p => p.name.toLowerCase().includes(texto));
    }

    // 2. Filtro por género
    const genero = filtroGenero.value;
    if (genero !== "todos") {
        lista = lista.filter(p => p.gender.toLowerCase() === genero);
    }

    // 3. Ordenamiento
    if (selectOrden.value === "a-z") {
        lista.sort((a, b) => a.name.localeCompare(b.name));
    } else {
        lista.sort((a, b) => b.name.localeCompare(a.name));
    }

    renderizarPersonajes(lista);
}

// Escuchamos los cambios en tiempo real
inputBusqueda.addEventListener("input", aplicarFiltros);
filtroGenero.addEventListener("change", aplicarFiltros);
selectOrden.addEventListener("change", aplicarFiltros);

// ==========================================
// 4. RENDERIZADO DE TARJETAS (SIN IMÁGENES)
// ==========================================
function renderizarPersonajes(lista) {
    contenedorTarjetas.innerHTML = "";

    if (lista.length === 0) {
        contenedorTarjetas.innerHTML = "<p class='mensaje'>No se encontraron resultados.</p>";
        return;
    }

    lista.forEach(personaje => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta");

        tarjeta.innerHTML = `
            <h3>${personaje.name}</h3>
            <p><strong>Género:</strong> ${personaje.gender}</p>
            <p><strong>Altura:</strong> ${personaje.height} cm</p>
            <p><strong>Peso:</strong> ${personaje.mass} kg</p>
            <p><strong>Nacimiento:</strong> ${personaje.birth_year}</p>
            <button class="btn-detalle" data-nombre="${personaje.name}">Ver detalles</button>
        `;

        contenedorTarjetas.appendChild(tarjeta);
    });
}

// ==========================================
// 5. VER DETALLES (PANEL LATERAL)
// ==========================================
contenedorTarjetas.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-detalle")) {
        const nombrePersonaje = e.target.getAttribute("data-nombre");
        const personaje = personajesGuardados.find(p => p.name === nombrePersonaje);

        if (personaje) {
            mostrarPanelDetalle(personaje);
        }
    }
});

function mostrarPanelDetalle(personaje) {
    detalleNombre.textContent = personaje.name;
    
    detalleInfo.innerHTML = `
        <p><strong>Color de Ojos:</strong> ${personaje.eye_color}</p>
        <p><strong>Color de Pelo:</strong> ${personaje.hair_color}</p>
        <p><strong>Color de Piel:</strong> ${personaje.skin_color}</p>
        <p><strong>Año de Nacimiento:</strong> ${personaje.birth_year}</p>
        <p><strong>Películas en las que aparece:</strong> ${personaje.films ? personaje.films.length : 0}</p>
        <p><strong>Naves pilotadas:</strong> ${personaje.starships ? personaje.starships.length : 0}</p>
        <p><strong>Vehículos:</strong> ${personaje.vehicles ? personaje.vehicles.length : 0}</p>
    `;

    panelDetalle.classList.remove("cerrado");
}

btnCerrarPanel.addEventListener("click", () => {
    panelDetalle.classList.add("cerrado");
});