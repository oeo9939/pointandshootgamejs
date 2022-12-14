const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCanvasctx = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let score = 0;
ctx.font = "50px Impact";

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

let ravens = [];

class Raven {
    constructor() {
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.3 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = "/assets/raven.png";
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = "rgb(" + this.randomColors[0] + "," + this.randomColors[1] + "," + this.randomColors[2] + ")";
    }
    update(deltaTime) {
        if (this.y < 0 || this.y > canvas.height - this.height) {
            this.directionY = this.directionY * -1;
        }
        this.x -= this.directionX;
        this.y += this.directionY;
        if (this.x < 0 - this.width) this.markedForDeletion = true;
        this.timeSinceFlap += deltaTime;
        if (this.timeSinceFlap > this.flapInterval) {
            if (this.frame > this.maxFrame) this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;
        }
        // console.log(deltaTime);
    }
    draw() {
        collisionCanvasctx.fillStyle = this.color;
        collisionCanvasctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 48, 850);
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 50, 855);
}
// const raven = new Raven(); Test class Raven

window.addEventListener("click", (e) => {
    // console.log(e.x, e.y);
    const detectPixelColor = collisionCanvasctx.getImageData(e.x, e.y, 1, 1);
    console.log(detectPixelColor);
    const pc = detectPixelColor.data;
    ravens.forEach(object => {
        if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]) {
            object.markedForDeletion = true;
            score++;
        }
    });
});

function animate(timestamp) {
    collisionCanvasctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // raven.update(); Test class Raven 
    // raven.draw(); Test class Raven    
    // console.log("test");
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltaTime;
    if (timeToNextRaven > ravenInterval) {
        ravens.push(new Raven());
        timeToNextRaven = 0;
        ravens.sort((a, b) => {
            return a.width - b.width;
        })
    };

    drawScore();


    [...ravens].forEach(object => object.update(deltaTime));
    [...ravens].forEach(object => object.draw());
    ravens = ravens.filter(object => !object.markedForDeletion);
    // console.log(ravens);
    requestAnimationFrame(animate);
}
animate(0);
