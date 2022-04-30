<?php
/**
* Breadcrumb Options
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */
add_filter( 'visionwp_customizer_theme_panel', 'visionwp_breadcrumb_options' );
function visionwp_breadcrumb_options( $section ) {
    $section[ 'breadcrumb_options' ] = array(
        'title' => esc_html__( 'Breadcrumb Options', 'visionwp' ),
        'priority'  => 12,
        'fields'    => array(
            'show_breadcrumb'    => array(
                'label' => esc_html__( 'Enable', 'visionwp' ),
                'type'  => 'toggle',
                'default'   => true,  
            ),
            'breadcrumb_typography_options' => array(
                'label' => esc_html__( 'Typography ', 'visionwp' ),
                'type'  => 'typography',
                'choices' => array( 
                    'fonts' => VisionWP_Helper::theme_google_font(),
                ),
                'default'     =>array(
                    'font-family'     => 'Montserrat Alternates',
                    'variant'         => 'regular',
                    'text-transform'  => 'none',
                    'text-transform'  => 'none',
                    'line-height'     => '1.5',
                    'letter-spacing'  => '0',
                ),
                'active_callback'   => array(
                    array(
                        'setting'   => 'show_breadcrumb',
                        'operator'  => '==',
                        'value' => true, 
                    ),
                ),
                'output' => array(
                    array(
                        'element'  => '.visionwp-breadcrumb-wrapper ul', 
                    ),
                ),
            ),
        ),
    );
    return $section;
}