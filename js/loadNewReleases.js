document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("newReleaseContainer");

  // Ambil data sepatu yang statusnya 'new_release'
  const { data: shoes, error } = await window.db
    .from("shoes")
    .select("*")
    .eq("status", "new_release") // Pastikan kolom 'status' ada di DB
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching new releases:", error);
    return;
  }

  if (shoes.length === 0) {
    container.innerHTML = "<p>No new releases at the moment.</p>";
    return;
  }

  container.innerHTML = shoes
    .map(
      (shoe) => `
        <a href="./shoe_detail.html?id=${shoe.id}">
            <figure class="shoe_container">
                <img src="${shoe.image_url}" alt="${shoe.name}">
                <figcaption>
                    <p class="shoe_name">${shoe.name}</p>
                    <p class="shoe_type">${shoe.category}</p>
                    <p class="shoe_price">Rp ${Number(shoe.price).toLocaleString("id-ID")}</p>
                    <p class="date">Released: ${new Date(shoe.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                </figcaption>
            </figure>
        </a>
    `,
    )
    .join("");
});
