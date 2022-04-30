(function (Themify) {
	'use strict';
	Themify.on( 'builder_load_module_partial', function(el){
		if(el!=undefined && !el[0].classList.contains('module-fancy-heading')){
			return;
		}
		const items = Themify.selectWithParent('module-fancy-heading',el);
		for(let i=items.length-1;i>-1;--i){
			if ( ! items[i].getElementsByClassName( 'tb_fancy_heading_icon_wrap' ).length ) {
				const title = items[i].getElementsByClassName('main-head')[0];
				title.innerHTML='<span class="maketable"><span class="addBorder"></span><span class="fork-icon"></span><span class="addBorder"></span></span><span class="tb_fancy_text">'+title.innerText+'</span><span class="bottomBorder"></span>';
			}
		}
	} );
}(Themify));
