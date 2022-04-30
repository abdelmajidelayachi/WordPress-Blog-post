;
var Themify;
((win, doc, und, $)=>{
    'use strict';
    Themify = {
        cssLazy: {},
        jsLazy: {},
        jsCallbacks: {},
        cssCallbacks: {},
        fontsQueue: {},
        is_min: false,
        events: {},
        body: null,
        is_builder_active: false,
        is_builder_loaded: false,
        w: null,
        h: null,
        isTouch: false,
        device: 'desktop',
        isRTL: false,
        lazyDisable: false,
        lazyScrolling: null,
        url: null,
        js_modules: null,
        css_modules: null,
        jsUrl: '',
        cssUrl:'',
        observer: null,
        triggerEvent(target, type, params) {
            let ev;
            if (type === 'click' || type === 'submit' || type === 'input' || type==='resize' || (type === 'change' && !params) || type.indexOf('pointer') === 0 || type.indexOf('touch') === 0 || type.indexOf('mouse') === 0) {
                if (!params) {
                    params = {};
                }
                if (params['bubbles'] === und) {
                    params['bubbles'] = true;
                }
                if (params['cancelable'] === und) {
                    params['cancelable'] = true;
                }
                ev = new Event(type, params);
            } else {
                try {
                    ev = new win.CustomEvent(type, {detail: params});
                } catch (e) {
                    ev = win.CustomEvent(type, {detail: params});
                }
            }
            target.dispatchEvent(ev);
        },
        on(ev, func, once) {
            ev = ev.split(' ');
            const len = ev.length;
            for (let i = 0; i < len; ++i) {
                if (this.events[ev[i]] === und) {
                    this.events[ev[i]] = [];
                }
                let item = {'f': func};
                if (once === true) {
                    item['o'] = true;
                }
                this.events[ev[i]].push(item);
            }
            return this;
        },
        off(ev, func) {
            if (this.events[ev]) {
                if (!func) {
                    delete this.events[ev];
                } else {
                    const events = this.events[ev];
                    for (let i = events.length - 1; i > -1; --i) {
                        if (events[i]['f'] === func) {
                            this.events[ev].splice(i, 1);
                        }
                    }
                }
            }
            return this;
        },
        trigger(ev, args) {
            if (this.events[ev]) {
                const events = this.events[ev].reverse();
                if (!Array.isArray(args)) {
                    args = [args];
                }
                for (let i = events.length - 1; i > -1; --i) {
                    if (events[i] !== und) {
                        events[i]['f'].apply(null, args);
                        if (events[i] !== und && events[i]['o'] === true) {
                            this.events[ev].splice(i, 1);
                            if (Object.keys(this.events[ev]).length === 0) {
                                delete this.events[ev];
                                break;
                            }
                        }
                    }
                }
            }
            return this;
        },
        requestIdleCallback(callback, timeout) {
            if (win.requestIdleCallback) {
                win.requestIdleCallback(callback, {timeout: timeout});
            } else {
                setTimeout(callback, timeout);
            }
        },        
        parseVideo(url) {
            const m = url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?\/?([A-Za-z0-9._%-]*)(\&\S+)?/i),
                attrs = {
                    type: m !== null ? (m[3].indexOf('youtu') > -1 ? 'youtube' : (m[3].indexOf('vimeo') > -1 ? 'vimeo' : false)) : false,
                    id: m !== null ? m[6] : false
                };
            if('vimeo' === attrs.type && m[8]){
                attrs.h = m[8];
            }
            return attrs;
        },
        hash(s) {
            let hash = 0;
            for (let i = s.length - 1; i > -1; --i) {
                hash = ((hash << 5) - hash) + s.charCodeAt(i);
                hash = hash & hash; // Convert to 32bit integer
            }
            return hash;
        },
        scrollTo(val, speed, complete, progress) {
            if (!speed) {
                speed = 800;
            }
            if (!val) {
                val = 0;
            }
            const doc = $('html,body'),
                    hasScroll = doc.css('scroll-behavior') === 'smooth';
            if (hasScroll) {
                doc.css('scroll-behavior', 'auto');
            }
            doc.stop().animate({
                scrollTop: val
            }, {
                progress: progress,
                duration: speed,
                done() {
                    if (hasScroll) {
                        doc.css('scroll-behavior', '');
                    }
                    if (complete) {
                        complete();
                    }
                }
            });
        },
        imagesLoad(items, callback) {
            if (items !== null && callback!==und) {
                if (items instanceof jQuery) {
                    items = items.get();
                } 
                else if (items.length === und) {
                    items = [items];
                }
                const promises=[];
                for(let i=items.length-1;i>-1;--i){
                    let images=items[i].tagName==='IMG'?[items[i]]:items[i].getElementsByTagName('img');
                    for(let j=images.legnth-1;j>-1;--j){
                        if(!images[j].complete){
                            let elem=images[j];
                            promises.push(new Promise((resolve, reject) => {
                                elem.onload = resolve;
                                elem.onerror = reject;
                                elem=null;
                            }));
                        }
                    }
                }
                Promise.allSettled(promises).then(()=>{
                     callback(items[0]);
                });
            }
            return this;
        },
        UpdateQueryString(d,a,b){
            b||(b=win.location.href);const e=new URL(b,win.location),f=e.searchParams;null===a?f.delete(d):f.set(d,a);let g=f.toString();return''!==g&&(g='?'+g),b.split('?')[0]+g+e.hash;
        },
        selectWithParent(selector, el) {
            let items = null;
            const isCl = selector.indexOf('.') === -1 && selector.indexOf('[') === -1,
                    isTag = isCl === true && (selector === 'video' || selector === 'audio' || selector === 'img');
            if (el && el[0] !== und) {
                el = el[0];
            }
            if (el) {
                items = isCl === false ? el.querySelectorAll(selector) : (isTag === true ? el.getElementsByTagName(selector) : el.getElementsByClassName(selector));
                if ((isCl === true && el.classList.contains(selector)) || (isCl === false && el.matches(selector)) || (isTag === true && el.tagName.toLowerCase() === selector)) {
                    items = this.convert(items, el);
                }
            } else {
                items = isCl === false ? doc.querySelectorAll(selector) : (isTag === true ? doc.getElementsByTagName(selector) : doc.getElementsByClassName(selector));
            }
            return items;
        },
        convert(items, el) {
            let l = items.length;
            const arr = new Array(l);
            while (l--) {
                arr[l] = items[l];
            }
            if (el) {
                arr.push(el);
            }
            return arr;
        },
        Init() {
            this.is_builder_active = doc.body.classList.contains('themify_builder_active');
            this.body = $('body');
            const windowLoad = ()=>{
                        this.w = win.innerWidth;
                        this.h = win.innerHeight;
                        this.isRTL = this.body[0].classList.contains('rtl');
                        this.isTouch = !!(('ontouchstart' in win) || navigator.msMaxTouchPoints > 0);
                        this.lazyDisable = this.is_builder_active === true || this.body[0].classList.contains('tf_lazy_disable');
                        if (this.isTouch) {
                            const ori = typeof win.screen !== 'undefined' && typeof win.screen.orientation !== 'undefined' ? win.screen.orientation.angle : win.orientation,
                                    w = ori === 90 || ori === -90 ? this.h : this.w;
                            if (w < 769) {
                                this.device = w < 681 ? 'mobile' : 'tablet';
                            }
                        }
                        const _loaded = (c)=> {
                                    let cl = ' page-loaded';
                                    if (c) {
                                        cl += ' ' + c;
                                    }
                                    const body = this.body[0];
                                    if (typeof woocommerce_params !== 'undefined') {
                                        body.classList.remove('woocommerce-no-js');
                                        cl += ' woocommerce-js';
                                    }
                                    body.className += cl;
                                };
                        if (typeof themify_vars === 'undefined') {
                            const vars = doc.getElementById('tf_vars'),
                                    script = doc.createElement('script');
                            script.type = 'text/javascript';
                            script.textContent = vars.textContent;
                            vars.parentNode.replaceChild(script, vars);
                        }
                        this.is_min = themify_vars.is_min ? true : false;
                        this.url = themify_vars.url;
                        if(!themify_vars.cdn){
                            this.jsUrl = this.url + '/js/modules/';
                            this.cssUrl = this.url + '/css/modules/';
                        }
                        
                        this.js_modules = themify_vars.js_modules;
                        this.css_modules = themify_vars.css_modules;
                        if (!win['IntersectionObserver']) {
                            this.LoadAsync(this.url + '/js/modules/fallback.js');
                        }
                        if (themify_vars['done'] !== und) {
                            this.cssLazy = themify_vars['done'];
                            delete themify_vars['done'];
                        }
                        this.mobileMenu();
                        this.trigger('tf_init');
                        win.loaded = true;
                        if (themify_vars && !themify_vars['is_admin']) {
                            if (false && themify_vars['sw'] && win.self === win.top && ('serviceWorker' in navigator)) {// temprorary disabling    
                                const swargs=themify_vars['sw'],
                                uniqueID=this.hash(swargs.site_url);
                                if(!swargs.unbind){
                                        let swUrl=this.url+'/sw/sw',
                                                includesURL=encodeURIComponent(themify_vars.includesURL.replace(/\/$/, '').replace(swargs.site_url.replace(/\/$/, '')+'/','6789'));//6789 random name to replace it in sw.js
                                        if(this.is_min===true){
                                                swUrl+='.min';
                                        }
                                        swUrl+='.js?ver='+themify_vars.version+'&tv='+themify_vars['theme_v']+'&wp='+themify_vars.wp+'&uid='+uniqueID+'&i='+includesURL+'&jq='+$.fn.jquery+'&pl='+swargs.plugins_url;
                                        if(swargs.wp_n_min){
                                                swUrl+='&wpm=1';
                                        }
                                        if(swargs.is_multi){
                                                swUrl+='&m=1';
                                        }
                                        if(themify_vars.wc_version){
                                                swUrl+='&wc='+themify_vars.wc_version;
                                        }

                                        navigator.serviceWorker.register(swUrl,{scope:'/'});
                                }
                                else{
                                        navigator.serviceWorker.getRegistrations().then((registrations)=> {
                                                for(let i=registrations.length-1;i>-1;--i) {
                                                        if( registrations[i].active.scriptURL.indexOf(uniqueID)!==-1){
                                                          registrations[i].unregister();
                                                        }
                                                } 
                                        });
                                }  
                            }
                            if (themify_vars['theme_js']) {
                                this.LoadAsync(themify_vars.theme_js, null, themify_vars.theme_v);
                                delete themify_vars['theme_js'];
                            }
                            if (this.is_builder_active === false) {
                                if (win['tbLocalScript'] && doc.getElementsByClassName('module_row')[0]) {
                                    const burl=this.jsUrl===''?'':win['tbLocalScript'].builder_url;
                                    this.LoadAsync(burl + win['tbLocalScript'].js_modules.b.u, ()=> {
                                        this.is_builder_loaded = true;
                                        _loaded('has-builder');
                                        this.lazyLoading();
                                    }, win['tbLocalScript'].js_modules.b.v, null, ()=> {
                                        return typeof ThemifyBuilderModuleJs !== 'undefined';
                                    });
                                } else {
                                    _loaded();
                                    this.lazyLoading();
                                }
                                this.loadFonts();
                                this.stickyBuy();
								this.tooltips();
                            } else {
                                _loaded();
                            }
                            requestAnimationFrame(()=> {
                                this.initWC();
                                setTimeout(()=>{
                                    this.InitGallery();
                                    this.googleAnalytics();
                                }, 800);
                            });
                        }
                        this.initResizeHelper();
                        if (this.is_builder_active === false) {
                            this.touchDropDown();
                        }
                    };
            if (doc.readyState === 'complete' || this.is_builder_active === true) {
                windowLoad();
            } else {
                win.addEventListener('load', windowLoad, {once: true, passive: true});
            }
        },
        initComponents(el, isLazy) {
            if (isLazy === true && el[0].tagName === 'IMG') {
                return;
            }
            let items;
            const loading={'VIDEO':'video','AUDIO':'audio','auto_tiles':'autoTiles','tf_carousel':'InitCarousel','themify_map':'InitMap','[data-lax]':'lax','masonry':'isoTop','tf_search_form':'ajaxSearch'};
            for(let cl in loading){
                items=null;
                if (isLazy === true) {
                    if(cl==='[data-lax]'){
                        if(el[0].hasAttribute('data-lax')){
                            items = [el[0]];
                        }
                    }
                    else if (el[0].tagName === cl || el[0].classList.contains(cl) || (cl==='tf_search_form' && el[0].classList.contains('tf_search_icon'))) {
                        items = [el[0]];
                    }
                } else {
                    items = this.selectWithParent(cl.toLowerCase(), el);
                }
                if (items !== null && items.length > 0) {
                    this[loading[cl]](items);
                }
            }
            items=null;
            if (isLazy === true) {
                if (el[0].classList.contains('wp-embedded-content')) {
                    items = [el[0]];
                } else {
                    this.loadWPEmbed(el[0].getElementsByClassName('wp-embedded-content'));
                }
            } else {
                items = this.selectWithParent('wp-embedded-content', el);
            }
            if (items !== null && items.length > 0) {
                this.loadWPEmbed(items);
            }
            items=null;
            this.checkLargeImages(el);
        },
        component(key,f,...args){
            if (this.jsLazy['tf_'+key] === und) {
                this.LoadAsync(this.jsUrl+this.js_modules[key].u, ()=> {
                    this.jsLazy['tf_'+key] = true;
                    this.trigger('tf_'+f+'_init', args);
                }, this.js_modules[key].v, null, ()=> {
                    return !!this.jsLazy['tf_'+f];
                });
            } else {
                this.trigger('tf_'+f+'_init', args);
            }
        },
        FixedHeader(options) {
            if (!this.is_builder_active) {
                this.component('fxh','fixed_header',options);
            }
        },
        lax(items, is_live) {
            if ((is_live !== true && this.is_builder_active) || items.length === 0) {
                return;
            }
            this.component('lax','lax',items);
        },
        video(items) {
            if (!items || items.length === 0) {
                return false;
            }
            if (this.jsLazy['tf_video'] === und) {
                const check = ()=> {
                            if (this.cssLazy['tf_video'] === true && this.jsLazy['tf_video'] === true) {
                                this.trigger('tf_video_init', [items]);
                            }
                        };
                this.LoadCss(this.cssUrl+this.css_modules.video.u, this.css_modules.video.v, null, null, ()=> {
                    this.cssLazy['tf_video'] = true;
                    check();
                });
                this.LoadAsync(this.jsUrl+this.js_modules.video.u, ()=> {
                    this.jsLazy['tf_video'] = true;
                    check();
                }, this.js_modules.video.v, null, ()=> {
                    return !!this.jsLazy['tf_video'];
                });
            } else {
                this.trigger('tf_video_init', [items]);
            }
        },
        audio(items, options) {
            if (!items || items.length === 0) {
                return false;
            }
            if (this.jsLazy['tf_audio'] === und) {
                const check = ()=> {
                            if (this.cssLazy['tf_audio'] === true && this.jsLazy['tf_audio'] === true) {
                                this.trigger('tf_audio_init', [items, options]);
                            }
                        };
                this.LoadCss(this.cssUrl+this.css_modules.audio.u, this.css_modules.audio.v, null, null, ()=>{
                    this.cssLazy['tf_audio'] = true;
                    check();
                });
                this.LoadAsync(this.jsUrl+this.js_modules.audio.u, ()=> {
                    this.jsLazy['tf_audio'] = true;
                    check();
                }, this.js_modules.audio.v, null, ()=> {
                    return !!this.jsLazy['tf_audio'];
                });
            } else {
                this.trigger('tf_audio_init', [items, options]);
            }
        },
        sideMenu(items, options, callback) {
            if (!items || items.length === 0) {
                return;
            }
            this.component('side','sidemenu',items, options, callback);
        },
        edgeMenu(menu) {
            if(doc.getElementsByClassName('sub-menu')[0]){
                this.component('edge','edge',menu);
            }
        },
        sharer(type, url, title) {
            this.component('sharer','sharer',type, url, title);
        },
        autoTiles(items, callback) {
            this.component('at','autotiles',items, callback);
        },
        InitCarousel(items, options) {
            if (items) {
             this.component('tc','carousel',items, options);
            }
        },
        InitMap(items) {
            this.component('map','map',items);
        },
        infinity(container, options) {
            if (!container || container.length === 0 || this.is_builder_active === true || (!options['button'] && options.hasOwnProperty('button')) || (options['path'] && typeof options['path'] === 'string' && doc.querySelector(options['path']) === null)) {
                return;
            }
            // there are no elements to apply the Infinite effect on
            if (options['append'] && !$(options['append']).length) {
                // show the Load More button, just in case.
                if (options['button']) {
                    options['button'].style.display = 'block';
                }
                return;
            }
            this.component('inf','infinite',container, options);
        },
        isoTop(items, options) {
            if (items instanceof jQuery) {
                items = items.get();
            } else if (items.length === und) {
                items = [items];
            }
            const res = [];
            for (let i = items.length - 1; i > -1; --i) {
                let cl = items[i].classList;
                if (!cl.contains('masonry-done') && (!cl.contains('auto_tiles') || !cl.contains('list-post') || !items[i].previousElementSibling || items[i].previousElementSibling.classList.contains('post-filter'))) {
                    res.push(items[i]);
                }
            }
            if (res.length > 0) {
                if (this.jsLazy['tf_isotop'] === und || 'undefined' === typeof $.fn.packery) {
                    const check = ()=>{
                            if (this.jsLazy['tf_isotop'] === true && 'undefined' !== typeof $.fn.packery) {
                                this.trigger('tf_isotop_init', [res, options]);
                            }
                        };
                    if(typeof $.fn.packery === 'undefined'){
                        this.LoadAsync(this.jsUrl + this.js_modules.is.u, check, this.js_modules.is.v, null, ()=>{
                                return typeof $.fn.packery !== 'undefined';
                        });
                    }
                    if(this.jsLazy['tf_isotop']===und){
                        this.LoadAsync(this.jsUrl+this.js_modules.iso.u, ()=>{
                            this.jsLazy['tf_isotop'] = true;
                            check();
                        }, this.js_modules.iso.v, null, ()=> {
                            return !!this.jsLazy['tf_isotop'];
                        });
                    }
                } else {
                    this.trigger('tf_isotop_init', [res, options]);
                }
            }
        },
        fontAwesome(icons) {
            if (icons) {
                if (typeof icons === 'string') {
                    icons = [icons];
                } else if (!Array.isArray(icons)) {
                    if (icons instanceof jQuery) {
                        icons = icons[0];
                    }
                    icons = this.selectWithParent('tf_fa', icons);
                }
            } else {
                icons = doc.getElementsByClassName('tf_fa');
            }
            const Loaded = {},
                    needToLoad = [],
                    parents = [],
                    svg = doc.getElementById('tf_svg').firstChild,
                    loadedIcons = svg.getElementsByTagName('symbol');
            for (let i = loadedIcons.length - 1; i > -1; --i) {
                Loaded[loadedIcons[i].id] = true;
            }
            for (let i = icons.length - 1; i > -1; --i) {
                let id = icons[i].classList ? icons[i].classList[1] : icons[i];
                if (id && !Loaded[id]) {
                    if (this.fontsQueue[id] === und) {
                        this.fontsQueue[id] = true;
                        let tmp = id.replace('tf-', ''),
                                tmp2 = tmp.split('-');
                        if (tmp2[0] === 'fas' || tmp2[0] === 'far' || tmp2[0] === 'fab') {
                            let pre = tmp2[0];
                            tmp2.shift();
                            tmp = pre + ' ' + tmp2.join('-');
                        }
                        needToLoad.push(tmp);
                    }
                    if (icons[i].classList) {
                        let p = icons[i].parentNode;
                        p.classList.add('tf_lazy');
                        parents.push(p);
                    }
                }
            }
            if (needToLoad.length > 0) {
                const time = this.is_builder_active ? 5 : 2000;
                setTimeout( ()=>{
                    const request = new Headers({
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }),
                            data = new FormData();
                    data.append('action', 'tf_load_icons');
                    data.append('icons', JSON.stringify(needToLoad));

                    this.fetch(data,null,{credentials:'omit'}).then(res => {
                                const fr = doc.createDocumentFragment(),
                                        ns = 'http://www.w3.org/2000/svg';
                                let st = [];
                                for (let i in res) {
                                    let s = doc.createElementNS(ns, 'symbol'),
                                            p = doc.createElementNS(ns, 'path'),
                                            k = 'tf-' + i.replace(' ', '-'),
                                            viewBox = '0 0 ';
                                    viewBox += res[i].vw ? res[i].vw : '32';
                                    viewBox += ' 32';
                                    s.id = k;
                                    s.setAttributeNS(null, 'viewBox', viewBox);
                                    p.setAttributeNS(null, 'd', res[i]['p']);
                                    s.appendChild(p);
                                    fr.appendChild(s);
                                    if (res[i].w) {
                                        st.push('.tf_fa.' + k + '{width:' + res[i].w + 'em}');
                                    }
                                }
                                svg.appendChild(fr);
                                if (st.length > 0) {
                                    let css = doc.getElementById('tf_fonts_style');
                                    if (css === null) {
                                        css = doc.createElement('style');
                                        css.id = 'tf_fonts_style';
                                    }
                                    css.textContent += st.join('');
                                }
                                this.fontsQueue = {};
                                for (let i = parents.length - 1; i > -1; --i) {
                                    if (parents[i]) {
                                        parents[i].classList.remove('tf_lazy');
                                    }
                                }
                            });
                }, time);
            }
            return;
        },
        loadFonts() {
            this.requestIdleCallback(()=> {
                this.fontAwesome();
            }, 200);
            if (themify_vars['commentUrl']) {
                setTimeout(()=> {
                    this.loadComments();
                }, 3000);
            }
            if (themify_vars.wp_emoji) {
                setTimeout(()=> {
                    this.loadExtra(themify_vars.wp_emoji, null, false, ()=> {
                        win._wpemojiSettings['DOMReady'] = true;
                    });
                    themify_vars.wp_emoji = null;
                }, 4000);
            }
        },
        loadComments(callback) {
            if (!win['addComment'] && themify_vars['commentUrl']) {
                let comments = doc.getElementById('cancel-comment-reply-link');
                if (comments) {
                    comments = comments.closest('#comments');
                    if (comments) {
                        const self = this,
                                load = function () {
                                    this.removeEventListener('focusin', load, {once: true, passive: true});
                                    this.removeEventListener((self.isTouch ? 'touchstart' : 'mouseenter'), load, {once: true, passive: true});
                                    self.LoadAsync(themify_vars.commentUrl, callback, themify_vars.wp, null, ()=>{
                                        return !!win['addComment'];
                                    });
                                    themify_vars['commentUrl'] = null;
                                };
                        comments.addEventListener('focusin', load, {once: true, passive: true});
                        comments.addEventListener((this.isTouch ? 'touchstart' : 'mouseenter'), load, {once: true, passive: true});
                    }
                }
            }
        },
        LoadAsync(src, callback, version, extra, test, async) {
            const id = this.hash(src), // Make script path as ID
                    exist = !!this.jsLazy[id];
            if (exist === false) {
                this.jsLazy[id] = true;
            }
            if (exist === true || doc.getElementById(id) !== null) {
                if (callback) {
                    if (test) {
                        if (test() === true) {
                            this.requestIdleCallback(callback,200);
                            return this;
                        }
                        if (this.jsCallbacks[id] === und) {
                            this.jsCallbacks[id] = [];
                        }
                        this.jsCallbacks[id].push(callback);
                    } else {
                        this.requestIdleCallback(callback,200);
                    }
                }
                return this;
            } else if (test && test() === true) {
                if (extra) {
                    this.loadExtra(extra);
                }
                if (callback) {
                    this.requestIdleCallback(callback,200);
                }
                return this;
            }
            if (this.is_min === true && src.indexOf('.min.js') === -1 && src.indexOf(win.location.hostname) !== -1) {
                src = src.replace('.js', '.min.js');
            }
            if (version !== false && src.indexOf('ver=')===-1) {
                if(!version){
                    version = themify_vars.version;
                }
                src += '?ver=' + version;
            }
            const s = doc.createElement('script'),
                    self = this;
            s.setAttribute('id', id);
            if (async !== false) {
                async = 'async';
            }
            s.setAttribute('async', async);
            s.addEventListener('load', function () {
                const key = this.getAttribute('id');
                self.requestIdleCallback(()=> {
                    if (callback) {
                        callback();
                    }
                    if (self.jsCallbacks[key]) {
                        for (let i = 0, len = self.jsCallbacks[key].length; i < len; ++i) {
                            self.jsCallbacks[key][i]();
                        }
                        delete self.jsCallbacks[key];
                    }
                },500);
            }, {passive: true, once: true});
            s.setAttribute('src', src);
            doc.head.appendChild(s);
            if (extra) {
                this.loadExtra(extra, s);
            }
            return this;
        },
        loadExtra(data, handler, inHead, callback) {
            if (data) {
                if (typeof handler === 'string') {
                    handler = doc.querySelector('script#' + handler);
                    if (handler === null) {
                        return;
                    }
                }
                let str = '';
                if (handler) {
                    if (data['before']) {
                        if (typeof data['before'] !== 'string') {
                            for (let i in data['before']) {
                                if (data['before'][i]) {
                                    str += data['before'][i];
                                }
                            }
                        } else {
                            str = data['before'];
                        }
                        if (str !== '') {
                            const before = doc.createElement('script');
                            before.type = 'text/javascript';
                            before.text = str;
                            handler.parentNode.insertBefore(before, handler);
                        }
                    }
                }
                if (typeof data !== 'string') {
                    str = '';
                    for (let i in data) {
                        if (i !== 'before' && data[i]) {
                            str += data[i];
                        }
                    }
                } else {
                    str = data;
                }
                if (str !== '') {
                    const extra = doc.createElement('script');
                    extra.type = 'text/javascript';
                    extra.text = str;
                    if (inHead === und || inHead === true) {
                        doc.head.appendChild(extra);
                    } else {
                        doc.body.appendChild(extra);
                    }
                    if (callback) {
                        callback();
                    }
                }
            }
            return this;
        },
        LoadCss(href, version, before, media, callback) {
            const id = this.hash(href);
            if (this.cssLazy[id] !== true) {
                this.cssLazy[id] = true;
            } else {
                if (callback) {
                    const el = doc.getElementById(id);
                    if (el !== null && el.getAttribute('media') !== 'only_x') {
                        callback();
                    } else {
                        if (this.cssCallbacks[id] === und) {
                            this.cssCallbacks[id] = [];
                        }
                        this.cssCallbacks[id].push(callback);
                    }
                }
                return false;
            }

            if (!media) {
                media = 'all';
            }
            const ss = doc.createElement('link'),
                    self = this,
                    onload = function () {
                        this.setAttribute('media', media);
                        const key = this.getAttribute('id'),
                                checkApply = ()=>{
                                    const sheets = doc.styleSheets;
                                    let found = false;
                                    for (let i = sheets.length - 1; i > -1; --i) {
                                        if (sheets[i].ownerNode.id === key) {
                                            found = true;
                                            break;
                                        }
                                    }
                                    if (found === true) {
                                        if (callback) {
                                            callback();
                                        }
                                        if (self.cssCallbacks[key]) {
                                            for (let i = 0, len = self.cssCallbacks[key].length; i < len; ++i) {
                                                self.cssCallbacks[key][i]();
                                            }
                                            delete self.cssCallbacks[key];
                                        }
                                    } else {
                                        setTimeout(checkApply, 80);
                                    }
                                };
                        if (callback || self.cssCallbacks[key] !== und) {
                            checkApply();
                        }
                    };
            
           
            let  fullHref = href;
            if (this.is_min === true && href.indexOf('.min.css') === -1 && href.indexOf(win.location.hostname) !== -1) {
                fullHref = fullHref.replace('.css', '.min.css');
            }
            if (fullHref.indexOf('http') === -1) {
                // convert protocol-relative url to absolute url
                const placeholder = doc.createElement('a');
                placeholder.href = fullHref;
                fullHref = placeholder.href;
            }
            if (version !== false && fullHref.indexOf('ver=')===-1) {
                if(!version){
                    version = themify_vars.version;
                }
                fullHref+='?ver=' + version;
            }
            ss.setAttribute('href', fullHref);
            ss.setAttribute('rel', 'stylesheet');
            ss.setAttribute('importance', 'low');
            ss.setAttribute('media', 'only_x');
            ss.setAttribute('id', id);
            if ('isApplicationInstalled' in navigator) {
                ss.onloadcssdefined(onload);
            } else {
                ss.addEventListener('load', onload, {passive: true, once: true});
            }
            let ref = before;
            if (!ref) {
                const critical_st = doc.getElementById('tf_lazy_common');
                ref = critical_st ? critical_st.nextSibling : doc.head.firstElementChild;
            }
            ref.parentNode.insertBefore(ss, (before ? ref : ref.nextSibling));
            return this;
        },
        InitGallery() {
            const lbox = this.is_builder_active === false && themify_vars['lightbox'] ? themify_vars.lightbox : false;
            if (lbox !== false && lbox['lightboxOn'] !== false && this.jsLazy['tf_gal'] === und) {
                this.jsLazy['tf_gal'] = true;
                const self = this,
                        hash = win.location.hash.replace('#', ''),
                        p = self.body.parent(),
                        args = {
                            'extraLightboxArgs': themify_vars['extraLightboxArgs'],
                            'lightboxSelector': lbox['lightboxSelector'] ? lbox['lightboxSelector'] : '.themify_lightbox',
                            'gallerySelector': lbox['gallerySelector'] ? lbox['gallerySelector'] : '.gallery-item a',
                            'contentImagesAreas': lbox['contentImagesAreas'],
                            'i18n': lbox['i18n'] ? lbox['i18n'] : []
                        };
                if (lbox['disable_sharing']) {
                    args['disableSharing'] = lbox['disable_sharing'];
                }
                let isWorking = false;
                const isImg =  (url)=>{
                    return url.match(/\.(gif|jpg|jpeg|tiff|png|webp|apng)(\?fit=\d+(,|%2C)\d+)?(\&ssl=\d+)?$/i);
                },
                _click = function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if (isWorking === true) {
                        return;
                    }
                    isWorking = true;
                    const _this = $(e.currentTarget),
                            link = _this[0].getAttribute('href'),
                            loaderP = doc.createElement('div'),
                            loaderC = doc.createElement('div'),
                            checkLoad = ()=> {
                                if (self.cssLazy['tf_lightbox'] === true && self.jsLazy['tf_lightbox'] === true && self.jsLazy['tf_gallery'] === true) {
                                    p.off('click.tf_gallery');
                                    self.trigger('tf_gallery_init', args);
                                    _this.click();
                                    loaderP.remove();
                                }
                            };
                    loaderP.className = 'tf_lazy_lightbox tf_w tf_h';
                    if (link && isImg(link)) {
                        loaderP.textContent = 'Loading...';
                        const img = new Image();
                        img.decoding = 'async';
                        img.src = link;
                    } else {
                        loaderC.className = 'tf_lazy tf_w tf_h';
                        loaderP.appendChild(loaderC);
                    }
                    self.body[0].appendChild(loaderP);
                    if (!self.cssLazy['tf_lightbox']) {
                        self.LoadCss(self.cssUrl+self.css_modules.lb.u, self.css_modules.lb.v, null, null, ()=> {
                            self.cssLazy['tf_lightbox'] = true;
                            checkLoad();
                        });
                    }
                    if (!self.jsLazy['tf_lightbox']) {
                        self.LoadAsync(self.jsUrl+self.js_modules.lb.u, ()=> {
                            self.jsLazy['tf_lightbox'] = true;
                            checkLoad();
                        }, self.js_modules.lb.v, null, ()=> {
                            return 'undefined' !== typeof $.fn.magnificPopup;
                        });
                    }
                    if (!self.jsLazy['tf_gallery']) {
                        self.LoadAsync(self.jsUrl+self.js_modules.gal.u, ()=> {
                            self.jsLazy['tf_gallery'] = true;
                            checkLoad();
                        }, self.js_modules.gal.v, null, ()=> {
                            return !!self.jsLazy['tf_gallery'];
                        });
                    }
                    checkLoad();
                };
                p.on('click.tf_gallery', args['lightboxSelector'], _click);
                if (args['gallerySelector']) {
                    p.on('click.tf_gallery', args['gallerySelector'], function (e) {
                        if (isImg(this.getAttribute('href')) && !this.closest('.module-gallery')) {
                            _click(e);
                        }
                    });
                }
                if (lbox['contentImagesAreas']) {
                    p.on('click.tf_gallery', '.post-content a', function (e) {
                        if (isImg(this.getAttribute('href')) && $(this).closest(args.contentImagesAreas)) {
                            _click(e);
                        }
                    });
                }
                if (hash && hash !== '#') {
                    let item = doc.querySelector('img[alt="' + decodeURI(hash) + '"]');
                    item = null === item ? doc.querySelector('img[title="' + decodeURI(hash) + '"]') : item;
                    if (item) {
                        item = item.closest('.themify_lightbox');
                        if (item) {
                            item.click();
                        }
                    }
                }
            }
        },
        lazyLoading(parent) {
            if (this.lazyDisable === true) {
                return;
            }
            if (!parent) {
                parent = doc;
            }
            const items = (parent instanceof HTMLDocument || parent instanceof HTMLElement) ? parent.querySelectorAll('[data-lazy]') : parent,
                    len = items.length;
            if (len > 0) {
                const lazy =  (entries, _self, init)=>{
                            for (let i = entries.length - 1; i > -1; --i) {
                                if (this.lazyScrolling === null && entries[i].isIntersecting === true) {
                                    _self.unobserve(entries[i].target);
                                    this.requestIdleCallback(()=> {
                                        this.lazyScroll([entries[i].target], init);
                                    }, 70);
                                }
                            }
                        };
                let observerInit;
                if (this.observer === null) {
                        observerInit = new IntersectionObserver((entries, _self)=>{
                            lazy(entries, _self, true);
                            _self.disconnect();
                            let intersect2 = false;
                            const ev = this.isTouch ? 'touchstart' : 'mousemove',
                                    oneScroll = ()=> {
                                        if (intersect2) {
                                            intersect2.disconnect();
                                        }
                                        intersect2 = null;
                                        win.removeEventListener(ev, oneScroll, {once: true, passive: true});
                                        win.removeEventListener('scroll', oneScroll, {once: true, passive: true});
                                        this.observer = new IntersectionObserver((entries, _self)=> {
                                            lazy(entries, _self);
                                        }, {
                                            rootMargin: '300px 0px 300px 0px'
                                        });
                                        for (let i = 0; i < len; ++i) {
                                            if (items[i].hasAttribute('data-lazy') && !items[i].hasAttribute('data-tf-not-load')) {
                                                this.observer.observe(items[i]);
                                            }
                                        }
                                        setTimeout(()=> {//pre cache after one scroll/mousemove
                                            const prefetched = [];
                                            let j = 0;
                                            for (let i = 0; i < len; ++i) {
                                                if (items[i].hasAttribute('data-tf-src') && items[i].hasAttribute('data-lazy')) {
                                                    if (j < 10) {
                                                        let src = items[i].getAttribute('data-tf-src');
                                                        if (src && !prefetched[src]) {
                                                            prefetched[src] = true;
                                                            let img = new Image(),
                                                            srcset=items[i].getAttribute('data-tf-srcset');
                                                            img.decoding = 'async';
                                                            if(srcset){
                                                                img.srcset = srcset;
                                                            }
                                                            img.src = src;
                                                            ++j;
                                                        }
                                                    } else {
                                                        break;
                                                    }
                                                }
                                            }
                                            if (doc.getElementsByClassName('wow')[0]) {
                                                this.loadWowJs();
                                            }
                                        }, 1500);
                                    };
                            win.addEventListener('beforeprint', ()=> {
                                this.lazyScroll(doc.querySelectorAll('[data-lazy]'), true);
                            }, {passive: true});

                            win.addEventListener('scroll', oneScroll, {once: true, passive: true});
                            win.addEventListener(ev, oneScroll, {once: true, passive: true});
                            setTimeout(()=>{
                                if (intersect2 === false) {
                                    intersect2 = new IntersectionObserver((entries, _self)=>{
                                        if (intersect2 !== null) {
                                            lazy(entries, _self, true);
                                        }
                                        _self.disconnect();
                                    }, {
                                        threshold: .1
                                    });
                                    const len2 = len > 15 ? 15 : len;
                                    for (let i = 0; i < len2; ++i) {
                                        if (items[i] && items[i].hasAttribute('data-lazy') && !items[i].hasAttribute('data-tf-not-load')) {
                                            intersect2.observe(items[i]);
                                        }
                                    }
                                }
                            }, 1600);
                        });
                } else {
                    observerInit = this.observer;
                }
                if (observerInit) {
                    for (let i = 0; i < len; ++i) {
                        if (!items[i].hasAttribute('data-tf-not-load')) {
                            observerInit.observe(items[i]);
                        }
                    }
                }
            }
        },
        lazyScroll(items, init) {
            let len = 0;
            if (items) {
                len = items.length;
                if (len === und) {
                    items = [items];
                    len = 1;
                } else if (len === 0) {
                    return;
                }
            }
            const svg_callback = function () {
                this.classList.remove('tf_svg_lazy_loaded', 'tf_svg_lazy');
            };
            for (let i = len - 1; i > -1; --i) {
                let el = items[i],
                        tagName = el.tagName;
                if (!el || !el.hasAttribute('data-lazy')) {
                    if (el) {
                        el.removeAttribute('data-lazy');
                    }
                } else {
                    el.removeAttribute('data-lazy');
                    if (tagName !== 'IMG' && (tagName === 'DIV' || !el.hasAttribute('data-tf-src'))) {
                        let $el = $(el);
                        try {
                            el.classList.remove('tf_lazy');
                            this.reRun($el, null, true);
                            this.trigger('tf_lazy', $el);
                        } catch (e) {
                            console.log(e);
                        }
                    } else if (tagName !== 'svg') {
                        let src = el.getAttribute('data-tf-src'),
                                srcset = el.getAttribute('data-tf-srcset');
                        if (src) {
                            el.setAttribute('src', src);
                            el.removeAttribute('data-tf-src');
                        }
                        if (srcset) {
                            let sizes = el.getAttribute('data-tf-sizes');
                            if (sizes) {
                                el.setAttribute('sizes', sizes);
                                el.removeAttribute('data-tf-sizes');
                            }
                            el.setAttribute('srcset', srcset);
                            el.removeAttribute('data-tf-srcset');
                        }
                        el.removeAttribute('loading');
                        if (el.classList.contains('tf_svg_lazy')) {
                            this.imagesLoad(el, svg=> {
                                requestAnimationFrame(()=>{
                                    svg.addEventListener('transitionend', svg_callback, {once: true, passive: true});
                                    svg.classList.add('tf_svg_lazy_loaded');
                                });
                            });
                        } else if (tagName !== 'IFRAME') {
                            if(init !== true && el.parentNode !== this.body[0]){
                                el.parentNode.classList.add('tf_lazy');
                                this.imagesLoad(el, item=> {
                                    item.parentNode.classList.remove('tf_lazy');
                                });
                            }
                            this.checkLargeImages();
                        }
                    }
                }
                if (this.observer !== null && el) {
                    this.observer.unobserve(el);
                }
            }
        },
        reRun(el, type, isLazy) {
            if (isLazy !== true) {
                this.loadFonts();
            }
            if (typeof ThemifyBuilderModuleJs !== 'undefined') {
                ThemifyBuilderModuleJs.loadOnAjax(el, type, isLazy);
                this.initComponents(el, isLazy);
            } else if (!this.is_builder_loaded && themify_vars && !themify_vars['is_admin'] && win['tbLocalScript'] && doc.getElementsByClassName('module_row')[0]!==und) {
                const burl=this.jsUrl===''?'':win['tbLocalScript'].builder_url;
                this.LoadAsync(burl + win['tbLocalScript'].js_modules.b.u,   ()=> {
                    this.is_builder_loaded = true;
                    ThemifyBuilderModuleJs.loadOnAjax(el, type, isLazy);
                    this.initComponents(el, isLazy);
                }, win['tbLocalScript'].js_modules.b.v, null,   ()=> {
                    return typeof ThemifyBuilderModuleJs !== 'undefined';
                });
            } else {
                this.initComponents(el, isLazy);
            }
        },
        loadAnimateCss(callback) {
            if (this.cssLazy['animate'] === und) {
                this.LoadCss(this.cssUrl+this.css_modules.an.u, this.css_modules.an.v, null, null,  ()=> {
                    this.cssLazy['animate'] = true;
                    if (callback) {
                        callback();
                    }
                });
            } else if (callback) {
                callback();
            }
        },
        loadWowJs(callback) {
            if (this.jsLazy['tf_wow'] === und || this.cssLazy['animate'] === und) {
                const check = ()=>{
                            if (this.cssLazy['animate'] === true && this.jsLazy['tf_wow'] === true && callback) {
                                callback();
                            }
                        };
                if (this.cssLazy['animate'] === und) {
                    this.loadAnimateCss(check);
                }
                if (this.jsLazy['tf_wow'] === und) {
                    this.LoadAsync(this.jsUrl+this.js_modules.wow.u, ()=> {
                        this.jsLazy['tf_wow'] = true;
                        check();
                    }, this.js_modules.wow.v, null, ()=> {
                        return !!this.jsLazy['tf_wow'];
                    });
                }
            } else if (callback) {
                callback();
            }
        },
        loadDropDown(items, callback, load_stylesheet) {
            if (!items || items.length === 0) {
                return;
            }
            if (load_stylesheet !== false) {
                this.LoadCss(this.cssUrl+this.css_modules.drop.u,this.css_modules.drop.v);
            }
            this.LoadAsync(this.jsUrl+this.js_modules.drop.u, ()=>  {
                this.jsLazy['tf_dropdown'] = true;
                this.trigger('tf_dropdown_init', [items]);
                if (callback) {
                    callback();
                }
            }, this.js_modules.drop.v, null, ()=>  {
                return !!this.jsLazy['tf_dropdown'];
            });
        },
        initResizeHelper() {
            let running = false,
                    timeout,
                    timer;
            const ev = 'onorientationchange' in win ? 'orientationchange' : 'resize';
            win.addEventListener(ev, ()=> {
                if (running) {
                    return;
                }
                running = true;
                if (timeout) {
                    clearTimeout(timeout);
                }
                timeout = setTimeout(()=>{
                    if (timer) {
                        cancelAnimationFrame(timer);
                    }
                    timer = requestAnimationFrame(()=>{
                        const w = win.innerWidth,
                                h = win.innerHeight;
                        if (h !== this.h || w !== this.w) {
                            const params = {w: w, h: h, type: 'tfsmartresize', 'origevent': ev};
                            this.trigger('tfsmartresize', params);
                            $(win).triggerHandler('tfsmartresize', [params]);//deprecated
                            this.w = w;
                            this.h = h;
                        }
                        running = false;
                        timer = timeout = null;
                    });
                }, 150);
            }, {passive: true});
        },
        mobileMenu() {//deprecated
            if (themify_vars.menu_point) {
                const w = parseInt(themify_vars.menu_point),
                        _init =  (e)=> {
                            const cl = this.body[0].classList;
                            if ((!e && this.w <= w) || (e && e.w <= w)) {
                                cl.add('mobile_menu_active');
                            } else if (e !== und) {
                                cl.remove('mobile_menu_active');
                            }
                        };
                _init();
                this.on('tfsmartresize', _init);
            }
        },
        initWC(force) {
            if (themify_vars.wc_js) {
                if (!themify_vars.wc_js_normal) {
                    setTimeout(()=>{
                        doc.addEventListener((this.isTouch ? 'touchstart' : 'mousemove'), ()=>{
                            const fr = doc.createDocumentFragment();
                            for (let i in themify_vars.wc_js) {
                                let link = doc.createElement('link'),
                                        href = themify_vars.wc_js[i];
                                if (href.indexOf('ver', 12) === -1) {
                                    href += '?ver=' + themify_vars.wc_version;
                                }
                                link.as = 'script';
                                link.rel = 'prefetch';
                                link.href = href;
                                fr.appendChild(link);
                            }
                            doc.head.appendChild(fr);
                        }, {once: true, passive: true});
                    }, 1800);
                }
                this.component('wc','wc',force);
            }
        },
        megaMenu(menu, disable) {
            if (menu && !menu.dataset['init']) {
                menu.dataset.init = true;
                const isDisabled = disable || themify_vars.disableMega,
                        self = this,
                        maxW = 1 * themify_vars.menu_point + 1,
                        removeDisplay = function (e) {
                            const el = e instanceof jQuery ? e : this,
                                    w = e instanceof jQuery ? self.w : e.w;
                            if (w > maxW) {
                                el.css('display', '');
                            } else {
                                self.on('tfsmartresize', removeDisplay.bind(el), true);
                            }
                        },
                        closeDropdown = function (e) {
                            const el = e instanceof jQuery ? e : this;
                            if (e.target && !el[0].parentNode.contains(e.target)) {
                                el.css('display', '');
                                el[0].parentNode.classList.remove('toggle-on');
                            } else {
                                doc.addEventListener('touchstart', closeDropdown.bind(el), {once: true});
                            }
                        };
                if (!isDisabled && menu.getElementsByClassName('mega-link')[0]) {
                    const loadMega =  ()=>  {
                        const check =  ()=> {
                            if (self.cssLazy['tf_megamenu'] === true && self.jsLazy['tf_megamenu'] === true) {
                                self.trigger('tf_mega_menu', [menu, maxW]);
                            }
                        };
                        if (!self.cssLazy['tf_megamenu']) {
                            const url=self.jsUrl===''?'':self.url;
                            self.LoadCss(url+self.css_modules.mega.u, self.css_modules.mega.v, null, 'screen and (min-width:' + maxW + 'px)',  ()=>  {
                                self.cssLazy['tf_megamenu'] = true;
                                check();
                            });
                        }
                        if (!self.jsLazy['tf_megamenu']) {
                            const url=self.jsUrl===''?'':self.url;
                            self.LoadAsync(url+self.js_modules.mega.u,  ()=>  {
                                self.jsLazy['tf_megamenu'] = true;
                                check();
                            },self.js_modules.mega.v, null,  ()=>  {
                                return !!self.jsLazy['tf_megamenu'];
                            });
                        }
                        check();
                    };
                    if (this.w >= maxW || !this.isTouch) {
                        loadMega();
                    } else if (this.isTouch) {
                        const _resize = function () {
                            const ori = typeof this.screen !== 'undefined' && typeof this.screen.orientation !== 'undefined' ? this.screen.orientation.angle : this.orientation,
                                    w = (ori === 90 || ori === -90) ? this.innerHeight : this.innerWidth;
                            if (w >= maxW) {
                                this.removeEventListener('orientationchange', _resize, {passive: true});
                                loadMega();
                            }
                        };
                        win.addEventListener('orientationchange', _resize, {passive: true});
                    }
                } else if (!self.isTouch) {
                        setTimeout( ()=>  {
                            self.edgeMenu();
                        }, 1500);
                }
                menu.addEventListener('click', function (e) {
                    if (e.target.classList.contains('child-arrow') || (e.target.tagName === 'A' && (e.target.getAttribute('href') === '#' || e.target.parentNode.classList.contains('themify_toggle_dropdown')))) {
                        let el = $(e.target);
                        if (el[0].tagName === 'A') {
                            if (!el.find('.child-arrow')[0]) {
                                return;
                            }
                        } else {
                            el = el.parent();
                        }
                        e.preventDefault();
                        e.stopPropagation();
                        const li = el.parent();
                        let els = null,
                                is_toggle = und !== themify_vars.m_m_toggle && !li.hasClass('toggle-on') && self.w < maxW;
                        if (is_toggle) {
                            els = li.siblings('.toggle-on');
                            is_toggle = els.length > 0;
                        }
                        if (self.w < maxW || e.target.classList.contains('child-arrow') || el.find('.child-arrow:visible').length > 0) {
                            const items = el.next('div, ul'),
                                    ist = items[0].getAttribute('style'),
                                    headerwrap = doc.getElementById('headerwrap');
                            if (self.w < maxW && (ist === null || ist === '')) {
                                removeDisplay(items);
                            }
                            if (self.isTouch && !li.hasClass('toggle-on') && !self.body[0].classList.contains('mobile-menu-visible') && (null === headerwrap || (headerwrap.offsetWidth > 400))) {
                                closeDropdown(items);
                                li.siblings('.toggle-on').removeClass('toggle-on');
                            }
                            items.toggle('fast');
                            if (is_toggle) {
                                const slbs = els.find('>div,>ul'),
                                        sst = slbs[0].getAttribute('style');
                                if (self.w < maxW && (sst === null || sst === '')) {
                                    removeDisplay(slbs);
                                }
                                slbs.toggle('fast');
                            }
                        }
                        if (is_toggle) {
                            els.removeClass('toggle-on');
                        }
                        li.toggleClass('toggle-on');
                    }
                });
            }
        },
        touchDropDown() {
            const menus = doc.querySelectorAll('ul:not(.sub-menu)>.menu-item:first-child');
            for (let i = menus.length - 1; i > -1; --i) {
                let m = menus[i].parentNode,
                        p = m.parentNode;
                if (p.tagName !== 'LI' && !p.classList.contains('sub-menu')) {
                    this.megaMenu(m);
                }
            }
        },
        ajaxSearch(items) {
            if(this.is_builder_active===true){
                return;
            }
            const self = this,
                __callback=function(e){
                        const el=this,
                                isOverlay=e.type==='click',
                                type=isOverlay?'overlay':'dropdown',
                                css=['search_form','search_form_ajax','search_form_' + type],
                                _check =  ()=> {
                                     for(let i=css.length-1;i>-1;--i){
                                        if (self.cssLazy['tf_'+css[i]]!==true) {
                                            return;
                                        }
                                    }
                                    if(self.jsLazy['tf_search_ajax']){
                                        self.trigger('themify_overlay_search_init', [el]);
                                        self.triggerEvent(el, e.type);
                                    }
                                };
                        if(isOverlay){
                                e.preventDefault();
                                e.stopImmediatePropagation();
                        }
                if(isOverlay && el.classList.contains('tf_search_icon')){
					css.push('searchform_overlay'); 
                }
                _check();
                for(let i=css.length-1;i>-1;--i){
					let key='tf_'+css[i];
                    if (!self.cssLazy[key]) {
                        let url=self.cssUrl,
							v=null;
						if(css[i]==='searchform_overlay'){
							v=themify_vars.theme_v;
							url=themify_vars.theme_url+'/styles/modules/';
						}
                        self.LoadCss(url+css[i].replaceAll('_','-')+'.css', v, null, null, ()=> {
                            self.cssLazy[key] = true;
                            _check();
                        });
                    }
                }
                if (!self.jsLazy['tf_search_ajax']) {
                    self.LoadAsync(self.jsUrl+self.js_modules.as.u, ()=>{
                        self.jsLazy['tf_search_ajax'] = true;
                        _check();
                    }, self.js_modules.as.v, null, ()=> {
                        return !!self.jsLazy['tf_search_ajax'];
                    });
                }
            };
            for(let i=items.length-1;i>-1;--i){
                if(items[i].hasAttribute('data-ajax') && items[i].dataset.ajax===''){
                    continue;
                }
                let isIcon=items[i].classList.contains('tf_search_icon'),
                    isOverlay= isIcon || items[i].classList.contains('tf_search_overlay'),
                    el,
                    ev;
                if(isOverlay===false){
                    ev='focus';
                    el=items[i].querySelector('input[name="s"]');
                    el.autocomplete = 'off';
                }
                else{
                    ev='click';
                    el=isIcon?items[i]:items[i].getElementsByClassName('tf_search_icon')[0];
                }
                if(el){
                    el.addEventListener(ev,__callback, {once: true,passive:!isOverlay});
                }
            }
        },
        stickyBuy() {
            const pr_wrap = doc.querySelector('#content .product') || doc.querySelector('.tbp_template.product'),
                    st_buy = doc.getElementById('tf_sticky_buy');
            if (st_buy && pr_wrap) {
                (new IntersectionObserver((entries, _self)=>{
                    if (entries[0].isIntersecting || entries[0].boundingClientRect.top < 0) {
                        _self.disconnect();
                        let loaded = {},
                                check =  ()=> {
                                    if (loaded['stb'] === true && loaded['stb_t'] === true && loaded['js_stb_t'] === true) {
                                        this.trigger('tf_sticky_buy_init', [pr_wrap, st_buy]);
                                        loaded = null;
                                    }
                                };
                        this.LoadCss(this.cssUrl+this.css_modules.stb.u, this.css_modules.stb.v, null, null,  ()=> {
                            loaded['stb'] = true;
                            check();
                        });
                        if (this.css_modules.stb_t) {
                            this.LoadCss(this.cssUrl+this.css_modules.stb_t.u, this.css_modules.stb_t.v, null, null,  ()=> {
                                loaded['stb_t'] = true;
                                check();
                            });
                        } else {
                            loaded['stb_t'] = true;
                        }
                        this.LoadAsync(this.jsUrl+this.js_modules.stb.u, ()=> {
                            loaded['js_stb_t'] = true;
                            check();
                        },this.js_modules.stb.v);
                    }
                })).observe(doc.getElementById('tf_sticky_buy_observer'));
            }
        },
        loadWPEmbed(items) {
            if (items instanceof jQuery) {
                items = items.get();
            } else if (items.length === und) {
                items = [items];
            }
            if (items[0] !== und) {
                const embeds = [];
                for (let i = items.length - 1; i > -1; --i) {
                    if (!items[i].hasAttribute('data-done') && items[i].tagName === 'IFRAME') {
                        items[i].setAttribute('data-done', 1);
                        embeds.push(items[i]);
                    }
                }
                if (embeds[0] !== und) {
                    this.LoadAsync(themify_vars.wp_embed, ()=> {
                        for (let i = embeds.length - 1; i > -1; --i) {
                            let secret = embeds[i].getAttribute('data-secret');
                            if (!secret) {
                                secret = Math.random().toString(36).substr(2, 10);
                                embeds[i].setAttribute('data-secret', secret);
                            }
                            if (!embeds[i].hasAttribute('src')) {
                                embeds[i].setAttribute('src', embeds[i].getAttribute('data-tf-src'));
                            }
                            win.wp.receiveEmbedMessage({data: {message: 'height', value: this.h, secret: secret}, source: embeds[i].contentWindow});
                        }
                    }, themify_vars.wp, null, ()=> {
                        return 'undefined' !== typeof win.wp && 'undefined' !== typeof win.wp.receiveEmbedMessage;
                    });
                }
            }
        },
        checkLargeImages(el){
            if(themify_vars['lgi']!==und || this.is_builder_active===true){
                setTimeout(()=>{
                        this.requestIdleCallback(()=>{
                            if(doc.querySelector('.tf_large_img:not(.tf_large_img_done)')){
                                this.component('lgi','large_images',el);
                            }
                        });
                },1000);
            }
        },
        googleAnalytics() {
            if(themify_vars['g_m_id']!==und){
                this.requestIdleCallback( ()=>  {
                    this.LoadAsync('https://www.googletagmanager.com/gtag/js?id='+themify_vars['g_m_id'],()=>{
                        win.dataLayer = win.dataLayer || [];
                        function gtag(){win.dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', themify_vars['g_m_id']);
                        delete themify_vars['g_m_id'];
                    },false,null,()=>{
                        return !!win.google_tag_manager;
                    });
                }, 500);
            }
        },
        tooltips() {
                if ( themify_vars['menu_tooltips'].length || themify_vars['builder_tooltips'] ) {
                    this.LoadAsync( this.jsUrl + this.js_modules.t.u, null, this.js_modules.t.v );
                }
        },
        fetch(body,type,params,url){
            params=Object.assign({
                credentials:'same-origin',
                method:'POST',
                headers:{}
            }, params);
            params.headers['X-Requested-With']='XMLHttpRequest';
            if(body){
                params.body=body;
            }
            url=url || themify_vars.ajax_url;
            return fetch(url,params).then(res=>{
                if(!type || type==='json'){
                    return res.json();
                }
                if(type==='text'){
                   return res.text();
                }
            });
        }
    };
    Themify.Init();

})(window, document, undefined, jQuery);
