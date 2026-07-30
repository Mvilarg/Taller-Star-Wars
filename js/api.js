
const API_URL = "https://swapi.info/api/people";

async function obtenerPersonajes(busqueda = "") {
  try {
    const url = busqueda 
      ? `${API_URL}?search=${encodeURIComponent(busqueda)}` 
      : API_URL;

    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error(`Error en la petición: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    return datos; 

  } catch (error) {
    console.error("Error al obtener personajes:", error);
    throw error;
  }
}