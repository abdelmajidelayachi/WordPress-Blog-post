/**
 * fullwidth videos for row/column/subrow
 */
;
((Themify, doc) => {
    'use strict';
            const is_mobile = Themify.device==='mobile',
			videoParams=(el)=>{
				return {'mute':'unmute' !==el.getAttribute('data-mutevideo'), 'loop':'unloop' !==el.getAttribute('data-unloopvideo')};
			}, 
			loadCss=(callback)=>{
				if(!Themify.cssLazy['tb_fullwidth_video']){
					Themify.LoadCss(ThemifyBuilderModuleJs.cssUrl + 'fullwidthvideo.css',null, null, null, ()=>{
						Themify.cssLazy['tb_fullwidth_video']=true;
						if(callback){
							callback();
						}
					});
				}
				else{
					callback();
				}
            },
			getVideo=(id,src,type,autoplay)=>{
				const bigV = doc.createElement('div'),
				iframe = doc.createElement('iframe');
				bigV.className='tb_fullwidth_video tf_lazy tb_'+type+' tf_abs tf_w tf_h tf_overflow';
				iframe.setAttribute('allowfullscreen', false);
				iframe.setAttribute('webkitallowfullscreen', false);
				iframe.setAttribute('mozallowfullscreen', false);
				iframe.className='tf_mw tf_w tf_h';
				iframe.id = id;
				iframe.src = encodeURI(src);
				if(autoplay){
					iframe.setAttribute('data-autoplay', true);
					iframe.setAttribute('allow','autoplay');
				}
				iframe.setAttribute('unselectable','on');
				bigV.appendChild(iframe);
				return bigV;
			},
            Vimeo =  (el,url,id)=> {
				const params = videoParams(el),
					player_id='tb_vimeo_'+id,
					urlparams=new URL(url);
				let src = 'https://player.vimeo.com/video/' + id + '?api=1&byline=0&autopause=0&portrait=0&title=0&badge=0&controls=0&playsinline=1&callback=tb_vimeo&player_id=' + player_id,
					autoplay=false;
				if (params.loop) {
					src += '&loop=1';
				}
				if (params['autoplay']!==false) {
					src += '&autoplay=1';
					params['mute'] = true;
					autoplay=true;
				}
				if (params['mute'] === true) {
					src += '&muted=1';
				}
				if(urlparams.hash && urlparams.hash.indexOf('#t=')===0){
					src+=urlparams.hash;
				}
				const wrapper= getVideo(player_id,src,'vimeo',autoplay),
					ifr=wrapper.firstChild,
					message=(ev)=>{
						if (ev.origin.indexOf('player.vimeo.com')!==-1 && ifr && ifr.contentWindow) {
							const data = JSON.parse(ev.data);
							if(player_id===data.player_id){
								if(data.event==='ready'){
										const target='https://player.vimeo.com';
										ifr.contentWindow.postMessage(
										  JSON.stringify({
											'method': 'getVideoWidth'
										  }
										),target);
										ifr.contentWindow.postMessage(
										  JSON.stringify({
											'method': 'getVideoHeight'
										  }
										),target);
								}
								else if(data.method==='getVideoWidth' || data.method==='getVideoHeight'){
									if(data.method==='getVideoWidth'){
										ifr.setAttribute('width',data.value);
									}
									else{
										ifr.setAttribute('height',data.value);
									}
									const w=ifr.getAttribute('width'),
										h=ifr.getAttribute('height');
									if(h && w){
										window.removeEventListener('message', message,{passive:true});
										ifr.style['minHeight']=parseFloat(h/w)*100+'vw';
										ifr.style['minWidth']=parseFloat(w/h)*100+'vh';
										ifr.parentNode.classList.remove('tf_lazy');
									}
								}
							}
						}
				};
				window.addEventListener('message', message,{passive:true});
				return wrapper;
            },
			local=(el,url)=>{
				if (is_mobile === false  || 'play' === el.getAttribute('data-playonmobile')) {
					const params = is_mobile === true ? {loop: 'unloop' !== el.getAttribute('data-unloopvideo'), mute: true} : videoParams(el),
						wrap = doc.createElement('div'),
						videoEl = doc.createElement('video');
					wrap.className = 'tb_fullwidth_video tb_local_video tf_abs tf_w tf_h';
					videoEl.className = 'tf_w tf_h';
					videoEl.setAttribute('type', 'video/'+url.split('.').pop().split('?')[0]);
					videoEl.preload = 'auto';
					if(el.dataset['autoplay']==='no'){
						params['autoplay']=false;
					}else{
						videoEl.setAttribute('data-autoplay', true);
					}
					videoEl.setAttribute('webkit-playsinline', 1);
					videoEl.setAttribute('playsinline', true);
					videoEl.src = url;
					if (params['autoplay'] !== false) {
						videoEl.autoplay = true;
						params['mute'] = true;
					}
					if (params['mute'] === true) {
						videoEl.muted = true;
					}
					if (params['loop'] === true) {
						videoEl.loop = true;
					}
					wrap.appendChild(videoEl);
					return wrap;
				}
			},
            youtube =  (el,url,id)=> {
				if(is_mobile===false && id){
					id=id.toString();
					const params = videoParams(el),
						urlparams=new URL(url),
						player_id='tb_ytb_'+id;
					let src='https://www.youtube-nocookie.com/embed/'+id+'?modestbranding=1&playsinline=1&controls=0&showinfo=0&rel=0&disablekb&fs=0&version=3&allowfullscreen=false&wmode=transparent&iv_load_policy=3&playerapiid='+player_id+'&playlist='+id,
						w=640,
						h=360,
						autoplay=false;
					if(params.loop){
						src+='&loop=1';
					}
					if (params['autoplay']!==false) {
						src += '&autoplay=1';
						params['mute'] = true;
						autoplay=true;
					}
					if (params['mute'] === true) {
						src += '&mute=1';
					}
					if(urlparams){
						const start=urlparams.searchParams.get('t'),
							width=urlparams.searchParams.get('w'),
							height=urlparams.searchParams.get('h');
						if(start){
							src+='&start='+parseInt(start);
						}
						if(width){
							w=width;
						}
						if(height){
							h=height;
						}
					}
				const wrapper= getVideo(player_id,src,'ytb',autoplay),
					ifr=wrapper.firstChild;
					ifr.style['minHeight']=parseFloat(h/w)*100+'vw';
					ifr.style['minWidth']=parseFloat(w/h)*100+'vh';
					ifr.addEventListener('load',function(){
						this.parentNode.classList.remove('tf_lazy');
					},{passive:true,once:true});
					
					return wrapper;
				
				}
			};
    Themify.on('builder_load_module_partial',(el,type,isLazy)=>{
        let items;
        if(isLazy===true){
            if(!el[0].hasAttribute('data-tbfullwidthvideo')){
                return;
            }
            items=[el[0]];
        }
        else{
            items = Themify.selectWithParent('[data-tbfullwidthvideo]',el);
        }
        if(items[0]!==undefined){
            loadCss(()=>{
                for (let i = items.length - 1; i > -1; --i) {
                    let url = items[i].getAttribute('data-tbfullwidthvideo');
                    if (url) {
                        let provider = Themify.parseVideo(url),
                            exist = items[i].getElementsByClassName('tb_fullwidth_video')[0],
                            el=null;
                        if (exist && exist.parentNode === items[i]) {
                            items[i].removeChild(exist);
                        }
                        if (provider.type === 'youtube') {
                            el=youtube(items[i],url,provider.id);
                        }
                        else if (provider.type === 'vimeo') {
                            el=Vimeo(items[i],url,provider.id);
                        }
                        else{
                            el=local(items[i],url);
                        }
                        if(el){
                            items[i].insertBefore(el, items[i].firstChild);
                            Themify.trigger('tb_fullwidth_video_added',[items[i]]);
                        }
                    }
                }
            });
        }
    });

})( Themify, document);
