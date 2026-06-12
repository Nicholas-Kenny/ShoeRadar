document.addEventListener("DOMContentLoaded", async () => {
  const {
    data: { session },
    error,
  } = await window.db.auth.getSession();

  if (!session || error) {
    window.location.replace("index.html");
    return;
  }

  const { data: profile } = await window.db
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  // Jika user biasa mencoba masuk ke file apapun yang ada kata "admin" di namanya
  if (
    window.location.pathname.includes("admin") &&
    (!profile || profile.role !== "admin")
  ) {
    alert("Access Denied: Administrator privileges required.");
    window.location.replace("home.html");
    return; // Hentikan eksekusi skrip lain
  }
});
