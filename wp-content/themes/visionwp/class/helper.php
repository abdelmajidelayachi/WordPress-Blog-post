<?php
/**
 * Helper functions
 * @since 1.0.0
 * @package VisionWP WordPress Theme
 */

if( !class_exists( 'VisionWP_Helper' ) ) {
	class VisionWP_Helper {

		/**
	     * Calling main breadcrumb
	     * @since 1.0.0
	     * @package VisionWP WordPress Theme WordPress ThemeWordPress Theme
	     */
		public static function the_breadcrumb() {
			if( is_home() || is_front_page() || !visionwp_get( 'show_breadcrumb' ) ) {
				return;
			} 

			$args = apply_filters( 'visionwp-breadcrumb-args', array( 'container' => 'div' ) );
			echo '<div class="visionwp-breadcrumb-wrapper">';
				visionwp_breadcrumb_trail( $args );
			echo '</div>';
		}

		/**
		 * Prints HTML with meta information for the current post-date/time
		 * @since 1.0.0
		 * @package VisionWP WordPress Theme
		 */
		public static function the_date( $post_id = null ) {

			$time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time>';

			$time_tag = sprintf(
				$time_string,
				esc_attr( get_the_date( DATE_W3C, $post_id ) ),
				esc_html( get_the_date( get_option( 'date_format' ), $post_id ) ),
				esc_attr( get_the_modified_date( DATE_W3C, $post_id ) ),
				esc_html( get_the_modified_date( DATE_W3C, $post_id ) )
			);

			printf(
				'<span class="posted-on">
					<a href="%1$s" rel="bookmark">
						%2$s
					</a>
				</span>',
				esc_url( get_day_link( get_the_time( 'Y' ), get_the_time( 'm' ), get_the_time ( 'd' ) ) ),
				$time_tag
			);
		}

		/**
		 * Prints the category of the posts
		 * @since 1.0.0
		 * @package VisionWP WordPress Theme
		 */
		public static function the_category( $post_id = false ) {
			$cat = get_the_category( $post_id );
			if( !empty( $cat ) ) { ?>
				<ul class="post-categories">
					<?php foreach ( $cat as $c ) { ?>
						<li>
							<a href="<?php echo esc_url( get_category_link( $c ) ); ?>">
								<?php echo esc_html( $c->name ); ?>
							</a>
						</li>
					<?php } ?> 
				</ul>
			<?php }
		}

		/**
		 * Meta information about theme author
		 * @since 1.0.0
		 * @package VisionWP WordPress Theme
		 */
		public static function posted_by( $post_id = false ) {

			if( $post_id ) {
				$author_id = get_post_field( 'post_author', $post_id );
				$author_name = get_the_author_meta( 'display_name', $author_id );
			}

			printf(
				/* translators:1-author link, 2-author image link, 
				 * 3- author text, 4- author name.
				 */
				'<div class="visionwp-author-wrapper">
					<span class="visionwp-author-text">
						%2$s
					</span>
					<a class="visionwp-author-link" href="%1$s">
						<span class="author">
							%3$s
						</span>
					</a>
				</div>',
				esc_url( get_author_posts_url( $post_id ? get_the_author_meta( 'ID', $author_id ) : get_the_author_meta( 'ID' ) ) ),
				esc_html__( 'By ', 'visionwp' ),
				esc_html( $post_id ? $author_name : get_the_author_meta( 'name' ) )
			);
		}

		/**
		 * Returns number of comment 
		 * @since 1.0.0
		 * @package VisionWP WordPress Theme
		 */
		public static function comment_number() {
			if ( ! post_password_required() && ( comments_open() || get_comments_number() ) ) {
				echo '<span class="visionwp-comments">';
				comments_popup_link(
					'<i class="fa fa-comment"></i> '.esc_html__( 'Leave a comment', 'visionwp' ),		
					'<i class="fa fa-comment"></i> '.esc_html__( '1 response', 'visionwp' ),
					'<i class="fa fa-comments"></i> % '. esc_html__( 'responses' , 'visionwp' ),
				);
				echo '</span>';
			}
		}

		/**
		 * Returns content meta
		 * @since 1.0.0
		 * @package VisionWP WordPress Theme
		 */
		public static function content_meta( $post_id = false, $author = false ) { ?>
			<div class="visionwp-post-meta">
				<?php 
					self::the_date( $post_id );
					if( $author ) {
						self::posted_by( $post_id );
					}
					self::the_category( $post_id );
					if( !$post_id ) {
						self::comment_number();
					}
				?>
			</div>
		<?php }

		/**
		 * Google font used in theme
		 * @since 1.0.0
		 * @package VisionWP WordPress Theme
		 */
		public static function theme_google_font() {
			return array(
                'google' => array( 'Lato', 'Oswald', 'Roboto', 'Raleway', 'Playfair Display', 'Fjalla One', 'Alegreya Sans', 'PT Sans Narrow', 'Open Sans', 'Poppins', 'Montserrat Alternates', 'Ubuntu' )
            );
		}

		/**
		 * Default pagination 	 
		 * @since 1.0.0
		 * @package VisionWP WordPress Theme
		 */
		public static function get_wp_pagination() {
			the_posts_pagination( 
				array(
					'previous'  => esc_html__( '<i class="fa fa-arrow-left"></i>', 'visionwp' ),
					'next'  => esc_html__(  '<i class="fa fa-arrow-right"></i>', 'visionwp' ),
				),
			); 
		}

		/**
		 * Pagination function
		 * @since 1.0.0
		 * @package VisionWP WordPress Theme
		 */
		public static function get_pagination() {
			global $wp_query;
			if( is_home() ) {
				$pagination_format = visionwp_get( 'pagination_format', 'default' );
				if( 'default' == $pagination_format ) {
					self::get_wp_pagination();
				}
				elseif( 'load-more' == $pagination_format ) {
					$total_posts = $wp_query -> found_posts;
					$displayed_posts = $wp_query -> post_count;    
					if( $displayed_posts < $total_posts ) {
						echo '<a href ="#" class = "visionwp-load-more" data-maxpage="'. $wp_query->max_num_pages .'">' . visionwp_get( 'load_more_text', esc_html__( 'Load More', 'visionwp' ) ) . '</a>' ; 
					}
				}         
			} else {
				self::get_wp_pagination();
			}
		}

		/**
		 * Displays the theme tags
		 *
		 * @static
		 * @access public
		 * @since 1.0.0
		 *
		 * @package VisionWP WordPress Theme
		 */		
		
		public static function display_tag_list() {			
			$tags_list = get_the_tag_list();
			if ( $tags_list ) { ?>
				<h2><?php esc_html_e( 'Tags:', 'visionwp' ) ?></h2>
				<div class="visionwp-tags-wrapper">
					<?php echo $tags_list; ?>
				</div>
			<?php }
		}

		/**
		 * Displays banner headings
		 *
		 * @static
		 * @access public
		 * @since 1.0.0
		 *
		 * @package VisionWP WordPress Theme
		 */	
		public static function visionwp_banner_heading() {
			if( is_page() || is_singular() ) {
				the_title( '<h1 class="entry-title">', '</h1>' );
			} elseif(  is_archive() ) {
				the_archive_title( '<h2 class="entry-title">', '</h2>' );
				the_archive_description( '<div class="taxonomy-description">', '</div>' );
			} elseif( is_home() && ! is_front_page() ) { // static blog page
				$blog_title = get_the_title( get_option( 'page_for_posts' ) ); ?>
				<h2 class="entry-title"><?php echo esc_html( $blog_title ) ?></h2>
			<?php } elseif( is_home() ) {
				# when home page is latest posts the custom title.
				$blog_title = apply_filters( 'blog_title', visionwp_get( 'blog_page_title' ) ); ?>

				<h2 class="entry-title home-title"><?php echo esc_html( $blog_title ) ?></h2>

			<?php } elseif( is_search() ) {
				get_search_form();
				/* translators: %s: search page result */ 
				?>
				<h2 class="entry-title">
					<?php 
						printf( 
							esc_html__( 'Search Results for: %s', 'visionwp' ), 
							get_search_query(),
						);
					?>
				</h2>
			<?php }
		}

		public static function visionwp_banner_text() {
			$meta_banner_text = visionwp_get_meta( 'banner-text-visibility' );
			if( '' == $meta_banner_text || 'global' == $meta_banner_text ) {
				$disable = !visionwp_get( 'banner_text_visibility' );
			} elseif( 'enable' == $meta_banner_text ) {
				$disable = false;
			} elseif(  'disable' == $meta_banner_text  ) {
				$disable = true;				
			}
			if( !$disable && ( is_page() || is_singular() ) ) { ?> 
				<div class="entry-description">
					<?php the_excerpt(); ?>
				</div>
			<?php }
		}
	}
}