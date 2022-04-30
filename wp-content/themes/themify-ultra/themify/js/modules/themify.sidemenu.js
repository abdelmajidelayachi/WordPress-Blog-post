;((Themify)=>{

	'use strict';

	const defaults = {
			panel: '#mobile-menu',
			close: '',
			side: 'right',
			hasOverlay:true,
			beforeShow:null,
			afterShow:null,
			beforeHide:null,
			afterHide:null
		},
		instance=[];
	let overLay=null;
	function SideMenu ( element, options ) {
		this.element = element;
		if(!options['panel'] && element.hasAttribute('href')){
			options['panel']=element.getAttribute('href');
			if(!options['panel'] || options['panel']==='#'){
				options['panel']=defaults['panel'];
			}
		}
		this.settings = Object.assign( {}, defaults, options );
		this.panelVisible = false;
		const replacements = { '#':'', '\.':'', ' ':'-' };
		this.panelCleanName = this.settings.panel.replace( /#|\.|\s/g, (match)=>{
				return replacements[match]; 
			} 
		);
		this.init();
	}

	SideMenu.prototype = {
		init() {
			const self = this;
			if(overLay===null && this.settings['hasOverlay']=== true){
				overLay = document.createElement('div');
				overLay.className = 'body-overlay';
				overLay.style['display']='none';
				overLay.addEventListener('click', function(){
					for(var i=instance.length-1;i>-1;--i){
						instance[i].hidePanel();
					}
				},{passive:true});
				Themify.body[0].appendChild(overLay);
				overLay.style['display']='';
			}
			this.element.addEventListener('click',function(e){
				e.preventDefault();
				if ( self.panelVisible ) {
					self.hidePanel();
				} else {
					self.showPanel();
					if(!(e.screenX && e.screenY)){
						const a = document.querySelector(self.settings.panel+' a');
						if(null!==a){
							a.focus();
						}
					}
				}
			});
			if ( '' !== self.settings.close ) {
				const close = document.querySelector(self.settings.close);
				if(close!==null){
					close.addEventListener('click',function(e){
						e.preventDefault();
						self.hidePanel();
					});
				}
			}
		},
		showPanel() {
			if(this.panelVisible===false){
				Themify.trigger('tf_fixed_header_remove_revelaing');
				const panel=this.settings.panel,
					self=this,
					thisPanel = document.querySelector(panel);
					thisPanel.style['display']='block';
				setTimeout(()=>{
					if(this.settings.beforeShow){
						this.settings.beforeShow.call(this);
					}
					if(this.panelVisible===false){
						if(thisPanel!==null){
							thisPanel.addEventListener('transitionend',()=>{
								if(self.settings.afterShow){
									self.settings.afterShow.call(self);
								}
								Themify.trigger('sidemenushow.themify', [panel, self.settings.side,self]);
							},{passive:true,once:true});
							thisPanel.classList.remove('sidemenu-off');
							thisPanel.classList.add('sidemenu-on');
						}
						Themify.body[0].classList.add(self.panelCleanName + '-visible','sidemenu-' + self.settings.side);
						if(overLay!==null){
							overLay.classList.add('body-overlay-on');
						}
						this.panelVisible = true;
					}
				},5);
			}
		},
		hidePanel( side ) {
			if(this.panelVisible===true){
				const thisPanel = document.querySelector(this.settings.panel);
				if(this.settings.beforeHide){
					this.settings.beforeHide.call(this);
				}
				if(thisPanel!==null){
					thisPanel.addEventListener('transitionend',function(){
						this.style['display']='';
					},{passive:true,once:true});
					thisPanel.classList.remove('sidemenu-on');
					thisPanel.classList.add('sidemenu-off');
				}
				Themify.body[0].classList.remove(this.panelCleanName + '-visible');
				if ( side !== this.settings.side ) {
					Themify.body[0].classList.remove('sidemenu-' + this.settings.side);
				}
				if(this.settings.afterHide){
					this.settings.afterHide.call(this);
				}
				Themify.trigger('sidemenuhide.themify', [this.settings.panel]);
				if(overLay!==null){
					overLay.classList.remove('body-overlay-on');
				}
				this.panelVisible = false;
			}
		}
	};
	Themify.on('tf_sidemenu_init',(items,options,callback)=>{
		if(items instanceof jQuery){
			items=items.get();
		}
		else if(items.length===undefined){
			items=[items];
		}
		for(let i=items.length-1;i>-1;--i){
			instance.push(new SideMenu( items[i], options ));
		}
		if (callback){
			callback();
		}
	})
	.on('tf_side_menu_hide_all',()=>{
		for(let i=instance.length-1;i>-1;--i){
			instance[i].hidePanel();
		}
	})
	.body[0].classList.add('sidemenu-active');
	if(typeof themify_vars!=='undefined'){
		Themify.on('tfsmartresize',(e)=>{
			if (e && e.w!==Themify.w && e.w>themify_vars.menu_point){
				Themify.trigger('tf_side_menu_hide_all');
			}
		});
	}

})(Themify);