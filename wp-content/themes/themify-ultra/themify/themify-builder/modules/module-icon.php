<?php

defined( 'ABSPATH' ) || exit;

/**
 * Module Name: Icon
 * Description: Display Icon content
 */

class TB_Icon_Module extends Themify_Builder_Component_Module {

    function __construct() {
	parent::__construct(array(
	    'name' => __('Icon', 'themify'),
	    'slug' => 'icon'
	));
    }
    
    public function get_icon(){
	return 'control-record';
    }
    
    public function get_assets() {
	return array(
	    'css'=>THEMIFY_BUILDER_CSS_MODULES.$this->slug.'.css'
	);
    }

    public function get_options() {

	return array(
	    array(
		'id' => 'content_icon',
		'type' => 'builder',
		'new_row' => __('Add new', 'themify'),
		'options' => array(
            array(
                'id' => 'icon_type',
                'type' => 'radio',
                'label' => __('Icon Type', 'themify'),
                'options' => array(
                    array('value'=>'icon','name'=>__('Icon', 'themify')),
                    array('value'=>'image','name'=>__('Image', 'themify'))
                ),
                'option_js' => true
            ),
            array(
                'id' => 'image',
                'type' => 'image',
                'label' => __('Image URL', 'themify'),
                'wrap_class' => 'tb_group_element_image'
            ),
			array(
				'type' => 'icon_color_bg',
			),
		    array(
                'id' => 'label',
                'type' => 'text',
                'label' => __('Label', 'themify'),
                'class' => 'fullwidth',
                'control' => array(
			        'selector' => '.module-icon-item>span'
			    )
		    ),
            array(
                'id' => 'hide_label',
                'type' => 'checkbox',
                'label' => '',
                'options' => array(
                    array('name' => 'hide', 'value' => __('Hide label text', 'themify'))
                )
            ),
		    array(
                'id' => 'link',
                'type' => 'url',
                'label' => __('Link', 'themify'),
                'class' => 'fullwidth',
                'binding' => array(
                    'empty' => array(
                        'hide' => array('link_options', 'lightbox_size')
                    ),
                    'not_empty' => array(
                        'show' => array('link_options', 'lightbox_size')
                    )
                )
		    ),
		    array(
                'id' => 'link_options',
                'type' => 'radio',
                'label' => 'o_l',
                'link_type' =>true,
                'option_js' => true,
                'wrap_class' => ' tb_compact_radios',
		    ),
		    array(
			'type' => 'multi',
			'label' => __('Lightbox Dimension', 'themify'),
			'options' => array(
			    array(
                    'id' => 'lightbox_width',
                    'label' => 'w',
                    'control' => false,
                    'type' => 'range',
                    'units' => array(
                        'px' => array(
                            'max' => 3500
                        ),
                        '%' => '',
                        'em' => array(
                            'min' => -10,
                            'max' => 10
                        )
                    )
			    ),
			    array(
                    'id' => 'lightbox_height',
                    'label' => 'ht',
                    'control' => false,
                    'type' => 'range',
                    'units' => array(
                        'px' => array(
                            'max' => 3500
                        ),
                        '%' =>'',
                        'em' => array(
                            'min' => -10,
                            'max' => 10
                        )
                    )
			    )
			),
			'wrap_class' => 'tb_group_element_lightbox'
		    )
		)
	    ),
			array(
				'type' => 'group',
				'label' => __( 'Icon Layout', 'themify' ),
				'display' => 'accordion',
				'options' => array(
					array(
						'id' => 'icon_size',
						'label' => __('Size', 'themify'),
						'type' => 'layout',
						'mode' => 'sprite',
						'options' => array(
							array('img' => 'normall_button', 'value' => 'normal', 'label' => __('Normal', 'themify')),
							array('img' => 'small_button', 'value' => 'small', 'label' => __('Small', 'themify')),
							array('img' => 'large_button', 'value' => 'large', 'label' => __('Large', 'themify')),
							array('img' => 'xlarge_button', 'value' => 'xlarge', 'label' => __('xLarge', 'themify')),
						)
					),
					array(
						'id' => 'icon_style',
						'label' => __('Icon Shape', 'themify'),
						'type' => 'layout',
						'mode' => 'sprite',
						'options' => array(
							array('img' => 'circle_button', 'value' => 'circle', 'label' => __('Circle', 'themify')),
							array('img' => 'rounded_button', 'value' => 'rounded', 'label' => __('Rounded', 'themify')),
							array('img' => 'squared_button', 'value' => 'squared', 'label' => __('Squared', 'themify')),
							array('img' => 'none','value' => 'none', 'label' => __('None', 'themify'))
						)
					),
					array(
						'id' => 'icon_arrangement',
						'label' => __('Arrangement ', 'themify'),
						'type' => 'layout',
						'mode' => 'sprite',
						'options' => array(
							array('img' => 'horizontal_button', 'value' => 'icon_horizontal', 'label' => __('Horizontal', 'themify')),
							array('img' => 'vertical_button', 'value' => 'icon_vertical', 'label' => __('Vertical', 'themify')),
						)
					),
					array(
						'id' => 'icon_position',
						'type' => 'icon_radio',
						'label' => __('Icon Position ', 'themify'),
						'aligment2' => true
					),
				)
			),
			array( 'type' => 'custom_css_id', 'custom_css' => 'css_icon' ),
	);
    }

    public function get_live_default() {
	return array(
        'icon_arrangement'=>'icon_horizontal',
	    'content_icon' => array(
		array(
		    'icon_type' => 'icon',
		    'image' => '',
		    'icon' => 'fa-home',
		    'label' => __('Icon label', 'themify'),
		    'hide_label' => '',
		    'icon_color_bg' => 'blue',
		    'icon_position'=>'',
		    'link_options' => 'regular'
		)
	    )
	);
    }

    public function get_styling() {
	$general = array(
	    // Background
	    self::get_expand('bg', array(
		self::get_tab(array(
		    'n' => array(
			'options' => array(
			    self::get_image()
			)
		    ),
		    'h' => array(
			'options' => array(
			     self::get_image('', 'b_i','bg_c','b_r','b_p', 'h')
			)
		    )
		))
	    )),
	    // Font
	    self::get_expand('f', array(
		self::get_tab(array(
		    'n' => array(
			'options' => array(
			    self::get_font_family(),
			    self::get_color_type(' span'),
			    self::get_font_size(array(' i', ' a', ' span')),
			    self::get_line_height(array(' i', ' a', ' span')),
			    self::get_letter_spacing(),
			    self::get_text_align(),
			    self::get_text_transform(),
			    self::get_font_style(),
			    self::get_text_decoration(' span', 'text_decoration_regular'),
				self::get_text_shadow(),
			)
		    ),
		    'h' => array(
			'options' => array(
			    self::get_font_family('', 'f_f', 'h'),
			    self::get_color_type(':hover span','f_c_h', ''),
			    self::get_font_size(array(':hover i', ':hover a', ':hover span'), 'f_s_h', '', ''),
			    self::get_line_height(array(':hover i', ':hover a', ':hover span'), 'l_h_h', ''),
			    self::get_letter_spacing('', 'l_s', 'h'),
			    self::get_text_align('', 't_a', 'h'),
			    self::get_text_transform('', 't_t', 'h'),
			    self::get_font_style('', 'f_st', 'f_w', 'h'),
			    self::get_text_decoration(':hover span', 't_d_r_h', ''),
				self::get_text_shadow('','t_sh','h'),
			)
		    )
		))
	    )),
	    // Link
	    self::get_expand('l', array(
		self::get_tab(array(
		    'n' => array(
			'options' => array(
			    self::get_color(' span', 'link_color'),
			    self::get_text_decoration(' a')
			)
		    ),
		    'h' => array(
			'options' => array(
			    self::get_color(' span:hover',  'link_color_hover'),
			    self::get_text_decoration(' a', 't_d','h')
			)
		    )
		))
	    )),
	    // Padding
	    self::get_expand('p', array(
		self::get_tab(array(
		    'n' => array(
			'options' => array(
			    self::get_padding()
			)
		    ),
		    'h' => array(
			'options' => array(
			    self::get_padding('', 'p', 'h')
			)
		    )
		))
	    )),
	    // Margin
	    self::get_expand('m', array(
		self::get_tab(array(
		    'n' => array(
			'options' => array(
			    self::get_margin()
			)
		    ),
		    'h' => array(
			'options' => array(
			    self::get_margin('', 'm', 'h')
			)
		    )
		))
	    )),
	    // Border
	    self::get_expand('b', array(
		self::get_tab(array(
		    'n' => array(
			'options' => array(
			    self::get_border()
			)
		    ),
		    'h' => array(
			'options' => array(
			    self::get_border('', 'b', 'h')
			)
		    )
		))
	    )),
		// Filter
		self::get_expand('f_l',
			array(
				self::get_tab(array(
					'n' => array(
						'options' => self::get_blend()

					),
					'h' => array(
						'options' => self::get_blend('', '', 'h')
					)
				))
			)
		),
	    // Width
	    self::get_expand('w', array(
			self::get_tab(array(
				'n' => array(
					'options' => array(
						self::get_width('', 'w')
					)
				),
				'h' => array(
					'options' => array(
						self::get_width('', 'w', 'h')
					)
				)
			))
	    )),
				// Height & Min Height
				self::get_expand('ht', array(
						self::get_height(),
						self::get_min_height(),
						self::get_max_height()
					)
				),
		// Rounded Corners
		self::get_expand('r_c', array(
				self::get_tab(array(
					'n' => array(
						'options' => array(
							self::get_border_radius()
						)
					),
					'h' => array(
						'options' => array(
							self::get_border_radius('', 'r_c', 'h')
						)
					)
				))
			)
		),
		// Shadow
		self::get_expand('sh', array(
				self::get_tab(array(
					'n' => array(
						'options' => array(
							self::get_box_shadow()
						)
					),
					'h' => array(
						'options' => array(
							self::get_box_shadow('', 'sh', 'h')
						)
					)
				))
			)
		),
		// Position
		self::get_expand('po', array( self::get_css_position())),
		// Display
		self::get_expand('disp', self::get_display())
	);

	$icon = array(
	    // Background
	    self::get_expand('bg', array(
		self::get_tab(array(
		    'n' => array(
			'options' => array(
			    self::get_color(' .module-icon-item em', 'background_color_icon', 'bg_c', 'background-color')
			)
		    ),
		    'h' => array(
			'options' => array(
			    self::get_color(' .module-icon-item em', 'background_color_icon', 'bg_c', 'background-color','hover')
			)
		    )
		))
	    )),
	    // Color
	    self::get_expand('c', array(
		self::get_tab(array(
		    'n' => array(
			'options' => array(
			    self::get_color(' .module-icon-item em', 'font_color_icon')
			)
		    ),
		    'h' => array(
			'options' => array(
			    self::get_color(' .module-icon-item em', 'font_color_icon', null, null, 'hover')
			)
		    )
		))
	    )),
	    // Font Size
	    self::get_expand('Size', array(
			self::get_tab(array(
				'n' => array(
				'options' => array(
					self::get_font_size(' .module-icon-item em', 'f_s_i')
				)
				),
				'h' => array(
				'options' => array(
					self::get_font_size(' .module-icon-item em', 'f_s_i', '', 'h')
				)
				)
			))
	    )),
	    // Padding
	    self::get_expand('p', array(
			self::get_tab(array(
				'n' => array(
					'options' => array(
						self::get_padding(' .module-icon-item em', 'p_i')
					)
				),
				'h' => array(
					'options' => array(
						self::get_padding(' .module-icon-item em', 'p_i', 'h')
					)
				)
			))
	    )),
	    // Margin
	    self::get_expand('m', array(
			self::get_tab(array(
				'n' => array(
					'options' => array(
						self::get_margin(' .module-icon-item em', 'm_i')
					)
				),
				'h' => array(
					'options' => array(
						self::get_margin(' .module-icon-item em', 'm_i', 'h')
					)
				)
			))
	    )),
		// Rounded Corners
		self::get_expand('r_c', array(
			self::get_tab(array(
				'n' => array(
					'options' => array(
						self::get_border_radius(' .module-icon-item em', 'r_c_i')
					)
				),
				'h' => array(
					'options' => array(
						self::get_border_radius(' .module-icon-item em', 'r_c_i', 'h')
					)
				)
			))
		)),
		// Shadow
		self::get_expand('sh', array(
			self::get_tab(array(
				'n' => array(
					'options' => array(
						self::get_box_shadow(' .module-icon-item em', 'b_sh_i')
					)
				),
				'h' => array(
					'options' => array(
						self::get_box_shadow(' .module-icon-item em', 'b_sh_i', 'h')
					)
				)
			))
		))
	);

	$icon_container = array(
	    // Background
	    self::get_expand('bg', array(
		self::get_tab(array(
		    'n' => array(
			'options' => array(
			    self::get_color(' .module-icon-item', 'bg_c_ctn', 'bg_c', 'background-color')
			)
		    ),
		    'h' => array(
			'options' => array(
			    self::get_color(' .module-icon-item', 'bg_c_ctn', 'bg_c', 'background-color','hover')
			)
		    )
		))
	    )),
	    // Padding
	    self::get_expand('p', array(
			self::get_tab(array(
				'n' => array(
					'options' => array(
						self::get_padding(' .module-icon-item', 'p_ctn')
					)
				),
				'h' => array(
					'options' => array(
						self::get_padding(' .module-icon-item', 'p_ctn', 'h')
					)
				)
			))
	    )),
	    // Margin
	    self::get_expand('m', array(
			self::get_tab(array(
				'n' => array(
					'options' => array(
						self::get_margin(' .module-icon-item', 'm_ctn')
					)
				),
				'h' => array(
					'options' => array(
						self::get_margin(' .module-icon-item', 'm_ctn', 'h')
					)
				)
			))
	    )),
	    // Border
	    self::get_expand('b', array(
			self::get_tab(array(
				'n' => array(
					'options' => array(
						self::get_border(' .module-icon-item', 'b_ctn')
					)
				),
				'h' => array(
					'options' => array(
						self::get_border(' .module-icon-item', 'b_ctn', 'h')
					)
				)
			))
	    )),
		// Rounded Corners
		self::get_expand('r_c', array(
			self::get_tab(array(
				'n' => array(
					'options' => array(
						self::get_border_radius(' .module-icon-item', 'r_c_ctn')
					)
				),
				'h' => array(
					'options' => array(
						self::get_border_radius(' .module-icon-item', 'r_c_ctn', 'h')
					)
				)
			))
		)),
		// Shadow
		self::get_expand('sh', array(
			self::get_tab(array(
				'n' => array(
					'options' => array(
						self::get_box_shadow(' .module-icon-item', 'b_sh_ctn')
					)
				),
				'h' => array(
					'options' => array(
						self::get_box_shadow(' .module-icon-item', 'b_sh_ctn', 'h')
					)
				)
			))
		))
	);

	return array(
	    'type' => 'tabs',
	    'options' => array(
		'g' => array(
		    'options' => $general
		),
		'icon_container' => array(
		    'label' => __('Container', 'themify'),
		    'options' => $icon_container
		),
		'icon' => array(
		    'label' => __('Icon', 'themify'),
		    'options' => $icon
		)
	    )
	);
    }

    protected function _visual_template() {
	$module_args = self::get_module_args('mod_title_icon');
	?>
	<#	var position = data.icon_position? data.icon_position.replace('icon_position_','') : '';
	    if(position){
			position='tf_text'+position[0];
	    }
	#>
	<div class="module module-<?php echo $this->slug; ?> {{ data.css_icon }} {{ data.icon_size }} {{ data.icon_style }} {{ data.icon_arrangement }} {{ position }}">
	    <# if( data.mod_title_icon ) { #>
	    <?php echo $module_args['before_title']; ?>
	    {{{ data.mod_title_icon }}}
	    <?php echo $module_args['after_title']; ?>
	    <# } 
		if(data.content_icon){
			_.each( data.content_icon, function( item ) {
				var link_target = item.link_options == 'newtab' ? ' rel="noopener" target="_blank"' : '',
					link_lightbox_class = item.link_options == 'lightbox' ? " class='lightbox-builder themify_lightbox'" : '',
					color_bg = item.icon_color_bg=='default' ? 'tb_default_color' : item.icon_color_bg,
					lightbox_data = item.lightbox_width || item.lightbox_height ? (' data-zoom-config="'+item.lightbox_width+item.lightbox_width_unit+'|'+item.lightbox_height+item.lightbox_height_unit+'"'): '',
					style = '';
				if ( item.bg ) {
					style += 'background: ' + tb_app.Utils.toRGBA( item.bg ) + ';';
				}
				if ( item.c ) {
					style += 'color: ' + tb_app.Utils.toRGBA( item.c ) + ';';
				}
				#>
				<div class="module-icon-item{{'icon_horizontal'===data.icon_arrangement ? ' tf_inline_b' : ''}}">
				<# if(item.link){ #>
					<a href="{{ item.link }}"{{ link_target }}{{{ link_lightbox_class }}}{{ lightbox_data }}>
				<# }
					if (item.icon_type!='image' && item.icon){ #>
						<em class="ui tf_vmiddle tf_textc tf_box {{ color_bg }}" style="{{ style }}"><# print(tb_app.Utils.getIcon(item.icon).outerHTML)#></em>
					<# }
					if (item.icon_type=='image' && item.image){ #>
						<img class="ui {{ color_bg }} tf_vmiddle tf_box" src="{{ item.image }}">
					<# }
					if (item.label && item.hide_label!='hide'){ #>
						<span class="tf_vmiddle" contenteditable="false" data-name="label" data-repeat="content_icon">{{{ item.label }}}</span>
					<# }  if(item.link){ #>
				</a>
				<# } #>
				</div>
		    <# });
		} #>
	    </div>
	<?php
    }

}

///////////////////////////////////////
// Module Options
///////////////////////////////////////
Themify_Builder_Model::register_module('TB_Icon_Module');
