/*
 * @Author: tsingwong 
 * @Date: 2018-02-04 21:15:45 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-02-04 23:50:57
 */
const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d');

    // 用于标识鼠标是否按下
let dragging = false,

    imageData = null,

    magnifierRect = {
        x: 0,
        y: 0,
        w: 50,
        h: 50
    },
    img = new Image();


/**
 * window 坐标系 转换为 canvas 坐标系
 * 
 * @param {any} x 
 * @param {any} y 
 * @returns 
 */
function windowToCanvas(x, y) {
    let bbox = canvas.getBoundingClientRect();

    return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
    };
}

function erraseMagnifier() {
    if (imageData !== null) {
        context.putImageData(imageData, magnifierRect.x, magnifierRect.y);
    }
}

function drawMagnifier(x, y) {
    imageData = context.getImageData(
        magnifierRect.x, 
        magnifierRect.y, 
        magnifierRect.w, 
        magnifierRect.h
    );

    context.save();
    
    context.beginPath();

    context.arc(x, y, 25, 0,  Math.PI / 180 * 360, false);
    context.clip();

    context.drawImage(canvas,
        magnifierRect.x,
        magnifierRect.y, 
        magnifierRect.w,
        magnifierRect.h,
        magnifierRect.x - 1 / 2 * magnifierRect.w,
        magnifierRect.y - 1 / 2 * magnifierRect.h,
        2 * magnifierRect.w,
        2 * magnifierRect.h
    );
    context.restore();



}

canvas.onclick = function (e) {
    let mouse = windowToCanvas(e.clientX, e.clientY);
    
    erraseMagnifier();
    magnifierRect.x = mouse.x - 1 / 2 * magnifierRect.w;
    magnifierRect.y = mouse.y - 1 / 2 * magnifierRect.h;
    drawMagnifier(mouse.x, mouse.y);
};

canvas.onmousemove = function (e) {
    if (dragging) {
        erraseMagnifier();
        drawMagnifier(windowToCanvas(e.clientX, e.clientY));
    }
};

// Initialization

img.src = './fitness.jpg';
img.onload = function (e) {
    context.drawImage(img, 0, 0);
};
