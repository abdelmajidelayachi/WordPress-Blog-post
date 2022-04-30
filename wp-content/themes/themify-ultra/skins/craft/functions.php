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
function themify_theme_craft_google_fonts( $fonts ) {
	$fonts = array();
	/* translators: If there are characters in your language that are not supported by Lato Web, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Lato font: on or off', 'themify' ) ) {
		$fonts['Lato'] = 'Lato:300,400,400i,700,700i,900';
	}
	if ( 'off' !== _x( 'on', 'Karla font: on or off', 'themify' ) ) {
		$fonts['Karla'] = 'Karla:400,400i,700,700i';
	}
	return $fonts;
}
add_filter( 'themify_theme_google_fonts', 'themify_theme_craft_google_fonts' );