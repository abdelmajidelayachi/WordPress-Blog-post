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
function themify_theme_yoga_google_fonts( $fonts ) {
	/* translators: If there are characters in your language that are not supported by this font, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Playfair font: on or off', 'themify' ) ) {
		$fonts['playfair+display'] = 'Playfair+Display:400,400i,700,700i,900,900i';
	}
	if ( 'off' !== _x( 'on', 'Poppins font: on or off', 'themify' ) ) {
		$fonts['poppins'] = 'Poppins:300,400,400i,500,600,700';
	}
	return $fonts;
}
add_filter( 'themify_theme_google_fonts', 'themify_theme_yoga_google_fonts' );