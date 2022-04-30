/**
 * builderParallax for row/column/subrow
 */
;
(($,Themify,win,doc)=>{
    'use strict';
    
    const className = 'builder-parallax-scrolling',
        items=[],
        def = {
            xpos: '50%',
            speedFactor:.1
        },
        scrollEvent=()=>{
            for (let i=items.length-1;i>-1;--i) {
                if(items[i] && items[i]['element']){
                    items[i].update(i);
                }
                else{
                    destroy(i);
                }
            }  
        },
        resize=(e)=>{
            if(e){
                wH = e.h;
            }
            for (let i=items.length-1;i>-1;--i) {
                if(items[i] && items[i]['element']){
                    items[i].top = items[i].element.offset().top;
                    items[i].update(i);
                }
                else{
                    destroy(i);
                }
            }
        },
        destroy=(index)=>{
            if (items[index]) {
                if(items[index].classList){
                    items[index].classList.remove(className);
                }
                items.splice(index, 1);
                if (items.length===0) {
                    Themify.off('tfsmartresize',resize);
                    win.removeEventListener('scroll', scrollEvent,{passive:true});
                    isInitialized = null;
                }
            }
		};
    let wH = null,
        isInitialized = null;
    function Plugin(element) {
        this.element = element;
        this.init();
    }
    Plugin.prototype = {
        top: 0,
        init() {
            this.top = this.element.offset().top;
            const src = this.element.css( 'background-image' ).replace(/(url\(|\)|")/g, '');
            if ( src && src !== 'none' ) {
                    const image = new Image(),
                        self=this;
                    image.src = src;
                    image.decode()
                    .then(() => {
                        self.w = image.width;
                        self.h = image.height;
                    })
					.catch(encodingError => {
						console.error('Parrallax('+src+'): '+encodingError);
					})
					.finally(()=> {
                        items.push( self );
                        self.update();
					});

            } else {
                    items.push( this );
                    this.update();
            }
            if (isInitialized===null) {
                wH = Themify.h;
                Themify.on('tfsmartresize',resize);
                win.addEventListener('scroll', scrollEvent,{passive:true});
                isInitialized = true;
            }
        },
        update(i) {
        	if (doc.body.contains(this.element[0]) === false || !this.element[0].classList.contains(className)) {
                destroy(i);
                return;
            }
            const pos = win.pageYOffset,
                    top = this.element.offset().top,
                    outerHeight = this.element.outerHeight(true),
					posY=(top - pos) * def.speedFactor;
            // Check if totally above or totally below viewport
            if ((top + outerHeight) < pos || top > (pos + wH)) {
                return;
            }
			this.element[0].style['backgroundPositionY']= 'calc(50% + ' + Math.round(posY) + 'px)';

			// calculate background-size: cover
			const coverRatio = Math.max( (this.element.outerWidth(true) / this.w), (outerHeight / this.h) );
			let newImageWidth = Math.round( this.w * coverRatio ),
				newImageHeight = Math.round( this.h * coverRatio );

			if ( newImageHeight === Math.round( outerHeight ) ) {
				// image is the exact height as the row, this will cause gap when backgroundPositionY changes; enlarge the image
				newImageWidth *= 1.3;
				newImageHeight *= 1.3;
				this.element[0].style['backgroundSize'] = Math.round( newImageWidth ) + 'px ' + Math.round( newImageHeight ) + 'px';
			} else {
				this.element[0].style['backgroundSize'] = '';
			}

        }
    };
    Themify.on('builder_load_module_partial', (el,type,isLazy)=>{
        let items;
        if(isLazy===true){
            if(!el[0].classList.contains('builder-parallax-scrolling')){
                return;
            }
            items=[el[0]];
        }
        else{
            items = Themify.selectWithParent('builder-parallax-scrolling',el);
        }
        for(let i=items.length-1;i>-1;--i){
            let el=$(items[i]);
            if(! el.data('plugin_builderParallax')){
                    el.data('plugin_builderParallax', new Plugin(el));
            }
        }
    });

})(jQuery,Themify,window,document);