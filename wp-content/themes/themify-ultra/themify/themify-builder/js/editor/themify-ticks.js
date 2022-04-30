var TB_Ticks;
(function ($) {
    'use strict';
    TB_Ticks = {
        interval: null,
        time: 20000,
        $el: null,
        options: null,
        request: null,
        iframe:null,
        init(options,contentWindow) {
            var self = TB_Ticks;
            self.options = options;
            self.time = parseInt(options.tick) * 1000;
            self.$el = $('#tmpl-builder-restriction');
            self.iframe = contentWindow;
            return self;
        },
        ticks() {
            var self = TB_Ticks;
            function callback(data) {
                if (data && Number( data ) !== 1) {
                    self.request.abort();
                    clearInterval(self.interval);
                    document.body.insertAdjacentHTML('beforeend', data);
                    self.$el = $('#tmpl-builder-restriction');
                    self.show();
                    self.iframe.ThemifyBuilderCommon.showLoader('show');
                    var api =  self.iframe.tb_app;
                    api.Views.Toolbar.prototype.Revisions.saveRevision(self.$el.find('.tb_locked_revision').text(), function () {
                        self.iframe.ThemifyBuilderCommon.showLoader('hide');
                        api.Models.Registry.destroy();
                    });
                }
            }
            if(self.interval!==null){
                clearInterval(self.interval);
            }
            self.interval = setInterval(function () {
                self.ajax(callback, null);
            }, self.time);
            $(document).off( 'heartbeat-tick',callback).on( 'heartbeat-tick', function callback( e, data ) {
                 if(typeof data['wp-refresh-post-lock']['lock_error']!=='undefined'){
                     self.request.abort();
                     clearInterval(self.interval);
                     $(document).off( 'heartbeat-tick',callback);
                 }
            });
            return self;
        },
        ajax(callback, take) {
            var self = TB_Ticks;
            self.request = $.ajax({
                type: 'POST',
                url: themify_vars.ajax_url,
                data: {
                    action: 'tb_update_tick',
                    postID: self.options.postID,
                    take: take
                },
                success: callback
            });
        },
        isEditing() {
            return document.body.classList.contains('tb_restriction');
        },
        show() {
            var self = TB_Ticks;
            self.$el.show();
            self.close();
            self.takeOver();
        },
        hide() {
            TB_Ticks.$el.hide();
        },
        takeOver() {
            var self = TB_Ticks;
            Themify.body.one('click', '.tb_locked_btn', function (e) {
                e.preventDefault();
                e.stopPropagation();
                self.ajax(function () {
                    if(Themify.is_builder_active || Themify.body.hasClass('wp-admin')){
                        self.ticks();
                    }
                    else{
                        Themify.body.removeClass('tb_restriction');
                        $('.js-turn-on-builder').first().trigger('click');
                    }
                    self.$el.remove();
                }, 1);
            });
        },
        close() {
            this.$el.one('click','.tb_locked_close',this.hide);
        }
    };
})(jQuery);