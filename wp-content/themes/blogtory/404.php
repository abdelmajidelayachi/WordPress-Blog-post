<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package Blogtory
 */
get_header();
?>
    <div class="site-main-wrap">
        <div class="wrapper">
            <div class="column-row">
                <div class="column column-12">
                    <main id="main" class="site-main">
                        <section class="error-404 not-found">
                            <header class="page-header">
                                <h1 class="page-title">
                                    <?php esc_html_e('404', 'blogtory'); ?>
                                </h1>
                            </header><!-- .page-header -->
                            <div class="page-content">
                                <p>
                                    <?php esc_html_e('Oops! That page can&rsquo;t be found.Maybe try search?', 'blogtory'); ?>
                                    <?php get_search_form(); ?>
                                <div class="go-back">
                                    <a href="<?php echo esc_url(home_url('/')) ?>" rel="home">
                                        <?php blogtory_the_theme_svg('home'); ?>
                                        <?php _e('Return to Homepage', 'blogtory'); ?>
                                    </a>
                                </div>
                            </div><!-- .page-content -->
                        </section><!-- .error-404 -->
                    </main><!-- #main -->
                </div>
            </div>
        </div>
    </div>
<?php
get_footer();