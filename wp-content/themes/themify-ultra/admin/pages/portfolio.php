<?php

/**
 * Portfolio Meta Box Options
 * @return array
 * @since 1.0.7
 */
if (!function_exists('themify_theme_portfolio_meta_box')) {

    function themify_theme_portfolio_meta_box() {
	return array(
	    // Layout
	    array(
		'name' => 'layout',
		'title' => __('Sidebar Option', 'themify'),
		'description' => '',
		'type' => 'layout',
		'show_title' => true,
		'meta' => array(
		    array('value' => 'default', 'img' => 'themify/img/default.svg', 'selected' => true, 'title' => __('Default', 'themify')),
		    array('value' => 'sidebar1', 'img' => 'images/layout-icons/sidebar1.png', 'title' => __('Sidebar Right', 'themify')),
		    array('value' => 'sidebar1 sidebar-left', 'img' => 'images/layout-icons/sidebar1-left.png', 'title' => __('Sidebar Left', 'themify')),
		    array('value' => 'sidebar2', 'img' => 'images/layout-icons/sidebar2.png', 'title' => __('Left and Right', 'themify')),
		    array('value' => 'sidebar2 content-left', 'img' => 'images/layout-icons/sidebar2-content-left.png', 'title' => __('2 Right Sidebars', 'themify')),
		    array('value' => 'sidebar2 content-right', 'img' => 'images/layout-icons/sidebar2-content-right.png', 'title' => __('2 Left Sidebars', 'themify')),
		    array('value' => 'sidebar-none', 'img' => 'images/layout-icons/sidebar-none.png', 'title' => __('No Sidebar ', 'themify'))
		),
		'default' => 'default',
		'hide' => 'sidebar-none post_sticky_sidebar',
	    ),
	    array(
		'name' => 'post_sticky_sidebar',
		'title' => __('Sticky Sidebar', 'themify'),
		'description' => '',
		'type' => 'dropdown',
		'show_title' => true,
		'class' => 'hide-if sidebar-none',
		'meta' => array(
		    array('value' => '', 'name' => '', 'selected' => true),
		    array('value' => 1, 'name' => __('Enable', 'themify')),
		    array('value' => 0, 'name' => __('Disable', 'themify'))
		),
	    ),
	    //Post Layout
	    array(
		'name' => 'post_layout',
		'title' => __('Portfolio Layout', 'themify'),
		'description' => '',
		'type' => 'layout',
		'show_title' => true,
		'enable_toggle' => true,
		'class' => 'hide-if none',
		'meta' => array(
		    array('value' => '', 'img' => 'themify/img/default.svg', 'selected' => true, 'title' => __('Default', 'themify')),
		    array('value' => 'fullwidth', 'img' => 'images/layout-icons/post-fullwidth.png', 'title' => __('Fullwidth', 'themify')),
		    array('value' => 'classic', 'img' => 'images/layout-icons/post-classic.png', 'title' => __('Classic', 'themify')),
		    array('value' => 'slider', 'img' => 'images/layout-icons/post-slider.png', 'title' => __('Slider', 'themify')),
		    array('value' => 'gallery', 'img' => 'images/layout-icons/post-gallery.png', 'title' => __('Gallery', 'themify')),
		    array('value' => 'split', 'img' => 'images/layout-icons/post-split.png', 'title' => __('Split', 'themify'))
		),
	    ),
	    // Gallery Layout shortcode
	    array(
		'name' => 'post_layout_gallery',
		'title' => '',
		'description' => '',
		'type' => 'gallery_shortcode',
		'toggle' => 'gallery-toggle',
		'class' => 'hide-if none',
	    ),
	    // Slider Layout shortcode
	    array(
		'name' => 'post_layout_slider',
		'title' => '',
		'description' => '',
		'type' => 'gallery_shortcode',
		'toggle' => 'slider-toggle',
		'class' => 'hide-if none',
	    ),
	    // Content Width
	    array(
		'name' => 'content_width',
		'title' => __('Content Width', 'themify'),
		'description' => '',
		'type' => 'layout',
		'show_title' => true,
		'meta' => array(
		    array(
			'value' => 'default_width',
			'img' => 'themify/img/default.svg',
			'selected' => true,
			'title' => __('Default', 'themify')
		    ),
		    array(
			'value' => 'full_width',
			'img' => 'themify/img/fullwidth.svg',
			'title' => __('Fullwidth', 'themify')
		    )
		),
		'default' => 'default_width',
	    ),
	    // Featured Image Size
	    array(
		'name' => 'feature_size',
		'title' => __('Image Size', 'themify'),
		'description' => sprintf(__('Image sizes can be set at <a href="%s">Media Settings</a> and <a href="%s" target="_blank">Regenerated</a>', 'themify'), 'options-media.php', 'https://wordpress.org/plugins/regenerate-thumbnails/'),
		'type' => 'featimgdropdown',
		'display_callback' => 'themify_is_image_script_disabled'
	    ),
	    // Multi field: Image Dimension
	    themify_image_dimensions_field(),
	    // Hide Title
	    array(
		'name' => 'hide_post_title',
		'title' => __('Hide Post Title', 'themify'),
		'description' => '',
		'type' => 'dropdown',
		'meta' => array(
		    array('value' => 'default', 'name' => '', 'selected' => true),
		    array('value' => 'yes', 'name' => __('Yes', 'themify')),
		    array('value' => 'no', 'name' => __('No', 'themify'))
		),
		'default' => 'default',
	    ),
	    // Unlink Post Title
	    array(
		'name' => 'unlink_post_title',
		'title' => __('Unlink Post Title', 'themify'),
		'description' => __('Unlink post title (it will display the post title without link)', 'themify'),
		'type' => 'dropdown',
		'meta' => array(
		    array('value' => 'default', 'name' => '', 'selected' => true),
		    array('value' => 'yes', 'name' => __('Yes', 'themify')),
		    array('value' => 'no', 'name' => __('No', 'themify'))
		),
		'default' => 'default',
	    ),
	    // Hide Post Meta
	    array(
		'name' => 'hide_post_meta',
		'title' => __('Hide Post Meta', 'themify'),
		'description' => '',
		'type' => 'dropdown',
		'meta' => array(
		    array('value' => 'default', 'name' => '', 'selected' => true),
		    array('value' => 'yes', 'name' => __('Yes', 'themify')),
		    array('value' => 'no', 'name' => __('No', 'themify'))
		),
		'default' => 'default',
	    ),
	    // Hide Post Image
	    array(
		'name' => 'hide_post_image',
		'title' => __('Hide Featured Image', 'themify'),
		'description' => '',
		'type' => 'dropdown',
		'meta' => array(
		    array('value' => 'default', 'name' => '', 'selected' => true),
		    array('value' => 'yes', 'name' => __('Yes', 'themify')),
		    array('value' => 'no', 'name' => __('No', 'themify'))
		),
		'default' => 'default',
	    ),
	    // Unlink Post Image
	    array(
		'name' => 'unlink_post_image',
		'title' => __('Unlink Featured Image', 'themify'),
		'description' => __('Display the Featured Image without link', 'themify'),
		'type' => 'dropdown',
		'meta' => array(
		    array('value' => 'default', 'name' => '', 'selected' => true),
		    array('value' => 'yes', 'name' => __('Yes', 'themify')),
		    array('value' => 'no', 'name' => __('No', 'themify'))
		),
		'default' => 'default',
	    ),
	    // External Link
	    array(
		'name' => 'external_link',
		'title' => __('External Link', 'themify'),
		'description' => __('Link Featured Image and Post Title to external URL', 'themify'),
		'type' => 'textbox',
		'meta' => array()
	    ),
	    // Lightbox Link
	    themify_lightbox_link_field(),
	    // Custom menu
	    array(
		'name' => 'custom_menu',
		'title' => __('Custom Menu', 'themify'),
		'description' => '',
		'type' => 'dropdown',
		// extracted from $args
		'meta' => themify_get_available_menus(),
	    ),
	    // Separator - Project Information
	    array(
		'name' => '_separator_project_info',
		'title' => '',
		'description' => '',
		'type' => 'separator',
		'meta' => array(
		    'html' => '<h4>' . __('Project Info', 'themify') . '</h4><hr class="meta_fields_separator"/>'
		),
	    ),
	    // Project Date
	    array(
		'name' => 'project_date',
		'title' => __('Date', 'themify'),
		'description' => '',
		'type' => 'textbox',
		'meta' => array()
	    ),
	    // Project Client
	    array(
		'name' => 'project_client',
		'title' => __('Client', 'themify'),
		'description' => '',
		'type' => 'textbox',
		'meta' => array()
	    ),
	    // Project Services
	    array(
		'name' => 'project_services',
		'title' => __('Services', 'themify'),
		'description' => '',
		'type' => 'textbox',
		'meta' => array()
	    ),
	    // Project Launch
	    array(
		'name' => 'project_launch',
		'title' => __('Link to Launch', 'themify'),
		'description' => '',
		'type' => 'textbox',
		'meta' => array()
	    ),
	);
    }

}
if (!function_exists('themify_default_portfolio_single_layout')) {

    /**
     * Default Single Portfolio Layout
     * @param array $data
     * @return string
     */
    function themify_default_portfolio_single_layout($data = array()) {
	/**
	 * Associative array containing theme settings
	 * @var array
	 */
	$data = themify_get_data();

	/**
	 * Variable prefix key
	 * @var string
	 */
	$prefix = 'setting-default_portfolio_single_';

	/**
	 * Sidebar Layout
	 * @var string
	 */
	$layout = isset($data[$prefix . 'layout']) ? $data[$prefix . 'layout'] : '';

	/**
	 * Basic default options '', 'yes', 'no'
	 * @var array
	 */
	$default_options = array(
	    array('name' => '', 'value' => ''),
	    array('name' => __('Yes', 'themify'), 'value' => 'yes'),
	    array('name' => __('No', 'themify'), 'value' => 'no')
	);

	/**
	 * Sidebar Layout Options
	 * @var array
	 */
	$sidebar_options = array(
	    array('value' => 'sidebar1', 'img' => 'images/layout-icons/sidebar1.png', 'title' => __('Sidebar Right', 'themify')),
	    array('value' => 'sidebar1 sidebar-left', 'img' => 'images/layout-icons/sidebar1-left.png', 'title' => __('Sidebar Left', 'themify')),
	    array('value' => 'sidebar2', 'img' => 'images/layout-icons/sidebar2.png', 'title' => __('Left and Right', 'themify')),
	    array('value' => 'sidebar2 content-left', 'img' => 'images/layout-icons/sidebar2-content-left.png', 'title' => __('2 Right Sidebars', 'themify')),
	    array('value' => 'sidebar2 content-right', 'img' => 'images/layout-icons/sidebar2-content-right.png', 'title' => __('2 Left Sidebars', 'themify')),
	    array('value' => 'sidebar-none', 'img' => 'images/layout-icons/sidebar-none.png', 'selected' => true, 'title' => __('No Sidebar', 'themify')),
	);

	/**
	 * Post Layout options
	 * @var array
	 */
	$post_layout = array(
	    array('selected' => true, 'value' => 'fullwidth', 'img' => 'images/layout-icons/post-fullwidth.png', 'title' => __('Fullwidth', 'themify')),
	    array('value' => 'classic', 'img' => 'images/layout-icons/post-classic.png', 'title' => __('Classic', 'themify')),
	    array('value' => 'slider', 'img' => 'images/layout-icons/post-slider.png', 'title' => __('Slider', 'themify')),
	    array('value' => 'gallery', 'img' => 'images/layout-icons/post-gallery.png', 'title' => __('Gallery', 'themify')),
	    array('value' => 'split', 'img' => 'images/layout-icons/post-split.png', 'title' => __('Split', 'themify'))
	);

	/**
	 * HTML for settings panel
	 * @var string
	 */
	$output = '<p><span class="label">' . __('Portfolio Sidebar Option', 'themify') . '</span>';
	foreach ($sidebar_options as $option) {
	    if ((!isset($layout) || !$layout ) && ( isset($option['selected']) && $option['selected'] )) {
		$layout = $option['value'];
	    }
	    if ($layout == $option['value']) {
		$class = 'selected';
	    } else {
		$class = '';
	    }
	    $output .= '<a href="#" class="preview-icon ' . $class . '" title="' . $option['title'] . '"><img src="' . THEME_URI . '/' . $option['img'] . '" alt="' . $option['value'] . '"  /></a>';
	}
	$output .= '<input type="hidden" name="' . $prefix . 'layout" class="val" value="' . $layout . '" />';
	$output .= '</p>';

	$output .= '<p class="pushlabel">
						<label for="' . esc_attr($prefix) . 'sticky_sidebar">
							<input type="checkbox" id="' . esc_attr($prefix) . 'sticky_sidebar" name="' . esc_attr($prefix) . 'sticky_sidebar" value="1"
							' . checked(themify_get(esc_attr($prefix) . "sticky_sidebar"), 1, false) . '
							/>' . __('Enable sticky sidebar', 'themify') . '
						</label>
					</p>';

	/**
	 * Post Layout placement
	 */
	$output .= '<p>
						<span class="label">' . __('Portfolio Layout', 'themify') . '</span>';
	$val = themify_get($prefix . 'portfolio_layout_type');
	foreach ($post_layout as $option) {
	    if (!$val && !empty($option['selected'])) {
		$val = $option['value'];
	    }
	    if ($val == $option['value']) {
		$class = 'selected';
	    } else {
		$class = '';
	    }
	    $output .= '<a href="#" class="preview-icon ' . $class . '" title="' . $option['title'] . '"><img src="' . THEME_URI . '/' . $option['img'] . '" alt="' . $option['value'] . '"  /></a>';
	}
	$output .= '	<input type="hidden" name="' . $prefix . 'portfolio_layout_type" class="val" value="' . $val . '" />
					</p>';
	/**
	 * HTML for settings panel
	 * @var string
	 */
	$output .= '<p>
						<span class="label">' . __('Hide Portfolio Title', 'themify') . '</span>
						<select name="' . $prefix . 'title">' .
		themify_options_module($default_options, $prefix . 'title') . '
						</select>
					</p>';

	$output .= '<p>
						<span class="label">' . __('Unlink Portfolio Title', 'themify') . '</span>
						<select name="' . $prefix . 'unlink_post_title">' .
		themify_options_module($default_options, $prefix . 'unlink_post_title') . '
						</select>
					</p>';

	$output .= '<p>
						<span class="label">' . __('Hide Portfolio Date', 'themify') . '</span>
						<select name="' . $prefix . 'hide_post_date">' .
		themify_options_module($default_options, $prefix . 'hide_post_date') . '
						</select>
					</p>';

	// Hide Post Meta /////////////////////////////////////////
	$output .= '<p>
						<span class="label">' . __('Hide Portfolio Meta', 'themify') . '</span>
						<select name="' . $prefix . 'post_meta_category">' .
		themify_options_module($default_options, $prefix . 'post_meta_category') . '
						</select>
					</p>';

        // Hide Portfolio Image /////////////////////////////////////////
        $output .= '<p>
					<span class="label">' . __('Hide Portfolio Image', 'themify') . '</span>
					<select name="' . $prefix . 'image">' .themify_options_module($default_options, $prefix . 'image') . '</select>
				</p>';

	$output .= '<p>
						<span class="label">' . __('Unlink Portfolio Image', 'themify') . '</span>
						<select name="' . esc_attr($prefix . 'unlink_post_image') . '">' . themify_options_module($default_options, $prefix . 'unlink_post_image', true, '') . '
						</select>
					</p>';
	/**
	 * Image Dimensions
	 */
	$output .= '
			<p>
				<span class="label">' . __('Image Size', 'themify') . '</span>
				<input type="text" class="width2" name="' . $prefix . 'image_post_width" value="' . themify_get($prefix . 'image_post_width') . '" /> ' . __('width', 'themify') . ' <small>(px)</small>
				<input type="text" class="width2 show_if_enabled_img_php" name="' . $prefix . 'image_post_height" value="' . themify_get($prefix . 'image_post_height') . '" /> <span class="show_if_enabled_img_php">' . __('height', 'themify') . ' <small>(px)</small></span>
			</p>';

	// Portfolio Navigation
	$prefix = 'setting-portfolio_nav_';
	$output .= '
			<p>
				<span class="label">' . __('Portfolio Navigation', 'themify') . '</span>
				<label for="' . $prefix . 'disable">
					<input type="checkbox" id="' . $prefix . 'disable" name="' . $prefix . 'disable" ' . checked(themify_get($prefix . 'disable'), 'on', false) . '/> ' . __('Remove portfolio navigation', 'themify') . '
				</label>
				<span class="pushlabel vertical-grouped">
				<label for="' . $prefix . 'same_cat">
					<input type="checkbox" id="' . $prefix . 'same_cat" name="' . $prefix . 'same_cat" ' . checked(themify_get($prefix . 'same_cat'), 'on', false) . '/> ' . __('Show only portfolios in the same category', 'themify') . '
				</label>
				</span>
			</p>';

	$output .= '
			<p>
				<span class="label">' . __('Portfolio Comments', 'themify') . '</span>
				<label for="setting-portfolio_comments">
					<input type="checkbox" id="setting-portfolio_comments" name="setting-portfolio_comments" ' . checked(themify_get('setting-portfolio_comments'), 'on', false) . '/> ' . __('Enable portfolio comments', 'themify') . '
				</label>
			</p>';

	return $output;
    }

}

if (!function_exists('themify_default_portfolio_index_layout')) {

    /**
     * Default Archive Portfolio Layout
     * @param array $data
     * @return string
     */
    function themify_default_portfolio_index_layout($data = array()) {
	/**
	 * Associative array containing theme settings
	 * @var array
	 */
	$data = themify_get_data();
	/**
	 * Variable prefix key
	 * @var string
	 */
	$prefix = 'setting-default_portfolio_index_';
	/**
	 * Basic default options '', 'yes', 'no'
	 * @var array
	 */
	$default_options = array(
	    array('name' => '', 'value' => ''),
	    array('name' => __('Yes', 'themify'), 'value' => 'yes'),
	    array('name' => __('No', 'themify'), 'value' => 'no')
	);
	/**
	 * Default options 'yes', 'no'
	 * @var array
	 */
	$binary_options = array(
	    array('name' => __('Yes', 'themify'), 'value' => 'yes'),
	    array('name' => __('No', 'themify'), 'value' => 'no')
	);
	/**
	 * Sidebar Layout
	 * @var string
	 */
	$layout = isset($data[$prefix . 'layout']) ? $data[$prefix . 'layout'] : '';
	/**
	 * Sidebar Layout Options
	 * @var array
	 */
	$sidebar_options = array(
	    array('value' => 'sidebar1', 'img' => 'images/layout-icons/sidebar1.png', 'title' => __('Sidebar Right', 'themify')),
	    array('value' => 'sidebar1 sidebar-left', 'img' => 'images/layout-icons/sidebar1-left.png', 'title' => __('Sidebar Left', 'themify')),
	    array('value' => 'sidebar2', 'img' => 'images/layout-icons/sidebar2.png', 'title' => __('Left and Right', 'themify')),
	    array('value' => 'sidebar2 content-left', 'img' => 'images/layout-icons/sidebar2-content-left.png', 'title' => __('2 Right Sidebars', 'themify')),
	    array('value' => 'sidebar2 content-right', 'img' => 'images/layout-icons/sidebar2-content-right.png', 'title' => __('2 Left Sidebars', 'themify')),
	    array('value' => 'sidebar-none', 'img' => 'images/layout-icons/sidebar-none.png', 'selected' => true, 'title' => __('No Sidebar', 'themify')),
	);
	/**
	 * Post Layout Options
	 * @var array
	 */
	$post_layout_options = array(
	    array('value' => 'list-post', 'img' => 'images/layout-icons/list-post.png', 'title' => __('List Post', 'themify')),
	    array('value' => 'grid2', 'img' => 'images/layout-icons/grid2.png', 'title' => __('Grid 2', 'themify')),
	    array('value' => 'grid3', 'img' => 'images/layout-icons/grid3.png', 'title' => __('Grid 3', 'themify'), 'selected' => true),
	    array('value' => 'grid4', 'img' => 'images/layout-icons/grid4.png', 'title' => __('Grid 4', 'themify')),
		array('value' => 'grid5', 'img' => 'images/layout-icons/grid5.png','title' => __('Grid 5', 'themify')),
		array('value' => 'grid6','img' => 'images/layout-icons/grid6.png','title' => __('Grid 6', 'themify')),
	    array('value' => 'auto_tiles', 'img' => 'images/layout-icons/auto-tiles.png', 'title' => __('Tiles', 'themify'))
	);
	/**
	 * HTML for settings panel
	 * @var string
	 */
	$output = '<p>
						<span class="label">' . __('Portfolio Sidebar Option', 'themify') . '</span>';
	foreach ($sidebar_options as $option) {
	    if (( '' == $layout || !$layout || !isset($layout) ) && ( isset($option['selected']) && $option['selected'] )) {
		$layout = $option['value'];
	    }
	    if ($layout == $option['value']) {
		$class = 'selected';
	    } else {
		$class = '';
	    }
	    $output .= '<a href="#" class="preview-icon ' . $class . '" title="' . $option['title'] . '"><img src="' . THEME_URI . '/' . $option['img'] . '" alt="' . $option['value'] . '"  /></a>';
	}
	$output .= '<input type="hidden" name="' . $prefix . 'layout" class="val" value="' . $layout . '" />';
	$output .= '</p>';

	$output .= '<p class="pushlabel">
						<label for="' . esc_attr($prefix) . 'sticky_sidebar">
							<input type="checkbox" id="' . esc_attr($prefix) . 'sticky_sidebar" name="' . esc_attr($prefix) . 'sticky_sidebar" value="1"
							' . checked(themify_get(esc_attr($prefix) . "sticky_sidebar"), 1, false) . '
							/>' . __('Enable sticky sidebar', 'themify') . '
						</label>
					</p>';
	/**
	 * Post Layout
	 */
	$output .= '<p>
						<span class="label">' . __('Portfolio Layout', 'themify') . '</span>';

	$val = isset($data[$prefix . 'post_layout']) ? $data[$prefix . 'post_layout'] : '';

	foreach ($post_layout_options as $option) {
	    if (( '' == $val || !$val || !isset($val) ) && ( isset($option['selected']) && $option['selected'] )) {
		$val = $option['value'];
	    }
	    if ($val == $option['value']) {
		$class = "selected";
	    } else {
		$class = "";
	    }
	    $output .= '<a href="#" class="preview-icon ' . $class . '" title="' . $option['title'] . '"><img src="' . THEME_URI . '/' . $option['img'] . '" alt="' . $option['value'] . '"  /></a>';
	}

	$output .= '	<input type="hidden" name="' . $prefix . 'post_layout" class="val" value="' . $val . '" />
					</p>';

	/**
	 * Post Content Layout
	 */
	$output .= '<p>
					<span class="label">' . __('Post Content Layout', 'themify') . '</span>
					<select name="setting-portfolio_content_layout">' .
		themify_options_module(array(
		    array('name' => __('Default', 'themify'), 'value' => ''),
		    array('name' => __('Overlay', 'themify'), 'value' => 'overlay'),
		    array('name' => __('Polaroid', 'themify'), 'value' => 'polaroid'),
		    array('name' => __('Boxed', 'themify'), 'value' => 'boxed'),
		    array('name' => __('Flip', 'themify'), 'value' => 'flip')
			), 'setting-portfolio_content_layout') . '
					</select>
				</p>';

	/**
	 * Enable Post Filter
	 */
	$output .= '<p><span class="label">' . __('Post Filter', 'themify') . '</span>
			<select name="setting-portfolio_post_filter">'
		. themify_options_module($binary_options, 'setting-portfolio_post_filter') . '
			</select>
		</p>';

	/**
	 * Enable Masonry
	 */
	$output .= '<p>
						<span class="label">' . __('Masonry Layout', 'themify') . '</span>
						<select name="setting-portfolio_disable_masonry">' .
		themify_options_module($binary_options, 'setting-portfolio_disable_masonry') . '
						</select>
					</p>';

        $output .= '<p><span class="label">' . __('Align Posts', 'themify') . '</span>
				<label><input type="checkbox" name="setting-portfolio_masonry_align" ' . checked(themify_check('setting-portfolio_masonry_align',true), true, false) . ' /></label></p>';
	/**
	 * Post Gutter
	 */
	$output .= '<p>
					<span class="label">' . __('Post Gutter', 'themify') . '</span>
					<select name="setting-portfolio_gutter">' .
		themify_options_module(array(
		    array('name' => __('Default', 'themify'), 'value' => 'gutter'),
		    array('name' => __('No gutter', 'themify'), 'value' => 'no-gutter')
			), 'setting-portfolio_gutter') . '
					</select>
				</p>';
	/**
	 * Display Content
	 */
	$output .= '<p>
						<span class="label">' . __('Display Content', 'themify') . '</span>
						<select name="' . $prefix . 'display">' .
		themify_options_module(array(
		    array('name' => __('None', 'themify'), 'value' => 'none'),
		    array('name' => __('Full Content', 'themify'), 'value' => 'content'),
		    array('name' => __('Excerpt', 'themify'), 'value' => 'excerpt')
			), $prefix . 'display') . '
						</select>
					</p>';

	$output .= '<p>
						<span class="label">' . __('Hide Portfolio Title', 'themify') . '</span>
						<select name="' . $prefix . 'title">' .
		themify_options_module($default_options, $prefix . 'title') . '
						</select>
					</p>';

	$output .= '<p>
						<span class="label">' . __('Unlink Portfolio Title', 'themify') . '</span>
						<select name="' . $prefix . 'unlink_post_title">' .
		themify_options_module($default_options, $prefix . 'unlink_post_title') . '
						</select>
					</p>';

	$output .= '<p>
						<span class="label">' . __('Hide Portfolio Date', 'themify') . '</span>
						<select name="' . $prefix . 'hide_post_date">' .
		themify_options_module($default_options, $prefix . 'hide_post_date') . '
						</select>
					</p>';

	// Hide Post Meta /////////////////////////////////////////
	$output .= '<p>
						<span class="label">' . __('Hide Portfolio Meta', 'themify') . '</span>
						<select name="' . $prefix . 'post_meta_category">' .
		themify_options_module($default_options, $prefix . 'post_meta_category', true, '') . '
						</select>
					</p>';

        // Hide Portfolio Image /////////////////////////////////////////
        $output .= '<p>
					<span class="label">' . __('Hide Portfolio Image', 'themify') . '</span>
					<select name="' . $prefix . 'image">' .themify_options_module($default_options, $prefix . 'image') . '</select>
				</p>';

	$output .= '<p>
						<span class="label">' . __('Unlink Portfolio Image', 'themify') . '</span>
						<select name="' . esc_attr($prefix . 'unlink_post_image') . '">' . themify_options_module($default_options, $prefix . 'unlink_post_image', true, '') . '
						</select>
					</p>';
	/**
	 * Image Dimensions
	 */
	$output .= '<p>
						<span class="label">' . __('Image Size', 'themify') . '</span>
						<input type="text" class="width2" name="' . $prefix . 'image_post_width" value="' . themify_get($prefix . 'image_post_width') . '" /> ' . __('width', 'themify') . ' <small>(px)</small>
						<input type="text" class="width2 show_if_enabled_img_php" name="' . $prefix . 'image_post_height" value="' . themify_get($prefix . 'image_post_height') . '" /> <span class="show_if_enabled_img_php">' . __('height', 'themify') . ' <small>(px)</small></span>
					</p>';
	return $output;
    }

}

if (!function_exists('themify_portfolio_slug')) {

    /**
     * Portfolio Slug
     * @param array $data
     * @return string
     */
    function themify_portfolio_slug($data = array()) {
	$data = themify_get_data();
	$portfolio_slug = isset($data['themify_portfolio_slug']) ? $data['themify_portfolio_slug'] : apply_filters('themify_portfolio_rewrite', 'project');
	$output = '
			<p>
				<span class="label">' . __('Portfolio Base Slug', 'themify') . '</span>
				<input type="text" name="themify_portfolio_slug" value="' . $portfolio_slug . '" class="slug-rewrite">
			</p>';
	$portfolio_category_slug = isset($data['themify_portfolio_category_slug']) ? $data['themify_portfolio_category_slug'] : apply_filters('themify_portfolio_category_rewrite', 'portfolio-category');
	$output .= '
			<p>
				<span class="label">' . __('Portfolio Category Slug', 'themify') .themify_help(sprintf(__('Use only lowercase letters, numbers, underscores and dashes. After changing this, go to <a href="%s">permalinks</a> and click "Save changes" to refresh them.', 'themify'), admin_url('options-permalink.php'))) . '</span>
				<input type="text" name="themify_portfolio_category_slug" value="' . $portfolio_category_slug . '" class="slug-rewrite">
			</p>';
	return $output;
    }

}

/**
 * Options get metabox
 * @since 1.0.0
 * @var array
 */
if (!function_exists('themify_theme_get_portfolio_metaboxes')) {

    function themify_theme_get_portfolio_metaboxes(array $args, &$meta_boxes) {
	/* remove the "portfolio-options" metabox added by Portfolio module in Builder */
	foreach ($meta_boxes as $i => $m) {
	    if ($m['id'] === 'portfolio-options' && $m['pages'] === 'portfolio') {
		unset($meta_boxes[$i]);
		break;
	    }
	}
	return array(
	    array(
		'name' => __('Portfolio Options', 'themify'),
		'id' => 'portfolio-options',
		'options' => themify_theme_portfolio_meta_box(),
		'pages' => 'portfolio'
	    ),
	);
    }

}
