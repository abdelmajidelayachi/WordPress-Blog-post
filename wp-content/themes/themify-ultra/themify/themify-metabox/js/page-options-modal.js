(function ( Themify, document,themify_vars) {
    'use strict';
    const ThemifyPageOptions = {
        modal:null,
        wrap:null,
        active:false,
        url:false,
        fr:false,
        init(el) {
            this.loader('show');
            this.url = el.tagName==='A'?el.href:el.getElementsByTagName('A')[0].href;
            const modal = document.createElement('div'),
                wrap = document.createElement('div'),
                toolbar = document.createElement('div'),
                title = document.createElement('div'),
                close = document.createElement('div'),
                save = document.createElement('div');
            modal.id = 'tf_page_options_modal';
			modal.className = 'tf_scrollbar';
            wrap.className='tf_w tf_h tf_rel';
            toolbar.className='tf_page_options_toolbar';
            title.className='tf_page_options_title';
            title.innerText=themify_vars.pg_opt_t;
            toolbar.appendChild(title);
            save.className='tf_page_options_save';
            save.innerText=themify_vars.pg_opt_updt;
            save.addEventListener('click',this.save.bind(this),{passive:true});
            toolbar.appendChild(save);
            close.className='tf_page_options_close tf_close';
            close.addEventListener('click',this.close,{once:true,passive:true});
            toolbar.appendChild(close);
            wrap.appendChild(toolbar);
            modal.appendChild(wrap);
            this.wrap = wrap;
            this.modal = modal;
            document.body.appendChild(modal);
            this.loadIframe();
        },
        loadIframe(){
            const self = this;
            if(self.active){
                return;
            }
            const fr = document.createElement('iframe');
            fr.src = self.url;
            fr.className = 'tf_w tf_h';
            fr.onload = function() {
                self.loader('hide');
                self.modal.classList.remove('updating');
                const form = fr.contentDocument.getElementById('post');
                form.action = 'post.php?tf-meta-opts=update'
                fr.contentDocument.body.appendChild(form);
                fr.contentDocument.getElementById('wpwrap').remove();
                Themify.body[0].className += ' tf_page_options_active';
                fr.contentWindow.document.documentElement.className += ' tf_scrollbar';
                self.active=true;
            };
            self.fr = fr;
            this.wrap.appendChild(fr);
        },
        close(){
            window.location.reload();
        },
        save(){
            this.modal.className +=' updating';
            this.loader('show');
            this.fr.contentDocument.querySelector('#post').submit();
        },
        loader(act){
            if('show'===act){
                const loader = document.createElement('div');
                loader.id = 'tb_alert';
                loader.className = 'tb_busy';
                document.body.appendChild(loader);
            }else{
                const loader = document.getElementById('tb_alert');
                if(loader){
                    loader.remove();
                }
            }
        }
    };
    Themify.on('tf_page_options_init', function (el) {
        ThemifyPageOptions.init(el);
    });
}(Themify, document, themify_vars));
