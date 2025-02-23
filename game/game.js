const player = document.getElementById("player");
const gameArea = document.getElementById("game-area");

const gameAreaWidth = gameArea.offsetWidth;
const gameAreaHeight = gameArea.offsetHeight;

let playerPosition = {
  x: gameAreaWidth / 2 - 15, // Centralizado
  y: gameAreaHeight /2 - 15, // Posição no chão
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

// Função para criar obstáculos
const createObstacle = () => {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  // Posição aleatória horizontal
  const xPosition = Math.random() * (gameAreaWidth - 30);

  obstacle.style.left = `${xPosition}px`;
  obstacle.style.top = "0px"; // Começa no topo da tela
  gameArea.appendChild(obstacle);

  // Movimentação do obstáculo
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
      alert("Game Over!");
      resetGame();
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
  playerPosition.x = gameAreaWidth / 2 - 15;
  playerPosition.y = gameAreaHeight / 2 - 15;
  updatePlayerPosition();

  const obstacles = document.querySelectorAll(".obstacle");
  obstacles.forEach((obstacle) => gameArea.removeChild(obstacle));
};

// Escutando as teclas pressionadas
window.addEventListener("keydown", movePlayer);

// Função que cria um obstáculo a cada 2 segundos
setInterval(createObstacle, 1000);

// Inicializa a posição do jogador
updatePlayerPosition();
