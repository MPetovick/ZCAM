const MAP_WIDTH = 8;
const MAP_HEIGHT = 12;
const TILE_SIZE = 50;

// Estado inicial del juego
let player = { x: 1, y: 1, lives: 3 };
let zombies = [];
let days = 0;
let elapsedTime = 0;
let gameInterval;

// Referencias a elementos del DOM
const gameContainer = document.getElementById("game-container");
const livesDisplay = document.getElementById("lives");
const daysDisplay = document.getElementById("days");
const timeDisplay = document.getElementById("time");

// Crear el mapa
function createMap() {
  gameContainer.style.gridTemplateColumns = `repeat(${MAP_WIDTH}, ${TILE_SIZE}px)`;
  gameContainer.style.gridTemplateRows = `repeat(${MAP_HEIGHT}, ${TILE_SIZE}px)`;

  gameContainer.innerHTML = "";
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.dataset.x = x;
      tile.dataset.y = y;
      gameContainer.appendChild(tile);
    }
  }
}

// Actualizar posiciones visuales
function updatePositions() {
  document.querySelectorAll(".tile").forEach(tile => {
    tile.classList.remove("player", "zombie");
  });

  document.querySelector(`.tile[data-x='${player.x}'][data-y='${player.y}']`).classList.add("player");

  zombies.forEach(({ x, y }) => {
    const zombieTile = document.querySelector(`.tile[data-x='${x}'][data-y='${y}']`);
    if (zombieTile) zombieTile.classList.add("zombie");
  });
}

// Crear zombies
function createZombies(count) {
  zombies = [];
  for (let i = 0; i < count; i++) {
    let x, y;
    do {
      x = Math.floor(Math.random() * MAP_WIDTH);
      y = Math.floor(Math.random() * MAP_HEIGHT);
    } while (x === player.x && y === player.y); // Evitar spawn en la posición del jugador

    zombies.push({ x, y });
  }
}

// Mover zombies
function moveZombies() {
  zombies.forEach(zombie => {
    const direction = Math.floor(Math.random() * 4);
    if (direction === 0 && zombie.x > 0) zombie.x -= 1; // Izquierda
    if (direction === 1 && zombie.x < MAP_WIDTH - 1) zombie.x += 1; // Derecha
    if (direction === 2 && zombie.y > 0) zombie.y -= 1; // Arriba
    if (direction === 3 && zombie.y < MAP_HEIGHT - 1) zombie.y += 1; // Abajo
  });
}

// Comprobar colisiones
function checkCollisions() {
  zombies.forEach(({ x, y }) => {
    if (x === player.x && y === player.y) {
      player.lives -= 1;
      if (player.lives <= 0) {
        alert("¡Game Over!");
        clearInterval(gameInterval);
        resetGame();
      }
    }
  });
  updateStats();
}

// Actualizar estadísticas
function updateStats() {
  livesDisplay.textContent = `❤️ Vidas: ${player.lives}`;
  daysDisplay.textContent = `📅 Días: ${days}`;
  timeDisplay.textContent = `⏳ Tiempo: ${elapsedTime}s`;
}

// Control del jugador
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && player.x > 0) player.x -= 1;
  if (e.key === "ArrowRight" && player.x < MAP_WIDTH - 1) player.x += 1;
  if (e.key === "ArrowUp" && player.y > 0) player.y -= 1;
  if (e.key === "ArrowDown" && player.y < MAP_HEIGHT - 1) player.y += 1;
  updatePositions();
  checkCollisions();
});

// Reiniciar juego
function resetGame() {
  player = { x: 1, y: 1, lives: 3 };
  days = 0;
  elapsedTime = 0;
  createMap();
  createZombies(1);
  updatePositions();
  updateStats();
}

// Inicializar juego
function startGame() {
  createMap();
  resetGame();

  gameInterval = setInterval(() => {
    elapsedTime++;
    if (elapsedTime % 60 === 0) {
      days++;
      createZombies(days);
    }
    moveZombies();
    updatePositions();
    checkCollisions();
    updateStats();
  }, 1000);
}

startGame();
