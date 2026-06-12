document.addEventListener("DOMContentLoaded", () => {
  fetchShoes();

  // Event Listener untuk Form Add Product
  const addForm = document.getElementById("addProductForm");
  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("shoeName").value.trim();
    const category = document.getElementById("shoeCategory").value.trim();
    const price = Number(document.getElementById("shoePrice").value);
    const description = document.getElementById("shoeDescription").value.trim();
    const image_url = document.getElementById("shoeImage").value.trim();
    const release_date =
      document.getElementById("shoeReleaseDate").value || null;
    const status = document.getElementById("productStatus").value;

    const { error } = await window.db
      .from("shoes")
      .insert([
        { name, category, price, description, image_url, release_date, status },
      ]);

    if (error) {
      alert("Failed to add product: " + error.message);
      return;
    }

    alert("Product successfully added to catalog!");
    addForm.reset(); // Kosongkan form
    fetchShoes(); // Refresh tabel agar produk baru langsung muncul
  });
});

// Fungsi untuk mengambil dan me-render sepatu ke tabel
async function fetchShoes() {
  const tableBody = document.getElementById("adminShoeTableBody");
  tableBody.innerHTML =
    "<tr><td colspan='3' class='text-center'>Loading...</td></tr>";

  const { data: shoes, error } = await window.db
    .from("shoes")
    .select("*")
    .order("created_at", { ascending: false }); // Urutkan dari yang paling baru

  if (error) {
    console.error("Error fetching shoes:", error);
    tableBody.innerHTML =
      "<tr><td colspan='3' class='text-center'>Error loading data</td></tr>";
    return;
  }

  if (shoes.length === 0) {
    tableBody.innerHTML =
      "<tr><td colspan='3' class='text-center'>No products in catalog yet.</td></tr>";
    return;
  }

  tableBody.innerHTML = ""; // Bersihkan loading

  shoes.forEach((shoe, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td class="text-center">${index + 1}.</td>
            <td>
                <strong>${shoe.name}</strong> <br>
                <span style="font-size: 0.85rem; color: #777;">${shoe.category} | Rp ${shoe.price.toLocaleString("id-ID")}</span>
            </td>
            <td>
                <div class="action-icons">
                    <a href="admin_edit.html?id=${shoe.id}">
                        <button class="icon-btn edit-btn" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7m-4.5-9.5L13.5 14L10 14l-.5-3.5l8.5-8.5a1.5 1.5 0 0 1 2.121 2.121Z"/></svg>
                        </button>
                    </a>
                    <button class="icon-btn trash-btn" title="Delete" onclick="deleteShoe('${shoe.id}', '${shoe.name}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/></svg>
                    </button>
                </div>
            </td>
        `;
    tableBody.appendChild(row);
  });
}

// Fungsi Delete (Hapus data selamanya dari database)
window.deleteShoe = async function (id, name) {
  const confirmDelete = confirm(
    `Are you sure you want to delete "${name}"? This action cannot be undone.`,
  );
  if (!confirmDelete) return;

  const { error } = await window.db.from("shoes").delete().eq("id", id);

  if (error) {
    alert("Failed to delete product: " + error.message);
    return;
  }

  alert("Product deleted!");
  fetchShoes(); // Refresh tabel
};
