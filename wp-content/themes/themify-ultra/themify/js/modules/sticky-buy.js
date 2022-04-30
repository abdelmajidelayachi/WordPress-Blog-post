/**
 * Sticky Buy Button
 */
;
((Themify, $,doc)=>{
	'use strict';
	const _init = (pr_wrap,wrap)=>{
			const container = doc.createElement('div'),
				product = doc.createElement('div'),
				img_wrap = doc.createElement('div'),
				summary = doc.createElement('div'),
				pr_form = pr_wrap.querySelector('form.cart'),
				pr_title = !pr_wrap.classList.contains('tbp_template')?pr_wrap.querySelector('.product_title'):pr_wrap.querySelector('.module-product-title .tbp_title'),
				pr_price = pr_wrap.getElementsByClassName('price')[0],
				pr_image = pr_wrap.getElementsByClassName('woocommerce-product-gallery__image')[0],
				ind = doc.getElementById('tf_sticky_form_wrap');
			container.className = 'tf_box pagewidth clearfix';
			product.id = pr_wrap.id;
			product.className = pr_wrap.classList;
			//wrap image
			img_wrap.className = 'tf_sticky_prod_img';
			// Image
			if(pr_image!==undefined){
				const gallery = doc.createElement('div');
				gallery.className = 'images';
				gallery.appendChild(pr_image.cloneNode(true));
				img_wrap.appendChild(gallery);
			}
			summary.className = 'summary entry-summary';
			// Title
			if(pr_title!==null){
				const t = doc.createElement('span');
				t.className = pr_title.className;
				t.innerHTML = pr_title.innerHTML;
				summary.appendChild(t);
			}
			// Price
			if(pr_price!==undefined){
				summary.appendChild(pr_price.cloneNode(true));
			}
			img_wrap.appendChild(summary);
			product.appendChild(img_wrap);
			// Form
			ind.style.height = pr_form.getBoundingClientRect().height+'px';
			product.appendChild(pr_form);
			container.appendChild(product);
			wrap.appendChild(container);
			_pw_padding(pr_wrap.classList.contains('tbp_template')?pr_wrap:doc.getElementById('pagewrap'),wrap,'show');
		},
		_pw_padding = (wrap,el,act)=>{
			wrap.style.paddingBottom = act==='show'?el.getBoundingClientRect().height + 'px':'';
		},
		_move_form = (wrap,el, act)=>{
			const obs_el = doc.getElementById('tf_sticky_form_wrap'),
				form = 'hide' === act ? el.querySelector('form.cart') : doc.querySelector('form.cart'),
				$var_form = $('.variations_form');
			if(!form){
				return;
			}
			if('hide' === act){
				obs_el.appendChild(form);
				obs_el.style.height = '';
			}else{
				obs_el.style.height = form.getBoundingClientRect().height+'px';
				el.getElementsByClassName('product')[0].appendChild(form);
			}
			if($var_form.length>0){
				$var_form.trigger( 'check_variations' );
			}
			_pw_padding(wrap,el,act);
		};
	Themify.on('tf_sticky_buy_init', (pr_wrap,el)=>{
		const wrap=pr_wrap.classList.contains('tbp_template')?pr_wrap:doc.getElementById('pagewrap');
		Themify.on('tfsmartresize', () =>{
			_pw_padding(wrap,el,(el.classList.contains('tf_st_show')?'show':'hide'));
		});
		_init(pr_wrap,el);
		const observer = new IntersectionObserver((entries)=>{
			if (!entries[0].isIntersecting && entries[0].boundingClientRect.top<0) {
				_move_form(wrap,el,'show');
				el.classList.add('tf_st_show');
			} else {
				_move_form(wrap,el,'hide');
				el.classList.remove('tf_st_show');
			}
		});
		observer.observe(doc.getElementById('tf_sticky_buy_observer'));
	},true);
})(Themify, jQuery,document);