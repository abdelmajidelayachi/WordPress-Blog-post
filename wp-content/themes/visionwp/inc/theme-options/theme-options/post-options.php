<?php
/**
* Post Options
* @since 1.0.0
* @package VisionWP WordPress Theme
*/
add_filter( 'visionwp_customizer_theme_panel', 'visionwp_theme_post_options' );
function visionwp_theme_post_options( $section ) {
	$section[ 'theme_post_options' ] = array(
        'title'  => esc_html__( 'Blog/Archive', 'visionwp' ),
        'priority'  => 20,
        'fields' => array(
            'post_meta_order'  => array(
                'label' => esc_html__( 'Meta Order', 'visionwp' ),
                'type'  => 'sortable',
                'default'   => array( 'thumbnail', 'title', 'category', 'date-author', 'excerpt' ),
                'choices'   => array(
                    'thumbnail'  => esc_html__( 'Thumbnail/Placeholder', 'visionwp' ),
                    'title'  => esc_html__( 'Title', 'visionwp' ),
                    'category'  => esc_html__( 'Category', 'visionwp' ),
                    'date-author'  => esc_html__( 'Date & Author', 'visionwp' ),
                    'excerpt'  => esc_html__( 'Excerpt', 'visionwp' ),
                ),
            ),
            'enable_placeholder' => array(
                'label' => esc_html__( 'Enable Placeholder Image', 'visionwp' ),
                'description' => esc_html__( 'Placeholder Image will apper if post doesnot have thumbnail image.', 'visionwp' ),
                'default' => true,
                'type' => 'toggle',
            ),
            'blog_page_title' => array(
                'label' => esc_html__( 'Home Page Title', 'visionwp' ),
                'default' => esc_html__( 'Blogs', 'visionwp' ),
                'type' => 'text'
            ),
            'readmore_text' => array(
                'label' => esc_html__( 'Readmore Text', 'visionwp' ),
                'default' => esc_html__( 'Read More', 'visionwp' ),
                'type' => 'text',
            ),
            'post_per_row' => array(
                'label' => esc_html__( 'Post Per Row', 'visionwp' ),
                'type'  => 'radio-buttonset',
                'default'   => 'three',
                'choices' => array(
                    'one' => esc_html__( '1', 'visionwp' ),
                    'two' => esc_html__( '2', 'visionwp' ),
                    'three' => esc_html__( '3', 'visionwp' ),
                ),  
            ),
            'pagination_format'   => array(
                'label' => esc_html__( 'Post Pagination', 'visionwp' ),
                'type'  => 'radio-buttonset',
                'default'   => 'default',
                'choices'   => array(
                    'default' => esc_html__( 'Number', 'visionwp' ),
                    'load-more' => esc_html__( 'Load More', 'visionwp' ),
                ),
            ),
            'load_more_text'    => array(
                'label' => esc_html__( 'Load More Text', 'visionwp' ),
                'type'  => 'text',
                'default'   => esc_html__( 'Load More', 'visionwp' ),
                'active_callback'   => array(
                    array(
                        'setting'   => 'pagination_format',
                        'operator'  => '==',
                        'value' => 'load-more',
                    ),
                ),
            ),
        ),
    );
	return $section;
}