/**
 * gallery module
 */
;
(($,Themify,ThemifyBuilderModuleJs)=>{
    'use strict';
    const style_url=ThemifyBuilderModuleJs.cssUrl+'gallery_styles/',
            loaded={};
	let st=document.getElementById('tb_inline_styles');
    Themify.on('builder_load_module_partial', (el,type,isLazy)=>{
        if(isLazy===true && !el[0].classList.contains('module-gallery')){
            return;
        }
        const items = Themify.selectWithParent('module-gallery',el),
            masonry = [];
        for(let i=items.length-1;i>-1;--i){
            if(!Themify.cssLazy['tb_gallery_showcase'] && items[i].classList.contains('layout-showcase')){
                    Themify.cssLazy['tb_gallery_showcase'] =true;
                    Themify.LoadCss(style_url+'showcase.css');
            }
            else if(!Themify.cssLazy['tb_gallery_lightboxed'] && items[i].classList.contains('layout-lightboxed')){
                    Themify.cssLazy['tb_gallery_lightboxed'] =true;
                    Themify.LoadCss(style_url+'lightboxed.css');
            }
            else if(items[i].classList.contains('layout-grid')){
				if(!Themify.cssLazy['tb_gallery_grid']){
                    Themify.cssLazy['tb_gallery_grid'] =true;
                    Themify.LoadCss(style_url+'grid.css');
                }
				let isMasonry =items[i].getElementsByClassName('gallery-masonry')[0];
                if(isMasonry && !isMasonry.classList.contains('gallery-columns-1')){
					
					let styleText='',
						props=window.getComputedStyle(isMasonry),
						cols=props.getPropertyValue('--galN'),
						gutter=parseFloat(props.getPropertyValue('--galG'));
						if(!gutter){
							gutter=1.5;
						}
					if(!cols){
						let cl=isMasonry.classList;
						for(let j=cl.length-1;j>-1;--j){
							if(cl[j].indexOf('gallery-columns-')!==-1){
								cols=cl[j].replace('gallery-columns-','');
								break;
							}
						}
					}
					if(cols){
						cols=parseInt(cols);
						if(!loaded['block']){
							loaded['block']=true;
							styleText='.gallery-masonry.masonry-done{display:block}.gallery-masonry.masonry-done>.gutter-sizer{width:'+gutter+'%}';
						}
						if(!loaded[cols]){
							loaded[cols]=true;
							let size = parseFloat((100-((cols-1)*gutter))/cols).toFixed(2).replace('.00','');
							styleText+='.gallery-columns-'+cols+'.masonry-done .gallery-item{width:'+size+'%}';
						}
						if(styleText!==''){
							if(st===null){
								st=document.createElement('style');
								st.textContent=styleText;
								document.head.prepend(st);
							}
							else{
								st.innerText+=styleText;
							}
						}
						masonry.push(isMasonry);
					}
                }
            } 
        }
        if (masonry.length > 0) {
            Themify.isoTop(masonry,{itemSelector: '.gallery-item',columnWidth:false});
        }
    })
    .body.on('click', '.module-gallery .pagenav a', function (e) {
        e.preventDefault();
        const $wrap = $(this).closest('.module-gallery'),
                cl=$wrap[0].classList;
        $.ajax({
            url: this,
            beforeSend() {
                cl.add('builder_gallery_load');
            },
            complete() {
                cl.remove('builder_gallery_load');
            },
            success(data) {
                if (data) {
                    const id = $wrap[0].className.match( /tb_?.[^\s]+/ );
                    if ( null !== id && 'undefined' !== typeof id[0] ) {
                        $wrap.html($(data).find('.'+id[0]).first().html());
                    }else{
                        $wrap.html($(data).find('.module-gallery').first().html());
                    }
                    if(cl.contains('masonry-done')){
                            cl.remove('masonry-done');
                            cl.add('masonry');
                    }
                    ThemifyBuilderModuleJs.gallery($wrap);
                }
            }
        });
    })
    .on('click', '.layout-showcase.module-gallery a', function (e) {
        e.preventDefault();
        e.stopPropagation();
            const showcaseContainer = this.closest('.gallery').getElementsByClassName('gallery-showcase-image')[0],
                    titleBox = showcaseContainer.getElementsByClassName('gallery-showcase-title')[0],
                    titleText=showcaseContainer.getElementsByClassName('gallery-showcase-title-text')[0],
                    captionText=showcaseContainer.getElementsByClassName('gallery-showcase-caption')[0],
                    image = new Image();
			
		if(titleBox){
                    if(!titleBox.innerText.trim()){
                        titleBox.style['opacity']=0;
			titleBox.style['visibility']='hidden';
                    }
                    else{
                        titleBox.style['opacity']=titleBox.style['visibility']='';
                    }
		}
		showcaseContainer.classList.add('tf_lazy');
		image.decoding = 'async';
		image.alt=this.getElementsByTagName('img')[0].alt;
		if(titleText){
			titleText.innerHTML=this.title;
		}
		if(captionText){
			captionText.innerHTML=this.getAttribute('data-caption');
		}
		image.src= this.getAttribute('data-image');
                image.decode().finally(()=>{
                    const img=showcaseContainer.getElementsByTagName('img')[0];
                    img.parentNode.replaceChild(image,img);
                    showcaseContainer.classList.remove('tf_lazy');
                });
    });

})(jQuery,Themify,ThemifyBuilderModuleJs);
