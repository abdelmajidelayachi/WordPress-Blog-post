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
function themify_theme_education_google_fonts( $fonts ) {
	/* translators: If there are characters in your language that are not supported by this font, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'PTSans font: on or off', 'themify' ) ) {
		$fonts['PT-Sans'] = 'PT+Sans:400,400i,700,700i';
	}
	return $fonts;
}
add_filter( 'themify_theme_google_fonts', 'themify_theme_education_google_fonts' );

// plugin Learnpress : change course layout to grid
if(defined( 'LP_PLUGIN_FILE' )) {
    function themify_theme_education_learnpress_layout($list){
        return array('grid');
    }
    add_filter( 'learn-press/courses-layouts', 'themify_theme_education_learnpress_layout' );
}
