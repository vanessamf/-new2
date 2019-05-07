/**
 * Created by chaoyue on 2017/11/1.
 */
/**
 * 一些通用方法
 */
(function(exports) {
    /**
     * 将string字符串转为html对象,默认创一个div填充
     * 因为很常用，所以单独提取出来了
     * @param {String} strHtml 目标字符串
     * @return {HTMLElement} 返回处理好后的html对象,如果字符串非法,返回null
     */
    exports.parseHtml = function(strHtml) {
        if (typeof strHtml !== 'string') {
            return strHtml;
        }
        // 创一个灵活的div
        var i,
            a = document.createElement('div');
        var b = document.createDocumentFragment();

        a.innerHTML = strHtml;

        while ((i = a.firstChild)) {
            b.appendChild(i);
        }

        return b;
    };

    /**
     * 动态添加表格行
     * @param{Object} tab  获得表格
     *  @param{Array} data_arr 需要插入的数据数组
     *  @param{Number} index 指定插入第几条数据
     */
    exports.addTable = function (tab,data_arr,index) {

        var colsNum = tab.rows.item(0).cells.length, //表格的列数
            rownum = tab.rows.length, //表格当前的行数
            tb_name = tab.id;

        tab.insertRow(rownum);

        var i = 0;
        for (var t_item in data_arr[index]) {
            tab.rows[rownum].insertCell(i);//插入列

            if(t_item.indexOf('no') > 0 || t_item.indexOf("name") > 0){
                if(tb_name.indexOf('brand') !== -1){

                    tab.rows[rownum].cells[i].innerHTML = '<a href="data.platform.html?data-type='+rownum+'">'+data_arr[index][t_item]+'</a>'

                }else{

                    tab.rows[rownum].cells[i].innerHTML = '<a href="item.detail.html?data-type='+rownum+'">'+data_arr[index][t_item]+'</a>'
                }
            }else
                tab.rows[rownum].cells[i].innerHTML = data_arr[index][t_item];

            i++;
        }
    };

    /**
     * 将对象渲染到模板
     * @param {String} template 对应的目标
     * @param {Object} obj 目标对象
     * @return {String} 渲染后的模板
     */
    exports.renderTemplate = function(template, obj) {
        return template.replace(/[{]{2}([^}]+)[}]{2}/g, function($0, $1) {
            return obj[$1] || '';
        });
    };


    /**
     * 添加测试数据
     * @param {String,Object} dom 目标dom
     * @param {Boolean} isReset 是否需要重置，下拉刷新的时候需要
     * @param {Number} index
     * @param {Array} arr 需要插入的数据数组
     */
    exports.appendTestData = function(dom, isReset, index,arr) {
        if (typeof dom === 'string') {
            dom = document.querySelector(dom);
        }

        var counterIndex = index || 0,
            count = arr.length;

        if (isReset) {
            dom.innerHTML = '';
        }

        for (var i = 0; i < count; i++) {
            exports.addTable(dom,arr,i)
        }
    };

    /**
     * 绑定监听事件 暂时先用click
     * @param {String} dom 单个dom,或者selector
     * @param {Function} callback 回调函数
     * @param {String} eventName 事件名
     */
    exports.bindEvent = function(dom, callback, eventName) {
        eventName = eventName || 'click';
        if (typeof dom === 'string') {
            // 选择
            dom = document.querySelectorAll(dom);
        }
        if (!dom) {
            return;
        }
        if (dom.length > 0) {
            for (var i = 0, len = dom.length; i < len; i++) {
                dom[i].addEventListener(eventName, callback);
            }
        } else {
            dom.addEventListener(eventName, callback);
        }
    };
})(window.Common = {});