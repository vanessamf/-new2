/**
 * Created by chaoyue on 2017/12/11.
 */
(function($){

    //点击导航栏切换查看
    $('.step-instr').on('click','.step-item',function(e){
        var $li = $(this)
            ,cur_index = $li.index()
            ,figure_list = $('.figure-list')
            ,figure_items = figure_list.children()
        if(!$li.hasClass('active')){
            $li.addClass("active").siblings().removeClass("active")
            figure_items.hide()
            figure_items.eq(cur_index).show()
        }
    })

    $(".form-group").on('click',".choice-item",function(e){
        e.preventDefault();
        e.stopPropagation?e.stopPropagation():e.cancelBubble=true;

        var $this =$(this)
            ,ipt_children = $this.children('input')
        var flag = ipt_children[0] && ipt_children[0].checked || false;


        if($this.hasClass('type-chk')){
            ipt_children[0].checked = !flag;
        }else {
            if (!flag){
                ipt_children[0].checked = !flag;

                //资质选择 private Or public
                if($this.hasClass('account-type')){
                    var index = $this.index()
                        ,$parent_dl = $this.closest('.dl-list')
                        ,example_tips = $parent_dl.find('.example-tips').children()

                    example_tips.eq(index).show().siblings().hide()
                }
            }
        }
    });
    // 开店审核操作
    $('.verify-mana-tb').on('click','.state-op',function(e){
        var $this = $(this)
            ,parent_tr = $this.closest('tr')
            ,mark_state = parent_tr.find('.mark-state')
            ,failure_tpl = '<div class="mark-state verify-failure">审核失败</div><a class="verify-info" data-toggle="modal" data-target="#examine_failure">查看</a>'

        mark_state.empty();

        if($this.hasClass('state-submit')){
            mark_state.text('审核中')
        }
        if($this.hasClass('state-failure')){
            mark_state.append(failure_tpl)
        }
        if($this.hasClass('state-success')){
            mark_state.text('审核成功')
        }
    })

    // 后台门店管理状态切换
    $(".admin-wrapper .store-mana-tb,.admin-wrapper .account-mana-tb").on('click','.status-st-toggle',function(e){
        var _this = $(this)
            ,parent_tr = _this.closest('tr')
            ,m_state =  parent_tr.find('.mark-state')

        _this.toggleClass('active')
        if(m_state.text().indexOf('启用') > -1)
            m_state.text('已停用')
        else
            m_state.text('已启用')
    })


    // 后台账号管理状态切换
    $(".admin-wrapper .staff-mana-tb").on('click','.status-st-toggle',function(e){
        var _this = $(this)
            ,parent_tr = _this.closest('tr')
            ,m_state =  parent_tr.find('.state-toggle')

        _this.toggleClass('active')
        if(m_state.text().indexOf('启用') > -1)
            m_state.text('已停用')
        else
            m_state.text('已启用')
    })

})(jQuery);