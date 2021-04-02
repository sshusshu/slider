const moveTarget = document.querySelector('body');
const totalHeight = moveTarget.clientHeight;
let request;
let tmpY = 0,accel=0.97;
let totalY = 0;

console.dir(moveTarget)

const onWheel = function(e){
    let delta = e.wheelDelta || -e.deltaY; // -120 || -4
    if(delta < 0){
        delta = -20
    }else if(delta > 0){
        delta = 20
    }
    startAnimate(delta); // -12 || -4
}

const startAnimate = function(delta){
    tmpY = delta;  // -12 || -4
    window.cancelAnimationFrame(request); // 애니메이션 취소
    animate();
}

const animate = function(){
    request = window.requestAnimationFrame(animate); // 애니메이션 시작
    tmpY *= accel; //  -12 || -4 에 accel을 곱해서 점점 멈춤
    totalY += tmpY; // animate가 request되는 동안의 tmpY를 계속 더함
    movePosition(totalY);

    if(Math.abs(tmpY) < 1) { // 움직임이 둔해지면 애니메이션을 멈춤
        window.cancelAnimationFrame(request);
    }
}

const movePosition = function(y){
    //console.log(y)
    if(y>=0){
        y = totalY = tmpY = 0;
    }
    // else if(y<=totalHeight){
    //     y = totalY = totalHeight;
    //     tmpY = 0;
    // }
    moveTarget.style.transform =`translateY(${Math.round(y)}px)`
}




window.addEventListener('wheel',onWheel)
