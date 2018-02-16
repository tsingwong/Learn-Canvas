/*
 * @Author: tsingwong 
 * @Date: 2018-02-12 22:56:17 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-02-16 18:00:07
 */
let canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    paused = true,
    discs = [
        {
            x: 150,
            y: 250,
            lastX: 150,
            lastY: 250,
            velocityX: -3.2,
            velocityY: 3.5,
            radius: 25,
            innerColor: 'rgba(255,255,0,1)',
            middleColor: 'rgba(255,255,0,0.7)',
            outerColor: 'rgba(255,255,0,0.5)',
            strokeStyle: 'gray',
        },

        {
            x: 50,
            y: 150,
            lastX: 50,
            lastY: 150,
            velocityX: 2.2,
            velocityY: 2.5,
            radius: 25,
            innerColor: 'rgba(100,145,230,1.0)',
            middleColor: 'rgba(100,145,230,0.7)',
            outerColor: 'rgba(100,145,230,0.5)',
            strokeStyle: 'blue'
        },

        {
            x: 150,
            y: 75,
            lastX: 150,
            lastY: 75,
            velocityX: 1.2,
            velocityY: 1.5,
            radius: 25,
            innerColor: 'rgba(255,0,0,1.0)',
            middleColor: 'rgba(255,0,0,0.7)',
            outerColor: 'rgba(255,0,0,0.5)',
            strokeStyle: 'orange'
        },
    ],
    numDiscs = discs.length,
    animateButton = document.querySelector('#animateButton'),
    timeBasedMotionCheckbox = document.querySelector('#timeBasedMotionCheckbox'),
    timeBasedMotion = false,
    lastTime = 0,
    lastFpsUpdateTime = 0,
    lastFpsUpdate = 0;

// Function

function drawBackground() {
    // Ruled paper
    let STEP_Y = 12,
        TOP_MARGIN = STEP_Y * 4,
        LEFT_MARGIN = STEP_Y * 3,
        i = context.canvas.height;

    // Horizontal lines

    context.strokeStyle = 'lightgray';
    context.lineWidth = 0.5;

    while (i > TOP_MARGIN) {
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(context.canvas.width, i);
        context.stroke();
        i -= STEP_Y;
    }

    // Vertical line

    context.strokeStyle = 'rgba(100,0,0,0.3)';
    context.lineWidth = 1;

    context.beginPath();

    context.moveTo(LEFT_MARGIN, 0);
    context.lineTo(LEFT_MARGIN, context.canvas.height);
    context.stroke();
}
/**
 * 默认会有两个向量，分别表示 X Y 轴上的运动
 * 当碰壁时，会改变其向量方向
 * 
 */
function update() {
    let disc = null;
    
    for (let i = 0; i < numDiscs; i++) {
        disc = discs[i];
        
        if (disc.x + disc.velocityX + disc.radius > context.canvas.width
            || disc.x + disc.velocityX - disc.radius < 0
        ) {
            disc.velocityX = - disc.velocityX;
        }

        if (disc.y + disc.velocityY + disc.radius > context.canvas.height 
            || disc.y + disc.velocityY - disc.radius < 0
        ) {
            disc.velocityY = - disc.velocityY;
        }
        
        disc.x += disc.velocityX;
        disc.y += disc.velocityY;
    }
}
/**
 * 绘制球体
 * 
 */
function draw() {
    let disc = null;
    for (let i = 0; i < numDiscs; i++) {
        disc = discs[i];
        let gradient = context.createRadialGradient(disc.x, disc.y, 0, disc.x, disc.y, disc.radius);
        gradient.addColorStop(.3, disc.innerColor);
        gradient.addColorStop(.5, disc.middleColor);
        gradient.addColorStop(1, disc.outerColor);

        context.save();

        context.beginPath();
        context.arc(disc.x, disc.y, disc.radius, 0,  Math.PI / 180 * 360, false);
        context.fillStyle = gradient;
        context.strokeStyle = disc.strokeStyle;

        context.fill();
        context.stroke();
        context.restore();
    }
}
/**
 * 独立于帧速率之外的恒定速度播放
 * 
 * @param {any} now 
 */
function updateTimeBased(now) {
    let disc = null,
        elapsedTime = now - lastTime,
        deltaX,
        deltaY;
        
    for (let i = 0; i < discs.length; i++) {
        disc = discs[i];
        deltaX = disc.velocityX * (elapsedTime / 1000);
        deltaY = disc.velocityY * (elapsedTime / 1000);

        if (disc.x + deltaX + disc.radius > context.canvas.width
            || disc.x + deltaX - disc.radius < 0
        ) {
            disc.velocityX = -disc.velocityX;
            deltaX =  - deltaX;
        }

        if (disc.y + deltaY + disc.radius > context.canvas.height 
            || disc.y + deltaY - disc.radius < 0) {
            disc.velocityY= -disc.velocityY;
            deltaY = -deltaY;
        }
   
        disc.x = disc.x + deltaX;
        disc.y = disc.y + deltaY;
    }
}
/**
 * 计算 FPS 值
 * 
 * @returns 
 */
function calculateFps() {
    let now = (+ new Date()),
        fps = 1000 / (now - lastTime);
    
    lastTime = now;
    return fps;
}

// Animation

function animate(time) {
    let fps = 0,
        now = +new Date();
        
    if (time === undefined) {
        time = + new Date();
    }
    
    if (!paused) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();
        if (timeBasedMotion) {
            updateTimeBased(now);
        }
        else {
            update();
        }
        draw();

        fps = calculateFps();

        

        if (now -lastFpsUpdateTime > 1000) {
            lastFpsUpdateTime = now;
            lastFpsUpdate = fps;
        }
        context.fillStyle = 'cornflowerblue';
        context.fillText(lastFpsUpdate.toFixed() + 'fps', 20, 60);

        window.requestAnimationFrame(animate);
    }
}
timeBasedMotionCheckbox.addEventListener('click', function () {
    if (timeBasedMotionCheckbox.checked) {
        timeBasedMotion = true;
        for (let i=0; i < discs.length; ++i) {
            discs[i].velocityX *= 50;
            discs[i].velocityY *= 50;
        }
    }
    else {
        timeBasedMotion = false;
        for (let i=0; i < discs.length; ++i) {
            discs[i].velocityX /= 50;
            discs[i].velocityY /= 50;
        }
    }
});

// Event handlers

animateButton.onclick = function () {
    paused = paused ? false : true;
    if (paused) {
        animateButton.value = 'Animate';
    } else {
        window.requestAnimationFrame(animate);
        animateButton.value = 'Pause';
    }
};

// Initialization

context.font = '48px Helvetica';
