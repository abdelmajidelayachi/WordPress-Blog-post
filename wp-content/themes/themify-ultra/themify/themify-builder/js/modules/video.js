/**
 * video module
 */
;
((Themify)=>{
	'use strict';
	const css_url=ThemifyBuilderModuleJs.cssUrl+'video_styles/',
		init=(el)=>{
		const items = Themify.selectWithParent('module-video',el);
		for(let i=items.length-1; i> -1; --i){
			let item=items[i],
				url=item.getAttribute('data-url'),
				btn=item.getElementsByClassName('tb_video_overlay')[0];
			if(url){
				if(!Themify.cssLazy['tb_video_overlay'] && item.classList.contains('video-overlay')){
					Themify.cssLazy['tb_video_overlay']=true;
					Themify.LoadCss(css_url+'overlay.css');
				}
				if(btn){
					if(!Themify.cssLazy['tb_video_play_button']){
						Themify.cssLazy['tb_video_play_button']=true;
						Themify.LoadCss(css_url+'play_button.css');
					}
					btn.addEventListener('click',_click,{once:true});
				}else{
					let attr=Themify.parseVideo(url),
						wrap=item.getElementsByClassName('video-wrap')[0],
						iframe,
						autoplay=item.hasAttribute('data-auto'),
						muted=autoplay && !item.hasAttribute('data-clicked')?true:item.hasAttribute('data-muted');
					if(wrap.querySelector('iframe,video')===null){
						if(attr.type==='youtube' || attr.type==='vimeo'){
							let src='',
								allow='',
								start=item.hasAttribute('data-start')?item.dataset.start:false,
								end=item.hasAttribute('data-end')?item.dataset.end:false;
							iframe=document.createElement('iframe');
							const queryStr=url.split('?')[1],
								params = queryStr ? new URLSearchParams(queryStr) : false;
							if(attr.type==='youtube'){
								src='https://www.youtube'+(item.hasAttribute('data-privacy')?'-nocookie':'')+'.com/embed/'+attr.id+'?autohide=1&border=0&wmode=opaque&playsinline=1';
								if(params!==false){
									const list=params.get('list'),
										rel=params.get('rel');
									start=start || params.get('t');
									if(start){
										src+='&start='+start;
									}
									if(end){
										src+='&end='+end;
									}
									if(list){
										src+='&list='+list;
									}
									if(null!==rel){
										src+='&rel='+rel;
									}
								}
								allow='accelerometer;encrypted-media;gyroscope;picture-in-picture';
							}else{
								src='https://player.vimeo.com/video/'+attr.id+(start?'#t='+start+'s':'')+'?portrait=0&title=0&badge=0';
								if(attr.h){
									src+='&h='+attr.h;
								}else if(params!==false){
									const h=params.get('h');
									if(h){
										src+='&h='+h;
									}
								}
								allow='fullscreen';
							}
							if(muted){
								src+=attr.type==='youtube'?'&mute=1':'&muted=1';
							}
							if(autoplay){
								allow+=';autoplay';
								src+='&autoplay=1';
							}
							if(item.hasAttribute('data-hide-controls')){
								src+='&controls=0';
							}
							if(item.hasAttribute('data-branding')){
								allow+=';modestbranding';
								src+='&modestbranding=1';
							}
							iframe.setAttribute('allow',allow);
							iframe.setAttribute('allowfullscreen','');
							iframe.setAttribute('src',src);
						}else{
							iframe=document.createElement('video');
							iframe.src=url;
							iframe.controls=true;
							iframe.setAttribute('webkit-playsinline', 1);
							iframe.setAttribute('playsinline', true);
							if(autoplay){
								iframe.autoplay=true;
							}
							if(muted){
								iframe.muted=true;
							}
						}
						iframe.className='tf_abs tf_w tf_h';
						wrap.appendChild(iframe);
						if(attr.type!=='youtube' && attr.type!=='vimeo'){
							Themify.video([iframe]);
						}
					}
				}
				item.classList.remove('tf_lazy');
			}
		}
		},
		_click=function(e){
			e.preventDefault();
			e.stopPropagation();
			const wrap=this.closest('.module-video');
			wrap.setAttribute('data-auto',1);
			wrap.setAttribute('data-clicked',1);
			this.remove();
			init(wrap);
		};
	Themify.on('builder_load_module_partial', (el,type,isLazy)=>{
		if(isLazy===true && !el[0].classList.contains('module-video')){
                    return;
                }
         init(el);
	});

})(Themify);
