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
function themify_theme_men_google_fonts( $fonts ) {
	if ( 'off' !== _x( 'on', 'Lato font: on or off', 'themify' ) ) {
		$fonts['Lato'] = 'Lato:300,400,700,900';
	}
	return $fonts;
}
add_filter( 'themify_theme_google_fonts', 'themify_theme_men_google_fonts' );
