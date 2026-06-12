document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("shoeContainer");

  // Ambil sepatu yang bukan coming soon
  const { data: shoes, error } = await window.db
    .from("shoes")
    .select("*, inventory(stock_quantity)")
    .neq("status", "coming_soon");

  if (error) return;

  container.innerHTML = shoes
    .map((shoe) => {
      const totalStock = shoe.inventory.reduce(
        (sum, inv) => sum + inv.stock_quantity,
        0,
      );
      const statusBadge =
        totalStock === 0
          ? `<span style="color:red; font-size:0.8rem;">Sold Out</span>`
          : "";

      return `
        <a href="./shoe_detail.html?id=${shoe.id}">
            <figure class="shoe_container">
                <img src="${shoe.image_url}" alt="${shoe.name}" style="${totalStock === 0 ? "opacity:0.5;" : ""}">
                <figcaption>
                    <p class="shoe_name">${shoe.name}</p>
                    <p class="shoe_type">${shoe.category}</p>
                    <p class="shoe_price">Rp ${Number(shoe.price).toLocaleString("id-ID")} ${statusBadge}</p>
                </figcaption>
            </figure>
        </a>`;
    })
    .join("");
});
