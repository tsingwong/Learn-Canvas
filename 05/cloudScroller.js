/*
 * @Author: tsingwong 
 * @Date: 2018-02-16 18:06:36 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-02-17 23:07:19
 */
let canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d'),
    animateButton = document.querySelector('#animateButton'),
    sky = new Image(),
    tree = new Image(),
    nearTree = new Image(),
    grass = new Image(),
    grass2 = new Image(),

    paused = true,
    lastTime = 0,
    fps = 0,

    skyOffset = 0,
    grassOffset = 0,
    treeOffset = 0,
    nearTreeOffset = 0,

    TREE_VELOCITY = 20,
    FAST_TREE_VELOCITY = 40,
    GRASS_VELOCITY = 75,
    SKY_VELOCITY = 8;

// Functions
function draw() {
    context.save();

    skyOffset = skyOffset < canvas.width ? skyOffset + SKY_VELOCITY / fps : 0;
    grassOffset = grassOffset < canvas.width ? grassOffset + GRASS_VELOCITY / fps : 0;
    treeOffset = treeOffset < canvas.width ? treeOffset + TREE_VELOCITY / fps : 0;
    nearTreeOffset = nearTreeOffset < canvas.width ? nearTreeOffset + FAST_TREE_VELOCITY / fps : 0;
    
    context.save();
    context.translate(-skyOffset, 0);
    context.drawImage(sky, 0, 0);
    context.drawImage(sky, sky.width - 2, 0);
    context.restore();


    context.save();
    context.translate(-grassOffset, 0);
    context.drawImage(grass, 0, context.canvas.height - grass.height);
    context.drawImage(grass, grass.width - 2, context.canvas.height - grass.height);
    context.drawImage(grass2, 0, context.canvas.height - grass2.height);
    context.drawImage(grass2, grass2.width - 2, context.canvas.height - grass2.height);
    context.restore();

    context.save();
    context.translate(-treeOffset, 0);
    context.drawImage(tree, 100, 240);
    context.drawImage(tree, 1100, 240);
    context.drawImage(tree, 400, 240);
    context.drawImage(tree, 1400, 240);
    context.drawImage(tree, 700, 240);
    context.drawImage(tree, 1800, 240);
    context.restore();

    context.save();
    context.translate(-nearTreeOffset, 0);
    context.drawImage(nearTree, 250, 220);
    context.drawImage(nearTree, 1250, 220);
    context.drawImage(nearTree, 800, 220);
    context.drawImage(nearTree, 1800, 220);
    context.restore();

}

function calculateFps(now) {
    let fps = 1000 / (now - lastTime);
    lastTime = now;
    return fps;
}

function animate(now) {
    if (now === undefined) {
        now = + new Date();
    }

    fps = calculateFps(now);

    if (!paused) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        draw();
    }
    window.requestAnimationFrame(animate);
}
    
// Event handlers

animateButton.onclick = function () {
    paused = paused ? false : true;
    if (paused) {
        animateButton.value = 'Animate';
    } else {
        animateButton.value = 'Pause';
        window.requestAnimationFrame(animate);
    }
};

// Initialization

sky.src = './sky.png';
tree.src = './smalltree.png';
nearTree.src = './tree-twotrunks.png';
grass.src = './grass.png';
grass2.src = './grass2.png';
sky.onload = function () {
    draw();
};

