<div class="article-block-wrapper clearfix">
    <header class="entry-header">
        <?php 
        if ( 'post' === get_post_type() ) {
            blogtory_post_cat_info();
        }?>
        <?php the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );?>
        <?php
        blogtory_post_meta_info();
        ?>
    </header><!-- .entry-header -->
    <?php
    if (has_post_thumbnail()) {
        blogtory_post_image('blogtory-slide-boxed');
    }
    ?>
    <div class="article-details">
        <?php blogtory_post_excerpt_info();?>
    </div>
</div>