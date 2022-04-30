/**
 * header video module
 */
;
(function (Themify,document) {
    'use strict';
    const _init=function(videos){
        for(let i=videos.length-1;i>-1;--i){
             let videoSrc = videos[i].getAttribute('data-fullwidthvideo');
             if (videoSrc && videoSrc.indexOf('.mp4') >= 0 && videoSrc.indexOf(window.location.hostname) >= 0) {
                 let wrap=document.createElement('div'),
                     video=document.createElement('video');
                     wrap.className='big-video-wrap';
                     video.className='header-video video-' + i;
                     video.muted=true;
                     video.autoplay=true;
                     video.loop=true;
                     video.setAttribute('playsinline','true');
                     video.setAttribute('type','video/mp4');
                     video.setAttribute('src',videoSrc);
                     wrap.appendChild(video);
                     videos[i].insertBefore(wrap, videos[i].firstChild);
             }
        }
    };
    Themify.on('themify_theme_header_video_init',function(videos){
        if(videos instanceof jQuery){
           videos=videos.get();
        }
        setTimeout(function(){
            _init(videos);
        },1500);
    });

})(Themify,document);