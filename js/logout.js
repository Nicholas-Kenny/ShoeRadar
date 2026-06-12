// Wait for DOM to load in case the button isn't rendered immediately
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      // Terminate the Supabase session
      const { error } = await window.db.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        alert("Failed to log out. Please try again.");
        return;
      }

      alert("Logged out successfully");
      window.location.replace("index.html");
    });
  }
});
