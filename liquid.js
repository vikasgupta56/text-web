const canvas2 = document.getElementById("canvas2");
const ctxl = canvas2.getContext("2d");
canvas2.width = 1200;
canvas2.height = 600;
let particleArrayl = [];
let adjustXl = -10;
let adjustYl = 3;

// get mousel mousel position //
let mousel = {
	x: null,
	y: null,
  radius: 150
}

let canvas2Position = canvas2.getBoundingClientRect();
window.addEventListener('mouselmove', 
	function(e){
    mousel.x = e.x - canvas2Position.left;
    mousel.y = e.y - canvas2Position.top;
});

ctxl.font = 'bold 16px Verdana';
ctxl.fillText('LIQUID', 5, 30);
const datal = ctxl.getImagedata(0, 0, canvas2.width, 100);

class Particlel {
    constructor(x, y){
        this.x = x + 200,
        this.y = y - 100,
        this.size = 8,
        this.baseX = this.x,
        this.baseY = this.y,
        this.density = ((Math.random() * 30) + 1);
    }
    draw() {
        ctxl.fillStyle = 'white';
        ctxl.beginPath();
        ctxl.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctxl.closePath();
        ctxl.fill();
    }
    update() {
        // check mousel position/particle position - collision detection
        let dx = mousel.x - this.x;
        let dy = mousel.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        // distance past which the force is zero
        var maxDistance = mousel.radius;
        // convert (0...maxDistance) range into a (1...0).
        // Close is near 1, far is near 0
        // for example:
        //   250 => 0.75
        //   100 => 0.9
        //   10  => 0.99
        var force = (maxDistance - distance) / maxDistance;

        // if we went below zero, set it to zero.
        if (force < 0) force = 0;

        let directionX = (forceDirectionX * force * this.density)
        let directionY = (forceDirectionY * force * this.density);

        if (distance < mousel.radius + this.size){
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX ) {
                let dx = this.x - this.baseX;
                this.x -= dx/10;
            } if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy/10;
            }
        }
    }
}
function initl(){
    particleArrayl = [];

    for (var y = 0, y2 = datal.height; y < y2; y++) {
        for (var x = 0, x2 = datal.width; x < x2; x++) {
            if (datal.datal[(y * 4 * datal.width) + (x * 4) + 3] > 128) {
                let positionX = x + adjustXl;
                let positionY = y + adjustYl;
                //let positionX = x;
                //let positionY = y;
                particleArrayl.push(new Particle(positionX * 15, positionY * 15));
            }
        }
    }
    
}
function animatel(){
    //ctxl.fillStyle = 'rgba(0,0,0,0.5)';
    //ctxl.fillRect(0,0,innerWidth,innerHeight);
    ctxl.clearRect(0,0,innerWidth,innerHeight);
    
    for (let i = 0; i < particleArrayl.length; i++){
        particleArrayl[i].update();
        particleArrayl[i].draw();
    }
    connectl();
    requestAnimationFrame(animate);
}
initl();
animatel();
/*
// RESIZE SETTING - empty and refill particle array every time window changes size + change canvas2 size
window.addEventListener('resize',
function() {
    canvas2.width = innerWidth;
    canvas2.height = innerHeight;
    init();
});*/


function connectl(){
    let opacityValue = 1;
    for (let a = 0; a < particleArrayl.length; a++) {
        for (let b = a; b < particleArrayl.length; b++) {
            let distance = (( particleArrayl[a].x - particleArrayl[b].x) * (particleArrayl[a].x - particleArrayl[b].x))
            + ((particleArrayl[a].y - particleArrayl[b].y) * (particleArrayl[a].y - particleArrayl[b].y));
            
            if (distance < 3600) {
                
                opacityValue = 1 - (distance/3600);
                let dx = mousel.x - particleArrayl[a].x;
                let dy = mousel.y - particleArrayl[a].y;
                let mouselDistance = Math.sqrt(dx*dx+dy*dy);
                if (mouselDistance < mousel.radius / 2) {
                    particleArrayl[a].size = 25;
                  ctxl.strokeStyle='rgba(255,255,150,' + opacityValue + ')';
                } else if (mouselDistance < mousel.radius - 50) {
                    particleArrayl[a].size = 20;
                  ctxl.strokeStyle='rgba(255,255,180,' + opacityValue + ')';
                } else if (mouselDistance < mousel.radius + 20) {
                    particleArrayl[a].size = 15;
                  ctxl.strokeStyle='rgba(255,255,210,' + opacityValue + ')';
                } else  {
                    particleArrayl[a].size = 8;
                ctxl.strokeStyle='rgba(255,255,255,' + opacityValue + ')';
                }
                ctxl.lineWidth = 20;
                ctxl.beginPath();
                ctxl.moveTo(particleArrayl[a].x, particleArrayl[a].y);
                ctxl.lineTo(particleArrayl[b].x, particleArrayl[b].y);
                ctxl.stroke();
            }
        }
    
    }
}

window.addEventListener('resize', function(){
  canvas2Position = canvas2.getBoundingClientRect();
});