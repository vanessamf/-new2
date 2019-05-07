if(/AppleWebKit.*mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
    if(window.location.href.indexOf("?mobile")<0){
        try{
            if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)){
                //window.location.href="手机页面";
                setActiveStyleSheet("css/components.mobile.css");
                setActiveStyleSheet("css/app.auto.mobile.css");
            }else if(/iPad/i.test(navigator.userAgent)){
                //window.location.href="平板页面";
                setActiveStyleSheet("css/components.css");
                setActiveStyleSheet("css/app.auto.css");
            }else{
                //window.location.href="其他移动端页面";
                setActiveStyleSheet("css/components.mobile.css");
                setActiveStyleSheet("css/app.auto.mobile.css");;
            }
        }catch(e){}
    }
}else {
    //window.location.href="pc端页面";
    setActiveStyleSheet("css/components.css");
    setActiveStyleSheet("css/app.auto.css");
    //setActiveJsSheet("js/pc.js");
}
function setActiveStyleSheet(filename) {
    $("head").append("<link href=" + filename + " rel=stylesheet>");
}
function setActiveJsSheet(filename) {
    $("head").append("<script src=" + filename + "></script>");
}