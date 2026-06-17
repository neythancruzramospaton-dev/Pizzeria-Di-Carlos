// js/auth.js

function supabaseAuthDisponible() {
  return typeof db !== "undefined" && db?.auth;
}

function mensajeSupabaseNoDisponible() {
  return "No se pudo conectar con Supabase. Revisa tu conexión a internet y recarga la página.";
}

// Controla que las peticiones no se queden colgadas si falla la red
function conTiempoLimite(promesa, mensaje, ms = 8000) {
  return Promise.race([
    promesa,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(mensaje)), ms);
    }),
  ]);
}

// ── 1. REGISTRO DE USUARIOS ────────────────────────────────
async function registrarUsuario(nombre, email, password) {
  try {
    if (!supabaseAuthDisponible()) {
      return { ok: false, error: mensajeSupabaseNoDisponible() };
    }

    // A) Registro en la autenticación central de Supabase (auth.users)
    const { data, error } = await conTiempoLimite(
      db.auth.signUp({ email, password }),
      "El registro tardó demasiado. Revisa tu conexión o la configuración de Supabase.",
    );

    if (error) {
      return { ok: false, error: error.message };
    }

    if (!data?.user?.id) {
      return { ok: false, error: "Supabase no devolvió un usuario válido." };
    }

    // B) CORRECCIÓN: Inserción completa incluyendo el 'email' requerido por la Base de Datos
    const { error: perfilError } = await conTiempoLimite(
      db.from("profiles").insert({
        id: data.user.id,
        nombre: nombre,
        email: email, // 👈 ¡Faltaba esta línea obligatoria!
        rol: "cliente", // Rol asignado automáticamente por defecto
      }),
      "Se creó la cuenta de autenticación, pero el perfil en la base de datos tardó en responder.",
    );

    if (perfilError) {
      console.error("Error al insertar en la tabla profiles:", perfilError);
      return {
        ok: false,
        error: "Error en la base de datos de perfiles: " + perfilError.message,
      };
    }

    return { ok: true, data };
  } catch (err) {
    console.error("Error crítico en registrarUsuario:", err);
    return { ok: false, error: err.message };
  }
}

// ── 2. INICIO DE SESIÓN ─────────────────────────────────────
async function iniciarSesion(email, password) {
  try {
    if (!supabaseAuthDisponible()) {
      return { ok: false, error: mensajeSupabaseNoDisponible() };
    }

    const { data, error } = await conTiempoLimite(
      db.auth.signInWithPassword({ email, password }),
      "El inicio de sesión tardó demasiado. Revisa tu conexión.",
    );

    if (error) {
      return { ok: false, error: error.message };
    }

    const usuario = data?.user;
    if (!usuario) {
      return {
        ok: false,
        error: "No se pudieron obtener los datos del usuario.",
      };
    }

    // 🌟 NUEVO: Buscar el perfil y rol real en tu tabla 'profiles'
    const { data: perfil, error: perfilError } = await db
      .from("profiles")
      .select("rol, nombre")
      .eq("id", usuario.id)
      .single();

    const rolAsignado = !perfilError && perfil ? perfil.rol : "cliente";
    const nombreReal = !perfilError && perfil ? perfil.nombre : "Usuario";

    const datosSesion = {
      id: usuario.id,
      email: usuario.email,
      nombre: nombreReal,
      rol: rolAsignado,
    };

    localStorage.setItem("sesion_pizzeria", JSON.stringify(datosSesion));
    console.log("Sesión guardada:", datosSesion);

    return { ok: true, usuario: datosSesion };
  } catch (err) {
    console.error("Error crítico en iniciarSesion:", err);
    return { ok: false, error: err.message };
  }
}

// ── 3. CERRAR SESIÓN ────────────────────────────────────────
async function cerrarSesion() {
  if (supabaseAuthDisponible()) {
    await db.auth.signOut();
  }
  localStorage.removeItem("usuario_sesion");
  // Redirige al inicio y recarga el estado visual
  window.location.reload();
}

// ── 4. ACTUALIZACIÓN DINÁMICA DEL NAVBAR ────────────────────
function actualizarNavbar(usuario) {
  // Elimina botones anteriores de inicio de sesión o perfiles antiguos
  document.querySelectorAll(".auth-item").forEach((el) => el.remove());
  const navLinks = document.getElementById("navLinks");

  if (!navLinks) return;

  if (usuario) {
    // Verificar si el rol permite ver el panel de administración
    const esCajero = usuario.rol === "cajero" || usuario.rol === "admin";
    const botonAdminHTML = esCajero
      ? `<li><a href="#" class="nav-link auth-item" data-view="cajero">🛠️ Panel Cajero</a></li>`
      : "";

    // Insertar el botón de administración si aplica, antes del saludo
    if (esCajero) {
      navLinks.insertAdjacentHTML("beforeend", botonAdminHTML);
    }

    // Si el usuario inició sesión, muestra saludo y botón Salir
    navLinks.innerHTML += `
      <li class="auth-item">
        <span class="nav-user" style="color: var(--orange-lt); font-weight:600; padding: 10px 15px; display: inline-block;">
          🍕 Hola, ${usuario.nombre}
        </span>
      </li>
      <li class="auth-item">
        <a href="#" id="btn-logout" class="nav-link">Salir</a>
      </li>
    `;

    // Asignar evento al botón de cerrar sesión recién creado
    setTimeout(() => {
      document.getElementById("btn-logout")?.addEventListener("click", (e) => {
        e.preventDefault();
        cerrarSesion();
      });
    }, 100);
  } else {
    // Si no hay sesión activa, muestra la pestaña para Ingresar/Registrarse
    navLinks.innerHTML += `
      <li class="auth-item">
        <a href="#" class="nav-link" data-view="auth">Ingresar</a>
      </li>
    `;
  }
}

// ── 5. ESCUCHAR LOS FORMULARIOS AL CARGAR EL DOM ────────────
document.addEventListener("DOMContentLoaded", () => {
  // Verificar si hay una sesión guardada localmente para no perderla al recargar
  const sesionGuardada = localStorage.getItem("usuario_sesion");
  if (sesionGuardada) {
    try {
      const usuario = JSON.parse(sesionGuardada);
      actualizarNavbar(usuario);
    } catch (e) {
      localStorage.removeItem("usuario_sesion");
    }
  } else {
    actualizarNavbar(null);
  }

  // --- INTERCAMBIO VISUAL DE PESTAÑAS (TABS) ---
  const tabs = document.querySelectorAll(".auth-tab");
  const panels = document.querySelectorAll(".auth-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));

      tab.classList.add("active");
      const targetPanel = document.getElementById(
        `auth-panel-${tab.dataset.tab}`,
      );
      if (targetPanel) targetPanel.classList.add("active");
    });
  });

  // --- ESCUCHA DEL FORMULARIO DE INICIO DE SESIÓN ---
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;
      const errorMsg = document.getElementById("login-error");
      const successMsg = document.getElementById("login-success");
      const btnSubmit = loginForm.querySelector('button[type="submit"]');

      errorMsg.textContent = "";
      successMsg.textContent = "";
      btnSubmit.disabled = true;
      btnSubmit.textContent = "Ingresando...";

      // Autenticar en Supabase Auth
      const { data, error } = await db.auth.signInWithPassword({
        email,
        password,
      });

      btnSubmit.disabled = false;
      btnSubmit.textContent = "Iniciar Sesión";

      if (error) {
        errorMsg.textContent = "Error: " + error.message;
        return;
      }

      // 🌟 AQUÍ ESTABA EL CAMBIO COMPATIBLE: Obtener el rol desde la tabla 'usuarios'
      // 🌟 CORRECCIÓN: Obtener el rol desde la tabla correcta 'profiles'
      const { data: usuarioBD, error: errBD } = await db
        .from("profiles") // Cambiado de 'usuarios' a 'profiles'
        .select("nombre, rol")
        .eq("id", data.user.id)
        .single();

      const rolAsignado = usuarioBD?.rol || "cliente";
      const nombreAsignado = usuarioBD?.nombre || data.user.email.split("@")[0];

      const datosSesion = {
        id: data.user.id,
        email: data.user.email,
        nombre: nombreAsignado,
        rol: rolAsignado,
      };

      console.log("Sesión guardada:", datosSesion);
      localStorage.setItem("usuario_sesion", JSON.stringify(datosSesion));

      localStorage.setItem("usuario_sesion", JSON.stringify(datosSesion));
      successMsg.textContent = "¡Ingreso correcto! Redirigiendo...";

      setTimeout(() => {
        // Redirección SPA según rol
        if (rolAsignado === "cajero" || rolAsignado === "admin") {
          navegarA("cajero");
          window.location.reload(); // Recarga limpia para activar paneles de gestión
        } else {
          navegarA("home");
        }
      }, 1200);
    });
  }

  // --- ESCUCHA DEL FORMULARIO DE REGISTRO ---
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nombre = document.getElementById("reg-nombre").value.trim();
      const email = document.getElementById("reg-email").value.trim();
      const password = document.getElementById("reg-password").value;
      const errorMsg = document.getElementById("register-error");
      const successMsg = document.getElementById("register-success");
      const btnSubmit = registerForm.querySelector('button[type="submit"]');

      errorMsg.textContent = "";
      successMsg.textContent = "";

      if (password.length < 6) {
        errorMsg.textContent =
          "La contraseña debe tener al menos 6 caracteres.";
        return;
      }

      btnSubmit.disabled = true;
      btnSubmit.textContent = "Creando cuenta...";

      const res = await registrarUsuario(nombre, email, password);

      btnSubmit.disabled = false;
      btnSubmit.textContent = "Crear cuenta";

      if (!res.ok) {
        errorMsg.textContent = "Error: " + res.error;
      } else {
        successMsg.textContent =
          "¡Cuenta creada con éxito! Revisa tu correo o ingresa desde la pestaña 'Ingresar'.";
        registerForm.reset();
      }
    });
  }
});
