/**
 * Video player module
 */
;
((Themify,doc)=>{
    'use strict';
    let isLoaded=false;
    const _CLICK_=!Themify.isTouch?'click':(window.PointerEvent?'pointerdown':'touchstart'),
		_IS_IOS_=/iPhone|iPad|iPod|Mac OS/i.test(window.navigator.userAgent),
		_COOKIE_='tf_video_',
		humanTime=(time)=>{
			time=Infinity===time?0:time;
    		const tmp = new Date(time*1000).toISOString().substr(11, 8).split(':');
			if(tmp[0]==='00'){
				tmp.splice(0,1);
			}
			return tmp.join(':');
		},
		requestFullscreen=(el)=>{
			try{
				if(el.requestFullscreen) {
					return el.requestFullscreen();
				}
				if(el.webkitEnterFullscreen){
					  return el.webkitEnterFullscreen();
				}
				if(el.webkitrequestFullscreen) {
					return el.webkitRequestFullscreen();
				} 
				if(el.mozRequestFullscreen) {
					return el.mozRequestFullScreen();
				}
			}
			catch(er) {
				console.error(er);
				return false;
			}
		},
		exitFullscreen=()=>{
			try{
				if (doc.exitFullscreen) {
					return doc.exitFullscreen();
				} 
				if (doc.webkitExitFullscreen) {
					return doc.webkitExitFullscreen();
				} 
				if (doc.webkitExitFullscreen) {
					return doc.webkitExitFullscreen();
				} 
				if (doc.mozCancelFullScreen) {
					return doc.mozCancelFullScreen();
				} 
				if (doc.msExitFullscreen) {
					return doc.msExitFullscreen();
				}
				return false;
			}
			catch(er) {
				console.error(er);
				return false;
			}
		},
		getPrefix=(el)=>{
			if (doc.exitFullscreen) {
				return '';
			} 
			if (doc.webkitExitFullscreen || el.webkitSupportsFullscreen) {
				return 'webkit';
			} 
			if (doc.mozCancelFullScreen) {
				return 'moz';
			} 
			if (doc.msExitFullscreen) {
				return 'ms';
			}
			return false;
		},
		getFullScreenElement=(el)=>{
			const pre=getPrefix(el);
			if(pre===false){
				return false;
			}
			if(el.hasOwnProperty('webkitDisplayingFullscreen')){
				return el.webkitDisplayingFullscreen;
			}
			return pre===''?doc.fullscreenElement:doc[pre+'FullscreenElement'];
		},
		createSvg=(icon,cl)=>{
			const ns='http://www.w3.org/2000/svg',
				use=doc.createElementNS(ns,'use'),
				svg=doc.createElementNS(ns,'svg');
			icon='tf-'+icon;
			cl=cl?(icon+' '+cl):icon;
			svg.setAttribute('class','tf_fa '+cl);
			use.setAttributeNS(null, 'href','#'+icon);
			svg.appendChild(use);
			return svg;
		},
		getCookie=(name)=>{
		  const nameEQ = _COOKIE_+name + '=';
		  for (let ca=doc.cookie.split(';'),i = ca.length-1;i>-1;--i) {
			let c = ca[i];
			while (c[0] === ' '){ 
				c = c.substring(1, c.length);
			}
			if (c.indexOf(nameEQ) === 0){
				return c.substring(nameEQ.length, c.length);
			}
		  }
		  return null;
		},
		setCookie=(name,value,days)=>{
		  let expires ='';
		  name=_COOKIE_+name;
		  if (days) {
			const date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = ';expires=' + date.toUTCString();
		  }
		  doc.cookie = name + '=' + (value || '') + expires + '; path=/';
		},
		loadMetaData=(el)=>{
			const fr=doc.createDocumentFragment(),
				pre=getPrefix(el),
				id=Themify.hash(el.currentSrc.split('.').slice(0,-1).join('.')),
				elapsed=parseFloat(getCookie(id)) || 0,
				vols=getCookie('vol_'+id) || -1,
				parentNode=el.parentNode, 
				container = doc.createElement('div'),
				wrap = doc.createElement('div'),
				loader=doc.createElement('div'),
				progressWrap=doc.createElement('div'),
				progressLoaded=doc.createElement('div'),
				progressCurrent=doc.createElement('div'),
				hoverHandler=doc.createElement('div'),
				volumeWrap=doc.createElement('div'),
				volumeInner=doc.createElement('div'),
				controls=doc.createElement('div'),
				playWrap=doc.createElement('div'),
				currentTime = doc.createElement('div'),
				totalTime=doc.createElement('div'),
				mute=doc.createElement('button'),
				bigPlay=doc.createElement('button'),
				play=doc.createElement('button'),
				fullscreen=doc.createElement('button'),
				seekLeft=doc.createElement('button'),
				seekRight=doc.createElement('button'),
				range=doc.createElement('input'),
				volumeRange=doc.createElement('input'),
				hasVolume=_IS_IOS_===false || Themify.device!=='mobile',
                                parentCl=parentNode.classList;
				let paused=true,//For error play-request-was-interrupted
					sliding=false,
					firstPlay=false,
					timeout;
				loader.className='tf_loader tf_abs_c';
				container.className='tf_video_container tf_w tf_rel tf_box';
				wrap.className='tf_video_wrap tf_w tf_mw tf_box';
				playWrap.className='tf_play_wrap';
				controls.className='tf_video_controls';
				progressWrap.className='tf_video_progress_wrap tf_rel tf_textl';
				progressLoaded.className='tf_video_progress_loaded tf_w tf_h tf_abs';
				progressCurrent.className='tf_video_progress_current tf_w tf_h tf_abs';
				range.className='tf_video_progress_range tf_h tf_abs';
				range.value=0;
				range.type='range';
				range.min=0;
				range.max=100;
				play.className='tf_video_play';
				bigPlay.className='tf_video_play tf_big_video_play tf_abs_c';
				play.appendChild(createSvg('fas-undo-alt','tf_hide'));
				bigPlay.appendChild(createSvg('fas-undo-alt','tf_hide'));
				parentNode.tabIndex=0;
				if(vols!==-1){
					if(!vols){
						el.muted=0;
					}
					else{
						el.volume=vols;
					}
				}
				mute.type=bigPlay.type=play.type=fullscreen.type=seekLeft.type=seekRight.type='button';
				seekLeft.className='tf_video_seek tf_video_seek_left tf_abs';
				seekRight.className='tf_video_seek tf_video_seek_right tf_abs';
				currentTime.className='tf_video_current_time';
				totalTime.className='tf_video_total_time';
				hoverHandler.className='tf_video_hover tf_abs tf_hide tf_box tf_textc';
				fullscreen.className='tf_video_fullscreen';
				currentTime.textContent=humanTime(el.currentTime); 
				totalTime.textContent=humanTime(el.duration); 
				
				const waitingEvent=function(e){
					parentCl.add('tf_video_waiting');
					const ev=e.type==='seeking'?'seeked':'playing';
					this.addEventListener(ev, ()=>{
						parentCl.remove('tf_video_waiting');
					},{passive:true,once:true});
				},
				pipCallback=function(){
					try {
						if(el.webkitSupportsPresentationMode){
							el.webkitSetPresentationMode(el.webkitPresentationMode === 'picture-in-picture' ? 'inline' : 'picture-in-picture');
						}
						else{
							if(getFullScreenElement(el)){
								exitFullscreen();
							}
							if (el !== doc.pictureInPictureElement) {
								el.requestPictureInPicture();
							}
							else{
								doc.exitPictureInPicture();
							}
						}
					}
					catch(er) {
						console.error(er);
					}
				},
				setinteraction=()=>{
					parentCl.add('tf_video_touched');
					parentCl.remove('tf_hide_controls');
					if(timeout){
						clearTimeout(timeout);
					}
					timeout=setTimeout(()=>{
						parentCl.remove('tf_video_touched');
					},2500);
				},
				playVideo=function(){
					if(firstPlay===false){
						firstPlay=true;
						if(Themify.device!=='desktop'){
							el.muted=true;
						}
					}
					el.play();
				};
				
				wrap.addEventListener(_CLICK_,(e)=>{
					e.stopPropagation();
				},{passive:true});
				parentNode.addEventListener(_CLICK_,function(e){
					const _this=e.target.closest('.tf_video_seek');
					e.stopImmediatePropagation();
					if(el.paused || firstPlay===false || !Themify.isTouch || (!_this && this.classList.contains('tf_video_touched'))){
						this.classList.remove('tf_video_touched');
						if(el.paused || firstPlay===false){
							playVideo();
						}
						else{
							el.pause();
						}
					}
					else{
						setinteraction();
						if(_this){
							el.currentTime+=_this.classList.contains('tf_video_seek_left')?-15:15;
						}
					}
				},{passive:true});
				play.addEventListener(_CLICK_,function(e){
					e.stopPropagation();
					if(el.paused || firstPlay===false){
						playVideo();
					}
					else{
						el.pause();
					}
				},{passive:true});
				
				
				if(!Themify.isTouch){
					progressWrap.addEventListener('mouseenter',function(e){
						if(!isNaN(el.duration)){
							hoverHandler.classList.remove('tf_hide');
							const w =this.clientWidth,
							hoverW=parseFloat(hoverHandler.clientWidth/2),
							duration=el.duration,
							move=function(e){
								const X=e.layerX!==undefined?e.layerX:e.offsetX;
								if((X-hoverW)>0 && X<=w){
									hoverHandler.style['transform']='translateX('+(X-hoverW)+'px)';
									if(sliding===false){
										hoverHandler.textContent=humanTime(parseFloat((X/w))*duration);
									}
								}
							};
							this.addEventListener('mouseleave',function(){
								hoverHandler.classList.add('tf_hide');
								this.removeEventListener('mousemove',move,{passive:true});
							},{passive:true,once:true});
							this.addEventListener('mousemove',move,{passive:true});
						}
					},{passive:true});
					
				}
				else if(_IS_IOS_===true){
					const agent=window.navigator.userAgent,
						ver=parseFloat( agent.substr( agent.indexOf( 'OS ' ) + 3, 4 ).replace( '_', '.' ));//safari bug,Input range when clicking on track
					if(ver<13.5){
						const __changeCallback=function(e){
							const ev=e.type==='touchstart'?(e.touches[0]?e.touches[0]:e.changedTouches[0]):e,
							input = this.getElementsByTagName('input')[0],
							box=this.getBoundingClientRect(),
							v=input.classList.contains('tf_video_volumn_range')?((ev.clientY - box.top) / box.height):((ev.clientX - box.left) / box.width);
							input.value=parseInt(v*100);
							Themify.triggerEvent(input,'input');
							Themify.triggerEvent(input,'change');
						};
						progressWrap.addEventListener(_CLICK_,__changeCallback,{passive:true});
						if(hasVolume===true){
							volumeInner.addEventListener(_CLICK_,__changeCallback,{passive:true});
						}
					}
				}
				range.addEventListener('input',function(e){
					e.preventDefault();
					if(!isNaN(el.duration)){
						if(!el.paused && paused===true){
							el.pause();
						}
						sliding=true;
						const v=parseInt(this.value),
						t=v===100?(el.duration-1):parseFloat((v*el.duration)/100).toFixed(4);
						el.currentTime=t;
						if(!Themify.isTouch){
							hoverHandler.textContent=humanTime(t);
						}
					}
				});
				
				range.addEventListener('change',function(e){
					e.preventDefault();
					if(!isNaN(el.duration)){
						sliding=paused=false;
						if(el.paused){
							el.play().then(_ => {
								paused=true;
							}).catch(er => {
								 paused=true;
							});
						}
					}
				});
				
				el.addEventListener('progress', function() {
					if (this.buffered.length > 0) {
						progressLoaded.style['transform']='scaleX('+parseFloat((this.buffered.end(0))/this.duration).toFixed(4)+')';
					}
				},{passive:true});
				
				el.addEventListener('durationchange',function() {
					totalTime.textContent=humanTime(this.duration); 
				},{passive:true});
				
				
				el.addEventListener('seeking',waitingEvent,{passive:true});
				el.addEventListener('waiting',waitingEvent,{passive:true});
				el.addEventListener('emptied',waitingEvent,{passive:true});
				
				el.addEventListener('pause',function(){
					parentCl.remove('tf_video_is_playing');
				},{passive:true});
				
				el.addEventListener('play',function(){
					parentCl.add('tf_video_is_playing');
					for(let allVideos = doc.getElementsByTagName('video'),i=allVideos.length-1;i>-1;--i){
						if(allVideos[i]!==this){
							allVideos[i].pause();
						}
					}
				},{passive:true});
				el.addEventListener('playing',function(){
					parentCl.remove('tf_video_ended');
				},{passive:true});
				
				el.addEventListener('ended',function(){
					parentCl.add('tf_video_ended');
				},{passive:true});
				
				el.addEventListener('timeupdate',function(){
					if(!isNaN(this.duration)){
						currentTime.textContent=humanTime(this.currentTime); 
						const v=parseFloat(this.currentTime/el.duration);
						progressCurrent.style['transform']='scaleX('+v.toFixed(4)+')';
						if(sliding===false){
							range.value=parseInt(v*100);
						}
						setCookie(id,this.currentTime,30);
					}
				},{passive:true});
				
				if(pre!==false){
					let isAdd=false,
						timeout2=false;
					const mouseMove=()=>{
						toggleControls(true);
						checkState();
					},
					toggleControls=(isMoved)=>{
						if(isAdd===true || isMoved===true){
							isAdd=false;
							parentCl.remove('tf_hide_controls');
							
						}
						else{
							isAdd=true;
							parentCl.add('tf_hide_controls');
						}
					},
					checkState=()=>{
						if(timeout2){
							clearTimeout(timeout2);
						}
						timeout2=setTimeout(toggleControls,3000);
					},
					showFullscreen=function(e){
						const target=e.touches?e.touches[0].target:e.target;
						if(e.type!=='dblclick' || target && !target.closest('.tf_video_wrap')){
							e.preventDefault();
								
							if(getFullScreenElement(el)){
								exitFullscreen(el);
							}
							else{
								const __calback=()=>{
									const promise=requestFullscreen(parentNode);	
									if(!promise){
										requestFullscreen(el);
									}
								};
								if(doc.pictureInPictureElement || el.webkitPresentationMode==='picture-in-picture'){
									pipCallback();
									setTimeout(__calback,80);
								}
								else{
									__calback();
								}
							}
						}
					};
					fullscreen.addEventListener(_CLICK_,showFullscreen);
					if(!Themify.isTouch){
						parentNode.addEventListener('dblclick',showFullscreen);
					}
					parentNode.addEventListener(pre+'fullscreenchange',function(e){
						if(!getFullScreenElement(el)){
							parentCl.remove('tf_is_fullscreen','tf_hide_controls');
							if(timeout2){
								clearTimeout(timeout2);
							}
							el.removeEventListener('pause',mouseMove,{passive:true});
							parentNode.removeEventListener('mousemove',mouseMove,{passive:true});
						}
						else{
							parentCl.add('tf_is_fullscreen');
							parentNode.addEventListener('mousemove',mouseMove,{passive:true});
							el.addEventListener('pause',mouseMove,{passive:true});
							checkState();
						}
					},{passive:true});
				}
				else{
					fullscreen.className+=' tf_fullscreen_disabled tf_play_disabled';
				}
				fullscreen.appendChild(createSvg('fas-expand'));
				progressWrap.appendChild(progressLoaded);
				progressWrap.appendChild(range);
				progressWrap.appendChild(progressCurrent);
				progressWrap.appendChild(hoverHandler);
				if (el.hasAttribute('data-download')) {
					const dl=doc.createElement('a');
					dl.setAttribute('download','');
					dl.href=el.src;
					dl.className='tf_video_download';
					dl.appendChild(createSvg('fas-download'));
					controls.appendChild(dl);
				}
				if(hasVolume===true){
					
					volumeRange.addEventListener('input',function(e){
						e.preventDefault();
						const v=parseFloat(this.value/100).toFixed(3);
						el.volume=v;
						el.muted=v>0?false:true;
					});
					
					el.addEventListener('volumechange',function(){
						if(this.muted===true || this.volume===0){
							mute.classList.add('tf_muted');
						}
						else{
							mute.classList.remove('tf_muted');
						}
						setCookie('vol_'+id,this.volume,120);
					},{passive:true});
					
					mute.addEventListener(_CLICK_,()=>{
						el.muted  =!el.muted;
						if(!el.muted && el.volume===0){
							volumeRange.value=50;
							Themify.triggerEvent(volumeRange,'input');
						}
					},{passive:true});
					
					mute.appendChild(createSvg('fas-volume-up','tf_abs_t'));
					mute.appendChild(createSvg('fas-volume-mute','tf_abs_t tf_h'));
					volumeWrap.appendChild(mute);
					volumeRange.min=0;
					volumeRange.max=100;
					volumeRange.type='range';
					volumeRange.value=vols>-1?(vols*100):50;
					volumeInner.className='tf_video_volumn_inner';
					volumeRange.className='tf_video_volumn_range tf_h tf_overflow';
					volumeWrap.className='tf_video_volumn_wrap tf_rel';
					mute.className='tf_video_mute tf_rel tf_overflow';
					if(el.muted){
						mute.className+=' tf_muted';
					}
					volumeInner.appendChild(volumeRange);
					volumeWrap.appendChild(volumeInner);
					controls.appendChild(volumeWrap);
				}
				if (!el.hasAttribute('disablePictureInPicture') && doc.pictureInPictureEnabled) {
					
					const pip=doc.createElement('button');
					pip.addEventListener(_CLICK_,pipCallback,{passive:true});
					pip.className='tf_video_pip';
					el.addEventListener('enterpictureinpicture', ()=> {
					  parentCl.add('tf_is_pip');
					},{passive:true});

					el.addEventListener('leavepictureinpicture', ()=> {
						parentCl.remove('tf_is_pip');
					},{passive:true});
					pip.appendChild(createSvg('fas-external-link-alt'));
					controls.appendChild(pip);
				}
				controls.appendChild(fullscreen);
				playWrap.appendChild(play);
				wrap.appendChild(playWrap);
				wrap.appendChild(currentTime);
				wrap.appendChild(progressWrap);
				wrap.appendChild(totalTime);
				wrap.appendChild(controls);
				seekRight.innerHTML=seekLeft.innerHTML='<span class="tf_abs_c">15</span>';
				seekRight.appendChild(createSvg('fas-redo-alt','tf_abs_c'));
				seekLeft.appendChild(createSvg('fas-undo-alt','tf_abs_c'));
				fr.appendChild(seekLeft);
				fr.appendChild(seekRight);
				fr.appendChild(wrap);
				fr.appendChild(bigPlay);
				fr.appendChild(loader);
				parentNode.appendChild(fr);
				
				if (window.WebKitPlaybackTargetAvailabilityEvent) {
					el.addEventListener('webkitplaybacktargetavailabilitychanged', (e)=> {
						if(e.availability==='available'){
							const airPlay=doc.createElement('button');
							airPlay.className='tf_video_airplay'
							airPlay.addEventListener(_CLICK_, ()=> {
								el.webkitShowPlaybackTargetPicker();
							},{passive:true});
							airPlay.appendChild(createSvg('fas-airplay'));
							fullscreen.before(airPlay);
						}
					 },{passive:true,once:true});
				}
				if(elapsed>0 && elapsed<el.duration){
					el.currentTime=elapsed;
				}
				if(el.autoplay){
					parentCl.add('tf_video_is_playing');
				}
				el.setAttribute('webkit-playsinline','1');
				el.setAttribute('playsinline','1');
				el.removeAttribute('controls');
				parentCl.remove('tf_lazy');
		},
		init=(items,options)=>{
			for(let i=items.length-1;i>-1;--i){
				let item=items[i],
					p=item.parentNode;
				
				if(!p.classList.contains('tf_video_lazy')){
					let lazy=doc.createElement('div');
					lazy.className='tf_video_lazy tf_w tf_h tf_box tf_rel tf_overflow tf_lazy';
					lazy.appendChild(item);
					p.appendChild(lazy);
				}
				if(item.readyState===4){
					loadMetaData(item,options);
				}
				else{
					Themify.requestIdleCallback(()=>{
						item.addEventListener('loadedmetadata',function(){
							loadMetaData(this);
						},{passive:true,once:true});
						item.setAttribute('preload','metadata'); 
						if(_IS_IOS_===true){
							item.load();
						}
					},200);
				}
			}
		};
    Themify.on('tf_video_init',(items)=>{
        if(isLoaded===false){
            isLoaded=true;
            Themify.fontAwesome(['tf-fas-volume-mute','tf-fas-volume-up','tf-fas-undo-alt','tf-fas-redo-alt','tf-fas-external-link-alt','tf-fas-airplay','tf-far-closed-captioning','tf-fas-expand']);
        }
        if(items instanceof jQuery){
           items=items.get();
        }
        else if(items.length===undefined){
                items=[items];
        }
        init(items);
    });

})(Themify,document);