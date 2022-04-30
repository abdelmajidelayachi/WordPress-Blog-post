<?php 

function visionwp_acb_footer_copyright( $object ){
    echo esc_html( visionwp_get( $object->id ) );
}

/**
* Footer Options
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */
add_filter( 'visionwp_customizer_theme_panel', 'visionwp_footer_options' );
function visionwp_footer_options( $section ) {
    $section[ 'footer_options' ] = array(
        'title' => esc_html__( 'Footer Options', 'visionwp' ),
        'priority'  => 25,
        'fields'    => array(
            'footer_copyright'    => array(
                'label' => esc_html__( 'Copyright Text', 'visionwp' ),
                'type'  => 'textarea',
                'default'   => esc_html__( 'Copyright &copy; All right reserved', 'visionwp' ),
                'partial' => array(
                    'selector' => '.visionwp-footer-copyright-text',
                ),
            ),
            'footer_bg_color'  => array(
                'label' => esc_html__( 'Background Color', 'visionwp' ),
                'type'  => 'color',
                'default'   => '#010834',
                'output'    => array(
                    array(
                        'element'   => '.visionwp-footer-copyright, .visionwp-footer-area-wrapper',
                        'property' => 'background-color',
                    ),
                ),
            ),
            'footer_color' => array(
                'label' => esc_html__( 'Footer Color', 'visionwp' ),
                'type'  => 'color',
                'alpha'     => true,
                'default'   => '#fff',
                'output'    => array(
                    array(
                        'choice'    => 'normal',
                        'element'   => 'visionwp-footer-copyright, .visionwp-footer-copyright > div > div, .visionwp-footer-copyright > div > div a',
                        'property'  => 'color',
                        'suffix'    => '!important',
                    ),
                ),
            ),
        ),
    );
    return $section;
}