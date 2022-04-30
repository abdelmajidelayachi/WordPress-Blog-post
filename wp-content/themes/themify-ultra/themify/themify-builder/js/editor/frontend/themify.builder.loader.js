/*! Themify Builder - Asynchronous Script and Styles Loader */
((Themify, win, doc)=>{
    'use strict';
    let $,
    isLoaded=false;
    const wpEditor = ()=> {
        const remove_tinymce = ()=> {
            if (win['tinymce'] && tinyMCE) {
                tinyMCEPreInit.mceInit['tb_lb_hidden_editor']['schema'] = 'html5';	
                tinyMCEPreInit.mceInit['tb_lb_hidden_editor']['element_format'] = 'html';
                tinyMCEPreInit.mceInit['tb_lb_hidden_editor']['wp_autoresize_on'] = false;
                tinyMCEPreInit.mceInit['tb_lb_hidden_editor']['plugins'] = 'charmap,colorpicker,hr,lists,media,paste,tabfocus,textcolor,fullscreen,wordpress,wpautoresize,wpeditimage,wpemoji,wpgallery,wpdialogs,wptextpattern,wpview,wplink';
                tinyMCEPreInit.mceInit['tb_lb_hidden_editor']['indent'] = 'simple';
                tinyMCEPreInit.mceInit['tb_lb_hidden_editor']['ie7_compat'] = false;
                tinyMCEPreInit.mceInit['tb_lb_hidden_editor']['root_name'] = 'div';
                tinyMCEPreInit.mceInit['tb_lb_hidden_editor']['relative_urls'] = true;
                tinyMCE.execCommand('mceRemoveEditor', true, 'tb_lb_hidden_editor');
                $('#wp-tb_lb_hidden_editor-editor-container,#wp-tb_lb_hidden_editor-editor-tools').remove();
            }
        },
        body = new FormData();
        body.append('action', 'tb_load_editor');
        Themify.fetch(body,'text').then(res=>{
                const resp = doc.createElement('div'),
                loaded = {},
                needToLoad = {},
                fr = doc.createDocumentFragment(),
                scriptsFr = doc.createDocumentFragment(),
                body = Themify.body[0],
                jsLoadCallback = function () {
                    loaded[this.src] = true;
                    if ($.ui && $.fn.mouse && $.fn.sortable) {
                        Themify.trigger('tb_load_iframe');
                    }
                    for (let i in needToLoad) {
                        if (loaded[i] !== true) {
                            return false;
                        }
                    }
                    const fr = doc.createDocumentFragment();
                    for (let i = 0, len = final.length; i < len; ++i) {
                        fr.appendChild(final[i]);
                    }
                    body.appendChild(fr);
                    remove_tinymce();
                };
            resp.innerHTML = res;
            const items = resp.querySelector('#tb_tinymce_wrap').children,
                    final = [];
            for (let i = 0, len = items.length; i < len; ++i) {

                if (items[0].tagName !== 'SCRIPT' || (items[0].getAttribute('type') && items[0].getAttribute('type') !== 'text/javascript')) {
                    fr.appendChild(items[0]);
                } else {
                    let s = doc.createElement('script');
                    for (let attr = items[0].attributes, j = attr.length - 1; j > -1; --j) {
                        s.setAttribute(attr[j].name, attr[j].value);
                    }
                    let src = items[0].getAttribute('src');
                    if (!src) {
                        let id=items[0].id;
                        if(!id || id.indexOf('themify-main-script')===-1){
                            let html = items[0].innerHTML;
                            s.innerHTML = html;
                            if (html.indexOf('tinyMCEPreInit.') === -1 && html.indexOf('.addI18n') === -1  && html.indexOf('.i18n') === -1 && html.indexOf('wp.editor') === -1) {
                                fr.appendChild(s);
                            } 
                            else {
                                final.push(s);
                            }
                        }
                    } 
                    else if (needToLoad[src] === undefined && src.indexOf('themify/js/main')===-1 && doc.querySelector('script[src="' + src + '"]') === null) {
                        s.async = false;
                        needToLoad[src] = true;
                        s.addEventListener('load', jsLoadCallback, {once: true, passive: true});
                        s.addEventListener('error', jsLoadCallback, {once: true, passive: true});
                        fr.appendChild(s);
                    }
                    items[0].remove();
                }
            }
            try {
                body.appendChild(fr);
            } 
            catch (e) {
            }
        });
    },
    windowLoad = ()=> {
        let pageId;
        $ = jQuery;
        if (!win['wp'] || !wp.customize) {
            let builder = doc.getElementsByClassName('themify_builder_content'),
                    toogle = doc.getElementsByClassName('toggle_tb_builder')[0],
                    found = false;
            pageId = toogle ? toogle.getElementsByClassName('tb_front_icon')[0].getAttribute('data-id') : false;
            for (let i = builder.length - 1; i > -1; --i) {
                let bid = builder[i].getAttribute('data-postid'),
                        a = doc.createElement('a'),
                        span = doc.createElement('span');
                if (bid === pageId) {
                    found = true;
                }
                a.href = 'javascript:void(0);';
                a.className = 'tb_turn_on js-turn-on-builder';
                span.className = 'dashicons dashicons-edit';
                span.setAttribute('data-id', bid);
                a.appendChild(span);
                const edit_label = builder[i].dataset.label || builder[i].parentNode.dataset.label,
					span2 = doc.createElement( 'span' );
				span2.innerHTML = edit_label ? edit_label : tbLoaderVars.turnOnBuilder;
                a.appendChild( span2 );
                builder[i].insertAdjacentElement( edit_label ? 'beforeBegin' : 'afterEnd', a );
            }
            if (!toogle) {
                toogle = doc.getElementsByClassName('js-turn-on-builder')[0];
                if (!toogle) {
                    const edit = doc.getElementsByClassName('dashicons-edit');
                    pageId = edit[0]?edit[0].getAttribute('data-id'):null;
                }
            }
            if(toogle){
                if (found === false) {
                    pageId = null;
                    toogle.classList.add('tb_disabled_turn_on');
                } else {
                    toogle.classList.remove('tb_disabled_turn_on');
                }
            }
        }
        let responsiveSrc = win.location.href.indexOf('?') > 0 ? '&' : '?';
        responsiveSrc = win.location.href.replace(win.location.hash, '').replace('#', '') + responsiveSrc + 'tb-preview=1&ver=' + win['themify_vars'].version;
        Themify.body.on('click.tb_loading', '.toggle_tb_builder:not(.tb_disabled_turn_on) > a, a.js-turn-on-builder', function (e) {
            e.preventDefault();
            e.stopPropagation();
            isLoaded=true;
            const is_locked = this.classList.contains('tb_restriction');
            Themify.LoadAsync(tbLocalScript.builder_url + '/js/editor/themify-ticks.js', ()=>  {
                if (is_locked) {
                    TB_Ticks.init(tbLocalScript.ticks).show();
                    init();
                }
            }, null, null, ()=>  {
                return !!win['TB_Ticks'];
            });
            Themify.body.off('click.tb_loading');
            if (is_locked) {
                return;
            }
            const post_id = !this.classList.contains('js-turn-on-builder') ? pageId : this.childNodes[0].getAttribute('data-id');
            if (!post_id || this.parentNode.classList.contains('tb_disabled_turn_on')) {
                return;
            }
            Themify.lazyDisable=Themify.lazyScrolling = true;
            if (Themify.observer !== null) {
                Themify.observer.disconnect();
            }


            //remove unused the css/js to make faster switch mode/window resize
            let builderLoader,
                    css_items = [],
                    scrollPos = $(doc).scrollTop(),
                    css = Themify.convert(doc.head.getElementsByTagName('link')).concat(Themify.convert(doc.head.getElementsByTagName('style')));
            const   $children = Themify.body.children(),
                    workspace = doc.createElement('div'),
                    bar = doc.createElement('div'),
                    leftBar = doc.createElement('div'),
                    rightBar = doc.createElement('div'),
                    verticalTooltip = doc.createElement('div'),
                    iframe = doc.createElement('iframe');
            workspace.className = 'tb_workspace_container';
            bar.className = 'tb_vertical_bars';
            leftBar.id = 'tb_left_bar';
            rightBar.id = 'tb_right_bar';
            leftBar.className = rightBar.className = 'tb_middle_bar';
            verticalTooltip.className = 'tb_vertical_change_tooltip';
            iframe.className = 'tb_iframe';
            iframe.id = iframe.name = 'tb_iframe';
            iframe.scrolling = Themify.isTouch ? 'no' : 'yes';
            iframe.src = responsiveSrc + '&tb-id=' + post_id;

            Themify.off('builder_load_module_partial');
            $(doc).off('ajaxComplete');

            if (tbLoaderVars.styles !== null) {
                for (let i  in tbLoaderVars.styles) {
                    if (tbLoaderVars.styles[i] !== '') {
                        Themify.LoadCss(i, tbLoaderVars.styles[i]);
                        css_items[i + '?ver=' + tbLoaderVars.styles[i]] = 1;
                    }
                }
            }
            builderLoader = doc.createElement('div');
            const fixed = doc.createElement('div'),
                    progress = doc.createElement('div'),
                    icon = doc.getElementsByClassName('tb_front_icon')[0];
            builderLoader.id = 'tb_alert';
            builderLoader.className = 'tb_busy';

            fixed.id = 'tb_fixed_bottom_scroll';
            fixed.className = 'tb_fixed_scroll';
            progress.id = 'builder_progress';

            progress.appendChild(doc.createElement('div'));
            doc.body.insertAdjacentElement('afterbegin', fixed);
            doc.body.appendChild(builderLoader);
            // Change text to indicate it's loading
            if (icon) {
                icon.parentNode.appendChild(progress);
            }
            Themify.on('tb_load_iframe', ()=> {

                bar.appendChild(leftBar);
                bar.appendChild(iframe);
                bar.appendChild(rightBar);
                bar.appendChild(verticalTooltip);
                workspace.appendChild(bar);

                iframe.addEventListener('load', function () {
                    const contentWindow = this.contentWindow;
                    let b;
                    Themify.on('themify_builder_ready', ()=> {
                        $(builderLoader).fadeOut(100, function () {
                            this.classList.remove('tb_busy');
                        });
                        const isArchive = Themify.body[0].classList.contains('archive');
                        let cl = 'themify_builder_active builder-breakpoint-desktop page-loaded';
                        if (Themify.isTouch) {
                            cl += ' tb_touch';
                        }
                        if (isArchive) {
                            // "archive" classname signifies whether current page being edited is a WP archive page
                            cl += ' archive';
                        }
                        if ('1' === tbLoaderVars.isGlobalStylePost) {
                            cl += ' gs_post';
                        }
                        Themify.body[0].className = cl;
                        Themify.body[0].removeAttribute('style');
                        workspace.style['display'] = 'block';
                        const activeBuilderPost = contentWindow.tb_app.Instances.Builder[0].$el.offset().top;
                        if (activeBuilderPost > scrollPos) {
                            scrollPos = activeBuilderPost;
                        }
                        contentWindow.scrollTo(0, scrollPos);
                        Themify.iframe = iframe;
                        Themify.is_builder_active = true;
                        setTimeout(()=> {
                            $children.hide();
                            for (let i = css.length - 1; i > -1; --i) {
                                if (css[i] && css[i].parentNode) {
                                    let href = css[i].href,
										id=css[i].id;
                                    if (href) {
                                        if ((!css_items[href] || css[i].id==='tf_base-css') && href.indexOf('wp-includes') === -1 && href.indexOf('admin-bar') === -1) {
                                            css[i].setAttribute('disabled', true);
                                            css[i].parentNode.removeChild(css[i]);
                                        }
                                    } 
									else if(id!=='tf_fonts_style'&& id!=='tf_lazy_common') {
                                        css[i].parentNode.removeChild(css[i]);
                                    }
                                }
                            }
                            css = css_items = tbLoaderVars = builderLoader = null;
                            $('.themify_builder_content,#wpadminbar,header').remove();
                            $children.filter('ul,a,video,audio').filter(':not(:has(link))').remove();
                            const events = ['scroll', 'tfsmartresize', 'debouncedresize', 'throttledresize', 'resize', 'mouseenter', 'keydown', 'keyup', 'mousedown', 'assignVideo'],
                                    $win = $(win),
                                    $doc = $(doc);
                            for (let i = events.length - 1; i > -1; --i) {
                                $win.off(events[i]);
                                $doc.off(events[i]);
                                Themify.body.off(events[i]);
                            }
                            doc.documentElement.removeAttribute('style');
                            doc.documentElement.removeAttribute('class');
                            const ticks = contentWindow.tbLocalScript.ticks;
                            ticks['postID']=post_id;
                            if (!b.hasClass('tb_restriction')) {
                                setTimeout(()=> {
                                    TB_Ticks.init(ticks, contentWindow).ticks();
                                }, 5000);
                            } else {
                                setTimeout(()=> {
                                    doc.body.appendChild(b.find('#tmpl-builder-restriction')[0]);
                                    TB_Ticks.init(ticks, contentWindow).show();
                                }, 1000);
                            }
                            setTimeout(()=>  {
                                const globals = ['ThemifyBuilderModuleJs', 'c', '_wpemojiSettings', 'twemoji', 'themifyScript', 'tbLocalScript', 'tbScrollHighlight', 'google', 'ThemifyGallery', 'Animation', '$f', 'Froogaloop', 'SliderProSlide', 'SliderProUtils', 'ThemifySlider', 'FixedHeader', 'LayoutAndFilter', 'WOW', 'Waypoint', '$slidernav', 'google', 'Microsoft', 'Rellax', 'module$contents$MapsEvent_MapsEvent', 'module$contents$mapsapi$overlay$OverlayView_OverlayView', 'wc_add_to_cart_params', 'woocommerce_params', 'wc_cart_fragments_params', 'wc_single_product_params', 'tf_mobile_menu_trigger_point', 'themifyMobileMenuTrigger'];

                                for (let i = globals.length - 1; i > -1; --i) {
                                    if (win[globals[i]]) {
                                        win[globals[i]] = null;
                                    }
                                }
                                Themify.events = {};
                                win['wp']['emoji'] = null;
								win.ajaxurl = themify_vars.ajax_url; // required for Ajax requests sent by WP
                                Themify.cssLazy = [];
								for(let lazy=contentWindow.document.querySelectorAll('[data-lazy]'),i=lazy.length-1;i>-1;--i){
									lazy[i].removeAttribute('data-lazy');
								}
                            }, 3000);
                        }, 800);
                    });
                    
                    
                    const __callback = ()=> {
                        contentWindow.themifyBuilder.post_ID = post_id;
                        b = contentWindow.jQuery('body');
                        b.trigger('builderiframeloaded.themify', this);
                    };
                    // Cloudflare compatibility fix
                    if ('__rocketLoaderLoadProgressSimulator' in contentWindow) {
                        const rocketCheck = setInterval(()=> {
                            if (contentWindow.__rocketLoaderLoadProgressSimulator.simulatedReadyState === 'complete') {
                                clearInterval(rocketCheck);
                                __callback();
                            }
                        }, 10);
                    } else {
                        __callback();
                    }
                    
                }, {once: true, passive: true});
                
                doc.body.appendChild(workspace);
                
            }, true);
            
            wpEditor();
        });
        if (!Themify.body[0].classList.contains('tb_restriction') && win.location.href.indexOf('tb-id')===-1) {
            if ( win.location.hash === '#builder_active' ) {
                $('.toggle_tb_builder > a').first().click();
                win.location.hash = '';
            } else {
                //cache iframe content in background
                setTimeout(()=>{
                    if(isLoaded===false){
                        const link = doc.createElement('link');
                        link.href = responsiveSrc + (pageId ? '&tb-id=' + pageId : '');
                        link.rel = 'prefetch';
                        link.setAttribute('as', 'doc');
                        doc.head.appendChild(link);
                    }
                },2000);
            }
        }
    };
    if (win.loaded === true) {
        windowLoad();
    } else {
        Themify.on('tf_init', windowLoad,true);
    }
})(Themify, window, document);