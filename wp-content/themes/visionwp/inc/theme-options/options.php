<?php
/**
 * Theme Options
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */
visionwp_require(array( 
    'theme-options/header/menu-options',
    'theme-options/header/button-options',
    'theme-options/header/general-options',
    'theme-options/header/site-identity',
    'theme-options/header/top-header-options',
    'theme-options/theme-options/layout-options',
    'theme-options/theme-options/breadcrumb-options',
    'theme-options/theme-options/theme-typography',
    'theme-options/theme-options/footer-options',
    'theme-options/theme-options/layout-options',
    'theme-options/theme-options/general-options',
    'theme-options/theme-options/post-options',
    'theme-options/theme-options/reset-options',
    'theme-options/goto-pro/goto-pro',
), 'inc' );

if( !class_exists( 'VisionWP_Options' ) ) {
	class VisionWP_Options extends VisionWP_Kirki {

        protected static $instance = null;

        public $config = 'visionwp';

        public function __construct() {

            parent::__construct( $this->config, array(
                'vision_wp' => array(
                    'title'    => esc_html__( 'Header Options', 'visionwp' ),
                    'priority' => 1,
                    'section'  => apply_filters( 'visionwp_customizer_header_panel', [] ),
                ),
                'visionwp_theme_options' => array(
                    'title' => esc_html__( 'Theme Options', 'visionwp' ),
                    'priority'  => 5,
                    'section'   => apply_filters( 'visionwp_customizer_theme_panel', [] ),
                )
            ));

            new VisionWP_Scripts(array(
                array(
                    'handle' => 'customizer-script',
                    'script'  => 'assets/js/customizer.js',
                ),
            ), 'customize_controls_enqueue_scripts' );
        }

        /**
         * Returns the *Singleton* instance of this class.
         */
        public static function get_instance() {
            if ( null === self::$instance ) {
                self::$instance = new self();
            }
            return self::$instance;
        }
    }
}

VisionWP_Options::get_instance();

if( !function_exists( 'visionwp_get' ) ) {
    function visionwp_get( $id ) {
        return VisionWP_Options::get_instance()->get( $id );
    }
}