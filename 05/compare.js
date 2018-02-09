/*
 * @Author: tsingwong 
 * @Date: 2018-02-09 22:51:53 
 * @Last Modified by: tsingwong
 * @Last Modified time: 2018-02-09 23:14:17
 */

let btnSetInterval = document.querySelector('#btnSetInterval'),
    divSetInterval = document.querySelector('#divSetInterval'),
    btnSetTimeout = document.querySelector('#btnSetTimeout'),
    divSetTimeout = document.querySelector('#divSetTimeout'),
    btnRAF = document.querySelector('#btnRAF'),
    divRAF = document.querySelector('#divRAF'),

    timer;
btnSetInterval.onclick = function () {
    clearInterval(timer);
    divSetInterval.style.width = '0';
    timer = setInterval(function () {
        if (parseInt(divSetInterval.style.width) < 500) {
            divSetInterval.style.width = parseInt(divSetInterval.style.width) + 5 + 'px';
            divSetInterval.innerHTML = parseInt(divSetInterval.style.width) / 5 + '%';
        } else {
            clearInterval(timer);
        }
    }, 16);
};

btnSetTimeout.onclick = function(){
    clearTimeout(timer);
    divSetTimeout.style.width = '0';
    timer = setTimeout(function fn(){
        if(parseInt(divSetTimeout.style.width) < 500){
            divSetTimeout.style.width = parseInt(divSetTimeout.style.width) + 5 + 'px';
            divSetTimeout.innerHTML =     parseInt(divSetTimeout.style.width)/5 + '%';
            timer = setTimeout(fn,16);
        }else{
            clearTimeout(timer);
        }    
    },16);
};


btnRAF.onclick = function(){
    divRAF.style.width = '0';
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function fn(){
        if(parseInt(divRAF.style.width) < 500){
            divRAF.style.width = parseInt(divRAF.style.width) + 5 + 'px';
            divRAF.innerHTML =     parseInt(divRAF.style.width)/5 + '%';
            timer = requestAnimationFrame(fn);
        }else{
            cancelAnimationFrame(timer);
        }    
    });
};
