<?php

/**
 * Main Themify class
 * @package themify
 * @since 1.0.0
 */
class Themify {

    /** Default sidebar layout
     * @var string
     */
    public $layout;
    public $sticky_sidebar=null;
    public $post_layout;
    public $post_layout_type='classic';
    public $post_filter=false;
    public $hide_title;
    public $hide_meta;
    public $hide_meta_author;
    public $hide_meta_category;
    public $hide_meta_comment;
    public $hide_meta_tag;
    public $hide_date;
    public $hide_image;
    public $media_position;
    public $unlink_title;
    public $unlink_image;
    public $display_content='';
    public $auto_featured_image;
    public $post_image_width='';
    public $post_image_height='';
    public $width='';
    public $height='';
    public $image_size='';
    public $avatar_size=96;
    public $page_navigation;
    public $posts_per_page;
    public $is_shortcode=false;
    public $page_id='';
    public $query_category='';
    public $query_post_type='';
    public $query_taxonomy='';
    public $paged='';
    public $query_all_post_types;
    public $google_fonts;
    private static $page_image_width=978;
    // Default Single Image Size
    private static $single_image_width=1024;
    private static $single_image_height=585;
    // List Post
    private static $list_post_width=1160;
    private static $list_post_height=665;
    // Grid6
    private static $grid6_width=180;
    private static $grid6_height=120;
    // Grid5
    private static $grid5_width=210;
    private static $grid5_height=130;
    // Grid4
    private static $grid4_width=260;
    private static $grid4_height=150;
    // Grid3
    private static $grid3_width=360;
    private static $grid3_height=205;
    // Grid2
    private static $grid2_width=561;
    private static $grid2_height=321;
    // List Large
    private static $list_large_image_width=800;
    private static $list_large_image_height=460;
    // List Thumb
    private static $list_thumb_image_width=260;
    private static $list_thumb_image_height=150;
    // List Grid2 Thumb
    private static $grid2_thumb_width=160;
    private static $grid2_thumb_height=95;
    // Use dimensions defined in custom post type panel
    public $use_original_dimensions='no';
    // Sorting Parameters
    public $order='DESC';
    public $orderby='date';
    public $order_meta_key=false;

    public $page_title;
    public $image_page_single_width;
    public $image_page_single_height;
    public $hide_page_image;

    function __construct() {

        add_action('template_redirect', array($this, 'template_redirect'), 5);
    }

    private function themify_set_global_options() {
        ///////////////////////////////////////////
        //Global options setup
        ///////////////////////////////////////////

        $this->layout=themify_get('setting-default_layout', 'sidebar1', true);
        $this->post_layout=themify_get('setting-default_post_layout', 'list-post', true);
        $this->post_layout_type=themify_get('setting-post_content_layout', $this->post_layout_type, true);
        $this->hide_title=themify_get('setting-default_post_title', '', true);
        $this->unlink_title=themify_get('setting-default_unlink_post_title', '', true);
        $this->media_position='auto_tiles'===$this->post_layout || in_array($this->post_layout_type, array(
            'polaroid',
            'flip'
        )) ? 'above' : themify_get('setting-default_media_position', 'above', true);
        $this->hide_image=themify_get('setting-default_post_image', '', true);
        $this->unlink_image=themify_get('setting-default_unlink_post_image', '', true);


        $this->hide_meta=themify_get('setting-default_post_meta', '', true);
        $this->hide_meta_author=themify_get('setting-default_post_meta_author', '', true);
        $this->hide_meta_category=themify_get('setting-default_post_meta_category', '', true);
        $this->hide_meta_comment=themify_get('setting-default_post_meta_comment', '', true);
        $this->hide_meta_tag=themify_get('setting-default_post_meta_tag', '', true);
        $this->auto_featured_image=themify_check('setting-auto_featured_image', true);
        $this->hide_date=themify_get('setting-default_post_date', '', true);

        // Set Order & Order By parameters for post sorting
        $this->order=themify_get('setting-index_order', $this->order, true);
        $this->orderby=themify_get('setting-index_orderby', $this->orderby, true);

        if($this->orderby==='meta_value' || $this->orderby==='meta_value_num') {
            $this->order_meta_key=themify_get('setting-index_meta_key', '', true);
        }

        $this->display_content=themify_get('setting-default_layout_display', '', true);
        $this->excerpt_length=themify_get('setting-default_excerpt_length', '', true);
        $this->avatar_size=apply_filters('themify_author_box_avatar_size', $this->avatar_size);

        $this->width=themify_get('setting-image_post_width', '', true);
        $this->height=themify_get('setting-image_post_height', '', true);
        $this->posts_per_page=get_option('posts_per_page');
    }

    private function set_search() {

        $this->layout=themify_get('setting-search-result_layout', 'sidebar1', true);
        $this->post_layout=themify_get('setting-search-result_post_layout', 'list-post', true);
        $this->post_layout_type=themify_get('setting-search-post_content_layout', $this->post_layout_type, true);
        $this->display_content=themify_get('setting-search-result_layout_display', 'excerpt', true);
        $this->hide_title=themify_get('setting-search-result_post_title', 'no', true);
        $this->unlink_title=themify_get('setting-search-result_unlink_post_title', 'no', true);
        $this->hide_date=themify_get('setting-search-result_post_date', 'no', true);
        $this->media_position='auto_tiles'===$this->post_layout || in_array($this->post_layout_type, array(
            'polaroid',
            'flip'
        )) ? 'above' : themify_get('setting-search-result_media_position', 'above', true);
        $this->hide_image=themify_get('setting-search-result_post_image', 'no', true);
        $this->unlink_image=themify_get('setting-search-result_unlink_post_image', 'no', true);
        $this->width=themify_get('setting-search-image_post_width', '', true);
        $this->height=themify_get('setting-search-image_post_height', '', true);
        $this->auto_featured_image=themify_check('setting-search-auto_featured_image', true);
        $post_meta_key='setting-search-result_';
        $this->hide_meta=themify_get($post_meta_key . 'post_meta', '', true);
        if($this->hide_meta!=='yes') {
            $post_meta_keys=array(
                '_author'=>'post_meta_author',
                '_category'=>'post_meta_category',
                '_comment'=>'post_meta_comment',
                '_tag'=>'post_meta_tag'
            );

            foreach($post_meta_keys as $k=>$v) {
                $this->{'hide_meta' . $k}=themify_get($post_meta_key . $v, '', true);
            }
        }
    }

    /**
     * Check whether sticky sidebar is enabled.
     * @return bool
     */
    private function themify_get_sticky_slider_value() {
        $postType=get_post_type();
        $excluded_types=apply_filters('themify_exclude_CPT_for_sidebar', array(
            'post',
            'page',
            'attachment',
            'tbuilder_layout',
            'tbuilder_layout_part',
            'section'
        ));
        $option=null;
        if(themify_is_shop()) {
            $option='setting-shop_sticky_sidebar';
        } elseif(is_page()) {
            $option='setting-default_page_sticky_sidebar';
        } elseif(is_singular('post')) {
            $option='setting-default_page_post_sticky_sidebar';
        } elseif(is_singular('portfolio')) {
            $option='setting-default_portfolio_single_sticky_sidebar';
        } elseif(is_post_type_archive('portfolio') || is_tax('portfolio-category')) {
            $option='setting-default_portfolio_index_sticky_sidebar';
        } elseif(themify_is_woocommerce_active() && (is_product_category() || is_product_tag() || is_singular('product'))) {
            $option=is_singular('product') ? 'setting-single_product_sticky_sidebar' : 'setting-shop-archive_sticky_sidebar';
        } elseif(!in_array($postType, $excluded_types)) {
            if(is_archive($postType)) {
                $option='setting-custom_post_' . $postType . '_archive_post_sticky_sidebar';
            } elseif(is_singular($postType)) {
                $option='setting-custom_post_' . $postType . '_single_post_sticky_sidebar';
            }
        } elseif(is_archive() || is_home()) {
            $option='setting-default_sticky_sidebar';
        } elseif(is_search()) {
            $option='setting-search-result_sticky_sidebar';
        }
        if($option!==null) {
            $value=is_singular() || themify_is_shop() ? themify_get_both('post_sticky_sidebar', $option, false) : themify_check($option, true);
        } else {
            $value=false;
        }
        return $value;
    }

    function template_redirect() {

        $this->themify_set_global_options();
        if(is_singular()) {
            $this->display_content='content';
        }
        if(is_page() || themify_is_shop()) {
            if(post_password_required()) {
                return;
            }
            $this->page_id=get_the_ID();
            // Set Page Number for Pagination
            $this->paged=get_query_var('paged');
            if(empty($this->paged)) {
                $this->paged=get_query_var('page', 1);
            }
            global $paged;
            $paged=$this->paged;
            // Set Sidebar Layout
            $this->layout=themify_get_both('page_layout', 'setting-default_page_layout', 'sidebar1');
            $this->page_title=themify_get_both('hide_page_title', 'setting-hide_page_title', 'no');
            $this->image_page_single_width=themify_get('setting-page_featured_image_width', self::$page_image_width, true);
            $this->image_page_single_height=themify_get('setting-page_featured_image_height', 0, true);
            $this->hide_page_image=themify_get('setting-hide_page_image', false, true)==='yes' ? 'yes' : 'no';
            if(!themify_is_shop()) {
                $post_query_category=themify_get('query_category', '');
                $portfolio_query_category=themify_get('portfolio_query_category', '');

                // Post query query ///////////////////
                if($portfolio_query_category!=='') {

                    // GENERAL QUERY POST TYPES
                    $this->query_category=$portfolio_query_category;
                    $this->query_post_type='portfolio';
                    $this->query_taxonomy=$this->query_post_type . '-category';
                    $this->post_layout=themify_get('portfolio_layout', 'list-post');
                    $this->post_layout_type=themify_get_both('portfolio_content_layout', 'setting-portfolio_content_layout', $this->post_layout_type);
                    $this->post_filter=themify_get_both('portfolio_post_filter', 'setting-portfolio_post_filter', 'no');
                    $this->hide_meta=themify_get_both('portfolio_hide_meta_all', 'setting-default_portfolio_index_post_meta_category', 'no');
                    $this->hide_title=themify_get_both('portfolio_hide_title', 'setting-default_portfolio_index_title', 'no');
                    $this->unlink_title=themify_get_both('portfolio_unlink_title', 'setting-default_portfolio_index_unlink_post_title', 'no');
                    $this->unlink_image=themify_get_both('portfolio_unlink_image', 'setting-default_portfolio_index_unlink_post_image', 'no');
                    $this->hide_date=themify_get_both('hide_portfolio_date', 'setting-default_portfolio_single_hide_post_date', 'no');
                    $this->hide_image=themify_get_both('portfolio_hide_image', 'setting-default_portfolio_index_post_image', 'no');
                    $this->width=themify_get_both('portfolio_image_width', 'setting-default_portfolio_index_image_post_width', '');
                    $this->height=themify_get_both('portfolio_image_height', 'setting-default_portfolio_index_image_post_height', '');
                    $this->display_content=themify_get('portfolio_display_content', 'excerpt');
                    $this->page_navigation=themify_get('portfolio_hide_navigation', 'no');
                    $this->posts_per_page=themify_get('portfolio_posts_per_page');
                    $this->order=themify_get('portfolio_order', 'desc');
                    $this->orderby=themify_get('portfolio_orderby', 'date');

                    if($this->orderby==='meta_value' || $this->orderby==='meta_value_num') {
                        $this->order_meta_key=themify_get('portfolio_meta_key');
                    }

                    $this->use_original_dimensions='no';
                } elseif($post_query_category!=='') {
                    $this->query_category=$post_query_category;
                    $this->query_post_type='post';
                    $this->query_taxonomy='category';
                    $this->post_layout=themify_get('layout', 'list-post');
                    $this->post_layout_type=themify_get('post_content_layout', $this->post_layout_type);
                    $this->media_position='auto_tiles'===$this->post_layout || in_array($this->post_layout_type, array(
                        'polaroid',
                        'flip'
                    )) ? 'above' : $this->media_position;
                    // GENERAL QUERY POSTS
                    $this->hide_title=themify_get('hide_title', $this->hide_title);
                    $this->unlink_title=themify_get('unlink_title', $this->unlink_title);
                    $this->hide_image=themify_get('hide_image', $this->hide_image);
                    $this->unlink_image=themify_get('unlink_image', $this->unlink_image);
                    $this->hide_date=themify_get('hide_date', $this->hide_date);
                    $this->page_navigation=themify_get('hide_navigation', $this->page_navigation);
                    $this->posts_per_page=themify_get('posts_per_page', $this->posts_per_page);
                    $this->width=themify_get('image_width', $this->width);
                    $this->height=themify_get('image_height', $this->height);
                    $this->display_content=themify_get('display_content', 'excerpt');
                    $this->order=themify_get('order', 'desc');
                    $this->orderby=themify_get('orderby', 'date');
                    $this->post_filter=themify_get_both('post_filter', 'setting-post_filter', 'no');

                    if($this->orderby==='meta_value' || $this->orderby==='meta_value_num') {
                        $this->order_meta_key=themify_get('meta_key', $this->order_meta_key);
                    }

                    // Post Meta Values ///////////////////////
                    $post_meta_keys=array(
                        '_author'=>'post_meta_author',
                        '_category'=>'post_meta_category',
                        '_comment'=>'post_meta_comment',
                        '_tag'=>'post_meta_tag'
                    );
                    $post_meta_key='setting-default_';

                    $this->hide_meta=themify_get('hide_meta_all', $this->hide_meta);
                    foreach($post_meta_keys as $k=>$v) {
                        $this->{'hide_meta' . $k}=themify_get_both('hide_meta' . $k, $post_meta_key . $v, false);
                    }
                }
            }
        } elseif(is_post_type_archive('portfolio') || is_tax('portfolio-category')) {
            $this->query_taxonomy='portfolio-category';
            $this->query_post_type='portfolio';
            $this->layout=themify_get('setting-default_portfolio_index_layout', 'sidebar-none', true);
            $this->post_layout=themify_get('setting-default_portfolio_index_post_layout', 'grid3', true);
            $this->post_layout_type=themify_get('setting-portfolio_content_layout', $this->post_layout_type, true);
            $this->post_filter=themify_get('setting-portfolio_post_filter', 'yes', true);
            $this->display_content=themify_get('setting-default_portfolio_index_display', 'none', true);
            $this->hide_title=themify_get('setting-default_portfolio_index_title', 'no', true);
            $this->unlink_title=themify_get('setting-default_portfolio_index_unlink_post_title', 'no', true);
            $this->hide_meta=themify_get('setting-default_portfolio_index_post_meta_category', 'yes', true);
            $this->hide_date=themify_get('setting-default_portfolio_index_hide_post_date', 'yes', true);
            $this->unlink_image=themify_get('setting-default_portfolio_index_unlink_post_image', 'no', true);
            $this->width=themify_get('setting-default_portfolio_index_image_post_width', '', true);
            $this->height=themify_get('setting-default_portfolio_index_image_post_height', '', true);
            $this->hide_image=themify_get('setting-default_portfolio_index_image', '', true);

        } elseif(is_single()) {
            $this->display_content='';
            if(is_singular('portfolio')) {
                $this->layout=themify_get_both('layout', 'setting-default_portfolio_single_layout', 'sidebar-none');
                $this->post_layout_type=themify_get_both('post_layout', 'setting-default_portfolio_single_portfolio_layout_type');
                $this->hide_title=themify_get_both('hide_post_title', 'setting-default_portfolio_single_title');
                $this->hide_date=themify_get_both('hide_post_date', 'setting-default_portfolio_single_hide_post_date', 'no');
                $this->unlink_title=themify_get_both('unlink_post_title', 'setting-default_portfolio_single_unlink_post_title');
                $this->unlink_image=themify_get_both('unlink_post_image', 'setting-default_portfolio_single_unlink_post_image');
                $this->hide_meta=themify_get_both('hide_post_meta', 'setting-default_portfolio_single_post_meta_category', 'no');
                $this->width=themify_get_both('image_width', 'setting-default_portfolio_single_image_post_width', '');
                $this->height=themify_get_both('image_height', 'setting-default_portfolio_single_image_post_height', '');
                $this->hide_image=themify_get_both('hide_post_image', 'setting-default_portfolio_single_image', '');
            } else {
                $post_meta_key='setting-default_page_';
                $this->layout=themify_get_both('layout', $post_meta_key . 'post_layout', 'sidebar1');
                $postType=get_post_type();
                $this->post_layout_type=themify_get_both('post_layout', $post_meta_key . $postType . '_layout_type', '');
                if(is_singular('post')) {
                    $this->hide_title=themify_get_both('hide_post_title', $post_meta_key . 'post_title', '');
                    $this->hide_date=themify_get_both('hide_post_date', $post_meta_key . 'post_date', '');
                    $this->unlink_title=themify_get_both('unlink_post_title', $post_meta_key . 'unlink_post_title', '');
                    $this->hide_image=themify_get_both('hide_post_image', $post_meta_key . 'post_image', '');
                    $this->unlink_image=themify_get_both('unlink_post_image', $post_meta_key . 'unlink_post_image', '');
                    $this->hide_meta=themify_get_both('hide_meta_all', $post_meta_key . 'post_meta', '');
                    $this->width=themify_get_both('image_width', 'setting-image_post_single_width', '');
                    $this->height=themify_get_both('image_height', 'setting-image_post_single_height', '');
                    $this->media_position='auto_tiles'===$this->post_layout || in_array($this->post_layout_type, array(
                        'polaroid',
                        'flip'
                    )) ? 'above' : themify_get($post_meta_key . 'single_media_position', 'above', true);
                }
                $excluded_types=apply_filters('themify_exclude_CPT_for_sidebar', array(
                    'post',
                    'page',
                    'attachment',
                    'tbuilder_layout',
                    'tbuilder_layout_part',
                    'section'
                ));
                if(!in_array($postType, $excluded_types, true)) {
                    // set Custom Post layout
                    $layout='custom_post_' . $postType . '_single';
                    $this->layout=themify_get($layout, $this->layout);
                }
                // Post Meta Values ///////////////////////
                $post_meta_keys=array(
                    '_author'=>'post_meta_author',
                    '_category'=>'post_meta_category',
                    '_comment'=>'post_meta_comment',
                    '_tag'=>'post_meta_tag'
                );

                foreach($post_meta_keys as $k=>$v) {
                    $this->{'hide_meta' . $k}=themify_get_both('hide_meta' . $k, $post_meta_key . $v, false);
                }
            }
            if(is_attachment()) {
                $this->hide_image='yes';
            }
        } elseif(is_search()) {
            $this->set_search();
        } elseif(is_archive() || is_home()) {
            $excluded_types=apply_filters('themify_exclude_CPT_for_sidebar', array(
                'post',
                'page',
                'attachment',
                'tbuilder_layout',
                'tbuilder_layout_part',
                'section'
            ));
            $postType=get_post_type();
            if('post'===$postType){
                $this->post_filter=themify_get('setting-post_filter', 'no', true);
            }
            if(!in_array($postType, $excluded_types, true)) {
                $this->layout=themify_get('setting-custom_post_' . $postType . '_archive', $this->layout, true);
            }
        }

        $this->sticky_sidebar=$this->themify_get_sticky_slider_value();
        if($this->post_layout_type==='split') {
            $this->layout='sidebar-none';
        }
        if($this->width==='' && $this->height==='') {
            if(is_single()) {
                $this->width=self::$single_image_width;
                $this->height=self::$single_image_height;
            } else {
                switch($this->post_layout) {
                    case 'grid6':
                        $this->width=self::$grid6_width;
                        $this->height=self::$grid6_height;
                        break;
                    case 'grid5':
                        $this->width=self::$grid5_width;
                        $this->height=self::$grid5_height;
                        break;
                    case 'grid4':
                        $this->width=self::$grid4_width;
                        $this->height=self::$grid4_height;
                        break;
                    case 'grid3':
                        $this->width=self::$grid3_width;
                        $this->height=self::$grid3_height;
                        break;
                    case 'grid2':
                        $this->width=self::$grid2_width;
                        $this->height=self::$grid2_height;
                        break;
                    case 'list-large-image':
                        $this->width=self::$list_large_image_width;
                        $this->height=self::$list_large_image_height;
                        break;
                    case 'list-thumb-image':
                        $this->width=self::$list_thumb_image_width;
                        $this->height=self::$list_thumb_image_height;
                        break;
                    case 'grid2-thumb':
                        $this->width=self::$grid2_thumb_width;
                        $this->height=self::$grid2_thumb_height;
                        break;
                    default :
                        $this->width=self::$list_post_width;
                        $this->height=self::$list_post_height;
                        break;
                }
            }
        }
    }

}

global $themify;
$themify=new Themify();
