~function($){

	$(document).ready(function(){
		var sub_nav = $('.sub-nav')
			,$tab_content = $('#tab_content')
			,$tab_nav = $('#tab_nav')

		sub_nav.on('click','li > a',function(e){
			e && e.preventDefault();
			var $c_item = $(e.target)
				,target_url , tab_title ,tab_id
				,tpl_new_tab ,$vbox
				,flag_already = false

			!$c_item.is('a') && ($c_item = $c_item.closest('a'));
			target_url = $c_item.data('target') || $c_item.attr('href');
			tab_title = $c_item.attr('title');
			tab_id = $c_item.data('tid');

			$tab_nav.find('.current').removeClass('current');
			$tab_content.find('.cur-show').removeClass('cur-show');

			//对应的tab导航选项
			$tab_nav.find('.tab-item').each(function(tin,tele){
				var $ele = $(tele)
				if(tab_id === $ele.data('tid')){
					flag_already = true;
					$ele.addClass('current')
					$tab_content.children().eq(tin).addClass('cur-show')
					return false;
				}
			})


			//如果当前选项卡不存在 插入生成新的选项卡
			if(!flag_already){
				tpl_new_tab = '<li class="tab-item current" data-tid="'+ tab_id+'">'+ tab_title + '<i class="tab-del">×</i></li>';
				$tab_nav.append(tpl_new_tab);
				$vbox = $('<section class="vbox rpt-box cur-show" data-itemid="'+ tab_id +'"></section>'); //创建元素

				var tpl_content = document.getElementById(target_url)
				$vbox.append(tpl_content.content.cloneNode(true))
				$tab_content.append($vbox); // 插入对应父节点
//初始化列表数据
                                if (tab_id == "menu") {
                    MenuSaleReport(1);
                } else {
                    SystemSalesReport(1);
                }
			}
			return false;
		})

		// 选项卡切换
		$tab_nav.on('click','li',function (e){
			e && e.preventDefault() && e.stopPropagation()
			var $this = $(this)
				,tab_id

			tab_id = $this.data('tid');

			if($this.hasClass('current')) return;
			$this.addClass('current').siblings().removeClass('current');
			$tab_content.find('.vbox').each(function(inx,ele){

				var  $ele = $(ele)
					, ele_item_id = $ele.data('itemid');

				if(ele_item_id === tab_id){
					$ele.addClass('cur-show').siblings().removeClass('cur-show')
					return false
				}
			})
		})

		//选项卡删除
		$tab_nav.on('click','.tab-del',function(e){
			e && e.preventDefault() && e.stopPropagation();
			var $li,$a,$item,tinx,len;

			$item = $(e.target)
			!$item.is('i') && ( $item = $item.closest('i'))
			$a = $item.parent();
			$li = $item.closest('.tab-item');
			len = $tab_nav.children().length;
			tinx = $li.index();

			if( $li.hasClass('current')){
				if( tinx === (len-1)){
					$tab_nav.children().eq(0).addClass('current')
					$tab_content.children().eq(0).addClass('cur-show')
				}else{
					var next = tinx ;
					$tab_nav.children().eq(++next).addClass('current')
					$tab_content.children().eq(next).addClass('cur-show')
				}
			}
			$li.remove();
			$tab_content.children().eq(tinx).remove();
		})

		//导出报表弹出层 文件选择
		$("form").on('click',".choice-item",function(e){
			e.preventDefault();
			e.stopPropagation ? e.stopPropagation(): (e.cancelBubble=true);

			var $this =$(this),
				ipt_children = $this.children('input');
			var flag = ipt_children[0] && ipt_children[0].checked || false;

			if(!flag){
				ipt_children[0].checked = !flag;
			}
		});

		//筛选门店弹出层 门店多选操作
		var $m_search_form = $('.rpt-search-form')
			,$store_dl = $(".store-dt-ctn")

		$m_search_form.on('click', '.chk-store-cn', function(e){

			e.stopPropagation ? e.stopPropagation(): (e.cancelBubble=true);
			var $this = $(this)
				,ipt = $this.children('input')
				,role = ipt.data('role')

			//全选 or 全不选
			if( role.indexOf('batch-select') > -1){
				if( ipt.is(":checked") == true){
					$m_search_form.find('[data-role=batch-select], [data-role=batch-item]').prop('checked', true);
					$m_search_form.find('[data-role=batch-select], [data-role=batch-item]').prop('checked', true);
				} else{
					$m_search_form.find('[data-role=batch-select], [data-role=batch-item]').prop('checked', false);
				}
			}

			if( role.indexOf('batch-item') > -1){
				var length = $m_search_form.find('[data-role=batch-item]').length
					,checked_count = 0;
				$m_search_form.find('[data-role=batch-item]').each(function(){
					if ($(this).is(":checked")) {
						checked_count++;
					}
				});

				if (checked_count == length){
					$m_search_form.find('[data-role=batch-select]').prop('checked',true);
				} else {
					$m_search_form.find('[data-role=batch-select]').prop('checked',false);
				}
			}
		});

		$store_dl.on('click',"li > .chk-store-cn",function(e){
			e.stopPropagation ? e.stopPropagation(): (e.cancelBubble=true);

			var $this =$(this),
				ipt_children = $this.children('input')
				,flag = ipt_children[0] && ipt_children[0].checked || false;

			ipt_children[0].checked = !flag;
		});

		//显示更多
		$('.rpt-wrapper').on('click','.btn-more',function(e){

			console.log('vrewvwe')
			var $this = $(this)
				,span_txt = $this.find('span')

			// $this.hasClass('open') ? $this.removeClass('open'): $this.addClass('open')

			if($this.hasClass('open')){
				$this.removeClass('open')
				span_txt.text('显示更多')
			}else{
				$this.addClass('open')
					span_txt.text('收起')
			}
		})
	});
}(jQuery)



















