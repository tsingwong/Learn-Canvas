/*
 * @Author: tsingwong 
 * @Date: 2018-01-23 09:35:44 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-23 10:47:00
 */
const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d');

const ARROW_MARGIN = 30,
    POINT_RADIUS = 7,
    points = [
        {
            x: canvas.width - ARROW_MARGIN,
            y: canvas.height - ARROW_MARGIN
        },
        {
            x: canvas.width - ARROW_MARGIN * 2,
            y: canvas.height - ARROW_MARGIN
        },
        {
            x: POINT_RADIUS,
            y: canvas.height / 2
        },
        {
            x: ARROW_MARGIN,
            y: canvas.height / 2 - ARROW_MARGIN
        },
        {
            x: canvas.width - ARROW_MARGIN,
            y: ARROW_MARGIN
        }, 
        {
            x: canvas.width - ARROW_MARGIN,
            y: ARROW_MARGIN * 2
        }
    ];

// Functions
/**
 * 绘制单个点
 * 
 * @param {Number} x 横坐标
 * @param {Number} y 纵坐标
 * @param {String} strokeStyle 描边样式
 * @param {String} fillStyle 填充样式
 */
function drawPoint(x, y, strokeStyle, fillStyle) {
    context.beginPath();
    context.fillStyle = fillStyle;
    context.strokeStyle = strokeStyle;
    context.lineWidth = .5;
    context.arc(x, y, POINT_RADIUS, Math.PI / 180 * 0, Math.PI / 180 * 360, false);
    context.fill();
    context.stroke();    
}
/**
 * 绘制所有点
 * 
 */
function drawBezierPoints () {
    let i, strokeStyle, fillStyle;

    // 白底蓝边为控制点，蓝底白边为终点
    for (i = 0; i < points.length; i++) {
        fillStyle = i % 2 === 0 ? 'white' : 'blue';
        strokeStyle = i % 2 === 0 ? 'blue' : 'white';
        drawPoint(points[i].x, points[i].y, strokeStyle, fillStyle);
    }
}
/**
 * 绘制箭头
 * 
 */
function drawArrow () {
    context.strokeStyle = 'red';
    context.fillStyle = 'cornflowerblue';
    
    // 移动到右上角
    context.moveTo(canvas.width - ARROW_MARGIN, ARROW_MARGIN * 2);
    // x 轴不变，向下画线
    context.lineTo(canvas.width - ARROW_MARGIN, canvas.height - ARROW_MARGIN * 2);
    // 绘制圆角
    context.quadraticCurveTo(points[0].x, points[0].y, points[1].x,points[1].y);
    context.lineTo(ARROW_MARGIN, canvas.height / 2 + ARROW_MARGIN);
    context.quadraticCurveTo(points[2].x, points[2].y, points[3].x, points[3].y);
    context.lineTo(canvas.width - ARROW_MARGIN * 2, ARROW_MARGIN);
    context.quadraticCurveTo(points[4].x, points[4].y, points[5].x, points[5].y);
    context.fill();
    context.stroke();
}

// Initialization

context.clearRect(0 ,0, canvas.width, canvas.height);
drawArrow();
drawBezierPoints();
