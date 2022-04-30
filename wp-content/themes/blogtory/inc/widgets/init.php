<?php

/* Theme Widget sidebars. */
require get_template_directory() . '/inc/widgets/widget-sidebars.php';
require get_template_directory() . '/inc/widgets/widget-base/abstract-widget-base.php';

require get_template_directory() . '/inc/widgets/class-recent-posts-with-image.php';
require get_template_directory() . '/inc/widgets/class-social-menu.php';
require get_template_directory() . '/inc/widgets/class-author-info.php';
require get_template_directory() . '/inc/widgets/class-recent-comments.php';
require get_template_directory() . '/inc/widgets/class-express-double-column-posts.php';
require get_template_directory() . '/inc/widgets/class-posts-carousel.php';
require get_template_directory() . '/inc/widgets/class-tab-posts.php';
if(class_exists('MC4WP_MailChimp')){
    require get_template_directory() . '/inc/widgets/class-mailchimp-form.php';
}

/* Register site widgets */
if ( ! function_exists( 'blogtory_widgets' ) ) :
    /**
     * Load widgets.
     *
     * @since 1.0.0
     */
    function blogtory_widgets() {
        register_widget( 'Blogtory_Recent_Posts_With_Image' );
        register_widget( 'Blogtory_Social_Menu' );
        register_widget( 'Blogtory_Author_Info' );
        register_widget( 'Blogtory_Recent_Comments' );
        register_widget( 'Blogtory_Express_Double_Column_Posts' );
        register_widget( 'Blogtory_Posts_Carousel' );
        register_widget( 'Blogtory_Tab_Posts' );
        if(class_exists('MC4WP_MailChimp')){
            register_widget( 'Blogtory_Mailchimp_Form' );
        }
    }
endif;
add_action( 'widgets_init', 'blogtory_widgets' );