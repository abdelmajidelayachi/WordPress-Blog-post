<?php 
/* The header for the theme
* @since 1.0.0
* @package VisionWP WordPress Theme
*/
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="description" content="<?php bloginfo( 'description' ); ?>">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class() ?>>
    <?php wp_body_open(); ?>
    <a class="skip-link screen-reader-text" href="#site-content">
        <?php esc_html_e( 'Skip to content', 'visionwp' ); ?>
    </a>
    <?php do_action( 'visionwp-before-header' ); ?>
    <header id="masthead" class="visionwp-main-header">
        <?php do_action( 'visionwp-before-main-header' ); ?>
        <div class="visionwp-header-wrapper">
            <div class="visionwp-container">
                <div class="visionwp-header">
                    <?php visionwp_get_header_content(); ?>
                </div>
            </div>
        </div>
        <?php do_action( 'visionwp-after-main-header' ); ?>
    </header>
    <?php do_action( 'visionwp-after-header' ); ?>