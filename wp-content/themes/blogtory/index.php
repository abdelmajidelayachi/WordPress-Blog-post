<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Blogtory
 */

get_header();

/*Set the query var to use proper template file */
$archive_style = blogtory_get_option('archive_style');
set_query_var( 'archive_style', $archive_style );

if(!is_paged() && is_front_page()){
    /**
     * Functions hooked into blogtory_home_before_widget_area action
     *
     * @hooked blogtory_home_banner - 10
     * @hooked blogtory_above_homepage_widget_region - 20
     *
     */
    do_action('blogtory_home_before_widget_area');
}
?>
<div class="site-main-wrap">
    <div class="wrapper">
        <div class="column-row">
            <div id="primary" class="content-area clearfix" data-template="<?php echo esc_attr($archive_style);?>">
                <main id="main" class="site-main">
                    <?php
                    if(!is_paged() && is_front_page()){
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
                    }
                    ?>
                    <?php
                    if ( have_posts() ) :

                        if ( is_home() && ! is_front_page() ) :
                            ?>
                            <header>
                                <h1 class="page-title screen-reader-text"><?php single_post_title(); ?></h1>
                            </header>
                        <?php
                        endif;

                        echo '<div class="blogtory-posts-lists clearfix '.esc_attr($archive_style). '">';

                        /* Start the Loop */
                        while ( have_posts() ) : the_post();

                            /*
                             * Include the Post-Type-specific template for the content.
                             * If you want to override this in a child theme, then include a file
                             * called content-___.php (where ___ is the Post Type name) and that will be used instead.
                             */
                            get_template_part( 'template-parts/content', get_post_type() );

                        endwhile;

                        echo '</div><!--blogtory-posts-lists-->';

                        blogtory_posts_navigation();

                    else :

                        get_template_part( 'template-parts/content', 'none' );

                    endif;
                    ?>

                </main><!-- #main -->
            </div><!-- #primary -->
            <?php get_sidebar();?>
        </div>
    </div>

</div>
<?php
if(!is_paged() && is_front_page()){
    /**
     * Functions hooked into blogtory_home_after_widget_area action
     *
     * @hooked blogtory_below_homepage_widget_region - 10
     *
     */
    do_action('blogtory_home_after_widget_area');
}

get_footer();