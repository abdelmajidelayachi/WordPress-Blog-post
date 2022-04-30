/**
 * menu module
 */
;
(($, Themify, doc)=>{
    'use strict';

    const style_url = ThemifyBuilderModuleJs.cssUrl + 'menu_styles/',
            overlay = doc.createElement('div'),
            isActive = Themify.is_builder_active,
            loadMobileCss = (callback)=> {
                Themify.LoadCss(style_url + 'mobile.css', null, null, null, callback);
            },
            toggleCallback = (link, icon)=>{
                const st = link.nextElementSibling.style;
                st.display = st.display === 'none' || st.display === ''?'block': 'none';
                icon.classList.toggle('menu-close');
            },
            closeMenu = ()=> {
                overlay.classList.remove('body-overlay-on');
                Themify.body.removeClass('menu-module-left menu-module-right');
                const mobile_menu = $('.mobile-menu-module.visible').removeClass('left right');
                setTimeout(()=>{
                    mobile_menu.removeClass('visible');
                }, 300);
            },
            init = (isResize, items, windowWidth)=> {
                for (let i = items.length - 1; i > -1; --i) {
                    let breakpoint = parseInt(items[i].getAttribute('data-menu-breakpoint'));
                    if (!Themify.cssLazy['tb_menu_dropdown'] && items[i].classList.contains('dropdown')) {
                        Themify.cssLazy['tb_menu_dropdown'] = true;
                        Themify.LoadCss(style_url + 'dropdown.css');
                    }
                    if (!Themify.cssLazy['tb_menu_transparent'] || !Themify.cssLazy['tb_menu_vertical'] || !Themify.cssLazy['tb_menu_fullwidth']) {
                        let tmp = items[i].getElementsByClassName('nav')[0];
                        if (tmp) {
                            if (!Themify.cssLazy['tb_menu_transparent'] && tmp.classList.contains('transparent')) {
                                Themify.cssLazy['tb_menu_transparent'] = true;
                                Themify.LoadCss(style_url + 'transparent.css');
                            }
                            let type = tmp.classList.contains('fullwidth') ? 'fullwidth' : (tmp.classList.contains('vertical') ? 'vertical' : '');
                            if (type !== '' && !Themify.cssLazy['tb_menu_' + type]) {
                                Themify.cssLazy['tb_menu_' + type] = true;
                                Themify.LoadCss(style_url + type + '.css');
                                if ('vertical' === type && items[i].getElementsByClassName('tf_acc_menu').length === 0) {
                                    Themify.cssLazy['tb_menu_acc'] = true;
                                    Themify.LoadCss(style_url + 'accordion.css');
                                }
                            }
                        }
                    }
                    if (breakpoint > 0) {
                        items[i].classList.toggle('module-menu-mobile-active',windowWidth < breakpoint);
                    }
                    
                    if (items[i].getElementsByClassName('tf_acc_menu')[0]===undefined) {
                        setTimeout(()=> {
                            Themify.edgeMenu(items[i]);
                        }, 1500);
                    }
                }
                if (!isActive) {
                    if (isResize === false) {
                        let menuBurger = $('.menu-module-burger'),
                                breakpoint = menuBurger.parent().data('menu-breakpoint'),
                                style = menuBurger.parent().data('menu-style');
                        if (style === 'mobile-menu-dropdown' && menuBurger.length && windowWidth < breakpoint) {
                            Themify.body.on('click', (e)=> {
                                const $target = $(e.target),
                                        menuContainer = $('.module-menu-container');
                                if (!$target.closest('.module-menu-container').length && menuContainer.is(':visible') && !$target.closest('.menu-module-burger').length && menuBurger.is(':visible')) {
                                    menuBurger.removeClass('is-open');
                                    menuContainer.removeClass('is-open');
                                }
                            });
                        }
                    } else {
                        closeMenu();
                    }
                }
            };
    setTimeout( ()=> {
        Themify.LoadCss(style_url + 'hidden.css');
    }, 800);
    Themify.on('builder_load_module_partial', (el,type,isLazy)=>{
        if(isLazy===true && !el[0].classList.contains('module-menu')){
            return;
        }
        const items = Themify.selectWithParent('module-menu',el);
        init(false, items, Themify.w);
        
    });
    if (!isActive) {
        const builder = doc.createElement('div'),
                link = doc.createElement('link');
        link.rel = 'prefetch';
        link.setAttribute('as', 'style');
        link.href = style_url + 'mobile.css';
        builder.className = 'themify_builder';
        overlay.classList.add('body-overlay');
        builder.appendChild(overlay);
        Themify.body[0].appendChild(builder);
        Themify.body[0].appendChild(link);
        Themify.body.on('click', '.menu-module-burger', function (e) {
            e.preventDefault();
            loadMobileCss( ()=> {
                const $parent = $(this).parent(),
                        elStyle = $parent.data('menu-style');
                if (elStyle === 'mobile-menu-dropdown') {
                    $(this).toggleClass('is-open').siblings('.module-menu-container').toggleClass('is-open');
                    return;
                }

                const menuDirection = $parent.data('menu-direction'),
                        elID = $parent.data('element-id'),
                        builderID = builder.dataset.id,
                        newBuilderID = $parent[0].closest('.themify_builder_content').dataset.postid;
                if (!builderID || newBuilderID !== builderID) {
                    if (builderID) {
                        builder.classList.remove('themify_builder_content-' + builderID);
                    }
                    builder.dataset.id = newBuilderID;
                    builder.className += ' themify_builder_content-' + newBuilderID;
                }
                let mobile_menu = $('div[data-module="' + elID + '"]', builder);
                if (!mobile_menu.length) {
                    let gs = $parent.data('gs'),
                            menuContent = $parent.find('div[class*="-container"] > ul').clone(),
                            menuUI = menuContent.prop('class').replace(/nav|menu-bar|fullwidth|vertical|with-sub-arrow/g, ''),
                            customStyle = $parent.prop('class').match(/menu-[\d\-]+/g);

                    gs = !gs ? '' : ' ' + gs;
                    customStyle = customStyle ? customStyle[0] : '';
                    mobile_menu = $('<div/>');
                    mobile_menu.addClass('mobile-menu-module ' + ' ' + menuUI + ' ' + customStyle + ' ' + elID + ' ' + elStyle + gs + ' module-menu')
                            .attr('data-module', elID)
                            .attr('data-dir', menuDirection)
                            .appendTo(builder);

                    menuContent = menuContent.removeAttr('id').removeAttr('class').addClass('nav');
                    if (menuContent.find('ul').length) {
                        menuContent.find('ul').prev('a').append('<i class="toggle-menu"></i>');
                    }
                    Themify.body.addClass('menu-module-' + menuDirection);
                    Themify.lazyScroll(menuContent[0].querySelectorAll('[data-lazy]'), true);
                    mobile_menu
                            .html(menuContent)
                            .prepend('<a class="menu-close" href="#"><span class="menu-close-inner tf_close"></span></a>');
                }
                mobile_menu.addClass('visible');
                setTimeout( ()=> {
                    mobile_menu.addClass(menuDirection);
                }, 50); // small delay for CSS transition to take effect

                overlay.classList.add('body-overlay-on');
            });
        })
                .on('click', '.mobile-menu-module ul .toggle-menu', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    loadMobileCss( ()=>{
                        toggleCallback(this.closest('a'),this);
                    });
                }).on('click', '.mobile-menu-module ul a[href="#"]', function (e) {
            e.preventDefault();
            const linkIcon = this.querySelector('.toggle-menu');
            if (linkIcon !== null) {
                loadMobileCss( ()=> {
                    toggleCallback(this, linkIcon);
                });
            }
        })
                .on('click', '.themify_builder .body-overlay,.mobile-menu-module .menu-close,.mobile-menu-module .menu-item a', (e)=>{
                    const target = e.target;
                    if (target.classList.contains('toggle-menu') || (target.tagName==='A' && target.getAttribute('href') === '#')) {
                        return;
                    }
                    if (target.classList.contains('menu-close-inner') || (target.parentNode.classList.contains('menu-close'))) {
                        e.preventDefault();
                    }
                    loadMobileCss(closeMenu);
                });
    }

    Themify.on('tfsmartresize', (e)=>{
        if (e) {
            init(true, doc.querySelectorAll('.module-menu.module'), e.w);
        }
    });

})(jQuery, Themify, document);
