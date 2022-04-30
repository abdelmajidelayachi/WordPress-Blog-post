<?php
/**
* General Header Options
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */
add_filter( 'visionwp_customizer_header_panel', 'visionwp_header_general_options' );
function visionwp_header_general_options( $section ) {
	$section[ 'header_general_options' ] = array(
        'title'  => esc_html__( 'General Options', 'visionwp' ),
        'fields' => array(
            'header_bg_color'    => array(
                'label' => esc_html__( 'Header Background Color', 'visionwp' ),
                'type'  => 'color',
                'default'   => '#010834',
                'choices'     => array(
					'alpha' => true, 
				),
                'output' => array(
                    array(
                        'element'  => '.visionwp-header-wrapper, .visionwp-transparent-header.visionwp-scrolled-down header#masthead .visionwp-header-wrapper',
                        'property' => 'background-color',
                    ),
                ),
            ),
            'transparent_header'    => array(
                'label' => esc_html__( 'Transparent Header', 'visionwp' ),
                'type'  => 'toggle',
                'default'   => false,   
            ), 
            'sticky_header'    => array(
                'label' => esc_html__( 'Sticky Header', 'visionwp' ),
                'type'  => 'toggle',
                'default'   => false,
                'active_callback' => array(
                    array(
                        'setting'   => 'transparent_header',
                        'operator'  => '==',
                        'value' => false, 
                    ),
                ),
            ),	
            'banner_text_visibility'   => array(
                'label' => esc_html__( 'Banner Text', 'visionwp' ),
                'type'  => 'toggle',
                'default'   => 'off',
            ),
            'header_order'  => array(
                'label' => esc_html__( 'Header Order', 'visionwp' ),
                'type'  => 'sortable',
                'default'   => array( 'title', 'menu', 'button' ),
                'choices'   => array(
                    'title'  => esc_html__( 'Site Title', 'visionwp' ),
                    'menu'  => esc_html__( 'Primary Menu', 'visionwp' ),
                    'button'  => esc_html__( 'Contact Button', 'visionwp' ),
                ),
            ),
        ),
    );
	return $section;
}