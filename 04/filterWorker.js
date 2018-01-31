/*
 * @Author: tsingwong 
 * @Date: 2018-01-31 10:37:31 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-31 11:26:22
 */
self.onmessage = function (event) {
    let imageData = event.data.imageData,
        data = imageData.data,
        // 返回在图像数据对象中的行的数量
        length = imageData.length,
        // 返回在图像数据对象中每一行像素的数量
        width = imageData.width,
        value = event.data.value;

    if(value === 'negativeFilter') {
        negative(data, width, length);
    } else if (value === 'blackAndWhiteFilter') {
        drawInBlackAndWhite(data, width, length);
    } else if (value === 'reset') {
        return;
    } else if (value === 'embossFilter') {
        emboss(data, width, length);
    } else if (value === 'sunglassFilter') {
        sunglass(data, width, length);
    }

    self.postMessage(imageData);
};

function negative (data, width, length) {
    for(let i = 0, l = data.length; i < l - 4; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
    }
}

function drawInBlackAndWhite(data, width, length) {
    for(let i = 0, l = data.length; i < l - 4; i += 4) {
        let average = (data[i] + data[i + 1] + data[i + 2]) / 3;
        [data[i], data[i+ 1], data[i + 2]] = [average, average, average];
    }
}

function emboss(data, width, length) {
        
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
                if ((i + 4) % (width * 4) === 0) {
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

function sunglass(data, width, length) {
    for (let i = 0, l = data.length; i < l; i++) {
        if ((i + 1) % 4 !== 0) {
            if ((i + 4) % (width * 4) === 0) {
                data[i] = data[i - 4];
                data[i + 1] = data[i - 3];
                data[i + 2] = data[i - 2];
                data[i + 3] = data[i - 1];
                i += 4;
            } else {
                data[i] = 2 * data[i] - data[i + 4] - .5 * data[i + 4];
            }
        }
    }
}
