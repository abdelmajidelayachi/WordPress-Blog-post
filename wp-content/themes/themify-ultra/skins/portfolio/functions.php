<?php
/**
 * Custom functions specific to the skin
 *
 * @package Themify Ultra
 */

/**
 * Load Google web fonts required for the Portfolio skin
 *
 * @since 1.4.9
 * @return array
 */
function themify_theme_portfolio_google_fonts( $fonts ) {
	/* translators: If there are characters in your language that are not supported by this font, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Poppins font: on or off', 'themify' ) ) {
		$fonts['poppins'] = 'Poppins:300,400,500,600,700,800,900';
	}

	return $fonts;
}
add_filter( 'themify_theme_google_fonts', 'themify_theme_portfolio_google_fonts' );

/**
 * Register custom script for the Portfolio skin
 *
 * @since 1.1
 */
function themify_theme_portfolio_custom_script() {
	wp_enqueue_script( 'themify-portfolio-script', themify_enque(THEME_URI . '/skins/portfolio/js/script.js'), null, Themify_Enqueue_Assets::$themeVersion, true );	
}
add_action( 'wp_enqueue_scripts', 'themify_theme_portfolio_custom_script' );