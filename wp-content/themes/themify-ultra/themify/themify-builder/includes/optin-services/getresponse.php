<?php

defined( 'ABSPATH' ) || exit;

class Builder_Optin_Service_GetResponse extends Builder_Optin_Service {

	function get_id() {
		return 'getresponse';
	}

	function get_label() {
		return __( 'GetResponse', 'themify' );
	}

	function get_options() {
		$raw_lists = $this->get_campaigns();
		if ( ! is_wp_error( $raw_lists ) ) {
			$lists = array();
			foreach ( $raw_lists as $list ) {
				$lists[ $list['campaignId'] ] = $list['name'];
			}
			return array(
				array(
					'id' => 'gr_list',
					'type' => 'select',
					'label' => __( 'Campaign (List)', 'themify' ),
					'options' => $lists,
				),
			);
		} else {
			return array(
				array(
					'type' => 'separator',
					'html' =>  '<p class="tb_field_error_msg">' . $raw_lists->get_error_message() . '</p>'
				)
			);
		}
	}

	function get_global_options() {
		return array(
			array(
				'id' => 'getresponse_key',
				'type' => 'text',
				'label' => __( 'GetResponse API Key', 'themify' ),
				'description' => sprintf( __( '<a href="%s">Get an API key</a>', 'themify' ), 'https://app.getresponse.com/api' ),
			),
		);
	}

	/**
	 * Get the API key from Settings page
	 *
	 * @return array|false
	 */
	function get_api_key() {
		return $this->get( 'getresponse_key' );
	}

	function make_request( $request, $method = 'GET', $args = array() ) {
		$api_key = $this->get_api_key();
		$url = 'https://api.getresponse.com/v3/';
		$url .= $request;
		$args = wp_parse_args( $args, array(
			'method' => $method,
			'headers' => array(
				'X-Auth-Token' => 'api-key ' . $api_key,
				'Content-Type' => 'application/json'
			),
		) );

		$response = wp_remote_request( $url, $args );
		if ( is_wp_error( $response ) ) {
			return $response;
		} else {
			$api_response = json_decode( wp_remote_retrieve_body( $response ), true );
			return $api_response;
		}
	}

	/**
	 * Get list of Campaigns (https://app.getresponse.com/lists)
	 *
	 * @return WP_Error|Array
	 */
	function get_campaigns() {
		$api_key = $this->get_api_key();
		if ( empty( $api_key ) )
			return new WP_Error( 'missing_api_key', __( 'GetResponse API Key is missing.', 'themify' ) );

		$cache_key = 'tb_optin_getresponse_' . md5( $this->get_api_key() );
		if ( false === ( $lists = get_transient( $cache_key ) ) ) {

			if ( is_wp_error( ( $data = $this->make_request( 'campaigns' ) ) ) )
				return $data;

			if ( is_array( $data ) ) {
				set_transient( $cache_key, $data );
				return $data;
			} else {
				return new WP_Error( 'list_error', __( 'Error retrieving campaigns.', 'themify' ) );
			}
		} else {
			return $lists;
		}
	}

	/**
	 * Gets data from module and validates API key
	 *
	 * @return bool|WP_Error
	 */
	function check_user_data( $fields_args ) {
		if ( isset( $fields_args['gr_list'] ) ) {
			return true;
		} else {
			return new WP_Error( 'missing_api_key', __( 'No list is selected.', 'themify' ) );
		}
	}

	function clear_cache() {
		$key = $this->get_api_key();
		if ( ! empty( $key ) ) {
			$cache_key = 'tb_optin_getresponse_' . md5( $key );
			delete_transient( $cache_key );
		}
	}

	/**
	 * Subscribe action
	 *
	 * @doc: https://apidocs.getresponse.com/v3/resources/contacts
	 */
	function subscribe( $args ) {
		$sub = $this->make_request( 'contacts', 'POST', array(
			'body' => json_encode( array(
				'email' => $args['email'],
				'campaign' => array(
					'campaignId' => $args['gr_list']
				),
				'name' => sprintf( '%s %s', $args['fname'], $args['lname'] ),
			) ),
		) );

		if ( is_wp_error( $sub ) ) {
			return $sub;
		} elseif ( isset( $sub['httpStatus'], $sub['message'] ) ) {
			return new WP_Error( 'error', $sub['message'] );
		} else {
			return true;
		}
	}
}
