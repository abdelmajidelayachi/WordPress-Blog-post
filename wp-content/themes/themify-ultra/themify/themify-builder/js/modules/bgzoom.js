/**
 * backgroundZooming for row/column/subrow
 */
;
((Themify,doc,win) =>{
    'use strict';
    let clientHeight = doc.documentElement.clientHeight,
        bclientHeight = doc.body.clientHeight,
        isInit=false,
        allItems=null,
        height = Themify.h;
    const zoomingClass = 'active-zooming',
        isZoomingElementInViewport = (item)=> {
            const rect = item.getBoundingClientRect();
            return (
                    rect.top + item.clientHeight >= (height || clientHeight || bclientHeight) / 2 &&
                    rect.bottom - item.clientHeight <= (height || clientHeight || bclientHeight) / 3
                );
        },
        resize=(e)=> {
            if(e){
                clientHeight = doc.documentElement.clientHeight;
                bclientHeight = doc.body.clientHeight;
                height=e.h;
            }
        },
        scroll=() =>{
            if(allItems===null){
                allItems=doc.getElementsByClassName('builder-zooming');
            }
            if(allItems[0]){
                doZooming(allItems);
            }
            else{
                win.removeEventListener('scroll', scroll,{passive:true,capture: true});
                Themify.off('tfsmartresize',resize);
                allItems=null;
                isInit=false;
            }
        },
        doZooming=(items)=>{
            for(let i=items.length-1;i>-1;--i){
                if (items[i] && !items[i].classList.contains(zoomingClass)&& isZoomingElementInViewport(items[i])) {
                    items[i].classList.add(zoomingClass);
                }
            }
        };
Themify.LoadCss(ThemifyBuilderModuleJs.cssUrl + 'bgzoom.css')
    .on('builder_load_module_partial', (el,type,isLazy)=>{
        let items;
        if(isLazy===true){
            if(!el[0].classList.contains('builder-zooming')){
                return;
            }
            items=[el[0]];
        }
        else{
            items = Themify.selectWithParent('builder-zooming',el);
        }
        if(items[0]!==undefined){
            doZooming(items);
            if(isInit===false){
                isInit=true;
                win.addEventListener('scroll', scroll,{passive:true,capture: true});
                Themify.on('tfsmartresize',resize);
            }
        }
    });

})(Themify,document,window);