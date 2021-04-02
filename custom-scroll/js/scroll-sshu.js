const moveTarget = document.querySelector('.container');
let totalHeight = window.innerHeight - moveTarget.clientHeight;
let request;
let tmpY = 0,accel=0.96;
let totalY = 0;
let txtScale = 1;

const imgTranslateArr = document.querySelectorAll('img[data-animation="translate"]');
const title = document.querySelector('h1');

const onWheel = function(e){
    let delta = e.wheelDelta || -e.deltaY; // -120 || -4
    if(delta < 0){ // 아래방향으로 스크롤
        delta = -12
    }else if(delta > 0){ // 위방향으로 스크롤
        delta = 12
    }
    startAnimate(delta); // -12 || 12
}

const keyDown = function(e){
    const key = e.keyCode;
    if(key === 38 || key === 104 ){
        startAnimate(12)
    }else if(key === 40|| key === 98){
        startAnimate(-12)
    }
}

const startAnimate = function(delta){
    tmpY = delta;  // -12 || 12
    tmpScale = delta;
    window.cancelAnimationFrame(request); // 애니메이션 취소
    animate();
}

const animate = function(){
    request = window.requestAnimationFrame(animate); // 애니메이션 시작
    tmpY *= accel; //  에 accel을 곱해서 점점 멈춤
    totalY += tmpY; // animate가 request되는 동안의 tmpY를 계속 더함
    movePosition(totalY);
    translateImg(totalY);
    scaleTxt();
    
    if(Math.abs(tmpY) < 1) { // 움직임이 둔해지면 애니메이션을 멈춤
        window.cancelAnimationFrame(request);
    }
}

const movePosition = function(y){
    if(y>=0){
        y = totalY = tmpY = 0;
    }
    else if(y<=totalHeight){
        y = totalY = totalHeight;
        tmpY = 0;
    }
    moveTarget.style.transform =`translateY(${Math.round(y)}px)`
}

function translateImg(y){
    imgTranslateArr.forEach(img=>{
        const speed = img.getAttribute('data-animation-speed')
       img.style.transform = `translateY(${y/10*speed}px)`
    })    
}

function scaleTxt(){
    if(txtScale < 1){
        txtScale = 1
    }else if(txtScale >1.5){
        txtScale = 1.5
    }
    txtScale += -tmpScale/1000;
    title.style.transform = `scale(${txtScale})`
}

const resize = function(){
    totalHeight = window.innerHeight - moveTarget.clientHeight;
}


window.addEventListener('wheel',onWheel);
window.addEventListener('keydown',keyDown)
window.addEventListener('resize',resize)

