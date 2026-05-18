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
    badge: "Premium",
    imagen: "img/DiCarlos.jpg",
  },
  {
    id: "criollo",
    nombre: "Criollo",
    descripcion: "Jamón dulce y piña tropical con mozzarella y salsa de tomate",
    badge: null,
    imagen: "img/DiCarlos.jpg",
  },
  {
    id: "vegetariana",
    nombre: "Vegetariana",
    descripcion:
      "Pimientos, champiñones, aceitunas, cebolla morada y tomate cherry",
    badge: "Veggie",
    imagen: "img/DiCarlos.jpg",
  },
  {
    id: "pollo-bbq",
    nombre: "Pollo BBQ",
    descripcion:
      "Pollo a la parrilla, salsa BBQ ahumada, cebolla caramelizada y mozzarella",
    badge: "Popular",
    imagen: "img/DiCarlos.jpg",
  },
  {
    id: "napolitana",
    nombre: "Napolitana",
    descripcion:
      "Tomate fresco, anchoas, aceitunas negras, alcaparras y orégano",
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
  // Pasta
  {
    id: 20,
    nombre: "Lasaña",
    categoria: "pasta",
    descripcion:
      "Capas de pasta fresca con pollo, jamón, carne y salsa bechamel",
    precio: 37,
    imagen: "img/Lasaña.jpg",
    badge: "Especial",
  },
  {
    id: 21,
    nombre: "Espagueti Bolognesa",
    categoria: "pasta",
    descripcion:
      "Espagueti al dente con salsa de carne molida, tomate y hierbas italianas",
    precio: 32,
    imagen: "img/Lasaña.jpg",
    badge: null,
  },
  {
    id: 22,
    nombre: "Fettuccine Alfredo",
    categoria: "pasta",
    descripcion: "Fettuccine con salsa cremosa de mantequilla, parmesano y ajo",
    precio: 34,
    imagen: "img/Lasaña.jpg",
    badge: "Popular",
  },
  // Platos Típicos
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
    nombre: "Silpancho",
    categoria: "tipico",
    descripcion:
      "Milanesa de res apanada sobre arroz, papa cocida, huevo frito y ensalada",
    precio: 30,
    imagen: "img/PiqueMacho.jpg",
    badge: null,
  },
  // Bebidas Calientes
  {
    id: 40,
    nombre: "Café",
    categoria: "bebida",
    descripcion:
      "Infusión de semillas tostadas Coffea, estimulante y aromático",
    precio: 5,
    imagen: "img/Café.jpg",
    badge: null,
  },
  {
    id: 41,
    nombre: "Mate",
    categoria: "bebida",
    descripcion: "Infusión natural de manzanilla, relajante y aromática",
    precio: 5,
    imagen: "img/Mate.jpg",
    badge: null,
  },
  {
    id: 42,
    nombre: "Chocolate Caliente",
    categoria: "bebida",
    descripcion:
      "Chocolate artesanal con leche entera, cremoso y reconfortante",
    precio: 8,
    imagen: "img/Café.jpg",
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
  badge.textContent = total;
  badge.classList.remove("bump");
  void badge.offsetWidth;
  badge.classList.add("bump");
  setTimeout(() => badge.classList.remove("bump"), 300);
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

// ── Configurador de Pizzas ───────────────────────
function renderizarPizzas() {
  const contenedor = document.getElementById("products-container");

  let saborSel = saboresPizza[0];
  let tamañoSel = tamañosPizza[2]; // Mediana por defecto

  function build() {
    contenedor.innerHTML = `
      <div class="pizza-configurator">

        <!-- Paso 1: Sabor -->
        <div class="pizza-step">
          <h3 class="pizza-step-title">
            <span class="pizza-step-num">1</span> Elige el sabor
          </h3>
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

        <!-- Paso 2: Tamaño -->
        <div class="pizza-step">
          <h3 class="pizza-step-title">
            <span class="pizza-step-num">2</span> Elige el tamaño
          </h3>
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

        <!-- Resumen + Agregar -->
        <div class="pizza-summary">
          <div class="pizza-summary-info">
            <img class="pizza-summary-img" src="${saborSel.imagen}" alt="${saborSel.nombre}" />
            <div>
              <div class="pizza-summary-name">🍕 ${saborSel.nombre} — ${tamañoSel.label}</div>
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
        const nombre = `Pizza ${saborSel.nombre}`;
        const detalle = `${tamañoSel.label} · ${tamañoSel.porciones} porciones`;
        agregarAlCarrito(
          clave,
          nombre,
          tamañoSel.precio,
          saborSel.imagen,
          detalle,
        );
        this.textContent = "✓ Agregado";
        this.style.background = "linear-gradient(135deg,#27ae60,#2ecc71)";
        setTimeout(() => {
          this.textContent = "+ Agregar al carrito";
          this.style.background = "";
        }, 1200);
      });
  }

  build();
}

function getSizeIcon(id) {
  const icons = {
    mini: "🍕",
    personal: "🍕",
    mediana: "🍕🍕",
    grande: "🍕🍕",
    familiar: "🍕🍕🍕",
  };
  return icons[id] || "🍕";
}

// ── Render productos normales ────────────────────
function renderizarProductos(filtro = "todos") {
  const contenedor = document.getElementById("products-container");

  if (filtro === "pizza") {
    renderizarPizzas();
    return;
  }

  if (filtro === "todos") {
    // Primero el configurador de pizzas
    renderizarPizzas();
    // Luego el resto de productos debajo
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

  // Categoría específica (pasta / tipico / bebida)
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
function renderizarCarrito() {
  const contenedor = document.getElementById("cart-container");
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
          <button class="qty-btn btn-plus"  data-clave="${item.clave}">+</button>
        </div>
        <div class="cart-item-total">Bs. ${subtotal}</div>
        <button class="btn-remove" data-clave="${item.clave}" title="Eliminar">✕</button>
      </div>`;
  });

  const total = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  const totalItems = carrito.reduce((sum, p) => sum + p.cantidad, 0);

  contenedor.innerHTML += `
    <div class="cart-summary">
      <div class="cart-summary-row">
        <span>Productos (${totalItems})</span>
        <span>Bs. ${total}</span>
      </div>
      <div class="cart-summary-row">
        <span>Delivery</span>
        <span>Gratis 🎉</span>
      </div>
      <div class="cart-total-row">
        <span class="cart-total-label">Total</span>
        <span class="cart-total-amount">Bs. ${total}</span>
      </div>
      <button class="btn-checkout">🍕 Confirmar Pedido</button>
    </div>`;

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
    alert(
      `¡Pedido confirmado! Total: Bs. ${total}\nTe contactaremos pronto. 🍕`,
    );
    carrito = [];
    guardarCarrito();
    actualizarContador();
    renderizarCarrito();
  });
}

// ── Inicializar ──────────────────────────────────
cargarCarrito();
renderizarProductos();
iniciarFiltros();
renderizarCarrito();
actualizarContador();
