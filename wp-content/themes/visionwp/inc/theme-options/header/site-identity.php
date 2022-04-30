<?php
/**
 * Font and Color Options for site identity
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */
add_filter( 'visionwp_customizer_header_panel', 'visionwp_header_site_identity' );
function visionwp_header_site_identity( $section ) {
    $section['title_tagline'] = array(
        'title'  => esc_html__( 'Site Identity', 'visionwp' ),
        'priority'  => 2,
        'fields' => array(
            'logo-size' => array(
                'label' => esc_html__( 'Logo Size', 'visionwp' ),
                'type'  => 'slider',
                'default' => '180',
                'choices'     => array(
                    'min'  => 0,
                    'max'  => 500,
                    'step' => 1,
                ),
                'output' => array(
                    array(
                        'element' => '.visionwp-header-wrapper .visionwp-header .visionwp-site-branding img',
                        'property' => 'max-width',
                        'units' => 'px'
                    )
                )
            ),
            'site_identity_typography' => array(
                'label' => esc_html__( 'Site Identity Typography', 'visionwp' ),
                'type'  => 'typography',
                'choices' => array( 
                    'fonts' => VisionWP_Helper::theme_google_font(),
                ),
                'default'     =>array(
                    'font-family'     => 'Montserrat Alternates',
                    'font-style'      => 'normal',
                    'font-size'       => '32px',
                    'text-transform'  => 'none',
                    'line-height'     => '1.2',
                    'letter-spacing'  => '0',
                ),
                'output' => array(
                    array(
                        'element'  => ' .site-title, .site-title a',
                    ),
                ),
            ),
        ),
    );
    return $section;
}