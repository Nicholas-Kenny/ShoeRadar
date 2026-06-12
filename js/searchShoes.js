document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("shoeSearch");

  // Pastikan elemen ditemukan sebelum menjalankan fungsi apapun
  if (!searchInput) return;

  // 1. Logika Pencarian Real-time (Input)
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    const shoes = document.querySelectorAll(".shoe_container");

    shoes.forEach((shoe) => {
      const name = shoe.querySelector(".shoe_name").textContent.toLowerCase();
      // Gunakan style.display = "" untuk reset ke default CSS
      shoe.style.display = name.includes(keyword) ? "" : "none";
    });
  });

  // 2. Logika Enter untuk Pindah Halaman
  searchInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    const firstMatch = document.querySelector(
      ".shoe_container:not([style*='display: none'])",
    );

    if (firstMatch) {
      const link = firstMatch.closest("a");
      if (link) {
        window.location.href = link.href;
      }
    }
  });
});
