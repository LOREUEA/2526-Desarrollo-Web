// ====== Selectores ======
const inputUrl = document.getElementById("imgUrl");
const btnAgregar = document.getElementById("btnAgregar");
const btnEliminar = document.getElementById("btnEliminar");
const galeria = document.getElementById("galeriaGrid");

let imagenSeleccionada = null;

// ====== Función para agregar imagen ======
function agregarImagen(url) {
  const img = document.createElement("img");
  img.src = url;
  img.alt = "Imagen de la galería";
  img.classList.add("galeria-item");

  // Evento click: seleccionar
  img.addEventListener("click", () => {
    // Quitar selección anterior
    document.querySelectorAll(".galeria-item").forEach((i) => i.classList.remove("seleccionada"));

    // Marcar la nueva
    img.classList.add("seleccionada");
    imagenSeleccionada = img;
  });

  galeria.appendChild(img);
}

// ====== Botón Agregar ======
btnAgregar.addEventListener("click", () => {
  const url = inputUrl.value.trim();

  if (!url) return;

  agregarImagen(url);
  inputUrl.value = "";
  inputUrl.focus();
});

// ====== Botón Eliminar ======
btnEliminar.addEventListener("click", () => {
  if (imagenSeleccionada) {
    imagenSeleccionada.remove();
    imagenSeleccionada = null;
  }
});

// ====== Tecla Supr/Delete para eliminar ======
document.addEventListener("keydown", (e) => {
  if (e.key === "Delete" || e.key === "Backspace") {
    if (imagenSeleccionada) {
      imagenSeleccionada.remove();
      imagenSeleccionada = null;
    }
  }
});

// ====== Cargar imágenes iniciales ======
const imagenesIniciales = [
  "https://msmk.university/wp-content/uploads/2024/08/65dcc7dc0e3b99757115ca4b_aprender-trabajar-inteligencia-artificial.webp",
  "https://iasolver.es/wp-content/uploads/2021/03/que-es-la-inteligencia-artificial.jpeg",
  "https://www.esneca.com/wp-content/uploads/evolucion-inteligencia-artificial-1200x900.jpg"
];

window.addEventListener("DOMContentLoaded", () => {
  imagenesIniciales.forEach((url) => agregarImagen(url));
});
