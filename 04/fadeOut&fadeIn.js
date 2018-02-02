/*
 * @Author: tsingwong 
 * @Date: 2018-02-02 14:25:11 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-02-02 20:27:18
 */
const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    fadeOutSelect = document.querySelector('#fadeOutSelect'),
    fadeInSelect = document.querySelector('#fadeInSelect'),
    offScreenCanvas = document.createElement('canvas'),
    offScreenContext = offScreenCanvas.getContext('2d');

let image = new Image(),
    interval = null,
    imagedataOffScreen;

// Functions 
function increaseTransparency(imagedata, steps) {
    let alpha, currentAlpha, step, length = imagedata.data.length;

    for (let i = 3; i < length; i += 4) {
        alpha = imagedataOffScreen.data[i];

        if (alpha > 0) {
            currentAlpha = imagedata.data[i];
            step = Math.ceil(alpha / steps);
            
            if (currentAlpha + step <= alpha) {
                imagedata.data[i] += step;
            } else {
                imagedata.data[i] = alpha;
            }
        }
    }
}

function reduceTransparency(imagedata, steps) {
    let alpha, currentAlpha, step, length = imagedata.data.length;

    for (let i = 3; i < length; i += 4) {
        alpha  = 0;

        if (alpha > 0 && imagedata.data[i] > 0) {
            currentAlpha = imagedata.data[i];
            step = Math.ceil(alpha / steps);

            if (currentAlpha - step > 0) {
                image.data[i] -= step;
            } else {
                imagedata.data[i] = 0;
            }
        }
    }
}


function fadeIn(context, imagedata, steps, milliseconedsPerStep) {
    let frame = 0;

    for (let i = 3; i < imagedata.data.length; i += 4) {
        imagedata.data[i] = 0;
    }

    interval = window.setInterval(() => {
        frame++;

        if (frame > steps) {
            clearInterval(interval);
        } else {
            increaseTransparency(imagedata, steps);
            context.putImageData(imagedata, 0, 0);
        }
    }, milliseconedsPerStep);
}


function fadeOut (context, imagedata, steps, milliseconedsPerStep) {
    let frame = 0;

    interval = window.setInterval(() => {
        frame++;

        if (frame > steps) {
            clearInterval(interval);
        } else {
            reduceTransparency(imagedata, steps);
            context.putImageData(imagedata, 0, 0);
        }
    }, milliseconedsPerStep);
}


// Event handler
fadeInSelect.onclick = function (e) {
    imagedataOffScreen = offScreenContext.getImageData(0, 0, offScreenCanvas.width, offScreenCanvas.height);    
    fadeIn(
        context,
        imagedataOffScreen,
        50,
        1000 / 60
    );
};

fadeOutSelect.onclick = function () {
    fadeOut(
        context,
        context.getImageData(0, 0, canvas.width, canvas.height),
        50, 
        1000 / 60
    );
};

    
// Initialization

image.src = './Uncle.jpg';

image.onload = function (e) {
    offScreenCanvas.width = canvas.width;
    offScreenCanvas.height = canvas.height;
    offScreenContext.drawImage(image, 0, 0, canvas.width, canvas.height);
};

