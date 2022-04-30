<?php
/**
* Go To Pro Options
 * @since 1.0.1
 * @package VisionWP WordPress Theme
 */
add_filter( 'visionwp_customizer_header_panel', 'visionwp_goto_pro_options', 99 );
add_filter( 'visionwp_customizer_theme_panel', 'visionwp_goto_pro_options', 99 );
function visionwp_goto_pro_options( $section ) {
    if( VisionWP_Pro_Check::is_plugin_installed() ){
        return $section;
    }
    foreach( $section as $sec_id => &$sec ) {
        $sec[ 'fields' ][ 'pro_option_' . $sec_id ] = array(
            'label' => '<span style="display: block; text-align: center">' . esc_html__( 'VisionWP Pro', 'visionwp' ) . '</span>',
            'description' => '<span style="display: block; text-align: center">' . esc_html__( 'To use our more fexible and stunning features, upgrade to premium.', 'visionwp' ) . '</span>',
            'type' => 'custom',
            'priority' => '500',
            'default' => '<a href="https://risethemes.com/product-downloads/visionwp-pro/" target="_blank" style="display: block; margin-top: 15px; padding: 6px 80px 10px 65px; background: #2271b1; color: #ffffff; text-decoration: none"><span class="dashicons dashicons-unlock"></span> Goto Premium</a>',
        );
    }
    return $section;
}