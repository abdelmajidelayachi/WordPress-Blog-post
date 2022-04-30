<?php

defined( 'ABSPATH' ) || exit;

class Builder_Optin_Service_ActiveCampaign extends Builder_Optin_Service {

	function get_id() {
		return 'activecampaign';
	}

	function get_label() {
		return __( 'ActiveCampaign', 'themify' );
	}

	function get_options() {
		$raw_lists = $this->get_lists();
		if ( ! is_wp_error( $raw_lists ) ) {
			$lists = array();
			foreach ( $raw_lists as $list ) {
				$lists[ $list['id'] ] = $list['name'];
			}
			return array(
				array(
					'id' => 'ac_list',
					'type' => 'select',
					'label' => __( 'Form', 'themify' ),
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
				'id' => 'activecampaign_url',
				'type' => 'text',
				'label' => __( 'ActiveCampaign API URL', 'themify' ),
			),
			array(
				'id' => 'activecampaign_key',
				'type' => 'text',
				'label' => __( 'ActiveCampaign API Key'.themify_help(__( 'To get your API credentials go to your ActiveCampaign dashboard, you can find both API URL and Key in Settings > Developer section.')), 'themify' ),
			),
		);
	}

	/**
	 * Get the API key from Settings page
	 *
	 * @return array|false
	 */
	function get_api_tokens() {
		if ( $this->get( 'activecampaign_url' ) && $this->get( 'activecampaign_key' ) ) {
			return array(
				'key' => $this->get( 'activecampaign_key' ),
				'url' => $this->get( 'activecampaign_url' ),
			);
		} else {
			return false;
		}
	}

	function make_request( $request, $method = 'GET', $args = array() ) {
		$tokens = $this->get_api_tokens();
		$url = $tokens['url'] . '/api/3/';
		$url .= $request;
		$args = wp_parse_args( $args, array(
			'method' => $method,
			'headers' => array(
				'Api-Token' => $tokens['key']
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
	 * Get list of Lists (/admin/main.php?action=list)
	 *
	 * @return WP_Error|Array
	 */
	function get_lists() {
		$tokens = $this->get_api_tokens();
		if ( empty( $tokens ) )
			return new WP_Error( 'missing_api_key', __( 'Missing API URL and/or API Key.', 'themify' ) );

		$cache_key = 'tb_optin_activecampaign_' . md5( $tokens['key'] );
		if ( false === ( $lists = get_transient( $cache_key ) ) ) {

			if ( is_wp_error( ( $data = $this->make_request( 'lists' ) ) ) )
				return $data;

			if ( is_array( $data ) && isset( $data['lists'] ) ) {
				set_transient( $cache_key, $data['lists'] );
				return $data['lists'];
			} else {
				return new WP_Error( 'list_error', __( 'Error retrieving lists.', 'themify' ) );
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
		if ( isset( $fields_args['ac_list'] ) ) {
			return true;
		} else {
			return new WP_Error( 'missing_api_key', __( 'No list is selected.', 'themify' ) );
		}
	}

	function clear_cache() {
		$tokens = $this->get_api_tokens();
		if ( ! empty( $tokens ) ) {
			$cache_key = 'tb_optin_activecampaign_' . md5( $tokens['key'] );
			delete_transient( $cache_key );
		}
	}

	/**
	 *
	 *
	 * @doc: https://developers.activecampaign.com/v3/reference#update-list-status-for-contact
	 */
	function subscribe( $args ) {
		// create the contact
		$contact = $this->make_request( 'contacts', 'POST', array(
			'body' => json_encode( array(
				'contact' => array(
					'email' => $args['email'],
					'firstName' => $args['fname'],
					'lastName' => $args['lname']
				)
			) ),
		) );
		if ( is_wp_error( $contact ) ) {
			return $contact;
		} elseif ( isset( $contact['contact']['id'] ) ) {
			/* everything is good, continue on */
			$user_id = $contact['contact']['id'];
		} elseif ( isset( $contact['errors'][0]['code'] ) && $contact['errors'][0]['code'] === 'duplicate' ) {
			/**
			 * @todo: user already exists, try retrieving it
			 */
			return new WP_Error( 'error', $contact['errors'][0]['title'] );
		} elseif ( isset( $contact['errors'][0]['title'] ) ) {
			return new WP_Error( 'error', $contact['errors'][0]['title'] );
		}

		$list = $this->make_request( 'contactLists', 'POST', array(
			'body' => json_encode( array(
				'contactList' => array(
					'list' => $args['ac_list'],
					'contact' => $user_id,
					'status' => 1
				)
			) ),
		) );
		if ( is_wp_error( $list ) ) {
			return $list;
		} elseif ( isset( $list['contacts'], $list['contactList'] ) ) {
			return true;
		}
	}
}
