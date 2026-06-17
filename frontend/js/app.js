// ================================================
// PIZZERÍA DÍ CARLOS — app.js (MODIFICADO CON SUPABASE)
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

  document
    .querySelectorAll(".nav-link")
    .forEach((l) => l.classList.toggle("active", l.dataset.view === vista));

  const navLinksMenu = document.getElementById("navLinks");
  const navToggle = document.getElementById("navToggle");
  if (navLinksMenu) navLinksMenu.classList.remove("open");
  if (navToggle) navToggle.classList.remove("active");
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-view]");
  if (btn) {
    e.preventDefault();
    navegarA(btn.dataset.view);
  }
});

// ── Sabores de pizza (Ahora se cargan dinámicamente desde Supabase) ──
let saboresPizza = [];

// ── 5 tamaños de pizza fijos (Como se muestra en "Guardar pizza.PNG") ──
const tamañosPizza = [
  { id: "personal", label: "Personal", porciones: 2, precio: 27 },
  { id: "pequeña", label: "Pequeña", porciones: 4, precio: 42 },
  { id: "mediana", label: "Mediana", porciones: 6, precio: 56 },
  { id: "familiar", label: "Familiar", porciones: 8, precio: 82 },
  { id: "extra_familiar", label: "Extra Familiar", porciones: 10, precio: 102 },
];

// ── Carrito LocalStorage ──────────────────────────────────────
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
  const badge =
    document.getElementById("cart-count") ||
    document.getElementById("cartCount");
  if (badge) {
    badge.textContent = total;
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

// ── Variables de control para el Delivery ──────────────────────────────────────
let tipoEnvioSeleccionado = "delivery"; // Por defecto delivery
const COSTO_DELIVERY = 20.0;

// Función interactiva para cambiar entre Delivery y Local
window.seleccionarTipoEnvio = function (tipo) {
  tipoEnvioSeleccionado = tipo;

  const btnDelivery = document.getElementById("btn-opcion-delivery");
  const btnLocal = document.getElementById("btn-opcion-local");
  const contenedorEnvio = document.getElementById("contenedor-datos-envio");
  const envioTexto = document.getElementById("cart-envio-texto");

  if (tipo === "delivery") {
    // Activar botón Delivery
    btnDelivery.style.background = "#e67e22";
    btnDelivery.style.color = "white";
    btnDelivery.style.borderColor = "#e67e22";
    // Desactivar botón Local
    btnLocal.style.background = "#fff";
    btnLocal.style.color = "#333";
    btnLocal.style.borderColor = "#ccc";

    if (contenedorEnvio) contenedorEnvio.style.display = "block";
    if (envioTexto) envioTexto.textContent = "Bs. 20.00";
  } else {
    // Activar botón Local
    btnLocal.style.background = "#27ae60";
    btnLocal.style.color = "white";
    btnLocal.style.borderColor = "#27ae60";
    // Desactivar botón Delivery
    btnDelivery.style.background = "#fff";
    btnDelivery.style.color = "#333";
    btnDelivery.style.borderColor = "#ccc";

    if (contenedorEnvio) contenedorEnvio.style.display = "none";
    if (envioTexto) envioTexto.textContent = "Bs. 0.00 (Recoger)";
  }

  // Recalcular el total inmediatamente
  renderizarCarrito();
};

// ── Renderizar Carrito con cálculo condicional del envío ─────────────────────────
function renderizarCarrito() {
  const contenedorCarrito = document.getElementById("cart-items");
  const contenedorSubtotal = document.getElementById("cart-subtotal");
  const contenedorTotal = document.getElementById("cart-total");

  if (!contenedorCarrito) return;

  if (carrito.length === 0) {
    contenedorCarrito.innerHTML = `<p style="text-align:center; color: var(--text-soft); padding: 20px;">🛒 Tu carrito está vacío.</p>`;
    if (contenedorSubtotal) contenedorSubtotal.textContent = "Bs. 0.00";
    if (contenedorTotal) contenedorTotal.textContent = "Bs. 0.00";
    return;
  }

  contenedorCarrito.innerHTML = carrito
    .map(
      (item) => `
    <div class="cart-item" style="display: flex; align-items: center; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <img src="${item.imagen || "img/Logo_pizzeria.jpg"}" style="width: 50px; height: 50px; border-radius: 6px; object-fit: cover;" onerror="this.src='img/Logo_pizzeria.jpg'">
        <div>
          <h4 style="margin: 0; font-size: 1rem;">${item.nombre}</h4>
          <small style="color: #777;">${item.detalle || "Porción Regular"}</small><br>
          <span style="font-weight: bold; color: var(--orange);">Bs. ${parseFloat(item.precio).toFixed(2)}</span>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <button onclick="cambiarCantidad('${item.clave}', -1)" style="padding: 2px 8px; cursor: pointer;">-</button>
        <span style="font-weight: bold;">${item.cantidad}</span>
        <button onclick="cambiarCantidad('${item.clave}', 1)" style="padding: 2px 8px; cursor: pointer;">+</button>
      </div>
    </div>
  `,
    )
    .join("");

  const subtotal = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0,
  );
  // Sumar los 20 Bs solo si seleccionó delivery
  const cargoEnvio = tipoEnvioSeleccionado === "delivery" ? COSTO_DELIVERY : 0;
  const totalConEnvio = subtotal + cargoEnvio;

  if (contenedorSubtotal)
    contenedorSubtotal.textContent = `Bs. ${subtotal.toFixed(2)}`;
  if (contenedorTotal)
    contenedorTotal.textContent = `Bs. ${totalConEnvio.toFixed(2)}`;
}

// GPS del navegador
window.obtenerUbicacionActual = function () {
  const inputUbicacion = document.getElementById("cart-ubicacion");
  if (!navigator.geolocation) {
    alert("La geolocalización no está soportada por tu navegador.");
    return;
  }
  inputUbicacion.value = "Obteniendo coordenadas...";
  navigator.geolocation.getCurrentPosition(
    (posicion) => {
      const lat = posicion.coords.latitude;
      const lon = posicion.coords.longitude;
      inputUbicacion.value = `https://www.google.com/maps?q=${lat},${lon}`;
    },
    (error) => {
      alert(
        "No se pudo obtener la localización por GPS. Escribe tu dirección manualmente.",
      );
      inputUbicacion.value = "";
    },
  );
};

// ── Procesar Confirmación Guardando a Supabase y enviando WhatsApp ───────────────
window.procesarConfirmarPedido = async function () {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  let ubicacion = "Recoge en el local";
  if (tipoEnvioSeleccionado === "delivery") {
    ubicacion = document.getElementById("cart-ubicacion").value.trim();
    if (!ubicacion) {
      alert("Por favor, introduce tu dirección para el delivery.");
      document.getElementById("cart-ubicacion").focus();
      return;
    }
  }

  const comentario = document.getElementById("cart-comentario").value.trim();

  // Leer sesión del local storage
  let clienteNombre = "Cliente Anónimo";
  let clienteId = null;
  const sesionGuardada = localStorage.getItem("usuario_sesion");

  if (sesionGuardada) {
    try {
      const usuario = JSON.parse(sesionGuardada);
      clienteNombre = usuario.nombre || usuario.email || clienteNombre;
      clienteId = usuario.id || null;
    } catch (e) {
      console.error("Error leyendo la sesión:", e);
    }
  }

  // Cálculos matemáticos del total
  const subtotal = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0,
  );
  const cargoEnvio = tipoEnvioSeleccionado === "delivery" ? COSTO_DELIVERY : 0;
  const totalCobrado = subtotal + cargoEnvio;

  try {
    if (!db) throw new Error("La base de datos de Supabase no está lista.");

    // A) INSERTAR EN LA TABLA 'orders' (Coincidiendo exactamente con tu SQL)
    const { data: ordenInsertada, error: errorOrden } = await db
      .from("orders")
      .insert([
        {
          user_id: clienteId, // UUID de Supabase o null si es anónimo
          nombre_cliente: clienteNombre, // Columna de tu SQL
          tipo_entrega: tipoEnvioSeleccionado, // 'delivery' o 'local'
          ubicacion: ubicacion + (comentario ? ` (Nota: ${comentario})` : ""),
          total: totalCobrado,
          estado: "pendiente", // En minúscula como tus CHECK constraints
        },
      ])
      .select(); // Requerido para recuperar el ID generado

    if (errorOrden) throw errorOrden;

    const orderIdGenerado = ordenInsertada[0].id;

    // B) PREPARAR LOS ITEMS PARA LA TABLA 'order_items'
    // Mapeamos los elementos del carrito convirtiendo IDs temporales de texto a enteros legibles si es necesario
    const filasItems = carrito.map((item) => {
      // Intentamos extraer el ID numérico del producto (ej: "prod-5" -> 5)
      let prodIdNumerico = null;
      if (typeof item.id === "string") {
        const match = item.id.match(/\d+/);
        if (match) prodIdNumerico = parseInt(match[0], 10);
      } else if (typeof item.id === "number") {
        prodIdNumerico = item.id;
      }

      return {
        order_id: orderIdGenerado,
        product_id: prodIdNumerico, // Sincronizado con la columna 'products.id'
        cantidad: item.cantidad,
        precio_unit: item.precio,
      };
    });

    // C) INSERTAR DETALLES EN 'order_items'
    const { error: errorItems } = await db
      .from("order_items")
      .insert(filasItems);

    if (errorItems) throw errorItems;

    // ── Enviar Mensaje a WhatsApp (Mantenemos tu excelente servicio al cliente) ──
    const numeroTelefono = "59171467662";
    let mensajeWA = `✨ *NUEVO PEDIDO #${orderIdGenerado} - PIZZERÍA DÍ CARLOS* ✨\n\n`;
    mensajeWA += `👤 *Cliente:* ${clienteNombre}\n`;
    mensajeWA += `🛵 *Modalidad:* ${tipoEnvioSeleccionado === "delivery" ? "Delivery" : "Recoger en Local"}\n\n`;
    mensajeWA += `📋 *Detalles:*\n`;

    carrito.forEach((item) => {
      mensajeWA += ` • ${item.cantidad}x ${item.nombre} [${item.detalles || "Regular"}] - Bs. ${(item.precio * item.cantidad).toFixed(2)}\n`;
    });

    mensajeWA += `\n💵 *Subtotal:* Bs. ${subtotal.toFixed(2)}`;
    mensajeWA += `\n🚀 *Envío:* Bs. ${cargoEnvio.toFixed(2)}`;
    mensajeWA += `\n💰 *TOTAL:* Bs. ${totalCobrado.toFixed(2)}\n\n`;
    mensajeWA += `📍 *Dirección:* ${ubicacion}\n`;
    if (comentario) mensajeWA += `💬 *Nota:* ${comentario}\n`;

    const urlWhatsApp = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensajeWA)}`;

    // Limpiar Carrito tras éxito
    carrito = [];
    guardarCarrito();
    actualizarContador();
    renderizarCarrito();

    if (document.getElementById("cart-ubicacion"))
      document.getElementById("cart-ubicacion").value = "";
    if (document.getElementById("cart-comentario"))
      document.getElementById("cart-comentario").value = "";

    alert(
      "🎉 ¡Pedido completado con éxito en el sistema! Abriendo WhatsApp...",
    );
    window.open(urlWhatsApp, "_blank");

    if (typeof cargarPedidosCajero === "function") cargarPedidosCajero();
  } catch (err) {
    console.error("Error al procesar la orden:", err);
    alert("Hubo un error al guardar tu pedido: " + (err.message || err));
  }
};

// ── 🛠️ CORRECCIÓN: Cargar Pedidos de Clientes en el panel del Cajero ───────────────
async function cargarPedidosCajero() {
  const tablaPedidos = document.getElementById("cajero-tabla-pedidos-clientes");
  if (!tablaPedidos) return;

  try {
    if (!db) throw new Error("Supabase no está inicializado.");

    // Leemos la tabla 'orders' ordenando por los más recientes
    const { data: listaPedidos, error } = await db
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    tablaPedidos.innerHTML = "";

    if (!listaPedidos || listaPedidos.length === 0) {
      tablaPedidos.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:15px; color:#888;">No hay pedidos registrados en el sistema.</td></tr>`;
      return;
    }

    listaPedidos.forEach((pedido) => {
      // Formateamos la fecha u hora de creación si existe la columna, de lo contrario usamos la actual
      const fechaFormateada = pedido.created_at
        ? new Date(pedido.created_at).toLocaleString()
        : "Reciente";

      // Definimos colores decorativos según el estado de la compra
      let colorEstado = "#f1c40f";
      if (pedido.estado === "Entregado" || pedido.estado === "Completado")
        colorEstado = "#2ecc71";
      if (pedido.estado === "Cancelado") colorEstado = "#e74c3c";

      tablaPedidos.innerHTML += `
        <tr style="border-bottom: 1px solid #eee; font-size: 0.95rem;">
          <td style="padding: 12px;">
            <strong>${pedido.cliente_nombre || "Anónimo"}</strong><br>
            <small style="color:#888;">${fechaFormateada}</small>
          </td>
          <td style="padding: 12px; max-width: 200px; word-wrap: break-word;">
            <span style="font-size: 0.85rem; color: #555;">${pedido.direccion || "Sin dirección"}</span><br>
            <small style="color: #e67e22; font-style: italic;">Nota: ${pedido.comentario || "Ninguna"}</small>
          </td>
          <td style="padding: 12px; color: #333;">${pedido.detalle_pedido || "Sin ítems registrados"}</td>
          <td style="padding: 12px; font-weight: bold; color: #c0392b;">Bs. ${parseFloat(pedido.total || 0).toFixed(2)}</td>
          <td style="padding: 12px; text-align: center;">
            <span style="background: ${colorEstado}; color: white; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: bold;">
              ${pedido.estado || "Pendiente"}
            </span>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Error al cargar pedidos en panel:", err);
    tablaPedidos.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:15px; color:#e74c3c;">❌ Error al conectar con Supabase: ${err.message}</td></tr>`;
  }
}
// ── Función para obtener los sabores de pizza desde Supabase ──
async function obtenerSaboresDesdeSupabase() {
  try {
    if (!db) return;
    const { data, error } = await db
      .from("products")
      .select("*")
      .eq("categoria", "pizza")
      .eq("disponible", true);

    if (error) throw error;

    // Mapeamos los datos de Supabase al formato que necesita el configurador
    saboresPizza = data.map((p) => ({
      id: p.id.toString(),
      nombre: p.nombre,
      descripcion: p.descripcion,
      badge: p.badge === "pizza" ? null : p.badge,
      imagen: p.imagen_url || "img/Logo_pizzeria.jpg",
    }));
  } catch (err) {
    console.error("Error al cargar sabores de pizza:", err);
  }
}

// ── Configurador de Pizzas Dinámico ─────────────────────────────────────────
async function renderizarPizzas() {
  const contenedor = document.getElementById("products-container");
  if (!contenedor) return;

  // Esperar a que se traigan los sabores actualizados desde la BD antes de construir
  await obtenerSaboresDesdeSupabase();

  if (saboresPizza.length === 0) {
    contenedor.innerHTML = `<p style="text-align:center; color: var(--text-soft);">🍕 Registra sabores en el panel de cajero para empezar.</p>`;
    return;
  }

  let saborSel = saboresPizza[0];
  let tamañoSel = tamañosPizza[2]; // Mediana por defecto (como la imagen)

  function build() {
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
                <img src="${s.imagen}" alt="${s.nombre}" onerror="this.src='img/Logo_pizzeria.jpg'" />
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
            <img class="pizza-summary-img" src="${saborSel.imagen}" alt="${saborSel.nombre}" onerror="this.src='img/Logo_pizzeria.jpg'" />
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

    // Agregar al carrito
    contenedor
      .querySelector("#btn-agregar-pizza")
      .addEventListener("click", function () {
        const clave = `pizza-${saborSel.id}-${tamañoSel.id}`;
        const detalleStr = `${tamañoSel.label} · ${tamañoSel.porciones} porciones`;

        agregarAlCarrito(
          clave,
          `Pizza ${saborSel.nombre}`,
          parseFloat(tamañoSel.precio),
          saborSel.imagen,
          detalleStr,
        );

        this.textContent = "✓ Agregado";
        setTimeout(() => {
          this.textContent = "+ Agregar al carrito";
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

// ── Renderizar resto de productos desde Supabase ────────────────────────────
async function renderizarProductos(categoriaSeleccionada = "todos") {
  const contenedorMenu = document.getElementById("menu-container");
  if (!contenedorMenu) return;

  contenedorMenu.innerHTML = `<p style="text-align:center; color: var(--text-soft);">🔍 Cargando el menú de hoy...</p>`;

  try {
    if (!db)
      throw new Error("La base de datos de Supabase no está inicializada.");

    let query = db.from("products").select("*");

    // Omitimos renderizar de nuevo la categoría pizza aquí porque ya tiene su propio contenedor arriba
    if (categoriaSeleccionada !== "todos") {
      query = query.eq("categoria", categoriaSeleccionada);
    } else {
      query = query.neq("categoria", "pizza");
    }

    const { data: productos, error } = await query;
    if (error) throw error;

    if (!productos || productos.length === 0) {
      contenedorMenu.innerHTML = `<p style="text-align:center; color: var(--text-soft);">🍽️ No hay otros productos en esta categoría.</p>`;
      return;
    }

    contenedorMenu.innerHTML = "";
    productos.forEach((producto) => {
      const card = document.createElement("div");
      card.className = "menu-card";
      const imagenUrl = producto.imagen_url || "img/Logo_pizzeria.jpg";

      card.innerHTML = `
        <img src="${imagenUrl}" alt="${producto.nombre}" class="menu-card-img" onerror="this.src='img/Logo_pizzeria.jpg'">
        <div class="menu-card-body">
          <div class="menu-card-header">
            <h3>${producto.nombre}</h3>
            <span class="menu-card-price">Bs. ${parseFloat(producto.precio).toFixed(2)}</span>
          </div>
          <p class="menu-card-desc">${producto.descripcion || "Sin descripción disponible."}</p>
          <button class="btn btn-primary btn-block" onclick="agregarAlimentoDirecto('${producto.id}', '${producto.nombre}', ${producto.precio})">🛒 Agregar al Pedido</button> 
        </div>
      `;
      contenedorMenu.appendChild(card);
    });
  } catch (err) {
    console.error("Error al obtener productos:", err);
    contenedorMenu.innerHTML = `<p style="text-align:center; color: var(--red);">❌ Error al cargar el menú: ${err.message}</p>`;
  }
}

// ── Panel del cajero: Inicialización corregida ──────────────────────────────
function inicializarPanelCajero() {
  const formulario = document.getElementById("form-add-producto");
  const selectCategoria = document.getElementById("cajero-categoria");
  const contenedorPrecio = document.getElementById("contenedor-precio-cajero");
  const notaPizza = document.getElementById("nota-pizza-porciones");
  const inputPrecio = document.getElementById("cajero-precio");

  if (!formulario || !selectCategoria) return;

  selectCategoria.addEventListener("change", () => {
    if (selectCategoria.value === "pizza") {
      contenedorPrecio.style.display = "none";
      notaPizza.style.display = "block";
      if (inputPrecio) {
        inputPrecio.removeAttribute("required");
        inputPrecio.value = "0";
      }
    } else {
      contenedorPrecio.style.display = "block";
      notaPizza.style.display = "none";
      if (inputPrecio) {
        inputPrecio.setAttribute("required", "true");
        inputPrecio.value = "";
      }
    }
  });

  const clonForm = formulario.cloneNode(true);
  formulario.parentNode.replaceChild(clonForm, formulario);

  clonForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const categoriaSelect = document.getElementById("cajero-categoria").value;
    let precioFinal =
      parseFloat(document.getElementById("cajero-precio").value) || 0;

    if (categoriaSelect === "pizza") {
      precioFinal = 27.0; // Precio de referencia base (Personal)
    }

    const inputImagen = document.getElementById("cajero-imagen").value.trim();
    const imagenFinal =
      inputImagen !== "" ? inputImagen : "img/Logo_pizzeria.jpg";

    const nuevoProducto = {
      nombre: document.getElementById("cajero-nombre").value.trim(),
      descripcion: document.getElementById("cajero-descripcion").value.trim(),
      categoria: categoriaSelect,
      precio: precioFinal,
      imagen_url: imagenFinal,
      badge: categoriaSelect === "pizza" ? "Popular" : "Nuevo",
      disponible: true,
    };

    try {
      if (!db) throw new Error("Supabase no está conectado.");

      const { error } = await db.from("products").insert([nuevoProducto]);
      if (error) throw error;

      alert(`🎉 ¡${nuevoProducto.nombre} añadido con éxito!`);
      clonForm.reset();

      // Restaurar interfaz del formulario
      contenedorPrecio.style.display = "block";
      notaPizza.style.display = "none";

      // Refrescar vistas del Menú y del Configurador inmediatamente
      cargarProductosCajero();
      renderizarPizzas();
      renderizarProductos("todos");
    } catch (err) {
      alert("Error al guardar el producto: " + err.message);
    }
  });
}

// ── Cargar y administrar la tabla del Cajero ────────────────────────────────
async function cargarProductosCajero() {
  const tabla = document.getElementById("cajero-tabla-productos");
  if (!tabla) return;

  try {
    if (!db) throw new Error("Supabase no está conectado.");

    const { data: listaProductos, error } = await db
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    tabla.innerHTML = "";

    if (!listaProductos || listaProductos.length === 0) {
      tabla.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:15px; color:#e74c3c;">No hay productos registrados.</td></tr>`;
      return;
    }

    listaProductos.forEach((p) => {
      const img = p.imagen_url || "img/Logo_pizzeria.jpg";
      const precioMostrado =
        p.categoria === "pizza" ? "Multi-porción" : `Bs. ${p.precio}`;

      tabla.innerHTML += `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px; display: flex; align-items: center; gap: 10px;">
            <img src="${img}" style="width: 45px; height: 45px; border-radius: 6px; object-fit: cover;" onerror="this.src='img/Logo_pizzeria.jpg'">
            <div>
              <strong>${p.nombre}</strong><br>
              <small style="color:#777;">${p.categoria.toUpperCase()}</small>
            </div>
          </td>
          <td style="padding: 10px;"><span style="background:#fff3e0; color:#e65100; padding:3px 8px; border-radius:12px; font-size:0.8rem; font-weight:600;">${p.badge || "Menú"}</span></td>
          <td style="padding: 10px; font-weight: bold;">${precioMostrado}</td>
          <td style="padding: 10px; text-align: center;">
            <button class="btn-borrar-producto" data-id="${p.id}" style="background:#e74c3c; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">
              🗑️ Borrar
            </button>
          </td>
        </tr>`;
    });

    tabla.querySelectorAll(".btn-borrar-producto").forEach((btn) => {
      btn.addEventListener("click", async function () {
        const idProducto = this.dataset.id;
        const fila = this.closest("tr");
        if (confirm("¿Seguro que deseas eliminar este producto del menú?")) {
          const { error } = await db
            .from("products")
            .delete()
            .eq("id", idProducto);
          if (!error) {
            fila.remove();
            renderizarPizzas();
            renderizarProductos("todos");
          } else {
            alert("Error al borrar: " + error.message);
          }
        }
      });
    });
  } catch (err) {
    console.error(err);
    tabla.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:15px; color:#e74c3c;">Error al cargar datos.</td></tr>`;
  }
}

// ── Agregar alimentos que no son pizza de forma directa ──────────────────────
function agregarAlimentoDirecto(id, nombre, precio) {
  const clave = `prod-${id}`;
  agregarAlCarrito(
    clave,
    nombre,
    parseFloat(precio),
    "img/Logo_pizzeria.jpg",
    "Porción Regular",
  );
  alert(`🍔 ¡${nombre} agregado al pedido con éxito!`);
}

// ── Inicializar todo al cargar el documento ─────────────────────────────────
// Busca esto al final de tu app.js y déjalo configurado así:
document.addEventListener("DOMContentLoaded", () => {
  cargarCarrito();
  renderizarPizzas();
  renderizarProductos("todos");
  actualizarContador();
  renderizarCarrito(); // Aseguramos renderizado inicial

  const sesionGuardada = localStorage.getItem("usuario_sesion");
  if (sesionGuardada) {
    try {
      const usuario = JSON.parse(sesionGuardada);
      if (usuario.rol === "cajero" || usuario.rol === "admin") {
        inicializarPanelCajero();
        cargarProductosCajero(); // Menú de productos del cajero
        cargarPedidosCajero(); // 🌟 NUEVO: Esto arreglará tu tabla de pedidos de clientes automáticamente
      }
    } catch (e) {
      console.error("Error al analizar la sesión del cajero:", e);
    }
  }

  // Filtros...
});
