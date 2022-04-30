/**
 * overlay content module
 */
;
((Themify)=>{
	'use strict';
	const InitOverlay=(el)=>{
                el=el.getElementsByClassName('sidemenu')[0];
                if(el){
                    const id=el.id, 
                        item=document.querySelector('a[href="#'+id+'"]');
                    if(item){
                        Themify.sideMenu(item,{
                                panel:'#'+id,
                                close:'#'+id+'_close'
                        });
                        el.style.display='block';
                    }
                }
        },
        InitExpandable=(el)=>{
                el=el.getElementsByClassName('tb_ov_co_icon_wrapper')[0];
                if(el){
                    el.addEventListener('click',function(e){
                            e.preventDefault();
                            const container=this.closest('.module-overlay-content'),
                                    belowExpand=container.getElementsByClassName('tb_oc_expand_below')[0];
                            if(belowExpand){
                                belowExpand.style.minHeight=container.classList.contains('tb_oc_open')?0:belowExpand.scrollHeight+"px";
                            }
                            container.classList.toggle('tb_oc_open');
                    });
                }
        };
	Themify.on('builder_load_module_partial',(el,type,isLazy)=>{
            if(isLazy===true && !el[0].classList.contains('module-overlay-content')){
                return;
            }
            const items = Themify.selectWithParent('module-overlay-content',el),
                 bodyOverlay=document.getElementsByClassName('body-overlay')[0],
                ev=Themify.isTouch?'touchend':'click';
            for(let i=items.length-1; i>=0; --i){
                if('overlay'===items[i].getAttribute('data-overlay')){
                    if(bodyOverlay){
                        items[i].querySelector('.tb_oc_overlay_layer').addEventListener(ev,()=>{
                            bodyOverlay.click();
                        },{passive:true});
                    }
                    InitOverlay(items[i]);
                }else{
                    InitExpandable(items[i]);
                }

				if ( items[i].getElementsByClassName('tb_active_builder')[0] ) {
					items[i].classList.add( 'has_active_builder' );
				}
            }
	});
})(Themify);
