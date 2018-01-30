/*
 * @Author: tsingwong 
 * @Date: 2018-01-30 15:06:10 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-30 16:54:50
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
    }
    
    context.putImageData(imageData, 0, 0);
}

// Initialization

image.src = './rick-and-morty.png';
image.onload = function (e) {
    drawInColor();
};


