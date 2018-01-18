/*
 * @Author: tsingwong 
 * @Date: 2018-01-18 17:06:25 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-18 19:29:50
 */
let canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    repeatRadio = document.querySelector('#repeatRadio'),
    repeatXRadio = document.querySelector('#repeatXRadio'),
    repeatYRadio = document.querySelector('#repeatYRadio'),
    noRepeatRadio = document.querySelector('#noRepeatRadio'),
    image = new Image();

// Functions

function fillCanvasWithPattern (repeatString) {
    const pattern = context.createPattern(image, repeatString);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = pattern;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

// Event Handler

repeatRadio.onclick = function () {
    fillCanvasWithPattern('repeat');
};

repeatXRadio.onclick = function () {
    fillCanvasWithPattern('repeat-x');
};


repeatYRadio.onclick = function () {
    fillCanvasWithPattern('repeat-y');
};

noRepeatRadio.onclick = function () {
    fillCanvasWithPattern('no-repeat');
};

// Initialization

image.src = 'pattern.png';
image.onload = function () {
    fillCanvasWithPattern('repeat');
};
