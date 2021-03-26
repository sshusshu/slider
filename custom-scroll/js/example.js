var swipeUtil = (function ($) {

    var defaults = {
        touchTarget: $('body'),
        moveTarget: $('body'),
        swipeThreshold: 100,
        checkPercent: function () {},
        checkPosX: function () {},
        checkScroll : function() {},
        touchEnd : function() {}
    }

    var swipeUtil = function (spec) {
        var that = {};
        that.settings = $.extend({}, defaults, spec);

        var isTouchStart = false, isTouchMove = false;
        var sx,sy, dx,dy, ox=0,oy = 0;
        var touchTarget = that.settings.touchTarget;
        var moveTarget = that.settings.moveTarget;
        var swipeThreshold = that.settings.swipeThreshold;
        var checkPercent = that.settings.checkPercent;
        var checkPosX = that.settings.checkPosX;
        var checkScroll = that.settings.checkScroll;
        var touchEnd = that.settings.touchEnd;
        var vecX = 0,curX = 0,accel=0.95;
        var rq;
        var winW,winH,totalDistance,scrollLeft=0;
        var lastTouchEnd = 0;
        var isTouchTargetEnd = false;

        var onTouchStart = function (e) {

            if (isTouchStart === true) return;

            window.cancelAFrame(rq);
            var orig = e.originalEvent,
                touchPoints = (typeof orig.changedTouches !== 'undefined') ? orig.changedTouches : [orig];
            var chromePointerEvents = typeof PointerEvent === 'function';
            if (chromePointerEvents) {
                if (orig.pointerId === undefined) {
                    return;
                }
            }
            if (touchPoints.length > 1) {
                e.preventDefault();
                return;
            }

            isTouchStart = true;

            sx = touchPoints[0].pageX; //+ scrollLeft;
            sy = touchPoints[0].pageY;

            dx = ox;

            $(window).on('touchmove MSPointerMove pointermove', onTouchMove);
            $(window).on('touchend MSPointerUp pointerup', onTouchEnd);
            if(_Device.type === 0)$(window).on('pointerup MSPointerCancel pointercancel', onPointerCancel);



        }

        var onTouchMove = function (e) {
            if (isTouchStart) {
                var orig = e.originalEvent,
                    touchPoints = (typeof orig.changedTouches !== 'undefined') ? orig.changedTouches : [orig];

                isTouchMove = true;
                vecX = (touchPoints[0].pageX - sx + ox) - dx;

                dx = touchPoints[0].pageX - sx + ox;


                movePosition(dx);
            }

        }
        var onTouchEnd = function (e) {

            if (isTouchStart) {

                if(isTouchTargetEnd && vecX < 0) {
                    touchEnd();
                    isTouchStart = false;
                }else {
                    ox = dx;

                    startAnimate(vecX);
                }

                var now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    e.preventDefault();
                }
                lastTouchEnd = now;
                $(window).off('touchmove MSPointerMove pointermove', onTouchMove);
                $(window).off('touchend MSPointerUp pointerup', onTouchEnd);
            }
        }
        var onPointerCancel = function () {
            $(window).off('touchmove MSPointerMove pointermove', onTouchMove);
            $(window).off('touchend MSPointerUp pointerup', onTouchEnd);
            $(window).off('pointerup MSPointerCancel pointercancel', onPointerCancel);

            //dx = ox;
        }

        var onWheel = function(){
            event.preventDefault();
            var delta = event.wheelDelta || -event.deltaY;
            console.log(isTouchTargetEnd);
            if(isTouchTargetEnd && delta<0) {
                touchEnd();
            }else {
                startAnimate(delta*0.3);
            }

        }

        var onKeydown = function(e){
            switch(e.keyCode){
                case 37 :
                case 38 :

                    startAnimate(40);
                    break;
                case 39 :
                case 40 :
                    if(isTouchTargetEnd) {
                        touchEnd();
                    }else {
                        startAnimate(-40);
                    }
                    break;
            }
        }

        var onScroll = function(e) {

            scrollLeft = ($(window).scrollLeft()|| $('body').scrollLeft());
            checkScroll(scrollLeft);
        }

        var movePosition = function (vx) {
            var x = vx;

            if(vx >= 0){
                x = dx = ox = vecX = 0;
            }
            else if(vx <= totalDistance ) {
                x = dx = ox = totalDistance;
                vecX = 0;
            }
            curX = Math.round(x);
            moveTarget.css({'transform': 'translateX(' + curX + 'px)'});
            moveTarget.css({'-webkit-transform': 'translateX(' + curX + 'px)'});

            // moveTarget.css({'left': curX + 'px'});

            checkPercent(that.getPercent());
            checkPosX(x);
        };
        var animate = function () {
            rq = window.requestAFrame(animate);
            isTouchStart = false;
            vecX *= accel;
            ox += vecX;
            movePosition(ox);

            if(Math.abs(vecX ) < 1) {
                window.cancelAFrame(rq);
                dx = ox;
            }
        }
        var startAnimate = function(d) {
            vecX = d;
            window.cancelAFrame(rq);
            animate();
        }
        var moveSlide = function() {
            rq = window.requestAFrame(moveSlide);
            ox += 0.1*(dx - ox);g
            movePosition(ox);
            if(Math.abs(dx - ox ) < 0.1) {
                window.cancelAFrame(rq);
                ox = dx;
                movePosition(ox);
            }
        }

        /*================================================== [ method ] ==========================================================*/

        that.init = function () {
            that.addEvent();
            that.resize();
        };
        that.addEvent = function () {
            isTouchStart = false;
            isTouchMove = false;

            touchTarget.on('touchstart MSPointerDown pointerdown', onTouchStart);
            $(window).on('wheel' ,onWheel);
            $(window).on('keydown',onKeydown);
            $(window).on('scroll',onScroll);

            document.documentElement.addEventListener('touchmove', function (event) {
                event.preventDefault();
                if (event.touches.length > 1) {
                    event.preventDefault();
                }
            }, false);
        };
        that.removeEvent = function () {
            window.cancelAFrame(rq);
            touchTarget.off('touchstart MSPointerDown pointerdown', onTouchStart);
            $(window).off('touchmove MSPointerMove pointermove', onTouchMove);
            $(window).off('touchend MSPointerUp pointerup', onTouchEnd);
            $(window).off('pointerup MSPointerCancel pointercancel', onPointerCancel);
            $(window).off('wheel' ,onWheel);
            $(window).off('keydown',onKeydown);
            $(window).off('scroll',onScroll);
        }

        that.gotoSlide = function (pos) {
            dx  = pos;
            window.cancelAFrame(rq);
            moveSlide();

        }

        that.getPercent = function () {
            var percent;
            percent = dx / totalDistance * 100;
            percent = percent ? percent : 0;
            return percent;
        }

        that.setIsTouchTargetEnd = function(boo) {
            isTouchTargetEnd = boo;
        }

        that.resize = function () {
            winW = $(window).width() <= 1280 ? 1280 : $(window).width();
            winH = $(window).height();
            totalDistance = winW - moveTarget.width();
            movePosition(ox);

        }


        that.init();

        return that;
    }

    return swipeUtil;

})(jQuery)

window.requestAFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        // if all else fails, use setTimeout
        function (callback) {
            return window.setTimeout(callback, 1000 / 25); // shoot for 30 fps
        };
})();

// handle multiple browsers for cancelAnimationFrame()
window.cancelAFrame = (function () {
    return window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        function (id) {
            window.clearTimeout(id);
        };
})();
