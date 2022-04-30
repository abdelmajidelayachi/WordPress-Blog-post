<?php

if ( ! function_exists( 'blogtory_before_footer_widget_region' ) ) {
    /**
     * Display above footer widget region
     *
     * @since  1.0.0
     */
    function blogtory_before_footer_widget_region() {

        $heading_style = blogtory_get_general_heading_style();
        $heading_align = blogtory_get_general_heading_align();

        if ( is_active_sidebar( 'before-footer-widgetarea' ) ) {
            ?>
            <div class="before-footer-widget-region general-widget-area <?php echo esc_attr($heading_style).' '.esc_attr($heading_align);?>" role="complementary">
                <div class="wrapper">
                    <?php dynamic_sidebar( 'before-footer-widgetarea' ); ?>
                </div>
            </div>
            <?php
        }

        if ( is_active_sidebar( 'before-footer-widgetarea-nc' ) ) {
            ?>
            <div class="before-footer-nc-widget-region general-widget-area <?php echo esc_attr($heading_style).' '.esc_attr($heading_align);?>" role="complementary">
                <?php dynamic_sidebar( 'before-footer-widgetarea-nc' ); ?>
            </div>
            <?php
        }
    }
}

if ( ! function_exists( 'blogtory_footer_start' ) ) {
    /**
     * Footer Start
     */
    function blogtory_footer_start() {
        ?>
        <div class="unfold-footer">
        <?php
    }
}

if ( ! function_exists( 'blogtory_footer_content' ) ) {
    /**
     * Footer Content
     */
    function blogtory_footer_content() {
        get_template_part('template-parts/footer/footer_style_1');
    }
}

if ( ! function_exists( 'blogtory_footer_end' ) ) {
    /**
     * Footer End
     */
    function blogtory_footer_end() {
        ?>
        </div>
        <?php
    }
}

if ( ! function_exists( 'blogtory_after_footer_widget_region' ) ) {
    /**
     * Display below footer widget region
     *
     * @since  1.0.0
     */
    function blogtory_after_footer_widget_region() {

        $heading_style = blogtory_get_general_heading_style();
        $heading_align = blogtory_get_general_heading_align();

        if ( is_active_sidebar( 'after-footer-widgetarea' ) ) {
            ?>
            <div class="after-footer-widget-region general-widget-area <?php echo esc_attr($heading_style).' '.esc_attr($heading_align);?>" role="complementary">
                <div class="wrapper">
                    <?php dynamic_sidebar( 'after-footer-widgetarea' ); ?>
                </div>
            </div>
            <?php
        }

        if ( is_active_sidebar( 'after-footer-widgetarea-nc' ) ) {
            ?>
            <div class="after-footer-nc-widget-region general-widget-area <?php echo esc_attr($heading_style).' '.esc_attr($heading_align);?>" role="complementary">
                <?php dynamic_sidebar( 'after-footer-widgetarea-nc' ); ?>
            </div>
            <?php
        }
    }
}