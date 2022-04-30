<?php
/**
 * The template for displaying the homepage.
 *
 * Template Name: Home Page
 *
 * @package Blogtory
 * @since 1.0.0
 */

get_header();


/*If latest post is enabled on homepage and is paged then bail out other sections on homepage*/
$enable_posts_in_front_page = blogtory_get_option('enable_posts_in_front_page');
if($enable_posts_in_front_page){
    if(is_paged()){
        ?>
        <div class="site-main-wrap">
            <div class="wrapper">
                <div class="column-row">
                    <div id="primary" class="content-area">
                        <main id="main" class="site-main" role="main">
                            <?php blogtory_front_page_posts();?>
                        </main><!-- #main -->
                    </div><!-- #primary -->
                    <?php get_sidebar();?>
                </div>
            </div>
        </div>
        <?php
        get_footer();
        return;
    }
}
/**/
?>

<?php
/**
 * Functions hooked into blogtory_home_before_widget_area action
 *
 * @hooked blogtory_home_trending_items - 5
 * @hooked blogtory_home_banner - 10
 * @hooked blogtory_above_homepage_widget_region - 20
 *
 */
do_action('blogtory_home_before_widget_area');
?>
    <div class="site-main-wrap">
        <div class="wrapper">
            <div class="column-row">
                <div id="primary" class="content-area">
                    <main id="main" class="site-main" role="main">
                        <?php
                        /*Home page widget area*/
                        if (is_active_sidebar('home-page-widget-area')) {
                            $heading_style = blogtory_get_general_heading_style();
                            $heading_align = blogtory_get_general_heading_align();
                            ?>
                            <div class="homepage-widgetarea general-widget-area <?php echo esc_attr($heading_style).' '.esc_attr($heading_align);?>">
                                <?php dynamic_sidebar('home-page-widget-area'); ?>
                            </div>
                            <?php
                        }
                        ?>
                        <?php
                        global $post;
                        $wrapper_start = '<section class="section-block be-page-content">';
                        $wrapper_end = '</section>';
                        if (is_front_page()):
                            if( $post->post_content == '') {
                                $wrapper_start = '<section class="section-block be-page-content empty-content">';
                            }
                        endif;
                        while ( have_posts() ) :  the_post(); ?>
                            <?php echo wp_kses_post($wrapper_start);?>
                            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                                <?php blogtory_post_thumbnail(); ?>
                                <div class="entry-content">
                                    <?php
                                    the_content();
                                    wp_link_pages( array(
                                        'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'blogtory' ),
                                        'after'  => '</div>',
                                    ) );
                                    ?>
                                </div><!-- .entry-content -->
                                <?php if ( get_edit_post_link() ) : ?>
                                    <footer class="entry-footer">
                                        <?php
                                        edit_post_link(
                                            sprintf(
                                                wp_kses(
                                                /* translators: %s: Name of current post. Only visible to screen readers */
                                                    __( 'Edit <span class="screen-reader-text">%s</span>', 'blogtory' ),
                                                    array(
                                                        'span' => array(
                                                            'class' => array(),
                                                        ),
                                                    )
                                                ),
                                                get_the_title()
                                            ),
                                            '<span class="edit-link">',
                                            '</span>'
                                        );
                                        ?>
                                    </footer><!-- .entry-footer -->
                                <?php endif; ?>
                            </article><!-- #post-<?php the_ID(); ?> -->
                            <?php echo wp_kses_post($wrapper_end);?>
                        <?php endwhile; wp_reset_postdata();/*End of the loop.*/ ?>

                        <?php
                        /*Latest Posts*/
                        $enable_posts_in_front_page = blogtory_get_option('enable_posts_in_front_page');
                        if($enable_posts_in_front_page){
                            blogtory_front_page_posts();
                        }
                        /**/
                        ?>
                    </main><!-- #main -->
                </div><!-- #primary -->
                <?php get_sidebar();?>
            </div>
        </div>
    </div><!-- .site-main-wrap -->
<?php
/**
 * Functions hooked into blogtory_home_after_widget_area action
 *
 * @hooked blogtory_below_homepage_widget_region - 10
 *
 */
do_action('blogtory_home_after_widget_area');

get_footer();