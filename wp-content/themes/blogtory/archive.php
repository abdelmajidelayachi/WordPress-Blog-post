<?php
/**
 * The template for displaying archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Blogtory
 */

get_header();

$class = $archive_style = '';

/*Take global archive style if empty*/
if(empty($archive_style)){
    $archive_style = blogtory_get_option('archive_style');
}

/*Set the query var to use proper template file */
set_query_var( 'archive_style', $archive_style );

$wrapper_start = '<div class="blogtory-posts-wrap">';
$wrapper_end = '</div><!--blogtory-posts-wrap-->';

$image_sizes = array('blogtory-vertical', 'blogtory-carousel-boxed');
?>
<div class="site-main-wrap">
    <div class="wrapper">
        <div class="column-row">
            
            <div id="primary" class="content-area clearfix <?php echo esc_attr($archive_style);?>" data-template="<?php echo esc_attr($archive_style);?>">
                <main id="main" class="site-main">

                    <?php if ( have_posts() ) : ?>

                        <header class="page-header">
                            <?php
                            the_archive_title( '<h1 class="page-title">', '</h1>' );
                            the_archive_description( '<div class="archive-description">', '</div>' );
                            ?>
                        </header><!-- .page-header -->

                        <?php

                        echo '<div class="blogtory-posts-lists clearfix">';

                        echo wp_kses_post($wrapper_start);
                        /* Start the Loop */
                        while ( have_posts() ) : the_post();
                            /*
                             * Include the Post-Type-specific template for the content.
                             * If you want to override this in a child theme, then include a file
                             * called content-___.php (where ___ is the Post Type name) and that will be used instead.
                             */
                            get_template_part( 'template-parts/content', get_post_type() );
                        endwhile;

                        echo wp_kses_post($wrapper_end);
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
get_footer();