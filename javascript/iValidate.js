(function(w, $){
  "use strict";
  
  /**
    * 
    * 验证组件的消息提示组件
    * 
    **/
  var ivtip_cmpt = {
    
    // ivtip配置项
    config: {
      
      // 位置
      position: {
        
        // tip上中下，左中右显示位置
        at: "bottom right",
        
        // tip和尖角的位置调整
        adjust: {
          tipV: 0, // tip上下调整的位置
          tipH: 0, // tip左右调整的位置
          angleV: 0, // 尖角上下调整的位置
          angleH: 0, // 尖角左右调整的位置
          trslt: 2.3 // canvas绘画移动调整参数
        }
      },
      
      // 尖角宽高，和线宽
      angleSzie: {
        width: 10,
        height: 9.5,
        lineWidth: "auto"
      },
      
      // tip的样式与特效，有两种效果fade和scaleFade
      style: {
        classes: "ivtip-default",
        effect: "scaleFade"
      },
      
      // 内容
      content: "",
      // 是否初始化时，创建Tip
      isInitzCreateTip: false,
      // 是否自动重置位置，以达到在放大缩小页面时tip在正确位置
      autoReposition: true,
      // 是否自动重绘canvas，以达到在放大缩小页面时尖角的分辨率正确
      autoReDraw: true,
      // 延时执行tip显示或隐藏的时间
      tipTimeout: 120,
      // 重置Tip位动画速度
      repTipSpeed: 100,
      //div层级
      zindex: 15000
    },
    
    // 常量
    constants: {
      
      // 前缀
      IVTIP_PREFIX: "ivtip-",
      // 前缀
      IVTIP_CONTENT_PREFIX: "ivtip-content-",
      //基础class样式
      IVTIP_CLASS: "ivtip",
      // 消息内容的class
      IVTIP_CONTENT_CLASS: "ivtip-content",
      // 元素附加属性
      ELEMENT_ATTR_REL: "data-ref",
      
      // tip的位置
      AT_TOP_LEFT: "top left",
      AT_TOP_CENTER: "top center",
      AT_TOP_RIGHT: "top right",
      AT_CENTER_LEFT: "center left",
      AT_CENTER_RIGHT: "center right",
      AT_BOTTOM_LEFT: "bottom left",
      AT_BOTTOM_CENTER: "bottom center",
      AT_BOTTOM_RIGHT: "bottom right",
      
      // 尖角位置偏移量
      ANGLE_OFFSET: 0.5
    },
    
    // 计数器
    ivtip_count: -1,
    
    // 工具
    tools: {
      
      // 得到计算后元素的样式
      getStyles: function(elemt, prop){
        return w.getComputedStyle(elemt)[prop];
      },
    
      // 获取设备的像素比例
      getDevicePixelRatio: function(){
        return w.devicePixelRatio;
      }
    
    },
    
    // 制造tip
    makeTip: function($element, ivtip_config, ivtip_count){
      
      // 创建div元素至$element下，以及设置属性，class，以及样式的初始值
      var $div0 = $("<div/>");
      $div0.attr("id", ivtip_config.refId);
      $div0.addClass(this.constants.IVTIP_CLASS + " " + ivtip_config.style.classes);
      $div0.css("z-index", ivtip_config.zindex);
      $element.after($div0);
      
      // canvas div0_0共用样式
      var cssText = "background-color: transparent !important; border: 0px none !important;" + "width: " + ivtip_config.angleSzie.width + "px; height: " + ivtip_config.angleSzie.height + "px;";
      
      // 创建用于显示尖角div定位的div
      var $div0_0 = $("<div/>");
      $div0_0.addClass(this.constants.IVTIP_CLASS);
      $div0_0.css("cssText", cssText);
      $div0_0.appendTo($div0);
      
      // 创建消息内容div
      var $div0_1 = $("<div/>");
      $div0_1.attr("id", this.constants.IVTIP_CONTENT_PREFIX + ivtip_count);
      $div0_1.addClass(this.constants.IVTIP_CONTENT_CLASS);
      $div0_1.html(ivtip_config.content);
      $div0_1.appendTo($div0);
      
      // 创建canvas，绘制尖角
      var $canvas = $("<canvas/>");
      $canvas.addClass(this.constants.IVTIP_CLASS);
      $canvas.css("cssText", cssText);
      $canvas.appendTo($div0_0);
      
      // 创建返回tip元素的jquery对象
      var tipObj = w.Object.create(null);
      tipObj.$div0 = $div0;
      tipObj.$div0_0 = $div0_0;
      tipObj.$div0_1 = $div0_1;
      tipObj.$canvas = $canvas;
      
      return tipObj;
    },
    
    // 获取tip位置，其尖角的位置及绘制尖角坐标
    getTipPosition: function($element, div0, ivtip_config, a_l_w){
      
      // 创建返回的tip元素位置对象
      var tipPosition = w.Object.create(null);
      // tip外层div top定位
      tipPosition.div0_top = "0px";
      // tip外层div left定位
      tipPosition.div0_left = "0px";
      // tip内层div top定位（尖角定位）
      tipPosition.div0_0_top = "0px";
      // tip内层div left定位（尖角定位）
      tipPosition.div0_0_left = "0px";
      // 绘制尖角的坐标
      tipPosition.coord_mt_x = 0;
      tipPosition.coord_mt_y = 0;
      tipPosition.coord_lt0_x = 0;
      tipPosition.coord_lt0_y = 0;
      tipPosition.coord_lt1_x = 0;
      tipPosition.coord_lt1_y = 0;
      // 移动其中尖角其中一个填充色的坐标
      tipPosition.coord_trslt_x = 0;
      tipPosition.coord_trslt_y = 0;
      
      // tip div元素的尺寸及位置信息
      var div0_size = div0.getBoundingClientRect();
      
      // 元素在文档中的偏移量
      var elemt_position = $element.position();
      
      // 被初始化元素在文档中的尺寸及位置信息
      var elem_p = $element[0].getBoundingClientRect();
      
      // 被初始化元素在文档中的尺寸及位置信息
      var elemt_height = elem_p.height;
      
      // 被初始化元素的宽度
      var elemt_width = elem_p.width;
      
      // tip的的调整参数
      var c_p_adjust = ivtip_config.position.adjust;
      
      var angleSzie = ivtip_config.angleSzie;
      
      // 尖角的宽度
      var a_w = angleSzie.width;
      
      // 尖角的高度
      var a_h = angleSzie.height;
      
      // 根据tip配置的位置，给tip不同坐标
      switch(ivtip_config.position.at){
        case this.constants.AT_BOTTOM_RIGHT:
          tipPosition.div0_top = elemt_position.top + elemt_height + a_h + c_p_adjust.tipV;
          tipPosition.div0_left = elemt_position.left + elemt_width - a_w + c_p_adjust.tipH;
          tipPosition.div0_0_top = -a_h + this.constants.ANGLE_OFFSET + c_p_adjust.angleV;
          tipPosition.div0_0_left = a_w + c_p_adjust.angleH;
          tipPosition.coord_mt_y = a_h - a_l_w;
          tipPosition.coord_lt1_x = a_w;
          tipPosition.coord_lt1_y = a_h - a_l_w;
          tipPosition.coord_trslt_x = a_l_w;
          tipPosition.coord_trslt_y = a_l_w * c_p_adjust.trslt;
          break;
        case this.constants.AT_CENTER_RIGHT:
          tipPosition.div0_top = elemt_position.top + elemt_height / 2 - div0_size.height / 2 + c_p_adjust.tipV;
          tipPosition.div0_left = elemt_position.left + elemt_width + a_w + c_p_adjust.tipH;
          tipPosition.div0_0_top = div0_size.height / 2 - a_h / 2 + c_p_adjust.angleV;
          tipPosition.div0_0_left = -a_w + this.constants.ANGLE_OFFSET + c_p_adjust.angleH;
          tipPosition.coord_mt_x = a_w - a_l_w;
          tipPosition.coord_lt0_y = a_h / 2;
          tipPosition.coord_lt1_x = a_w - a_l_w;
          tipPosition.coord_lt1_y = a_h;
          tipPosition.coord_trslt_x = a_l_w * c_p_adjust.trslt;
          break;
        case this.constants.AT_BOTTOM_CENTER:
          tipPosition.div0_top = elemt_position.top + elemt_height + a_h + c_p_adjust.tipV;
          tipPosition.div0_left = elemt_position.left + elemt_width / 2 - div0_size.width / 2 + c_p_adjust.tipH;
          tipPosition.div0_0_top = -a_h + this.constants.ANGLE_OFFSET + c_p_adjust.angleV;
          tipPosition.div0_0_left = div0_size.width / 2 - a_w / 2 + c_p_adjust.angleH;
          tipPosition.coord_mt_y = a_h - a_l_w;
          tipPosition.coord_lt0_x = a_w / 2;
          tipPosition.coord_lt1_x = a_w;
          tipPosition.coord_lt1_y = a_h - a_l_w;
          tipPosition.coord_trslt_y = a_l_w * c_p_adjust.trslt; 
          break;
        case this.constants.AT_BOTTOM_LEFT:
          tipPosition.div0_top = elemt_position.top + elemt_height + a_h + c_p_adjust.tipV;
          tipPosition.div0_left = elemt_position.left - div0_size.width + a_w + c_p_adjust.tipH;
          tipPosition.div0_0_top = -a_h +  this.constants.ANGLE_OFFSET + c_p_adjust.angleV;
          tipPosition.div0_0_left = div0_size.width - a_w * 2 + c_p_adjust.angleH;
          tipPosition.coord_mt_y = a_h - a_l_w;
          tipPosition.coord_lt0_x = a_w;
          tipPosition.coord_lt1_x = a_w;
          tipPosition.coord_lt1_y = a_h - a_l_w;
          tipPosition.coord_trslt_x = -a_l_w;
          tipPosition.coord_trslt_y = a_l_w * c_p_adjust.trslt;
          break;
        case this.constants.AT_CENTER_LEFT:
          tipPosition.div0_top = elemt_position.top + elemt_height / 2 - div0_size.height / 2 + c_p_adjust.tipV;
          tipPosition.div0_left = elemt_position.left - div0_size.width - a_w + c_p_adjust.tipH;
          tipPosition.div0_0_top = div0_size.height / 2 - a_h / 2 + c_p_adjust.angleV;
          tipPosition.div0_0_left = div0_size.width - this.constants.ANGLE_OFFSET - parseFloat(this.tools.getStyles(div0, "border-left-width")) - parseFloat(this.tools.getStyles(div0, "border-right-width")) + c_p_adjust.angleH;
          tipPosition.coord_mt_x = a_l_w;
          tipPosition.coord_lt0_x = a_w;
          tipPosition.coord_lt0_y = a_h / 2;
          tipPosition.coord_lt1_x = a_l_w;
          tipPosition.coord_lt1_y = a_h;
          tipPosition.coord_trslt_x = -a_l_w * c_p_adjust.trslt;
          break;
        case this.constants.AT_TOP_LEFT:
          tipPosition.div0_top = elemt_position.top - div0_size.height - a_h + c_p_adjust.tipV;
          tipPosition.div0_left = elemt_position.left - div0_size.width + a_w + c_p_adjust.tipH;
          tipPosition.div0_0_top = div0_size.height - this.constants.ANGLE_OFFSET - parseFloat(this.tools.getStyles(div0, "border-top-width")) - parseFloat(this.tools.getStyles(div0, "border-bottom-width")) + c_p_adjust.angleV;
          tipPosition.div0_0_left = div0_size.width - a_w * 2 + c_p_adjust.angleH;
          tipPosition.coord_mt_y = a_l_w;
          tipPosition.coord_lt0_x = a_w;
          tipPosition.coord_lt0_y = a_h;
          tipPosition.coord_lt1_x = a_w;
          tipPosition.coord_lt1_y = a_l_w;
          tipPosition.coord_trslt_x = -a_l_w;
          tipPosition.coord_trslt_y = -a_l_w * c_p_adjust.trslt;
          break;
        case this.constants.AT_TOP_CENTER:
          tipPosition.div0_top = elemt_position.top - div0_size.height - a_h + c_p_adjust.tipV;
          tipPosition.div0_left = elemt_position.left + elemt_width / 2 - div0_size.width / 2 + c_p_adjust.tipH;
          tipPosition.div0_0_top = div0_size.height - this.constants.ANGLE_OFFSET - parseFloat(this.tools.getStyles(div0, "border-top-width")) - parseFloat(this.tools.getStyles(div0, "border-bottom-width")) + c_p_adjust.angleV;
          tipPosition.div0_0_left = div0_size.width / 2 - a_w / 2 + c_p_adjust.angleH;
          tipPosition.coord_mt_y = a_l_w;
          tipPosition.coord_lt0_x = a_w / 2;
          tipPosition.coord_lt0_y = a_h;
          tipPosition.coord_lt1_x = a_w;
          tipPosition.coord_lt1_y = a_l_w;
          tipPosition.coord_trslt_y = -a_l_w * c_p_adjust.trslt;
          break;
        case this.constants.AT_TOP_RIGHT:
          tipPosition.div0_top = elemt_position.top - div0_size.height - a_h + c_p_adjust.tipV;
          tipPosition.div0_left = elemt_position.left + elemt_width - a_w + c_p_adjust.tipH;
          tipPosition.div0_0_top = div0_size.height - this.constants.ANGLE_OFFSET - parseFloat(this.tools.getStyles(div0, "border-top-width")) - parseFloat(this.tools.getStyles(div0, "border-bottom-width")) + c_p_adjust.angleV;
          tipPosition.div0_0_left = a_w + c_p_adjust.angleH;
          tipPosition.coord_mt_y = a_l_w;
          tipPosition.coord_lt0_y = a_h;
          tipPosition.coord_lt1_x = a_w;
          tipPosition.coord_lt1_y = a_l_w;
          tipPosition.coord_trslt_x = a_l_w;
          tipPosition.coord_trslt_y = -a_l_w * c_p_adjust.trslt;
          break;
      }
      
      return tipPosition;
    },
  
    // 设置tip位置，其尖角的位置及绘制尖角坐标
    setTipPosition: function(div0, div0_0, canvas, angleSzie, lineWidth, tipPosition){
      //设置tip的位置
      div0.style.cssText += ("left: " + tipPosition.div0_left + "px; top: " + tipPosition.div0_top + "px;");
      div0_0.style.cssText += ("left: " + tipPosition.div0_0_left + "px; top: " + tipPosition.div0_0_top + "px;");
      // 开始绘制canvas
      this.drawCanvas(canvas, angleSzie, lineWidth, this.tools.getStyles(div0, "border-top-color"), this.tools.getStyles(div0, "background-color"), tipPosition, this.tools.getDevicePixelRatio());
    },
    
    // 绘制canvas
    drawCanvas: function(canvas, angleSzie, lineWidth, color0, color1, drawCoord, DPR){
      
      // 当编写为0不绘制canvas
      if(lineWidth <= 0){
        return;
      }
      
      // 创建画笔，开始绘制
      var context = canvas.getContext("2d");
      
      // 设置画布大小
      canvas.width = angleSzie.width * DPR;
      canvas.height = angleSzie.height * DPR;
      
      // 画笔线宽度
      context.lineWidth = lineWidth;
      // 开启绘制路线
      context.beginPath();
      // 画笔移动至绘画的起始位置
      context.moveTo(drawCoord.coord_mt_x * DPR, drawCoord.coord_mt_y * DPR);
      // 从画笔的起始位置开始绘制参数所示的结束位置
      context.lineTo(drawCoord.coord_lt0_x * DPR, drawCoord.coord_lt0_y * DPR);
      // 从画笔上一个结束位置开始绘制参数所示的结束位置
      context.lineTo(drawCoord.coord_lt1_x * DPR, drawCoord.coord_lt1_y * DPR);
      // 闭合绘制路线
      context.closePath();
      // 绘制位置的填充色
      context.fillStyle = color0;
      // 填充绘制区域的颜色
      context.fill();
      
      // 移动下一次绘制的位置，再次绘制
      context.translate(drawCoord.coord_trslt_x * DPR, drawCoord.coord_trslt_y * DPR);
      context.beginPath();
      context.moveTo(drawCoord.coord_mt_x * DPR, drawCoord.coord_mt_y * DPR);
      context.lineTo(drawCoord.coord_lt0_x * DPR, drawCoord.coord_lt0_y * DPR);
      context.lineTo(drawCoord.coord_lt1_x * DPR, drawCoord.coord_lt1_y * DPR);
      context.closePath();
      context.fillStyle = color1;
      context.fill();
    },
    
    // 创建tip，包括div，位置，尖角的创建与设置
    createTip: function($element, ivtip_config, ivtip_count){
      // 创建tip对象，并返回
      var tipObj = this.makeTip($element, ivtip_config, ivtip_count);
      
      var lineWidth = null;
      // 当不存绘制canvas线宽在宽度，取边线的宽度
      if(ivtip_config.angleSzie.lineWidth === "auto"){
        lineWidth = parseFloat(this.tools.getStyles(tipObj.$div0[0], "border-top-width"));
      }else{
        lineWidth = ivtip_config.angleSzie.lineWidth;
      }
      // 获取tip的位置并返回
      var tipPosition = this.getTipPosition($element, tipObj.$div0[0], ivtip_config, lineWidth);
      tipObj.$div0.hide();
      
      
      // 设置tip以及其尖角的位置
      this.setTipPosition(tipObj.$div0[0], tipObj.$div0_0[0], tipObj.$canvas[0], ivtip_config.angleSzie, lineWidth, tipPosition);
      tipPosition = null;
      return tipObj;
    },
    
    // 重置tip位置
    reposition: function($element, tipObj, ivtip_config){
      
      var lineWidth = null;
      var $div0 = tipObj.$div0;
      var div0 = $div0[0];
      
      // 判断tip是否隐藏
      var isTipHidden = $div0.is(":hidden");
      
      if(isTipHidden){
        // 为了显示计算tip的长宽高需要显示元素，但实际在页面中不显示
        $div0.css("visibility", "hidden");
        $div0.show();
      }
      
      // 当不存绘制canvas线宽在宽度，取边线的宽度
      if(ivtip_config.angleSzie.lineWidth === "auto"){
        lineWidth = parseFloat(this.tools.getStyles(div0, "border-top-width"));
      }else{
        lineWidth = ivtip_config.angleSzie.lineWidth;
      }
      
      var tipPosition = this.getTipPosition($element, div0, ivtip_config, lineWidth);
      
      
      if(isTipHidden){
        // 计算完成后移除visibility的hidden值，并真正隐藏tip
        $div0.css("visibility", "");
        $div0.hide();
      }
      
      tipObj.$div0.animate({left: tipPosition.div0_left + "px", top: tipPosition.div0_top + "px"}, ivtip_config.repTipSpeed);
      tipObj.$div0_0.animate({left: tipPosition.div0_0_left + "px", top: tipPosition.div0_0_top + "px"}, ivtip_config.repTipSpeed);
      
      if(ivtip_config.autoReDraw){
        this.drawCanvas(tipObj.$canvas[0], ivtip_config.angleSzie, lineWidth, this.tools.getStyles(div0, "border-top-color"), this.tools.getStyles(div0, "background-color"), tipPosition, this.tools.getDevicePixelRatio());
      }
    },
    
    // 使用的api
    api: function(obj){
      
      var api = w.Object.create(null);
      
      // 创建tip
      obj.createTip = (function(obj, _this){
        return function(){
          return _this.createTip(obj.$element, obj.ivtip_config, obj.ivtip_count);
        }
      })(obj, this);
      
      api.getRefId = function(){
        return obj.ivtip_config.refId;
      };
      
      api.reposition = (function(obj, _this){
        return function(){
          var tipObj = obj.tipObj;
          if(!tipObj.$div0){
            return;
          }
          _this.reposition(obj.$element, tipObj, obj.ivtip_config);
        }
      })(obj, this);
      
      api.show = function(){
        var _obj = obj;
        var $tip = _obj.tipObj.$div0;
        
        var effect = _obj.ivtip_config.style.effect;
        if(!$tip){
          _obj.tipObj = _obj.createTip();
          $tip = _obj.tipObj.$div0;
        }
        
        if(effect){
          var effect_class = "ivtip-" + effect + "In";
          
          if($tip.is(":hidden")){
            $tip.addClass(effect_class);
            $tip.show();
            w.setTimeout(function(){
              $tip.removeClass(effect_class);
            }, _obj.ivtip_config.tipTimeout);
          }
          
        }else{
          if($tip.is(":hidden")){
            $tip.show();
          }
        }
      };
      
      api.hide = function(){
        var _obj = obj;
        var $tip = _obj.tipObj.$div0;
        var effect = _obj.ivtip_config.style.effect;
        if(!$tip){
          _obj.tipObj = _obj.createTip();
          $tip = _obj.tipObj.$div0;
        }
        
        if(effect){
          var effect_class = "ivtip-" + effect + "Out";
          if($tip.is(":visible")){
            $tip.addClass(effect_class);
            w.setTimeout(function(){
              /*
               * 由于定时执行特效的原因，快速同时触发show和hide时会发生消息无法显示，
               * 需根据诸多判断，才能解决。
               * 该定时执行只是为了特效的效果也可以不使用特效。
               */
              if(_obj.$element){
                var iValidateObj = _obj.$element[0].iValidateObj;
                if(!_obj.$element.hasClass(iValidate.constants.VALID_CLASS.NO_PASS) || (!iValidateObj.isMouse && !iValidateObj.isFocus && !iValidateObj.isValidFuncTrigger)){
                  $tip.hide();
                }
              }
              $tip.removeClass(effect_class);
            }, _obj.ivtip_config.tipTimeout);
          }
        }else{
          if($tip.is(":visible")){
            $tip.hide();
          }
        }
      };
      
      api.setContent = function(text){
        var _obj = obj;
        var $content = _obj.tipObj.$div0_1;
        if(!$content){
          _obj.ivtip_config.content = text;
        }else{
          $content.html(_obj.ivtip_config.content = text);
        }
      };
      
      api.destroy = function(){
        var _obj = obj;
        var $element = _obj.$element;
        var $tip = _obj.tipObj.$div0;
        var refId = _obj.ivtip_config.refId;
        if($tip){
          $tip.remove();
        }
        
        $element.removeAttr(_obj.constants.ELEMENT_ATTR_REL);
        _obj.$element[0].ivtip_api = null;
        delete _obj.$element[0].ivtip_api;
        
        if(w._ivtip_rep[refId]){
          w._ivtip_rep[refId] = null;
          delete w._ivtip_rep[refId];
        }
        
        for(var prop in _obj){
          _obj[prop] = null;
          delete _obj[prop];
        }
        obj = null;
        for(var prop in this){
          this[prop] = null;
          delete this[prop];
        }
      };
      return api;
    },
    
    init: function($element, config){
      
      // 根据默认的配置，新创建一份给验证元素
      var ivtip_config = w.Object.create(null);
      $.extend(true, ivtip_config, this.config);
      
      // 自定义配置覆盖默认配置
      if(config && typeof config === "object"){
        $.extend(true, ivtip_config, config);
      }
      
      ivtip_config.refId = this.constants.IVTIP_PREFIX + (++this.ivtip_count);
      $element.attr(this.constants.ELEMENT_ATTR_REL, ivtip_config.refId);
      
      // api中使用的对象
      var obj = w.Object.create(null);
      obj.ivtip_config = ivtip_config;
      obj.constants = this.constants;
      obj.tools = this.tools;
      obj.$element = $element;
      obj.ivtip_count = this.ivtip_count;
      
      // 判断初始化时，是否创建tip
      if(ivtip_config.isInitzCreateTip){
        obj.tipObj = this.createTip($element, ivtip_config, this.ivtip_count);
      }else{
        obj.tipObj = w.Object.create(null);
      }
      // 返回当前对象的api
      var api = this.api(obj);
      //$element[0].iv_cmpt_api = api;
      // 需要自动重置位置的tip把方法放入全局对象中
      if(ivtip_config.autoReposition){
        w._ivtip_rep[ivtip_config.refId] = api.reposition;
      }
      obj = null;
      return api;
    }
  };
  
  // 创建需要自动重置位置的集合对象
  w._ivtip_rep = w.Object.create(null);
  
  // 自动重置位置
  $(w).on("resize", function(){
    var _repObj = w._ivtip_rep;
    for(var refId in _repObj){
      _repObj[refId]();
    }
  });
  
  // 只暴露ivtip_cmpt的init方法
  /*w.ivtip_cmpt = w.Object.create(null);
  w.ivtip_cmpt.init = (function(_this){
    return function($element, config){_this.init($element, config);}})(ivtip_cmpt);*/
  
  // 只拿到选择器查到的第一个元素的ivtip的api
  /*$.fn.getIvtipApi = function(){
    return this[0].ivtip_api;
  };*/
  
  /**==============================================================**/
  
  
  
  /**
    * 
    * 验证组件
    * 
    **/
  var iValidate = {
   
    // iValidate消息显示组件
    iv_cmpt: ivtip_cmpt,
    
    // 常量
    constants: {
      
      // 验证类型
      VALID_TYPES: ["required", "length", "numRange", "regTypes", "supplyRules"],
      
      VALID_CLASS: {"BOX": "ivalidate-box", "NORMAL": "ivalidate-normal", "PASS": "ivalidate-pass", "NO_PASS": "ivalidate-nopass", "DISABLED": "ivalidate-disabled"}
      
    },
    
    // 正则验证需要的对象
    regTypeObj: null,
    
    // 补充的显示内容变量
    supplyContentText: "",
    
    // 工具
    tools: {
      
      // 如果存在ivalidate-hidden，ivalidate-disabled则不做验证
      isValidate: function($element, _this){
        return !$element.prop("disabled");
      }
    
    },
    
    // 绑定验证事件
    bindValidEvent: function($element){
      
      var _this = this;
      
      var iValidateObj = $element[0].iValidateObj;
      
      // 验证事件
      var validEvent = {
        
        focus: function(){
          
          iValidateObj.isFocus = true;
          iValidateObj.isValidFuncTrigger = false;
          
          // 当存在某些class时不验证
          if(!_this.tools.isValidate($element, _this)){
            return;
          }
          
          // 当鼠标不经过元素，继续验证操作，通过验证后触发
          if(!iValidateObj.isMouse && _this.dealValid($element)){
            $element.addClass(_this.constants.VALID_CLASS.PASS);
            $element.removeClass(_this.constants.VALID_CLASS.NORMAL);
          }
        },
        
        blur: function(){
          
          iValidateObj.isFocus = false;
          iValidateObj.isValidFuncTrigger = false;
          
          // 当存在某些class时不验证
          if(!_this.tools.isValidate($element, _this)){
            return;
          }
          
          if(!iValidateObj.isMouse){
            if(_this.dealValid($element)){
              $element.addClass(_this.constants.VALID_CLASS.NORMAL);
              $element.removeClass(_this.constants.VALID_CLASS.PASS);
            }else{
              _this.hideMsg($element);
            }
          }
        },
        
        mouseenter: function(){
          
          iValidateObj.isMouse = true;
          iValidateObj.isValidFuncTrigger = false;
          
          // 当存在某些class时不验证
          if(!_this.tools.isValidate($element, _this)){
            return;
          }
          
          // 焦点不在元素上触发
          if(!iValidateObj.isFocus && _this.dealValid($element)){
            $element.addClass(_this.constants.VALID_CLASS.PASS);
            $element.removeClass(_this.constants.VALID_CLASS.NORMAL);
          }
        },
        
        mouseleave: function(){
          
          iValidateObj.isMouse = false;
          iValidateObj.isValidFuncTrigger = false;
          
          // 当存在某些class时不验证
          if(!_this.tools.isValidate($element, _this)){
            return;
          }
          
          // 焦点不在元素上触发
          if(!iValidateObj.isFocus){
            if(_this.dealValid($element)){
              $element.addClass(_this.constants.VALID_CLASS.NORMAL);
              $element.removeClass(_this.constants.VALID_CLASS.PASS);
            }else{
              _this.hideMsg($element);
            }
          }
        },
        
        input: function(){
          
          iValidateObj.isValidFuncTrigger = false;
          
          // 当存在某些class时不验证
          if(!_this.tools.isValidate($element, _this)){
            return;
          }
          
          if(_this.dealValid($element)){
            $element.addClass(_this.constants.VALID_CLASS.PASS);
            $element.removeClass(_this.constants.VALID_CLASS.NORMAL);
          }
        }
      };
      // 绑定验证触发事件
      $element.on(validEvent);
    },
    
    // 处理验证，isImdValid参数只对扩展验证有效
    dealValid: function($element, isImdValid){
      
      var iValidateObj = $element[0].iValidateObj;
      
      var data_options = iValidateObj.data_options;
      
      // 循环处理需要验证项
      for(var key in data_options){
        
        var vFunc = this.ruleObj[key];
        
        // 当存在该验证方法
        if(typeof vFunc == "function" && ($element.prop("type").toLowerCase() == "text" || $element.prop("type").toLowerCase() == "password" || $element.prop("tagName").toLowerCase() == "textarea")){
          
          // 验证返回的值为false，说明此次验证未通过
          if(!(iValidateObj.validStatus = vFunc($element, data_options[key], this))){
            
            // 设置消息内容
            this.setMsg(key, iValidateObj.api, data_options[key], iValidateObj.contentText);
            
            // 显示消息提醒
            this.showMsg($element);
            return false;
          }
          
        // 存在补充验证时执行
        }else if(this.constants.VALID_TYPES[4] == key){
          
          var sFunc = null;
          
          var validOption = data_options[key];
          
          /* isImdValid表示通过api内部方法调用时给个参数，一定为true；
           * validOption.isImdValid表示扩展验证当输入内容时是否立即验证；
           */
          if(iValidateObj.supplyRuleObj.isImdValid === false && isImdValid !== true){
            break;
          }
          
          // 当时一个元素有多个补充验证，且为数组的形式传入时
          if($.isArray(validOption)){
            for(var i = 0, il = validOption.length; i < il; i++){
              sFunc = iValidateObj.supplyRuleObj[validOption[i]];
              // 当存在补充验证
              if(typeof sFunc == "function"){
                
                // 验证返回的值为false，说明此次验证未通过
                if(!(iValidateObj.validStatus = sFunc())){
                  
                  // 显示消息提醒
                  this.showMsg($element);
                  return false;
                }
              }else{
                console.error("不存在“" + validOption[i] + "”的验证规则！！！");
                return false;
              }
            }
            
          // 当是单个验证
          }else{
            
            sFunc = iValidateObj.supplyRuleObj[validOption];
            
            if(typeof sFunc == "function"){
              
              // 验证返回的值为false，说明此次验证未通过
              if(!(iValidateObj.validStatus = sFunc())){
                
                // 显示消息提醒
                this.showMsg($element);
                return false;
              }
            }else{
              console.error("不存在“" + validOption + "”的验证规则！！！");
              return false;
            }
          }
        }else{
          console.error("不存在或不允许“" + key + "”的验证规则！！！");
          return false;
        }
      }
      
      // 执行到此处说明验证都通过了，隐藏消息提示
      this.hideMsg($element);
      return true;
    },
    
    // 验证规则
    ruleObj: {
      
      // 必填验证
      required: function($element, validOption){
        if(validOption === true){
          if($element.val().length != 0){
            return true;
          }
        }else{
          return true;
        }
        return false;
      },
      
      // 长度验证
      length: function($element, validOption){
        var length = $element.val().length;
        if(length >= validOption[0] && length <= validOption[1]){
          return true;
        }
        return false;
      },
      
      // 数字范围验证
      numRange: function($element, validOption, _this){
        
        var num = $element.val();
        
        // 重置内容
        _this.supplyContentText = "";
        
        if(num != ""){
          
          // 判断内是否存在空格
          if(num.search(/\s+/g) != -1){
            _this.supplyContentText = "该项不能存在空格！";
            return false;
          }
          
          // 判断内容是否为数字
          if(!/(^(-[1-9]|[1-9])+[0-9]*$)|(^(-[1-9]|[1-9])+([0-9])*\.[0-9]+$)|(^(-0|0)\.[0-9]+$)|(^(-0|0)$)/.test(num)){
            _this.supplyContentText = "该项只能填入数字！";
             return false;
          }
          
          // 输入的数字小数点位置
          var numDP = num.indexOf(".");
          
          // 判断小数点后位数，当String(validOption[2]).indexOf(".")不为0时，说明页面中限制小数点的值没有加引号或写了不争取的格式
          if(validOption[2] && String(validOption[2]).indexOf(".") == 0 && numDP != -1){
            
            var vDP = validOption[2].substring(1, 2);
            if(vDP < num.substring(numDP + 1).length){
              _this.supplyContentText = "小数点后只能有" + vDP + "位！";
              return false;
            }
            
          }else if(numDP != -1){
            _this.supplyContentText = "该项只能填入整数！";
            return false;
          }
          
          // 判断内容是否在区间内
          if(+num < +validOption[0] || +num > +validOption[1]){
            return false;
          }
        }
        return true;
      },
      
      // 正则验证
      regTypes: function($element, validOption, _this){
        
        var elemtContent = $element.val();
        
        // 如果没有内容，返回true
        if(elemtContent.length == 0){
          return true;
        }
        
        var regExpObj = null;
        
        // 当为数组是，可能有多个复合正则验证
        if($.isArray(validOption)){
          
          for(var i = 0, il = validOption.length; i < il; i++){
            regExpObj = _this.regTypeObj[validOption[i]];
            // 多个正则验证
            if(regExpObj.regExp.test(elemtContent)){
              continue;
            }else{
              _this.supplyContentText = regExpObj.contentText;
              return false;
            }
          }
          return true;
        }else{
          regExpObj = _this.regTypeObj[validOption];
          if(regExpObj.regExp.test(elemtContent)){
            return true;
          }else{
            _this.supplyContentText = regExpObj.contentText;
            return false;
          }
        }
      }
    },
    
    // 设置消息内容，其中参数contentText优先级最高，其次supplyContentText，最后是通过validOption的值组合的消息内容
    setMsg: function(vaildType, api, validOption, contentText){
      if(!contentText){
        switch(vaildType){
          case this.constants.VALID_TYPES[0]:
            api.setContent("该项为必填！");
            break;
          case this.constants.VALID_TYPES[1]:
            api.setContent("内容长度应在" + validOption[0] + "~" + validOption[1] + "个字符！");
            break;
          case this.constants.VALID_TYPES[2]:
            var contentText = this.supplyContentText;
            if(!contentText){
              contentText = "数字范围应在" + validOption[0] + "~" + validOption[1] + "区间！";
            }
            api.setContent(contentText);
            break;
          case this.constants.VALID_TYPES[3]:
            api.setContent(this.supplyContentText);
            break;
          default:
            // 没有以上验证类型消息设置为空串
            api.setContent("");
        }
      }else{
        api.setContent(contentText);
      }
    },
    
    // 显示消息提醒
    showMsg: function($element){
      var iValidateObj = $element[0].iValidateObj;
      if(!iValidateObj.validStatus){
        iValidateObj.api.show();
        $element.addClass(this.constants.VALID_CLASS.NO_PASS);
        $element.removeClass(this.constants.VALID_CLASS.NORMAL);
        $element.removeClass(this.constants.VALID_CLASS.PASS);
      }
    },
    
    // 隐藏消息提醒
    hideMsg: function($element){
      var iValidateObj = $element[0].iValidateObj;
      if(iValidateObj.validStatus){
        $element.removeClass(this.constants.VALID_CLASS.NO_PASS);
      }
      iValidateObj.api.hide();
    },
    
    // 初始化
    init: function(element, ivtip_config){
      
      if(!element){
        return;
      }
      
      // dom对象转为jquery对象
      var $element = $(element);
      
      // 获取元素的验证选项
      var data_options = $element.attr("data-validate-options");
      
      // 当存在验证选项，才继续初始化
      if(data_options && (data_options = data_options.replace(/\s/g, ""))){
        
        // 装换为js对象
        data_options = (new Function("return " + "{" + data_options + "}"))();
        
        // 判断data_options是否为js对象
        if(typeof data_options == "object"){
          
          // 添加输入项初始样式
          $element.addClass(this.constants.VALID_CLASS.BOX + " " + this.constants.VALID_CLASS.NORMAL);
          
          // 设置iValidateObj，存储当前dom的信息
          var elemt_ivObj = element.iValidateObj = Object.create(null);
          
          // 默认验证未通过
          elemt_ivObj.validStatus = false;
          
          // 鼠标是否在经过元素
          elemt_ivObj.isMouse = false;
          
          // 焦点是否在元素上
          elemt_ivObj.isFocus = false;
          
          // 是否验证方法触发
          elemt_ivObj.isValidFuncTrigger = false;
          
          // 把元素需要验证的选项放入
          elemt_ivObj.data_options = data_options;
          
          // 把数据项的消息属性值
          elemt_ivObj.contentText = data_options.contentText;
          
          // 删除contentText属性，为了减少处理验证时的循环
          delete data_options.contentText;
          
          // 初始化验证消息组件后，并返回api
          elemt_ivObj.api = this.iv_cmpt.init($element, ivtip_config);
            
          // 验证绑定事件
          this.bindValidEvent($element);
          
        }
      }
    }
  };
  
  // 只暴露ivtip_cmpt的init方法
  w.iValidate = w.Object.create(null);
  
  // 暴露ivtip_cmpt的init方法
  w.iValidate.init = (function(_this){
    return function($element, config){_this.init($element, config);}})(iValidate);
  
  // 暴露设置regTypeObj对象的方法
  w.iValidate.setRegTypeObj = (function(_this){
    return function(regTypeObj){_this.regTypeObj = regTypeObj};
  })(iValidate);
  
  /**==============================================================**/
  
  
  
  /**
    *
    * 验证的api
    *
    **/
  
  /*
   * 验证form下需要验证的内容是否通过
   * 
   * 使用方法$("#text").ivValidForm()，参数text为form的id
   * 
   * 且不验证disabled的元素
   * 
   * 注：如果得到了多个表单，该方法只能验证其中一个表单
   * 
   * 如果没有验证对象返回true
   */
  $.fn.ivValidForm = function(){
    var validStatus = true;
    var $this = null;
    if(this.length == 0){
      return validStatus;
    }else if(this.length > 1){
      $this = $(this[0]);
    }else{
      $this = $(this);
    }
    
    // 不验证disabled的元素
    $this.find("input, textarea, select").not($(":disabled")).each(function(){
      if(this.iValidateObj){
        this.iValidateObj.isValidFuncTrigger = true;
        validStatus = iValidate.dealValid($(this), true) && validStatus;
      }
    });
    return validStatus;
  };
  
  /*
   * 验证单个的内容是否通过
   * 使用方法$("#text").ivValid()，参数text为输入框的id
   * 
   * 不验证disabled的元素
   * 
   * 如果没有验证对象返回true
   */
  $.fn.ivValid = function(){
    var validStatus = true;
    for(var i = 0, il = this.length; i < il; i++){
      if(this[i].iValidateObj){
        var $this = $(this[i]);
        if(!$this.prop("disabled")){
          this[i].iValidateObj.isValidFuncTrigger = true;
          validStatus = iValidate.dealValid($this, true) && validStatus;
        }
      }
    }
    return validStatus;
  };
  
  /*
   * 启用字段与验证
   */
  $.fn.ivInvocation = function(){
    for(var i = 0, il = this.length; i < il; i++){
      if(this[i].iValidateObj){
        var $this = $(this[i]);
        $this.removeAttr("disabled");
        $this.removeClass(iValidate.constants.VALID_CLASS.PASS);
        $this.removeClass(iValidate.constants.VALID_CLASS.NO_PASS);
        $this.removeClass(iValidate.constants.VALID_CLASS.DISABLED);
        $this.addClass(iValidate.constants.VALID_CLASS.NORMAL);
        $("#" + this[i].iValidateObj.api.getRefId()).hide();
      }
    }
  };
  
  /*
   * 字段禁用与不验证
   */
  $.fn.ivForbidden = function(){
    for(var i = 0, il = this.length; i < il; i++){
      if(this[i].iValidateObj){
        var $this = $(this[i]);
        $this.attr("disabled", "disabled");
        $this.removeClass(iValidate.constants.VALID_CLASS.PASS);
        $this.removeClass(iValidate.constants.VALID_CLASS.NO_PASS);
        $this.removeClass(iValidate.constants.VALID_CLASS.NORMAL);
        $this.addClass(iValidate.constants.VALID_CLASS.DISABLED);
        $("#" + this[i].iValidateObj.api.getRefId()).hide();
      }
    }
  };
  
  /*
   * 摧毁消息提醒
   * 使用方法$("#text").ivDestroy()，参数text为输入框的id
   */
  $.fn.ivDestroy = function(){
    for(var i = 0, il = this.length; i < il; i++){
      if(this[i].iValidateObj){
        var $this = $(this[i]);
        this[i].iValidateObj.api.destroy();
        delete this[i].iValidateObj;
        $this.removeAttr("disabled");
        $this.removeClass(iValidate.constants.VALID_CLASS.NORMAL);
        $this.removeClass(iValidate.constants.VALID_CLASS.PASS);
        $this.removeClass(iValidate.constants.VALID_CLASS.NO_PASS);
        $this.removeClass(iValidate.constants.VALID_CLASS.DISABLED);
        $this.off();
      }
    }
  };
  
  /*
   * 重置验证状态
   * 使用方法$("#text").ivResetStatus()，参数text为输入框的id
   */
  $.fn.ivResetStatus = function(){
    for(var i = 0, il = this.length; i < il; i++){
      if(this[i].iValidateObj){
        var $this = $(this[i]);
        $this.removeClass(iValidate.constants.VALID_CLASS.PASS);
        $this.removeClass(iValidate.constants.VALID_CLASS.NO_PASS);
        $this.addClass(iValidate.constants.VALID_CLASS.NORMAL);
        $("#" + this[i].iValidateObj.api.getRefId()).hide();
      }
    }
  };
  
  /*
   * 设置消息
   * 使用方法$("#text").ivSetContent("验证不通过！")，参数content为提示内容
   */
  $.fn.ivSetContent = function(content){
    for(var i = 0, il = this.length; i < il; i++){
      if(this[i].iValidateObj){
        this[i].iValidateObj.api.setContent(content);
      }
    }
  };
  
  /*
   * 设置扩展规则，用法：
   * $("#text").ivSetSupplyRuleObj({t: function(){
   *   if(false){
   *     $("#text").ivSetContent("xxxxxx");
   *       return false;
   *     }
   *   return true
   * }});
   *
   * 当补充的验证规则不通过时，需要设置消息提示，
   * 需要和$.fn.ivSetContent(content)一起使用
   *
   */
  $.fn.ivSetSupplyRuleObj = function(supplyRuleObj){
    for(var i = 0, il = this.length; i < il; i++){
      if(this[i].iValidateObj){
        
        // 如果isImdValid没值，默认直接给true，表示可在输入过程中立即执行验证，否则只有通过调用api验证时才会执行
        if(supplyRuleObj.isImdValid !== false){
          supplyRuleObj.isImdValid = true;
        }
        
        // 补充验证，由用户自己定义验证规则，内部通过回调实现验证
        this[i].iValidateObj.supplyRuleObj = supplyRuleObj;
      }
    }
  };
  
  /*
   * 复位tip位置，只允jquery选择器返回一个元素做重置
   */
  $.fn.ivReposition = function(){
    if(this[0].iValidateObj){
      this[0].iValidateObj.api.reposition();
    }
  };
  
  /**==============================================================**/
  
})(window, $);
