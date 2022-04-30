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
function themify_theme_agency3_google_fonts( $fonts ) {
	/* translators: If there are characters in your language that are not supported by this font, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Muli font: on or off', 'themify' ) ) {
		$fonts['muli'] = 'Muli:400,400i,600,700';
	}
	return $fonts;
}
add_filter( 'themify_theme_google_fonts', 'themify_theme_agency3_google_fonts' );