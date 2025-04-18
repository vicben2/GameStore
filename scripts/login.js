function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("rememberMe").checked;
    const usernameError = document.getElementById("username-error");
    const passwordError = document.getElementById("password-error");

    usernameError.textContent = "";
    passwordError.textContent = "";

    if (!username) {
        usernameError.textContent = "Username is required.";
        return;
    }

    if (!password) {
        passwordError.textContent = "Password is required.";
        return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        alert("Invalid username or password.");
        return;
    }

    if (rememberMe) {
        localStorage.setItem("rememberedUsername", user.username);
    } else {
        localStorage.removeItem("rememberedUsername");
    }

    sessionStorage.setItem("username", user.username);
    sessionStorage.setItem("role", user.role); // Ensure role is set

    if (user.role === "developer") {
        window.location.href = "dashboard_dev.html"; // Redirect to developer dashboard
    } else {
        window.location.href = "dashboard.html"; // Redirect to user dashboard
    }
}

const passwordInput = document.getElementById("password");
const togglePasswordButton = document.getElementById("togglePassword");

togglePasswordButton.addEventListener("click", function () {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePasswordButton.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        togglePasswordButton.textContent = "Show";
    }
});

const rememberedUsername = localStorage.getItem("rememberedUsername");
if (rememberedUsername) {
    document.getElementById("username").value = rememberedUsername;
    document.getElementById("rememberMe").checked = true;
}