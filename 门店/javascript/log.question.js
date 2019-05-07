/**
 * Created by chaoyue on 2017/11/29.
 */
~(function($){
    //登录方式转换
    var init = function() {
        var card = document.querySelector('.modal-form-box');
        $(card).on('click','.toggle-translate',function(e){
            var card_item = $(this).closest('figure');
            if(card_item.hasClass('fadeInRight')){
                card_item.removeClass('fadeInRight').siblings().removeClass('fadeOut');
            }
            card_item.addClass('fadeOut').hide().siblings().addClass('fadeInRight').show();
        })
    };
    window.addEventListener('DOMContentLoaded', init, false);

    var $body = $('body')
    var f = function(e) {
        var t = e.closest("form"), n = t.find(".captchaInput .captcha"), r = n.data("src");
        n.attr("src", r),
            t.find(".captchaInput").removeClass("hidden")
    };
    $body.on("focus", 'input[name="phone"]', function() {
        var t = $(this);
        t.closest("form").find(".captchaInput .captcha").attr("src") || f(t)
    });
    var t = {
        phone: '\n                <input type="phone" class="form-ipt input-md" name="phone" required placeholder="仅支持大陆手机号" autocomplete="off">\n                <div class="captchaInput mb10">\n                    <label class="required control-label mt5">验证码</label>\n                    <input type="text" class="form-control" name="captch" placeholder="请输入下方的验证码后，再点击获取验证码">\n                    <div class="mt10 ">\n                        <a id="loginReloadCaptcha" href="javascript:void(0)">\n                        <img src="/user/captcha?w=240&h=50" class="captcha" width="240" height="50"/></a>\n                    </div>\n                </div>\n                <div class="input-group">\n                    <input name="code" type="text" class="form-control js-user-login__phone-code-value" placeholder="短信验证码">\n                    <span class="input-group-btn">\n                    <button class="btn btn-default js-user-login__phone-vaild-btn" style="width:96px;" type="button">获取验证码</button></span>\n                </div>\n                \n            ',
        mail: '\n                <input type="email" class="form-control" name="mail" required placeholder="hello@segmentfault.com" autocomplete="off">\n            '
    };
    /*$body.on("click", ".modal-form .js-register-switch-box input[name=register_type]", function() {
        var n = $(this).val();
        $(".js-register-switch-content").html(t[n]),
            "phone" === n ? $(this).closest("form").attr("action", "/api/user/phone/register") : $(this).closest("form").attr("action", "/api/user/register")
    });*/
    $body.on("click", ".modal-form .js-user-login__phone-vaild-btn", function() {
        var t = $(this)
            , n = 60
            , r = void 0
            , i = function() {
            n > 1 ? (n--,
                t.text(n + "s")) : (clearInterval(r),
                t.text("获取验证码"),
                t.prop("disabled", !1))
        }
            , a = {}
            , o = $(this).closest("form").find("input:not(.hide,hidden)");
        o.each(function() {
            var t = $(this)
                , n = t.attr("name")
                , r = t.val();
            a[n] = r
        }),
            //AJax Post请求
            $.post("/api/user/phone/register/send", a, function(e) {
                e.status || (t.prop("disabled", !0),
                    r = setInterval(i, 1e3))
            })
    })
    $body.on("click", ".progress-box .forgot-pwd__phone-vaild-btn", function() {
            var t = $(this)
                , n = 60
                , r = void 0
                , i = function() {
                n > 1 ? (n--,
                    t.text(n + "s")) : (clearInterval(r),
                    t.text("重新发送动态码"),
                    t.prop("disabled", !1))
            };

            t.prop("disabled", !0),
            r = setInterval(i, 1e3)
            $.post("/api/forgot/phone/bind", {}, function(e) {
                e.status || (t.prop("disabled", !0),
                    r = setInterval(i, 1e3))
            })
        });

    $("#loginReloadCaptcha").click(function() {
        $(this).find("img").attr("src", "/user/captcha?w=140&h=40")
    })


    //设置 z-index !!!
    $('.progressbar li').each(function(idx,li){
        $(li).css('z-index',100-idx);
    });

    // 修改密码分步骤动画效果设置
    var current_fs, next_fs; //fieldsets
    var left, opacity, scale; //fieldset properties which we will animate
    var animating;
    $('.forgot-pw-wrapper form').on('click','.next',function(e){
        if(animating) return false;
        animating = true;

        current_fs = $(this).closest("figure");
        next_fs = current_fs.next();

        //activate next step on progressbar using the index of next_fs
        $(".step-instr li").eq($("figure").index(next_fs)).addClass("active");

        //hide the current fieldset with style
        current_fs.animate({opacity: 0}, {
            step: function(now, mx) {
                //as the opacity of current_fs reduces to 0 - stored in "now"
                //1. scale current_fs down to 80%
                scale = 1 - (1 - now) * 0.2;
                //2. bring next_fs from the right(50%)
                left = (now * 50)+"%";
                //3. increase opacity of next_fs to 1 as it moves in
                opacity = 1 - now;
                current_fs.css({'transform': 'scale('+scale+')'});
                next_fs.css({'left': left, 'opacity': opacity});
            },
            duration: 800,
            complete: function(){
                current_fs.removeClass('active');
                animating = false;
            },
            //this comes from the custom easing plugin
            easing: 'easeInOutBack'
        });
        //show the next Form
        next_fs.addClass('active');
    });


    $(document).ajaxComplete(function(t, r, i) {
        var a, o, s, l, c, d, u;
        if (window.captchaPostData = null != (s = window.captchaPostData) ? s : {},
                r.responseText)
            if (r.responseText.indexOf("<br />") !== -1 || r.responseText.indexOf("<pre>exception ") !== -1)
                console.log("后端返回错误信息=> ", r.responseText),
                "localhost" === location.hostname && e({
                    title: "警告：前方高能！",
                    $content: r.responseText,
                    hideClose: !0,
                    modalSize: "modal-lg"
                });
            else if (r.responseJSON && 1 === r.responseJSON.status) {
                if (u = r.responseJSON,
                        !u.data)
                    return;
                var p = u.data[0];
                if (i.url.indexOf("/user/stat") === -1 && "login" === p)
                    n.login();
                else if ("form" === p && u.data[1].hasOwnProperty("captcha") && 1 === _.keys(u.data[1]).length)
                    captchaPostData.api = i.url,
                        captchaPostData.data = i.data,
                        e({
                            modalSize: "modal-sm",
                            title: u.data[1].captcha,
                            content: "<div id='captchaPostForm' ><div class='reloadCaptcha'><img title='点击切换验证码'  src='/user/captcha?w=240&h=50' ></div><div class='form-group'><input class='form-action form-control' name='captcha'></div></div>",
                            hideClose: !0,
                            doneText: "确认并提交",
                            doneFn: function() {
                                var e;
                                return e = $("#captchaPostForm").find("input[name=captcha]"),
                                    captchaPostData.captcha = e.val(),
                                    $.post("/api/captcha/check", {
                                        captcha: captchaPostData.captcha
                                    }, function(t) {
                                        if (!t.status)
                                            return t.data ? $.post(captchaPostData.api, captchaPostData.data + "&captcha=" + captchaPostData.captcha, function(e) {
                                                return window.captchaPostData = {},
                                                    e.data.hasOwnProperty("url") ? location.href = e.data.url : location.reload()
                                            }) : (e.addClass("error"),
                                                console.log("验证码错误"),
                                                $(".reloadCaptcha").trigger("click"))
                                    })
                            }
                        });
                else if ("robot" === p)
                    location.href = "/stop-robot";
                else if ("unactivated" === p)
                    e("hide"),
                        $("#activate").modal("show");
                else if ("nonBlocked" === p)
                    e(u.data[1]);
                else if ("access" === p)
                    e({
                        title: u.data[1][0],
                        content: u.data[1][1],
                        hideClose: !0
                    });
                else if ("form" === p) {
                    var m = i.url.split("?")[0];
                    d = i.url.split("/")[2],
                        d = d.split("?")[0],
                        l = new RegExp("[?&]_=" + n._),
                        c = i.url.replace(l, ""),
                        a = !0;
                    var h = u.data[1];
                    $.each(h, function(e, t) {
                        var n, r, i, o;
                        if ("captcha" === e && ($("[name=captcha]").parents(".form-group").show(),
                                $(".captcha").parent("a").click()),
                                i = e.toLowerCase().replace(/\b[a-z]/g, function(e) {
                                    return e.toUpperCase()
                                }),
                            "tags" === e && "必须填写标签" === t)
                            return void $("#article .sf-typeHelper, #question .sf-typeHelper , #live .sf-typeHelper, #liveSeries .sf-typeHelper, .blog-post .sf-typeHelper, .sf-typeHelper--fortags").addClass("error").after('<span class="error--msg">' + t + "</span>");
                        if ("cap" === e)
                            return $(".captchaInput").addClass("has-error"),
                                void $('input[name="cap"]').addClass("error").after('<span class="help-block err">' + t + "</span>");
                        if ("list" === e)
                            return void $("#liveSeries .liveseries-select").addClass("error").after('<span class="error--msg">' + t + "</span>");
                        if (o = "#" + d + i,
                            0 === $(o).length && (o = "#" + d.replace(/s$/, "") + i),
                                r = $("form#" + d + " *[name=" + e + "]").not("[type=hidden]").parents(".form-group"),
                            0 === r.length && (r = $("form#" + d.replace(/s$/, "") + " *[name=" + e + "]").not("[type=hidden]").parents(".form-group")),
                                n = $('form[action="' + m + '"] *[name=' + e + "]").not("[type=hidden]").parents(".form-group"),
                            n.length || (n = $('form[action="' + c + '"] *[name=' + e + "]").not("[type=hidden]").parents(".form-group"),
                            n.length || (n = $('.form[action="' + m + '"] *[name=' + e + "]").not("[type=hidden]").parents(".form-group"),
                            n.length || (n = $("form *[name=" + e + "]").not("[type=hidden]").parents(".form-group"),
                            n.length || (n = $("form *[data-name=" + e + "]").not("[type=hidden]").parents(".form-group"))))),
                                $(o).length)
                            $(o).addClass("error").attr("data-error", t),
                            0 === $(o).next(".error--msg").length && $(o).after('<span class="error--msg">' + t + "</span>");
                        else if (r.length) {
                            r.find(".help-block.err").remove(),
                                r.addClass("has-error");
                            var s = r.find("[name=" + e + "]").not("[type=hidden]")
                                , l = s.closest(".input-group");
                            l.length > 0 ? l.after('<span class="help-block err">' + t + "</span>") : s.after('<span class="help-block err">' + t + "</span>")
                        } else if (n.length)
                            n.find(".help-block").remove(),
                                n.addClass("has-error"),
                                n.find(".input-group").length > 0 ? n.find(".input-group").after('<span class="help-block err">' + t + "</span>") : (n.find("[name=" + e + "]").not("[type=hidden]").parents(".form-group").append('<span class="help-block err">' + t + "</span>"),
                                    n.find("[data-name=" + e + "]").not("[type=hidden]").parents(".form-group").append('<span class="help-block err">' + t + "</span>"));
                        else if ($("form").length && !$("form").hasClass("header-search")) {
                            if ($("form#" + d + " *[name=" + e + "]").not("[type=hidden]").siblings(".error--msg").remove(),
                                    $("form#" + d + " *[name=" + e + "]").not("[type=hidden]").addClass("error").attr("data-error", t).after('<span class="error--msg">' + t + "</span>"),
                                1 === $("form").length && $("form").hasClass("header-search")) {
                                var u = $(".form *[data-name=" + e + "]");
                                0 == u.length && (u = $(".form *[name=" + e + "]"));
                                var p = u.closest(".form-group");
                                p.addClass("has-error"),
                                    p.find(".err").remove(),
                                    u.after('<span class="help-block err">' + t + "</span>")
                            }
                        } else if ($(".form").length) {
                            var h = $(".form *[data-name=" + e + "]");
                            0 == h.length && (h = $(".form *[name=" + e + "]"));
                            var f = h.closest(".form-group");
                            f.hasClass("err-inline") ? (f.addClass("has-error"),
                                f.find(".err").remove(),
                                h.after('<span class="help-inline-block help-block err">' + t + "</span>")) : (f.addClass("has-error"),
                                f.find(".err").remove(),
                                h.after('<span class="help-block err">' + t + "</span>"))
                        }
                        a && ($(o).length ? $(o).focus() : (n.length && n.find("[name=" + e + "]").not("[type=hidden]").focus(),
                        r.length && r.find("[name=" + e + "]").not("[type=hidden]").focus(),
                            a = !1))
                    })
                } else
                    o = ["limit", "lock", "author", "rank", "account"],
                        _.find(o, function(e) {
                            return e === p
                        }) ? $.get("/api/errorMessage", {
                            type: p,
                            key: u.data[1]
                        }, function(t) {
                            if (t.data)
                                return e({
                                    title: t.data[0],
                                    content: t.data[1],
                                    hideClose: !0
                                })
                        }) : e({
                            title: p,
                            content: u.data[1],
                            hideClose: !0
                        })
            }
    })
})(jQuery);
