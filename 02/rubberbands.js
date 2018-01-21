/*
 * @Author: tsingwong 
 * @Date: 2018-01-21 11:10:53 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-21 15:16:02
 */
let canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    eraseAllButton = document.querySelector('#eraseAllButton'),
    strokeStyleSelect = document.querySelector('#strokeStyleSelect'),
    guidewireCheckbox = document.querySelector('#guidewireCheckbox'),
    drawingSurfaceImageData,
    mousedown = {},
    rubberbandRect = {},
    dragging = false,
    guidewires = guidewireCheckbox.checked;

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
 * window 的坐标值转换为 canvas 上的坐标值
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @returns {Object} {x, y} 
 */
function windowToCanvas(x, y) {
    let bbox = canvas.getBoundingClientRect();
    return  {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
    };
}

// Save and restore drawing surface
/**
 * 保存当前绘图板内容
 * 
 */
function saveDrawingSurface() {
    drawingSurfaceImageData = context.getImageData(0, 0, canvas.width, canvas.height);
}
/**
 * 恢复到之前保存的绘图板内容
 * 
 */
function restoreDrawingSurface() {
    context.putImageData(drawingSurfaceImageData, 0, 0);
}

// Rubber bands
/**
 * 更新直线坐标
 * 
 * @param {any} loc 
 */
function updateRubberbandRectangle(loc) {
    rubberbandRect.width = Math.abs(loc.x - mousedown.x);
    rubberbandRect.height = Math.abs(loc.y - mousedown.y);

    if(loc.x > mousedown.x) {
        rubberbandRect.left = mousedown.x;
    } else {
        rubberbandRect.left = loc.x;
    }

    if(loc.y > mousedown.y) {
        rubberbandRect.top = mousedown.y;
    } else {
        rubberbandRect.top = loc.y;
    }
}
/**
 * 绘制直线
 * 
 * @param {any} loc 
 */
function drawRubberbandShape(loc) {
    context.beginPath();
    context.moveTo(mousedown.x, mousedown.y);
    context.lineTo(loc.x, loc.y);
    context.stroke();
}
/**
 * 更新直线
 * 
 * @param {Object} loc 
 */
function updateRubberband(loc) {
    updateRubberbandRectangle(loc);
    drawRubberbandShape(loc);
}

// Guidwires
/**
 * 绘制基准线 Y 轴
 * 
 * @param {Number} y 
 */
function drawHorizontalLine(y) {
    context.beginPath();
    context.moveTo(0, y + .5);
    context.lineTo(context.canvas.width, y + .5);
    context.stroke();
}
/**
 * 绘制基准线 X 轴
 * 
 * @param {Number} x 
 */
function drawVerticalLine(x) {
    context.beginPath();
    context.moveTo(x + .5, 0);
    context.lineTo(x + .5, context.canvas.height);
    context.stroke();
}
/**
 * 绘制基准线
 * 
 * @param {Number} x 
 * @param {Number} y 
 */
function drawGuidewires(x, y) {
    context.save();
    context.strokeStyle = 'rgba(0, 0, 230, .4)';
    context.lineWidth = .5;
    drawVerticalLine(x);
    drawHorizontalLine(y);
    context.restore();
}

// Canvas event handlers

canvas.onmousedown = function (e) {
    let loc = windowToCanvas(e.clientX, e.clientY);

    e.preventDefault();
    saveDrawingSurface();
    mousedown.x = loc.x;
    mousedown.y = loc.y;
    dragging = true;
};

canvas.onmousemove = function (e) {
    let loc;

    if (dragging) {
        e.preventDefault();

        loc = windowToCanvas(e.clientX, e.clientY);
        restoreDrawingSurface();

        updateRubberband(loc);
        
        if (guidewires) {
            drawGuidewires(loc.x, loc.y);
        }
    }
};

canvas.onmouseup = function (e) {
    let loc = windowToCanvas(e.clientX, e.clientY);
    restoreDrawingSurface();
    updateRubberband(loc);
    dragging = false;
};

// Controls event handlers

eraseAllButton.onclick = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(context, 'lightgray', 10, 10);
    saveDrawingSurface();
};

strokeStyleSelect.onchange = function () {
    context.strokeStyle =  strokeStyleSelect.value;
};


guidewireCheckbox.onchange = function () {
    guidewires = guidewireCheckbox.checked;
};

// Initialization

context.strokeStyle = strokeStyleSelect.value;
drawGrid(context, 'lightgray', 10, 10);

