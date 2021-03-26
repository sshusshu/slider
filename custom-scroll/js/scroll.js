const moveTarget = document.querySelector('body');
const totalHeight = moveTarget.clientHeight;
let request;
let vecY = 0,curY = 0,accel=0.96;
let dy,oy = 0;


const onWheel = function(e){
    const delta = e.wheelDelta || -e.deltaY
    startAnimate(delta*0.1)
    //console.log(delta)
}

const startAnimate = function(d){
    vecY = d;
    window.cancelAnimationFrame(request);
    animate();
}

const animate = function(){
    request = window.requestAnimationFrame(animate);
    vecY *= accel;
    oy += vecY;
    movePosition(oy);

    if(Math.abs(vecY) < 1) {
        window.cancelAnimationFrame(request);
        dy = oy;
    }
}

const movePosition = function(y){
    // if(y>=0){
    //     y = dy = oy = vecY = 0;
    // }else if(y<=totalHeight){
    //     y = dy = oy = totalHeight;
    //     vecY = 0;
    // }
    curY = Math.round(y)
    moveTarget.style.transform =`translateY(${curY}px)`
}




const moveSlide = function(){
    request = window.requestAnimationFrame(moveSlide);
    oy += 0.1*(dy - oy);
    movePosition(oy);
    if(Math.abs(dy - oy ) < 0.1) {
        window.cancelAnimationFrame(request);
        oy = dy;
        movePosition(oy);
    }
}

window.addEventListener('wheel',onWheel)
