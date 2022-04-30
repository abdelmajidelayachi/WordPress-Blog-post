<?php

defined( 'ABSPATH' ) || exit;

class Builder_Optin_Service_ConvertKit extends Builder_Optin_Service {
	/**
	 * Version of ConvertKit API
	 *
	 * @var string
	 */
	protected $api_version = 'v3';

	/**
	 * ConvertKit API URL
	 *
	 * @var string
	 */
	protected $api_url_base = 'https://api.convertkit.com/';

	function get_id() {
		return 'convertkit';
	}

	function get_label() {
		return __( 'ConvertKit', 'themify' );
	}

	function get_options() {
		$raw_forms = $this->get_forms();
		if ( ! is_wp_error( $raw_forms ) ) {
			$forms = array();
			foreach ( $raw_forms as $form ) {
				$forms[ $form['id'] ] = $form['name'];
			}
			return array(
				array(
					'id' => 'ck_form',
					'type' => 'select',
					'label' => __( 'Form', 'themify' ),
					'options' => $forms,
				),
			);
		} else {
			return array(
				array(
					'type' => 'separator',
					'html' => '<p class="tb_field_error_msg">' . $raw_forms->get_error_message() . '</p>'
				)
			);
		}
	}

	function get_global_options() {
		return array(
			array(
				'id' => 'convertkit_key',
				'type' => 'text',
				'label' => __( 'ConvertKit API Key', 'themify' ),
				'description' => sprintf( __( '<a href="%s">Get an API key</a>', 'themify' ), 'https://app.convertkit.com/account/edit' ),
			),
		);
	}

	/**
	 * Get the API key from Settings page
	 *
	 * @return string
	 */
	function get_api_key() {
		return $this->get( 'convertkit_key' );
	}

	function make_request( $request, $method = 'GET', $args = array() ) {
		$args = wp_parse_args( $args, array(
			'api_key' => $this->get_api_key(),
		) );
		$url = $this->api_url_base . $this->api_version . '/' . $request . '?' . http_build_query( $args );
		$results = wp_remote_request( $url, array( 'method' => $method ) );

		if ( ! is_wp_error( $results ) ) {
			if ( 200 == wp_remote_retrieve_response_code( $results ) ) {
				$results = wp_remote_retrieve_body( $results );
				return json_decode( $results, true );
			} else {
				$body = wp_remote_retrieve_body( $results );
				if ( is_string( $body ) && is_object( $json = json_decode( $body, true ) ) ) {
					$body = (array) $json;
				}

				if ( isset( $body['error'] ) && ! empty( $body[ 'error' ] ) ) {
					return new WP_Error( 'error', $body[ 'error' ] );
				} elseif ( isset( $body['message'] ) && ! empty( $body[ 'message' ] ) ) {
					return new WP_Error( 'error', $body[ 'message' ] );
				} else {
					return new WP_Error( 'error', sprintf( __( 'Error code: %s', 'themify' ), wp_remote_retrieve_response_code( $results ) ) );
				}

			}
		} else {
			return $results;
		}
	}

	/**
	 * Get list of MailChimp Lists (https://admin.mailchimp.com/lists)
	 *
	 * @return WP_Error|Array
	 */
	function get_forms() {
		$key = $this->get_api_key();
		if ( empty( $key ) )
			return new WP_Error( 'missing_api_key', __( 'Missing API Key.', 'themify' ) );

		$cache_key = 'tb_optin_convertkit_' . md5( $key );
		if ( false === ( $forms = get_transient( $cache_key ) ) ) {

			if ( is_wp_error( ( $data = $this->make_request( 'forms' ) ) ) )
				return $data;

			if ( isset( $data['forms'] ) ) {
				set_transient( $cache_key, $data['forms'] );
				return $data['forms'];
			} else {
				return new WP_Error( 'list_error', __( 'Error retrieving forms.', 'themify' ) );
			}
		} else {
			return $forms;
		}
	}

	/**
	 * Gets data from module and validates API key
	 *
	 * @return bool|WP_Error
	 */
	function check_user_data( $fields_args ) {
		if ( isset( $fields_args['ck_form'] ) ) {
			return true;
		} else {
			return new WP_Error( 'missing_api_key', __( 'No form is selected.', 'themify' ) );
		}
	}

	function clear_cache() {
		if ( $key = $this->get_api_key() ) {
			$cache_key = 'tb_optin_convertkit_' . md5( $key );
			delete_transient( $cache_key );
		}
	}

	/**
	 *
	 * @doc https://developers.convertkit.com/#forms
	 */
	function subscribe( $args ) {
		$sub = $this->make_request( sprintf( 'forms/%s/subscribe', $args['ck_form'] ), 'POST', array(
			'email' => $args['email'],
			'first_name' => $args['fname'],
		) );

		return $sub;
	}
}
