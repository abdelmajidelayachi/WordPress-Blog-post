/**
 * infinite module
 */
;
(($, Themify, win, doc)=>{
    'use strict';
    let isSafari = null,
            historyObserver = null;
    const Prefetched = [],
            _init = (options)=> {
                return new IntersectionObserver((entries, _self)=> {
                    for (let i = entries.length - 1; i > -1; --i) {
                        if (entries[i].isIntersecting === true) {
                            if (options['button'] === null) {
                                _self.disconnect();
                            } else {
                                _Load(options);
                            }
                        }
                    }
                }, {
                    threshold:.1
                });
            },
            _addHistoryPosition = (item, path)=> {
                if (historyObserver === null) {
                    historyObserver = new IntersectionObserver( (entries, _self)=> {
                        for (let i = entries.length - 1; i > -1; --i) {
                            if (entries[i].isIntersecting === true) {
                                win.history.replaceState(null, null, entries[i].target.getAttribute('data-tf-history'));
                            }
                        }
                    }, {
                        rootMargin:'100% 0px -100% 0px'
                    });
                }
                item.setAttribute('data-tf-history', _removeQueryString(path));
                historyObserver.observe(item);
            },
            _removeQueryString = (path)=> {
                return Themify.UpdateQueryString('tf-scroll',null,path);
            },
            _addQueryString = (path)=> {
                return Themify.UpdateQueryString('tf-scroll', 1, path);
            },
            _beforeLoad = (element, doc, ajax_filter)=> {
                Themify.lazyScroll(Themify.selectWithParent('[data-lazy]',element), true);
                const $element = $(element);
                if(!ajax_filter){
                    if (win['Isotope'] !== undefined) {
                        const isotop = win['Isotope'].data(element);
                        if (isotop) {
                            const postFilter = element.previousElementSibling;
                            if (postFilter !== null && postFilter.classList.contains('post-filter')) {
                                const active = postFilter.querySelector('.cat-item.active:not(.cat-item-all)');
                                if (active !== undefined) {
                                    $(active).trigger('click.tf_isotop_filter');
                                }
                            }
                        }
                    }
                }
                $element.triggerHandler('infinitebeforeloaded.themify', doc);
                Themify.trigger('infinitebeforeloaded.themify', [$element, doc]);
                setTimeout(()=>{
                    Themify.trigger('tf_isotop_layout');
                }, 1500);
            },
            _afterLoad = (items, element, opt) =>{
                const len = items.length,
                        container = $(element),
                        isotop = win['Isotope'] !== undefined ? win['Isotope'].data(element) : null;
                if (isSafari === null) {
                    isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                }
                items[0].className += ' tf_firstitem';
                var k = 0;
                for (let i = 0; i < len; ++i) {
                    items[i].style['opacity'] = 0;
                    Themify.imagesLoad(items[i], (el)=> {
                        // Fix Srcset in safari browser
                        if (isSafari) {
                            const imgSrcset = el.querySelector('img[srcset]');
                            if (null !== imgSrcset) {
                                imgSrcset.outerHTML = imgSrcset.outerHTML;
                            }
                        }
                        ++k;
                        if (isotop) {
                            isotop.appended(el);
                        }
                        el.style['opacity'] = '';
                        if (k === len) {
                            if (isotop || container[0].classList.contains('auto_tiles')) {
                                if(!opt['ajax_loading']){
                                    const postFilter = container[0].previousElementSibling;
                                    if (postFilter !== null && postFilter.classList.contains('post-filter')) {
                                        // If new elements with new categories were added enable them in filter bar
                                        Themify.body.triggerHandler('themify_isotop_filter', [postFilter]);
                                    }
                                }
                                if (container[0].classList.contains('auto_tiles')) {
                                    Themify.autoTiles(container[0]);
                                }
                            }
                            const $items = $(items);
							for (let i = 0; i < len; ++i) {
								Themify.lazyScroll(Themify.convert(Themify.selectWithParent('[data-lazy]',items[i])).reverse(),true);
							}
                            container.triggerHandler('infiniteloaded.themify', [$items]);
                            Themify.trigger('infiniteloaded.themify', [container, $items]);
                            if ('scroll' === opt['scrollToNewOnLoad']) {
                                let first = container[0].getElementsByClassName('tf_firstitem');
                                first = first[first.length - 1];
                                let to = $(first).offset().top;
                                const speed = to >= 800 ? (800 + Math.abs((to / 1000) * 100)) : 800,
                                        header = doc.getElementById('headerwrap');
                                if (header !== null && (header.classList.contains('fixed-header') || Themify.body[0].classList.contains('fixed-header'))) {
                                    to -= $(header).outerHeight(true);
                                }
                                if (opt['scrollThreshold'] === false || (to - doc.docElement.scrollTop) > opt['scrollThreshold']) {
                                    Themify.scrollTo(to, speed);
                                }
                            }
							Themify.fontAwesome();
							Themify.loadWPEmbed(doc.getElementsByClassName('wp-embedded-content'));
							Themify.checkLargeImages();
                        }
                    });
                }
            },
            _Load = (opt)=> {
                if (opt['isWorking'] === true) {
                    return;
                }
                opt['isWorking'] = true;
                opt['status'].classList.add('tf_scroll_request');
                let url,
                    params={headers:new Headers({
                            'X-Requested-With': 'XMLHttpRequest'
                        })};
                if(opt['filter']){
                    const ajax_sort = opt['filter'].hasAttribute('data-sort'),
                        active = opt['filter'].querySelector('.cat-item.active');
                    if(active){
                        opt['ajax_loading']=active;
                        const data = new FormData();
                        data.append('action', 'themify_ajax_load_more');
                        data.append('module', opt['filter'].dataset.el);
                        data.append('id', opt['filter'].dataset.id);
                        data.append('page', active.dataset.p);
                        if(!active.classList.contains('cat-item-all')){
                            const tax=active.getAttribute('class').replace(/(current-cat)|(cat-item)|(-)|(active)/g, '').replace(' ', '');
                            data.append('tax', tax.trim());
                        }
                        if(ajax_sort){
                            const order = opt['filter'].querySelector('.tf_ajax_sort_order.active'),
                                orderby = opt['filter'].querySelector('.tf_ajax_sort_order_by .active');
                            if(order){
                                data.append('order', order.dataset.type);
                            }
                            if(orderby){
                                data.append('orderby', orderby.dataset.orderBy);
                            }
                        }
                        params.method='POST';
                        params.body=data;
                        url=themify_vars.ajax_url;
                    }
                }
                if(!opt['ajax_loading']){
                    url=_addQueryString(opt['button'].href);
                }
                fetch(url, params)
                        .then(response=> {
                            return response.text();
                        })
                        .then(html=> {
                            const doc = (new DOMParser()).parseFromString(html, 'text/html'),
                                    container = doc.querySelector(opt['id']),
                                    currentPath = _removeQueryString(opt['button'].href),
                                    element = opt['container'];
									
                            let btn = null;
                            if (container !== null) {
                                _beforeLoad(element, doc,!!opt['ajax_loading']);
                                const fr = doc.createDocumentFragment(),
                                        childs = Themify.convert(container.children);
                                btn = container.getElementsByClassName('load-more-button')[0];
                                if(!btn){
                                    btn = container.nextElementSibling;
                                }
                                if (btn !== null) {
                                    if (!btn.classList.contains('load-more-button')) {
                                        btn = btn.children[0];
                                    }
                                    if (!btn || !btn.classList.contains('load-more-button')) {
                                        btn = null;
                                    }
                                }
								if(btn && btn.tagName!=='A'){
									btn = btn.children[0];
									if (!btn || btn.tagName!=='A') {
										btn = null;
									}
								}
                                if (childs[0] !== undefined) {
                                    for (let j = 0, len = childs.length; j < len; ++j) {
                                        fr.appendChild(childs[j]);
                                    }
                                    element.appendChild(fr);
                                    if (opt['history']) {
                                        _addHistoryPosition(childs[0], currentPath);
                                    }
                                    _afterLoad(childs, element, opt);
                                } else {
                                    btn = null;
                                }
                                if(opt['ajax_loading'] && null===btn){
                                    opt['ajax_loading'].dataset.done=true;
                                    opt['filter'].parentNode.classList.add('tb_hide_loadmore');
                                }
                            }
                            if(!opt['ajax_loading']){
                                if (btn === null) {
                                    opt['button'].remove();
                                    opt['button'] = null;
                                } else {
                                    const nextHref = _addQueryString(btn.href);
                                    if (opt['prefetchBtn'] !== undefined && Prefetched[nextHref] === undefined) {
                                        Prefetched[nextHref] = true;
                                        opt['prefetchBtn'].setAttribute('href', nextHref);
                                    }
                                    opt['button'].href = nextHref;
                                    win.addEventListener('scroll', function (opt, e) {
                                        opt['isWorking'] = null;
                                    }.bind(null, opt), {passive: true, once: true});
                                }
                                /*Google Analytics*/
                                if (win['ga'] !== undefined) {
                                    const link = doc.createElement('a');
                                    link.href = currentPath;
                                    ga('set', 'page', link.pathname);
                                    ga('send', 'pageview');
                                }
                                if (opt['history']) {
                                    win.history.replaceState(null, null, currentPath);
                                }
                            }else{
                                opt['ajax_loading'].dataset.p = parseInt(opt['ajax_loading'].dataset.p)+1;
                                opt['isWorking'] = null;
                            }
                            opt['status'].classList.remove('tf_scroll_request');
                            return container;

                        }).catch(err=> {
                    console.warn('InfiniteScroll error.', err);
                });
            };
    Themify.on('tf_infinite_init', (container, opt)=>{
        if (container instanceof jQuery) {
            container = container[0];
        }
        let btn = container.getElementsByClassName('load-more-button')[0];
        if(!btn){
            btn = container.nextElementSibling;
        }
        if (!btn) {
            return;
        }
        let btn_wrap = btn;

        if (!btn.classList.contains('load-more-button')) {
            btn = btn.children[0];
            if (!btn || !btn.classList.contains('load-more-button')) {
                return;
            }
        }
        if(btn.tagName!=='A'){
            btn = btn.children[0];
            if (!btn || btn.tagName!=='A') {
                return;
            }
        }
        if (!opt['id']) {
            opt['id'] = container.getAttribute('id');
            if (!opt['id']) {
                opt['id'] = '.'+container.className.split(' ').join('.');
            } else {
                opt['id'] = '#' + opt['id'];
            }
            if (!opt['id']) {
                return;
            }
        }
        if (!Themify.cssLazy['tf_infinite']) {
            Themify.cssLazy['tf_infinite'] = true;
            Themify.LoadCss(Themify.url + '/css/modules/infinite.css');
        }
        const loaderWrap = doc.createElement('div');
        loaderWrap.className = 'tf_load_status tf_loader tf_clear tf_hide';
        container.parentNode.insertBefore(loaderWrap, container.nextSibling);
        opt['status'] = loaderWrap;
        opt['button'] = btn;
        opt['container'] = container;
        if(container.classList.contains('tb_ajax_pagination')){
            const filter = container.previousElementSibling;
            if(filter && filter.classList.contains('post-filter')){
                opt['filter'] = filter;
            }
        }
        if (opt['scrollThreshold'] !== false) {
            win.addEventListener('scroll', ()=>{
                const prefetch = doc.createElement('link'),
                        nextHref = _addQueryString(opt['button'].getAttribute('href'));
                prefetch.setAttribute('as', 'document');
                prefetch.setAttribute('rel', 'prefetch');
                prefetch.setAttribute('href', nextHref);
                opt['button'].parentNode.insertBefore(prefetch, opt['button'].nextSibling);
                opt['prefetchBtn'] = prefetch;
                Prefetched[nextHref] = true;
                _addHistoryPosition(opt['container'].children[0], win.location.href);
                _init(opt).observe(btn_wrap);
            }, {passive: true, once: true});
        } else {
            _addHistoryPosition(container.children[0], win.location.href);
            btn.style['display'] = 'inline-block';
            btn.addEventListener('click', (e)=>{
                e.preventDefault();
                delete opt['ajax_loading'];
                _Load(opt);
            });
        }
    });

})(jQuery, Themify, window, document);