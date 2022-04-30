<?php

if (!defined('ABSPATH')) {
    exit;
}

class Blogtory_Express_Double_Column_Posts extends Blogtory_Widget_Base{

    public $image_sizes;

    /**
     * Constructor.
     */
    public function __construct(){

        $this->widget_cssclass = 'blogtory widget_express_double_column_posts';
        $this->widget_description = __("Displays posts in express double column style", 'blogtory');
        $this->widget_id = 'blogtory_express_double_column_posts';
        $this->widget_name = __('BT: Express Double Col Posts', 'blogtory');

        $this->image_sizes = blogtory_get_all_image_sizes(true);
        array_shift($this->image_sizes);

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
                'std' => 6,
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
            'image_size' => array(
                'type' => 'select',
                'label' => __('Express Post Image Size', 'blogtory'),
                'options' => $this->image_sizes,
                'std' => 'blogtory-carousel-boxed',
            ),
            'excerpt_length' => array(
                'type' => 'number',
                'step' => 1,
                'min' => 1,
                'max' => '',
                'std' => 20,
                'label' => __('Express Post Excerpt Length', 'blogtory'),
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

        return new WP_Query(apply_filters('blogtory_express_double_col_posts_query_args', $query_args));
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

            do_action( 'blogtory_before_express_double_col_posts');
            ?>

            <div class="blogtory_express_double_col_posts big-row clearfix">
                <?php
                $display_style = ($instance['display_style']) ? esc_attr($instance['display_style']) : 'style_1';
                $image_size = ($instance['image_size']) ? esc_attr($instance['image_size']) : 'blogtory-carousel-boxed';
                
                if('style_1' == $display_style){
                    echo '<div class="big-express clearfix">';
                    while ($posts->have_posts()): $posts->the_post();
                    ?>
                    <div class="article-block-wrapper float-l col-2">
                        <div class="article-block-wrapper-inner clearfix">
                            <?php
                            if (has_post_thumbnail()) {
                                ?>
                                <div class="entry-image">
                                    <?php blogtory_post_cat_info();?>
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
                            ?>
                            <div class="article-details">
                                <?php blogtory_post_meta_info(true,true,false);?>
                                <h3 class="entry-title">
                                    <a href="<?php the_permalink() ?>">
                                        <?php the_title(); ?>
                                    </a>
                                </h3>
                            </div>
                        </div>
                    </div>
                    <?php 
                    endwhile;wp_reset_postdata();
                    echo '</div>';
                }else{
                    $total_posts = $posts->post_count;
                    $counter = 1;
                    while ($posts->have_posts()): $posts->the_post();
                        $wrapper_class_start = $wrapper_class_end = '';
                        if($counter <= 2){
                            $image_size = ($instance['image_size']) ? esc_attr($instance['image_size']) : 'blogtory-carousel-boxed';
                            if(1 == $counter){
                                $wrapper_class_start = '<div class="big-express clearfix">';
                            }else{
                                $wrapper_class_end = '</div><!--big-express-->';
                            }
                        }else{
                            $image_size = 'blogtory-small';
                            if(3 == $counter){
                                $wrapper_class_start = '<div class="small-express clearfix">';
                            }
                            if($counter == $total_posts){
                                $wrapper_class_end = '</div><!--small-express-->';
                            }
                        }
                        ?>
                        <?php echo wp_kses_post($wrapper_class_start);?>
                        <div class="article-block-wrapper float-l col-2">
                            <div class="article-block-wrapper-inner clearfix">
                                <?php
                                if (has_post_thumbnail()) {
                                    if($counter <= 2){
                                        ?>
                                        <div class="entry-image">
                                            <?php blogtory_post_cat_info();?>
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
                                    }else{
                                        blogtory_post_image($image_size);
                                    }
                                }
                                ?>
                                <div class="article-details">
                                    <?php 
                                    if($counter <= 2){
                                        blogtory_post_meta_info(true,true,false);
                                    }else{
                                        blogtory_post_date_info();
                                    }
                                    ?>
                                    <h3 class="entry-title">
                                        <a href="<?php the_permalink() ?>">
                                            <?php the_title(); ?>
                                        </a>
                                    </h3>
                                    <?php
                                    if($counter <= 2){
                                        if ($instance['excerpt_length'] > 0) {
                                            blogtory_post_excerpt_info($instance['excerpt_length'],true);
                                            ?>
                                            <?php
                                        }
                                    }
                                    ?>
                                </div>
                            </div>
                        </div>
                        <?php echo wp_kses_post($wrapper_class_end);?>
                        <?php $counter++; endwhile;wp_reset_postdata();?>
                <?php } ?>
            </div>
            <?php

            do_action( 'blogtory_after_express_double_col_posts');

            $this->widget_end($args);
        }

        echo ob_get_clean();
    }

}