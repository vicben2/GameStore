const games = [
  { title: "Dragon Quest", genre: "RPG", price: 29.99, img: "https://via.placeholder.com/250x140?text=Dragon+Quest" },
  { title: "Call of Warfare", genre: "Shooter", price: 49.99, img: "https://via.placeholder.com/250x140?text=Call+of+Warfare" },
  { title: "Sky Builder", genre: "Simulation", price: 19.99, img: "https://via.placeholder.com/250x140?text=Sky+Builder" },
  { title: "Fast Racers", genre: "Racing", price: 24.99, img: "https://via.placeholder.com/250x140?text=Fast+Racers" },
  { title: "Fantasy Tactics", genre: "Strategy", price: 39.99, img: "https://via.placeholder.com/250x140?text=Fantasy+Tactics" },
  { title: "Zombie Slayer", genre: "Action", price: 19.99, img: "https://via.placeholder.com/250x140?text=Zombie+Slayer" },
  { title: "Cyber Legends", genre: "Sci-Fi", price: 39.99, img: "https://via.placeholder.com/250x140?text=Cyber+Legends" },
  { title: "Pirate's Treasure", genre: "Adventure", price: 29.99, img: "https://via.placeholder.com/250x140?text=Pirate's+Treasure" },
  { title: "Alien Invasion", genre: "Shooter", price: 29.99, img: "https://via.placeholder.com/250x140?text=Alien+Invasion" },
  { title: "Medieval War", genre: "Strategy", price: 34.99, img: "https://via.placeholder.com/250x140?text=Medieval+War" },
  { title: "Wings of Fury", genre: "Flight", price: 22.99, img: "https://via.placeholder.com/250x140?text=Wings+of+Fury" },
  { title: "City Builder", genre: "Simulation", price: 24.99, img: "https://via.placeholder.com/250x140?text=City+Builder" },
  { title: "The Last Ninja", genre: "Action", price: 19.99, img: "https://via.placeholder.com/250x140?text=The+Last+Ninja" },
  { title: "Shadow Hunter", genre: "Action", price: 29.99, img: "https://via.placeholder.com/250x140?text=Shadow+Hunter" },
  { title: "Mystery Manor", genre: "Puzzle", price: 14.99, img: "https://via.placeholder.com/250x140?text=Mystery+Manor" },
  { title: "Battle Arena", genre: "Fighting", price: 19.99, img: "https://via.placeholder.com/250x140?text=Battle+Arena" },
  { title: "Escape the Maze", genre: "Puzzle", price: 12.99, img: "https://via.placeholder.com/250x140?text=Escape+the+Maze" },
  { title: "Space Odyssey", genre: "Sci-Fi", price: 39.99, img: "https://via.placeholder.com/250x140?text=Space+Odyssey" }
];

let cart = [];

// Simulating login check. Replace this with your actual login check logic
let isLoggedIn = false; // Set to `true` when the user is logged in.

function displayGames(filteredGames = games) {
  const gameList = document.getElementById("games");
  gameList.innerHTML = "";

  filteredGames.forEach((game, index) => {
    const card = document.createElement("div");
    card.className = "game-card";
    card.innerHTML = `
        <img src="${game.img}" alt="${game.title}">
        <h3>${game.title}</h3>
        <p>Genre: ${game.genre}</p>
        <p>$${game.price.toFixed(2)}</p>
        <button onclick="addToCart(${index})">Add to Cart</button>
      `;
    gameList.appendChild(card);
  });
}

function addToCart(index) {
  if (!isLoggedIn) {
    // Redirect to login page if not logged in
    window.location.href = "login.html";
  } else {
    // Proceed with adding to cart
    cart.push(games[index]);
    updateCart();
  }
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(game => {
    const item = document.createElement("li");
    item.textContent = `${game.title} - $${game.price.toFixed(2)}`;
    cartItems.appendChild(item);
    total += game.price;
  });

  cartTotal.textContent = total.toFixed(2);
}

function checkout() {
  alert("Thank you for your purchase!");
  cart = [];
  updateCart();
}

document.getElementById("searchInput").addEventListener("input", function () {
  const searchValue = this.value.toLowerCase();
  const filtered = games.filter(game =>
    game.genre.toLowerCase().includes(searchValue)
  );
  displayGames(filtered);
});

displayGames();
function suggestGame() {
  // Select a random game from the games array
  const randomGame = games[Math.floor(Math.random() * games.length)];

  // Get the game suggestion container
  const suggestionContainer = document.getElementById("gameSuggestion");

  // Update the container with the random game
  suggestionContainer.innerHTML = `
      <img src="${randomGame.img}" alt="${randomGame.title}">
      <h3>${randomGame.title}</h3>
      <p>Genre: ${randomGame.genre}</p>
      <div class="price-tag">$${randomGame.price.toFixed(2)}</div>
      <button class="buy-btn" onclick="addToCart(${games.indexOf(randomGame)})">Add to Cart</button>
    `;
}

function displayGameSuggestions() {
  const gameSuggestions = document.getElementById("gameSuggestions");
  gameSuggestions.innerHTML = "";
  const suggestedGames = games.slice(0, 4); // Just showing the first 4 games for suggestions
  suggestedGames.forEach(game => {
    const div = document.createElement("div");
    div.className = "game-card";
    div.innerHTML = `
      <img src="${game.img}" alt="${game.title}">
      <h3>${game.title}</h3>
      <p>Genre: ${game.genre}</p>
      <div class="price-tag">$${game.price.toFixed(2)}</div>
      <button class="buy-btn" onclick="addToCart(${games.indexOf(game)})">Add to Cart</button>
    `;
    gameSuggestions.appendChild(div);
  });
}
window.onload = () => {
  displayGames();
  displayGameSuggestions();  // Call this to display the game suggestions on the library home page
  updateCart();
  updateLibrary();
};
