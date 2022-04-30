<?php
/**
 * Recommended plugins
 *
 * @package Blogtory
 */
if ( ! function_exists( 'blogtory_recommended_plugins' ) ) :
	/**
	 * Recommend plugins.
	 *
	 * @since 1.0.0
	 */
	function blogtory_recommended_plugins() {
		$plugins = array(
			array(
				'name'     => esc_html__( 'One Click Demo Import', 'blogtory' ),
				'slug'     => 'one-click-demo-import',
				'required' => false,
			),
			array(
                'name'     => __( 'Unfoldwp Import Companion', 'blogtory' ),
                'slug'     => 'unfoldwp-import-companion',
                'required' => false,
            ),
			array(
                'name'     => __( 'MailChimp for WordPress', 'blogtory' ),
                'slug'     => 'mailchimp-for-wp',
                'required' => false,
            ),
		);
		tgmpa( $plugins );
	}
endif;
add_action( 'tgmpa_register', 'blogtory_recommended_plugins' );