<?php
/**
 * This file contain abstraction class to create module object.
 *
 * Themify_Builder_Component_Module class should be used as main class and
 * create any child extend class for module.
 * 
 *
 * @package    Themify_Builder
 * @subpackage Themify_Builder/classes
 */

defined( 'ABSPATH' ) || exit;

/**
 * The abstract class for Module.
 *
 * Abstraction class to initialize module object, don't initialize
 * this class directly but please create child class of it.
 *
 *
 * @package    Themify_Builder
 * @subpackage Themify_Builder/classes
 * @author     Themify
 */
class Themify_Builder_Component_Module extends Themify_Builder_Component_Base {

    /**
     * Module Name.
     * 
     * @access public
     * @var string $name
     */
    public $name;

    /**
     * Module Slug.
     * 
     * @access public
     * @var string $slug
     */
    public $slug;

    /**
     * Module Category.
     *
     * @access public
     * @var string $category
     */
    public $category;


    
    private static $assets = array(
        'bgzs'=>array(
            'match'=>'.builder-zoom-scrolling',
            'js' => THEMIFY_BUILDER_JS_MODULES . 'bgzoom_scroll.js'
        ),
        'bgzm' =>array(
            'match'=>'.builder-zooming',
            'js' =>THEMIFY_BUILDER_JS_MODULES . 'bgzoom.js'
        ),
        'p'=>array(
            'match'=>'.builder-parallax-scrolling',
            'js' =>  THEMIFY_BUILDER_JS_MODULES . 'parallax.js',
        ),
        'fwv' => array(
            'match'=>'[data-tbfullwidthvideo]',
            'js'=>THEMIFY_BUILDER_JS_MODULES . 'fullwidthvideo.js'
        ),
        'fwr' => array(
            'match'=>'.fullwidth.module_row,.fullwidth_row_container.module_row',
            'js'=>THEMIFY_BUILDER_JS_MODULES . 'fullwidthRows.js'
        ),
        'bgs' =>array(
            'selector'=>':scope>.tb_slider',
            'js'=> THEMIFY_BUILDER_JS_MODULES . 'backgroundSlider.js',
        ),
        'rd'=>array(
            'selector'=>'.module-text-more',
            'js' =>THEMIFY_BUILDER_JS_MODULES . 'readMore.js'
        ),
        'cl' => array(
            'selector'=>'[data-tb_link]',
            'js' => THEMIFY_BUILDER_JS_MODULES . 'clickableComponent.js'
        ),
        'fr'=>array(
            'match'=>'.tb_row_frame_wrap',
            'css' => THEMIFY_BUILDER_CSS_MODULES . 'frames.css'
        ),
        'bgz'=>array(
            'match'=>'.themify-bg-zoom',
            'css' => THEMIFY_BUILDER_CSS_MODULES . 'bg-zoom.css'
        ),
        'cv'=>array(
            'selector'=>'.builder_row_cover',
            'css' => THEMIFY_BUILDER_CSS_MODULES . 'cover.css'
        )
        /*
        'plx' =>array(
            'selector'=>'.builder-parallax-scrolling',
            'js' => THEMIFY_BUILDER_JS_MODULES . 'parallax.js',
        ),
         * 
         */
    );
    
    
    
    public static $isFirstModule=false;
    /**
     * Constructor.
     * 
     * @access public
     * @param array $params 
     */
    public function __construct($params) {
        $this->name = $params['name'];
        $this->slug = $params['slug'];
        $this->category = !empty($params['category']) ? $params['category'] : array('general');
    }

    /**
     * Get module options.
     * 
     * @access public
     */
    public function get_options() {
        return array();
    }

    /**
     * Get module styling options.
     * 
     * @access public
     */
    public function get_styling() {
        return array();
    }
    
    public function get_icon(){
	return '';
    }
	
	

    protected function _visual_template() {
        
    }

    public function get_default_settings() {
        return false;
    }
    
    public function get_default_args(){
	return array();
    }
    
    public function get_live_default(){
	return false;
    }

    public function get_visual_type() {
        return 'live';
    }

    /**
     * Render a module, as a plain text
     *
     * @return string
     */
    public function get_plain_text($module) {
        $options = $this->get_options();
        if (empty($options))
            return '';
        $out = array();

        foreach ($options as $field) {
            // sanitization, check for existence of needed keys
            if (!isset($field['type'],$field['id'],$module[$field['id']])) {
                continue;
            }
            // text, textarea, and wp_editor field types
            if (in_array($field['type'], array('text', 'textarea', 'wp_editor'), true)) {
                $out[] = $module[$field['id']];
            }
            // builder field type
            elseif ($field['type'] === 'builder' && is_array($module[$field['id']])) {
                // gather text field types included in the "builder" field type
                $text_fields = array();
                foreach ($field['options'] as $row_field) {
                    if (isset($row_field['type']) && in_array($row_field['type'], array('text', 'textarea', 'wp_editor'), true)) {
                        $text_fields[] = $row_field['id'];
                    }
                }
                foreach ($module[$field['id']] as $row) {
                    // separate fields from the row that have text fields
                    $texts = array_intersect_key($row, array_flip($text_fields));
                    // add them to the output
                    $out = array_merge(array_values($texts), $out);
                }
            }
        }

        return implode(' ', $out);
    }

    /**
     * Load builder modules
     */
    public static function load_modules($mod_name=false) {
        // load modules
        if($mod_name){
            static $active_modules=null;
            if($active_modules===null){
                $active_modules = Themify_Builder_Model::get_modules('active');
            }
            if(!isset($active_modules[$mod_name])){
                return false;
            }
            $items = array($active_modules[$mod_name]);
        }
        else{
			if($mod_name!=='all'){
				$mod_name='active';
			}
            $items = Themify_Builder_Model::get_modules($mod_name);
        }   
        foreach ($items as $m) {
            require_once( $m['dirname'] . '/' . $m['basename'] );
        }
    }

    public function get_assets() {
        
    }
    
    public static function get_modules_assets() {
        return self::$assets;
    }
    
    public static function add_modules_assets($k,$item) {
        self::$assets[$k] = $item;
    }

    public function render($slug, $mod_id, $builder_id, $settings) {
        $template = $slug==='highlight' || $slug==='testimonial' || $slug==='post' || $slug==='portfolio'? 'blog' : $slug;
        
        $vars = array(
            'module_ID' => $mod_id,
            'mod_name' => $slug,
            'builder_id' => $builder_id,
            'mod_settings' => $settings
        );
        $vars = apply_filters( 'themify_builder_module_render_vars', $vars, $slug );
        return self::retrieve_template('template-' . $template . '.php', $vars, '', '', false);
    }

    /**
     * If there's not an options tab in Themify Custom Panel meta box already defined for this post type, like "Portfolio Options", add one.
     *
     * @since 2.3.8
     *
     * @param array $meta_boxes
     *
     * @return array
     */
    public function cpt_meta_boxes( $meta_boxes = array() ) {
		Themify_Builder_Model::load_general_metabox(); // setup common fields

        $meta_box_id = $this->slug . '-options';
        if ( ! in_array( $meta_box_id, wp_list_pluck( $meta_boxes, 'id' ), true ) ) {
            $options = $this->get_metabox();
			if ( ! empty( $options ) ) {
				$meta_boxes = array_merge( $meta_boxes, array(
					array(
						'name' => sprintf( __( '%s Options', 'themify' ), $this->name ),
						'id' => $meta_box_id,
						'options' => $options,
						'pages' => $this->slug
					)
				));
			}
        }

        return $meta_boxes;
    }

    /**
     * Get Module Title.
     * 
     * @access public
     * @param object $module 
     */
    public function get_title($module) {
        return '';
    }

    public function get_name() {
        return $this->slug;
    }

    public function print_template($echo=false) {
        ob_start();
        $template_file = self::locate_template( 'template-' . $this->slug . '-visual.php' );
        if( is_file( $template_file ) ) {
            include $template_file;
        } else {
            $this->_visual_template();
        }
        $content_template = ob_get_clean();
        if (empty($content_template)) {
            return false;
        }
        $output = '<script type="text/template" id="tmpl-builder-'.$this->slug.'-content">'.$content_template.'</script>';
        if(!$echo){
            return $output;
        }
        echo $output;
    }
	
	public static function get_module_title($fields_args,$key='mod_title'){
		if(isset($fields_args[$key]) && $fields_args[$key]!==''){
			$args = self::get_module_args($key);
			return $args['before_title'].apply_filters('themify_builder_module_title',$fields_args[$key], $fields_args).$args['after_title'];
		}
		return '';
	}

      public static function get_module_args($key='mod_title') {
        $args = apply_filters('themify_builder_module_args', array('before_title'=> '<h3 class="module-title">','after_title'=>'</h3>'));
		if($key!=='' && (Themify_Builder::$frontedit_active === true || Themify_Builder_Model::is_front_builder_activate())){
			$args['before_title']=str_replace(' class=',' data-name="'.$key.'" contenteditable="false" class=',$args['before_title']);
		}
        return $args;
    }

	public function get_form_settings( $onlyStyle = false ) {
		$styling = $this->get_styling();
		// Add Z-index to all modules
		$styling = self::add_zindex_filed($styling);
		$styling = self::add_transform_filed($styling);
		if ( $onlyStyle === true ) {
			return $styling;
		}
		$module_form_settings = array(
			'setting' => array(
				'name' => ucfirst( $this->name ),
				'options' => apply_filters( 'themify_builder_module_settings_fields', $this->get_options(), $this )
			)
		);
                // Add Post filter option
                if(property_exists($this, 'post_filter')){
                    $module_form_settings['setting']['options'] = $this->add_post_filter_option($module_form_settings['setting']['options'],strpos($this->slug,'product')!==false);
                }
		if ( !empty( $styling ) ) {
			$module_form_settings['styling'] = array( 'options' => $styling );
		}
		if ( $this->get_animation() === false ) {
			$module_form_settings['animation'] = false;
		}
                $module_form_settings['setting']['options'][]=array('type' => 'tooltip');
		return apply_filters( 'themify_builder_module_lightbox_form_settings', $module_form_settings, $this );
	}


    /**
     * Get template for module
     * @param $mod
     * @param int $builder_id
     * @param bool $echo
     * @param bool $wrap
     * @param array $identifier
     * @return bool|string
     */
    public static function template($mod, $builder_id = 0, $echo = true, $identifier = array()) {
        if (Themify_Builder::$frontedit_active===false) {
            /* allow addons to control the display of the modules */
            $display = apply_filters('themify_builder_module_display', true, $mod, $builder_id, $identifier);
            if (false === $display || ( isset( $mod['mod_settings']['visibility_all'] ) && $mod['mod_settings']['visibility_all'] === 'hide_all' ) ) {
                return false;
            }
        }	
        if(!isset( $mod['mod_name'])){
            return false;
        }
        $output = '';
	$slug = $mod['mod_name'];
	static $isLoaded = array();
	self::$isFirstModule=false;
	if( !isset($isLoaded[$slug])){//load only the modules in the page
	    if(!isset(Themify_Builder_Model::$modules[$slug])){
		    self::load_modules($slug);
	    }
	    // check whether module active or not
	    if (!Themify_Builder_Model::check_module_active($slug)) {
		    return false;
	    }
	    $isLoaded[$slug]= true;
	    if($slug==='feature' || $slug==='menu' || $slug==='tab' || $slug==='accordion'){
		    Themify_Enqueue_Assets::addPrefetchJs(THEMIFY_BUILDER_URI.'/js/modules/'.$slug.'.js',THEMIFY_VERSION);
	    }
	    if(Themify_Builder::$frontedit_active===false && empty($mod['mod_settings']['_render_plain_content'])){
		    $assets = Themify_Builder_Model::$modules[ $slug ]->get_assets();
		    static $count=0;//only need to load the modules styles in concate for the first 2 modules to show LCP asap,even if they should load as async 
		    self::$isFirstModule=$count<2;
		    if (isset($assets['css']) && ($count<2 || !isset($assets['async']))) {
			    if($echo===true){
				$assets['css']=(array) $assets['css'];
				$ver = isset($assets['ver']) ?  $assets['ver'] : THEMIFY_VERSION;
				foreach ($assets['css'] as $k=>$s) {
				    $key= is_int($k)?$slug:$k;
				    Themify_Builder_Model::loadCssModules('tb_'.$key,$s,$ver);
				}
			    }
			    unset($assets['css'],$assets['async']);
		    }
		    if(isset($assets['js']) || isset($assets['css'])){
			self::$assets[$slug] = $assets;
			if(self::$isFirstModule===true && isset($assets['js'])){
			    Themify_Enqueue_Assets::addPrefetchJs($assets['js'],(isset($assets['ver']) ?  $assets['ver'] : THEMIFY_VERSION));
			}
		    }
		    ++$count;
	    }
	}
        $mod['mod_settings'] = isset($mod['mod_settings']) ? $mod['mod_settings'] : array();
	
	$mod_id =isset($mod['element_id'])?'tb_'.$mod['element_id']:($slug . '-' . $builder_id . '-' . implode('-', $identifier));
        $mod['mod_settings']+=self::get_module_args();//deprecated. Use get_module_title
	if($echo!==true){
	    $output.= PHP_EOL; // add line break
	    ob_start();
	}
        do_action('themify_builder_background_styling',$builder_id,array('styling' => $mod['mod_settings'], 'mod_name' => $slug),$mod_id,'module');
	if($echo!==true){
	    $output .= ob_get_clean();
	    // add line break
	    $output .= PHP_EOL;
        }
        // render the module
        $output .= Themify_Builder_Model::$modules[ $slug ]->render($slug, $mod_id, $builder_id, $mod['mod_settings']);
        if($slug==='slider' && Themify_Builder::$frontedit_active===false){
            $output=themify_make_lazy($output, false);
        }
	if ($echo===true) {
		echo $output;
	}
        else{
	    $output .= PHP_EOL;
            return $output;
        }
    }

    /**
     * Returns module title custom style
     * @param string $slug 
     * @return array
     */
    protected function module_title_custom_style() {
        return array(
            // Background
            self::get_expand('bg', array(
		self::get_tab(array(
		    'n' => array(
			'options' => array(
			    self::get_color('.module .module-title', 'background_color_module_title', 'bg_c', 'background-color')
			)
		    ),
		    'h' => array(
			'options' => array(
			    self::get_color('.module .module-title', 'bg_c_m_t','bg_c', 'background-color', 'h')
			)
		    )
		))
	    )),
            // Font
            self::get_expand('f', array(
		self::get_tab(array(
		    'n' =>array(
			'options' => array(
			    self::get_font_family('.module .module-title', 'font_family_module_title'),
			    self::get_color('.module .module-title', 'font_color_module_title'),
			    self::get_font_size('.module .module-title', 'font_size_module_title'),
			    self::get_line_height('.module .module-title', 'line_height_module_title'),
			    self::get_text_align('.module .module-title', 'text_align_module_title'),
			    self::get_text_shadow('.module .module-title', 't_sh_m_t'),
			)
		    ),
		    'h' => array(
			'options' => array(
			    self::get_font_family('.module .module-title', 'f_f_m_t', 'h'),
			    self::get_color('.module .module-title', 'f_c_m_t', null, null, 'h'),
			    self::get_font_size('.module .module-title', 'f_s_m_t', '', 'h'),
			    self::get_line_height('.module .module-title', 'l_h_m_t', 'h'),                        
			    self::get_text_align('.module .module-title', 't_a_m_t', 'h'),
			    self::get_text_shadow('.module .module-title', 't_sh_m_t', 'h'),
			)
		    )
		))
	    ))
        );
    }

    /**
     * Get plain content of the module output.
     * 
     * @param array $module 
     * @return string
     */
    public function get_plain_content( $module ) {
		if(isset($module['mod_settings'])){
			$module['mod_settings']['_render_plain_content'] = true;
			// Remove format text filter including do_shortcode
			if (!Themify_Builder_Model::is_front_builder_activate()) {
			remove_filter('themify_builder_module_content', array('Themify_Builder_Model', 'format_text'));
			}
		}
		else{
			 $module['mod_settings']=array('_render_plain_content'=>true);
		}
        return self::template( $module, 0, false );
    }
    /**
    * Title tag settings for Post module
    *
    * @return array
    */
    public static function post_title_tag($args) {
	    $args['tag'] = 'h2';
	    return $args;
    }

	/**
	 * Add z-index option to styling tab
	 *
	 * @return array
	 */
	public static function add_zindex_filed($styling) {
		$field = self::get_expand('zi',
			array(
				self::get_zindex('','custom_parallax_scroll_zindex')
			)
		);
		if ( isset( $styling['type'] ) && 'tabs' === $styling['type'] ) {
			$styling['options'][ key( $styling['options'] ) ]['options'][] = $field;
		} else {
			$styling[] = $field;
		}
		return $styling;
	}
	
    /**
     * Add Transform options to styling tab
     *
     * @return array
     */
    public static function add_transform_filed($styling) {
        $field=self::get_expand('tr', array(
            self::get_tab(array(
                'n' =>array('options'=>self::get_transform()),
                'h' =>array('options'=>self::get_transform('','tr','h'))
            ))
        ));
        if ( isset( $styling['type'] ) && 'tabs' === $styling['type'] ) {
            $styling['options'][ key( $styling['options'] ) ]['options'][] = $field;
        } else {
            $styling[] = $field;
		}
        return $styling;
    }

    /**
     * Add Post Filter option
     *
     * @return array
     */
    public function add_post_filter_option($options,$is_product=false) {
        foreach( $options as $k=>$opt ) {
            if ( isset($opt['type']) && $opt['type'] === 'layout' ) {
                break;
            }
        }
        array_splice($options, $k + 1, 0, array(
            array(
                'id'=>'post_filter',
                'type'=>'toggle_switch',
                'label'=>($is_product===true?__('Product Filter', 'themify'):__('Post Filter', 'themify')),
                'options'=>'simple',
                'wrap_class'=>'tb_group_element_all tb_group_element_category',
                'binding'=>array(
                    'not_checked'=>array(
                        'show'=>array('disable_masonry','masonry'),
                        'hide'=>array('filter_hashtag','ajax_filter')
                    ),
                    'checked'=>array(
                        'hide'=>array('disable_masonry','masonry'),
                        'show'=>array('filter_hashtag','ajax_filter')
                    )
                )
            ),
            array(
                'id' => 'filter_hashtag',
                'type' => 'toggle_switch',
                'label' => __('URL Hashtag', 'themify'),
                'options'=>'simple'
            ),
            array(
                'id' => 'ajax_filter',
                'type' => 'toggle_switch',
                'label' => __('Ajax Filter', 'themify'),
                'options'=>'simple',
                'binding'=>array(
                    'not_checked'=>array(
                        'hide'=>array('ajax_sort','ajax_filter_exclude')
                    ),
                    'checked'=>array(
                        'show'=>array('ajax_sort','ajax_filter_exclude')
                    )
                )
            ),
            array(
                'id' => 'ajax_filter_exclude',
                'type' => 'text',
                'label' => __('Exclude Categories', 'themify'),
                'help' => __('Enter comma separated list of category IDs to exclude in post filter.', 'themify')
            ),
            array(
                'id' => 'ajax_sort',
                'type' => 'toggle_switch',
                'label' => __('Sort Filter', 'themify'),
                'options'=>'simple'
            ),
            array(
                'id' => 'masonry_align',
                'type' => 'toggle_switch',
                'label' => __('Align Posts', 'themify'),
                'options'=>'simple',
				'help' => __( 'For Post Filter and Masonry option, make items aligned instead of stacking.', 'themify' ),
            )
        ));
        return $options;
    }
}

if (!function_exists('themify_builder_testimonial_author_name')) :

    function themify_builder_testimonial_author_name($post, $show_author) {
	$out = '';
	if ('yes' === $show_author) {
	    if ($author = get_post_meta($post->ID, '_testimonial_name', true))
		$out = '<span class="dash"></span><cite class="testimonial-name">' . $author . '</cite> <br/>';

	    if ($position = get_post_meta($post->ID, '_testimonial_position', true))
		$out .= '<em class="testimonial-title">' . $position;

	    if ($link = get_post_meta($post->ID, '_testimonial_link', true)) {
		if ($position) {
		    $out .= ', ';
		} else {
		    $out .= '<em class="testimonial-title">';
		}
		$out .= '<a href="' . esc_url($link) . '">';
	    }

	    if ($company = get_post_meta($post->ID, '_testimonial_company', true))
		$out .= $company;
	    else
		$out .= $link;

	    if ($link)
		$out .= '</a>';

	    $out .= '</em>';
	}
	return $out;
    }

endif;
