<?php
/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package Blogtory
 */

get_header();

global $post;
$single_post_style = get_post_meta($post->ID, 'blogtory_single_post_style', true );
if(empty($single_post_style)){
    $single_post_style = blogtory_get_option('single_post_style');
}
set_query_var( 'single_post_style', $single_post_style );
?>
    <?php
    if('single_style_1' == $single_post_style){
        ?>
        <div class="site-main-wrap">
            <div class="wrapper">
                <div class="column-row">
                    <div id="primary" class="content-area <?php echo esc_attr($single_post_style);?>">
                        <main id="main" class="site-main">
                            <?php
                            while ( have_posts() ) : the_post();
                                get_template_part( 'template-parts/content', get_post_type() );
                                get_template_part('template-parts/single/single-info');
                            endwhile; // End of the loop.
                            ?>
                        </main><!-- #main -->
                    </div><!-- #primary -->
                    <?php get_sidebar();?>
                </div>
            </div>

        </div>
        <?php
    }else{
        while ( have_posts() ) : the_post();
            ?>
            <div class="be-single-details be-bg-image">
                <?php
                the_post_thumbnail( 'full', array(
                    'alt' => the_title_attribute( array(
                        'echo' => false,
                    ) ),
                ) );
                ?>
                <header class="entry-header">
                    <div class="wrapper">
                            <?php
                            if ( 'post' === get_post_type() ) :
                                blogtory_post_cat_info();
                            endif;
                            ?>
                            <?php
                            the_title( '<h1 class="entry-title">', '</h1>' );
                            if ( 'post' === get_post_type() ) :
                                ?>
                                <div class="entry-meta">
                                    <?php
                                    blogtory_posted_by();
                                    blogtory_posted_on();
                                    ?>
                                </div><!-- .entry-meta -->
                            <?php endif; ?>
                    </div>
                </header><!-- .entry-header -->
            </div>
        <?php endwhile;?>
        <div class="site-main-wrap">
            <div class="wrapper">
                <div class="column-row">
                    <div id="primary" class="content-area <?php echo esc_attr($single_post_style);?>">
                        <main id="main" class="site-main">
                            <?php
                            while ( have_posts() ) : the_post();
                                get_template_part( 'template-parts/content', get_post_type() );
                                get_template_part('template-parts/single/single-info');
                            endwhile; // End of the loop.
                            ?>
                        </main><!-- #main -->
                    </div><!-- #primary -->
                    <?php get_sidebar();?>
                </div>
            </div>
        </div>
        <?php
    }
    ?>
<?php
get_footer();