<?php
/**
 * Font and Color Options for header menu
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */
add_filter( 'visionwp_customizer_header_panel', 'visionwp_header_font_options' );
function visionwp_header_font_options( $section ) {
	$section[ 'header_font_options' ] =    array(
        'title'  => esc_html__( 'Menu Options', 'visionwp' ),
        'fields' => array(
            'header_font_options' => array(
                'label' => esc_html__( 'Menu Typography', 'visionwp' ),
                'type'  => 'typography',
                'choices' => array( 
                    'fonts' => VisionWP_Helper::theme_google_font(),
                ),
                'default'     =>array(
                    'font-family'     => 'Ubuntu',
                    'font-style'      => 'normal',
                    'font-size'       => '16px',
                    'text-transform'  => 'none',
                    'line-height'     => '1.5',
                    'letter-spacing'  => '0',
                ),
                'output' => array(
                    array(
                        'element'  => '.visionwp-header-wrapper nav > ul > li a',
                    ),
                ),
            ),
            'header_menu_text_color' => array(
                'label' => esc_html__( 'Menu Text Color', 'visionwp' ),
                'type'  => 'multicolor',
                'choices'   => array(
                    'normal'     => esc_html__( 'Color', 'visionwp' ),
                    'hover'    => esc_html__( 'Hover', 'visionwp' ),
                ),
                'alpha'     => true,
                'default'   => array(
                    'normal'   => '#ffffff',
                    'hover'  => '#f04819',
                ),
                'output' => array(
                    array(
                        'choice' => 'normal',
                        'element' => '.visionwp-header-wrapper nav > ul > li a',
                        'property' => 'color',
                    ),
                    array(
                        'choice' => 'hover',
                        'element' => '.visionwp-header-wrapper nav > ul > li a:hover, .visionwp-header-wrapper nav > ul li.current-menu-item a',
                        'property' => 'color',
                    ),
                ),
            ),
            'header_submenu_bg_color'    => array(
                'label' => esc_html__( 'Sub Menu Background Color', 'visionwp' ),
                'type'  => 'color',
                'default'   => '#fff',
                'choices'     => array(
					'alpha' => true, 
				),
                'output' => array(
                    array(
                        'element' => 'nav > ul > li .sub-menu',
                        'property' => 'background-color',
                    ),
                ),
            ),
            'header_submenu_text_color' => array(
                'label' => esc_html__( 'Sub Menu Text Color', 'visionwp' ),
                'type'  => 'multicolor',
                'choices'   => array(
                    'normal'     => esc_html__( 'Color', 'visionwp' ),
                    'hover'    => esc_html__( 'Hover', 'visionwp' ),
                ),
                'alpha'     => true,
                'default'   => array(
                    'normal'   => '#010834',
                    'hover'  =>'#f04819',
                ),
                'output' => array(
                    array(
                        'choice' => 'normal',
                        'element' => 'nav > ul > li .sub-menu li a',
                        'property' => 'color',
                    ),
                    array(
                        'choice' => 'hover',
                        'element' => 'nav > ul > li .sub-menu li a:hover',
                        'property' => 'color',
                    ),
                ),
            ),
        ),
    );
	return $section;
}