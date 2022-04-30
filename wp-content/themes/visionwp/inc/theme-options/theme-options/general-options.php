<?php
/**
* General Theme Options
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */
add_filter( 'visionwp_customizer_theme_panel', 'visionwp_general_theme_options' );
function visionwp_general_theme_options( $section ) {
    $section['colors'] = array(
        'title' => esc_html__( 'General Options', 'visionwp' ),
        'priority'  => 1,
        'fields'    => array(
            'scroll_to_top' => array(
                'label' => esc_html__( 'Scroll To Top', 'visionwp' ),
                'type'  => 'toggle',
                'default'   => 'on',
            ),  
            'primary_color' => array(
                'label' => esc_html__( 'Primary Color', 'visionwp' ),
                'type'  => 'color',
                'default'   => '#f94d1c',
                'alpha' => true,
                'output'    => array(
                    array(
                        'element'   => '.visionwp-content-wrapper main.site-main .visionwp-content-post .visionwp-content .visionwp-post-title a:hover,
                            .visionwp-header-wrapper .visionwp-header .visionwp-site-branding .site-title a:hover, 
                            .visionwp-content-wrapper main.site-main .visionwp-content-post .visionwp-content .visionwp-post-excerpt .visionwp-site-button a:hover, .visionwp-content-wrapper main.site-main .visionwp-content-post .visionwp-content .visionwp-post-meta .visionwp-author-wrapper .visionwp-author-link:hover, .visionwp-content-wrapper main.site-main .visionwp-content-post .visionwp-content .visionwp-post-meta .posted-on a:hover, .visionwp-content-wrapper main.site-main .visionwp-content-post .visionwp-content .visionwp-post-meta .visionwp-comments a:hover, .visionwp-content-wrapper main.site-main .visionwp-content-post .visionwp-content .visionwp-post-excerpt .visionwp-site-button a:hover, aside#secondary ul li a:hover, .visionwp-footer-copyright > div > div a:hover,.visionwp-nav-wrapper > div a:hover, .visionwp-breadcrumb-wrapper ul li a:hover, .visionwp-widget-area ul li a:hover, .comment-respond .comment-reply-title a:hover, .comment-respond .logged-in-as a:hover, a:hover, a:active, aside#secondary ul li .wp-block-latest-posts__post-excerpt .visionwp-site-button > a:hover, .visionwp-top-bar .visionwp-top-bar-info ul li a:hover, a:focus',
                        'property'  => 'color',
                    ),
                    array(
                        'element'   => '.site-title a:hover, .visionwp-footer-copyright > div > div a:hover, .visionwp-header-wrapper .visionwp-header .visionwp-site-branding .site-title a:hover, .site-title:hover, .site-title a:hover',
                        'property'  => 'color',
                        'suffix'    => '!important',
                    ),
                    array(
                        'element' => '.visionwp-scroll-top, .visionwp-content-wrapper main.site-main .visionwp-content-post .visionwp-content .visionwp-post-category ul li a, .visionwp-comment-wrapper form#commentform input#submit, .wp-block-search__inside-wrapper .wp-block-search__button, 
                            .visionwp-404-wrapper .search-form button.search-submit, 
                            .visionwp-404-wrapper a.btn.visionwp-404-home-btn, .visionwp-no-results.not-found .search-form button.search-submit, .visionwp-no-results.not-found a.visionwp-btn-primary, .visionwp-tag-wrapper .visionwp-tags-wrapper a, .visionwp-banner-wrapper .visionwp-banner-content-inner .visionwp-banner-content .search-form button.search-submit, .visionwp-page-navigation a, .visionwp-page-navigation span',
                        'property' => 'background',
                    ),
                ),
            ),
            'enable_sidebar' => array(
                'label' => esc_html__( 'Enable Sidebar' , 'visionwp' ),
                'type'  => 'radio-buttonset',
                'default'   => 'hide',
                'choices'   => array(
                    'left'  => esc_html__( 'Left', 'visionwp' ),
                    'right'  => esc_html__( 'Right', 'visionwp' ),
                    'hide'  => esc_html__( 'Hide', 'visionwp' ),
                ),
            ),
        ),
    );
    return $section;
}