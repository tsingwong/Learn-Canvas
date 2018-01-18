/*
 * @Author: tsingwong 
 * @Date: 2018-01-18 10:04:50 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-18 10:10:13
 */
let canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d');

context.lineJoin = 'round';
context.lineWidth = '30';

context.font = '24px Helvetica';
context.fillText('Click anywhere to erase', 175, 40);

context.strokeRect(75, 100, 200, 200);
context.fillRect(325, 100, 200, 200);

context.canvas.onclick = function () {
    // 清除像素，实际上是将颜色设置为全透明的黑色
    context.clearRect(0, 0, canvas.width, canvas.height);
};
