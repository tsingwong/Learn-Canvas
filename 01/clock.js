/*
 * @Author: tsingwong 
 * @Date: 2018-01-17 09:38:55 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-17 16:37:11
 */
let canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    FONT_HEIGHT = 15,
    MARGIN = 35,
    HAND_TRUNCATION = canvas.width / 25,
    HOUR_HAND_TRUNCATION = canvas.width / 10,
    NUMERAL_SPACING = 20,
    RADIUS = canvas.width / 2 - MARGIN,
    HAND_RADIUS = RADIUS + NUMERAL_SPACING;

// Functions
/**
 * 绘制圆盘
 * 
 */
function drawCircle() {
    context.beginPath();
    // context.arc(x, y, radius, startAngle, endAngle, anticlockwise)
    context.arc(canvas.width / 2, canvas.height / 2, RADIUS, 0, Math.PI * 2, true);
    context.stroke();
}
/**
 * 绘制文字
 * 
 */
function drawNumerals() {
    let numerals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        angle = 0,
        numeralWidth = 0;

    numerals.forEach((numeral) => {
        angle = Math.PI / 6 * (numeral - 3);
        // context.measureText(text)
        numeralWidth = context.measureText(numeral)
            .width;
        context.fillText(numeral,
            canvas.width / 2 + Math.cos(angle) * (HAND_RADIUS) - numeralWidth / 2,
            canvas.height / 2 + Math.sin(angle) * (HAND_RADIUS) + FONT_HEIGHT / 3);
    });
}
/**
 * 绘制圆心
 * 
 */
function drawCenter() {
    context.beginPath();
    context.arc(canvas.width / 2, canvas.height / 2, 5, 0, Math.PI * 2, true);
    context.fill();
}
/**
 * 绘制单个指针
 * 
 * @param {Number} loc 当前参数值
 * @param {Boolean} isHour 是否是时针
 */
function drawHand(loc, isHour) {
    let angle = (Math.PI * 2) * (loc / 60) - Math.PI / 2,
        handRadius = isHour
            ? RADIUS - HAND_TRUNCATION - HOUR_HAND_TRUNCATION
            : RADIUS - HAND_TRUNCATION;

    context.moveTo(canvas.width / 2, canvas.height / 2);
    context.lineTo(canvas.width / 2 + Math.cos(angle) * handRadius,
        canvas.height / 2 + Math.sin(angle) * handRadius);
    context.stroke();
}
/**
 * 绘制所有指针
 * 
 */
function drawHands() {
    let date = new Date,
        hour = date.getHours();

    hour = hour > 12 ? hour - 12 : hour;

    // 这里 * 5 是为了构造出 / 12，时针需要除 12
    drawHand(hour * 5 + (date.getMinutes() / 60) * 5 + (date.getSeconds() / 60 / 60) * 5, true);
    drawHand(date.getMinutes() + date.getSeconds() / 60, false);
    drawHand(date.getSeconds(), false);
}
/**
 * 绘制时钟
 * 
 */
function drawClock() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawCircle();
    drawCenter();
    drawHands();
    drawNumerals();
}

// Initialization

context.font = FONT_HEIGHT + 'px Arial';
setInterval(drawClock, 1000);
