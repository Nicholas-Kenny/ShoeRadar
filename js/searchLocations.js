const navbarSearch = document.getElementById("locationSearch");

const heroSearch = document.getElementById("heroLocationSearch");

function filterLocations(keyword) {
  keyword = keyword.toLowerCase().trim();

  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const title = card.querySelector(".card-title").textContent.toLowerCase();

    card.style.display = title.includes(keyword) ? "" : "none";
  });

  document.querySelectorAll(".location-group").forEach((group) => {
    const visibleCards = group.querySelectorAll(
      '.card:not([style*="display: none"])',
    );

    group.style.display = visibleCards.length > 0 ? "" : "none";
  });
}

if (navbarSearch) {
  navbarSearch.addEventListener("input", (e) =>
    filterLocations(e.target.value),
  );
}

if (heroSearch) {
  heroSearch.addEventListener("input", (e) => filterLocations(e.target.value));
}
