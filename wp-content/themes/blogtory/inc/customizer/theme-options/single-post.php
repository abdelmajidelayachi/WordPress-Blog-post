<?php
$wp_customize->add_section(
    'single_post_options' ,
    array(
        'title' => __( 'Single Post Options', 'blogtory' ),
        'panel' => 'theme_option_panel',
    )
);

/*Single Post Style*/
$wp_customize->add_setting(
    'theme_options[single_post_style]',
    array(
        'default'           => $default_options['single_post_style'],
        'sanitize_callback' => 'blogtory_sanitize_select',
    )
);
$wp_customize->add_control(
    'theme_options[single_post_style]',
    array(
        'label'       => __( 'Single Post style', 'blogtory' ),
        'section'     => 'single_post_options',
        'type'        => 'select',
        'choices'     => array(
            'single_style_1' => esc_html__( 'Style 1', 'blogtory' ),
            'single_style_2' => esc_html__( 'Style 2', 'blogtory' ),
        ),
    )
);

/*Posts Navigation Style*/
$wp_customize->add_setting(
    'theme_options[posts_navigation_style]',
    array(
        'default'           => $default_options['posts_navigation_style'],
        'sanitize_callback' => 'blogtory_sanitize_select',
    )
);
$wp_customize->add_control(
    'theme_options[posts_navigation_style]',
    array(
        'label'       => __( 'Posts Navigation Style', 'blogtory' ),
        'section'     => 'single_post_options',
        'type'        => 'select',
        'choices'     => array(
            'style_1' => esc_html__( 'Style 1', 'blogtory' ),
            'style_2' => esc_html__( 'Style 2', 'blogtory' ),
        ),
    )
);


/*Related/Author Posts Column*/
$wp_customize->add_setting(
    'theme_options[related_author_col]',
    array(
        'default'           => $default_options['related_author_col'],
        'sanitize_callback' => 'blogtory_sanitize_select',
    )
);
$wp_customize->add_control(
    'theme_options[related_author_col]',
    array(
        'label'       => __( 'Related/Author Posts Column', 'blogtory' ),
        'section'     => 'single_post_options',
        'type'        => 'select',
        'choices'     => array(
            4 => 4,
            3 => 3,
        ),
        'std' => 4
    )
);

/*Show Related Posts*/
$wp_customize->add_setting(
    'theme_options[show_related_posts]',
    array(
        'default'           => $default_options['show_related_posts'],
        'sanitize_callback' => 'blogtory_sanitize_checkbox',
    )
);
$wp_customize->add_control(
    'theme_options[show_related_posts]',
    array(
        'label'    => __( 'Show related posts', 'blogtory' ),
        'section'  => 'single_post_options',
        'type'     => 'checkbox',
    )
);

/*Related Posts Text.*/
$wp_customize->add_setting(
    'theme_options[related_posts_text]',
    array(
        'default'           => $default_options['related_posts_text'],
        'sanitize_callback' => 'sanitize_text_field',
    )
);
$wp_customize->add_control(
    'theme_options[related_posts_text]',
    array(
        'label'    => __( 'Related Posts Text', 'blogtory' ),
        'section'  => 'single_post_options',
        'type'     => 'text',
        'active_callback' => 'blogtory_is_related_posts_enabled',
    )
);

/* Number of Related Posts */
$wp_customize->add_setting(
    'theme_options[no_of_related_posts]',
    array(
        'default'           => $default_options['no_of_related_posts'],
        'sanitize_callback' => 'absint',
    )
);
$wp_customize->add_control(
    'theme_options[no_of_related_posts]',
    array(
        'label'       => __( 'Number of Related Posts', 'blogtory' ),
        'section'     => 'single_post_options',
        'type'        => 'number',
        'active_callback' => 'blogtory_is_related_posts_enabled',
    )
);

/*Show Author Posts*/
$wp_customize->add_setting(
    'theme_options[show_author_posts]',
    array(
        'default'           => $default_options['show_author_posts'],
        'sanitize_callback' => 'blogtory_sanitize_checkbox',
    )
);
$wp_customize->add_control(
    'theme_options[show_author_posts]',
    array(
        'label'    => __( 'Show Author Posts', 'blogtory' ),
        'section'  => 'single_post_options',
        'type'     => 'checkbox',
    )
);

/*Related Posts Text.*/
$wp_customize->add_setting(
    'theme_options[author_posts_text]',
    array(
        'default'           => $default_options['author_posts_text'],
        'sanitize_callback' => 'sanitize_text_field',
    )
);
$wp_customize->add_control(
    'theme_options[author_posts_text]',
    array(
        'label'    => __( 'Author Posts Text', 'blogtory' ),
        'section'  => 'single_post_options',
        'type'     => 'text',
        'active_callback' => 'blogtory_is_author_posts_enabled',
    )
);

/* Number of Author Posts */
$wp_customize->add_setting(
    'theme_options[no_of_author_posts]',
    array(
        'default'           => $default_options['no_of_author_posts'],
        'sanitize_callback' => 'absint',
    )
);
$wp_customize->add_control(
    'theme_options[no_of_author_posts]',
    array(
        'label'       => __( 'Number of Author Posts', 'blogtory' ),
        'section'     => 'single_post_options',
        'type'        => 'number',
        'active_callback' => 'blogtory_is_author_posts_enabled',
    )
);