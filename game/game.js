const player = document.getElementById("player");
const gameArea = document.getElementById("game-area");

const gameAreaWidth = gameArea.offsetWidth;
const gameAreaHeight = gameArea.offsetHeight;

const hitSound = new Audio("./assets/sounds/hit.mp3");
const gameOverSound = new Audio("./assets/sounds/gameover.mp3");
const levelupSound = new Audio("./assets/sounds/levelup.mp3");
const selectSound = new Audio("./assets/sounds/select.mp3");

let playerPosition = {
  x: 35,
  y: gameAreaHeight / 2 - 15,
};

let playerSpeed = 5;

const defaultObstacleSpeed = 3;
let obstacleSpeed = defaultObstacleSpeed;

const totalLives = 3;
let lives = totalLives;
let isGameOver = false;

// Função para atualizar a posição do jogador
const updatePlayerPosition = () => {
  player.style.left = `${playerPosition.x}px`;
  player.style.bottom = `${playerPosition.y}px`;
};

// Função para mover o jogador com base nas teclas pressionadas
const movePlayer = (event) => {
  if (isGameOver) return;

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
  checkGoalReached();
};

// Função para criar obstáculos aleatoriamente
const createObstacle = () => {
  if (isGameOver) return;

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
// Função para mover os obstáculos para baixo
const moveObstacle = (obstacle) => {
  if (isGameOver) return;

  let obstaclePosition = parseInt(obstacle.style.top);

  const moveInternal = setInterval(() => {
    obstaclePosition += obstacleSpeed;
    obstacle.style.top = `${obstaclePosition}px`;

    // Verifica se está nos limites de altura da área do jogo e remove caso não esteja
    if (obstaclePosition > gameAreaHeight) {
      clearInterval(moveInternal);
      if (gameArea.contains(obstacle)) {
        gameArea.removeChild(obstacle);
      }
    }
    // Se tiver colisão remove o obstáculo e perde vida
    if (checkCollision(obstacle)) {
      clearInterval(moveInternal);
      loseLife();
      if (gameArea.contains(obstacle)) {
        gameArea.removeChild(obstacle);
      }
    }
  }, 20);
};

// Função para checar se houve colisão comparando as posições
const checkCollision = (obstacle) => {
  const obstacleRect = obstacle.getBoundingClientRect();
  const playerRect = player.getBoundingClientRect();

  return !(
    obstacleRect.bottom < playerRect.top + 10 ||
    obstacleRect.top > playerRect.bottom - 10 ||
    obstacleRect.right < playerRect.left + 10 ||
    obstacleRect.left > playerRect.right - 10
  );
};

const livesContainer = document.getElementById("lives-container");

// Função para exibir as vidas na tela
const updateLives = () => {
  livesContainer.innerHTML = "";
  for (let i = 0; i < totalLives; i++) {
    let heart = document.createElement("div");

    heart.classList.add("heart");

    if (i < lives) {
      heart.classList.add("heart");
    } else {
      heart.classList.remove("heart");
    }

    livesContainer.appendChild(heart);
  }
};
// Função para remover vida
const loseLife = () => {
  if (lives >= 0) {
    lives--;
    updateLives();
  }
  if (lives > 0) {
    hitSound.play();
  }
  if (lives == 0) {
    gameOver();
  }
};

let obstacleIntervals = [];
// Função para resetar vidas e posição do jogador
const resetUpdate = () => {
  lives = 3;

  playerPosition.x = 35;
  playerPosition.y = gameAreaHeight / 2 - 15;

  updatePlayerPosition();
  updateLives();
};
// Função para resetar jogo
const resetGame = () => {
  isGameOver = false;
  level = 1;
  document.querySelector("#level-display").innerText = `Level ${level}`;

  resetUpdate();

  obstacleSpeed = defaultObstacleSpeed;

  obstacleIntervals.forEach((interval) => clearInterval(interval));

  clearAllIntervals();
};
// Função de game over
const gameOver = () => {
  isGameOver = true;
  gameOverSound.play();
  const obstacles = document.querySelectorAll(".obstacle");
  obstacles.forEach((obstacle) => gameArea.removeChild(obstacle));

  document.querySelector("#game-over-screen").classList.remove("hidden");
};

const goal = document.getElementById("goal");
// Função para verificar se o jogador está na mesma posição que o alvo
const checkGoalReached = () => {
  const playerRect = player.getBoundingClientRect();
  const goalRect = goal.getBoundingClientRect();

  const isPlayerOnGoalHorizontal =
    playerRect.left >= goalRect.left && playerRect.right <= goalRect.right;

  const isPlayerOnGoalVertical =
    playerRect.bottom <= goalRect.bottom && playerRect.top >= goalRect.top;

  if (isPlayerOnGoalHorizontal && isPlayerOnGoalVertical) {
    levelUp();
  }
};
let level = 1;

// Função para aumentar o nível
const levelUp = () => {
  level++;
  levelupSound.play();
  if (level != 11){
    document.querySelector("#level-display").innerText = `Level ${level}`;
    resetUpdate();
  }

  let obstacleInterval = Math.max(2000 - level * 100, 500);

  obstacleIntervals.forEach((interval) => clearInterval(interval));
  obstacleIntervals = [];

  // Lógica de aumento de dificuldade
  if (level % 2 === 0 && obstacleSpeed < 10) {
    obstacleSpeed += 1;
  } else {
    const newInterval = setInterval(createObstacle, obstacleInterval);
    obstacleIntervals.push(newInterval);

    if (level < 6) {
      obstacleSpeed = defaultObstacleSpeed;
    }
  }
  if (level == 10) {
    obstacleInterval = 350;
    const newInterval = setInterval(createObstacle, obstacleInterval);
    obstacleIntervals.push(newInterval);
  }
  if (level == 11) {
    isGameOver = true;
    const obstacles = document.querySelectorAll(".obstacle");
    obstacles.forEach((obstacle) => gameArea.removeChild(obstacle));

    document.querySelector("#game-completed").classList.remove("hidden");
  }
};

// Eventos

window.addEventListener("keydown", movePlayer);

document.querySelector("#play-again-button").addEventListener("click", () => {
  document.querySelector("#game-completed").classList.add("hidden");
  selectSound.play();
  resetGame();
});

document.querySelector("#retry-button").addEventListener("click", () => {
  document.querySelector("#game-over-screen").classList.add("hidden");
  selectSound.play();
  resetGame();
});

document
  .querySelector("#back-gameover-button")
  .addEventListener("click", () => {
    document.querySelector("#game-over-screen").classList.add("hidden");
    selectSound
      .play()
      .then(() => {
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("Erro ao reproduzir o som:", error);
      });
  });

document.querySelector("#back-button").addEventListener("click", () => {
  document.querySelector("#game-completed").classList.add("hidden");
  selectSound
    .play()
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Erro ao reproduzir o som:", error);
    });
});

setInterval(createObstacle, 1000);
updatePlayerPosition();
updateLives();
