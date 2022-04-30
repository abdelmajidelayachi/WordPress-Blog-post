<?php
/**
 * Template part for displaying results in search pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Blogtory
 */

?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <div class="article-block-wrapper clearfix">
        <?php
        if (has_post_thumbnail()) {
            blogtory_post_image('blogtory-carousel-boxed', true);
        }
        ?>
        <div class="article-details">
            <?php if ( 'post' === get_post_type() ) : ?>
                <div class="entry-meta">
                    <?php
                    blogtory_posted_by();
                    blogtory_posted_on();
                    ?>
                </div><!-- .entry-meta -->
            <?php endif; ?>
            <header class="entry-header">
                <?php the_title( sprintf( '<h2 class="entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h2>' ); ?>
            </header><!-- .entry-header -->
            <div class="entry-summary">
                <?php
                $excerpt_length = blogtory_get_option('archive_excerpt_length');

                $content = wp_trim_words( get_the_excerpt(), $excerpt_length, '...' );
                echo apply_filters( 'the_excerpt', $content );
                ?>
            </div><!-- .entry-summary -->
        </div>
    </div>
</article><!-- #post-<?php the_ID(); ?> -->