( function( blocks, i18n, element, $ ) {
	let onClicking=false;
	const el = element.createElement,
		__ = i18n.__,
	builderBlcok= {
		stateInit: false,
		number: 0,
		tempHTML: null,
		isRendered(){
			return document.getElementById('tb_toolbar')!==null;
		},
		saveHTML( props ) {
			if ( this.isRendered() ) {
				this.tempHTML = document.getElementById('tb_canvas_block').innerHTML;
			}
		},
		restoreHTML( props ){
			
			if (  'undefined' !== typeof tb_app  && this.tempHTML && ! this.isRendered() && document.getElementById('tb_canvas_block') ) {
				document.getElementById('tb_canvas_block').innerHTML = this.tempHTML;
				if (tb_app.Instances.Builder[0]) {
					
					let batch = document.getElementById('tb_row_wrapper').querySelectorAll('[data-cid]');
					batch = Array.prototype.slice.call(batch);
					for (let i = batch.length-1; i>-1; --i) {
						let model = tb_app.Models.Registry.lookup(batch[i].getAttribute('data-cid'));
						if (model) {
							model.trigger('change:view', batch[i]);
						}
					}
					tb_app.toolbar.setElement( $('#tb_toolbar') ).render();
					tb_app.toolbarCallback();
					
					tb_app.Instances.Builder[0].setElement($('#tb_row_wrapper'));
					tb_app.Instances.Builder[0].init(true);
				}
			}
		},
		manageState( props ) {
			if ( 'undefined' === typeof tb_app || this.stateInit ) return;
			this.stateInit = true;
			tb_app.vent.on('dom:change', function () {
				if (tb_app.hasChanged) {
					props.setAttributes({data: builderBlcok.number++ });
				}
			});
			tb_app.vent.on('backend:switchfrontend', function(url){
				window.top.location.href = url;
			});
			document.getElementById('block-'+props.clientId).removeAttribute('tabIndex');
		},
		saveBlock(){
			if ( 'undefined' === typeof tb_app ) return;
			if ( onClicking ) {
				onClicking = false;
				return;
			}

			if ( tb_app.hasChanged ) {
				tb_app.Utils.saveBuilder(this.goToFrontend);
			} else {
				this.goToFrontend();
			}
		},
		goToFrontend(){
			if ( tb_app.redirectFrontend ) {
				tb_app.vent.trigger('backend:switchfrontend', tb_app.redirectFrontend);
			}
		}
	},
	save_block =function(){
		builderBlcok.saveBlock();
	};
		
	blocks.registerBlockType( 'themify-builder/canvas', {
		title: 'Themify Builder',
		icon: 'layout',
		category: 'layout',
		useOnce: true,
		edit( props ) {
			setTimeout(function(){
				builderBlcok.saveHTML( props );
				builderBlcok.restoreHTML( props );

				builderBlcok.manageState( props );
				Themify.trigger('tb_canvas_loaded');
			}, 800);
			return el('div',{ id: 'tb_canvas_block'}, 'placeholder builder' );
		},
		save() {
			return null; // render with PHP
		}
	} );

	$(function(){
		$('body').on('click', '.editor-post-publish-button, .editor-post-save-draft', function(e){
			if ( tb_app.hasChanged ) {
				tb_app.Utils.saveBuilder(function(){
					onClicking = true;
				});
			}
		}).off('click.frontend-btn', '#tb_switch_frontend').on('click.frontend-btn', '#tb_switch_frontend', function(){

			$('.editor-post-publish-button').on('DOMSubtreeModified', function() {
				if(!this.classList.contains('is-busy') && !$('.editor-post-saved-state').length){
					 onClicking = false;
					 save_block();
				}
			});
		});
	});

	$( document ).ajaxComplete(function( e, xhr, settings ) {
		if('POST' === settings.type && window['themifyBuilder']!==undefined&& themifyBuilder.post_ID){
			const url  = settings.url,
				callbackUrl = 'post.php?post=' + themifyBuilder.post_ID + '&action=edit&classic-editor=1&meta_box=1';
			
			if (url.indexOf(callbackUrl) !== -1 ) {
				setTimeout(save_block,800);
			}
		}
	});

} )(window.wp.blocks,window.wp.i18n,window.wp.element,jQuery);
