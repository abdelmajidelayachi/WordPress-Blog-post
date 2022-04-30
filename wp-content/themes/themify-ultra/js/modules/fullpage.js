/* fullpage */
;
(( Themify, document, window, themifyScript)=>{
	'use strict';
	let scrolling = false,
		isLargeScrolling=false,
		wrapper,
		duration = 0,
		pagesCount = 0,
		currentIndex = 0,
		initOnce = false,
		isHorizontal = false,
		normalHeight=Themify.h,
		realFixedHeight=0,
		realNormalHeight=0,
		fixedHeight=0,
		hasFixedHeader=false,
		has_footer=false,
		isDisabled=false,
		prevTime=0,
		req2,
		scrollings=[],
		prevbreakpoint,
		deltaY,
		prevHash = ''; /* used for detecting movement in touch devices */
	const _is_retina = window.devicePixelRatio > 1,
			snakeScroll = !Themify.body[0].classList.contains( 'full-section-scrolling-single' ),
			_CLICK_ = !Themify.isTouch ? 'click' :'touchstart',
			_ISPARALLAX_ = themifyScript['fullpage_parallax'] !== undefined,
			_MOBILE_BREAKPOINT_ = themifyScript['f_s_d'] ? parseInt(themifyScript['f_s_d']) : null,
			run = (w)=> {
				window.scroll(0, 0);
				scrolling=false;
				currentIndex=0;
				if(!duration){
					duration = parseFloat(window.getComputedStyle(wrapper).transitionDuration);
					if (duration < 100) {
						duration *= 1000;
					}
				}
				_create(w);
				_verticalNavigation();
				if (initOnce === false) {
					main();
				}
				document.addEventListener('keydown', _keydown, {passive: true});
				document.addEventListener('wheel', _wheel, {passive: true});
				if (Themify.isTouch) {
					wrapper.addEventListener((window.PointerEvent ? 'pointerdown' : 'touchstart'), _touchstart, {passive: true});
				}
			},
			_disable=()=>{
				isDisabled=true;
				document.removeEventListener('keydown', _keydown, {passive: true});
				document.removeEventListener('wheel', _wheel, {passive: true});
				wrapper.removeEventListener((window.PointerEvent ? 'pointerdown' : 'touchstart'), _touchstart, {passive: true});
				const mainNav=document.getElementById('fp-nav'),
					childs=wrapper.children;
				if(mainNav){
					mainNav.remove();
				}
				wrapper.style['transform']='';
				if(has_footer===true){
					const footer = document.getElementById('footerwrap');
					if(footer){
						const r_footer = footer.parentNode.parentNode;
						Themify.body[0].appendChild(footer);
						r_footer.remove();
					}
				}
				for(let i=childs.length-1;i>-1;--i){
					let item=childs[i];
					if(item.classList.contains('fp-section-container-horizontal')){
						let rows=item.getElementsByClassName('fp-section-container-inner')[0].children,
							fr=document.createDocumentFragment();
							for(let j=rows.length-1;j>-1;--j){
								let r=rows[j].getElementsByClassName('module_row')[0],
								inner=r.getElementsByClassName('row_inner')[0];
								if(_ISPARALLAX_){
									r.style['transform']=r.style['transition']='';
								}
								if(inner){
									inner.style['paddingBottom']=inner.style['paddingTop']='';
									inner.classList.remove('tf_scrollbar');
								}
								fr.appendChild(r);
							}
							item.after(fr);
							item.remove();
					}
					else{
						let r=item.getElementsByClassName('module_row')[0],
							inner=r.getElementsByClassName('row_inner')[0];
						
						if(_ISPARALLAX_){
							r.style['transform']=r.style['transition']='';
						}
						if(inner){
							inner.style['paddingBottom']=inner.style['paddingTop']='';
							inner.classList.remove('tf_scrollbar');
						}
						item.after(r);
						item.remove();
					}
				}
				Themify.lazyDisable = null;
				Themify.lazyLoading();
				if (typeof tbLocalScript !== 'undefined' && tbLocalScript['scrollHighlight']) {
					delete tbLocalScript['scrollHighlight']['scroll'];
					if (typeof ThemifyBuilderModuleJs !== 'undefined') {
						ThemifyBuilderModuleJs.InitScrollHighlight();
					}
				} else {
					Themify.trigger('tb_scroll_highlight_enable');
				}
				Themify.body[0].classList.remove('full-section-scrolling','fullpage-footer');
			},
			_getCurrentBreakPoint=(w)=>{
					if(!w){
						w=Themify.w;
					}
					const points=themifyScript.breakpoints;
					 if (w <=points.mobile) {
						return 'mobile';
					} 
					if (w <= points.tablet[1]) {
						return 'tablet';
					} 
					if (w <=points.tablet_landscape[1]) {
						return 'tablet_landscape';
					}
				return 'desktop';
			},
			isOverflow=(node)=> {
				  if (node === null || node === Themify.body[0] || node===document.documentElement || node.classList.contains('fp-section-container') ||node.classList.contains('tf_scrollbar')) {
						return false;
				  }
				  if(node.scrollHeight > node.clientHeight){
					const overflowY=window.getComputedStyle(node).overflowY;
					if(overflowY==='auto' || overflowY==='scroll' || overflowY==='overlay'){
						return true;
					}
				  }
				  return isOverflow(node.parentNode);
			},
			_getPaddings=(el,bp)=>{
				let padding=el.getAttribute('data-'+bp+'-pd');
				if(!padding){
					return false;
				}
				padding=padding.split(' ');
				if(padding[1]===undefined){
					padding[1]=padding[0];
				}
				return padding;
			},
			_create = (w)=> {
				if(has_footer===true){
					const footer = document.getElementById('footerwrap');
					if(footer && !footer.parentNode.classList.contains('module_row')){
						footer.classList.add('module_row','fullheight');
						const r_footer = document.createElement('div');
						r_footer.className = 'module_row fullheight';
						r_footer.appendChild(footer);
						wrapper.appendChild(r_footer);
					}
				}
				const childs = wrapper.children,
					bp=_getCurrentBreakPoint(w),
					lazyItems = [];
				for (let i = childs.length - 1; i > -1; --i) {

					if (childs[i]) {
						let el = childs[i],
							cl = el.classList;
						if (!cl.contains('fp-section-container')) {
							let vHeight=i===0 || fixedHeight===0?normalHeight:fixedHeight,
								row_inner,
								paddings=_getPaddings(el,bp);
							if (cl.contains('module_row_slide')) {
								let container = document.createElement('div'),
										elWrap = document.createElement('div'),
										inner = document.createElement('div');
								while (true) {
									let prev = el.previousElementSibling;
									if (prev !== null) {
										let br = prev.classList.contains('module_row_section');
										if (prev.classList.contains('module_row_slide') || br) {
											let wrap = document.createElement('div'),
											_row_inner=prev.getElementsByClassName('row_inner')[0];
											const paddings=_getPaddings(prev,bp);
											wrap.className = 'fp-section-container tf_w tf_h tf_overflow';
											if(paddings[0]!==''){
												_row_inner.style['paddingTop']=paddings[0];
											}
											if(paddings[1]!==''){
												_row_inner.style['paddingBottom']=paddings[1];
											}
											_row_inner.className += ' tf_scrollbar';
											prev.after(wrap);
											wrap.appendChild(prev);
											
											inner.prepend(wrap);
											
											if(br){
												break;
											}
										}
									} else {
										break;
									}
								}
								container.className = 'fp-section-container-horizontal tf_w tf_rel tf_overflow';
								container.style['height']=vHeight+'px';
								inner.className = 'fp-section-container-inner tf_rel tf_w tf_h';
								elWrap.className = 'fp-section-container tf_w tf_h tf_overflow';
								row_inner=el.getElementsByClassName('row_inner')[0];
								row_inner.className += ' tf_scrollbar';
								container.appendChild(inner);
								el.after(container);
								inner.appendChild(el);
								el.after(elWrap);
								elWrap.appendChild(el);
								horizontalNavigation(inner);
							} 
							else if (!cl.contains('fp-section-container-horizontal')) {
								let wrap = document.createElement('div');
								row_inner=el.getElementsByClassName('row_inner')[0];
								wrap.className = 'fp-section-container tf_w tf_overflow';
								wrap.style['height']=vHeight+'px';
								if(row_inner!==undefined){
									row_inner.className += ' tf_scrollbar';
								}
								el.after(wrap);
								wrap.appendChild(el);
							}
							if(row_inner!==undefined){
								if(paddings[0]!==''){
									row_inner.style['paddingTop']=paddings[0];
								}
								if(paddings[1]!==''){
								
									row_inner.style['paddingBottom']=paddings[1];
								}
							}
						}
					}
				}
				if(initOnce===false){
					for (let allLazy = document.querySelectorAll('[data-lazy]'), i = allLazy.length - 1; i > -1; --i) {
						if (!wrapper.contains(allLazy[i])) {
							lazyItems.push(allLazy[i]);
						}
					}
					Themify.lazyDisable = null;
					Themify.lazyLoading(lazyItems);
					Themify.lazyDisable = true;
					for (let wowItems = wrapper.getElementsByClassName('wow'), i = wowItems.length - 1; i > -1; --i) {
						if (!wowItems[i].hasAttribute('data-tf-animation_delay')) {
							wowItems[i].setAttribute('data-tf-animation_delay', '.3');
						}
					}
				}
				pagesCount = childs.length;
			},
			main = ()=> {
				const currentHash = location.hash.replace('#', '').replace('!/', ''),
						_scrollTo = (anchor)=> {
							if (anchor.indexOf('/') !== -1) {
								anchor = anchor.substring(0, anchor.indexOf('/'));
							}
							if (anchor && '#' !== anchor) {
								anchor = anchor.replace('#', '');
								let sectionEl = wrapper.querySelector('[data-anchor="' + anchor + '"]');
								if (!sectionEl) {
									sectionEl = document.getElementById(anchor);
								}

								if (sectionEl !== null) {
									sectionEl = sectionEl.closest('.fp-section-container');
									if (sectionEl) {
										let verticalIndex = Themify.convert(sectionEl.parentNode.children).indexOf(sectionEl),
												horizontalIndex = undefined;
										const horizontal = sectionEl.closest('.fp-section-container-horizontal');
										if (horizontal) {
											horizontalIndex = verticalIndex;
											verticalIndex = Themify.convert(horizontal.parentNode.children).indexOf(horizontal);
										}
										scrollTo(verticalIndex, horizontalIndex, !initOnce);
										return true;
									}
								}
							}
							return false;
						},
						changeHash = (hash, onlyMenu)=> {
							if (prevHash !== hash) {
								prevHash = hash;
								_setActiveMenu(hash);
								if (onlyMenu === undefined) {
									if (hash && hash !== '#' && _scrollTo(hash)) {
										if (Themify.body[0].classList.contains('mobile-menu-visible')) {
											/* in Overlay header style, when a menu item is clicked, close the overlay */
											const menu = document.getElementById('menu-icon');
											if (menu) {
												menu.click();
											}
										}
										return true;
									}
								}
								return false;
							}
							Themify.trigger('themify_onepage_scrolled');
						};
				if (!currentHash || !changeHash(currentHash)) {
					scrollTo(currentIndex, undefined, true);
					Themify.trigger('themify_onepage_afterload');
				}
				setTimeout(()=> {
					window.addEventListener('hashchange', function (e) {
						if (initOnce === true && isDisabled===false) {
							changeHash(this.location.hash, true);
							 _scrollTo(this.location.hash);
						}
					}, {passive: true});

					Themify.body[0].addEventListener('click',  (e)=> {//should be click,browser break in mobile,after clicking to the link that target row id
						
						if (initOnce === true && isDisabled===false) {
							const el = e.target.closest('a');
							if (el) {
								let url = el.getAttribute('href');
								if (url && url !== '#' && url.indexOf('#') !== -1) {
									try {
										if(url.indexOf(location.protocol)===-1){
											url=location.protocol+'//'+location.host+location.pathname+url;
										}
										const path = new URL(url);
										if (path.hash && (url.indexOf('#') === 0 || (path.pathname === location.pathname && path.hostname === location.hostname))) {
											e.preventDefault();
											isLargeScrolling=true;
											changeHash(path.hash);
											isLargeScrolling=false;
										}
									} catch (_) {
									}
								}else if(el.classList.contains('scroll-next-row')){
									scrollTo('next');
								}
							}
						}
					});

					initOnce = true;
				}, 250);

			},
			horizontalNavigation =  (wrap)=> {
				const childs = wrap.children,
						fr = document.createDocumentFragment(),
						nav = document.createElement('ul'),
						prev = document.createElement('div'),
						next = document.createElement('div'),
						scrtxt = document.createElement('span');
				scrtxt.className='screen-reader-text';

				for (let i = 0, len = childs.length; i < len; ++i) {
					scrtxt.innerText=i+1;
					let li = document.createElement('li'),
							a = document.createElement('a');
					a.href = '#';
					a.appendChild(scrtxt.cloneNode(true));
					if (i === 0) {
						li.className = 'active';
					}
					li.appendChild(a);
					nav.appendChild(li);
				}
				scrtxt.remove();
				nav.className = 'fp-slidesNav';
				next.className = 'fp-controlArrow fp-next';
				prev.className = 'fp-controlArrow fp-prev';
				nav.addEventListener(_CLICK_, (e)=> {
					e.preventDefault();
					e.stopPropagation();
					const el = e.target.closest('li');
					if (el && !el.classList.contains('active')) {
						isLargeScrolling=true;
						scrollTo(currentIndex, Themify.convert(el.parentNode.children).indexOf(el));
						isLargeScrolling=false;
					}
				});

				next.addEventListener(_CLICK_, (e)=> {
					e.stopPropagation();
					let el = nav.querySelector('.active');
					el = (el && el.nextElementSibling) ? el.nextElementSibling : nav.firstElementChild;
					Themify.triggerEvent(el, e.type);
				}, {passive: true});

				prev.addEventListener(_CLICK_, (e)=> {
					e.stopPropagation();
					let el = nav.querySelector('.active');
					el = (el && el.previousElementSibling) ? el.previousElementSibling : nav.lastElementChild;
					Themify.triggerEvent(el, e.type);
				}, {passive: true});
				fr.appendChild(prev);
				fr.appendChild(next);
				fr.appendChild(nav);
				wrap.parentNode.appendChild(fr);
			},
			_verticalNavigation = ()=>{
				if (isHorizontal === false) {
					const nav = document.createElement('ul'),
							childs = wrapper.children,
						scrtxt = document.createElement('span');
					scrtxt.className='screen-reader-text';
					
					for (let i = 0; i < pagesCount; ++i) {
						scrtxt.innerText=i+1;
						let li = document.createElement('li'),
							a = document.createElement('a'),
							el = childs[i].getElementsByClassName('module_row')[0],
							id = el.getAttribute('data-row-title'),
							tooltip = document.createElement('div');

						a.href = '#';
						a.appendChild(scrtxt.cloneNode(true));
						if (i === currentIndex) {
							li.className = 'active';
						}
						li.appendChild(a);
						if (id === 'footerwrap') {
							id = '';
						} else if (!id) {
							id = _getAnchor(el);
						}
						if (id) {
							tooltip.className = 'fp-tooltip';
							tooltip.innerText = id;
							li.appendChild(tooltip);
						}
						nav.appendChild(li);
					}
					scrtxt.remove();
					nav.id = 'fp-nav';
					nav.className = 'fp-slidesNav';
					nav.addEventListener(_CLICK_, (e)=> {
						e.preventDefault();
						e.stopPropagation();
						const el = e.target.closest('li');
						if (el && !el.classList.contains('active')) {
							isLargeScrolling=true;
							scrollTo(Themify.convert(el.parentNode.children).indexOf(el));
							isLargeScrolling=false;
						}
					});
					Themify.body[0].appendChild(nav);
				}
			},
			_touchstart = function (e) {
				if (scrolling === false && isOverflow(e.target)===false && !(Themify.isTouch && e.target.closest('.themify_builder_slider'))) {
					let touchStartY = e.touches ? e.touches[0].clientY : e.clientY,
							touchStartX = e.touches ? e.touches[0].clientX : e.clientX,
							target = e.targetTouches ? e.targetTouches[0] : e.target,
							inHorizontal = isHorizontal;
					const _MOVE_ = e.type === 'touchstart' ? 'touchmove' : 'pointermove',
							_UP_ = e.type === 'touchstart' ? 'touchend' : 'pointerup',
							_CANCEL_ = e.type === 'touchstart' ? 'touchcancel' : 'pointercancel',
							_SENSITIVE_ = 5,
							_upCallback = function (e) {
								this.removeEventListener(_MOVE_, _moveCallback, {passive: true});
								this.removeEventListener(_UP_, _upCallback, {passive: true, once: true});
								this.removeEventListener(_CANCEL_, _upCallback, {passive: true, once: true});
								wrapper.removeEventListener(_UP_, _upCallback, {passive: true, once: true});
								touchStartY = touchStartX = null;
							},
							_moveCallback = function (e) {
								if (scrolling === false) {
									const touchEndY = e.touches ? e.touches[0].clientY : e.clientY,
											touchEndX = e.touches ? e.touches[0].clientX : e.clientX;
									if (touchEndY !== touchStartY || (inHorizontal === true && touchEndX !== touchStartX)) {
										let dir = '';
										if (inHorizontal === true) {
											if (touchEndX + _SENSITIVE_ < touchStartX) {/*left*/
												dir = Themify.isRTL === true ? 'swipe_prev' : 'swipe_next';
											} else if (touchEndX - _SENSITIVE_ > touchStartX) {/*right*/
												dir = Themify.isRTL === true ? 'swipe_next' : 'swipe_prev';
											}
										}
										if (dir === '') {
											if (touchEndY + _SENSITIVE_ < touchStartY) {/*up*/
												dir = 'next';
											} else if (touchEndY - _SENSITIVE_ > touchStartY) {/*down*/
												dir = 'prev';
											}
										}
										if (dir !== '') {
											touchStartY = touchEndY;
											touchStartX = touchEndX;
											scrollTo(dir);
										}
									}
								}
							};
							if(target.target){
								target=target.target;
							}
					if (wrapper === target || wrapper.contains(target)) {
						if (inHorizontal === false) {
							inHorizontal = target.closest('.fp-section-container-horizontal') !== null;
						}
						document.addEventListener(_MOVE_, _moveCallback, {passive: true});
						document.addEventListener(_UP_, _upCallback, {passive: true, once: true});
						document.addEventListener(_CANCEL_, _upCallback, {passive: true, once: true});
						wrapper.addEventListener(_UP_, _upCallback, {passive: true, once: true});
					}
				}
			},
			_allowScrolling=(e)=>{
				deltaY=e.wheelDelta || -e.deltaY || -e.detail;
				const curTime = new Date().getTime(),
				timeDiff = curTime-prevTime,
				getAverage=(elements, number)=>{
					let sum = 0;
					const lastElements = elements.slice(Math.max(elements.length - number, 1));
					for(let i =  lastElements.length-1; i>-1; --i){
						sum+=lastElements[i];
					}

					return Math.ceil(sum/number);
				};
				if(timeDiff > 200){
                    //emptying the array, we dont care about old scrolling for our averages
                    scrollings = [];
                }
				else if(scrollings.length > 149){
                    scrollings.shift();
                }
				scrollings.push(Math.abs(deltaY));
                prevTime = curTime;
				return getAverage(scrollings, 10) >= getAverage(scrollings, 70);
			},
			_wheel =  (e)=> {
				if(scrolling === false && isOverflow(e.target)===false && _allowScrolling(e)===true){
					scrollTo(( Math.max(-1, Math.min(1, deltaY))<0 ? 'next' : 'prev'));
				}
			},
			_scrollVertical = (horizontalIndex, dir,silient)=> {
				if(scrolling===false){
					silient = !!silient;
					scrolling = true;
					const el = wrapper.children[currentIndex],
							row = (silient !== true && isLargeScrolling===false && el && _ISPARALLAX_ === true) ? el.getElementsByClassName('module_row')[0] : null,
							nav = document.getElementById('fp-nav'),
							ev = currentIndex === 0 ? 'tf_fixed_header_disable' : 'tf_fixed_header_enable';
					if (row) {
						let next = dir==='prev'?el.nextElementSibling:el;
						if (next) {
							next = next.getElementsByClassName('module_row')[0];
							if (next) {
								let tr='none';
									next.addEventListener('transitionend', function () {
										this.style['transition'] =  this.style['transform'] ='';
									}, {passive: true, once: true});
									if(dir==='prev'){
										tr='transform ' + duration + 'ms ease';
									}
									else{
										setTimeout(()=>{
											next.style.setProperty('transition','transform ' + duration + 'ms ease','important');
											next.style['transform'] = '';
										},5);
									}
									next.style.setProperty('transition',tr,'important');
									next.style['transform'] = 'translateY(-62%)';
							}
						}
					}
					if(nav){
						const navItems = nav.children;
						for (let i = navItems.length - 1; i > -1; --i) {
							navItems[i].classList.toggle('active', i === currentIndex);
						}
					}
					let vHeight=realNormalHeight;
					if(currentIndex!==0){
						vHeight=-(normalHeight+(currentIndex-1)*fixedHeight-realFixedHeight);
					}
					if (silient === true) {
						wrapper.style['transition'] = 'none';
						Themify.trigger(ev);
						setTimeout(()=> {
							wrapper.style['transition'] = '';
						}, 100);
						el.classList.add('complete');
						el.getElementsByClassName('module_row')[0].style['transform'] = '';
						scrolling = false;
						if (horizontalIndex !== undefined) {
							scrollTo(currentIndex, horizontalIndex, silient);
						}
					} else {
						Themify.trigger(ev);
						setTimeout(()=>{
							el.classList.add('complete');
							scrolling = false;
							if (horizontalIndex !== undefined) {
								scrollTo(currentIndex, horizontalIndex, silient);
							}
						},duration+300);
					}
					wrapper.style['transform'] = 'translateY(' + vHeight + 'px)';
					Themify.trigger('themify_onepage_afterload', [el]);
				}
			},
			_scrollHorizontally = (container,dir, silient)=> {
				if(scrolling===false){
					silient = !!silient;
					scrolling = true;
					const navItems = container.getElementsByClassName('fp-slidesNav')[0].children,
							index = parseInt(container.dataset['index']),
							inner = container.getElementsByClassName('fp-section-container-inner')[0],
							el = inner.children[index],
							row = (silient !== true && isLargeScrolling===false && el && _ISPARALLAX_ === true) ? el.getElementsByClassName('module_row')[0] : null;
					if (row) {
						let next = dir==='prev'?el.nextElementSibling:el;
						if (next) {
							next = next.getElementsByClassName('module_row')[0];
							if (next) {
									let tr='none';
									next.addEventListener('transitionend', function () {
										this.style['transition'] = this.style['transform'] ='';
									}, {passive: true, once: true});
									if(dir==='prev'){
										tr='transform ' + duration + 'ms ease';
									}
									else{
										setTimeout(()=>{
											next.style.setProperty('transition','transform ' + duration + 'ms ease','important');
											next.style['transform'] = '';
										},5);
									}
									next.style.setProperty('transition',tr,'important');
									next.style['transform'] = 'translateX(-62%)';
							}
							
						}
					}
					for (let i = navItems.length - 1; i > -1; --i) {
						navItems[i].classList.toggle('active', i === index);
					}
					if (silient === true) {
						inner.style['transition'] = 'none';
						setTimeout(()=> {
							inner.style['transition'] = '';
						}, 100);
						el.classList.add('complete');
						el.getElementsByClassName('module_row')[0].style['transform'] = '';
						scrolling = false;
					} else {
						inner.addEventListener('transitionend', ()=> {
								el.classList.add('complete');
								scrolling = false;
						}, {passive: true, once: true});
					}
					inner.style['transform'] = 'translateX(-' + (100 * index) + '%)';
					Themify.trigger('themify_onepage_afterload', [el]);
				}
			},
			scrollTo = (verticalIndex, horizontalIndex, silient)=>{
				if (scrolling === false) {
					// when lightbox is active, prevent scrolling the page
					if (Themify.body[0].classList.contains('themify_mp_opened')) {
						return;
					}

					/* in case there's an element with same ID as location.hash, reset the default browser scroll */
					Themify.body[0].scrollTop = 0;

					// Detect Keyboard Navigation
					let keyDown=typeof verticalIndex === 'string' && verticalIndex.indexOf('Key')>-1;
					if(keyDown){
						keyDown=verticalIndex;
						verticalIndex = verticalIndex === 'nextKey' || verticalIndex === 'rightKey'?'next':'prev';
					}
					// Detect Touch swipe
					let swipe=typeof verticalIndex === 'string' && verticalIndex.indexOf('swipe')>-1;
					if(swipe){
						swipe=verticalIndex;
						verticalIndex = verticalIndex === 'swipe_next'?'next':'prev';
					}
					const isNumber = verticalIndex !== 'next' && verticalIndex !== 'prev',
							oldIndex = currentIndex,
							verticalChilds = wrapper.children,
							item = verticalChilds[oldIndex];
					let changeHorizontal=false;
					if (isNumber) {
						currentIndex = verticalIndex;
					}
					if (item) {
						let index = parseInt(item.dataset['index']) || 0,
							isHorizontalScroll = isHorizontal === true || (item.classList.contains('fp-section-container-horizontal') ? (isNumber || snakeScroll || swipe!==false || (keyDown === 'leftKey' || keyDown === 'rightKey')) : false);
						const horizontalChilds = isHorizontalScroll ? item.getElementsByClassName('fp-section-container') : null,
								horizontalItem = isHorizontalScroll && horizontalChilds[index] ? horizontalChilds[index] : null;
						if(isHorizontalScroll && isNumber && (!horizontalChilds[horizontalIndex] || !item.contains(horizontalChilds[horizontalIndex]))){
							isHorizontalScroll=false;
							_setActive();
						}
						if (!isNumber && !keyDown && !swipe) {
							const el = horizontalItem ? horizontalItem : item,
									inner = el.getElementsByClassName('tf_scrollbar')[0],
									max = inner.scrollHeight - inner.clientHeight;
							if (max > 0) {
								const top = inner.scrollTop;
								if ((verticalIndex === 'prev' && top > 0) || (verticalIndex === 'next' && top < (max - 3))) {
									if (!Themify.isTouch && !_is_retina) {
										if(req2){
											cancelAnimationFrame(req2);
										}
										inner.style.scrollBehavior=(deltaY>90 || deltaY<-90)?'':'auto';
										req2=requestAnimationFrame(()=>{
											inner.scrollTop +=-deltaY;
											inner.style.scrollBehavior='';
										});
									}
									return;
								}
							}
						}
						if (isHorizontalScroll) {
							const oldHorizontalIndex = index;
							lazyLoad(horizontalItem);
							if (isNumber) {
								if (horizontalIndex !== undefined) {
									index = horizontalIndex;
								}
							} else {
								if (verticalIndex === 'next') {
									if (index < (horizontalChilds.length - 1)) {
										++index;
									}else{
										changeHorizontal=true;
									}
								} else if (verticalIndex === 'prev' && index > 0) {
									--index;
								}else{
									changeHorizontal=true;
								}
							}
							if (horizontalChilds[index]) {
								_setActive(index);
							}
							if (oldHorizontalIndex !== index || silient === true) {
								item.dataset['index'] = index;
								const dir= oldHorizontalIndex > index?'prev':'next',
								nextItem = dir==='prev' ? (index - 1) : (index + 1);
								_scrollHorizontally(item,dir, silient);
								if (horizontalChilds[nextItem]) {
									lazyLoad(horizontalChilds[nextItem]);
								}
								if(!isNumber || verticalIndex === oldIndex){
									return;
								}
							} else if (horizontalChilds[index] && horizontalChilds[index].nextElementSibling) {
								lazyLoad(horizontalChilds[index].nextElementSibling);
							}
						}
					} else {
						return;
					}
					if (isHorizontal === false || changeHorizontal===true) {
						if (verticalIndex === 'next') {
							if (oldIndex < (pagesCount - 1)) {
								++currentIndex;
							}
						} else if (verticalIndex === 'prev' && oldIndex > 0) {
							--currentIndex;
						}
						if (verticalChilds[currentIndex]) {
							_setActive();
						}
						if (oldIndex !== currentIndex || silient === true) {
							if (!isNumber && verticalChilds[currentIndex] && verticalChilds[currentIndex].classList.contains('fp-section-container-horizontal')) {
								const index = verticalIndex === 'next' ? 0 : (snakeScroll?verticalChilds[currentIndex].getElementsByClassName('fp-section-container').length - 1:0);
								if (index !== parseInt(verticalChilds[currentIndex].dataset['index'])) {
									scrollTo(currentIndex, index, true);
								}
							}
							scrolling = false;
							const dir= oldIndex > currentIndex?'prev':'next',
							nextItem = dir==='prev' ? (currentIndex - 1) : (currentIndex + 1);
							_scrollVertical((isNumber ? horizontalIndex : undefined),dir, silient);
							if (verticalChilds[nextItem]) {
								lazyLoad(verticalChilds[nextItem]);
							}
						} else if (verticalChilds[currentIndex] && verticalChilds[currentIndex].nextElementSibling) {
							lazyLoad(verticalChilds[currentIndex].nextElementSibling);
						}
					}
				}
			},
			_setActive = (horizontalIndex)=> {
				const active = wrapper.querySelectorAll('.fp-section-container-horizontal.active,.fp-section-container.active'),
						verticalIndex = currentIndex,
						verticalItem = wrapper.children[verticalIndex],
						isHorizontalScroll = horizontalIndex === undefined,
						isHorizontalWrapper = verticalItem.classList.contains('fp-section-container-horizontal'),
						bodyCl = Themify.body[0].classList;

				let activeCl = (isHorizontal === true || isHorizontalWrapper) ? verticalIndex : _getAnchor(verticalItem.getElementsByClassName('module_row')[0], true),
						currentSection = verticalItem;

				if (activeCl === '' || activeCl === null) {
					activeCl = verticalIndex;
				}
				for (let i = active.length - 1; i > -1; --i) {
					active[i].classList.remove('complete', 'active');
				}
				if (isHorizontalWrapper) {

					if (isHorizontalScroll) {
						horizontalIndex = parseInt(verticalItem.getAttribute('data-index')) || 0;
					}
					currentSection = verticalItem.getElementsByClassName('fp-section-container')[horizontalIndex];
					let anchor = _getAnchor(currentSection.getElementsByClassName('module_row')[0], true);
					if (!anchor) {
						anchor = horizontalIndex;
					}
					activeCl += '-' + anchor;
					if (isHorizontalScroll) {
						currentSection.classList.add('active', 'complete');
					}
				} else {
					activeCl += '-0';
				}

				currentSection.classList.add('active');
				_setAnchor(currentSection);
				for (let i = bodyCl.length - 1; i > -1; --i) {
					if (bodyCl[i].indexOf('fp-viewing-') === 0) {
						bodyCl.remove(bodyCl[i]);
						break;
					}
				}
				bodyCl.add('fp-viewing-' + activeCl);
				lazyLoad(currentSection);
				_mediaAutoPlay(currentSection);
			},
			_keydown =  (e)=> {
				if (scrolling === false) {
					const code = e.key || e.keyCode;
					if (code) {
						switch (code) {
							case 38:
							case 'ArrowUp':
							case 33:
							case 'PageUp':
								scrollTo('prevKey');
								break;
							case 37:
							case 'ArrowLeft':
								scrollTo('leftKey');
								break;
							case 39:
							case 'ArrowRight':
								scrollTo('rightKey');
								break;
							case 34:
							case 40:
							case 'ArrowDown':
							case 'PageDown':
								scrollTo('nextKey');
								break;
						}
					}
				}
			},
			_updateFullPage =  (w)=> {
				const bp = _getCurrentBreakPoint(w);
				for (let  childs = wrapper.children, j = childs.length - 1; j > -1; --j) {
					if (childs[j].classList.contains('module_row') && (childs[j].classList.contains('hide-' + bp) || (childs[j].offsetWidth === 0 && childs[j].offsetHeight === 0))) {
						childs[j].parentNode.removeChild(childs[j]);
					}
				}
			},
			lazyLoad =  (el)=> {
				if (el && !el.hasAttribute('data-done')) {
					el.setAttribute('data-done', true);
					Themify.lazyScroll(Themify.convert(Themify.selectWithParent('[data-lazy]', el)).reverse(), true);
				}
			},
			_mediaAutoPlay =  (el)=> {
				if (el) {
					const items = el.querySelectorAll('video,audio');
					for (let i = 0, len = items.length; i < len; ++i) {
						if (items[i]) {
							if (items[i].readyState === 4) {
								items[i].play();
							} else {
								Themify.requestIdleCallback(()=> {
									items[i].addEventListener('loadedmetadata', function () {
										setTimeout(()=> {
											this.play();
										}, 100);
									}, {passive: true, once: true});
								}, 220);
							}
						}
					}
				}
			},
			_setActiveMenu = (anchor)=> {
				const menu = document.getElementById('main-nav');
				if (menu !== null) {
					const items = menu.getElementsByTagName('li');
					let aSectionHref = anchor ? menu.querySelector('a[href="#' + anchor.replace('#', '') + '"]') : null;
					if (aSectionHref !== null) {
						aSectionHref = aSectionHref.parentNode;
					}
					for (let i = items.length - 1; i > -1; --i) {
						if (aSectionHref === items[i]) {
							items[i].classList.add('current-menu-item');
						} else {
							items[i].classList.remove('current_page_item', 'current-menu-item');
						}
					}
				}
			},
			_getAnchor =  (row, ignore)=> {// Get builder rows anchor class to ID //
				if (ignore === true || !row.hasAttribute('data-hide-anchor')) {
					let anchor = row.getAttribute('data-anchor');
					if (!anchor) {
						anchor = row.getAttribute('id');
						if (!anchor) {
							anchor = '';
						}
					}
					return anchor.replace('#', '');
				}
				return '';
			},
			_setAnchor = (row)=>{
				if (row) {
					row = row.getElementsByClassName('module_row')[0];
					if (row) {
						const anchor = _getAnchor(row);
						if (anchor && anchor !== '#') {
							if (location.hash !== '#' + anchor) {
								const item=document.getElementById(anchor);
								if(item){//if there is an element,browser will move the scrollbar
									item.removeAttribute('id');
								}
								window.location.hash = anchor;
								if(item){
									item.id=anchor;
								}
							}
						} else {
							history.replaceState(null, null, location.pathname);
							prevHash='';
						}
					}
				}
			},
			_init = (e)=> {
				
				if (wrapper) {
					const w = e ? e.w : Themify.w,
						bp=_getCurrentBreakPoint(w),
						callback = ()=> {
							const isMobile = _MOBILE_BREAKPOINT_ && w <= _MOBILE_BREAKPOINT_,
									bodyCl=Themify.body[0].classList;
							if(isDisabled===false){
								let vHeight=realNormalHeight;
								if(currentIndex!==0){
									vHeight=-(normalHeight+(currentIndex-1)*fixedHeight-realFixedHeight);
								}
								wrapper.style['transform'] = 'translateY(' + vHeight + 'px)';
							}
							if (isMobile === true && bodyCl.contains('full-section-scrolling')) {
								_disable();
								
							}
							else if((isMobile !== true && isDisabled) || !initOnce){
								isDisabled=false;
								Themify.trigger('tb_scroll_highlight_disable');
								bodyCl.add('full-section-scrolling');
								if(has_footer===true){
									bodyCl.add('fullpage-footer');
								}
								Themify.lazyDisable = true;
								run(w);
							}
							else if(isDisabled===false){
								const items=wrapper.children;
								for(let i=items.length-1;i>-1;--i){
									let vh=i===0 || fixedHeight===0?normalHeight:fixedHeight;
									items[i].style['height']=vh+'px';
								}
								if(prevbreakpoint!==bp){
									for (let childs = wrapper.children, i = childs.length - 1; i > -1; --i) {
										let row_inner=childs[i].getElementsByClassName('row_inner')[0];
										if(row_inner!==undefined){
											let paddings=_getPaddings(childs[i].getElementsByClassName('module_row')[0],bp);
											if(paddings[0]!==''){
												row_inner.style['paddingTop']=paddings[0];
											}
											if(paddings[1]!==''){
												row_inner.style['paddingBottom']=paddings[1];
											}
										}
									}
								}
							}
							prevbreakpoint=bp;
						};
					if(prevbreakpoint!==bp){
						_updateFullPage(w);
					}
					if (!Themify.is_builder_loaded && window['tbLocalScript'] !== undefined) {
						Themify.body.one('themify_builder_loaded', callback);
					} else {
						callback();
					}
				} else {
					Themify.trigger('themify_onepage_afterload');
				}

			},
			callcullateHeight=(vh)=>{
				return new Promise((resolve,reject) => {
					const bodyCl =  Themify.body[0].classList,
						isNotTransparent=!bodyCl.contains('transparent-header') && !bodyCl.contains('menubar-bottom') && !bodyCl.contains('menubar-top');
					let offset=0;
					if(bodyCl.contains('admin-bar')){
						offset=getComputedStyle(document.documentElement).getPropertyValue('margin-top') || 0;
						if(offset){
							offset=parseFloat(offset);
							if(isNotTransparent===true){
								offset=-offset;
							}
						}
					}
					document.documentElement.style.setProperty('--fp_vh', vh+'px');
					if(isNotTransparent===true){
						if(hasFixedHeader===true){
							const __callback=()=>{
								ThemifyFixedHeader.calculateTop(null,true).then(params=>{
									realFixedHeight=params[2];
									realNormalHeight=params[1];
									normalHeight=vh-params[1]-offset;
									fixedHeight=vh-realFixedHeight-offset;
									resolve(normalHeight,fixedHeight);
								});
							};
							if(typeof ThemifyFixedHeader!=='undefined'){
								__callback();
							}
							else{
								Themify.on('tf_fixed_header_init', ()=>{
									setTimeout(__callback,10);
								},true);
							}
						}
						else{
							const headerWrap=document.getElementById('headerwrap');
							if(headerWrap!==null){
								const headerHeight=headerWrap.getBoundingClientRect().height;
								fixedHeight=vh;
								if(fixedHeight>headerHeight){
									fixedHeight-=headerHeight - offset;
								}
								normalHeight=fixedHeight;
							}
                            else{
								fixedHeight=normalHeight=vh;
							}
							resolve(normalHeight,fixedHeight);
						}
					}
					else{	
						fixedHeight=normalHeight=vh-offset;
						resolve(normalHeight,fixedHeight);
					}
				});
			};
	
	Themify.on('themify_theme_fullpage_init', (options)=> {
		window.scroll(0, 0);
		isHorizontal = !!options['is_horizontal'];
		has_footer=!!options['has_footer'];
		hasFixedHeader=!!options['is_fixedHeader'];
		wrapper = document.getElementById('tbp_content') || document.getElementById('body');
		wrapper = wrapper !== null ? wrapper.getElementsByClassName('themify_builder')[0] : document.querySelector('.themify_builder:not(.not_editable_builder)');
		Themify.loadWowJs(()=> {
			callcullateHeight(Themify.h).then(()=>{
				_init();
			});
			Themify.on('tfsmartresize', (e)=>{
				callcullateHeight(e.h).then(()=>{
					_init(e);
				});
			});
		});
	}, true);

})(Themify, document, window, themifyScript);