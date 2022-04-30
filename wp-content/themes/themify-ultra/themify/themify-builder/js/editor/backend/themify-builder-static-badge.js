/*globals window, document, $, jQuery, _, Backbone */
(function ($,wp, _) {
	'use strict';
	
	let builderContent = '';
	const placeholder = '<!--themify_builder_static--><!--/themify_builder_static-->',
			patterns = [/<!--themify_builder_static-->([\s\S]*?)<!--\/themify_builder_static-->/gi, /&lt;!--themify_builder_static--&gt;([\s\S]*?)&lt;!--\/themify_builder_static--&gt;/gi, /&amp;lt;!--themify_builder_static--&amp;gt;([\s\S]*?)&amp;lt;!--\/themify_builder_static--&amp;gt;/gi],
		main_editor = !themifyBuilder.short_badge?'content':'excerpt';
		
	
	wp.mce.views.register( 'tb_static_badge', {
		template: wp.media.template( 'tb-static-badge' ),
		bindNode( editor, node ) {
			$(node).on('click', '.tb_mce_view_frontend_btn', this.goToFront)
			.on('click', '.tb_mce_view_backend_btn', this.goToBack);
		},
		getContent() {
			return this.template({});
		},
		match( content ) {
			const match = wp.mce.views._tb_static_content.isMatch( content );
			if ( match ) {
				return {
					index: match.index,
					content: match[0],
					options: {}
				};
			}
		},
		View: {
			className: 'tb_static_badge',
			template: wp.media.template( 'tb-static-badge' ),
			getHtml: function() {
				return this.template({});
			}
		},
		edit( node ) {
			this.goToFront();
		},
		goToFront(){
			$( '#tb_switch_frontend' ).trigger( 'click' );
		},
		goToBack() { 
			tb_app._backendBuilderFocus();
		},
		contentPlaceholder( content ) {
			builderContent = builderContent || content;

			return placeholder + ( content.length > placeholder.length
				? ' '.repeat( content.length - placeholder.length ) : '' );
		}
	} );

	wp.mce.views._tb_static_content = {
		setContent( editor, content ) {
			if(content){
				content=content.trim();
			}
			if( typeof tinyMCE !== 'undefined' && tinyMCE.activeEditor && tinyMCE.activeEditor.id===main_editor) {
				if( tinyMCE.activeEditor.hidden ) {
					if(content!==$('#'+main_editor).val().trim()){
						$('#'+main_editor).val(content);
					}
				} 
				else if(content!==editor.getContent().trim()){
					editor.setContent( content );
				}
			} 
			else if(content!==editor.val().trim()) {
				editor.val(content);
			}
		},
		isMatch( content ) {
			return patterns[0].exec( content ) || patterns[1].exec( content ) || patterns[2].exec( content );
		}
	};

	$(document).on('tinymce-editor-init', function( event, editor ) {
		if (editor.wp && editor.wp._createToolbar) {
			const toolbar = editor.wp._createToolbar([
				'wp_view_edit'
			]);

			if (toolbar) {
				//this creates the toolbar
				editor.on('wptoolbar', function (event) {
					if (editor.dom.hasClass(event.element, 'wpview') && 'tb_static_badge' === editor.dom.getAttrib( event.element, 'data-wpview-type')) {
						event.toolbar = toolbar;
					}
				});
			}
		}
		if(editor.id!==main_editor){
			const content = editor.getContent();
			let match = wp.mce.views._tb_static_content.isMatch( content );
			if ( !_.isNull( match ) ) {
				editor.setContent( content.replace( match[0], '' ) );
			}
		}else{
			editor.setContent( wp.mce.views.setMarkers( editor.getContent() ) );
		}

		editor.on('beforesetcontent', function( e ) {
			e.content = wp.mce.views.setMarkers( e.content );
		});
	});

	$('body').on('themify_builder_save_data', function( e, jqxhr ){
		if (themifyBuilder.is_gutenberg_editor  || !jqxhr.data || !jqxhr.data.static_content ){
			return true;
		}

		let editor,content,match=null;
		if( typeof tinyMCE !== 'undefined' && tinyMCE.activeEditor && tinyMCE.activeEditor.id===main_editor ) {
			editor = tinyMCE.activeEditor;
			content = false === tinyMCE.activeEditor.hidden ? tinyMCE.activeEditor.getContent() : tinymce.DOM.get(main_editor).value;
			match = wp.mce.views._tb_static_content.isMatch( content );
		} else {
			editor = $('#'+main_editor);
			if ( ! editor.length ) {
				return;
			}
			content = editor.val();
			match = wp.mce.views._tb_static_content.isMatch( content );
		}

		if ( _.isNull( match ) ) {
			wp.mce.views._tb_static_content.setContent( editor, content + jqxhr.data.static_content );
		} else {
			wp.mce.views._tb_static_content.setContent( editor, content.replace( match[0], jqxhr.data.static_content ) );
		}
	});

	// YOAST SEO
	const yoastReadBuilder = {
		timeout:null,
		// Initialize
		init() {
			$(window).on('YoastSEO:ready', function () {
				yoastReadBuilder.load();
			});
		},
		// Load plugin and add hooks.
		load() {
			// gutenberg post
			if ( themifyBuilder.is_gutenberg_editor ) {
				builderContent = wp.data.select( "core/editor" ).getCurrentPost().builder_content;
			}

			YoastSEO.app.registerPlugin( 'TBuilderReader', {status: 'loading'} );

			YoastSEO.app.pluginReady( 'TBuilderReader' );
			YoastSEO.app.registerModification( main_editor, yoastReadBuilder.readContent, 'TBuilderReader', 5 );

			// Make the Yoast SEO analyzer works for existing content when page loads.
			yoastReadBuilder.update();
		},
		// Read content to Yoast SEO Analyzer.
		readContent( content ) {
			if( builderContent ) {
				if ( themifyBuilder.is_gutenberg_editor ) {
					content+= ' ' + builderContent;
				} else {
					content = content.replace( placeholder, builderContent ).replace( /(\r\n|\n|\r)/gm, '' );
				}
			}

			return content;
		},
		// Update the YoastSEO result. Use debounce technique, which triggers only when keys stop being pressed.
		update() {
			if(this.timeout ){
				clearTimeout(this.timeout );
			}
			this.timeout = setTimeout( function () {
				YoastSEO.app.refresh();
			}, 250 );
		}
	};
	// Run on document ready.
	//$( yoastReadBuilder.init );
	yoastReadBuilder.init();

}(jQuery,wp, _));