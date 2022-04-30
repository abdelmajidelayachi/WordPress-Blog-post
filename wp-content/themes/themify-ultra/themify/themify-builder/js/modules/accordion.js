/**
 * accordion module
 */
;
(($,Themify) =>{
    'use strict';
    let isAttached=false;
    const style_url=ThemifyBuilderModuleJs.cssUrl+'accordion_styles/',
        init=()=>{
            Themify.body.off( 'click.tb_accordeon' ).on( 'click.tb_accordeon', '.accordion-title', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const $this = $(this),
                        $panel = $this.next(),
                        $item = $this.closest('li'),
                        $parent = $item.parent(),
                        hashtag = $parent[0].parentNode.hasAttribute('data-hashtag'),
						activeIcon=$item.find('>.accordion-title .accordion-active-icon'),
						passiveIcon=$item.find('>.accordion-title .accordion-icon'),
                        type = $parent.closest('.module-accordion[data-behavior]').data('behavior'),
                        def = $item.toggleClass('current').siblings().removeClass('current'); /* keep "current" classname for backward compatibility */

                    if (!$parent.hasClass('tf-init-accordion')) {
                        $parent.addClass('tf-init-accordion');
                    }

                    if ('accordion' === type) {
                        def.find('.accordion-content').slideUp().closest('li').removeClass('builder-accordion-active')
							.find('.accordion-title > a').attr('aria-expanded', 'false')
								.find( '>.accordion-title .accordion-icon' ).removeClass( 'tf_hide' )
								.end()
								.find( '>.accordion-title .accordion-active-icon' ).addClass( 'tf_hide' );
                    }
                    if ($item.hasClass('builder-accordion-active')) {
						
						activeIcon.addClass('tf_hide');
						passiveIcon.removeClass('tf_hide');
                        $panel.slideUp();
                        $item.removeClass('builder-accordion-active').find('>.accordion-title > a').attr('aria-expanded', 'false');
                        $panel.attr('aria-hidden', 'true');
                        if (true===hashtag && window.location.hash === e.target.closest('a').getAttribute('href')) {
                            if (window.history && window.history.pushState) {
                                window.history.pushState('', '', window.location.pathname)
                            } else {
                                window.location.href = window.location.href.replace(/#.*$/, '#');
                            }
                        }
                    } else {
						activeIcon.removeClass('tf_hide');
						passiveIcon.addClass('tf_hide');
                        $item.addClass('builder-accordion-active');
                        $panel.slideDown();
                        $item.find('>.accordion-title > a').attr('aria-expanded','true');
                        $panel.attr('aria-hidden', 'false');

                        // Show map marker properly in the center when tab is opened
                        const existing_maps = $panel.hasClass('default-closed') ? $panel.find('.themify_map') : false;
                        if (existing_maps) {
                            for (let i =existing_maps.length-1; i>-1 ;--i) { // use loop for multiple map instances in one tab
                                let current_map = $(existing_maps[i]).data('gmap_object'); // get the existing map object from saved in node
                                if (typeof current_map.already_centered !== 'undefined' && !current_map.already_centered)
                                    current_map.already_centered = false;
                                if (!current_map.already_centered) { // prevent recentering
                                    let currCenter = current_map.getCenter();
                                    google.maps.event.trigger(current_map, 'resize');
                                    current_map.setCenter(currCenter);
                                    current_map.already_centered = true;
                                }
                            }
                        }
                        if(true===hashtag){
                            if (window.history && window.history.pushState) {
                                window.history.pushState(null, null,  e.target.closest('a').getAttribute('href'))
                            } else {
                                window.location.href =  e.target.closest('a').getAttribute('href');
                            }
                        }
                    }
                    Themify.trigger('tb_accordion_switch', [$panel]);
                    $(window).triggerHandler( 'resize' );
                });
        },
        hashchange = ()=> {
                const hash = window.location.hash.replace('#','');
                if ( hash !== '' && hash !== '#' ) {
                        const acc = document.querySelector( '.module-accordion [data-id="'+hash+'"]' );
                        if ( acc ) {
                                let target = document.querySelector( '.accordion-title a[href="#' + hash + '"]' );
                                target.click();
                        }
                }
        };
    Themify.on('builder_load_module_partial',(el,type,isLazy)=>{
        if(isLazy===true && !el[0].classList.contains('module-accordion')){
            return;
        }
        const items = Themify.selectWithParent('module-accordion',el);
        for(let i=items.length-1;i>-1;--i){
            if(!Themify.cssLazy['tb_accordion_separate'] && items[i].classList.contains('separate')){
                Themify.cssLazy['tb_accordion_separate']=true;
                Themify.LoadCss(style_url+'separate.css');
            }
            if(!Themify.cssLazy['tb_accordion_transparent'] && items[i].classList.contains('transparent')){
                Themify.cssLazy['tb_accordion_transparent']=true;
                Themify.LoadCss(style_url+'transparent.css');
            }
        }
        if(isLazy!==true || isAttached===false){
            Themify.requestIdleCallback(init,50);
            window.addEventListener( 'hashchange', hashchange, { passive : true } );
            Themify.requestIdleCallback( hashchange, 51 );
            isAttached = true;
        }

    });

})(jQuery,Themify);
