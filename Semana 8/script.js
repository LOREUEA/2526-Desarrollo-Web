// 1) FORMULARIO DE REGISTRO

// Selectores principales
const form = document.getElementById("registroForm");

const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const edad = document.getElementById("edad");

const errorNombre = document.getElementById("errorNombre");
const errorCorreo = document.getElementById("errorCorreo");
const errorPassword = document.getElementById("errorPassword");
const errorConfirm = document.getElementById("errorConfirm");
const errorEdad = document.getElementById("errorEdad");

const btnEnviar = document.getElementById("btnEnviar");
const successMsg = document.getElementById("successMsg");

// Modal Bootstrap (seguro)
let modalExito = null;
if (window.bootstrap && document.getElementById("modalExito")) {
  modalExito = new bootstrap.Modal(
    document.getElementById("modalExito")
  );
}

// Regex y reglas
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const dominiosPermitidos = new Set([
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "yahoo.com",
  "yahoo.es",
  "outlook.es",
  "hotmail.es",
]);

const hasNumber = (s) => /\d/.test(s);
const hasSpecial = (s) =>
  /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]~`]/.test(s);

// Helpers visuales
function setValid(input, error) {
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");
  error.textContent = "";
}

function setInvalid(input, error, msg) {
  input.classList.remove("is-valid");
  input.classList.add("is-invalid");
  error.textContent = msg;
}

// Validaciones individuales
function validateNombre() {
  const v = nombre.value.trim();
  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

  if (v.length < 3) {
    setInvalid(nombre, errorNombre, "Mínimo 3 caracteres.");
    return false;
  }
  if (!soloLetras.test(v)) {
    setInvalid(nombre, errorNombre, "Solo letras y espacios.");
    return false;
  }
  setValid(nombre, errorNombre);
  return true;
}

function validateCorreo() {
  const v = correo.value.trim().toLowerCase();

  if (!emailPattern.test(v)) {
    setInvalid(correo, errorCorreo, "Correo no válido.");
    return false;
  }

  const dominio = v.split("@")[1];
  if (!dominiosPermitidos.has(dominio)) {
    setInvalid(correo, errorCorreo, "Dominio no permitido.");
    return false;
  }

  setValid(correo, errorCorreo);
  return true;
}

function validatePassword() {
  const v = password.value;

  if (v.length < 8) {
    setInvalid(password, errorPassword, "Mínimo 8 caracteres.");
    return false;
  }
  if (!hasNumber(v)) {
    setInvalid(password, errorPassword, "Debe incluir un número.");
    return false;
  }
  if (!hasSpecial(v)) {
    setInvalid(password, errorPassword, "Debe incluir un símbolo.");
    return false;
  }

  setValid(password, errorPassword);
  return true;
}

function validateConfirm() {
  if (confirmPassword.value !== password.value || confirmPassword.value === "") {
    setInvalid(confirmPassword, errorConfirm, "Las contraseñas no coinciden.");
    return false;
  }
  setValid(confirmPassword, errorConfirm);
  return true;
}

function validateEdad() {
  const v = edad.value.trim();

  if (!/^\d{2}$/.test(v)) {
    setInvalid(edad, errorEdad, "Edad de 2 dígitos.");
    return false;
  }

  if (parseInt(v) < 18) {
    setInvalid(edad, errorEdad, "Edad mínima 18 años.");
    return false;
  }

  setValid(edad, errorEdad);
  return true;
}

function validateAll() {
  const ok =
    validateNombre() &&
    validateCorreo() &&
    validatePassword() &&
    validateConfirm() &&
    validateEdad();

  btnEnviar.disabled = !ok;
  return ok;
}

// Eventos del formulario
if (form) {
  [nombre, correo, password, confirmPassword, edad].forEach((el) => {
    el.addEventListener("input", () => {
      successMsg.innerHTML = "";
      validateAll();
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (validateAll()) {
      successMsg.innerHTML = `
        <div class="alert alert-success mt-3">
          Registro completado correctamente.
        </div>
      `;

      if (modalExito) modalExito.show();

      form.reset();
      btnEnviar.disabled = true;

      [nombre, correo, password, confirmPassword, edad].forEach((el) =>
        el.classList.remove("is-valid", "is-invalid")
      );
    } else {
      successMsg.innerHTML = `
        <div class="alert alert-danger mt-3">
          Revisa los campos marcados en rojo.
        </div>
      `;
    }
  });
}

// 2) GALERÍA INTERACTIVA

const inputUrl = document.getElementById("imgUrl");
const btnAgregar = document.getElementById("btnAgregar");
const btnEliminar = document.getElementById("btnEliminar");
const galeria = document.getElementById("galeriaGrid");

let imagenSeleccionada = null;

function esUrlImagen(url) {
  try {
    const u = new URL(url);
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(u.pathname);
  } catch {
    return false;
  }
}

function agregarImagen(url) {
  if (!galeria) return;

  const img = document.createElement("img");
  img.src = url;
  img.alt = "Imagen galería";
  img.className = "galeria-item";

  img.addEventListener("click", () => {
    document
      .querySelectorAll(".galeria-item")
      .forEach((i) => i.classList.remove("seleccionada"));

    img.classList.add("seleccionada");
    imagenSeleccionada = img;
  });

  galeria.appendChild(img);
}

if (btnAgregar && inputUrl) {
  btnAgregar.addEventListener("click", () => {
    const url = inputUrl.value.trim();
    if (!esUrlImagen(url)) return;

    agregarImagen(url);
    inputUrl.value = "";
  });
}

if (btnEliminar) {
  btnEliminar.addEventListener("click", () => {
    if (imagenSeleccionada) {
      imagenSeleccionada.remove();
      imagenSeleccionada = null;
    }
  });
}

// Imágenes iniciales
[
  "https://iasolver.es/wp-content/uploads/2021/03/que-es-la-inteligencia-artificial.jpeg",
  "https://www.esneca.com/wp-content/uploads/evolucion-inteligencia-artificial-1200x900.jpg",
].forEach(agregarImagen);
