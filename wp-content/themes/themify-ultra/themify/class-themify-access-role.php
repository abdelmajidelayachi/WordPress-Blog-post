<?php

if( ! class_exists( 'Themify_Access_Role' ) ) :
class Themify_Access_Role {

	public static function init(){
		add_filter( 'themify_theme_config_setup', array( __CLASS__, 'config_setup' ), 14 );
		add_filter( 'admin_init', array( __CLASS__, 'tf_themify_hide_customizer' ), 99 );
		add_filter( 'themify_builder_is_frontend_editor', array( __CLASS__, 'tf_themify_hide_builder_frontend' ), 99 );
		add_filter( 'themify_metabox/fields/themify-meta-boxes', array( __CLASS__, 'tf_themify_hide_custom_panel_and_backend_builder' ), 999 );
	}

	/**
	 * Renders the options for role access control
	 *
	 * @param array $data
	 * @return string
	 */
	public static function config_view( $data = array() ){
		global $wp_roles;
		$roles = $wp_roles->get_names();
		// Remove the adminitrator and subscriber user role from the array
		unset( $roles['administrator'],$roles['subscriber'] );

		// Get the unique setting name
		$setting = $data['attr']['setting'];

		// Generate prefix with the setting name
		$prefix = 'setting-'.$setting.'-';

		ob_start();
		if ( 'custom_panel' === $setting ) :
			?>
			<div class="themify-info-link"><?php _e( 'Role access allow certain user roles to have access to the tool. Only set disable if you want to disallow the tool to certain user(s), otherwise keep everything as default.', 'themify' ); ?></div>
			<?php
		endif;
		?>
		<ul>
		<?php foreach( $roles as $role => $slug ) {
						$prefix_role = esc_attr($prefix.$role);
			// Get value from the database
			$value = themify_builder_get( $prefix_role,$prefix_role);

			// Check if the user has not saved any setting till now, if so, set the 'default' as value
			$value = ( null !== $value ) ? $value : 'default';
						
			?>
			<li class="role-access-controller">
				<!-- Set the column title -->
				<div class="role-title">
					<?php echo $slug; ?>
				</div>

				<!-- Set option to default -->
				<div class="role-option role-default">
					<input type="radio" id="default-<?php echo $prefix_role; ?>" name="<?php echo $prefix_role; ?>" value="default" <?php echo checked( $value, 'default', false ); ?>/>
					<label for="default-<?php echo $prefix_role; ?>"><?php _e( 'Default', 'themify' ); ?></label>
				</div>

				<!-- Set option to enable -->
				<div class="role-option role-enable">
					<input type="radio" id="enable-<?php echo $prefix_role; ?>" name="<?php echo $prefix_role; ?>" value="enable" <?php echo checked( $value, 'enable', false ); ?>/>
					<label for="enable-<?php echo $prefix_role; ?>"><?php _e( 'Enable', 'themify' ); ?></label>
				</div>

				<!-- Set option to disable -->
				<div class="role-option role-disable">
					<input type="radio" id="disable-<?php echo $prefix_role; ?>" name="<?php echo $prefix_role; ?>" value="disable" <?php echo checked( $value, 'disable', false ); ?>/>
					<label for="disable-<?php echo $prefix_role; ?>"><?php _e( 'Disable', 'themify' ); ?></label>
				</div>
		   </li>
		<?php }//end foreach ?>
		</ul>
		<?php
		return ob_get_clean();
	}

	/**
	 * Role Access Control
	 * @param array $themify_theme_config
	 * @return array
	 */
	public static function config_setup( $themify_theme_config ) {
		// Add role acceess control tab on settings page
		$themify_theme_config['panel']['settings']['tab']['role_access'] = array(
			'title' => __('Role Access', 'themify'),
			'id' => 'role_access',
			'custom-module' => array(
				array(
					'title' => __('Themify Custom Panel (In Post/Page Edit)', 'themify'),
					'function' => array( __CLASS__, 'config_view' ),
					'setting' => 'custom_panel'
				),
				array(
					'title' => __('Customizer', 'themify'),
					'function' => array( __CLASS__, 'config_view' ),
					'setting' => 'customizer'
				),
				array(
					'title' => __('Builder Backend', 'themify'),
					'function' => array( __CLASS__, 'config_view' ),
					'setting' => 'backend'
				),
				array(
					'title' => __('Builder Frontend', 'themify'),
					'function' => array( __CLASS__, 'config_view' ),
					'setting' => 'frontend'
				)
			)
		);

		return $themify_theme_config;
	}

	// Hide Themify Custom Panel and Backend Builder
	public static function tf_themify_hide_custom_panel_and_backend_builder( $meta ) {
		if( is_user_logged_in() ){
			$custom_panel = self::check_role_access('custom_panel');
			$backend_builder = self::check_role_access('backend');
			// Remove Page Builde if disabled from role access control
			if( 'disable' === $backend_builder || 'disable' === $custom_panel ){
				// Check each meta box for panels
				foreach( $meta as $key => $panel ) {
					// if page builder id found in meta boxes, unset it
					// Remove Custom Panel if disabled from role access control
					if ( ('disable' === $backend_builder && 'page-builder' === $panel['id'] ) ||('disable' === $custom_panel &&  'page-builder' !== $panel['id'])) {
						unset( $meta[ $key ] );
					}
				}
			}
		}
		return $meta;
	}

	//check if user has access to builder in backend
	public static function check_access_backend() {
		static $has_access = NULL; 
		if($has_access===null && is_user_logged_in() ){
			$has_access = 'disable' !== self::check_role_access('backend');
		}
		return $has_access;
	}
		
	private static function get_current_role(){
		static $user = null;
		if( $user === null ) {
			$user = wp_get_current_user();
			$roles = ! empty( $user->roles ) && is_array( $user->roles ) ? $user->roles : array();
			// Get first role ( don't use key )
			$user = array_shift( $roles );
		}
		return $user;
	}

	public static function tf_themify_hide_builder_frontend( $return ) {
		if( is_user_logged_in() ){
			$value = self::check_role_access('frontend');
			if ( in_array( $value, array( 'enable', 'disable' ),true ) ) {
				$value='enable' === $value;
				if(get_option('user_has_tb_frontend')!=$value){
					update_option( 'user_has_tb_frontend', $value,false );
				}
				return $value;
			} elseif( current_user_can( 'edit_posts', get_the_ID() ) ){
				if(get_option('user_has_tb_frontend')!=$return){
					update_option( 'user_has_tb_frontend', $return,false );
				}
				return $return;
			}
		}
	}

	// Hide Themify Builder Customizer
	public static function tf_themify_hide_customizer( $data ) {
		if( is_user_logged_in() ){
			$is_available = current_user_can('customize');
			$value = self::check_role_access('customizer');
			// get the the role object
			$editor = get_role(self::get_current_role());
			if ( 'enable' === $value && !$is_available) {
				// add $cap capability to this role object
				$editor->add_cap('edit_theme_options');
			} elseif( 'disable' === $value &&  $is_available) {
				$editor->remove_cap('edit_theme_options');
			}
		}

		return $data;
	}

	public static function check_role_access($key){
		$setting = 'setting-'.$key.'-'.self::get_current_role();
		return themify_builder_get( $setting, $setting,true );
	}
}

Themify_Access_Role::init();
endif;
