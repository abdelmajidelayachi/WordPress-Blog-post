<?php

defined( 'ABSPATH' ) || exit;

class Builder_Optin_Service_MailChimp extends Builder_Optin_Service {

	function get_id() {
		return 'mailchimp';
	}

	function get_label() {
		return __( 'MailChimp', 'themify' );
	}

	function get_options() {
		$lists = $this->get_lists();
		if ( ! is_wp_error( $lists ) ) {
			$_lists = array();
			foreach ( $lists as $list ) {
				$_lists[ $list['id'] ] = $list['name'];
			}
			return array(
				array(
					'id' => 'mailchimp_list',
					'type' => 'select',
					'label' => __( 'List', 'themify' ),
					'options' => $_lists
				),
                array(
                    'id' => 'mailchimp_db_opt',
                    'type' => 'toggle_switch',
                    'label' => __( 'Double opt-in', 'themify' ),
                    'options' => array(
                        'on' => array( 'name' => 'on', 'value' => 'en' ),
                        'off' => array( 'name' => '', 'value' => 'dis' )
                    )
                )
			);
		} else {
			return array(
				array(
					'type' => 'separator',
					'html' => '<p>' . $lists->get_error_message() . '</p>',
					'wrap_class' => 'tb_field_error_msg'
				)
			);
		}
	}

	function get_global_options() {
		return array(
			array(
				'id' => 'mailchimp_key',
				'type' => 'text',
				'label' => __( 'MailChimp API Key', 'themify' ),
				'description' => sprintf( __( '<a href="%s">Get an API key</a>', 'themify' ), 'https://admin.mailchimp.com/account/api/' ),
			),
		);
	}

	/**
	 * Get the API key from Settings page
	 *
	 * @return string
	 */
	function get_api_key() {
		return $this->get( 'mailchimp_key' );
	}

	function make_request( $request, $method = 'GET', $args = array() ) {
		$api_key = $this->get_api_key();
		$api_key_pieces = explode( '-', $api_key );
		$server = $api_key_pieces[1];
		$url = sprintf( 'https://%s.api.mailchimp.com/3.0/', $server );
		$url .= $request;
		$args = wp_parse_args( $args, array(
			'method' => $method,
			'headers' => array(
				'Authorization' => 'Basic ' . base64_encode( 'key' . ':' . $api_key )
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
	 * Get list of MailChimp Lists (https://admin.mailchimp.com/lists)
	 *
	 * @return WP_Error|Array
	 */
	function get_lists() {
		$api_key = $this->get_api_key();
		if ( empty( $api_key ) )
			return new WP_Error( 'missing_api_key', __( 'MailChimp API Key is missing.', 'themify' ) );

		$cache_key = 'tb_optin_mailchimp_' . md5( $api_key );
		if ( false === ( $mc_lists = get_transient( $cache_key ) ) ) {
			if ( is_wp_error( ( $data = $this->make_request( 'lists' ) ) ) )
				return $data;

			if ( is_array( $data ) && isset( $data['lists'] ) ) {
				set_transient( $cache_key, $data['lists'] );
				return $data['lists'];
			} else {
				return new WP_Error( 'list_error', __( 'Error retrieving lists.', 'themify' ) );
			}
		} else {
			return $mc_lists;
		}
	}

	function get_list_info( $id ) {
		$mc_lists = $this->get_lists();
		if ( is_wp_error( $mc_lists ) ) {
			return $mc_lists;
		} else {
			foreach ( $mc_lists as $mc_list ) {
				if ( isset( $mc_list['id'] ) && $mc_list['id'] === $id ) {
					return $mc_list;
				}
			}
			return new WP_Error( 'list_not_found', __( 'Selected list not found.', 'themify' ) );
		}
	}

	/**
	 * Gets data from module and validates API key
	 *
	 * @return bool|WP_Error
	 */
	function check_user_data( $fields_args ) {
		if ( isset( $fields_args['mailchimp_list'] ) ) {
			$mc_list = $this->get_list_info( $fields_args['mailchimp_list'] );
			if ( is_wp_error( $mc_list ) ) {
				return $mc_list;
			} else {
				return true;
			}
		} else {
			return new WP_Error( 'missing_api_key', __( 'No list is selected.', 'themify' ) );
		}
	}

	function clear_cache() {
		if ( $key = $this->get_api_key() ) {
			$cache_key = 'tb_optin_mailchimp_' . md5( $key );
			delete_transient( $cache_key );
		}
	}

	/**
	 * Subscribe action
	 *
	 * @doc https://developer.mailchimp.com/documentation/mailchimp/guides/manage-subscribers-with-the-mailchimp-api/#subscribe-an-address
	 */
	function subscribe( $args ) {
		$response = $this->make_request( sprintf( 'lists/%s/members', $args['mailchimp_list'] ), 'POST', array(
			'body' => json_encode( array(
				'email_address' => $args['email'],
				'status' => isset($args['mailchimp_db_opt']) && $args['mailchimp_db_opt']==='on'?'pending':'subscribed',
				'merge_fields' => array(
					'FNAME' => $args['fname'],
					'LNAME' => $args['lname']
				),
			) )
		) );
		if ( is_wp_error( $response ) ) {
			return $response;
		} else {
			if ( isset( $response['status'] ) ) {
				if ( 'pending' === $response['status'] || 'subscribed' === $response['status']
					/* this user is already subscribed, no need to show any errors */
					|| ( 400 === $response['status'] && $response['title'] === 'Member Exists' )
				) {
					return true;
				} elseif ( isset( $response['errors'] ) ) {
					return new WP_Error( 'error', $response['errors'][0]->message );
				}
			}
		}
	}
}
