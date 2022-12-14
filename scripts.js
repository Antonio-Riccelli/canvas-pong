let canvas;
let canvasContext;
let ballX = 400;
let ballY = 300;
let ballSpeedX = 10;
let ballSpeedY = 4;
let paddle1Y = 250;
let paddle2Y = 250;
let playerScore = 0;
let computerScore = 0;
const winningScore = 5;
let showingWinScreen = false;
let showingStartScreen = true;

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");
  const framesPerSecond = 30;

  setInterval(callBoth, 1000 / framesPerSecond);

  canvas.addEventListener("mousemove", function(e) {
      let mousePosition = calculateMousePos(e);
      if (mousePosition.y - 35 < 0) {
        paddle1Y = 1;
        return
      }
      if (mousePosition.y >= canvas.height - 35) {
        paddle1Y = canvas.height - 70;
        console.log("New paddle1y", paddle1Y);
        return
      }
      paddle1Y = mousePosition.y - 35;
  })

  canvas.addEventListener("mousedown", function (e) {
    if (showingWinScreen) {
      playerScore = 0;
      computerScore = 0;
      showingWinScreen = !showingWinScreen;
    }

    if (showingStartScreen) {
      showingStartScreen = !showingStartScreen;
    }
  });};

  function calculateMousePos(e) {
      const rect = canvas.getBoundingClientRect();
      const root = document.documentElement;
      const mouseX = e.clientX - rect.left - root.scrollLeft;
      const mouseY = e.clientY - rect.top - root.scrollTop;
      return {
          x: mouseX,
          y: mouseY
      }
  }

function drawNet() {
  for (let i = 10; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 5, 20, "white");

  }
}

function callBoth() {
  drawEverything();
  moveEverything();
}

function computerMovement() {
  const paddle2Center = paddle2Y + 35;
  if (paddle2Center <= ballY - 35) {
    paddle2Y += 10;
  }

  if (paddle2Center >= ballY + 35) {
    paddle2Y -= 10;
  }
}

function moveEverything() {
  if (showingWinScreen | showingStartScreen) {
    return;
  }

  computerMovement();

  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;

  if (ballX <= 20 && ballY >= paddle1Y && ballY <= paddle1Y + 70) {
    ballSpeedX = -ballSpeedX;
    console.log("Left paddle Y", paddle1Y);

    let deltaY = ballY - (paddle1Y + 70 / 2);
    ballSpeedY = deltaY * 0.35;

    return;
  }

  if (
    ballX >= canvas.width - 20 &&
    ballY >= paddle2Y &&
    ballY <= paddle2Y + 70
  ) {
    ballSpeedX = -ballSpeedX;
    console.log("Right paddle Y", paddle1Y);
    let deltaY = ballY - (paddle2Y + 70 / 2);
    ballSpeedY = deltaY * 0.35;
    return;
  }

  // IF BALL GOES BEYOND PLAYER'S SIDE
  if (ballX <= 0) {
    computerScore++;
    if (computerScore >= winningScore) {
      console.log("Computer won!");
      showingWinScreen = true;
    }
    ballX = 400;
    ballY = 300;
    ballSpeedX = -ballSpeedX;
  }

  // IF BALL GOES BEYOND COMPUTER'S SIDE
  if (ballX >= canvas.width) {
    playerScore++;
    if (playerScore >= winningScore) {
      console.log("Player won!");
      showingWinScreen = true;

      return;
    }
    ballX = 400;
    ballY = 300;
    ballSpeedX = -ballSpeedX;
  }

  if (ballY >= canvas.height - 10 || ballY <= 0 + 10) {
    ballSpeedY = -ballSpeedY;
    // ballX = 400;
    // ballY = 300;
  }
}

function drawEverything() {
  colorRect(0, 0, canvas.width, canvas.height, "black");

  if (showingStartScreen) {
    canvasContext.fillStyle = "white";
    canvasContext.font = "50px Monospace";
    canvasContext.fillText("PONG", canvas.width/2 - 60, canvas.height/2 - 100);
    canvasContext.font = "10px Verdana";

    canvasContext.fillText("Click to start playing", canvas.width/2 - 58, canvas.height/2 - 50);
    return
  }

  if (showingWinScreen) {
    canvasContext.fillStyle = "white";
    if (playerScore >= winningScore) {
      canvasContext.fillText("Player won!", canvas.width/2 - 60, canvas.height/2 - 50);
    }
    if (computerScore >= winningScore) {
      canvasContext.fillText("Computer won!", canvas.width/2 - 60, canvas.height/2 - 50);
    }

    canvasContext.fillText("Click to continue", canvas.width/2 - 60, canvas.height/2 - 35);
    return;
  }
  // colorRect(0, 0, canvas.width, canvas.height, "black");
  drawNet();
  colorCircle(ballX, ballY, 10, "white");
  colorRect(0, paddle1Y, 10, 70, "white");
  colorRect(790, paddle2Y, 10, 70, "white");

  canvasContext.fillText("Player Score: ", 50, 50);
  canvasContext.fillText(playerScore, 75, 60);
  canvasContext.fillText("Computer Score: ", canvas.width - 120, 50);
  canvasContext.fillText(computerScore, canvas.width - 85, 60);
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(leftX, topY, r, color) {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(leftX, topY, r, 0, Math.PI * 2, true);
  canvasContext.fill();
}