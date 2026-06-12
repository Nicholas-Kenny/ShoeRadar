document.addEventListener("DOMContentLoaded", async () => {
  // Sekarang Anda bisa dengan aman menggunakan 'await' di sini
  const {
    data: { session },
    error: sessionError,
  } = await window.db.auth.getSession();

  if (sessionError || !session) {
    window.location.replace("index.html");
    return;
  }

  const { data: profile, error: profileError } = await window.db
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin") {
    alert("Access Denied: Administrator privileges required.");
    window.location.replace("home.html");
    return;
  }

  // Sisa kode Anda tetap sama di bawah ini...
  const params = new URLSearchParams(window.location.search);
  const shoeId = params.get("id");

  if (!shoeId) {
    alert("No product selected!");
    window.location.replace("admin_home.html");
    return;
  }

  // 2. Jalankan fungsi awal (Muat data sepatu, Muat dropdown toko, Muat daftar stok)
  loadShoeData(shoeId);
  loadStoresDropdown();
  loadInventory(shoeId);

  // 3. Event Listener: Update Data Global Sepatu
  document
    .getElementById("editProductForm")
    .addEventListener("submit", async () => {
      const name = document.getElementById("shoeName").value.trim();
      const category = document.getElementById("shoeCategory").value.trim();
      const price = Number(document.getElementById("shoePrice").value);
      const description = document
        .getElementById("shoeDescription")
        .value.trim();
      const image_url = document.getElementById("shoeImage").value.trim();
      const release_date =
        document.getElementById("shoeReleaseDate").value || null;
      const status = document.getElementById("productStatus").value;

      const { error } = await window.db
        .from("shoes")
        .update({
          name,
          category,
          price,
          description,
          image_url,
          release_date,
          status,
        })
        .eq("id", shoeId);

      if (error) alert("Error updating shoe: " + error.message);
      else {
        alert("Product details updated successfully!");
        window.location.replace("admin_home.html");
      }
    });

  // 4. Event Listener: Update Stok Inventory
  document
    .getElementById("inventoryForm")
    .addEventListener("submit", async () => {
      const store_id = document.getElementById("storeSelect").value;
      const stock_quantity = Number(
        document.getElementById("storeStock").value,
      );

      if (!store_id) {
        alert("Please select a store first.");
        return;
      }

      // Fitur UPSERT: Jika sepatu di toko ini sudah ada, update stoknya. Jika belum, tambahkan.
      const { error } = await window.db.from("inventory").upsert(
        [
          {
            shoe_id: shoeId,
            store_id: store_id,
            stock_quantity: stock_quantity,
          },
        ],
        { onConflict: "shoe_id,store_id" },
      );

      if (error) {
        alert("Error updating inventory: " + error.message);
      } else {
        alert("Stock updated successfully!");
        document.getElementById("storeStock").value = ""; // Kosongkan input stok
        loadInventory(shoeId); // Refresh daftar stok di atas form
      }
    });
});

// --- KUMPULAN FUNGSI PEMBANTU --- //

// Fungsi menyedot data sepatu dari database ke dalam form
async function loadShoeData(id) {
  const { data, error } = await window.db
    .from("shoes")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return;

  document.getElementById("shoeName").value = data.name || "";
  document.getElementById("shoeCategory").value = data.category || "";
  document.getElementById("shoePrice").value = data.price || "";
  document.getElementById("shoeDescription").value = data.description || "";
  document.getElementById("shoeImage").value = data.image_url || "";
  document.getElementById("shoeReleaseDate").value = data.release_date || "";
  document.getElementById("productStatus").value = data.status || "regular";
}

// Fungsi menarik daftar toko (untuk opsi Select Dropdown)
async function loadStoresDropdown() {
  const { data, error } = await window.db.from("stores").select("*");
  if (error) return;

  const select = document.getElementById("storeSelect");
  select.innerHTML =
    '<option value="" disabled selected>-- Select a Store --</option>';
  data.forEach((store) => {
    select.innerHTML += `<option value="${store.id}">${store.name}</option>`;
  });
}

// Fungsi menampilkan daftar stok sepatu ini di berbagai toko
async function loadInventory(shoeId) {
  const listContainer = document.getElementById("currentInventoryList");
  listContainer.innerHTML = "<em>Loading stock...</em>";

  // Query Relasional: Menggabungkan tabel inventory dan tabel stores
  const { data, error } = await window.db
    .from("inventory")
    .select(`stock_quantity, stores ( name )`)
    .eq("shoe_id", shoeId);

  if (error || !data || data.length === 0) {
    listContainer.innerHTML =
      "<p><em>No stock assigned to any store yet.</em></p>";
    return;
  }

  listContainer.innerHTML = "<strong>Current Stock Available:</strong><ul>";
  data.forEach((inv) => {
    listContainer.innerHTML += `<li style="margin-top: 5px;">${inv.stores.name}: <strong>${inv.stock_quantity}</strong> pairs</li>`;
  });
  listContainer.innerHTML += "</ul>";
}
