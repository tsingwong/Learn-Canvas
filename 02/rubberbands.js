/*
 * @Author: tsingwong 
 * @Date: 2018-01-21 11:10:53 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-24 18:09:50
 */
let canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    eraseAllButton = document.querySelector('#eraseAllButton'),
    strokeStyleSelect = document.querySelector('#strokeStyleSelect'),
    guidewireCheckbox = document.querySelector('#guidewireCheckbox'),
    fillCheckbox = document.querySelector('#fillCheckbox'),
    fillStyleSelect = document.querySelector('#fillStyleSelect'),
    drawShape = document.querySelector('#drawShape'),
    menu = document.querySelector('.menu'),
    sidesSelect = document.querySelector('#sidesSelect'),
    startAngleSelect = document.querySelector('#startAngleSelect'),
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
    context.save();
    context.strokeStyle = color;
    context.lineWidth = .5;

    for (let i = stepx + .5; i < context.canvas.width; i += stepx) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, context.canvas.height);
        context.stroke();
    }

    for (let i = stepy + .5; i < context.canvas.height; i += stepy) {
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(context.canvas.width, i);
        context.stroke();
    }

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

    if (loc.x > mousedown.x) {
        rubberbandRect.left = mousedown.x;
    } else {
        rubberbandRect.left = loc.x;
    }

    if (loc.y > mousedown.y) {
        rubberbandRect.top = mousedown.y;
    } else {
        rubberbandRect.top = loc.y;
    }
}
/**
 * 绘制图形
 * 
 * @param {any} loc 
 */
function drawRubberbandShape(loc) {
    context.save();
    context.beginPath();
    switch (drawShape.value) {
        case 'line':
            context.moveTo(mousedown.x, mousedown.y);
            context.lineTo(loc.x, loc.y);
            break;

        case 'circle': {
            let angle, radius;

            if (mousedown.y === loc.y) {
                // 鼠标按下后水平移动
                radius = Math.abs(mousedown.x - loc.x);
            } else {
                // 鼠标按下后非水平移动
                angle = Math.atan(rubberbandRect.height / rubberbandRect.width);
                radius = rubberbandRect.height / Math.sin(angle);
            }

            context.arc(mousedown.x, mousedown.y, radius, 0, Math.PI * 2, true);
            break;
        }
            
        case 'roundedRect':
            roundedRect(rubberbandRect.left, rubberbandRect.top, rubberbandRect.width, rubberbandRect.height, 20);

            break;

        case 'polygon': {
            let polygon = new Polygon(
                mousedown.x,
                mousedown.y,
                rubberbandRect.width,
                parseInt(sidesSelect.value),
                parseInt(startAngleSelect.value),
                strokeStyleSelect.value,
                fillStyleSelect.value,
                fillCheckbox.checked);
            polygon.createPath(context);
            break;
        }
            
        default:
            break;
    }


    fillCheckbox.checked && context.fill();

    context.stroke();
    context.restore();
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
/**
 * 绘制圆角矩形
 * 
 * @param {Number} cornerX 起点 X 值 
 * @param {Number} cornerY 起点 Y 值
 * @param {any} width 宽度
 * @param {any} height 高度
 * @param {any} cornerRadius 圆角大小
 */
function roundedRect(cornerX, cornerY, width, height, cornerRadius) {
    context.moveTo(cornerX + cornerRadius, cornerY);
    context.arcTo(cornerX + width, cornerY, cornerX + width, cornerY + height, cornerRadius);
    context.arcTo(cornerX + width, cornerY + height, cornerX, cornerY + height, cornerRadius);
    context.arcTo(cornerX, cornerY + height, cornerX, cornerY, cornerRadius);
    context.arcTo(cornerX, cornerY, cornerX + cornerRadius, cornerY, cornerRadius);
}

// Point Class

class Point {
    // constructor
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Polygon Class
class Polygon {
    /**
     * Creates an instance of Polygon.
     * @param {Number} centerX 多边形外接圆的圆心横坐标
     * @param {Number} centerY 多边形外接圆的圆心纵坐标
     * @param {Number} radius 多边形外接圆的半径
     * @param {Number} sides 多边形的边数
     * @param {Number} startAngle 多边形第一个顶点的起始角度
     * @param {String} strokeStyle 描边样式
     * @param {String} fillStyle 填充样式
     * @param {Boolean} filled 是否填充
     * @memberof Polygon
     */
    constructor(centerX, centerY, radius, sides, startAngle, strokeStyle, fillStyle, filled) {
        this.x = centerX;
        this.y = centerY;
        this.radius = radius;
        this.sides = sides;
        this.startAngle = startAngle;
        this.strokeStyle = strokeStyle;
        this.fillStyle = fillStyle;
        this.filled = filled;
    }

    // prototype
    getPoint() {
        let points = [],
            angle = this.startAngle || 0;

        for (let i = 0; i < this.sides; i++) {
            points.push(
                new Point(
                    this.x + this.radius * Math.sin(angle),
                    this.y - this.radius * Math.cos(angle)
                )
            );
            angle += 2 * Math.PI / this.sides;
        }
        return points;
    }

    createPath(context) {
        let points = this.getPoint();

        context.beginPath();
        context.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < this.sides; i++) {
            context.lineTo(points[i].x, points[i].y);
        }

        context.closePath();
    }

    stroke(context) {
        context.save();
        this.createPath(context);
        context.strokeStyle = this.strokeStyle;
        context.stroke();
        context.restore();
    }

    fill(context) {
        context.save();
        this.createPath();
        context.fillStyle = this.fillStyle;
        context.fill();
        context.restore();
    }

    move(x, y) {
        this.x = x;
        this.y = y;
    }
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
    context.strokeStyle = strokeStyleSelect.value;
};

fillStyleSelect.onchange = function () {
    context.fillStyle = fillStyleSelect.value;
};


guidewireCheckbox.onchange = function () {
    guidewires = guidewireCheckbox.checked;
};

drawShape.onchange = function () {
    if (this.value === 'polygon') {
        menu.querySelector(`.${this.value}`)
            .style.display = 'block';
    }
};

// Initialization

context.strokeStyle = strokeStyleSelect.value;
drawGrid(context, 'lightgray', 10, 10);
