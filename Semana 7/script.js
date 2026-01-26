//  Arreglo de productos 
const productos = [
  { nombre: "Laptop", precio: 1100, descripcion: "Equipo portátil para trabajo y estudio" },
  { nombre: "Teléfono", precio: 450, descripcion: "Smartphone con buena cámara" },
  { nombre: "Tablet", precio: 600, descripcion: "Ideal para lectura y entretenimiento" }
];

//  Selectores 
const lista = document.getElementById("listaProductos");
const btnAgregar = document.getElementById("btnAgregar");
const btnLimpiar = document.getElementById("btnLimpiar");

const inputNombre = document.getElementById("nombre");
const inputPrecio = document.getElementById("precio");
const inputDescripcion = document.getElementById("descripcion");

const msg = document.getElementById("msg");

//  Render dinámico 
function renderizarProductos() {
  lista.innerHTML = "";

  productos.forEach((p) => {
    const li = document.createElement("li");
    li.className = "item";

    li.innerHTML = `
      <div class="item-top">
        <span class="item-nombre">${p.nombre}</span>
        <span class="item-precio">$${Number(p.precio).toFixed(2)}</span>
      </div>
      <div class="item-desc">${p.descripcion}</div>
    `;

    lista.appendChild(li);
  });
}

//  Agregar producto 
function agregarProducto() {
  const nombre = inputNombre.value.trim();
  const precio = inputPrecio.value.trim();
  const descripcion = inputDescripcion.value.trim();

  if (!nombre || !precio || !descripcion) {
    msg.textContent = "Completa todos los campos para agregar un producto.";
    return;
  }

  productos.push({
    nombre,
    precio: Number(precio),
    descripcion
  });

  renderizarProductos();
  msg.textContent = "Producto agregado correctamente.";

  inputNombre.value = "";
  inputPrecio.value = "";
  inputDescripcion.value = "";
  inputNombre.focus();
}

//  Eventos 
btnAgregar.addEventListener("click", agregarProducto);

btnLimpiar.addEventListener("click", () => {
  inputNombre.value = "";
  inputPrecio.value = "";
  inputDescripcion.value = "";
  msg.textContent = "";
  inputNombre.focus();
});

// Enter para agregar (opcional, no rompe la consigna)
[inputNombre, inputPrecio, inputDescripcion].forEach((el) => {
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") agregarProducto();
  });
});

// Render inicial
document.addEventListener("DOMContentLoaded", renderizarProductos);
