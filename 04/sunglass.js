/*
 * @Author: tsingwong 
 * @Date: 2018-01-31 14:34:09 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-31 15:58:22
 */
let canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    filters = document.querySelectorAll('[name=filters]'),
    sunglassSelect = document.querySelector('#sunglassSelect'),
    image = new Image(),
    flag = false,

    offScreenCanvas = document.createElement('canvas'),
    offScreenContext = offScreenCanvas.getContext('2d'),
    filterWorker = new Worker('./filterWorker.js');
    
offScreenCanvas.width = canvas.width;
offScreenCanvas.height = canvas.height;

const LENS_RADIUS = canvas.width / 5;

// Functions

function drawLenses(leftLensLocation, rightLensLocation) {
    context.save();
    context.beginPath();

    context.arc(leftLensLocation.x, leftLensLocation.y, LENS_RADIUS, 0,  Math.PI / 180 * 360, false);
    
    context.moveTo(rightLensLocation.x, rightLensLocation.y);

    context.arc(rightLensLocation.x, rightLensLocation.y, LENS_RADIUS, 0,  Math.PI / 180 * 360, false);

    context.clip();

    context.drawImage(offScreenCanvas, 0, 0, canvas.width, canvas.height);
    
    context.restore();
}

function drawWire(center) {
    context.beginPath();
    context.moveTo(center.x - LENS_RADIUS / 4, center.y - LENS_RADIUS / 2);
    context.quadraticCurveTo(center.x, 
        center.y - LENS_RADIUS + 20, 
        center.x + LENS_RADIUS / 4, 
        center.y - LENS_RADIUS / 2);
    context.stroke();
}

function drawConnectors(center) {
    context.beginPath();

    context.fillStyle = 'silver';
    context.strokeStyle = 'rgba(0, 0, 0, .4)';
    context.lineWidth = 2;

    context.arc(center.x - LENS_RADIUS / 4, center.y - LENS_RADIUS / 2, 4, 0,  Math.PI / 180 * 360, false);

    context.fill();
    context.stroke();

    context.beginPath();

    context.arc(center.x + LENS_RADIUS / 4, center.y - LENS_RADIUS / 2, 4, 0,  Math.PI / 180 * 360, false);
    
    context.fill();
    context.stroke();
}

function drawOriginalImage() {
    context.drawImage(image, 0, 0);
}


function putSunglassesOn() {
    let iamgeData = context.getImageData(0, 0, canvas.width, canvas.height),
        center = {
            x: canvas.width / 2,
            y: canvas.height /2
        },
        leftLensLocation = {
            x: center.x - LENS_RADIUS - 10,
            y: center.y
        },
        rightLensLocation = {
            x: center.x + LENS_RADIUS + 10,
            y: center.y
        };
    
    filterWorker.postMessage({
        'value': 'sunglassFilter',
        'imageData': iamgeData
    });

    filterWorker.onmessage = function (event) {
        offScreenContext.putImageData(event.data, 0, 0);
        drawLenses(leftLensLocation, rightLensLocation);
        drawWire(center);
        drawConnectors(center);
    }
}

// Event handler

sunglassSelect.onclick = function () {
    if (!flag) {
        putSunglassesOn();
    } else {
        drawOriginalImage();
    }
    flag = !flag;
    this.value = flag ? '摘掉🕶' : '带上🕶';
};


// Initialization

image.src = './rick-and-morty.png';
image.onload = function () {
    drawOriginalImage();
};
