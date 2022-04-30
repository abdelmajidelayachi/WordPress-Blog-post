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
function themify_theme_foundation_google_fonts( $fonts ){
	/* translators: If there are characters in your language that are not supported by this font, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Lato font: on or off', 'themify' ) ) {
		$fonts['lato'] = 'Lato:300,300i,400,400i,700,700i';
	}
	return $fonts;
}
add_filter( 'themify_theme_google_fonts', 'themify_theme_foundation_google_fonts' );