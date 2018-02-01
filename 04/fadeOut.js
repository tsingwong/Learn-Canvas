/*
 * @Author: tsingwong 
 * @Date: 2018-01-31 16:52:02 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-02-01 19:39:10
 */
const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    fadeOutSelect = document.querySelector('#fadeOutSelect');

let image = new Image(),
    originalImageData = null,
    interval;

// Functions

function increaseTransparency(imagedata, steps) {
    let alpha, currentAlpha, step, length = imagedata.data.length;

    for (let i = 3; i < length; i += 4) {
        // 透明度
        alpha = originalImageData.data[i];

        if (alpha > 0 && imagedata.data[i] > 0) {
            currentAlpha = imagedata.data[i];
            // 每次减少的透明度
            step = Math.ceil(alpha / steps);

            if (currentAlpha - step > 0) {
                imagedata.data[i] -= step;
            } else {
                imagedata.data[i] = 0;
            }
        }
    }
}

function fadeOut(context, imagedata,x ,y, steps, millisecondsPerStep) {
    let frame = 0,
        length = imagedata.data.length;

    interval = setInterval(() => {
        frame++;
        
        if(frame > steps) {
            clearInterval(interval);
            // 1s 后重新渲染
            animationComplete();
        } else {
            increaseTransparency(imagedata, steps);
            context.putImageData(imagedata, x, y);
        }
    }, millisecondsPerStep);
} 

function animationComplete() {
    setTimeout(() => {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
    }, 1000);
}


// Event handlers

fadeOutSelect.onclick = function (e) {
    fadeOut(context,
        context.getImageData(0, 0, canvas.width, canvas.height),
        0, 0, 20, 1000 / 60
    );
};

image.src = './naruto.jpg';

image.onload = function (e) {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    originalImageData = context.getImageData(0, 0, canvas.width, canvas.height);
};

