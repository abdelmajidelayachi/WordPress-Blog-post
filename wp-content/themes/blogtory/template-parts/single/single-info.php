<?php
$posts_navigation_style = blogtory_get_option('posts_navigation_style');
if('style_2' == $posts_navigation_style){

    echo '<div class="style-2-post-nav">';

    $prev_thumb = $next_thumb = $prev_arrow = $next_arrow = '';

    $previous = ( is_attachment() ) ? get_post( get_post()->post_parent ) : get_adjacent_post( false, '', true );
    $next     = get_adjacent_post( false, '', false );

    if ( is_attachment() && 'attachment' == $previous->post_type ) {
        return;
    }

    if ( $previous &&  has_post_thumbnail( $previous->ID ) ) {
        $prev_arrow = '<span>'.blogtory_get_theme_svg('chevron-double-left').'</span>';
        $prev_thumb = '<div class="prev-post-thumb"> <div class="thump-wrap">'.get_the_post_thumbnail($previous->ID, 'thumbnail').$prev_arrow.'</div></div>';
    }

    if ( $next && has_post_thumbnail( $next->ID ) ) {
        $next_arrow = '<span>'.blogtory_get_theme_svg('chevron-double-right').'</span>';
        $next_thumb = '<div class="next-post-thumb"> <div class="thump-wrap">'.get_the_post_thumbnail($next->ID, 'thumbnail').$next_arrow.'</div></div>';
    }

    the_post_navigation(array(
        'next_text' => $next_thumb.'<div class="next-post-info">'.
            '<span class="meta-nav" aria-hidden="true">' . __( 'Next Article', 'blogtory' ) . '</span> ' .
            '<span class="screen-reader-text">' . __( 'Next post:', 'blogtory' ) . '</span> ' .
            '<span class="post-title">%title</span>'.
            '</div>',
        'prev_text' => $prev_thumb.'<div class="prev-post-info">'.
            '<span class="meta-nav" aria-hidden="true">' . __( 'Previous Article', 'blogtory' ) . '</span> ' .
            '<span class="screen-reader-text">' . __( 'Previous post:', 'blogtory' ) . '</span> ' .
            '<span class="post-title">%title</span>'.
            '</div>',
    ));

    echo '</div>';

}else{

    echo '<div class="style-1-post-nav">';
    the_post_navigation(
        array(
            'next_text' => '%title<span>'.blogtory_get_theme_svg('chevron-double-right').'</span>',
            'prev_text' => '<span>'.blogtory_get_theme_svg('chevron-double-left').'</span>%title',
        )
    );
    echo '</div>';

}

if ( 'post' === get_post_type() ) :

    /*Show related posts*/
    $show_related_posts = blogtory_get_option('show_related_posts');
    if($show_related_posts){
        blogtory_related_posts();
    }
    $show_author_posts = blogtory_get_option('show_author_posts');
    if($show_author_posts){
        blogtory_author_posts();
    }
    /**/

endif;

// If comments are open or we have at least one comment, load up the comment template.
if ( comments_open() || get_comments_number() ) :
    comments_template();
endif;