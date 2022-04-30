(($,Themify,win,doc,fwVars,themeVars)=> {
    'use strict';
    const ThemifyTheme = {
        isFullPageScroll:false,
        is_horizontal_scrolling:false,
        bodyCl:Themify.body[0].classList,
        headerType:themeVars.headerType,
        v:fwVars.theme_v,
        url:fwVars.theme_url+'/',
        hasFixedHeader:false,
        init(){
            this.darkMode();
            this.isFullPageScroll=!Themify.is_builder_active && this.bodyCl.contains('full-section-scrolling');
            this.is_horizontal_scrolling=this.isFullPageScroll===true && this.bodyCl.contains('full-section-scrolling-horizontal');
            this.readyView();
            Themify.megaMenu(doc.getElementById('main-nav'));
            this.headerRender();
            this.headerVideo();
            this.fixedHeader();
            if(this.isFullPageScroll===true){
                this.fullpage();
            }
            this.wc();
            this.clickableOverlay();
            this.mobileMenuDropDown();
            setTimeout(()=>{this.loadFilterCss();},800);
            setTimeout(()=>{this.backToTop();},2000);
            this.doInfinite($('#loops-wrapper'));   
            setTimeout(()=>{this.commentAnimation();},3500);
            this.revealingFooter();
            this.singleInfinie();
            this.splitMenu();
        },
        fixedHeader(){
            if(this.is_horizontal_scrolling===false && this.bodyCl.contains('fixed-header-enabled') && this.headerType!=='header-bottom' && doc.getElementById('headerwrap')!==null){
				this.hasFixedHeader=true;
                Themify.FixedHeader();
            }
        },
        revealingFooter(){
            if (this.bodyCl.contains('revealing-footer') && doc.getElementById('footerwrap')!==null) {
                Themify.LoadAsync(this.url + 'js/modules/revealingFooter.js',null, this.v);
            }
        },
        doInfinite($container){
            if(themeVars.infiniteEnable){
                Themify.infinity($container[0],{
                    scrollToNewOnLoad:themeVars.scrollToNewOnLoad,
                    scrollThreshold: !('auto' !== themeVars.autoInfinite),
                    history: !themeVars.infiniteURL?false:'replace'
                });
            }
            Themify.on('infiniteloaded.themify', ()=>{//should be enable always,for single infinity and others
                this.loadFilterCss();
            });
        },
        fullpage(e) {
			if (doc.getElementsByClassName('themify_builder')[0]===undefined) {
				this.bodyCl.remove('full-section-scrolling');
                return;
            }
			if(e && doc.fullscreenElement!==null){
				Themify.on('tfsmartresize',this.fullpage.bind(this),true);
				return;
			}
			const w=e ? e.w : Themify.w,
				self=this;
            if (themeVars['f_s_d'] && w<parseInt(themeVars['f_s_d'])){
                Themify.lazyDisable = null;
                this.bodyCl.remove('full-section-scrolling');
                this.isFullPageScroll = false;
				Themify.lazyLoading();
                Themify.on('tfsmartresize',this.fullpage.bind(this),true);
				if(typeof tbLocalScript!=='undefined' && tbLocalScript['scrollHighlight']){
					delete tbLocalScript['scrollHighlight']['scroll'];
					if(typeof ThemifyBuilderModuleJs!=='undefined'){
						ThemifyBuilderModuleJs.InitScrollHighlight();
					}
				}
                return;
            }
            this.bodyCl.add('full-section-scrolling');
            Themify.lazyDisable = true;
            this.isFullPageScroll = true;
            let loaded=[];
		
            const callback=()=>{
				if(loaded['fullpage']===true && loaded['wow']===true){
					loaded=null;
					Themify.trigger('themify_theme_fullpage_init', [{
						is_horizontal: self.is_horizontal_scrolling,
						is_fixedHeader:self.hasFixedHeader,
						has_footer:self.bodyCl.contains('fullpage-footer')
					}]);
				}
			};
			Themify.loadWowJs(()=>{
				loaded['wow']=true;
				callback();
			});
			Themify.LoadAsync(this.url + 'js/modules/fullpage.js', ()=> {
				loaded['fullpage']=true;
				callback();
			},this.v);
        },
        loadFilterCss(){
                const filters = ['blur','grayscale','sepia','none'];
                for(let i=filters.length-1;i>-1;--i){
                        if(doc.getElementsByClassName('filter-'+filters[i])[0]!==undefined || doc.getElementsByClassName('filter-hover-'+filters[i])[0]!==undefined){
                                Themify.LoadCss(this.url + 'styles/modules/filters/'+filters[i]+'.css',this.v);
                        }
                }
        },
        headerVideo(){
			const header = doc.getElementById('headerwrap');
			if(header){
				const videos=Themify.selectWithParent('[data-fullwidthvideo]',header);
				if(videos.length>0){
					Themify.LoadAsync(this.url + 'js/modules/headerVideo.js',()=>{
						Themify.trigger('themify_theme_header_video_init',[videos]);
					}, this.v);
				}
			}
        }, 
		wc(){
            if(win['woocommerce_params']!==undefined){
                Themify.LoadAsync(this.url + 'js/modules/wc.js',null, this.v);
            }
        },
        mobileMenuDropDown(){
            const items = doc.getElementsByClassName('toggle-sticky-sidebar');
            for(let i=items.length-1;i>-1;--i){
                items[i].addEventListener('click',function () {
                        var sidebar = $('#sidebar');
                        if ($(this).hasClass('open-toggle-sticky-sidebar')) {
                                $(this).removeClass('open-toggle-sticky-sidebar').addClass('close-toggle-sticky-sidebar');
                                sidebar.addClass('open-mobile-sticky-sidebar tf_scrollbar');
                        } else {
                                $(this).removeClass('close-toggle-sticky-sidebar').addClass('open-toggle-sticky-sidebar');
                                sidebar.removeClass('open-mobile-sticky-sidebar tf_scrollbar');
                        }
                },{passive:true});
            }
        },
        splitMenu() {
			if ( this.headerType === 'header-menu-split' ) {
				const self = this,
				_resize = function(){
					if ( self.bodyCl.contains( 'mobile_menu_active' ) ) {
						/* on mobile move the site logo to the header */
						$( '#main-nav #site-logo' ).prependTo( '.header-bar' );
					} else {
						$( '.header-bar #site-logo' ).prependTo( $( '#main-nav .themify-logo-menu-item' ) );
					}
				};
				_resize();
				Themify.on('tfsmartresize',(e)=>{
					if(e){
						_resize(e);
					}
				});
			}
        },
        clickableOverlay(){
            setTimeout(()=>{
                Themify.body.on('click', '.post-content', function (e) {
                    if(e.target.tagName!=='A' && e.target.tagName!=='BUTTON'){
						const el = this.closest('.loops-wrapper');
						if(el!==null){
							const cl =el.classList;
							if((cl.contains('grid6') || cl.contains('grid5')|| cl.contains('grid4') || cl.contains('grid3') || cl.contains('grid2')) && (cl.contains('polaroid') || cl.contains('overlay') || cl.contains('flip'))){
								const link = this.closest( '.post' ).querySelector( '.post-image a, .post-title a' );
								if ( link?.href ) {
									link.click();
								}
							}
						}
					}
                });
            },1500);
        },
        headerRender(){
            const type=this.headerType;
            if(type==='header-horizontal' || type==='header-top-bar' || type==='boxed-compact'|| type==='header-stripe'){
				const headerWidgets = doc.getElementsByClassName('header-widget')[0];
				if (headerWidgets!==undefined) {
					const pullDown=doc.getElementsByClassName('pull-down')[0];
					if(pullDown!==undefined){
						pullDown.addEventListener('click', function (e) {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    $('#header').toggleClass('pull-down-close');
                                                    $(headerWidgets).slideToggle('fast');
						});
					}
				}
			}
            Themify.sideMenu(doc.getElementById('menu-icon'),{
                close: '#menu-icon-close',
                side:type==='header-leftpane' || type==='header-minbar'?'left':'right',
                hasOverlay:!(type==='header-slide-out' || type==='header-rightpane')
            });
            // Expand Mobile Menus
            if(undefined != fwVars.m_m_expand){
                Themify.on('sidemenushow.themify', (panel_id)=>{
                    if('#mobile-menu'===panel_id){
                        const items = doc.querySelectorAll('#main-nav>li.has-sub-menu');
                        for(let i=items.length-1;i>-1;i--){
                            items[i].className+=' toggle-on';
                        }
                    }
                },true);
            }
			if ( type === 'header-top-widgets' ) {
				const self = this,
				_resize = function(){
					if ( self.bodyCl.contains( 'mobile_menu_active' ) ) {
						$( '.header-widget-full .header-widget' ).appendTo( '#mobile-menu' );
					} else {
						$( '#mobile-menu .header-widget' ).prependTo( '.header-widget-full' );
					}
				};
				_resize();
				Themify.on('tfsmartresize',(e)=>{
					if(e){
						_resize(e);
					}
				});
			}
        },
        backToTop(){
            const back_top = doc.getElementsByClassName('back-top'),
				type=this.headerType,
				isFullpageScroll=this.isFullPageScroll,
				back_top_float=isFullpageScroll?null:doc.querySelector('.back-top-float:not(.footer-tab)');
				if(back_top_float){
					const events =['scroll'],
						scroll=function(){
							back_top_float.classList.toggle ('back-top-hide',(this.scrollY < 10));
							
						};
						if(Themify.isTouch){
							events.push('touchstart');
							events.push('touchmove');
						}
						for(let i=events.length-1;i>-1;--i){
							win.addEventListener(events[i],scroll,{passive:true});
						}
				}
			if (back_top[0]) {
				for(let i=back_top.length-1;i>-1;--i){
					back_top[i].addEventListener('click',function (e) {
						e.preventDefault();
						e.stopPropagation();
						if (isFullpageScroll || this.classList.contains('footer-tab')) {
							const wrap = doc.getElementById('footerwrap');
							if(wrap){
								wrap.classList.remove('tf_hide');
								Themify.lazyScroll(wrap.querySelectorAll('[data-lazy]'),true);
								wrap.classList.toggle('expanded');
							}
						}
						else {
							Themify.scrollTo();
						}
					});
				}
            }
        },
        commentAnimation(){
            if(doc.getElementById('commentform')){
                Themify.body.on( 'focus.tfCommentLabel', '#commentform input, #commentform textarea', function () {
					$( this ).closest( 'p' ).addClass('focused');
                }).on( 'blur.tfCommentLabel', '#commentform input, #commentform textarea', function () {
					if ( this.value === '' ) {
						$(this).removeClass('filled').closest('p').removeClass('focused');
					} else {
						$(this).addClass('filled');
					}
				} );
            }
        },
        readyView(){
            if (this.isFullPageScroll || '1' === themeVars.pageLoaderEffect ) {
                const bodyCl=this.bodyCl,
                 callback = ()=>{
                    bodyCl.add('ready-view');
                    bodyCl.remove('hidden-view');
                    $('.section_loader').fadeOut(500);
                    win.addEventListener('beforeunload', (e)=> {
                        const el = e.target.activeElement,
							href = el.getAttribute('href');
                    	if (el.tagName === 'BODY' || el.getAttribute('id') === 'tb_toolbar' || el.closest('#tb_toolbar') || (href && (href.indexOf('tel:') || href.indexOf('mailto:'))))
                            return;
                        bodyCl.add('hidden-view');
						bodyCl.remove('ready-view');
                    });
                };
				if(this.isFullPageScroll && !(themeVars['f_s_d'] && Themify.w<=parseInt(themeVars['f_s_d']))){
                    Themify.on('themify_onepage_afterload',callback,true);
                }else{
                    callback();
                }
            }
        },
		singleInfinie(){
			if(doc.getElementsByClassName('tf_single_scroll_wrap')[0]){
				win.addEventListener('scroll',()=>{
					Themify.LoadAsync(this.url + 'js/modules/single-infinite.js',null, this.v);
				},{once:true,passive:true});
			}
		},
		darkMode(){
			if(themeVars.darkmode){
				const current_date = new Date(),
					start_date = new Date(),
					end_date = new Date(),
					start = themeVars.darkmode.start.split(':'),
					end = themeVars.darkmode.end.split(':');
				start_date.setHours(start[0],start[1],0);
				if(parseInt(end[0])<parseInt(start[0])){
					end_date.setDate(end_date.getDate() + 1);
				}
				end_date.setHours(end[0],end[1],0);
				if(current_date >= start_date && current_date < end_date ){
					Themify.LoadCss(themeVars.darkmode.css,this.v,Themify.body[0].lastChild);
					this.bodyCl.add('tf_darkmode');
				}
				delete themeVars.darkmode;
			}
		}
    };
    ThemifyTheme.init();
})(jQuery,Themify,window,document,themify_vars,themifyScript);
