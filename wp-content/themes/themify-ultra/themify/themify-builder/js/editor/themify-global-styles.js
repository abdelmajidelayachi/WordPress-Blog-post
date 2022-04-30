(function ( $,window,document ) {
        'use strict';
	/**
	 * Themify Global Styles Manager
	 * The resources that manage Global Styles
	 *
	 * @since 4.5.0
	 */

	const themifyGS = function () {

		this.form = document.getElementById( 'tb_admin_new_gs' );
		this.loadAddNewForm();
		this.addNew();
		this.deleteStyle();
		this.restore();
		this.scalePreview();

	},
        args=themifyGlobalStylesVars;

	/**
	 * Handle add new Global Style functionality
	 *
	 * @since 4.5.0
	 * @returns void
	 */
	themifyGS.prototype.addNew = function () {

		const addNew = document.getElementsByClassName( 'tb_admin_save_gs' )[0],
                        globalStyle = this;
		if ( !addNew) {
			return;
		}
		addNew.addEventListener( 'click', function ( e ) {
			e.preventDefault();
			if ( !globalStyle.validateForm() ) {
				alert( args.messages.formValid );
				return;
			}
			e.target.text = args.messages.creating;
			$.ajax( {
				type: 'POST',
				url: args.ajaxurl,
				dataType: 'json',
				data: {
					action: 'tb_save_custom_global_style',
					nonce: args.nonce,
					form_data: $( globalStyle.form ).serialize()
				},
				success( resp ) {
					if ( 'failed' === resp.status ) {
						alert( resp.msg );
						e.target.text = args.messages.create;
					} else if ( 'success' === resp.status ) {
						window.location = resp.url;
					} else {
						// Something went wrong with save Global Style response
						e.target.text = args.messages.create;
					}
				}
			} );
		} );
	};

	/**
	 * Validate add new form
	 *
	 * @since 4.5.0
	 * @returns bool
	 */
	themifyGS.prototype.validateForm = function () {

		let valid = true;
		$.each(  $( this.form ).serializeArray(), function ( i, field ) {
			if ( '' == field.value ) {
				valid = false;
				return false;
			}
		} );
		return valid;
	};

	/**
	 * Load popup for to create new Global Style
	 *
	 * @since 4.5.0
	 * @returns void
	 */
	themifyGS.prototype.loadAddNewForm = function () {

		const $addNew = $( '.tb_add_new_gs' );
		if ( $addNew.length === 0 ) {
			return;
		}
		$addNew.magnificPopup( {
			type: 'inline',
			midClick: true,
			callbacks: {
				close() {
					document.getElementById( "tb_admin_new_gs" ).reset();
				}
			}
		} );
	};

	/**
	 * Handle delete Global Style functionality
	 *
	 * @since 4.5.0
	 * @returns void
	 */
	themifyGS.prototype.deleteStyle = function () {

		const $removeBtn = $( '.tb_remove_gs' );
		if ( $removeBtn.length === 0 ) {
			return;
		}
		$removeBtn.on('click', function ( e ) {
			e.preventDefault();
			const $this = $( this ),
				pageStatus = $this.parents('.tb_admin_gs_list').data('list'),
				msg = 'publish' === pageStatus ? themifyGlobalStylesVars.messages.deleteConfirm : themifyGlobalStylesVars.messages.deleteConfirm2;
			if ( !confirm( msg ) ) {
				return;
			}
			$this.parents( '.tb_gs_element' ).fadeOut();
			$.ajax( {
				type: 'POST',
				url: args.ajaxurl,
				dataType: 'json',
				data: {
					action: 'tb_delete_global_style',
					nonce: args.nonce,
					status: pageStatus,
					id: $this.attr( 'data-id' )
				},
				success( resp ) {
					if ( 'failed' === resp.status ) {
						alert( resp.msg );
						$this.parents( '.tb_gs_element' ).fadeIn();
					}
				}
			} );
		} );

	};

	/**
	 * Handle restore Global Style functionality
	 *
	 * @since 4.5.7
	 * @returns void
	 */
	themifyGS.prototype.restore = function () {

		const $restoreBtn = $( '.tb_gs_restore' );
		if ( $restoreBtn.length === 0 ) {
			return;
		}
		$restoreBtn.on('click', function ( e ) {
			e.preventDefault();
			const $this = $( this );
			$this.parents( '.tb_gs_element' ).fadeOut();
			$.ajax( {
				type: 'POST',
				url: args.ajaxurl,
				dataType: 'json',
				data: {
					action: 'tb_restore_global_style',
					nonce: args.nonce,
					id: $this.attr( 'data-id' )
				},
				success( resp ) {
					if ( 'failed' === resp.status ) {
						alert( resp.msg );
						$this.parents( '.tb_gs_element' ).fadeIn();
					}
				}
			} );
		} );

	};

	/**
	 * Scale the preview
	 *
	 * @since 4.5.0
	 * @returns void
	 */
	themifyGS.prototype.scalePreview = function () {

		$( ".themify_builder_content" ).each( function () {
			let $el = $( this ),
				$wrapper = $el.parent(),
				scale = Math.min( $wrapper.width() / $el.outerWidth(), $wrapper.height() / $el.outerHeight() );
			$el.css( {
				transform: "translate(-50%, -50%) " + "scale(" + scale + ")"
			} );
		} );


	};

	new themifyGS();

}( jQuery, window, document ));
