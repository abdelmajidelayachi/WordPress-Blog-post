<?php

$widgets_link = admin_url( 'widgets.php' );

$wp_customize->add_section(
    'footer_options' ,
    array(
        'title' => __( 'Footer Options', 'blogtory' ),
        'panel' => 'theme_option_panel',
    )
);

/*Option to choose footer column layout*/
$wp_customize->add_setting(
    'theme_options[footer_column_layout]',
    array(
        'default'           => $default_options['footer_column_layout'],
        'sanitize_callback' => 'blogtory_sanitize_radio',
    )
);
$wp_customize->add_control(
    new Blogtory_Radio_Image_Control(
        $wp_customize,
        'theme_options[footer_column_layout]',
        array(
            'label'       => __( 'Footer Column Layout', 'blogtory' ),
            'description' => sprintf( __( 'Footer widgetareas used will vary based on the footer column layout chosen. Head over to  <a href="%s" target="_blank">widgets</a> to see which footer widgetareas are used if you change the layout.', 'blogtory' ), $widgets_link ),
            'section'     => 'footer_options',
            'choices' => blogtory_get_footer_layouts()
        )
    )
);
/**/

/*Copyright Text.*/
$wp_customize->add_setting(
    'theme_options[copyright_text]',
    array(
        'default'           => $default_options['copyright_text'],
        'sanitize_callback' => 'sanitize_text_field',
        'transport'           => 'postMessage',
    )
);
$wp_customize->add_control(
    'theme_options[copyright_text]',
    array(
        'label'    => __( 'Copyright Text', 'blogtory' ),
        'section'  => 'footer_options',
        'type'     => 'text',
    )
);

/*Enable copyright footer credit*/
$wp_customize->add_setting(
    'theme_options[enable_footer_credit]',
    array(
        'default'           => $default_options['enable_footer_credit'],
        'sanitize_callback' => 'blogtory_sanitize_checkbox',
    )
);
$wp_customize->add_control(
    'theme_options[enable_footer_credit]',
    array(
        'label'    => __( 'Enable Footer Credit', 'blogtory' ),
        'section'  => 'footer_options',
        'type'     => 'checkbox',
    )
);

/*Enable Footer Nav*/
$wp_customize->add_setting(
    'theme_options[enable_footer_nav]',
    array(
        'default'           => $default_options['enable_footer_nav'],
        'sanitize_callback' => 'blogtory_sanitize_checkbox',
    )
);
$wp_customize->add_control(
    'theme_options[enable_footer_nav]',
    array(
        'label'    => __( 'Show Footer Nav Menu', 'blogtory' ),
        'description' => sprintf( __( 'You can add/edit footer nav menu from <a href="%s">here</a>.', 'blogtory' ), "javascript:wp.customize.control( 'nav_menu_locations[footer-menu]' ).focus();" ),
        'section'  => 'footer_options',
        'type'     => 'checkbox',
    )
);
