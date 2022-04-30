<?php
/**
 * Blogtory functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Blogtory
 */

if ( ! function_exists( 'blogtory_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function blogtory_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on Blogtory, use a find and replace
		 * to change 'blogtory' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'blogtory', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		register_nav_menus( array(
			'top-menu' => esc_html__( 'Top Menu', 'blogtory' ),
			'primary-menu' => esc_html__( 'Primary Menu', 'blogtory' ),
			'social-menu' => esc_html__( 'Social Menu', 'blogtory' ),
			'footer-menu' => esc_html__( 'Footer Menu', 'blogtory' ),
		) );

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support( 'html5', array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		) );

		// Set up the WordPress core custom background feature.
		add_theme_support( 'custom-background', apply_filters( 'blogtory_custom_background_args', array(
			'default-color' => 'ffffff',
			'default-image' => '',
		) ) );

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
		add_theme_support( 'custom-logo', array(
			'height'      => 100,
			'width'       => 350,
			'flex-width'  => true,
			'flex-height' => true,
		) );

        add_image_size( 'blogtory-slide-full', 1980, 800, true );
        add_image_size( 'blogtory-slide-boxed', 1170, 600, true );

        add_image_size( 'blogtory-small', 220, 150, true );

        add_image_size( 'blogtory-carousel-full', 800, 450, true );
        add_image_size( 'blogtory-carousel-boxed', 780, 470, true );

        add_image_size( 'blogtory-vertical', 500, 500, true );
        add_image_size( 'blogtory-horizontal', 650, 250, true );

        // Theme supports wide images, galleries and videos.
        add_theme_support( 'align-wide' );
        add_theme_support( 'responsive-embeds' );
        add_theme_support( 'wp-block-styles' );

	}
endif;
add_action( 'after_setup_theme', 'blogtory_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function blogtory_content_width() {
	// This variable is intended to be overruled from themes.
	// Open WPCS issue: {@link https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards/issues/1043}.
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
	$GLOBALS['content_width'] = apply_filters( 'blogtory_content_width', 640 );
}
add_action( 'after_setup_theme', 'blogtory_content_width', 0 );

/**
 * Get google fonts url
 */
if (!function_exists('blogtory_fonts_url')) :

    /**
     * Return fonts URL.
     *
     * @since 1.0.0
     * @return string Fonts URL.
     */
    function blogtory_fonts_url(){

        $fonts_url = '';
        $fonts = array();
        $subsets = 'latin,latin-ext';


        /* translators: If there are characters in your language that are not supported by Roboto Condensed, translate this to 'off'. Do not translate into your own language. */
        if ('off' !== _x('on', 'Inter: on or off', 'blogtory')) {
            $fonts[] = 'Inter:400,400i,500';
        }

        /* translators: If there are characters in your language that are not supported by Open Sans, translate this to 'off'. Do not translate into your own language. */
        if ('off' !== _x('on', 'Open+Sans: on or off', 'blogtory')) {
            $fonts[] = 'Open+Sans:400,700';
        }


        if ($fonts) {
            $fonts_url = add_query_arg(array(
                'family' => urldecode(implode('|', $fonts)),
                'subset' => urldecode($subsets),
            ), 'https://fonts.googleapis.com/css');
        }
        return $fonts_url;
    }
endif;

/**
 * Enqueue scripts and styles.
 */
function blogtory_scripts() {

    $min = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

    // Font Loader
    require_once get_theme_file_path( 'lib/font-loader/wptt-webfont-loader.php' );
    
    wp_enqueue_style('bootstrap', get_template_directory_uri().'/assets/lib/bootstrap/css/bootstrap'.$min.'.css');
    wp_enqueue_style('animate', get_template_directory_uri() . '/assets/lib/animate/animate'. $min . '.css');
    wp_enqueue_style('owl-carousel', get_template_directory_uri() . '/assets/lib/owl/owl.carousel'. $min . '.css');
    wp_enqueue_style('owl-theme', get_template_directory_uri() . '/assets/lib/owl/owl.theme.default'. $min . '.css');

    /*Load WooCommerce Compatibility css file*/
    if(blogtory_is_wc_active()){
        wp_enqueue_style( 'blogtory-woocommerce-style', get_template_directory_uri() . '/woocommerce.css' );
        $font_path   = WC()->plugin_url() . '/assets/fonts/';
        $inline_font = '@font-face {
			font-family: "star";
			src: url("' . $font_path . 'star.eot");
			src: url("' . $font_path . 'star.eot?#iefix") format("embedded-opentype"),
				url("' . $font_path . 'star.woff") format("woff"),
				url("' . $font_path . 'star.ttf") format("truetype"),
				url("' . $font_path . 'star.svg#star") format("svg");
			font-weight: normal;
			font-style: normal;
		}';
        wp_add_inline_style( 'blogtory-woocommerce-style', $inline_font );
    }

    if ( is_child_theme() ) {
        wp_enqueue_style( 'blogtory-parent-style', trailingslashit( get_template_directory_uri() ) . 'style.css' );
    }

    wp_enqueue_style( 'blogtory-style', get_stylesheet_uri() );

    $fonts_url = blogtory_fonts_url();
    if (!empty($fonts_url)) {
        wp_enqueue_style('blogtory-google-fonts', wptt_get_webfont_url($fonts_url), array(), null);
    }

    wp_enqueue_script('bootstrap', get_template_directory_uri().'/assets/lib/bootstrap/js/bootstrap'.$min.'.js', array('jquery'), '', true);
    wp_enqueue_script( 'owl-carousel', get_template_directory_uri() . '/assets/lib/owl/owl.carousel'.$min.'.js', array('jquery'), '', true );
    wp_enqueue_script( 'marquee', get_template_directory_uri() . '/assets/lib/marquee/jquery.marquee'.$min.'.js', array('jquery'), '', true );

    $global_sticky_sidebar = blogtory_get_option('sticky_sidebar');
    $front_page_sticky_sidebar = blogtory_get_option('front_page_sticky_sidebar');

    if($front_page_sticky_sidebar || $global_sticky_sidebar){
        if($front_page_sticky_sidebar && !$global_sticky_sidebar){
            if(is_front_page()){
                wp_enqueue_script('sticky-sidebar', get_template_directory_uri().'/assets/lib/theia-sticky-sidebar/theia-sticky-sidebar'.$min.'.js', array('jquery'), '', true);
            }
        }elseif(!$front_page_sticky_sidebar && $global_sticky_sidebar){
            if(!is_front_page()){
                wp_enqueue_script('sticky-sidebar', get_template_directory_uri().'/assets/lib/theia-sticky-sidebar/theia-sticky-sidebar'.$min.'.js', array('jquery'), '', true);
            }
        }else{
            wp_enqueue_script('sticky-sidebar', get_template_directory_uri().'/assets/lib/theia-sticky-sidebar/theia-sticky-sidebar'.$min.'.js', array('jquery'), '', true);
        }
    }

    wp_enqueue_script( 'blogtory-skip-link-focus-fix', get_template_directory_uri() . '/assets/unfold/js/skip-link-focus-fix.js', array(), '', true );

    wp_enqueue_script( 'blogtory-index', get_template_directory_uri() . '/assets/unfold/js/index' . $min . '.js', array( 'jquery'), '', true );
    wp_enqueue_script( 'blogtory-script', get_template_directory_uri() . '/assets/unfold/js/script' . $min . '.js', array( 'jquery'), '', true );

    $args['owl_svg_prev'] = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 24c6.627 0 12-5.373 12-12s-5.373-12-12-12-12 5.373-12 12 5.373 12 12 12zm-1-17v4h8v2h-8v4l-6-5 6-5z"/></svg>';
    $args['owl_svg_next'] = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 17v-4h-8v-2h8v-4l6 5-6 5z"/></svg>';

    $args['stickySidebarGlobal'] = $global_sticky_sidebar;
    $args['stickySidebarFrontPage'] = $front_page_sticky_sidebar;

    wp_localize_script('blogtory-script', 'blogTory', $args);

    if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    }
}
add_action( 'wp_enqueue_scripts', 'blogtory_scripts' );

/*
 * Print Some css for backend
*/
if(!function_exists('blogtory_admin_print_styles')):
    function blogtory_admin_print_styles() {
        ?>
        <style>
            .em-radio-image input[type=radio] {
                display: none;
            }
            .em-radio-image input[type=radio] + label {
                display: inline-block;
                max-width: 50%;
                width: auto;
                height: auto;
                overflow: hidden;
                margin-right: 9px;
                /*margin-bottom: 9px;*/
                border: 3px solid transparent;
                transition: all 300ms ease-out;
            }
            .em-radio-image input[type=radio] + label:hover{
                opacity: 0.7;
            }
            .em-radio-image input[type=radio]:checked + label {
                border: 3px solid #fff;
                /*-webkit-box-shadow: 0 0 1px #adadad;
                box-shadow: 0 0 10px 1px #00ADB5;*/
                position: relative;
            }
            .em-radio-image input[type=radio]:checked + label:before {
                position: absolute;
                width: 100%;
                height: 100%;
                content: '';
                top: 0;
                left: 0;
                background: rgba(0, 173, 181, 0.50);
            }
        </style>
        <?php
    }
endif;
add_action( 'admin_print_styles', 'blogtory_admin_print_styles', 10 );

/**
 * Load all required files.
 */
require get_template_directory() . '/inc/init.php';