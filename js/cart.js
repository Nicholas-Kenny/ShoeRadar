const cartContainer = document.querySelector(".cart-items-section");
const productPriceEl = document.querySelector(".price-row span:last-child");
const finalTotalEl = document.getElementById("final-total");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function formatPrice(price) {
  return "Rp " + price.toLocaleString("id-ID");
}

function renderCart() {
  let subtotal = 0;
  cartContainer.innerHTML = `<h1 class="cart-title">Cart</h1>`;

  if (cart.length === 0) {
    cartContainer.innerHTML += `
            <div class="empty-cart">
                <h2>Your Cart Is Empty</h2>
                <p>Add some shoes to get started.</p>
                <a href="home.html" class="shop-btn">Continue Shopping</a>
            </div>
        `;
    updateTotals(0);
    return;
  }

  cart.forEach((item, index) => {
    subtotal += item.price * item.quantity;
    const html = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="item-img">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-category">${item.category}</p>
                    <p class="item-price">${formatPrice(item.price)}</p>
                </div>
                <div class="item-actions">
                    <div class="quantity-control">
                        <button class="qty-btn" onclick="changeQty(${index},-1)">-</button>
                        <span class="qty-num">${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQty(${index},1)">+</button>
                    </div>
                    <button class="delete-item-btn" onclick="removeItem(${index})">Remove</button>
                </div>
            </div>
            <hr class="item-divider">
        `;
    cartContainer.insertAdjacentHTML("beforeend", html);
  });

  renderOrderSummary();
  updateTotals(subtotal);
}

function updateTotals(subtotal) {
  // Memastikan logic delivery terambil
  const isDelivery = document.querySelector('input[value="delivery"]')?.checked;
  const shipping = isDelivery ? 30000 : 0;
  const service = isDelivery ? 5000 : 0;
  const total = subtotal + shipping + service;

  document.querySelector(
    ".price-breakdown .price-row span:last-child",
  ).textContent = formatPrice(subtotal);
  finalTotalEl.textContent = formatPrice(total);
}

function changeQty(index, amount) {
  cart[index].quantity += amount;
  if (cart[index].quantity < 1) cart[index].quantity = 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function toggleOrderMethod() {
  const pickup = document.querySelector('input[value="pickup"]');
  const pickupOptions = document.getElementById("pickup-options");
  const deliveryOptions = document.getElementById("delivery-options");

  if (pickup.checked) {
    pickupOptions.style.display = "block";
    deliveryOptions.style.display = "none";
  } else {
    pickupOptions.style.display = "none";
    deliveryOptions.style.display = "block";
  }
  renderCart();
}

function renderOrderSummary() {
  const summary = document.getElementById("order-summary-container");
  if (!summary) return;
  summary.innerHTML = "";
  cart.forEach((item) => {
    summary.innerHTML += `
            <div class="order-summary-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="summary-details">
                    <h4>${item.name}</h4>
                    <p class="category">${item.category}</p>
                    <p class="price">${formatPrice(item.price)} <span>x ${item.quantity}</span></p>
                </div>
            </div>
        `;
  });
}

// --- FUNGSI PROSES CHECKOUT BARU ---
async function processCheckout() {
  if (!window.db) {
    alert("Database connection not initialized. Please refresh.");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) return alert("Your cart is empty!");

  try {
    // 1. Ambil sesi user
    const { data: authData, error: authError } =
      await window.db.auth.getSession();
    if (authError || !authData.session) {
      return alert("Please login to checkout.");
    }
    const userId = authData.session.user.id;

    // 2. Hitung total
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const isDelivery = document.querySelector(
      'input[value="delivery"]',
    )?.checked;
    const shipping = isDelivery ? 35000 : 0;
    const total = subtotal + shipping;

    // 3. Insert ke tabel orders
    const { data: order, error: orderError } = await window.db
      .from("orders")
      .insert([
        {
          user_id: userId,
          total_price: total,
          status: "pending",
          delivery_method:
            document.querySelector('input[name="delivery_method"]:checked')
              ?.value || "pickup",
        },
      ])
      .select("id")
      .single();

    if (orderError) throw orderError;

    // 4. Insert ke tabel order_items
    const orderItems = cart.map((item) => ({
      order_id: order.id,
      shoe_id: item.id,
      quantity: item.quantity,
      price_at_time: item.price,
    }));

    const { error: itemsError } = await window.db
      .from("order_items")
      .insert(orderItems);
    if (itemsError) throw itemsError;

    alert("Checkout successful!");
    localStorage.removeItem("cart");
    window.location.replace("home.html");
  } catch (err) {
    console.error("Checkout Error:", err);
    alert("Checkout failed: " + err.message);
  }
}

// --- INISIALISASI ---
document
  .getElementById("checkoutBtn")
  ?.addEventListener("click", processCheckout);
document
  .getElementById("radio-delivery")
  ?.addEventListener("change", renderCart);
renderCart();
