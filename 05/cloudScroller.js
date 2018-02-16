/*
 * @Author: tsingwong 
 * @Date: 2018-02-16 18:06:36 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-02-16 18:32:43
 */
let canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    animateButton = document.querySelector('#animateButton'),
    sky = new Image(),

    paused = true,
    lastTime = 0,
    fps = 0,

    skyOffset = 0,
    SKY_VELOCITY = 30;

// Functions
function draw() {
    context.save();

    skyOffset = skyOffset < canvas.width ? skyOffset + SKY_VELOCITY / fps : 0;
    
    context.save();
    context.translate(-skyOffset, 0);

    context.drawImage(sky, 0, 0);
    context.drawImage(sky, sky.width - 2, 0);
    
    context.restore();
}

function calculateFps(now) {
    let fps = 1000 / (now - lastTime);
    lastTime = now;
    return fps;
}

function animate(now) {
    if (now === undefined) {
        now = + new Date();
    }

    fps = calculateFps(now);

    if (!paused) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        draw();
    }
    window.requestAnimationFrame(animate);
}
    
// Event handlers

animateButton.onclick = function () {
    paused = paused ? false : true;
    if (paused) {
        animateButton.value = 'Animate';
    } else {
        animateButton.value = 'Pause';
        window.requestAnimationFrame(animate);
    }
};

// Initialization

sky.src = 'sky.png';
sky.onload = function () {
    draw();
};

