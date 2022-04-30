<?php
$wp_customize->add_section(
    'topbar_options' ,
    array(
        'title' => __( 'Topbar Options', 'blogtory' ),
        'panel' => 'theme_option_panel',
    )
);

/*Enable Top Bar*/
$wp_customize->add_setting(
    'theme_options[enable_top_bar]',
    array(
        'default'           => $default_options['enable_top_bar'],
        'sanitize_callback' => 'blogtory_sanitize_checkbox',
    )
);
$wp_customize->add_control(
    'theme_options[enable_top_bar]',
    array(
        'label'    => __( 'Enable Top Bar', 'blogtory' ),
        'section'  => 'topbar_options',
        'type'     => 'checkbox',
    )
);

/*Enable Todays Date*/
$wp_customize->add_setting(
    'theme_options[enable_todays_dates]',
    array(
        'default'           => $default_options['enable_todays_dates'],
        'sanitize_callback' => 'blogtory_sanitize_checkbox',
    )
);
$wp_customize->add_control(
    'theme_options[enable_todays_dates]',
    array(
        'label'    => __( 'Enable Todays Date', 'blogtory' ),
        'section'  => 'topbar_options',
        'type'     => 'checkbox',
        'active_callback'  => 'blogtory_is_top_bar_enabled'
    )
);

/*Todays Date Format*/
$wp_customize->add_setting(
    'theme_options[todays_date_format]',
    array(
        'default'           => $default_options['todays_date_format'],
        'sanitize_callback' => 'sanitize_text_field',
    )
);
$wp_customize->add_control(
    'theme_options[todays_date_format]',
    array(
        'label'    => __( 'Todays Date Format', 'blogtory' ),
        'description' => sprintf( wp_kses( __( '<a href="%s" target="_blank">Date and Time Formatting Documentation</a>.', 'blogtory' ), array(  'a' => array( 'href' => array(), 'target' => array() ) ) ), esc_url( 'https://wordpress.org/support/article/formatting-date-and-time' ) ),
        'section'  => 'topbar_options',
        'type'     => 'text',
        'active_callback'  =>  function( $control ) {
            return (
                blogtory_is_top_bar_enabled( $control )
                &&
                blogtory_is_todays_date_enabled( $control )
            );
        }
    )
);

/*Enable Social Nav*/
$wp_customize->add_setting(
    'theme_options[enable_top_bar_social_nav]',
    array(
        'default'           => $default_options['enable_top_bar_social_nav'],
        'sanitize_callback' => 'blogtory_sanitize_checkbox',
    )
);
$wp_customize->add_control(
    'theme_options[enable_top_bar_social_nav]',
    array(
        'label'    => __( 'Enable Top Bar Social Nav Menu', 'blogtory' ),
        'description' => sprintf( __( 'You can add/edit social nav menu from <a href="%s">here</a>.', 'blogtory' ), "javascript:wp.customize.control( 'nav_menu_locations[social-menu]' ).focus();" ),
        'section'  => 'topbar_options',
        'type'     => 'checkbox',
        'active_callback'  => 'blogtory_is_top_bar_enabled'
    )
);