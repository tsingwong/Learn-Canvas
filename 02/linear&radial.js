/*
 * @Author: tsingwong 
 * @Date: 2018-01-18 15:21:50 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-18 16:30:56
 */
const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    // 表示横向的线性渐变
    linear = context.createLinearGradient(0, 0 , canvas.width / 2, 0),
    // 表示两个圆之间的渐变，即圆锥体侧面
    radial = context.createRadialGradient(canvas.width * 3 / 4, canvas.height, 0, canvas.width * 3 / 4, 0, canvas.width / 4);

// CanvasGradient 之中唯一的方法，用来添加颜色渐变点
linear.addColorStop(0, 'blue');
linear.addColorStop(.25, 'white');
linear.addColorStop(.5, 'purple');
linear.addColorStop(.75, 'red');
linear.addColorStop(1, 'yellow');

context.fillStyle = linear;
context.rect(0, 0, canvas.width / 2, canvas.height);
context.fill();

radial.addColorStop(0, 'blue');
radial.addColorStop(.25, 'white');
radial.addColorStop(.5, 'purple');
radial.addColorStop(.75, 'red');
radial.addColorStop(1, 'yellow');

context.fillStyle = radial;
context.rect(canvas.width / 2, 0, canvas.width / 2, canvas.height);
context.fill();
