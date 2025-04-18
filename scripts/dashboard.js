const username = sessionStorage.getItem("username") || "Guest";
document.getElementById("username").textContent = username;
const isLoggedIn = username !== "Guest";

const games = [
    { title: "Dragon Quest", genre: "RPG", price: 29.99, img: "https://via.placeholder.com/250x140?text=Dragon+Quest" },
    { title: "Call of Warfare", genre: "Shooter", price: 49.99, img: "https://via.placeholder.com/250x140?text=Call+of+Warfare" },
    { title: "Sky Builder", genre: "Simulation", price: 19.99, img: "https://via.placeholder.com/250x140?text=Sky+Builder" },
    { title: "Fast Racers", genre: "Racing", price: 24.99, img: "https://via.placeholder.com/250x140?text=Fast+Racers" },
    { title: "Fantasy Tactics", genre: "Strategy", price: 39.99, img: "https://via.placeholder.com/250x140?text=Fantasy+Tactics" },
    { title: "Zombie Slayer", genre: "Action", price: 19.99, img: "https://via.placeholder.com/250x140?text=Zombie+Slayer" },
    { title: "Cyber Legends", genre: "Sci-Fi", price: 39.99, img: "https://via.placeholder.com/250x140?text=Cyber+Legends" },
    { title: "Pirate's Treasure", genre: "Adventure", price: 29.99, img: "https://via.placeholder.com/250x140?text=Pirate's+Treasure" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let purchased = JSON.parse(localStorage.getItem("purchased")) || [];
let downloaded = JSON.parse(localStorage.getItem("downloaded")) || [];

function displayGames(filteredGames = games) {
    const gameList = document.getElementById("gameList");
    gameList.innerHTML = "";
    filteredGames.forEach((game, i) => {
        const div = document.createElement("div");
        div.className = "game-card";
        div.innerHTML = `
      <img src="${game.img}" alt="${game.title}">
      <h3>${game.title}</h3>
      <p>Genre: ${game.genre}</p>
      <div class="price-tag">$${game.price.toFixed(2)}</div>
      <button class="buy-btn" onclick="addToCart(${i})">Add to Cart</button>
    `;
        gameList.appendChild(div);
    });
}

function addToCart(index) {
    if (!isLoggedIn) return window.location.href = "login.html";
    cart.push(games[index]);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    cartItems.innerHTML = "";
    let total = 0;
    cart.forEach((game, i) => {
        const li = document.createElement("li");
        li.innerHTML = `
      ${game.title} - $${game.price.toFixed(2)}
      <button class="remove-btn" onclick="removeFromCart(${i})">Remove</button>
    `;
        cartItems.appendChild(li);
        total += game.price;
    });
    cartTotal.textContent = total.toFixed(2);
}

function checkout() {
    cart.forEach(game => {
        if (!purchased.find(g => g.title === game.title)) {
            purchased.push({ title: game.title, img: game.img });
            downloaded.push({ title: game.title, img: game.img });
        }
    });
    cart = [];
    localStorage.setItem("purchased", JSON.stringify(purchased));
    localStorage.setItem("downloaded", JSON.stringify(downloaded));
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
    updateLibrary();
    alert("✅ Thank you for your purchase!");
}

function updateLibrary() {
    const libraryList = document.getElementById("libraryList");
    const downloadedList = document.getElementById("downloadedList");
    libraryList.innerHTML = "";
    downloadedList.innerHTML = "";

    purchased.forEach(game => {
        const div = document.createElement("div");
        div.className = "library-item";
        div.innerHTML = `
      <img src="${game.img}" alt="${game.title}">
      <div class="library-item-details">
        <h4>${game.title}</h4>
        <p>Purchased</p>
        <button class="download-btn" onclick="download('${game.title}')">Download</button>
        <button class="remove-collection-btn" onclick="removeFromCollection('${game.title}')">Remove</button>
      </div>
    `;
        libraryList.appendChild(div);
    });

    downloaded.forEach(game => {
        const div = document.createElement("div");
        div.className = "library-item";
        div.innerHTML = `
      <img src="${game.img}" alt="${game.title}">
      <div class="library-item-details">
        <h4>${game.title}</h4>
        <p>Downloaded</p>
      </div>
    `;
        downloadedList.appendChild(div);
    });
}

function removeFromCollection(title) {
    // Remove game from purchased list by filtering
    purchased = purchased.filter(game => game.title !== title);
    localStorage.setItem("purchased", JSON.stringify(purchased));
    updateLibrary();
}

function download(title) {
    alert(`⬇️ Downloading ${title}...`);
}

function toggleTheme() {
    const root = document.documentElement.style;
    const dark = getComputedStyle(document.body).backgroundColor === 'rgb(18, 18, 18)';
    if (dark) {
        root.setProperty('--bg', '#f4f4f4');
        root.setProperty('--text', '#000');
    } else {
        root.setProperty('--bg', '#121212');
        root.setProperty('--text', '#fff');
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = "login.html";
}

document.querySelectorAll(".tab-button").forEach(btn => {
    btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
        document.getElementById(tab).classList.add("active");
        document.getElementById("profile").style.display = "none";
        document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});

document.querySelectorAll(".lib-tab-button").forEach(btn => {
    btn.addEventListener("click", () => {
        const tab = btn.dataset.libTab;
        document.querySelectorAll(".lib-section").forEach(sec => sec.classList.remove("active"));
        document.getElementById(tab).classList.add("active");
        document.querySelectorAll(".lib-tab-button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});

document.getElementById("searchInput").addEventListener("input", function () {
    const search = this.value.toLowerCase();
    const filtered = games.filter(game =>
        game.title.toLowerCase().includes(search) || game.genre.toLowerCase().includes(search)
    );
    displayGames(filtered);
});

window.onload = () => {
    displayGames();
    updateCart();
    updateLibrary();
};