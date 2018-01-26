/*
 * @Author: tsingwong 
 * @Date: 2018-01-26 15:48:24 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-26 16:13:12
 */
const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    selectElement = document.querySelector('#compositing');

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
 * window 的坐标值转换为 canvas 上的坐标值
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @returns {Object} {x, y} 
 */
function windowToCanvas(x, y) {
    let bbox = canvas.getBoundingClientRect();
    return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
    };
}

canvas.onmousemove = function (e) {
    let loc = windowToCanvas(e.clientX, e.clientY);

    context.clearRect(0, 0, canvas.width, canvas.height);

    drawText();

    context.save();
    context.globalCompositeOperation = selectElement.value;
    context.beginPath();
    context.arc(loc.x, loc.y, 100, 0,  Math.PI / 180 * 360, false);
    context.fillStyle = 'orange';
    context.stroke();
    context.fill();

    context.restore();
};

// Initialization

selectElement.selectedIndex = 3;
context.lineWidth = .5;
context.font = '128pt Comic-sans';
