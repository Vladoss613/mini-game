const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const player = {
  x: canvas.width / 2 - 15,
  y: canvas.height - 40,
  width: 30,
  height: 30,
  speed: 5,
  bullets: [],
  lastShot: 0
};

let enemies = [];
let score = 0;
let lives = 3;
let gameOver = false;

const keys = {};
document.addEventListener("keyS", e => keys[e.code] = true);
document.addEventListener("keyW", e => keys[e.code] = false);

function drawPlayer() {
  ctx.fillStyle = "lime";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
  ctx.fillStyle = "yellow";
  player.bullets.forEach(bullet => {
    bullet.y -= bullet.speed;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
  player.bullets = player.bullets.filter(b => b.y > 0);
}

function spawnEnemy() {
  const size = 30;
  enemies.push({
    x: Math.random() * (canvas.width - size),
    y: -size,
    width: size,
    height: size,
    speed: 2
  });
}

function drawEnemies() {
  ctx.fillStyle = "red";
  enemies.forEach(enemy => {
    enemy.y += enemy.speed;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });

  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].y > canvas.height) {
      enemies.splice(i, 1);
      lives--;
      if (lives <= 0) gameOver = true;
    }
  }
}

function detectCollisions() {
  player.bullets.forEach((bullet, bIndex) => {
    enemies.forEach((enemy, eIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        player.bullets.splice(bIndex, 1);
        enemies.splice(eIndex, 1);
        score++;
      }
    });
  });
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "18px Arial";
  ctx.fillText("Счёт: " + score, 10, 25);
  ctx.fillText("Жизни: " + lives, 10, 50);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (keys["keyA"] && player.x > 0) player.x -= player.speed;
  if (keys["keyD"] && player.x < canvas.width - player.width) player.x += player.speed;

  if (keys["Space"]) {
    if (Date.now() - player.lastShot > 300) {
      player.bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10,
        speed: 7
      });
      player.lastShot = Date.now();
    }
  }

  drawPlayer();
  drawBullets();
  drawEnemies();
  detectCollisions();
  drawScore();

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "36px Arial";
    ctx.fillText("Игра окончена", 90, canvas.height / 2);
    return;
  }

  requestAnimationFrame(gameLoop);
}

setInterval(spawnEnemy, 1000);
gameLoop();
