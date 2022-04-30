<?php
/**
* Layout Options
* @since 1.0.0
* @package VisionWP WordPress Theme
*/
add_filter( 'visionwp_customizer_theme_panel', 'visionwp_theme_layout' );
function visionwp_theme_layout(  $section ) {
    $section[ 'theme_layout' ] = array(
        'title'  => esc_html__( 'Layout', 'visionwp' ),
        'priority'  => 10,
        'fields' => array(
            'container_width'  => array(
                'label' => esc_html__( 'Container Width', 'visionwp' ),
                'type'  => 'radio-buttonset',
                'default'   => 'custom',
                'choices'   => array(
                    'boxed'  => esc_html__( 'Boxed', 'visionwp' ),
                    'custom'  => esc_html__( 'Custom', 'visionwp' ),
                ),
            ),
            'custom_container_width' => array(
                'label' => esc_html__( 'Container Width', 'visionwp' ),
                'type'  => 'slider',
                'default' => 1140,                
                'choices' => array(
                    'min'  => 0,
                    'max'  => 2000,
                    'step' => 1,
                ),
                'active_callback' => array(
                    array(
                        'setting'   => 'container_width',
                        'operator'  => '==',
                        'value' => 'custom', 
                    ),
                ),
                'output' => array(
                    array(
                        'element' => '.visionwp-container',
                        'property' => 'max-width',
                        'units' => 'px',
                    ),
                ),
            ),
        ),
    );
    return $section;
}