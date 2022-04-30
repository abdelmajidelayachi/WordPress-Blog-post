/**
 * Sticky Buy Button
 */
;
((Themify, themify_vars, $,doc)=>{
	'use strict';
	const _init = (wrap)=>{
			const pr_wrap = doc.querySelector('#content .product');
			if(pr_wrap){
				Themify.LoadCss(themify_vars.theme_url + '/styles/wc/modules/single/sticky-add-cart.css', themify_vars.theme_v, null, null, ()=>{
					const container = doc.createElement('div'),
					product = doc.createElement('div'),
					summary = doc.createElement('div'),
					gallery = doc.createElement('div'),
					ind = doc.getElementById('tf_sticky_form_wrap');
					container.className = 'tf_box pagewidth tf_clearfix';
					product.id = pr_wrap.id;
					product.className = pr_wrap.classList;
					// Image
					gallery.className = 'images';
					gallery.appendChild(pr_wrap.getElementsByClassName('woocommerce-product-gallery__image')[0].cloneNode(true));
					product.appendChild(gallery);
					summary.className = 'summary entry-summary';
					// Title
					summary.appendChild(doc.querySelector('.product .product_title').cloneNode(true));
					// Price
					summary.appendChild(doc.querySelector('.product .price').cloneNode(true));
					// Form
					const pr_form = pr_wrap.querySelector('form.cart');
					ind.style.height = pr_form.getBoundingClientRect().height+'px';
					summary.appendChild(pr_form);
					product.appendChild(summary);
					wrap.dataset.url = '';
					container.appendChild(product);
					wrap.appendChild(container);
					wrap.classList.add('tf_st_show');
				});
			}
		},
		_move_form = (el, act)=>{
			const obs_el = doc.getElementById('tf_sticky_form_wrap'),
				form = 'hide' === act ? el.querySelector('form.cart') : doc.querySelector('form.cart');
			if(!form){
				return;
			}
			if('hide' === act){
				obs_el.appendChild(form);
				obs_el.style.height = null;
			}else{
				const ind = el.getElementsByClassName('images')[0];
				obs_el.style.height = form.getBoundingClientRect().height+'px';
				ind.parentNode.insertBefore(form, ind.nextSibling);
			}
			const $var_form = $('.variations_form');
			if($var_form.length>0){
				$var_form.trigger( 'check_variations' );
			}
		};
	Themify.on('themify_theme_sticky_add_cart_init',_init).on('themify_theme_sticky_add_cart_switched',_move_form);

})(Themify, themify_vars, jQuery,document);