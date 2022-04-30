/* Routines to manage font icons in theme settings and custom panel. */
;var Themify_Icons = {};

(function($){
	'use strict';
	const caches={};
	Themify_Icons = {
		target: '',
		ajaxurl: tfIconPicker.ajaxurl,
		top:$(window.top.document),
		loader: null,
		init() {
			const self = Themify_Icons;
			self.top.on('click', '.themify_fa_toggle', function(e){
				e.preventDefault();
				e.stopPropagation();
				const $self = $( this );
				self.target =  $self.attr('data-target') ? $( $self.attr('data-target'),self.top ) : $self.prev();
				self.showLightbox( self.target.val() );
			}).on('click', '#themify_lightbox_fa .lightbox_container a:not(.external-link)', function(e){
				e.preventDefault();
				e.stopPropagation();
				self.setIcon( $( this ).data( 'icon' ) );
			}).on('click', '#themify_lightbox_overlay, #themify_lightbox_fa .close_lightbox', function(e){
				e.preventDefault();
				e.stopPropagation();
				self.closeLightbox();
			}).on('change', '.tf-icon-group-select input', function(e){
				const $this = $(this),
					group = this.value;
				$( '#themify_lightbox_fa .tf-font-group',self.top ).hide().filter( '[data-group="' + group + '"]' ).show();
				if('fontawesome' === group && $this.attr('data-icons') !== "true"){
					$this.attr('data-icons',true);
				}
				self.getByCategory();
			});
			self.Category();
			self.Search();
		},
		getByCategory(callback){
			
			const self=this,
				lightbox = $('#themify_lightbox_fa',self.top),
				type =  lightbox.find('.tf-icon-group-select input:checked').val();
			if(!caches[type]){
				self.Loader('show');
				caches[type]=true;
				$.ajax({
					url : self.ajaxurl,
					data : { action : 'tf_icon_get_by_type',type:type},
					type : 'POST',
					success : function( data ){
						const top=self.top[0],
						tmp = top.createElement('div');
						tmp.innerHTML=data;
						const groups = tmp.getElementsByClassName('tf_icons_groups'),
						tmp_svg=tmp.querySelector('#tf_svg'),
						svg=top.getElementById('tf_svg');
						if(groups.length>0){
							for(let i=groups.length-1;i>-1;--i){
								let id=groups[i].id,
									item=lightbox[0].querySelector('#'+id+' .row');
								if(item){
									item.innerHTML=groups[i].innerHTML;
								}
							}
							if(tmp_svg){
								if(!svg){
									top.appendChild(tmp_svg);
								}
								else{
									const exists = svg.getElementsByTagName('symbol'),
                                                                                symbols = tmp_svg.getElementsByTagName('symbol'),
                                                                                fr=top.createDocumentFragment(),
										arr={};
									for(let i=exists.length-1;i>-1;--i){
										arr[exists[i].id]=true;
									}
									for(let i=symbols.length-1;i>-1;--i){
										if(!arr[symbols[i].id]){
											fr.appendChild(symbols[i]);
										}
									}
									svg.firstChild.appendChild(fr);
								}
								if(window.top !== window.self){
									const currentSvg=document.getElementById('tf_svg');
									if(!currentSvg){
										document.appendChild(svg.cloneNode(true));
									}
									else{
										const loaded={},
										f=document.createDocumentFragment(),
										existItems=currentSvg.getElementsByTagName('symbol'),
										items=svg.getElementsByTagName('symbol');
										for(let i=existItems.length-1;i>-1;--i){
											loaded[existItems[i].id]=true;
										}
										for(let i=items.length-1;i>-1;--i){
											if(!loaded[items[i].id]){
												f.appendChild(items[i].cloneNode(true));
											}
										}
										currentSvg.firstChild.appendChild(f);
									}
								}
							}
						}
						else{
							const item = lightbox[0].querySelector('.tf-font-group[data-group="'+type+'"]');
							if(item){
								item.innerHTML=data;
							}
						}
						if(callback){
							callback();
						}
						self.Loader('spinhide');
					}
				});
			}
			else{
				if(callback){
					callback();
				}
				self.Loader('spinhide');
			}
		},
		showLightbox( selected ) {
			const self = this;
			self.Loader('show');
			self.loadIconsList( function(){
				self.getByCategory(function(){
					const top = self.top.scrollTop() + 80,
						$lightbox = $("#themify_lightbox_fa",self.top),
						$lightboxOverlay = $('#themify_lightbox_overlay',self.top);
					if( selected ) {
						$( 'a', $lightbox ).removeClass( 'selected' ).filter( '[data-icon="' + selected + '"]' ).addClass( 'selected' );
					}
									
					// Position lightbox correctly in Builder
					if ($lightboxOverlay.length===0 && $('body',self.top).hasClass('themify_builder_active')) {
						$('body',self.top).append($lightboxOverlay);
					}
									
					// set active font group
					if( $lightbox.find( 'a.selected' ).length>0) {
						const group = $lightbox.find( 'a.selected' ).closest( '.tf-font-group' ).data( 'group' );
						$lightbox.find('.tf-icon-group-select input[value="' + group + '"]' ).click();
					} else {
						$lightbox.find('.tf-icon-group-select input:first' ).change();
					}

					$('#themify-search-icon-input',$lightbox).val('').trigger('keyup');
					$('.themify-lightbox-icon'.$lightbox).find('.selected').trigger('click');
									
					$lightboxOverlay.show();
					$lightbox
					.css('top', self.top.height())
					.show()
					.animate({
						top: top
					}, 600 );
				});
			});
		},
		loadIconsList( callback ){
			const self=this;
			if( $( '#themify_lightbox_fa',self.top ).length>0) {
				callback();
			} else {
                            let isCssLoad=false,
                                isAjaxLoad=false;
                            window.top.Themify.LoadCss(tfIconPicker.url+'styles.css',null,null,null,function(){
                                isCssLoad=true;
                                if(isAjaxLoad===true){
                                    callback();
                                }
                            });
                            $.ajax({
                                    url : self.ajaxurl,
                                    data : { action : 'tf_icon_picker_lightbox' },
                                    type : 'POST',
                                    success : function( data ){
                                            $( 'body',self.top ).append( data );
                                            isAjaxLoad=true;
                                            if(isCssLoad===true){
                                                callback();
                                            }
                                    }
                            });
			}
		},
		setIcon(iconName) {
			Themify_Icons.target.val(iconName).trigger('change');
                        if(typeof Themify!=='undefined'){
                            Themify.triggerEvent(Themify_Icons.target[0],'change');
                        }
			// icon preview
			let icon_prev = $('.fa:not(.icon-close)', Themify_Icons.target.parent().parent());
			if (icon_prev.length <= 0) {
				icon_prev = $('.font-icon-preview i', Themify_Icons.target.parent().parent());
			}
			if ( icon_prev.length > 0 ) {
				$.ajax({
					url : Themify_Icons.ajaxurl,
					data : { action: 'tf_get_icon', tf_icon : iconName },
					success: function( data ){
						if ( data.match( /<svg/ ) ) {
							icon_prev.empty().html( data );
						} else {
							icon_prev.removeClass().addClass( data );
						}
					}
				});
			}
			Themify_Icons.closeLightbox();
		},
		closeLightbox() {
			$('#themify_lightbox_fa',Themify_Icons.top).animate({
				top: Themify_Icons.top.height()
			}, 400, function() {
				$('#themify_lightbox_overlay',Themify_Icons.top).hide();
				$(this).hide();
			});
		},
		Category(){
			const self=this;
			self.top.on('click','.themify-lightbox-icon li',function(e){
				e.preventDefault();
				e.stopPropagation();
				let is_selected = $(this).hasClass('selected');
				$(this).closest('.themify-lightbox-icon').find('.selected').removeClass('selected');
				if(!is_selected){
					const $id = $(this).data('id'),
						group = $('#'+$id,self.top);
						$(this).addClass('selected');
					if(group.length>0){
						$(this).closest('.lightbox_container').find('section').not('#'+$id).fadeOut('fast',function(){
							group.fadeIn('normal');
						});
					}
				}
				else {
					$(this).closest('.lightbox_container').find('section').fadeIn('fast',function(){
							$('#themify-search-icon-input',self.top).trigger('keyup');
					});
				}
				self.getByCategory();
			});
		},
		Search(){
			$.expr.pseudos.contains = $.expr.createPseudo(function(arg) {
				return function( elem ) {
					return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
				};
			});
			Themify_Icons.top.on('keyup','#themify-search-icon-input',function(){
				var $text = this.value.trim(),
					$container = $('#themify_lightbox_fa',Themify_Icons.top).find('.tf-font-group a'),
					$sections  = $('#themify_lightbox_fa',Themify_Icons.top).find('section');
				if($text){
					$sections.hide();
					$container.hide()
					.filter(':contains(' + $text.toUpperCase()  + ')').show().each( function(){
						$( this ).closest( 'section' ).show();
					} );
				}
				else{
				   
					$sections.show();
					$container.show();
				}
			});
		},
		Loader(stats){
			if(typeof ThemifyBuilderCommon !== "undefined"){
				ThemifyBuilderCommon.showLoader(stats);
				return;
			}
			if (this.loader === null) {
				this.loader = $('.tb_alert',this.top);
			}
			if(this.loader.length<=0){
				return;
			}
			if (stats === 'show') {
				this.loader.addClass('busy').fadeIn(800);
			}else if (stats === 'spinhide') {
				this.loader.removeClass('busy').fadeOut(800);
			}
		}
	};
    Themify_Icons.init();
})(jQuery);