<?php
/**
* General Header Options
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */
add_filter( 'visionwp_customizer_header_panel', 'visionwp_header_button_options' );
function visionwp_header_button_options( $section ) {
    $section[ 'header_button_options' ] = array(
        'title' => esc_html__( 'Button Options', 'visionwp' ),
        'fields'    => array(
            'button_options'    => array(
                'label' => esc_html__( 'Label', 'visionwp' ),
                'type'  => 'text',
                'default'   => esc_html__( 'Contact Us', 'visionwp'),   
            ),	
            'header_btn_target' => array(
                'label' => esc_html__( 'Open in new tab', 'visionwp' ),
                'type' => 'toggle',
                'default' => '1',
            ),
            'header_btn_link' => array(
                'label' => esc_html( 'Add link', 'visionwp' ),
                'type'  => 'text',
                'default'   =>esc_html__( '#', 'visionwp' ),
            ),
            'button_font_options' => array(
                'label' => esc_html__( 'Typography', 'visionwp' ),
                'type'  => 'typography',
                'choices' => array( 
                    'fonts' => VisionWP_Helper::theme_google_font(),
                ),
                'default'     =>array(
                    'font-family'     => 'Ubuntu',
                    'variant'         => 'regular',
                    'font-size'       => '14px',
                    'letter-spacing'  => '0',
                ),
                'output'    =>  array(
                    array(
                        'element'   => 'header .visionwp-site-button',
                    ),
                ),
            ),
            'header_btn_bg_color'    => array(
                'label' => esc_html__( 'Background Color', 'visionwp' ),
                'type'  => 'multicolor',
                'choices'   => array(
                    'normal'     => esc_html__( 'Color', 'visionwp' ),
                    'hover'    => esc_html__( 'Hover', 'visionwp' ),
                ),
                'alpha'     => true,
                'default'   => array(
                    'normal' => '#f94d1c',
                    'hover'  => '#f04819',
                ),
                'output' => array(
                    array(
                        'choice' => 'normal',
                        'element'  => 'header .visionwp-site-button .visionwp-primary-button',
                        'property' => 'background',
                    ),
                    array(
                        'choice' => 'hover',
                        'element'  => 'header .visionwp-site-button .visionwp-primary-button:hover',
                        'property' => 'background',
                    ),   
                ),
            ),        
            'header_btn_text_color'  => array(
                'label' => esc_html__( 'Text Color', 'visionwp' ),
                'type'  => 'multicolor',
                'choices'   => array(
                    'normal'     => esc_html__( 'Color', 'visionwp' ),
                    'hover'    => esc_html__( 'Hover', 'visionwp' ),
                ),
                'alpha'     => true,
                'default'   => array(
                    'normal'   => '#ffffff',
                    'hover'  => '#ffffff',
                ),
            ),
            'header_btn_padding' => array(
                'label' => esc_html__( ' Padding', 'visionwp' ),
                'type'  => 'dimensions',
                'sub_type' => 'padding', 
                'choices'   => array(
                    'padding-top'    => esc_html__( 'Top', 'visionwp' ),
                    'padding-right'  => esc_html__( 'Right', 'visionwp' ),
                    'padding-bottom' => esc_html__( 'Bottom', 'visionwp' ),
                    'padding-left'   => esc_html__( 'Left', 'visionwp' ),
                ),
                'default'     =>array(
                    'padding-top'    => '10px',
                    'padding-right'  => '15px',
                    'padding-bottom' => '10px',
                    'padding-left'   => '15px',
                ),
                'output'    => array(
                    array(
                        'choice'    => 'padding-top',
                        'element'   => 'header .visionwp-site-button .visionwp-primary-button',
                        'property'  => 'padding-top',
                    ),
                    array(
                        'choice'    => 'padding-right',
                        'element'   => 'header .visionwp-site-button .visionwp-primary-button',
                        'property'  => 'padding-right',
                    ),
                    array(
                        'choice'    => 'padding-bottom',
                        'element'   => 'header .visionwp-site-button .visionwp-primary-button',
                        'property'  => 'padding-bottom',
                    ),
                    array(
                        'choice'    => 'padding-left',
                        'element'   => 'header .visionwp-site-button .visionwp-primary-button',
                        'property'  => 'padding-left',
                    ),
                ),
            ),
            'header_btn_border_type' => array(
                'label' => esc_html__( 'Border Type', 'visionwp' ),
                'type' => 'select',
                'default' => 'solid',
                'choices' => array(
                    'none' => esc_html__( 'None', 'visionwp' ),
                    'solid' => esc_html__( 'Solid', 'visionwp' ),
                    'dotted' => esc_html__( 'Dotted ', 'visionwp' ),
                    'dashed' => esc_html__( 'Dashed ', 'visionwp' ),
                ),
                'output'    => array(
                    array(
                        'element'   => 'header .visionwp-site-button .visionwp-primary-button',
                        'property'  => 'border-style',
                    ),
                ),
            ),
            'header_btn_border_width' => array(
                'label' => esc_html__( 'Border Width', 'visionwp' ),
                'type'  => 'dimensions' ,
                'sub_type' => 'border',
                'choices'   => array(
                    'border-top-width'    => esc_html__( 'Top', 'visionwp' ),
                    'border-right-width'  => esc_html__( 'Right', 'visionwp' ),
                    'border-bottom-width' => esc_html__( 'Bottom', 'visionwp' ),
                    'border-left-width'   => esc_html__( 'Left', 'visionwp' ),
                ),
                'default'     =>array(
                    'border-top-width'    => '1px',
                    'border-right-width'  => '1px',
                    'border-bottom-width' => '1px',
                    'border-left-width'   => '1px',
                ),
                'active_callback'   => array(
                    array(
                        'setting'   => 'header_btn_border_type',
                        'operator'  => '!=',
                        'value' => 'none',
                    ),
                ),
                'output'    => array(
                    array(
                        'choice'    =>  'border-top-width',
                        'element'   => 'header .visionwp-site-button .visionwp-primary-button',
                        'property'  => 'border-top-width',
                    ),
                    array(
                        'choice'    =>  'border-right-width',
                        'element'   => 'header .visionwp-site-button .visionwp-primary-button',
                        'property'  => 'border-right-width',
                    ),
                    array(
                        'choice'    =>  'border-bottom-width',
                        'element'   => 'header .visionwp-site-button .visionwp-primary-button',
                        'property'  => 'border-bottom-width',
                    ),
                    array(
                        'choice'    =>  'border-left-width',
                        'element'   => 'header .visionwp-site-button .visionwp-primary-button',
                        'property'  => 'border-left-width',
                    ),
                )
            ),
            'header_btn_border_radius' => array(
                'label' => esc_html__( 'Border Radius', 'visionwp' ),
                'type'  => 'dimensions' ,
                'sub_type' => 'border-radius',
                'choices'   => array(
                    'border-top-right-radius'    => esc_html__( 'Top', 'visionwp' ),
                    'border-top-left-radius'  => esc_html__( 'Right', 'visionwp' ),
                    'border-bottom-right-radius' => esc_html__( 'Bottom', 'visionwp' ),
                    'border-bottom-left-radius'   => esc_html__( 'Left', 'visionwp' ),
                ),
                'default'     =>array(
                    'border-top-right-radius'  => '0px',
                    'border-top-left-radius'  => '0px',
                    'border-bottom-right-radius' => '0px',
                    'border-bottom-left-radius'   => '0px',
                ),
                'active_callback'   => array(
                    array(
                        'setting'   => 'header_btn_border_type',
                        'operator'  => '!=',
                        'value' => 'none',
                    ),
                ),
                'output'    => array(
                    array(
                        'choice'    =>   'border-top-right-radius',
                        'element'   => 'header .visionwp-site-button .visionwp-primary-button',
                        'property'  =>  'border-top-right-radius',
                    ),
                    array(
                        'choice'    =>   'border-top-left-radius',
                        'element'   => 'header .visionwp-site-button .visionwp-primary-button',
                        'property'  =>  'border-top-left-radius',
                    ),
                    array(
                        'choice'    =>  'border-bottom-right-radius',
                        'element'   => 'header .visionwp-site-button .visionwp-primary-button',
                        'property'  => 'border-bottom-right-radius',
                    ),
                    array(
                        'choice'    =>  'border-bottom-left-radius',
                        'element'   => 'header .visionwp-site-button .visionwp-primary-button',
                        'property'  => 'border-bottom-left-radius',
                    ),
                ),
            ),
            'header_btn_border_color'    => array(
                'label' => esc_html__( ' Border Color', 'visionwp' ),
                'type'  => 'multicolor',
                'choices'   => array(
                    'normal'     => esc_html__( 'Color', 'visionwp' ),
                    'hover'    => esc_html__( 'Hover', 'visionwp' ),
                ),
                'alpha'     => true,
                'default'   => array(
                    'normal'   => '#01083400',
                    'hover'  =>'#f04819',
                ),
                'active_callback'   => array(
                    array(
                        'setting'   => 'header_btn_border_type',
                        'operator'  => '!=',
                        'value' => 'none',
                    ),
                ),
                'output'    => array(
                    array(
                        'choice'    => 'normal',
                        'element'   => 'header .visionwp-site-button .visionwp-primary-button',
                        'property'  => 'border-color',
                    ),
                    array(
                        'choice'    => 'hover',
                        'element'   => 'header .visionwp-site-button .visionwp-primary-button:hover',
                        'property'  => 'border-color',
                    ),
                ),
            ),
        ),
    );
    return $section;
}