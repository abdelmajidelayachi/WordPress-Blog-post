<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package Blogtory
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function blogtory_body_classes( $classes ) {
	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}

	if( is_front_page() ){
        $classes[] = 'be-home';
    }

    $page_layout = blogtory_get_page_layout();
    if('no-sidebar' != $page_layout ){
        $classes[] = 'has-sidebar '.esc_attr($page_layout);
    }else{
        $classes[] = esc_attr($page_layout);
    }

    if(is_single()){
        global $post;
        $single_post_style = get_post_meta($post->ID, 'blogtory_single_post_style', true );
        if(empty($single_post_style)){
            $single_post_style = blogtory_get_option('single_post_style');
        }
        $classes[] = 'be-'.esc_attr($single_post_style);
    }

	return $classes;
}
add_filter( 'body_class', 'blogtory_body_classes' );

/**
 * Add a pingback url auto-discovery header for single posts, pages, or attachments.
 */
function blogtory_pingback_header() {
	if ( is_singular() && pings_open() ) {
		echo '<link rel="pingback" href="', esc_url( get_bloginfo( 'pingback_url' ) ), '">';
	}
}
add_action( 'wp_head', 'blogtory_pingback_header' );
