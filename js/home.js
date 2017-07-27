//补充：先通过id选中外部元素，再通过find(alt+enter)获取其他元素效率会更高。
//刷新回到顶部
window.onload = function () {
    $(document).scrollTop(0);
}
$(function () {
    //首屏滑入动画显示
    (function () {
        //把后面常用到的jq对象先存起来，下次方便获取。
        var $flash = $("#bg").find(".bg1 object"),
            $wrap = $("#wrap"),
            $swp = $wrap.find(".swp");
        setTimeout(function () {$flash.css("opacity",1); },1000);
        $swp.eq(0).animate({left:0,opacity:1},800);
        $swp.eq(1).animate({right:0,opacity:1},800);
        $swp.eq(2).animate({opacity:1,top:80},800);
        $swp.eq(3).animate({opacity:1,top:610},1000);
    })();
    //视频弹窗
    (function () {
        var $wrap = $("#wrap"),
            $btn = $wrap.find(".videoBtn"),
            $video = $wrap.find(".video"),
            $close = $wrap.find("#video .close");
            $btn.click(function () {
                $video.show();
                $(document. body).addClass("noScroll");
            });
            $close.click(function () {
                $video.hide();
                $(document.body).removeClass("noScroll");
            });
    })();
    //新版本情报弹窗
    (function () {
        // 显示隐藏
        var $newinfo = $("#newinfo"),
            $titile = $newinfo.find(".title"),
            $infoListLi = $newinfo.find(".infoList li"),
            $pop = $newinfo.find(".popwindow"),
            $popLi = $pop.find(".content ul li"),
            $popClose = $pop.find(".close"),
            $txt = $pop.find(".content .txt"),
            $btn = $pop.find(".content .btn"),
            txtH = $txt.height(),
            index = 0,
            length = $popLi.length;
        //自定义滚动条
        $txt.each(function () {
            var $mainTxt = $(this).find(".mainTxt"),
                $scroll = $(this).find(".scroll"),
                $bar = $(this).find(".bar"),
                mainH = $mainTxt.height(),
                barH = txtH*txtH/mainH,
                topMax = txtH - barH,
                topMin = 0;
            $bar.height(barH);
            //点击滚动条滑块时触发
            $bar.mousedown(function (e) {
                var sY = e.clientY,
                    sTop = $(this).position().top,
                    $This = $(this),
                    $mainTxt = $(this).parent().siblings();
                $(document).mousemove(function (e) {
                    var nY = e.clientY,
                        top = sTop + nY - sY;
                    top = Math.min(top,topMax);
                    top = Math.max(top,topMin);
                    $This.css("top",top),
                        $mainTxt.css("top",-top*mainH/txtH);
                }).mouseup(function () {
                    $(this).off("mousemove").off("mouseup");
                });
                return false;
            });
            //jq中(本身没有)滚轮事件需要引入插件
            $(this).mousewheel(function (e,d) {
                var top = $bar.position().top;
                if(d<0){//向下滚
                    top += 10;
                }else{//向上滚
                    top-=10;
                }
                top = Math.min(top,topMax);
                top = Math.max(top,topMin);
                $bar.css("top",top);
                $mainTxt.css("top",-top*mainH/txtH);
                return false;
            });
            //点击滚动条跳到点击和内容位置
            $scroll.click(function (e) {
                if(e.target === this){
                    var pY = e.clientY,
                        y = pY - ($(this).offset().top -$(document).scrollTop()),
                        top = $bar.position().top;
                    top = y<top?top-100:top+100;
                    /* if(y < top){
                     top -= 100;
                     }else{
                     top += 100;
                     }*/
                    top = Math.min(top,topMax);
                    top = Math.max(top,topMin);
                    $bar.stop().animate({"top":top},500);
                    $mainTxt.stop().animate({"top":-top*mainH/txtH},500);
                }
            });
        });
        //获取完元素之后让弹窗隐藏
        $pop.hide().css("opacity",1);
        $popLi.hide();
        // 点击弹窗
        $infoListLi.click(function () {
            index = $(this).index();
            $(document.body).addClass("noScroll");
            $pop.show();
            $popLi.eq(index).show().siblings().hide();
        });
        // 关闭弹窗
        $popClose.click(function () {
            $(document.body).removeClass("noScroll");
            $pop.hide();
        });
        // 弹窗层左右按钮
        $btn.click(function () {
            if($(this).index(".content .btn")){
                index++;
                index %= length;
            }else{
                index--;
                if (index<0){
                    index = length-1;
                }
            }
            $popLi.eq(index).show().siblings().hide();
        });
    })();
    //滚轮延迟加载模块
    (function () {
        var $newinfo = $("#newinfo"),
            $title = $newinfo.find(".title"),
            $infoListLi = $newinfo.find(".infoList li"),
            objArr = [];

        init($title,$infoListLi);
        //滚动延迟显示
        $(window).scroll(function () {
            var height = $(document).scrollTop() + $(window).height();
            for (var i = 0,length = objArr.length; i < length; i++) {
                var obj = objArr[i];
                if (!obj.ifShow && height >= obj.oddTop){
                    $(obj).delay($(obj).index()%3*200).animate({
                        top:0,
                        opacity:1
                    },200);
                    obj.ifShow = true;
                }
            }
        });
        //滚动样式初始化
        function init() {
            for (var i = 0,length = arguments.length; i < length; i++) {
                arguments[i].each(function () {
                    this.ifShow = false;
                    this.oddTop = $(this).offset().top;
                    objArr.push(this);
                });
                arguments[i].css({
                    top:100,
                    opacity:0
                });
            }
        }
    })();
    //游戏特色图片切换
    (function () {
        var $game = $("#game"),
            $picLi = $game.find(".pic ul li"),
            $btn = $game.find(".btn p"),
            index = 0,
            length = $picLi.length;
        //点击左右图片
        $picLi.click(function () {
            if($(this).index() !== index){
                index = $(this).index();
                change();
            }
        });
        //点击左右按钮
        $btn.click(function () {
            if($(this).index()){
                index++;
                index %= length;
            }else{
                index--;
                if(index<0) index = length-1;
            }
            change();
        });
        function change() {
            var lIndex = index -1,
                rIndex = index +1;
            if(lIndex<0) lIndex = length-1;
            if(rIndex>=length) rIndex = 0;
            $picLi.removeClass("left mid right");
            $picLi.eq(lIndex).addClass("left");
            $picLi.eq(index).addClass("mid");
            $picLi.eq(rIndex).addClass("right");
        }
    })();
});
