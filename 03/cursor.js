/*
 * @Author: tsingwong 
 * @Date: 2018-01-28 10:10:57 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-28 17:24:24
 */
const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d');

let drawingSurfaceImageData;
/**
 * 光标构造函数
 * 
 * @class TextCursor
 */
class TextCursor {
    /**
     * Creates an instance of TextCursor.
     * @param {Number} width 宽度
     * @param {String} fillStyle 颜色
     * @memberof TextCursor
     */
    constructor(width, fillStyle) {
        this.fillStyle = fillStyle || 'rgba(0, 0, 0, .5)';
        this.width = width || 2;
        this.left = 0;
        this.top = 0;
    }
    /**
     * 获取光标的高度值
     * 通过字母的宽度再加上 1/6 宽度，近似得到文本高度
     * 
     * @param {Object} context
     * @returns 
     * @memberof TextCursor
     */
    getHeight(context) {
        const h = context.measureText('W').width;
        return h + h / 6;
    }
    /**
     * 创建光标路径
     * 
     * @param {Object} context 
     * @memberof TextCursor
     */
    createPath(context) {
        context.beginPath();
        context.rect(this.left, this.top, this.width, this.getHeight(context));
    }
    /**
     * 绘制光标
     * 
     * @param {Object} context 
     * @param {Number} left 
     * @param {Number} bottom 
     * @memberof TextCursor
     */
    draw(context, left, bottom) {
        context.save();
        
        this.left = left;
        // 想象一下，一般光标是在点击位置的上方，即鼠标点击的位置是光标的末端
        this.top = bottom - this.getHeight(context);

        this.createPath(context);

        context.fillStyle = this.fillStyle;
        context.fill();

        context.restore();
    }
    /**
     * 擦除光标
     * 
     * @param {Object} context 
     * @param {Object} imageData 
     * @memberof TextCursor
     */
    erase(context, imageData) {
        context.putImageData(imageData, 0 ,0 ,this.left, this.top, this.width, this.getHeight(context));
    }
}

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
    return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
    };
}

const cursor = new TextCursor;
/**
 * 绘制光标
 * 
 * @param {Object} loc 
 */
function moveCursor (loc) {
    cursor.erase(context, drawingSurfaceImageData);
    cursor.draw(context, loc.x, loc.y);
}
/**
 * 保存当前绘图环境
 * 
 */
function saveDrawingSurface () {
    drawingSurfaceImageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
}

canvas.onmousedown = function (e) {
    const loc = windowToCanvas(e.clientX, e.clientY);
    moveCursor(loc);
};

// Initialization
context.font = '64pt Comic-sans';
drawGrid(context, 'lightgray', 10, 10);
saveDrawingSurface();
