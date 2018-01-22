/*
 * @Author: tsingwong 
 * @Date: 2018-01-22 14:24:22 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-22 17:37:57
 */
let canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d');

const CENTROID_RADIUS = 10,
    CENTROID_STROKE_STYLE = 'rgba(0, 0, 0, .5)',
    CENTROID_FILL_STYLE = 'rgba(80, 190, 240, .6)',

    RING_INNER_RADIUS = 35,
    RING_OUTER_RADIUS = 55,

    ANNOTATIONS_FILL_STYLE = 'rgba(0, 0, 230, .9)',
    ANNOTATIONS_TEXT_SIZE = 12,
    
    TICK_WIDTH = 10,
    TICK_LONG_STROKE_STYLE = 'rgba(100, 140, 230, .9)',
    TICK_SHORT_STORK_STYLE = 'rgba(100, 140, 230, .7)',

    TRACKING_DIAL_STORK_STYLE = 'rgba(100, 140, 230, .5)',

    GUIDWIRE_STROKE_STYLE = 'goldenrod',
    GUIDWIRE_FILL_STYLE = 'rgba(250, 250, 0, .6)',

    circle = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 150
    };

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
 * 绘制表盘
 * 
 */
function drawDial() {
    let loc = {
        x: circle.x,
        y: circle.y
    };

    drawCentroid();
    drawCentroidGuidewire(loc);
    drawRing();
    drawTickInnerCircle();
    drawTicks();
    drawAnnotations();
}
/**
 * 绘制中心点
 * 
 */
function drawCentroid() {
    context.beginPath();
    context.save();
    context.strokeStyle = CENTROID_STROKE_STYLE;
    context.fillStyle = CENTROID_FILL_STYLE;
    context.arc(circle.x, circle.y, CENTROID_RADIUS, 0, Math.PI * 2, false);
    context.stroke();
    context.fill();
    context.restore();
}
/**
 * 绘制指针
 * 
 * @param {Object} loc 坐标
 */
function drawCentroidGuidewire (loc) {
    // 预设 一个角度为 90 - 45 = 45 °
    let angle = - Math.PI / 4,
        radius, endpt;
    
    radius = circle.radius + RING_OUTER_RADIUS;
    
    if (loc.x >= circle.x) {
        endpt = {
            x: circle.x + radius * Math.cos(angle),
            y: circle.y + radius * Math.sin(angle)
        };
    } else {
        endpt = {
            x: circle.x - radius * Math.cos(angle),
            y: circle.y - radius * Math.sin(angle)
        };
    }

    context.save();
    
    context.strokeStyle = GUIDWIRE_STROKE_STYLE;
    context.fillStyle = GUIDWIRE_FILL_STYLE;

    context.beginPath();
    context.moveTo(circle.x, circle.y);
    context.lineTo(endpt.x, endpt.y);
    context.stroke();

    context.beginPath();
    context.strokeStyle = TICK_LONG_STROKE_STYLE;
    context.arc(endpt.x, endpt.y, 5, 0, Math.PI * 2, false);
    context.fill();
    context.stroke();

    context.restore();
}
/**
 * 绘制圆环
 * 
 */
function drawRing() {
    drawRingOuterCircle();

    context.strokeStyle = 'rgba(0, 0, 0, .1)';
    context.arc(circle.x, circle.y, circle.radius + RING_INNER_RADIUS, 0, Math.PI * 2, false);
    context.fillStyle = 'rgba(100, 140, 230, .1)';
    context.fill();
    context.stroke();
}
/**
 * 绘制圈圆
 * 
 */
function drawRingOuterCircle() {
    context.shadowColor = 'rgba(0, 0, 0, .7)';
    context.shadowOffsetX = 3;
    context.shadowOffsetY = 3;
    context.shadowBlur = 6;
    context.strokeStyle = TRACKING_DIAL_STORK_STYLE;
    context.beginPath();
    context.arc(circle.x, circle.y, circle.radius + RING_OUTER_RADIUS, 0, Math.PI * 2, true);
    context.stroke();
}
/**
 * 绘制内圈圆
 * 
 */
function drawTickInnerCircle() {
    context.save();
    context.beginPath();
    context.strokeStyle = 'rgba(0, 0, 0, .1)';
    context.arc(circle.x, circle.y, circle.radius + RING_INNER_RADIUS - TICK_WIDTH, 0, Math.PI * 2, false);
    context.stroke();
    context.restore();
}
/**
 * 绘制一条刻度
 * 
 * @param {Number} angle 角度
 * @param {Number} radius 半径
 * @param {Number} cnt 计数器
 */
function drawTick(angle, radius, cnt) {
    let tickWidth = cnt % 4 === 0 ? TICK_WIDTH : TICK_WIDTH / 2;

    context.beginPath();
    context.moveTo(
        circle.x + Math.cos(angle) * (radius - tickWidth),
        circle.y + Math.sin(angle) * (radius - tickWidth)
    );
    context.lineTo(
        circle.x + Math.cos(angle) * radius,
        circle.y + Math.sin(angle) * radius
    );
    context.strokeStyle = TICK_SHORT_STORK_STYLE;
    context.stroke();
}
/**
 * 绘制刻度，一共有 64 个刻度
 * 
 */
function drawTicks() {
    let radius = circle.radius + RING_INNER_RADIUS,
        ANGLE_MAX = 2 * Math.PI,
        ANGLE_DELTA = Math.PI / 64;

    context.save();
    for(let angle = 0, cnt = 0; angle < ANGLE_MAX; angle += ANGLE_DELTA, cnt++) {
        drawTick(angle, radius, cnt);
    }

    context.restore();
}
/**
 * 绘制标度
 * 
 */
function drawAnnotations () {
    let radius = circle.radius + RING_INNER_RADIUS;

    context.save();
    context.fillStyle = ANNOTATIONS_FILL_STYLE;
    context.font = ANNOTATIONS_TEXT_SIZE + 'px Helvetica';

    for(let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 8) {
        context.beginPath();
        context.fillText(
            (angle * 180 / Math.PI).toFixed(0),
            circle.x + Math.cos(angle) * (radius - TICK_WIDTH * 2),
            circle.y - Math.sin(angle) * (radius - TICK_WIDTH * 2)
        );
    }
    context.restore();
}

// INitialization

context.shadowColor = 'rgba(0, 0, 0, .4)';
context.shadowOffsetX = 2;
context.shadowBlur = 2;
context.shadowBlur = 4;

context.textAlign = 'center';
context.textBaseline = 'middle';

drawGrid(context, 'lightgray', 10, 10);
drawDial();
