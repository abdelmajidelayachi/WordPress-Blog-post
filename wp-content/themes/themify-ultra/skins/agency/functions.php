<?php
/**
 * Custom functions specific to the Agency skin
 *
 * @package Themify Ultra
 */

/**
 * Load Google web fonts required for the Agency skin
 *
 * @since 1.4.9
 * @return array
 */
function themify_theme_agency_google_fonts( $fonts ) {
	/* translators: If there are characters in your language that are not supported by Poppins, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Poppins font: on or off', 'themify' ) ) {
		$fonts['poppins'] = 'Poppins:400,500,600,700';
	}

	return $fonts;
}
add_filter( 'themify_theme_google_fonts', 'themify_theme_agency_google_fonts' );