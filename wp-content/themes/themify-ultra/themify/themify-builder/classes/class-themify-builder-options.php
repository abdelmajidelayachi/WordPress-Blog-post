<?php

if ( ! class_exists( 'Themify_Builder_Options' ) ) :
/**
 * Class Builder Options
 */
class Themify_Builder_Options {

	const KEY = 'themify_builder_setting';
	const SLUG = 'themify-builder';
	protected $option_value = array();
	protected $current_tab = '';

	/**
	 * Constructor
	 */
	public function __construct() {
		if ( is_admin() ){
			add_action( 'admin_menu', array( $this, 'add_plugin_page' ) );
			add_action( 'admin_init', array( $this, 'page_init' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'load_enqueue_scripts' ) );
		}
		else{
			add_action( 'wp_head', array( $this, 'show_custom_css' ) );
		}
		add_filter( 'themify_top_pages', array( $this, 'queue_top_pages' ) );
		add_filter( 'themify_pagenow', array( $this, 'queue_pagenow' ) );
	}

	public function add_plugin_page(){
		if( Themify_Builder_Model::hasAccess() ){
            $can_manage_option = current_user_can( 'manage_options' );
			// This page will be under "Settings"
			$name = __( 'Themify Builder', 'themify' );
			add_menu_page( $name, $name, 'edit_posts', self::SLUG,$can_manage_option?array( $this, 'create_admin_page'):'' , plugins_url( THEMIFY_BUILDER_NAME.'/themify/img/favicon.png' ), 50 );
            if($can_manage_option){
                add_submenu_page( self::SLUG, __( 'Settings', 'themify' ), __( 'Settings', 'themify' ), 'manage_options', self::SLUG );
            }

			if (Themify_Builder_Model::builder_check()) {

				add_submenu_page ( 'themify-builder', __( 'Saved Layouts', 'themify' ), __( 'Saved Layouts', 'themify' ), 'edit_posts', 'edit.php?post_type='.Themify_Builder_Layouts::LAYOUT_SLUG );
				add_submenu_page( 'themify-builder', __( 'Layout Parts', 'themify' ), __( 'Layout Parts', 'themify' ), 'edit_posts', 'edit.php?post_type='.Themify_Builder_Layouts::LAYOUT_PART_SLUG );
				add_submenu_page ( 'themify-builder', __( 'Global Styles', 'themify' ), __( 'Global Styles', 'themify' ), 'edit_posts', 'themify-global-styles', array( $this, 'global_styles_page' ) );
				add_submenu_page( 'themify-builder', __( 'Custom Fonts', 'themify' ), __( 'Custom Fonts', 'themify' ), 'edit_posts', 'edit.php?post_type='.Themify_Custom_Fonts::SLUG );

			}
            if(!$can_manage_option){
                remove_submenu_page(self::SLUG,self::SLUG);
            }

		}
	}

	/**
	 * Display Builder Styles page content
	 * @return String
	 * @since 4.5.0
	 */
	function global_styles_page(){

		if ( ! current_user_can( 'edit_posts' ) )
			wp_die( __( 'You do not have sufficient permissions to update this site.', 'themify' ) );

		return Themify_Global_Styles::page_content();
	}

	function redirect(){
		if(!empty($_GET['page'])){
			wp_redirect('edit.php?post_type='.$_GET['page']);
		}
	}

	public function create_admin_page() {
		$this->option_value = get_option( self::KEY );

		if ( isset( $_GET['action'] ) ) {
			$action = 'upgrade';
			themify_builder_updater();
		}

		?>
		<div class="wrap">
			<h2><?php _e('Themify Builder', 'themify') ?></h2>

			<form method="post" action="options.php">
				<div class="icon32" id="icon-options-general"><br /></div><h2 class="nav-tab-wrapper themify-nav-tab-wrapper">
					<input type="hidden" name="<?php echo esc_attr( self::KEY ); ?>[tabs_active]" value="<?php echo esc_attr( $this->current_tab ); ?>">
					<?php
					$tabs = array(
						'builder' => __( 'Settings', 'themify' ),
						'performance' => __( 'Performance', 'themify' ),
						'role_access' => __( 'Role Access', 'themify' ),
						'image_setting' => __( 'Image Script', 'themify' ),
						'custom_css' => __('Custom CSS', 'themify'),
						'builder_settings'=>__('Integration API','themify')
					);
					if ( Themify_Builder_Model::builder_check() ) {
						$tabs += array(
							'tools'=>__('Tools','themify')
						);
					}
					$tabs = apply_filters('themify_builder_settings_tab_array', $tabs);

					foreach ( $tabs as $name => $label ) {
						echo '<a href="' . admin_url( 'admin.php?page=' . self::SLUG. '&tab=' . $name ) . '" class="nav-tab ';
						if( $this->current_tab === $name ) echo 'nav-tab-active';
						echo '">' . $label . '</a>';
					}
					?>
				</h2>
				<?php
				// This prints out all hidden setting fields
				settings_fields( 'themify_builder_option_group' );
				do_settings_sections( self::SLUG );
				?>
				<?php
				if($this->current_tab!=='builder_upgrade'){
					submit_button();
				}
				else{
					include( THEMIFY_BUILDER_DIR . '/about.php' );
					?>
					<a class="button button-primary" href="//themify.me/builder" target="_blank"><?php _e('Upgrade Builder','themify')?></a>
					<?php
				}
				?>
			</form>

			<!-- alerts -->
			<div class="tb_alert"></div>
			<!-- /alerts -->

			<script>
				function switch_image_field() {
					var img_field =jQuery('.img_field').closest('tr'),
						size = jQuery('.image_global_size_field').closest('tr');
					if(!jQuery('.disable_img_php').is(':checked')) {
						size.hide();
						img_field.show();
					} else {
						size.show();
						img_field.hide();
					}
				}
				switch_image_field();
				jQuery('.disable_img_php').on('click', switch_image_field);
			</script>
		</div>
		<?php
	}

	function lazy_load() {
		$name = $this->current_tab . '-disable-lazy';
		$field_name = self::KEY . '['.$name.']';
		$checked = isset($this->option_value[$name]) ? $this->option_value[$name] : '';
		echo '<input id="themify_setting-disable-lazy" type="checkbox" name="'.$field_name.'" class="" value="1" '.checked( $checked, 1, false ).'/>',
			'<label for="themify_setting-disable-lazy">&nbsp; '.__('Disable Lazy Load',
				'themify').'</label>';

		echo '<br>';

		$name = $this->current_tab . '-disable-lazy-native';
		$field_name = self::KEY . '['.$name.']';
		$checked = isset($this->option_value[$name]) ? $this->option_value[$name] : '';
		echo '<input id="themify_setting-disable-lazy-native" type="checkbox" name="'.$field_name.'" class="" value="1" '.checked( $checked, 1, false ).'/>',
			'<label for="themify_setting-disable-lazy-native">&nbsp; '.__('Use native lazy load',
				'themify').'</label>';
	}

	function minify() {
		$name = $this->current_tab . '-script_minification-min';
		$field_name = self::KEY . '['.$name.']';
		$checked = isset($this->option_value[$name]) ? $this->option_value[$name] : '';
		echo '<input id="themify_setting-script_minification-min" type="checkbox" name="'.$field_name.'" class="" value="1" '.checked( $checked, 1, false ).'/>',
			'<label for="themify_setting-script_minification-min">&nbsp; '.__('Disable minified scripts (css/js files)',
				'themify').'</label>';
	}

	function gzip() {
		$htaccess_file = Themify_Enqueue_Assets::getHtaccessFile();
		$disabled = ' disabled';
		if ( Themify_Filesystem::is_file( $htaccess_file ) && Themify_Filesystem::is_writable( $htaccess_file ) ) {
			$disabled = '';
		}
		$name = $this->current_tab . '-cache_gzip';
		$field_name = self::KEY . '['.$name.']';
		$checked = isset($this->option_value[$name]) ? $this->option_value[$name] : '';
		echo '<input id="themify_setting-cache_gzip" type="checkbox" name="'.$field_name.'" class="" value="1" '.checked( $checked, 1, false ) . $disabled .' />',
			'<label for="themify_setting-cache_gzip">&nbsp; '.__('Enable Gzip scripts (recommended)',
				'themify').'</label>';
		if ( empty( $disabled ) ) {
			echo '<p class="description">' . sprintf( __( 'Enabling Gzip will add code to your .htaccess file (%s)', 'themify' ), $htaccess_file ) . '</p>';
		} else {
			echo '<p class="description">' . __( 'The htaccess file %s isn`t writable. Please allow to write to enable this feauture','themify' ) . '</p>';
		}
	}

	function jquery_migrate() {
		$name = $this->current_tab . '-jquery_migrate';
		$field_name = self::KEY . '['.$name.']';
		$checked = isset($this->option_value[$name]) ? $this->option_value[$name] : '';
		echo '<input id="themify_setting-jquery_migrate" type="checkbox" name="'.$field_name.'" class="" value="1" '.checked( $checked, 1, false ) . ' />',
			'<label for="themify_setting-jquery_migrate">&nbsp; '.__('Enable jQuery Migrate script',
				'themify').'</label>';
		echo '<p class="description">' . __( 'Enable this option if you have plugins that use deprecated jQuery versions.','themify' ) . '</p>';
	}

	function webp() {
		$disabled = '';
		if ( ! _wp_image_editor_choose() ) {
			$disabled = ' disabled';
		}
		$name = $this->current_tab . '-webp';
		$field_name = self::KEY . '['.$name.']';
		$checked = isset($this->option_value[$name]) ? $this->option_value[$name] : '';
		echo '<input id="themify_setting-webp" type="checkbox" name="'.$field_name.'" class="" value="1" '.checked( $checked, 1, false ) .  $disabled . ' />',
			'<label for="themify_setting-webp">&nbsp; '.__('Enable WebP image (recommended)',
				'themify').'</label>';
		echo '<br>';
		if ( ! empty( $disabled ) ) {
			echo '<p class="description">' . __( 'The GD library or Imagick extensions are not installed. Ask your host provider to enable them to use this feature.', 'themify' ) . '</p>';
		}
	}

	function webp_quality() {
		$disabled = '';
		if (  ! _wp_image_editor_choose()  ) {
			$disabled = ' disabled';
		}
		$name = $this->current_tab . '-webp_quality';
		$field_name = self::KEY . '['.$name.']';
		$webp_quality = (int) themify_builder_get( 'setting-webp-quality', 'performance-webp_quality' );
		if ( empty( $webp_quality ) ) {
			$webp_quality = 5;
		}
		echo '<select' . ( $disabled ? ' disabled="disabled"' : '' ) . ' id="setting-webp-quality" name="' . $field_name . '">'
			. '<option value="1" ' . selected( $webp_quality, 1, false ) . '>' . __( 'Lowest', 'themify' ) . '</option>'
			. '<option value="2" ' . selected( $webp_quality, 2, false ) . '>' . __( 'Low', 'themify' ) . '</option>'
			. '<option value="3" ' . selected( $webp_quality, 3, false ) . '>' . __( 'Medium', 'themify' ) . '</option>'
			. '<option value="4" ' . selected( $webp_quality, 4, false ) . '>' . __( 'Good', 'themify' ) . '</option>'
			. '<option value="5" ' . selected( $webp_quality, 5, false ) . '>' . __( 'High', 'themify' ) . '</option>'
			. '<option value="6" ' . selected( $webp_quality, 6, false ) . '>' . __( 'Highest', 'themify' ) . '</option>'
		. '</select>
		<p class="description">' . __( 'Lower quality has smaller file size, but image might appear pixelated/blurry.', 'themify' ) . '</p>';

		echo '<br/><a href="#" data-action="themify_clear_all_webp" data-clearing-text="'.__('Clearing...','themify').'" data-done-text="'.__('Done','themify').'" data-default-text="'.__('Clear WebP Images','themify').'" data-default-icon="ti-eraser" class="button button-outline js-clear-cache"><i class="ti-eraser"></i> <span>'.__('Clear WebP Images','themify').'</span></a>';
	}

	function concate() {
		echo '<a href="#" data-action="themify_clear_all_concate" data-send="all" data-clearing-text="'.__('Clearing...','themify').'" data-done-text="'.__('Done','themify').'" data-default-text="'.__('Clear Concate CSS Cache','themify').'" data-default-icon="ti-eraser" class="button button-outline js-clear-cache"><i class="ti-eraser"></i> <span>'.__('Clear Concate CSS Cache','themify').'</span></a>';
                if(!Themify_Enqueue_Assets::createDir()){
                    echo '<span class="pushlabel themify_warning">'.__('It looks like the WordPress upload folder path is set wrong or have file permission issue. Please check the upload path on WP Settings > Media. Make sure the folder is set correctly and it has correct file permission.','themify').'</span>';
		}
                elseif(is_multisite()){
                    echo '<br/><label class="pushlabel"><input type="checkbox" value="1" id="tmp_cache_concte_network" name="tmp_cache_concte_network"/>'.__('Clear Concate cache in the whole network site','themify').'</label>';
		}
	}

	public function page_init() {
		register_setting( 'themify_builder_option_group', self::KEY, array( $this, 'before_save' ) );
		$current_tab = ( empty( $_GET['tab'] ) ) ? 'builder' : sanitize_text_field( urldecode( $_GET['tab'] ) );
		$this->current_tab = $current_tab;

		switch ( $current_tab ) {
			case 'performance':
				add_settings_section(
					'setting_builder_performance',
					__( '', 'themify' ),
					'',
					self::SLUG
				);
				add_settings_field(
					'lazy_load',
					__('Disable Lazy Load', 'themify'),
					array( $this, 'lazy_load' ),
					self::SLUG,
					'setting_builder_performance'
				);
				add_settings_field(
					'minifiy',
					__('Minified Scripts', 'themify'),
					array( $this, 'minify' ),
					self::SLUG,
					'setting_builder_performance'
				);
				add_settings_field(
					'gzip',
					__('Gzip Scripts', 'themify'),
					array( $this, 'gzip' ),
					self::SLUG,
					'setting_builder_performance'
				);
				add_settings_field(
					'jquery-migrate',
					__('Enable jQuery Migrate', 'themify'),
					array( $this, 'jquery_migrate' ),
					self::SLUG,
					'setting_builder_performance'
				);
				add_settings_field(
					'webp',
					__('WebP Images', 'themify'),
					array( $this, 'webp' ),
					self::SLUG,
					'setting_builder_performance'
				);
				add_settings_field(
					'webp_quality',
					__('WebP Image Quality', 'themify'),
					array( $this, 'webp_quality' ),
					self::SLUG,
					'setting_builder_performance'
				);
				add_settings_field(
					'concate',
					__('Concate CSS', 'themify'),
					array( $this, 'concate' ),
					self::SLUG,
					'setting_builder_performance'
				);

				break;

			case 'image_setting':
				// image script settings
				add_settings_section(
					'setting_builder_image_section',
					__( 'Image Script Settings', 'themify' ),
					'',
					self::SLUG
				);

				add_settings_field(
					'image_script',
					__('Disable', 'themify'),
					array( $this, 'image_script_field' ),
					self::SLUG,
					'setting_builder_image_section'
				);

				add_settings_field(
					'image_global_size',
					__('Default Featured Image Size', 'themify'),
					array( $this, 'image_global_field' ),
					self::SLUG,
					'setting_builder_image_section'
				);

				break;

			case 'role_access':

				add_settings_section(
					'setting_builder_role_access_section',
					__( 'Role Access Settings', 'themify' ),
					'',
					self::SLUG
				);

				add_settings_field(
					'builder_backend',
					__( 'Builder Backend Access', 'themify' ),
					array( $this, 'role_access_fields' ),
					self::SLUG,
					'setting_builder_role_access_section',
					array( 'mode' => 'backend' )
				);

				add_settings_field(
					'builder_frontend',
					__( 'Builder Frontend Access', 'themify' ),
					array( $this, 'role_access_fields' ),
					self::SLUG,
					'setting_builder_role_access_section',
					array( 'mode' => 'frontend' )
				);

				break;

			case 'custom_css':
				// image script settings
				add_settings_section(
					'setting_builder_custom_css_section',
					__( 'Custom CSS', 'themify' ),
					'',
					self::SLUG
				);

				add_settings_field(
					'custom_css',
					false,
					array( $this, 'custom_css_field' ),
					self::SLUG,
					'setting_builder_custom_css_section'
				);
				break;
			case 'builder_settings':
				// image script settings
				add_settings_section(
					'setting_builder_settings_section',
					null,
					'',
					self::SLUG
				);

				add_settings_field(
					'twitter',
					__('Twitter API Keys','themify'),
					array( $this, 'twitter' ),
					self::SLUG,
					'setting_builder_settings_section'
				);
				add_settings_field(
					'google_map',
					__('Google Map Api Key','themify'),
					array( $this, 'google_map_api_key_field' ),
					self::SLUG,
					'setting_builder_settings_section'
				);
				add_settings_field(
					'bing_map',
					__('Bing Map Api Key','themify'),
					array( $this, 'bing_map_api_key_field' ),
					self::SLUG,
					'setting_builder_settings_section'
				);
				add_settings_field(
					'cloudflare',
					__('Cloudflare API','themify'),
					array( $this, 'cloudflare_field' ),
					self::SLUG,
					'setting_builder_settings_section'
				);
                add_settings_field(
                    'recaptcha',
                    __('reCaptcha API Settings','themify'),
                    array( $this, 'recaptcha_field' ),
                    self::SLUG,
                    'setting_builder_settings_section'
                );
				if ( Themify_Builder_Model::check_module_active( 'optin' ) ) {
					add_settings_field(
						'optin',
						__('Optin','themify'),
						array( $this, 'optin_field' ),
						self::SLUG,
						'setting_builder_settings_section'
					);
				}
				break;
			case 'tools':
				add_settings_section(
					'setting_builder_tools_section',
					__( 'Tools', 'themify' ),
					'',
					self::SLUG
				);
				add_settings_field(
					'regenerate_css',
					__('Regenerate CSS Files','themify'),
					array( $this, 'regenerate_css_field' ),
					self::SLUG,
					'setting_builder_tools_section'
				);
				add_settings_field(
					'replace_string',
					__('Find & Replace','themify'),
					array( $this, 'find_and_replace_field' ),
					self::SLUG,
					'setting_builder_tools_section'
				);
				add_settings_field(
					'builder_maintenance',
					__('Maintenance','themify'),
					array( $this, 'builder_maintenance_field' ),
					self::SLUG,
					'setting_builder_tools_section'
				);
				break;
			default:
				add_settings_section(
					'setting_builder_section',
					__( 'Builder Settings', 'themify' ),
					'',
					self::SLUG
				);

				add_settings_field(
					'builder_active',
					__( 'Themify Builder', 'themify' ),
					array( $this, 'builder_active_field' ),
					self::SLUG,
					'setting_builder_section'
				);

				if ( Themify_Builder_Model::builder_check() ) {

					add_settings_field(
						'builder_disable_tb',
						'',
						array( $this, 'builder_disable_posts' ),
						self::SLUG,
						'setting_builder_section'
					);

					add_settings_field(
						'builder_gallery_lightbox',
						__( 'Lightbox in Gallery module', 'themify' ),
						array( $this, 'builder_lightbox' ),
						self::SLUG,
						'setting_builder_section'
					);

					add_settings_field(
						'builder_shortcuts',
						__( 'Keyboard Shortcuts', 'themify' ),
						array( $this, 'builder_disable_shortcuts' ),
						self::SLUG,
						'setting_builder_section'
					);

					add_settings_field(
						'builder_disable_wp_editor',
						__( 'Disable WordPress Editor', 'themify' ),
						array( $this, 'builder_disable_wp_editor' ),
						self::SLUG,
						'setting_builder_section'
					);

					add_settings_field(
						'builder_google_fonts',
						__( 'Google Fonts List', 'themify' ),
						array( $this, 'builder_show_all_google_fonts' ),
						self::SLUG,
						'setting_builder_section'
					);


					add_settings_field(
						'builder_animation',
						__( 'Animation Effects', 'themify' ),
						array( $this, 'builder_animation_field' ),
						self::SLUG,
						'setting_builder_section'
					);

					add_settings_field(
						'builder_responsive',
						esc_html__( 'Responsive Breakpoints', 'themify' ),
						array( $this, 'builder_responsive_field' ),
						self::SLUG,
						'setting_builder_section'
					);

					add_settings_field(
						'builder_scrollTo',
						__( 'ScrollTo Offset', 'themify' ),
						array( $this, 'builder_scrollTo' ),
						self::SLUG,
						'setting_builder_section'
					);

					add_settings_field(
						'builder_scrollTo_speed',
						__( 'ScrollTo Speed', 'themify' ),
						array( $this, 'builder_scrollTo_speed' ),
						self::SLUG,
						'setting_builder_section'
					);

					add_settings_field(
						'builder_excludes',
						__( 'Builder Modules', 'themify' ),
						array( $this, 'builder_exclude_field' ),
						self::SLUG,
						'setting_builder_section'
					);
				}
				break;
		}

	}

	public function show_custom_css(){
		$settings = get_option( self::KEY );
		$custom_css = isset( $settings['custom_css-custom_css'] ) ? $settings['custom_css-custom_css'] : false;
		if ( $custom_css ){
			echo PHP_EOL . '<!-- Builder Custom Style -->' . PHP_EOL,
				'<style type="text/css">' . PHP_EOL,
				$custom_css . PHP_EOL,
				'</style>' . PHP_EOL . '<!-- / end builder custom style -->' . PHP_EOL;
		}
	}

	function before_save( $input ) {
		$active_tabs = $input['tabs_active'];
		$exist_data = get_option( self::KEY );
		$exist_data = is_array($exist_data) ? $exist_data : array();

		Themify_Enqueue_Assets::rewrite_htaccess( empty( $input['performance-cache_gzip'] ), empty( $input['performance-webp'] ) );
		foreach ( array( 'tablet_landscape', 'tablet', 'mobile' ) as $breakpoint ) {
			if ( isset( $input["builder_responsive_design_{$breakpoint}"], $exist_data["builder_responsive_design_{$breakpoint}"] ) && $input["builder_responsive_design_{$breakpoint}"] !== $exist_data["builder_responsive_design_{$breakpoint}"] ) {
				Themify_Builder_Stylesheet::regenerate_css_files();
				break;
			}
		}

		foreach($exist_data as $k => $v) {
			if ( strpos( $k, $active_tabs ) !== false ) {
				if($active_tabs==='builder' && strpos( $k, 'builder_settings' ) !== false){
					continue;
				}
				unset($exist_data[$k]);
			}
		}

		$all = array_merge($exist_data, $input);
		return $all;
	}

	function print_section_builder_info(){
		_e('Enable/Disable Themify Builder', 'themify');
	}

	function builder_active_field(){
		$selected = isset( $this->option_value[$this->current_tab.'_is_active'] ) ? $this->option_value[$this->current_tab.'_is_active'] : 'enable';
		?>
		<select class="tb_is_active" name="<?php echo esc_attr( self::KEY . '['.$this->current_tab.'_is_active]' ); ?>">
			<option value="enable" <?php selected( $selected, 'enable'); ?>><?php _e('Enable', 'themify') ?></option>
			<option value="disable" <?php selected( $selected, 'disable'); ?>><?php _e('Disable', 'themify') ?></option>
		</select>
		<p class="description" style="display:none" class="pushlabel" data-show-if-element=".tb_is_active" data-show-if-value="disable">
			<?php echo esc_html__( 'WARNING: When Builder is disabled, all Builder content/layout will not appear. They will re-appear once Builder is enabled.', 'themify' ) ?>
		</p>
		<?php
	}

	function builder_lightbox(){
		$selected = isset( $this->option_value[$this->current_tab.'_lightbox'] ) ? $this->option_value[$this->current_tab.'_lightbox'] : 'enable';
		?>
		<select class="tb_gallery_lightbox" name="<?php echo esc_attr( self::KEY . '['.$this->current_tab.'_lightbox]' ); ?>">
			<option value="enable" <?php selected( $selected, 'enable'); ?>><?php _e('Enable', 'themify') ?></option>
			<option value="disable" <?php selected( $selected, 'disable'); ?>><?php _e('Disable', 'themify') ?></option>
		</select>
		<?php
	}

	function builder_scrollTo() {
		$pre = $this->current_tab . '_';
		$out='<div>';
		$value =  isset( $this->option_value[$pre.'scrollTo'] )?$this->option_value[$pre.'scrollTo']:'';
		$out.=sprintf('<input type="number" value="%s" name="%s" min="0" max="5000" step="1" style="width: 60px" /><span>px</span>',
			$value,
			esc_attr( self::KEY . '[' . $pre . 'scrollTo' . ']' )
		);
		$out.='<br/><p class="description">'.__('Enter the top position where it should scrollTo','themify').'</p></div>';
		echo $out;
	}

	function builder_scrollTo_speed() {
		$pre = $this->current_tab . '_';
		$out='<div>';
		$value =  isset( $this->option_value[$pre.'scrollTo_speed'] )?$this->option_value[$pre.'scrollTo_speed']:'';
		$out.=sprintf('<input type="number" value="%s" name="%s" min="0" max="5000" step="1" style="width: 60px" /><span> '. __( 'Seconds', 'themify' ) .'</span>',
			$value,
			esc_attr( self::KEY . '[' . $pre . 'scrollTo_speed' . ']' )
		);
		$out.='<br/><p class="description">'.__('Speed of scrolling animation. Default: 0.9 second','themify').'</p></div>';
		echo $out;
	}

	function builder_exclude_field() {
		$modules = Themify_Builder_Model::get_modules( 'all' );

		foreach( $modules as $k => $v ) :
			$name = $this->current_tab . '_exclude_module_' . $k;
			$field_name = self::KEY . '['.$name.']';
			$mod_checked = isset($this->option_value[$name] ) ? $this->option_value[$name] : 0;
			?>
			<p>
				<input id="exclude_module_<?php echo $k; ?>" type="checkbox" value="1" name="<?php echo $field_name; ?>" <?php checked( $mod_checked, 1 ); ?>>
				<label for="exclude_module_<?php echo $k; ?>"><?php echo sprintf(__('Disable "%s" module', 'themify'), $v['name']); ?></label>
			</p>
		<?php
		endforeach;
	}

	/**
	 * Render checkbox to disable shortcuts.
	 *
	 * @since 5.1.0
	 * @access public
	 */
	function builder_disable_posts() {
		$pre = 'builder_disable_tb_';
		$out = '<div class="pushlabel" data-show-if-element=".tb_is_active" data-show-if-value="enable">';
		$excludes =array('tbuilder_layout', 'tbuilder_layout_part','tglobal_style');
		foreach( $GLOBALS['ThemifyBuilder']->builder_post_types_support() as $v ) {
			if(in_array($v,$excludes)){
				continue;
			}
			$out .= sprintf( '<p><label for="%s"><input type="checkbox" id="%s" name="%s"%s> %s</label></p>',
			$pre . $v ,
			$pre . $v ,
			self::KEY . '[' . $pre . $v . ']' ,
			checked( true, isset( $this->option_value[$pre.$v] ), false ),
			sprintf(__('Disable Builder on "%s" type', 'themify'), $v)
		);
		}
		$out .= '</div>';
		echo $out;
	}

	/**
	 * Render checkbox to disable shortcuts.
	 *
	 * @since 1.4.7
	 * @access public
	 */
	function builder_disable_shortcuts() {
		$pre = $this->current_tab . '_';
		$out = sprintf( '<p><label for="%s"><input type="checkbox" id="%s" name="%s"%s> %s</label></p>',
			$pre . 'disable_shortcuts' ,
			$pre . 'disable_shortcuts' ,
			self::KEY . '[' . $pre . 'disable_shortcuts' . ']' ,
			checked( true, isset( $this->option_value[$pre.'disable_shortcuts'] ), false ),
			wp_kses_post( __( 'Disable Builder shortcuts (eg. disable shortcut like Cmd+S = save)', 'themify') )
		);
		echo $out;
	}

	function builder_disable_wp_editor() {
		$key = $this->current_tab . '_disable_wp_editor';

		printf( '<p><label for="%1$s"><input type="checkbox" id="%1$s" name="%2$s"%3$s> %4$s</label></p>'
			, $key
			, self::KEY . '[' . $key . ']'
			, checked( true, isset( $this->option_value[$key] ), false )
			, wp_kses_post( __( 'Disable WordPress editor when Builder is in use', 'themify' ) )
		);
	}

	function builder_show_all_google_fonts() {
		$pre = $this->current_tab . '_';
		$current_value = !empty( $this->option_value[$pre . 'google_fonts'] ) ? $this->option_value[$pre . 'google_fonts'] : 'less';
		$out = sprintf( '<p><label><input type="radio" name="%1$s" value="less" %4$s>%2$s</label></p><p><label><input type="radio" name="%1$s" value="full" %5$s>%3$s</label></p>'
			, self::KEY . '[' . $pre . 'google_fonts' . ']'
			, __( 'Show recommended Google Fonts only', 'themify' )
			, __( 'Show all Google Fonts (showing all fonts will take longer to load)', 'themify' )
			, checked( 'less', $current_value, false )
			, checked( 'full', $current_value, false ) );

		echo $out;
	}

	function builder_animation_field() {
		$pre = $this->current_tab . '_animation_';


		$output = sprintf('<p><label for="%s" class="label">%s</label><br><select id="%s" name="%s">%s</select></p>',
			$pre . 'appearance' ,
			esc_html__( 'Appearance Animation', 'themify' ),
			$pre . 'appearance' ,
			self::KEY . '[' .$pre . 'appearance]' ,
			sprintf( '<option value="none" %s></option>'
				, selected( !empty( $this->option_value[$pre . 'appearance'] )
					? $this->option_value[$pre . 'appearance'] : '', '', false ) ) .
			sprintf( '<option value="mobile" %s>%s</option>'
				, selected( !empty( $this->option_value[$pre . 'appearance'] )
					? $this->option_value[$pre . 'appearance'] : '', 'mobile', false )
				, esc_html__( 'Disable on mobile & tablet', 'themify' ) ) .
			sprintf( '<option value="all" %s>%s</option>'
				, selected( !empty( $this->option_value[$pre . 'appearance'] )
					? $this->option_value[$pre . 'appearance'] : '', 'all', false )
				, esc_html__( 'Disable on all devices', 'themify' ) )
		);
		$output .= sprintf('<p><label for="%s" class="label">%s</label><br><select id="%s" name="%s">%s</select></p>',
			$pre . 'parallax_bg' ,
			esc_html__( 'Parallax Background', 'themify' ),
			$pre . 'parallax_bg' ,
			self::KEY . '[' .$pre . 'parallax_bg]' ,
			sprintf( '<option value="none" %s></option>'
				, selected( !empty( $this->option_value[$pre . 'parallax_bg'] )
					? $this->option_value[$pre . 'parallax_bg'] : '', '', false ) ) .
			sprintf( '<option value="mobile" %s>%s</option>'
				, selected( !empty( $this->option_value[$pre . 'parallax_bg'] )
					? $this->option_value[$pre . 'parallax_bg'] : '', 'mobile', false )
				, esc_html__( 'Disable on mobile & tablet', 'themify' ) ) .
			sprintf( '<option value="all" %s>%s</option>'
				, selected( !empty( $this->option_value[$pre . 'parallax_bg'] )
					? $this->option_value[$pre . 'parallax_bg'] : '', 'all', false )
				, esc_html__( 'Disable on all devices', 'themify' ) )
		);
		$output .= sprintf('<p><label for="%s" class="label">%s</label><br><select id="%s" name="%s">%s</select></p>',
			$pre . 'scroll_effect' ,
			esc_html__( 'Scroll Effects', 'themify' ),
			$pre . 'scroll_effect' ,
			self::KEY . '[' .$pre . 'scroll_effect]' ,
			sprintf( '<option value="none" %s></option>'
				, selected( !empty( $this->option_value[$pre . 'scroll_effect'] )
					? $this->option_value[$pre . 'scroll_effect'] : '', '', false ) ) .
			sprintf( '<option value="mobile" %s>%s</option>'
				, selected( isset( $this->option_value[$pre . 'scroll_effect'] )
					? $this->option_value[$pre . 'scroll_effect'] : '', 'mobile', false )
				, esc_html__( 'Disable on mobile & tablet', 'themify' ) ) .
			sprintf( '<option value="all" %s>%s</option>'
				, selected( !empty( $this->option_value[$pre . 'scroll_effect'] )
					? $this->option_value[$pre . 'scroll_effect'] : '', 'all', false )
				, esc_html__( 'Disable on all devices', 'themify' ) )
		);

		echo $output;
	}

	/**
	 * Responsive Design Fields.
	 *
	 * @access public
	 */
	public function builder_responsive_field() {
		$break_points = themify_get_breakpoints('',true);
		$pre = $this->current_tab . '_responsive_design_';
		$bp_tablet_landscape = ! empty( $this->option_value[ $pre . 'tablet_landscape'] )  ? $this->option_value[ $pre . 'tablet_landscape'] : $break_points['tablet_landscape'][1];
		$bp_tablet = ! empty( $this->option_value[ $pre . 'tablet'] ) ? $this->option_value[ $pre . 'tablet'] : $break_points['tablet'][1];
		$bp_mobile = ! empty( $this->option_value[ $pre . 'mobile'] )  ? $this->option_value[ $pre . 'mobile'] : $break_points['mobile'];

		$out = sprintf( '<div class="themify-ui-slider tf_clearfix"><div class="themify-slider-label label">%s</div><div class="label input-range width10"><div class="range-slider width8"></div><input type="text" name="%s" value="%s" data-min="%d" data-max="%d" class="width4"> px</div></div>',
			esc_html__( 'Tablet Landscape', 'themify' ),
			self::KEY . '[' . $pre . 'tablet_landscape' . ']',
			$bp_tablet_landscape,
			$break_points['tablet_landscape'][0],
			$break_points['tablet_landscape'][1],
			$bp_tablet_landscape
		);
		$out .= sprintf( '<div class="themify-ui-slider tf_clearfix"><div class="themify-slider-label label">%s</div><div class="label input-range width10"><div class="range-slider width8"></div><input type="text" name="%s" value="%s" data-min="%d" data-max="%d" class="width4"> px</div></div>',
			esc_html__( 'Tablet Portrait', 'themify' ),
			self::KEY . '[' . $pre . 'tablet' . ']',
			$bp_tablet,
			$break_points['tablet'][0],
			$break_points['tablet'][1],
			$bp_tablet
		);
		$out .= sprintf( '<div class="themify-ui-slider tf_clearfix"><div class="themify-slider-label label">%s</div><div class="label input-range width10"><div class="range-slider width8"></div><input type="text" name="%s" value="%s" data-min="%d" data-max="%d" class="width4"> px</div></div>',
			esc_html__( 'Mobile', 'themify' ),
			self::KEY . '[' . $pre . 'mobile' . ']',
			$bp_mobile,
			320,
			$break_points['mobile'],
			$bp_mobile
		);
		echo $out;
	}

	function image_script_field() {
		$name = $this->current_tab . '-img_settings_use';
		$field_name = self::KEY . '['.$name.']';
		$checked = isset($this->option_value[$name]) ? $this->option_value[$name] : '';
		$disable = '';
		$imaging_library = _wp_image_editor_choose();
		$imaging_library_error = '';
		if ( ! $imaging_library ) {
			$disable = ' style="pointer-events: none;"';
			$imaging_library_error = '<p class="description">' . sprintf( __( 'This feature requires an <a href="%s">image processing library</a> to be installed on the server. Please contact your hosting provider to enable this.', 'themify' ), 'https://www.php.net/manual/en/refs.utilspec.image.php' ) . '</p>';
			$checked = 1;
		}
		echo '
			<label for="themify_setting-img_settings_use"' . $disable . '>
				<input id="themify_setting-img_settings_use" type="checkbox" name="'.$field_name.'" class="disable_img_php" value="1" '.checked( $checked, 1, false ).'/>'
				. __('Disable image script globally', 'themify' )
			. '</label>'
			. $imaging_library_error
			. '<p class="description">'.__('WordPress Featured Image or original images will be used.', 'themify').'</p>';
	}

	function image_global_field() {
		$feature_sizes = themify_get_image_sizes_list();

		$name = $this->current_tab.'-global_feature_size';
		$field_name = self::KEY . '['.$name.']';
		$selected = isset($this->option_value[$name]) ? $this->option_value[$name] : '';
		echo '<select name="'.$field_name.'" class="image_global_size_field">';
		foreach($feature_sizes as $option){
			echo '<option value="' . $option['value'] . '"'.selected( $selected, $option['value'] ).'>' . esc_html( $option['name'] ) . '</option>';
		}
		echo '</select>';
	}

	function role_access_fields( $atts ) {
		global $wp_roles;

		$prefix = 'setting-' . $atts[ 'mode' ] . '-';
		$roles = $wp_roles->get_names();
		$role_options = array(
			'default' => __( 'Default', 'themify' ),
			'enable' => __( 'Enable', 'themify' ),
			'disable' => __( 'Disable', 'themify' )
		);

		// Remove the adminitrator and subscriber user role from the array
		unset( $roles['administrator']);

		// Remove all the user roles with no "edit_posts" capability
		foreach( $roles as $role => $slug ) {
			if( empty( $wp_roles->roles[$role]['capabilities']['edit_posts'] ) ){
				unset( $roles[$role] );
			}
		}

		echo '<ul>';

		foreach( $roles as $role => $slug ) :
			$option_name = self::KEY . '[' . $prefix . $role . ']';
			$this->option_value = get_option( self::KEY );
			$value = isset( $this->option_value[ $prefix . $role ] )
				? $this->option_value[ $prefix . $role ] : 'default'; ?>

			<li class="role-access-controller">
				<div class="role-title"><?php echo esc_attr( $slug ); ?></div>

				<?php foreach( $role_options as $key => $label ) : ?>
					<div class="role-option role-<?php echo $key; ?>">
						<?php printf( '<input type="radio" id="%1$s-%2$s" name="%2$s" value="%1$s" %3$s>', $key, esc_attr( $option_name ), checked( $value, $key, false ) ); ?>
						<?php printf( '<label for="%s-%s">%s</label>', $key, esc_attr( $option_name ), $label ); ?>
					</div>
				<?php endforeach; ?>
			</li>
		<?php endforeach;
		echo '</ul>';
	}

	function image_quality_field() {
		$name = $this->current_tab.'-img_settings_quality';
		$field_name = self::KEY . '['.$name.']';
		$value = isset($this->option_value[$name]) ? $this->option_value[$name] : '';
		echo '<input type="text" name="'.$field_name.'" value="'.$value.'" class="img_field">','&nbsp; <small>'. __('max 100 (higher = better quality, but bigger file size)', 'themify') ,'</small>';
	}

	function image_crop_align_field() {
		$options = array(
			array('value' => 'c', 'name' => __('Center', 'themify')),
			array('value' => 't', 'name' => __('Top', 'themify')),
			array('value' => 'tr',	'name' => __('Top Right', 'themify')),
			array('value' => 'tl',	'name' => __('Top Left', 'themify')),
			array('value' => 'b',	'name' => __('Bottom', 'themify')),
			array('value' => 'br',	'name' => __('Bottom Right', 'themify')),
			array('value' => 'bl',	'name' => __('Bottom Left', 'themify')),
			array('value' => 'l',	'name' => __('Left', 'themify')),
			array('value' => 'r',	'name' => __('Right', 'themify'))
		);
		$name = $this->current_tab .'-img_settings_crop_option';
		$field_name = self::KEY . '['.$name.']';
		echo '<select name="'.$field_name.'" class="img_field"><option></option>';
		foreach($options as $option){
			$selected = isset( $this->option_value[$name] ) ? $this->option_value[$name] : '';
			echo '<option value="' . $option['value']  . '" '.selected( $selected, $option['value']).'>' . esc_html( $option['name'] ) . '</option>';
		}
		echo '</select>';
	}

	function image_vertical_crop_field() {
		$options_vertical = array(
			array('name'=> '','value' => ''),
			array('name'=> __('Yes', 'themify'), 'value' => 'yes'),
			array('name'=> __('No', 'themify'),	 'value' => 'no')
		);
		$name = $this->current_tab .'-img_settings_vertical_crop_option';
		$field_name = self::KEY . '['.$name.']';
		$selected = isset( $this->option_value[$name] ) ? $this->option_value[$name] : '';
		echo '<select name="' . $field_name . '" class="img_field">';
		foreach($options_vertical as $option_vertical){
			echo '<option value="' . esc_attr( $option_vertical['value'] ) . '"'.selected( $selected, $option_vertical['value'] ).'>' . esc_html( $option_vertical['name'] ) . '</option>';
		}
		echo '</select>&nbsp; <small>' . __('(Select \'no\' to disable vertical cropping globally)', 'themify') , '</small>';
	}

	function custom_css_field(){
		$name = $this->current_tab . '-custom_css';
		$field_name = self::KEY . '['.$name.']';
		$out = '<textarea name="'.$field_name.'" style="width:100%;height:600px;">';
		$out.=isset( $this->option_value[$name] ) ? $this->option_value[$name] : '';
		$out.='</textarea>';
		echo $out;
	}

	function twitter(){
		$pre = $this->current_tab . '_twitter_';
		$out='<div>';
		$consumer_key =  isset( $this->option_value[ $pre . 'consumer_key' ] ) ? $this->option_value[ $pre . 'consumer_key'] : '';
		$out .= '<p><label>' . __( 'Consumer Key', 'themify' ) . '<br>';
		$out .= sprintf( '<input type="text" style="min-width:300px;" value="%s" name="%s" />',
			$consumer_key,
			esc_attr( self::KEY . '[' . $pre . 'consumer_key' . ']' )
		);
		$out .= '</label></p>';
		$consumer_secret =  isset( $this->option_value[ $pre . 'consumer_secret' ] ) ? $this->option_value[ $pre . 'consumer_secret'] : '';
		$out .= '<p><label>' . __( 'Consumer Secret', 'themify' ) . '<br>';
		$out .= sprintf( '<input type="text" style="min-width:300px;" value="%s" name="%s" />',
			$consumer_secret,
			esc_attr( self::KEY . '[' . $pre . 'consumer_secret' . ']' )
		);
		$out .= '</label></p>';
		$out .= '<br/><p class="description">';
		$out .= sprintf( __( '<a href="https://apps.twitter.com/app/new">Twitter access</a> is required for Themify Twitter module, read this <a href="%s">documentation</a> for more details.', 'themify' ), 'https://themify.me/docs/setting-up-twitter' );
		$out .= '</p></div>';
		$cache_duration =  isset( $this->option_value[ $pre . 'cache_duration' ] ) ? $this->option_value[ $pre . 'cache_duration'] : 10;
		$out .= '<p><label>' . __( 'Cache Duration', 'themify' ) . '<br>';
		$out .= sprintf( '<input type="text" style="min-width:300px;" value="%s" name="%s" />',
			$cache_duration,
			esc_attr( self::KEY . '[' . $pre . 'cache_duration' . ']' )
		);
		$out .= ' ' . __( 'Minutes', 'themify' );
		$out .= '</label></p>';
		$out .= '<br/><p class="description">';
		$out .= '<p><a href="#" class="button button-secondary themify_button" id="tb_option_flush_twitter"><span>' . __( 'Clear Cache', 'themify' ) . '</span></a></p>';
		$out .= '</p></div>';
		echo $out;

	}

	function google_map_api_key_field(){
		$pre = $this->current_tab . '_';
		$out='<div>';
		$google_map_key =  isset( $this->option_value[$pre.'google_map_key'] )?$this->option_value[$pre.'google_map_key']:'';
		$out.=sprintf('<input type="text" style="min-width:300px;" value="%s" name="%s" />',
			$google_map_key,
			esc_attr( self::KEY . '[' . $pre . 'google_map_key' . ']' )
		);
		$out.='<br/><p class="description">';
		$out.= sprintf( __( 'Google API key is required to use Builder Map module and Map shortcode. <a href="%s" target="_blank">Generate an API key</a> and insert it here. Also, please ensure you\'ve setup a <a href="%s" target="_blank">billing plan</a>.' ), '//developers.google.com/maps/documentation/javascript/get-api-key#key', 'https://support.google.com/googleapi/answer/6158867' );
		$out.='</p></div>';
		echo $out;

	}

	function bing_map_api_key_field(){
		$pre = $this->current_tab . '_';
		$bing_map_key =  isset( $this->option_value[$pre.'bing_map_key'] )?$this->option_value[$pre.'bing_map_key']:'';
		$out= sprintf('<input type="text" style="min-width:300px;" value="%s" name="%s" />',
			$bing_map_key,
			esc_attr( self::KEY . '[' . $pre . 'bing_map_key' . ']' )
		);
		$out .= '<br/><p class="description"><span class="pushlabel">'. sprintf( __( 'To use Bing Maps, <a href="%s" target="_blank">generate an API key</a> and insert it here.', 'themify' ), 'https://msdn.microsoft.com/en-us/library/ff428642.aspx' ) . '</span></p>';
		echo $out;
	}

	function cloudflare_field(){
		$pre = $this->current_tab . '_';
		$key='clf_email';
		$email=isset( $this->option_value[$pre.$key] )?$this->option_value[$pre.$key]:'';
		$out= sprintf('<p><label>%s<br/><input type="email" style="min-width:200px;" value="%s" name="%s" /></label></p>',
			__('Account Email:','themify'),
			$email,
			esc_attr( self::KEY . '[' . $pre . $key . ']' )
		);
		$key='clf_key';
		$api=isset( $this->option_value[$pre.$key] )?$this->option_value[$pre.$key]:'';
		$out.= sprintf('<p><label>%s<br/><input type="text" style="min-width:300px;" value="%s" name="%s" /></label></p>',
			__('API Key:','themify'),
			$api,
			esc_attr( self::KEY . '[' . $pre . $key . ']' )
		);
		$key='clf_zone'.crc32($email.$api);
		$zone=isset( $this->option_value[$pre.$key] )?$this->option_value[$pre.$key]:'';
		if(!empty($zone)){
			$out.= sprintf('<input type="hidden" value="%s" name="%s" />',
				$zone,
				esc_attr( self::KEY . '[' . $pre . $key . ']' )
			);
		}
		echo $out;
	}

    function recaptcha_field(){
        $pre = $this->current_tab . '_';
        $key='recaptcha_version';
        $val=isset( $this->option_value[$pre.$key] )?$this->option_value[$pre.$key]:'';
        ob_start();
        ?>
        <p>
            <label>
                <?php _e('Version:','themify'); ?></br>
                <select name="<?php echo esc_attr( self::KEY . '[' . $pre . $key . ']' ); ?>">
                    <option value="v2"<?php echo 'v2'===$val?'checked="checked"':''; ?>><?php _e('Version 2','themify'); ?></option>
                    <option value="v3"<?php echo 'v3'===$val?'checked="checked"':''; ?>><?php _e('Version 3','themify'); ?></option>
                </select>
            </label>
        </p>
        <?php
        $key='recaptcha_site_key';
        $val=isset( $this->option_value[$pre.$key] )?$this->option_value[$pre.$key]:'';
        ?>
        <p>
            <label>
                <?php _e('Site Key'); ?><br/>
                <input type="text" name="<?php echo esc_attr( self::KEY . '[' . $pre . $key . ']' );  ?>" class="width8" value="<?php echo esc_attr($val); ?>">
            </label>
        </p>
        <?php
        $key='recaptcha_secret_key';
        $val=isset( $this->option_value[$pre.$key] )?$this->option_value[$pre.$key]:'';
        ?>
        <p>
            <label>
                <?php _e('Secret Key'); ?><br/>
                <input type="text" name="<?php echo esc_attr( self::KEY . '[' . $pre . $key . ']' );  ?>" class="width8" value="<?php echo esc_attr($val); ?>">
            </label>
        </p>
        <?php
        ob_end_flush();
    }

	function optin_field() {
		$pre = 'setting-';
		$clear=isset( $_GET['tb_option_flush_cache'] );
		$providers = Builder_Optin_Service::get_providers();
		foreach ( $providers as $id => $instance ) {
			if ( $clear===true ) {
				$instance->clear_cache();
			}
			if ( $options = $instance->get_global_options() ) {
				?>
				<br><hr>
				<fieldset id="themify_setting_<?php echo $id; ?>">
					<legend>
						<strong><?php echo $instance->get_label(); ?></strong>
					</legend>
					<div class="themify_panel_fieldset_wrap" style="display: block !important;">
						<?php foreach ( $options as $field ) : ?>
							<p>
							<label class="label" for="setting-<?php echo $field['id']; ?>"><?php echo $field['label'] ?></label>
							<br/>
							<input type="text" name="<?php echo self::KEY . '[' . $pre . $field['id'] . ']'; ?>" id="setting-<?php echo $field['id']; ?>" value="<?php echo esc_attr( isset( $this->option_value[ $pre . $field['id'] ] ) ? $this->option_value[ $pre . $field['id'] ] : '' ); ?>" class="width8">
							<?php if ( isset( $field['description'] ) ) : ?>
								<p class="description"><?php echo $field['description'] ?></small>
							<?php endif; ?>
							</p>
						<?php endforeach; ?>
					</div><!-- .themify_panel_fieldset_wrap -->
				</fieldset>
			<?php } ?>
		<?php } ?>

		<br><hr>
		<p>
			<a href="<?php echo add_query_arg( 'tb_option_flush_cache', 1 ); ?>" class="button button-secondary tb_option_flush_cache"><span><?php _e( 'Clear API Cache', 'themify' ); ?></span> </a>
		</p>

		<?php
	}

	function regenerate_css_field(){
		$output ='<div>';
		$output .= '<input id="builder-regenerate-css-files" type="button" value="'.__('Regenerate CSS Files','themify').'" class="button big-button"/>';
		if(is_multisite()){
                    $output.='<br/><label class="pushlabel"><input type="checkbox" value="1" id="tmp_regenerate_all_css"/>'.__('Regenerate CSS in the whole network site','themify').'</label>';
                }
                $output .='<br/><br/><p class="description">';
		$output .= __('Builder styling are output to the generated CSS files stored in \'wp-content/uploads\' folder. Regenerate files will update all data in the generated files (eg. correct background image paths, etc.).','themify');
                $output .='</p></div>';
		echo $output;
	}

	function find_and_replace_field(){
		$in_progress = (true === get_transient( 'themify_find_and_replace_in_progress' )) ? true : false;
		$disabled = $in_progress ? 'disabled="disabled"' : '';
		$value = $in_progress ? __('Replacing ...','themify') : __('Replace','themify');
		$output = '<br/><div>';
		$output .= '<label>'.__('Search for','themify').'   </label><input type="url" style="min-width:500px;" value="" id="original_string" />';
		$output .='<br/><br/>';
		$output .= '<label>'.__('Replace to','themify').'   </label><input type="url" style="min-width:500px;" value="" id="replace_string" />';
		$output .='<br/><br/>';
		$output .= '<input id="builder-find-and-replace-btn" type="button" name="builder-find-and-replace-btn" '.$disabled.' value="'.$value.'" class="button big-button"/>';
		$output .='<br/><br/><p class="description">';
		$output .= __('Use this tool to find and replace the strings in the Builder data. Warning: Please backup your database before replacing strings, this can not be undone.','themify');
		$output .='</p></div>';
		echo $output;
	}

	function builder_upgrade(){

	}

	function queue_top_pages( $pages ) {
		$pages[] =  'toplevel_page_themify-builder' ;
		return $pages;
	}

	function queue_pagenow( $pagenows ) {
		$pagenows[] =  'themify-builder' ;
		return $pagenows;
	}

	function load_enqueue_scripts( $page ) {
		if ( 'toplevel_page_themify-builder' === $page ) {
			themify_enque_style( 'tf-base', THEMIFY_URI . '/css/base.min.css', null, THEMIFY_VERSION,null,true);
			themify_enque_style( 'themify-ui',  THEMIFY_URI . '/css/themify-ui.css' , array( 'tf-base' ), THEMIFY_VERSION,null,true);
			wp_enqueue_script( 'jquery-ui-slider' );
			wp_enqueue_script( 'jquery-ui-sortable' );
			themify_enque_script( 'themify-builder-admin-settings', THEMIFY_BUILDER_URI . '/js/plugin/themify-builder-admin-settings.js', THEMIFY_VERSION, array('jquery'));

			add_action( 'admin_head', array( $this, 'custom_admin_css' ) );
		}
	}

	/**
	 * Add custom inline css in plugin settting page.
	 *
	 * @access public
	 */
	public function custom_admin_css() {
		echo '<style>
		.width8 { width: 300px; }
		.width4 { width: 80px; }
		.width10 { width: 68%; }
		@media screen and (max-width: 820px) {
						.width4,.width8 {
							max-width: 100%;
						}
		}
		</style>';
	}

	/**
	 * Add maintenance in plugin setting page.
	 *
	 * @access public
	 */
	function builder_maintenance_field() {
		$value = themify_builder_get( 'setting-page_builder_maintenance_mode', 'tools_maintenance_mode' );
		$output = '
			<select id="tools_maintenance_mode" name="' . self::KEY . '[tools_maintenance_mode]">
				<option value="">' . __( 'Disabled', 'themify' ) . '</option>
				<option value="on" ' . selected( 'on', $value, false ) . '>' . __( 'Enable and display a page', 'themify' ) . '</option>
				<option value="message" ' . selected( 'message', $value, false ) . '>' . __( 'Enable and display a message', 'themify' ) . '</option>
			</select>
			<p class="description">' . __( 'Once it is enabled, only logged-in users can see your site.', 'themify' ) . '</p>
		';

		$message = themify_builder_get( 'setting-maintenance_message', 'tools_maintenance_message' );
		$output .= '<textarea id="tools_maintenance_message" name="' . self::KEY . '[tools_maintenance_message]" class="width10">' . esc_html( $message ) . '</textarea>';

		$selected_value = ! empty( $this->option_value['tools_maintenance_page'] ) ? $this->option_value['tools_maintenance_page'] : '';
		$selected_page = empty($selected_value) ? '' : get_page_by_path( $selected_value, OBJECT, 'page' );
		$output .= sprintf('<br/><div class="tb_maintenance_page"><select id="%s" name="%s">%s<option>%s</option></select><p class="description">%s</p></div>',
			'tools_maintenance_page' ,
			self::KEY . '[tools_maintenance_page]' ,
			( empty( $selected_value ) || ! is_object( $selected_page ) ) ? '<option></option>' : sprintf('<option value="%s" selected="selected">%s</option>',$selected_value,$selected_page->post_title),
			__( 'Loading...', 'themify' ),
			__( 'Select a page to show for public users', 'themify' )
		);

		echo $output;
	}
}
new Themify_Builder_Options();
endif;