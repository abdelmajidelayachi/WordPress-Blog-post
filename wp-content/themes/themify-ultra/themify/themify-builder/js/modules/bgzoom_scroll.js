/**
 * backgroundZoomScrolling for row/column/subrow
 */
;
((Themify,doc,win) => {
    'use strict';
    let height = Themify.h,
        isInit=false,
        allItems=null;
    const scroll=() =>{
        if(allItems===null){
            allItems=doc.getElementsByClassName('builder-zoom-scrolling');
        }
        if(allItems[0]!==undefined){
            doZoom(allItems);
        }
        else{
            win.removeEventListener('scroll', scroll,{passive:true,capture: true});
            Themify.off('tfsmartresize',resize);
            allItems=null;
            isInit=false;
        }
    },
    resize=(e)=> {
        if(e){
            height=e.h;
        }
    },
    doZoom=(items)=> {
        for(let i=items.length-1;i>-1;--i){
            let rect = items[i].getBoundingClientRect();
            if (rect.bottom >= 0 && rect.top <= height) {
                items[i].style['backgroundSize']= (140 - (rect.top + items[i].offsetHeight) / (height + items[i].offsetHeight) * 40) + '%';
            }
        }
    };
    Themify.LoadCss(ThemifyBuilderModuleJs.cssUrl + 'bgzoom_scroll.css')
     .on('builder_load_module_partial', (el,type,isLazy)=>{
        let items;
        if(isLazy===true){
            if(!el[0].classList.contains('builder-zoom-scrolling')){
                return;
            }
            items=[el[0]];
        }
        else{
            items = Themify.selectWithParent('builder-zoom-scrolling',el);
        }
        if(items[0]!==undefined){
            doZoom(items);
            if(isInit===false){
                isInit=true;
                win.addEventListener('scroll', scroll,{passive:true,capture: true});
                Themify.on('tfsmartresize',resize);
            }
        }
    });  

})(Themify,document,window);