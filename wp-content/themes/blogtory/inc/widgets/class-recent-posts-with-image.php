<?php

if (!defined('ABSPATH')) {
    exit;
}

class Blogtory_Recent_Posts_With_Image extends Blogtory_Widget_Base{

    /**
     * Constructor.
     */
    public function __construct(){

        $this->widget_cssclass = 'blogtory widget_recent_posts_with_image';
        $this->widget_description = __("Displays recent posts with an image", 'blogtory');
        $this->widget_id = 'blogtory_recent_posts_with_image';
        $this->widget_name = __('BT: Recent Posts With Image', 'blogtory');
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
                'std' => 3,
                'label' => __('Number of posts to show', 'blogtory'),
            ),
            'show_date' => array(
                'type' => 'checkbox',
                'label' => __('Show Date', 'blogtory'),
                'std' => true,
            ),
            'date_format' => array(
                'type' => 'select',
                'label' => __('Date Format', 'blogtory'),
                'options' => array(
                    'format_1' => __('Format 1', 'blogtory'),
                    'format_2' => __('Format 2', 'blogtory'),
                ),
                'std' => 'format_1',
            ),
            'style' => array(
                'type' => 'select',
                'label' => __('Style', 'blogtory'),
                'options' => array(
                    'style_1' => __('Style 1', 'blogtory'),
                    'style_2' => __('Style 2', 'blogtory'),
                ),
                'std' => 'style_1',
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

        $query_args = array(
            'posts_per_page' => $number,
            'post_status' => 'publish',
            'no_found_rows' => 1,
            'ignore_sticky_posts' => 1
        );

        if (!empty($instance['category']) && -1 != $instance['category'] && 0 != $instance['category']) {
            $query_args['tax_query'][] = array(
                'taxonomy' => 'category',
                'field' => 'term_id',
                'terms' => $instance['category'],
            );
        }

        return new WP_Query(apply_filters('blogtory_recent_posts_with_image_query_args', $query_args));
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

            do_action( 'blogtory_before_recent_posts_with_image');

            $style = $instance['style'];
            ?>

            <div class="blogtory_recent_posts <?php echo esc_attr($style);?>">
                <?php
                while ($posts->have_posts()): $posts->the_post();
                        ?>
                        <div class="article-block-wrapper clearfix">
                            <?php
                            if (has_post_thumbnail()) {
                                blogtory_post_image('thumbnail');
                            }
                            ?>
                            <div class="article-details">
                                <h3 class="entry-title">
                                    <a href="<?php the_permalink() ?>">
                                        <?php the_title(); ?>
                                    </a>
                                </h3>
                                <div class="be-meta-info">
                                    <?php
                                    if($instance['show_date']){
                                        ?>
                                        <div class="post-date">
                                            <?php
                                            $date_format = $instance['date_format'];
                                            if('format_1' == $date_format){
                                                echo esc_html(human_time_diff(get_the_time('U'), current_time('timestamp')) .' '.__( 'ago', 'blogtory' ));
                                            }else{
                                                echo esc_html(get_the_date());
                                            }
                                            ?>
                                        </div>
                                        <?php
                                    }
                                    ?>
                                </div>
                            </div>
                        </div>
                <?php endwhile;wp_reset_postdata();?>
            </div>
            <?php

            do_action( 'blogtory_after_recent_posts_with_image');

            $this->widget_end($args);
        }

        echo ob_get_clean();
    }

}