<?php
/*Add Theme Options Panel.*/
$wp_customize->add_panel(
    'theme_option_panel',
    array(
        'title' => __( 'Theme Options', 'blogtory' ),
        'description' => __( 'Contains all theme settings', 'blogtory')
    )
);
/**/

/* ========== Preloader Section. ==========*/
$wp_customize->add_section(
    'preloader_options',
    array(
        'title'      => __( 'Preloader Options', 'blogtory' ),
        'panel'      => 'theme_option_panel',
    )
);
/*Show Preloader*/
$wp_customize->add_setting(
    'theme_options[show_preloader]',
    array(
        'default'           => $default_options['show_preloader'],
        'sanitize_callback' => 'blogtory_sanitize_checkbox',
    )
);
$wp_customize->add_control(
    'theme_options[show_preloader]',
    array(
        'label'    => __( 'Show Preloader', 'blogtory' ),
        'section'  => 'preloader_options',
        'type'     => 'checkbox',
    )
);
/* ========== Preloader Section Close========== */

/* ========== Breadcrumb Section ========== */
$wp_customize->add_section(
    'breadcrumb_options',
    array(
        'title'      => __( 'Breadcrumb Options', 'blogtory' ),
        'panel'      => 'theme_option_panel',
    )
);
/*Show Breadcrumb*/
$wp_customize->add_setting(
    'theme_options[enable_breadcrumb]',
    array(
        'default'           => $default_options['enable_breadcrumb'],
        'sanitize_callback' => 'blogtory_sanitize_checkbox',
    )
);
$wp_customize->add_control(
    'theme_options[enable_breadcrumb]',
    array(
        'label'    => __( 'Enable Breadcrumb', 'blogtory' ),
        'section'  => 'breadcrumb_options',
        'type'     => 'checkbox',
    )
);
/* ========== Breadcrumb Section Close ========== */

/* ========== Sidebar Section ========== */
$wp_customize->add_section(
    'sidebar_options',
    array(
        'title'      => __( 'Sidebar Options', 'blogtory' ),
        'panel'      => 'theme_option_panel',
    )
);

/* Global Layout*/
$wp_customize->add_setting(
    'theme_options[global_sidebar_layout]',
    array(
        'default'           => $default_options['global_sidebar_layout'],
        'sanitize_callback' => 'blogtory_sanitize_radio',
    )
);
$wp_customize->add_control(
    new Blogtory_Radio_Image_Control(
        $wp_customize,
        'theme_options[global_sidebar_layout]',
        array(
            'label'	=> __( 'Global Sidebar Layout', 'blogtory' ),
            'section' => 'sidebar_options',
            'choices' => blogtory_get_general_layouts()
        )
    )
);

/* Sticky enable/disable */
$wp_customize->add_setting(
    'theme_options[sticky_sidebar]',
    array(
        'default'           => $default_options['sticky_sidebar'],
        'sanitize_callback' => 'blogtory_sanitize_checkbox',
    )
);
$wp_customize->add_control(
    'theme_options[sticky_sidebar]',
    array(
        'label'       => __( 'Enable Sticky Sidebar', 'blogtory' ),
        'section'     => 'sidebar_options',
        'type'        => 'checkbox',
    )
);

/* ========== Sidebar Section Close ========== */

/* ========== Excerpt Section ========== */
$wp_customize->add_section(
    'excerpt_options',
    array(
        'title'      => __( 'Excerpt Options', 'blogtory' ),
        'panel'      => 'theme_option_panel',
    )
);

/* Excerpt Length */
$wp_customize->add_setting(
    'theme_options[excerpt_length]',
    array(
        'default'           => $default_options['excerpt_length'],
        'sanitize_callback' => 'absint',
    )
);
$wp_customize->add_control(
    'theme_options[excerpt_length]',
    array(
        'label'       => __( 'Max Excerpt Length', 'blogtory' ),
        'description' => __( 'Remember this will affect other areas that shows excerpt too. So if you have excerpt with more length on other areas but is not working on front-end, be sure to increase the length here too.', 'blogtory'),
        'section'     => 'excerpt_options',
        'type'        => 'number',
    )
);

/* Excerpt Read More Text */
$wp_customize->add_setting(
    'theme_options[excerpt_read_more_text]',
    array(
        'default'           => $default_options['excerpt_read_more_text'],
        'sanitize_callback' => 'wp_filter_nohtml_kses',
    )
);
$wp_customize->add_control(
    'theme_options[excerpt_read_more_text]',
    array(
        'label'       => __( 'Read More Text', 'blogtory' ),
        'section'     => 'excerpt_options',
        'type'        => 'text',
    )
);
/* ========== Excerpt Section Close ========== */