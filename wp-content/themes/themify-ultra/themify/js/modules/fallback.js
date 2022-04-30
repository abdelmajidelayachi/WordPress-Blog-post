(function (window,document) {
    'use strict';
	if(!window['IntersectionObserver']){
		var removeClass=function(el,cl){
			if (el.classList) {
				el.classList.remove(cl);
			} else {
				el.className = el.className.replace(' '+cl,'').replace(cl,'');
			}
		},
		windowLoad=function(){
			var items =document.getElementsByClassName?document.getElementsByClassName('wow'):document.querySelectorAll('.wow');
			for(var i=items.length-1;i>-1;--i){
				 items[i].style['visibility'] = 'visible';
			}
			items = document.querySelectorAll('[data-lazy]');
			for(i=items.length-1;i>-1;--i){
				var el = items[i],
					tagName = el.tagName;
                if (!el || !el.hasAttribute('data-lazy')) {
                    if (el) {
                        el.removeAttribute('data-lazy');
                    }
                } else {
					if(tagName==='AUDIO' || tagName==='VIDEO'){
						removeClass(el.parentNode,'tf_lazy');
						removeClass(el.parentNode,'tf_'+tagName.toLowerCase()+'_lazy');
						if(el.getAttribute('preload')==='none'){
							var preload=el.getAttribute('data-preload');
							if(!preload){
								preload=tagName==='VIDEO'?'auto':'metadata';
							}
							if(tagName==='VIDEO'){
								el.className+=' tf_w';
								el.style['height']='auto';
								el.setAttribute('controls','controls');
							}
							el.setAttribute('preload',preload);
						}
					}
                    el.removeAttribute('data-lazy');
                    if (tagName!=='IMG' && (tagName === 'DIV' || !el.hasAttribute('data-tf-src'))) {
						removeClass(el,'tf_lazy');
                    } else if (tagName !== 'svg') {
						removeClass(el,'tf_svg_lazy');
                        var src = el.getAttribute('data-tf-src'),
                                srcset = el.getAttribute('data-tf-srcset');
                        if (src) {
                            el.setAttribute('src', src);
                            el.removeAttribute('data-tf-src');
                        }
                        if (srcset) {
							var sizes=el.getAttribute('data-tf-sizes');
							if(sizes){
								el.setAttribute('sizes', sizes);
								el.removeAttribute('data-tf-sizes');
							}
                            el.setAttribute('srcset', srcset);
                            el.removeAttribute('data-tf-srcset');
                        }
                        el.removeAttribute('loading');
                    }
                }
			}
			document.body.className+=' page-loaded';
		};
		if (document.readyState === 'complete' || !window.addEventListener) {
			windowLoad();
		} 
		else {
			window.addEventListener('load', windowLoad,false);
		}
	}	
}(window,document));