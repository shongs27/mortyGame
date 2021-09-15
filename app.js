const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ctx.fillStyle = "red";
// ctx.fillRect(20, 20, 50, 50);

const runnerImage = new Image();
runnerImage.src = "img/morty.jpg";

class Player {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw() {
    ctx.drawImage(runnerImage, this.x, this.y, this.w, this.h);
  }
}

const player = new Player(0, 20, 50, 50);

runnerImage.onload = () => {
  player.draw();
};
