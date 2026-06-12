const user = JSON.parse(localStorage.getItem("currentUser"));

if (!user) {
  window.location.href = "../Login/login.html";
}

if (user.role !== "admin") {
  alert("Access denied");

  window.location.href = "../Home/home.html";
}
