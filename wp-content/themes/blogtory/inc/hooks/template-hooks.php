<?php
/**
 * Blogtory hooks
 *
 * @package Blogtory
 */

/**
 * Before Site
 *
 * @see  blogtory_preloader()
 *
 */
add_action( 'blogtory_before_site', 'blogtory_preloader', 10 );

/**
 * Header
 *
 * @see  blogtory_header_start()
 * @see  blogtory_header_content()
 * @see  blogtory_header_end()
 *
 */
add_action( 'blogtory_header', 'blogtory_header_content', 10 );

/**
 * Before Content
 *
 * @see  blogtory_header_widget_region()
 * @see  blogtory_breadcrumb()
 */
add_action( 'blogtory_before_content', 'blogtory_header_widget_region', 10 );
add_action( 'blogtory_before_content', 'blogtory_breadcrumb', 20 );

/**
 * Homepage
 *
 * @see  blogtory_home_banner()
 * @see  blogtory_above_homepage_widget_region()
 */
add_action( 'blogtory_home_before_widget_area', 'blogtory_home_trending_items', 5 );
add_action( 'blogtory_home_before_widget_area', 'blogtory_home_banner', 10 );
add_action( 'blogtory_home_before_widget_area', 'blogtory_above_homepage_widget_region', 20 );

add_action( 'blogtory_home_after_widget_area', 'blogtory_below_homepage_widget_region', 10 );

/**
 * Before Footer
 *
 * @see  blogtory_before_footer_widget_region()
 */
add_action( 'blogtory_before_footer', 'blogtory_before_footer_widget_region', 10 );

/**
 * Footer
 *
 * @see  blogtory_footer_start()
 * @see  blogtory_footer_content()
 * @see  blogtory_footer_end()
 */
add_action( 'blogtory_footer', 'blogtory_footer_start', 10 );
add_action( 'blogtory_footer', 'blogtory_footer_content', 20 );
add_action( 'blogtory_footer', 'blogtory_footer_end', 30 );

/**
 * After Footer
 *
 * @see  blogtory_after_footer_widget_region()
 */
add_action( 'blogtory_after_footer', 'blogtory_after_footer_widget_region', 10 );