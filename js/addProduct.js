const form = document.getElementById("addProductForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("shoeName").value;

  const price = Number(document.getElementById("shoePrice").value);

  const stock = Number(document.getElementById("shoeStock").value);

  const description = document.getElementById("shoeDescription").value;

  const location = document.getElementById("shoeLocation").value;

  const image = document.getElementById("shoeImage").value;

  const { data, error } = await window.db.from("shoes").insert([
    {
      name,
      price,
      stock,
      description,
      location,
      image,
    },
  ]);

  console.log(data);
  console.log(error);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Product Added Successfully");

  form.reset();
});
