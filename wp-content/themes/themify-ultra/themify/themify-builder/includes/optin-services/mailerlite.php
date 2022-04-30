<?php

defined( 'ABSPATH' ) || exit;

class Builder_Optin_Service_MailerLite extends Builder_Optin_Service {

	/**
	 * Version of API
	 *
	 * @var string
	 */
	protected $api_version = 'v2';

	/**
	 * API URL
	 *
	 * @var string
	 */
	protected $api_url_base = 'https://api.mailerlite.com/api/';

	function get_id() {
		return 'mailerlite';
	}

	function get_label() {
		return __( 'MailerLite', 'themify' );
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
					'id' => 'ml_form',
					'type' => 'select',
					'label' => __( 'Groups', 'themify' ),
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
				'id' => 'mailerlite_key',
				'type' => 'text',
				'label' => __( 'MailerLite API Key', 'themify' ),
				'description' => sprintf( __( '<a href="%s">Get an API key</a>', 'themify' ), 'https://app.mailerlite.com/integrations/api/' ),
			),
		);
	}

	/**
	 * Get the API key from Settings page
	 *
	 * @return string
	 */
	function get_api_key() {
		return $this->get( 'mailerlite_key' );
	}

	function make_request( $request, $method = 'GET', $args = array() ) {
		$args = wp_parse_args( $args, array(
			'method' => $method,
			'headers' => array(
				'X-MailerLite-ApiKey' => $this->get_api_key(),
				'Content-Type' => 'application/json',
			),
		) );
		$url = $this->api_url_base . $this->api_version . '/' . $request;
		$results = wp_remote_request( $url, $args );

		if ( ! is_wp_error( $results ) ) {
			$response = json_decode( wp_remote_retrieve_body( $results ), true );
			if ( empty( $response ) ) {
				return new WP_Error( 'empty_response', __( 'Empty response.', 'themify' ) );
			}
			if ( isset( $response['error'] ) ) {
				return new WP_Error( 'error-' . $response['error']['code'], $response['error']['message'] );
			}

			// all good!
			return $response;
		} else {
			return $results;
		}
	}

	/**
	 * Get list of Groups (https://app.mailerlite.com/subscribers/groups)
	 *
	 * @return WP_Error|Array
	 */
	function get_forms() {
		$key = $this->get_api_key();
		if ( empty( $key ) )
			return new WP_Error( 'missing_api_key', __( 'Missing API Key.', 'themify' ) );

		$cache_key = 'tb_optin_mailerlite_' . md5( $key );
		if ( false === ( $forms = get_transient( $cache_key ) ) ) {

			if ( is_wp_error( ( $data = $this->make_request( 'groups' ) ) ) )
				return $data;

			if ( ! empty( $data ) ) {
				set_transient( $cache_key, $data );
				return $data;
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
		if ( isset( $fields_args['ml_form'] ) ) {
			return true;
		} else {
			return new WP_Error( 'missing_campaign', __( 'No campaign is selected.', 'themify' ) );
		}
	}

	function clear_cache() {
		if ( $key = $this->get_api_key() ) {
			$cache_key = 'tb_optin_mailerlite_' . md5( $key );
			delete_transient( $cache_key );
		}
	}

	/**
	 *
	 * @doc https://developers.mailerlite.com/reference#add-single-subscriber
	 */
	function subscribe( $args ) {
		$sub = $this->make_request( sprintf( 'groups/%s/subscribers', $args['ml_form'] ), 'POST', array(
			'body' => json_encode( array(
				'email' => $args['email'],
				'name' => sprintf( '%s %s', $args['fname'], $args['lname'] ),
			) ),
		) );

		return $sub;
	}
}