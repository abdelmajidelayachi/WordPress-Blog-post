/**
 * wow module
 */
;
((Themify)=>{
    'use strict';
    let is_working=false;
	const hoverCallback=function() {
		if (is_working === false) {
			is_working = true;
			const animation = this.style['animationName'],
				hover=this.getAttribute('data-tf-animation_hover');
			if (animation) {
				this.style['animationIterationCount']=this.style['animationDelay']=this.style['animationName'] = '';
				this.classList.remove(animation);
			}
			this.addEventListener('animationend',function(e){
				this.classList.remove('animated','tb_hover_animate',e.animationName);
				this.style['animationName'] = '';
				is_working = false;
			},{passive:true,once:true});
			this.style['animationName'] = hover;
			this.classList.add('animated','tb_hover_animate',hover);
		}
	},
	hover=(el)=>{
		const ev=Themify.isTouch?'touchstart':'mouseenter',
		events = [ev,'tf_custom_animate'];
		for (let i = events.length - 1; i > -1; --i) {
			el.removeEventListener(events[i], hoverCallback, {passive: true});
			el.addEventListener(events[i], hoverCallback, {passive: true});
		}
	},
	animate=function(el) {
		Themify.imagesLoad(el, (item)=>{
			item.style['visibility'] = 'visible';
			if (item.hasAttribute('data-tf-animation')) {
					if (item.hasAttribute('data-tf-animation_repeat')) {
							item.style['animationIterationCount'] = item.getAttribute('data-tf-animation_repeat');
					}
					if (item.hasAttribute('data-tf-animation_delay')) {
							item.style['animationDelay'] = item.getAttribute('data-tf-animation_delay') + 's';
					}
					const cl=item.getAttribute('data-tf-animation');
					item.classList.add(cl);
					item.style['animationName'] = cl;
					item.addEventListener('animationend', function () {
						this.style['animationIterationCount']=this.style['animationDelay']='';
						this.classList.remove('animated',cl);
						this.removeAttribute('data-tf-animation');
					}, {passive: true, once: true});
					item.classList.add('animated');
			}
			if (item.classList.contains('hover-wow')) {
				hover(item);
			}
		});
	},
	observer= new IntersectionObserver((entries, _self)=>{
			for (let i = entries.length - 1; i > -1; --i) {
				if (entries[i].isIntersecting === true) {
					_self.unobserve(entries[i].target);
					animate(entries[i].target);
				}
			}
	}, {
		threshold: .01
	}),
	init=(items)=>{
		if (items instanceof jQuery) {
			items = items.get();
		}	
		for (let i = items.length - 1; i > -1; --i) {
			observer.observe(items[i]);
		}
	};
    Themify.on('tf_wow_init',  ( items)=> {
        if (!Themify.cssLazy['animate']) {
            Themify.loadAnimateCss(() =>{
                init(items);
            });
        }
        else {
            init(items);
        }
    });

})(Themify);