<?php
/**
* Theme Typography Options
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */
add_filter( 'visionwp_customizer_theme_panel', 'visionwp_theme_typography_options' );
function visionwp_theme_typography_options( $section ) {
    $section['theme_options'] = array(
        'title' => esc_html__( 'Theme Typography', 'visionwp' ),
        'priority'  => 11,
        'fields'    => array(
            'general_typography_options' => array(
                'label' => esc_html__( 'General  Typography ', 'visionwp' ),
                'type'  => 'typography',
                'choices' => array( 
                    'fonts' => VisionWP_Helper::theme_google_font(),
                ),
                'default'     =>array(
                    'font-family'     => 'Montserrat Alternates',
                    'variant'         => 'regular',
                    'font-style'      => 'normal',
                    'text-transform'  => 'none',
                    'font-size'       => '14px',
                    'line-height'     => '1.5',
                    'letter-spacing'  => '0',
                ),
                'output'    => array(
                    array(
                        'element'   => 'body',
                    ),
                ),
            ),
            'heading_typography_options' => array(
                'label' => esc_html__( 'Heading Typography (H1-H6)', 'visionwp' ),
                'type'  => 'typography',
                'choices' => array( 
                    'fonts' => VisionWP_Helper::theme_google_font(),
                ),
                'default'     =>array(
                    'font-family'     => 'Montserrat Alternates',
                    'variant'         => 'regular',
                    'text-transform'  => 'none',
                    'font-style'      => 'normal',
                    'line-height'     => '1.5',
                    'letter-spacing'  => '0',
                ),
                'output'    => array(
                    array(
                        'element'   => '.visionwp-content-wrapper main.site-main .visionwp-content-post .visionwp-content .visionwp-post-title a, 
                        h1, h2, h3, h4, h5, h6, .entry-title, .visionwp-breadcrumb-wrapper ul, .visionwp-comment-wrapper form#commentform input#submit,
                        aside#secondary ul li a, .visionwp-content-wrapper main.site-main .visionwp-content-post .visionwp-content .visionwp-post-excerpt .visionwp-site-button a
                        .visionwp-content-wrapper main.site-main .visionwp-content-post .visionwp-content .visionwp-post-meta .visionwp-author-wrapper .visionwp-author-link,
                        time.entry-date.published, .visionwp-site-button a, a.visionwp-author-link,
                        .visionwp-content-wrapper main.site-main .visionwp-content-post .visionwp-content .visionwp-post-title,
                        aside#secondary section .wp-block-search .wp-block-search__label',
                    ),
                ),
            ),
        ),
    );
    return $section;
}