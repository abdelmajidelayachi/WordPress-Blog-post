<?php

include THEME_DIR.'/admin/panel/settings.php';

/**
 * Theme Appearance Tab for Themify Custom Panel
 * @since 1.0.0
 * @param array $args
 * @return array
 */
function themify_theme_design_meta_box($args = array()) {

    /**
     * Options for header design
     * @since 1.0.0
     * @var array
     */
    $header_design_options = themify_theme_header_design_options();

    /**
     * Options for footer design
     * @since 1.0.0
     * @var array
     */
    $footer_design_options = themify_theme_footer_design_options();

    /**
     * Options for font design
     * @since 1.0.0
     * @var array
     */
    $font_design_options = themify_theme_font_design_options();

    /**
     * Options for color design
     * @since 1.0.0
     * @var array
     */
    $color_design_options = themify_theme_color_design_options();

    $states = themify_ternary_states(array(
	'icon_no' => THEMIFY_URI . '/img/ddbtn-check.svg',
	'icon_yes' => THEMIFY_URI . '/img/ddbtn-cross.svg',
    ));
    $opt=themify_ternary_options();
    $fonts=array_merge(themify_get_web_safe_font_list(), themify_get_google_web_fonts_list());
    return array(
	// Notice
	array(
	    'name' => '_theme_appearance_notice',
	    'title' => '',
	    'description' => '',
	    'type' => 'separator',
	    'meta' => array(
		'html' => '<div class="themify-info-link">' . __('The settings here apply on this page only. Leave everything as default will use the site-wide Theme Appearance from the Themify panel > Settings > Theme Settings.', 'themify') . '</div>'
	    ),
	),
	// Body Group
	array(
	    'name' => 'body_design_group',
	    'title' => __('Body', 'themify'),
	    'description' => '',
	    'type' => 'toggle_group',
	    'show_title' => true,
	    'meta' => array(
		// Background Color
		array(
		    'name' => 'body_background_color',
		    'title' => __('Body Background', 'themify'),
		    'description' => '',
		    'type' => 'color',
		    'meta' => array('default' => null),
		    'format' => 'rgba',
		),
		// Background image
		array(
		    'name' => 'body_background_image',
		    'title' => '',
		    'type' => 'image',
		    'description' => '',
		    'meta' => array(),
		    'before' => '',
		    'after' => '',
		),
		// Background repeat
		array(
		    'name' => 'body_background_repeat',
		    'title' => '',
		    'description' => __('Background Repeat', 'themify'),
		    'type' => 'dropdown',
		    'meta' => array(
			array(
			    'value' => '',
			    'name' => ''
			),
			array(
			    'value' => 'fullcover',
			    'name' => __('Fullcover', 'themify')
			),
			array(
			    'value' => 'repeat',
			    'name' => __('Repeat', 'themify')
			),
			array(
			    'value' => 'no-repeat',
			    'name' => __('No Repeat', 'themify')
			),
			array(
			    'value' => 'repeat-x',
			    'name' => __('Repeat horizontally', 'themify')
			),
			array(
			    'value' => 'repeat-y',
			    'name' => __('Repeat vertically', 'themify')
			),
		    ),
		),
		// Accent Color Mode, Presets or Custom
		array(
		    'name' => 'color_scheme_mode',
		    'title' => __('Header/Footer Colors', 'themify'),
		    'description' => '',
		    'type' => 'radio',
		    'show_title' => true,
		    'meta' => array(
			array(
			    'value' => 'color-presets',
			    'name' => __('Presets', 'themify'),
			    'selected' => true
			),
			array(
			    'value' => 'color-custom',
			    'name' => __('Custom', 'themify'),
			),
		    ),
		    'default' => 'color-presets',
		    'enable_toggle' => true,
		),
		// Theme Color
		array(
		    'name' => 'color_design',
		    'title' => '',
		    'description' => '',
		    'type' => 'layout',
		    'show_title' => true,
		    'meta' => $color_design_options,
		    'toggle' => 'color-presets-toggle',
		    'default' => 'default',
		),
		// Accent Color
		array(
		    'name' => 'scheme_color',
		    'title' => '',
		    'description' => '',
		    'type' => 'color',
		    'meta' => array('default' => null),
		    'after' => __('Header/Footer Font', 'themify'),
		    'toggle' => 'color-custom-toggle',
		    'format' => 'rgba',
		),
		array(
		    'name' => 'scheme_link',
		    'title' => '',
		    'description' => '',
		    'type' => 'color',
		    'meta' => array('default' => null),
		    'after' => __('Header/Footer Link', 'themify'),
		    'toggle' => 'color-custom-toggle',
		    'format' => 'rgba',
		),
		array(
		    'name' => 'scheme_background',
		    'title' => '',
		    'description' => '',
		    'type' => 'color',
		    'meta' => array('default' => null),
		    'after' => __('Header/Footer Background', 'themify'),
		    'toggle' => 'color-custom-toggle',
		    'format' => 'rgba',
		),
		// Typography Mode, Presets or Custom
		array(
		    'name' => 'typography_mode',
		    'title' => __('Typography', 'themify'),
		    'description' => '',
		    'type' => 'radio',
		    'show_title' => true,
		    'meta' => array(
			array(
			    'value' => 'typography-presets',
			    'name' => __('Presets', 'themify'),
			    'selected' => true
			),
			array(
			    'value' => 'typography-custom',
			    'name' => __('Custom', 'themify'),
			),
		    ),
		    'default' => 'typography-presets',
		    'enable_toggle' => true,
		),
		// Typography
		array(
		    'name' => 'font_design',
		    'title' => '',
		    'description' => '',
		    'type' => 'layout',
		    'show_title' => true,
		    'meta' => $font_design_options,
		    'toggle' => 'typography-presets-toggle',
		    'default' => 'default',
		),
		// Body font
		array(
		    'name' => 'body_font',
		    'title' => '',
		    'description' => '',
		    'type' => 'dropdown',
		    'meta' => $fonts,
		    'after' => ' ' . __('Body Font', 'themify'),
		    'toggle' => 'typography-custom-toggle',
		    'default' => 'default',
		),
		// Body wrap text color
		array(
		    'name' => 'body_text_color',
		    'title' => '',
		    'description' => '',
		    'type' => 'color',
		    'meta' => array('default' => null),
		    'after' => __('Body Font Color', 'themify'),
		    'toggle' => 'typography-custom-toggle',
		    'format' => 'rgba',
		),
		// Body wrap link color
		array(
		    'name' => 'body_link_color',
		    'title' => '',
		    'description' => '',
		    'type' => 'color',
		    'meta' => array('default' => null),
		    'after' => __('Body Link Color', 'themify'),
		    'toggle' => 'typography-custom-toggle',
		    'format' => 'rgba',
		),
		// Heading font
		array(
		    'name' => 'heading_font',
		    'title' => '',
		    'description' => '',
		    'type' => 'dropdown',
		    'meta' => $fonts,
		    'after' => ' ' . __('Heading (h1 to h6)', 'themify'),
		    'toggle' => 'typography-custom-toggle',
		    'default' => 'default',
		),
		// Heading color
		array(
		    'name' => 'heading_color',
		    'title' => '',
		    'description' => '',
		    'type' => 'color',
		    'meta' => array('default' => null),
		    'after' => __('Heading Font Color', 'themify'),
		    'toggle' => 'typography-custom-toggle',
		    'format' => 'rgba',
		)
	    ),
	    'default' => '',
	),
	// Header Group
	array(
	    'name' => 'header_design_group',
	    'title' => __('Header', 'themify'),
	    'description' => '',
	    'type' => 'toggle_group',
	    'show_title' => true,
	    'meta' => array(
		// Header Design
		array(
		    'name' => 'header_design',
		    'title' => __('Header Design', 'themify'),
		    'description' => '',
		    'type' => 'layout',
		    'show_title' => true,
		    'meta' => $header_design_options,
		    'hide' => 'none header-leftpane header-minbar boxed-content header-rightpane',
		    'default' => 'default',
		),
		// Sticky Header
		array(
		    'name' => 'fixed_header',
		    'title' => __('Sticky Header', 'themify'),
		    'description' => '',
		    'type' => 'radio',
		    'meta' => $opt,
		    'class' => 'hide-if none header-leftpane header-minbar boxed-content header-rightpane header-slide-out',
		    'default' => 'default',
		),
		// Full Height Header
		array(
		    'name' => 'full_height_header',
		    'title' => __('Full Height Header', 'themify'),
		    'description' => __('Full height will display the container in 100% viewport height', 'themify'),
		    'type' => 'radio',
		    'meta' => $opt,
		    'class' => 'hide-if default none header-horizontal header-top-widgets header-leftpane header-slide-out header-minbar header-top-bar boxed-content boxed-layout boxed-compact header-overlay header-rightpane header-menu-split header-stripe header-magazine header-classic header-bottom',
		    'default' => 'default',
		),
		// Header Elements
		array(
		    'name' => '_multi_header_elements',
		    'title' => __('Header Elements', 'themify'),
		    'description' => '',
		    'type' => 'multi',
		    'class' => 'hide-if none',
		    'meta' => array(
			'fields' => array(
			    // Show Site Logo
			    array(
				'name' => 'exclude_site_logo',
				'description' => '',
				'title' => __('Site Logo', 'themify'),
				'type' => 'dropdownbutton',
				'states' => $states,
				'class' => 'hide-if none header-menu-split',
				'after' => '<div class="clear"></div>',
			    ),
			    // Show Site Tagline
			    array(
				'name' => 'exclude_site_tagline',
				'description' => '',
				'title' => __('Site Tagline', 'themify'),
				'type' => 'dropdownbutton',
				'states' => $states,
				'class' => 'hide-if none',
				'after' => '<div class="clear"></div>',
			    ),
			    // Show Search Form
			    array(
				'name' => 'exclude_search_form',
				'description' => '',
				'title' => __('Search Form', 'themify'),
				'type' => 'dropdownbutton',
				'states' => $states,
				'class' => 'hide-if none',
				'after' => '<div class="clear"></div>',
			    ),
			    // Show Header Widgets
			    array(
				'name' => 'exclude_header_widgets',
				'description' => '',
				'title' => __('Header Widgets', 'themify'),
				'type' => 'dropdownbutton',
				'states' => $states,
				'class' => 'hide-if none',
				'after' => '<div class="clear"></div>',
			    ),
			    // Show Social Widget
			    array(
				'name' => 'exclude_social_widget',
				'description' => '',
				'title' => __('Social Widget', 'themify'),
				'type' => 'dropdownbutton',
				'states' => $states,
				'class' => 'hide-if none',
				'after' => '<div class="clear"></div>',
			    ),
			    // Show Menu Navigation
			    array(
				'name' => 'exclude_menu_navigation',
				'description' => '',
				'title' => __('Menu Navigation', 'themify'),
				'type' => 'dropdownbutton',
				'states' => $states,
				'class' => 'hide-if none header-menu-split',
				'after' => '<div class="clear"></div>',
				'enable_toggle' => true
			    ),
			    array(
				'name' => 'exclude_cart_icon',
				'description' => '',
				'title' => __('Cart Icon', 'themify'),
				'type' => 'dropdownbutton',
				'states' => $states,
				'class' => '',
				'after' => '<div class="clear"></div>',
				'display_callback' => 'themify_is_woocommerce_active'
			    ),
			),
			'description' => '',
			'before' => '',
			'after' => '<div class="clear"></div>',
			'separator' => ''
		    )
		),
		array(
		    'name' => 'mobile_menu_styles',
		    'title' => __('Mobile Menu Style', 'themify'),
		    'type' => 'dropdown',
		    'meta' => array(
			array('name' => __('Default', 'themify'), 'value' => 'default'),
			array('name' => __('Boxed', 'themify'), 'value' => 'boxed'),
			array('name' => __('Dropdown', 'themify'), 'value' => 'dropdown'),
			array('name' => __('Fade Overlay', 'themify'), 'value' => 'fade-overlay'),
			array('name' => __('Fadein Down', 'themify'), 'value' => 'fadein-down'),
			array('name' => __('Flip Down', 'themify'), 'value' => 'flip-down'),
			array('name' => __('FlipIn Left', 'themify'), 'value' => 'flipin-left'),
			array('name' => __('FlipIn Right', 'themify'), 'value' => 'flipin-right'),
			array('name' => __('Flip from Left', 'themify'), 'value' => 'flip-from-left'),
			array('name' => __('Flip from Right', 'themify'), 'value' => 'flip-from-right'),
			array('name' => __('Flip from Top', 'themify'), 'value' => 'flip-from-top'),
			array('name' => __('Flip from Bottom', 'themify'), 'value' => 'flip-from-bottom'),
			array('name' => __('Morphing', 'themify'), 'value' => 'morphing'),
			array('name' => __('Overlay ZoomIn', 'themify'), 'value' => 'overlay-zoomin'),
			array('name' => __('Overlay ZoomIn Right', 'themify'), 'value' => 'overlay-zoomin-right'),
			array('name' => __('Rotate ZoomIn', 'themify'), 'value' => 'rotate-zoomin'),
			array('name' => __('Slide Down', 'themify'), 'value' => 'slide-down'),
			array('name' => __('SlideIn Left', 'themify'), 'value' => 'slidein-left'),
			array('name' => __('SlideIn Right', 'themify'), 'value' => 'slidein-right'),
			array('name' => __('Slide Left Content', 'themify'), 'value' => 'slide-left-content'),
			array('name' => __('Split', 'themify'), 'value' => 'split'),
			array('name' => __('Swing Left to Right', 'themify'), 'value' => 'swing-left-to-right'),
			array('name' => __('Swing Right to Left', 'themify'), 'value' => 'swing-right-to-left'),
			array('name' => __('Swing Top to Bottom', 'themify'), 'value' => 'swing-top-to-bottom'),
			array('name' => __('Swipe Left', 'themify'), 'value' => 'swipe-left'),
			array('name' => __('Swipe Right', 'themify'), 'value' => 'swipe-right'),
			array('name' => __('Zoom Down', 'themify'), 'value' => 'zoomdown'),
		    ),
		),
		// Header Wrap
		array(
		    'name' => 'header_wrap',
		    'title' => __('Header Background Type', 'themify'),
		    'description' => '',
		    'type' => 'radio',
		    'show_title' => true,
		    'meta' => array(
			array(
			    'value' => 'solid',
			    'name' => __('Solid Color/Image', 'themify'),
			    'selected' => true
			),
			array(
			    'value' => 'transparent',
			    'name' => __('Transparent Header', 'themify'),
			),
			array(
			    'value' => 'slider',
			    'name' => __('Image Slider', 'themify'),
			),
			array(
			    'value' => 'video',
			    'name' => __('Video Background', 'themify'),
			),
			array(
			    'value' => 'colors',
			    'name' => __('Animating Colors', 'themify'),
			),
		    ),
		    'enable_toggle' => true,
		    'class' => 'hide-if none clear',
		    'default' => 'solid',
		),
		// Animated Colors
		array(
		    'name' => '_animated_colors',
		    'title' => __('Animating Colors', 'themify'),
		    'description' => sprintf(__('Animating Colors can be configured at <a href="%s">Themify > Settings > Theme Settings</a>', 'themify'), esc_url(add_query_arg('page', 'themify', admin_url('admin.php')))),
		    'type' => 'post_id_info',
		    'toggle' => 'colors-toggle',
		),
		// Select Background Gallery
		array(
		    'name' => 'background_gallery',
		    'title' => __('Header Slider', 'themify'),
		    'description' => '',
		    'type' => 'gallery_shortcode',
		    'toggle' => 'slider-toggle',
		    'class' => 'hide-if none',
		),
		array(
		    'type' => 'multi',
		    'name' => '_video_select',
		    'title' => __('Header Video', 'themify'),
		    'meta' => array(
			'fields' => array(
			    // Video File
			    array(
				'name' => 'video_file',
				'title' => __('Video File', 'themify'),
				'description' => '',
				'type' => 'video',
				'meta' => array(),
			    ),
			),
			'description' => __('Video format: mp4. Note: video background does not play on some mobile devices, background image will be used as fallback.', 'themify'),
			'before' => '',
			'after' => '',
			'separator' => ''
		    ),
		    'toggle' => 'video-toggle',
		    'class' => 'hide-if none',
		),
		// Background image
		array(
		    'name' => 'background_image',
		    'title' => '',
		    'type' => 'image',
		    'description' => '',
		    'meta' => array(),
		    'before' => '',
		    'after' => '',
		    'toggle' => array('solid-toggle', 'video-toggle'),
		    'class' => 'hide-if none',
		),
		// Background repeat
		array(
		    'name' => 'background_repeat',
		    'title' => '',
		    'description' => __('Background Image Mode', 'themify'),
		    'type' => 'dropdown',
		    'meta' => array(
			array(
			    'value' => '',
			    'name' => ''
			),
			array(
			    'value' => 'fullcover',
			    'name' => __('Fullcover', 'themify')
			),
			array(
			    'value' => 'repeat',
			    'name' => __('Repeat all', 'themify')
			),
			array(
			    'value' => 'no-repeat',
			    'name' => __('No repeat', 'themify')
			),
			array(
			    'value' => 'repeat-x',
			    'name' => __('Repeat horizontally', 'themify')
			),
			array(
			    'value' => 'repeat-y',
			    'name' => __('Repeat vertically', 'themify')
			),
		    ),
		    'toggle' => array('solid-toggle', 'video-toggle'),
		    'class' => 'hide-if none',
		),
		// Header Slider Auto
		array(
		    'name' => 'background_auto',
		    'title' => __('Autoplay', 'themify'),
		    'description' => '',
		    'type' => 'dropdown',
		    'meta' => array(
			array('value' => 'yes', 'name' => __('Yes', 'themify'), 'selected' => true),
			array('value' => 'no', 'name' => __('No', 'themify'))
		    ),
		    'toggle' => 'slider-toggle',
		    'default' => 'yes',
		),
		// Header Slider Auto Timeout
		array(
		    'name' => 'background_autotimeout',
		    'title' => __('Autoplay Timeout', 'themify'),
		    'description' => '',
		    'type' => 'dropdown',
		    'meta' => array(
			array('value' => 1, 'name' => __('1 Secs', 'themify')),
			array('value' => 2, 'name' => __('2 Secs', 'themify')),
			array('value' => 3, 'name' => __('3 Secs', 'themify')),
			array('value' => 4, 'name' => __('4 Secs', 'themify')),
			array('value' => 5, 'name' => __('5 Secs', 'themify'), 'selected' => true),
			array('value' => 6, 'name' => __('6 Secs', 'themify')),
			array('value' => 7, 'name' => __('7 Secs', 'themify')),
			array('value' => 8, 'name' => __('8 Secs', 'themify')),
			array('value' => 9, 'name' => __('9 Secs', 'themify')),
			array('value' => 10, 'name' => __('10 Secs', 'themify'))
		    ),
		    'toggle' => 'slider-toggle',
		    'default' => 5,
		),
		// Header Slider Transition Speed
		array(
		    'name' => 'background_speed',
		    'title' => __('Transition Speed', 'themify'),
		    'description' => '',
		    'type' => 'dropdown',
		    'meta' => array(
			array('value' => 1500, 'name' => __('Slow', 'themify')),
			array('value' => 500, 'name' => __('Normal', 'themify'), 'selected' => true),
			array('value' => 300, 'name' => __('Fast', 'themify'))
		    ),
		    'toggle' => 'slider-toggle',
		    'default' => 500,
		),
		// Header Slider Wrap
		array(
		    'name' => 'background_wrap',
		    'title' => __('Wrap Slides', 'themify'),
		    'description' => '',
		    'type' => 'dropdown',
		    'meta' => array(
			array('value' => 'yes', 'name' => __('Yes', 'themify'), 'selected' => true),
			array('value' => 'no', 'name' => __('No', 'themify'))
		    ),
		    'toggle' => 'slider-toggle',
		    'default' => 'yes',
		),
		// Hide Slider Controlls
		array(
		    'name' => 'header_hide_controlls',
		    'title' => __('Hide Slider Controlls', 'themify'),
		    'description' => '',
		    'type' => 'checkbox',
		    'toggle' => 'slider-toggle'
		),
        // Background Color
        array(
            'name' => 'background_color',
            'title' => __('Header Background', 'themify'),
            'description' => '',
            'type' => 'color',
            'meta' => array('default' => null),
            'toggle' => array('solid-toggle', 'slider-toggle', 'video-toggle'),
            'class' => 'hide-if none',
            'format' => 'rgba',
        ),
        // Header wrap text color
		array(
		    'name' => 'headerwrap_text_color',
		    'title' => __('Header Text Color', 'themify'),
		    'description' => '',
		    'type' => 'color',
		    'meta' => array('default' => null),
		    'class' => 'hide-if none',
		    'format' => 'rgba',
		),
		// Header wrap link color
		array(
		    'name' => 'headerwrap_link_color',
		    'title' => __('Header Link Color', 'themify'),
		    'description' => '',
		    'type' => 'color',
		    'meta' => array('default' => null),
		    'class' => 'hide-if none',
		    'format' => 'rgba',
		)
	    ),
	    'default' => '',
	),
	// Footer Group
	array(
	    'name' => 'footer_design_group',
	    'title' => __('Footer', 'themify'),
	    'description' => '',
	    'type' => 'toggle_group',
	    'show_title' => true,
	    'meta' => array(
		// Footer Design
		array(
		    'name' => 'footer_design',
		    'title' => __('Footer Design', 'themify'),
		    'description' => '',
		    'type' => 'layout',
		    'show_title' => true,
		    'meta' => $footer_design_options,
		    'hide' => 'none',
		    'default' => 'default',
		),
		// Footer Elements
		array(
		    'name' => '_multi_footer_elements',
		    'title' => __('Footer Elements', 'themify'),
		    'description' => '',
		    'type' => 'multi',
		    'class' => 'hide-if none',
		    'meta' => array(
			'fields' => array(
			    // Show Site Logo
			    array(
				'name' => 'exclude_footer_site_logo',
				'description' => '',
				'title' => __('Site Logo', 'themify'),
				'type' => 'dropdownbutton',
				'states' => $states,
				'class' => 'hide-if none',
				'after' => '<div class="clear"></div>',
			    ),
			    // Show Footer Widgets
			    array(
				'name' => 'exclude_footer_widgets',
				'description' => '',
				'title' => __('Footer Widgets', 'themify'),
				'type' => 'dropdownbutton',
				'states' => $states,
				'class' => 'hide-if none',
				'after' => '<div class="clear"></div>',
			    ),
			    // Show Menu Navigation
			    array(
				'name' => 'exclude_footer_menu_navigation',
				'description' => '',
				'title' => __('Menu Navigation', 'themify'),
				'type' => 'dropdownbutton',
				'states' => $states,
				'class' => 'hide-if none',
				'after' => '<div class="clear"></div>',
			    ),
			    // Show Texts
			    array(
				'name' => 'exclude_footer_texts',
				'description' => '',
				'title' => __('Footer Text', 'themify'),
				'type' => 'dropdownbutton',
				'states' => $states,
				'class' => 'hide-if none',
				'after' => '<div class="clear"></div>',
			    ),
			    // Show Back to Top
			    array(
				'name' => 'exclude_footer_back',
				'description' => '',
				'title' => __('Back to Top Arrow', 'themify'),
				'type' => 'dropdownbutton',
				'states' => $states,
				'class' => 'hide-if none',
				'after' => '<div class="clear"></div>',
			    ),
			),
			'description' => '',
			'before' => '',
			'after' => '<div class="clear"></div>',
			'separator' => ''
		    )
		),
		// Footer widget position
		array(
		    'name' => 'footer_widget_position',
		    'title' => __('Footer Widgets Position', 'themify'),
		    'class' => 'hide-if none',
		    'description' => '',
		    'type' => 'dropdown',
		    'meta' => array(
			array(
			    'value' => '',
			    'name' => __('Default', 'themify')
			),
			array(
			    'value' => 'bottom',
			    'name' => __('After Footer Text', 'themify')
			),
			array(
			    'value' => 'top',
			    'name' => __('Before Footer Text', 'themify')
			)
		    ),
		)
	    ),
	    'default' => '',
	),
	// Image Filter Group
	array(
	    'name' => 'image_design_group',
	    'title' => __('Image Filter', 'themify'),
	    'description' => '',
	    'type' => 'toggle_group',
	    'show_title' => true,
	    'meta' => array(
		// Image Filter
		array(
		    'name' => 'imagefilter_options',
		    'title' => __('Image Filter', 'themify'),
		    'description' => '',
		    'type' => 'dropdown',
		    'meta' => array(
			array('name' => '', 'value' => 'initial'),
			array('name' => __('None', 'themify'), 'value' => 'none'),
			array('name' => __('Grayscale', 'themify'), 'value' => 'grayscale'),
			array('name' => __('Sepia', 'themify'), 'value' => 'sepia'),
			array('name' => __('Blur', 'themify'), 'value' => 'blur'),
		    ),
		    'default' => 'initial',
		),
		// Image Hover Filter
		array(
		    'name' => 'imagefilter_options_hover',
		    'title' => __('Image Hover Filter', 'themify'),
		    'description' => '',
		    'type' => 'dropdown',
		    'meta' => array(
			array('name' => '', 'value' => 'initial'),
			array('name' => __('None', 'themify'), 'value' => 'none'),
			array('name' => __('Grayscale', 'themify'), 'value' => 'grayscale'),
			array('name' => __('Sepia', 'themify'), 'value' => 'sepia'),
			array('name' => __('Blur', 'themify'), 'value' => 'blur')
		    ),
		    'default' => 'initial'
		),
		// Image Filter Apply To
		array(
		    'name' => 'imagefilter_applyto',
		    'title' => __('Apply Filter To', 'themify'),
		    'description' => sprintf(__('Image filters can be set site-wide at <a href="%s" target="_blank">Themify > Settings > Theme Settings</a>', 'themify'), admin_url('admin.php?page=themify#setting-theme_settings')),
		    'type' => 'radio',
		    'meta' => array(
			array('value' => 'initial', 'name' => __('Theme Default', 'themify')),
			array('value' => 'all', 'name' => __('All Images', 'themify')),
			array('value' => 'featured-only', 'name' => __('Featured Images Only', 'themify'))
		    ),
		    'default' => 'initial'
		)
	    ),
	    'default' => ''
	)
    );
}

function themify_theme_setup_metaboxes($meta_boxes=array(), $post_type='all') {
	$supportedTypes=array('post', 'page', 'portfolio', 'product');
    $dir=THEME_DIR . '/admin/pages/';
    if ( $post_type === 'all' ) {
		add_action('themify_settings_panel_end', 'themify_admin_script_style');
		foreach($supportedTypes as $s){
			require_once( $dir . "$s.php" );
		}
		return $meta_boxes;
    }

	$post_type_object = get_post_type_object( $post_type );
    if(null!==$post_type_object){
        $excluded_post_types = array( 'tbuilder_layout', 'tbuilder_layout_part', 'themify_popup' );
        if ( $post_type_object->public && ! in_array( $post_type_object->name, $excluded_post_types ) ) {
            $meta_boxes = array_merge( array(
                array(
                    'name' => __( 'Page Appearance', 'themify' ),
                    'id' => "{$post_type}-theme-design",
                    'options' => themify_theme_design_meta_box(),
                    'pages' => $post_type,
                )
            ), $meta_boxes );
        }
    }

    if ( ! in_array( $post_type, $supportedTypes, true ) ) {
		return $meta_boxes;
    }
    themify_admin_script_style();
    require_once( $dir . "$post_type.php" );
    $theme_metaboxes = call_user_func_array( "themify_theme_get_{$post_type}_metaboxes", array( array(), &$meta_boxes ) );

    return array_merge($theme_metaboxes, $meta_boxes);
}
if ( ! function_exists( 'themify_theme_setup_CPT_metaboxes' ) ) {
	/*
	* Enable Sticky Sidebar and other such metaboex for custom post types.
	*/
	function themify_theme_setup_CPT_metaboxes($metabox_opt) {
		$sticky_sidebar = array(
			'name' 		=> 'post_sticky_sidebar',
			'title' 		=> __('Sticky Sidebar', 'themify'),
			'description' => '',
			'type' 		=> 'dropdown',
			'show_title' => true,
			'enable_toggle' => true,
			'class'		=> 'hide-if sidebar-none',
			'meta'		=> array(
				array( 'value' => '', 'name' => '', 'selected' => true ),
				array( 'value' => 1, 'name' => __( 'Enable', 'themify' ) ),
				array( 'value' => 0, 'name' => __( 'Disable', 'themify' ) )
			)
		);
		array_splice( $metabox_opt, 1, 0, array($sticky_sidebar) );

		return $metabox_opt;
	}
}
/**
 * Register plugins required for the theme
 *
 * @since 1.0.0
 */
function themify_theme_register_required_plugins($plugins) {
    $plugins[] = array(
	'name' => __(' Themify Portfolio Posts', 'themify'),
	'slug' => 'themify-portfolio-post',
	'source' => 'https://themify.me/files/themify-portfolio-post/themify-portfolio-post.zip',
	'required' => true,
	'version' => '1.0.0',
	'force_activation' => false,
	'force_deactivation' => false,
    );
    return $plugins;
}

/**
 * Allow updating bonus addons for Ultra
 *
 * @since 1.4.8
 */
function themify_theme_bonus_addons_update($match, $subs) {
    $theme = wp_get_theme();
    $theme_name = ( is_child_theme() ) ? $theme->parent()->Name : $theme->display('Name');
    $theme_name = preg_replace('/^Themify\s/', '', $theme_name);
    foreach ($subs as $value) {
	if (( stripos($value['title'], $theme_name) !== false || stripos($value['title'], 'Standard Club') !== false ) && isset($_POST['nicename_short']) && in_array($_POST['nicename_short'], array('Slider Pro', 'Pricing Table', 'Maps Pro', 'Typewriter', 'Image Pro', 'Timeline', 'WooCommmerce', 'Contact', 'Counter', 'Progress Bar', 'Countdown', 'Audio'), true)
	) {
	    $match = 'true';
	    break;
	}
    }

    return $match;
}

function themify_admin_script_style() {
	wp_enqueue_script('themify-admin-script', themify_enque(THEME_URI . '/admin/js/admin-script.js'),null,Themify_Enqueue_Assets::$themeVersion,true);
}

if(isset( $_GET['page'] ) && $_GET['page']==='themify'){
	add_theme_support( 'themify-skins-and-demos' );
    themify_theme_setup_metaboxes();
}
else{
    add_filter('themify_metabox/fields/themify-meta-boxes', 'themify_theme_setup_metaboxes', 10, 2);
	add_filter('themify_post_type_default_options', 'themify_theme_setup_CPT_metaboxes');
}
add_filter('themify_theme_required_plugins', 'themify_theme_register_required_plugins');
add_filter('themify_builder_validate_login', 'themify_theme_bonus_addons_update', 10, 2);

