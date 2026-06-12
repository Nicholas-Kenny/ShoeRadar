document.addEventListener("DOMContentLoaded", async () => {
  // 1. Redirect if already logged in
  const {
    data: { session },
  } = await window.db.auth.getSession();
  if (session) {
    checkRoleAndRedirect(session.user.id);
    return;
  }

  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    // 2. Attempt to log in via Supabase Auth
    const { data: signInData, error: signInError } =
      await window.db.auth.signInWithPassword({
        email: email,
        password: password,
      });

    if (signInError) {
      // If the user doesn't exist, Supabase returns an "Invalid login credentials" error.
      // We use this to trigger the account creation flow, matching your original UX.
      if (signInError.message.includes("Invalid login credentials")) {
        const createAccount = confirm(
          `Login failed. Would you like to create a new account for ${email}?`,
        );
        if (!createAccount) return;

        // 3. Attempt Sign Up
        const { data: signUpData, error: signUpError } =
          await window.db.auth.signUp({
            email: email,
            password: password,
          });

        if (signUpError) {
          alert("Signup failed: " + signUpError.message);
          return;
        }

        alert("Account created successfully! Please log in.");
        // Note: If you have "Confirm Email" turned on in Supabase, tell them to check their inbox here.
        return;
      } else {
        alert("Login Error: " + signInError.message);
        return;
      }
    }

    // 4. Successful Login: Fetch role and redirect
    alert("Login successful!");
    checkRoleAndRedirect(signInData.user.id);
  });
});

// Helper function to route the user to the correct dashboard
async function checkRoleAndRedirect(userId) {
  const { data: profile, error } = await window.db
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    console.error("Profile fetch error:", error);
    window.location.replace("home.html"); // Default to standard user view
    return;
  }

  if (profile.role === "admin") {
    window.location.replace("admin_home.html");
  } else {
    window.location.replace("home.html");
  }
}
