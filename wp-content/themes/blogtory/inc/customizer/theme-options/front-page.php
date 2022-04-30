<?php
/*Add Home Page Options Panel.*/
$wp_customize->add_panel(
    'theme_home_option_panel',
    array(
        'title' => __( 'Front Page Options', 'blogtory' ),
        'description' => __( 'Contains all front page settings', 'blogtory')
    )
);
/**/


/* ========== Home Page Trending Posts Section ========== */
$wp_customize->add_section(
    'home_trending_posts_options' ,
    array(
        'title' => __( 'Trending Posts Options', 'blogtory' ),
        'panel' => 'theme_home_option_panel',
    )
);

/*Enable Trending Posts Section*/
$wp_customize->add_setting(
    'theme_options[enable_trending_posts]',
    array(
        'default'           => $default_options['enable_trending_posts'],
        'sanitize_callback' => 'blogtory_sanitize_checkbox',
    )
);
$wp_customize->add_control(
    'theme_options[enable_trending_posts]',
    array(
        'label'    => __( 'Enable Trending Posts', 'blogtory' ),
        'section'  => 'home_trending_posts_options',
        'type'     => 'checkbox',
    )
);

/*Trending Posts Category.*/
$wp_customize->add_setting(
    'theme_options[trending_post_cat]',
    array(
        'default'           => $default_options['trending_post_cat'],
        'sanitize_callback' => 'absint'
    )
);
$wp_customize->add_control(
    new Blogtory_Dropdown_Taxonomies_Control(
        $wp_customize,
        'theme_options[trending_post_cat]',
        array(
            'label'    => __( 'Choose Category', 'blogtory' ),
            'section'  => 'home_trending_posts_options',
            'description'  => __( 'Leave Empty if you don\'t want the posts to be category specific', 'blogtory' ),
            'active_callback' => 'blogtory_is_trending_posts_enabled'
        )
    )
);

/* Number of Posts */
$wp_customize->add_setting(
    'theme_options[no_of_trending_posts]',
    array(
        'default'           => $default_options['no_of_trending_posts'],
        'sanitize_callback' => 'absint',
    )
);
$wp_customize->add_control(
    'theme_options[no_of_trending_posts]',
    array(
        'label'       => __( 'Number of Trending Posts', 'blogtory' ),
        'section'     => 'home_trending_posts_options',
        'type'        => 'number',
        'active_callback' => 'blogtory_is_trending_posts_enabled'
    )
);

/*Orderby*/
$wp_customize->add_setting(
    'theme_options[trending_orderby]',
    array(
        'default'           => $default_options['trending_orderby'],
        'sanitize_callback' => 'blogtory_sanitize_select',
    )
);
$wp_customize->add_control(
    'theme_options[trending_orderby]',
    array(
        'label'       => __( 'Orderby', 'blogtory' ),
        'section'     => 'home_trending_posts_options',
        'type'        => 'select',
        'choices' => array(
            'date' => __('Date', 'blogtory'),
            'ID' => __('ID', 'blogtory'),
            'title' => __('Title', 'blogtory'),
            'rand' => __('Random', 'blogtory'),
        ),
        'active_callback' => 'blogtory_is_trending_posts_enabled'
    )
);
/**/

/*Order*/
$wp_customize->add_setting(
    'theme_options[trending_order]',
    array(
        'default'           => $default_options['trending_order'],
        'sanitize_callback' => 'blogtory_sanitize_select',
    )
);
$wp_customize->add_control(
    'theme_options[trending_order]',
    array(
        'label'       => __( 'Orderby', 'blogtory' ),
        'section'     => 'home_trending_posts_options',
        'type'        => 'select',
        'choices' => array(
            'asc' => __('ASC', 'blogtory'),
            'desc' => __('DESC', 'blogtory'),
        ),
        'active_callback' => 'blogtory_is_trending_posts_enabled'
    )
);
/**/

/*Trending Post Text.*/
$wp_customize->add_setting(
    'theme_options[trending_post_text]',
    array(
        'default'           => $default_options['trending_post_text'],
        'sanitize_callback' => 'sanitize_text_field',
        'transport'           => 'postMessage',
    )
);
$wp_customize->add_control(
    'theme_options[trending_post_text]',
    array(
        'label'    => __( 'Trending Post Text', 'blogtory' ),
        'section'  => 'home_trending_posts_options',
        'type'     => 'text',
        'active_callback' => 'blogtory_is_trending_posts_enabled'
    )
);

/* ========== Home Page Trending Posts Section Close ========== */

/* ========== Home Page Banner Section ========== */
$wp_customize->add_section(
    'home_banner_options' ,
    array(
        'title' => __( 'Front Page Banner Options', 'blogtory' ),
        'panel' => 'theme_home_option_panel',
    )
);

/*Enable Banner Section*/
$wp_customize->add_setting(
    'theme_options[enable_home_banner]',
    array(
        'default'           => $default_options['enable_home_banner'],
        'sanitize_callback' => 'blogtory_sanitize_checkbox',
    )
);
$wp_customize->add_control(
    'theme_options[enable_home_banner]',
    array(
        'label'    => __( 'Enable Home Banner', 'blogtory' ),
        'section'  => 'home_banner_options',
        'type'     => 'checkbox',
    )
);

/*Option to choose banner layout*/
$wp_customize->add_setting(
    'theme_options[banner_layout]',
    array(
        'default'           => $default_options['banner_layout'],
        'sanitize_callback' => 'blogtory_sanitize_select',
    )
);
$wp_customize->add_control(
    'theme_options[banner_layout]',
    array(
        'label'       => __( 'Banner Layout', 'blogtory' ),
        'section'     => 'home_banner_options',
        'type'        => 'select',
        'choices'     => array(
            'full-width' => __('FullWidth', 'blogtory'),
            'boxed' => __('Boxed', 'blogtory'),
        ),
        'active_callback'  =>  'blogtory_is_home_banner_enabled'
    )
);
/**/

/*Banner Display As*/
$wp_customize->add_setting(
    'theme_options[banner_display_as]',
    array(
        'default'           => $default_options['banner_display_as'],
        'sanitize_callback' => 'blogtory_sanitize_select',
    )
);
$wp_customize->add_control(
    'theme_options[banner_display_as]',
    array(
        'label'       => __( 'Banner Display As', 'blogtory' ),
        'section'     => 'home_banner_options',
        'type'        => 'select',
        'choices'     => array(
            'slider' => __('Slider', 'blogtory'),
            'carousel' => __('Carousel', 'blogtory'),
        ),
        'active_callback' => 'blogtory_is_home_banner_enabled'
    )
);
/**/

/*Banner Slider Style*/
$wp_customize->add_setting(
    'theme_options[banner_slider_style]',
    array(
        'default'           => $default_options['banner_slider_style'],
        'sanitize_callback' => 'blogtory_sanitize_select',
    )
);
$wp_customize->add_control(
    'theme_options[banner_slider_style]',
    array(
        'label'       => __( 'Banner Slider Style', 'blogtory' ),
        'section'     => 'home_banner_options',
        'type'        => 'select',
        'choices'     => array(
            'style_1' => __('Style 1', 'blogtory'),
            'style_2' => __('Style 2', 'blogtory'),
        ),
        'active_callback'  =>  function( $control ) {
            return (
                blogtory_is_home_banner_enabled( $control )
                &&
                blogtory_is_home_banner_as_slider( $control )
            );
        }
    )
);
/**/

/*Banner Carousel Style*/
$wp_customize->add_setting(
    'theme_options[banner_carousel_style]',
    array(
        'default'           => $default_options['banner_carousel_style'],
        'sanitize_callback' => 'blogtory_sanitize_select',
    )
);
$wp_customize->add_control(
    'theme_options[banner_carousel_style]',
    array(
        'label'       => __( 'Banner Carousel Style', 'blogtory' ),
        'section'     => 'home_banner_options',
        'type'        => 'select',
        'choices'     => array(
            'style_1' => __('Style 1', 'blogtory'),
            'style_2' => __('Style 2', 'blogtory'),
        ),
        'active_callback'  =>  function( $control ) {
            return (
                blogtory_is_home_banner_enabled( $control )
                &&
                blogtory_is_home_banner_as_carousel( $control )
            );
        }
    )
);
/**/

/*Banner Content From*/
$wp_customize->add_setting(
    'theme_options[banner_content_from]',
    array(
        'default'           => $default_options['banner_content_from'],
        'sanitize_callback' => 'blogtory_sanitize_select',
    )
);
$wp_customize->add_control(
    'theme_options[banner_content_from]',
    array(
        'label'       => __( 'Get Banner Content From', 'blogtory' ),
        'section'     => 'home_banner_options',
        'type'        => 'select',
        'choices'     => array(
            'category' => __('Category', 'blogtory'),
            'post_ids' => __('Post ID\'s', 'blogtory'),
        ),
        'active_callback' => 'blogtory_is_home_banner_enabled'
    )
);
/**/

/*Banner Posts Category.*/
$wp_customize->add_setting(
    'theme_options[banner_post_cat]',
    array(
        'default'           => $default_options['banner_post_cat'],
        'sanitize_callback' => 'absint'
    )
);
$wp_customize->add_control(
    new Blogtory_Dropdown_Taxonomies_Control(
        $wp_customize,
        'theme_options[banner_post_cat]',
        array(
            'label'    => __( 'Choose Category', 'blogtory' ),
            'description'  => __( 'Leave Empty if you don\'t want the posts to be category specific', 'blogtory' ),
            'section'  => 'home_banner_options',
            'active_callback'  =>  function( $control ) {
                return (
                    blogtory_is_home_banner_enabled( $control )
                    &&
                    blogtory_banner_content_from_category( $control )
                );
            }
        )
    )
);

/* Number of banner posts */
$wp_customize->add_setting(
    'theme_options[no_of_banner_posts]',
    array(
        'default'           => $default_options['no_of_banner_posts'],
        'sanitize_callback' => 'absint',
    )
);
$wp_customize->add_control(
    'theme_options[no_of_banner_posts]',
    array(
        'label'       => __( 'Number of Posts', 'blogtory' ),
        'section'     => 'home_banner_options',
        'type'        => 'number',
        'active_callback'  =>  function( $control ) {
            return (
                blogtory_is_home_banner_enabled( $control )
                &&
                blogtory_banner_content_from_category( $control )
            );
        }
    )
);

/*Banner Posts Orderby*/
$wp_customize->add_setting(
    'theme_options[banner_posts_orderby]',
    array(
        'default'           => $default_options['banner_posts_orderby'],
        'sanitize_callback' => 'blogtory_sanitize_select',
    )
);
$wp_customize->add_control(
    'theme_options[banner_posts_orderby]',
    array(
        'label'       => __( 'Orderby', 'blogtory' ),
        'section'     => 'home_banner_options',
        'type'        => 'select',
        'choices' => array(
            'date' => __('Date', 'blogtory'),
            'ID' => __('ID', 'blogtory'),
            'title' => __('Title', 'blogtory'),
            'rand' => __('Random', 'blogtory'),
        ),
        'active_callback'  =>  function( $control ) {
            return (
                blogtory_is_home_banner_enabled( $control )
                &&
                blogtory_banner_content_from_category( $control )
            );
        }
    )
);
/**/

/*Banner Posts Order*/
$wp_customize->add_setting(
    'theme_options[banner_posts_order]',
    array(
        'default'           => $default_options['banner_posts_order'],
        'sanitize_callback' => 'blogtory_sanitize_select',
    )
);
$wp_customize->add_control(
    'theme_options[banner_posts_order]',
    array(
        'label'       => __( 'Order', 'blogtory' ),
        'section'     => 'home_banner_options',
        'type'        => 'select',
        'choices' => array(
            'asc' => __('ASC', 'blogtory'),
            'desc' => __('DESC', 'blogtory'),
        ),
        'active_callback'  =>  function( $control ) {
            return (
                blogtory_is_home_banner_enabled( $control )
                &&
                blogtory_banner_content_from_category( $control )
            );
        }
    )
);
/**/

/*Banner Posts ID's*/
$wp_customize->add_setting(
    'theme_options[banner_post_ids]',
    array(
        'default'           => $default_options['banner_post_ids'],
        'sanitize_callback' => 'sanitize_text_field',
    )
);
$wp_customize->add_control(
    'theme_options[banner_post_ids]',
    array(
        'label'    => __( 'Post ID\'s', 'blogtory' ),
        'description'=> __( 'Comma ( , ) separated posts ids. Ex: 1, 2, 3', 'blogtory' ),
        'section'  => 'home_banner_options',
        'type'     => 'text',
        'active_callback'  =>  function( $control ) {
            return (
                blogtory_is_home_banner_enabled( $control )
                &&
                blogtory_banner_content_from_post_ids( $control )
            );
        }
    )
);

/*Enable Banner Category*/
$wp_customize->add_setting(
    'theme_options[show_banner_category]',
    array(
        'default'           => $default_options['show_banner_category'],
        'sanitize_callback' => 'blogtory_sanitize_checkbox',
    )
);
$wp_customize->add_control(
    'theme_options[show_banner_category]',
    array(
        'label'    => __( 'Show Category', 'blogtory' ),
        'section'  => 'home_banner_options',
        'type'     => 'checkbox',
        'active_callback'  => 'blogtory_is_home_banner_enabled'
    )
);

/*Enable Banner Meta*/
$wp_customize->add_setting(
    'theme_options[show_banner_meta]',
    array(
        'default'           => $default_options['show_banner_meta'],
        'sanitize_callback' => 'blogtory_sanitize_checkbox',
    )
);
$wp_customize->add_control(
    'theme_options[show_banner_meta]',
    array(
        'label'    => __( 'Show Date Info', 'blogtory' ),
        'section'  => 'home_banner_options',
        'type'     => 'checkbox',
        'active_callback'  => 'blogtory_is_home_banner_enabled'
    )
);

/* ========== Home Page Banner Section Section ========== */


/* ========== Home Page Sidebar Options ========== */
$wp_customize->add_section(
    'home_page_layout_options',
    array(
        'title'      => __( 'Front Page Sidebar Options', 'blogtory' ),
        'panel'      => 'theme_home_option_panel',
    )
);

/* Home Page Layout */
$wp_customize->add_setting(
    'theme_options[home_page_layout]',
    array(
        'default'           => $default_options['home_page_layout'],
        'sanitize_callback' => 'blogtory_sanitize_select',
    )
);
$wp_customize->add_control(
    new Blogtory_Radio_Image_Control(
        $wp_customize,
        'theme_options[home_page_layout]',
        array(
            'label'	=> __( 'Front Page Sidebar Layout', 'blogtory' ),
            'section' => 'home_page_layout_options',
            'choices' => blogtory_get_general_layouts()
        )
    )
);

/* Front Page Sticky enable/disable */
$wp_customize->add_setting(
    'theme_options[front_page_sticky_sidebar]',
    array(
        'default'           => $default_options['front_page_sticky_sidebar'],
        'sanitize_callback' => 'blogtory_sanitize_checkbox',
    )
);
$wp_customize->add_control(
    'theme_options[front_page_sticky_sidebar]',
    array(
        'label'       => __( 'Enable Front Page Sticky Sidebar', 'blogtory' ),
        'section'     => 'home_page_layout_options',
        'type'        => 'checkbox',
    )
);

/* ========== Home Page Layout Section Close ========== */

/* ========== Home Page Post Section ========== */
$wp_customize->add_section(
    'home_page_post_options',
    array(
        'title'      => __( 'Front Page Post Options', 'blogtory' ),
        'panel'      => 'theme_home_option_panel',
    )
);
/*Enable Front Page Content Section*/
$wp_customize->add_setting(
    'theme_options[enable_posts_in_front_page]',
    array(
        'default'           => $default_options['enable_posts_in_front_page'],
        'sanitize_callback' => 'blogtory_sanitize_checkbox',
    )
);
$wp_customize->add_control(
    'theme_options[enable_posts_in_front_page]',
    array(
        'label'    => __( 'Enable Latest Posts in Homepage', 'blogtory' ),
        'description' => __( 'This setting is applicable if you have static homepage template enabled for the homepage. It will show latest post listing on homepage.', 'blogtory' ),
        'section'  => 'home_page_post_options',
        'type'     => 'checkbox',
    )
);

/* Front Blog Style */
$wp_customize->add_setting(
    'theme_options[front_blog_style]',
    array(
        'default'           => $default_options['front_blog_style'],
        'sanitize_callback' => 'blogtory_sanitize_radio',
    )
);
$wp_customize->add_control(
    new Blogtory_Radio_Image_Control(
        $wp_customize,
        'theme_options[front_blog_style]',
        array(
            'label'	=> __( 'Homepage Latest Posts Style', 'blogtory' ),
            'section' => 'home_page_post_options',
            'choices' => blogtory_get_home_post_layouts(),
            'active_callback' => 'blogtory_is_home_posts_enabled',
        )
    )
);

/* Front Page Excerpt Length */
$wp_customize->add_setting(
    'theme_options[front_page_excerpt_length]',
    array(
        'default'           => $default_options['front_page_excerpt_length'],
        'sanitize_callback' => 'absint',
    )
);
$wp_customize->add_control(
    'theme_options[front_page_excerpt_length]',
    array(
        'label'       => __( 'Excerpt Length', 'blogtory' ),
        'section'     => 'home_page_post_options',
        'type'        => 'number',
        'active_callback' => 'blogtory_is_home_posts_enabled',
    )
);

/*Front Page Blog Pagination Type*/
$wp_customize->add_setting(
    'theme_options[front_page_pagination_type]',
    array(
        'default'           => $default_options['front_page_pagination_type'],
        'sanitize_callback' => 'blogtory_sanitize_select',
    )
);
$wp_customize->add_control(
    'theme_options[front_page_pagination_type]',
    array(
        'label'       => __( 'Homepage Latest Posts Pagination Type', 'blogtory' ),
        'section'     => 'home_page_post_options',
        'type'        => 'select',
        'choices'     => array(
            '' => esc_html__( 'No Pagination', 'blogtory' ),
            'numeric' => esc_html__( 'Numeric', 'blogtory' ),
        ),
        'active_callback' => 'blogtory_is_home_posts_enabled',
    )
);

/*Front Page Blog Numeric Pagination Align*/
$wp_customize->add_setting(
    'theme_options[home_numeric_pagination_align]',
    array(
        'default'           => $default_options['home_numeric_pagination_align'],
        'sanitize_callback' => 'blogtory_sanitize_select',
    )
);
$wp_customize->add_control(
    'theme_options[home_numeric_pagination_align]',
    array(
        'label'       => __( 'Homepage Numeric Pagination Align', 'blogtory' ),
        'section'     => 'home_page_post_options',
        'type'        => 'select',
        'choices'     => array(
            'left' => esc_html__( 'Left', 'blogtory' ),
            'center' => esc_html__( 'Center', 'blogtory' ),
            'right' => esc_html__( 'Right', 'blogtory' ),
        ),
        'active_callback'  =>  function( $control ) {
            return (
                blogtory_is_home_posts_enabled( $control )
                &&
                blogtory_is_home_numeric_pagination( $control )
            );
        }
    )
);
/* ========== Home Page Content section Close ========== */