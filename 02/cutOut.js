/*
 * @Author: tsingwong 
 * @Date: 2018-01-20 14:05:00 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-20 18:21:41
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
/**
 * 开始画图
 * 
 */
function draw () {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    drawGrid(context, 'lightgray', 10, 10);


    context.save();

    context.shadowColor = 'rgba(200, 200, 0, .5)';
    context.shadowOffsetX = 12;
    context.shadowOffsetY = 12;
    context.shadowBlur = 15;

    drawCutouts();
    strokeCutourShapes();
    context.restore();
}
/**
 * 
 * 
 */
function drawCutouts() {
    context.beginPath();
    addOuterRectanglePath();

    addCirclePath();
    addRectanglePath();
    addTrianglePath();

    context.fill();
}
/**
 * 填充颜色
 * 注：填充路径时是用的是“非零环绕规则”
 * 
 */
function strokeCutourShapes() {
    context.save();

    context.strokeStyle = 'rgba(0, 0, 0, .7)';
    context.beginPath();

    addOuterRectanglePath();
    context.stroke();

    context.beginPath();
    
    addCirclePath();
    addRectanglePath();
    addTrianglePath();
    context.stroke();

    context.restore();
}
/**
 * 绘制矩形路径
 * 注：最后一个参数默认为 false 为顺时针，反之 true 为逆时针
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} w 
 * @param {Number} h 
 * @param {Boolean} [direction=false] 
 */
function rect(x, y , w, h, direction = false) {
    if (direction) { // 逆时针
        context.moveTo(x, y);
        context.lineTo(x, y + h);
        context.lineTo(x + w, y + h);
        context.lineTo(x + w, y);
        context.closePath();
    } else { // 顺时针
        context.moveTo(x, y);
        context.lineTo(x + w, y);
        context.lineTo(x + w, y + h);
        context.lineTo(x, y + h);
        context.closePath();
    }
}
/**
 * 绘制外矩形路径
 * 注：context.rect() 绘制时只有顺时针
 * 
 */
function addOuterRectanglePath() {
    context.rect(110, 25, 370, 335);
}
/**
 * 绘制圆形路径
 * 注：最后一个参数默认为 false 为顺时针，反之 true 为逆时针
 */
function addCirclePath () {
    context.arc(300, 300, 40, 0, Math.PI * 2, true);
}
/**
 * 绘制内矩形路径
 * 注：最后一个参数默认为 false 为顺时针，反之 true 为逆时针
 * 
 */
function addRectanglePath() {
    rect(310, 55, 70, 35, true);
}
/**
 * 绘制三角形路径
 * 注：这里使用的是顺时针
 * 
 */
function addTrianglePath() {
    context.moveTo(400, 200);
    context.lineTo(250, 115);
    context.lineTo(200, 200);
    context.closePath();
}

// Initialization

context.fillStyle = 'goldenrod';
draw();
