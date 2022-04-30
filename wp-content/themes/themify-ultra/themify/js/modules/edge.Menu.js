/**
 *Edge menu module
 */
;
(($, doc)=>{
    const mouseEnter=function () {
			const target = this.tagName === 'A' ? this.parentNode : this;
            /* prevent "edge" classname being removed by mouseleave event when flipping through menu items really fast */
            const timeout= target.getAttribute('data-edge_menu_t');
            if(timeout){
                clearTimeout(timeout);
            }
            const elm =$(target.getElementsByTagName('ul')[0]);
			
            if ((elm.offset().left+elm.width()) > Themify.w) {
                target.classList.add('edge');
            }
        },
        mouseLeave=function (e) {
            if(e.target.closest('.edge')){
                return;
            }
			const target = this.tagName === 'LI' ? this : this.parentNode;
            const t = setTimeout(()=>{
                target.classList.remove('edge');
            }, 300);
            target.setAttribute('data-edge_menu_t', t);
        },
        init=function (menu){
            if(menu===null || menu.dataset['edge']){
                return;
            }
            menu.dataset['edge']=true;
            const items=menu.getElementsByTagName('li');
            for(let i=items.length-1;i>-1;--i){
                if(items[i].getElementsByTagName('ul')[0]){
                    items[i].addEventListener('mouseenter',mouseEnter,{passive:true});
                    items[i].addEventListener('mouseleave',mouseLeave,{passive:true});
                    /* tab keyboard menu nav */
                    let link = items[i].firstChild;
                    if('A'===link.tagName){
                        link.addEventListener('focus',mouseEnter,{passive:true});
                        link.addEventListener('blur',mouseLeave,{passive:true});
                    }
                }
            }
        };
    Themify.on('tf_edge_init', (el)=> {
        if(el===undefined){
            init(doc.getElementById('main-nav'));
            init(doc.getElementById('footer-nav'));
        }else{
            init(el);
        }
    });
})(jQuery,document);