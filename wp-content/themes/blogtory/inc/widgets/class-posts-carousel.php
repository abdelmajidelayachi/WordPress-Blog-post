<?php

if (!defined('ABSPATH')) {
    exit;
}

class Blogtory_Posts_Carousel extends Blogtory_Widget_Base{

    /**
     * Constructor.
     */
    public function __construct(){

        $this->widget_cssclass = 'blogtory widget_posts_carousel';
        $this->widget_description = __("Displays posts in carousel", 'blogtory');
        $this->widget_id = 'blogtory_posts_carousel';
        $this->widget_name = __('BT: Posts Carousel', 'blogtory');

        $this->settings = array(
            'title' => array(
                'type' => 'text',
                'label' => __('Title', 'blogtory'),
            ),
            'category' => array(
                'type' => 'dropdown-taxonomies',
                'label' => __('Select Category', 'blogtory'),
                'desc' => __('Leave empty if you don\'t want the posts to be category specific', 'blogtory'),
                'args' => array(
                    'taxonomy' => 'category',
                    'class' => 'widefat',
                    'hierarchical' => true,
                    'show_count' => 1,
                    'show_option_all' => __('&mdash; Select &mdash;', 'blogtory'),
                ),
            ),
            'number' => array(
                'type' => 'number',
                'step' => 1,
                'min' => 1,
                'max' => '',
                'std' => 5,
                'label' => __('Number of posts to show', 'blogtory'),
            ),
            'orderby' => array(
                'type' => 'select',
                'std' => 'date',
                'label' => __('Order by', 'blogtory'),
                'options' => array(
                    'date' => __('Date', 'blogtory'),
                    'ID' => __('ID', 'blogtory'),
                    'title' => __('Title', 'blogtory'),
                    'rand' => __('Random', 'blogtory'),
                ),
            ),
            'order' => array(
                'type' => 'select',
                'std' => 'desc',
                'label' => __('Order', 'blogtory'),
                'options' => array(
                    'asc' => __('ASC', 'blogtory'),
                    'desc' => __('DESC', 'blogtory'),
                ),
            ),
            'show_category' => array(
                'type' => 'checkbox',
                'label' => __('Show Category', 'blogtory'),
            ),
            'display_style' => array(
                'type' => 'select',
                'std' => 'style_1',
                'label' => __('Display Style', 'blogtory'),
                'options' => array(
                    'style_1' => __('Style 1', 'blogtory'),
                    'style_2' => __('Style 2', 'blogtory'),
                ),
            ),
            'margin' => array(
                'type' => 'number',
                'step' => 1,
                'min' => 0,
                'max' => 100,
                'std' => 10,
                'label' => __('Carousel margin', 'blogtory'),
            ),
            'column' => array(
                'type' => 'select',
                'std' => 4,
                'label' => __('Column', 'blogtory'),
                'options' => array(
                    3 => 3,
                    4 => 4,
                ),
            ),
        );

        parent::__construct();
    }

    /**
     * Query the posts and return them.
     * @param  array $args
     * @param  array $instance
     * @return WP_Query
     */
    public function get_posts($args, $instance)
    {
        $number = !empty($instance['number']) ? absint($instance['number']) : $this->settings['number']['std'];
        $orderby = !empty($instance['orderby']) ? sanitize_title($instance['orderby']) : $this->settings['orderby']['std'];
        $order = !empty($instance['order']) ? sanitize_title($instance['order']) : $this->settings['order']['std'];

        $query_args = array(
            'posts_per_page' => $number,
            'post_status' => 'publish',
            'no_found_rows' => 1,
            'orderby' => $orderby,
            'order' => $order,
            'ignore_sticky_posts' => 1
        );

        if (!empty($instance['category']) && -1 != $instance['category'] && 0 != $instance['category']) {
            $query_args['tax_query'][] = array(
                'taxonomy' => 'category',
                'field' => 'term_id',
                'terms' => $instance['category'],
            );
        }

        return new WP_Query(apply_filters('blogtory_posts_carousel_query_args', $query_args));
    }

    /**
     * Output widget.
     *
     * @see WP_Widget
     *
     * @param array $args
     * @param array $instance
     */
    public function widget($args, $instance){

        ob_start();

        if (($posts = $this->get_posts($args, $instance)) && $posts->have_posts()) {
            $this->widget_start($args, $instance);

            do_action( 'blogtory_before_posts_carousel');

            $display_style = $instance['display_style'];
            $image_size = 'blogtory-carousel-boxed';

            $margin = absint($instance['margin']);
            $column = absint($instance['column']);

            $show_category = $instance['show_category'];

            if(4 == $column){
                $data_items = 4;
                $data_desktop = 4;
                $data_tab = 3;
                $data_smalltab = 2;
            }else{
                $data_items = 3;
                $data_desktop = 3;
                $data_tab = 2;
                $data_smalltab = 2;
            }

            ?>

            <div class="blogtory_posts_carousel <?php echo esc_attr($display_style);?>">
                <div class="be-owl-general-carousel be-owl-carousel be-owl-banner-carousel owl-carousel owl-theme"
                     data-items="<?php echo esc_attr($data_items);?>" data-desktop="<?php echo esc_attr($data_desktop);?>"
                     data-tab="<?php echo esc_attr($data_tab);?>" data-smalltab="<?php echo esc_attr($data_smalltab);?>"
                     data-margin="<?php echo esc_attr($margin);?>"
                     data-auto="true">
                    <?php
                    while ($posts->have_posts()): $posts->the_post();
                        if (has_post_thumbnail()) {
                            ?>
                            <div class="item">
                                <?php
                                if('style_1' == $display_style){
                                    blogtory_post_image($image_size);
                                }else{
                                    blogtory_post_image($image_size, true);
                                }
                                ?>
                                <div class="article-block-wrapper">
                                    <div class="article-details">
                                        <?php
                                        if($show_category){
                                            blogtory_post_cat_info();
                                        }
                                        ?>
                                        <h3 class="entry-title">
                                            <a href="<?php the_permalink() ?>">
                                                <?php the_title(); ?>
                                            </a>
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <?php
                        }
                    endwhile;wp_reset_postdata();
                    ?>
                </div>
            </div>
            <?php

            do_action( 'blogtory_after_posts_carousel');

            $this->widget_end($args);
        }

        echo ob_get_clean();
    }

}