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
function themify_theme_fitness_google_fonts( $fonts ) {
	/* translators: If there are characters in your language that are not supported by this font, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Roboto font: on or off', 'themify' ) ) {
		$fonts['roboto'] = 'Roboto:400,400i,500,700,700i,900,900i';
	}
	/* translators: If there are characters in your language that are not supported by this font, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Viga font: on or off', 'themify' ) ) {
		$fonts['viga'] = 'Viga';
	}	

	return $fonts;
}
add_filter( 'themify_theme_google_fonts', 'themify_theme_fitness_google_fonts' );