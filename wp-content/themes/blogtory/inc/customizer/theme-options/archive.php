<?php
$wp_customize->add_section(
    'archive_options' ,
    array(
        'title' => __( 'Archive Options', 'blogtory' ),
        'panel' => 'theme_option_panel',
    )
);

/* Archive Style */
$wp_customize->add_setting(
    'theme_options[archive_style]',
    array(
        'default'           => $default_options['archive_style'],
        'sanitize_callback' => 'blogtory_sanitize_radio',
    )
);
$wp_customize->add_control(
    new Blogtory_Radio_Image_Control(
        $wp_customize,
        'theme_options[archive_style]',
        array(
            'label'	=> __( 'Archive Style', 'blogtory' ),
            'section' => 'archive_options',
            'choices' => blogtory_get_archive_layouts()
        )
    )
);

/* Archive Excerpt Length */
$wp_customize->add_setting(
    'theme_options[archive_excerpt_length]',
    array(
        'default'           => $default_options['archive_excerpt_length'],
        'sanitize_callback' => 'absint',
    )
);
$wp_customize->add_control(
    'theme_options[archive_excerpt_length]',
    array(
        'label'       => __( 'Archive Excerpt Length', 'blogtory' ),
        'section'     => 'archive_options',
        'type'        => 'number',
    )
);

/*Archive Pagination Type*/
$wp_customize->add_setting(
    'theme_options[archive_pagination_type]',
    array(
        'default'           => $default_options['archive_pagination_type'],
        'sanitize_callback' => 'blogtory_sanitize_select',
    )
);
$wp_customize->add_control(
    'theme_options[archive_pagination_type]',
    array(
        'label'       => __( 'Archive Pagination Type', 'blogtory' ),
        'section'     => 'archive_options',
        'type'        => 'select',
        'choices'     => array(
            'default' => esc_html__( 'Default (Older / Newer Post)', 'blogtory' ),
            'numeric' => esc_html__( 'Numeric', 'blogtory' ),
        ),
    )
);

/*Pagination Align*/
$wp_customize->add_setting(
    'theme_options[archive_pagination_align]',
    array(
        'default'           => $default_options['archive_pagination_align'],
        'sanitize_callback' => 'blogtory_sanitize_select',
    )
);
$wp_customize->add_control(
    'theme_options[archive_pagination_align]',
    array(
        'label'       => __( 'Pagination Align', 'blogtory' ),
        'section'     => 'archive_options',
        'type'        => 'select',
        'choices'     => array(
            'left' => esc_html__( 'Left', 'blogtory' ),
            'center' => esc_html__( 'Center', 'blogtory' ),
            'right' => esc_html__( 'Right', 'blogtory' ),
        ),
        'active_callback' => 'blogtory_is_archive_pagination_available'
    )
);