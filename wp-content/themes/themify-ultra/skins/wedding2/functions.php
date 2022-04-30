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
function themify_theme_wedding2_google_fonts( $fonts ) {
	/* translators: If there are characters in your language that are not supported by this font, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Source Serif Pro font: on or off', 'themify' ) ) {
		$fonts['Source+Serif+Pro'] = 'Source+Serif+Pro:ital,wght@0,400;0,600;1,400';
	}
	/* translators: If there are characters in your language that are not supported by this font, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Abril Fatface font: on or off', 'themify' ) ) {
		$fonts['Abril+Fatface'] = 'Abril+Fatface';
	}
	return $fonts;
}
add_filter( 'themify_theme_google_fonts', 'themify_theme_wedding2_google_fonts' );