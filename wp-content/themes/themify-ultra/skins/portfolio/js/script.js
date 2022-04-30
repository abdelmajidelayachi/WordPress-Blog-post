(function($){
	'use strict';
	window.addEventListener('load', function(){
		$( ".form-submit" ).wrapInner( "<span class='form-submit-wrapper'></span>" );
		$( ".shop_table.cart .actions input[type=submit]" ).wrap( "<span class='form-submit-wrapper'></span>" );
		if ($(".loops-wrapper.portfolio").children().length <= 6) {
			$('.loops-wrapper.portfolio').addClass('port6vh');
		}else if ($(".loops-wrapper.portfolio").children().length > 6) {
			$('.loops-wrapper.portfolio').addClass('port9vh');
		}
	}, {once:true, passive:true});

})(jQuery);