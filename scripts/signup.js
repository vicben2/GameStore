function signup() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    if (!username || !password) {
        alert("Please enter all fields.");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.some(u => u.username === username)) {
        alert("Username already exists.");
        return;
    }

    users.push({ username, password, role });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully!");
    window.location.href = "login.html"; // Redirect to login page after sign-up
}