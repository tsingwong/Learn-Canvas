/*
 * @Author: tsingwong 
 * @Date: 2018-01-26 16:50:39 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-26 17:19:13
 */
const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d');
/**
 * 绘制文字
 * 
 */
function drawText() {
    context.save();

    context.shadowColor = 'rgba(100, 100, 150, .8)';
    context.shadowOffsetX = 5;
    context.shadowOffsetY = 5;
    context.shadowBlur = 10;
    context.fillStyle = 'cornflowerblue';

    context.fillText('HTML5', 20, 250);
    
    context.strokeStyle = 'yellow';
    context.strokeText('HTML5', 20, 250);

    context.restore();
}
/**
 * 设置剪切区域
 * 
 * @param {Number} radius 半径
 */
function setClippingRegin(radius) {
    context.beginPath();

    context.arc(
        canvas.width / 2,
        canvas.height / 2,
        radius,
        0,
        Math.PI / 180 * 360,
        false
    );
    context.clip();
}
/**
 * 填充 canvas
 * 
 * @param {String} color 表示颜色的字符串
 */
function fillCanvas(color) {
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
}
/**
 * 停止动画，在一秒后重新清空并绘制文字
 * 
 * @param {Object} loop 定时器
 */
function endAnimation(loop) {
    clearInterval(loop);
    setTimeout(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawText();
    }, 1000);
}
/**
 * 剪切出圆形区域，并填充颜色 和 绘制文字
 * 
 * @param {Number} radius 半径
 */
function drawAnimationFrame(radius) {
    setClippingRegin(radius);
    fillCanvas('lightgray');
    drawText();
}
/**
 * 动画
 * 
 */
function animate() {
    let radius = canvas.width / 2,
        loop = window.setInterval(() => {
            radius -= canvas.width / 100;
            fillCanvas('charcoal');

            if (radius > 0) {
                context.save();
                drawAnimationFrame(radius);
                context.restore();
            } else {
                endAnimation(loop);
            }
        }, 16);
}


// Event handlers
canvas.onmousedown = function () {
    animate();
};

// Initialization

context.lineWidth = .5;
context.font = '128pt Comic-sans';
drawText();
