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
function themify_theme_music2_google_fonts( $fonts ) {
	if ( 'off' !== _x( 'on', 'Poppins font: on or off', 'themify' ) ) {
		$fonts['poppins'] = 'Poppins:400,500,600,700';
	}
	return $fonts;
}
add_filter( 'themify_theme_google_fonts', 'themify_theme_music2_google_fonts' );

function themify_theme_custom_excerpt_length( $length ) {
    return 12;
}
add_filter( 'excerpt_length', 'themify_theme_custom_excerpt_length', 999 );