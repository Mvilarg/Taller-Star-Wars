
const API_URL = "https://swapi.info/api/people";

function obtenerPersonajes() {
  return fetch(API_URL)
    .then(respuesta => {
      if (!respuesta.ok) {
        throw new Error(`Error en la petición: ${respuesta.status}`);
      }
      return respuesta.json();
    })
    .catch(error => {
      console.error("Error al obtener personajes:", error);
      throw error;
    });
}