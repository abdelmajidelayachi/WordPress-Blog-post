;
(($, Themify, themify_vars, themifyScript)=>{
	'use strict';
	if(Themify.body[0].classList.contains('slide-cart')){
		const icon = document.querySelectorAll('a[href="#slide-cart"]');
		if(icon.length > 0){
			Themify.sideMenu(icon, {
				close:'#cart-icon-close',
				beforeShow(){
					Themify.LoadCss(themify_vars.theme_url + '/styles/wc/modules/basket.css', themify_vars.theme_v);
				}
			});
		}
	}
	let isWorking = false;
	const icons = Themify.body[0].querySelectorAll('#headerwrap .icon-shopping-cart');
	Themify.body.on('added_to_cart removed_from_cart', function(e){
		const cartButton = $('.cart-icon');
		if(cartButton.hasClass('empty-cart')){
			if(e.type === 'added_to_cart'){
				cartButton.removeClass('empty-cart');
			}else if(parseInt($('.cart-icon-link span').text()) <= 0){
				cartButton.addClass('empty-cart');
			}
		}
		if(e.type === 'added_to_cart'){
			for(let i = icons.length - 1; i > -1; --i){
				icons[i].classList.remove('tf_loader');
			}
			if(isWorking === false && themifyScript.ajaxCartSeconds){
				isWorking = true;
				let seconds = parseInt(themifyScript.ajaxCartSeconds);
				const el = document.querySelector(Themify.isTouch ? '#mobile-menu .cart-icon-link' : '.header-icons .cart-icon-link');
				if(el !== null){
					const panelId = el.getAttribute('href'),
						panel = document.getElementById(panelId.replace('#', ''));
					if(panel !== null){
						Themify.on('sidemenushow.themify', function(panel_id, side, _this){
							if(panelId === panel_id){
								setTimeout(()=>{
									if($(panel).is(':hover')){
										panel.addEventListener('mouseleave', function(){
											_this.hidePanel();
											Themify.body[0].classList.remove('tf_auto_cart_open');
										}, {once:true, passive:true});
									}else{
										_this.hidePanel();
										Themify.body[0].classList.remove('tf_auto_cart_open');
									}
									isWorking = false;
								}, seconds);
							}
						}, true);
						Themify.body[0].classList.add('tf_auto_cart_open');
						setTimeout(()=>{
							el.click();
						}, 100);
					}
				}
			}
		}
	}).on('click', '.remove-item-js', function(e){
		e.preventDefault();
		// AJAX add to cart request
		const $thisbutton = $(this),
			data = {
				action:'theme_delete_cart',
				remove_item:$thisbutton.attr('data-product-key')
			},
			$addedButton = $('.ajax_add_to_cart'),
			removedURL = $thisbutton.parent().find('.product-title a').attr('href');
		$thisbutton.removeClass('tf_close').addClass('tf_loader');
		// Ajax action
		$.post(woocommerce_params.ajax_url, data, function(response){
			const fragments = response.fragments,
				cart_hash = response.cart_hash;

			// Changes button classes
			if($thisbutton.parent().find('.added_to_cart').length === 0)
				$thisbutton.addClass('added');

			// Replace fragments
			if(fragments){
				$.each(fragments, function(key, value){
					$(key).addClass('updating').replaceWith(value);
				});
				if(!$(fragments['#shopdock-ultra']).find('.cart-total').length){
					$('#cart-icon-close').trigger('click');
				}
			}
			if($addedButton.length){
				$addedButton.each(function(){
					if($(this).hasClass('added') && $(this).closest('.post-content').find('[href="' + removedURL + '"]').length){
						$(this).removeClass('added').siblings('.added_to_cart').remove();
					}
				});
			}
			// Trigger event so themes can refresh other areas
			Themify.body.triggerHandler('removed_from_cart', [fragments, cart_hash]);
			$thisbutton.removeClass('tf_loader').addClass('tf_close');

		});
	}).on('adding_to_cart', function(){
		for(let i = icons.length - 1; i > -1; --i){
			icons[i].className += ' tf_loader';
		}
	});
	if ( typeof wc_add_to_cart_params !== 'undefined' ) {
		Themify.body.on('click', '.remove_from_cart_button', function(e){
			e.preventDefault();
			this.classList.remove('tf_close');
			this.classList.add('tf_loader');
		});
	}
	// Ajax add to cart in single page
	if(themifyScript.ajaxSingleCart){
		const form = document.querySelector('form.cart');
		if(form){
			form.addEventListener('submit', function(e){
				if(this.closest('.product-type-external') !== null){
					return;
				}
				// WooCommerce Subscriptions plugin compatibility
				if(window.location.search.indexOf('switch-subscription') > -1)
					return this;

				e.preventDefault();

				const data = new FormData(this),
					btn = this.getElementsByClassName('single_add_to_cart_button')[0],
					add_to_cart = this.querySelector('[name="add-to-cart"]');
				if(add_to_cart.tagName !== 'INPUT'){
					data.append('add-to-cart', add_to_cart.value);
				}
				if(btn){
					btn.classList.remove('added');
					btn.classList.add('loading');
				}

				Themify.body.triggerHandler('adding_to_cart', [this.querySelector('[type="submit"]'), data]);
				fetch(woocommerce_params.wc_ajax_url.toString().replace( '%%endpoint%%', 'theme_add_to_cart' ), {
					method:'POST', headers:new Headers({
						'Accept':'application/json',
						'X-Requested-With':'XMLHttpRequest'
					}), body:data
				})
					.then(res => res.redirected || res.json())
					.then(response => {
						if(!response){
							return;
						}
						if(themifyScript.redirect){
							window.location.href = themifyScript.redirect;
							return;
						}
						const fragments = response.fragments,
							cart_hash = response.cart_hash;
						// Block fragments class
						if(fragments){
							const keys = Object.keys(fragments);
							let els = null;
							for(let i = keys.length - 1; i > -1; i--){
								els = document.querySelectorAll(keys[i]);
								for(let k = els.length - 1; k > -1; k--){
									els[k].className += ' updating';
									els[k].outerHTML = fragments[keys[i]];
								}
							}
						}
						if(btn){
							btn.classList.remove('loading');
							btn.classList.add('added');
						}
						// Trigger event so themes can refresh other areas
						Themify.body.triggerHandler('added_to_cart', [fragments, cart_hash]);
					});
			});
		}
	}
})(jQuery, Themify, themify_vars, themifyScript);
