// js/auth.js
const supabaseClient = window.db || window.supabase;

document.addEventListener("DOMContentLoaded", () => {
  // --- LÓGICA DE TABS (INTERCAMBIAR VISUALMENTE ENTRE INGRESO Y REGISTRO) ---
  const tabs = document.querySelectorAll(".auth-tab");
  const panels = document.querySelectorAll(".auth-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));

      tab.classList.add("active");
      const targetPanelId = `auth-panel-${tab.dataset.tab}`;
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add("active");
      }
    });
  });

  // --- FORMULARIO DE INICIO DE SESIÓN (LOGIN - CORREGIDO) ---
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // CORRECCIÓN: Usar los IDs exactos que pusiste en el index.html
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;
      const errorMsg = document.getElementById("login-error");
      const successMsg = document.getElementById("login-success");
      const btnSubmit = loginForm.querySelector("button[type='submit']");

      errorMsg.textContent = "";
      successMsg.textContent = "";
      btnSubmit.disabled = true;
      btnSubmit.textContent = "Ingresando...";

      try {
        // 1. Intentar iniciar sesión en Supabase Auth
        const { data, error: authError } =
          await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
          });

        if (authError) {
          // Manejo de errores común (Credenciales inválidas, correo no verificado)
          errorMsg.textContent = "Error: " + authError.message;
          return;
        }

        // 2. Si el login es exitoso, obtener el rol asignado desde la tabla relacional 'profiles'
        if (data?.user) {
          successMsg.textContent = "¡Ingreso exitoso! Redirigiendo...";

          const { data: profile, error: profileError } = await supabaseClient
            .from("profiles")
            .select("rol, nombre")
            .eq("id", data.user.id)
            .maybeSingle();

          if (profileError) {
            console.error("Error al obtener el rol del perfil:", profileError);
          }

          // Guardar temporalmente datos clave o lanzar banderas de interfaz si es necesario
          console.log(
            `Usuario autenticado: ${profile?.nombre || "Invitado"} con Rol: ${profile?.rol || "cliente"}`,
          );

          // 3. REDIRECCIÓN SPA: Limpiar formulario y saltar a la vista Home automáticamente
          setTimeout(() => {
            loginForm.reset();
            successMsg.textContent = "";

            // Llama a la función global de navegación de tu app.js para mover la interfaz
            if (typeof window.navegarA === "function") {
              window.navegarA("home");
            } else {
              // Si no la encuentra global, forzamos el cambio de clases manualmente
              document
                .querySelectorAll(".view")
                .forEach((s) => s.classList.remove("active"));
              const target = document.getElementById("view-home");
              if (target) target.classList.add("active");
            }
          }, 1000);
        }
      } catch (err) {
        errorMsg.textContent =
          "Ocurrió un error inesperado al intentar ingresar.";
        console.error(err);
      } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Ingresar";
      }
    });
  }

  // --- FORMULARIO DE REGISTRO DE NUEVOS USUARIOS ---
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre = document.getElementById("reg-nombre").value.trim();
      const email = document.getElementById("reg-email").value.trim();
      const password = document.getElementById("reg-password").value;
      const errorMsg = document.getElementById("register-error");
      const successMsg = document.getElementById("register-success");

      errorMsg.textContent = "";
      successMsg.textContent = "";

      if (!nombre || !email || !password) {
        errorMsg.textContent = "Por favor, llena todos los campos.";
        return;
      }

      if (password.length < 6) {
        errorMsg.textContent =
          "La contraseña debe tener al menos 6 caracteres.";
        return;
      }

      const btnSubmit = registerForm.querySelector("button[type='submit']");
      btnSubmit.disabled = true;
      btnSubmit.textContent = "Creando cuenta...";

      try {
        // 1. Crear el usuario en el sistema de autenticación centralizado de Supabase
        const { data, error: authError } = await supabaseClient.auth.signUp({
          email: email,
          password: password,
        });

        if (authError) {
          errorMsg.textContent = "Error: " + authError.message;
          return;
        }

        // 2. Sincronizar e insertar los datos complementarios en la tabla relacional 'profiles'
        if (data?.user) {
          const { error: profileError } = await supabaseClient
            .from("profiles")
            .insert({
              id: data.user.id,
              nombre: nombre,
              email: email,
              rol: "cliente", // Asignación por defecto según especificación de guías
            });

          if (profileError) {
            console.error("Error al guardar el perfil:", profileError);
            errorMsg.textContent =
              "Usuario creado, pero hubo un problema al estructurar tus datos de perfil.";
            return;
          }

          successMsg.textContent =
            "¡Cuenta creada con éxito! Ya puedes ingresar desde la pestaña 'Ingresar'.";
          registerForm.reset();
        }
      } catch (err) {
        errorMsg.textContent = "Ocurrió un error inesperado en el registro.";
        console.error(err);
      } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Crear cuenta";
      }
    });
  }
});
