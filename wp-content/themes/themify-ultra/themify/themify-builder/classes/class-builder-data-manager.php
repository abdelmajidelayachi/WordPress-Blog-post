<?php
/**
 * Builder Data Manager API
 *
 * ThemifyBuilder_Data_Manager class provide API
 * to get Builder Data, Save Builder Data to Database.
 * 
 *
 * @package    Themify_Builder
 * @subpackage Themify_Builder/classes
 */

defined( 'ABSPATH' ) || exit;

/**
 * The Builder Data Manager class.
 *
 * This class provide API to get and update builder data.
 *
 *
 * @package    Themify_Builder
 * @subpackage Themify_Builder/classes
 * @author     Themify
 */
class ThemifyBuilder_Data_Manager {

	/**
	 * Builder Meta Key
	 * 
	 * @access public
	 * @var string META_KEY
	 */
	 
	const OLD_META_KEY = '_themify_builder_settings';
	
	const META_KEY = '_themify_builder_settings_json';
                
	private static $static_content_process;



	/**
	 * Constructor
	 * 
	 * @access public
	 */
	public static function init() {
		add_action( 'import_post_meta', array( __CLASS__, 'import_post_meta' ), 10, 3 );
        
        /* disable this due to issue #7087 */
        /*$option = get_option( 'tb-data-updater-notice-dismissed' );
		if ( empty( $option ) ) {
			add_action( 'admin_notices', array( __CLASS__, 'static_content_notices' ) );
		}*/
		add_action( 'admin_init', array( __CLASS__, 'init_static_content_updater' ) );
		if ( is_multisite() ) {
			add_action( 'network_admin_menu', array( __CLASS__, 'network_builder_updater_menu' ) );
		}
		//add_action( 'init', array( __CLASS__, 'init_static_content_bg_process' ) ); /* disable this due to issue #7087 */
		add_action( 'wp_ajax_tb_dismiss_data_updater_notice', array(__CLASS__, 'dismiss_data_updater_notice'), 10);
	}


	/**
	 * Get Builder Data
	 * 
	 * @access public
	 * @param int $post_id 
	 * @return array
	 */
	public static function get_data( $post_id,$plain_return=false ) {
		$data = get_post_meta( $post_id, self::META_KEY, true );	
		if(!empty($data)){
			if($plain_return!==true){
                $is_old=strpos($data,'\\\\\\')!==false ||  (strpos($data,'row_order')!==false && strpos($data,'column_order')!==false);//backward compatibility,only old version data contains row_order
                $data =json_decode( $data, true );
                if($is_old===true){
                    $data = stripslashes_deep(stripslashes_deep($data));
                }
            }
		}
		else{
			$data = get_post_meta( $post_id, self::OLD_META_KEY, true);
            if(!empty($data) && true!==$plain_return){
				$data = stripslashes_deep(maybe_unserialize( $data ));
			}
		}
		return $data;
	}

	/**
	 * Save Builder Data.
	 * 
	 * @access public
	 * @param string|array $builder_data 
	 * @param int $post_id 
	 * @param string $action 
	 */
	public static function save_data( $builder_data, $post_id, $action = 'main', $source_editor = 'frontend' ) {
				$result = array();
				if ( 'backend' === $source_editor ) {
					$plain_text = self::_get_all_builder_text_content( $builder_data );
					if ( ! empty( $plain_text ) ){ 
						$result['static_content'] = self::add_static_content_wrapper( $plain_text );
					}
					unset($plain_text);
				}
				if(self::get_data($post_id)===$builder_data){
					$result['builder_data']=self::json_remove_unicode( $builder_data );
					unset($builder_data);
				}
				else{
					$result['builder_data'] = self::construct_data( $builder_data, $post_id, $action );
					unset($builder_data);
					if($action==='main'){
						/* save the data in json format */
						$result['mid']=self::update_builder_meta($post_id,$result['builder_data']);
						if(!empty($result['mid'])){
							if(class_exists('Themify_Builder_Revisions')){
							    Themify_Builder_Revisions::create_revision($post_id,$result['builder_data'],$source_editor);
							 
							}  
							// Save used GS
							Themify_Global_Styles::save_used_global_styles($result['builder_data'], $post_id);

							/**
							 * Fires After Builder Saved.
							 * 
							 * @param array $builder_data
							 * @param int $post_id
							 */		
							do_action( 'themify_builder_save_data', $result['builder_data'], $post_id );
						}
					}
				}
				return $result;
	}

	/**
	 * Construct data builder for saving.
	 * 
	 * @access public
	 * @param array $builder_data 
	 * @param int $post_id 
	 * @param string $action 
	 * @return array
	 */
	public static function construct_data( $builder_data, $post_id, $action='main' ) { 
		 /* if it's serialized, convert to array */
		 
		if( is_serialized( $builder_data ) ) {
			$builder_data = stripslashes_deep( unserialize( $builder_data ) );
		} elseif( is_string( $builder_data ) ) { /* perhaps it's a JSON string */
			/* validation: convert to JSON and see if it works */
			$converted = json_decode( $builder_data );
			if( is_array( $converted ) ) {
				$builder_data = $converted;
			}
			$converted=null;
		}
		
		$builder_data = apply_filters( 'themify_builder_data_before_construct', $builder_data, $post_id );

		if ($action==='import' && is_array($builder_data) && !empty($builder_data)) {
			$builder_data = Themify_Builder_Import_Export::replace_export(json_decode(json_encode($builder_data),true),$post_id);
		}
		elseif($action==='main'){
		    $builder_data = self::json_remove_unicode( $builder_data );
		    /**
		     * Ensure site URLs are saved without being escaped
		     * This is so the "search and replace" tools can later find the site URL without issue
		     * Ticket: #5336
		     */
		    $builder_data = map_deep( $builder_data, array( __CLASS__, 'unescape_home_url' ) );

		}
		return $builder_data;
	}

	/**
	 * Finds escaped home_url() and returns the unescaped version
	 *
	 * @return string|mixed
	 */
	public static function  unescape_home_url( $value ) {
		$formatted_url = str_replace( '/', '\\\/', home_url() );
		return is_string( $value ) ? str_replace( $formatted_url, home_url(), $value ) : $value;
	}

	/**
	 * Remove unicode sequences back to original character
	 * 
	 * @access public
	 * @param array $data 
	 * @return json
	 */
	public static function json_remove_unicode( $data ) {
	    return version_compare( PHP_VERSION, '5.4', '>=')?json_encode( $data, JSON_UNESCAPED_UNICODE ):json_encode( $data );
	}

	/**
	 * fix importing Builder contents using WP_Import
	 * 
	 * @access public
	 */
	public static function import_post_meta( $post_id, $key, $value ) {
	    if( $key === self::META_KEY) {
			self::update_builder_meta($post_id, $value);
	    }
	}

	/**
	 * Check if content has static content
	 * @param string $content 
	 */
	public static function has_static_content( $content ) {
		$start=strpos($content,'<!--themify_builder_static-->');
		if($start===false){
			return false;
		}
		$end=strpos($content,'<!--/themify_builder_static-->');
		return ($end!==false && ($start<$end));
	}


	/**
	 * Update static content string in the string.
	 * 
	 * @param string $replace_string 
	 * @param string $content 
	 * @param bool $first_instance True: replace only the first instance of Builder placeholder and remove the rest; False: replace all instances with $replace_string
	 * @return string
	 */
	public static function update_static_content_string( $replace_string, $content) {
		if ( self::has_static_content( $content ) ) {
						
			$arr = explode('<!--themify_builder_static-->',$content);
			unset($content);
			$html='';
			foreach($arr as $v){
				if($v!=='' && strpos($v,'<!--/themify_builder_static-->')!==false){
					$tmp = explode('<!--/themify_builder_static-->',$v);
					$html.=$replace_string.$tmp[1];
					if(isset($tmp[2])){
						$html.=$tmp[2];
					}
				}
				else{
					$html.=$v;
				}
			}
			unset($arr,$replace_string);
			return self::remove_empty_p($html);
		}
		return $content;
	}


	/**
	 * Add static content wrapper
	 * @param string $string 
	 * @return string
	 */
	public static function add_static_content_wrapper( $string ) {
		return '<!--themify_builder_static-->' . $string . '<!--/themify_builder_static-->';
	}

	/**
	 * Save the builder plain content into post_content
	 * 
	 * @param int $post_id
	 * @param json string $data 
	 */
	private static function save_builder_text_only( $post_id, $data ) {
		if(wp_is_post_revision( $post_id )){
		    return false;
		}
		$post = get_post($post_id); 
		if(!empty($post)){
		    $text_only = self::_get_all_builder_text_content(json_decode($data,true) );
		    if (!empty( $text_only ) ){
			$post_content = $post->post_content;
			if ( self::has_static_content( $post_content ) ) {
			    $post_content = self::update_static_content_string( self::add_static_content_wrapper( $text_only ), $post_content );
			} else {
			    $post_content = $post_content . self::add_static_content_wrapper( $text_only );
			}
			self::update_post($post_id,array('post_content'=>$post_content));
		    }
		    return true;
		}
		return false;
	}
	
	
	private static function removeTags($text){
	    

	    // Remove unnecessary tags.
	    $text = preg_replace( '/<\/?div[^>]*\>/i', '', $text );
	    $text = preg_replace( '/<\/?span[^>]*\>/i', '', $text );
	    $text = preg_replace( '@<(script|style)[^>]*?>.*?</\\1>@si', '', $text );
	    $text = preg_replace( '/<i [^>]*><\\/i[^>]*>/', '', $text );
	    $text = preg_replace( '/ class=".*?"/', '', $text );
	    $text = preg_replace( '/<!--(.|\s)*?-->/' , '' , $text );

	    // Remove line breaks
	    $text = preg_replace( '/(^|[^\n\r])[\r\n](?![\n\r])/', '$1 ', $text );
	    return normalize_whitespace( $text );
	}
	/**
	 * Get all module output plain content.
	 * 
	 * @param array $data 
	 * @return string
	 */
	public static function _get_all_builder_text_content( $data ) {
		global $ThemifyBuilder;
		$data = $ThemifyBuilder->get_flat_modules_list( null, $data );
		$text = array();
		if( is_array( $data ) ) {
			foreach( $data as $module ) {
				if(isset($module['mod_name']) ) {
					if(!isset(Themify_Builder_Model::$modules[ $module['mod_name'] ])){
						Themify_Builder_Component_Module::load_modules($module['mod_name']);
					}
					if(isset(Themify_Builder_Model::$modules[ $module['mod_name'] ])){
						$t=Themify_Builder_Model::$modules[ $module['mod_name'] ]->get_plain_content( $module );
						if($t!==''){
							$text[] = self::removeTags($t);
						}
					}
				}
			}
		}
		$data=null;
		return implode( "\n", $text );
	}

	/**
	 * Display admin notices when builder should be updated
	 * to support static content
	 */
	public static function static_content_notices() {

		if ( 'yes' === get_option( 'themify_builder_static_content_done' ) ) {
			return;
		} elseif ( ! self::has_existing_builder_data() ) {
			$_key='themify_builder_static_content_done';
			delete_option($_key);
			add_option($_key,'yes', '', false );
			return;
		}
		
		if ( self::$static_content_process->is_updating() || empty( $_GET['do_update_themify_builder_static_content'] ) ):
		$settings_page = themify_is_themify_theme() ? 'themify' : 'themify-builder';
		?>

		<div class="tb_builder_data_updater_notice notice notice-warning is-dismissible">
			<?php if ( self::$static_content_process->is_updating() ): ?>
				<p><strong><?php _e( 'Themify Builder data updater', 'themify' ); ?></strong> &#8211; <?php _e( 'Builder static content is being updated in the background.', 'themify' ); ?></p>
			<?php else: ?>
				<p><strong><?php _e( 'Themify Builder data updater', 'themify' ); ?></strong> &#8211; <?php _e( 'Run updater to convert your existing posts and pages to support Builder static content (<a href="https://themify.me/docs/builder#static-content" target="_blank">learn more</a>).', 'themify' ); ?></p>
				<p class="submit"><a href="<?php echo esc_url( add_query_arg( 'do_update_themify_builder_static_content', 'true', admin_url( 'admin.php?page=' . $settings_page ) ) ); ?>" class="tb_static_update_now button-primary"><?php _e( 'Run the updater', 'themify' ); ?></a></p>
			<?php endif; ?>
		</div>
		<script>
			jQuery( '.tb_static_update_now' ).on( 'click', function() {
				return window.confirm( '<?php echo esc_js( __( 'It is strongly recommended that you backup your database before proceeding. Are you sure you wish to run the updater now?', 'themify' ) ); ?>' );
			});
			jQuery(document).on('click', '.tb_builder_data_updater_notice .notice-dismiss', function(event){
				jQuery.ajax({
					type: 'POST',
					url: ajaxurl,
					data: {
						action: 'tb_dismiss_data_updater_notice'
					}
				});
			});
		</script>

		<?php else: ?> 
			<div class="notice notice-success">
				<p><?php _e( 'Themify Builder static content update complete.', 'themify' ); ?></p>
			</div>
		<?php
		endif;
	}

	/**
	 * Init the static content class.
	 */
	public static function init_static_content_bg_process() {
		include_once( THEMIFY_BUILDER_CLASSES_DIR . '/class-themify-builder-static-content-updater.php' );
		self::$static_content_process = new Themify_Builder_Static_Content_Updater();
	}

	/**
	 * Init background process the static content updater.
	 */
	public static function init_static_content_updater() {
		if ( ! empty( $_GET['do_update_themify_builder_static_content'] ) ) {
			global $wpdb;

			// get all posts
			$post_types = array();
			foreach( themify_post_types() as $type ) {
				$post_types[] = "'" . $type . "'";
			}
                        
                        include_once( THEMIFY_BUILDER_CLASSES_DIR . '/class-themify-builder-static-content-updater.php' );
			$last_id = 0;
 			self::$static_content_process = new Themify_Builder_Static_Content_Updater();
			do {
				$sql = "SELECT $wpdb->posts.ID 
					FROM $wpdb->posts, $wpdb->postmeta 
					WHERE $wpdb->posts.ID > ". $last_id ."
					AND $wpdb->posts.ID = $wpdb->postmeta.post_id 
					AND $wpdb->postmeta.meta_key = '" . self::META_KEY . "' 
					AND $wpdb->posts.post_status = 'publish' 
					AND post_type IN (" . implode( ',', $post_types ) .") 
					ORDER BY ID ASC 
					LIMIT 10";

				$posts = $wpdb->get_results( $sql );
			 
				foreach ( $posts as $post ) {
					self::$static_content_process->push_to_queue( $post->ID );
					$last_id = $post->ID;
				}
			// Do it until we have no more records
			} while ( ! empty( $posts ) );
			self::$static_content_process->save()->dispatch();
		}
	}

	/**
	 * Check if site has existing builder data
	 * 
	 * @access public
	 * @return boolean
	 */
	public static function has_existing_builder_data() {
		global $wpdb;
		$sql = "SELECT post_id FROM $wpdb->postmeta WHERE AND meta_key = '" . self::META_KEY . "' LIMIT 1";
		$id = $wpdb->get_var( $sql );
		if(!empty($id)){
		    $sql = "SELECT 1 FROM $wpdb->posts WHERE ID = '".$id."' AND post_status = 'publish' LIMIT 1";
		    $id = $wpdb->get_var( $sql );
		    $id=$id>0;
		}
		else{
		    $id=false;
		}
		return $id;
	}

	/**
	 * Perform static content conversion.
	 * 
	 * @param int $item
	 */
	public static function run_static_content_updater( $item ) {
		$data = self::get_data( $item );

		if ( is_array( $data ) && ! empty( $data ) ) {
			wp_update_post(array(
				'ID' => $item,
				'post_modified' => current_time('mysql'),
				'post_modified_gmt' => current_time('mysql', 1),
			));
		}
	}

	/**
	 * Remove empty paragraph
	 * 
	 * @access public
	 * @param string $content 
	 * @return string
	 */
	public static function remove_empty_p( $content ) {
		return str_replace(array(PHP_EOL .'<!--themify_builder_content-->','<!--/themify_builder_content-->'.PHP_EOL,'<p><!--themify_builder_content-->','<!--/themify_builder_content--></p>'),array('<!--themify_builder_content-->','<!--/themify_builder_content-->','<!--themify_builder_content-->','<!--/themify_builder_content-->'),trim($content));
	}

	/**
	 * Dismiss builder data updater static content.
	 * 
	 * @access public
	 */
	public static function dismiss_data_updater_notice() {
		$_key='tb-data-updater-notice-dismissed';
		delete_option($_key);
		add_option($_key,1, '', false );
		wp_send_json_success();
	}

	/**
	 * Register network menu for builder updater.
	 * 
	 * @access public
	 */
	public static function network_builder_updater_menu() {
		add_menu_page( esc_html__( 'Themify Builder Data Updater', 'themify' ), esc_html__( 'Builder Updater', 'themify' ), 'manage_options', 'themify-builder-data-updater', array(__CLASS__, 'network_builder_data_updater_page') );
	}

	/**
	 * Collect all builder data in all sites.
	 * 
	 * @access public
	 */
	public static function network_collect_builder_data() {
		$sites = get_sites();
		$ids = array();

		foreach( $sites as $site ) {
			switch_to_blog( $site->blog_id );
			if ( 'yes' !== get_option( 'themify_builder_static_content_done' ) && self::has_existing_builder_data() ) {
				$ids[] = $site->blog_id;
			}
			restore_current_blog();
		}
		return $ids;
	}

	/**
	 * Network Builder Data update page.
	 * 
	 * @access public
	 */
	public static function network_builder_data_updater_page() { ?>
		<div class="wrap">
			<h2><?php esc_html_e( 'Themify Builder Data Updater', 'themify' );?></h2>
			
			<?php
			$action = isset($_GET['tb_action']) ? $_GET['tb_action'] : 'show'; 

			switch ( $action ) {
				case 'update':
					$n = ( isset($_GET['n']) ) ? intval($_GET['n']) : 0;
					$limit = 5;

					$site_ids = get_sites( array(
						'spam'       => 0,
						'deleted'    => 0,
						'archived'   => 0,
						'network_id' => get_current_network_id(),
						'number'     => $limit,
						'offset'     => $n,
						'fields'     => 'ids',
						'order'      => 'DESC',
						'orderby'    => 'ID',
					) );
					if ( empty( $site_ids ) ) {
						echo '<p>' . __( 'All done!', 'themify' ) . '</p>';
						break;
					}
					echo '<ul>';
					foreach ( (array) $site_ids as $site_id ) {
						switch_to_blog( $site_id );
						$siteurl = site_url();
						$upgrade_url = add_query_arg( array( 'page' => 'themify', 'do_update_themify_builder_static_content' => true ), admin_url('admin.php') );
						$cookies = array();

						foreach ( $_COOKIE as $name => $value ) {
							$cookies[] = new WP_Http_Cookie( array( 'name' => $name, 'value' => $value ) );
						}

						restore_current_blog();

						echo "<li>$siteurl</li>";

						$response = wp_remote_get( $upgrade_url, array(
							'timeout' => 10000, 
							'cookies' => $cookies,
							'httpversion' => '1.1',
							'sslverify'   => false
						) );
						if ( is_wp_error( $response ) ) {
							wp_die( sprintf(
								__( 'Warning! Problem updating builder data in %1$s. Your server may not be able to connect to sites running on it. Error message: %2$s', 'themify' ),
								$siteurl,
								'<em>' . $response->get_error_message() . '</em>'
							) );
						}
					}
					echo '</ul>';

					$action_url = add_query_arg( array(
						'page'   => 'themify-builder-data-updater',
						'tb_action' => 'update',
						'n' => $n+$limit
					), network_admin_url( 'admin.php' ) );

					?><p><?php _e( 'If your browser doesn&#8217;t start loading the next page automatically, click this link:', 'themify' ); ?> <a class="button" href="<?php echo $action_url; ?>"><?php _e('Next Sites', 'themify'); ?></a></p>
					<script type="text/javascript">
					<!--
					function nextpage() {
						document.location.href = "<?php echo $action_url; ?>";
					}
					setTimeout( "nextpage()", 250 );
					//-->
					</script><?php
				break;
				case 'show':
				default: ?>
					
					<p><?php _e( 'Run updater to convert your existing posts and pages to support Builder static content (<a href="https://themify.me/docs/builder#static-content" target="_blank">learn more</a>).', 'themify' ); ?></p>
					
					<p><?php _e( 'The update process may take a little while, so please be patient.', 'themify' ); ?></p>
					<p><a class="button button-primary" href="<?php echo network_admin_url( 'admin.php?page=themify-builder-data-updater&tb_action=update' );?>"><?php _e( 'Update Builder Data Now', 'themify' ); ?></a></p>
					
					<?php
				break;
			} ?>
		</div>
	<?php
	}

	
	/**
	 * Save the builder in post meta
	 * 
	 * @param int $post_id 
	 * @param json string $data 
	 */
	private static function update_builder_meta($post_id,$data){
	    $data = apply_filters( 'themify_builder_data_before_update_meta', $data, $post_id );
	    $isRevision=wp_is_post_revision( $post_id );
	    if($isRevision || self::save_builder_text_only($post_id, $data)){
		//Don't use delete_post_meta will remove revision parent builder data
		delete_metadata( 'post', $post_id,self::META_KEY );
		if(!$isRevision){
		    /* remove the old data format */
		    delete_metadata( 'post', $post_id,self::OLD_META_KEY );
		}
		if(!empty($data)){
		    global $wpdb;
		    do_action( 'add_post_meta', $post_id, self::META_KEY, $data);
		    $result = $wpdb->insert(
			    _get_meta_table('post'),
			    array(
				    'post_id'      => $post_id,
				    'meta_key'   =>  self::META_KEY,
				    'meta_value' =>$data
			    ),
			    array('%d','%s','%s')
		    );
		    if ( ! $result ) {
				return false;
		    }
			unset($result);
		    $mid = (int) $wpdb->insert_id;
		}
		
		if(!$isRevision){
		    Themify_Builder_Model::remove_cache($post_id);
		    wp_cache_delete( $post_id,'post_meta' );
		    TFCache::remove_cache($post_id);
		    themify_clear_menu_cache();
            TFCache::clear_3rd_plugins_cache($post_id);
		}
		if(!empty($data)){
		    do_action( 'added_post_meta', $mid, $post_id, self::META_KEY, $data );
		}
		unset($data);
		if(!$isRevision){
		    // update the post modified date time, to indicate the post has been modified
		    self::update_post($post_id,array('post_modified'=>current_time('mysql'),'post_modified_gmt'=>current_time('mysql', 1)));
		}
		return $mid;
	    }
	    return false;
	}
	
	public static function update_post($post_id,$data){
		global $wpdb;
		return $wpdb->update( $wpdb->posts, $data,array('ID'=>$post_id),null,array('%d'));

	}
}
ThemifyBuilder_Data_Manager::init();
