<?php
/**
 * Builder Plugin Compatibility Code
 *
 * @package    Themify_Builder
 * @subpackage Themify_Builder/classes
 */

class Themify_Builder_Plugin_Compat_WPSuperCache {

	static function init() {
		add_action( 'themify_builder_save_data', array( __CLASS__, 'wp_super_cache_purge' ), 10, 2 );
	}

	/**
	 * Clear WP Super Cache plugin cache for a post when Builder data is saved
	 *
	 * @access public
	 * @since 2.5.8
	 */
	public static function wp_super_cache_purge( $builder_data, $post_id ) {
		if ( function_exists( 'wp_cache_post_change' ) ) {
			wp_cache_post_change( $post_id );
		}
	}
}