<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Blogtory
 */

?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <?php
    if(is_singular()){
        if(is_front_page()){
            get_template_part('template-parts/archive/'.esc_attr($archive_style));
        }else{
            get_template_part('template-parts/single/'.esc_attr($single_post_style));
        }
    }else{
        get_template_part('template-parts/archive/'.esc_attr($archive_style));
    }
    ?>
</article><!-- #post-<?php the_ID(); ?> -->