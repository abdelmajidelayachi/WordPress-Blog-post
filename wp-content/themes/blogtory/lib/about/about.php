<?php
/**
 * About setup
 *
 * @package Blogtory
 */

if ( ! function_exists( 'blogtory_about_setup' ) ) :

	/**
	 * About setup.
	 *
	 * @since 1.0.0
	 */
	function blogtory_about_setup() {

        $config = array(

			// Welcome content.
			'welcome_content' => sprintf( esc_html__( '%1$s is now installed and ready to use. We want to make sure you have the best experience using the theme and that is why we gathered here all the necessary information for you. Thanks for using our theme!', 'blogtory' ), 'Blogtory' ),

			// Tabs.
			'tabs' => array(
				'getting-started' => esc_html__( 'Getting Started', 'blogtory' ),
				'useful-plugins'  => esc_html__( 'Useful Plugins', 'blogtory' ),
            ),

			// Quick links.
			'quick_links' => array(
                'theme_url' => array(
                    'text' => esc_html__( 'Theme Details', 'blogtory' ),
                    'url'  => 'https://unfoldwp.com/products/blogtory/',
                ),
                'demo_url' => array(
                    'text' => esc_html__( 'View Demo', 'blogtory' ),
                    'url'  => 'https://preview.unfoldwp.com/blogtory/',
                ),
                'documentation_url' => array(
                    'text'   => esc_html__( 'View Documentation', 'blogtory' ),
                    'url'    => 'https://docs.unfoldwp.com/docs/blogtory/',
                ),
            ),

			// Getting started.
			'getting_started' => array(
				'one' => array(
					'title'       => esc_html__( 'Theme Documentation', 'blogtory' ),
					'icon'        => 'dashicons dashicons-format-aside',
					'description' => esc_html__( 'Please check our full documentation for detailed information on how to setup and customize the theme.', 'blogtory' ),
					'button_text' => esc_html__( 'View Documentation', 'blogtory' ),
					'button_url'  => 'https://docs.unfoldwp.com/docs/blogtory/',
					'button_type' => 'link',
					'is_new_tab'  => true,
                ),
                'two' => array(
                    'title'       => esc_html__( 'Widget Options', 'blogtory' ),
                    'icon'        => 'dashicons dashicons-admin-customizer',
                    'description' => esc_html__( 'Theme uses widgetareas and widget to display content on homepage. Different combination of widgets and widgetareas will make your site unique.', 'blogtory' ),
                    'button_text' => esc_html__( 'Get Started', 'blogtory' ),
                    'button_url'  => admin_url('widgets.php'),
                    'button_type' => 'primary',
                ),
				'three' => array(
					'title'       => esc_html__( 'Theme Options', 'blogtory' ),
					'icon'        => 'dashicons dashicons-admin-customizer',
					'description' => esc_html__( 'Theme uses Customizer API for theme options. Using the Customizer you can easily customize different aspects of the theme.', 'blogtory' ),
					'button_text' => esc_html__( 'Customize', 'blogtory' ),
					'button_url'  => wp_customize_url(),
					'button_type' => 'primary',
                ),
				'four' => array(
					'title'       => esc_html__( 'Demo Content', 'blogtory' ),
					'icon'        => 'dashicons dashicons-layout',
					'description' => sprintf( esc_html__( 'To import sample demo content, %1$s plugin should be installed and activated. After plugin is activated, visit Import Demo Data menu under Appearance.', 'blogtory' ), esc_html__( 'One Click Demo Import', 'blogtory' ) ),
                ),
				'five' => array(
					'title'       => esc_html__( 'Theme Preview', 'blogtory' ),
					'icon'        => 'dashicons dashicons-welcome-view-site',
					'description' => esc_html__( 'You can check out the theme demos for reference to find out what you can achieve using the theme and how it can be customized.', 'blogtory' ),
					'button_text' => esc_html__( 'View Demo', 'blogtory' ),
					'button_url'  => 'https://preview.unfoldwp.com/blogtory/',
					'button_type' => 'link',
					'is_new_tab'  => true,
                ),
                'six' => array(
                    'title'       => esc_html__( 'Contact Support', 'blogtory' ),
                    'icon'        => 'dashicons dashicons-sos',
                    'description' => esc_html__( 'Got theme support question or found bug or got some feedbacks? Best place to ask your query is the dedicated Support forum for the theme.', 'blogtory' ),
                    'button_text' => esc_html__( 'Contact Support', 'blogtory' ),
                    'button_url'  => 'https://unfoldwp.com/support/',
                    'button_type' => 'link',
                    'is_new_tab'  => true,
                ),
            ),

			// Useful plugins.
			'useful_plugins' => array(
				'description' => esc_html__( 'Theme supports some helpful WordPress plugins to enhance your site. But, please enable only those plugins which you need in your site. For example, enable WooCommerce only if you are using e-commerce.', 'blogtory' ),
            ),

        );

        Blogtory_About::init( $config );
	}

endif;

add_action( 'after_setup_theme', 'blogtory_about_setup' );
