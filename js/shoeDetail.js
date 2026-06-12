document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const shoeId = params.get("id");

  if (!shoeId) {
    document.getElementById("detailName").textContent = "Product not found";
    return;
  }

  // 1. Ambil detail sepatu
  const { data: shoe, error } = await window.db
    .from("shoes")
    .select("*")
    .eq("id", shoeId)
    .single();

  if (shoe) {
    document.getElementById("detailName").textContent = shoe.name;
    document.getElementById("detailCategory").textContent = shoe.category;
    document.getElementById("detailPrice").textContent =
      "Rp " + Number(shoe.price).toLocaleString("id-ID");
    document.getElementById("detailDescription").textContent = shoe.description;

    // Pastikan elemen gambar ada di HTML Anda
    const imgElement = document.querySelector(".left img");
    if (imgElement) imgElement.src = shoe.image_url;
  } else {
    document.getElementById("detailName").textContent = "Product not found";
  }

  // 2. Ambil data stok (Relasi ke tabel stores)
  const { data: inventory } = await window.db
    .from("inventory")
    .select("stock_quantity, stores(name)")
    .eq("shoe_id", shoeId);

  const storeSelector = document.getElementById("storeSelector");
  const stockDisplay = document.getElementById("stockDisplay"); // Pastikan ID ini ada di HTML

  storeSelector.innerHTML =
    '<option value="">Select a store to check stock</option>';

  if (inventory && inventory.length > 0) {
    inventory.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.stock_quantity;
      option.textContent = item.stores.name;
      storeSelector.appendChild(option);
    });
  } else {
    const option = document.createElement("option");
    option.textContent = "No stock available";
    storeSelector.appendChild(option);
  }

  storeSelector.addEventListener("change", (e) => {
    const stock = e.target.value;
    if (stockDisplay) {
      stockDisplay.textContent =
        stock && stock !== "" ? `Available: ${stock} pairs in stock` : "";
    }
  });
});
