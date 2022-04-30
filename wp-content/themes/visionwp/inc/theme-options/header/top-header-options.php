<?php 
/**
 * Top Header Options
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */
add_filter( 'visionwp_customizer_header_panel', 'visionwp_top_header_options' );
function visionwp_top_header_options( $section ) {
    $section[ 'header_top_bar_options' ] = array(
        'title' => esc_html__( 'Top Header Options', 'visionwp' ),
        'priority'  => 1,
        'fields'    => array(
            'top_header_enable' => array(
                'label' => esc_html__( 'Enable Top Header', 'visionwp' ),
                'type'  => 'toggle',
            ),
            'top_header_bg_color'   => array(
                'label' => esc_html__( 'Background Color', 'visionwp' ),
                'type'  => 'color',
                'default'   => '#07135B',
                'choices'     => array(
					'alpha' => true, 
				),
                'output' => array(
                    array(
                        'element' => '.visionwp-top-bar, .visionwp-transparent-header header#masthead .visionwp-top-bar',
                        'property' => 'background-color',
                    ),
                ),
                'active_callback' => array(
                    array(
                        'setting'   => 'top_header_enable',
                        'operator'  => '==',
                        'value' => true, 
                    ),
                ),
            ),
            'top_header_text_color'   => array(
                'label' => esc_html__( 'Text Color', 'visionwp' ),
                'type'  => 'color',
                'default'   => '#fff',
                'choices'     => array(
					'alpha' => true, 
				),
                'output' => array(
                    array(
                        'element' => '.visionwp-top-bar .visionwp-top-bar-info ul li a, .visionwp-top-bar .visionwp-top-bar-info ul li',
                        'property' => 'color',
                    ),
                ),
                'active_callback' => array(
                    array(
                        'setting'   => 'top_header_enable',
                        'operator'  => '==',
                        'value' => true, 
                    ),
                ),
            ),
            'top_header_num'   => array(
                'label' => esc_html__( 'Phone', 'visionwp' ),
                'type'  => 'text',
                'active_callback' => array(
                    array(
                        'setting'   => 'top_header_enable',
                        'operator'  => '==',
                        'value' => true, 
                    ),
                ),
            ),
            'top_header_email'   => array(
                'label' => esc_html__( 'Email', 'visionwp' ),
                'type'  => 'text',
                'active_callback' => array(
                    array(
                        'setting'   => 'top_header_enable',
                        'operator'  => '==',
                        'value' => true, 
                    ),
                ),
            ),
        ),
    );
    return $section;
}