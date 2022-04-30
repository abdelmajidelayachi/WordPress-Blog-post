;(($,document, Themify )=>{
	'use strict';
        
	let startX,
		startY,
		event='click';
	if(Themify.isTouch){
		event+=' touchend';
	}
	const getCoord = (e, c) =>{
		return /touch/.test(e.type) ? (e.originalEvent || e).changedTouches[0]['page' + c] : e['page' + c];
	},
	_trigger = (el,show) =>{
		const item=el.find( '.sub-menu, .children' ).first(),
			   sub= el.find( '> a .child-arrow' );
		let ev='open';
		if(show===true){
			item.css( 'visibility', 'visible' ).slideDown();
			el.addClass( 'dropdown-open toggle-on' );
			sub.removeClass( 'closed' ).addClass( 'open' );
		}
		else{
			item.slideUp( () => {
				$( this ).css( 'visibility', 'hidden' );
			} );
			el.removeClass( 'dropdown-open toggle-on' );
			sub.removeClass( 'open' ).addClass( 'closed' );
			ev='close';
		}
		el.trigger( 'dropdown_'+ev );
	},
	_init=() =>{
		if(Themify.isTouch){
                    Themify.body.on('touchstart', '.child-arrow, .with-sub-arrow a', (e)=>{
                            e.stopPropagation();
                            startX = getCoord(e, 'X');
                            startY = getCoord(e, 'Y');
                    });
		}
		Themify.body.on(event, '.child-arrow', function(e){
			e.stopPropagation();
			// If movement is less than 20px, execute the handler
			if (
				e.type === 'click'
				|| ( Math.abs(getCoord(e, 'X') - startX) < 20 && Math.abs(getCoord(e, 'Y') - startY) < 20 )
			) {
				const menu_item = $( this ).closest( 'li' ),
					active_tree = $( this ).parents( '.dropdown-open' );
				$( this ).closest( '.with-sub-arrow' ) // get the menu container
					.find( 'li.dropdown-open' ).not( active_tree ) // find open (if any) dropdowns
					.each(function(){
						_trigger( $( this ),false );
					});

				_trigger( menu_item, ! menu_item.hasClass( 'dropdown-open' ) );
			}

			return false;
		} )
		// clicking menu items where the URL is only "#" is the same as clicking the dropdown arrow
		.on( event, '.with-sub-arrow a', function(e){
			// If movement is less than 20px, execute the handler
			if (Math.abs(getCoord(e, 'X') - startX) < 20 && Math.abs(getCoord(e, 'Y') - startY) < 20) {
				if( $( this ).attr( 'href' ) === '#' ) {
					e.stopPropagation();
					$( this ).find( '> .child-arrow' ).click();
					return false;
				}
			}
		} );
	};
	
	Themify.on('tf_dropdown_init',(items)=>{
		if(items instanceof jQuery){
			items=items.get();
		}
		if(items.length===undefined){
			items=[items];
		}
		for(let i=items.length-1;i>-1;--i){
			if(!items[i].classList.contains('with-sub-arrow')){
				items[i].className+=' with-sub-arrow';
				let item=items[i].getElementsByClassName('menu-item-has-children');
				for(let j=item.length-1;j>-1;--j){
					let childs=item[j].children;
					for(let k=childs.length-1;k>-1;--k){
						if(childs[k].tagName==='A' && !childs[k].getElementsByClassName('child-arrow')[0] && !childs[k].classList.contains('themify_lightbox')){
							let arrow=document.createElement('span');
							arrow.className='child-arrow closed';
							childs[k].appendChild(arrow);
						}
					}
				}
				item=items[i].getElementsByClassName('page_item_has_children');
				for(let j=item.length-1;j>-1;--j){
					let childs=item[j].children;
					for(let k=childs.length-1;k>-1;--k){
						if(childs[k].tagName==='A' && !childs[k].getElementsByClassName('child-arrow')[0] && !childs[k].classList.contains('themify_lightbox')){
							let arrow=document.createElement('span');
							arrow.className='child-arrow closed';
							childs[k].appendChild(arrow);
						}
					}
				}
			}
		}
		_init();
	});
})( jQuery,document, Themify );