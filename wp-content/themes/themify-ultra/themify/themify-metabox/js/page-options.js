(function ( Themify, doc) {
    'use strict';
    function tf_meta_options_loader(){
        const el = doc.getElementById('wp-admin-bar-themify-page-options');
        if(el){
            el.addEventListener('click',function(e){
                e.preventDefault();
                let loaded={},
                    checkLoad=function(){
                        if(loaded['pgopt_css']===true && loaded['pgopt_js']===true){
                            Themify.trigger('tf_page_options_init',[el]);
                            loaded=null;
                        }
                    };
                const url=Themify.css_modules.pgopt.u.indexOf(Themify.url)===-1?Themify.url:'';
                Themify.LoadCss(url+Themify.css_modules.pgopt.u,Themify.css_modules.pgopt.v,null,null,function(){
                    loaded['pgopt_css']=true;
                    checkLoad();
                });
                Themify.LoadAsync(url+Themify.js_modules.pgopt.u, function () {
                    loaded['pgopt_js']=true;
                    checkLoad();
                }, Themify.css_modules.pgopt.v, null, function () {
                    return 'undefined' !== typeof ThemifyPageOptions;
                });
            },{once:true});
        }
    }
    if (doc.readyState === 'complete') {
        tf_meta_options_loader();
    } else {
        window.addEventListener('load', tf_meta_options_loader, {once:true, passive:true});
    }
}(Themify, document));
