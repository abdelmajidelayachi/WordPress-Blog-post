/**
 * social share module
 */
;
(($,Themify)=>{
    'use strict';
    Themify.body.on('click.tb_share', '.module-social-share a', function (e) {
        e.preventDefault();
        const $this = $(this),
            $el = $this.closest('.module-social-share');
        if($el[0]){
            let url = $el.attr('data-url');
            const type = 'A' === $this[0].tagName ? $this[0].dataset.type : $this[0].parentNode.dataset.type;
            url = '' !== url ? url : window.location.href;
            Themify.sharer(type,url,$this.attr('data-title'));
        }
    });

})(jQuery,Themify);