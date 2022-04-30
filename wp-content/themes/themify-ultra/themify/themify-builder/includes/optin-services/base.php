<?php

defined( 'ABSPATH' ) || exit;

class Builder_Optin_Service {
	
	/* array list of provider instances */
	private static $providers=array();

	/**
	 * Creates or returns an instance of this class.
	 *
	 * @return	A single instance of this class.
	 */
	public static function init() {
		if ( is_admin() ) {
			add_action( 'wp_ajax_tb_optin_subscribe', array( __CLASS__, 'ajax_subscribe' ) );
			add_action( 'wp_ajax_nopriv_tb_optin_subscribe', array( __CLASS__, 'ajax_subscribe' ) );
		}
	}
	
	
	/**
	 * Initialize data providers for the module
	 *
	 * Other plugins or themes can extend or add to this list
	 * by using the "builder_optin_services" filter.
	 */
	private static function init_providers($type='all') {
		$dir = trailingslashit( dirname( __FILE__ ) );
		$providers = apply_filters( 'builder_optin_services', array(
			'mailchimp' => 'Builder_Optin_Service_MailChimp',
			'activecampaign' => 'Builder_Optin_Service_ActiveCampaign',
			'convertkit' => 'Builder_Optin_Service_ConvertKit',
			'getresponse' => 'Builder_Optin_Service_GetResponse',
			'mailerlite' => 'Builder_Optin_Service_MailerLite',
			'newsletter' => 'Builder_Optin_Service_Newsletter',
		) );
		if($type!=='all'){
			if(!isset($providers[$type])){
				return false;
			}
			$providers=array($type=>$providers[$type]);
		}

		foreach ( $providers as $id => $provider ) {
			if(!isset(self::$providers[ $id ])){
				if(is_file($dir . '/'.$id.'.php')){
					include_once( $dir . '/'.$id.'.php' );
					if ( class_exists( $provider ) ) {
						self::$providers[ $id ] = new $provider();
					}
				}
			}
		}
	}

	/**
	 * Helper function to retrieve list of providers or provider instance
	 *
	 * @return object
	 */
	public static function get_providers($id='all') {
		if(!isset( self::$providers[ $id ] ) ){
			self::init_providers($id);
		}
		if($id==='all'){
			return self::$providers;
		}
		return isset( self::$providers[ $id ] ) ? self::$providers[ $id ] : false;
	}


	/**
	 * Handles the Ajax request for subscription form
	 *
	 * Hooked to wp_ajax_tb_optin_subscribe
	 */
	public static function ajax_subscribe() {
        if ( ! isset( $_POST['tb_optin_provider'], $_POST['tb_optin_fname'], $_POST['tb_optin_lname'], $_POST['tb_optin_email'] ) ) {
			wp_send_json_error( array( 'error' => __( 'Required fields are empty.', 'themify' ) ) );
		}

        /* reCAPTCHA validation */
        if ( isset( $_POST['contact-recaptcha'] ) ) {
            $api = themify_builder_get( 'setting-recaptcha_secret_key','builder_settings_recaptcha_secret_key',true );
            if(!empty($api)){
                $response = wp_remote_get('https://www.google.com/recaptcha/api/siteverify?secret=' . $api . '&response=' . $_POST['contact-recaptcha']);
                if (isset($response['body'])) {
                    $response = json_decode($response['body'], true);
                    if ( ! true == $response['success'] ) {
                        wp_send_json_error( array( 'error' => __( 'Please verify captcha.', 'themify' ) ) );
                    }
                } else {
                    wp_send_json_error( array( 'error' => __( 'Trouble verifying captcha. Please try again.', 'themify' ) ) );
                }
            } else {
                wp_send_json_error( array( 'error' => __( 'reCaptcha API is not provided.', 'themify' ) ) );
            }
        }

		$data = array();
		foreach ( $_POST as $key => $value ) {
			// remove "tb_optin_" prefix from the $_POST data
			$key = preg_replace( '/^tb_optin_/', '', $key );
			$data[ $key ] = sanitize_text_field( trim( $value ) );
		}

		if ( $provider = self::get_providers( $data['provider'] ) ) {
			$result = $provider->subscribe( $data );
			if ( is_wp_error( $result ) ) {
				wp_send_json_error( array( 'error' => $result->get_error_message() ) );
			} else {
				wp_send_json_success( array(
					/* send name and email in GET, these may come useful when building the page that the visitor will be redirected to */
					'redirect' => add_query_arg( array(
						'fname' => $data['fname'],
						'lname' => $data['lname'],
						'email' => $data['email'],
					), $data['redirect'] )
				) );
			}
		} else {
			wp_send_json_error( array( 'error' => __( 'Unknown provider.', 'themify' ) ) );
		}
	}
	
	function get_id() {}

	/**
	 * Checks whether this service is available.
	 *
	 * @return bool
	 */
	function is_available() {
		return true;
	}

	/**
	 * Provider Name
	 *
	 * @return string
	 */
	function get_label() {}

	/**
	 * Module options, displayed in the Optin module form
	 *
	 * @return array
	 */
	function get_options() {}

	/**
	 * Provider options that are not unique to each module
	 * These are displayed in the Builder settings page
	 *
	 * @return array
	 */
	function get_global_options() {
		return array();
	}

	/**
	 * Returns the value of a setting
	 */
	function get( $id, $default = null ) {
		if ( $value = themify_builder_get( "setting-{$id}", "setting-{$id}" ) ) {
			return $value;
		} else {
			return $default;
		}
	}

	/**
	 * Retrieves the $fields_args from module and determines if there is valid form to show.
	 *
	 * @param $fields_args array module options
	 * @return bool|WP_Error true if there's a form to show, WP_Error otherwise
	 */
	function check_user_data( $fields_args ) {
		return new WP_Error( 'missing_check_user_data_method', __( 'Error', 'themify' ) );
	}

	/**
	 * Action to perform when Clear Cache is requested
	 *
	 * @return null
	 */
	function clear_cache() {}

	/**
	 * Subscribe visitor to the mailing list
	 *
	 * @param $args array( 'fname', 'lname', 'email' )
	 *        it also includes options from get_options() method with their values.
	 *
	 * @return WP_Error|true
	 */
	function subscribe( $args ) {}
}


Builder_Optin_Service::init();
