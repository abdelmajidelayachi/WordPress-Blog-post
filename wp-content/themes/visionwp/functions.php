<?php
/**
 * VisionWP functions and definitions
 *
 * VisionWP only works in WordPress 4.7 or later.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package VisionWP WordPress Theme
 */

define( 'VISIONWP_PREFIX', 'visionwp' );

if( !function_exists( 'visionwp_require' ) ) {
    function visionwp_require( $files, $base = 'class' ) { 
        foreach( $files as $file ) {
            $path = $base . '/' . $file . '.php';
            require_once get_theme_file_path( $path );
        }
    }
}

if( !function_exists( 'visionwp_load_modules' ) ) {
    function visionwp_load_modules() {
        $modules = array( 
            'kirki',
            'helper',
            'scripts',
            'tgm-plugin-activation',
            'breadcrumb',
            'create-custom-fields',
        );
        visionwp_require( $modules );
    }
}

if( !function_exists( 'visionwp_load_theme_files' ) ) {
    function visionwp_load_theme_files() {
        $modules = array( 'main', 'pro-check', 'theme-options/options' );
        visionwp_require( $modules, 'inc' );
    }
}

visionwp_load_modules();
visionwp_load_theme_files();

function visionwp_get_meta( $meta_key = false, $post_id = false,  $single = true ) {
    if( is_home() && ! is_front_page() ) {
        $post_id = get_option( 'page_for_posts' );
    } elseif( class_exists( 'woocommerce' ) && is_shop() ) {
        $post_id = get_option( 'woocommerce_shop_page_id' );
    } else {
        $post_id = $post_id ? $post_id : get_the_ID();
    }

    return $post_id ? get_post_meta( $post_id, $meta_key, $single ) : false;
}

function visionwp_banner_content() {
    $meta_banner = visionwp_get_meta( 'disable-banner' );
    if( !$meta_banner ) {
        $link = visionwp_get_meta( 'banner-btn-link' );
        set_query_var( 'visionwp-btn-link', $link );
        get_template_part( 'templates/content/content', 'banner' );
    }
}
add_action( 'visionwp_before_content', 'visionwp_banner_content' );

function visionwp_register_metaboxes() {
    $fields = array(
        'general' => array(
            'label'  => esc_html__( 'General Options', 'visionwp' ),
            'fields' => array(
                'disable-banner' => array(
                    'label' => esc_html__( 'Disable Banner', 'visionwp' ),
                    'type'  => 'checkbox',
                    'default' => false,
                ),
                'banner-btn-link' => array(
                    'label' => esc_html__( 'Banner Button URL', 'visionwp' ),
                    'type'  => 'text',
                ),
                'disable-footer-area' => array(
                    'label' => esc_html__( 'Disable Footer Area', 'visionwp' ),
                    'type'  => 'checkbox',
                    'default' => false,
                ),
                'banner-text-visibility'   => array(
                    'label' => esc_html__( 'Banner Text', 'visionwp' ),
                    'type'  => 'select',
                    'default' => 'global', 
                    'choices' => array(
                        'global' => esc_html( 'Global( From Customizer  )', 'visionwp' ),
                        'enable' => esc_html( 'Enable', 'visionwp' ),
                        'disable' => esc_html( 'Disable', 'visionwp' )                        
                    ),
                ),
            ),
        ),
    );
    
    foreach ( array( 'post', 'page' ) as $post_type ) {
        $module = new VisionWP_CCF( $post_type );
        $module -> add_metabox( $fields );
    }
}
add_action( 'after_setup_theme', 'visionwp_register_metaboxes' );

/**
 * Get header template parts
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */
function visionwp_get_header_content() { 
    $order = visionwp_get( 'header_order' );
    if( !empty(  $order ) ) {
        foreach( $order as $o ) {
            get_template_part( 'templates/header/header', $o );
        }
    }
}

/**
 * Get footer widget area
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */
function visionwp_get_footer_widget_area() {
    $meta = visionwp_get_meta( 'disable-footer-area' );

    if( $meta ) {
        $disabled = get_post_meta( $post_id, 'disable-footer-area', true );
    } 
}

/**
 * Add scroll to top
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */
function visionwp_scroll_to_top() {
    if( !visionwp_get( 'scroll_to_top', true ) ) {
        return;
    }
    echo '<a href="#" class="visionwp-scroll-top"><i class="fa fa-angle-up"></i></a>';
}
add_action( 'wp_footer', 'visionwp_scroll_to_top' );

/**
 * Check whether sidebar is active or not
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */
function visionwp_is_sidebar_active() {
    if( is_active_sidebar( 'visionwp_sidebar' ) ) {
        $sidebar = visionwp_get( 'enable_sidebar' );
        return 'hide' == $sidebar ? false : true;
    }
    return false;
}

/**
 * Get sidebar
 * @since 1.0.0
 * $package VisionWP WordPress Theme
 */
function visionwp_get_sidebar() {
    $sidebar_active = visionwp_is_sidebar_active();
    if( $sidebar_active ) { ?>
        <div class="visionwp-sidebar-wrapper sidebar-order">
            <?php get_sidebar(); ?>
        </div>
    <?php }
}

/**
 * Pagination for the content seperated by page break
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */
function visionwp_content_navigation() {
    wp_link_pages( array(
        'before'      => '<div class="visionwp-page-links">' . esc_html__( 'Pages:', 'visionwp' ),
        'after'       => '</div>',
        'link_before' => '<span class="visionwp-page-number">',
        'link_after'  => '</span>'
    ) );	
}

/**
 * Add header text color 
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */
function visionwp_header_textcolor() { ?>
    <style type="text/css">
        .site-title, .site-title a, .site-description {
            color: #<?php echo esc_html__( get_theme_mod( 'header_textcolor' , 'visionwp' ) ); ?> !important }
    </style>
<?php }
add_action( 'wp_head', 'visionwp_header_textcolor' );

if( !function_exists( 'visionwp_post_meta_order' ) ) {
    /**
     * Get content by order
     * @since 1.0.0
     * @package VisionWP WordPress Theme
     */
    function visionwp_post_meta_order( $type ) {
        switch( $type ) {
            case 'thumbnail':
                $thumb_url = false;
                if( has_post_thumbnail() ) {
                    $thumb_url = get_the_post_thumbnail_url();
                } else {
                    $enable_placeholder = visionwp_get( 'enable_placeholder' );
                    if( $enable_placeholder ) {
                        $thumb_url = get_template_directory_uri() .'/assets/img/default-image.jpg';
                    }
                }
                if( $thumb_url ) {  
                    $thumb_id = get_post_thumbnail_id();
                    $alt = get_post_meta( $thumb_id, '_wp_attachment_image_alt', true );
                    ?>
                    <div class="visionwp-post-thumbnail">
                        <a href="<?php the_permalink(); ?>" alt="">
                            <img src="<?php echo esc_url( $thumb_url ); ?>" alt="<?php echo esc_attr( $alt ); ?>">
                        </a>
                    </div>
                <?php } 
                break;
            case 'title': ?>
                <h2 class="visionwp-post-title">
                    <a href="<?php the_permalink(); ?>">            
                        <?php the_title(); ?>
                    </a>
                </h2>
                <?php break;
            case 'date-author': ?>
                <div class="visionwp-post-meta">
                    <?php VisionWP_Helper::posted_by( get_the_ID() );
                    VisionWP_Helper::the_date();                    
                    VisionWP_Helper::comment_number(); ?>
                </div>
                <?php break;
            case 'category': ?>
                <div class="visionwp-post-category">
                    <?php VisionWP_Helper::the_category(); ?>
                </div>
                <?php break;
            case 'excerpt': ?>
                <div class="visionwp-post-excerpt">     
                    <?php the_excerpt(); ?>
                </div>
                <?php 
            default:
        }
    }
}

function visionwp_view_more_posts() {
    $response = array(
        'data'  => null,
        'status'    => 400,
    );
    
    if( wp_verify_nonce( $_POST['nonce'], 'visionwp-loadmore-nonce' ) ) {
        $args = json_decode( stripslashes( $_POST['query'] ), true );
        $args[ 'paged' ] = absint($_POST['page'] );
        $args[ 'post_status' ] = 'publish';

        query_posts( $args );

        ob_start();

        if( have_posts() ) {
            while( have_posts() ) {
                the_post();
                echo '<div class="visionwp-content-post">';
                    get_template_part( 'templates/content/content', '' );
                echo '</div>';
            }
        }

        wp_reset_postdata();
        
        $response[ 'data' ] = ob_get_clean(); ob_flush();
        $response[ 'status' ] = 200;
    }
    wp_send_json( $response[ 'data' ], $response[ 'status' ] );
}
add_action( 'wp_ajax_view_more_posts', 'visionwp_view_more_posts' );
add_action( 'wp_ajax_nopriv_view_more_posts', 'visionwp_view_more_posts' );

/**
 * Header topbar function
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */
function visionwp_header_topbar() {
    if( visionwp_get( 'top_header_enable' ) ) {
        if( !empty( visionwp_get( 'top_header_num' ) || visionwp_get( 'top_header_email' ) ) ) {
            $top_tag_data = array(
                'tel' => array(
                    'value' => 'top_header_num',
                    'icon' => 'fa-phone',
                    'class' => 'visionwp-phone',
                ),
                'mailto' => array(
                    'value' => 'top_header_email',
                    'icon' => 'fa-envelope',
                    'class' => 'visionwp-email',
                ),
            );
            set_query_var( 'top_tag_data',  $top_tag_data );
            get_template_part( 'templates/header/header', 'topbar' );
        }
    }
}
add_action( 'visionwp-before-main-header', 'visionwp_header_topbar' );