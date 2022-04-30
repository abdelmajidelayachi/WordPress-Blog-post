<?php
/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function blogtory_widgets_init() {
    $sidebar_args['sidebar'] = array(
        'name'          => __( 'Sidebar', 'blogtory' ),
        'id'            => 'sidebar-1',
        'description'   => ''
    );

    $sidebar_args['below_header'] = array(
        'name'        => __( 'Below Header', 'blogtory' ),
        'id'          => 'below-header-widget-area',
        'description' => __( 'Widgets added to this region will appear beneath the header and above the main content.', 'blogtory' ),
    );

    $sidebar_args['above_homepage'] = array(
        'name'        => __( 'Above Homepage', 'blogtory' ),
        'id'          => 'above-homepage-widget-area',
        'description' => __( 'Widgets added to this region will appear above the homepage content. Basically useful if you want to have sidebar on homepage but want some content on top without the sidebar too.', 'blogtory' ),
    );

    $sidebar_args['homepage'] = array(
        'name'        => __( 'Homepage', 'blogtory' ),
        'id'          => 'home-page-widget-area',
        'description' => __( 'Widgets added to this region will appear on the homepage.', 'blogtory' ),
    );

    $sidebar_args['homepage_sidebar'] = array(
        'name'        => __( 'Homepage Sidebar', 'blogtory' ),
        'id'          => 'home-page-sidebar',
        'description' => __( 'Widgets added to this region will appear on the homepage sidebar.', 'blogtory' ),
    );

    $sidebar_args['below_homepage'] = array(
        'name'        => __( 'Below Homepage', 'blogtory' ),
        'id'          => 'below-homepage-widget-area',
        'description' => __( 'Widgets added to this region will appear below the homepage content. Basically useful if you want to have sidebar on homepage but want some content on bottom without the sidebar too.', 'blogtory' ),
    );

    $sidebar_args['above_footer'] = array(
        'name'        => __( 'Above Footer', 'blogtory' ),
        'id'          => 'before-footer-widgetarea',
        'description' => __( 'Widgets added to this region will appear above the footer.', 'blogtory' ),
    );

    $sidebar_args['above_footer_no_container'] = array(
        'name'        => __( 'Above Footer - No Container', 'blogtory' ),
        'id'          => 'before-footer-widgetarea-nc',
        'description' => __( 'Same as above footer but does not have its own container.', 'blogtory' ),
    );

    /*Get the footer column from the customizer*/
    $footer_column_layout = blogtory_get_option('footer_column_layout');
    if($footer_column_layout){
        switch ($footer_column_layout) {
            case "footer_layout_1":
                $footer_column = 4;
                break;
            case "footer_layout_2":
            case "footer_layout_5":
                $footer_column = 3;
                break;
            case "footer_layout_3":
            case "footer_layout_4":
            case "footer_layout_6":
                $footer_column = 2;
                break;
            default:
                $footer_column = 4;
        }
    }else{
        $footer_column = 4;
    }

    $cols = intval( apply_filters( 'blogtory_footer_widget_columns', $footer_column ) );

    for ( $j = 1; $j <= $cols; $j++ ) {
        $footer   = sprintf( 'footer_%d', $j );

        $footer_region_name = sprintf( __( 'Footer Column %1$d', 'blogtory' ), $j );
        $footer_region_description = sprintf( __( 'Widgets added here will appear in column %1$d of the footer.', 'blogtory' ), $j );

        $sidebar_args[ $footer ] = array(
            'name'        => $footer_region_name,
            'id'          => sprintf( 'footer-%d', $j ),
            'description' => $footer_region_description,
        );
    }

    $sidebar_args['below_footer'] = array(
        'name'        => __( 'Below Footer', 'blogtory' ),
        'id'          => 'after-footer-widgetarea',
        'description' => __( 'Widgets added to this region will appear after the footer and before sub-footer.', 'blogtory' ),
    );

    $sidebar_args['below_footer_no_container'] = array(
        'name'        => __( 'Below Footer - No Container', 'blogtory' ),
        'id'          => 'after-footer-widgetarea-nc',
        'description' => __( 'Same as below footer but does not have its own container.', 'blogtory' ),
    );

    $sidebar_args = apply_filters( 'blogtory_sidebar_args', $sidebar_args );

    foreach ( $sidebar_args as $sidebar => $args ) {
        $widget_tags = array(
            'before_widget' => '<div id="%1$s" class="widget %2$s">',
            'after_widget'  => '</div>',
            'before_title'  => '<span class="widget-title"><span>',
            'after_title'   => '</span></span>',
        );

        /**
         * Dynamically generated filter hooks. Allow changing widget wrapper and title tags. See the list below.
         *
         * 'blogtory_sidebar_widget_tags'
         * 'blogtory_below_header_widget_tags'
         * 'blogtory_above_homepage_widget_tags'
         * 'blogtory_homepage_widget_tags'
         * 'blogtory_homepage_sidebar_widget_tags'
         * 'blogtory_below_homepage_widget_tags'
         * 'blogtory_above_footer_widget_tags'
         *
         * 'blogtory_footer_1_widget_tags'
         * 'blogtory_footer_2_widget_tags'
         * 'blogtory_footer_3_widget_tags'
         * 'blogtory_footer_4_widget_tags'
         *
         * 'blogtory_below_footer_widget_tags'
         */
        $filter_hook = sprintf( 'blogtory_%s_widget_tags', $sidebar );
        $widget_tags = apply_filters( $filter_hook, $widget_tags );

        if ( is_array( $widget_tags ) ) {
            register_sidebar( $args + $widget_tags );
        }
    }
}
add_action( 'widgets_init', 'blogtory_widgets_init' );