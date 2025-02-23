const player = document.getElementById("player");
const gameArea = document.getElementById("game-area");

const gameAreaWidth = gameArea.offsetWidth;
const gameAreaHeight = gameArea.offsetHeight;

let playerPosition = {
  x: gameAreaWidth / 2 - 15, // Centralizado
  y: gameAreaHeight / 2 - 15, // Posição no chão
};

const playerSpeed = 5;
const obstacleSpeed = 3;

// Função para atualizar a posição do jogador
const updatePlayerPosition = () => {
  player.style.left = `${playerPosition.x}px`;
  player.style.bottom = `${playerPosition.y}px`;
};

// Função para mover o jogador com base nas teclas pressionadas
const movePlayer = (event) => {
  switch (event.key) {
    case "ArrowLeft":
    case "a":
      if (playerPosition.x > 0) playerPosition.x -= playerSpeed;
      break;

    case "ArrowRight":
    case "d":
      if (playerPosition.x < gameAreaWidth - 30)
        playerPosition.x += playerSpeed;
      break;

    case "ArrowDown":
    case "s":
      if (playerPosition.y > 0) playerPosition.y -= playerSpeed;
      break;

    case "ArrowUp":
    case "w":
      if (playerPosition.y < gameAreaHeight - 30)
        playerPosition.y += playerSpeed;
      break;

    default:
      break;
  }
  updatePlayerPosition();
};

// Função para criar obstáculos com imagens aleatórias
const createObstacle = () => {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  const obstacleImages = [
    "./assets/obstacle1.png",
    "./assets/obstacle2.png",
    "./assets/obstacle3.png",
    "./assets/obstacle4.png",
  ];

  const randomImage =
    obstacleImages[Math.floor(Math.random() * obstacleImages.length)];

  const img = document.createElement("img");
  img.src = randomImage;
  img.alt = "Obstacle";
  img.style.width = "100%";
  img.style.height = "100%";
  obstacle.appendChild(img);

  const xPosition = Math.random() * (gameAreaWidth - 30);

  obstacle.style.left = `${xPosition}px`;
  obstacle.style.top = "0px";
  gameArea.appendChild(obstacle);

  moveObstacle(obstacle);
};

const moveObstacle = (obstacle) => {
  let obstaclePosition = parseInt(obstacle.style.top);

  const moveInternal = setInterval(() => {
    obstaclePosition += obstacleSpeed;
    obstacle.style.top = `${obstaclePosition}px`;

    if (obstaclePosition > gameAreaHeight) {
      clearInterval(moveInternal);
      gameArea.removeChild(obstacle);
    }

    if (checkCollision(obstacle)) {
      clearInterval(moveInternal);
      loseLife();
      removeObstacle(obstacle);
    }
  }, 20);
};

const checkCollision = (obstacle) => {
  const obstacleRect = obstacle.getBoundingClientRect();
  const playerRect = player.getBoundingClientRect();

  return !(
    obstacleRect.bottom < playerRect.top ||
    obstacleRect.top > playerRect.bottom ||
    obstacleRect.right < playerRect.left ||
    obstacleRect.left > playerRect.right
  );
};

const resetGame = () => {
  lives = 3;
  const obstacles = document.querySelectorAll(".obstacle");
  obstacles.forEach((obstacle) => gameArea.removeChild(obstacle));

  playerPosition.x = gameAreaWidth / 2 - 15;
  playerPosition.y = gameAreaHeight / 2 - 15;

  updatePlayerPosition();
  updateLives();
};

const removeObstacle = (obstacle) => {
  gameArea.removeChild(obstacle);
};

const livesContainer = document.getElementById("lives-container");
let lives = 3;
const totalLives = 3;

// Função para exibir as vidas na tela
const updateLives = () => {
  livesContainer.innerHTML = "";
  for (let i = 0; i < totalLives; i++) {
    let heart = document.createElement("div");

    heart.classList.add("heart");

    if (i < lives) {
      heart.classList.add("heart");
    } else {
      heart.classList.add("empty-heart");
    }

    livesContainer.appendChild(heart);
  }
};

const loseLife = () => {
  if (lives >= 0) {
    lives--;
    updateLives();
  }
  if (lives == 0) {
    alert("Game Over!");
    resetGame();
  }
};

window.addEventListener("keydown", movePlayer);

setInterval(createObstacle, 1000);
updatePlayerPosition();
updateLives();
