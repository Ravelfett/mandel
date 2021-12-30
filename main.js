const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
var width = window.innerWidth;
var height = window.innerHeight;


function resize() {
  width = window.innerWidth,
  height = window.innerHeight,
  ratio = window.devicePixelRatio;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  context.scale(ratio, ratio);
}
window.onresize = function() {
  resize();
};
window.onload = function() {
  resize();
  window.requestAnimationFrame(animate);
}

document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('mousemove', (p) => {
  const t = canvas.getBoundingClientRect();
  mouse[0] = (p.pageX - t.left);
  mouse[1] = (p.pageY - t.top);
}, false);

document.onmousedown = function (e) {
  if (e.button == 0) {
    pressed = true;
    d = [mouse[0], mouse[1]];
  }
  if (e.button == 2) {
    d = [mouse[0], mouse[1]];
    dragging = true;
  }
  time = Date.now();
  p = preview;
};

document.onmouseup = function (e) {
  if (e.button == 0) {
    pressed = false;
  }
  if (e.button == 2) {
    dragging = false;
  }
  time = Date.now();
};

document.addEventListener("wheel", (e) => {
  if (e.deltaY < 0) {
    zoom *= 1.1;
    s *= 1.01;
  }else {
    zoom /= 1.1;
    s /= 1.01;
  }
  p = preview;
  time = Date.now();
  start = true;
});

document.addEventListener("keydown", (e) => {
}, false);

class Complex{
  constructor(a, b){
    this.a = a;
    this.b = b;
  }
}

function f(z, c){
  return new Complex(((z.a**2)-(z.b**2)+c.a), 2*z.a*z.b+c.b);
}

let mouse = [0, 0];
let pos = [-0.78, 0.1575];
let d = [0, 0]
let pressed = false;
let dragging = false;
let p = 1;
let s = 100;
let cam = [0, 0];
let zoom = 200;
let start = true;
let time = 0;
let preview = 12;
let render = 1;

function animate() {
  if (Date.now()-time>1000 && p==preview && !pressed && !dragging) {
    p = render;
    start = true;
  }
  if (pressed) {
    pos = [pos[0]-(d[0]-mouse[0])/zoom, pos[1]-(d[1]-mouse[1])/zoom]
    d = [mouse[0], mouse[1]];
  }
  if (dragging) {
    cam = [cam[0]-(d[0]-mouse[0])/zoom, cam[1]-(d[1]-mouse[1])/zoom]
    d = [mouse[0], mouse[1]];
  }
  if (p==preview||start) {
    start = false;
    context.clearRect(0, 0, width, height);
    context.beginPath();
    context.fillStyle = "rgb(38, 6, 77)";
    context.rect(0, 0, width, height);
    context.fill();
    context.closePath();

    for(let i = 0; i < width; i+=p){
      for(let j = 0; j < height; j+=p){
        let point = new Complex(((i-width/2)/zoom)-cam[0], ((j-height/2)/zoom)-cam[1])
        let ct = 0;
        while(point.a**2+point.b**2<4 && ct<s){
          //point = f(point, new Complex((i-width/2)/zoom, (j-height/2)/zoom))
          point = f(point, new Complex(pos[0], pos[1]))
          ct++;
        }
        context.beginPath();
        context.fillStyle = "hsl(267, 100%, "+(100*ct/s)+"%)";
        context.rect(i, j, p, p);
        context.fill();
        context.closePath();
      }
    }
  }

  window.requestAnimationFrame(animate);
}
window.requestAnimationFrame(animate);
