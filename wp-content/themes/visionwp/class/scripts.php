<?php
/**
 * Wrapper class for enqueueing scripts and styles
 * @since 1.0.0
 * @link https://developer.wordpress.org/reference/functions/wp_enqueue_script/
 * @link https://developer.wordpress.org/reference/functions/wp_enqueue_style/
 * @package VisionWP WordPress Theme WordPress ThemeWordPress Theme
 */
if( !class_exists( 'VisionWP_Scripts' ) ) {
	class VisionWP_Scripts {

		public $scripts = array();

		public function __construct( $scripts, $hook = 'wp_enqueue_scripts' ) {
			$this->scripts = $scripts;
			add_action( $hook, array( $this, 'enqueue' ) );
		}

		public function enqueue() {
			foreach( $this->scripts as $script ) {

				if( isset( $script[ 'handle' ] ) ) {

					$this->script = $script;
					if( isset( $script[ 'style' ] ) ) {
						$this->enqueue_style();
					}

					if( isset( $script[ 'script' ] ) ) {
						$this->enqueue_script();
					}
				}
			}
		}

		public function get_uri( $type = 'style' ) {
			$src = $this->script[ $type ];
			return isset( $this->script[ 'absolute' ] ) ? $src : get_theme_file_uri( $src );
		}

		public function get_version() {
			return isset( $this->script[ 'version' ] ) ? $this->script[ 'version' ] : false;
		}

		public function get_dependency() {
			return isset( $this->script[ 'dependency' ] ) ? $this->script[ 'dependency' ] : [];
		}

		public function enqueue_style() {
			$dependency = isset( $this->script[ 'dependency' ] ) ? $this->script[ 'dependency' ] : [];
			wp_enqueue_style( $this->script[ 'handle' ], $this->get_uri(), $this->get_dependency(), $this->get_version() );
		}

		public function enqueue_script() {

			$dependency = isset( $this->script[ 'dependency' ] ) ? $this->script[ 'dependency' ] : [ 'jquery' ];
			$in_footer = isset( $this->script[ 'footer' ] ) ? isset( $this->script[ 'footer' ] ) : false;

			wp_enqueue_script( $this->script[ 'handle' ], $this->get_uri( 'script' ), $dependency, $this->get_version(), $in_footer );

			if ( isset( $this->script[ 'localize' ] ) && count( $this->script[ 'localize' ] ) > 0 ) {
				wp_localize_script( 
					$this->script[ 'handle' ], 
					$this->script[ 'localize' ][ 'key' ], 
					$this->script[ 'localize' ][ 'data' ] 
				);
			}
		}
	}
}