let ThemifyBuilderModuleJs;

(($, win,Themify, doc,und,vars)=>{
    'use strict';

    ThemifyBuilderModuleJs = {
        loadedAddons:{},
        cssUrl:'',
        jsUrl:'',
        url:vars.builder_url,
        js_modules:vars.js_modules,
        isBpMobile:!Themify.is_builder_active && Themify.w<parseInt(vars.breakpoints.tablet[1]),
        init() {
            if(Themify.jsUrl!==''){
                this.jsUrl = this.url+'/js/modules/';
                this.cssUrl = this.url+'/css/modules/';
            }
            Themify.body.triggerHandler('themify_builder_loaded');
            if (!Themify.is_builder_active) {
                this.GridBreakPoint();
                this.InitScrollHighlight();
                const stickyItems=doc.querySelectorAll('[data-sticky-active]');
                if(stickyItems[0]!==und){
                    if(win.pageYOffset>0){
                        this.stickyElementInit(stickyItems);
                    }
                    else{
                        win.addEventListener('scroll',()=>{
                                this.stickyElementInit(stickyItems);
                        },{passive:true,once:true});
                    }
                }
            }
        },
        wowInit(el, isLazy) {
            if(vars['is_animation']==='' || (this.isBpMobile===true && vars['is_animation']==='m')){
                return;
            }
            let items;
            if(isLazy===true){
                if(!el[0].hasAttribute('data-tf-animation') && !el[0].classList.contains('hover-wow')){
                    if(el[0].parentNode && (el[0].parentNode.hasAttribute('data-tf-animation') || el[0].parentNode.classList.contains('hover-wow'))){
                        items=[el[0].parentNode];
                    }
                    else{
                        return;
                    }
                }
                else{
                    items=el;
                }
            }
            else{
                items=Themify.selectWithParent('.hover-wow,[data-tf-animation]',el);
            }
            if(items[0]!==und){
                Themify.loadWowJs(()=>{
                    Themify.trigger('tf_wow_init',[items]);
                });
            }
        },
        InitScrollHighlight(el,isLazy) {
            if(isLazy===true || Themify.is_builder_active===true || (vars['scrollHighlight'] && vars['scrollHighlight']['scroll']==='external')){// can be 'external' so no scroll is done here but by the theme. Example:Fullpane.
                return;
            }
            let hasItems=el?(Themify.selectWithParent('[data-anchor]',el).length>0):(doc.querySelector('[data-anchor]')!==null);
            /* deep link for Tab and Accordion */
            if(hasItems===false){
                const hash= win.location.hash.replace('#','');
                if(hash!=='' && hash!=='#'){
                    hasItems=doc.querySelector('[data-id="'+hash+'"]')!==null;
                }
            }
            if(hasItems===true){
                if(Themify.jsLazy['tb_scroll_highlight']===und){
                    const url=this.jsUrl===''?'':this.url;
                    Themify.LoadAsync(url+this.js_modules.sh.u, ()=> {
                        Themify.jsLazy['tb_scroll_highlight']=true;
                        Themify.trigger('tb_init_scroll_highlight',[el]);
                     }, this.js_modules.sh.v, null, ()=> {
                         return !!Themify.jsLazy['tb_scroll_highlight'];
                    }); 
                }
                else{
                    Themify.trigger('tb_init_scroll_highlight',[el]);
                }
            }
        },
        addonLoad(el, slug,isLazy) {
            if (vars['addons'] && Object.keys(vars['addons']).length > 0) {
                let addons;
                if(slug){
                    if(!vars['addons'][slug] || this.loadedAddons[slug]===true){
                        return;
                    }
                    else {
                        addons = {};
                        addons[slug] = vars['addons'][slug];
                    }
                }
                else{
                    addons = vars['addons'];
                }
                for (let i in addons) {
                    if(this.loadedAddons[i]!==true){
                            let found =false;
                            if(addons[i]['selector']!==und || addons[i]['match']!==und){
                                if(isLazy===true){
                                    if(addons[i]['match']!==und){
                                        found=el[0].matches( addons[i]['match'] );
                                    }
                                    else{
                                        found=(el[0].matches( addons[i]['selector'] ) || el[0].querySelector( addons[i]['selector'] )!==null);
                                    }
                                }
                                else{
                                    let sel=addons[i]['selector']!==und?addons[i]['selector']:addons[i]['match'];
                                    found=doc.querySelector(sel.replaceAll(':scope>',''))!==null;
                                }
                            }
                            else{
                                found=isLazy===true?el[0].classList.contains( 'module-' + i ):doc.getElementsByClassName( 'module-' + i )[0]!==und;
                            }
                            if (found===true) {
                                    if (addons[i].css && Themify.cssLazy[i]===und) {
                                        if(typeof addons[i].css === 'string'){
                                            Themify.LoadCss(addons[i].css, addons[i].ver);
                                        }
                                        else{
                                            for(let j=addons[i].css.length-1;j>-1;--j){
                                                Themify.LoadCss(addons[i].css[j], addons[i].ver);
                                            }
                                        }
                                        delete vars['addons'][i]['css'];
                                    }
                                    if (addons[i].js) {
                                            Themify.LoadAsync(addons[i]['js'], ()=>{
                                                    this.loadedAddons[i]=true;
                                                    Themify.trigger('builder_load_module_partial', [el, slug,isLazy]);
                                                    delete vars['addons'][i]['js'];
                                            }, addons[i]['ver'],{'before':addons[i]['external']},()=>{
                                                    return this.loadedAddons[i]===true;
                                            });
                                    }
                                    if (slug) {
                                            return;
                                    }
                            }
                    }
                }
            }
        },
        loadOnAjax(el, type,lazy) {
            let slug=null;
            this.loadCss(el,lazy);
            this.touchdropdown(el,lazy);
            if(vars['addons']['p']!==und){
                this.backgroundScrolling(el,lazy);
            }
            if (Themify.is_builder_active===false) {
                this.loadMorePagination(el,lazy);
                if(lazy===false){
                    this.stickyElementInit(Themify.selectWithParent('[data-sticky-active]',el));
                }
            }
            else{
                slug = type === 'module' && tb_app.activeModel !== null ? tb_app.activeModel.get('mod_name') :false;
            }
            Themify.trigger('builder_load_module_partial', [el, type,lazy]);
            this.addonLoad(el,slug,lazy);
            this.initWC(el,lazy);
            this.wowInit(el, lazy);
            this.InitScrollHighlight(el,lazy);
        },
        initWC(el,isLazy){
            if(isLazy!==true && win['wc_single_product_params']!==und){
                $( '.wc-tabs-wrapper, .woocommerce-tabs, #rating',el).each(function(){
                        if(!this.hasAttribute('tb_done')){
                                this.setAttribute('tb_done',1);
                                if(this.id!=='rating' || this.parentNode.getElementsByClassName('stars')[0]){
                                        $(this).trigger( 'init' );
                                }
                        }

                });
                if(typeof $.fn.wc_product_gallery!=='undefined'){
                    const args=win['wc_single_product_params'];
                    $( '.woocommerce-product-gallery',el ).each( function() {
                        if(!this.hasAttribute('tb_done')){
                            $( this ).trigger( 'wc-product-gallery-before-init', [ this, args ] )
                                    .wc_product_gallery( args )
                                    .trigger( 'wc-product-gallery-after-init', [ this, args ] )[0].setAttribute('tb_done',1);
                        }
                    } );
                }
            }
        },
        touchdropdown(el,isLazy) {
            if (Themify.isTouch) {
                const items=isLazy===true?(el[0].classList.contains('module-menu')?el[0].getElementsByClassName('nav')[0]:null):$('.module-menu .nav', el);
                if(!items || !items[0]){
                    return;
                }
                Themify.LoadCss(this.cssUrl+'menu_styles/sub_arrow.css',()=>{
                    Themify.loadDropDown(items);
                });
            }
        },
        backgroundScrolling(el,isLazy) {
            if(vars['is_parallax']==='' || (this.isBpMobile===true && vars['is_parallax']==='m')){
                delete vars['addons']['p'];
                return true;
            }
        },
        GridBreakPoint() {
            const tablet_landscape = vars.breakpoints.tablet_landscape,
                    tablet = vars.breakpoints.tablet,
                    mobile = vars.breakpoints.mobile,
                    rows = doc.querySelectorAll('.row_inner,.subrow_inner');
                    let prev = false,
                    Breakpoints = (width)=> {
                        let type = 'desktop';

                        if (width <= mobile) {
                            type = 'mobile';
                        } else if (width <= tablet[1]) {
                            type = 'tablet';
                        } else if (width <= tablet_landscape[1]) {
                            type = 'tablet_landscape';
                        }

                        if (type !== prev) {
                            const is_desktop = type === 'desktop',
                                    set_custom_width = is_desktop || prev === 'desktop';

                            if (is_desktop) {
                                Themify.body[0].classList.remove('tb_responsive_mode');
                            } else {
                                if(!Themify.cssLazy['tb_responsive_mode'] && doc.querySelector('[data-basecol]')!==null){
                                    Themify.cssLazy['tb_responsive_mode']=true;
                                    Themify.LoadCss(this.cssUrl + 'responsive-column.css');
                                }
                                Themify.body[0].classList.add('tb_responsive_mode');
                            }

                            for (let i =rows.length-1; i > -1; --i) {
                                let columns = rows[i].children,
                                        grid = rows[i].getAttribute('data-col_' + type),
                                        first = columns[0],
                                        last = columns[columns.length - 1],
										dir = rows[i].getAttribute('data-'+type + '_dir'),
                                        base = rows[i].getAttribute('data-basecol');

                                if (set_custom_width) {
                                    for (let j =columns.length-1; j > -1; --j) {
                                        let w = columns[j].getAttribute('data-w');
                                        if (w) {
                                            columns[j].style['width'] = is_desktop?(w + '%'):'';
                                        }
                                    }
                                }

                                if (first && last) {
                                    if (dir === 'rtl') {
                                        first.classList.remove('first');
                                        first.classList.add('last');
                                        last.classList.remove('last');
                                        last.classList.add('first');
                                        rows[i].classList.add('direction-rtl');
                                    } else {
                                        first.classList.remove('last');
                                        first.classList.add('first');
                                        last.classList.remove('first');
                                        last.classList.add('last');
                                        rows[i].classList.remove('direction-rtl');
                                    }
                                }

                                if (base && !is_desktop) {
                                    if (prev !== false && prev !== 'desktop') {
                                        rows[i].classList.remove('tb_3col');
                                        let prev_class = rows[i].getAttribute('data-col_' + prev);

                                        if (prev_class) {
                                            rows[i].classList.remove(prev_class.replace('tb_3col', '').replace('mobile', 'column').replace('tablet', 'column').trim());
                                        }
                                    }

                                    if (!grid || grid === '-auto'|| grid===type+'-auto') {
                                        rows[i].classList.remove('tb_grid_classes','col-count-' + base);
                                    } else {
                                        let cl = rows[i].getAttribute('data-col_' + type);
                                        if (cl) {
                                            rows[i].classList.add('tb_grid_classes','col-count-' + base);
                                            cl = cl.split(' ');
                                            for(let j=cl.length-1;j>-1;--j){
                                                rows[i].classList.add(cl[j].replace('mobile', 'column').replace('tablet', 'column').trim());
                                            }
                                        }
                                    }
                                }
                            }
                            prev = type;
                        }
                    };
			
            Breakpoints(Themify.w);
            Themify.on('tfsmartresize', (e)=>{
                if(e && e.w!==Themify.w){
                    Breakpoints(e.w);
                }
            });
        },
        stickyElementInit(items) {
			if(vars['is_sticky']==='' || (this.isBpMobile===true && vars['is_sticky']==='m')){
				return;
			}
            if(items && items[0]!==und){
                if(Themify.jsLazy['tb_sticky']===und){
                    Themify.LoadAsync(this.jsUrl+this.js_modules.sty.u,()=>{
                        Themify.jsLazy['tb_sticky']=true;
                        Themify.trigger('tb_sticky_init',[items]);
                    },this.js_modules.sty.v,null,()=>{
                        return !!Themify.jsLazy['tb_sticky'];
                    });
                }
                else{
                    Themify.trigger('tb_sticky_init',[items]);
                }
            }
        },
        loadCss(el,isLazy){
            const modules=['image','buttons','service-menu'],
                appearance=['rounded','gradient','glossy','embossed','shadow'],
                colors=['pink','red','yellow','orange','brown','purple','green','light-purple','light-green','light-blue','blue','gray','black','tb_default_color','default'],
                cl=isLazy===true?el[0].classList:null,
                p=isLazy===true?el[0]:doc;
            let i;
            for(i=colors.length-1;i>-1;--i){
                if(Themify.cssLazy['tb_'+colors[i]]===und  && doc.querySelector('.ui.'+colors[i])!==null){
                    if(colors[i]==='default'){
                        Themify.cssLazy['tb_default']=true;
                        colors[i]='tb_default_color';
                    }
                    Themify.cssLazy['tb_'+colors[i]]=true;
                    Themify.LoadCss(this.cssUrl + 'colors/'+colors[i]+'.css');
                }
            }
	    for(i=appearance.length-1;i>-1;--i){
                if(Themify.cssLazy['tb_'+appearance[i]]===und){
                    let found=Themify.is_builder_active?true:(cl!==null && cl.contains(appearance[i])?true:(p.getElementsByClassName(appearance[i])[0]!==und)); 
                    if(found===true){
                        Themify.cssLazy['tb_'+appearance[i]]=true;
                        Themify.LoadCss(this.cssUrl + 'appearance/'+appearance[i]+'.css');
                    }
                }
            }	
            for(i=modules.length-1;i>-1;--i){
                let _styles,
                    m=modules[i],
                    _css={},
                    key=m;
                if(m==='image'){
                    _styles=['image-card-layout','image-full-overlay','image-overlay','image-left','image-center','image-right','image-top'];
                    _css['zoom']='zoom';
                }
                else if(m==='buttons'){
                    _styles=['buttons-vertical','buttons-fullwidth','outline'];
                }
                else if(m==='service-menu'){
                    _styles=['image-horizontal','image-overlay','image-top','image-right','image-center'];
                    key='image';
                    _css['highlight']='tb-highlight-text';
                    _css['price']='tb-menu-price';
                }
                if(cl===null || cl.contains('module-'+m)){
                    for(let j in _css){
                        if(Themify.cssLazy['tb_'+m+'_'+j]===und && p.getElementsByClassName(_css[j])[0]!==und){
                            Themify.cssLazy['tb_'+m+'_'+j]=true;
                            Themify.LoadCss(this.cssUrl + m+'_styles/'+j+'.css');
                        }
                    }
                    for(let j=_styles.length-1;j>-1;--j){
                        if(cl===null || cl.contains(_styles[j])){
                            let k=_styles[j].replace(key+'-','');
                            if(Themify.cssLazy['tb_'+m+'_'+k]===und){
                                Themify.cssLazy['tb_'+m+'_'+k]=true;
                                Themify.LoadCss(this.cssUrl + m+'_styles/'+k+'.css');
                            }
                        }
                    }
                }
            }
        },
        loadMorePagination(el,isLazy) {
                let items;
                if(isLazy===true){
                        if(!el[0].classList.contains('tb_ajax_pagination')){
                                return;
                        }
                        items = [el[0]];
                }
                else{
                        items = Themify.selectWithParent('tb_ajax_pagination',el);
                }
                if(items[0]!==und){
                        for(let i=items.length-1;i>-1;--i){
                                Themify.infinity(items[i],{id:'[data-id="'+items[i].dataset.id+'"]',scrollThreshold:false});
                        }
                }
        }
    };
    if(win.loaded===true){
        ThemifyBuilderModuleJs.init();
    }
    else{
        win.addEventListener('load', ()=>{
            ThemifyBuilderModuleJs.init();
        }, {once:true, passive:true});
    }

})(jQuery, window,Themify, document,undefined,tbLocalScript);
