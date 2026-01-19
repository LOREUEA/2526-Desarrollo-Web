// 1) FORMULARIO - SELECTORES

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

// Regex general email
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Dominios permitidos (requisito del ejercicio)
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
const hasSpecial = (s) => /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]~`]/.test(s);

function setValid(inputEl, errorEl) {
  inputEl.classList.remove("is-invalid");
  inputEl.classList.add("is-valid");
  errorEl.textContent = "";
}

function setInvalid(inputEl, errorEl, message) {
  inputEl.classList.remove("is-valid");
  inputEl.classList.add("is-invalid");
  errorEl.textContent = message;
}

function validateNombre() {
  const v = nombre.value.trim();

  // Solo letras y espacios (incluye tildes y ñ)
  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

  if (v.length < 3) {
    setInvalid(nombre, errorNombre, "El nombre debe tener al menos 3 caracteres.");
    return false;
  }
  if (!soloLetras.test(v)) {
    setInvalid(nombre, errorNombre, "El nombre no debe contener números ni símbolos.");
    return false;
  }

  setValid(nombre, errorNombre);
  return true;
}

function validateCorreo() {
  const v = correo.value.trim().toLowerCase();

  if (!emailPattern.test(v)) {
    setInvalid(correo, errorCorreo, "Correo no válido. Ej: usuario@dominio.com");
    return false;
  }

  const dominio = v.split("@")[1] || "";
  if (!dominiosPermitidos.has(dominio)) {
    setInvalid(correo, errorCorreo, "Solo se aceptan Gmail, Outlook, Hotmail o Yahoo.");
    return false;
  }

  setValid(correo, errorCorreo);
  return true;
}

function validatePassword() {
  const v = password.value;

  if (v.length < 8) {
    setInvalid(password, errorPassword, "Debe tener mínimo 8 caracteres.");
    return false;
  }
  if (!hasNumber(v)) {
    setInvalid(password, errorPassword, "Debe incluir al menos un número.");
    return false;
  }
  if (!hasSpecial(v)) {
    setInvalid(password, errorPassword, "Debe incluir al menos un carácter especial.");
    return false;
  }

  setValid(password, errorPassword);
  return true;
}

function validateConfirm() {
  // Primero asegurar password válida
  if (!validatePassword()) {
    setInvalid(confirmPassword, errorConfirm, "Primero ingresa una contraseña válida.");
    return false;
  }

  if (confirmPassword.value !== password.value || confirmPassword.value.length === 0) {
    setInvalid(confirmPassword, errorConfirm, "Las contraseñas no coinciden.");
    return false;
  }

  setValid(confirmPassword, errorConfirm);
  return true;
}

function validateEdad() {
  const vStr = edad.value.trim();

  if (vStr.length === 0) {
    setInvalid(edad, errorEdad, "Ingresa tu edad.");
    return false;
  }

  // Exactamente 2 dígitos
  if (!/^\d{2}$/.test(vStr)) {
    setInvalid(edad, errorEdad, "La edad debe tener exactamente 2 dígitos (ej. 18).");
    return false;
  }

  const v = parseInt(vStr, 10);
  if (v < 18) {
    setInvalid(edad, errorEdad, "Debes ser mayor o igual a 18 años.");
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

// Restricción de entrada: edad solo 2 dígitos (mientras escribe)
if (edad) {
  edad.addEventListener("input", () => {
    edad.value = edad.value.replace(/\D/g, "").slice(0, 2);
  });
}

// Eventos en tiempo real (input)
if (form) {
  [nombre, correo, password, confirmPassword, edad].forEach((el) => {
    el.addEventListener("input", () => {
      successMsg.textContent = "";
      validateAll();
    });
  });

  // Submit
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (validateAll()) {
      successMsg.textContent = "✅ Validación exitosa. Formulario correcto.";
      alert("Validación exitosa. ¡Formulario correcto!");
    } else {
      successMsg.textContent = "❌ Revisa los campos marcados en rojo.";
    }
  });

  // Reset
  form.addEventListener("reset", () => {
    [nombre, correo, password, confirmPassword, edad].forEach((el) => {
      el.classList.remove("is-valid", "is-invalid");
    });

    [errorNombre, errorCorreo, errorPassword, errorConfirm, errorEdad].forEach((e) => {
      e.textContent = "";
    });

    successMsg.textContent = "";
    btnEnviar.disabled = true;
  });
}

// 2) GALERIA INTERACTIVA (TU CODIGO, ORDENADO)
const inputUrl = document.getElementById("imgUrl");
const btnAgregar = document.getElementById("btnAgregar");
const btnEliminar = document.getElementById("btnEliminar");
const galeria = document.getElementById("galeriaGrid");

let imagenSeleccionada = null;

// Validación simple: URL de imagen (evita basura)
function esUrlImagen(url) {
  try {
    const u = new URL(url);
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(u.pathname);
  } catch {
    return false;
  }
}

function agregarImagen(url) {
  const img = document.createElement("img");
  img.src = url;
  img.alt = "Imagen de la galería";
  img.classList.add("galeria-item");

  img.addEventListener("click", () => {
    document.querySelectorAll(".galeria-item").forEach((i) =>
      i.classList.remove("seleccionada")
    );

    img.classList.add("seleccionada");
    imagenSeleccionada = img;
  });

  galeria.appendChild(img);
}

// Botón Agregar
if (btnAgregar && inputUrl && galeria) {
  btnAgregar.addEventListener("click", () => {
    const url = inputUrl.value.trim();
    if (!url) return;

    // Si no termina en .jpg/.png etc, igual puedes permitirlo,
    // pero esto ayuda a evitar errores de carga en la práctica.
    if (!esUrlImagen(url)) {
      alert("Ingresa una URL válida de imagen (jpg, png, gif, webp).");
      return;
    }

    agregarImagen(url);
    inputUrl.value = "";
    inputUrl.focus();
  });
}

// Botón Eliminar
if (btnEliminar) {
  btnEliminar.addEventListener("click", () => {
    if (imagenSeleccionada) {
      imagenSeleccionada.remove();
      imagenSeleccionada = null;
    }
  });
}

// Tecla Supr/Delete para eliminar
document.addEventListener("keydown", (e) => {
  if (e.key === "Delete" || e.key === "Backspace") {
    if (imagenSeleccionada) {
      imagenSeleccionada.remove();
      imagenSeleccionada = null;
    }
  }
});

// Cargar imágenes iniciales
const imagenesIniciales = [
  "https://msmk.university/wp-content/uploads/2024/08/65dcc7dc0e3b99757115ca4b_aprender-trabajar-inteligencia-artificial.webp",
  "https://iasolver.es/wp-content/uploads/2021/03/que-es-la-inteligencia-artificial.jpeg",
  "https://www.esneca.com/wp-content/uploads/evolucion-inteligencia-artificial-1200x900.jpg",
];

window.addEventListener("DOMContentLoaded", () => {
  if (!galeria) return;
  imagenesIniciales.forEach((url) => agregarImagen(url));
});
