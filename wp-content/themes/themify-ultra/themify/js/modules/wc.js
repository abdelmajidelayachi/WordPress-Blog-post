/**
 * WC module
 */
;
(($,Themify, doc)=>{
    'use strict';
	let isLoading=false,
	photoswipeLoading=false,
	isVariationChange=false,
	v_select = doc.querySelector('form.variations_form select'),
	_clickedItems=[];
	const self=Themify,
		variantionURL=themify_vars.wc_js['wc-add-to-cart-variation'],
		variantionImagesUrl=themify_vars.wc_js['wc_additional_variation_images_script'],
		order=doc.getElementsByClassName('woocommerce-ordering')[0],
		change=function(){
			this.closest( 'form' ).submit();
		},
		n_inputs = doc.querySelectorAll( 'input.qty[min]' ),
		phottoSwipe=function(e){
			if(!photoswipeLoading && themify_vars.photoswipe){
				photoswipeLoading=true;
				e.preventDefault();
				e.stopImmediatePropagation();
				const v=themify_vars.wc_version,
				self=this,
				checkLoad = (k)=>{
					delete themify_vars.photoswipe[k];
					if(Object.keys(themify_vars.photoswipe).length===0){
						setTimeout(()=>{
							self.click();
						},5);//jquery ready has delay
						delete themify_vars.photoswipe;
					}
				};
				Themify.LoadCss(themify_vars.photoswipe['main'], v, null, null, ()=>{
						checkLoad('main');
				})
                                .LoadCss(themify_vars.photoswipe['skin'], v, null, null, ()=>{
						checkLoad('skin');
				});
			}
		},
		load=(e,fragments, cart_hash, $button)=>{
			const args = themify_vars.wc_js,
				v=themify_vars.wc_version,
				loadAll=e && e!==true,
				checkLoad=(k)=>{
					delete args[k];
					if(Object.keys(args).length===0){
						self.body.off('click.tf_wc_click').off('added_to_cart removed_from_cart',addRemoveEvent);
						if(order){
							order.removeEventListener('change',change,{passive:true,once:true});
						}
						setTimeout(()=>{
							if(e && e!==true && e!=='load'){
								if(e.type==='click'){
									for(let i=0,len=_clickedItems.length;i<len;++i){
										if(self.body[0].contains(_clickedItems[i])){
											_clickedItems[i].click();
										}
									}
								}
								else{
									Themify.body.triggerHandler(e.type,[fragments, cart_hash, $button]);
								}
							}
							_clickedItems=null;
							Themify.trigger('tf_wc_js_load');
						},5);//jquery ready has delay
					}
				},
				loadWc=()=>{
					if(args['woocommerce']){
						self.LoadAsync(args['woocommerce'], ()=>{
							checkLoad('woocommerce');
						}, (args['woocommerce'].indexOf('ver=',12)===-1?v:false),null,()=>{
							return $.scroll_to_notices!==undefined;
						});
					}
					else{
						checkLoad('woocommerce');
					}
				},
				loadVariantions=()=>{
					const forms = doc.getElementsByClassName('variations_form');
					if(forms[0] || doc.getElementsByClassName('wcpa_form_outer').length>0){
						if (variantionImagesUrl) {
							if(!$.wc_additional_variation_images_frontend){
								self.LoadAsync(variantionImagesUrl,(variantionImagesUrl.indexOf('ver=',12)===-1?v:false),false,null,()=>{
									return $.wc_additional_variation_images_frontend!==undefined;
								});
							}
						}
						self.LoadAsync(themify_vars.includesURL + 'js/underscore.min.js', ()=>{
							self.LoadAsync(themify_vars.includesURL + 'js/wp-util.min.js', ()=>{
								const _callback=()=>{
									for(let i=forms.length-1;i>-1;--i){
										$(forms[i]).wc_variation_form();
									}
									if(v_select && isVariationChange){
										Themify.triggerEvent(v_select, 'change');
									}
									v_select=isVariationChange=null;
								};
								if($.fn.wc_variation_form){
									_callback();
								}
								else{
									self.LoadAsync(variantionURL,_callback,v,null, ()=> {
										return 'undefined' !== typeof $.fn.wc_variation_form;
									});
								}
							}, themify_vars.wp, null, ()=> {
								return window.wp!==undefined && undefined!== window.wp.template;
							});
						}, themify_vars.wp, null, ()=> {
							return 'undefined' !== typeof window._;
						});
					}
				};
			if(loadAll===true){
				if(args['jquery-blockui']){
					if($.blockUI===undefined){
						self.LoadAsync(args['jquery-blockui'], ()=>{
							checkLoad('jquery-blockui');
						}, (args['jquery-blockui'].indexOf('ver=',12)===-1?v:false),null,()=>{
							return $.blockUI!==undefined;
						});
					}else{
						checkLoad('jquery-blockui');
					}
				}
				if(args['wc-add-to-cart']){
					self.LoadAsync(args['wc-add-to-cart'], ()=>{
						checkLoad('wc-add-to-cart');
						loadVariantions();
					},(args['wc-add-to-cart'].indexOf('ver=',12)===-1?v:false),null,()=>{
						return themify_vars.wc_js_normal!==undefined;
					});
				}else{
					loadVariantions();
				}
				if(!$.fn.wc_product_gallery && typeof wc_single_product_params!=='undefined'){
					if(args['wc-single-product']){
						self.LoadAsync(args['wc-single-product'], ()=>{
							checkLoad('wc-single-product');
							Themify.trigger('tf_init_photoswipe');
						}, (args['wc-single-product'].indexOf('ver=',12)===-1?v:false),null,()=>{
							return $.fn.wc_product_gallery!==undefined;
						});
					}
				}
				else{
					delete args['wc-single-product'];
				}
			}
			if(args['js-cookie']){
				self.LoadAsync(args['js-cookie'], ()=>{
					checkLoad('js-cookie');
					self.LoadAsync(args['wc-cart-fragments'], ()=>{
						checkLoad('wc-cart-fragments');
					},(args['wc-cart-fragments'].indexOf('ver=',12)===-1?v:false),null,()=>{
						return themify_vars.wc_js_normal!==undefined;
					});
					if(loadAll===true){
						loadWc();
					}
				}, (args['js-cookie'].indexOf('ver=',12)===-1?v:false),null,()=>{
					return !!window['Cookies'];
				});
			}
			else{
				loadWc();
			}
		},
		addRemoveEvent=(e, fragments, cart_hash, $button)=>{
			if(isLoading===false){
				isLoading=true;
				load(e, fragments, cart_hash, $button);
			}
		},
		wcAccTabs=()=>{
			const accordion = doc.getElementsByClassName('tf_wc_accordion')[0];
			if(accordion){
				Themify.LoadAsync(Themify.jsUrl+Themify.js_modules.wcacc.u, function () {
					Themify.trigger('tf_wc_acc_tabs_init',[accordion]);
				},Themify.js_modules.wcacc.v);
			}
		};
		self.body.one('added_to_cart removed_from_cart',addRemoveEvent)
		.on('click.tf_wc_click','.ajax_add_to_cart,.remove_from_cart_button',(e)=>{
			e.preventDefault();
			e.stopImmediatePropagation();
			if(!e.target.classList.contains('loading')){
				_clickedItems.push(e.target);
				e.target.classList.add('loading');
			}
			if(isLoading===false){
				isLoading=true;
				load(e);
			}
		});
		// Load Variation JS only on select variable
		if(v_select!==null){
			const variationCallback = (e)=>{
				if(v_select && !isVariationChange){
					const ev=Themify.isTouch?'touchstart':'mousemove';
					window.removeEventListener('scroll', variationCallback, {once:true, passive:true});
					window.removeEventListener(ev, variationCallback, {once:true, passive:true});
					v_select.removeEventListener('change',variationCallback,{once:true,passive:true});
					if(e && e.type==='change'){
						e.stopImmediatePropagation();
					}
					if(isLoading===false){
						isLoading=isVariationChange=true;
						load('load');
					}
				}
			};
			window.addEventListener('scroll', variationCallback, {once:true, passive:true});
			window.addEventListener((Themify.isTouch?'touchstart':'mousemove'), variationCallback, {once:true, passive:true});
			v_select.addEventListener('change',variationCallback,{once:true,passive:true});
			Themify.requestIdleCallback(variationCallback,1500);
		}
		if(order){
			order.addEventListener('change',change,{passive:true,once:true});
		}
		for(let k=n_inputs.length-1;k>-1;k--){
			let min = parseFloat( n_inputs[k].min );
			if ( min >= 0 && parseFloat( n_inputs[k].value ) < min ) {
				n_inputs[k].value=min;
			}
		}
		delete themify_vars.wc_js['wc-add-to-cart-variation'];
		delete themify_vars.wc_js['wc_additional_variation_images_script'];
		Themify.on('tf_wc_init',(force)=>{
			if(force===true || doc.getElementsByClassName('woocommerce-input-wrapper')[0] || doc.getElementsByClassName('woocommerce-store-notice')[0]){
				load('load');
			}
			else{
				load(true);
			}
			wcAccTabs();
			Themify.trigger('tf_init_photoswipe');
		})
		.on('tf_init_photoswipe',(el)=>{
			if(!$.fn.wc_product_gallery || typeof wc_single_product_params==='undefined'){
				return;
			}
			if(!wc_single_product_params.photoswipe_enabled){
				Themify.off('tf_init_photoswipe');
				return;
			}
			if(!el){
				el=doc;
			}
			const items=el.getElementsByClassName('woocommerce-product-gallery');
			for(let i=items.length-1;i>-1;--i){
				let wrap=$( items[i] );
				if(!wrap.data('product_gallery')){
					wrap.wc_product_gallery( wc_single_product_params );
					let fSlider = wrap.data('flexslider');
					if(fSlider){
						setTimeout(fSlider.resize.bind(fSlider),100);
					}
				}
				if(!photoswipeLoading){
					let item=items[i].getElementsByClassName('woocommerce-product-gallery__trigger')[0];
					if(item){
						item.addEventListener('click',phottoSwipe,{once:true});
					}
				}
				
			}
		}).trigger('tf_init_photoswipe');
		
})(jQuery,Themify, document);
