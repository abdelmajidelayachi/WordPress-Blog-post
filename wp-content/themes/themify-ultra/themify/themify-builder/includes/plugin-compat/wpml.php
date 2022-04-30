<?php
/**
 * Builder Plugin Compatibility Code
 *
 * @package    Themify_Builder
 * @subpackage Themify_Builder/classes
 */

class Themify_Builder_Plugin_Compat_WPML {

	static function init() {
		add_action( 'wp_ajax_themify_builder_icl_copy_from_original', array( __CLASS__, 'icl_copy_from_original' ) );
		add_action( 'themify_builder_save_data', array( __CLASS__, 'wpml_reset_stylesheets' ), 10, 2 );
		add_action( 'themify_builder_custom_css_updated', array( __CLASS__, 'sync_custom_css' ), 10, 2 );
		add_filter( 'get_translatable_documents', array( __CLASS__, 'get_translatable_documents' ) );
	}

	/**
	 * Load Builder content from original page when "Copy content" feature in WPML is used
	 *
	 * @access public
	 * @since 1.4.3
	 */
	public static function icl_copy_from_original() {

		if ( isset( $_POST['source_page_id'],$_POST['source_page_lang'] )) {
			global $ThemifyBuilder, $wpdb;
			$post_id = $wpdb->get_var(
				$wpdb->prepare(
					"SELECT element_id FROM {$wpdb->prefix}icl_translations WHERE trid='%d' AND language_code='%s' LIMIT 1",
					$_POST[ 'source_page_id' ],
					$_POST[ 'source_page_lang' ]
				)
			);
			$post = ! empty( $post_id ) ? get_post( $post_id ) : null;
			if ( ! empty( $post ) ) {
				$builder_data = $ThemifyBuilder->get_builder_data( $post->ID );
				echo json_encode( $builder_data );
			} else {
				echo '-1';
			}
		}
		die;
	}

	/**
	 * When a post is saved, remove the Builder's generated stylesheets from all translated posts
	 * forcing Builder to regenerate them and apply the Styling changes.
	 *
	 * Hooked to "themify_builder_save_data"
	 *
	 * @return void
	 */
	public static function wpml_reset_stylesheets( $builder_data, $post_id ) {
		$translations = self::get_translations( $post_id );
		foreach ( $translations as $translated_id ) {
			/* remove the builder-generated.css file */
			Themify_Builder_Stylesheet::remove_css_files( (int)$translated_id );
		}
	}

	/**
	 * Gets a post ID and returns all translations of that post in form of {lang_key} => {post_id}
	 *
	 * @param $post_id int post ID to get the translations
	 * @return array
	 */
	public static function get_translations( $post_id ) {
		global $sitepress;

		$default_language = $sitepress->get_default_language();
		$trid = $sitepress->get_element_trid( $post_id, 'post_page' );
		$translations = $sitepress->get_element_translations( $trid, 'post_page' );
		if ( is_array( $translations ) ) {
			unset( $translations[ $default_language ] );
			return wp_list_pluck( $translations, 'element_id' );
		}

		return array();
	}

	/**
	 * Disable translation on some post types
	 *
	 * @return array
	 */
	public static function get_translatable_documents( $translatable_post_types ) {
		unset( $translatable_post_types['tglobal_style'],$translatable_post_types['tb_cf'], $translatable_post_types['tbp_theme']  );

		return $translatable_post_types;
	}

    /**
     * When a Custom CSS is updated, sync it within all translated pages
     *
     * Hooked to "themify_builder_custom_css_updated"
     *
     * @return void
     */
    public static function sync_custom_css( $post_id,$source_editor ) {
        if('frontend'===$source_editor){
            global $sitepress;
            $sync_custom_fields = new WPML_Sync_Custom_Fields(
                new WPML_Translation_Element_Factory( $sitepress ),
                $sitepress->get_custom_fields_translation_settings( WPML_COPY_CUSTOM_FIELD )
            );
            $sync_custom_fields->sync_to_translations( $post_id, 'tbp_custom_css' );
            self::wpml_reset_stylesheets('',$post_id);
        }
    }
}