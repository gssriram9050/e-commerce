// Product data stays in JavaScript so the project remains completely static.
const products = [
  {
    id: 1,
    name: "Nova Wireless Headphones",
    category: "Electronics",
    price: 89.99,
    rating: 4.8,
    badge: "Hot",
    description: "Noise-friendly wireless headphones with plush ear cups and long battery life.",
    colorA: "#66e4ff",
    colorB: "#8b5cf6",
    icon: "🎧"
  },
  {
    id: 2,
    name: "Aero Smart Watch",
    category: "Electronics",
    price: 129.99,
    rating: 4.7,
    badge: "New",
    description: "A sleek everyday watch for fitness tracking, alerts, and quick controls.",
    colorA: "#34d399",
    colorB: "#14b8a6",
    icon: "⌚"
  },
  {
    id: 3,
    name: "Urban Travel Backpack",
    category: "Accessories",
    price: 64.5,
    rating: 4.6,
    badge: "Sale",
    description: "Weather-resistant backpack with a laptop sleeve and organized storage.",
    colorA: "#f59e0b",
    colorB: "#ef4444",
    icon: "🎒"
  },
  {
    id: 4,
    name: "Cloud Knit Sneakers",
    category: "Fashion",
    price: 74.99,
    rating: 4.5,
    badge: "Top",
    description: "Lightweight knit sneakers with soft cushioning for daily comfort.",
    colorA: "#f472b6",
    colorB: "#fb7185",
    icon: "👟"
  },
  {
    id: 5,
    name: "Glow Desk Lamp",
    category: "Home",
    price: 39.99,
    rating: 4.4,
    badge: "New",
    description: "Minimal LED desk lamp with adjustable brightness and a compact base.",
    colorA: "#fde047",
    colorB: "#f97316",
    icon: "💡"
  },
  {
    id: 6,
    name: "Pure Ceramic Mug Set",
    category: "Home",
    price: 24.99,
    rating: 4.3,
    badge: "Gift",
    description: "Four smooth ceramic mugs designed for coffee, tea, and cozy mornings.",
    colorA: "#93c5fd",
    colorB: "#38bdf8",
    icon: "☕"
  },
  {
    id: 7,
    name: "Flex Training Hoodie",
    category: "Fashion",
    price: 54.99,
    rating: 4.6,
    badge: "Fit",
    description: "Breathable hoodie with a clean athletic shape and soft fleece lining.",
    colorA: "#a78bfa",
    colorB: "#6366f1",
    icon: "🧥"
  },
  {
    id: 8,
    name: "Pulse Fitness Bottle",
    category: "Fitness",
    price: 19.99,
    rating: 4.2,
    badge: "Eco",
    description: "Reusable steel bottle with a leak-proof lid and temperature control.",
    colorA: "#2dd4bf",
    colorB: "#22c55e",
    icon: "🥤"
  }
];

const categories = [
  { name: "Electronics", icon: "💻" },
  { name: "Fashion", icon: "👕" },
  { name: "Home", icon: "🏠" },
  { name: "Accessories", icon: "👜" },
  { name: "Fitness", icon: "🏋️" }
];

const state = {
  cart: JSON.parse(localStorage.getItem("shopease-cart")) || [],
  currentCategory: "all",
  currentSearch: "",
  currentSort: "featured",
  authMode: "login"
};

const productGrid = document.getElementById("productGrid");
const categoriesGrid = document.getElementById("categoriesGrid");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const searchInput = document.getElementById("searchInput");
const noProducts = document.getElementById("noProducts");
const cartSidebar = document.getElementById("cartSidebar");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const overlay = document.getElementById("overlay");
const authModal = document.getElementById("authModal");
const authForm = document.getElementById("authForm");
const productModal = document.getElementById("productModal");
const productModalContent = document.getElementById("productModalContent");
const toastContainer = document.getElementById("toastContainer");
const navLinks = document.getElementById("navLinks");
const navToggle = document.getElementById("navToggle");

function createProductImage(product) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 460">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="${product.colorA}" />
          <stop offset="1" stop-color="${product.colorB}" />
        </linearGradient>
        <filter id="shadow"><feDropShadow dx="0" dy="18" stdDeviation="16" flood-opacity=".28"/></filter>
      </defs>
      <rect width="520" height="460" rx="34" fill="#101827"/>
      <circle cx="420" cy="92" r="92" fill="${product.colorA}" opacity=".18"/>
      <circle cx="90" cy="370" r="110" fill="${product.colorB}" opacity=".18"/>
      <rect x="118" y="98" width="284" height="264" rx="34" fill="url(#g)" filter="url(#shadow)"/>
      <text x="260" y="276" font-size="118" text-anchor="middle">${product.icon}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function saveCart() {
  localStorage.setItem("shopease-cart", JSON.stringify(state.cart));
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 220);
  }, 2400);
}

function renderCategories() {
  categoriesGrid.innerHTML = categories
    .map(
      (category) => `
        <button class="category-card" data-category="${category.name}">
          <div>
            <h3>${category.name}</h3>
            <p>${products.filter((product) => product.category === category.name).length} items</p>
          </div>
          <span>${category.icon}</span>
        </button>
      `
    )
    .join("");

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.name;
    option.textContent = category.name;
    categoryFilter.appendChild(option);
  });
}

function getFilteredProducts() {
  let filtered = products.filter((product) => {
    const matchesCategory = state.currentCategory === "all" || product.category === state.currentCategory;
    const searchTerm = state.currentSearch.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  if (state.currentSort === "low-high") {
    filtered = filtered.sort((a, b) => a.price - b.price);
  }

  if (state.currentSort === "high-low") {
    filtered = filtered.sort((a, b) => b.price - a.price);
  }

  if (state.currentSort === "rating") {
    filtered = filtered.sort((a, b) => b.rating - a.rating);
  }

  return filtered;
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();
  noProducts.classList.toggle("hidden", filteredProducts.length > 0);

  productGrid.innerHTML = filteredProducts
    .map(
      (product) => `
        <article class="product-card reveal visible">
          <div class="product-image">
            <span class="badge">${product.badge}</span>
            <img src="${createProductImage(product)}" alt="${product.name}">
          </div>
          <div class="product-info">
            <div class="product-meta">
              <span>${product.category}</span>
              <span>★ ${product.rating}</span>
            </div>
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
              <span class="price">${formatPrice(product.price)}</span>
              <div class="product-actions">
                <button class="small-button" data-view="${product.id}">View</button>
                <button class="primary-button" data-add="${product.id}">Add</button>
              </div>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function renderCart() {
  cartItems.innerHTML = state.cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.id);
      if (!product) return "";

      return `
        <div class="cart-item">
          <img src="${createProductImage(product)}" alt="${product.name}">
          <div>
            <h4>${product.name}</h4>
            <p>${formatPrice(product.price)}</p>
            <div class="quantity-row">
              <div class="quantity-controls">
                <button data-decrease="${product.id}" aria-label="Decrease ${product.name} quantity">−</button>
                <strong>${item.quantity}</strong>
                <button data-increase="${product.id}" aria-label="Increase ${product.name} quantity">+</button>
              </div>
              <button class="remove-button" data-remove="${product.id}">Remove</button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  const total = state.cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);

  const itemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  cartTotal.textContent = formatPrice(total);
  cartCount.textContent = itemCount;
  cartEmpty.classList.toggle("show", state.cart.length === 0);
  cartItems.classList.toggle("hidden", state.cart.length === 0);
  saveCart();
}

function addToCart(productId, quantity = 1) {
  const existingItem = state.cart.find((item) => item.id === productId);
  const product = products.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    state.cart.push({ id: productId, quantity });
  }

  renderCart();
  showToast(`${product.name} added to cart`);
}

function updateQuantity(productId, change) {
  const item = state.cart.find((entry) => entry.id === productId);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter((entry) => entry.id !== productId);
  }

  renderCart();
}

function removeFromCart(productId) {
  const product = products.find((entry) => entry.id === productId);
  state.cart = state.cart.filter((item) => item.id !== productId);
  renderCart();
  showToast(`${product.name} removed from cart`);
}

function openCart() {
  cartSidebar.classList.add("open");
  cartSidebar.setAttribute("aria-hidden", "false");
  overlay.classList.add("show");
}

function closeCart() {
  cartSidebar.classList.remove("open");
  cartSidebar.setAttribute("aria-hidden", "true");
  overlay.classList.remove("show");
}

function openAuthModal(mode) {
  state.authMode = mode;
  authModal.classList.add("show");
  authModal.setAttribute("aria-hidden", "false");
  overlay.classList.add("show");
  updateAuthMode();
}

function closeAuthModal() {
  authModal.classList.remove("show");
  authModal.setAttribute("aria-hidden", "true");
  authForm.reset();
  clearAuthErrors();
  if (!productModal.classList.contains("show") && !cartSidebar.classList.contains("open")) {
    overlay.classList.remove("show");
  }
}

function updateAuthMode() {
  const isSignup = state.authMode === "signup";
  document.getElementById("authTitle").textContent = isSignup ? "Create your ShopEase account" : "Login to ShopEase";
  document.getElementById("authSubmit").textContent = isSignup ? "Create Account" : "Login";
  document.getElementById("nameInput").parentElement.style.display = isSignup ? "grid" : "none";

  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.authMode === state.authMode);
  });
}

function clearAuthErrors() {
  ["nameError", "emailError", "passwordError"].forEach((id) => {
    document.getElementById(id).textContent = "";
  });
}

function validateAuthForm(event) {
  event.preventDefault();
  clearAuthErrors();

  const name = document.getElementById("nameInput").value.trim();
  const email = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();
  let isValid = true;

  if (state.authMode === "signup" && name.length < 2) {
    document.getElementById("nameError").textContent = "Please enter your full name.";
    isValid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById("emailError").textContent = "Please enter a valid email address.";
    isValid = false;
  }

  if (password.length < 6) {
    document.getElementById("passwordError").textContent = "Password must be at least 6 characters.";
    isValid = false;
  }

  if (!isValid) return;

  closeAuthModal();
  showToast(state.authMode === "signup" ? "Account created for demo" : "Logged in for demo");
}

function openProductModal(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  productModalContent.innerHTML = `
    <button class="icon-button modal-close" data-close-modal aria-label="Close modal">×</button>
    <div class="modal-product-image">
      <img src="${createProductImage(product)}" alt="${product.name}">
    </div>
    <div class="modal-product-details">
      <p class="eyebrow">${product.category}</p>
      <h2 id="productModalTitle">${product.name}</h2>
      <p>${product.description}</p>
      <p>Rating: ★ ${product.rating} · Beginner-friendly static product preview.</p>
      <h3>${formatPrice(product.price)}</h3>
      <button class="primary-button full-button" data-add="${product.id}">Add to Cart</button>
    </div>
  `;

  productModal.classList.add("show");
  productModal.setAttribute("aria-hidden", "false");
  overlay.classList.add("show");
}

function closeProductModal() {
  productModal.classList.remove("show");
  productModal.setAttribute("aria-hidden", "true");
  if (!authModal.classList.contains("show") && !cartSidebar.classList.contains("open")) {
    overlay.classList.remove("show");
  }
}

function fakeCheckout() {
  if (state.cart.length === 0) {
    showToast("Your cart is empty");
    return;
  }

  state.cart = [];
  renderCart();
  closeCart();
  showToast("Checkout simulated successfully");
}

function handleTheme() {
  const savedTheme = localStorage.getItem("shopease-theme");
  if (savedTheme === "light") {
    document.body.classList.add("light");
    document.getElementById("themeIcon").textContent = "☀";
  }
}

function toggleTheme() {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("shopease-theme", isLight ? "light" : "dark");
  document.getElementById("themeIcon").textContent = isLight ? "☀" : "☾";
}

function revealOnScroll() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const viewButton = event.target.closest("[data-view]");
  const increaseButton = event.target.closest("[data-increase]");
  const decreaseButton = event.target.closest("[data-decrease]");
  const removeButton = event.target.closest("[data-remove]");
  const categoryButton = event.target.closest("[data-category]");
  const closeButton = event.target.closest("[data-close-modal]");
  const featuredAdd = event.target.closest("[data-featured-add]");

  if (addButton) addToCart(Number(addButton.dataset.add));
  if (viewButton) openProductModal(Number(viewButton.dataset.view));
  if (increaseButton) updateQuantity(Number(increaseButton.dataset.increase), 1);
  if (decreaseButton) updateQuantity(Number(decreaseButton.dataset.decrease), -1);
  if (removeButton) removeFromCart(Number(removeButton.dataset.remove));

  if (categoryButton) {
    state.currentCategory = categoryButton.dataset.category;
    categoryFilter.value = state.currentCategory;
    renderProducts();
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
  }

  if (closeButton) {
    closeAuthModal();
    closeProductModal();
  }

  if (featuredAdd) {
    addToCart(1);
    addToCart(3);
    addToCart(5);
  }
});

document.getElementById("cartOpen").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
document.getElementById("checkoutButton").addEventListener("click", fakeCheckout);
document.getElementById("loginOpen").addEventListener("click", () => openAuthModal("login"));
document.getElementById("signupOpen").addEventListener("click", () => openAuthModal("signup"));
document.getElementById("themeToggle").addEventListener("click", toggleTheme);

overlay.addEventListener("click", () => {
  closeCart();
  closeAuthModal();
  closeProductModal();
});

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", () => {
  navLinks.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
});

searchInput.addEventListener("input", (event) => {
  state.currentSearch = event.target.value;
  renderProducts();
});

categoryFilter.addEventListener("change", (event) => {
  state.currentCategory = event.target.value;
  renderProducts();
});

sortFilter.addEventListener("change", (event) => {
  state.currentSort = event.target.value;
  renderProducts();
});

document.querySelectorAll(".auth-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    state.authMode = tab.dataset.authMode;
    clearAuthErrors();
    updateAuthMode();
  });
});

authForm.addEventListener("submit", validateAuthForm);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeAuthModal();
    closeProductModal();
  }
});

renderCategories();
renderProducts();
renderCart();
handleTheme();
revealOnScroll();
