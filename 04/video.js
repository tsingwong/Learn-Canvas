/*
 * @Author: tsingwong 
 * @Date: 2018-02-05 21:49:07 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-02-08 23:07:27
 */
// 注意涉及到视频播放问题，可以使用 ffmpeg 来转换视频格式
const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    video = document.querySelector('#video'),
    controlBtn = document.querySelector('#controlBtn'),
    colorCheckBox = document.querySelector('#colorCheckBox'),
    flipCheckBox = document.querySelector('#flipCheckBox'),

    offScreenCanvas = document.createElement('canvas'),
    offScreenContext = offScreenCanvas.getContext('2d');

let imageData;

offScreenCanvas.width = canvas.width,
offScreenCanvas.height = canvas.height;

/**
 * 去色
 * 去色的方法是：将 RGB 的色值设置为 RGB 的平均值
 */
function removeColor() {
    let data, width, average;

    imageData = offScreenContext.getImageData(0, 0, offScreenCanvas.width, offScreenCanvas.height);

    data = imageData.data;
    width = data.width;

    for (let i = 0, l = data.length - 4; i < l; i += 4) {
        average = (data[i] + data[i + 1] + data[i + 2]) / 3;
        [data[i], data[i + 1], data[i + 2]] = [average, average, average];
    }

    offScreenContext.putImageData(imageData, 0, 0);
}

/**
 * 反向
 * 反向的步骤是先移动坐标系到中心点位置，然后旋转 180°，再移动坐标系到原位置。
 */
function drawFilpped () {
    context.save();

    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(Math.PI);
    context.translate(- canvas.width / 2, - canvas.height / 2);
    context.drawImage(offScreenCanvas, 0, 0);

    context.restore();
}

function nextVideoFrame() {
    if (video.ended) {
        controlBtn.value = 'Play';
    } else {
        offScreenContext.drawImage(video, 0, 0);

        if (colorCheckBox.checked) {
            removeColor();
        }

        if (flipCheckBox.checked) {
            drawFilpped();
        } else {
            context.drawImage(offScreenCanvas, 0, 0);
        }
    }

    window.requestAnimationFrame(nextVideoFrame);
}

function startPlaying() {
    window.requestAnimationFrame(nextVideoFrame);
    video.play();
}

function stopPlaying() {
    video.pause();
}

controlBtn.onclick = function (e) {
    if (this.value === 'Play') {
        startPlaying();
        this.value = 'Pause';
    } else {
        stopPlaying();
        this.value = 'Play';
    }
};
