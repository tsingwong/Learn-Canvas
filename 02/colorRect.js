/*
 * @Author: tsingwong 
 * @Date: 2018-01-18 10:11:38 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-18 10:16:11
 */
const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d');

context.lineJoin = 'round';
context.lineWidth = 30;

context.font = '24px Helvetica';
context.fillText('Click angywhere to erase', 175, 200);

context.strokeStyle = 'goldenrod';
context.fillStyle = 'rgba(0, 0, 255, .5)';

context.strokeRect(75, 100, 200, 200);
context.fillRect(325, 100, 200, 200);

context.canvas.onmousedown = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
};
