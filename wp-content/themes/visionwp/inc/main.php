<?php
/**
 * Main class of the theme
 * @since 1.0.0
 * @package Visionwp WordPress Theme
 */
if( !class_exists( 'VisionWP_Main' ) ) {
	class VisionWP_Main{

		public function __construct() {			
			add_action( 'after_setup_theme', function() {
				$this->register_menus();
				$this->visionwp_theme_supports();
			});

			add_action( 'init', array( $this, 'load_scripts' ) );
			
			# regtister sidebars
			add_action( 'widgets_init', array( $this, 'register_sidebars' ) );

			#add class for sticky header
			add_action( 'body_class', array(  $this, 'body_class' ) );

			# plugin recommendation
			add_action( 'tgmpa_register', array( $this, 'register_required_plugins' ) );

			add_filter( 'excerpt_length', array( $this, 'excerpt_length' ) );

			add_action( 'customize_register', array( $this, 'customize_register' ) );

			add_filter( 'excerpt_more', array( $this, 'excerpt_more' ) );

			add_filter( 'breadcrumb_trail_labels', array( $this, 'change_home_title' ) );

			add_action( 'after_setup_theme', array( $this, 'visionwp_theme_supports' ) );
		}

		/**
		 * Enqueue scripts and styles
		 * @since 1.0.0
		 * @package VisionWP WordPress Theme
		 */
		public function load_scripts() {
			global $wp_query;
			new VisionWP_Scripts(array(
				array(
					'handle' => 'theme-style',
					'style'  => 'style.css',
				),
				array(
					'handle' => 'main-style',
					'style'  => 'assets/css/visionwp-style.css',
				),
				array(
					'handle' => 'google-font',
					'style'  => 'https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@100;300;500;700&family=Roboto:wght@100;300;400&family=Ubuntu:wght@300;400;500;700&display=swap',
					'absolute' => true,
				),
				array(
					'handle'  => 'fontawesome',
					'style'   => 'assets/vendor/font-awesome/css/font-awesome.css',
					'version' => '4.7.0',
				),
				array(
					'handle' => 'sticky-js',
					'script' => 'assets/js/jquery.sticky.js',
				),
				array(
					'handle' => 'visionwp-script',
					'script' => 'assets/js/script.js',
					'localize'	=> array(
						'key'	=> 'VISIONWPLOADMORE',
						'data'	=> array(
							'admin_url'	=> admin_url( 'admin-ajax.php' ),
							'nonce'	=> wp_create_nonce( 'visionwp-loadmore-nonce' ),
						),
					),
				),
			));

			new VisionWP_Scripts(array(
				array(
					'handle' => 'editor-style',
					'style'  => 'assets/css/editor-style.css',
				),
			), 'enqueue_block_editor_assets' );

			if( ( is_single() || is_page() ) && comments_open() && get_option( 'thread_comments' ) ) {
				wp_enqueue_script( 'comment-reply' );
			}
		}

		/**
		 * Register menu for theme
		 * @since 1.0.0
		 * @package VisionWP WordPress Theme
		 */
		public function register_menus() {
			register_nav_menus(
				array(
					'primary-menu'	=> esc_html__( 'Primary Menu', 'visionwp' ),
				),
			);
		}

		/**
		 * Register sidebar for theme
		 * @since 1.0.0
		 * @package VisionWP WordPress Theme
		 */
		public function register_sidebars() {
			register_sidebar(array(
				'name'  => esc_html__( 'Sidebar', 'visionwp' ),
				'id'    => 'visionwp_sidebar',
				'description' 	=> esc_html__( 'Widgets in this area will be shown on side of the page.', 'visionwp' ),
				'before_widget' => '<section id="%1$s" class="widget %2$s">',
				'after_widget'  => '</section>',
				'before_title'  => '<h2 class="widget-title">',
				'after_title'   => '</h2>',
			));

			register_sidebar( array(
				'name'  => esc_html__( 'Footer Widget Area', 'visionwp' ) ,
				'id'    =>  'visionwp_footer',
				'description'	=> esc_html__( 'Widgets in this area will be displayed the footer. If empty then column will not be displayed.', 'visionwp' ),
				'before_widget'	=> '<section id="%1$s" class="widget %2$s">',
				'after_widget'	=> '</section>',
				'before_title'	=> '<h2 class="widget-title">',
				'after_title'	=> '</h2>',
			));
		}

		/**
		 * VisionWP plugin recommendation
		 * @since 1.0.0
		 * @package VisionWP WordPress Theme
		 */
		public function register_required_plugins() {
			$plugins = array(
				array(
					'name'     => esc_html__( 'Kirki Customizer Framework', 'visionwp' ),
					'slug'     => 'kirki',
					'required' => false,
				),
				array(
					'name'     => esc_html__( 'Rise Blocks - A Complete Gutenberg Page builder', 'visionwp' ),
					'slug'     => 'rise-blocks',
					'required' => false,
				),
			);
			tgmpa( $plugins );
		}

		/**
		 * Modified excerpt length
		 * @since 1.0.0
		 * @package VisionWP WordPress Theme
		 */
		public function excerpt_length( $length ) {

			if( is_admin() && !wp_doing_ajax() ) {
				return $length;
			}

			$length = '15';
			return $length;
		}

		/**
		 * Modify customizer options
		 * @since 1.0.0
		 * @package VisionWP WordPress Theme
		 */
		public function customize_register( $wp_customize ) {
			$wp_customize -> get_section( 'title_tagline' ) -> panel = 'vision_wp';
			$wp_customize -> get_section( 'header_image' ) -> panel = 'visionwp_theme_options';
			$wp_customize -> get_section( 'header_image' ) -> title = esc_html__( 'Banner', 'visionwp' );
			$wp_customize -> get_control( 'header_textcolor' ) -> section = 'title_tagline';
			$wp_customize -> get_control( 'header_textcolor' ) -> label = esc_html__( 'Site Identity Color', 'visionwp' );
			$wp_customize -> get_setting( 'header_textcolor' ) -> default = '#fff';
			$wp_customize -> get_section( 'colors' ) -> panel = 'visionwp_theme_options';
			$wp_customize -> get_section( 'colors' ) -> title = esc_html__( 'General Options', 'visionwp' );
		}

		/**
		 * Modified excerpt readmore
		 * @since 1.0.0
		 * @package VisionWP WordPress Theme
		 */
		public function excerpt_more( $text ) {
				
			if( is_admin() && !wp_doing_ajax() ) {
				return $text;
			}

			$more = sprintf( '...<div class="visionwp-site-button"><a href="%1$s" class="visionwp-primary-button">%2$s <i class="fa fa-long-arrow-right"></i></a></div>',
				esc_url( get_the_permalink() ),
				visionwp_get( 'readmore_text' ),
			);
			return $more;
		}

		/**
		 * Change home to icon
		 * @since 1.0.0
		 * @package VisionWP WordPress Theme
		 */
		public function change_home_title( $defaults ) {
			$defaults[ 'home' ] = '<i class="fa fa-home"></i>';
			return $defaults;
		}

		/**
		 * Add body classes for theme
		 * @since 1.0.0
		 * @package VisionWP WordPress Theme
		 */
		public function body_class( $classes ) {
			if( visionwp_get( 'transparent_header' ) ) {
				$classes[] = 'visionwp-transparent-header';
			} else {	
				if( visionwp_get( 'sticky_header' ) ) {
					$classes[] = 'visionwp-sticky-header';
				}
			}
			
			$sidebar_position = visionwp_get( 'enable_sidebar' );
			$classes[] = 'visionwp-' . $sidebar_position . '-sidebar';
						
			$post_per_page =  visionwp_get( 'post_per_row' );
			$classes[] = 'visionwp-content-post-' . $post_per_page;

			if( 'boxed' == visionwp_get( 'container_width' ) ) {
				$classes[] = 'visionwp-layout-box';
			} 

			if( visionwp_get( 'top_header_enable' ) ) {
				$classes[] = 'visionwp-top-header';
			}
			return $classes; 
        }

		/**
		 * Theme support for the theme
		 * @since 1.0.0
		 * @package VisionWP WordPress Theme
		 */
		public function visionwp_theme_supports() {
			/* Add theme support for Custom Logo. */
			$custom_logo_args = array(
				'width'       => 180,
				'height'      => 60,
				'flex-width'  => true,
				'flex-height' => true,
				'header-text'  => array( 'site-title', 'site-description' ),
			);
			add_theme_support( 'custom-logo', $custom_logo_args );

			/* Switch default core markup for search form, comment form, and comments.
				to output valid HTML5.
			*/
			$html5_args = array(
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
			);
			add_theme_support( 'html5', $html5_args );

			/* Gutenberg wide images. */
			add_theme_support( 'align-wide' );
			add_theme_support( 'wp-block-styles' );
			/* Add default posts and comments RSS feed links to head. */
			add_theme_support( 'automatic-feed-links' );

			/* Let WordPress manage the document title. */
			add_theme_support( 'title-tag' );

			/* Enable support for Post Thumbnails on posts and pages. */
			add_theme_support( 'post-thumbnails' );

			/* Add theme support for selective refresh for widgets. */
			add_theme_support( 'customize-selective-refresh-widgets' );

		    /* Post formats. */
			add_theme_support(
				'post-formats',
				array(
					'gallery',
					'image',
					'link',
					'quote',
					'video',
					'audio',
					'status',
					'aside',
				),
			);

			add_theme_support( 'responsive-embeds' );

			# Set up the WordPress core custom background feature.
			add_theme_support( 'custom-background', apply_filters(  'visionwp_custom_background_args', array(
				'default-color' => 'ffffff'
			)));


			/* Customize Selective Refresh Widgets. */
			add_theme_support( 'customize-selective-refresh-widgets' );
			add_theme_support( 'post-thumbnails' );

			/**
		     * This variable is intended to be overruled from themes.
		     * Open WPCS issue: {@link https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards/issues/1043}.
		     * phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
		     */         
			$GLOBALS['content_width'] = apply_filters( 'content_width_setup', 640 );

			/**
		     * Make theme available for translation.
		     * Translations can be filed in the /languages/ directory.
		     */
			load_theme_textdomain( 'visionwp', get_theme_file_uri( 'languages' ) );

			# header image options
			add_theme_support( 'custom-header', apply_filters( 'visionwp_header_media_args' , array(
				'default-text-color' => '000000',
				'width'              => 1366,
				'height'             => 400,
				'flex-height'        => true,
				'default-image'      => get_template_directory_uri() . '/assets/img/default-banner.jpg'
			)));

			/**
			 * Support to new page template wp 5.8
			 */
			add_theme_support( 'block-templates' );
		}
	}
}

new VisionWP_Main();