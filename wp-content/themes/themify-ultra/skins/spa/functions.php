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
	if ( 'off' !== _x( 'on', 'Josefin Sans font: on or off', 'themify' ) ) {
		$fonts['josefinsans'] = 'Josefin+Sans:400,700';
	}
	/* translators: If there are characters in your language that are not supported by this font, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Comfortaa font: on or off', 'themify' ) ) {
		$fonts['comfortaa'] = 'Comfortaa:400,700';
	}
	/* translators: If there are characters in your language that are not supported by this font, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Varela Round: on or off', 'themify' ) ) {
		$fonts['varelaround'] = 'Varela+Round';
	}	
	/* translators: If there are characters in your language that are not supported by this font, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Lora : on or off', 'themify' ) ) {
		$fonts['lora'] = 'Lora:400i';
	}	

	return $fonts;
}
add_filter( 'themify_theme_google_fonts', 'themify_theme_fitness_google_fonts' );