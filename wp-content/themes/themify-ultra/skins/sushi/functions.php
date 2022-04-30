<?php
/**
 * Custom functions specific to the skin
 *
 * @package Themify Ultra
 */

/**
 * Load Google web fonts required for the skin
 *
 * @since 1.4.9
 * @return array
 */
function themify_theme_sushi_google_fonts( $fonts ) {
	/* translators: If there are characters in your language that are not supported by Source Sans, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Source Sans font: on or off', 'themify' ) ) {
		$fonts['source-sans'] = 'Source+Sans+Pro:300,400,600,700,900';
	}

	return $fonts;
}
add_filter( 'themify_theme_google_fonts', 'themify_theme_sushi_google_fonts' );