<?php
/**
 * Theme footer content
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */ ?>
        <?php do_action( 'visionwp_before_footer' );
        if( is_active_sidebar( 'visionwp_footer' ) && !visionwp_get_meta( 'disable-footer-area' ) ) : ?>
            <div class="visionwp-footer-area-wrapper">
                <div class="visionwp-container">
                    <div class="visionwp-widget-area">
                        <div class="col visionwp-widget-wrapper py-5">
                            <?php dynamic_sidebar( 'visionwp_footer' ); ?>
                        </div>
                    </div>
                </div>
            </div>
        <?php endif; ?>
        <div class="visionwp-footer-copyright">
            <div class="visionwp-container">
                <div class="visionwp-footer-copyright-text">
                    <?php echo visionwp_get( 'footer_copyright', 'visionwp' ); ?>
                </div>
                <div class="visionwp-footer-credit">
                    <a href="<?php echo esc_url( '//risethemes.com/product-downloads/visionwp/' ); ?>" target="_blank">
                        <?php esc_html_e( 'VisionWp', 'visionwp' ); ?>
                    </a>
                    <?php esc_html_e( 'Theme By ' , 'visionwp' ); ?>
                    <a href="<?php echo esc_url( '//www.eaglevisionit.com' ); ?>" target="_blank">
                        <?php echo esc_html( 'Eaglevision IT' ); ?>
                    </a>
                </div>
            </div>
            <?php do_action( 'visionwp_after_footer' ); ?>
        </div>
        <?php wp_footer(); ?>
    </body>
</html>