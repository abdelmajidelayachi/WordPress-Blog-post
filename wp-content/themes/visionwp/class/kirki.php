<?php
/**
 * Wrapper class for kirki customizer framework
 * 
 * @since 1.0.0
 * @link https://kirki.org/
 * @package VisionWP WordPress Theme WordPress ThemeWordPress Theme WordPress
 */
if( !class_exists( 'VisionWP_Kirki' ) ) {
	class VisionWP_Kirki{

		public $config_id = '';
		public $options   = [];
		public $settings  = [];
		public $defaults  = [];

		public function __construct( $config_id, $options ) {

			$this->config_id = $config_id;
			$this->options   = $options;
			if( class_exists( 'Kirki' ) ) {
				Kirki::add_config( $config_id, array(
					'capability'    => 'edit_theme_options',
					'option_type'   => 'theme_mod',
				) );
			}

			add_action( 'init', array( $this, 'init' ) );
			add_action( 'wp_ajax_customizer_reset', array( $this, 'ajax_customizer_reset' ) );
		}

		/**
		 * Ajax control
		 * @since 1.0.0
		 * @package VisionWP WordPress Theme
		 */

		public function ajax_customizer_reset() {
		    
		    if ( ! check_ajax_referer( 'visionwp-reset-nonce', 'nonce', false ) ) {
		        wp_send_json_error( 'invalid_nonce' );
		    }

		    $this->settings[] = 'header_textcolor';
		    $this->settings[] = 'background_color';
		   
		    # remove theme_mod settings registered in customizer
		    foreach ( $this->settings as $setting ) {
		        remove_theme_mod( $setting );
		    }

		    wp_send_json_success();
		}

		public function init() {

			foreach( $this->options as $panel_id => $panel ) {

				$this->add_panel( $panel_id, $panel );

				foreach( $panel[ 'section' ] as $section_id => $section ) {

					$section[ 'panel' ] = $panel_id;
					$this->add_section( $section_id, $section );
					
					foreach( $section[ 'fields' ] as $field_id => $field ) {
						$this->settings[] = $field_id;
						if( is_array( $field ) ){
							$field[ 'settings' ] = $field_id;
							$field[ 'section' ]  = $section_id;
							$this->defaults[ $field_id ] = isset( $field[ 'default' ] ) ? $field[ 'default' ] : null;
							if( isset( $field[ 'partial' ] ) ){
								$field[ 'partial_refresh' ][ $field_id ] = array(
									'selector' => $field[ 'partial' ][ 'selector' ],
									'render_callback' => array( $this, 'render_partial' ),
								);

								unset( $field[ 'partial' ] );
							}
							$this->add_field( $field );
						}
					}
				}
			}
		}

		public function render_partial( $object ){
			echo esc_html( visionwp_get( $object->id ) );
		}

		public function add_panel( $panel_id, $panel ) {
			if( class_exists( 'Kirki' ) ) {
				Kirki::add_panel( $panel_id, $panel );
			}
		}

		public function add_section( $section_id, $section ) {
			if( class_exists( 'Kirki' ) ) {
				Kirki::add_section( $section_id, $section );
			}
		}

		public function add_field( $field ) {
			if( class_exists( 'Kirki' ) ) {
				Kirki::add_field( $this->config_id, $field );
			}
		}

		public function get( $id ) {

			if( !class_exists( 'Kirki' ) ) {
				# return default value
				return isset( $this->defaults[ $id ] ) ? $this->defaults[ $id ] : null;
			}

			return Kirki::get_option( $this->config_id, $id );
		}
	}
}