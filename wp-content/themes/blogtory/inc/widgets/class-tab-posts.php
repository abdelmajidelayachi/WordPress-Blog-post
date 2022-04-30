<?php

if (!defined('ABSPATH')) {
    exit;
}

class Blogtory_Tab_Posts extends Blogtory_Widget_Base{

    /**
     * Constructor.
     */
    public function __construct(){

        $this->widget_cssclass = 'blogtory widget_tab_posts';
        $this->widget_description = __("Displays posts in tab", 'blogtory');
        $this->widget_id = 'blogtory_tab_posts';
        $this->widget_name = __('BT: Tab Posts', 'blogtory');
        $this->settings = array(
            'post_settings' => array(
                'type' => 'heading',
                'label' => __('Post Settings', 'blogtory'),
            ),
            'number' => array(
                'type' => 'number',
                'step' => 1,
                'min' => 1,
                'max' => '',
                'std' => 3,
                'label' => __('Number of posts to show', 'blogtory'),
            ),
            'image_size' => array(
                'type' => 'select',
                'label' => __('Image Size', 'blogtory'),
                'options' => blogtory_get_all_image_sizes(true),
                'std' => 'thumbnail',
            ),
            'show_date' => array(
                'type' => 'checkbox',
                'label' => __('Show Date', 'blogtory'),
                'std' => true,
            ),
            'comment_settings' => array(
                'type' => 'heading',
                'label' => __('Comment Settings', 'blogtory'),
            ),
            'show_comment_tab' => array(
                'type' => 'checkbox',
                'label' => __('Show Comment Tab', 'blogtory'),
                'std' => true,
            ),
            'comments_number' => array(
                'type' => 'number',
                'step' => 1,
                'min' => 1,
                'max' => '',
                'std' => 5,
                'label' => __('Number of comments to show', 'blogtory'),
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
    public function get_posts($args, $instance, $type)
    {
        $number = !empty($instance['number']) ? absint($instance['number']) : $this->settings['number']['std'];

        switch ($type) {
            case 'popular':
                $query_args = array(
                    'post_type' => 'post',
                    'posts_per_page' => $number,
                    'post_status' => 'publish',
                    'no_found_rows' => 1,
                    'ignore_sticky_posts' => 1,
                    'orderby' => 'comment_count',
                );
                return new WP_Query(apply_filters('blogtory_popular_posts_query_args', $query_args));
                break;
            case 'recent':
                $query_args = array(
                    'post_type' => 'post',
                    'posts_per_page' => $number,
                    'post_status' => 'publish',
                    'no_found_rows' => 1,
                    'ignore_sticky_posts' => 1,
                );
                return new WP_Query(apply_filters('blogtory_recent_posts_query_args', $query_args));
                break;
            default:
                break;
        }
    }

    /**
     * Outputs the tab posts
     *
     * @param array $instance
     */
    public  function render_post($instance){
        ?>
        <div class="article-block-wrapper clearfix">
            <?php
            if('no-image' !== $instance['image_size'] ){
                if (has_post_thumbnail()) {
                    ?>
                    <div class="entry-image">
                        <a href="<?php the_permalink() ?>">
                            <?php
                            the_post_thumbnail( esc_attr($instance['image_size']), array(
                                'alt' => the_title_attribute( array(
                                    'echo' => false,
                                ) ),
                            ) );
                            ?>
                        </a>
                    </div>
                    <?php
                }
            }
            ?>
            <div class="article-details">
                <?php 
                if(isset($instance['show_date']) && true == $instance['show_date']){
                    ?>
                    <div class="be-date-info">
                        <div class="post-date">
                            <?php echo esc_html(get_the_date()); ?>
                        </div>
                    </div>
                    <?php
                }
                ?>
                <h3 class="entry-title">
                    <a href="<?php the_permalink() ?>">
                        <?php the_title(); ?>
                    </a>
                </h3>
            </div>
        </div>
        <?php
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

        static $counter_instance = 0;
        $counter_instance++;

        ob_start();

        $before_widget = $args['before_widget'];
        $after_widget = $args['after_widget'];

        echo wp_kses_post( $before_widget );

        do_action( 'blogtory_before_tab_posts');
        ?>

        <div class="blogtory_tab_posts">
            <div class="unfold-tab-nav">
                <ul class="unfold-nav-tabs">
                    <li class="tab tab-popular active" data-tab="tab-popular-block">
                        <span class="tab-title-icon"><?php blogtory_the_theme_svg('hot');?></span>
                        <span class="tab-title-label"><?php esc_html_e('Hot', 'blogtory'); ?></span>
                    </li>
                    <li class="tab tab-recent" data-tab="tab-recent-block">
                        <span class="tab-title-icon"><?php blogtory_the_theme_svg('time');?></span>
                        <span class="tab-title-label"><?php esc_html_e('New', 'blogtory'); ?></span>
                    </li>
                    <?php
                    if($instance['show_comment_tab']){
                        ?>
                        <li class="tab tab-comment" data-tab="tab-comment-block">
                            <span class="tab-title-icon"><?php blogtory_the_theme_svg('comment');?></span>
                            <span class="tab-title-label"><?php esc_html_e('Comments', 'blogtory'); ?></span>
                        </li>
                        <?php
                    }
                    ?>
                </ul>
            </div>
            <div class="unfold-tab-content">
                <div class="unfold-tab-panel tab-popular-block active">
                    <?php
                    $popular_posts = $this->get_posts($args, $instance, 'popular');
                    if ($popular_posts->have_posts()) {
                        while ($popular_posts->have_posts()):$popular_posts->the_post();
                            $this->render_post($instance);
                        endwhile;
                        wp_reset_postdata();
                    }
                    ?>
                </div>
                <div class="unfold-tab-panel tab-recent-block">
                    <?php
                    $recent_posts = $this->get_posts($args, $instance, 'recent');
                    if ($recent_posts->have_posts()) {
                        while ($recent_posts->have_posts()):$recent_posts->the_post();
                            $this->render_post($instance);
                        endwhile;
                        wp_reset_postdata();
                    }
                    ?>
                </div>
                <?php
                if ($instance['show_comment_tab']) {
                    ?>
                    <div class="unfold-tab-panel tab-comment-block">
                        <?php
                        $comments = get_comments(apply_filters('widget_comments_args', array(
                            'number' => absint($instance['comments_number']),
                            'status' => 'approve',
                            'post_status' => 'publish'
                        ), $instance));
                        $output = '<ul id="em-recent-comments" class="em-recent-comments">';
                        if (is_array($comments) && $comments) {
                            // Prime cache for associated posts. (Prime post term cache if we need it for permalinks.)
                            $post_ids = array_unique(wp_list_pluck($comments, 'comment_post_ID'));
                            _prime_post_caches($post_ids, strpos(get_option('permalink_structure'), '%category%'), false);

                            foreach ((array)$comments as $comment) {

                                $avatar = get_avatar($comment, 60);
                                $comment_text = get_comment_excerpt($comment->comment_ID);
                                $comment_date = get_comment_date('M j, H:i', $comment->comment_ID);

                                $output .= '<li class="recentcomments">';
                                $output .= '<div class="comment-wrapper clearfix">';

                                $output .= '<div class="comment-author">' . wp_kses_post($avatar) . '</div>';
                                $output .= '<div class="comment-info">';
                                $output .= '<span class="comment-author-link">' . get_comment_author_link($comment) . '</span>';
                                $output .= '<span class="comment-on">' . __('comments on', 'blogtory') . '</span>';
                                $output .= '<a href="' . esc_url(get_comment_link($comment)) . '">' . get_the_title($comment->comment_post_ID) . '</a>';
                                $output .= '<span class="comment-excerpt">' . wp_kses_post($comment_text) . '</span>';
                                $output .= '<span class="comment-date">' . esc_html($comment_date) . '</span>';
                                $output .= '</div>';

                                $output .= '</div>';
                                $output .= '</li>';
                            }
                        }
                        $output .= '</ul>';
                        echo wp_kses_post($output);
                        ?>
                    </div>
                    <?php
                }
                ?>
            </div>
        </div>
        <?php

        do_action( 'blogtory_after_tab_posts');

        echo wp_kses_post( $after_widget );

        echo ob_get_clean();
    }

}