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
function themify_theme_clinic_google_fonts( $fonts ) {
	/* translators: If there are characters in your language that are not supported by this font, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Inter font: on or off', 'themify' ) ) {
		$fonts['inter'] = 'Inter:300,400,500,600,700,800,900';
	}
	return $fonts;
}
add_filter( 'themify_theme_google_fonts', 'themify_theme_clinic_google_fonts' );