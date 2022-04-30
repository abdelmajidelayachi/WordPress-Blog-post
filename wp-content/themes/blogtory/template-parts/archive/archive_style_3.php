<div class="article-block-wrapper clearfix">
    <?php
    if (has_post_thumbnail()) {
        blogtory_post_image('blogtory-carousel-boxed');
    }
    ?>
    <div class="article-details">
        <?php
        if ( 'post' === get_post_type() ) {
            blogtory_post_cat_info();
        }
        ?>
        <header class="entry-header">
            <?php the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );?>
        </header><!-- .entry-header -->
        <?php blogtory_post_meta_info();?>
        <?php blogtory_post_excerpt_info_svg();?>
    </div>
</div>
