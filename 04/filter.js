/*
 * @Author: tsingwong 
 * @Date: 2018-01-30 15:06:10 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-30 16:04:39
 */
const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    filters = document.querySelector('[name=filters]'),
    image = new Image();

filters.onclick = function () {
    let imageData, data;
    if(this.value === 'negativeFilter') {
        imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        data = imageData.data;

        for(let i = 0, l = data.length; i < l - 4; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }
    }
    
    context.putImageData(imageData, 0, 0);
};

// Initialization

image.src = './rick-and-morty.png';
image.onload = function (e) {
    context.drawImage(image, 0, 0);
};


