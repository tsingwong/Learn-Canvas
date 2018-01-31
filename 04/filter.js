/*
 * @Author: tsingwong 
 * @Date: 2018-01-30 15:06:10 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-31 09:55:09
 */
const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    filters = document.querySelectorAll('[name=filters]'),
    image = new Image();

let imageData, data;

function drawInBlackAndWhite() {
    data = undefined;
    
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    data = imageData.data;

    for(let i = 0, l = data.length; i < l - 4; i += 4) {
        let average = (data[i] + data[i + 1] + data[i + 2]) / 3;
        [data[i], data[i+ 1], data[i + 2]] = [average, average, average];
    }
}

function drawInColor() {
    context.drawImage(image, 0, 0);
}

function emboss() {
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    data = imageData.data;

    // 返回在图像数据对象中每一行像素的数量
    let width = imageData.width,
        // 返回在图像数据对象中的行的数量
        height = imageData.height;
        
    // for (let i = 0, l = data.length; i < l; i ++) {
    //     if ((i + 1) % 4 !== 0) {
    //         data[i] = 255 /2
    //             + 2 * data[i]
    //             - data[i + 4]
    //             - data[i + width * 4];
    //     }
    // }

    /**
     * 简单解释下为什么出线各种 4
     * 这就是设备像素与 css 像素的区别
     * 由于像素点的绘制是从上到下从左到右的，那么下面的代码理解起来就清楚了
     */
    for (let i = 0, l = data.length; i < l; i++) {
        // 非最后一行
        if (i <= l - width * 4) {
            // 非透明度
            if ((i + 1) % 4 !== 0) {
                // 一行的最后一个像素
                if ((i + 4) % (width * 4) == 0) {
                    data[i] = data[i - 4];
                    data[i + 1] = data[i - 3];
                    data[i + 2] = data[i - 2];
                    data[i + 3] = data[i - 1];
                } else {
                    // 一行中非最后一个像素
                    data[i] = 255 /2
                        + 2 * data[i]
                        - data[i + 4]
                        - data[i + width * 4];
                }
            }
        } else {
            // 最后一行
            if ((i + 1) % 4 !== 0) {
                data[i] = data[i - width * 4];
            }
        }
    }
}
    

[...filters].forEach((value, index, array) => {
    value.onclick = handler;
});

function handler () {
    drawInColor();
    if(this.value === 'negativeFilter') {
        imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        data = imageData.data;

        for(let i = 0, l = data.length; i < l - 4; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }
    } else if (this.value === 'blackAndWhiteFilter') {
        drawInBlackAndWhite();
    } else if (this.value === 'reset') {
        [...this.parentNode.children].forEach((value, index, array) => {
            value.checked && (value.checked = false);
        });
        return;
    } else if (this.value === 'embossFilter') {
        emboss();
    }
    
    context.putImageData(imageData, 0, 0);
}

// Initialization

image.src = './rick-and-morty.png';
image.onload = function (e) {
    drawInColor();
};


