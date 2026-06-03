// ================================================
// PIZZERÍA DÍ CARLOS — app.js
// ================================================

// ── Navegación SPA ──────────────────────────────
const navLinks = document.querySelectorAll(".nav-link");
const navToggle = document.getElementById("navToggle");
const navLinksMenu = document.getElementById("navLinks");

function navegarA(vista) {
  document
    .querySelectorAll(".view")
    .forEach((s) => s.classList.remove("active"));
  const target = document.getElementById("view-" + vista);
  if (target) target.classList.add("active");
  navLinks.forEach((l) =>
    l.classList.toggle("active", l.dataset.view === vista),
  );
  navLinksMenu.classList.remove("open");
  navToggle.classList.remove("active");
}

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    if (link.dataset.view) navegarA(link.dataset.view);
  });
});

navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("active");
  navLinksMenu.classList.toggle("open");
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-view]");
  if (btn && !btn.classList.contains("nav-link")) {
    e.preventDefault();
    navegarA(btn.dataset.view);
  }
});

// ── Sabores de pizza ─────────────────────────────
const saboresPizza = [
  {
    id: "di-carlos",
    nombre: "Dí Carlos",
    descripcion: "Tiene jamón, salame y hongos frescos.",
    badge: "Especial",
    imagen: "img/DiCarlos.jpg",
  },
  {
    id: "bianca",
    nombre: "Bianca",
    descripcion: "Tiene salchicha, carne y aceitunas",
    badge: "Nuevo",
    imagen: "img/Bianca.jpg",
  },
  {
    id: "calabresa",
    nombre: "Calabresa",
    descripcion: "Tiene chorizo, carne, cebolla y locoto.",
    badge: null,
    imagen: "img/DiCarlos.jpg",
  },
  {
    id: "jardinera",
    nombre: "Jardinera",
    descripcion: "Tiene jamón, huevo, aceitunas y cebolla.",
    badge: null,
    imagen: "img/Jardinera.jpeg",
  },
  {
    id: "criollo",
    nombre: "Criollo",
    descripcion: "Tiene carne, choclo, cebolla y locoto.",
    badge: null,
    imagen: "img/Criollo.jpg",
  },
  {
    id: "española",
    nombre: "Española",
    descripcion: "Tiene chorizo, jamón, tomate y aceitunas.",
    badge: null,
    imagen: "img/Española.jpg",
  },
  {
    id: "americana",
    nombre: "Americana",
    descripcion: "Tiene jamón, tocino, tomate y pimentón.",
    badge: null,
    imagen: "img/DiCarlos.jpg",
  },
  {
    id: "napolitana",
    nombre: "Napolitana",
    descripcion: "Tiene jamón, tomate y aceitunas.",
    badge: null,
    imagen: "img/Napolitana.jpeg",
  },
  {
    id: "hawaiana",
    nombre: "Hawaiana",
    descripcion: "Tiene jamón y piña o durazno.",
    badge: null,
    imagen: "img/Hawaiana.jpg",
  },
  {
    id: "portuguesa",
    nombre: "Portuguesa",
    descripcion: "Tiene pollo, tocino, choclo y aceitunas.",
    badge: "Popular",
    imagen: "img/Portuguesa.jpg",
  },
  {
    id: "vegetariana",
    nombre: "Vegetariana",
    descripcion: "Tiene tomate, choclo, hongos, cebolla, pimentón y aceitunas.",
    badge: null,
    imagen: "img/DiCarlos.jpg",
  },
];

// ── 5 tamaños de pizza ───────────────────────────
const tamañosPizza = [
  { id: "personal", label: "Personal", porciones: 2, precio: 27 },
  { id: "pequeña", label: "Pequeña", porciones: 4, precio: 42 },
  { id: "mediana", label: "Mediana", porciones: 6, precio: 56 },
  { id: "familiar", label: "Familiar", porciones: 8, precio: 82 },
  { id: "extra_familiar", label: "Extra Familiar", porciones: 10, precio: 102 },
];

// ── Resto de productos ───────────────────────────
const productos = [
  {
    id: 20,
    nombre: "Lasaña",
    categoria: "pasta",
    descripcion: "Tiene salas bolognesa, pollo, jamón y queso mozzarella.",
    precio: 38,
    imagen: "img/Lasaña.jpg",
    badge: "Especial",
  },
  {
    id: 21,
    nombre: "Fetuccini",
    categoria: "pasta",
    descripcion:
      "Tiene salsa bechamel (blanca), jamón, pollo, tocino y queso parmesano.",
    precio: 27,
    imagen: "img/Fetuccini.jpg",
    badge: null,
  },
  {
    id: 30,
    nombre: "Salchipapa",
    categoria: "tipico",
    descripcion:
      "Salchicha jugosa con papas fritas crujientes, salsa especial de la casa",
    precio: 17,
    imagen: "img/Salchipapa.jpg",
    badge: "Popular",
  },
  {
    id: 31,
    nombre: "Pique Macho",
    categoria: "tipico",
    descripcion:
      "Carne, salchicha, locoto y papas fritas, el plato más contundente",
    precio: 36,
    imagen: "img/PiqueMacho.jpg",
    badge: "Popular",
  },
  {
    id: 32,
    nombre: "Hamburguesa",
    categoria: "tipico",
    descripcion:
      "Tiene carne, queso, porción de papa frita, cebolla, tomate y lechuga.",
    precio: 18,
    imagen: "img/Hamburguesa.jpg",
    badge: null,
  },
  {
    id: 40,
    nombre: "Platano Licuado",
    categoria: "bebida",
    descripcion: "Tiene platano y leche.",
    precio: 9,
    imagen: "img/Jugodeplatano.jpg",
    badge: null,
  },
  {
    id: 41,
    nombre: "Durazno Licuado",
    categoria: "bebida",
    descripcion: "Tiene durazno y leche.",
    precio: 9,
    imagen: "img/Jugodedurazno.jpg",
    badge: null,
  },
];

// ── Carrito ──────────────────────────────────────
let carrito = [];

function guardarCarrito() {
  localStorage.setItem("di_carlos_carrito", JSON.stringify(carrito));
}

function cargarCarrito() {
  const guardado = localStorage.getItem("di_carlos_carrito");
  if (guardado) carrito = JSON.parse(guardado);
}

function actualizarContador() {
  const total = carrito.reduce((sum, p) => sum + p.cantidad, 0);
  const badge = document.getElementById("cart-count");
  if (badge) {
    badge.textContent = total;
    badge.classList.remove("bump");
    void badge.offsetWidth;
    badge.classList.add("bump");
    setTimeout(() => badge.classList.remove("bump"), 300);
  }
}

function agregarAlCarrito(clave, nombre, precio, imagen, detalle) {
  const existente = carrito.find((p) => p.clave === clave);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ clave, nombre, precio, imagen, detalle, cantidad: 1 });
  }
  guardarCarrito();
  actualizarContador();
  renderizarCarrito();
}

function cambiarCantidad(clave, delta) {
  const item = carrito.find((p) => p.clave === clave);
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad <= 0) carrito = carrito.filter((p) => p.clave !== clave);
  guardarCarrito();
  actualizarContador();
  renderizarCarrito();
}

// ── Configurador de Pizzas Conectado a Supabase ───────────────────────
function renderizarPizzas() {
  const contenedor = document.getElementById("products-container");
  if (!contenedor) return;

  let saborSel = saboresPizza[0];
  let tamañoSel = tamañosPizza[2];

  async function build() {
    contenedor.innerHTML = `
      <div class="pizza-configurator">
        <div class="pizza-step">
          <h3 class="pizza-step-title"><span class="pizza-step-num">1</span> Elige el sabor</h3>
          <div class="flavor-grid">
            ${saboresPizza
              .map(
                (s) => `
              <button class="flavor-btn ${s.id === saborSel.id ? "selected" : ""}" data-sabor="${s.id}">
                ${s.badge ? `<span class="flavor-badge">${s.badge}</span>` : ""}
                <img src="${s.imagen}" alt="${s.nombre}" />
                <span class="flavor-name">${s.nombre}</span>
              </button>
            `,
              )
              .join("")}
          </div>
        </div>

        <div class="pizza-step">
          <h3 class="pizza-step-title"><span class="pizza-step-num">2</span> Elige el tamaño</h3>
          <div class="size-grid">
            ${tamañosPizza
              .map(
                (t) => `
              <button class="size-btn ${t.id === tamañoSel.id ? "selected" : ""}" data-tamaño="${t.id}">
                <span class="size-icon">${getSizeIcon(t.id)}</span>
                <span class="size-name">${t.label}</span>
                <span class="size-porciones">${t.porciones} porciones</span>
                <span class="size-price">Bs. ${t.precio}</span>
              </button>
            `,
              )
              .join("")}
          </div>
        </div>

        <div class="pizza-summary">
          <div class="pizza-summary-info">
            <img class="pizza-summary-img" src="${saborSel.imagen}" alt="${saborSel.nombre}" />
            <div>
              <div class="pizza-summary-name">🍕 Pizza ${saborSel.nombre} — ${tamañoSel.label}</div>
              <div class="pizza-summary-detail">${tamañoSel.porciones} porciones · ${saborSel.descripcion}</div>
            </div>
          </div>
          <div class="pizza-summary-right">
            <span class="pizza-summary-price">Bs. ${tamañoSel.precio}</span>
            <button class="btn-add-pizza" id="btn-agregar-pizza">+ Agregar al carrito</button>
          </div>
        </div>
      </div>`;

    // Eventos sabor
    contenedor.querySelectorAll(".flavor-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        saborSel = saboresPizza.find((s) => s.id === btn.dataset.sabor);
        build();
      });
    });

    // Eventos tamaño
    contenedor.querySelectorAll(".size-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        tamañoSel = tamañosPizza.find((t) => t.id === btn.dataset.tamaño);
        build();
      });
    });

    // Agregar al carrito consultando a Supabase
    contenedor
      .querySelector("#btn-agregar-pizza")
      .addEventListener("click", async function () {
        const boton = this;
        boton.disabled = true;
        boton.textContent = "Buscando...";

        // CORREGIDO: Buscamos con "porciones" en minúscula tal como se genera usualmente
        const nombreBuscar = `Pizza Di Carlos (${tamañoSel.porciones} porciones)`;

        // CORREGIDO: Usamos el cliente 'db' global en vez de '_supabase'
        // BUSCA ESTA LÍNEA EN TU js/app.js O DONDE HAGAS LA CONSULTA DE PRODUCTOS/PERFILES:
        const { data: profile, error: profileError } = await supabaseClient
          .from("profiles")
          .select("rol")
          .eq("id", user.id)
          .maybeSingle(); // <--- CAMBIA .single() POR .maybeSingle()

        // Ahora validas de forma segura sin que la consola rompa el script
        if (profileError) {
          console.error("Error al obtener perfil:", profileError);
        } else if (!profile) {
          console.log("No se encontró ningún perfil creado para este ID.");
        } else {
          console.log("Usuario ingresó con el rol:", profile.rol);
        }
        const clave = `pizza-${prodSupabase.id}`;
        const detalleStr = `${tamañoSel.label} · ${tamañoSel.porciones} porciones`;

        agregarAlCarrito(
          clave,
          prodSupabase.nombre,
          parseFloat(prodSupabase.precio),
          saborSel.imagen,
          detalleStr,
        );

        boton.textContent = "✓ Agregado";
        boton.style.background = "linear-gradient(135deg,#27ae60,#2ecc71)";
        setTimeout(() => {
          boton.disabled = false;
          boton.textContent = "+ Agregar al carrito";
          boton.style.background = "";
        }, 1200);
      });
  }

  build();
}

function getSizeIcon(id) {
  const icons = {
    personal: "🍕",
    pequeña: "🍕",
    mediana: "🍕🍕",
    familiar: "🍕🍕",
    extra_familiar: "🍕🍕🍕",
  };
  return icons[id] || "🍕";
}

// ── Render productos normales ────────────────────
function renderizarProductos(filtro = "todos") {
  const contenedor = document.getElementById("products-container");
  if (!contenedor) return;

  if (filtro === "pizza") {
    renderizarPizzas();
    return;
  }

  if (filtro === "todos") {
    renderizarPizzas();
    const extra = document.createElement("div");
    extra.className = "products-extra-grid";
    productos.forEach((p) => {
      const badgeHTML = p.badge
        ? `<span class="product-badge">${p.badge}</span>`
        : "";
      extra.innerHTML += `
        <div class="product-card">
          <div class="product-img-wrap">
            <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" />
            ${badgeHTML}
          </div>
          <div class="product-body">
            <h3>${p.nombre}</h3>
            <p>${p.descripcion}</p>
            <div class="product-footer">
              <span class="product-price">Bs. ${p.precio}</span>
              <button class="btn-add" data-id="${p.id}">+ Agregar</button>
            </div>
          </div>
        </div>`;
    });
    contenedor.appendChild(extra);
    bindBtnAdd(extra);
    return;
  }

  contenedor.innerHTML = "";
  const lista = productos.filter((p) => p.categoria === filtro);

  if (lista.length === 0) {
    contenedor.innerHTML = `<p class="no-products">No hay productos en esta categoría.</p>`;
    return;
  }

  lista.forEach((p) => {
    const badgeHTML = p.badge
      ? `<span class="product-badge">${p.badge}</span>`
      : "";
    contenedor.innerHTML += `
      <div class="product-card">
        <div class="product-img-wrap">
          <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" />
          ${badgeHTML}
        </div>
        <div class="product-body">
          <h3>${p.nombre}</h3>
          <p>${p.descripcion}</p>
          <div class="product-footer">
            <span class="product-price">Bs. ${p.precio}</span>
            <button class="btn-add" data-id="${p.id}">+ Agregar</button>
          </div>
        </div>
      </div>`;
  });

  bindBtnAdd(contenedor);
}

function bindBtnAdd(scope) {
  scope.querySelectorAll(".btn-add").forEach((btn) => {
    btn.addEventListener("click", function () {
      const prod = productos.find((p) => p.id === parseInt(this.dataset.id));
      if (!prod) return;
      agregarAlCarrito(
        `prod-${prod.id}`,
        prod.nombre,
        prod.precio,
        prod.imagen,
        null,
      );
      this.textContent = "✓ Agregado";
      this.style.background = "linear-gradient(135deg,#27ae60,#2ecc71)";
      setTimeout(() => {
        this.textContent = "+ Agregar";
        this.style.background = "";
      }, 1000);
    });
  });
}

// ── Filtros del menú ─────────────────────────────
function iniciarFiltros() {
  const filtros = document.querySelectorAll(".menu-filter-btn");
  filtros.forEach((btn) => {
    btn.addEventListener("click", () => {
      filtros.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderizarProductos(btn.dataset.filtro);
    });
  });
}

// ── Render Carrito ───────────────────────────────
let requiereDelivery = false;
let ubicacionUsuario = null;

function renderizarCarrito() {
  const contenedor = document.getElementById("cart-container");
  if (!contenedor) return;
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = `
      <div class="cart-empty">
        <span class="cart-empty-icon">🛒</span>
        <h3>Tu carrito está vacío</h3>
        <p>Agrega productos desde el menú para comenzar tu pedido</p>
      </div>`;
    return;
  }

  carrito.forEach((item) => {
    const imgHTML = item.imagen
      ? `<img class="cart-item-img" src="${item.imagen}" alt="${item.nombre}" />`
      : `<div class="cart-item-emoji-box">🍽️</div>`;
    const subtotal = item.precio * item.cantidad;

    contenedor.innerHTML += `
      <div class="cart-item">
        ${imgHTML}
        <div class="cart-item-info">
          <div class="cart-item-name">${item.nombre}</div>
          ${item.detalle ? `<div class="cart-item-size">${item.detalle}</div>` : ""}
          <div class="cart-item-price">Bs. ${item.precio} c/u</div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn btn-minus" data-clave="${item.clave}">−</button>
          <span class="qty-value">${item.cantidad}</span>
          <button class="qty-btn btn-plus" data-clave="${item.clave}">+</button>
        </div>
        <div class="cart-item-total">Bs. ${subtotal}</div>
        <button class="btn-remove" data-clave="${item.clave}" title="Eliminar">✕</button>
      </div>`;
  });

  const totalProductos = carrito.reduce(
    (sum, p) => sum + p.precio * p.cantidad,
    0,
  );
  const totalItems = carrito.reduce((sum, p) => sum + p.cantidad, 0);
  const costoDelivery = requiereDelivery ? 20 : 0;
  const totalFinal = totalProductos + costoDelivery;

  contenedor.innerHTML += `
    <div class="cart-summary">
      <div class="cart-summary-row" style="padding: 12px 0; border-bottom: 1px dashed var(--border); margin-bottom: 8px;">
        <span style="font-weight: 600; color: var(--dark);">¿Necesitas Delivery?</span>
        <button id="btn-toggle-delivery" class="btn-add" style="padding: 6px 14px; font-size: 0.8rem; background: ${requiereDelivery ? "linear-gradient(135deg, #27ae60, #2ecc71)" : "linear-gradient(135deg, var(--red), var(--orange))"}">
          ${requiereDelivery ? "✓ SÍ (Bs. 20)" : "✕ NO (Retiro en local)"}
        </button>
      </div>

      ${
        requiereDelivery
          ? `
      <div class="cart-summary-row" id="geo-row" style="padding: 8px 0; border-bottom: 2px dashed var(--border); margin-bottom: 12px; font-size: 0.85rem;">
        <span>GPS:</span>
        <span id="geo-status" style="color: ${ubicacionUsuario ? "#27ae60" : "#d35400"}; font-weight: bold;">
          ${ubicacionUsuario ? "📍 Ubicación fijada con éxito" : "⚠️ Buscando ubicación actual..."}
        </span>
      </div>`
          : ""
      }

      <div class="cart-summary-row">
        <span>Productos (${totalItems})</span>
        <span>Bs. ${totalProductos}</span>
      </div>
      <div class="cart-summary-row">
        <span>Delivery</span>
        <span style="font-weight: ${requiereDelivery ? "700" : "normal"}; color: ${requiereDelivery ? "var(--red)" : "inherit"}">
          ${requiereDelivery ? "Bs. 20" : "Gratis (Retiro) 🎉"}
        </span>
      </div>
      <div class="cart-total-row">
        <span class="cart-total-label">Total</span>
        <span class="cart-total-amount">Bs. ${totalFinal}</span>
      </div>
      <button class="btn-checkout">🍕 Enviar Pedido por WhatsApp</button>
    </div>`;

  if (requiereDelivery && !ubicacionUsuario) {
    obtenerUbicacionGPS();
  }

  // Eventos de botones del carrito
  contenedor
    .querySelector("#btn-toggle-delivery")
    .addEventListener("click", () => {
      requiereDelivery = !requiereDelivery;
      if (!requiereDelivery) ubicacionUsuario = null;
      renderizarCarrito();
    });

  contenedor
    .querySelectorAll(".btn-plus")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        cambiarCantidad(btn.dataset.clave, 1),
      ),
    );

  contenedor
    .querySelectorAll(".btn-minus")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        cambiarCantidad(btn.dataset.clave, -1),
      ),
    );

  contenedor.querySelectorAll(".btn-remove").forEach((btn) =>
    btn.addEventListener("click", () => {
      carrito = carrito.filter((p) => p.clave !== btn.dataset.clave);
      guardarCarrito();
      actualizarContador();
      renderizarCarrito();
    }),
  );

  contenedor.querySelector(".btn-checkout").addEventListener("click", () => {
    if (requiereDelivery && !ubicacionUsuario) {
      alert(
        "Por favor, permite el acceso al GPS para enviar tu ubicación exacta junto al pedido.",
      );
      return;
    }
    enviarPedidoWhatsApp(totalFinal, costoDelivery);
  });
}

function obtenerUbicacionGPS() {
  const statusTxt = document.getElementById("geo-status");

  if (!navigator.geolocation) {
    if (statusTxt)
      statusTxt.innerText = "❌ Tu navegador no soporta geolocalización";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      // CORREGIDO: Formato del link oficial de Google Maps
      ubicacionUsuario = `https://maps.google.com/?q=${lat},${lon}`;

      if (statusTxt) {
        statusTxt.innerText = "📍 Ubicación fijada con éxito";
        statusTxt.style.color = "#27ae60";
      }
    },
    (error) => {
      console.error(error);
      if (statusTxt) {
        statusTxt.innerText = "❌ Permiso denegado o error de señal GPS";
        statusTxt.style.color = "#c0392b";
      }
    },
    { enableHighAccuracy: true, timeout: 10000 },
  );
}

function enviarPedidoWhatsApp(totalFinal, costoDelivery) {
  const numeroTelefono = "59171467662";

  let mensaje = `*🍕 ¡NUEVO PEDIDO - PIZZERÍA DÍ CARLOS!* 🍕\n\n`;
  mensaje += `*Detalle del pedido:*\n`;

  carrito.forEach((item) => {
    const detalleStr = item.detalle ? ` (${item.detalle})` : "";
    mensaje += `• ${item.cantidad}x ${item.nombre}${detalleStr} - *Bs. ${item.precio * item.cantidad}*\n`;
  });

  mensaje += `\n---------------------------\n`;
  if (requiereDelivery) {
    mensaje += `*Método de Entrega:* 🛵 Envío a Domicilio\n`;
    mensaje += `*Costo Delivery:* Bs. ${costoDelivery}\n`;
    mensaje += `*Ubicación de Entrega (Google Maps):*\n${ubicacionUsuario}\n`;
  } else {
    mensaje += `*Método de Entrega:* 🏪 Retiro en el Local\n`;
  }
  mensaje += `---------------------------\n`;
  mensaje += `*TOTAL A PAGAR:* *Bs. ${totalFinal}*\n\n`;
  mensaje += `¡Muchas gracias! Quedo a la espera de la confirmación.`;

  const mensajeCodificado = encodeURIComponent(mensaje);
  const urlWhatsApp = `https://wa.me/${numeroTelefono}?text=${mensajeCodificado}`;

  window.open(urlWhatsApp, "_blank");

  carrito = [];
  requiereDelivery = false;
  ubicacionUsuario = null;
  guardarCarrito();
  actualizarContador();
  renderizarCarrito();
}

// ── Inicializar aplicación cuando el DOM esté listo ───────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  cargarCarrito();
  renderizarProductos();
  iniciarFiltros();
  renderizarCarrito();
  actualizarContador();

  const filtrosBtn = document.querySelectorAll(".menu-filter-btn");
  filtrosBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      filtrosBtn.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const categoria = btn.dataset.filtro;
      if (categoria === "pizza") {
        renderizarPizzas();
      } else {
        renderizarProductos(categoria);
      }
    });
  });
}); // CORREGIDO: Cierre correcto del DOMContentLoaded

// Reemplazar la función original de renderizarProductos en tu js/app.js por esta versión asíncrona:
async function renderizarProductos(filtro = "todos") {
  const contenedor = document.getElementById("products-container");
  if (!contenedor) return;

  if (filtro === "pizza") {
    renderizarPizzas();
    return;
  }

  // Si el filtro es "todos", primero inyectamos el configurador interactivo de Pizzas
  if (filtro === "todos") {
    renderizarPizzas();

    // Creamos un contenedor exclusivo para los productos dinámicos de Supabase
    const extra = document.createElement("div");
    extra.className = "products-extra-grid";
    extra.innerHTML =
      '<p class="loading-msg">Cargando productos adicionales...</p>';
    contenedor.appendChild(extra);

    try {
      // Consultar todos los productos disponibles que no sean pizzas de forma asíncrona
      const { data: productosSupabase, error } = await window.db
        .from("productos")
        .select("*")
        .eq("disponible", true)
        .neq("categoria", "pizza") // Excluye las pizzas si las subes a la misma tabla
        .order("nombre", { ascending: true });

      if (error) throw error;

      extra.innerHTML = ""; // Limpiar mensaje de carga

      if (!productosSupabase || productosSupabase.length === 0) {
        // Si la base de datos está vacía, cargamos el respaldo local estructurado
        productos.forEach((p) => {
          extra.innerHTML += generarCardProductoHTML(p);
        });
      } else {
        // Renderizamos los productos que vienen directamente desde Supabase
        productosSupabase.forEach((p) => {
          extra.innerHTML += generarCardProductoHTML(p);
        });
      }
      bindBtnAdd(extra);
    } catch (err) {
      console.error(
        "Error al conectar con Supabase, usando respaldo local:",
        err,
      );
      extra.innerHTML = "";
      productos.forEach((p) => {
        extra.innerHTML += generarCardProductoHTML(p);
      });
      bindBtnAdd(extra);
    }
    return;
  }

  // Filtrado específico por categorías (pasta, tipico, bebida) desde Supabase
  contenedor.innerHTML = '<p class="loading-msg">Filtrando menú...</p>';

  try {
    const { data: listaFiltrada, error } = await window.db
      .from("productos")
      .select("*")
      .eq("disponible", true)
      .eq("categoria", filtro)
      .order("nombre", { ascending: true });

    if (error) throw error;

    contenedor.innerHTML = "";

    if (!listaFiltrada || listaFiltrada.length === 0) {
      // Respaldo por si no hay registros en la nube de esa categoría
      const listaLocal = productos.filter((p) => p.categoria === filtro);
      if (listaLocal.length === 0) {
        contenedor.innerHTML = `<p class="no-products">No hay productos en esta categoría.</p>`;
        return;
      }
      listaLocal.forEach((p) => {
        contenedor.innerHTML += generarCardProductoHTML(p);
      });
    } else {
      listaFiltrada.forEach((p) => {
        contenedor.innerHTML += generarCardProductoHTML(p);
      });
    }
    bindBtnAdd(contenedor);
  } catch (err) {
    console.error("Error en filtro remoto, usando local:", err);
    contenedor.innerHTML = "";
    const listaLocal = productos.filter((p) => p.categoria === filtro);
    listaLocal.forEach((p) => {
      contenedor.innerHTML += generarCardProductoHTML(p);
    });
    bindBtnAdd(contenedor);
  }
}

// Función auxiliar para mantener la consistencia visual y de las imágenes
function generarCardProductoHTML(p) {
  const badgeHTML = p.badge
    ? `<span class="product-badge">${p.badge}</span>`
    : "";
  return `
    <div class="product-card">
      <div class="product-img-wrap">
        <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" />
        ${badgeHTML}
      </div>
      <div class="product-body">
        <h3>${p.nombre}</h3>
        <p>${p.descripcion}</p>
        <div class="product-footer">
          <span class="product-price">Bs. ${p.precio}</span>
          <button class="btn-add" data-id="${p.id}">+ Agregar</button>
        </div>
      </div>
    </div>`;
}
