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
function themify_theme_games_google_fonts( $fonts ) {
	/* translators: If there are characters in your language that are not supported by this font, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Lato font: on or off', 'themify' ) ) {
		$fonts['lato'] = 'Lato:300i,400,400i,700';
	}
	/* translators: If there are characters in your language that are not supported by this font, translate this to 'off'. Do not translate into your own language. */
	if ( 'off' !== _x( 'on', 'Montserrat font: on or off', 'themify' ) ) {
		$fonts['montserrat'] = 'Montserrat:400,700';
	}	

	return $fonts;
}
add_filter( 'themify_theme_google_fonts', 'themify_theme_games_google_fonts' );

function new_excerpt_more( $more ) {
    return '';
}
add_filter('excerpt_more', 'new_excerpt_more');


function themify_theme_custom_excerpt_length( $length ) {
    return 12;
}
add_filter( 'excerpt_length', 'themify_theme_custom_excerpt_length', 999 );

/**
 * Add a Color field to Category taxonomy
 *
 * @since 1.0.1
 * @return array
 */
function themify_theme_game_category_fields( $fields ) {
	$new_fields = array(
		array(
			'name'        => 'tf_color',
			'title'       => __( 'Accent Color', 'themify' ),
			'description' => '',
			'type'        => 'color',
			'meta'        => array( 'default' => null ),
		),
	);

	return array_merge( $fields, $new_fields );
}
add_filter( 'themify_metabox/taxonomy/category/fields', 'themify_theme_game_category_fields', 10 );

/**
 * Add category styles for the posts
 *
 * @since 1.0.1
 * @return array
 */
function themify_theme_game_category_styles() {
	global $themify;
	
	if ( $themify->hide_meta_category === 'yes' )
		return;

	$terms = get_the_terms( get_the_id(), 'category' );
	if ( is_wp_error( $terms ) || empty( $terms ) )
		return $terms;

	$styles = '';
	foreach ( $terms as $term ) {
		$color = get_term_meta( $term->term_id, 'tf_color', true );
		if ( ! empty( $color ) ) {
			$styles .= '#post-' . get_the_id() . ' .post-category a.term-' . $term->slug . ' { background-color: ' . $color . '; }' . "\n";
		}
	}

	if ( ! empty( $styles ) ) {
		printf( '<style>%s</style>', $styles );
	}
}
add_action( 'themify_post_end', 'themify_theme_game_category_styles' );