/* globals ajaxurl, themify_lang */
;
(function ($, window, document) {

	'use strict';

	// Handle maintenance functionality tool
	function tb_maintenance_mode(){
		const pagesDropdown = document.getElementById('tools_maintenance_page'),
			  maintenanceMode = document.getElementById('tools_maintenance_mode'),
			  maintenanceMessage = document.getElementById( 'tools_maintenance_message' );
		if(pagesDropdown){
			pagesDropdown.addEventListener('click',load_maintenance_pages);
		}
		function load_maintenance_pages(){
			pagesDropdown.removeEventListener('click',load_maintenance_pages);
			const self = this;
			$.ajax( {
				url: ajaxurl,
				type:'POST',
				data: {
					'action': 'themify_load_maintenance_pages',
					'nonce' : themify_js_vars.nonce
				},
				success: function( data ) {
					self.innerHTML = data;
				}
			});
		}
		if(maintenanceMode){
			maintenanceMode.addEventListener('change',dependecy);
			dependecy();
		}
		function dependecy(){
			let pages = document.getElementsByClassName('tb_maintenance_page')[0];
			maintenanceMessage.style.display = 'none';
			pages.style.display = 'none';
			if ( 'on' === maintenanceMode.value ) {
				pages.style.display = 'block';
			} else if ( 'message' === maintenanceMode.value ) {
				maintenanceMessage.style.display = 'block';
			}
		}
	}

	window.addEventListener('load', function(){
		tb_maintenance_mode();
	}, {once:true, passive:true});

}(jQuery, window, document));
