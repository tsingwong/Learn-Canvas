/*
 * @Author: tsingwong 
 * @Date: 2018-01-29 16:22:40 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-01-29 19:32:20
 */
const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    img = new Image();

img.src = './clx.png';
img.onload = function (e) {
    // 该方法可以将一整张未经压缩的图片绘制到 canvas 上
    // 唯一弊端是必须等到图像加载完毕之后才能对其进行绘制

    // 将整幅画绘制到 canvas 上的指定位置，不进行任何缩放
    // context.drawImage(img, 0, 0);
    // 将图像完整的绘制到 canvas 上，会根据 设置的宽高值缩放
    // context.drawImage(img, 0, 0, canvas.width, canvas.height);
    // 将指定位置和大小的图片绘制到 canvas 上，同样会根据最后两个宽高缩放
    context.drawImage(img, 200, 200, 400, 400, 0, 0, canvas.width, canvas.height);    
};
