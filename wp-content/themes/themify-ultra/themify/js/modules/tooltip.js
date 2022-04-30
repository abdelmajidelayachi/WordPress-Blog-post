;((Themify,win,doc)=>{
    let curX, 
        curY, 
        isLoaded=null,
        req=null;

    const _ENTER_= Themify.isTouch ? 'touchstart' : 'mouseenter',
        _MOVE_= Themify.isTouch ? 'touchmove' : 'mousemove',
        _LEAVE_= Themify.isTouch ? 'touchend' : 'mouseleave',
        wrap = doc.createElement( 'div' ),
        fr=doc.createDocumentFragment(),
        callback = (e)=> {
            if(req!==null){
                cancelAnimationFrame(req);
            }
            req=requestAnimationFrame(()=>{
                let x = Themify.isTouch ? e.touches[0].clientX : e.clientX,
                    y = Themify.isTouch ? e.touches[0].clientY : e.clientY;
                if ( curX !== x || curY !== y ) {
                    curX = x;
                    curY = y;
                    wrap.style.left = x + 'px';
                    wrap.style.top = y + 'px';
                    wrap.classList.toggle('left',(x > Themify.w / 2));
                    wrap.classList.toggle('top',(y > Themify.h / 2));
                }
            });
        },
		/**
		 * init the tooltip events
		 * @arg .tf_tooltip element
		 * @arg parent tooltip's container
		 */
		init_tooltip = ( el, parent ) => {
			parent.addEventListener( _ENTER_, function( e ) {
                            if(isLoaded===true){
				el.classList.remove( 'tf_hide' );
				callback( e );

				this.addEventListener( _MOVE_, callback, { passive : true } );
				/* on touch devices, untapping anywhere on screen should hide the tooltips */
				( Themify.isTouch ? Themify.body[0] : this ).addEventListener( _LEAVE_, function() {
						parent.removeEventListener( _MOVE_, callback );
						el.classList.add( 'tf_hide' );
				}, { once : true, passive : true } );
                            }
			}, { passive : true } );

			fr.appendChild( el );
		},
        init=()=>{
            if(isLoaded===null){
                Themify.LoadCss( Themify.cssUrl + themify_vars.css_modules.t.u, themify_vars.css_modules.t.v,null,null,()=>{
                    isLoaded=true;
                } );
            }
			if ( themify_vars['builder_tooltips'] ) {
				for(let bid in themify_vars['builder_tooltips']){
					let builders=doc.getElementsByClassName('themify_builder_content-'+bid),
						items=themify_vars['builder_tooltips'][bid];
					for(let i=builders.length-1;i>-1;--i){
						for(let id in items){ 
							let item= builders[i].getElementsByClassName('tb_'+id)[0];
							if(item!==undefined){
							   let tlp=doc.createElement('div'),
									cl=item.classList,
									order = 1; /* order controls display order of tooltips when multiple elements are applicable. 1 is for modules, highest priority */
								if(cl.contains( 'module_row' )){
									order=5;
								}
								else if(cl.contains( 'tb-column')){
									order=4;
								}
								else if(cl.contains( 'module_subrow')){
									order=3;
								}
								else if(cl.contains( 'sub_column' )){
									order=2;
								}
								tlp.className='tf_tooltip tf_hide order-' + order;
								if(items[id].c){
									tlp.style['color']=items[id].c;
								}
								if(items[id].bg){
									tlp.style['background-color']=items[id].bg;
								}
								if(items[id].w){
									tlp.style['width']=items[id].w;
								}
								tlp.textContent=items[id].t;

								init_tooltip( tlp, item );
							}
						}
					}
				}
			}

			if ( themify_vars['menu_tooltips'].length ) {
				for ( let i = themify_vars['menu_tooltips'].length-1;i>-1 ; --i) {
					const el = doc.querySelector( themify_vars['menu_tooltips'][ i ] );
					if ( el ) {
						const items = el.querySelectorAll( '.menu-item a[title]' );
						for ( let j =  items.length-1;j>-1; --j) {
							let tooltip = doc.createElement( 'div' );
							tooltip.className = 'tf_tooltip tf_hide';
							tooltip.textContent = items[ j ].getAttribute( 'title' );
							init_tooltip( tooltip, items[ j ] );
							items[ j ].removeAttribute( 'title' );
						}
					}
				}
			}

            wrap.className = 'tf_tooltip_wrap';
            wrap.appendChild(fr);
            Themify.body[0].appendChild( wrap );
        };

   
    if(win.loaded===true){
        Themify.requestIdleCallback(init, 200);
    }
    else{
        win.addEventListener('load', init, {once:true, passive:true});
    }
} )( Themify,window, document );