<header class="entry-header">
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
</header><!-- .entry-header -->

<div class="post-thumbnail">
    <?php
    the_post_thumbnail( 'full', array(
        'alt' => the_title_attribute( array(
            'echo' => false,
        ) ),
    ) );
    ?>
</div><!-- .post-thumbnail -->

<div class="entry-content">
    <?php
    the_content( sprintf(
        wp_kses(
        /* translators: %s: Name of current post. Only visible to screen readers */
            __( 'Continue reading<span class="screen-reader-text"> "%s"</span>', 'blogtory' ),
            array(
                'span' => array(
                    'class' => array(),
                ),
            )
        ),
        get_the_title()
    ) );

    wp_link_pages( array(
        'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'blogtory' ),
        'after'  => '</div>',
    ) );
    ?>
</div><!-- .entry-content -->

<footer class="entry-footer">
    <?php blogtory_entry_footer(false,true,false); ?>
</footer><!-- .entry-footer -->