function showLocation(province , city , town) {
	
	var loc	= new Location();
	var title	= ['省份' , '城市' , '区'];
	$.each(title , function(k , v) {
		title[k]	= '<option value="">'+v+'</option>';
	})

	var _province = $('#loc_province'),
		_city = $('#loc_city'),
		_town = $('#loc_town');

	_province.append(title[0]);
	_city.append(title[1]);
	_town.append(title[2]);
	
	$("#loc_province,#loc_city,#loc_town").select2();
	_province.change(function() {
		_city.empty().append(title[1]);
		loc.fillOption('loc_city' , '0,'+_province.val());
		$('#loc_city').change()
		//$('input[@name=location_id]').val($(this).val());
	})

	_city.change(function() {

		_town.empty().append(title[2]);
		loc.fillOption('loc_town' , '0,' + _province.val() + ',' + _city.val());
		//$('input[@name=location_id]').val($(this).val());
	})

	_town.change(function() {
		$('input[name=location_id]').val($(this).val());
	});
	
	if (province) {
		loc.fillOption('loc_province' , '0' , province);
		
		if (city) {
			loc.fillOption('loc_city' , '0,'+province , city);
			
			if (town) {
				loc.fillOption('loc_town' , '0,'+province+','+city , town);
			}
		}
		
	} else {
		loc.fillOption('loc_province' , '0');
	}
		
}

/*
* 获取选中的值 $('#ID').val()
* $('#ID').select2('data).text
* */
~function($){
	showLocation();
}(jQuery);
