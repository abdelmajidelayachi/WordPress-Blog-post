<?php
/**
 * Main class to check pro
 * @since 1.0.2
 * @package Visionwp WordPress Theme
 */
if( !class_exists( 'VisionWP_Pro_Check' ) ) {
	class VisionWP_Pro_Check{

		public static $rise_blocks_pro_path = 'rise-blocks-pro/rise-blocks-pro.php';
		public static $rt_easy_builder_pro_path = 'rt-easy-builder-premium/rt-easy-builder.php';
		
		public function __construct() {
			$is_installed = self::is_plugin_installed();
			$is_activated = self::is_plugin_activated();

			if( $is_installed ){
				add_action( 'admin_notices', array( __CLASS__, 'display_activate_notice' ), 20 );	
			}
		}

		/**
		 * Check Plugin present or not
		 * @since 1.0.2
		 * @package Visionwp WordPress Theme
		 */

		public static function is_plugin_installed(){
			if ( ! function_exists( 'get_plugins' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}

			$all_plugins = get_plugins();

			if ( !empty( $all_plugins[ self::$rise_blocks_pro_path ] ) || !empty( $all_plugins[ self::$rt_easy_builder_pro_path ] ) ) {
				return true;
			}else{
				return false;
			}
		}

		/**
		 * Check Activated or not
		 * @since 1.0.2
		 * @package Visionwp WordPress Theme
		 */
		public static function is_plugin_activated(){
			if( is_multisite() ){
				return is_plugin_active_for_network( self::$rise_blocks_pro_path );
			}else{
				$all_active_plugins = get_option('active_plugins');
				if( in_array( self::$rise_blocks_pro_path, $all_active_plugins ) || in_array( self::$rt_easy_builder_pro_path, $all_active_plugins ) ){
					return true;
				}
				return false;
			}
		}

		/**
		 * Display Plugin Activate notice
		 * @since 1.0.2
		 * @package Visionwp WordPress Theme
		 *
		 */
		public static function display_activate_notice(){
			$all_active_plugins = get_option('active_plugins');
			$all_plugins = get_plugins();

			$rise_installed = !empty( $all_plugins[ self::$rise_blocks_pro_path ] );
			$rt_builder_installed = !empty( $all_plugins[ self::$rt_easy_builder_pro_path ] );

			$rise_active = in_array( self::$rise_blocks_pro_path, $all_active_plugins );
			$rt_builder_active = in_array( self::$rt_easy_builder_pro_path, $all_active_plugins );

			if( $rise_active && $rt_builder_active ){
				return;
			}
			
			if( ( $rise_installed && !$rise_active ) && ( $rt_builder_installed && !$rt_builder_active ) ){
				$name = esc_html__( 'Rise Blocks Pro And RT Easy Builder Pro - Advanced addons for Elementor Agency', 'visionwp' );
				$multiple = true;
			}else{
				if( !$rt_builder_active ){
					$name = esc_html__( 'RT Easy Builder Pro - Advanced addons for Elementor Agency', 'visionwp' );
					$multiple = false;
				}elseif( !$rise_active ){
					$name = esc_html__( 'Rise Blocks Pro', 'visionwp' );
					$multiple = false;
				}
			}

			?>
			<div class="notice notice-info is-dismissible visionwp-notice-wrapper">
			    <div class="visionwp-activate-notice">
					<div class="visionwp-notice-content">
						<p>
							<?php 
								printf( '<p><b>%s</b> %s %s %s %s %s</p>', 
									$name,
									$multiple ? esc_html__( 'plugins', 'visionwp') : esc_html__( 'plugin', 'visionwp'),
									$multiple ? esc_html__( 'are', 'visionwp') : esc_html__( 'is', 'visionwp'),
									esc_html__( 'currently inactive. Please Activate ', 'visionwp' ),
									$multiple ? esc_html__( 'them', 'visionwp' ) : esc_html__( 'it', 'visionwp' ),
									esc_html__( 'to use premium features.', 'visionwp' )
								);
							?>
						</p>
					</div>
				</div>
			</div>
		<?php }
	}
}

new VisionWP_Pro_Check();