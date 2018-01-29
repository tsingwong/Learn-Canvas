/*
 * @Author: tsingwong 
 * @Date: 2018-01-28 10:10:57 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-29 16:08:22
 */
const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),

    BLINK_ON = 500,
    BLINK_OFF = 500;

let drawingSurfaceImageData,
    blinkingInterval,
    line;
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
 * 单行字符串
 * 
 * @class TextLine
 */
class TextLine {
    constructor(x, y) {
        this.text = '';
        this.left = x;
        this.bottom = y;
        this.caret = 0;
    }
    /**
     * 插入单个字符
     * 
     * @param {String} text 单个字符
     * @memberof TextLine
     */
    insert(text) {
        this.text = this.text.substr(0, this.caret) + text + this.text.substr(this.caret);
        this.caret += text.length;
    }
    /**
     * 删除前一个字符
     * 
     * @returns 
     * @memberof TextLine
     */
    removeCharacterBeforeCaret() {
        if (this.caret === 0) {
            return;
        }
        this.text = this.text.substring(0, this.caret - 1) + this.text.substring(this.caret);
        
        this.caret--;
    }
    /**
     * 获取宽度
     * 
     * @param {Object} context 
     * @returns 
     * @memberof TextLine
     */
    getWidth(context) {
        return context.measureText(this.text).width;
    }
    /**
     * 
     * 
     * @param {any} context 
     * @returns 
     * @memberof TextLine
     */
    getHeight(context) {
        const w = context.measureText('W').width;
        return w + w / 6;
    }

    draw(context) {
        context.save();
        context.textAlign = 'start';
        context.textBaseLine = 'bottom';

        context.strokeText(this.text, this.left, this.bottom);
        context.fillText(this.text, this.left, this.bottom);

        context.restore();
    }

    erase(context, imageData) {
        context.putImageData(imageData, 0, 0);
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

const cursor = new TextCursor();

function blinkCursor() {
    clearInterval(blinkingInterval);
    blinkingInterval = setInterval((e) => {
        cursor.erase(context, drawingSurfaceImageData);

        setTimeout((e) => {
            // 由于在 draw 里操作会减去 cursor.getHeight(context)
            // 所以这里加上
            cursor.draw(context, cursor.left, cursor.top + cursor.getHeight(context));
        }, BLINK_OFF);
    }, BLINK_ON + BLINK_OFF);
}
/**
 * 绘制光标
 * 
 * @param {Object} loc 
 */
function moveCursor (loc) {
    cursor.erase(context, drawingSurfaceImageData);
    saveDrawingSurface();
    context.putImageData(drawingSurfaceImageData, 0, 0);

    cursor.draw(context, loc.x, loc.y);

    blinkCursor(loc);
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
    line = new TextLine(loc.x, loc.y);
    moveCursor(loc);
};

document.onkeydown = function (e) {
    if ([8, 13].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
    
    if([8].indexOf(e.keyCode) > -1) {
        context.save();
        
        line.erase(context, drawingSurfaceImageData);
        line.removeCharacterBeforeCaret();

        moveCursor(line.left + line.getWidth(context), line.bottom);

        line.draw(context);

        context.restore();
    }
};

document.onkeypress = function (e) {
    let key = String.fromCharCode(e.which);

    if ([8].indexOf(e.keyCode) === -1 && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();

        context.save();

        line.erase(context, drawingSurfaceImageData);
        line.insert(key);

        moveCursor(line.left + line.getWidth(context), line.bottom);

        context.shadowColor = 'rgba(0, 0, 0, .5)';
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 2;
        context.shadowBlur = 3;

        line.draw(context);

        context.restore();
    }
}

// Initialization
context.font = '64pt Comic-sans';
drawGrid(context, 'lightgray', 10, 10);
saveDrawingSurface();
