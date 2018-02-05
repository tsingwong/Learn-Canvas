/*
 * @Author: tsingwong 
 * @Date: 2018-02-05 21:49:07 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-02-05 22:53:45
 */
const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    video = document.querySelector('#video');

function animate() {
    if (!video.ended) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        window.requestAnimationFrame(animate);
    }
}

video.onloadstart = function (e) {
    video.play();
    animate();
};


