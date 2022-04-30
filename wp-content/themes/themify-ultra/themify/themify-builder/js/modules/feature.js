/**
 * feature module
 */
;
((Themify) => {
    'use strict';
    const style_url=ThemifyBuilderModuleJs.cssUrl+'feature_styles/',
        sizes={'small':100,'medium':150,large:200},
        init =(item)=> {
            const p=item.closest('.module-feature');
            if(p){
                const cl = p.classList;
                if(!Themify.cssLazy['tb_feature_left'] && cl.contains('layout-icon-left')){
					Themify.cssLazy['tb_feature_left']=true;
                    Themify.LoadCss(style_url+'left.css');
                }
                else if(!Themify.cssLazy['tb_feature_right'] && cl.contains('layout-icon-right')){
                    Themify.cssLazy['tb_feature_right']=true;
                    Themify.LoadCss(style_url+'right.css');
                }
                const svgItem=item.getElementsByClassName('tb_feature_stroke')[0],
                    progress = svgItem?svgItem.getAttribute('data-progress'):null;
                if(progress){
                    if(!Themify.cssLazy['tb_feature_overlay'] && cl.contains('with-overlay-image')){
                        Themify.cssLazy['tb_feature_overlay']=true;
                        Themify.LoadCss(style_url+'overlay.css');
                    }
                    let w=0;
					if(!cl.contains('size-custom')){
						for(let i in sizes){
							if(cl.contains('size-'+i)){
								w=sizes[i];
								break;
							}
						}
					}
					else{
						w=parseInt(item.style['width']) || 0;
					}
                    if(w===0){
                        w=item.offsetWidth;
                    }
                    w=parseFloat(w/2)-parseFloat(svgItem.getAttribute('stroke-width')/2);
                    svgItem.setAttribute('stroke-dasharray', (parseFloat((2*Math.PI*w*progress)/100)+',10000'));
                }

				if ( p.hasAttribute( 'data-layout-mobile' ) ) {
					const layout_mobile = p.getAttribute( 'data-layout-mobile' ),
						layout_desktop = p.getAttribute( 'data-layout-desktop' ),
						callback = function( e ) {
							if ( ! e ) {
								return;
							}
							if ( e.w > tbLocalScript.breakpoints.mobile ) {
								p.classList.remove( 'layout-' + layout_mobile );
								p.classList.add( 'layout-' + layout_desktop );
							} else {
								p.classList.remove( 'layout-' + layout_desktop );
								p.classList.add( 'layout-' + layout_mobile );
							}
						};
					callback( { w : Themify.w } );
					Themify.on( 'tfsmartresize', callback );
				}
            }
        },
        observer=new IntersectionObserver( (entries, _self)=>{
            for (let i = entries.length - 1; i>-1; --i){
                if (entries[i].isIntersecting=== true){
                    _self.unobserve(entries[i].target);
                    init(entries[i].target);
                }
            }
        },{
            threshold:.9
        });
   Themify.on('builder_load_module_partial', (el,type,isLazy)=>{
        let items;
        if(isLazy===true){
            if(!el[0].classList.contains('module-feature')){
                return;
            }
            items=[el[0]];
        }
        else{
            items = Themify.selectWithParent('module-feature',el);
        }
        for(let i=items.length-1;i>-1;--i){
            let item=items[i].getElementsByClassName('module-feature-chart-html5')[0];
            if(item){
                observer.observe(item);
            }
        }
    });
})(Themify);
