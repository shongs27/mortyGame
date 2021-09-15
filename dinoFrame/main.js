const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

//공룡 그리기
const dino = {
  x: 10,
  y: 200,
  width: 50,
  height: 50,
  draw() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },
};

//장애물 그리기
//각각의 특성을 가진 비슷한 객체가 많이 필요할수도 있으니
// 클래스로 만들자
class Cactus {
  constructor() {
    this.x = 500;
    this.y = 200;
    this.width = 50;
    this.height = 50;
  }

  draw() {
    // hitbox
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // ctx.drawImage(img1, this.x, this.y);
  }
}

// 애니메이션 만들떄 기본적인 함수 window.requestAnimationFrame()
//하지만 라이브러리 쓰는게 좋다

let timer = 0;
const cactus여러개 = [];
let 점프timer = 0;
var animation;

//코드를 1초에 60번 실행하면 애니메이션을 만들수 있다?
function 프레임마다실행() {
  animation = requestAnimationFrame(프레임마다실행);
  timer++;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //120프레임마다 장애물 생성
  if (timer % 200 === 0) {
    //배열로 관리
    const cactus = new Cactus();
    cactus여러개.push(cactus);
  }
  //그걸 한번에 그려줌
  cactus여러개.forEach((v, i, arr) => {
    if (v.x < 0) arr.splice(i, 1);
    v.x--;

    충돌하냐(dino, v);

    v.draw();
  });

  if (스위치 === true) {
    dino.y -= 2;
    점프timer++;
  }

  if (스위치 === false) {
    dino.y < 200 && (dino.y += 2);
  }

  if (점프timer > 80) {
    스위치 = false;
    점프timer = 0;
  }
  dino.draw();
}
프레임마다실행();

//충돌확인
function 충돌하냐(dino, cactus) {
  var x축차이 = cactus.x - (dino.x + dino.width);
  var y축차이 = cactus.y - (dino.y + dino.height);
  if (x축차이 < 0 && y축차이 < 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cancelAnimationFrame(animation);
  }
}

var 스위치 = false;
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") 스위치 = true;
});
