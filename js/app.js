(function($){
    $.fn.glide = function(options){
        var _default = {
            currentPosion: 0,//当前页面的位置
            pageNow: 1, //当前第几页
            points: null, //小滑点
            pageWidth: 0 //页面宽度
        }
        var _opt = $.extend(_default, options);
        //初始化
        var app = {
            init: function(){
                if(/(window)/i.test(navigator.userAgent)){
                    location.href = 'view/pc.html';
                }
                document.addEventListener('DOMContentLoaded',function(){
                    _opt.points = document.querySelectorAll('.pagenumber div');
                    _opt.pageWidth = window.innerWidth;
                    app.bindTouchEvent();
                    app.setPoints(); //设置小滑点状态
                });
            }(),
            bindTouchEvent: function(){
                var viewport = document.getElementById('viewport');
                var maxWidth = -_opt.pageWidth * (_opt['points'].length-1);
                var startX,startY;
                var moveLength = 0;//手指滑动的距离
                var initialPos = 0;//手指按下时屏幕的位置
                var direction = 'left';//滑动的方向
                var isMove = false; //是否发生滑动
                var startTime = 0; //记录手指按下去的时间
                var isTouchEnd = true;//是否结束滑动
               /* 手指放在屏幕上*/
               document.addEventListener('touchstart', function(e){
                    e.preventDefault();
                    if(e.touches.length == 1){
                        var touch = e.touches[0];
                        startX = touch.pageX;
                        startY = touch.pageY;
                        initialPos = _opt.currentPosion;//本次滑动开始前屏幕的位置
                        viewport.style.webkitTransition = '';//一开始取消过渡css
                        isMove = false; //是否产生滑动
                        startTime = new Date().getTime();
                    }
               });
               /* 开始滑动 */
               document.addEventListener('touchmove', function(e){
                    e.preventDefault();
                    var touch = e.touches[0];
                    var deltaX = touch.pageX - startX;
                    var deltaY = touch.pageY - startY;
                    if(Math.abs(deltaX) > Math.abs(deltaY)){
                        moveLength = deltaX;
                        var translate = initialPos + deltaX;//当前页面需要移动到的位置
                        /*如果translate>0或者translate < maxWidth,则是超出界限不让移动*/
                        if(translate <= 0 && translate >= maxWidth){
                            app.transform.call(viewport, translate);
                            isMove = true; //发生了滑动
                        }
                        direction = deltaX > 0 ? 'right' : 'left';
                    }
               });
               /*结束滑动*/
               document.addEventListener('touchend', function(e){
                    e.preventDefault();
                    var translate = 0; //记录滑动的位置
                    var deltaTime = new Date().getTime() - startTime;
                    /* 发生了滑动 */
                    if(isMove){
                        viewport.style.webkitTransition = '-webkit-transform 0.3s ease';
                        if(deltaTime < 300){ //快速滑动
                            translate = direction == 'left' ? _opt.currentPosion - moveLength - _opt.pageWidth : _opt.currentPosion - moveLength + _opt.pageWidth;
                            //如果最终位置超过边界位置，则停留在边界位置
                            if( translate > 0 ){
                                translate = 0;
                            } else if( translate < maxWidth ){
                                translate = maxWidth;
                            } else {
                                translate = translate;
                            }
                        }else{//慢速滑动
                            if(Math.abs(moveLength) / _opt.pageWidth < 0.5){
                                translate = _opt.currentPosion - moveLength;
                            }else{
                                translate = direction == 'left' ? _opt.currentPosion - moveLength - _opt.pageWidth : _opt.currentPosion - moveLength + _opt.pageWidth;
                                //如果最终位置超过边界位置，则停留在边界位置
                                if( translate > 0 ){
                                    translate = 0;
                                } else if( translate < maxWidth ){
                                    translate = maxWidth;
                                } else {
                                    translate = translate;
                                }
                            }
                        }
                        app.transform.call(viewport, translate);
                        //计算当前的页数
                        _opt.pageNow = Math.round(Math.abs(translate) / _opt.pageWidth) + 1;

                        setTimeout(function(){
                            app.setPoints();
                        },100);
                    }
               });
            },
            transform: function(translate){
                this.style.webkitTransform = 'translate3d('+ translate +'px, 0,0)';
                _opt.currentPosion = translate;
            },
            setPoints:function(){
                $('.pagenumber').find('div').eq(_opt.pageNow-1).addClass('now').siblings('div').removeClass('now');
            }
        }
    }
})(jQuery);