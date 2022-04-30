;( ( $,doc ) => {
    'use strict';
	let self;

	window.ThemifyBuilderPage = {

		container : null,
		layout_lists : null,
		spinner : null,
		layouts_loaded : false,

		loadCSS() {
                    const fr=doc.createDocumentFragment();
			Object.keys( tbBuilderPage.css ).forEach( function( i ) {
				if ( ! document.getElementById( i + '-css' ) ) {
					const style = doc.createElement( 'link' );
					style.setAttribute( 'rel', 'stylesheet' );
					style.setAttribute( 'href', tbBuilderPage.css[ i ] );
					style.setAttribute( 'id', i + '-css' );
                                        fr.appendChild(style);
				}
			} );
                        doc.head.appendChild( fr );
		},

		loadLayoutsList() {
			$.ajax({
				type: 'POST',
				url: tbBuilderPage.ajaxurl,
				dataType: 'json',
				data: {
					action: 'tb_load_predesigned_layouts',
					nonce: tbBuilderPage.nonce,
					src: tbBuilderPage.paths.layouts_index,
				},
				success( res ) {
					self.layouts_loaded = true;
					const items = JSON.parse( res.data );
					self.renderLayouts( items );
					self.spinner.style.display = 'none';
				},
				error() {
				}
			});
		},
		publishPage( args ) {
			return $.ajax( {
				type : 'POST',
				url : tbBuilderPage.ajaxurl,
				data : {
					_ajax_nonce : tbBuilderPage.nonce,
					action : 'tb_builder_page_publish',
					title : args.title,
					layout : args.layout,
					parent : args.parent
				},
				success( response ) {
					if ( response.success ) {
						window.location = response.data;
					} else {
						console && console.log( response );
						self.hidePanel();
					}
				},
				complete() {
					self.spinner.style.display = 'none';
				}
			} );
		},
		renderLayouts(data,selected) {
			const categories = {},
				frag1 = doc.createDocumentFragment(),
				frag2 = doc.createDocumentFragment(),
				icon = self.container.querySelector( '.tbbp_search_icon svg' ),
				filter = self.container.querySelector( '.tbbp_category ul' );
			for (let i = 0, len = data.length; i < len; ++i) {
				let li = doc.createElement('li'),
					layout = doc.createElement('div'),
					thumbnail = doc.createElement('div'),
					title = doc.createElement('div'),
					img = doc.createElement('img');
				li.dataset.category = data[i].category;

				layout.className = 'tbbp_preview';
				layout.dataset.id = data[i].id;
				layout.dataset.slug = data[i].slug;

				thumbnail.className = 'tbbp_thumbnail';
				img.src = data[i].thumbnail;
				img.alt = data[i].title;
				img.title = data[i].title;
				title.className = 'tbbp_layout_title';
				title.textContent = data[i].title;
				thumbnail.appendChild(img);
				layout.appendChild(thumbnail);
				layout.appendChild(title);
				if(undefined !== data[i].url){
				  let a = doc.createElement('a');
					a.className = 'tbbp_preview_link';
					a.href = data[i].url;
					a.target = '_blank';
					a.title = 'Preview';
					a.appendChild( icon.cloneNode( true ) );
					layout.appendChild(a);
				}
				li.appendChild(layout);
				frag1.appendChild(li);
				if (data[i].category) {
					let cat = String(data[i].category).split(',');
					for (let j = 0, len2 = cat.length; j < len2; ++j) {
						if ('' !== cat[j] && categories[cat[j]] !== 1) {
							let li2 = doc.createElement('li');
							li2.textContent = cat[j];
							filter.appendChild(li2);
							categories[cat[j]] = 1;
						}
					}
				}
			}
			self.layout_lists.appendChild(frag1);
		},
		init() {
			self.layout_lists.addEventListener( 'click', function( e ) {
				if ( e.target.closest( 'li' ) ) {
					self.layout_lists.querySelector( '.selected' )?.classList.remove( 'selected' );
					e.target.closest( 'li' ).classList.add( 'selected' );
				}
			} );
			self.container.querySelector( '.tbbp_close' ).addEventListener( 'click', function() {
				self.hidePanel();
			} );
			self.container.querySelector( '.tbbp_search_container input' ).addEventListener( 'keyup', function() {
				let s = this.value.trim(),
					items = $( self.layout_lists ).find( 'li' );
				if ( s === '' ) {
					items.show();
				} else {
					items.hide().find( '.tbbp_layout_title' ).filter(function() {
						var reg = new RegExp( s, "i" );
						return reg.test( $(this).text() );
					}).closest( 'li' ).show();
				}
			} );
			self.container.addEventListener( 'submit', function( e ) {
				const post_title = self.container.querySelector( '.tbbp_title input' ).value;
				if ( post_title === '' ) {
					return;
				}
				e.preventDefault();
				self.spinner.style.display = 'block';
				const layout = self.layout_lists.querySelector( '.selected > div' ).dataset.slug,
					parent = self.container.querySelector( '.tbbp_parent select' ).value;
				if ( layout === '' ) {
					self.publishPage( { title : post_title, parent : parent } );
				} else {
					$.get( tbBuilderPage.paths.layout_template.replace( '{SLUG}', layout ) , null, null, 'text' ).done( ( response ) => {
						let data = JSON.parse( response );
						self.publishPage( { title : post_title, parent : parent, layout : data } );
					} );
				}

			} );
			self.container.querySelector( '.tbbp_category ul' ).addEventListener( 'click', (e) => {
				if ( e.target.tagName !== 'LI' ) {
					return;
				}

				let items = $( self.layout_lists ).find( 'li' ),
					value = e.target.textContent,
					label_el = e.target.closest( '.tbbp_category' ).querySelector( '.tbbp_category_label' );
				label_el.blur();
				label_el.textContent = value;

				if ( e.target.classList.contains( 'all' ) ) {
					items.show();
				} else {
					items.hide().filter( '[data-category*="' + value + '"]' ).show();
				}
			} );
		},
		loadPanel() {
			if ( self.container === null ) {
				return $.ajax( {
					type : 'POST',
					url : tbBuilderPage.ajaxurl,
					data : {
						_ajax_nonce : tbBuilderPage.nonce,
						action : 'tb_builder_page',
					},
					success( response ) {
						let node = doc.createElement( 'div' );
						node.innerHTML = response;
						self.container = node.firstChild;
						self.layout_lists = self.container.getElementsByClassName( 'tbbp_layout_lists' )[0];

						doc.body.appendChild( self.container );
					}
				} );
			} else {
				return new Promise( ( resolve ) => { resolve(); } );
			}
		},
		showPanel() {
			self.container.style.display = 'block';
		},
		hidePanel() {
			self.container.style.display = 'none';
		},
		run() {
			self = this;
			self.loadCSS();
			self.loadPanel().then( function() {
				self.showPanel();
				if ( ! self.layouts_loaded ) {
					self.loadLayoutsList();
				}

				self.init();
				self.container.querySelector( '#title' ).focus();
			} );
		}

	};

} )( jQuery,document );