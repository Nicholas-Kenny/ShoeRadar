const shoeContainer = document.getElementById("shoeContainer"); // Trending
const soldOutContainer = document.getElementById("soldOutContainer"); // Sold Out

async function loadShoes() {
  const { data, error } = await window.db
    .from("shoes")
    .select("*, inventory(stock_quantity)");

  if (error) {
    console.error(error);
    return;
  }

  // Bersihkan kontainer
  if (shoeContainer) shoeContainer.innerHTML = "";
  if (soldOutContainer) soldOutContainer.innerHTML = "";

  data.forEach((shoe) => {
    // Logika: Jika total stok 0, masukkan ke Sold Out
    const totalStock = shoe.inventory.reduce(
      (sum, inv) => sum + inv.stock_quantity,
      0,
    );

    const shoeHTML = `
            <a href="./shoe_detail.html?id=${shoe.id}">
                <figure class="shoe_container">
                    <img src="${shoe.image_url}" alt="${shoe.name}">
                    <figcaption>
                        <p class="shoe_name">${shoe.name}</p>
                        <p class="shoe_type">${shoe.category}</p>
                        <p class="shoe_price">Rp ${Number(shoe.price).toLocaleString("id-ID")}</p>
                    </figcaption>
                </figure>
            </a>
        `;

    if (totalStock === 0) {
      if (soldOutContainer) soldOutContainer.innerHTML += shoeHTML;
    } else {
      if (shoeContainer) shoeContainer.innerHTML += shoeHTML;
    }
  });
}
loadShoes();
