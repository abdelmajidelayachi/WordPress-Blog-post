<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Blogtory
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">

	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<?php wp_body_open(); ?>

<?php
/**
 * Functions hooked into blogtory_before_site
 *
 * @hooked blogtory_preloader - 10
 */
do_action( 'blogtory_before_site' );
?>

<div id="page" class="site">

    <?php do_action( 'blogtory_before_header' ); ?>

    <?php
    $header_style = blogtory_get_option('header_style');
    ?>

	<header id="masthead" class="site-header <?php echo esc_attr($header_style);?>">

        <a class="skip-link screen-reader-text" href="#content"><?php esc_html_e( 'Skip to content', 'blogtory' ); ?></a>
        <?php
        /**
         * Functions hooked into blogtory_header action
         *
         * @hooked blogtory_header_content - 10
         */
        do_action( 'blogtory_header', $header_style);
        ?>

	</header><!-- #masthead -->

    <?php
    /**
     * Functions hooked in to blogtory_before_content
     *
     * @hooked blogtory_header_widget_region - 10
     * @hooked blogtory_breadcrumb - 20
     */
    do_action( 'blogtory_before_content' );
    ?>

	<div id="content" class="site-content">
    <?php
    do_action( 'blogtory_content_top' );