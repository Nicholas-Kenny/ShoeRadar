const shoeContainer = document.getElementById("shoeContainer"); // Trending
const comingSoonContainer = document.getElementById("comingSoonContainer"); // Coming Soon
const soldOutContainer = document.getElementById("soldOutContainer"); // Sold Out

async function loadShoes() {
  // Ambil data sepatu beserta stoknya
  const { data: shoes, error } = await window.db
    .from("shoes")
    .select("*, inventory(stock_quantity)");

  if (error) {
    console.error("Error loading shoes:", error);
    return;
  }

  // Bersihkan semua container
  if (shoeContainer) shoeContainer.innerHTML = "";
  if (comingSoonContainer) comingSoonContainer.innerHTML = "";
  if (soldOutContainer) soldOutContainer.innerHTML = "";

  shoes.forEach((shoe) => {
    // Hitung total stok dari semua toko
    const totalStock = shoe.inventory.reduce(
      (sum, inv) => sum + inv.stock_quantity,
      0,
    );

    // Tentukan apakah ada tanggal rilis
    const releaseText = shoe.release_date
      ? `<p class="date" style="color:gray; font-size:0.8rem;">Release: ${new Date(shoe.release_date).toLocaleDateString("en-GB")}</p>`
      : "";

    const shoeHTML = `
        <a href="./shoe_detail.html?id=${shoe.id}">
            <figure class="shoe_container ${totalStock === 0 && shoe.status !== "coming_soon" ? "sold-out-style" : ""}">
                <img src="${shoe.image_url}" alt="${shoe.name}">
                <figcaption>
                    <p class="shoe_name">${shoe.name}</p>
                    <p class="shoe_type">${shoe.category}</p>
                    <p class="shoe_price">Rp ${Number(shoe.price).toLocaleString("id-ID")}</p>
                    ${shoe.status === "coming_soon" ? releaseText : ""}
                </figcaption>
            </figure>
        </a>
    `;

    // LOGIKA PENEMPATAN:
    if (shoe.status === "coming_soon") {
      // 1. Masuk ke Coming Soon
      if (comingSoonContainer) comingSoonContainer.innerHTML += shoeHTML;
    } else if (totalStock === 0) {
      // 2. Otomatis masuk ke Sold Out jika stok habis
      if (soldOutContainer) soldOutContainer.innerHTML += shoeHTML;
    } else {
      // 3. Masuk ke Trending Now (Regular & New Releases yang ada stok)
      if (shoeContainer) shoeContainer.innerHTML += shoeHTML;
    }
  });
}

loadShoes();
