jQuery(document).ready(function($){

    var widget_base = {

        init : function () {

            var self = this;

            jQuery( '#widgets-right .widget:has(.color-picker)' ).each( function () {
                self.initColorPicker( jQuery( this ) );
            });
            jQuery( document ).on( 'widget-added widget-updated', function ( event, widget) {
                self.initColorPicker( widget );
            } );

            self.addImage();
            self.removeImage();
        },

        initColorPicker : function( widget ){
            widget.find('.color-picker').wpColorPicker({
                change: _.throttle(function () {
                    jQuery(this).trigger('change');
                }, 3000)
            });
        },

        addImage : function(){

            jQuery( document ).on( 'click', '.upload_image_button', function( event ) {

                event.preventDefault();

                var file_frame;
                var _that = jQuery(this);

                // Create the media frame.
                file_frame = wp.media.frames.downloadable_file = wp.media({
                    title: _that.attr('data-uploader-title-txt'),
                    button: {
                        text: _that.attr('data-uploader-btn-txt')
                    },
                    multiple: false
                });

                // When an image is selected, run a callback.
                file_frame.on( 'select', function() {
                    var attachment           = file_frame.state().get( 'selection' ).first().toJSON();
                    var attachment_thumbnail = attachment.sizes.thumbnail || attachment.sizes.full;

                    _that.prev().trigger('change').val( attachment.id );
                    var image_html = '<img src="' + attachment_thumbnail.url + '" />';
                    _that.closest('.image-field').find('.image-preview').html(image_html);
                    _that.next().show();
                });

                // Finally, open the modal.
                file_frame.open();
            });
        },

        removeImage : function(){
            jQuery( document ).on( 'click', '.remove_image_button', function() {
                var _this = jQuery( this );
                _this.closest('.image-field').find('.image-preview').html(' ');
                _this.siblings('.img').trigger('change').val( '' );
                _this.hide();
                return false;
            });
        }

    };

    widget_base.init();
});
