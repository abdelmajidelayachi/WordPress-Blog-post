<?php
/**
* Reset Options
* @since 1.0.0
* @package VisionWP WordPress Theme
*/

add_filter( 'visionwp_customizer_theme_panel', 'visionwp_theme_reset_options' );
function visionwp_theme_reset_options( $section ) {
    $section[ 'theme_reset_options' ] = array(
        'title'  => esc_html__( 'Reset', 'visionwp' ),
        'priority'  => 100,
        'fields' => array(
            'customizer-reset' => array(
                'type' => 'custom',
                'description' => esc_html__( 'Reseting will delete all the data. Once reset, you will not be able to get back those data.', 'visionwp' ),
                'default' => sprintf( '<button class="visionwp-reset-customizer" data-nonce="%s" data-msg="%s"
                    style="background: #2271b1;border-color: #2271b1;color: #fff;text-decoration: none;text-shadow: none;padding: 5px 10px;border-radius: 4px;border:none;cursor:pointer;">
                        <span class="dashicons dashicons-image-rotate" style="margin-right: 6px;font-size: 15px;padding-top: 2px;"></span>%s
                    </button>',
                    wp_create_nonce('visionwp-reset-nonce'),
                    esc_html__( 'Are You Sure To Reset?', 'visionwp' ),
                    esc_html__( 'Reset', 'visionwp' )
                )
            )
        )
    );
    return $section;
}