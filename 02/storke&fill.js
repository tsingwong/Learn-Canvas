/*
 * @Author: tsingwong 
 * @Date: 2018-01-19 10:02:41 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-19 15:09:37
 */
const context = document.querySelector('#canvas').getContext('2d');

// Functions
/**
 * 绘制网格
 * 
 * @param {Object} context context 对象
 * @param {String} color 颜色字符串
 * @param {Number} stepx x轴的单位长度
 * @param {Number} stepy y轴的单位长度
 */
function drawGrid(context, color, stepx, stepy) {
    context.strokeStyle = color;
    context.lineWidth = .5;
    
    for(let i = stepx + .5; i < context.canvas.width; i += stepx) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, context.canvas.height);
        context.stroke();
    }

    for(let i = stepy + .5; i < context.canvas.height; i += stepy) {
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(context.canvas.width, i);
        context.stroke();
    }
}

// Initialization

drawGrid(context, 'lightgray', 10, 10);

// Drawing attribute

context.font = '48pt Helvetica';
context.strokeStyle = 'blue';
context.fillStyle = 'red';
context.lineWidth = '2';

// Text

context.strokeText('Stroke', 60, 110);
context.fillText('Fill', 400, 110);

context.strokeText('Stroke & Fill', 650, 110);
context.fillText('Stroke & Fill', 650, 110);

// Rectangles

context.lineWidth = '5';
context.beginPath();
context.rect(80, 150, 150, 100);
context.stroke();

context.beginPath();
context.rect(400, 150, 150, 100);
context.fill();

context.beginPath();
context.rect(750, 150, 150, 100);
context.stroke();
context.fill();

// Open arcs

context.beginPath();
context.arc(150, 370, 60, 0, Math.PI * 3 / 2, false);
context.stroke();

context.beginPath();
context.arc(475, 370, 60, 0, Math.PI * 3 / 2, false);
context.fill();

context.beginPath();
context.arc(820, 370, 60, 0, Math.PI * 3 / 2, false);
context.stroke();
context.fill();

// Closed arcs

context.beginPath();
context.arc(150, 550, 60, 0, Math.PI * 3 / 2, false);
context.closePath();
context.stroke();

context.beginPath();
context.arc(475, 550, 60, 0, Math.PI * 3 / 2, false);
context.closePath();
context.fill();

context.beginPath();
context.arc(820, 550, 60, 0, Math.PI * 3 / 2, false);
context.closePath();
context.stroke();
context.fill();
