<?php

add_theme_support( 'woocommerce' );

class Themify_WC{
	
	
	public static $singleImageSize='shop_single';
	public static $loopImageSize='shop_catalog';
	public static $thumbImageSize='shop_thumbnail';
    private static $themify_save=null;
	
	public static function before_init(){
		// Alter or remove success message after adding to cart with ajax.
		add_filter( 'wc_add_to_cart_message_html',array(__CLASS__,'add_to_cart_message'));
		add_filter( 'woocommerce_notice_types',array(__CLASS__,'add_to_cart_message') );
		
		add_filter( 'woocommerce_add_to_cart_fragments', array(__CLASS__,'add_to_cart_fragments'));//Adding cart total and shopdock markup to the fragments
		
		
		add_filter('loop_shop_per_page', array(__CLASS__,'products_per_page'), 100 );// Set number of products shown in product archive pages
		
		add_action('template_redirect', array(__CLASS__,'set_wc_vars'), 12);
		add_action('woocommerce_before_template_part',array(__CLASS__,'load_wc_styles'),10,5);

		// Hide products in shop page
		if ( ! is_admin() && themify_check( 'setting-hide_shop_products', true ) ) {
			add_action( 'woocommerce_before_main_content', array( __CLASS__, 'hide_shop_products' ) );
		}
	}
	
	
	
		
	public static function set_wc_vars(){
		remove_action( 'woocommerce_before_shop_loop_item', 'woocommerce_template_loop_product_link_open' );
		remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_product_link_close', 5 );
		remove_action( 'woocommerce_after_shop_loop', 'woocommerce_pagination');
		remove_action( 'woocommerce_shop_loop_item_title', 'woocommerce_template_loop_product_title');
		remove_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_show_product_loop_sale_flash' );
		remove_action( 'woocommerce_before_single_product_summary', 'woocommerce_show_product_sale_flash');
		
		// Set WC image sizes
		add_image_size('cart_thumbnail', 40, 40, true);
		
		//Product Wrapper
		add_action( 'woocommerce_before_shop_loop_item_title', array(__CLASS__,'loop_wrapper_start'),11);
		add_action('woocommerce_after_shop_loop_item',array(__CLASS__,'loop_wrapper_end'), 100);
		add_action( 'woocommerce_shop_loop_item_title',  array(__CLASS__,'loop_product_title'));
		add_filter('woocommerce_product_loop_title_classes',array(__CLASS__,'product_title_class'), 100,1);
		add_action('tf_wc_loop_start',array(__CLASS__,'before_loop'), 100,1);
		// Wrap product description
		add_filter( 'woocommerce_short_description', array(__CLASS__,'description_wrap'),10,1);
		
		add_action( 'woocommerce_review_before', array(__CLASS__,'load_comment_review_css') );
		
		add_filter('woocommerce_pagination_args', array(__CLASS__,'load_pagination_styles'));
		add_filter('woocommerce_comment_pagination_args', array(__CLASS__,'load_pagination_styles'));
		add_action('woocommerce_before_account_orders_pagination', array(__CLASS__,'load_pagination_styles'));
		
		//Variable Product link 
		if(themify_get('setting-product_archive_hide_cart_button',false,true) === 'yes' ){
			remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart');
		}
		
		
		if(is_woocommerce()){
			
			global $themify;
			if(is_product()) {
				
				$themify->image_size=self::$singleImageSize;
                if('custom' === themify_get( 'setting-product_single_image_size',false,true )){
                    add_filter( 'woocommerce_gallery_image_size', array(__CLASS__,'single_product_image_size'), 100 );
                    add_filter( 'woocommerce_gallery_image_html_attachment_image_params', array(__CLASS__,'single_product_image_attrs'), 100 );
                }
				list($themify->width,$themify->height)=self::getSingleImageSize();
				$themify->layout = themify_get_both('custom_post_product_single','setting-single_product_layout','sidebar1');
				$themify->hide_title='no';
				$themify->display_content='content';
				
				if(themify_check( 'setting-hide_shop_single_breadcrumbs',true )){
					remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );
				}
			
				
				
				//related Limit
				if (themify_check( 'setting-related_products',true) ) {
					remove_action( 'woocommerce_after_single_product_summary', 'woocommerce_output_related_products', 20 );
				} 
				else{
					add_filter( 'woocommerce_output_related_products_args', array(__CLASS__,'related_limit'), 100 );
				}
				
				//review tabs
				remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_rating');
				
				if(themify_check('setting-product_reviews',true)){
					add_filter( 'woocommerce_product_tabs', array(__CLASS__,'product_reviews'),100,1);
				}
				elseif(themify_check('setting-product_reviews_empty',true)){
					add_action('woocommerce_single_product_summary',array(__CLASS__,'show_product_rating'), 15 );// Always show Rating
				}
				else{
					add_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_rating',15 );//Change position of rating
				}
				
				
				add_filter( 'woocommerce_available_variation',array(__CLASS__,'variation_image_size'));//Set variation image sizes
				
				//Change OnSale Position
				add_action('woocommerce_product_thumbnails','woocommerce_show_product_sale_flash');
				//Increase variation limit
				add_filter( 'woocommerce_ajax_variation_threshold', array(__CLASS__,'variation_limit'));
			}
			else{
				
				if( themify_check('setting-hide_shop_sorting',true)){
					remove_action( 'woocommerce_before_shop_loop', 'woocommerce_catalog_ordering', 30 );
				}
				$themify->image_size=self::$loopImageSize;
				list($themify->width,$themify->height)=self::getLoopImageSize();
				$sidebar_layout = themify_get('page_layout','default');
				if ('default' === $sidebar_layout ) {
					$key = themify_is_shop()?'setting-shop_layout':'setting-shop_archive_layout';
					$sidebar_layout = themify_get($key,'default',true);
					if($sidebar_layout==='default'){
						$sidebar_layout = themify_get('setting-default_layout','sidebar1',true);
					}
				}
				
				$themify->layout=$sidebar_layout;
				$themify->post_layout_type = themify_get( 'setting-product_content_layout','',true);
				$themify->post_layout =themify_get('setting-products_layout','grid4',true ); 
				$themify->display_content=themify_get('setting-product_archive_show_short','none',true);
				$themify->hide_title=themify_get('setting-product_archive_hide_title','no',true);
				
						
				
				//Archive Result Count
				if(themify_check( 'setting-hide_shop_count',true  )){
					remove_action( 'woocommerce_before_shop_loop', 'woocommerce_result_count', 20 );
				}
				//Archive breadcrumbs
				if(themify_check( 'setting-hide_shop_breadcrumbs',true )){
					remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );
				}
					
				if($themify->display_content!=='none'){
					// Show excerpt or content in product archive pages
					add_action('woocommerce_after_shop_loop_item',array(__CLASS__,'loop_description'), 9);
				}
			}
			
			//Product price
			if(themify_get('setting-product_archive_hide_price',false,true)=== 'yes'){
				remove_action('woocommerce_after_shop_loop_item_title','woocommerce_template_loop_price');// No product price in product archive pages
			}
			
			//product rating 
			if(themify_check( 'setting-hide_product_rating_stars',true  )){
				remove_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_template_loop_rating', 5 );
			}
			elseif(themify_check('setting-products_reviews_empty',true)){
				add_filter( 'woocommerce_product_get_rating_html', array(__CLASS__,'loop_rating_html'), 100, 3 );// Always show rating even for 0 rating
			}
			
		}
	}
	
	public static function loop_wrapper_start(){
		?>
		<div class="product-content">
		<?php
	}
	
	public static function loop_wrapper_end(){
		?>
		</div>
		<?php
	}
	
	
	public static function loop_image($image, $product, $size, $attr, $placeholder, $orig_image){
	    if ( is_cart() || is_checkout()) {
		    return $image;
		}
        global $themify;
        $alt=get_the_post_thumbnail_caption();
        if($alt===''){
            $alt=$product->get_title();
        }
	    $wc_shortcode=wc_get_loop_prop( 'is_shortcode' );
        static $hoverMode=null;
        if($hoverMode===null){
            $hoverMode=themify_check('setting-product_hover_image',true);
        }
        $hover_image=null;
        if($hoverMode===true){
            $gallery = $product->get_gallery_image_ids();
            if(!empty($gallery)){
                $second_alt=wp_get_attachment_caption($gallery[0]);
                if(!$second_alt){
                    $second_alt=$alt;
                }
                if($wc_shortcode){
                    $hover_image=wp_get_attachment_image( $gallery[0], 'woocommerce_thumbnail', false, array('class'=>'themify_product_second_image tf_abs tf_opacity','alt'=>$second_alt) );
                }else{
                    $hover_image=themify_get_image(array('alt'=>$second_alt,'w'=>$themify->width,'h'=>$themify->height,'image_size'=>$themify->image_size,'src'=>$gallery[0],'class'=>'themify_product_second_image tf_abs tf_opacity'));
                }
            }
        }
        if($wc_shortcode){
            return $image.$hover_image;
        }

		$src=$product->get_image_id();
		if(!$src){
		    $p=$product->get_parent_id();
		    if ( $p ) {
			$parent_product = wc_get_product( $p );
			if ( $parent_product ) {
				$src = $parent_product->get_image_id();
			}
			unset($parent_product,$p);
		    }
		    if(!$src){
			$src=wc_placeholder_img_src();
		    }
		}
		ob_start();
		?>
		<figure class="post-image product-image">
			<?php if($product->is_on_sale()):?>
				<?php woocommerce_show_product_loop_sale_flash();?>
			<?php endif?>
			<?php if(  $themify->unlink_image!=='yes' ):?>
				<a href="<?php the_permalink()?>">
			<?php endif;?>
			
				<?php echo themify_get_image(array('alt'=>$alt,'w'=>$themify->width,'h'=>$themify->height,'image_size'=>$themify->image_size,'src'=>$src));?>
			
			<?php if(!empty($hover_image)):?>
				<?php echo $hover_image; ?>
			<?php endif;?>
			<?php if(  $themify->unlink_image!=='yes' ):?>
				</a>
			<?php endif;?>
		</figure>
		<?php
		return ob_get_clean();
	}
	
	public static function variation_limit(){
		return 200;
	}
	
	public static function related_limit($args){
		$args['posts_per_page']=themify_get('setting-related_products_limit',3,true);
		return $args;
	}
		
	public static function load_comment_review_css($post_id){
		remove_action( 'woocommerce_review_before',array(__CLASS__,'load_comment_review_css'));
		Themify_Enqueue_Assets::loadThemeWCStyleModule('review');
	}
	
	
	public static function product_reviews($tabs){
		unset($tabs['reviews']);
		return $tabs;
	}
	
	
	/**
	 * Override WooCommerce single-product/rating template user want to always show the rating
	 */
	public static function show_product_rating(){
		global $product;

		if ( ! wc_review_ratings_enabled() ) {
			return;
		}

		$rating_count = $product->get_rating_count();
		$review_count = $product->get_review_count();
		$average      = $product->get_average_rating();

		if ( $rating_count >= 0 ) : ?>

            <div class="woocommerce-product-rating">
				<?php echo $rating_count > 0 ? wc_get_rating_html( $average, $rating_count ) : self::loop_rating_html('',"0",''); ?>
				<?php if ( comments_open() ) : ?>
                    <a href="#reviews" class="woocommerce-review-link" rel="nofollow">(<?php printf( _n( '%s customer review', '%s customer reviews', $review_count, 'themify' ), '<span class="count">' . esc_html( $review_count ) . '</span>' ); ?>)</a>
				<?php endif ?>
            </div>

		<?php
		endif;
	}
	
	
	public static function loop_product_title(){
	    global $themify;
	    if($themify->hide_title!=='yes'){
		themify_post_title(array('tag'=>'h2','class'=>apply_filters( 'woocommerce_product_loop_title_classes', 'woocommerce-loop-product__title' ),'link_class'=>'woocommerce-LoopProduct-link woocommerce-loop-product__link'));
	    }
	}
	
	public static function product_title_class($class){
	    return 'product_title woocommerce-loop-product__title';
	}
	
	
	
	
	public static function loop_rating_html( $rating_html, $rating, $count){
		if('0' == $rating){
			/* translators: %s: rating */
			$label = __( 'Rated 0 out of 5', 'themify' );
			$rating_html  = '<div class="star-rating" role="img" aria-label="' . $label . '">' . wc_get_star_rating_html( $rating, $count ) . '</div>';
		}
		return $rating_html;
	}
	

	/**
	 * Set number of products shown in shop
	 * @return int Number of products based on user choice
	 */
	public static function products_per_page($limit){
		return themify_get('setting-shop_products_per_page',$limit,true);
	}
	
	
	/**
	 * Outputs product short description or full content depending on the setting.
	 */
	public static function loop_description(){
        global $themify, $ThemifyBuilder;
        if ( $themify->display_content==='none' || ! empty( $ThemifyBuilder->in_the_loop ) || wc_get_loop_prop( 'is_shortcode' ) ) {
            return;
        }
		?>
		<div class="product-description">
			<?php $themify->display_content==='excerpt'?the_excerpt():the_content();?>
		</div>
		<?php
	}
	
	public static function description_wrap($desc){
		return '<div class="product-description">' . $desc . '</div><!-- /.product-description -->';
	}
	
	
	/**
	* Remove (unnecessary) success message after a product was added to cart through theme's AJAX method.
	* @since 1.5.5
	* @param string $message
	* @return string
	*/
	public static function add_to_cart_message( $message ){
        if ( isset( $_REQUEST['wc-ajax'] ) && 'theme_add_to_cart' === $_REQUEST['wc-ajax'] ) {
			//Adding cart ajax on single product page
			add_action( 'wc_ajax_theme_add_to_cart',array(__CLASS__,'ajax_add_to_cart_refresh') );
			add_action( 'wc_ajax_nopriv_theme_add_to_cart', array(__CLASS__,'ajax_add_to_cart_refresh') );
			$message = '';
		}
		return $message;
		
	}
	
		

	/**
	 * Add to cart ajax on single product page
	 * @return json
	 */
	public static function ajax_add_to_cart_refresh() {
		ob_start();
		WC_AJAX::get_refreshed_fragments();
		die();	
	}
	
		
		
	/**
	 * Add cart total and shopdock cart to the WC Fragments
	 * @param array $fragments 
	 * @return array
	 */
	public static function add_to_cart_fragments( $fragments ) {
		// cart list
		ob_start();
		get_template_part( 'includes/shopdock' );
		$fragments['#shopdock-ultra'] = ob_get_clean();
		$count = WC()->cart->get_cart_contents_count();
		$fragments['.cart-icon-link span'] =$count===0?'<span></span>': sprintf( '<span>%s</span>', $count );
		return $fragments;
	}
	
	
		
	/**
	 * Specific for infinite scroll themes
	 */
	public static function pagination() {
        if ( wc_get_loop_prop( 'is_shortcode' ) ) {
            $name=wc_get_loop_prop( 'name' );
            if(in_array($name,array('products','recent_products','sale_products','best_selling_products','top_rated_products','featured_products'))){
                woocommerce_pagination();
            }
		} else {
			get_template_part( 'includes/pagination');
		}
	}
	
	
	
	public static function getSingleImageSize(){
		if('custom' === themify_get( 'setting-product_single_image_size',false,true )){
		    $width=themify_get('setting-default_product_single_image_post_width',false,true);
		    $height=themify_get('setting-default_product_single_image_post_height',false,true);
		}
		else{
		    $width=$height=false;
		}
		if($width===false && $height===false){
		    $size = wc_get_image_size( self::$singleImageSize );
		    $width= $size['width'];
		    $height= $size['height'];
		}
		return array($width,$height);
	}
	
	
	public static function getLoopImageSize(){
		if('custom' === themify_get( 'setting-product_shop_image_size',false,true )){
		    $width=themify_get('setting-default_product_index_image_post_width',false,true);
		    $height=themify_get( 'setting-default_product_index_image_post_height',false,true);
		}
		else{
		    $width=$height=false;
		}
		if($width===false && $height===false){
			$size = wc_get_image_size(self::$loopImageSize );
			$width= $size['width'];
			$height= $size['height'];
		}
		return array($width,$height);
	}
	
	
	public static function variation_image_size($data ){
		if( ! empty( $data[ 'image' ] ) ) {
			list($data[ 'image' ][ 'src_w' ],$data[ 'image' ][ 'src_h' ])=self::getSingleImageSize();
			$data[ 'image' ][ 'src' ]=themify_get_image( array('src'=>$data[ 'image' ][ 'src' ],'w'=>$data[ 'image' ][ 'src_w' ],'h'=>$data[ 'image' ][ 'src_h' ],'urlonly'=>true,'image_size'=>self::$singleImageSize) );
			
		}
		return $data;
	}
	
	public static function hide_shop_products( $q ) {
		if ( themify_is_shop() ) {
		    query_posts( array( 'post__in' => array( 0 ) ) );
		    remove_action( 'woocommerce_no_products_found', 'wc_no_products_found' );
		}
	}

	public static function load_wc_styles($template_name, $template_path, $located, $args){
		if($template_name==='loop/orderby.php'){
			Themify_Enqueue_Assets::loadThemeWCStyleModule( 'orderby' );
		}
		elseif($template_name==='single-product/tabs/tabs.php'){
		    Themify_Enqueue_Assets::loadThemeWCStyleModule( 'tabs' );
		}
		elseif($template_name==='loop/pagination.php'){
			self::load_pagination_styles();
		}
		elseif(($template_name==='single-product/related.php' && !empty($args['related_products'])) || ($template_name==='single-product/up-sells.php' && !empty($args['upsells']))){
			Themify_Enqueue_Assets::loadThemeWCStyleModule('related');
            $width = themify_get( 'setting-product_related_image_width',false,true );
            $height = themify_get( 'setting-product_related_image_height',false,true );
            if($height===false && $width===false){
                list($width,$height)=self::getLoopImageSize();
            }
            global $themify;
            self::$themify_save = clone $themify;
            $themify->width=$width;
            $themify->height=$height;
            add_action( 'woocommerce_after_template_part',array(__CLASS__,'reset_themify_property'),10,5);
		}
	}

    public static function reset_themify_property($template_name, $template_path, $located, $args){
        if(($template_name==='single-product/related.php' && !empty($args['related_products'])) || ($template_name==='single-product/up-sells.php' && !empty($args['upsells']))){
            remove_action( 'woocommerce_after_template_part',array(__CLASS__,'reset_themify_property'),10,5);
            if(self::$themify_save!==null){
                global $themify;
                $themify = clone self::$themify_save;
                self::$themify_save=null;
            }
        }
    }
	
	public static function load_pagination_styles($args=array()){
	    remove_filter('woocommerce_pagination_args', array(__CLASS__,'load_pagination_styles'));
	    remove_filter('woocommerce_comment_pagination_args', array(__CLASS__,'load_pagination_styles'));
	    remove_action('woocommerce_before_account_orders_pagination', array(__CLASS__,'load_pagination_styles'));
	    Themify_Enqueue_Assets::loadThemeWCStyleModule( 'pagination' );
	    return $args;
	}
	
	
	
	public static function before_loop(){
		add_action('tf_wc_loop_end',array(__CLASS__,'after_loop'));
		add_filter( 'woocommerce_product_get_image', array(__CLASS__,'loop_image'),100,6);
		if(wc_get_loop_prop( 'is_shortcode' )){
            add_action( 'woocommerce_before_shop_loop_item', 'woocommerce_template_loop_product_link_open' );
            add_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_product_link_close', 5 );
        }
	}
	
	public static function after_loop(){
	    remove_action('tf_wc_loop_end',array(__CLASS__,'after_loop'));
	    remove_filter( 'woocommerce_product_get_image', array(__CLASS__,'loop_image'),100,6);
	}

	public static function single_product_image_size($size){
        if('woocommerce_single' === $size){
            global $themify;
            if(!empty($themify->width || !empty($themify->height))){
                $size = array((int)$themify->width,(int)$themify->height);
            }
        }
        return $size;
    }

    public static function single_product_image_attrs( $attrs ) {
        if(!themify_is_image_script_disabled()){
            global $themify;
            if(!empty($themify->width || !empty($themify->height))){
                $attr = array('urlonly'=>true,'w'=>$themify->width,'h'=>$themify->height);
                $attrs['data-src'] = themify_get_image($attr);
            }
        }
        return $attrs;
    }

}

//get Cart Style
function themify_get_cart_style() {
    static $is = null;
    if ($is===null) {
		$is = themify_is_woocommerce_active()?themify_get_both('cart_style','setting-cart_style','dropdown'):false;
    }
    return $is;
}

add_action('woocommerce_init', array('Themify_WC','before_init') );
