(function ($) {
	$( document ).on( 'click', '.visionwp-reset-customizer', function( e ){
	    e.preventDefault();
	    
	    var nonce = $( this ).data( 'nonce' );
	    var msg = $( this ).data( 'msg' );
	    var confirmed = confirm( msg );
	    if( confirmed ){
	    	var data = {
	    	    wp_customize: 'on',
	    	    action: 'customizer_reset',
	    	    nonce: nonce
	    	};

	    	$( this ).text( 'Loading...' );
	    	$.post( ajaxurl, data, function () {
	    	    wp.customize.state('saved').set(true);
	    	    location.reload();
	    	});
	    }
	});
})(jQuery)