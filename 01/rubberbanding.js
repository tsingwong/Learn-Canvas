/*
 * @Author: tsingwong 
 * @Date: 2018-01-16 10:05:31 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-17 09:06:45
 */
let canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    rubberbandDiv = document.querySelector('#rubberbandDiv'),
    resetButton = document.querySelector('#resetButton'),
    image = new Image(),
    mousedown = {},
    rubberbandRectangle = {},
    dragging = false;
/**
 * 选择框的开始
 * 
 * @param {Number} x 鼠标按下时当前位置的横坐标值
 * @param {Number} y 鼠标按下时当前位置的纵坐标值
 */
function rubberbandStart(x, y) {
    mousedown.x = x;
    mousedown.y = y;

    rubberbandRectangle.left = mousedown.x;
    rubberbandRectangle.top = mousedown.y;

    moveRubberbandDiv();
    showRubberbandDiv();

    dragging = true;
}
/**
 * 选择框的绘制
 * 
 * @param {Number} x 鼠标移动时当前位置的横坐标值
 * @param {Number} y 鼠标移动时当前位置的纵坐标值
 */
function rubberbandStretch(x, y) {
    // 判断当前坐标与鼠标按下时的坐标大小，选择其中较小的作为结果。
    rubberbandRectangle.left = x < mousedown.x ? x : mousedown.x;
    rubberbandRectangle.top = y < mousedown.y ? y : mousedown.y;

    rubberbandRectangle.width = Math.abs(x - mousedown.x);
    rubberbandRectangle.height = Math.abs(y - mousedown.y);

    moveRubberbandDiv();
    resizeRubbebandDiv();
}


/**
 * 选择框的结束
 * 
 */
function rubberbandEnd() {
    // 获取元素的大小及其相对于视口的位置
    let bbox = canvas.getBoundingClientRect();

    try {
        // context.drawImage(image, [sx, sy, sWidth, sHeight, ]dx, dy[, dWidth, dHeight])
        context.drawImage(canvas,
            rubberbandRectangle.left - bbox.left,
            rubberbandRectangle.top - bbox.top,
            rubberbandRectangle.width,
            rubberbandRectangle.height,
            0, 0, canvas.width, canvas.height
        );
    } catch (e) {
        // Suppress error message when mouse is released outside the canvas
        // eslint-disable-next-line
        console.log(e);
    }

    resetRubberbandRectangle();

    rubberbandDiv.style.width = 0;
    rubberbandDiv.style.height = 0;

    hideRubberbandDiv();

    dragging = false;
}
/**
 * 移动选择框
 * 
 */
function moveRubberbandDiv() {
    rubberbandDiv.style.top = rubberbandRectangle.top + 'px';
    rubberbandDiv.style.left = rubberbandRectangle.left + 'px';
}
/**
 * 重新调整选择框
 * 
 */
function resizeRubbebandDiv() {
    rubberbandDiv.style.width = rubberbandRectangle.width + 'px';
    rubberbandDiv.style.height = rubberbandRectangle.height + 'px';
}
/**
 * 显示选择框
 * 
 */
function showRubberbandDiv() {
    rubberbandDiv.style.display = 'inline';
}
/**
 * 隐藏选择框
 * 
 */
function hideRubberbandDiv() {
    rubberbandDiv.style.display = 'none';
}
/**
 * 重置选择框
 * 
 */
function resetRubberbandRectangle() {
    rubberbandRectangle = { top: 0, left: 0, width: 0, height: 0 };
}

// Event handlers
/**
 * 监听鼠标按键按下事件
 * 
 * @event
 * @param {Object} e 鼠标事件
 * @param {String} e.clientX 当前鼠标的 x 坐标
 * @param {String} e.clientY 当前鼠标的 y 坐标
 * 
 */
canvas.onmousedown = function (e) {
    let x = e.clientX,
        y = e.clientY;
    
    // 防止浏览器对鼠标事件作出相应
    e.preventDefault();
    rubberbandStart(x, y);
};
/**
 * 监听鼠标移动事件
 * 
 * @event
 * @param {Object} e 鼠标事件
 * @param {String} e.clientX 当前鼠标的 x 坐标
 * @param {String} e.clientY 当前鼠标的 y 坐标
 */
window.onmousemove = function (e) {
    let x = e.clientX,
        y = e.clientY;

    // 防止浏览器对鼠标事件作出相应
    e.preventDefault();
    if (dragging) {
        rubberbandStretch(x, y);
    }
};
/**
 * 监听鼠标按键松开事件
 * 
 * @param {Object} e 鼠标事件
 */
window.onmouseup = function (e) {
    // 防止浏览器对鼠标事件作出相应
    e.preventDefault();
    rubberbandEnd();
};
/**
 * 图片加载后
 * 将图片绘制到 canvas 中
 */
image.onload = function () {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
};
/**
 * 点击重置按钮
 * 清除 canvas 内容，重新将图片绘制到 canvas 中
 */
resetButton.onclick = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
};

// Initialization

image.src = './tianyan.jpg';
