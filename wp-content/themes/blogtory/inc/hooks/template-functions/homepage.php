<?php

if ( ! function_exists( 'blogtory_home_trending_items' ) ) {
    /**
     * Display homepage trending items
     *
     * @since  1.0.0
     */
    function blogtory_home_trending_items() {

        $enable_trending_posts = blogtory_get_option('enable_trending_posts');
        if ($enable_trending_posts) {

            $trending_cat = blogtory_get_option('trending_post_cat');
            $orderby = esc_attr(blogtory_get_option('trending_orderby'));
            $order = esc_attr(blogtory_get_option('trending_order'));
            $no_of_trending_posts = absint(blogtory_get_option('no_of_trending_posts'));

            $post_args = array(
                'post_type' => 'post',
                'posts_per_page' => $no_of_trending_posts,
                'post_status' => 'publish',
                'no_found_rows' => 1,
                'orderby' => $orderby,
                'order' => $order,
                'ignore_sticky_posts' => 1
            );
            if (!empty($trending_cat)) {
                $post_args['tax_query'][] = array(
                    'taxonomy' => 'category',
                    'field' => 'term_id',
                    'terms' => absint($trending_cat),
                );
            }
            $trending_posts = new WP_Query($post_args);
            if ($trending_posts->have_posts()):
                ?>
                <div class="unfold-trending-marquee">
                    <div class="wrapper">
                        <?php
                        $trending_post_text = blogtory_get_option('trending_post_text');
                        if($trending_post_text){
                            ?>
                            <div class="trending-now-title">
                                <?php echo esc_html($trending_post_text);?>
                            </div>
                            <?php
                        }
                        ?>
                        <div class="marquee-wrapper">
                            <div class="trending-now-posts marquee">
                                <?php while ($trending_posts->have_posts()):$trending_posts->the_post();?>
                                    <a href="<?php the_permalink()?>">
                                        <span class="trend-date"><?php echo human_time_diff(get_the_time('U'), current_time('timestamp')) .' '.__( 'ago', 'blogtory' ); ?></span>
                                        <span class="trent-title"><?php the_title();?></span>
                                    </a>
                                <?php endwhile;wp_reset_postdata();?>
                            </div>
                        </div>
                    </div>
                </div>
                <?php
            endif;
        }
    }
}

if (!function_exists('blogtory_home_banner')) {
    /**
     * Display homepage banner
     *
     * @since  1.0.0
     */
    function blogtory_home_banner()
    {

        $enable_home_banner = blogtory_get_option('enable_home_banner');
        if ($enable_home_banner) {

            $banner_overlay = $banner_overlay_class = $data_animatein = $data_animateout = '';

            $post_args = array(
                'post_type' => 'post',
                'post_status' => 'publish',
                'no_found_rows' => 1,
                'ignore_sticky_posts' => 1,
            );

            $banner_content_from = blogtory_get_option('banner_content_from');
            if ('category' == $banner_content_from) {

                $banner_post_cat = blogtory_get_option('banner_post_cat');
                $no_of_banner_posts = absint(blogtory_get_option('no_of_banner_posts'));
                $banner_posts_orderby = esc_attr(blogtory_get_option('banner_posts_orderby'));
                $banner_posts_order = esc_attr(blogtory_get_option('banner_posts_order'));

                $post_args['posts_per_page'] = $no_of_banner_posts;
                $post_args['orderby'] = $banner_posts_orderby;
                $post_args['order'] = $banner_posts_order;

                if (!empty($banner_post_cat)) {
                    $post_args['tax_query'][] = array(
                        'taxonomy' => 'category',
                        'field' => 'term_id',
                        'terms' => absint($banner_post_cat),
                    );
                }

            } else {
                $banner_post_ids = blogtory_get_option('banner_post_ids');
                if (!empty($banner_post_ids)) {
                    $post_ids = explode(',', esc_attr($banner_post_ids));
                    $post_args['post__in'] = $post_ids;
                    $post_args['orderby'] = 'post__in';
                    $post_args['posts_per_page'] = count($post_ids);
                }
            }

            $banner_posts = new WP_Query($post_args);
            if ($banner_posts->have_posts()):

                $banner_class = 'be-owl-banner-carousel';
                $items = 2;
                $margin = 0;
                $container_class = '';
                $data_center = false;

                $banner_layout = blogtory_get_option('banner_layout');
                $banner_display_as = blogtory_get_option('banner_display_as');

                if('boxed' == $banner_layout){
                    $container_class = 'wrapper';
                }

                if ('slider' == $banner_display_as) {

                    $slider_style = blogtory_get_option('banner_slider_style');

                    $banner_class = 'be-owl-carousel-slider';
                    $items = 1;

                    $image_size = 'blogtory-slide-boxed';
                    if('full-width' == $banner_layout){
                        $image_size = 'blogtory-slide-full';
                    }

                    $banner_style = 'be-banner-slider-'.$slider_style;

                    if('style_3' == $slider_style){
                        $data_animatein = 'flipInX';
                        $data_animateout = 'slideOutDown';

                        $banner_overlay = '<div class="bt-banner-overlay"></div>';
                        $banner_overlay_class = 'bt-overlay-enabled';
                    }
                }else{

                    $carousel_style = blogtory_get_option('banner_carousel_style');
                    $margin = blogtory_get_option('banner_carousel_margin');

                    $image_size = 'blogtory-carousel-boxed';
                    if('full-width' == $banner_layout){
                        $image_size = 'blogtory-carousel-full';
                    }

                    if('style_3' == $carousel_style){
                        $items = 3;
                    }

                    if('style_4' == $carousel_style){
                        $items = 2;
                        $data_center = true;
                    }

                    $banner_style = 'be-banner-carousel-'.$carousel_style;
                }

                $disable_banner_autoplay = blogtory_get_option('disable_banner_autoplay');
                $disable_banner_loop = blogtory_get_option('disable_banner_loop');
                $show_banner_dots = blogtory_get_option('show_banner_dots');
                $hide_banner_nav = blogtory_get_option('hide_banner_nav');
                $data_speed = blogtory_get_option('banner_speed');

                $show_banner_category = blogtory_get_option('show_banner_category');
                $show_banner_meta = blogtory_get_option('show_banner_meta');
                ?>
                <div class="be-banner-wrapper <?php echo esc_attr($container_class).' '.esc_attr($banner_style).' '.esc_attr($banner_overlay_class); ?>">
                    <div class="be-owl-carousel <?php echo esc_attr($banner_class); ?> be-banner owl-carousel owl-theme"
                         data-items="<?php echo esc_attr($items);?>" data-desktop="<?php echo esc_attr($items);?>"
                         data-tab="<?php echo esc_attr($items);?>" data-margin="<?php echo esc_attr($margin);?>"
                         data-dots="<?php echo esc_attr($show_banner_dots);?>" data-nav="<?php echo esc_attr($hide_banner_nav);?>"
                         data-auto="<?php echo esc_attr($disable_banner_autoplay);?>" data-loop="<?php echo esc_attr($disable_banner_loop);?>"
                         data-center="<?php echo esc_attr($data_center);?>" 
                         data-speed="<?php echo esc_attr($data_speed);?>" 
                         data-animatein="<?php echo esc_attr($data_animatein);?>" 
                         data-animateout="<?php echo esc_attr($data_animateout);?>" >
                        <?php while ($banner_posts->have_posts()):$banner_posts->the_post();?>
                            <div class="item">
                                <div class="banner-wrapper be-bg-image">
                                    <?php
                                    if (has_post_thumbnail()) {
                                        the_post_thumbnail($image_size, array(
                                            'alt' => the_title_attribute(array(
                                                'echo' => false,
                                            )),
                                        ));
                                    }
                                    ?>
                                    <div class="banner-caption">
                                        <div class="banner-caption-inner">
                                            <?php 
                                            if(!$banner_overlay_class){
                                                ?>
                                                <div class="banner-caption-inner-overlay"></div>
                                                <?php
                                            }
                                            ?>
                                            <?php
                                            if ($show_banner_meta) {
                                                ?>
                                                <div class="be-date-info">
                                                    <div class="post-date">
                                                        <?php echo esc_html(get_the_date()); ?>
                                                    </div>
                                                </div>
                                                <?php
                                            }
                                            ?>
                                            <?php
                                            if ($show_banner_category) {
                                                blogtory_post_cat_info();
                                            }
                                            ?>
                                            <h3>
                                                <a href="<?php the_permalink() ?>">
                                                    <?php the_title(); ?>
                                                </a>
                                            </h3>
                                            
                                        </div>
                                    </div>
                                    <?php echo $banner_overlay;?>
                                </div>
                            </div>
                        <?php endwhile;
                        wp_reset_postdata(); ?>
                    </div>
                </div>
            <?php endif;
        }
    }
}

if (!function_exists('blogtory_above_homepage_widget_region')) {
    /**
     * Display widgets before the homepage contents
     *
     * @since  1.0.0
     */
    function blogtory_above_homepage_widget_region()
    {
        if (is_active_sidebar('above-homepage-widget-area')) {
            $heading_style = blogtory_get_general_heading_style();
            $heading_align = blogtory_get_general_heading_align();
            ?>
            <div class="above-homepage-widget-area general-widget-area <?php echo esc_attr($heading_style).' '.esc_attr($heading_align);?>">
                <div class="wrapper">
                    <?php dynamic_sidebar('above-homepage-widget-area'); ?>
                </div>
            </div><!-- .above-homepage-widget-area -->
            <?php
        }
    }
}

if (!function_exists('blogtory_below_homepage_widget_region')) {
    /**
     * Display widgets after the homepage contents
     *
     * @since  1.0.0
     */
    function blogtory_below_homepage_widget_region()
    {
        if (is_active_sidebar('below-homepage-widget-area')) {
            $heading_style = blogtory_get_general_heading_style();
            $heading_align = blogtory_get_general_heading_align();
            ?>
            <div class="below-homepage-widget-area general-widget-area <?php echo esc_attr($heading_style).' '.esc_attr($heading_align);?>">
                <div class="wrapper">
                    <div class="column-row">
                        <div class="column column-12">
                            <?php dynamic_sidebar('below-homepage-widget-area'); ?>
                        </div>
                    </div>
                </div>
            </div><!-- .below-homepage-widget-area -->
            <?php
        }
    }
}