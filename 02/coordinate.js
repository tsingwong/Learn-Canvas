/*
 * @Author: tsingwong 
 * @Date: 2018-01-20 18:44:33 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-21 10:38:43
 */
const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    AXIS_MARGIN = 40,
    // 原点位置， 四边各留 AXIS_MARGIN 的边距
    AXIS_ORIGIN = {x: AXIS_MARGIN, y: canvas.height - AXIS_MARGIN},

    AXIS_TOP = AXIS_MARGIN,
    AXIS_RIGHT = canvas.width - AXIS_MARGIN,
    
    HORIZONTAL_TICK_SPACING = 10,
    VERTICAL_TICK_SPACE = 10,

    AXIS_WIDTH = AXIS_RIGHT - AXIS_ORIGIN.x,
    AXIS_HEIGHT = AXIS_ORIGIN.y - AXIS_TOP,

    NUM_VERTICAL_TICKS = AXIS_HEIGHT / VERTICAL_TICK_SPACE,
    NUM_HORIZONTAL_TICKES = AXIS_WIDTH / HORIZONTAL_TICK_SPACING,

    TICKE_WIDTH = 10,
    TICKS_LINEWIDTH = .5,
    TICKS_COLOR = 'navy',

    AXIS_LINEWIDTH = 1.0,
    AXIS_COLOR = 'blue';

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
 * 绘制轴线
 * 
 */
function drawAxes () {
    context.save();
    context.strokeStyle = AXIS_COLOR;
    context.lineWidth = AXIS_LINEWIDTH;

    drawHorizontalAxis();
    drawVerticalAxis();

    context.lineWidth = TICKS_LINEWIDTH;
    context.strokeStyle = TICKS_COLOR;

    drawVerticalAxisTicks();
    drawHorizontalAxisTicks();

    context.restore();
}
/**
 * 绘制 X 轴
 * 
 */
function drawHorizontalAxis() {
    context.beginPath();
    context.moveTo(AXIS_ORIGIN.x, AXIS_ORIGIN.y);
    context.lineTo(AXIS_RIGHT, AXIS_ORIGIN.y);
    context.stroke();
}
/**
 * 绘制 Y 轴
 * 
 */
function drawVerticalAxis() {
    context.beginPath();
    context.moveTo(AXIS_ORIGIN.x, AXIS_ORIGIN.y);
    context.lineTo(AXIS_ORIGIN.x, AXIS_TOP);
    context.stroke();
}
/**
 * 绘制 X 轴的间距线
 * 
 */
function drawVerticalAxisTicks() {
    let deltaX;

    // 每 5个 间距线，线段长度改变一次
    for (let i = 1; i < NUM_VERTICAL_TICKS; i++) {
        context.beginPath();
        if (i % 5 === 0) {
            deltaX = TICKE_WIDTH;
        } else {
            deltaX = TICKE_WIDTH / 2;
        }

        context.moveTo(AXIS_ORIGIN.x - deltaX, AXIS_ORIGIN.y - i * VERTICAL_TICK_SPACE);
        context.lineTo(AXIS_ORIGIN.x + deltaX, AXIS_ORIGIN.y - i * VERTICAL_TICK_SPACE);
        context.stroke();
    }
}
/**
 * 绘制 Y 轴的间距线
 * 
 */
function drawHorizontalAxisTicks() {
    let deltaY;

    // 每 5个 间距线，线段长度改变一次
    for(let i = 1; i < NUM_HORIZONTAL_TICKES; i++) {
        context.beginPath();
        if (i % 5 === 0) {
            deltaY = TICKE_WIDTH;
        } else {
            deltaY = TICKE_WIDTH / 2;
        }

        context.moveTo(AXIS_ORIGIN.x + i * HORIZONTAL_TICK_SPACING, AXIS_ORIGIN.y - deltaY);
        context.lineTo(AXIS_ORIGIN.x + i * HORIZONTAL_TICK_SPACING, AXIS_ORIGIN.y + deltaY );
        context.stroke();
    }
}

// Initialization

drawGrid(context, 'lightgray', 10, 10);
drawAxes();
