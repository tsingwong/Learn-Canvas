/*
 * @Author: tsingwong 
 * @Date: 2018-01-30 15:06:10 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-31 11:28:37
 */
const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    filters = document.querySelectorAll('[name=filters]'),
    image = new Image(),
    worker = new Worker('./filterWorker.js');

let imageData;

function drawInColor() {
    context.drawImage(image, 0, 0);
}

[...filters].forEach((value, index, array) => {
    value.onclick = handler;
});

function handler () {
    drawInColor();

    // 重置后，重新获取 imageData
    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    worker.postMessage(
        {
            'value': this.value,
            'imageData': imageData
        }
    );

    worker.onmessage = function (event) {
        imageData = event.data;
        context.putImageData(imageData, 0, 0);
    };

    if (this.value === 'reset') {
        [...this.parentNode.children].forEach((value, index, array) => {
            value.checked && (value.checked = false);
        });
    }
}

// Initialization

image.src = './rick-and-morty.png';
image.onload = function (e) {
    drawInColor();
};


