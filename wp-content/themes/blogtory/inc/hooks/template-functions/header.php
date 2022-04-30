<?php

if ( ! function_exists( 'blogtory_preloader' ) ) {
    /**
     * Show/Hide Preloader
     */
    function blogtory_preloader() {
        $show_preloader = blogtory_get_option('show_preloader');
        if($show_preloader) {
            ?>
            <div class="preloader">
                <div class="bt-loader"></div>
            </div>
            <?php
        }
    }
}


if ( ! function_exists( 'blogtory_header_content' ) ) {
    /**
     * Header Content
     *
     * @param string $header_style Header Style.
     */
    function blogtory_header_content($header_style) {
        /*Top Bar*/
        $enable_top_bar = blogtory_get_option('enable_top_bar');
        if ($enable_top_bar) {
            blogtory_top_bar();
        }
        get_template_part('template-parts/header/'.$header_style);
    }
}



if ( ! function_exists( 'blogtory_header_widget_region' ) ) {
    /**
     * Display header widget region
     *
     * @since  1.0.0
     */
    function blogtory_header_widget_region() {
        if ( is_active_sidebar( 'below-header-widget-area' ) ) {
            $heading_style = blogtory_get_general_heading_style();
            $heading_align = blogtory_get_general_heading_align();
            ?>
            <div class="header-widget-region general-widget-area <?php echo esc_attr($heading_style).' '.esc_attr($heading_align);?>" role="complementary">
                <div class="wrapper">
                    <?php dynamic_sidebar( 'below-header-widget-area' ); ?>
                </div>
            </div>
            <?php
        }
    }
}

/* Display Breadcrumbs */
if ( ! function_exists( 'blogtory_breadcrumb' ) ) :
    /**
     * Simple breadcrumb.
     *
     * @since 1.0.0
     */
    function blogtory_breadcrumb() {
        $enable_breadcrumb = blogtory_get_option('enable_breadcrumb');
        if($enable_breadcrumb){
            if ( ! function_exists( 'breadcrumb_trail' ) ) {
                require_once get_template_directory() . '/lib/breadcrumbs/breadcrumbs.php';
            }
            $breadcrumb_args = array(
                'container'   => 'div',
                'before'   => '<div class="wrapper">',
                'after'   => '</div>',
                'show_browse' => false,
                'show_on_front' => false,
            );
            breadcrumb_trail( $breadcrumb_args );
        }
    }
endif;