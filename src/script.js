// @ts-nocheck
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");
let balls = [];
let score = 0;
const minRadius = 15;
const maxRadius = 50;
let isPaused = false;
let isGameOver = false;
let ballsCount = 10;
let maxLeaderboard = 5;
let _name = localStorage["_name"] || prompt('Enter your name',"Guest");
let _id = localStorage["_id"] || "_id"+_name;
localStorage["_name"] = _name;
localStorage["_id"] = _id;
let lastClick = {
  x: null,
  y: null,
};
let leaderBoard = [];
let highScore = localStorage["highScore"] || 0;
const setLeaderBoard = () => {
  localStorage["leaderBoard"] = JSON.stringify(
    leaderBoard.length
      ? leaderBoard
      : [
          { id: "xyz", name: "Nikky", score: "908" },
          { id: "abc", name: "nik", score: "20" },
          { id: "pqr", name: "em", score: "0" },
        ]
  );
};

const getLeaderBoard = () => {
  leaderBoard = localStorage["leaderBoard"]&&JSON.parse(localStorage["leaderBoard"]) || [
    { id: "xyz", name: "na", score: "1008" },
    { id: "abc", name: "nik", score: "20" },
    { id: "pqr", name: "em", score: "0" },
  ];
};
const compare = (a, b) => {
  if (Number.parseInt(a.score) < Number.parseInt(b.score)) {
    return 1;
  }
  if (Number.parseInt(a.score) > Number.parseInt(b.score)) {
    return -1;
  }
  return 0;
};
getLeaderBoard();
setLeaderBoard();
class Circle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = Math.floor(Math.random() * 5) + 1;
    this.dx *= Math.floor(Math.random() * 5) == 1 ? 1 : -1;
    this.dy = Math.floor(Math.random() * 3) + 1;
    this.dy *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
    this.score = Math.abs(
      Math.floor((maxRadius * 10 * this.dx * this.dy) / this.radius)
    );
  }
  draw = () => {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    setFontSize((this.radius / 20) * 15);
    ctx.fillText(`${this.score}`, this.x, this.y, this.radius * 2);
  };

  animate = () => {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
    if (balls.length > 1) {
      for (let i = 0; i < balls.length; i++) {
        for (let j = i; j < balls.length; j++) {
          ballCollitionCheck([balls[i], balls[j]]);
        }
      }
    }
    (isPaused || isGameOver) && (this.dy = this.dx = 0);
    setFontSize(30);
    ctx.fillText("Score : " + score, canvas.width - 100, 50, 100);
    isGameOver && gameOver();
    this.draw();
  };
}

const createBall = (pos, c) => {
  let r = Math.floor(Math.random() * (maxRadius - minRadius)) + minRadius;
  let x = pos && pos.x ? pos.x : Math.random() * (canvas.width - r * 2) + r;
  let y = pos && pos.y ? pos.y : Math.random() * (canvas.height - r * 2) + r;
  let colors = ["blue", "green", "pink", "black", "red"];
  let i = Math.floor(Math.random() * colors.length);
  let color = c ? c : colors[i];
  let ball = new Circle(x, y, r, color);
  return ball;
};

const setFontSize = (size) => {
  var fontArgs = ctx.font.split(" ");
  var newSize = size + "px";
  ctx.font = newSize + " " + fontArgs[fontArgs.length - 1];
};

const gameOver = () => {
  updateScores();
  setFontSize(50);
  ctx.fillStyle = "red";
  ctx.fillText("Game Over", canvas.width / 4, canvas.height / 2 - 45, 300);
  setFontSize(10);
  ctx.fillText("X", lastClick.x, lastClick.y, 10);
  showLeaderBoard();
};

const updateScores = () => {
  leaderBoard.sort(compare);
  let index = leaderBoard.findIndex((player) => player.id == _id);
  if (index != -1) {
    if (score > highScore) {
      leaderBoard[index].score = score;
    }
  } else {
      leaderBoard.push({
        id: _id,
        name: _name,
        score: score,
      });
  }
  leaderBoard.sort(compare);
  leaderBoard = leaderBoard.slice(0,5);
  setLeaderBoard();
  if (score > highScore) {
    highScore = score;
    localStorage["highScore"] = highScore;
  }
  setFontSize(30);
  ctx.fillText("Score : " + score, canvas.width / 4, canvas.height / 2, 300);
  setFontSize(20);
  ctx.fillText(
    "HighScore : " + highScore,
    canvas.width / 4,
    canvas.height / 2 + 45,
    300
  );
};
const showLeaderBoard = () => {
  ctx.fillStyle = "#dedede";
  let w = 250;
  let h = 50 * leaderBoard.length + 15;
  let x = (canvas.width * 3) / 4 - 125;
  let y = canvas.height / 2 - h / 2;

  ctx.fillRect(x, y, w, h);
  setFontSize(19);
  ctx.fillStyle = "blue";
  ctx.fillText("LeaderBoard", x + w / 2, y + 15, 300);
  setFontSize(20);
  for (let i = 0; i < leaderBoard.length; i++) {
    const player = leaderBoard[i];
    ctx.fillStyle = "black";
    ctx.fillText(i + 1 + ". " + player.name, x + 50, y + 48 * (i + 1), 300);
    ctx.fillStyle = "green";
    ctx.fillText(player.score, x + w - 50, y + 48 * (i + 1), 300);
    if (player.id == _id) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 5;
      ctx.strokeRect(x + 20, y + 30 + 50 * i, w - 40, 30);
    }
  }
};

const won = () => {
  updateScores();
  setFontSize(50);
  ctx.fillStyle = "green";
  ctx.fillText("You won", canvas.width / 4, canvas.height / 2 - 45, 300);
  showLeaderBoard();
};

const gameReset = () => {
  window.location.reload();
};

canvas.addEventListener("click", (pos) => {
  for (let i = 0; i < balls.length; i++) {
    if (
      Math.abs(balls[i].x - pos.x + 10) < balls[i].radius + 10 &&
      Math.abs(balls[i].y - pos.y + 10) < balls[i].radius + 10 &&
      !isGameOver
    ) {
      let ball = createBall();
      score += balls[i].score;
      balls[i].color = "white";
      setTimeout(() => {
        balls.splice(i, 1);
        if (balls.length == 0) {
          isGameOver = true;
          won();
        }
      }, 50);

      //   balls.push(ball);
      break;
    } else {
      if (i == balls.length - 1 && !isGameOver) {
        isGameOver = true;
        lastClick.x = pos.x;
        lastClick.y = pos.y;
        break;
      } else {
        isGameOver && gameReset();
      }
    }
  }
  !balls.length && gameReset();
});

const ballCollitionCheck = (balls) => {
  if (
    Math.abs(balls[0].x - balls[1].x) < balls[0].radius + balls[1].radius &&
    Math.abs(balls[0].y - balls[1].y) < balls[0].radius + balls[1].radius
  ) {
    balls[0].dx = -balls[0].dx;
    balls[0].dy = -balls[0].dy;
    balls[1].dx = -balls[1].dx;
    balls[1].dy = -balls[1].dy;
  }
};

const update = () => {
  if (balls.length) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let index = 0; index < balls.length; index++) {
      balls[index].animate();
    }
  }

  requestAnimationFrame(update);
};

const startGame = () => {
  balls = [];
  for (let index = 0; index < ballsCount; index++) {
    let ball = createBall();
    balls.push(ball);
  }
  update();
};

startGame();
