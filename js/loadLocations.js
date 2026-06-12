document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("locationsContainer");

  // Ambil data toko
  const { data: stores, error } = await window.db.from("stores").select("*");

  if (error || !stores) return;

  // Kelompokkan toko berdasarkan kota (asumsi Anda menambah kolom 'city' di tabel stores)
  // Jika tidak ada kolom kota, kita pakai satu grup saja atau sesuaikan dengan data
  const grouped = stores.reduce((acc, store) => {
    const city = store.city || "Other";
    if (!acc[city]) acc[city] = [];
    acc[city].push(store);
    return acc;
  }, {});

  // Render ke HTML
  container.innerHTML = Object.entries(grouped)
    .map(
      ([city, storeList]) => `
        <div class="location-group">
            <h2>${city}</h2>
            <div class="cards-grid">
                ${storeList
                  .map(
                    (store) => `
                    <div class="card">
                        <img src="${store.image_url || "./images/location/default.png"}" alt="${store.name}">
                        <div class="card-title">${store.name}</div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `,
    )
    .join("");
});
