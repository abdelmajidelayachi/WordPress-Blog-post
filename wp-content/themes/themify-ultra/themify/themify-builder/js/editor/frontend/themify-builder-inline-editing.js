
(function (Themify,$, window, document,api,Common) {
    'use strict';
	let activeEl,
		undoData,
		cid,
		width,
		height,
		timer,
		timer2,
		bodyCL,
		toolbar=null,
		toolbarItems=null,
		linkHolder=null,
		dialog=null,
		imageToolbar=null,
		selection=null,
		isImageEdit=false,
		isChanging=false,
		isClicked=false,
		before,
		swiper,
		beforeValue,
		isImageSelecting=false,
		selectionEndTimeout,
		isChanged=false,
		is_editable=false;
	const MOUSE=api.Utils.getMouseEvents(),
		CLICK=Themify.isTouch?MOUSE:{mousedown:'click'},
		 exec=function(command){
            api.hasChanged  = true;
            const value = arguments[1] !== undefined ? arguments[1] : null;
            document.execCommand(command,false,value);
			onChange();
        },
        state=function(command){
            const st = document.queryCommandState(command);
            return st===-1?false:st;  
        },
		menu={
			formatBlock:{
				result(el){
					const action = el.parentNode.classList.contains('tb_editor_selected')?'p':el.getAttribute('data-action');
					exec('formatBlock','<'+action+'>');
				},
                state(el){
					const actions=el.getElementsByClassName('tb_editor_options')[0].getElementsByClassName('tb_editor_action'),
						current=document.queryCommandValue('formatBlock');
					for(let i=actions.length-1;i>-1;--i){
						let cl=actions[i].parentNode.classList;
						if(current===actions[i].getAttribute('data-action')){
							if(!cl.contains('tb_editor_selected')){
								cl.add('tb_editor_selected');
								setSelectedBtnAndParent(actions[i]);
							}
						}
						else{
							cl.remove('tb_editor_selected');
						}
					}
                }
            },
			text_align:{
				result(el){
					if(el.parentNode.classList.contains('tb_editor_selected')){
						if(selection){
							if(selection.startContainer){
								selection.startContainer.parentNode.style['textAlign']='';
								const p=selection.startContainer.parentNode.closest('[style*=text-align]');
								if(p){
									p.style['textAlign']='';
								}
							}
							if(selection.commonAncestorContainer){
								if(selection.commonAncestorContainer.nodeType !== Node.TEXT_NODE){
									selection.commonAncestorContainer.style['textAlign']='';
								}
								const p=selection.startContainer.parentNode.closest('[style*=text-align]');
								if(p){
									p.style['textAlign']='';
								}
							}
							onChange();
						}
					}
					else{
						exec(el.getAttribute('data-action'));
					}
				},
                state(el){
					const actions=el.getElementsByClassName('tb_editor_options')[0].getElementsByClassName('tb_editor_action');
					let hasSelected=false;
					for(let i=actions.length-1;i>-1;--i){
						let cl=actions[i].parentNode.classList;
						if(actions[i].hasAttribute('data-action') && state(actions[i].getAttribute('data-action'))){
							if(!cl.contains('tb_editor_selected')){
								setSelectedBtnAndParent(actions[i]);
							}
							hasSelected=true;
						}
						else{
							cl.remove('tb_editor_selected');
						}
					}
					if(hasSelected===false){
						el.classList.remove('tb_editor_selected');
					}
                }
			},
			list:{
				result(el){
					exec(el.getAttribute('data-action'));
				},
                state(el){
					menu.text_align.state(el);
                }
			},
			image:{
				state(el){
					
				},
				result(el){
					const uploader=document.createElement('div'),
						input=document.createElement('hidden');
					isImageSelecting=true;
					let file_frame;
					input.addEventListener('change',function(e){
						e.stopImmediatePropagation();
						
						const attachment = file_frame.state().get('selection').first().toJSON(),
							id=attachment.id,
							isInline=activeEl.closest('[data-hasEditor]')!==null,
							classes=activeEl.classList;
						let title=attachment.title || '',
							alt=attachment.alt || title;
						for(let i=classes.length-1;i>-1;--i){
							if(classes[i].indexOf('wp-image-')===0){
								classes.remove(classes[i]);
								break;
							}
						}
						classes.add('wp-image-'+id);
						if(isImageEdit){
							before=activeEl.closest('.active_module').outerHTML;
							const loader=document.createElement('div'),
							isResizable=activeEl.hasAttribute('data-w') || activeEl.hasAttribute('data-h'),
							w=activeEl.hasAttribute('data-w')?activeEl.getAttribute('width'):false,
							h=activeEl.hasAttribute('data-h')?activeEl.getAttribute('height'):false,
							__callback=function(){
								isChanged=true;
								saveData(!isInline);
								const module=activeEl.closest('.active_module');
								if(module){
									if(activeEl.hasAttribute('data-update')){
										module.innerHTML=module.innerHTML;//remove cache data attributes
										activeEl=module.getElementsByClassName('tb_selected_img')[0];
									}
									api.Utils.runJs($(module),'module');
								}
								Themify.trigger('tb_image_resize',activeEl);
								updateCarousel();
								resizeImageEditor();
								Themify.requestIdleCallback(function () {
									setTimeout(function(){
									    requestAnimationFrame(resizeImageEditor);
									},25);
								},500);//after modules updates
								loader.remove();
							};
							loader.className='tf_loader';
							imageToolbar.appendChild(loader);
							imageToolbar.classList.add('tb_image_editor_loading');
							activeEl.removeAttribute('srcset');
							if(!isInline && isResizable){
								activeEl.setAttribute('data-orig',attachment.url);
								activeEl.setAttribute('data-ext',attachment.mime);
							}
							else{
								activeEl.removeAttribute('data-ext');
								activeEl.removeAttribute('data-orig');
								if(isInline){
									activeEl.alt=alt;
									activeEl.title=title;
								}
							}
							if(!isResizable || (isInline && !w && !h)){
								activeEl.width=attachment.width;
								activeEl.height=attachment.height;
							}
							if((!w && !h) || isInline){
								activeEl.addEventListener('load',__callback,{passive:true,once:true});
								
								activeEl.setAttribute('src',attachment.url);
							}
							else{
								api.Utils.resizeImage(activeEl,w,h).finally(__callback);
							}
						}
						else{
							restoreSelection();
							exec('insertImage',attachment.url);
						}
						input.remove();
						uploader.remove();
						isImageSelecting=false;
					},{passive:true,once:true});
					
					ThemifyConstructor.file.browse(uploader,input,ThemifyConstructor,'image');
					uploader.click();
					file_frame=ThemifyConstructor.file._frames['image'];
					const _close=function() {
						file_frame.off('close',_close);
                        isImageSelecting=false;
						setTimeout(function(){
							file_frame=null;
						},50);
                    };
					file_frame.on('close',_close);
				}
			},
			link:{
				state(el){
					if(selection){
						const link=selection.startContainer.parentNode.closest('a'),
						cl=toolbar.classList;
						if(link && link===selection.endContainer.parentNode.closest('a')){
							linkHolder.firstChild.textContent=linkHolder.nextElementSibling.href=link.getAttribute('href');
							cl.add('tb_editor_show_link');
							calculateSize();
							setCarret(true);
						}
						else if(toolbar.classList.contains('tb_editor_show_link')){
							linkHolder.firstChild.textContent=linkHolder.nextElementSibling.href='';
							cl.remove('tb_editor_show_link');
							calculateSize();
							setCarret(true);
						}
					}
				},
				result(el){
						const linkForm=toolbar.getElementsByClassName('tb_editor_link_options')[0].cloneNode(true),
						linkInput=linkForm.getElementsByClassName('tb_editor_link_input')[0],
						linkType=linkForm.querySelector('#tb_editor_link_type'),
						link=selection.startContainer.parentNode.closest('a'),
						constuct=ThemifyConstructor,
						units={
							px: {
								min:1,
								max:50000
							},
							'%':{
								min:1,
								max:500
							}
						};
						linkForm.querySelector('#tb_editor_lb_w_holder').replaceWith(constuct.range.render({
							id:'tb_editor_lb_w',
							control:false,
							units:units
						},constuct));
						linkForm.querySelector('#tb_editor_lb_h_holder').replaceWith(constuct.range.render({
							id:'tb_editor_lb_h',
							control:false,
							units:units
						},constuct));
						
						const lbw=linkForm.querySelector('#tb_editor_lb_w'),
						lbh=linkForm.querySelector('#tb_editor_lb_h'),
						lbwUnit=linkForm.querySelector('#tb_editor_lb_w_unit'),
						lbhUnit=linkForm.querySelector('#tb_editor_lb_h_unit');
						
						linkInput.value=lbw.value=lbh.value='';
						linkType.selectedIndex=lbwUnit.selectedIndex=lbhUnit.selectedIndex=0;
						
						if(link && link===selection.endContainer.parentNode.closest('a')){
								let type=link.getAttribute('target');
								linkInput.value=link.getAttribute('href');
								if(type!=='_blank' && link.hasAttribute('data-zoom-config')){
									type='lightbox';
								}
								if(type){
									if(linkType.value!==type){
										linkType.value=type;
									}
									if(type==='lightbox'){
										const config=link.getAttribute('data-zoom-config').split('|'),
											currentUW=config[0].indexOf('%')!==-1?'%':'px',
											currentUH=(config[1] && config[1].indexOf('%')!==-1)?'%':'px';
											if(parseInt(config[0])!==parseInt(lbw.value)){
												lbw.value=parseInt(config[0]);
											}
											if(parseInt(config[1])!==parseInt(lbh.value)){
												lbh.value=parseInt(config[1]);
											}
											if(lbwUnit.value!==currentUW){
												lbwUnit.value=currentUW;
											}
											if(lbhUnit.value!==currentUH){
												lbhUnit.value=currentUH;
											}
											
											linkForm.querySelector('.tb_editor_lightbox_actions').classList.remove('tf_hide');
									}
								}
						}
						linkForm.addEventListener('focusout',submitLink,{passive:true});
						linkForm.addEventListener('change',submitLink,{passive:true});
						linkForm.querySelector('#tb_editor_link_type').addEventListener('change',function(e){
							const lb=this.closest('form').querySelector('.tb_editor_lightbox_actions');
							lb.classList.toggle('tf_hide',this.value!=='lightbox');
							restoreSelection();
							calculateSize();
							setCarret(true);
					
						},{passive:true});
						
						dialog.appendChild(createCloseBtn());
					
						dialog.appendChild(linkForm);
						toolbar.classList.add('tf_hide','tb_editor_dialog_open','tb_editor_dialog_link','tf_opacity');
						linkForm.classList.remove('tf_hide');
							
						restoreSelection();
						calculateSize();
						setCarret(true);
						setTimeout(function(){
							linkInput.focus();
						},100);
				}
			},
			font:{
				state(el){
					const value=document.queryCommandValue('fontName');
				},
				result(el){
					const tooltip = document.createElement('span');
					let fonts=document.createDocumentFragment(),
					value=document.queryCommandValue('fontName');
				
					tooltip.className='themify_tooltip';
					tooltip.textContent='themify_tooltip';
					
					fonts.appendChild(ThemifyConstructor.font_select.render({id:'',control:false},ThemifyConstructor));
					
					fonts=fonts.firstChild;
					toolbar.classList.add('tf_hide','tb_editor_dialog_open','tb_editor_dialog_font','tf_opacity');
					createDialog(fonts);
					const select=fonts.getElementsByClassName('font-family-select')[0];
					Themify.triggerEvent(select.closest('.tb_font_preview_wrapper'),'tf_init');
					select.addEventListener('change',function(e){
						e.stopPropagation();
						isClicked=true;
						restoreSelection();
						exec('styleWithCSS',true);
						exec('fontName',(this.value || 'inherit'));
						setTimeout(function(){
							saveSelection();
						    isClicked=false;
						},10);
					},{passive:true});
					
					restoreSelection();
					calculateSize();
					setCarret(true);
					if(value){
						value = value.replace(/["']/g, '');	
						if(select.querySelector('[value="'+CSS.escape(value)+'"]')){
							select.value=value;
							fonts.getElementsByClassName('themify-combo-input')[0].value = value;
							const dropDown=fonts.getElementsByClassName('themify-combo-dropdown')[0],
								selected=dropDown.querySelector('[data-value="'+CSS.escape(value)+'"]');
							if(selected){
								 selected.classList.add('themify-combo-selected');
								 dropDown.style['scrollBehavior']='auto';
								 dropDown.scrollTop =selected.offsetTop-selected.offsetHeight;
								 dropDown.style['scrollBehavior']='';
							}
						}
					}
					
				}
			},
			unlink:{
				result(el){
					restoreSelection();
					const node=selection?selection.startContainer.parentNode.closest('a'):null;
					if(node && node===selection.endContainer.parentNode.closest('a')){
						const range = document.createRange(),
							anchor= window.getSelection();
						range.selectNodeContents(node);
						anchor.removeAllRanges();
						anchor.addRange(range);
					}
					exec('unlink');
					saveSelection();
				}
			},
			unlinkBack:{
				result(el){
					menu.unlink.result(el);
					restoreToolbar();
				}
			},
			color:{
				result(el){
					const tooltip = document.createElement('span'),
						colorChange=function(v){
							isClicked=true;
							restoreSelection();
							exec('styleWithCSS',true);
							exec('foreColor',v );
							setTimeout(function(){
								saveSelection();
								isClicked=false;
							},10);
						};
					let colorInput=document.createDocumentFragment(),
					value=document.queryCommandValue('foreColor');
					tooltip.className='themify_tooltip';
					tooltip.textContent='themify_tooltip';
					colorInput.appendChild(ThemifyConstructor.color.render({id:'',control:false},ThemifyConstructor));
					
					colorInput=colorInput.firstChild;
					toolbar.classList.add('tf_hide','tb_editor_dialog_open','tb_editor_dialog_color','tf_opacity');
					createDialog(colorInput);
					
					const input=colorInput.getElementsByClassName('tfminicolors-input')[0],
						swatch=colorInput.getElementsByClassName('tfminicolors-swatch')[0],
						opacityInput=colorInput.getElementsByClassName('color_opacity')[0];
					
					if(value){
						let opacity=1;
						if(value.indexOf('rgb')>-1){
						  opacity = value.indexOf('rgba')>-1?parseFloat(value.split(',').slice(-1).pop()):1;
						  const rgb = value.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
							value=(rgb && rgb.length === 4) ? ("#" +
						  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
						  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
						  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2)) : '';
						}
						input.value=value;
						opacityInput.value =opacity;
						 
					}
					swatch.click();
					input.addEventListener('themify_builder_color_picker_change',function(e){
						e.stopPropagation();
						if(document.activeElement.id==='tb_editor_dialog_content' || !dialog.contains(document.activeElement)){
							colorChange(e.detail.val);
						}
					},{passive:true});
					input.addEventListener('change',function(e){
						e.stopPropagation();
						colorChange($(this).tfminicolors('rgbaString'));
					},{passive:true});
					
					opacityInput.addEventListener('change',function(e){
						isChanged=true;
						e.stopPropagation();
						Themify.triggerEvent(input,'change');
					},{passive:true});
					
					calculateSize();
					setCarret(true);
				}
			}
		},
		saveData=function(changeSrc){
			if(activeEl && isChanged){
				const  m = api.Models.Registry.lookup(cid),
					isOpen=!!(api.activeModel && cid===api.activeModel.cid);
				if(!m){
					return;
				}	
				let v =isOpen?{}:m.get('mod_settings'),
					before_settings=$.extend(true,{},v),
					wName,
					hName,
					index=false,
					editImage=!changeSrc && isImageEdit,
					editElement=activeEl,
					val;
				
				if(!v){
					v={};
				}
				if(editImage){
					wName= editElement.getAttribute('data-w');
					hName=editElement.getAttribute('data-h');
					if(!wName && !hName){
						editElement=editElement.closest('[data-hasEditor]');
						if(!editElement){
							return;
						}
						editImage=false;
						is_editable=true;
					}
					if(editImage){
						let update=false;
						if(wName){
							v[wName] = editElement.getAttribute('width'); 
							update=parseInt(before_settings[wName])!==parseInt(v[wName]);
						}
						if(hName){
							v[hName] = editElement.getAttribute('height'); 
							if(update!==true){
								update=parseInt(before_settings[hName])!==parseInt(v[hName]);
							}
						}
						if(!update){
							return;
						}
					}
				}
				
				let repeat = editElement.getAttribute('data-repeat');
				if(repeat && !isNaN(repeat)){//should be string,otherwise it it's different data-repeat
					repeat=false;
				}
				const inputName = editElement.getAttribute('data-name');
				if(repeat){
					if(v[repeat]===undefined){
						v[repeat]={};
					}
					index=editElement.hasAttribute('data-index')?parseInt(editElement.getAttribute('data-index')):false;
					if(index===false){
						let el=editElement.closest('.tf_swiper-slide');
						if(!el){
							el=editElement.closest('li');
							if(!el){
								el=editElement.closest('.module-'+m.get('mod_name')+'-item');
							}
						}
						if(el){
							const childs = el.parentNode.children;
							for(let i=childs.length-1;i>-1;--i){
								if(childs[i]===el){
									index=i;
									break;
								}
							}
						}
					}
					if(index!==false){
						if(v[repeat][index]===undefined){
							v[repeat][index]={};
						}
					}
					else{
						return;
					}
				}
				if(!editImage) {
					
					if(!inputName){
						return;
					}
					let prevVal;
					val = editElement.tagName==='IMG'?(editElement.hasAttribute('data-orig')?editElement.getAttribute('data-orig'):editElement.getAttribute('src')):(is_editable?editElement.innerHTML:editElement.innerText);
					if(index!==false){
						prevVal=(before_settings[repeat]!==undefined && before_settings[repeat][index]!==undefined && before_settings[repeat][index][inputName]!==undefined)?before_settings[repeat][index][inputName]:null;
						v[repeat][index][inputName] = val; 
					}
					else{
					   prevVal=before_settings[inputName];
					   v[inputName] =  val; 
					}
					if(prevVal===val){
						return;
					}
				}
				if(before_settings===v){
					return;
				}
								
				if(isOpen){
					const lb=Common.Lightbox.$lightbox[0];
					if(editImage){
						let save=false;
						const widthInput=wName?lb.querySelector('.tb_lb_option#'+wName):null,
						heightInput=hName?lb.querySelector('.tb_lb_option#'+hName):null;
						if(widthInput && widthInput.value!=v[wName]){
							save=true;
							widthInput.value=ThemifyConstructor.settings[ wName ]=v[wName];
						}
						if(heightInput&& heightInput.value!=v[hName]){
							save=true;
							heightInput.value=ThemifyConstructor.settings[ hName ]=v[hName];
						}
						if(save===false){
							return;
						}
					}
					else{
						if(repeat){
							if(ThemifyConstructor.settings[ repeat ]===undefined){
								ThemifyConstructor.settings[ repeat ]={};
							}
							if(ThemifyConstructor.settings[ repeat ][index]===undefined){
								ThemifyConstructor.settings[ repeat ][index]={};
							}
							ThemifyConstructor.settings[ repeat ][index][inputName]=val;
						}
						else{
							ThemifyConstructor.settings[ inputName ]=val;
						}
						const args={el:'',val:val,data:v,cid:cid,activeEl:activeEl};
						Themify.triggerEvent(document,'tb_inline_item',args);
						val=args.val;
						v=args.data;
						let item=args.el;
						if(!item){
							item=repeat?lb.querySelector('#'+repeat).querySelectorAll('[data-input-id="'+inputName+'"]'):lb.querySelector('.tb_lb_option#'+inputName);
						}
						
						if(item){
							if(repeat){
								item=item[index];
								if(!item){
									return;
								}
							}
							if(item.value===val){
								return;
							}
							item.value=val;
							if(isImageEdit){
								let bg = item.closest('.tb_uploader_wrapper');
								if(bg){
									bg=bg.querySelector('.tb_media_uploader img');
									if(bg){
										bg.src=val;
									}
								}
							}
							if(is_editable && typeof tinyMCE!=='undefined' && tinyMCE){
								const el=tinyMCE.get(item.id);
								if(el){
									el.setContent(val);
								}
							}
						}
					}
					api.hasChanged=true;
				}
				else{
					const args={val:!editImage?val:v[inputName],data:v,cid:cid,activeEl:activeEl};
					Themify.triggerEvent(document,'tb_inline_save',args);
					val=args.val;
					v=args.data;
					if(index!==false){
						v[repeat][index][inputName] = val; 
					}
					else{
					   v[inputName] =  val; 
					}
					api.hasChanged=true;
					if(before){
						api.undoManager.push(cid, before, Common.clone(editElement.closest('.active_module')), 'save', {bsettings: before_settings, asettings: $.extend(true,{},v)});
						before = null;
					}
					m.set(v, {silent: true});
				}
				
				updateCarousel();
			}
		},
		preventDefault=function(e){
			e.preventDefault();
		},
		dblclick=function(e){
			e.stopImmediatePropagation();
			if(isImageEdit && (activeEl.hasAttribute('data-name') || activeEl.closest('[data-hasEditor]'))&& (e.target===imageToolbar || imageToolbar.contains(e.target))){
				menu.image.result();
			}
			
		},
		init=function(){
			api.Instances.Builder[api.builderIndex].el.addEventListener(MOUSE['mousedown'], function(e){
				if(api.ActionBar.inlineEditor===true && (e.which===1 || e.touches)){
					isImageEdit=e.target.tagName==='IMG';
					const item=isImageEdit?e.target:e.target.closest('[contenteditable]');
					if(item && !item.closest('.tb_disable_sorting') && (isImageEdit || item.contentEditable===false || item.contentEditable==='false')){
						selectionEnd();
						window.getSelection().removeAllRanges();
						
						const activeModule=item.closest('.active_module');
						if(activeModule){
							const model = api.Models.Registry.lookup(activeModule.dataset.cid);
							if (model && model.attributes['mod_settings']['__dc__'] !== undefined && model.attributes['mod_settings']['__dc__'][item.dataset.name] !== undefined) {
								return false;
							}
							activeModule.classList.add('tb_editor_clicked');
						}
						if(!isImageEdit){
							item.contentEditable=true;
						}
						let draggables=[],
							_item=item.closest('[draggable]');
						while (_item!==null) {
							draggables.push(_item);
							_item= _item.parentNode.closest('[draggable]');
						}
						if(draggables.length>0){
							const _up=function(e){
								document.removeEventListener(MOUSE['mousemove'], _drag,{passive:true,once:true});
								for(let i=draggables.length-1;i>-1;--i){
									draggables[i].setAttribute('draggable',false);
									draggables[i].removeEventListener('drag', _drag,{passive:true,once:true});
								}
							},
							_drag= function(e){
								item.setAttribute('contenteditable',false);
								document.removeEventListener(MOUSE['mousemove'], _drag,{passive:true,once:true});
								item.removeEventListener(MOUSE['mouseup'], _up,{passive:true,once:true});
								if(activeModule){
									activeModule.classList.remove('tb_editor_clicked');
								}
								for(let i=draggables.length-1;i>-1;--i){
									draggables[i].removeEventListener('drag', _drag,{passive:true,once:true});
								}
								disableImageEditor();
								if(e.type==='drag'){
									disable();
								}
							};
							item.addEventListener(MOUSE['mouseup'], _up,{passive:true,once:true});
							document.addEventListener(MOUSE['mousemove'], _drag,{passive:true,once:true});
							for(let i=draggables.length-1;i>-1;--i){
								draggables[i].addEventListener('drag', _drag,{passive:true,once:true});
							}
						}
					}
				}
			},{passive:true});
			api.Instances.Builder[api.builderIndex].el.addEventListener(CLICK['mousedown'], function(e){
					if(api.ActionBar.inlineEditor!==true){
						return;
					}
					let target=e.target;
					if(target.hasAttribute('data-target')){
						let targetItem=target.closest('.active_module');
						if(targetItem){
							targetItem=targetItem.querySelector(target.getAttribute('data-target'));
							if(targetItem){
								target=targetItem;
							}
						}
						
					}
					isImageEdit=target.tagName==='IMG';
					const item=isImageEdit?target:target.closest('[contentEditable]');
				
					if(!item){
						return;
					}
					if(item.closest('label') || item.closest('a') || item.closest('button')){
						e.preventDefault();
					}
					if(activeEl===item){
						return;
					}
					
					if(activeEl){
						disable();
					}
					if((e.which!==1 && !e.touches) || (isImageEdit && !item.getAttribute('data-w')&& !item.getAttribute('data-h') && !item.getAttribute('data-name')&& !item.closest('[data-hasEditor]'))){
						return;
					}
					const activeModule=item.closest('.active_module');
					if(activeModule){
						cid=activeModule.getAttribute('data-cid');
						const model = api.Models.Registry.lookup(cid);
						if (model && model.attributes['mod_settings']['__dc__'] !== undefined && model.attributes['mod_settings']['__dc__'][item.dataset.name] !== undefined) {
							return;
						}
					}
					isChanged=false;
					bodyCL=Themify.body[0].classList;
					selectionEnd();
					bodyCL.add('tb_editor_active');
					window.top.document.body.classList.add('tb_editor_active');
					is_editable = !isImageEdit && item.hasAttribute('data-hasEditor');
					activeEl=item;
					
					if(activeModule){
						before=activeModule.outerHTML;
						activeModule.classList.add('tb_editor_on');
						activeModule.classList.remove('tb_editor_clicked');
					}
					let wow=activeEl,
						form=item.closest('form'),
						_item=item.closest('[draggable]');
					
					if(form){
						form.addEventListener('submit',preventDefault);
						const formInputs=form.querySelectorAll('[required]');
						for(let i=formInputs.length-1;i>-1;--i){
							formInputs[i].removeAttribute('required');
							formInputs[i].setAttribute('data-required',1);
						}
					}
					while (wow && wow!==activeModule) {
						if(wow.style['animation-name']){
							wow.setAttribute('data-tmp-animation',wow.style['animation-name']);
							wow.style['animation-name']='none';
						}
						wow = wow.parentNode;
					}
					while (_item!==null) {
						_item.setAttribute('draggable',false);
						_item= _item.parentNode.closest('[draggable]');
					}
					wow=_item=form=null;
					swiper = activeEl.closest('.tf_swiper-container');
					swiper=(swiper && swiper.swiper)?swiper.swiper:null;
					if(swiper && swiper.params && swiper.params.autoplay && swiper.params.autoplay.enabled){
						swiper.el.dataset['stopped']=true;
						swiper.autoplay.stop();
						if( swiper.params.thumbs && swiper.params.thumbs.swiper && swiper.params.thumbs.swiper.autoplay  && swiper.params.thumbs.swiper.autoplay.enabled){
							swiper.params.thumbs.swiper.el.dataset['stopped']=true;
							swiper.params.thumbs.swiper.autoplay.stop()
						}
					}
					if(!isImageEdit){
						beforeValue=is_editable?activeEl.innerHTML:activeEl.textContent;
						activeEl.contentEditable=true;
						activeEl.focus();
						activeEl.addEventListener('blur',disable,{passive:true});
						activeEl.addEventListener('input',onChange,{passive:true});
						activeEl.addEventListener('change',onChange,{passive:true});
						if(!Themify.isTouch){
							setTimeout(function(){
								if(activeModule){
									activeModule.addEventListener('dblclick',dblclick,{passive:true});
								}
							},800);
						}
						undoData =  api.undoManager.stack;
						api.undoManager.reset();
						
					}
					else{
						bodyCL.add('tb_editor_image_active');
						window.top.document.body.classList.add('tb_editor_image_active');
						Themify.on('tfsmartresize',resizeImageEditor)
						.on('tbresizeImageEditor',resizeImageEditor);
					}
					Themify.on('tbDisableInline',disable);
					document.addEventListener(MOUSE['mousedown'],disable,{passive:true});
					window.top.document.addEventListener(MOUSE['mousedown'],disable,{passive:true});
					
					setTimeout(function(){
						Common.Lightbox.$lightbox.one('themify_opened_lightbox',lightbox);
					},600);
					
					if(is_editable){
						document.addEventListener('selectionchange',selectionStart,{passive:true});
						setToolbar();
						calculateSize();
						toolbar.addEventListener(CLICK['mousedown'],toolbarActions);
						linkHolder=toolbar.querySelector('#tb_editor_link_value');
						dialog=toolbar.querySelector('#tb_editor_dialog');
					}
					else if(isImageEdit){
						if(item.closest('.masonry')){
                             Themify.requestIdleCallback(function () {
                             	setTimeout(function(){
									requestAnimationFrame(function(){
										imageEditing(item);
									});
                            	},25);
                            },500);
						}
						else{
						    imageEditing(item);
						}
					}
			});
		},
		calculateSize=function(){
			const className=toolbar.className,
			cl=toolbar.classList;
			cl.add('tf_hidden');
			cl.remove('tf_hide');
			const rect=toolbar.getBoundingClientRect();
				width=rect.width+40;
				height=rect.height+30;
			toolbar.className = className;
		},
		saveSelection=function(){
			const sel=window.getSelection();
			selection=sel.isCollapsed===false?sel.getRangeAt(0).cloneRange():null;
		},
		restoreSelection=function () {
			if (isChanging===false && selection) {
				isChanging=true;
				activeEl.focus();
				const sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(selection);
				isChanging=false;
			}
		},
		setToolbar=function(){
			if(toolbar===null){
				const template = document.getElementById('tmpl-builder_inline_editor');
				if(template){
					document.body.appendChild(template.content);
					template.remove();
				}
				toolbar=document.getElementById('tb_editor');
			}
			return toolbar;
		},
		toolbarActions=function(e){
			const item=e.target.closest('.tb_editor_action');
			e.stopPropagation();
			if(!item || item.type==='submit'){
				return;
			}
			e.preventDefault();
			isClicked=true;
			let type=item.getAttribute('data-type');
			if(!type){
				type=item.closest('[data-type]').getAttribute('data-type');
			}
			if(type!=='expand'){
				if(menu[type]!==undefined && menu[type].result!==undefined){
					menu[type].result(item);
				}
				else{
					restoreSelection();
					exec(type);
				}
				setSelectedButtons();
			}
			else if(!item.classList.contains('tb_editor_disable')){
				 const model = api.Models.Registry.lookup(cid);
				 if(model){
					disable();
					window.getSelection().removeAllRanges();
					model.trigger('edit', null); 
				 }
			}
			isClicked=false;
		},
		onChange=function(e){
			if(e){
				e.stopPropagation();
			}
			if(activeEl){
				isChanged=true;
				const after=is_editable?activeEl.innerHTML:activeEl.textContent;
				if(beforeValue!==after || isImageEdit){
					api.hasChanged=true;
					if(api.activeModel && api.activeModel.cid===cid){
						saveData();
					}
					if(!e || e.type==='input'){
						api.undoManager.push(cid,beforeValue,after,'inline',activeEl);
					}
					beforeValue=after;
				}
			}
		},
		submitLink=function(e){
			e.stopPropagation();
			if((e.type==='focusout' && !e.target.classList.contains('tb_range')) || (e.type==='change' && e.target.classList.contains('tb_range'))){
				return
			}
			const linkInput=this.getElementsByClassName('tb_editor_link_input')[0],
				link=linkInput.value.trim();
			if(link){
				isChanged=true;
				restoreSelection();
				let anchor= window.getSelection();
				const node=selection?selection.startContainer.parentNode.closest('a'):null,
				_this=this,
					type=_this.querySelector('#tb_editor_link_type').value;
				if(node && node===selection.endContainer.parentNode.closest('a')){
					const range = document.createRange();
					range.selectNodeContents(node);
					anchor.removeAllRanges();
					anchor.addRange(range);
				}
				exec('createLink',link);
				saveSelection();
				if(anchor.anchorNode && anchor.anchorNode.parentNode){
					const targetA=anchor.anchorNode.parentNode.closest('a');
					if(targetA){
						targetA.removeAttribute('target');
						targetA.removeAttribute('data-zoom-config');
						targetA.classList.remove('themify_lightbox');
						if(type==='_blank'){
							targetA.setAttribute('target',type);
						}
						else if(type==='lightbox'){
							targetA.classList.add('themify_lightbox');
							const w=_this.querySelector('#tb_editor_lb_w').value,
								h=_this.querySelector('#tb_editor_lb_h').value,
								uW=_this.querySelector('#tb_editor_lb_w_unit').value || 'px',
								uH=_this.querySelector('#tb_editor_lb_h_unit').value || 'px';
							if(w>0 || h>0){
								let config='|';
								if(w){
									config=w+uW+config;
								}
								if(h){
									config+=h+uH;
								}
								targetA.setAttribute('data-zoom-config',config);
							}
						}
					}
				}
				onChange();
			}
		},
		setSelectedBtnAndParent=function(item){
			const li=item.parentNode,
				parent=li.parentNode.closest('li');
				li.classList.add('tb_editor_selected');
			
			if(parent){
				parent.classList.add('tb_editor_selected');
				const button =parent.getElementsByClassName('tb_editor_action')[0];
				if(button!==undefined){
					button.parentNode.replaceChild(item.cloneNode(true),button);
				}
			}
		},
		setSelectedButtons=function(){
			
			if(toolbarItems===null){
				toolbarItems = toolbar.querySelectorAll('[data-type]');
			}
			for(let i=toolbarItems.length-1;i>-1;--i){
				let item=toolbarItems[i],
					type=item.getAttribute('data-type'),
					li=item.tagName==='LI'?item:item.parentNode;
				if(type==='expand'){
					li.classList.toggle('tb_editor_disable',(api.activeModel && cid===api.activeModel.cid));
				}
				else if(type){
					if(menu[type]!==undefined && menu[type].state!==undefined){
						menu[type].state(li);
					}
					else{
						li.classList.toggle('tb_editor_selected',state(type));
					}
				}
			}
		},
		setCarret=function(onlycarret){
				if(toolbar===null){
					return;
				}
				const sel=window.getSelection(),
					cl=toolbar.classList;
				 if (sel.isCollapsed===false) {
					saveSelection();
					if(cl.contains('tf_hide')){
						calculateSize();
						cl.remove('tf_hide');
						setTimeout(function(){
							cl.remove('tf_opacity');
						},20);
					}
					let range = selection.getBoundingClientRect(),
					left = range.left+(range.width-width)/2,
					top = range.top-height-10;
					if((left+width)>=Themify.w){
						left-= width+Math.ceil(left)+window.pageXOffset-Themify.w-1;	
					}
					cl.toggle('tb_editor_top_viewport',top<=0);
					if(top<=0){
						top = range.bottom+10;
					}
					if(left<=0){
						left=15;
					}
					top+=window.pageYOffset;
					toolbar.style['transform']='translate('+left+'px,'+top+'px)';
					if(onlycarret===undefined){
						setSelectedButtons();
					}
				
					if(bodyCL){
						if(!bodyCL.contains('tb_editor_start_select')){
							window.top.document.body.classList.add('tb_editor_start_select');
							bodyCL.add('tb_editor_start_select');
						}
						if (selectionEndTimeout) {
							clearTimeout(selectionEndTimeout);
						}
						selectionEndTimeout = setTimeout(selectionEnd, 500);
					}
				}
				else{
					selection=null;
					cl.add('tf_hide','tf_opacity');
					cl.remove('tb_editor_top_viewport');
					restoreToolbar();
				}	
						
        },
		selectionStart=function(){
			if(activeEl!==null && isChanging===false && isClicked===false && document.activeElement===activeEl){
				if(timer){
					cancelAnimationFrame(timer);
				}
				if(timer2){
					clearTimeout(timer2);
				}
				timer=requestAnimationFrame(function(){
					timer2=setTimeout(function(){
						if(activeEl!==null && isChanging===false && isClicked===false && document.activeElement===activeEl){
							setCarret();
						}
					},20);
				});	
			}
		},
		selectionEnd=function(e){
			if(bodyCL && bodyCL.contains('tb_editor_start_select')){
				window.top.document.body.classList.remove('tb_editor_start_select');
				bodyCL.remove('tb_editor_start_select');
			}
			if (selectionEndTimeout) {
				clearTimeout(selectionEndTimeout);
			}
			selectionEndTimeout=null;
		},
		createCloseBtn=function(){
			const btn=document.createElement('button');
			btn.type='button';
			btn.className='tf_close';
			btn.title='Back';
			btn.addEventListener(CLICK['mousedown'],function(e){
				e.stopImmediatePropagation();
				e.preventDefault();
				restoreToolbar();
				toolbar.classList.add('tf_hide','tf_opacity');
				restoreSelection();
				calculateSize();
				setCarret();
				
			},{once:true});
			return btn;
		},
		createDialog=function(content){
			const dialogHeader=document.createElement('div'),
				dialogContent=document.createElement('div');
				
				dialogHeader.id='tb_editor_dialog_header';
				dialogContent.id='tb_editor_dialog_content';
				dialogContent.tabIndex='-1';
				dialogHeader.appendChild(createCloseBtn());
				dialogContent.appendChild(content);
								
				dialog.appendChild(dialogHeader);
				dialog.appendChild(dialogContent);
		},
		restoreToolbar=function(){
			if(toolbar){
				toolbar.style['display']='none';
				if(dialog  && dialog.firstChild){
					while (dialog.firstChild) {
						dialog.removeChild(dialog.lastChild);
					}
				}
				toolbar.classList.remove('tb_editor_dialog_open','tb_editor_dialog_color','tb_editor_dialog_font','tb_editor_dialog_link','tb_editor_show_link');
				toolbar.style['display']='';
				calculateSize();
			}
		},
		lightbox=function(e){
			if(activeEl){
				disable();
			}
		},
		imageEditing=function(item){
			disableImageEditor();
			imageToolbar=document.createElement('div');
			const rect=item.getBoundingClientRect(),
				src=activeEl.dataset['orig']?activeEl.dataset['orig'].trim():activeEl.src.trim(),
				help=src.indexOf(themifyBuilder.upload_url)!==0?themifyBuilder.i18n.image_help:(activeEl.closest('[data-hasEditor]')!==null?themifyBuilder.i18n.image_help2:false),
				handlers=['w','s','e','n'];
				imageToolbar.id='tb_editor_image';
				imageToolbar.style['top']=rect.top+window.scrollY+'px';
				imageToolbar.style['left']=rect.left+window.scrollX+'px';
				imageToolbar.style['width']=rect.width+'px';
				imageToolbar.style['height']=rect.height+'px';
				for(let i=handlers.length-1;i>-1;--i){
					let handler=document.createElement('div'),
						border=document.createElement('div'),
						tooltip=document.createElement('div');
					handler.className='tb_editor_image_handler tb_editor_'+handlers[i];
					border.className='tb_editor_image_border tb_editor_border_'+handlers[i];
					tooltip.className='tb_image_editor_tooltip tb_image_editor_tooltip_'+handlers[i];
					imageToolbar.appendChild(border);
					imageToolbar.appendChild(tooltip);
					imageToolbar.appendChild(handler);
				}
				if(item.hasAttribute('data-w') || item.hasAttribute('data-h')){
					if(help!==false){
						imageToolbar.appendChild(ThemifyConstructor.help(help));
					}
				}
				else{
					imageToolbar.className='tb_image_editor_disable';
				}
				
			imageToolbar.addEventListener(MOUSE['mousedown'],imageResizing,{passive:true});
			if(!Themify.isTouch){
				imageToolbar.addEventListener('dblclick',dblclick,{passive:true});
			}
			activeEl.classList.add('tb_selected_img');
			Themify.body[0].appendChild(imageToolbar);
		},
		imageResizing=function(e){
			if(e.which!==1 && !e.touches){
				return;
			}
			const target=e.target;
			e.stopPropagation();
			if((activeEl.hasAttribute('data-w') || activeEl.hasAttribute('data-h')) && (target.classList.contains('tb_editor_image_handler') || target.classList.contains('tb_editor_image_border'))){
				this.style['willChange']='width,height,left,top';
				activeEl.parentNode.style['willChange']='contents';
				activeEl.style['willChange']='width,height';
				let frame,
					timeout,
					clientX,
					clientY,
					prevW,
					prevH,
					k,
					imageDecode=new Image(),
					parentMaxWidthEl=activeEl.getAttribute('data-maxw'),
					isMoved=false;
				if(parentMaxWidthEl){
					parentMaxWidthEl=activeEl.closest(parentMaxWidthEl);
				}
				if(!parentMaxWidthEl){
					parentMaxWidthEl=activeEl.closest('[data-hasEditor]');
					if(!parentMaxWidthEl){
						parentMaxWidthEl=activeEl.parentNode;
					}
				}
				const axis = target.classList[1].replace('tb_editor_border_','').replace('tb_editor_',''),
				keepRatio=target.classList.contains('tb_editor_image_handler'),
				closestBlockElement=function(el){
					const display=getComputedStyle(el).getPropertyValue('display');
					if(display==='inline'){
						return closestBlockElement(el.parentNode);
					}
					return el;
				},
				el=this,
				_MINWIDTH_=40,
				_MINHEIGHT_=40,
				_MAXWIDTH_=Number.MAX_VALUE,//closestBlockElement(parentMaxWidthEl).getBoundingClientRect().width,
				rect=activeEl.getBoundingClientRect(),
				
				startW = parseInt(rect.width),
				startH = parseInt(rect.height),
				aspectRatio=parseFloat(startW/startH),
				resizeX = e.touches?e.touches[0].clientX:e.clientX,
				resizeY = e.touches?e.touches[0].clientY:e.clientY,
				tooltips=el.getElementsByClassName('tb_image_editor_tooltip'),
				src=activeEl.dataset['orig']?activeEl.dataset['orig'].trim():activeEl.src.trim(),
				isLocal=src.indexOf(themifyBuilder.upload_url)===0 && !activeEl.closest('[data-hasEditor]'),
				
				loader=isLocal===true?document.createElement('div'):null,
				move=function(e){
					e.stopPropagation();
					clientX=e.touches?e.touches[0].clientX:e.clientX;
					clientY=e.touches?e.touches[0].clientY:e.clientY;
					if(isMoved===false){
						isMoved=true;
						activeEl.classList.add('tb_resized_img');
					}
					else{
						if(frame){
							cancelAnimationFrame(frame);
						}
					}
					frame=requestAnimationFrame(function(){
						
							if(activeEl===null){
								disable();
								return;
							}
							let w,
								h;
							if(keepRatio===true){
								w = axis === 'n' || axis === 's' ? (resizeX + startW - clientX) : (startW + clientX - resizeX);
								h=parseInt(w/aspectRatio);
							}
							else{
								if(axis==='s' || axis==='n'){
									h= axis==='s'?(startH + clientY - resizeY): (resizeY + startH - clientY);
									w=startW;
								}
								else{
									w =axis==='w'?(startW+clientX - resizeX): (resizeX + startW - clientX);
									h=startH;
								}
							}
							if(w<_MINWIDTH_){
								w=_MINWIDTH_;
							}
							else if(w>_MAXWIDTH_){
								w=_MAXWIDTH_;
							}
							if(h!==undefined && h<_MINHEIGHT_){
								h=_MINHEIGHT_;
							}
							if(prevW!==w || prevH!==h){
								prevW=w;
								prevH=h;
								api.Utils.resizeImage(activeEl,w,h,imageDecode).then(function(params){
									if(params[0]===null || activeEl===null){
										disable();
										return;
									}
									const parentNode=isLocal===false?params[0].parentNode:null;
									if(parentNode!==null && parentNode.tagName==='FIGURE'){
										if(parentNode.style['width']){
											parentNode.style['width']=params[1]+'px';
										}
										if(parentNode.style['height']){
											parentNode.style['height']=params[2]+'px';
										}
									}
									const box=params[0].getBoundingClientRect();
									el.style.left=(box.left+window.scrollX)+'px';
									el.style.top=(box.top+window.scrollY)+'px';
									el.style.width = box.width+'px';
									el.style.height=box.height+'px';
									tooltips[0].textContent=tooltips[3].textContent=parseInt(params[1])+'px';
									tooltips[1].textContent=tooltips[2].textContent=parseInt(params[2])+'px';
									updateCarousel();
								});
							}
						});
				},
				_callback=function(){
					document.addEventListener(MOUSE['mousemove'],move,{passive:true});
					el.classList.remove('tb_image_editor_loading');
					if(loader){
						loader.remove();
					}
				},
				disable=function(e){
					if(e){
						
						e.stopPropagation();
					}
					if(frame){
						cancelAnimationFrame(frame);
					}
					if(timeout){
						clearTimeout(timeout);
					}
					document.removeEventListener(MOUSE['mousemove'],move,{passive:true});
					document.removeEventListener(MOUSE['mouseup'],disable,{passive:true,once:true});
					window.top.document.body.classList.remove('tb_start_animate','tb_image_editor_resing');
					const bodyClasses=bodyCL?bodyCL:Themify.body[0].classList;
					bodyClasses.remove('tb_start_animate','tb_image_editor_resing');
					Themify.body[0].style['cursor']=window.top.document.body.style['cursor']=el.style['willChange']=activeEl.style['willChange']=activeEl.parentNode.style['willChange']='';
					activeEl.classList.remove('tb_resized_img');
					if(isMoved===true){
						isChanged=true;
						let module=activeEl.closest('.active_module');
						if(!module){
							module=activeEl.closest('.module_column');
						}
						saveData();
						const update=function(){
							requestAnimationFrame(function(){
								if(imageDecode){
									k = Themify.hash(src+activeEl.getAttribute('width')+activeEl.getAttribute('height'));//save last value for fast response
									api.Utils.cache_images[k]=imageDecode;
									imageDecode=null;
								}
								updateCarousel();
								if(module){
									if(activeEl.hasAttribute('data-update')){
										module.innerHTML=module.innerHTML;//remove cache data attributes
										activeEl=isImageEdit?module.getElementsByClassName('tb_selected_img')[0]:module.querySelector('[contenteditable="true"]');
									}
									api.Utils.runJs($(module),'module');
								}
								Themify.trigger('tb_image_resize',activeEl);
								resizeImageEditor();
								Themify.requestIdleCallback(function () {
									setTimeout(function(){
									    requestAnimationFrame(resizeImageEditor);
									},25);
								},500);//after modules updates
								api.Utils.canvas=api.Utils.ctx=null;
							});
						};
						if(module){
							const  items = module.querySelectorAll('img[data-w="'+activeEl.getAttribute('data-w')+'"]');
							if(items.length>1){
								const w=activeEl.getAttribute('width'),
									h=activeEl.getAttribute('height'),
									loader=isLocal?document.createElement('div'):null,
									promises=[];
								if(loader){
									loader.className='tf_loader tf_loader_center';
									module.appendChild(loader);
									module.classList.add('tf_image_editor_working');
								}
								for(let i=items.length-1;i>-1;--i){
									if(items[i]!==activeEl){
										promises.push(api.Utils.resizeImage(items[i],w,h));
									}
								}
								Promise.allSettled(promises).finally((results) =>{
									if(loader){
										loader.remove();
									}
									module.classList.remove('tf_image_editor_working');
									update();
								});
							}
							else{
								update();
							}
						}
						else{
							update();
						}
					}
					isMoved=false;
					frame=timeout=prevW=prevH=null;
				};
				bodyCL.add('tb_start_animate','tb_image_editor_resing');
				window.top.document.body.classList.add('tb_start_animate','tb_image_editor_resing');
				Themify.body[0].style['cursor']=window.top.document.body.style['cursor']=getComputedStyle(target).getPropertyValue('cursor');
				if(isLocal===true){
					k = Themify.hash(src+activeEl.getAttribute('width')+activeEl.getAttribute('height'));
					if(api.Utils.cache_images[k]!==undefined){
						imageDecode=api.Utils.cache_images[k];
						_callback();
					}
					else{
						if(loader){
							loader.className='tf_loader';
							this.appendChild(loader);
							this.classList.add('tb_image_editor_loading');
						}
						imageDecode.src=src;
						imageDecode.crossOrigin='anonymous';
						imageDecode.decode().then(_callback);
					}
				}
				else{
					_callback();
				}
				document.addEventListener(MOUSE['mouseup'],disable,{passive:true,once:true});
			}
		},
		resizeImageEditor=function(){
			if(imageToolbar){
				requestAnimationFrame(function(){
					if(imageToolbar && activeEl){
						imageEditing(activeEl);
					}
				});
			}
		},
		updateCarousel=function(){
			if(swiper!==null){
				swiper.update();
			}
		},
		disableImageEditor=function(){
			if(imageToolbar){
				imageToolbar.removeEventListener(MOUSE['mousedown'],imageResizing,{passive:true});
				imageToolbar.removeEventListener('dblclick',dblclick,{passive:true});
				imageToolbar.remove();
				imageToolbar=null;
			}
		},
        disable=function(e){
			if(isImageSelecting){
				return;
			}
			let target=null;
			if(e){
				if(e.type==='blur'){
					if(e.relatedTarget){
						target=e.relatedTarget;
					}
					else{
						target=Common.Lightbox.$lightbox[0].contains(window.top.document.activeElement)?window.top.document.activeElement:document.activeElement;
					}
				}
				else{
					target=e.target;
				}
				if(!isImageEdit && target.closest('.tb_toolbar_undo')){
					if(activeEl){
						activeEl.removeEventListener('blur',disable,{passive:true});
					}
					setTimeout(function(){
						if(activeEl){
							activeEl.addEventListener('blur',disable,{passive:true});
						}
						selection=null;
						restoreToolbar();
						if(activeEl){
							activeEl.focus();
						}
						setCarret();
					},120);
					return;
				}
			}
			if(e &&  e.type!=='blur' && e.which!==1){
				return;
			}
			if(!e || !toolbar || ((e.touches || e.type==='blur' || e.which===1) && toolbar!==target && !toolbar.contains(target))){
				let activeModule=(activeEl && api.Instances.Builder[api.builderIndex].el.contains(activeEl))?activeEl.closest('.module'):api.Instances.Builder[api.builderIndex].el.querySelector('.tb_element_cid_'+cid+' .module');
				restoreToolbar();
				if(!e || !activeModule || (activeModule!==target && !activeModule.contains(target))){
					document.removeEventListener(MOUSE['mousedown'],disable,{passive:true});
					document.removeEventListener('selectionchange',selectionStart,{passive:true});
					document.removeEventListener(MOUSE['mouseup'],selectionEnd,{passive:true,once:true});
					window.top.document.removeEventListener(MOUSE['mousedown'],disable,{passive:true});
					Common.Lightbox.$lightbox.off('themify_opened_lightbox',lightbox);
					selectionEnd();
					if(undoData){
						api.undoManager.stack = undoData;
						api.undoManager.index = undoData.length - 1;
						api.undoManager.updateUndoBtns();
					}
					if(activeEl){
						activeEl.removeEventListener('input',onChange,{passive:true});
						activeEl.removeEventListener('change',onChange,{passive:true});
						activeEl.removeEventListener('blur',disable,{passive:true});
						if(activeEl.tagName!=='IMG'){
							activeEl.setAttribute('contenteditable','false');
						}
						
						activeEl.classList.remove('tb_selected_img');
						const form=activeEl.closest('form'),
								draggables=[];
						let _item=activeEl.closest('[draggable]');
						while (_item!==null) {
							draggables.push(_item);
							_item= _item.parentNode.closest('[draggable]');
						}
						for(let i=draggables.length-1;i>-1;--i){
							draggables[i].setAttribute('draggable',true);
						}
						if(form){
							form.removeEventListener('submit',preventDefault);
							const formInputs=form.querySelectorAll('[data-required]');
							for(let i=formInputs.length-1;i>-1;--i){
								formInputs[i].removeAttribute('data-required');
								formInputs[i].setAttribute('required','required');
							}
						}
						let wow=activeEl;
						while (wow && wow.classList && !wow.classList.contains('active_module')) {
							if(wow.getAttribute('data-tmp-animation')){
								wow.style['animation-name']=wow.getAttribute('data-tmp-animation');
								wow.removeAttribute('data-tmp-animation');
							}
							wow = wow.parentNode;
						}
						wow=null;
					}
					if(swiper && swiper.params && swiper.params.autoplay && swiper.params.autoplay.enabled){
						swiper.el.dataset['stopped']=false;
						swiper.autoplay.start();
						if( swiper.params.thumbs && swiper.params.thumbs.swiper.autoplay  && swiper.params.thumbs.swiper.autoplay.enabled){
							swiper.params.thumbs.swiper.el.dataset['stopped']=false;
							swiper.params.thumbs.swiper.autoplay.start()
						}
					}
					if(toolbar){
						toolbar.classList.add('tf_hide','tf_opacity');
						toolbar.classList.remove('tb_editor_top_viewport','tb_editor_show_link');
						toolbar.removeEventListener(CLICK['mousedown'],toolbarActions);
					}
					if(e){
						window.getSelection().removeAllRanges();
					}
					Themify.off('tfsmartresize',resizeImageEditor)
					.off('tbresizeImageEditor',resizeImageEditor)
					.off('tbDisableInline',disable);
					disableImageEditor();
					if(bodyCL){
						bodyCL.remove('tb_editor_active','tb_editor_image_active','tb_editor_start_select');
					}
					window.top.document.body.classList.remove('tb_editor_active','tb_editor_image_active','tb_editor_start_select');
					api.ActionBar.clear();
					if(activeModule){
						activeModule=activeModule.closest('.active_module');
						if(activeModule){
							activeModule.classList.remove('tb_editor_on','tb_editor_clicked');
							activeModule.removeEventListener('dblclick',dblclick,{passive:true});
							if(isChanged){
								saveData();
								if(!activeEl.hasAttribute('data-no-update')){
									api.Utils.runJs($(activeModule),'module');
								}
							}
						}
					}
					api.ActionBar.hoverCid= before =toolbar = bodyCL=is_editable=selection=width=height=timer=toolbarItems=dialog=linkHolder=cid=undoData=beforeValue=swiper=activeEl=null;
				}
				else if(e && e.type!=='blur' && activeEl && window.getSelection().isCollapsed===false){
					if(!bodyCL.contains('tb_editor_start_select')){
						window.top.document.body.classList.add('tb_editor_start_select');
						bodyCL.add('tb_editor_start_select');
					}
					this.addEventListener(MOUSE['mouseup'],selectionEnd,{passive:true,once:true});
				}
			}
			
        };
	
	if(Themify.is_builder_loaded){
		init();
	}
	else{
		Themify.on('tb_css_visual_modules_load',init,true);
			
	}
	Themify.on('undo',function(el,type,data,isUndo){
		if(type!=='inline'){
			disable();
		}
	}).on('disableInline',function(){
		disable();
	});
    
}(Themify,jQuery, window, document,tb_app,ThemifyBuilderCommon));