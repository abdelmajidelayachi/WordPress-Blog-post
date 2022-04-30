(function ($,DOC,api,builderData) {
    'use strict';
	
    const $body = $('body');
	let hasGuttenberg=!!builderData.is_gutenberg_editor,
		saved = false;
    if ( $('#page-builder.themify_write_panel').length>0){ 
        hasGuttenberg = false;
        $body[0].classList.remove('themify-gutenberg-editor');
    }
    else if(! hasGuttenberg){
        return;
    }
        
    api.redirectFrontend = false;
    api.toolbarCallback = function(){
        api.undoManager.btnUndo = api.toolbar.el.getElementsByClassName('tb_undo_btn')[0];
        api.undoManager.btnRedo = api.toolbar.el.getElementsByClassName('tb_redo_btn')[0];
        api.undoManager.compactBtn = api.toolbar.el.getElementsByClassName('tb_compact_undo')[0];
        Themify.trigger('tf_toolbar_callback');
        Themify.body.triggerHandler('tf_toolbar_callback');//deprecated, Backward compatibility use instead Themify.trigger
    };
    api.render = function () {
		const canvas=DOC.getElementById('tb_canvas_block');
        if ( hasGuttenberg && !canvas){
			Themify.on('tb_canvas_loaded',api.render,true);
			return;
		} 
       
        $body[0].insertAdjacentHTML('afterbegin', '<div class="tb_fixed_scroll" id="tb_fixed_bottom_scroll"></div>');
        $body.append($('<div/>', {id: 'tb_alert'}));
        if (builderData.builder_data.length === 0) {
            builderData.builder_data = {};
        }

        if ( hasGuttenberg ) {
			canvas.innerHTML='';
			canvas.appendChild(DOC.getElementById('tmpl-builder_admin_canvas_block').content);
        }
        ThemifyBuilderCommon.setToolbar();
        api.toolbar = new api.Views.Toolbar({el:'#tb_toolbar'});
        api.toolbar.render();
        api.toolbarCallback();

        api.Instances.Builder[0] = new api.Views.Builder({el: '#tb_row_wrapper', collection: new api.Collections.Rows(builderData.builder_data)});
        api.Instances.Builder[0].render();
        api.toolbar.pageBreakModule.countModules();
        /* hook save to publish button */
        const saveCallback=function(e){
            $('.themify_builder').find('input[required]').removeAttr('required');
            if (!saved) {
				saved=true;
                if ( !hasGuttenberg ) {
                    this.classList.remove('disabled');
                    e.preventDefault();
                }
                api.Utils.saveBuilder(function(){
                    // Clear undo history
                    api.undoManager.reset();
					saved=false;
                    if ( !hasGuttenberg ) {
                        this.classList.remove('disabled');
                        this.click();
                    }else{
                        $('button.editor-post-publish-button__button').one('click', saveCallback);
                    }
                }.bind(this));
            }
        };
		let switchButton = $('<a href="#" id="tb_switch_frontend_button" class="button tb_switch_frontend">' + builderData.i18n.switchToFrontendLabel + '</a>'),
		editorPlaceholder = $( '.themify-wp-editor-holder' );
        $('input#publish,input#save-post,button.editor-post-publish-button__button').one('click', saveCallback);

        if( editorPlaceholder.length ) {
                switchButton = editorPlaceholder.find( 'a' );
        } else {
                switchButton.appendTo( '#postdivrich #wp-content-media-buttons' );
        }

        switchButton.on('click', function (e) {
                e.preventDefault();
                $('#tb_switch_frontend').trigger('click');
        });

        $('input[name*="builder_switch_frontend"]').closest('.themify_field_row').remove(); // hide the switch to frontend field check

        api.Instances.Builder[api.builderIndex].$el.triggerHandler('tb_init');
        
        if( sessionStorage.getItem( 'focusBackendEditor' ) ) {
                api._backendBuilderFocus();
                sessionStorage.removeItem( 'focusBackendEditor' );
        }
        ThemifyStyles.init(ThemifyConstructor.data,ThemifyConstructor.breakpointsReverse,builderData.post_ID);
       
    };

    api._backendSwitchFrontend = function(link){
        $('#builder_switch_frontend_noncename').val('ok');
        saved = true;
            if ( 'publish' === $('#original_post_status').val() ) {
                if ( hasGuttenberg ) {
                        if ( $('.editor-post-publish-button').length ) {
                                $('.editor-post-publish-button').trigger('click');
                        } else {
                                $('.editor-post-publish-panel__toggle').trigger('click');
                        }
                        api.redirectFrontend = link;
                        $('#tb_switch_frontend').trigger('click.frontend-btn');
                } else {
                $('#publish').trigger('click');
                }
            } else {
            if ( hasGuttenberg ) {
                    $('.editor-post-save-draft').trigger('click');
                    api.redirectFrontend = link;
            } else {
                $('#save-post').trigger('click');
            }
        }
    };
    api._backendBuilderFocus = function(){
        $( '#page-buildert' ).trigger( 'click' );
        if(hasGuttenberg){
            api.Utils.scrollToDropped(api.toolbar.el);
        }
        else{
            api.Utils.scrollTo(api.toolbar.$el.offset().top - $( '#wpadminbar' ).height());
        }
    };
	
    // Run on WINDOW load
	function windowLoad() {
		
        if ( $body[0].classList.contains('post-php')) {
            const lock  = DOC.getElementById('post-lock-dialog');
            if(lock!==null && !lock.classList.contains('hidden')){
                Themify.LoadAsync( builderData.builder_url + '/js/editor/themify-ticks.js', function() {
						const tick=TB_Ticks.init( builderData.ticks, window );
                        if ( $body[0].classList.contains( 'tb_restriction' ) ) {
							tick.show();
                        } else {
							tick.ticks();
                        }
                }, null, null, function() {
                        return typeof TB_Ticks !== 'undefined';
                } );
            }
        }
        // WPML compat
        if (typeof window.icl_copy_from_original === 'function') {

			/**
			 * Retrieve Builder content from original language and injects
			 * the new content into the Builder editor.
			 */
			function builder_icl_copy_from_original( lang, trid ) {
				$.ajax({
					url: ajaxurl,
					type: 'POST',
					data: {
						action: 'themify_builder_icl_copy_from_original',
						source_page_id: trid,
						source_page_lang: lang
					},
					success: function ( response ) {
						if ( response != '-1' ) {
							let data;
							try {
								data = $.parseJSON( response ) || {};
							} catch( error ) {
								data = {};
							}
							api.Forms.reLoad( data, builderData.post_ID );
						}
					}
				});
			}

			/**
			 * Intercept copy_from_original request and handle Builder content
			 */
			$.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
			if ( originalOptions['data'] && typeof originalOptions['data'] === 'string' && originalOptions['data'].includes( 'icl_ajx_action=copy_from_original' ) ) {
				const original_callback = options.success, // og success callback from WPML
					params = new URLSearchParams( originalOptions['data'] );
				options.success = function( msg ) {
					/* move the Builder block out of the Gutenberg editor, protect it from being modified by WPML */
					const tb_block = $( '#tb_canvas_block' );
					if ( tb_block.length ) {
						tb_block.hide().appendTo( 'body' );
					}

					original_callback( msg );

					if ( tb_block.length ) {
						/* restore the Builder editor interface */
						$( '#editor [data-type="themify-builder/canvas"]' ).empty().append( tb_block.show() );
					}
					/* get the content from original language */
					builder_icl_copy_from_original( params.get( 'lang' ), params.get( 'trid' ) );
				};
			}
			});
		}
        // Init builder
        Themify.LoadAsync( builderData.builder_url + '/js/editor/themify-constructor.js', function() {
                ThemifyConstructor.getForms(api.render);
        }, null, null, function() {
                return typeof ThemifyConstructor !== 'undefined';
        } );
    }
	
	if (DOC.readyState === 'complete') {
		windowLoad();
	} else {
		window.addEventListener('load', windowLoad, {once:true, passive:true});
	}
})(jQuery,document,tb_app,themifyBuilder);
