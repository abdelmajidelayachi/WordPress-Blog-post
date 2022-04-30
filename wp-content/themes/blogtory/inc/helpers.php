<?php
/*Get customizer values.*/
if ( ! function_exists( 'blogtory_get_option' ) ) :
    /**
     * Get customizer value by key.
     *
     * @since 1.0.0
     *
     * @param string $key Option key.
     * @return mixed Option value.
     */
    function blogtory_get_option($key) {
        $key_value = '';
        if(!$key){
            return $key_value;
        }
        $default_values = blogtory_get_default_customizer_values();
        $customizer_values = get_theme_mod( 'theme_options' );
        $customizer_values = wp_parse_args( $customizer_values, $default_values );

        $key_value = ( isset( $customizer_values[ $key ] ) ) ? $customizer_values[ $key ] : '';
        return $key_value;
    }
endif;

/*Get choices for google fonts*/
if ( ! function_exists( 'blogtory_get_google_fonts' ) ) :
    /**
     * Returns google fonts array
     *
     * @since 1.0.0
     *
     * @return array Options array.
     */
    function blogtory_get_google_fonts() {
        $options = apply_filters( 'blogtory_google_fonts', array(
            'ABeeZee:400,400italic' => 'ABeeZee',
            'Abel' => 'Abel',
            'Abril+Fatface' => 'Abril Fatface',
            'Aldrich' => 'Aldrich',
            'Alegreya:400,400italic,700,900' => 'Alegreya',
            'Alex+Brush' => 'Alex Brush',
            'Alfa+Slab+One' => 'Alfa Slab One',
            'Amaranth:400,400italic,700' => 'Amaranth',
            'Andada' => 'Andada',
            'Anton' => 'Anton',
            'Archivo+Black' => 'Archivo Black',
            'Archivo+Narrow:400,400italic,700' => 'Archivo Narrow',
            'Arimo:400,400italic,700' => 'Arimo',
            'Arvo:400,400italic,700' => 'Arvo',
            'Asap:400,400italic,700' => 'Asap',
            'Bangers' => 'Bangers',
            'BenchNine:400,700' => 'BenchNine',
            'Bevan' => 'Bevan',
            'Bitter:400,400italic,700' => 'Bitter',
            'Bree+Serif' => 'Bree Serif',
            'Cabin:400,400italic,500,600,700' => 'Cabin',
            'Cabin+Condensed:400,500,600,700' => 'Cabin Condensed',
            'Cantarell:400,400italic,700' => 'Cantarell',
            'Carme' => 'Carme',
            'Cherry+Cream+Soda' => 'Cherry Cream Soda',
            'Cinzel:400,700,900' => 'Cinzel',
            'Comfortaa:400,300,700' => 'Comfortaa',
            'Cookie' => 'Cookie',
            'Covered+By+Your+Grace' => 'Covered By Your Grace',
            'Crete+Round:400,400italic' => 'Crete Round',
            'Crimson+Text:400,400italic,600,700' => 'Crimson Text',
            'Cuprum:400,400italic' => 'Cuprum',
            'Dancing+Script:400,700' => 'Dancing Script',
            'Didact+Gothic' => 'Didact Gothic',
            'Droid+Sans:400,700' => 'Droid Sans',
            'Dosis:400,300,600,800' => 'Dosis',
            'Droid+Serif:400,400italic,700' => 'Droid Serif',
            'Economica:400,700,400italic' => 'Economica',
            'Expletus+Sans:400,400i,700,700i' => 'Expletus Sans',
            'EB+Garamond' => 'EB Garamond',
            'Exo:400,300,400italic,600,800' => 'Exo',
            'Exo+2:400,300,400italic,600,700,900' => 'Exo 2',
            'Fira+Sans:400,500' => 'Fira Sans',
            'Fjalla+One' => 'Fjalla One',
            'Francois+One' => 'Francois One',
            'Fredericka+the+Great' => 'Fredericka the Great',
            'Fredoka+One' => 'Fredoka One',
            'Fugaz+One' => 'Fugaz One',
            'Great+Vibes' => 'Great Vibes',
            'Handlee' => 'Handlee',
            'Hammersmith+One' => 'Hammersmith One',
            'Hind:400,300,600,700' => 'Hind',
            'Inconsolata:400,700' => 'Inconsolata',
            'Indie+Flower' => 'Indie Flower',
            'Inter:wght@400;500;700' => 'Inter',
            'Istok+Web:400,400italic,700' => 'Istok Web',
            'Josefin+Sans:400,600,700,400italic' => 'Josefin Sans',
            'Josefin+Slab:400,400italic,700,600' => 'Josefin Slab',
            'Jura:400,300,500,600' => 'Jura',
            'Karla:400,400italic,700' => 'Karla',
            'Kaushan+Script' => 'Kaushan Script',
            'Kreon:400,300,700' => 'Kreon',
            'Lateef' => 'Lateef',
            'Lato:400,300,400italic,900,700' => 'Lato',
            'Libre+Baskerville:400,400italic,700' => 'Libre Baskerville',
            'Libre+Franklin:400,600' => 'Libre Franklin',
            'Limelight' => 'Limelight',
            'Lobster' => 'Lobster',
            'Lobster+Two:400,700,700italic' => 'Lobster Two',
            'Lora:400,400italic,700,700italic' => 'Lora',
            'Maven+Pro:400,500,700,900' => 'Maven Pro',
            'Merriweather:400,400italic,300,900,700' => 'Merriweather',
            'Merriweather+Sans:400,400italic,700,800' => 'Merriweather Sans',
            'Monda:400,700' => 'Monda',
            'Montserrat:400,400i,500,700' => 'Montserrat',
            'Muli:400,300italic,300' => 'Muli',
            'News+Cycle:400,700' => 'News Cycle',
            'Noticia+Text:400,400italic,700' => 'Noticia Text',
            'Noto+Sans:400,400italic,700' => 'Noto Sans',
            'Noto+Serif:400,400italic,700' => 'Noto Serif',
            'Nunito:400,300,700' => 'Nunito',
            'Old+Standard+TT:400,400italic,700' => 'Old Standard TT',
            'Open+Sans:300,400,400italic,600,700' => 'Open Sans',
            'Open+Sans+Condensed:300,300italic,700' => 'Open Sans Condensed',
            'Oswald:400,300,700' => 'Oswald',
            'Oxygen:400,300,700' => 'Oxygen',
            'Pacifico' => 'Pacifico',
            'Passion+One:400,700,900' => 'Passion One',
            'Pathway+Gothic+One' => 'Pathway Gothic One',
            'Patua+One' => 'Patua One',
            'Poiret+One' => 'Poiret One',
            'Pontano+Sans' => 'Pontano Sans',
            'Poppins:400,400i,700,700i' => 'Poppins',
            'Play:400,700' => 'Play',
            'Playball' => 'Playball',
            'Playfair+Display:400,400i,700,700i' => 'Playfair Display',
            'PT+Sans:400,400italic,700' => 'PT Sans',
            'PT+Sans+Caption:400,700' => 'PT Sans Caption',
            'PT+Sans+Narrow:400,700' => 'PT Sans Narrow',
            'PT+Serif:400,400italic,700' => 'PT Serif',
            'Quattrocento+Sans:400,700,400italic' => 'Quattrocento Sans',
            'Questrial' => 'Questrial',
            'Quicksand:400,700' => 'Quicksand',
            'Raleway:400,300,500,600,700,900' => 'Raleway',
            'Righteous' => 'Righteous',
            'Roboto:400,700' => 'Roboto',
            'Roboto+Condensed:400,300,400italic,700' => 'Roboto Condensed',
            'Roboto+Slab:400,300,700' => 'Roboto Slab',
            'Rokkitt:400,700' => 'Rokkitt',
            'Ropa+Sans:400,400italic' => 'Ropa Sans',
            'Russo+One' => 'Russo One',
            'Sanchez:400,400italic' => 'Sanchez',
            'Satisfy' => 'Satisfy',
            'Shadows+Into+Light' => 'Shadows Into Light',
            'Sigmar+One' => 'Sigmar One',
            'Signika:400,300,700' => 'Signika',
            'Six+Caps' => 'Six Caps',
            'Slabo+27px' => 'Slabo 27px',
            'Source+Sans+Pro:400,400i,700,700i' => 'Source Sans Pro',
            'Source+Serif+Pro:400,700' => 'Source Serif Pro',
            'Squada+One' => 'Squada One',
            'Tangerine:400,700' => 'Tangerine',
            'Tinos:400,400italic,700' => 'Tinos',
            'Titillium+Web:400,300,400italic,700,900' => 'Titillium Web',
            'Ubuntu:400,400italic,500,700' => 'Ubuntu',
            'Ubuntu+Condensed' => 'Ubuntu Condensed',
            'Varela+Round' => 'Varela Round',
            'Vollkorn:400,400italic,700' => 'Vollkorn',
            'Voltaire' => 'Voltaire',
            'Yanone+Kaffeesatz:400,300,700' => 'Yanone Kaffeesatz',
        ) );
        return $options;
    }
endif;

/* Check if is WooCommerce is active */
if ( ! function_exists( 'blogtory_is_wc_active' ) ) :
    /**
     * Check WooCommerce Status
     *
     * @since 1.0.0
     *
     * return boolean true/false
     */
    function blogtory_is_wc_active() {
        return class_exists( 'WooCommerce' ) ? true : false;
    }
endif;

/* Get placeholder image for back-end*/
if ( ! function_exists( 'be_placeholder_img_src' ) ) :
    /**
     * Get placeholder image
     *
     * @since 1.0.0
     *
     */
    function be_placeholder_img_src() {
        $src = get_template_directory_uri() . '/assets/images/placeholder.png';
        return apply_filters( 'blogtory_placeholder_img_src', $src );
    }
endif;

/* Change default excerpt length */
if ( ! function_exists( 'blogtory_excerpt_length' ) ) :
    /**
     * Change excerpt Length.
     *
     * @since 1.0.0
     */
    function blogtory_excerpt_length($excerpt_length) {
        if( is_admin() && !wp_doing_ajax() ){
            return $excerpt_length;
        }
        $excerpt_length = blogtory_get_option('excerpt_length');
        return absint($excerpt_length);
    }
endif;
add_filter( 'excerpt_length', 'blogtory_excerpt_length', 999 );

/* Modify Excerpt Read More text */
if ( ! function_exists( 'blogtory_excerpt_more' ) ) :
    /**
     * Modify Excerpt Read More text.
     *
     * @since 1.0.0
     */
    function blogtory_excerpt_more($more) {
        if(is_admin()){
            return $more;
        }
        return '...';
    }
endif;
add_filter('excerpt_more', 'blogtory_excerpt_more');

/* Get Page layout */
if ( ! function_exists( 'blogtory_get_page_layout' ) ) :
    /**
     * Get Page Layout based on the post meta or customizer value
     *
     * @since 1.0.0
     *
     * @return string Page Layout.
     */
    function blogtory_get_page_layout() {
        global $post;
        $page_layout = '';

        /*Fetch for homepage*/
        if( is_front_page() && is_home()){
            $page_layout = blogtory_get_option('home_page_layout');
            return $page_layout;
        }elseif ( is_front_page() ) {
            $page_layout = blogtory_get_option('home_page_layout');
            return $page_layout;
        }elseif ( is_home() ) {
            $page_layout_meta = get_post_meta( get_option( 'page_for_posts' ), 'blogtory_page_layout', true );
            if(!empty($page_layout_meta)){
                return $page_layout_meta;
            }else{
                $page_layout = blogtory_get_option('global_sidebar_layout');
                return $page_layout;
            }
        }
        /**/

        /*Fetch from Post Meta*/
        if ( $post && is_singular() ) {
            $page_layout = get_post_meta( $post->ID, 'blogtory_page_layout', true );
        }
        /*Fetch from customizer*/
        if(empty($page_layout)){
            $page_layout = blogtory_get_option('global_sidebar_layout');
        }
        return $page_layout;
    }
endif;

if ( ! function_exists( 'blogtory_get_all_image_sizes' ) ) :
    /**
     * Returns all image sizes available.
     *
     * @since 1.0.0
     *
     * @param bool $for_choice True/False to construct the output as key and value choice
     * @return array Image Size Array.
     */
    function blogtory_get_all_image_sizes( $for_choice = false ) {

        global $_wp_additional_image_sizes;

        $sizes = array();

        if( true == $for_choice ){
            $sizes['no-image'] = __( 'No Image', 'blogtory' );
        }

        foreach ( get_intermediate_image_sizes() as $_size ) {
            if ( in_array( $_size, array('thumbnail', 'medium', 'large') ) ) {

                $width = get_option( "{$_size}_size_w" );
                $height = get_option( "{$_size}_size_h" );

                if( true == $for_choice ){
                    $sizes[$_size] = ucfirst($_size) . ' (' . $width . 'x' . $height . ')';
                }else{
                    $sizes[ $_size ]['width']  = $width;
                    $sizes[ $_size ]['height'] = $height;
                    $sizes[ $_size ]['crop']   = (bool) get_option( "{$_size}_crop" );
                }
            } elseif ( isset( $_wp_additional_image_sizes[ $_size ] ) ) {

                $width = $_wp_additional_image_sizes[ $_size ]['width'];
                $height = $_wp_additional_image_sizes[ $_size ]['height'];

                if( true == $for_choice ){
                    $sizes[$_size] = ucfirst($_size) . ' (' . $width . 'x' . $height . ')';
                }else{
                    $sizes[ $_size ] = array(
                        'width'  => $width,
                        'height' => $height,
                        'crop'   => $_wp_additional_image_sizes[ $_size ]['crop'],
                    );
                }
            }
        }

        if( true == $for_choice ){
            $sizes['full'] = __( 'Full Image', 'blogtory' );
        }

        return $sizes;
    }
endif;

if ( ! function_exists( 'blogtory_get_header_layouts' ) ) :
    /**
     * Returns header layout options.
     *
     * @since 1.0.0
     *
     * @return array Options array.
     */
    function blogtory_get_header_layouts() {
        $options = apply_filters( 'blogtory_header_layouts', array(
            'header_style_1'  => array(
                'url'   => get_template_directory_uri().'/assets/images/header1.png',
                'label' => esc_html__( 'Header Style 1', 'blogtory' ),
            ),
            'header_style_2' => array(
                'url'   => get_template_directory_uri().'/assets/images/header2.png',
                'label' => esc_html__( 'Header Style 2', 'blogtory' ),
            )
        ) );
        return $options;
    }
endif;

if ( ! function_exists( 'blogtory_get_footer_layouts' ) ) :
    /**
     * Returns footer layout options.
     *
     * @since 1.0.0
     *
     * @return array Options array.
     */
    function blogtory_get_footer_layouts() {
        $options = apply_filters( 'blogtory_footer_layouts', array(
            'footer_layout_1'  => array(
                'url'   => get_template_directory_uri().'/assets/images/footer-col-4.png',
                'label' => esc_html__( 'Four Columns', 'blogtory' ),
            ),
            'footer_layout_2' => array(
                'url'   => get_template_directory_uri().'/assets/images/footer-col-3.png',
                'label' => esc_html__( 'Three Columns', 'blogtory' ),
            ),
            'footer_layout_3' => array(
                'url'   => get_template_directory_uri().'/assets/images/footer-col-2.png',
                'label' => esc_html__( 'Two Columns', 'blogtory' ),
            )
        ) );
        return $options;
    }
endif;

if ( ! function_exists( 'blogtory_get_general_layouts' ) ) :
    /**
     * Returns general layout options.
     *
     * @since 1.0.0
     *
     * @return array Options array.
     */
    function blogtory_get_general_layouts() {
        $options = apply_filters( 'blogtory_general_layouts', array(
            'left-sidebar'  => array(
                'url'   => get_template_directory_uri().'/assets/images/left_sidebar.png',
                'label' => esc_html__( 'Left Sidebar', 'blogtory' ),
            ),
            'right-sidebar' => array(
                'url'   => get_template_directory_uri().'/assets/images/right_sidebar.png',
                'label' => esc_html__( 'Right Sidebar', 'blogtory' ),
            ),
            'no-sidebar'    => array(
                'url'   => get_template_directory_uri().'/assets/images/no_sidebar.png',
                'label' => esc_html__( 'No Sidebar', 'blogtory' ),
            ),
        ) );
        return $options;
    }
endif;

if ( ! function_exists( 'blogtory_get_archive_layouts' ) ) :
    /**
     * Returns archive layout options.
     *
     * @since 1.0.0
     *
     * @return array Options array.
     */
    function blogtory_get_archive_layouts() {
        $options = apply_filters( 'blogtory_archive_layouts', array(
            'archive_style_2' => array(
                'url'   => get_template_directory_uri().'/assets/images/full_column.png',
                'label' => esc_html__( 'Full Column', 'blogtory' ),
            ),
            'archive_style_3'    => array(
                'url'   => get_template_directory_uri().'/assets/images/double_column.png',
                'label' => esc_html__( 'Double Column', 'blogtory' ),
            ),
        ) );
        return $options;
    }
endif;

if ( ! function_exists( 'blogtory_get_home_post_layouts' ) ) :
    /**
     * Returns home post layout options.
     *
     * @since 1.0.0
     *
     * @return array Options array.
     */
    function blogtory_get_home_post_layouts() {
        $options = apply_filters( 'blogtory_home_post_layouts', array(
            'archive_style_2' => array(
                'url'   => get_template_directory_uri().'/assets/images/full_column.png',
                'label' => esc_html__( 'Full Column', 'blogtory' ),
            ),
            'archive_style_3'    => array(
                'url'   => get_template_directory_uri().'/assets/images/double_column.png',
                'label' => esc_html__( 'Double Column', 'blogtory' ),
            )
        ) );
        return $options;
    }
endif;

if ( ! function_exists( 'blogtory_header_styles' ) ) :
    /**
     * Display classes and inline style to the Blogtory header.
     *
     * @uses  get_header_image()
     * @since  1.0.0
     */
    function blogtory_header_styles() {
        $is_header_image = get_header_image();
        $header_bg_image = '';

        if ( $is_header_image ) {
            $header_bg_image = 'url(' . esc_url( $is_header_image ) . ')';
        }

        $classes = '';
        $final_styles = $styles = array();

        if ( '' !== $header_bg_image ) {
            $classes = 'be-site-brand-wrap';
            $styles['background-image'] = $header_bg_image;
        }

        $classes = apply_filters( 'blogtory_header_classes', $classes );
        $styles = apply_filters( 'blogtory_header_styles', $styles );

        foreach ( $styles as $style => $value ) {
            $final_styles[] = esc_attr( $style . ': ' . $value . '; ' );
        }

        if(!empty($final_styles) || !empty($classes)){
            echo 'class="'.esc_attr($classes).'" style="'.join('', $final_styles).'"';
        }

    }
endif;

if ( ! function_exists( 'blogtory_top_bar' ) ) :
    /**
     * Display top bar
     *
     * @since 1.0.0
     *
     */
    function blogtory_top_bar() {
        ?>
        <div class="unfold-topbar">
            <div class="wrapper header-wrapper">
                <?php
                $enable_todays_date = blogtory_get_option('enable_todays_dates');
                $enable_top_bar_social_nav = blogtory_get_option('enable_top_bar_social_nav');

                if( $enable_todays_date ):
                    $date_format = blogtory_get_option( 'todays_date_format', 'l ,  j  F Y' ); ?>
                    <div class="unfold-header-areas header-areas-left">
                        <div class="unfold-components-date">
                            <span><?php blogtory_the_theme_svg( 'time' ); ?></span>
                            <span><?php echo date_i18n( $date_format, current_time( 'timestamp' ) ); ?></span>
                        </div>
                    </div>
                <?php endif; ?>

                <?php if($enable_top_bar_social_nav): ?>
                    <div class="unfold-header-areas header-areas-right">
                        <div class="unfold-components-socialnav">
                            <?php blogtory_social_menu(); ?>
                        </div>
                    </div>
                <?php endif;?>
            </div>
        </div>
        
        <?php
    }
endif;

if ( ! function_exists( 'blogtory_top_menu' ) ) :
    /**
     * Display top menu.
     *
     * @since 1.0.0
     *
     */
    function blogtory_top_menu() {
        wp_nav_menu(array(
            'theme_location' => 'top-menu',
            'container_class' => 'top-navigation',
            'fallback_cb' => false,
            'depth' => 1,
            'menu_class' => false
        ) );
    }
endif;

if ( ! function_exists( 'blogtory_social_menu' ) ) :
    /**
     * Display social menu.
     *
     * @since 1.0.0
     *
     */
    function blogtory_social_menu() {
        if(has_nav_menu('social-menu')){
            ?>
            <nav aria-label="<?php esc_attr_e( 'Social links', 'blogtory' ); ?>" class="footer-social-wrapper">
                <ul class="uf-social-menu uf-footer-social reset-list-style uf-social-icons fill-children-current-color">
                    <?php
                    wp_nav_menu(
                        array(
                            'theme_location'  => 'social-menu',
                            'container'       => '',
                            'container_class' => '',
                            'items_wrap'      => '%3$s',
                            'menu_id'         => '',
                            'menu_class'      => '',
                            'depth'           => 1,
                            'link_before'     => '<span class="screen-reader-text">',
                            'link_after'      => '</span>',
                            'fallback_cb'     => '',
                        )
                    );
                    ?>
                </ul><!-- .footer-social -->
            </nav><!-- .footer-social-wrapper -->
            <?php
        }
    }
endif;

if ( ! function_exists( 'blogtory_primary_menu' ) ) :
    /**
     * Display primary menu.
     *
     * @since 1.0.0
     *
     */
    function blogtory_primary_menu() {
        ?>
        <div class="header-navigation-wrapper">
            <?php
            if ( has_nav_menu( 'primary-menu' )  ) {
                ?>
                    <nav class="primary-menu-wrapper" aria-label="<?php echo esc_attr_x( 'Horizontal', 'menu', 'blogtory' ); ?>">
                        <ul class="primary-menu reset-list-style">
                        <?php
                        wp_nav_menu(
                            array(
                                'container'  => '',
                                'items_wrap' => '%3$s',
                                'theme_location' => 'primary-menu',
                            )
                        );
                        ?>
                        </ul>
                    </nav><!-- .primary-menu-wrapper -->
                <?php
            }
            ?>
        </div>
        <?php
    }
endif;

if ( ! function_exists( 'blogtory_search_icon' ) ) :
    /**
     * Display search icon.
     *
     * @since 1.0.0
     *
     */
    function blogtory_search_icon() {
        ?>
        <div class="unfold-search-wrap">
            <div class="search-overlay">
                <a href="#" title="Search" class="search-icon">
                    <?php blogtory_the_theme_svg( 'search' ); ?>
                </a>
                <div class="unfold-search-form">
                    <?php get_search_form();?>
                </div>
            </div>
        </div>
        <?php
    }
endif;

if ( ! function_exists( 'blogtory_site_brand' ) ) :
    /**
     * Display site logos and title & tagline.
     *
     * @since 1.0.0
     *
     */
    function blogtory_site_brand() {
        ?>
        <div class="site-branding">
            <?php

            the_custom_logo();

            if ( is_front_page() ) :
                ?>
                <h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
                <?php
            else :
                ?>
                <p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></p>
                <?php
            endif;
            $blogtory_description = get_bloginfo( 'description', 'display' );
            if ( $blogtory_description || is_customize_preview() ) :
                ?>
                <p class="site-description">
                    <span class="be-site-desc-wrap"><?php echo $blogtory_description; /* WPCS: xss ok. */ ?></span>
                </p>
            <?php endif; ?>

        </div>
        <?php
    }
endif;

if ( ! function_exists( 'blogtory_posts_navigation' ) ) :
    /**
     * Display Pagination.
     *
     * @since 1.0.0
     */
    function blogtory_posts_navigation() {
        $pagination_type = blogtory_get_option( 'archive_pagination_type' );
        $pagination_align = blogtory_get_option( 'archive_pagination_align' );
        switch ( $pagination_type ) {
            case 'default':
                the_posts_navigation();
                break;
            case 'numeric':
                if(is_front_page()){
                    $pagination_align = blogtory_get_option( 'home_numeric_pagination_align' );
                }
                ?>
                <div class="be-nav-pagination <?php echo esc_attr($pagination_align);?>">
                    <?php the_posts_pagination();?>
                </div>
                <?php
                break;
            case 'ajax_load':
                ?>
                <div class="be-ajax-pagination <?php echo esc_attr($pagination_align);?>">
                    <?php blogtory_ajax_pagination('click');?>
                </div>
                <?php
                break;
            case 'infinite_scroll':
                ?>
                <div class="be-ajax-pagination <?php echo esc_attr($pagination_align);?>">
                    <?php blogtory_ajax_pagination('scroll');?>
                </div>
                <?php
                break;
            default:
                break;
        }
        return;
    }
endif;

if ( ! function_exists( 'blogtory_post_image' ) ) :
    /**
     * Display post image.
     *
     * @param string $image_size Image Size to fetch
     * @param boolean $bg Image in background
     *
     * @since 1.0.0
     */
    function blogtory_post_image($image_size = 'thumbnail', $bg = false) {
        $class = '';
        if(true == $bg){
            $class = 'be-bg-image';
        }
        ?>
        <div class="entry-image <?php echo esc_attr($class);?>">
            <a href="<?php the_permalink() ?>">
                <?php
                the_post_thumbnail( $image_size, array(
                    'alt' => the_title_attribute( array(
                        'echo' => false,
                    ) ),
                ) );
                ?>
            </a>
        </div>
        <?php
    }
endif;

if ( ! function_exists( 'blogtory_post_cat_info' ) ) :
    /**
     * Display post category info
     *
     * @since 1.0.0
     */
    function blogtory_post_cat_info($style = 'style_1') {
        ?>
        
        <div class="be-cat-info cat_<?php echo esc_attr($style);?>">
                <?php
                $categories = wp_get_post_categories(get_the_ID());
                if(!empty($categories)):
                    if('style_1' == $style):
                        foreach($categories as $c):
                            $style = '';
                            $cat = get_category( $c );
                            $color = get_term_meta($cat->term_id, 'category_color', true);
                            if($color){
                                $style = "background-color:".esc_attr($color);
                            }
                            ?>
                            <a href="<?php echo esc_url( get_category_link( $cat->term_id ) ); ?>" style="<?php echo esc_attr($style);?>">
                                <?php echo esc_html($cat->cat_name);?>
                            </a>
                            <?php
                        endforeach;
                        elseif('style_2' == $style):
                            the_category(' ');
                    endif;
                endif;
                ?>
        </div>
        <?php
    }
endif;

if ( ! function_exists( 'blogtory_post_meta_info' ) ) :
    /**
     * Display post meta info.
     *
     * @param boolean $author Show author
     * @param boolean $date Show date
     * @param boolean $comment Show comment link
     *
     * @since 1.0.0
     */
    function blogtory_post_meta_info($author = true, $date = true, $comment = true) {
        ?>
        <div class="be-meta-info unfold-meta-info">
            <?php
            if($author){
                ?>
                <div class="author-name">
                    <a href="<?php echo get_author_posts_url( get_the_author_meta( 'ID' ), get_the_author_meta( 'user_nicename' ) ); ?>">
                        <span class="unfold-meta-author unfold-meta-icon">
                            <?php blogtory_the_theme_svg('user'); ?>
                        </span>
                        <span class="unfold-meta-author unfold-meta-label">
                            <?php the_author(); ?>
                        </span>
                    </a>
                </div>
                <?php
            }

            if($date){
                ?>
                <div class="post-date">
                    <span class="unfold-meta-date unfold-meta-icon">
                        <?php blogtory_the_theme_svg('clock'); ?>
                    </span>
                    <span class="unfold-meta-date unfold-meta-label">
                        <?php echo esc_html(get_the_date()); ?>
                    </span>
                </div>
                <?php
            }

            if($comment){
                if (!is_single() && !post_password_required() && (comments_open() || get_comments_number())) {
                    ?>
                    <div class="post-comment">
                        <?php
                        $number = get_comments_number(get_the_ID());
                        if (0 == $number) {
                            $respond_link = get_permalink() . '#respond';
                            $comment_link = apply_filters('respond_link', $respond_link, get_the_ID());
                        } else {
                            $comment_link = get_comments_link();
                        }
                        ?>
                        <a href="<?php echo esc_url($comment_link) ?>">
                            <span class="unfold-meta-comment unfold-meta-icon">
                                <?php blogtory_the_theme_svg('comment'); ?>
                            </span>
                            <span class="unfold-meta-comment unfold-meta-label">
                                <?php echo esc_html($number); ?>
                            </span>
                        </a>
                    </div>
                    <?php
                }
            }
            ?>
        </div>
        <?php
    }
endif;

if ( ! function_exists( 'blogtory_post_date_info' ) ) :
    /**
     * Display post meta info.
     *
     * @since 1.0.0
     */
    function blogtory_post_date_info() {
        ?>
        <div class="unfold-meta-info be-date-info">
            <div class="post-date">
                <span class="unfold-meta-date unfold-meta-icon">
                    <?php blogtory_the_theme_svg('clock'); ?>
                </span>
                <span class="unfold-meta-date unfold-meta-label">
                    <?php echo esc_html(get_the_date()); ?>
                </span>
            </div>
        </div>
        <?php
    }
endif;

if ( ! function_exists( 'blogtory_post_excerpt_info' ) ) :
    /**
     * Display post excerpt info
     *
     * @param int $excerpt_length Excerpt Length
     * @param boolean $read_more Read More Button
     *
     * @since 1.0.0
     */
    function blogtory_post_excerpt_info($excerpt_length = '', $read_more = true) {

        $excerpt_read_more_text = blogtory_get_option('excerpt_read_more_text');

        if(empty($excerpt_length)){
            if(is_front_page() && is_home() ){
                $excerpt_length = blogtory_get_option('archive_excerpt_length');
            }elseif( is_front_page()){
                $excerpt_length = blogtory_get_option('front_page_excerpt_length');
            }else{
                $excerpt_length = blogtory_get_option('archive_excerpt_length');
            }
        }

        if(!empty($excerpt_length) && 0!= $excerpt_length){
            ?>
            <div class="entry-content">
                <?php
                $content = wp_trim_words( get_the_excerpt(), $excerpt_length, '...' );
                echo apply_filters( 'the_excerpt', $content );

                wp_link_pages( array(
                    'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'blogtory' ),
                    'after'  => '</div>',
                ) );
                if($read_more){
                    if($excerpt_read_more_text){ ?>
                        <div class="be-read-more">
                            <a class="readmore-btn" href="<?php the_permalink();?>">
                                <?php echo esc_html($excerpt_read_more_text);?>
                            </a>
                        </div>
                    <?php }
                }
                ?>
            </div>
            <?php
        }
    }
endif;

if ( ! function_exists( 'blogtory_post_excerpt_info_svg' ) ) :
    /**
     * Display post excerpt info
     *
     * @param int $excerpt_length Excerpt Length
     * @param boolean $read_more Read More Button
     *
     * @since 1.0.0
     */
    function blogtory_post_excerpt_info_svg($excerpt_length = '', $read_more = true) {

        $excerpt_read_more_text = blogtory_get_option('excerpt_read_more_text');

        if(empty($excerpt_length)){
            if(is_front_page() && is_home() ){
                $excerpt_length = blogtory_get_option('archive_excerpt_length');
            }elseif( is_front_page()){
                $excerpt_length = blogtory_get_option('front_page_excerpt_length');
            }else{
                $excerpt_length = blogtory_get_option('archive_excerpt_length');
            }
        }

        if(!empty($excerpt_length) && 0!= $excerpt_length){
            ?>
            <div class="entry-content">
                <?php
                $content = wp_trim_words( get_the_excerpt(), $excerpt_length, '...' );
                echo apply_filters( 'the_excerpt', $content );

                wp_link_pages( array(
                    'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'blogtory' ),
                    'after'  => '</div>',
                ) );
                if($read_more){
                    if($excerpt_read_more_text){ ?>
                        <div class="be-read-more">
                            <a class="readmore-btn" href="<?php the_permalink();?>">
                                <?php echo esc_html($excerpt_read_more_text);?>
                                <?php blogtory_the_theme_svg( 'arrow-right' ); ?>
                            </a>
                        </div>
                    <?php }
                }
                ?>
            </div>
            <?php
        }
    }
endif;

if ( ! function_exists( 'blogtory_front_page_posts' ) ) :
    /**
     * Displays posts on front page
     *
     * @since 1.0.0
     *
     */
    function blogtory_front_page_posts() {

        /*Set paged attribute for pagination*/
        if ( get_query_var('paged') ) {
            $paged = absint(get_query_var('paged'));
        } elseif ( get_query_var('page') ) {
            $paged = absint(get_query_var('page'));
        } else {
            $paged = 1;
        }

        $front_blog_style = blogtory_get_option('front_blog_style');
        $posts_args = array(
            'post_status' => 'publish',
            'post_type' => 'post',
            'paged' => $paged,
        );
        $latest_posts = new WP_Query($posts_args);
        if($latest_posts->have_posts()):

            set_query_var('archive_style', $front_blog_style);
            ?>
            <section class="blogtory-latest-posts em-front-page-content clearfix <?php echo esc_attr($front_blog_style);?>">
                <?php
                while($latest_posts->have_posts()):$latest_posts->the_post();
                    get_template_part('template-parts/content', get_post_type());
                endwhile;
                $front_page_pagination_type = blogtory_get_option('front_page_pagination_type');
                if('numeric' == $front_page_pagination_type){
                    $big = 999999999;
                    $links = paginate_links( array(
                        'base' => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
                        'format' => '?paged=%#%',
                        'current' => max( 1, $paged ),
                        'total' => $latest_posts->max_num_pages,
                        'prev_text'          => _x( 'Previous', 'previous set of posts', 'blogtory' ),
                        'next_text'          => _x( 'Next', 'next set of posts', 'blogtory' ),
                    ) );
                    if ( $links ) {
                        $pagination_align = blogtory_get_option( 'home_numeric_pagination_align' );
                        ?>
                        <div class="be-nav-pagination <?php echo esc_attr($pagination_align);?>">
                            <?php echo _navigation_markup( $links, 'pagination' );?>
                        </div>
                        <?php
                    }
                }
                wp_reset_postdata();
                ?>
            </section>
            <?php
        endif;
    }
endif;

if ( ! function_exists( 'blogtory_get_general_heading_style' ) ) :
    /**
     * Returns general widget heading style
     *
     * @since 1.0.0
     *
     * @return string heading_style
     */
    function blogtory_get_general_heading_style() {
        return 'style_4';
    }
endif;

if ( ! function_exists( 'blogtory_get_general_heading_align' ) ) :
    /**
     * Returns genral widget heading align
     *
     * @since 1.0.0
     *
     * @return string heading_align
     */
    function blogtory_get_general_heading_align() {
        return 'be-left';
    }
endif;

if ( ! function_exists( 'blogtory_get_footer_heading_style' ) ) :
    /**
     * Returns footer widget heading style
     *
     * @since 1.0.0
     *
     * @return string heading_style
     */
    function blogtory_get_footer_heading_style() {
        $heading_style = blogtory_get_option('footer_widget_heading_style');
        return $heading_style;
    }
endif;

if ( ! function_exists( 'blogtory_get_footer_heading_align' ) ) :
    /**
     * Returns footer widget heading align
     *
     * @since 1.0.0
     *
     * @return string heading_align
     */
    function blogtory_get_footer_heading_align() {
        $heading_align = blogtory_get_option('footer_widget_heading_align');
        return 'be-'.$heading_align;
    }
endif;


if ( ! function_exists( 'blogtory_in_multi_array' ) ) :
    /**
     * Returns true/false if the key exists in array
     *
     * @since 1.0.0
     *
     * @param string $needle
     * @param array $haystack
     *
     * @return boolean Key exists/not
     */
    function blogtory_in_multi_array($needle,$haystack) {
        if (array_key_exists($needle,$haystack ) or in_array($needle,$haystack)) {
            return true;
        } else {
            $return = false;
            foreach (array_values($haystack) as $value) {
                if (is_array($value) and !$return) {
                    $return = blogtory_in_multi_array($needle,$value);
                }
            }
            return $return;
        }
    }
endif;

if ( ! function_exists( 'blogtory_related_posts' ) ) {
    /**
     * Show related posts
     *
     * @since 1.0.0
     *
     */
    function blogtory_related_posts() {

        global $post;
        $post_id = $post->ID;

        $related_posts_text = blogtory_get_option('related_posts_text');
        $no_of_related_posts = absint(blogtory_get_option('no_of_related_posts'));

        $category_ids = array();

        $categories = get_the_category($post_id);
        if(!empty($categories)) {
            foreach($categories as $cat){
                $category_ids[] = $cat->term_id;
            }
        }

        if(!empty($category_ids)){
            $related_posts_args = array(
                'category__in' => $category_ids,
                'post_type' => 'post',
                'post__not_in' => array($post_id),
                'posts_per_page' => $no_of_related_posts,
                'ignore_sticky_posts' => 1,
            );
            $related_posts_query = new WP_Query($related_posts_args);
            if($related_posts_query->have_posts()){
                $related_author_col = 'be-single-col-'.blogtory_get_option('related_author_col');
                ?>
                <div class="blogtory_related_posts_wrapper <?php echo esc_attr($related_author_col);?> clearfix">
                    <div class="title-div">
                        <span>
                        <?php echo esc_html($related_posts_text); ?>
                        </span>
                    </div>
                    <div class="big-row">
                        <?php while($related_posts_query->have_posts()):$related_posts_query->the_post();?>
                            <?php
                            if (has_post_thumbnail()) {
                                ?>
                                <div class="article-block-wrapper col-4 float-l">
                                    <div class="entry-image">
                                        <a href="<?php the_permalink() ?>">
                                            <?php
                                            the_post_thumbnail('blogtory-carousel-boxed', array(
                                                'alt' => the_title_attribute(array(
                                                    'echo' => false,
                                                )),
                                            ));
                                            ?>
                                        </a>
                                    </div>
                                    <div class="article-details">
                                        <h3 class="entry-title">
                                            <a href="<?php the_permalink() ?>">
                                                <?php the_title(); ?>
                                            </a>
                                        </h3>
                                        <div class="be-date-info">
                                            <div class="post-date">
                                                <?php echo esc_html(get_the_date()); ?>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <?php
                            }
                            ?>
                        <?php endwhile;wp_reset_postdata();?>
                    </div>
                </div>
                <?php
            }
        }
    }
}

if ( ! function_exists( 'blogtory_author_posts' ) ) {
    /**
     * Show author posts
     *
     * @since 1.0.0
     *
     */
    function blogtory_author_posts()
    {

        global $post;
        $post_id = $post->ID;

        $author_posts_text = blogtory_get_option('author_posts_text');
        $no_of_author_posts = absint(blogtory_get_option('no_of_author_posts'));

        $author_posts_args = array(
            'author' => get_the_author_meta('ID'),
            'post_type' => 'post',
            'post__not_in' => array($post_id),
            'posts_per_page' => $no_of_author_posts,
            'ignore_sticky_posts' => 1,
        );
        $author_posts_query = new WP_Query($author_posts_args);
        if ($author_posts_query->have_posts()) {
            $related_author_col = 'be-single-col-'.blogtory_get_option('related_author_col');
            ?>
            <div class="blogtory_author_posts_wrapper <?php echo esc_attr($related_author_col);?> clearfix">
                <div class="title-div">
                    <span>
                    <?php echo esc_html($author_posts_text); ?>
                    </span>
                </div>
                <div class="big-row">
                    <?php while ($author_posts_query->have_posts()):$author_posts_query->the_post(); ?>
                        <?php
                        if (has_post_thumbnail()) {
                            ?>
                            <div class="article-block-wrapper col-4 float-l">
                                <div class="entry-image">
                                    <a href="<?php the_permalink() ?>">
                                        <?php
                                        the_post_thumbnail('blogtory-carousel-boxed', array(
                                            'alt' => the_title_attribute(array(
                                                'echo' => false,
                                            )),
                                        ));
                                        ?>
                                    </a>
                                </div>
                                <div class="article-details">
                                    <h3 class="entry-title">
                                        <a href="<?php the_permalink() ?>">
                                            <?php the_title(); ?>
                                        </a>
                                    </h3>
                                    <div class="be-date-info">
                                        <div class="post-date">
                                            <?php echo esc_html(get_the_date()); ?>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <?php
                        }
                        ?>
                    <?php endwhile;
                    wp_reset_postdata(); ?>
                </div>
            </div>
            <?php
        }
    }
}

/* Get Instagram Images*/
if ( ! function_exists( 'blogtory_scrape_instagram' ) ) :
    /**
     * Get Instagram Images
     *
     * @since 1.0.0
     *
     * @param $access_token string Access Token
     * @param $slice int Number of images to fetch
     *
     * @return mixed Array of images or error
     */
    function blogtory_scrape_instagram($access_token = '', $slice = 9){

        if(empty($access_token)){
            $access_token = blogtory_get_option('instagram_access_token' );
        }

        $enable_insta_cache = blogtory_get_option('enable_insta_cache' );
        $insta_cache_time = blogtory_get_option('insta_cache_time' );

        if (false === ($instagram = get_transient('be-instagram-' . sanitize_title_with_dashes($access_token)))) {

            $remote = wp_remote_get('https://api.instagram.com/v1/users/self/media/recent/?access_token='.$access_token);

            if (is_wp_error($remote)) {
                return new WP_Error('site_down', esc_html__('Unable to communicate with Instagram.', 'blogtory'));
            }

            if (200 != wp_remote_retrieve_response_code($remote)) {
                return new WP_Error('invalid_response', esc_html__('Instagram did not return a 200.', 'blogtory'));
            }

            $response = wp_remote_retrieve_body( $remote );
            if ($response === false) {
                return new WP_Error('invalid_body', esc_html__('Instagram did not return a 200.', 'blogtory'));
            }

            $data = json_decode($response, true);

            if ( $data === null) {
                return new WP_Error('bad_json', esc_html__('Instagram has returned invalid data.', 'blogtory'));
            }

            if (isset($data['data'])) {
                $images = $data['data'];
            } else {
                return new WP_Error('bad_json_2', esc_html__('Instagram has returned invalid data.', 'blogtory'));
            }

            if (!is_array($images)) {
                return new WP_Error('bad_array', esc_html__('Instagram has returned invalid data.', 'blogtory'));
            }

            $instagram = array();

            $first = true;
            foreach ($images as $node ) {

                if(true == $first){
                    $instagram['username'] = $node['user']['username'];
                    $instagram['profile_picture'] = preg_replace('/^https?\:/i', '', $node['user']['profile_picture']);
                }
                $image['thumbnail_src'] = preg_replace('/^https?\:/i', '', $node['images']['thumbnail']['url']);
                $image['low_resolution'] = preg_replace('/^https?\:/i', '', $node['images']['low_resolution']['url']);
                $image['standard_resolution'] = preg_replace('/^https?\:/i', '', $node['images']['standard_resolution']['url']);

                $instagram['images'][] = array(
                    'thumbnail' => $image['thumbnail_src'],
                    'small' => $image['low_resolution'],
                    'original' => $image['standard_resolution'],
                    'link' => $node['link'],
                );
                $first = false;
            }

            /*do not set an empty transient - should help catch private or empty accounts*/
            if (!empty($instagram)) {
                if($enable_insta_cache && $insta_cache_time >= 1){
                    set_transient('be-instagram-' . sanitize_title_with_dashes($access_token), $instagram, apply_filters('blogtory_instagram_cache_time', HOUR_IN_SECONDS * absint($insta_cache_time)));
                }
            }
            /**/

        }

        if (!empty($instagram) && isset($instagram['images'])) {
            $instagram['images'] = array_slice($instagram['images'], 0, $slice);
            return $instagram;
        } else {
            return new WP_Error('no_images', esc_html__('Instagram did not return any images.', 'blogtory'));
        }
    }
endif;

/* Display  posts for masonry layout*/
if ( ! function_exists( 'blogtory_masonry_post' ) ) :
    /**
     * Get Masonry Posts
     *
     * @since 1.0.0
     *
     * @param $image_sizes array Array of image sizes
     * @param $counter int post item counter
     * @param $first_post_style string First Post style
     * @param $img_index int Image Index Counter
     *
     */
    function blogtory_masonry_post( &$image_sizes, $counter, $first_post_style = '', &$img_index){

        /*If first post is enabled reduce counter by one*/
        $masonry_item_counter = $counter;
        if(!empty($first_post_style)){
            $masonry_item_counter = $counter - 1;
        }

        /*Declare the modulus as per number of image sizes*/
        $modulus_count = count($image_sizes);
        ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <div class="article-block-wrapper clearfix">
                <?php
                if (has_post_thumbnail()) {
                    blogtory_post_image($image_sizes[$img_index]);
                    $img_index++;
                    if($masonry_item_counter % $modulus_count == 0){
                        $img_index = 0;
                        $image_sizes = array_reverse($image_sizes);
                    }
                }
                ?>
                <div class="article-details">
                    <header class="entry-header">
                        <?php
                        if ( 'post' === get_post_type() ) {
                            blogtory_post_cat_info();
                        }?>
                        <?php the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );?>
                        <?php blogtory_post_meta_info();?>
                    </header><!-- .entry-header -->
                    <?php blogtory_post_excerpt_info();?>
                </div>
            </div>
        </article>
        <?php
    }
endif;


/* Convert hex to rbga */
if ( ! function_exists( 'blogtory_hex2rbga' ) ) :
    /**
     * Get Masonry Posts
     *
     * @since 1.0.0
     *
     * @param $color string Hex color
     * @param $opacity int Opacity
     *
     */
    function blogtory_hex2rbga( $color, $opacity = false ){

        $default = 'rgb(0,0,0)';
     
        //Return default if no color provided
        if(empty($color))
              return $default; 
     
        //Sanitize $color if "#" is provided 
            if ($color[0] == '#' ) {
                $color = substr( $color, 1 );
            }
     
            //Check if color has 6 or 3 characters and get values
            if (strlen($color) == 6) {
                    $hex = array( $color[0] . $color[1], $color[2] . $color[3], $color[4] . $color[5] );
            } elseif ( strlen( $color ) == 3 ) {
                    $hex = array( $color[0] . $color[0], $color[1] . $color[1], $color[2] . $color[2] );
            } else {
                    return $default;
            }
     
            //Convert hexadec to rgb
            $rgb =  array_map('hexdec', $hex);
     
            //Check if opacity is set(rgba or rgb)
            if($opacity){
                if(abs($opacity) > 1)
                    $opacity = 1.0;
                $output = 'rgba('.implode(",",$rgb).','.$opacity.')';
            } else {
                $output = 'rgb('.implode(",",$rgb).')';
            }
     
            //Return rgb(a) color string
            return $output;
    }
endif;