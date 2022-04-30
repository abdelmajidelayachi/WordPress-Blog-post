var ThemifyConstructor;
(function ($, Themify, topWindow, document) {
    'use strict';
    let api={ActionBar:{}},
        Common=typeof ThemifyBuilderCommon!=='undefined'?ThemifyBuilderCommon:{};
    ThemifyConstructor = {
        data: null,
        key: 'tb_form_templates_',
        styles: {},
        settings: {},
        editors: null,
        afterRun: [],
        radioChange: [],
        bindings: [],
        stylesData: null,
        values: {},
        clicked: null,
        type: null,
        static: null,
        label: null,
        is_repeat: null,
        is_sort:null,
        is_new: null,
        is_ajax: null,
        breakpointsReverse:null,
        set(value) {
            try {
                let m = themify_vars.version;
                for (let s in themifyBuilder.modules) {
                    m += s;
                }
				if(themifyBuilder.cache_data){
					m += themifyBuilder.cache_data;
				}
                localStorage.setItem(this.key, JSON.stringify( {val: value, h: Themify.hash(m)}));
                return true;
            }
            catch (e) {
                return false;
            }
        },
        get() {
            if (themifyBuilder.debug) {
                return false;
            }
            try {
                let record = localStorage.getItem(this.key),
					m =themify_vars.version;
                if (!record) {
                    return false;
                }
                record = JSON.parse(record);
                for (let s in themifyBuilder.modules) {
                    m += s;
                }
				if(themifyBuilder.cache_data){
					m += themifyBuilder.cache_data;
				}
                if (record.h !== Themify.hash(m)) {
                    return false;
                }
                return record.val;
            }
            catch (e) {
                return false;
            }
        },
		/**
		 * Get an option's DOM element by its ID
		 */
		getEl( id ) {
			return ThemifyBuilderCommon.Lightbox.$lightbox[0].querySelector( '#' + id );
		},
        getForms(callback) {
            if(typeof tb_app!=='undefined'){
                if(tb_app.Constructor!==undefined){
                    for(let i in tb_app.Constructor){
                        ThemifyConstructor[i]=tb_app.Constructor[i];
                    }
                    delete tb_app.Constructor;
                }
                Common = ThemifyBuilderCommon;
                api= tb_app;
            }
            this.breakpointsReverse = Object.keys(themifyBuilder.breakpoints).reverse();
            this.breakpointsReverse.push('desktop');
            const self = this,
                    data = self.get(),
                    result = function (resp) {
                        Common.Lightbox.setup();
                        self.data = resp;
                        if (callback) {
                            callback();
                        }
                    };
            if (data !== false) {//cache visual templates
                result(data);
            }
            else {
                let forms={};
				const max=Object.keys(themifyBuilder.modules).length+3,
					_get=function(page){
                        ++page;
                        $.ajax({
                            type: 'POST',
                            url: themifyBuilder.ajaxurl,
                            dataType: 'json',
                            data: {
                                action: 'tb_load_form_templates',
                                tb_load_nonce: themifyBuilder.tb_load_nonce,
                                page:page
                            },
                            success(resp) {
                                if (resp) {
									forms = Object.assign(forms, resp);	
									if(max>Object.keys(forms).length){
                                        _get(page);
                                    }
                                    else{
										result(forms);
										self.set(forms);
										forms=page=null;
                                    }

                                }
                            }
                        });
                    };
                _get(0);
            }

            self.static = themifyBuilder.i18n.options;
            themifyBuilder.i18n.options = null;
            this.label = themifyBuilder.i18n.label;
            themifyBuilder.i18n.label = null;
            let fonts = self.static.fonts.safe;
            for (let i = 0, len = fonts.length; i < len; ++i) {
                if ('' !== fonts[i].value && 'default' !== fonts[i].value) {
                    self.font_select.safe[fonts[i].value] = fonts[i].name;
                }
            }
            self.static.fonts.safe = null;
            fonts = self.static.fonts.google;
            for (let i = 0, len = fonts.length; i < len; ++i) {
                if ('' !== fonts[i].value && 'default' !== fonts[i].value) {
                    self.font_select.google[fonts[i].value] = {'n': fonts[i].name, 'v': fonts[i].variant.map( function( item ) {
						/* restore the shorthand name for font variations */
						item = typeof item === 'string' ? item.replace( 'i', 'italic' ).replace( 'r', 'regular' ) : item.toString();
						return item;
					} ) };
                }
            }
            self.static.fonts.google = fonts = themifyBuilder.google = null;
            fonts = self.static.fonts.cf;
            for (let i = 0, len = fonts.length; i < len; ++i) {
                    if ('' !== fonts[i].value && 'default' !== fonts[i].value) {
                        self.font_select.cf[fonts[i].value] = {'n': fonts[i].name, 'v': fonts[i].variant};
                    }
                }
            self.static.fonts.cf = fonts = themifyBuilder.cf = null;
        },
        getOptions(data) {
            if (data.options !== undefined) {
                return data.options;
            }
            for (let i in this.static) {
                if (data[i] === true) {
                    return this.static[i];
                }
            }
            return false;
        },
        getTitle(data) {
            if (data.type === 'custom_css') {
                return this.label.custom_css;
            }
            if (data.type === 'title') {
                return this.label.m_t;
            }
            return data.label !== undefined ? (this.label[data.label] !== undefined ? this.label[data.label] : data.label) : false;
        },
        getSwitcher() {
            const sw = document.createElement('ul'),
                breakpoints = this.breakpointsReverse,
                self = this;
            sw.className = 'tb_lightbox_switcher tf_clearfix';
            for (let i = breakpoints.length - 1; i > -1; --i) {
                let b = breakpoints[i],
                        el = document.createElement('li'),
                        a = document.createElement('a');
                a.href = '#' + b;
                a.className = 'tab_' + b;
                a.title = b === 'tablet_landscape' ? this.label['table_landscape'] : (b.charAt(0).toUpperCase() + b.substr(1));
                a.appendChild(api.Utils.getIcon('ti-'+(b === 'tablet_landscape'?'tablet':b)));
                el.appendChild(a);
                sw.appendChild(el);
            }
            sw.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                if (e.target !== sw) {
                    const a = e.target.closest('a');
                    if (a !== null) {
                        self.lightboxSwitch(a.getAttribute('href'));
                    }
                }
            });
            return sw;
        },
        lightboxSwitch(bp) {
            const id = bp.replace('#', '');
            if (id === api.activeBreakPoint) {
                return;
            }
            if (api.activeModel && api.mode === 'visual') {
                api.scrollTo = api.liveStylingInstance.$liveStyledElmt;
            }
            $('.tb_breakpoint_switcher.breakpoint-' + id, topWindow.document).trigger('click');
        },
        binding(_this, data, val, context) {
            let logic = false;
			const binding = data['binding'],
				type=data['type'];
            if (type === 'select' && val == 0) {
                val = '';
            }
            if('video'===type){
                if(val==''){
                    logic = binding['empty'];
                }else{
                    const provider = Themify.parseVideo(val);
                    if(provider.type === 'youtube' || provider.type === 'vimeo'){
                        logic = binding['external'];
                    }else{
                        let url;
                        try {
                            url = new URL(val);
                        } catch (_) {
                            url = false;
                        }
                        if(false!==url && window.top.location.hostname===url.hostname){
                            logic = binding['local'];
                        }else{
                            logic = binding['empty'];
                        }
                    }
                }
            }
            else if (!val && binding['empty'] !== undefined) {
                logic = binding['empty'];
            }
            else if (val && binding[val] !== undefined) {
                if (type === 'radio' || type === 'icon_radio') {
                    logic = _this.checked === true ? binding[val] : false;
                } else {
                    logic = binding[val];
                }
            }
            else if (val && binding['not_empty'] !== undefined) {
                logic = binding['not_empty'];
            }
            else if (binding['select'] !== undefined && val !== binding['select']['value']) {
                logic = binding['select'];
            }
            else if (binding['checked'] !== undefined && _this.checked === true) {
                logic = binding['checked'];
            }
            else if (binding['not_checked'] !== undefined && _this.checked === false) {
                logic = binding['not_checked'];
            }
            if (logic) {
				
                if (context === undefined || context === null || context.length === 0) {
                    context = _this.closest('.tb_tab');
                    if (context === null) {
                        context = _this.closest('.tb_expanded_opttions');
                        if (context === null) {
                            context = topWindow.document.getElementById('tb_lightbox_container');
                        }
                    }

                }
                const hasHide=logic['hide'] !== undefined,
                    hasShow=logic['show'] !== undefined,
                    self = this,
                    relatedBindings = [],
                 getData = function (options, key) {
                    let value;
					const keys = Object.keys(options);
                    for(let i = 0,len =keys.length;i<len;++i){
                        if (undefined !== options[keys[i]]['id'] && options[keys[i]]['id'] === key) {
                            value = options[keys[i]];
                            break;
                        }
                        if (options[keys[i]] && typeof options[keys[i]] === 'object') {
                            value = getData(options[keys[i]], key);
                            if(value !== undefined){
                                break;
                            }
                        }
                    }
                    return value;
                },
                relatedBinding = function(el, data,context){
                    const type = el.dataset.type;
					let  _this;
                    if('radio' === type){
                        _this = el.querySelector('input:checked');
                        if(null === _this){
                            _this = el.getElementsByTagName('input')[0];
                        }
                    }else if('checkbox' === type || 'toggle_switch' === type){
                        _this = el.getElementsByTagName('input')[0];
                    }else if('select' === type){
                        _this = el.getElementsByTagName('select')[0];
                    }
                    if(undefined !== _this){
                        if(('radio' === type || 'checkbox' === type || 'toggle_switch' === type) && _this.checked && el.classList.contains('_tb_hide_binding')){
                            _this.checked=false;
                        }
                        self.binding(_this, data, _this.value, context);
                    }
                };
				if(hasShow===true && !Array.isArray(logic['show'])){
					logic['show']=[logic['show']];
				}
				if(hasHide===true && !Array.isArray(logic['hide'])){
					logic['hide']=[logic['hide']];
				}
				let items = hasShow===true?logic['show']:[];
                if (hasHide===true) {
                    items = items.concat(logic['hide']);
                }
                for (let i = 0, len = items.length; i < len; ++i) {
                    if (hasHide===true && logic['hide'][i] !== undefined) {
                        const hides = context.querySelectorAll('.' + logic['hide'][i]);
                        for (let j =hides.length-1; j >-1; --j) {
                            hides[j].classList.add('_tb_hide_binding');
                            if('object' === typeof this.data && null !== this.type && 'object' === typeof this.data[this.type] ){
                                let relatedBindData = getData(this.data[this.type][this.clicked],logic['hide'][i]);
                                if('object' === typeof relatedBindData && 'object' === typeof relatedBindData['binding']){
                                    relatedBindings.push({el:hides[j], data:relatedBindData});
                                }
                            }
                        }
                    }
                    if (hasShow===true && logic['show'][i] !== undefined) {
                        const shows = context.querySelectorAll('.' + logic['show'][i]);
                        for (let j =shows.length-1; j >-1; --j) {
                            // Just temp solution - We need to improve binding logic to have more complex bindings
                            if('ajax_filter'===logic['show'][i] && 'post_filter'===data.id && context.querySelectorAll('#auto_tiles.selected').length>0){
                                continue;
                            }
                            shows[j].classList.remove('_tb_hide_binding');
                            if('object' === typeof this.data && null !== this.type && 'object' === typeof this.data[this.type] ){
                                let relatedBindData = getData(this.data[this.type][this.clicked],logic['show'][i]);
                                if('object' === typeof relatedBindData && 'object' === typeof relatedBindData['binding']){
                                    relatedBindings.push({el:shows[j], data:relatedBindData});
                                }
                            }
                        }
                    }
                }
                for( let i = relatedBindings.length -1;i>-1;--i){
                    relatedBinding(relatedBindings[i].el,relatedBindings[i].data,context);
                }
                if (logic['responsive'] !== undefined && logic['responsive']['disabled'] !== undefined) {
					if(!Array.isArray(logic['responsive']['disabled'])){
						logic['responsive']['disabled']=[logic['responsive']['disabled']];
					}
                    const items_disabled = logic['responsive']['disabled'],
						is_responsive = 'desktop' !== api.activeBreakPoint;
                    for (let i =items_disabled.length-1; i>-1; --i) {
                        if (logic['responsive']['disabled'][i] !== undefined) {
                            let resp = context.querySelectorAll('.' + logic['responsive']['disabled'][i]);
                            for (let j=resp.length-1; j >-1; --j) {
                               resp[i].classList.toggle('responsive_disable',is_responsive);
                            }
                        }
                    }
                }
            }
        },
        control: {
            init(el, type, args) {
                args.name = type;
                this[type].call(this, el, args);
            },
            preview(el, val, args) {
                if (api.mode === 'visual') {
                    const self = ThemifyConstructor;
					let	selector = null,
                        repeater=null;
                    if (args.repeat === true) {
                        repeater= el.closest('.tb_toggleable_fields');
                        if(repeater===null){
                            repeater= el.closest('.tb_sort_fields_parent');
                            if(repeater===null){
                                repeater = el.closest('.tb_row_js_wrapper');
                            }
                        }
                    }

                    if (args.selector !== undefined && val) {
                        selector = api.liveStylingInstance.$liveStyledElmt[0].querySelectorAll(args.selector);
                        if (selector.length === 0) {
                            selector = null;
                        }
                        else if (repeater!==null) {
							const item = el.closest('.tb_repeatable_field');
							let items = repeater.children,
								index=null;
							for(let i=0,len=items.length-1;i<len;++i){
								if(items[i]===item){
									index=i;
									break;
								}
							}
							if(args['rep']!==undefined){
								selector = api.liveStylingInstance.$liveStyledElmt[0].querySelectorAll(args.rep);
								if(selector[index]!==undefined){
									items=selector[index].querySelectorAll(args.selector);
									if (items.length === 0){
										items=null;
									}
								}
							}
							else {
								items=index!==null && selector[index]!==undefined?[selector[index]]:null;
							}
							if(items!==null && items!==undefined){
								selector=[];
								for(let i=items.length-1;i>-1;--i){
									let sw = items[i].closest('.tf_swiper-slide');
									if(sw!==null){
										let wrapper=sw.closest('.tf_swiper-wrapper');
										if(wrapper!==null){
											let swItems=wrapper.querySelectorAll('.tf_swiper-slide[data-swiper-slide-index="'+index+'"]'),
													len=swItems.length;
											if(len!==0){
												for(let j=len-1;j>-1;--j){
													for(let found = swItems[j].querySelectorAll(args.selector),k=found.length-1;k>-1;--k){
														selector.push(found[k]);
													}
												}
											}
											else{
												selector.push(items[i]);
											}
										}
									}
									else{
										selector.push(items[i]);
									}
								}
								
							}
							else{
								selector=null;
							}
                        }
                    }
                    if (repeater!==null) {
                        self.settings[ repeater.id ] = api.Utils.clear(api.Forms.parseSettings(repeater).v);
                        repeater = null;
                    }
                    else {
                        self.settings[ args.id ] = val;
                    }
                    if ('refresh' === args.type || self.is_ajax === true) {
                        api.activeModel.trigger('custom:preview:refresh', self.settings, selector, val);
                    }
                    else {
                        api.activeModel.trigger('custom:preview:live', self.settings, args.name === 'wp_editor' || el.tagName === 'TEXTAREA', null, selector, val);
                    }
                }
                else {
                    api.activeModel.backendLivePreview();
                }
                api.hasChanged = true;
            },
            change(el, args) {
                let that = this,
                        timer = 'refresh' === args.type && args.selector === undefined ? 1000 : 50,
                        event;
                if (args.event === undefined) {
                    event = 'change';
                    timer = 1;
                }
                else {
                    event = args.event;
                }
                el.addEventListener(event, _.throttle(function (e) {
                    const target = e.target;
                    if('keyup' === e.type){
                        if(target.value === target.dataset['oldValue']){
                            return;
                        }else{
                            target.dataset['oldValue'] = target.value;
                        }
                    }
                    that.preview(target, target.value, args);
                }, timer), {passive: true });
            },
            wp_editor(el, args) {
				/* change the ID on WP's #message element.
				 * Patches an issue with Optin due to similar IDs
				 */
				$( '.wrap > #message' ).attr( 'id', 'wp-message' );

                let that = this,
                        $el = $(el),
                        timer = 'refresh' === args.type && args.selector === undefined ? 1000 : 50,
                        id = el.id,
                        previous = false,
                        is_widget = false,
                        callback = _.throttle(function (e) {
                            const content = this.type === 'setupeditor' ? this.getContent() : this.value;
                            if (api.activeModel === null || previous === content) {
                                return;
                            }
                            previous = content;
                            if (is_widget !== false) {
                                el.value = content;
                                $el.trigger('change');
                            }
                            else {
                                that.preview(el, content, args);
                            }
                        }, timer);
                api.Utils.initQuickTags(id);
                if ( typeof tinyMCE !== 'undefined' ) {
                    if (tinymce.editors[ id ] !== undefined) { // clear the prev editor
                        tinyMCE.execCommand('mceRemoveEditor', true, id);
                    }
                    const ed = api.Utils.initNewEditor(id);
                    is_widget = el.classList.contains('wp-editor-area') ? $el.closest('#instance_widget').length > 0 : false;
                    // Backforward compatibility
                    !ed.type && (ed.type = 'setupeditor');

                    ed.on('change keyup', callback);
                }
                $el.on('change keyup', callback);
            },
            layout(el, args) {
                if ('visual' === api.mode) {
                    const that = this;
                    el.addEventListener('change', function (e) {
                        let selectedLayout = e.detail.val;
						if(selectedLayout.indexOf('grid-')===0){
							selectedLayout=selectedLayout.replace('grid-','grid');
						}
						else if(!isNaN(selectedLayout)){
							selectedLayout='grid'+selectedLayout;
						}
                        if (args['classSelector']!==undefined && selectedLayout!=='auto_tiles') {
                            const id = args.id,
                                apllyTo = args['classSelector']!==''? api.liveStylingInstance.$liveStyledElmt.find(args['classSelector']).first():api.liveStylingInstance.$liveStyledElmt;
								let prevLayout = ThemifyConstructor.settings[id];
								if(prevLayout){
									if(prevLayout.indexOf('grid-')===0){
										prevLayout=prevLayout.replace('grid-','grid');
									}
									else if(!isNaN(prevLayout)){
										prevLayout='grid'+prevLayout;
									}
								}
                                ThemifyConstructor.settings[id]= selectedLayout;
                                if(apllyTo.length>0){
                                    apllyTo.removeClass(prevLayout).addClass(selectedLayout);
                                    api.Utils.runJs(api.liveStylingInstance.$liveStyledElmt, 'module');
                                }
                                else{
                                    that.preview(this, selectedLayout, args);
                                }

                        } else {
                            that.preview(this, selectedLayout, args);
                        }
                    },{passive: true});
                }
            },
            icon(el, args) {
                const that = this;
                el.addEventListener('change', function (e) {
                    const v = e.target.value,
                        prev = this.closest('.tb_field').getElementsByClassName('themify_fa_toggle')[0];
                    if (prev !== undefined) {
                        if(prev.firstChild){
                            prev.firstChild.remove();
                        }
                        if(v){
                            prev.appendChild(api.Utils.getIcon(v));
                        }
                    }
                    that.preview(e.target, v, args);
                },{passive: true });
            },
            checkbox(el, args) {
                if (api.mode === 'visual') {
                    const that = this;
                    el.addEventListener('change', function () {
                        const checked = [],
                                checkbox = this.closest('.themify-checkbox').getElementsByClassName('tb-checkbox');
                        for (let i = 0, len = checkbox.length; i < len; ++i) {
                            if (checkbox[i].checked) {
                                checked.push(checkbox[i].value);
                            }
                        }
                        that.preview(this, checked.join('|'), args);
                    },{passive: true });
                }
            },
            color(el, args) {
                if (api.mode === 'visual') {
                    const that = this;
                    el.addEventListener('themify_builder_color_picker_change', function (e) {
                        that.preview(this, e.detail.val, args);
                    },{passive: true });
                }
            },
            widget_select(el, args) {
                this.preview(el, el.find(':input').themifySerializeObject(), args);
            },
            queryPosts(el, args) {
                if (api.mode === 'visual') {
                    const that = this;
                    el.addEventListener('queryPosts', function (e) {
                        args['id'] = this.id;
                        ThemifyConstructor.settings = api.Utils.clear(api.Forms.serialize('tb_options_setting'));
                        that.preview(this, ThemifyConstructor.settings[args['id']], args);
                    },{passive: true });
                }
            }
        },
        initControl(el, data) {
            if (api.activeModel !== null) {
                if (this.clicked === 'setting' && data.type !== 'custom_css') {
                    if (data.control !== false && this.component === 'module') {
                        const args = data.control || {};
                        let type = data['type'];
                        if (args['repeat'] === true) {
                            args['id'] = el.getAttribute('data-input-id');
                        }
                        else {
                            if (this.is_repeat === true) {
                                args['repeat'] = true;
                                args['id'] = el.getAttribute('data-input-id');
                            }
                            else {
                                args['id'] = data.id;
                            }
                        }

                        if (args.control_type === undefined) {
                            if (type === undefined || type === 'text'  || type === 'number' || type === 'url' || type === 'autocomplete' || type === 'range' || type === 'radio' || type === 'icon_radio' || type === 'select' || type === 'gallery' || type === 'textarea' || type === 'address' || type === 'image' || type === 'date' || type === 'audio' || type === 'video' || type === 'select_menu' || type === 'widgetized_select' || type === 'layoutPart' || type === 'selectSearch' || type === 'hidden' || type === 'toggle_switch') {
                                if (args.event === undefined && (type === 'text' || type === 'textarea')) {
                                    args.event = 'keyup';
                                }
                                type = 'change';
                            }
                        }
                        else {
                            type = args.control_type;
                        }
                        this.control.init(el, type, args);
                    }
                }
                else if (api.mode === 'visual' && this.clicked === 'styling') {
                    api.liveStylingInstance.bindEvents(el, data);
                }
                if (data['binding']!== undefined) {
                    const self = this,
                        is_repeat = self.is_repeat === true,
                        callback = function(_this,v){
                            let context;
                            if(is_repeat){
                                context = el.closest('.tb_sort_field_dropdown');
                                if(context===null){
                                    context = el.closest('.tb_toggleable_fields_options');
                                    if(context===null){
                                        context=el.closest('.tb_repeatable_field_content');
                                    }
                                }
                            }
                            self.binding(_this, data,v, context);
                        };    
                    if (data.type === 'layout' || data.type === 'frame') {
                        el.addEventListener('click', function (e) {
                            const t = e.target.closest('.tfl-icon');
                            if (t !== null) {
                                callback(this,t.id);
                            }
                        },{passive: true});
                    }
                    else {
                        el.addEventListener('change', function (e) {
                            callback(this,this.value);
                        },{passive: true});
                    }
                    this.bindings.push({el: el, data: data, repeat: is_repeat});
                }
            }
            return el;
        },
        callbacks() {
            let len;
            if(this.afterRun!==null){
                len = this.afterRun.length;
                if (len > 0) {
                    for (let i = 0; i < this.afterRun.length; ++i) {
                        this.afterRun[i].call();
                    }
                    this.afterRun = [];
                }
            }
            if(this.radioChange!==null){
                len = this.radioChange.length;
                if (len > 0) {
                    for (let i = 0; i < this.radioChange.length; ++i) {
                        this.radioChange[i].call();
                    }
                    this.radioChange = [];
                }
            }
            if(this.bindings!==null){
                len = this.bindings.length;
                if (len > 0) {
                    for (let i = len - 1; i > -1; --i) {
                        let el = this.bindings[i].el,
                            context=this.bindings[i].repeat === true?el.closest('.tb_repeatable_field_content'):undefined,
                            v=this.bindings[i].data.type === 'layout' || this.bindings[i].data.type === 'frame'?el.getElementsByClassName('selected')[0].id:el.value;
                        if(this.bindings[i].repeat === true){
                            context = el.closest('.tb_sort_field_dropdown');
                            if(context===null){
                                context = el.closest('.tb_toggleable_fields_options');
                                if(context===null){
                                    context=el.closest('.tb_repeatable_field_content');
                                }
                            }
                        }
                        this.binding(el, this.bindings[i].data, v, context);
                    }
                    this.bindings = [];
                }
            }
        },
        setUpEditors() {
            for (let i = this.editors.length - 1; i > -1; --i) {
                this.initControl(this.editors[i].el, this.editors[i].data);
            }
            this.editors = [];
        },
        switchTabs(e) {
            if(this.nodeName==='A'){
            e.preventDefault();
            }
            e.stopPropagation();
            const id = this.getAttribute('href'),
                li = this.parentNode,
				p = li.parentNode,
				tabs=p.parentNode;
				
			let container = tabs.querySelector(id);
			if(!container || container.parentNode!==tabs){
				container=topWindow.document.getElementById(id.replace('#', ''));
			}
            if (!container || li.classList.contains('current')) {
                return;
            }
            const children = p.children,
                containerChildren = container.parentNode.children;
            for (let i = children.length - 1; i > -1; --i) {
                children[i].classList.remove('current');
            }
            li.classList.add('current');
            for (let i = containerChildren.length - 1; i > -1; --i) {
                if (containerChildren[i].classList.contains('tb_tab')) {
                    containerChildren[i].style['display'] = 'none';
                }
            }
            container.style['display'] = 'block';
            Themify.body.triggerHandler('themify_builder_tabsactive', [id, container]);
            Themify.triggerEvent(container, 'themify_builder_tabsactive', {'id': id});
            api.Utils.hideOnClick(p);
        },
        run(type, save_opt) {
            
            this.styles = {};
            this.settings = {};
            this.editors = [];
            this.afterRun = [];
            this.radioChange = [];
            this.bindings = [];
            this.stylesData = {};
            this.is_repeat = null;
            this.is_sort = null;
            this.component=null;
            this.type = type;
            this.is_new = null;
            this.is_ajax = null;
            let data,
                is_style=false,
                is_visible=false,
                model=api.activeModel,
                rememberedEl;
				
            if (model!== null) {
                this.component = model.get('elType');
                let key,
                        item = document.getElementsByClassName('tb_element_cid_' + model.cid)[0];

                if (this.component === 'module') {
                    this.is_ajax = themifyBuilder.modules[type].type === 'ajax';
                    key = 'mod_settings';
                    if (model.get('is_new') !== undefined) {
                        this.is_new = true;
                        item = item.closest('.module_row');
                    }
                }
                else {
                    key = 'styling';
                }
                this.values = $.extend(true, {}, model.get(key));

                if(item!==undefined){
                    api.beforeEvent = Common.clone(item);
                }
                is_visible = model.get('visibileClicked')!==undefined;
                is_style = is_visible===false && (this.component === 'column' || model.get('styleClicked')!==undefined);
				if(this.data[type]['visibility']===undefined){
					this.data[type]['visibility']=true;
				}
				if(this.data[type]['animation']===undefined){
					this.data[type]['animation']=true;
				}
                data = this.data[type];
				
            }
            else {
                this.values = {};
                this.component = null;
                data = type;
            }
            const top_bar = document.createDocumentFragment(),
                    container = document.createDocumentFragment(),
                    self = this,
                    tabIcons={'styling':'ti-brush','animation':'ti-layers-alt','visibility':'ti-eye'},
                    createTab = function (index, options) {

                        const tab_container = document.createElement('div'),
                            fr = document.createDocumentFragment();
                        tab_container.className = 'tb_options_tab_content';
                        if (index === 'visibility' || index === 'animation') {
                            options = self.static[index];
                        }
                        else if (index === 'styling') {
                            const div = document.createElement('div'),
                                globalStylesHTML = api.GS.globalStylesHTML();
                            div.className = 'tb_styling_tab_header';
                            div.appendChild(self.getSwitcher());
                            if(globalStylesHTML){
                                div.appendChild(globalStylesHTML);
                            }
                            fr.appendChild(div);
                        }
                        // generate html output from the options
                        tab_container.appendChild(self.create(options));
                        fr.appendChild(tab_container);
                        if (index === 'styling') {
                            const reset = document.createElement('a'),
                                    icon = document.createElement('i');
                            reset.href = '#';
                            reset.className = 'reset-styling';
                            icon.className = 'tf_close';
                            reset.appendChild(icon);
                            reset.appendChild(document.createTextNode(self.label.reset_style));
                            reset.addEventListener('click', self.resetStyling.bind(self));
                            fr.appendChild(reset);
                            if (api.mode === 'visual' && model) {
                                setTimeout(function () {
                                    api.liveStylingInstance.module_rules = self.styles;//by reference,will be fill when the option has been viewed
                                }, 600);
                            }
                        }
						options=null;
                        return fr;
                    };
            
            this.clicked = null;
            for (let k in data) {
				if(data[k]===false){
					continue;
				}
                //meneu
                let li = document.createElement('li'),
                        a = document.createElement('a'),
                        tooltip = document.createElement('span'),
                        wrapper = document.createElement('div'),
                        label= data[k].name !== undefined ? data[k].name : this.label[k],
                        tab_id = 'tb_options_' + k;
                a.href = '#' + tab_id;
                a.textContent=label;
                if(k!=='setting'){
                    a.className='tb_tooltip';
                    tooltip.textContent = label;
                    if(tabIcons[k]){
                        a.appendChild(api.Utils.getIcon(tabIcons[k]));
                    }
                    a.appendChild(tooltip);
                }
                wrapper.id = tab_id;
                wrapper.className = 'tb_tab tb_options_tab_wrapper';
                if ((is_style===true && k === 'styling') || (is_visible===true && k === 'visibility') ||(is_style===false && is_visible===false &&  k === 'setting') || this.component === null) {
                    li.className = 'current';
                    self.clicked = k;
                    if (data[k].html !== undefined) {
                        wrapper.appendChild(data[k].html);
                    }
                    else {
                        wrapper.appendChild(createTab(k, data[k].options));
                    }

                    wrapper.style['display'] = 'block';
                    wrapper.dataset['done'] = true;
                }
                wrapper.addEventListener('themify_builder_tabsactive', function (e) {
                    const index = e.detail.id.replace('#tb_options_', '');
                    self.clicked = index;
                    if (this.dataset['done'] === undefined) {
                        this.dataset['done'] = true;
                        this.appendChild(createTab(index, data[index].options));
                        self.callbacks();
                        if (index === 'setting') {
                            self.setUpEditors();
                        }
                        
                    }
                },{passive: true});
                a.addEventListener('click', this.switchTabs);
                container.appendChild(wrapper);
                li.appendChild(a);
                top_bar.appendChild(li);
            }
            const top = Common.Lightbox.$lightbox[0].getElementsByClassName('tb_options_tab')[0],
                action = Common.Lightbox.$lightbox[0].getElementsByClassName('tb_lightbox_actions_wrap')[0];

            while (top.firstChild!==null) {
                top.removeChild(top.lastChild);
            }
            while (action.firstChild!==null) {
                action.removeChild(action.lastChild);
            }
            top.appendChild(top_bar);
            if (save_opt !== undefined || model) {
                const save = document.createElement('button');
                save.className = 'builder_button builder_save_button';
                save.title = save_opt !== undefined && save_opt.ctr_save !== undefined ? this.label[save_opt.ctr_save] : this.label['ctr_save'];
                    save.textContent = save_opt !== undefined && save_opt.done !== undefined ? this.label[save_opt.done] : this.label['done'];
                if (model) {
                    api.autoSaveCid = model.cid;
                    if (api.mode === 'visual') {
                        if(api.GS.activeGS!==null){
                            api.liveStylingInstance = api.createStyleInstance();
                            api.liveStylingInstance.init(null,true);
                        }
                        else{
                            if(api.liveStylingInstance===null){
                                api.liveStylingInstance = api.createStyleInstance();
                            }
                            api.liveStylingInstance.init();
                        }
                        
                        rememberedEl = api.liveStylingInstance.$liveStyledElmt[0].outerHTML;
                    }
                    const _saveClicked = function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        if(self.saveComponent(false)){
                            save.removeEventListener('click', _saveClicked);
                            topSave.removeEventListener('click', _saveClicked, {once: true});
                        }
                    },
                    topSave = document.createElement('a'),
                        li = document.createElement('li'),
                        span = document.createElement('span');
                    li.className='tb_top_save_btn';
                    topSave.className='tb_tooltip';
                    span.textContent = this.label['done'];
                    topSave.appendChild(api.Utils.getIcon('ti-check'));
                    topSave.appendChild(span);
                    li.appendChild(topSave);
                    top.appendChild(li);
                    save.addEventListener('click', _saveClicked);
                    topSave.addEventListener('click', _saveClicked, {once: true});
                }
                action.appendChild(save);
            }
            Themify.body.one('themify_builder_lightbox_close', function () {
				self.radioChange = self.afterRun =self.bindings =self.editors =[];                
				self.stylesData = self.settings = self.styles = {};
                self.is_ajax = self.is_repeat=self.is_sort = self.clicked = null;   
                if (model) {
                    let row;
                    if(self.is_new && 'module' === api.activeModel.get('elType')){
                        const activeEl = 'visual' === api.mode ? api.liveStylingInstance.$liveStyledElmt : Themify.body.find('.tb_element_cid_' + api.activeModel.cid);
                            row = activeEl.closest('.module_row.tb_new_row');
                    }
                    if (api.saving !== true && rememberedEl !== undefined && api.hasChanged) {
                        const m = api.Models.Registry.lookup(model.cid);
                        if (m) {
                            m.trigger('custom:restorehtml', rememberedEl);
                        }
                    }
                    if (self.is_new) {
                        model.unset('is_new', {silent: true});
                        if (api.saving !== true) {
                            model.trigger('dom:module:unsaved');
                            if(undefined !== row && row.length > 0){
                                const m = api.Models.Registry.lookup(row.data('cid'));
                                if (m) {
                                    m.destroy();
                                }
                            }
                        }else{
                            if(undefined !== row && row.length>0){
                                row[0].classList.remove('tb_new_row');
                            }
                        }
                    }
                    else {
                        model.unset('styleClicked', {silent: true});
                        model.unset('visibileClicked', {silent: true});
                    }
                    if (api.mode === 'visual') {
                        api.liveStylingInstance.clear();
                    }
                    api.activeModel=model= null;
                    if ( typeof tinyMCE !== 'undefined' ) {
                        for (let i = tinymce.editors.length - 1; i > -1; --i) {
                            if (tinymce.editors[i].id !== 'content') {
                                tinyMCE.execCommand('mceRemoveEditor', true, tinymce.editors[i].id);
                            }
                        }
                    }
                }
                Themify.body.off('themify_builder_change_mode.updatestyles');
                rememberedEl = data=self.type = self.component = self.is_new = null;
				self.values = {};
                self.tabs.click = 0;

            }).on('themify_builder_change_mode.updatestyles', this.updateStyles.bind(this));

            setTimeout(function () {
                if (self.clicked === 'setting') {
                    self.setUpEditors();
                }
                self.callbacks();
                Themify.triggerEvent( document, 'tb_editing_' + self.type);
                /**
                 * self.type is the module slug, trigger a separate event for all modules regardless of their slug
                 */
                if ( self.component === 'module') {
                    Themify.triggerEvent( document, 'tb_editing_module');
                }
            }, 5);
            if (is_style===true) {
                model.unset('styleClicked', {silent: true});
            }
            else if (is_visible===true) {
                model.unset('visibileClicked', {silent: true});
            }
            return container;
        },
        getStyleVal(id, breakpoint,vals) {
            if (id!=='' && api.activeModel !== null) {
                if(vals===undefined){
                    vals = this.values;
                }
                if (breakpoint === undefined) {
                    breakpoint = api.activeBreakPoint;
                }
                if (breakpoint === 'desktop' || this.clicked !== 'styling') {
                    return ( vals !== null && vals[id] !== '' ) ? vals[id] : undefined;
                }
                const breakpoints = this.breakpointsReverse,
                    index = breakpoints.indexOf(breakpoint);
                for (let i = index, len = breakpoints.length; i < len; ++i) {
                    if (breakpoints[i] !== 'desktop') {
                        if (vals['breakpoint_' + breakpoints[i]] !== undefined && vals['breakpoint_' + breakpoints[i]][id] !== undefined && vals['breakpoint_' + breakpoints[i]][id] !== '') {
                            return vals['breakpoint_' + breakpoints[i]][id];
                        }
                    }
                    else if (vals[id] !== '') {
                        // Check for responsive disable
                        const binding_data = this.stylesData && undefined !== this.stylesData[id] ? this.stylesData[id]['binding'] : undefined;
                        if(undefined !== binding_data && undefined !== binding_data[vals[id]] && undefined !== binding_data[vals[id]]['responsive'] && undefined !== binding_data[vals[id]]['responsive']['disabled'] && -1 !== binding_data[vals[id]]['responsive']['disabled'].indexOf(id)){
                            return undefined;
                        }
                        return vals[id];
                    }
                }
            }
            return undefined;
        },
        updateStyles(e, prevbreakpoint, breakpoint) {
            this.setStylingValues(prevbreakpoint);
            const old_tab = this.clicked;
            this.clicked = 'styling';
            for (let k in this.stylesData) {
                let type = this.stylesData[k].type;
                if (type && type !== 'video' && type !== 'gallery' && type !== 'autocomplete' && type !== 'custom_css' && type!=='builder' && this.stylesData[k].is_responsive !== false) {
                    if (type === 'icon_radio') {
                        type = 'radio';
                    }
                    else if (type === 'icon_checkbox') {
                        type = 'checkbox';
                    }
                    else if (type === 'textarea' || type === 'icon'|| type==='hidden' || type==='number') {
                        type = 'text';
                    }
                    else if (type === 'image') {
                        type = 'file';
                    }
                    else if (type === 'padding' || type === 'border_radius') {
                        type = 'margin';
                    }
                    else if (type === 'frame') {
                        type = 'layout';
                    }
                    let v = this.getStyleVal(k);
                    this[type].update(k, v, this);
                    if (this.stylesData[k].binding !== undefined) {
                        let items = this.getEl(k),
                                res = [];
                        if (type === 'layout') {
                            res = items.getElementsByClassName('tfl-icon');
                        }
                        else if (type === 'radio' || type === 'checkbox') {
                            res = items.getElementsByTagName('input');
                        }
                        else {
                            res = [items];
                        }
                        let data = this.stylesData[k];
                        for (let i = 0, len = res.length; i < len; ++i) {
                            this.binding(res[i], data, v);
                        }
                    }
                }
            }
            //Disable responsive disable options
            const disabled_options = topWindow.document.querySelectorAll('#tb_options_styling option.responsive_disable');
            for ( let j = disabled_options.length-1;j>=0;j-- ){
                disabled_options[j].disabled = 'desktop' !== breakpoint;
            }
            this.clicked = old_tab;
        },
        setStylingValues(breakpoint) {
            const data = api.Forms.serialize('tb_options_styling', true),
                isDesktop = breakpoint === 'desktop';
            if (isDesktop===false && this.values['breakpoint_' + breakpoint] === undefined) {
                this.values['breakpoint_' + breakpoint] = {};
            }         
            for (let i in data) {
                if (isDesktop===true) {
                    this.values[i] = data[i];
                }
                else {
                    this.values['breakpoint_' + breakpoint][i] = data[i];
                }
            }
        },
        saveComponent(autoSave) {
            if(this.values!==null){
            api.saving = true;
            const self = api.Forms,
                is_module = this.component === 'module';
            if ((is_module && !self.isValidate(topWindow.document.getElementById('tb_options_setting'))) || (Common.Lightbox.$lightbox[0].getElementsByClassName('tb_disable_save')[0]!==undefined)){
                api.saving = false;
                api.beforeEvent = null;
                if(autoSave){
                    api.hasChanged=true;
                    Common.Lightbox.$lightbox.find('.tb_close_lightbox')[0].click();
                }
                return false;
            }

                Themify.body.triggerHandler('themify_builder_save_component',autoSave);
            if (api.mode === 'visual') {
                // Trigger parent iframe
                    topWindow.jQuery('body').triggerHandler('themify_builder_save_component',autoSave);
            }
            delete this.values['cid'];
            const before_settings = $.extend(true, {},(this.beforeData?this.beforeData:this.values));
            let column = false, //for the new modules of undo/redo
                k = 'styling',
                elem = document.getElementsByClassName('tb_element_cid_' + api.activeModel.cid)[0];
                if(elem===undefined){
                    elem = document.querySelector('[data-cid="'+api.activeModel.cid+'"]');
                }
            if(elem!==null){
                elem=$(elem);
			const options = self.serialize('tb_options_setting', true);
			for (let i in options) {
				this.values[i] = options[i];
			}
            if (this.component!=='column') {
				if (is_module) {
					k = 'mod_settings';
				}
                const animation = self.serialize('tb_options_animation', true);
                for (let i in animation) {
                    this.values[i] = animation[i];
                }
                const visible = self.serialize('tb_options_visibility', true);
                for (let i in visible) {
                    this.values[i] = visible[i];
                }
                if (api.mode === 'visual') {
                    if (visible['visibility_all'] === 'hide_all' || visible['visibility_desktop'] === 'hide' || visible['visibility_tablet'] === 'hide' || visible['visibility_tablet_landscape'] === 'hide' || visible['visibility_mobile'] === 'hide') {
                        elem[0].classList.add('tb_visibility_hidden');
                    }
                    else {
                        elem[0].classList.remove('tb_visibility_hidden');
                    }
                }
            }
            this.setStylingValues(api.activeBreakPoint);
            const data = {};
            data[k] = $.extend(true, {}, api.Utils.clear(this.values));
            api.activeModel.set($.extend(true, {}, data), {silent: true});
            if (is_module) {
                if (this.is_new) {
                    column = elem.closest('.module_column');
                    column.closest('.module_row').removeClass('tb_row_empty');
                    column.closest('.active_subrow').removeClass('tb_row_empty');
                    column = Common.clone(column);
                }
                api.Instances.Builder[api.builderIndex].removeLayoutButton();
            }
            let styles;
            if (api.mode === 'visual') {
                styles = $.extend(true, {}, api.liveStylingInstance.undoData);
                elem[0].classList.remove('tb_visual_hover');
                elem.find('.tb_visual_hover').removeClass('tb_visual_hover');
            }
                    if(api.ActionBar.hoverCid===api.activeModel.cid){
                        api.ActionBar.hoverCid=null;
                        api.ActionBar.clearSelected();
                    }
            api.undoManager.push(api.activeModel.cid, api.beforeEvent, elem, 'save', {bsettings: before_settings, asettings: this.values, styles: styles, 'column': column});
                }
            Common.Lightbox.close(autoSave);
            api.beforeEvent = null;
            api.saving = false;
            }
            return true;
        },
        resetStyling(e,rightClick) {
            e.preventDefault();
            e.stopPropagation();
            const context = true===rightClick?undefined:$('#tb_options_styling', ThemifyBuilderCommon.Lightbox.$lightbox)[0];
			let type = api.activeModel.get('elType');
                if(type==='module'){
                    type = api.activeModel.get('mod_name');
                }
            if(!this.beforeData){
                    this.beforeData =  $.extend(true, {}, this.values);
                    if(context!==undefined){
                        const self = this;
                        Themify.body.one('themify_builder_lightbox_before_close',function(){
                            self.beforeData = null;
                        });
                    }
                }
            // Reset GS
            if(api.GS.isGSPage===false && api.GS.activeGS===null){
                let selectedGS=null;
                if(api.GS.el!==null){
                    const tmp = api.GS.el.getElementsByClassName('tb_selected_style');
                    selectedGS=[];
                    for(let i = tmp.length-1;i>-1;--i){
                        selectedGS.push(tmp[i].getAttribute( 'data-style-id' ));
                    }
                }
                else if(this.values[api.GS.key]!==undefined){
                    if(api.mode==='visual'){
                        selectedGS = this.values[api.GS.key].split(' ');
                    }
                    delete this.values[api.GS.key];
                }
                if(selectedGS!==null){
                    if(api.GS.field!==null){
                        api.GS.field.value='';
                    }
                    api.GS.isGSPage=true;
                    for(let i = selectedGS.length-1;i>-1;--i){
                        api.GS.delete( selectedGS[i] );
                    }
                    api.GS.isGSPage=false;
                    selectedGS=null;
                    api.GS.generateValues(null,{},true);
                }
            }
            const settings = ThemifyStyles.getStyleOptions(type),
                data = {},
                undoData ={};
            if(api.mode==='visual'){
                const prefix = api.liveStylingInstance.prefix,
                    points = this.breakpointsReverse;
                for(let i=points.length-1;i>-1;--i){
                    let stylesheet =ThemifyStyles.getSheet(points[i],api.GS.activeGS!==null),
                        rules = stylesheet.cssRules ? stylesheet.cssRules : stylesheet.rules;
                    if(rules.length>0){
                        if( data[points[i]]===undefined){
                            data[points[i]] = {};
                            undoData[points[i]] = {};
                             
                        }
                        for(let j=rules.length-1;j>-1;--j){
                            if(rules[j].selectorText.indexOf(prefix)!==-1){
                                let css = rules[j].cssText.split('{')[1].split(';');
                                if(data[points[i]][j]===undefined){
                                    data[points[i]][j]={};
                                    undoData[points[i]][j]={};
                                }
                                
                                for(let k=css.length-2;k>-1;--k){
                                    let prop=css[k].trim().split(': ')[0].trim();
                                    if(rules[j].style[prop]!==undefined){
                                        let val=rules[j].style[prop];
                                            data[points[i]][j][prop]=val;
                                            undoData[points[i]][j][prop]={'a':'','b':val};
                                            rules[j].style[prop]='';
                                    }
                                }
                            }
                        }
                    }
                }
                if(type!=='module'){
                    api.liveStylingInstance.removeBgSlider();
                    api.liveStylingInstance.removeBgVideo();
                    api.liveStylingInstance.getComponentBgOverlay( type ).remove();
                    api.liveStylingInstance.bindBackgroundMode('repeat','background_repeat');
                    api.liveStylingInstance.bindBackgroundMode('repeat','b_r_h');
                    api.liveStylingInstance.$liveStyledElmt[0].removeAttribute('data-tb_slider_videos');
                    api.liveStylingInstance.$liveStyledElmt.children('.tb_slider_videos,.tb_row_frame').remove();
                }
            }
             for(let i in this.values){
                let key = i.indexOf('_color') !== -1 ? 'color' : (i.indexOf('_style') !== -1 ? 'style' : false),
                    remove=null;
                if(i.indexOf('breakpoint_')===0 || i===api.GS.key || settings[i]!==undefined ||  i.indexOf('_apply_all') !== -1){
                        remove=true;
                }
                else if (i.indexOf('_unit') !== -1) {//unit
                    key = i.replace(/_unit$/ig, '', '');
                    if (settings[key] !== undefined) {
                        remove=true;
                    }
                }
                else if (i.indexOf('_w') !== -1) {//weight
                    key = i.replace(/_w$/ig, '', '');
                    if (settings[key] !== undefined && settings[key].type === 'font_select') {
                        remove=true;
                    }
                }
                else if (key !== false) {
                    key = i.replace('_' + key, '_width');
                    if (settings[key] !== undefined && settings[key].type === 'border') {
                        remove=true;
                    }
                }
                if(remove===true){
                    delete this.values[i];
                }
            }
            if(context!==undefined){
                api.hasChanged = true;
                const items = context.getElementsByClassName('tb_lb_option');
                for(let i=items.length-1;i>-1;--i){
                    let v = items[i].value,
                        cl = items[i].classList;
                    if (v !== 'px' && v !== 'solid' && v !== 'default' && v !== 'linear' && v !== 'n' && !cl.contains('exclude-from-reset-field')) {
                        let id = items[i].getAttribute('id');
                        if(this.values[id]!==undefined){
                            delete this.values[id];
                        }		
                        if (cl.contains('tb_radio_input_container')) {
                            if (cl.contains('tb_icon_radio')) {
                                let checked = context.querySelector('[name="' + id + '"]:checked');
                                if (checked !== null) {
                                    checked.parentNode.click();
                                }
                            }
                            else {
                                let r = context.querySelector('[name="' + id + '"]');
                                if (r.checked !== true) {
                                    r.checked = true;
                                    Themify.triggerEvent(r, 'change');
                                }
                            }
                        } 
                        else if (cl.contains('tb_uploader_input')) {
                            if (v) {
                                    items[i].parentNode.getElementsByClassName('tb_clear_input')[0].click();
                            }
                        }
                        else if (cl.contains('tfminicolors-input')) {
                            let p = items[i].closest('.tfminicolors'),
                                clear = p.getElementsByClassName('tb_clear_btn')[0];
                            if (v) {
                                items[i].value='';
                                items[i].removeAttribute('data-opacity');

                                let swatch=p.getElementsByClassName('tfminicolors-swatch-color')[0];
                                swatch.style['opacity']=swatch.style['backgroundColor']='';
                                p.nextElementSibling.value='';
                            }
                            if(clear!==undefined){
                                clear.style['display']='none';
                            }
                        }
                        else if (v && items[i].tagName === 'SELECT') {
                            if (cl.contains('font-family-select')) {
                                items[i].value = '';
                            }
                            else if (cl.contains('font-weight-select')) {
                                items[i].value = '';
                                while (items[i].firstChild) {
                                    items[i].removeChild(items[i].lastChild);
                                }
                                this.font_select.updateFontVariant('', items[i], this);
                            }
                            else if (cl.contains('tb_unit')) {
                                items[i].value = cl.contains('tb_frame_unit') ? '%' : 'px';
                            } else {
                                if ((v === 'repeat' && id === 'background_repeat') || (v === 'scroll' && id === 'background_attachment') || (v === 'left top' && id === 'background_position')) {
                                    continue;
                                }
                                items[i].selectedIndex = 0;
                            }
                            if (!cl.contains('themify-gradient-type')) {
                                Themify.triggerEvent(items[i], 'change');
                            }
                        }
                        else if (cl.contains('themify-layout-icon')) {
                            let f = items[i].getElementsByClassName('tfl-icon')[0];
                            if (!f.classList.contains('selected')) {
                                f.click();
                            }
                        }
                        else if(cl.contains('tb_row_js_wrapper')){
                            let repeat = items[i].getElementsByClassName('tb_repeatable_field');
                            for(let j=repeat.length-1;j>-1;--j){
                                repeat[j].remove();
                            }
                            items[i].getElementsByClassName('add_new')[0].click();
                        }else if(cl.contains('tb_angle_input') && cl.contains('tb_transform_field')){
                            items[i].value = '';
                        }
                        else {
                            if (!cl.contains('tb_angle_input')) {

                                if (cl.contains('themify-gradient')) {
                                    items[i].nextElementSibling.click();
                                }
                                else{ 
                                    items[i].value = '';
                                    Themify.triggerEvent(items[i], cl.contains('tb_range') ? 'keyup' : 'change');
                                }
                            }   
                            else {
                                items[i].value = '180';
                            }
                        }
                    }
                }
                if(api.mode==='visual'  && !e.isTrigger){
                    api.liveStylingInstance.tempData = data; 
                    api.liveStylingInstance.undoData = undoData;
                }
            }
            return undoData;
        },
        create(data) {
            const content = document.createDocumentFragment();
            if (data===undefined || data.length === 0) {
                const info = document.createElement('div'),
                    infoText = document.createElement('p');
                    infoText.textContent = themifyBuilder.i18n.no_op_module;
                    info.appendChild(infoText);
                    content.appendChild(info);
                    return content;
            }
            if (data.type === 'tabs') {
                content.appendChild(this.tabs.render(data, this));
            }
            else {
                for (let i in data) {
                    if (data[i].hide === true || data[i].type===undefined || ('visibility'===this.clicked && 'row'===this.component && 'sticky_visibility'===data[i].id)) {
                        continue;
                    }
                    let type=data[i].type,
						res = this[type].render(data[i], this);
                
                    if (type!== 'separator' && type!== 'expand' && type!== 'group') {
                        let id = data[i].id?data[i].id:data[i].topId;
                        if (type!== 'tabs' && type!== 'multi' && type!== 'margin_opposity') {
							if(id){
								if (this.clicked === 'styling') {
									if (api.mode === 'visual' && data[i].prop !== undefined) {
										this.styles[id] = $.extend(true, {}, data[i]);
									}
									this.stylesData[id] = $.extend(true, {}, data[i]);
								}
								else if (api.mode === 'visual' && this.clicked === 'setting' && this.values !== null && this.values[id] !== undefined && this.is_repeat !== true) {
									this.settings[id] = this.values[data[i].id];
									if (data[i]['units'] !== undefined && this.values[id + '_unit'] !== undefined) {
										this.settings[id + '_unit'] = this.values[id + '_unit'];
									}
								}
							}
                        }
                        if (type!=='hook_content' && type!=='slider' && type!=='builder' && type!=='tooltip' && type!=='custom_css_id') {
                            let field = document.createElement('div');
                            field.className = 'tb_field';
                            if ( data[i]['dc'] !== undefined && ! data[i].dc ) {
                                field.className += ' tb_disable_dc';
                            }
                            field.setAttribute( 'data-type', type );
                            if (id !== undefined) {
                                field.className += ' ' + id;
                            }
                            if (data[i].wrap_class !== undefined) {
                                field.className += ' ' + data[i].wrap_class;
                            }
                            if(type==='toggle_switch'){
                                field.className+= ' switch-wrapper';
                            }
                            else if (type === 'slider') {
                                field.className += ' tb_slider_options';
                            }
                            else if (type=== 'message' && data[i].hideIf !== undefined && new Function('return ' + data[i].hideIf ) ) {
                                field.className += ' tb_hide_option';
                            }
                            else  if(data[i]['required']!==undefined && this.clicked === 'setting'){// validation rules
                                let rule = data[i].required['rule']!==undefined?data[i].required['rule']:'not_empty',
                                    msg = data[i].required['message']!==undefined?data[i].required['message']:themifyBuilder.i18n.not_empty;
                                field.setAttribute('data-validation',rule);
                                field.setAttribute('data-error-msg',msg);
                                field.className+=' tb_must_validate';
                            }
                            if (this.clicked === 'styling' && data[i].is_responsive === false) {
                                field.className += ' responsive_disable';
                            }
                            
                            let txt = this.getTitle(data[i]);
                            if (txt !== false) {
                                txt = txt.trim();
                                let label = document.createElement('div'),
                                    labelText = document.createElement('span');
                                    label.className = 'tb_label';
                                    labelText.className = 'tb_label_text';
                                    labelText.textContent = txt;
                                    label.appendChild(labelText);
                                if ( txt=== '' ) {
                                    label.className += ' tb_empty_label';
                                }
                                
                                if(data[i]['help']!==undefined && data[i]['label'] !== '' ){
                                    label.classList.add('contains-help');
                                    labelText.appendChild(this.help(data[i]['help']));
                                }
                                field.appendChild(label);
                                if (type !== 'multi') {
                                    let input = document.createElement('div');
                                    input.className = 'tb_input';
                                    input.appendChild(res);
                                    field.appendChild(input);
                                }
                                else {
                                    field.appendChild(res);
                                }
                            }
                            else {
                                field.appendChild(res);
                            }
                            content.appendChild(field);
                        }
                        else {
                            content.appendChild(res);
                        }
                    }
                    else {
                        content.appendChild(res);
                    }
                }
            }
			data=null;
            return content;
        },
        tabs: {
            click: 0,
            render(data, self) {
                const items = data.options,
                    tabs_container = document.createDocumentFragment(),
                    ul = document.createElement('ul'),
                    stickyWraper=(self.clicked === 'styling' && this.click===0 && self.component === 'module')?document.createElement('div'):null,
                    tabs = document.createElement('div'),
                    isRadio=data['isRadio']!==undefined;
                let v=null,
                    first = null;
                tabs.className = 'tb_tabs';
				ul.className = 'tb_tab_wrapper tf_scrollbar tf_clearfix';
                ++this.click;
                
              
                if (isRadio===true) {
                    if(self.values[data.id]!==undefined && self.values[data.id] !== ''){
                        first=true;
                        v=self.values[data.id];
                    }
                    ul.className+= ' tb_radio_input_container';
                    if (self.is_repeat === true) {
                        ul.className +=self.is_sort===true?' tb_lb_sort_child':' tb_lb_option_child';
                        ul.dataset['inputId'] = data.id;
                    }
                    else {
                        ul.className += ' tb_lb_option';
                        ul.id = data.id;
                    }
                }
                for (let k in items) {
                    let li = document.createElement('li'),
                        a = isRadio===true?document.createElement('label'):document.createElement('a'),
                        div = document.createElement('div'),
                        id = items[k].href!==undefined?items[k].href:('tb_' + this.click + '_' + k),
						opt=items[k].options;

                    div.id = id;
                    div.className = 'tb_tab';
                    if(items[k].label!==''){
						a.textContent = items[k].label !== undefined ? items[k].label : self.label[k];
					}
					if(items[k].icon!==undefined){
						a.appendChild(api.Utils.getIcon(items[k].icon));
					}
					if(items[k].title!==undefined){
						a.title=items[k].title;
					}
					if(items[k].class!==undefined && items[k].class!==''){
						a.className=items[k].class;
					}
                    if(isRadio===true){
                        let input = document.createElement('input');
                            input.type = 'radio';
                            input.className = 'tb_radio_tab_input';
                            input.name = data.id;
                            if(v===k || v==='tb_'+k){
                                input.checked = true;
                            }
                            input.value=k;
                            a.setAttribute('href','#' + id);
                            a.className = 'tb_radio_tab_label';
                            a.appendChild(input);
                    }
                    else{
                        a.href = '#' + id;
                    }
                    if ( first === null || v===k || v==='tb_'+k) {
                        first = true;
                        li.className = 'current';
                        div.appendChild(self.create(opt));
						opt=null;
                        div.style.display = 'block';

                    }else {
						div.addEventListener('themify_builder_tabsactive', function() {
							this.appendChild(self.create(opt));
							if ( self.clicked === 'setting' ) {
								self.setUpEditors();
							}
							self.callbacks();
							opt=null;
						}, {once: true, passive: true});
                    }
                    a.addEventListener('click', self.switchTabs);
                    li.appendChild(a);
                    ul.appendChild(li);
                    tabs_container.appendChild(div);
                }
                if(stickyWraper!==null){
                    stickyWraper.className='tb_styling_tab_nav';
                    stickyWraper.appendChild(ul);
                    tabs.appendChild(stickyWraper);
                }
                else{
                    tabs.appendChild(ul);
                }
                tabs.appendChild(tabs_container);
                setTimeout(self.callbacks.bind(self), 5);
                return tabs;
            }
        },
        group: {
            render(data, self) {
                const wr = document.createElement('div'),
					display = data.display || '',
					options = self.create( data.options );
                if (data.wrap_class !== undefined) {
                    wr.className = data.wrap_class;
                }
				wr.classList.add( 'tb_field_group' );
				if ( display === 'accordion' ) {
					wr.classList.add( 'tb_field_group_acc' );
					const label = document.createElement( 'div' ),
						content = document.createElement( 'div' ),
						icon = api.Utils.getIcon( 'ti-angle-up' );
					label.textContent = data.label;
					label.className = 'tb_style_toggle tb_closed';
					label.appendChild( icon );
					content.className = 'tf_hide tb_field_group_content';
					content.appendChild( options );
					label.addEventListener( 'click', function() {
						$( content ).slideToggle();
						label.classList.toggle( 'tb_closed' );
					} );
					wr.appendChild( label );
					wr.appendChild( content );
				} else {
					wr.appendChild( options );
				}
                return wr;
            }
        },
        builder: {
            render(data, self) {
                self.is_repeat = true;
                const fr=document.createDocumentFragment(),
					wrapper = document.createElement('div'),
                    add_new = document.createElement('a'),
                    _this = this;
                wrapper.className = 'tb_row_js_wrapper tf_rel tb_lb_option';
                if (data.wrap_class !== undefined) {
                    wrapper.className += ' ' + data.wrap_class;
                }
                wrapper.id = data.id;
                add_new.className = 'add_new tf_plus_icon tb_icon_btn';
                add_new.href = '#';
                add_new.textContent = data.new_row !== undefined ? data.new_row : self.label.new_row;
                if (self.values[data.id] !== undefined) {
                    const values = self.values[data.id].slice(),
                        orig = $.extend(true, {}, self.values);
                    for (let i = 0, len = values.length; i < len; ++i) {
                        self.values = values[i] || {};
                        wrapper.appendChild(this.builderFields(data, self));
                    }
                    self.values = orig;
                }
                else {
                    wrapper.appendChild(this.builderFields(data, self));
                }
                wrapper.appendChild(add_new);
                fr.appendChild(wrapper);
                setTimeout(function () {
                    _this.sortable(wrapper, self);
                    add_new.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        self.is_repeat = true;
                        const item = _this.builderFields(data, self),
						container=this.previousElementSibling.parentNode;
                        container.insertBefore( item, add_new );
                        setTimeout(function () {
                            if (self.clicked === 'setting') {
                                self.setUpEditors();
                            }
                            self.callbacks();
                            Themify.triggerEvent( document, 'tb_repeatable_add_new', [ item ] );
                        }, 5);
                        self.control.preview(container, null, {repeat: true});
                        self.is_repeat = null;
                    });
                },2000);
                self.is_repeat = null;
                return fr;
            },
            builderFields(data, self) {
                const repeat = document.createElement('div'),
                    top = document.createElement('div'),
                    menu = document.createElement('div'),
                    icon = document.createElement('div'),
                    ul = document.createElement('ul'),
                    _duplicate = document.createElement('li'),
                    _delete = document.createElement('li'),
                    toggle = document.createElement('div'),
                    content = document.createElement('div'),
                    _this = this;

                repeat.className = 'tb_repeatable_field tf_clearfix';
                top.className = 'tb_repeatable_field_top';
                menu.className = 'row_menu';
                icon.tabIndex='-1';
                icon.className = 'menu_icon';
                ul.className = 'tb_down';
                _duplicate.className = 'tb_duplicate_row';
                _delete.className = 'tb_delete_row tf_close';
                _duplicate.textContent = self.label.duplicate;
                _delete.textContent = self.label.delete;
                toggle.className = 'toggle_row';
                content.className = 'tb_repeatable_field_content';
                

                content.appendChild(self.create(data.options));
                ul.appendChild(_duplicate);
                ul.appendChild(_delete);
                menu.appendChild(icon);
                menu.appendChild(ul);
                top.appendChild(menu);
                top.appendChild(toggle);
                repeat.appendChild(top);
                repeat.appendChild(content);
				top.addEventListener('click',function(e){
					e.stopPropagation();
					e.preventDefault();
					const cl =  e.target.classList,
					repeatContainer=this.parentNode;
					if(cl.contains('tb_delete_row')){
						if (confirm(themifyBuilder.i18n.rowDeleteConfirm)) {
							const  p = e.target.closest('.tb_row_js_wrapper');
							_this.delete(e.target);
							self.control.preview(p, null, {repeat: true});
							Themify.triggerEvent(p, 'delete');
						}
					}
					else if(cl.contains('tb_duplicate_row')){
						self.is_repeat = true;
						const orig = $.extend(true, {}, self.values);
						self.values = api.Forms.serialize(repeatContainer, true, true);
						const item = _this.builderFields(data, self);
						repeatContainer.parentNode.insertBefore(item, repeatContainer.nextElementSibling);
						self.values = orig;
						setTimeout(function () {
							if (self.clicked === 'setting') {
								self.setUpEditors();
							}
							self.callbacks();
							Themify.triggerEvent(repeatContainer.parentNode, 'duplicate');
							Themify.triggerEvent( document, 'tb_repeatable_duplicate', [item] );
						}, 5);
						self.control.preview(repeatContainer, null, {repeat: true});
						self.is_repeat = null;
					}
					else if(cl.contains('toggle_row')){
						_this.toggle(e.target);
					}
					if(!cl.contains('menu_icon')){
						api.Utils.hideOnClick(ul);
					}
				});
               
                return repeat;
            },
            sortable(el, self) {
                const ev = api.Utils.getMouseEvents();
				
				el.addEventListener(ev['mousedown'], function (e) {
					if ((e.type==='touchstart' || e.which === 1) && e.target.classList.contains('tb_repeatable_field_top')) {
						e.stopImmediatePropagation();
						let timer,
						  timeout,
							theLast,
							dir,
							toggleCollapse,
							prevY=0,
							holder,
							holderHeight,
							scrollbar,
							editors={},
							doc=this.ownerDocument,
							item=e.target.closest('.tb_repeatable_field'),
							viewMin,
							viewMax,
							parentHeight,
							isWorking=false,
							parentNode;
						const draggableCallback = function (e) {
						        
							e.stopImmediatePropagation();
							if(timer){
								cancelAnimationFrame(timer);
							}
							timer=requestAnimationFrame(function(){
								if(!doc){
									return;
								}
								const x=e.touches?e.touches[0].clientX:e.clientX,
									y=e.touches?e.touches[0].clientY:e.clientY,
									moveTo=e.type==='mousemove'?e.target:doc.elementFromPoint(x, y),
									clientY=y-holderHeight-parentNode.getBoundingClientRect().top;
								if(clientY>0 && clientY<parentHeight){
									holder.style['transform']= 'translateY('+clientY+'px)';
									scrollDrag(y);
									if(y>=viewMax || y<=viewMin){
										return;
									}
									if( moveTo && moveTo!==item && moveTo.classList.contains('tb_repeatable_field')){
										const side = y>prevY? 'bottom' : 'top';
										if(dir!==side || theLast!==moveTo){
											item.style['display']='none';
											side==='bottom'?moveTo.after(item):moveTo.before(item); 
											item.style['display']='';
										}
										theLast=moveTo;
										dir = side;
									}
									prevY=y;
								}
								else{
									scrollDrag(y);
								}
							});
						},
						scrollDrag=function(y){
						        if(!scrollbar){
									return;
						        }
                                if(y>=viewMax || y<=viewMin){
									if(isWorking===false){
                                        isWorking=true;
                                        const k=parseInt(viewMax/10);
                                        scrollbar.scrollTop+=y<=viewMin?(-1)*k:k;
										if(timeout){
											clearTimeout(timeout);
										}
										timeout=setTimeout(function(){
											requestAnimationFrame(function(){
												if(isWorking){
													isWorking=false;
													scrollDrag(y);
												}
											});
										},k*2);
									}
                                }
                                else{
									if(timeout){
										clearTimeout(timeout);
									}
									isWorking=false;
                                }
						},
						startDrag=function(e){
							doc.body.classList.add('tb_start_animate','tb_move_drag');
                            api.Utils.hideOnClick(item.getElementsByClassName('tb_down')[0]);
                            parentNode=item.parentNode;
							parentNode.classList.add('tb_sort_start');
                            if ( typeof tinyMCE !== 'undefined' ) {
								const items = parentNode.getElementsByClassName('tb_lb_wp_editor');
								for (let i = items.length - 1; i > -1; --i) {
									let id = items[i].id;
									editors[id] = tinymce.get(id).getContent();
									tinyMCE.execCommand('mceRemoveEditor', false, id);
								}
							}
							if (!item.classList.contains('collapsed')) {
								item.getElementsByClassName('tb_repeatable_field_content')[0].style['display']='none';
								item.classList.add('collapsed');
								toggleCollapse = true;
							}
							holder=item.cloneNode(true);
							holder.getElementsByClassName('tb_repeatable_field_content')[0].remove();
							scrollbar=item.closest('.tf_scrollbar');
							holder.className+=' tb_sort_handler';
							item.classList.add('tb_current_sort');
							item.after(holder);
                            holderHeight=holder.getBoundingClientRect().height/2;
							parentHeight=parentNode.offsetHeight;
							const box=scrollbar.getBoundingClientRect();
							viewMin=box.top;
							viewMax=box.bottom-40;
							draggableCallback(e);
						};
						doc.addEventListener(ev['mouseup'], function(e){
							this.removeEventListener(ev['mousemove'], startDrag,{passive: true,once:true});
							this.removeEventListener(ev['mousemove'], draggableCallback, {passive: true});
							
							if(parentNode){
								e.stopImmediatePropagation();
								if(timer){
									cancelAnimationFrame(timer);
								}
								if(timeout){
									clearTimeout(timeout);
								}
								if(holder){
									holder.remove();
								}
								if ( typeof tinyMCE !== 'undefined' ) {
									for (let id in editors) {
										tinyMCE.execCommand('mceAddEditor', false, id);
										tinymce.get(id).setContent(editors[id]);
									}
								}
								item.classList.remove('tb_current_sort');
								if (toggleCollapse) {
									item.classList.remove('collapsed');
									item.getElementsByClassName('tb_repeatable_field_content')[0].style['display']='';
								}
								requestAnimationFrame(function(){
									self.control.preview(parentNode, null, {repeat: true});
									Themify.triggerEvent(parentNode, 'sortable');
									parentNode.classList.remove('tb_sort_start');
									parentNode=null;
								});
							}
							this.body.classList.remove('tb_start_animate','tb_move_drag');
							theLast=holder=toggleCollapse=dir=prevY=editors=scrollbar=doc=parentHeight=holderHeight=isWorking=viewMin=viewMax=item=timer=timeout=null;
						}, {passive: true,once:true});
						
						doc.addEventListener(ev['mousemove'], startDrag,{passive: true,once:true});
						doc.addEventListener(ev['mousemove'], draggableCallback, {passive: true});
					}
				},{passive:true});
            },
            toggle(el) {
                $(el).closest('.tb_repeatable_field').toggleClass('collapsed').find('.tb_repeatable_field_content').slideToggle();
            },
            delete(el) {
                const item = el.closest('.tb_repeatable_field');
                Themify.triggerEvent( document, 'tb_repeatable_delete', [item] );
                item.remove();
            }
        },
        accordion:{
            expand(item, data, self) {
                item.addEventListener('click', function (e) {
                    let wrap = this.getElementsByClassName('tb_accordion_fields_options')[0];
                    if (wrap === undefined) {
                        wrap = document.createElement('div');
                        wrap.style['display'] = 'none';
                        wrap.className = 'tb_toggleable_fields_options tb_accordion_fields_options';
                        self.is_repeat = true;
                        let orig = null;
                        const pid = this.parentNode.closest('.tb_accordion_fields').id,
                            id = this.getAttribute('data-id');
                        if (self.values[pid] !== undefined && self.values[pid][id] !== undefined && self.values[pid][id]['val'] !== undefined) {
                            orig = $.extend(true, {}, self.values);
                            self.values = self.values[pid][id]['val'];
                        }
                        wrap.appendChild(self.create(data['options']));
                        this.appendChild(wrap);
                        if (self.clicked === 'setting') {
                            self.setUpEditors();
                        }
                        self.callbacks();
                        if (orig !== null) {
                            self.values = orig;
                        }
                        self.is_repeat = orig = null;
                    } else if (wrap.contains(e.target)) {
                        return;
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    if (this.classList.contains('tb_closed')) {
                        $(wrap).slideDown(function () {
                            this.parentNode.classList.remove('tb_closed');
                        });
                    } else {
                        $(wrap).slideUp(function () {
                            this.parentNode.classList.add('tb_closed');
                        });
                    }
                });
            },
            resetMotion(item,self) {
                if (self.values['motion_effects']!==undefined) {
                    for (let prop in self.values.motion_effects) {
                        self.values.motion_effects[prop].val = {};
                        self.values.motion_effects[prop].val[prop + '_dir']='';
                    }
                }
                const tab = item.parentNode.querySelector('#motion_effects'),
                    select = tab.getElementsByTagName('select'),
                    boxes = tab.getElementsByClassName('tb_position_box_wrapper'),
                    sliders = tab.getElementsByClassName('tb_slider_wrapper');
                for (let i = select.length-1;i>-1; --i) {
                    select[i].selectedIndex = 0;
                }
                for (let i = boxes.length-1;i>-1; --i) {
                    boxes[i].querySelector('input').value = '50,50';
                    boxes[i].querySelector('.tb_position_box_handle').setAttribute('style', 'left:50%;top:50%;');
                } 
                for (let i = sliders.length-1;i>-1; --i) {
                    let sui=sliders[i].getElementsByClassName('tb_slider_label_u')[0],
                        handlers = sliders[i].getElementsByClassName('ui-slider-handle'),
                        input=sliders[i].getElementsByTagName('input')[0],
                        label=sliders[i].getElementsByClassName('tb_slider_label_l')[0];
                    if (sui) {
                        input.value = '0,100';
                        handlers[0].setAttribute('style', 'left:0%;');
                        handlers[1].setAttribute('style', 'left:100%;');
                        sliders[i].getElementsByClassName('ui-slider-range')[0].setAttribute('style', 'left:0%;width:100%;');
                        label.textContent = '0%';
                        sui.textContent = '100%';
                    } else {
                        input.value = '5';
                        handlers[0].setAttribute('style', 'left:50%;');
                        label.textContent = '5';
                    }
                }
            },
            render(data, self) {
                const _this = this,
                    ul = document.createElement('ul'),
                    fr=document.createDocumentFragment(),
                    resetEf = document.createElement('a');
                ul.id = data.id;
                ul.className = 'tb_toggleable_fields tb_accordion_fields tb_lb_option';
                if (data.id === 'motion_effects' && self.values) {
                    if(self.values.hasOwnProperty('custom_parallax_scroll_speed')) {
                            if(!self.values.hasOwnProperty('motion_effects')) {
                                self.values['motion_effects'] = {
                                    v: {
                                        val: {
                                            v_speed: self.values['custom_parallax_scroll_speed'],
                                            v_dir: ''
                                        }
                                    },
                                    h: { val: {} },
                                    t: { val: {
                                        t_speed: ''
                                        } },
                                    r: { val: {} },
                                    s: { val: {} }
                                };
                                delete self.values['custom_parallax_scroll_speed'];
                            }
                        if (self.values.hasOwnProperty('custom_parallax_scroll_reverse')) {
                            self.values['motion_effects']['v']['val']['v_dir'] = 'down';
                            delete self.values['custom_parallax_scroll_reverse'];
                        } else {
                            self.values['motion_effects']['v']['val']['v_dir'] = 'up';
                        }
                        if (self.values.hasOwnProperty('custom_parallax_scroll_fade')) {
                            self.values['motion_effects']['t']['val']['t_speed'] = self.values['custom_parallax_scroll_speed'];
                            delete self.values['custom_parallax_scroll_fade'];
                        }
                    }
                }
                const opt = self.values[data.id],
                create = function (id, item) {
                    const li = document.createElement('li'),
                        input = document.createElement('input'),
                        title = document.createElement('div');
                    title.textContent = data['options'][id].label;
                    title.className = 'tb_toggleable_fields_title tb_accordion_fields_title tf_plus_icon';
                    input.type = 'hidden';
                    input.value = '';
                    li.className = 'tb_closed';
                    li.setAttribute('data-id', id);
                    if (item['val'] !== undefined) {
                        input.value = JSON.stringify(item['val']);
                    }
                    li.appendChild(input);
                    li.appendChild(title);
                    _this.expand(li, data['options'][id], self);
                    ul.appendChild(li);
                };
                if (opt !== undefined) {
                    for (let id in opt) {
                        if (data['options'][id] !== undefined) {
                            create(id, opt[id]);
                        }
                    }
                }
                for (let id in data['options']) {
                    if (opt === undefined || opt[id] === undefined) {
                        create(id, data['options'][id]);
                    }
                }
                          
                fr.appendChild(ul);
                if(data.id === 'motion_effects'){
                    resetEf.href = '#';
                    resetEf.className = 'tb_motion_reset_link';
                    resetEf.textContent=self.label.reset_effect;
                    resetEf.addEventListener('click',function(e){
                            e.preventDefault();
                            e.stopPropagation();
                            _this.resetMotion(this,self);
                    } );
                    fr.appendChild(resetEf);
                }
                return fr;
            }
        },
        toggleable_fields:{
            sort(el,self){
                const ev = api.Utils.getMouseEvents();
				el.addEventListener(ev['mousedown'], function (e) {
					if ((e.type==='touchstart' || e.which === 1) && (e.target.parentNode===this || e.target.parentNode.parentNode===this)) {
						e.stopImmediatePropagation();
						let timer,
							timeout,
							theLast,
							dir,
							toggleCollapse,
							prevY=0,
							holder,
							holderHeight,
							scrollbar,
							editors={},
							doc=this.ownerDocument,
							item=e.target.closest('.tb_toggleable_item'),
							viewMin,
							viewMax,
							parentHeight,
							isWorking=false,
							parentNode;
						const draggableCallback = function (e) {
						        
							e.stopImmediatePropagation();
							if(timer){
								cancelAnimationFrame(timer);
							}
							timer=requestAnimationFrame(function(){
								if(!doc){
									return;
								}
								const x=e.touches?e.touches[0].clientX:e.clientX,
									y=e.touches?e.touches[0].clientY:e.clientY,
									moveTo=e.type==='mousemove'?e.target:doc.elementFromPoint(x, y),
									clientY=y-holderHeight-parentNode.getBoundingClientRect().top;
								if(clientY>0 && clientY<parentHeight){
									holder.style['transform']= 'translateY('+clientY+'px)';
									scrollDrag(y);
									if(y>=viewMax || y<=viewMin){
										return;
									}
									if( moveTo && moveTo!==item && moveTo.classList.contains('tb_toggleable_item')){
										const side = y>prevY? 'bottom' : 'top';
										if(dir!==side || theLast!==moveTo){
											item.style['display']='none';
											side==='bottom'?moveTo.after(item):moveTo.before(item); 
											item.style['display']='';
										}
										theLast=moveTo;
										dir = side;
									}
									prevY=y;
								}
								else{
									scrollDrag(y);
								}
							});
						},
						scrollDrag=function(y){
						        if(!scrollbar){
									return;
						        }
                                if(y>=viewMax || y<=viewMin){
									if(isWorking===false){
                                        isWorking=true;
                                        const k=parseInt(viewMax/10);
                                        scrollbar.scrollTop+=y<=viewMin?(-1)*k:k;
										if(timeout){
											clearTimeout(timeout);
										}
										timeout=setTimeout(function(){
											requestAnimationFrame(function(){
												if(isWorking){
													isWorking=false;
													scrollDrag(y);
												}
											});
										},k*2);
									}
                                }
                                else{
									if(timeout){
										clearTimeout(timeout);
									}
									isWorking=false;
                                }
						},
						startDrag=function(e){
							doc.body.classList.add('tb_start_animate','tb_move_drag');
                            parentNode=item.parentNode;
							parentNode.classList.add('tb_sort_start');
                            if ( typeof tinyMCE !== 'undefined' ) {
								const items = parentNode.getElementsByClassName('tb_lb_wp_editor');
								for (let i = items.length - 1; i > -1; --i) {
									let id = items[i].id;
									editors[id] = tinymce.get(id).getContent();
									tinyMCE.execCommand('mceRemoveEditor', false, id);
								}
							}
							if (!item.classList.contains('tb_closed')) {
								const opt= item.getElementsByClassName('tb_toggleable_fields_options')[0];
								if(opt){
									opt.style['display']='none';
								}
								item.classList.add('tb_closed');
								toggleCollapse = true;
							}
							holder=item.cloneNode(true);
							const opt= holder.getElementsByClassName('tb_toggleable_fields_options')[0];
							if(opt){
								opt.remove();
							}
							scrollbar=item.closest('.tf_scrollbar');
							holder.className+=' tb_sort_handler';
							item.classList.add('tb_current_sort');
							item.after(holder);
                            holderHeight=holder.getBoundingClientRect().height/2;
							parentHeight=parentNode.offsetHeight;
							const box=scrollbar.getBoundingClientRect();
							viewMin=box.top;
							viewMax=box.bottom-40;
							draggableCallback(e);
						};
						doc.addEventListener(ev['mouseup'], function(e){
							this.removeEventListener(ev['mousemove'], startDrag,{passive: true,once:true});
							this.removeEventListener(ev['mousemove'], draggableCallback, {passive: true});
							
							if(parentNode){
								e.stopImmediatePropagation();
								if(timer){
									cancelAnimationFrame(timer);
								}
								if(timeout){
									clearTimeout(timeout);
								}
								if(holder){
									holder.remove();
								}
								if ( typeof tinyMCE !== 'undefined' ) {
									for (let id in editors) {
										tinyMCE.execCommand('mceAddEditor', false, id);
										tinymce.get(id).setContent(editors[id]);
									}
								}
								item.classList.remove('tb_current_sort');
								if (toggleCollapse) {
									const opt= item.getElementsByClassName('tb_toggleable_fields_options')[0];
									if(opt){
										opt.style['display']='';
									}
									item.classList.remove('tb_closed');
								}
								requestAnimationFrame(function(){
									self.control.preview(parentNode, null, {repeat: true});
									Themify.triggerEvent(parentNode, 'sortable');
									parentNode.classList.remove('tb_sort_start');
									parentNode=null;
								});
							}
							this.body.classList.remove('tb_start_animate','tb_move_drag');
							theLast=holder=toggleCollapse=dir=prevY=editors=scrollbar=doc=parentHeight=isWorking=holderHeight=viewMin=viewMax=item=timer=timeout=null;
						}, {passive: true,once:true});
						
						doc.addEventListener(ev['mousemove'], startDrag,{passive: true,once:true});
						doc.addEventListener(ev['mousemove'], draggableCallback, {passive: true});
					}
				}, {passive: true});
            },
            expand(item,data,self){
                item.addEventListener('click', function (e) {
                    if(!this.classList.contains('tb_toggleable_field_disabled') && !e.target.closest('.switch-wrapper')){
                        let wrap = this.getElementsByClassName('tb_toggleable_fields_options')[0];
                        if(!wrap){
                            wrap =  document.createElement('div');
                            wrap.style['display']='none';
                            wrap.className='tb_toggleable_fields_options tf_box tf_clear';
                            this.appendChild(wrap);
                            self.is_repeat = true;
                            let pid = this.closest('.tb_toggleable_fields').id,
                                orig=null,
                                id=this.getAttribute('data-id');
                            if(self.values[pid]!==undefined && self.values[pid][id]!==undefined && self.values[pid][id]['val']!==undefined){
                                orig = $.extend(true, {}, self.values);
                                self.values = self.values[pid][id]['val'];
                            }
							
                            wrap.appendChild(self.create(data['options']));
                            if (self.clicked === 'setting') {
                                self.setUpEditors();
                            }
                            self.callbacks();
                            if(orig!==null){
                                self.values = orig;
                            }
                            self.is_repeat = null;
                        }
                        else if(wrap.contains(e.target)){
                            return;
                        }
                        e.stopPropagation();
                        e.preventDefault();
                        if(this.classList.contains('tb_closed')){
                            $(wrap).slideDown(function(){
                                this.parentNode.classList.remove('tb_closed');
                            });
                        }
                        else{
                            $(wrap).slideUp(function(){
                                this.parentNode.classList.add('tb_closed');
                            });
                        }
                    } else if(!e.target.closest('.tb_toggleable_fields_options')) {
                        const wrap = this.getElementsByClassName('tb_toggleable_fields_options')[0];
                        $(wrap).slideUp(function(){
                            this.parentNode.classList.add('tb_closed');
                        });
                    }
                });
            },
            disable(el,self){
                const item = el.closest('li'),
                    cl=item.classList;
                if(!el.checked){
                    cl.add('tb_toggleable_field_disabled','tb_closed');
                }
                else{
                    cl.remove('tb_toggleable_field_disabled');
                }
                self.control.preview(item.parentNode, null, {repeat: true});
            },
            render(data,self){
                const _this = this,
                    ul = document.createElement('ul');
                    ul.className='tb_toggleable_fields tf_rel';
                    if (self.is_repeat === true) {
                        ul.dataset['inputId'] = data.id;
                        ul.className += ' tb_lb_option_child';
                    }
                    else {
                        ul.id = data.id;
                        ul.className += ' tb_lb_option';
                    }
                    
                    const oldRepeat = self.is_repeat,
                        opt = self.values[data.id];
                    self.is_repeat = true;
                    const create = function(id,item){
							const toogleSwitch = {
								type:'toggle_switch',
								id:'',
								options:{
									'on':{
										'name':'1',
										'value' : self.label['s']
									},
									'off':{
										'name':'0',
										'value' : self.label['hi']
									}
								},
								'default':item['on']==='1'?'on':'off',
								control:false
							},
							li=document.createElement('li'),
                            input=document.createElement('input'),
                            title = document.createElement('div'),
                            switcher = self.create([toogleSwitch]);
                            title.innerHTML += data['options'][id].label;
                            title.className='tb_toggleable_fields_title tf_plus_icon';
                            input.type='hidden';
                            input.value ='';
                            li.className='tb_toggleable_item tb_closed';
                            if(toogleSwitch['default']==='off'){
                                li.className+=' tb_toggleable_field_disabled';
                            }
                            li.setAttribute('data-id',id);
                            if(item['val']!==undefined){
                                input.value =JSON.stringify(item['val']);
                            }
                            switcher.querySelector('.toggle_switch').addEventListener('change',function(e){
                                e.stopPropagation();
                                _this.disable(this,self);
                            },{passive:true});
                            li.appendChild(input);
                            li.appendChild(title);
                            li.appendChild(switcher);
                           _this.expand(li,data['options'][id],self);
                            ul.appendChild(li);
                    };
                    if(opt!==undefined){
                        for(let id in opt){
                            if(data['options'][id]!==undefined){
                                create(id,opt[id]);
                            }
                        }
                    }
					
                    for(let id in data['options']){
                        if(opt[id]===undefined){
                            create(id,data['options'][id]);
                        }
                    }
					_this.sort(ul,self);
                    self.is_repeat = oldRepeat;
                    return ul;
            }
        },
        sortable_fields:{
			/* options shared across all types in the sortable */
			getGlobalOptions( self ) {
				return [
					{   'id' : 'icon',
						'type' : 'icon',
						'label' :self.label['icon']
					},
					{
						'id' : 'before',
						'type' : 'text',
						'label' : self.label['b_t']
					},
					{
						'id' : 'after',
						'type' : 'text',
						'label' : self.label['a_t']
					}
                ];
			},
            getDefaults(type,self){
                const _defaults = {
                    date:[
                        {
                          'id' : 'format',
                          'type' : 'select',
                          'label' :self.label['d_f'],
                          'default' :'def',
                          'options' : {
                              'F j, Y' : self.label['F_j_Y'],
                              'Y-m-d' :self.label['Y_m_d'],
                              'm/d/Y' : self.label['m_d_Y'],
                              'd/m/Y' : self.label['d_m_Y'],
                              'def' : self.label['def'],
                              'custom' : self.label['cus']
                          },
                          'binding' : {
                              'not_empty':{'hide':'custom'},
                              'custom':{'show':'custom'}
                          }
                        },
                        {
                            'id' : 'custom',
                            'type' : 'text',
                            'control':{'event':'change'},
                            'label' : self.label['cus_f'],
                            'help' :self.label['cus_fd_h']
                        }
                    ],
                    time:[
                        {
                            'id' : 'format',
                            'type' : 'select',
                            'label' : self.label['t_f'],
                            'default' :'def',
                            'options' : {
                                'g:i a' :self.label['g_i_a'],
                                'g:i A' :self.label['g_i_A'],
                                'H:i' :self.label['H_i'],
                                'def' : self.label['def'],
                                'custom' : self.label['cus']
                            },
                            'binding' :{
                                'not_empty':{'hide':'custom'},
                                'custom':{'show':'custom'}
                            }
                        },
                        {
                            'id' : 'custom',
                            'type' : 'text',
                            'control':{'event':'change'},
                            'label' : self.label['cus_f'],
                            'help' :self.label['cus_ft_h']
                        }
                    ],
                    author:[
                        { 
                            'id' : 'l',
                            'type' : 'toggle_switch',
                            'label' : self.label['l'],
                            'options': 'simple'
                        },
                        {
                            'id' : 'a_p',
                            'type' : 'toggle_switch',
                            'label' : self.label['a_p'],
                            'binding' :{
                                'checked':{'show':'p_s'},
                                'not_checked':{'hide':'p_s'}
                        },
                            'options': 'simple'
                                },
                        {
                            'id' : 'p_s',
                            'type' : 'range',
                            'label' : self.label['p_s'],
                            'class' : 'xsmall',
                            'units' : {
                                'px' :{
                                    'max' : 96
                                }
                            },
                            control:{
                                event:'change'
                            }
                        }
                    ],
                    comments:[
                        {
                            'id' : 'l',
                            'type' : 'toggle_switch',
                            'label' : self.label['l'],
                            'options':'simple'
                        },
                        {
                            'id' : 'no',
                            'type' : 'text',
                            'control':{'event':'change'},
                            'label' : self.label['no_c']
                        },
                        {
                            'id' : 'one',
                            'type' : 'text',
                            'control':{'event':'change'},
                            'label' : self.label['one_c']
                        },
                        {
                            'id' : 'comments',
                            'type' : 'text',
                            'control':{'event':'change'},
                            'label' : self.label['comments']
                        }
                    ],
                    terms:[
                        {
                            'id' : 'post_type',
                            'type' : 'query_posts',
                            'tax_id':'taxonomy'
                        },
                        {
                            'id' : 'l',
                            'type' : 'toggle_switch',
                            'label' : self.label['l'],
                            'options': 'simple'
                        },
                        {
                            'id' : 'sep',
                            'type' : 'text',
                            'control':{'event':'change'},
                            'label' : self.label['sep']
                        }
                    ],
					text : [
						{
							'id' : 't',
							'type' : 'textarea',
							'class' : 'fullwidth'
						}
					]
                };
                return _defaults[type];
            },
            create(self,data,type,id,vals,isRemovable){
                const li =document.createElement('li'),
                    opt = data['options'][type];

				if ( opt === undefined ) {
					/* safeguard against unknown types */
					return document.createDocumentFragment();
				}

                li.textContent = opt['label'];
                li.setAttribute('data-type',type);
				li.className='tb_sort_fields_item';
                if(isRemovable===true){
                    
					let key=false;
                    if(!id){
                        if(vals!==undefined){
                            key = this.find(vals,type,true);
                        }
                        li.setAttribute('data-new',true);
                        const wrap = Common.Lightbox.$lightbox[0].getElementsByClassName(data['id'])[0];
						let i=1;
						id = type+'_'+i;
                        if(wrap!==undefined){
							while(true){
                                if(wrap.querySelector('[data-id="'+id+'"]')===null){
									break;
								}
								++i;
								id = type+'_'+i;
							}
                    }
                    }
                    else if(vals!==undefined){
                        key = this.find(vals,id);
                    }
                    li.setAttribute('data-id',id);
					const remove = document.createElement('span'),
					input = document.createElement('input');
                    if(key!==false && vals[key]['val']!==undefined){
                        input.value=JSON.stringify(vals[key]['val']);
                    }
                    input.type='hidden';
                    remove.className='tb_sort_fields_remove tf_close';
                    remove.title=self.label['delete'];
                    li.appendChild(api.Utils.getIcon('ti-pencil'));
                    li.appendChild(input);
                    li.appendChild(remove);
                }
                return li;
            },
            sort(el,self){
				 const ev = api.Utils.getMouseEvents();
				
				el.addEventListener(ev['mousedown'], function (e) {
					if ((e.type==='touchstart' || e.which === 1) && e.target.parentNode===this) {
						let timer,
							theLast,
							dir,
							prevY=0,
							prevX=0,
							holder,
							holderWidth,
							holderHeight,
							editors={},
							doc=this.ownerDocument,
							item=e.target,
							box,
							parentNode;
						const draggableCallback = function (e) {
						        
							e.stopImmediatePropagation();
							if(timer){
								cancelAnimationFrame(timer);
							}
							timer=requestAnimationFrame(function(){
								if(!doc){
									return;
								}
								let x=e.touches?e.touches[0].clientX:e.clientX,
									y=e.touches?e.touches[0].clientY:e.clientY;
								if(x<box.left){
									x=box.left;
								}
								else if(x>box.right){
									x=box.right;
								}
								if(y<box.top){
									y=box.top;
								}
								else if(y>box.bottom){
									y=box.bottom;
								}
								const moveTo=e.type==='mousemove'?e.target:doc.elementFromPoint(x, y),
									clientX=x-holderWidth-box.left,
									clientY=y-holderHeight-box.top;
						
								holder.style['transform']= 'translate('+clientX+'px,'+clientY+'px)';
								if(moveTo && moveTo!==item && moveTo.classList.contains('tb_sort_fields_item')){
									const side = y>prevY || x>prevX? 'bottom' : 'top';
									if(dir!==side || theLast!==moveTo){
										item.style['display']='none';
										side==='bottom'?moveTo.after(item):moveTo.before(item); 
										item.style['display']='';
									}
									theLast=moveTo;
									dir = side;
								}
								prevY=y;
								prevX=x;
							});
						},
						startDrag=function(e){
							doc.body.classList.add('tb_start_animate','tb_move_drag');
                            parentNode=item.parentNode;
							parentNode.classList.add('tb_sort_start');
                            if ( typeof tinyMCE !== 'undefined' ) {
								const items = parentNode.getElementsByClassName('tb_lb_wp_editor');
								for (let i = items.length - 1; i > -1; --i) {
									let id = items[i].id;
									editors[id] = tinymce.get(id).getContent();
									tinyMCE.execCommand('mceRemoveEditor', false, id);
								}
							}
							holder=item.cloneNode(true);
							const opt=holder.getElementsByClassName('tb_sort_field_dropdown')[0];
							if(opt){
								opt.remove();
							}
							holder.className+=' tb_sort_handler';
							item.classList.add('tb_current_sort');
							item.after(holder);
							const b=holder.getBoundingClientRect();
							box=parentNode.getBoundingClientRect();
                            holderHeight=(b.height/2)-parentNode.offsetTop;
							holderWidth=(b.width/2)-parentNode.offsetLeft;
							draggableCallback(e);
						};
						doc.addEventListener(ev['mouseup'], function(e){
							this.removeEventListener(ev['mousemove'], startDrag,{passive: true,once:true});
							this.removeEventListener(ev['mousemove'], draggableCallback, {passive: true});
							
							if(parentNode){
								e.stopImmediatePropagation();
								if(timer){
									cancelAnimationFrame(timer);
								}
								if(holder){
									holder.remove();
								}
								if ( typeof tinyMCE !== 'undefined' ) {
									for (let id in editors) {
										tinyMCE.execCommand('mceAddEditor', false, id);
										tinymce.get(id).setContent(editors[id]);
									}
								}
								item.classList.remove('tb_current_sort');
								requestAnimationFrame(function(){
									self.control.preview(parentNode, null, {repeat: true});
									Themify.triggerEvent(parentNode, 'sortable');
									parentNode.classList.remove('tb_sort_start');
									parentNode=null;
								});
							}
							this.body.classList.remove('tb_start_animate','tb_move_drag');
							theLast=holder=dir=prevY=prevX=editors=doc=holderHeight=holderWidth=box=item=timer=null;
						}, {passive: true,once:true});
						
						doc.addEventListener(ev['mousemove'], startDrag,{passive: true,once:true});
						doc.addEventListener(ev['mousemove'], draggableCallback, {passive: true});
					}
				}, {passive: true});
            },
            find(values,id,byType){
                for(let i=values.length-1;i>-1;--i){
                    if(values[i].id===id || (byType===true && id===values[i].type)){
                        return i;
                    }
                }
                return false;
            },
            edit(self,data,vals,el){
                const type = el.dataset['type'];
				let wrap=el.getElementsByClassName('tb_sort_field_dropdown')[0];
                if(!wrap){
                    wrap=document.createElement('div');
                    wrap.className='tb_sort_field_dropdown tb_sort_field_dropdown_'+type;
                    const pointer = document.createElement('span'),
                        id=el.dataset.id;
                    pointer.className = 'tb_sort_field_dropdown_pointer';
                    wrap.appendChild(pointer);
                    let orig=null,
                        options = data['options'][type]['options'];
                    if ( options === undefined ) {
                        options = this.getDefaults(type,self);
						if ( type !== 'text' ) {
							options = options.concat( this.getGlobalOptions( self ) );
						}
                    }
					if ( data['options'][ type ]['has_global_options'] ) {
						options = options.concat( this.getGlobalOptions( self ) );
					}

                    self.is_repeat = self.is_sort =true;
                    if(vals!==undefined){
                        const isNew = el.dataset['new']?true:false,
                            by=isNew===true?type:id,
                            key= this.find(vals,by,isNew);
                        if(key!==false && vals[key]['val']!==undefined){
                            orig = $.extend(true, {}, self.values);
                            self.values = vals[key]['val'];
                        }
                    }
                    wrap.appendChild(self.create(options));
                    el.appendChild(wrap);
                    self.callbacks();
                    if(orig!==null){
                        self.values = orig;
                    }
                    self.is_sort =self.is_repeat=orig = null;
                }
                
                if(!el.classList.contains('current')){
                    el.classList.add('current');
                    const _close = function(e){
                        if(e.which===1){
                            if(e.target===el || el.contains(e.target) || (Themify_Icons.target && el.contains(Themify_Icons.target[0]) && this.getElementById('themify_lightbox_fa').style['display']==='block')){
                                el.classList.add('current');
                            }
                            else{
                                el.classList.remove('current');
                                this.removeEventListener(e.type,_close,{passive:true});
                            }
                        }
                    };
                    topWindow.document.addEventListener('mousedown',_close,{passive:true});
                }
            },
            remove(self,el){
                    el=el.closest('li');
                    const p = el.parentNode;
                    el.parentNode.removeChild(el);
                    self.control.preview(p, null, {repeat: true});
                    Themify.triggerEvent(p, 'delete');
            },
            render(data,self){
                const _this = this,
                    wrapper = document.createElement('div'),
                    plus = document.createElement('div'),
                    plusWrap=document.createElement('div'),
                    ul = document.createElement('ul'),
                    items = document.createElement('ul'),
                    values = self.values[data.id]?self.values[data.id].slice(0):[];
                    wrapper.className='tb_sort_fields_wrap tf_box tf_rel tf_w';
                    items.className='tb_sort_fields_parent';
                    if (self.is_repeat === true) {
                        items.dataset['inputId'] = data.id;
                        items.className += self.is_sort===true?' tb_lb_sort_child':' tb_lb_option_child';
                    }
                    else {
                        items.id = data.id;
                        items.className += ' tb_lb_option';
                    }
                    
                    ul.className='tb_ui_dropdown_items';
                    plus.className='tb_ui_dropdown_label tb_sort_fields_plus';
                    plus.tabIndex='-1';
                    plusWrap.className='tb_sort_fields_plus_wrap';
                    for(let i in data['options']){
                        ul.appendChild(this.create(self,data,i));
                    }
                    for(let i=0,len=values.length;i<len;++i){
                        if(self.is_new!==true || values[i].show===true){
                            items.appendChild(this.create(self,data,values[i].type,values[i].id,values,true));
                        }
                    }
					
					ul.addEventListener('click',function(e){
						if(e.target.tagName==='LI'){
							e.preventDefault();
							e.stopPropagation();
							api.Utils.hideOnClick(this);
							items.appendChild(_this.create(self,data,e.target.dataset['type'],null,values,true));
							self.control.preview(items, null, {repeat: true});
						}
					});
					
					items.addEventListener('click',function(e){
						if(e.target.classList.contains('tb_sort_fields_remove')){
							e.preventDefault();
							e.stopPropagation();
							_this.remove(self,e.target);
						}
						else if(e.target.tagName==='LI'){
							e.preventDefault();
							e.stopPropagation();
							_this.edit(self,data,values,e.target);
						}
					});
                    plusWrap.appendChild(plus);
                    plusWrap.appendChild(ul);
                    wrapper.appendChild(items);
                    wrapper.appendChild(plusWrap);
					setTimeout(function(){
						_this.sort(items,self);
					},800);
					if(self.is_new===true){
						self.afterRun.push(function(){
							self.control.preview(items, null, {repeat: true});
						});
					}
                    return wrapper;
            }
        },
        multi: {
            render(data, self) {
                const wrapper = document.createElement('div');
                wrapper.className = 'tb_multi_fields tb_fields_count_' + data.options.length;
                wrapper.appendChild(self.create(data.options));
                return wrapper;
            }
        },
        color: {
            is_typing: null,
            controlChange(el, btn_opacity, data) {
                const that = this,
                        $el = $(el),
                        id = data.id,
                clear = document.createElement('div');
                clear.className = 'tb_clear_btn tf_close';
                clear.addEventListener('click', function () {
                    this.style['display'] = 'none';
                    el.value = '';
                    $el.trigger('keyup');
                },{passive: true});
                $el.tfminicolors({
                    opacity: data.opacity === undefined ? true : Boolean( data.opacity ),
                    swatches: themifyColorManager.toColorsArray(),
                    changeDelay: 10,
                    beforeShow() {
                        const lightbox = Common.Lightbox.$lightbox,
                            p = $el.closest('.tfminicolors'),
                            panel = p.find('.tfminicolors-panel');
                        panel.css('visibility', 'hidden').show();//get offset
						p[0].classList.toggle('tfminicolors_right',((lightbox.offset().left + lightbox.width()) <= panel.offset().left + panel.width()));
                        panel.css('visibility', '').hide();
                        api.hasChanged = true;
                    },
                    show(){
                        themifyColorManager.initColorPicker(this);
                        if (api.mode === 'visual') {
                            Themify.triggerEvent( this, 'themify_builder_color_picker_show', { id: id } );
                        }
                    },
                    hide() {
                        clear.style['display'] = el.value !== '' ? 'block' : 'none';
                        if (api.mode === 'visual') {
                            Themify.triggerEvent( this, 'themify_builder_color_picker_hide', { id: id } );
                        }
                    },
                    change(hex, opacity) {
                        if (!hex) {
                            opacity = '';
                        }
                        else if (opacity) {
                            if ('0.99' == opacity) {
                                opacity = 1;
                            }
                            else if (0 >= parseFloat(opacity)) {
                                opacity = 0;
                            }
                        }
                        if (!that.is_typing && opacity !== document.activeElement) {
                            btn_opacity.value = opacity;
                        }
                        if (hex && 0 >= parseFloat($(this).tfminicolors('opacity'))) {
                            $(this).tfminicolors('opacity', 0);
                        }

                        if (api.mode === 'visual') {
                            if(hex){
                                hex = hex.indexOf('--')===0?'var('+hex+')':$(this).tfminicolors('rgbaString');
                            }else{
                                hex='';
                            }
                            Themify.triggerEvent(this, 'themify_builder_color_picker_change', {id: id, val: hex});
                        }
                    }
                }).tfminicolors('show');
                //opacity
                const callback = function (e) {
                    let opacity = parseFloat(this.value.trim().replace(',','.'));
                    if (opacity > 1 || isNaN(opacity) || opacity === '' || opacity < 0) {
                        opacity = !el.value ? '' : 1;
                    }
                        if (e.type === 'blur') {
                            this.value = opacity;
                        }
                    that.is_typing = 'keyup' === e.type;
                    $el.tfminicolors('opacity', opacity);
                };
                btn_opacity.addEventListener('blur', callback,{passive: true});
                btn_opacity.addEventListener('keyup', callback,{passive: true});
                el.parentNode.appendChild(clear);
                el.setAttribute('data-tfminicolors-initialized', true);
            },
            setColor(input, swatch, opacityItem, val) {
                let color = val,
                        opacity = '';
                if (val !== '' && val.indexOf('--') !== 0) {
                    if (val.indexOf('_') !== -1) {
                        color = api.Utils.toRGBA(val);
                        val = val.split('_');
                        opacity = val[1];
                        if (!opacity) {
                            opacity = 1;
                        } else if (0 >= parseFloat(opacity)) {
                            opacity = 0;
                        }
                        color = val[0];
                    }
                    else {
                        color = val;
                        opacity = 1;
                    }
                    if (color.indexOf('#') === -1) {
                        color = '#' + color;
                    }
                }
                input.value = color;
                input.setAttribute('data-opacity', opacity);
                swatch.style['background'] = color;
                swatch.style['opacity'] = opacity;
                opacityItem.value = opacity;
            },
            update(id, v, self) {
                const input = self.getEl(id);
                if (input !== null) {
                    const p = input.parentNode;
                    if (v === undefined) {
                        v = '';
                    }
                    this.setColor(input, p.getElementsByClassName('tfminicolors-swatch-color')[0], p.nextElementSibling, v);
                }
            },
            render(data, self) {
                const f = document.createDocumentFragment(),
                        wrapper = document.createElement('div'),
                        tfminicolors = document.createElement('div'),
                        input = document.createElement('input'),
                        opacity = document.createElement('input'),
                        swatch = document.createElement('span'),
                        span = document.createElement('span'),
                        that = this;

				let v = self.getStyleVal(data.id);
                wrapper.className = 'tfminicolors_wrapper';
                tfminicolors.className = 'tfminicolors tfminicolors-theme-default';

                input.type = 'text';
                input.className = 'tfminicolors-input';
                input.autocomplete = 'off';
                if (data['class'] !== undefined) {
                    input.className += ' ' + data.class;
                }
                if (self.is_repeat === true) {
                    input.className += self.is_sort===true?' tb_lb_sort_child':' tb_lb_option_child';;
                    input.dataset['inputId'] = data.id;
                }
                else {
                    input.id = data.id;
                    input.className += ' tb_lb_option';
                }
                swatch.className = 'tfminicolors-swatch tfminicolors-sprite tfminicolors-input-swatch';
                span.className = 'tfminicolors-swatch-color tf_abs';

                opacity.type = 'text';
                opacity.className = 'color_opacity';
                swatch.appendChild(span);
                tfminicolors.appendChild(input);
                tfminicolors.appendChild(swatch);
                wrapper.appendChild(tfminicolors);
                wrapper.appendChild(opacity);

                self.initControl(input, data);
                swatch.addEventListener('click', function () {
                    wrapper.insertAdjacentElement('afterbegin', input);
                    tfminicolors.parentNode.removeChild(tfminicolors);
                    that.controlChange(input, opacity, data);
                }, {once: true,passive: true});
                input.addEventListener('focusin', function () {
                    swatch.click();
                }, {once: true,passive: true});
                opacity.addEventListener('focusin', function(e) {
                    if(!input.dataset['tfminicolorsInitialized']){
                        input.dataset['opacity'] = this.value;
                        swatch.click();
                    }
                    else{
                        $(input).tfminicolors('show');
                    }
                }, {passive: true});

				if ( ! v && data.default ) {
					v = data.default;
				}

                if (v !== undefined) {
                    this.setColor(input, span, opacity, v);
                }
                f.appendChild(wrapper);
                if (data['after'] !== undefined) {
                    f.appendChild(self.after(data));
                }
                if (data['description'] !== undefined) {
                    f.appendChild(self.description(data.description));
                }
                if (data['tooltip'] !== undefined) {
                    f.appendChild(self.hint(data.tooltip));
                }
                return f;
            }
        },
		icon_color_bg : { /* used by Icon module */
			render( data, self ) {
				/* migrate option values from old version, deprecated in Nov 2021 */
				let deprecated = {
					'default' : [ '#F7F7F7', '#555' ],
					'black' : [ '#000', '#eee' ],
					'gray' : [ '#989797', '#eee' ],
					'blue' : [ '#4d7de1', '#edf3ff' ],
					'light-blue' : [ '#bdd9fd', '#2a3e59' ],
					'green' : [ '#4aab10', '#e9ffdb' ],
					'light-green' : [ '#9bd611', '#293807' ],
					'purple' : [ '#7a6bf8', '#eeedff' ],
					'light-purple' : [ '#c1bafd', '#39355b' ],
					'brown' : [ '#a35004', '#ffeee0' ],
					'orange' : [ '#ff9600', '#fff2ea' ],
					'yellow' : [ '#fff06c', '#594718' ],
					'red' : [ '#e8311f', '#ffeeed' ],
					'pink' : [ '#feb4e4', '#441e32' ],
					'transparent' : [ '', '' ],
					'tb_default_color' : [ '', '' ]
				};
				let v = self.getStyleVal( 'icon_color_bg' );

				let f = self.create( [ {
					type : 'multi',
					label : 'icon',
					options : [
						{
							id : 'icon',
							type : 'icon',
							class : 'fullwidth'
						},
						{
							id : 'bg',
							type : 'color',
							default : v ? deprecated[ v ][0] : '',
							label : 'bg'
						},
						{
							id : 'c',
							type : 'color',
							default : v ? deprecated[ v ][1] : '',
							label : 'c'
						}
					],
					wrap_class : 'tb_group_element_icon'
				} ] );

				return f;
			}
		},
		tooltip: {
			render( data, self ) {
				const options = [
					{
						type : 'textarea',
						label : self.label.tt,
						id : '_tooltip',
						class : 'fullwidth',
						control : false /* disable live preview refresh */
					},
					{
						type : 'color',
						label : self.label.bg_c,
						id : '_tooltip_bg',
						control : false
					},
					{
						type : 'color',
						label : self.label.f_c,
						id : '_tooltip_c',
						control : false
					},
					{
						type : 'range',
						label : self.label.ma_wd,
						id : '_tooltip_w',
						control : false,
						units : {
							px: {
								min: -2000,
								max: 2000
							},
							em: {
								min: -20,
								max: 20
							}
						}
					}
				];
				let f = self.create( [ {
					type : 'group',
					label : self.label.t,
					display : 'accordion',
					options : options
				} ] );

				if ( 'visual' === api.mode ) {
					f = this.bindEvents( f );
				}
				return f;
			},
			/* setup live preview events */
			bindEvents( el ) {
				const self=this,
                                    _tooltip = el.querySelector( '#_tooltip' ),
                                    color_fields = [ el.querySelector( '#_tooltip_bg' ), el.querySelector( '#_tooltip_c' ) ],
                                    events=['focus','keyup','blur','change'],
                                    tooltip_w = el.querySelector( '#_tooltip_w' );
                                for(let i=events.length-1;i>-1;--i){
                                    if(events[i]!=='change'){
                                        _tooltip.addEventListener( events[i], (e) => {self.addOrRemoveTooltip( e.type!=='blur' );},{passive:true});
                                    }
                                    tooltip_w.addEventListener( events[i], (e) => { self.addOrRemoveTooltip(e.type!=='blur'); },{passive:true} );
                                }
                                for(let i=color_fields.length-1;i>-1;--i){
                                    color_fields[i].addEventListener( 'themify_builder_color_picker_show', function(){
                                            self.addOrRemoveTooltip(true);
                                            this.addEventListener( 'themify_builder_color_picker_hide', () => {
                                                    self.addOrRemoveTooltip( false );
                                            }, { once : true,passive:true } );
                                    },{passive:true});
                                    color_fields[i].addEventListener( 'themify_builder_color_picker_change', () => { self.addOrRemoveTooltip(true); },{passive:true} );
                                }
				return el;
			},
			/* creates tooltip preview element */
			addOrRemoveTooltip(show) {
				let $el = api.liveStylingInstance.$liveStyledElmt[0],
					tooltip = $el.querySelector( ':scope > .tf_tooltip' );
				if ( ! show && tooltip ) {
					tooltip.remove();
					return;
				}

				if ( ! Themify.cssLazy['tf_tooltip'] ) {
                                    Themify.cssLazy['tf_tooltip'] = true;
                                    Themify.LoadCss( Themify.cssUrl + themify_vars.css_modules.t.u );
				}

				const val = topWindow.document.getElementById( '_tooltip' ).value;

				if ( val !== '' ) {
					if ( ! tooltip ) {
						tooltip = document.createElement( 'div' );
						tooltip.className='tf_tooltip';
						$el.appendChild( tooltip );
					}
                    let width = topWindow.document.getElementById( '_tooltip_w' ).value;
					tooltip.classList.add( 'tooltip_preview','tf_abs_c' );
					tooltip.innerHTML = val;
					tooltip.style.background = api.Utils.getColor(topWindow.document.getElementById( '_tooltip_bg' ));
					tooltip.style.color = api.Utils.getColor(topWindow.document.getElementById( '_tooltip_c' ));
					if ( width !== '' ) {
						width += topWindow.document.getElementById( '_tooltip_w_unit' ).value;
					}
					tooltip.style.width = width;
                                        tooltip.classList.remove( 'tf_hide' );
				} else if ( tooltip ) {
                                    tooltip.remove();
				}
			}
		},
        text: {
            update(id, v, self) {
                const item = self.getEl(id);
                if (item !== null) {
                    item.value = v !== undefined ? v : '';
                }
            },
            render(data, self) {
                const f = document.createDocumentFragment(),
                    input = document.createElement('input'),
                    v = self.getStyleVal(data.id);
                    input.type = data['input_type']!==undefined?data['input_type']:'text'; // custom input types
                if (self.is_repeat === true) {
                    input.className = self.is_sort===true?'tb_lb_sort_child':'tb_lb_option_child';;
                    input.dataset['inputId'] = data.id;
                }
                else {
                    input.className = 'tb_lb_option';
                    input.id = data.id;
                }
                if (data['placeholder'] !== undefined) {
                    input.placeholder = data['placeholder'];
                }
                if (data['custom_args'] !== undefined) {
                    for(let i in data['custom_args'] ){
                        input.setAttribute(i,data['custom_args'] [i]);
                    }
                }
                if (v !== undefined) {
                    input.value = v;
                }
                if (data['class'] !== undefined) {
                    input.className += ' ' + data.class;
                }
                f.appendChild(self.initControl(input, data));
                if (data['unit'] !== undefined) {
                    f.appendChild(self.select.render(data.unit, self));
                }
                if (data['after'] !== undefined) {
                    f.appendChild(self.after(data));
                }
                if (data['description'] !== undefined) {
                    f.appendChild(self.description(data.description));
                }
                if (data['tooltip'] !== undefined) {
                    f.appendChild(self.hint(data.tooltip));
                }
                return f;
            }
        },
        number:{
            render(data, self) {
                data['input_type']='number';
                if(data['custom_args']===undefined){
                    data['custom_args']={'min':0};
                }
                if(data['step']!==undefined){
                    if(data['custom_args']===undefined){
                        data['custom_args']={};
                    }
                    data['custom_args']['step']=data['step'];
                }
                return self.text.render( data, self );
            }  
        },
        angle:{
            render(data, self) {
                data['input_type']='number';
                data['custom_args']={'min':0,'max':360};
                const wrap=document.createElement('div'),
					css_class = 'xsmall tb_lb_option tb_angle_input';
                wrap.tabIndex=-1;
                wrap.className='tb_angle_container tf_rel';
                data.class = data['class'] !== undefined ? data['class'] + ' ' + css_class:css_class;
				const res=true===data.deg?self.range.render( data, self ):self.text.render( data, self );
                wrap.appendChild(res);
                const angle = wrap.querySelector('#'+data.id);
                if(true===data.deg){
                    angle.dataset['deg']=true;
                }
                self.afterRun.push(function(){
                    const ev = api.Utils.getMouseEvents();
                    angle.addEventListener(ev['mousedown'], function(e){
                        e.stopImmediatePropagation();
                        let _circle = this.parentNode.querySelector('.tb_angle_circle');
                        if(!_circle){
                            let v = this.value;
                            const tmp1 = document.createElement('div'),
                                tmp2 = document.createElement('div');
                            _circle = document.createElement('div');
                            if(v !== ''){
                                tmp1.style['transform'] = 'rotate(' + v + 'deg)';
                            }
                            tmp1.className = 'tb_angle_dot';
                            _circle.className = 'tb_angle_circle';
                            tmp2.className = 'tb_angle_circle_wrapper';
                            _circle.appendChild(tmp1);
                            tmp2.appendChild(_circle);
                            this.parentNode.appendChild(tmp2);
                        }
                        _circle.addEventListener(e.type, function(e){
                            if(e.type === 'touchstart' || e.which === 1){
                                let box = this.getBoundingClientRect(),
                                    center_x = (this.offsetWidth / 2) + box.left,
                                    center_y = (this.offsetHeight / 2) + box.top,
                                    timer,
                                    _wrapper = this.parentNode.querySelector('.tb_angle_circle_wrapper'),
                                    _dot = this.parentNode.querySelector('.tb_angle_dot');
                                const PI = 180 / Math.PI,
                                    doc = this.ownerDocument,
                                    _start = function(e){
                                        e.stopImmediatePropagation();
                                        this.body.classList.add('tb_start_animate', 'tb_show_overlay');
                                        this.body.style['cursor'] = 'grab';
                                    },
                                    _move = function(e){
                                        e.stopImmediatePropagation();
                                        if(timer){
                                            cancelAnimationFrame(timer);
                                        }
                                        timer = requestAnimationFrame(function(){
                                            let delta_y = center_y - (e.touches ? e.touches[0].clientY : e.clientY),
                                                delta_x = center_x - (e.touches ? e.touches[0].clientX : e.clientX),
                                                ang = Math.atan2(delta_y, delta_x) * PI; // Calculate Angle between circle center and mouse pos
                                            ang -= 90;
                                            if(ang < 0){
                                                ang += 360; // Always show angle positive
                                            }
                                            ang = Math.round(ang);
                                            _dot.style['transform'] = 'rotate(' + ang + 'deg)';
                                            angle.value = ang;
                                            Themify.triggerEvent(angle,angle.dataset.deg?'keyup':'change');
                                        });
                                    };

                                doc.addEventListener(ev['mousemove'], _start, {passive:true, once:true});
                                doc.addEventListener(ev['mousemove'], _move, {passive:true});
                                doc.addEventListener(ev['mouseup'], function(e){
                                    if(timer){
                                        cancelAnimationFrame(timer);
                                    }
                                    this.removeEventListener(ev['mousemove'], _start, {passive:true, once:true});
                                    this.removeEventListener(ev['mousemove'], _move, {passive:true});
                                    this.body.classList.remove('tb_start_animate', 'tb_show_overlay');
                                    this.body.style['cursor'] = '';
                                    requestAnimationFrame(function(){
                                        _wrapper = _dot = center_x = timer = center_y = null;
                                    });

                                }, {passive:true, once:true});
                                _move(e);
                            }

                        }, {passive:true});
                    }, {passive:true, once:true});
                });
                return wrap;
            }
        },
        autocomplete : {
                cache:{},
                xhr:null,
                render(data, self) {
                        const d = self.text.render( data, self );
                        if ( data.dataset === undefined ) {
                                return d;
                        }
                        const input = d.querySelector( 'input' ),
                            _this=this,
                            container = document.createElement( 'div' );
                        input.autocomplete = 'off';
                        container.className = 'tb_autocomplete_container';
                        d.appendChild( container );
                        input.addEventListener( 'input', function() {
                                // remove all elements in container
                                const wrapper=this.nextElementSibling;
                                wrapper.style.display = 'none';
                                while ( wrapper.firstChild!==null) {
                                        wrapper.removeChild( wrapper.lastChild );
                                }
                                wrapper.style.display = '';
                                const value = this.value,
                                    type=data.dataset,
                                    callback=function(res){
                                        const d=document.createDocumentFragment();
                                        for(let i in res){
                                            let item = document.createElement( 'div' );
                                                item.className = 'tb_autocomplete_item';
                                                item.setAttribute( 'data-value', i );
                                                item.innerText = res[i];
                                                d.appendChild( item );
                                        }
                                        wrapper.classList.add('tf_scrollbar');
                                        wrapper.appendChild(d);
                                    };
                                if( _this.cache[type]===undefined){
                                    _this.cache[type]={};
                                }
                                if(_this.cache[type][value]!==undefined){
                                    callback(_this.cache[type][value]);
                                }
                                else if ( value !== '' ){
                                        if(_this.xhr!==null){
                                            _this.xhr.abort();
                                        }
                                        const parent=this.parentNode;
                                        parent.classList.add('tb_autocomplete_loading','tf_loader');
                                        _this.xhr=$.ajax({
                                                type: 'POST',
                                                url: themifyBuilder.ajaxurl,
                                                dataType: 'json',
                                                data: {
                                                        action: 'tb_get_autocomplete',
                                                        dataset : type,
                                                        value : value,
                                                        nonce: themifyBuilder.tb_load_nonce,
                                                        pid: themifyBuilder.post_ID
                                                },
                                                success(response) {
                                                        if ( response.success) {
                                                            _this.cache[type][value]=response['data'];
                                                            callback(response.data);
                                                        }
                                                },
                                                complete() {
                                                    _this.xhr=null;
                                                    parent.classList.remove('tb_autocomplete_loading','tf_loader');
                                                }
                                        });
                                }
                        },{passive:true} );
                        container.addEventListener( 'mousedown', function (e) {
                            if (e.which === 1 && e.target.classList.contains('tb_autocomplete_item')) {
                                e.preventDefault();
                                e.stopPropagation();
                                const field=this.previousElementSibling;
                                field.value = e.target.getAttribute( 'data-value' );
                                field.blur();
                                Themify.triggerEvent(field,'change');
                            }
                        } );
                        return d;
                }
        },
        file: {
            _frames: {},
            clicked:null,
            browse(uploader, input,  self, type) {
                const _this = this;
                uploader.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    let file_frame;
                    if (_this._frames[type] !== undefined) {
                        file_frame = _this._frames[type];
                    }
                    else {
                        file_frame = wp.media.frames.file_frame = wp.media({
                            title: self.label.upload_image,
                            library: {
                                type: type
                            },
                            button: {
                                text: self.label.insert_image
                            },
                            multiple: false
                        });
                        _this._frames[type] = file_frame;
                    }
                    file_frame.off('select').on('select', function () {
                        api.ActionBar.disable=true;
                        const attachment = file_frame.state().get('selection').first().toJSON();    
                        input.value = attachment.url;
                        Themify.triggerEvent(input, 'change');
                        api.hasChanged = true;
                        $(input).trigger('change');
                        const attach_id = Common.Lightbox.$lightbox.find('#'+input.id+'_id')[0];
                        if(attach_id!==undefined){
                            attach_id.value=attachment.id;
                        }
                    });
                    file_frame.on('close',function() {
                        api.ActionBar.disable=true;
                        setTimeout(function(){
                            api.ActionBar.disable=null;
                        },5);
                    });
                    // Finally, open the modal
                    file_frame.open();
                });
                if (type === 'image') {
                    input.addEventListener('change', function (e) {
                        api.hasChanged = true;
                        _this.setImage(uploader,this.value.trim());
                    },{passive:true});
                }
            },
            setImage(prev, url) {
                while (prev.firstChild) {
                    prev.removeChild(prev.firstChild);
                }
                if (url) {
                    const img = document.createElement('img');
                    img.width =40;
                    img.height = 40;
                    img.src = url;
                    prev.appendChild(img);
                }
            },
            update(id, v, self) {
                const item = self.getEl( id );
                if (item !== null) {
                    if (v === undefined) {
                        v = '';
                    }
                    item.value = v;
                    this.setImage(item.parentNode.getElementsByClassName('thumb_preview')[0], v);
                }
            },
            render(type, data, self) {
                const wr = document.createElement('div'),
                    input = document.createElement('input'),
                    upload_btn = document.createElement('a'),
                    btn_delete = document.createElement('span'),
                    reg = /.*\S.*/,
                    v = self.getStyleVal(data.id);
                let id;
                input.type = 'text';
                input.className = 'tb_uploader_input';
                input.required=true;
                input.setAttribute('pattern', reg.source);
                input.setAttribute('autocomplete', 'off');
                if (self.is_repeat === true) {
                    input.className += self.is_sort===true?' tb_lb_sort_child':' tb_lb_option_child';;
                    id = Math.random().toString(36).substr(2, 7);
                    input.dataset['inputId'] = data.id;
                }
                else {
                    input.className += ' tb_lb_option';
                    id = data.id;
                }
                input.id = id;

                if (v !== undefined) {
                    input.value = v;
                }
                btn_delete.className = 'tb_clear_input tf_close';
                 
                upload_btn.className = 'tb_media_uploader tb_upload_btn thumb_preview tf_plus_icon';
                upload_btn.href = '#';
                upload_btn.dataset['libraryType'] = type;
                upload_btn.title = self.label.browse_image;
                wr.className='tb_uploader_wrapper';
                
                wr.appendChild(self.initControl(input, data));
                wr.appendChild(btn_delete);
                wr.appendChild(upload_btn);
                if (type === 'image') {
                    this.setImage(upload_btn, v);
                }
                this.browse(upload_btn, input,self, type);
                if (data['after'] !== undefined) {
                    wr.appendChild(self.after(data));
                }
                if (data['description'] !== undefined) {
                    wr.appendChild(self.description(data.description));
                }
                if (data['tooltip'] !== undefined) {
                    wr.appendChild(self.hint(data.tooltip));
                }
                if (this.clicked===null && self.is_new === true && self.clicked === 'setting' && (self.type === 'image' || self.type === 'pro-image')) {
                    this.clicked = true;
                    const _this = this;
                    self.afterRun.push(function () {
                        upload_btn.click();
                        _this.clicked=null;
                    });
                }
                return wr;
            }
        },
        image: {
            render(data, self) {
                return self.file.render('image', data, self);
            }
        },
        video: {
            render(data, self) {
                return self.file.render('video', data, self);
            }
        },
        audio: {
            render(data, self) {
                return self.file.render('audio', data, self);
            }
        },
        icon_radio: {
            controlChange(wrap) {
                wrap.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if (e.target !== wrap) {
                        const input = e.target.closest('label').getElementsByTagName('input')[0];
                        if (input.checked === true) {
                            input.checked = false;
                            input.value = undefined;
                        }
                        else {
                            input.checked = true;
                            input.value = input.getAttribute('data-value');
                        }
                        api.hasChanged = true;
                        Themify.triggerEvent(input, 'change');
                    }
                });
            },
            render(data, self) {
                return self.radioGenerate('icon_radio', data);
            }
        },
        radio: {
            controlChange(item) {
                let context=null;
                if (item.classList.contains('tb_radio_dnd')) {
                    context = item.closest('.tb_repeatable_field_content');
                }
                if (context === null) {
                    context = item.closest('.tb_tab');
                    if (context === null) {
                        context = item.closest('.tb_expanded_opttions');
                        if (context === null) {
                            context = Common.Lightbox.$lightbox[0];
                        }
                    }
                }
                const elements = item.parentNode.parentNode.getElementsByTagName('input'),
                    selected = item.value,
                    groups = context.getElementsByClassName('tb_group_element_' + selected);
                for (let i = elements.length - 1; i > -1; --i) {
                    let v = elements[i].value;
                    if (selected !== v) {
                        let g = context.getElementsByClassName('tb_group_element_' + v);
                        for (let j = g.length - 1; j > -1; --j) {
                            g[j].style['display'] = 'none';
                        }
                    }
                }
                for (let j = groups.length - 1; j > -1; --j) {
                    groups[j].style['display'] = 'block';
                }
            },
            update(id, v, self) {
                const wrap = self.getEl(id);
                if (wrap !== null) {
                    const items = wrap.getElementsByTagName('input'),
                            is_icon = wrap.classList.contains('tb_icon_radio');
					let found = null;
                    for (let i = items.length - 1; i > -1; --i) {
                        if (items[i].value === v) {
                            found = items[i];
                            break;
                        }
                    }
                    if (found === null) {
                        const def = wrap.dataset['default'];
                        if (def !== undefined) {
                            found = wrap.querySelector('[value="' + def + '"]');
                        }
                        if (is_icon === false && found === null) {
                            found = items[0];
                        }
                    }

                    if (found !== null) {
                        found.checked = true;
                        if (is_icon === false && wrap.classList.contains('tb_option_radio_enable')) {
                            this.controlChange(found);
                        }
                    }
                    else if (is_icon === true) {
                        for (let i = items.length - 1; i > -1; --i) {
                            items[i].checked = false;
                        }
                    }
                }
            },
            render(data, self) {
                return self.radioGenerate('radio', data);
            }
        },
        icon_checkbox: {
            render(data, self) {
                return self.checkboxGenerate('icon_checkbox', data);
            }
        },
        checkbox: {
            update(id, v, self) {
                const wrap = self.getEl(id);
                if (wrap !== null) {
                    const items = wrap.getElementsByTagName('input'),
                        js_wrap = wrap.classList.contains('tb_option_checkbox_enable');
                    v = v ? v.split('|') : [];
                    for (let i = items.length - 1; i > -1; --i) {
                        items[i].checked = v.indexOf(items[i].value) !== -1;
                        if (js_wrap === true) {
                            this.controlChange(items[i]);
                        }
                    }
                }
            },
            controlChange(item) {
                const el = item.classList.contains('tb_radio_dnd') ? item.closest('.tb_repeatable_field_content') : Common.Lightbox.$lightbox[0],
                        parent = item.parentNode.parentNode,
                        items = parent.getElementsByTagName('input'),
                        is_revert = parent.classList.contains('tb_option_checkbox_revert');
                for (let i = items.length - 1; i > -1; --i) {
                    let ch = el.getElementsByClassName('tb-checkbox_element_' + items[i].value),
                            is_checked = items[i].checked;
                    for (let j = ch.length - 1; j > -1; --j) {
						ch[j].classList.toggle('_tb_hide_binding',!((is_revert === true && is_checked === false) || (is_revert === false && is_checked === true)));
                    }
                }
            },
            render(data, self) {
                return self.checkboxGenerate('checkbox', data);
            }
        },
        radioGenerate(type, data) {
            const d = document.createDocumentFragment(),
                wrapper = document.createElement('div'),
                is_icon = 'icon_radio' === type,
                options = this.getOptions(data),
                v = this.getStyleVal(data.id),
                js_wrap = data.option_js === true,
                checked = [],
                self = this;
            let toggle = null,
                _default = data['default'] !== undefined ? data.default : false,
                id;
            wrapper.className = 'tb_radio_input_container';
            wrapper.setAttribute('tabIndex','-1');
            if (js_wrap === true) {
                wrapper.className += ' tb_option_radio_enable';
            }
            if (is_icon === true) {
                wrapper.className += ' tb_icon_radio';
                toggle = data.no_toggle === undefined;
            }
            if (this.is_repeat === true) {
                wrapper.className +=this.is_sort===true?' tb_lb_sort_child':' tb_lb_option_child';;
                id = Math.random().toString(36).substr(2, 7);
                wrapper.dataset['inputId'] = data.id;
            }
            else {
                wrapper.className += ' tb_lb_option';
                wrapper.id = id = data.id;
            }
            if (_default !== false) {
                wrapper.dataset['default'] = _default;
            }
            else if (is_icon === false && v === undefined) {
                _default = options[0].value;
            }
            if (data['before'] !== undefined) {
                d.appendChild(document.createTextNode(data.before));
            }
            for (let i = 0, len = options.length; i < len; ++i) {
                let label = document.createElement('label'),
                    ch = document.createElement('input');
                ch.type = 'radio';
                ch.name = id;
                ch.value = options[i].value;
                if (is_icon === true) {
                    ch.setAttribute( 'data-value', options[i].value );
                }
                if (this.is_repeat === true) {
                    ch.className = 'tb_radio_dnd';
                }
                if (data['class'] !== undefined) {
                    ch.className += this.is_repeat === true ? (' ' + data.class) : data.class;
                }
                if (options[i].disable === true) {
                    ch.disabled = true;
                }
                if (v === options[i].value || (v === undefined && _default === options[i].value)) {
                    ch.checked = true;
                    if (js_wrap === true) {
                        checked.push(ch);
                    }
                }
                label.appendChild(ch);
                if (js_wrap === true) {
                    ch.addEventListener('change', function () {
                        this.parentNode.parentNode.blur();
                        self.radio.controlChange(this);
                    },{passive: true});
                }
                if (is_icon === true) {
                    if (options[i].icon !== undefined) {
                        let icon_wrap = document.createElement('span');
                        icon_wrap.className = 'tb_icon_wrapper';
                        icon_wrap.innerHTML = options[i].icon;
                        label.insertAdjacentElement('beforeend', icon_wrap);
                    }
                    if (options[i]['label_class'] !== undefined) {
                        label.className += options[i]['label_class'];
                    }
                    if (options[i]['name'] !== undefined) {
                        let tooltip = document.createElement('span');
                        tooltip.className = 'themify_tooltip';
                        tooltip.textContent = options[i].name;
                        label.appendChild(tooltip);
                    }

                }
                else if (options[i]['name'] !== undefined) {
                    let label_text = document.createElement( 'span' );
                    label_text.textContent = options[i].name;
                    label.appendChild( label_text );
                }
                wrapper.appendChild(label);
                if (data['new_line'] !== undefined) {
                    wrapper.appendChild(document.createElement('br'));
                }
                this.initControl(ch, data);
            }
            wrapper.addEventListener('click',function(e){
                if('LABEL' === e.target.parentNode.tagName){
                    this.blur();
                }
            },{passive:true});
            d.appendChild(wrapper);
            if (data['after'] !== undefined) {
                d.appendChild(self.after(data));
            }
            if (data['description'] !== undefined) {
                d.appendChild(self.description(data.description));
            }
            if (is_icon === true && toggle === true) {
                self.icon_radio.controlChange(wrapper);
            }
            if (js_wrap === true) {
                this.radioChange.push(function () {
                    for (let i = 0, len = checked.length; i < len; ++i) {
                        self.radio.controlChange(checked[i]);
                    }
                });
            }
            return d;
        },
        checkboxGenerate(type, data) {
            const d = document.createDocumentFragment(),
                wrapper = document.createElement('div'),
                options = this.getOptions(data),
                is_icon = 'icon_checkbox' === type,
                js_wrap = data.option_js === true,
                new_line = data['new_line'] === undefined,
                self = this,
                chekboxes = [];
            let v = this.getStyleVal(data.id),
                _default = null,
                is_array = null;
            wrapper.className = 'themify-checkbox';
            if (js_wrap === true) {
                wrapper.className += ' tb_option_checkbox_enable';
                if (data['reverse'] !== undefined) {
                    wrapper.className += ' tb_option_checkbox_revert';
                }
            }
            if (this.is_repeat === true) {
                wrapper.className += this.is_sort===true?' tb_lb_sort_child':' tb_lb_option_child';
                wrapper.dataset['inputId'] = data.id;
            }
            else {
                wrapper.className += ' tb_lb_option';
                wrapper.id = data.id;
            }
            if(data['wrap_checkbox']!==undefined){
                wrapper.className += ' '+data['wrap_checkbox'];
            }
            if (v === undefined) {
                if (data['default'] !== undefined) {
                    _default = data['default'];
                    is_array = Array.isArray(_default);
                }
            }
            else if(v!==false) {
                v = v.split('|');
            }
            if (is_icon === true) {
                wrapper.className += ' tb_icon_checkbox';
            }
            if (data['before'] !== undefined) {
                d.appendChild(document.createTextNode(data.before));
            }
            for (let i = 0, len = options.length; i < len; ++i) {
                let label = document.createElement('label'),
                        ch = document.createElement('input');
                ch.type = 'checkbox';
                ch.className = 'tb-checkbox';
                ch.value = options[i].name;
                if (data['class'] !== undefined) {
                    ch.className += ' ' + data.class;
                }
                if ((v !== undefined && v!==false && v.indexOf(options[i].name) !== -1) || (_default === options[i].name || (is_array === true && _default.indexOf(options[i].name) !== -1))) {
                    ch.checked = true;
                }
                if (js_wrap === true) {
                    ch.addEventListener('change', function () {
                        self.checkbox.controlChange(this);
                    },{passive: true});
                    chekboxes.push(ch);
                }
                if(data.id==='hide_anchor'){
                    api.Utils.changeOptions(ch,'hide_anchor');
                }
                if (new_line === false) {
                    label.className = 'pad-right';
                }
                label.appendChild(ch);
                if (is_icon === true) {
                    label.insertAdjacentHTML('beforeend', options[i].icon);
                    if (options[i]['value'] !== undefined) {
                        let tooltip = document.createElement('span');
                        tooltip.className = 'themify_tooltip';
                        tooltip.textContent = options[i].value;
                        label.appendChild(tooltip);
                    }
                }
                else if (options[i]['value'] !== undefined) {
                    label.appendChild(document.createTextNode(options[i].value));
                }
                wrapper.appendChild(label);
                if (options[i].help !== undefined ) {
                        wrapper.appendChild( this.help(options[i].help) );
                }
                if (new_line === true) {
                    wrapper.appendChild(document.createElement('br'));
                }
                this.initControl(ch, data);
            }
            if(data.id==='hide_anchor'){
                wrapper.addEventListener('click', function (e) {
                    e.stopPropagation();
                });
            }
            d.appendChild(wrapper);
            if (data['after'] !== undefined) {
                if ( ( data['label'] === undefined || data['label'] === '' )&& ( data['help'] !== undefined && data['help'] !== '' ) ){
                    wrapper.className+=' contains-help';
                    wrapper.appendChild(this.after(data));
                }else {
                    d.appendChild(this.after(data));
                }
            }
            if (data['description'] !== undefined) {
                d.appendChild(this.description(data.description));
            }
            if (js_wrap === true) {
                this.afterRun.push(function () {
                    for (let i = 0, len = chekboxes.length; i < len; ++i) {
                        self.checkbox.controlChange(chekboxes[i]);
                    }
                });
            }
            return d;
        },
        date: {
            loaded: null,
            render(data, self) {
                const f = document.createDocumentFragment(),
                        input = document.createElement('input'),
                        clear = document.createElement('button'),
                        _self = this,
						get_datePicker = function() {
							return topWindow.jQuery.fn.themifyDatetimepicker
                                    ? topWindow.jQuery.fn.themifyDatetimepicker
                                    : topWindow.jQuery.fn.datetimepicker;
						},
						hide_picker = function() {
							get_datePicker().call( $( input ), 'hide' );
						},
                        callback = function () {
                            const datePicker = get_datePicker();

                            if (!datePicker)
                                return;

                            const pickerData = data.picker !== undefined ? data.picker : {};
                            clear.addEventListener('click', function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                input.value = '';
                                input.dispatchEvent(new Event('change'));
                                this.style['display'] = 'none';
                            });
                            datePicker.call($(input), {
								showTimepicker : ( data.timepicker === undefined || data.timepicker ) ? true : false,
                                showButtonPanel: true,
                                changeYear: true,
                                dateFormat: pickerData['dateformat'] || 'yy-mm-dd',
                                timeFormat: pickerData['timeformat'] || 'HH:mm:ss',
                                stepMinute: pickerData['stepMinute'] || 5,
                                stepSecond: pickerData['stepSecond'] || 5,
                                controlType: pickerData['timecontrol'] || 'select',
                                oneLine: true,
                                separator: pickerData['timeseparator'] || ' ',
                                onSelect(v) {
                                    clear.style['display'] = v === '' ? 'none' : 'block';
                                    input.dispatchEvent(new Event('change'));
                                },
                                beforeShow( input, instance ) {
									instance.dpDiv.addClass( 'themify-datepicket-panel' );
									let r = input.getBoundingClientRect();
									setTimeout( function() {
										instance.dpDiv.css( {
											top : r.top + input.offsetHeight,
											left : r.left
										} );
									}, 10 );
									if ( api.mode === 'visual' ) {
										document.body.addEventListener( 'click', hide_picker, { once : true } );
									}
                                },
								onClose() {
									if ( api.mode === 'visual' ) {
										document.body.removeEventListener( 'click', hide_picker );
									}
								}
                            });
                        };
                input.type = 'text';
                input.autocomplete='off';
                input.className = 'themify-datepicker';
                if (self.is_repeat === true) {
                    input.className += self.is_sort===true?' tb_lb_sort_child':' tb_lb_option_child';
                    input.dataset['inputId'] = data.id;
                }
                else {
                    input.className += ' tb_lb_option';
                    input.id = data.id;
                }
                input.readonly = true;

                clear.className = 'themify-datepicker-clear tf_close';
                clear.textContent = self.label.clear_date;

                if (self.values[data.id] !== undefined) {
                    input.value = self.values[data.id];
                }
                if (data['class'] !== undefined) {
                    input.className += ' ' + data.class;
                }
                if (!input.value) {
                    clear.style['display'] = 'none';
                }
                f.appendChild(self.initControl(input, data));
                f.appendChild(clear);
                if (data['after'] !== undefined) {
                    f.appendChild(self.after(data));
                }
                if (data['description'] !== undefined) {
                    f.appendChild(self.description(data.description));
                }
                if (this.loaded === null) {
                    const init = function () {
                        topWindow.Themify.LoadCss(themifyBuilder.meta_url + 'css/jquery-ui-timepicker.min.css', themify_vars.version);
                        topWindow.Themify.LoadAsync(themifyBuilder.includes_url + 'js/jquery/ui/datepicker.min.js', function () {
                            topWindow.Themify.LoadAsync(themifyBuilder.meta_url + 'js/jquery-ui-timepicker.min.js', function () {
                                _self.loaded = true;
                                setTimeout(callback,10);
                            }, themify_vars.version, null, function () {
                                return topWindow.jQuery.fn.themifyDatetimepicker !== undefined || topWindow.jQuery.fn.datetimepicker!==undefined;
                            });
                        }, themify_vars.wp, null, function () {
                            return topWindow.jQuery.fn.datepicker !== undefined;
                        });
                    };
                    self.afterRun.push(init);
                }
                else {
                    self.afterRun.push(callback);
                }
                return f;
            }
        },
        gradient: {
            controlChange(self, gradient, input, clear, type, angle, circle, text, update) {
                let angleV = self.getStyleVal(angle.id);
                if(angleV===undefined || angleV===''){
                    angleV = 180;
                }
                let is_removed = false,
                        $gradient = $(gradient),
                        id = input.id,
                        value = self.getStyleVal(id),
                        args = {
                            angle: angleV,
                            onChange(stringGradient, cssGradient) {
                                if (is_removed) {
                                    stringGradient = cssGradient = '';
                                }
                                if ('visual' === api.mode) {
                                    Themify.triggerEvent(input, 'themify_builder_gradient_change', {val: cssGradient});
                                }
                                input.value = stringGradient;
                                api.hasChanged = true;
                            },
                            onInit() {
                                gradient.style['display'] = 'block';
                            }
                        };
                if (value) {
                    args.gradient = value;
                    input.value = value;
                }
                angle.value=angleV;

				let typeV = self.getStyleVal(type.id);
				if ( typeV === undefined || typeV === '' ) {
					typeV = 'linear';
				}
				type.value = typeV;
				args.type = typeV;
				if ( circle.checked ) {
					args.circle = true;
				}
                if (!update) {
                    $gradient.ThemifyGradient(args);
                }
                const instance = $gradient.data('themifyGradient'),
					callback = function (val) {
						let p = angle.parentNode;
                        if (!p.classList.contains('tb_angle_container')) {
							p = angle;
						}
						if (val === 'radial') {
							text.style['display'] = p.style['display'] = 'none';
							circle.parentNode.style['display'] = '';
						}
						else {
							text.style['display'] = p.style['display'] = '';
							circle.parentNode.style['display'] = 'none';
						}
					},		
					ev=api.Utils.getMouseEvents();
                if (update) {
                    instance.settings = $.extend({}, instance.settings, args);
                    instance.settings.type = typeV;
                    instance.settings.circle = circle.checked;
                    instance.isInit = false;
                    instance.update();
                    instance.isInit = true;
                }
                else {
                    clear.addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        is_removed = true;
                        instance.settings.gradient = $.ThemifyGradient.default;
                        instance.update();
                        is_removed = false;
                    });

                    type.addEventListener('change', function (e) {
                        const v = this.value;
                        instance.setType(v);
                        callback(v);
                    },{passive: true});

                    circle.addEventListener('change', function () {
                        instance.setRadialCircle(this.checked);
                    },{passive: true});
					
                    angle.addEventListener('change', function(){
							let val = parseInt(this.value);
                        if(!val){
								val = 0;
							}
							instance.setAngle(val);
                    }, {passive:true});
                }
                callback(self.getStyleVal(type.id));
            },
            update(id, v, self) {
                const nid = id + '-gradient',
                        input = self.getEl(nid);
                if (input !== null) {
                    const angle = self.getEl(nid + '-angle'),
                            type = self.getEl(nid + '-type'),
                            circle = self.getEl(id + '-circle-radial'),
                            gradient = input.previousElementSibling,
                            text = circle.previousElementSibling;
                    this.controlChange(self, gradient, input, null, type, angle, circle.getElementsByClassName('tb-checkbox')[0], text, true);
                }
            },
            render(data, self) {
                const wrap = document.createElement('div'),
                    selectwrapper = document.createElement('div'),
                    type = document.createElement('select'),
                    options = ['linear', 'radial'],
                    text = document.createElement('span'),
                    gradient = document.createElement('div'),
                    input = document.createElement('input'),
                    clear = document.createElement('a'),
                    _this = this;
                wrap.className = 'themify-gradient-field';
                if (data.option_js !== undefined) {
                    wrap.className += ' tb_group_element_gradient';
                }
                selectwrapper.className = 'selectwrapper';
                type.className = 'tb_lb_option themify-gradient-type';
                type.id = data.id + '-gradient-type';
                text.textContent = self.label.rotation;
                gradient.className = 'tb_gradient_container';
                gradient.tabIndex = -1;
                input.type = 'hidden';
                input.className = 'themify-gradient tb_lb_option';
                input.dataset.id = data.id;
                input.id = data.id + '-gradient';
                clear.className = 'tb_clear_gradient tf_close';
                let tooltip=document.createElement('span');
                tooltip.className='themify_tooltip';
                tooltip.innerText=self.label.clear_gradient;
                clear.appendChild(tooltip);
                clear.href = '#';

                for (let i = 0; i < 2; ++i) {
                    let opt = document.createElement('option');
                    opt.value = options[i];
                    opt.textContent = self.label[options[i]];
                    type.appendChild(opt);
                }
                selectwrapper.appendChild(type);
                wrap.appendChild(selectwrapper);
                const angleData = $.extend(true, {}, data);
                angleData.id=data.id+'-gradient-angle';
                const angleWarp = self.angle.render(angleData,self);
                wrap.appendChild(angleWarp);
                wrap.appendChild(text);
                wrap.appendChild(self.checkboxGenerate('checkbox',
                        {
                            id: data.id + '-circle-radial',
                            options: [{name: '1', value: self.label.circle_radial}]
                        }
                ));

                wrap.appendChild(gradient);
                wrap.appendChild(input);
                wrap.appendChild(clear);
                self.initControl(input, data);
                self.afterRun.push(function () {
                    _this.controlChange(self, gradient, input, clear, type, angleWarp.getElementsByClassName('tb_angle_input')[0], wrap.getElementsByClassName('tb-checkbox')[0], text);
                });
                return wrap;
            }
        },
        fontColor: {
            update(id, v, self) {
                self.radio.update(id, self.getStyleVal(id), self);
            },
            render(data, self) {
                data.isFontColor = true;
                const roptions = {
                    id: data.id,
                    type: 'radio',
                    option_js: true,
                    isFontColor: true,
                    options: [
                        {value: data.s + '_solid', name: self.label.solid},
                        {value: data.g + '_gradient', name: self.label.gradient}
                    ]
                },
                radioWrap = self.radioGenerate('radio', roptions),
                radio = radioWrap.querySelector('.tb_lb_option'),
                colorData = $.extend(true, {}, data);
                colorData.label = '';
                colorData.type = 'color';
                colorData.id = data.s;
                colorData.prop = 'color';
                colorData.wrap_class = 'tb_group_element_' + data.s + '_solid';

                const color = self.create([colorData]);

                colorData.id = data.g;
                colorData.wrap_class = 'tb_group_element_' + data.g + '_gradient';
                colorData.type = 'gradient';
                colorData.prop = 'background-image';

                const gradient = self.create([colorData]);
                self.afterRun.push(function () {
                    const field = radio.parentNode.closest('.tb_field');
                    field.parentNode.insertBefore(color, field.nextElementSibling);
                    field.parentNode.insertBefore(gradient, field.nextElementSibling);
                });
                return radioWrap;
            }
        },
        imageGradient: {
            update(id, v, self) {
                self.radio.update(id + '-type', self.getStyleVal(id + '-type'), self);
                self.file.update(id, v, self);
                self.gradient.update(id, v, self);
                const el = self.getEl( id );
                if (el !== null) {
                    let p = el.closest('.tb_tab'),
                        imageOpt = p.getElementsByClassName('tb_image_options'),
                        eid = p.getElementsByClassName('tb_gradient_image_color')[0].getElementsByClassName('tfminicolors-input')[0].id;
                    self.color.update(eid, self.getStyleVal(eid), self);
                    for(let i=0;i<imageOpt.length;++i){
                        eid=imageOpt[i].getElementsByClassName('tb_lb_option')[0].id;
                        self.select.update(eid, self.getStyleVal(eid), self);
                    }
                }
            },
            render(data, self) {
                const wrap = document.createElement('div'),
                        imageWrap = document.createElement('div');
                wrap.className = 'tb_image_gradient_field';
                imageWrap.className = 'tb_group_element_image';
                wrap.appendChild(self.radioGenerate('radio',
                        {type: data.type,
                            id: data.id + '-type',
                            options: [
                                {name: self.label.image, value: 'image'},
                                {name: self.label.gradient, value: 'gradient'}
                            ],
                            option_js: true
                        }
                ));
                const extend = $.extend(true, {}, data);
                extend.type = 'image';
                extend.class = 'xlarge';
                //image
                imageWrap.appendChild(self.file.render('image', $.extend(true,{}, extend), self));
                wrap.appendChild(imageWrap);
                //gradient
                extend.type = 'gradient';
                delete extend.class;
                delete extend.binding;
                wrap.appendChild(self.gradient.render(extend, self));
                self.afterRun.push(function () {
                    const group={
                        'wrap_class':'tb_group_element_image',
                        'type':'group',
                        'options':[]
                    };
                     //color
                    extend.prop='background-color';
                    extend.wrap_class='tb_gradient_image_color';
                    extend.label=self.label['bg_c'];
                    extend.type='color';
                    extend.id=extend.colorId;
                    group.options.push($.extend({}, extend));

                    //repeat
                    extend.prop='background-mode';
                    extend.wrap_class='tb_image_options';
                    extend.label=self.label['b_r'];
                    extend.repeat=true;
                    extend.type='select';
                    extend.id=extend.repeatId;
                    group.options.push($.extend({}, extend));

                    //position
                    extend.prop='background-position';
                    extend.wrap_class='tb_image_options';
                    extend.label=self.label['b_p'];
                    extend.position=true;
                    extend.type='position_box';
                    extend.id=extend.posId;
                    delete extend.repeat;
                    group.options.push($.extend({}, extend));
                    
                    const field = imageWrap.parentNode.closest('.tb_field');
                    field.parentNode.insertBefore(self.create([group]), field.nextElementSibling);
                });
                return wrap;
            }
        },
        layout: {
            controlChange(el) {
                el.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.target !== el) {
                        const selected = e.target.closest('a');
                        if (selected !== null) {
                            const items = this.getElementsByClassName('tfl-icon');
                            for (let i = items.length - 1; i > -1; --i) {
                                items[i].classList.remove('selected');
                            }
                            selected.classList.add('selected');
                            api.hasChanged = true;
                            Themify.triggerEvent(this, 'change', {val: selected.id});
                        }
                    }
                });
            },
            update(id, v, self) {
                const input = self.getEl(id);
                if (input !== null) {
                    const items = input.getElementsByClassName('tfl-icon');
                    for (let i = items.length - 1; i > -1; --i) {
                        items[i].classList.toggle('selected',v === items[i].id);
                    }
                    if (v === undefined) {
                        let def = input.dataset['default'];
                        if (def === undefined) {
                            def = items[0];
                        }
                        else {
                            def = def.querySelector('#' + def);
                        }
                        def.classList.add('selected');
                    }
                }
            },
            render(data, self) {
                const p = document.createElement('div');
                    let options = self.getOptions(data),
                    v = self.getStyleVal(data.id);

                if (data.color === true && data.transparent === true) {
                    options = options.slice();
                    options.push({img: 'transparent', value: 'transparent', label: self.label.transparent});
                }
                p.className = 'themify-layout-icon';
                if (self.is_repeat === true) {
                    p.className += self.is_sort===true?' tb_lb_sort_child':' tb_lb_option_child';
                    p.dataset['inputId'] = data.id;
                }
                else {
                    p.className += ' tb_lb_option';
                    p.id = data.id;
                }
                if (data['class'] !== undefined) {
                    p.className += ' ' + data.class;
                }

                if (v === undefined) {
                    const def = themifyBuilder.modules[ self.type ];
                    if (def !== undefined && def.defaults !== undefined && def.defaults[data.id]) {
                        v = def.defaults[data.id];
                    }
                    else {
                        v = options[0].value;
                    }
                }

                for (let i = 0, len = options.length; i < len; ++i) {
                    let a = document.createElement('a'),
                            tooltip = document.createElement('span'),
                            sprite;
                    a.href = '#';
                    a.className = 'tfl-icon';
                    a.id = options[i].value;
                    if ( v === options[i].value.toString() ) {
                        a.className += ' selected';
                    }
                    tooltip.className = 'themify_tooltip';
                    tooltip.textContent = options[i].label;

                    if (data.mode === 'sprite' && options[i].img.indexOf('.png') === -1) {
                        sprite = document.createElement('span');
                        sprite.className = 'tb_sprite';
                        if (options[i].img.indexOf('http') !== -1) {
                            sprite.style['backgroundImage'] = 'url(' + options[i].img + ')';
                        }
                        else {
                            sprite.className += ' tb_' + options[i].img;
                        }
                    }
                    else {
                        sprite = document.createElement('img');
                        sprite.alt = options[i].label;
                        sprite.src = options[i].img.indexOf('http') !== -1 ? options[i].img : themifyBuilder.builder_url + '/editor/img/' + options[i].img;
                    }

                    a.appendChild(sprite);
                    a.appendChild(tooltip);
                    p.appendChild(a);
                }
                this.controlChange(p);
                if(self.component==='row' && (data.id==='row_width' || data.id==='row_height')){
                    api.Utils.changeOptions(p,data.type);
                }
                else{
                    self.initControl(p, data);
                }
                return p;
            }
        },
        layoutPart: {
            data: [],
            get(callback) {
                const self = this;
                $.ajax({
                    type: 'POST',
                    url: themifyBuilder.ajaxurl,
                    dataType: 'json',
                    data: {
                        action: 'tb_get_library_items',
                        nonce: themifyBuilder.tb_load_nonce,
                        pid: themifyBuilder.post_ID
                    },
                    beforeSend(xhr) {
                        Common.showLoader('show');
                    },
                    success(data) {
                        Common.showLoader('hide');
                        self.data = data;
                        callback();
                    },
                    error() {
                        Common.showLoader('error');
                    }
                });
            },
            render(data, self) {
                const _this = this,
                        d = document.createDocumentFragment(),
                        selectWrap = self.select.render(data, self),
                        edit = document.createElement('a'),
                        add = document.createElement('a'),
                        select = selectWrap.querySelector('select');
                function callback() {
                    const s = self.values[data.id],
                        currentLayoutId =api.Forms.LayoutPart.id!==null ?api.Forms.LayoutPart.id.toString():null;
                    select.appendChild(document.createElement('option'));
                    for (let i = 0, len = _this.data.length; i < len; ++i) {
                        if(currentLayoutId!==_this.data[i].id.toString()){
                            let opt = document.createElement('option');
                            opt.value = _this.data[i].post_name;
                            opt.textContent = _this.data[i].post_title;
                            if (s === _this.data[i].post_name) {
                                opt.selected = true;
                            }
                            select.appendChild(opt);
                        }
                    }
                }
                if (_this.data.length === 0) {
                    _this.get(callback);
                }
                else {
                    callback();
                }
                d.appendChild(selectWrap);
                edit.target = add.target = '_blank';
                edit.className = 'tb_icon_btn';
                edit.href = data.edit_url;
                add.href = data.add_url;
                add.className = 'add_new tf_plus_icon tb_icon_btn';
                edit.appendChild(api.Utils.getIcon('ti-folder'));
                edit.appendChild(document.createTextNode(self.label['mlayout']));
                add.appendChild(document.createTextNode(self.label['nlayout']));
                d.appendChild(document.createElement('br'));
                d.appendChild(add);
                d.appendChild(edit);
                return d;
            }
        },
        separator: {
            render(data, self) {
                let seperator;
                const txt = self.label[data.label] !== undefined ? self.label[data.label] : data.label;
                if (txt !== undefined) {
                    seperator = data.wrap_class !== undefined?document.createElement('div'):document.createDocumentFragment();
                    const h4 = document.createElement('h4');
                        h4.textContent  = txt;
                        seperator.appendChild(document.createElement('hr'));
                        seperator.appendChild(h4);
                        if(data.wrap_class!==undefined){
                            seperator.className = data.wrap_class;
                        }
                }
                else if (data.html !== undefined) {
                    const tmp = document.createElement('div');
                    tmp.innerHTML = data.html;
                    seperator = tmp.firstChild;
                    if (data.wrap_class !== undefined) {
                        seperator.className = data.wrap_class;
                    }
                }
                else {
                    seperator = document.createElement('hr');
                    if (data.wrap_class !== undefined) {
                            seperator.className = data.wrap_class;
                    }
                }
                return seperator;
            }
        },
        multiColumns: {
            render(data, self) {
                const opt = [],
                        columnOptions = [
                            {
                                id: data.id + '_gap',
                                label: self.label['c_g'],
                                type: 'range',
                                prop: 'column-gap',
                                selector: data.selector,
                                wrap_class: 'tb_multi_columns_wrap',
                                units: {
                                    px: {
                                        max: 500
                                    }
                                }
                            },
                            {	type: 'multi',
                                wrap_class: 'tb_multi_columns_wrap',
                                label: self.label['c_d'],
                                options: [
                                    {
                                        type: 'color',
                                        id: data.id + '_divider_color',
                                        prop: 'column-rule-color',
                                        selector: data.selector
                                    },
                                    {
                                        type: 'range',
                                        id: data.id + '_divider_width',
                                        class: 'tb_multi_columns_width',
                                        prop: 'column-rule-width',
                                        selector: data.selector,
                                        units: {
                                            px: {
                                                max: 500
                                            }
                                        }
                                    },
                                    {
                                        type: 'select',
                                        id: data.id + '_divider_style',
                                        options: self.static.border,
                                        prop: 'column-rule-style',
                                        selector: data.selector
                                    }
                                ]
                            }


                        ];
                for (let i = 0; i < 7; ++i) {
                    opt[i] = i === 0 ? '' : i;
                }
                data.options = opt;
                const ndata = $.extend(true, {}, data);
                ndata.type = 'select';
                const wrap = self.select.render(ndata, self),
                        select = wrap.querySelector('select');
                self.afterRun.push(function () {
                    const field = select.closest('.tb_field');
                    field.parentNode.insertBefore(self.create(columnOptions), field.nextElementSibling);

                });
                return wrap;
            }
        },
        expand: {
            render(data, self) {
                const wrap = document.createElement('fieldset'),
                        expand = document.createElement('div'),
                        toggle = document.createElement('div'),
                        txt = self.label[data.label] !== undefined ? self.label[data.label] : data.label;
                wrap.className = 'tb_expand_wrap';
                toggle.className = 'tb_style_toggle tb_closed';
                expand.className = 'tb_expanded_opttions';
                toggle.appendChild(document.createTextNode(txt));
                toggle.appendChild(api.Utils.getIcon('ti-angle-up'));
                wrap.appendChild(toggle);
                wrap.appendChild(expand);
                toggle.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    if (this.dataset['done'] === undefined) {
                        this.dataset['done'] = true;
                        expand.appendChild(self.create(data.options));
                        if (self.clicked === 'setting') {
                            self.setUpEditors();
                        }
                        self.callbacks();
                        Themify.body.triggerHandler( 'tb_options_expand', [ expand ] );
                    }
                    this.classList.toggle('tb_closed');
                });
                return wrap;
            }
        },
        gallery: {
            file_frame: null,
            cache: {},
            init(btn, input) {
                const openMediaLibrary =  function (e){
                    e.preventDefault();
                    e.stopPropagation();
                    if (_this.file_frame === null) {
                        // Create the media frame.
                        _this.file_frame = wp.media.frames.file_frame = wp.media({
                            frame: 'post',
                            state: 'gallery-library',
                            library: {
                                type: 'image'
                            },
                            title: wp.media.view.l10n.editGalleryTitle,
                            editing: true,
                            multiple: true,
                            selection: false
                        });
                        _this.file_frame.el.classList.add('themify_gallery_settings');
                    }
                    else {
                        _this.file_frame.options.selection.reset();
                    }
                    wp.media.gallery.shortcode = function (attachments) {
                        const props = attachments.props.toJSON(),
                                attrs = _.pick(props, 'orderby', 'order');

                        if (attachments.gallery) {
                            Object.assign(attrs, attachments.gallery.toJSON());
                        }
                        attrs.ids = attachments.pluck('id');
                        // Copy the `uploadedTo` post ID.
                        if (props.uploadedTo) {
                            attrs.id = props.uploadedTo;
                        }
                        // Check if the gallery is randomly ordered.
                        if (attrs._orderbyRandom) {
                            attrs.orderby = 'rand';
                            delete attrs._orderbyRandom;
                        }
                        // If the `ids` attribute is set and `orderby` attribute
                        // is the default value, clear it for cleaner output.
                        if (attrs.ids && 'post__in' === attrs.orderby) {
                            delete attrs.orderby;
                        }
                        // Remove default attributes from the shortcode.
                        for (let key in wp.media.gallery.defaults) {
                            if (wp.media.gallery.defaults[key] === attrs[key]) {
                                delete attrs[key];
                            }
                        }
                        delete attrs['_orderByField'];
                        const shortcode = new topWindow.wp.shortcode({
                            tag: 'gallery',
                            attrs: attrs,
                            type: 'single'
                        });
                        wp.media.gallery.shortcode = clone;
                        return shortcode;
                    };

                    const v = input.value.trim();
                    if (v.length > 0) {
                        _this.file_frame = wp.media.gallery.edit(v);
                        _this.file_frame.state('gallery-edit');
                    } else {
                        _this.file_frame.state('gallery-library');
                        _this.file_frame.open();
                        _this.file_frame.$el.find('.media-menu .media-menu-item').last().trigger('click');
                    }

                    const setShortcode = function (selection) {
                        const v = wp.media.gallery.shortcode(selection).string().slice(1, -1);
                        input.value = '[' + v + ']';
                        preview(selection.models);
                        Themify.triggerEvent(input, 'change');
                        api.hasChanged = true;
                    };
                    _this.file_frame.off('update', setShortcode).on('update', setShortcode);
                };
                btn.addEventListener('click', openMediaLibrary);

				const clone = wp.media.gallery.shortcode,
					_this = this,
					val = input.value.trim(),
					preview = function (images, is_ajax) {
						const prewiew_wrap = document.createElement('div'),
							pw = input.parentNode.getElementsByClassName('tb_shortcode_preview')[0];
						prewiew_wrap.className = 'tb_shortcode_preview';
						if (pw !== undefined) {
							pw.parentNode.removeChild(pw);
						}
						for (let i = 0, len = images.length; i < len; ++i) {
							let img = document.createElement('img');
							img.width = img.height = 50;
							if (is_ajax === true) {
								img.src = images[i];
							}
							else {
								let attachment = images[i].attributes;
								img.src = attachment.sizes.thumbnail ? attachment.sizes.thumbnail.url : attachment.url;
							}
							prewiew_wrap.appendChild(img);
						}
						prewiew_wrap.addEventListener('click',openMediaLibrary);
						input.parentNode.insertBefore(prewiew_wrap, input.nextElementSibling);
					};
                if (val.length > 0) {
                    if (this.cache[val] !== undefined) {
                        preview(this.cache[val], true);
                    }
                    else {
                        $.ajax({
                            type: 'POST',
                            url: themifyBuilder.ajaxurl,
                            dataType: 'json',
                            data: {
                                action: 'tb_load_shortcode_preview',
                                tb_load_nonce: themifyBuilder.tb_load_nonce,
                                shortcode: val
            },
                            success(data) {
                                preview(data, true);
                                _this.cache[val] = data;
                            }
                        });
                    }
                }
            },
            render(data, self) {
                const d = document.createDocumentFragment(),
                    a = document.createElement('a'),
                    _this = this;
                let cl = data.class !== undefined ? data.class : '';
                cl += ' tb_shortcode_input';

                a.href = '#';
                a.className = 'builder_button tb_gallery_btn';
                a.textContent = self.label.add_gallery;
                data.class = cl;
                d.appendChild(self.textarea.render(data, self));
                d.appendChild(a);

                self.afterRun.push(function () {
                    _this.init(a, a.previousElementSibling);
                    if (self.is_new === true && self.type === 'gallery' && self.clicked === 'setting') {
                        a.click();
                    }
                });
                return d;
            }
        },
        textarea: {
            render(data, self) {
                const f = document.createDocumentFragment(),
                        area = document.createElement('textarea'),
                        v = self.getStyleVal(data.id);
                if (self.is_repeat === true) {
                    area.className = self.is_sort===true?'tb_lb_sort_child':'tb_lb_option_child';
                    area.dataset['inputId'] = data.id;
                }
                else {
                    area.className = 'tb_lb_option';
                    area.id = data.id;
                }
                area.className += ' '+(data['class'] !== undefined?data.class:'xlarge');
                if (v !== undefined) {
                    area.value = v;
                }
                if (data.rows !== undefined) {
                    area.rows = data.rows;
                }
                if ( data.readonly !== undefined && data.readonly ) {
                    area.setAttribute( 'readonly', 1 );
                }
                f.appendChild(self.initControl(area, data));
                if(data.codeeditor !== undefined){
                    self.afterRun.push(function(){
                        self.code_editor.load(function(){
                            const conf = themifyBuilder.c_e.config;
                            conf['codemirror']['mode']=data.codeeditor;
                            conf['codemirror']['lineNumbers']=false;
                            const ce = topWindow.wp.codeEditor.initialize(area,conf);
                            self.code_editor.setHeight(ce.codemirror.display.wrapper,'m');
                            ce.codemirror.on('change',function(cm){
                                area.value = cm.getValue();
                                Themify.triggerEvent(area,'keyup');
                            });
                        });
                    });
                }
                if (data['after'] !== undefined) {
					f.appendChild(self.after(data ));
                }
                if (data['description'] !== undefined) {
                    f.appendChild(self.description(data.description));
                }
                return f;
            }
        },
		address : {
			render ( data, self ) {
				return self.textarea.render( data, self );
			}
		},
        wp_editor: {
            render(data, self) {
                const wrapper = document.createElement('div'),
                        tools = document.createElement('div'),
                        media_buttons = document.createElement('div'),
                        add_media = document.createElement('button'),
                        icon = document.createElement('span'),
                        tabs = document.createElement('div'),
                        switch_tmce = document.createElement('button'),
                        switch_html = document.createElement('button'),
                        container = document.createElement('div'),
                        quicktags = document.createElement('div'),
                        textarea = document.createElement('textarea');
                        let id;

                wrapper.className = 'wp-core-ui wp-editor-wrap tmce-active';
                textarea.className = 'tb_lb_wp_editor fullwidth';
                if (self.is_repeat === true) {
                    id = Math.random().toString(36).substr(2, 7);
                    textarea.className += self.is_sort===true?' tb_lb_sort_child':' tb_lb_option_child';
                    textarea.dataset['inputId'] = data.id;
                    if (data.control !== false) {
                        if (data.control === undefined) {
                            data.control = {};
                        }
                        data.control.repeat = true;
                    }
                }
                else {
                    textarea.className += ' tb_lb_option';
                    id = data.id;
                }
                textarea.id = id;
                wrapper.id = 'wp-' + id + '-wrap';
                tools.id = 'wp-' + id + '-editor-tools';
                tools.className = 'wp-editor-tools';

                media_buttons.id = 'wp-' + id + '-media-buttons';
                media_buttons.className = 'wp-media-buttons';

                add_media.type = 'button';
                add_media.className = 'button insert-media add_media';
                // add_media.dataset['editor'] = id;
                icon.className = 'wp-media-buttons-icon';

                tabs.className = 'wp-editor-tabs';

                switch_tmce.type = 'button';
                switch_tmce.className = 'wp-switch-editor switch-tmce';
                switch_tmce.id = id + '-tmce';
                switch_tmce.dataset['wpEditorId'] = id;
                switch_tmce.textContent = self.label.visual;

                switch_html.type = 'button';
                switch_html.className = 'wp-switch-editor switch-html';
                switch_html.id = id + '-html';
                switch_html.dataset['wpEditorId'] = id;
                switch_html.textContent = self.label.text;

                container.id = 'wp-' + id + '-editor-container';
                container.className = 'wp-editor-container';

                quicktags.id = 'qt_' + id + '_toolbar';
                quicktags.className = 'quicktags-toolbar';

                if (data['class'] !== undefined) {
                    textarea.className += ' ' + data.class;
                }
                if (self.values[data.id] !== undefined) {
                    textarea.value = self.values[data.id];
                }
                textarea.rows = 12;
                textarea.cols = 40;
                container.appendChild(textarea);
                container.appendChild(quicktags);

                tabs.appendChild(switch_tmce);
                tabs.appendChild(switch_html);

                add_media.appendChild(icon);
                add_media.appendChild(document.createTextNode(self.label.add_media));
                media_buttons.appendChild(add_media);
                tools.appendChild(media_buttons);
                tools.appendChild(tabs);
                wrapper.appendChild(tools);
                wrapper.appendChild(container);
                self.editors.push({'el': textarea, 'data': data});
                return wrapper;
            }
        },
        select: {
            dataset_cache : {},
            update(id, v, self) {
                const item = self.getEl(id);
                if (item !== null) {
                    if (v !== undefined) {
                        item.value = v;
                    }
                    else if (item[0] !== undefined) {
                        item[0].selected = true;
                    }
                }
            },
            make_options : function( data,v, self ) {
                const d = document.createDocumentFragment(),
                        options = self.getOptions(data);
                for (let k in options) {
                    let opt = document.createElement('option');
                    opt.value = k;
                    opt.text = options[k];
                    // Check for responsive disable
                    if(undefined !== data['binding'] && undefined !== data['binding'][k] && undefined !== data['binding'][k]['responsive'] && undefined !== data['binding'][k]['responsive']['disabled'] && -1 !== data['binding'][k]['responsive']['disabled'].indexOf(data.id)){
                        opt.className = 'responsive_disable';
                    }
                    if (v === k || (v === undefined && k === data.default)) {
                        opt.selected = true;
                    }
                    d.appendChild(opt);
                }
                return d;
            },
            render(data, self) {
                const _this = this,
                    select_wrap = document.createElement('div'),
                    select = document.createElement('select'),
                    d = document.createDocumentFragment(),
                    v = self.getStyleVal(data.id);
                select_wrap.className = 'selectwrapper';
                if (self.is_repeat === true) {
                    select.className =self.is_sort===true?'tb_lb_sort_child':'tb_lb_option_child';
                    select.dataset['inputId'] = data.id;
                }
                else {
                    select.className = 'tb_lb_option';
                    select.id = data.id;
                }
				select.className+=' tf_scrollbar';
                if (data['class'] !== undefined) {
                    select.className += ' ' + data.class;
                }
                const populate = function( data ) {
                    if ( data['optgroup'] ) {
                        const optgroups = self.getOptions( data );
                        for ( let k in optgroups ) {
                            if(optgroups[k]['label']!==undefined){
                                let o = document.createElement('optgroup');
                                    o.setAttribute( 'label', optgroups[k]['label'] );
                                    o.appendChild( _this.make_options( optgroups[k],v, self ) );
                                    select.appendChild( o );
                            }
                            else{
                                select.appendChild( _this.make_options(optgroups[k],v, self ));
                            }
                        }
                    } 
                    else {
                        select.appendChild( _this.make_options( data,v, self ) );
                    }
                };
                if ( data['dataset'] !== undefined ) {
                        if ( _this.dataset_cache[ data['dataset'] ] !== undefined ) {
                                populate( _this.dataset_cache[ data['dataset'] ] );
                        } 
                        else {
                                $.ajax({
                                        type: 'POST',
                                        url: themifyBuilder.ajaxurl,
                                        dataType: 'json',
                                        data: {
                                                action: 'tb_get_select_dataset',
                                                dataset : data['dataset'],
                                                nonce: themifyBuilder.tb_load_nonce,
                                                pid: themifyBuilder.post_ID
                                        },
                                        beforeSend(xhr) {
                                                Common.showLoader('show');
                                        },
                                        success( res ) {
                                                if ( res.success ) {
                                                        Common.showLoader('hide');
                                                        _this.dataset_cache[ data['dataset'] ] = res.data;
                                                        populate( res.data );
                                                }
                                        },
                                        error() {
                                                Common.showLoader('error');
                                        }
                                });
                        }
                } 
                else {
                        populate( data );
                }
                select_wrap.appendChild(self.initControl(select, data));
                d.appendChild(select_wrap);
                if (data['after'] !== undefined) {
                    d.appendChild(self.after(data ));
                }
                if (data['description'] !== undefined) {
                    d.appendChild(self.description(data.description));
                }
                if (data['tooltip'] !== undefined) {
                    d.appendChild(self.hint(data.tooltip));
                }
                return d;
            }
        },
        font_select: {
            loaded_fonts: [],
            fonts: {},
            safe: [],
            google: [],
            cf: [],
            updateFontVariant(value, weight, self, type) {
                if (!weight) {
                    return;
                }
                type = '' === type || type===undefined? undefined !== this.google[value] ? 'google' : 'cf' : type;
                type = 'webfont' === type ? 'fonts' : type;
				const variants =(this[type][value] && this[type][value].v)?this[type][value].v:null;
                if (!variants || variants.length === 0 ) {
                    weight.closest('.tb_field').classList.add('_tb_hide_binding');
                    return;
                }

                let selected = self.getStyleVal(weight.id);
				if(undefined === selected){
					selected =  'google' === type ? 'regular' : 'normal';
				}
                weight.dataset['selected'] = value;
                while (weight.firstChild!==null) {
                    weight.removeChild(weight.lastChild);
                }
                weight.closest('.tb_field').classList.remove('_tb_hide_binding');
                for (let i = 0, len = variants.length; i < len; ++i) {
                    let opt = document.createElement('option');
                    opt.value = opt.textContent = variants[i];
                    if (variants[i] === selected) {
                        opt.selected = true;
                    }
                    weight.appendChild(opt);
                }
            },
            loadGoogleFonts( fontFamilies ) {
                fontFamilies = $.unique( fontFamilies.split( '|' ) );
                const result = {google:[],cf:[]},
                    loaded = [],
                    self = this,
					loading = function () {
						for ( let i = loaded.length - 1; i > -1; --i ) {
							if ( self.loaded_fonts.indexOf( loaded[i] ) === -1 ) {
								self.loaded_fonts.push( loaded[i] );
							}
						}
						Themify.body.triggerHandler( 'tb_font_stylesheet_loaded', [ self, loaded ] );
					};
                for ( let i = fontFamilies.length - 1; i > -1; --i ) {
                    if ( fontFamilies[i] && this.loaded_fonts.indexOf( fontFamilies[i] ) === -1 && (result.google.indexOf( fontFamilies[i] ) === -1 || result.cf.indexOf( fontFamilies[i] ) === -1) ) {
                        let req = fontFamilies[i].split( ':' ),
                            weight = ('regular' === req[1] || 'normal' === req[1] || 'italic' === req[1] || parseInt( req[1] )) ? req[1] : '400,700',
                            f = req[0].split( ' ' ).join( '+' ) + ':' + weight;
                        if ( this.loaded_fonts.indexOf( f ) === -1 ) {
                            let type = self.cf[req[0]] !== undefined ? 'cf' : 'google';
                                f += 'google' === type ? ':latin,latin-ext':'';
                            result[type].push( f );
                            loaded.push( f );
                        }
                    }
                }
				if(result.google.length > 0){
					const url=window.location.protocol+'//fonts.googleapis.com/css?family='+encodeURI(result.google.join('|'))+'&display=swap';
					Themify.LoadCss(url,false,null,null,loading);
					if(api.mode==='visual'){
						topWindow.Themify.LoadCss(url,false);
					}
				}
				if(result.cf.length > 0){
					const url=themifyBuilder.cf_api_url+encodeURI(result.cf.join('|'));
					Themify.LoadCss(url,false,null,null,loading);
					if(api.mode==='visual'){
						topWindow.Themify.LoadCss(url,false);
					}
				}
            },
            controlChange(select, preview, pw, self) {
                const _this = this,
                    $combo = $(select).comboSelect({
                    'comboClass': 'themify-combo-select',
                    'comboArrowClass': 'themify-combo-arrow',
                    'comboDropDownClass': 'themify-combo-dropdown tf_scrollbar',
                    'inputClass': 'themify-combo-input',
                    'disabledClass': 'themify-combo-disabled',
                    'hoverClass': 'themify-combo-hover',
                    'selectedClass': 'themify-combo-selected',
                    'markerClass': 'themify-combo-marker'
                }).parent('div');
				$combo[0].addEventListener('click', function (e) {
					const target=e.target;
					if(target.classList.contains('themify-combo-item')){
						api.hasChanged = true;
						const value = target.dataset['value'],
						tab=select.closest('.tb_tab');
						let type = this.querySelector('option[value="' + value + '"]');
						if(type){
							type=type.dataset['type'];
						}
						if ('webfont' !== type && value && _this.loaded_fonts.indexOf(value) === -1) {
							_this.loadGoogleFonts(value);
						}
						if(tab){
							_this.updateFontVariant(value, tab.getElementsByClassName('font-weight-select')[0], self,type);
						}
						setTimeout(function () {
							Themify.triggerEvent(select, 'change');
						}, 10);
					}
                },{passive: true});
				
				$combo[0].addEventListener('mouseover', function (e) {
					const target=e.target;
                    if(target.classList.contains('themify-combo-item')){
                        let value = target.dataset['value'];
                        if (value) {
                            if (!$(target).is(':visible')) {
                                return;
                            }
                            if (value === 'default') {
                                value = 'inherit';
                            }
                            preview.style['top'] =target.offsetTop-target.parentNode.scrollTop + 30 + 'px';
                            preview.style['fontFamily'] = value;
                            preview.style['display'] = 'block';
							
                            if (value !== 'inherit' && !target.classList.contains('tb_font_loaded')) {
                                target.classList.add('tb_font_loaded');
								const mode=target.ownerDocument===topWindow.document?'top':'bottom';
								if(_this.fonts[mode]===undefined){
									_this.fonts[mode]=[];
								}
                                if (_this.fonts[mode].indexOf(value) === -1) {
									const callback = function (value) {
										_this.fonts[mode].push(value);
										pw.classList.remove('themify_show_wait');
									};
                                    let type = this.querySelector('option[value="' + value + '"]');
									if(type){
										type=type.dataset['type'];
									}
                                    if (type && type!== 'webfont') {
										let url='';
                                        if('google' === type){
											url=window.location.protocol+'//fonts.googleapis.com/css?family='+encodeURI(value)+'&display=swap';
                                        }
										else if('cf' === type){
											url=themifyBuilder.cf_api_url+encodeURI(value);
                                        }
										if(url!==''){
											pw.classList.add('themify_show_wait');
											const tf=mode==='top'?topWindow.Themify:Themify;
											tf.LoadCss(url,false,null,null,callback);
										}
                                    }
                                    else {
                                        callback(value);
                                    }
                                }
                                target.style['fontFamily'] = value;
                            }
                        }
					}
                },{passive: true});
                $combo.trigger('comboselect:open')
                        .on('comboselect:close', function () {
                            preview.style['display'] = 'none';
                        });
                $combo[0].getElementsByClassName('themify-combo-arrow')[0].addEventListener('click', function () {
                    preview.style['display'] = 'none';
                },{passive: true});
            },
            update(id, v, self) {
                const select = self.getEl(id);
                if (select !== null) {
                    if (v === undefined) {
                        v = '';
                    }
                    select.value = v;
                    this.updateFontVariant(v, select.closest('.tb_tab').getElementsByClassName('font-weight-select')[0], self);
                    if (select.dataset['init'] === undefined) {
                        const groups = select.getElementsByTagName('optgroup'),
						opt = document.createElement('option');
                        while (groups[0].firstChild) {
                            groups[0].removeChild(groups[0].lastChild);
                        }
                        while (groups[1].firstChild) {
                            groups[1].removeChild(groups[1].lastChild);
                        }
                        opt.value = v;
                        opt.selected = true;
                        if (this.safe[v] !== undefined) {
                            opt.textContent = this.safe[v];
                            groups[0].appendChild(opt);
                        }
                        else if (this.google[v] !== undefined) {
                            opt.textContent = this.google[v].n;
                            groups[1].appendChild(opt);
                        }
                        else if (this.cf[v] !== undefined) {
                            opt.textContent = this.cf[v].n;
                            groups[2].appendChild(opt);
                        }
                        else {
                            opt.textContent = v;
                            groups[0].appendChild(opt);
                        }
                    }
                    else {
                        select.parentNode.getElementsByClassName('themify-combo-input')[0].value = v;
                    }
                }
            },
            render(data, self) {
                const wrapper = document.createElement('div'),
                        select = document.createElement('select'),
                        preview = document.createElement('span'),
                        pw = document.createElement('span'),
                        d = document.createDocumentFragment(),
                        empty = document.createElement('option'),
                        v = self.getStyleVal(data.id),
                        _this = this,
                        group ={safe:self.label.safe_fonts,google:self.label.google_fonts},
                        cfEmpty = Object.keys(this.cf).length < 1;
                if( false === cfEmpty){
                    group['cf'] = self.label.cf_fonts;
                }
                wrapper.className = 'tb_font_preview_wrapper';
                select.className = 'tb_lb_option font-family-select tf_scrollbar';
                select.id = data.id;
                preview.className = 'tb_font_preview';
                pw.textContent = self.label.font_preview;
                empty.value = '';
                empty.textContent = '---';
                d.appendChild(empty);
                if (data['class'] !== undefined) {
                    select.className += ' ' + data.class;
                }
                const groupKeys = ['google','safe'];
                if(false  === cfEmpty){
                    groupKeys.push('cf');
                }
                for (let i = groupKeys.length -1; i >-1; --i) {
                    let optgroup = document.createElement('optgroup');
                    optgroup.label = group[groupKeys[i]];
                    if (v !== undefined) {
                        let opt = document.createElement('option'),
                            txt;
                        opt.value = v;
                        opt.selected = true;
                        if ('cf' === groupKeys[i] && this.cf[v] !== undefined) {
                            txt = this.cf[v].n;
                        }else if ('safe' === groupKeys[i] && this.safe[v] !== undefined) {
                            txt = this.safe[v];
                        }else if ('google' === groupKeys[i] && this.google[v] !== undefined) {
                            txt = this.google[v].n;
                        }else {
                            txt = undefined !== this.cf[v] ? this.cf[v].n : v;
                        }
                        opt.textContent=txt;
                        optgroup.appendChild(opt);
                    }
                    d.appendChild(optgroup);
                }
				const focusIn=function() {
					this.removeEventListener('focusin', focusIn, {once: true,passive: true});
					this.removeEventListener('tf_init', focusIn, {once: true,passive: true});
                    const fonts = _this.safe,
                            f = document.createDocumentFragment(),
							sel=this.querySelector('select'),
                            groups = sel.getElementsByTagName('optgroup');
                    sel.dataset['init'] = true;
                    if (v !== undefined) {
                        for(let h = groups.length-1;h>-1;--h){
                            while (groups[h].firstChild) {
                                groups[h].removeChild(groups[h].lastChild);
                            }
                        }
                    }
                    for (let i in fonts) {
                        let opt = document.createElement('option');
                        opt.value = i;
                        opt.textContent = fonts[i];
                        opt.dataset['type'] = 'webfont';
                        if (v === i) {
                            opt.selected = true;
                        }
                        f.appendChild(opt);
                    }
                    groups[cfEmpty ? 0 :1].appendChild(f);
                    const extGroups = ['google'];
                    if(false === cfEmpty){
                        extGroups.unshift('cf');
                    }
                    for(let g = extGroups.length-1;g>-1;--g){
                        let ff = _this[extGroups[g]],
                        fr = document.createDocumentFragment();
                        for (let i in ff) {
                            let opt = document.createElement('option');
                            opt.value = i;
                            opt.dataset['type'] = extGroups[g];
                            opt.textContent = ff[i].n;
                            if (v === i) {
                                opt.selected = true;
                            }
                            fr.appendChild(opt);
                        }
                        groups['cf' === extGroups[g] ? 0 :cfEmpty ? 1 :2].appendChild(fr);
                    }
                    _this.controlChange(sel, preview, pw, self);
                };
                wrapper.addEventListener('focusin', focusIn, {once: true,passive: true});
				wrapper.addEventListener('tf_init', focusIn, {once: true,passive: true});

                select.appendChild(d);
                preview.appendChild(pw);
                wrapper.appendChild(self.initControl(select, data));
                wrapper.appendChild(preview);
                self.afterRun.push(function () {
                    const weight = self.create([{type: 'select', label: 'f_w', selector: data.selector, class: 'font-weight-select', id: data.id + '_w', prop: 'font-weight'}]),
                            field = wrapper.closest('.tb_field'),
                            weightParent = weight.querySelector('.tb_field');
                    field.parentNode.insertBefore(weight, field.nextElementSibling);
                    _this.updateFontVariant(v, weightParent.querySelector('.font-weight-select'), self);
                });

                return wrapper;
            }
        },
        animation_select: {
            render(data, self) {
                const select_wrap = document.createElement('div'),
                    options = self.static['preset_animation'],
                    select = document.createElement('select'),
                    v = self.values[data.id];
                select_wrap.className = 'selectwrapper';
                select.className = 'tb_lb_option tf_scrollbar';
                select.id = data.id;
                select.appendChild(document.createElement('option'));
                for (let k in options) {
                    let group = document.createElement('optgroup');
                    group.label = k;
                    for (let i in options[k]) {
                        let opt = document.createElement('option');
                        opt.value = i;
                        opt.text = options[k][i];
                        if (v === i) {
                            opt.selected = true;
                        }
                        group.appendChild(opt);
                    }
                    select.appendChild(group);
                }
                select_wrap.appendChild(select);
                return select_wrap;
            }
        },
        select_menu: {
            data: null,
            get(select, v) {
                const self = this,
                        callback = function () {
                            for (let k in self.data) {
                                let opt = document.createElement('option');
                                opt.value = self.data[k].slug;
                                opt.text = self.data[k].name;
                                opt.dataset['termid'] = self.data[k].term_id || '';
                                if (v === self.data[k].slug) {
                                    opt.selected = true;
                                }
                                select.appendChild(opt);
                            }
                        };
                if (self.data === null) {
                    $.ajax({
                        type: 'POST',
                        url: themifyBuilder.ajaxurl,
                        dataType: 'json',
                        data: {
                            action: 'tb_get_menu',
                            tb_load_nonce: themifyBuilder.tb_load_nonce
                        },
                        success(res) {
                            self.data = res;
                            callback();
                        }
                    });
                }
                else {
                    callback();
                }
            },
            render(data, self) {
                const d = document.createDocumentFragment(),
                        select_wrap = document.createElement('div'),
                        select = document.createElement('select'),
                        help = document.createElement('small'),
                        v = self.values[data.id];
                select_wrap.className = 'selectwrapper';
                select.className = 'select_menu_field tf_scrollbar';
                if (self.is_repeat === true) {
                    select.className +=self.is_sort===true?' tb_lb_sort_child':' tb_lb_option_child';
                    select.dataset['inputId'] = data.id;
                }
                else {
                    select.className += ' tb_lb_option';
                    select.id = data.id;
                }
                if (data['class'] !== undefined) {
                    select.className += ' ' + data.class;
                }
                help.innerHTML = self.label.menu_help;
                this.get(select, v);
                select_wrap.appendChild(self.initControl(select, data));
                d.appendChild(select_wrap);
                d.appendChild(document.createElement('br'));
                d.appendChild(help);
                return d;
            }
        },
        sticky: {
            render(data, self) {
                const unstickOption = {},
                    selectedUID = api.activeModel.get('element_id'),
                    _data = $.extend(true, {}, data),
					type=data.key,
					items=api.Models.Registry.items;
				for(let i in items){
					let opt=items[i].attributes;
					if(type===opt.elType && opt.element_id !== selectedUID){
						let uidText,
							st='row' === type?opt.styling:opt.mod_settings;
                        if ('row' === type && st && (st.custom_css_id || st.row_anchor)) {
                            uidText = st.custom_css_id?'#' + st.custom_css_id:'#' + st.row_anchor;
                        }
                        else if ('module' === type && st && st.custom_css_id) {
                            uidText = '#' + st.custom_css_id;
                        }
						else{
							uidText = 'row' === type? 'Row #' + opt.element_id : opt.mod_name + ' #' + opt.element_id;
						}
                        unstickOption[opt.element_id] = uidText;
					}
				}
                _data.options = unstickOption;
                return self.select.render(_data, self);
            }
        },
        selectSearch: {
            update(val, search, options, self) {
                const f = document.createDocumentFragment();
                let first = null;
                search.removeAttribute('data-value');
                search.value = '';
                if (options !== undefined) {
                    for (let k in options) {
                        let item = document.createElement('div');
                        if (first === null) {
                            first = k;
                        }
                        item.dataset['value'] = k;
                        item.className = 'tb_search_item';
                        item.textContent = options[k];
                        if (val === k) {
                            item.className += ' selected';
                            search.setAttribute('data-value', k);
                            search.value = options[k];
                        }
                        f.appendChild(item);
                    }

                    if (search.value === '' && first !== null) {
                        search.value = options[first];
                        search.setAttribute('data-value', first);
                    }
                }
                return f;
            },
            events(search, container) {
                search.addEventListener('keyup', function (e) {
                    const items = container.getElementsByClassName('tb_search_item'),
                            val = this.value.trim(),
                            r = new RegExp(val, 'i');
                    for (let i = 0, len = items.length; i < len; ++i) {
                         items[i].style['display'] = (val === '' || r.test(items[i].textContent))?'block': 'none';
                    }
                },{passive: true});
                container.addEventListener('mousedown', function (e) {
                    if (e.which === 1 && e.target.classList.contains('tb_search_item')) {
                        e.preventDefault();
                        e.stopPropagation();
                        const all_items = this.getElementsByClassName('tb_search_item'),
                                _this = e.target;
                        for (let i = all_items.length - 1; i > -1; --i) {
                            all_items[i].classList.remove('selected');
                        }
                        _this.classList.add('selected');
                        const v = _this.dataset['value'];
                        search.value = _this.textContent;
                        search.dataset['value'] = v;
                        search.blur();
                        search.previousElementSibling.blur();
                        Themify.triggerEvent(search, 'selectElement', {val: v});
                    }
                });
            },
            render(data, self) {
                const container = document.createElement('div'),
                        arrow = document.createElement('div'),
                        search = document.createElement('input'),
                        loader = document.createElement('span'),
                        search_container = document.createElement('div');
                container.className = 'tb_search_wrapper';
                search.className = 'tb_search_input';
                search.autocomplete = 'off';
                search_container.className = 'tb_search_container tf_scrollbar';
                if (self.is_repeat === true) {
                    search.className +=self.is_sort===true?' tb_lb_sort_child':' tb_lb_option_child';
                    search.dataset['inputId'] = data.id;
                }
                else {
                    search.className += ' tb_lb_option';
                    search.id = data.id;
                }
                if (data['class'] !== undefined) {
                    search.className += ' ' + data['class'];
                }
                loader.className = 'tf_loader';
                search_container.tabIndex = 1;
                arrow.tabIndex = 1;
                arrow.className = 'tb_search_arrow';
                search.type = 'text';
                search.placeholder = (data.placeholder !== undefined ? data.placeholder : data.label) + '...';
                search_container.appendChild(this.update(self.values[data.id], search, data.options, self));
                arrow.appendChild(loader);
                container.appendChild(arrow);
                container.appendChild(self.initControl(search, data));
                container.appendChild(search_container);
                if (data['after'] !== undefined) {
					container.appendChild(self.after(data ));
                }
                if (data['description'] !== undefined) {
                    container.appendChild(self.description(data.description));
                }
				if (data['tooltip'] !== undefined) {
					container.appendChild(self.hint(data.tooltip));
				}
                this.events(search, search_container);

                return container;
            }
        },
        optin_provider : {
                cache:null,
                render ( data, self ) {
                        const el = document.createElement( 'div' ),
                            _this = this,
                            callback = function(){
                                  el.appendChild(self.create( _this.cache ));
                            };
                        if(this.cache===null){
                            Common.showLoader( 'show' );
                            $.ajax({
                                    type: 'POST',
                                    url: themifyBuilder.ajaxurl,
                                    dataType: 'json',
                                    data: {
                                            action: 'tb_optin_get_settings',
                                            tb_load_nonce: themifyBuilder.tb_load_nonce
                                    },
                                    success : function( result ) {
                                            Common.showLoader( 'spinhide' );
                                            _this.cache=result;
                                            callback();
                                            self.callbacks();
                                    },
                                    error() {
                                            Common.showLoader( 'error' );
                                    }
                            });
                        }
                        else{
                            callback();
                        }
                        return el;
                }
        },
        check_map_api : {
            render ( data, self ) {
                if(!themifyBuilder[data.map+'_api']){
                    const errData = {
                        type:'separator',
                        html:'<span>'+themifyBuilder[data.map+'_api_err']+'</span>',
                        wrap_class:'tb_group_element_'+data.map
                    };
                    return self.separator.render(errData, self);
                }else{
                    return document.createElement('span');
                }
            }
        },
        query_posts: {
            cacheTypes: null,
            cacheTerms: [],
            render(data, self) {
				let tmp_el,
                    xhr;
                const _this = this,
                    desc = data.description,
                    after= data.after,
                    values=self.values,
                    formatData = function (options) {
                        const result = [];
                        for (let k in options) {
                            result[k] = options[k].name;
                        }
                        return result;
                    },
                    update = function (item, val, options) {
                        const container = item.nextElementSibling;
                        while (container.firstChild) {
                            container.removeChild(container.lastChild);
                        }
                        container.appendChild(self.selectSearch.update(val, item, options, self));
                    },
                    get = function (wr, val, type, s) {
                        wr.classList.add('tb_search_wait');
                        if (xhr) {
                            xhr.abort();
                        }
                        xhr = $.ajax({
                            type: 'POST',
                            url: themifyBuilder.ajaxurl,
                            dataType: 'json',
                            data: {
                                action: 'tb_get_post_types',
                                tb_load_nonce: themifyBuilder.tb_load_nonce,
                                type: type,
                                v: val,
                                s: s?s:'',
                                all:data.all,
                                just_current:data.just_current,
                                id:themifyBuilder.post_ID
                            },
                            complete() {
                                wr.classList.remove('tb_search_wait');
                            }
                        });
                        return xhr;
                    };
                (function () {
                    let _data = $.extend(true, {}, data),
                        timeout = null;
                    tmp_el = document.createElement('div');
                    tmp_el.id = data.id ? data.id : data.term_id;

                    self.afterRun.push(function () {
                        let opt = ['id', 'tax_id', 'term_id', 'tag_id'],
                                fr = document.createDocumentFragment(),
                                isInit = null,
                                getTerms = function (search, val, s) {
									const cache_key=s?val+'_'+s:val,
									termsCallback = function (_cache_key_) {
                                        if(data['term_id']===undefined && data['tag_id']===undefined){
                                            return;
                                        }
                                        if(data['all']){
                                            const wrap = search.closest('.'+data.id),
                                                is_all = wrap.querySelector('#'+data.id).value === 'All',
                                                els = wrap.querySelectorAll('.'+data.tax_id+',.'+data.term_id+',.'+data.tag_id);
                                            for(let k=els.length-1;k>-1;--k){
                                                els[k].classList.toggle('tf_hide',is_all);
                                            }

                                        }
                                        const term_id = data['tag_id']===undefined ? data['term_id'].replace('#tmp_id#', val):data['tag_id'],
											parent = search.closest('.tb_input');
										let term_val;
                                        search.id = term_id;
                                        if (isInit === null && values[term_id] !== undefined) {
                                            term_val = values[term_id].split('|')[0];
                                        }
                                        if (!term_val) {
                                            term_val = 0;
                                        }
                                        update(search, term_val, _this.cacheTerms[_cache_key_]);
										if(s || s===''){
                                            search.value=s;
                                        }
                                        if (isInit === null) {
                                            const multiply = document.createElement('input'),
                                                    or = document.createElement('span'),
                                                    wr = document.createElement('div');
                                            or.innerHTML = self.label.or;
                                            multiply.type = 'text';
                                            multiply.className = 'query_category_multiple';
                                            wr.className = 'tb_query_multiple_wrap';
                                            wr.appendChild(or);
                                            wr.appendChild(multiply);
                                            parent.insertBefore(wr, parent.nextSibling);
                                            if (after !== undefined) {
                                                parent.appendChild(self.after(after));
                                            }
                                            if (desc!== undefined) {
                                                parent.appendChild(self.description(desc));
                                            }
                                            if (data['slug_id'] !== undefined) {
                                                const referenceNode = parent.parentNode,
                                                        query_by = self.create([{
                                                                type: 'radio',
                                                                id: 'term_type',
                                                                label: self.label['query_by'],
                                                                default: values['term_type'] === undefined && values[data['tax_id']] === 'post_slug' ? 'post_slug' : 'category', //backward compatibility
                                                                option_js: true,
                                                                options: [
																	{value: 'all', name: self.label['all_posts'] },
                                                                    {value: 'category', name: self.label['query_term_id']},
                                                                    {value: 'post_slug', name: self.label['slug_label']}
                                                                ]
                                                            }]),
                                                        slug = self.create([{
                                                                id: data['slug_id'],
                                                                type: 'text',
                                                                'class': 'large',
                                                                wrap_class: 'tb_group_element_post_slug',
                                                                help: self.label['slug_desc'],
                                                                label: self.label['slug_label']
                                                            }]);
                                                referenceNode.parentNode.insertBefore(query_by, referenceNode);
                                                referenceNode.parentNode.appendChild(slug);

                                            }
											if ( data['sticky_id'] !== undefined ) {
												const sticky = self.create( [ {
													type : 'toggle_switch',
													label : self.label['sticky_first'],
													id : data['sticky_id'],
													options : 'simple',
													wrap_class: 'tb_group_element_all'
												} ] );
												parent.parentNode.parentNode.appendChild( sticky );
											}
                                            multiply.addEventListener('change', function (e) {
                                                Themify.triggerEvent(search, 'queryPosts', {val: term_val});
                                            },{passive: true});
                                            if (timeout !== null) {
                                                clearTimeout(timeout);
                                            }
                                            timeout = setTimeout(function () {
                                                self.callbacks();
                                            }, 2);
                                        }
                                        parent.getElementsByClassName('query_category_multiple')[0].value = term_val;

                                        if (isInit === true || self.is_new) {
                                            Themify.triggerEvent(search, 'queryPosts', {val: term_val});
                                        }
                                        else {
                                            ThemifyConstructor.settings = api.Utils.clear(api.Forms.serialize('tb_options_setting'));
                                        }
                                        isInit = true;
                                    };
                                    if (_this.cacheTerms[cache_key] === undefined) {
                                        get(search.parentNode, val, 'terms',s).done(function (res) {
                                            _this.cacheTerms[cache_key] = res;
                                            termsCallback(cache_key);
                                        });
                                    }
                                    else {
                                        termsCallback(cache_key);
                                    }
                                };
                        for (let i = 0, len = opt.length; i < len; ++i) {
                            if (!_data[opt[i]]) {
                                continue;
                            }
                            _data.id = _data[opt[i]];
                            _data.label = data.labels?.[opt[i]] ? data.labels[opt[i]] : self.label['query_' + opt[i]];
                            _data.type = 'selectSearch';
                            if (opt[i] === 'term_id') {
                                _data.wrap_class = 'tb_search_term_wrap tb_group_element_category';
                                _data.class = 'query_category_single';
                                _data.help = self.label['query_desc'];
                                _data['control'] = {control_type: 'queryPosts'};
                            }
                            else if ((opt[i] === 'tax_id' || opt[i] === 'tag_id') && _data['term_id']===undefined  ){
                                _data['control'] = {control_type: 'queryPosts'};
                            }
                            delete _data.description;
                            delete _data.after;
                            let res = self.create([_data]);
                            if(true === data.just_current){
                                delete _data.wrap_class;
                            }
                            (function () {
                                let is_post = opt[i] === 'id',
                                        is_term = opt[i] === 'term_id' || opt[i] === 'tag_id',
                                        v = is_term ? '' : values[_data.id],
                                        search = res.querySelector('.tb_search_input');
                                search.addEventListener('selectElement', function (e) {
                                    let val = e.detail.val,
                                            nextsearch = this.closest('.tb_field');
                                    if (!is_term) {
                                            if(nextsearch.nextElementSibling!==null){
												nextsearch = nextsearch.nextElementSibling;
												if (!is_post && isInit === true && data['slug_id'] !== undefined) {
													nextsearch = nextsearch.nextElementSibling;
												}
												if(nextsearch!==null){
													nextsearch = nextsearch.getElementsByClassName('tb_search_input')[0];
													if (is_post) {
														if (_this.cacheTypes[val] !== undefined) {
															if(true === data.just_current && 'tag' === values[data['tax_id']]){
																values[data['tax_id']] = 'post_tag';
															}
															update(nextsearch, values[data['tax_id']], formatData(_this.cacheTypes[val].options));
															Themify.triggerEvent(nextsearch, 'selectElement', {val: nextsearch.getAttribute('data-value')});
														}
													}
													else {
														getTerms(nextsearch, val);
                                                        nextsearch.addEventListener('keyup', function (e) {
                                                            if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode === 8 || e.keyCode === 229) {
                                                                setTimeout(function (){
                                                                    getTerms(nextsearch, val,this.value.trim());
                                                                }.bind(this),500);
                                                            }
                                                        },{passive: true});
													}
												}
											}
                                            else if(!is_post){
                                                Themify.triggerEvent(this, 'queryPosts', {val: this.getAttribute('data-value')});
                                            }
                                    }
                                    else {
                                        nextsearch.getElementsByClassName('query_category_multiple')[0].value = val;
                                        Themify.triggerEvent(this, 'queryPosts', {val: val});
                                    }
                                },{passive: true});
                                if (is_post) {
                                    const callback = function () {
                                        if (!v) {
                                            v = 'post';
                                        }
                                        update(search, v, formatData(_this.cacheTypes));
                                        Themify.triggerEvent(search, 'selectElement', {val: v});
                                        search = null;
                                    };
                                    if (_this.cacheTypes === null) {
                                        get(search.parentNode, null, 'post_types').done(function (res) {
                                            _this.cacheTypes = res;
                                            if(data.just_current === true && undefined == v){
                                                v = Object.keys(res);
                                            }
                                            callback();
                                        });
                                    }
                                    else {
                                        setTimeout(callback, 10);
                                    }
                                }else if (is_term && !data['id'] && data['taxonomy'] !== undefined) {
                                    getTerms(search, data['taxonomy']);
                                    search.addEventListener('input', function (e) {
                                        if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode === 8 || e.keyCode === 229) {
                                            setTimeout(function (){
                                                getTerms(search, data['taxonomy'],this.value.trim());
                                            }.bind(this),500);
                                        }
                                    },{passive: true});
                                }
                            })();
                            fr.appendChild(res);
                        }
						if ( _data.query_filter ) {
							let query_filter = self.create( [
								{
									type : 'multi',
									label : self.label['aq'][0],
									id : 'query_date',
									options : [
										{
											id : 'query_date_from',
											label : self.label['aq'][1],
											type : 'date',
											timepicker : false
										},
										{
											id : 'query_date_to',
											label : self.label['aq'][2],
											type : 'date',
											timepicker : false
										}
									],
									wrap_class : 'tb_query_filter' + ( self.values['query_date_from'] || self.values['query_date_to'] ? '' : ' tf_hide' )
								},
								{
									type : 'autocomplete',
									dataset : 'authors',
									id : 'query_authors',
									label : self.label['aq'][7],
									wrap_class : 'tb_query_filter' + ( self.values['query_authors'] ? '' : ' tf_hide' ),
									help : self.label['aq'][9]
								},
								{
									type : 'multi',
									label : self.label['aq'][3],
									id : 'query_cf',
									options : [
										{
											type : 'autocomplete',
											dataset : 'custom_fields',
											id : 'query_cf_key',
											label : self.label['aq'][4]
										},
										{
											id : 'query_cf_value',
											label : self.label['aq'][5],
											type : 'text'
										},
										{
											id : 'query_cf_c',
											label : self.label['aq'][6],
											type : 'select',
											options : {
												'' : 'LIKE',
												'NOT LIKE' : 'NOT LIKE',
												'NOT EXISTS' : 'NOT EXISTS',
												'=' : '=',
												'!=' : '!=',
												'>' : '>',
												'>=' : '>=',
												'<' : '<',
												'<=' : '<='
											}
										}
									],
									wrap_class : 'tb_query_filter' + ( self.values['query_cf_key'] ? '' : ' tf_hide' )
								}
							] );
							fr.appendChild( query_filter );

							let hide_add_new = self.values['query_cf_key'] && self.values['query_authors'] && ( self.values['query_date_from'] || self.values['query_date_to'] ); /* if all advanced query fields have value, don't need to show the Add New button */
							if ( ! hide_add_new ) {
								let tb_field = document.createElement( 'div' ),
									plusWrap = document.createElement( 'div' ),
									plus = document.createElement( 'div' ),
									ul = document.createElement( 'ul' ),
									label = document.createElement( 'div' ),
									span = document.createElement( 'span' );
								if ( ! self.values['query_date_from'] && ! self.values['query_date_to'] ) {
									let li = document.createElement( 'li' );
									li.innerText = self.label['aq'][0];
									li.setAttribute( 'data-id', 'query_date' );
									ul.appendChild( li );
								}
								if ( ! self.values['query_authors'] ) {
									let li = document.createElement( 'li' );
									li.innerText = self.label['aq'][7];
									li.setAttribute( 'data-id', 'query_authors' );
									ul.appendChild( li );
								}
								if ( ! self.values['query_cf_key'] ) {
									let li = document.createElement( 'li' );
									li.innerText = self.label['aq'][3];
									li.setAttribute( 'data-id', 'query_cf' );
									ul.appendChild( li );
								}
								tb_field.className = 'tb_field';
								plusWrap.className = 'tb_input tf_rel';
								label.className = 'tb_label tb_empty_label';
								plus.setAttribute( 'tabindex', '-1' );
								plus.className = 'tb_ui_dropdown_label tb_sort_fields_plus';
								ul.className = 'tb_ui_dropdown_items';
								span.innerText = self.label['aq'][8];
								plus.appendChild( span );
								tb_field.appendChild( label );
								tb_field.appendChild( plusWrap );
								plusWrap.appendChild( plus );
								plusWrap.appendChild( ul );
								fr.appendChild( tb_field );

								ul.addEventListener( 'click', function(e){
									if ( e.target.tagName === 'LI' ) {
										e.preventDefault();
										e.stopPropagation();
										api.Utils.hideOnClick(this);
										let id = e.target.getAttribute( 'data-id' );
										this.closest( '.tb_field[data-type="query_posts"], .tb_field[data-type="advanced_posts_query"]' ).querySelector( '.' + id ).classList.remove( 'tf_hide' );
										e.target.style.display = 'none';
										e.target.removeAttribute( 'data-id' );
										if ( ! this.querySelector( '[data-id]' ) ) {
											tb_field.classList.add( 'tf_hide' );
										}
									}
								});
							}
						}
                        tmp_el.parentNode.replaceChild(fr, tmp_el);
                        _data = tmp_el = null;
                    });
                })();
                return tmp_el;
            }
        },
        hook_content : {
                render( data, self ) {
                        return self.create( [ {
                                type : 'group',
                                label : self.label.hc[0],
                                display : 'accordion',
                                options : [
                                        {
                                                id : 'hook_content',
                                                type : 'builder',
                                                options : [
                                                        {
                                                                type : 'select',
                                                                id : 'h',
                                                                options : data.options,
                                                                after : self.label.hc[1]
                                                        },
                                                        {
                                                                type : 'textarea',
                                                                id : 'c',
                                                                wrap_class : 'tb_disable_dc',
                                                                class : 'fullwidth'
                                                        }
                                                ]
                                        }
                                ]
                        } ] );
                }
        },
        position_box: {
            w:null,
            h:null,
            update(id, v, self) {
                let input = Common.Lightbox.$lightbox[0].querySelector('#'+id);
                if (input === null) {
                    input=Common.Lightbox.$lightbox[0].querySelector('[data-input-id="'+id+'"]');
                }
                if (input !== null) {
                    const wrap = input.closest('.tb_position_box_wrapper'),
                        handler=wrap.getElementsByClassName('tb_position_box_handle')[0],
                        label = wrap.getElementsByClassName('tb_position_box_label')[0],
                        positions=this.getPreDefinedPositions();
                        if(v){
                            if(positions[v]!==undefined){
                                v=positions[v];
                            }
                        }
                        else{
                            v='50,50';
                        }
                        input.value=v;
                        label.textContent=this.getLabel(v);
                        v = v.split(',');
                        handler['style'].left=Math.ceil((v[0]*this.w)/100)+'px';
                        handler['style'].top=Math.ceil((v[1]*this.h)/100)+'px';
                }
            },
            getLabel(val){
                let pos;
                switch (val) {
                    case '0,0':
                        pos = 'Top Left';
                        break;
                    case '50,0':
                        pos = 'Top Center';
                        break;
                    case '100,0':
                        pos = 'Top Right';
                        break;
                    case '0,50':
                        pos = 'Center Left';
                        break;
                    case '50,50':
                        pos = 'Center Center';
                        break;
                    case '100,50':
                        pos = 'Center Right';
                        break;
                    case '0,100':
                        pos = 'Bottom Left';
                        break;
                    case '50,100':
                        pos = 'Bottom Center';
                        break;
                    case '100,100':
                        pos = 'Bottom Right';
                        break;
                    default:
                        const values = val.split(',');
                        pos = values[0] === '' ? 'Center Center' : 'X:' + values[0] + '% Y:' + values[1] + '%';
                        break;
                }
                return pos;
            },
            getPreDefinedPositions(){
                return {
                        'right-top':'100,0',
                        'right-center':'100,50',
                        'right-bottom':'100,100',
                        'left-top':'0,0',
                        'left-center':'0,50',
                        'left-bottom':'0,100',
                        'center-top':'50,0',
                        'center-center':'50,50',
                        'center-bottom':'50,100'
                    };
            },
            click(e){
                e.preventDefault();
                e.stopPropagation();
                let left,
                    top,
                    el=e.currentTarget.previousElementSibling;
                if(e.target.classList.contains('tb_position_item')){
                    const pos = e.target.getAttribute('data-pos').split(',');
                        left=pos[0],
                        top=pos[1];
                    if(left==='50'){
                        left=this.w/2;
                    }
                    else if(left==='100'){
                        left = this.w;
                    }
                    if(top==='50'){
                        top=this.h/2;
                    }
                    else if(top==='100'){
                        top = this.h;
                    }
                }
                else{
                    left=e.offsetX;
                    top=e.offsetY;
                }
                el.style['left']=left+'px';
                el.style['top']=top+'px';
                this.changeUpdate(el,left,top);
            },
            changeUpdate(helper,left,top){
                    const l = +((left/this.w)*100).toFixed(2),
                        t = +((top/this.h)*100).toFixed(2),
                        label = helper.closest('.tb_position_box_wrapper').getElementsByClassName('tb_position_box_label')[0],
                        input = label.nextElementSibling;
                    input.value=l+','+t;
                    label.textContent = this.getLabel(l + ',' + t);
                    Themify.triggerEvent(input,'change');
            },
            render: function(data, self) {
                const _this=this,
                    positions=this.getPreDefinedPositions(),
					ev=api.Utils.getMouseEvents(),
					v = self.getStyleVal(data.id),
                    wrapper = document.createElement('div'),
                    boxWrap = document.createElement('div'),
                    box = document.createElement('div'),
                    handler = document.createElement('div'),
                    label = document.createElement('div'),
                    input = self.hidden.render(data,self);
                wrapper.className = 'tb_position_box_wrapper';
                boxWrap.className='tb_position_box_container';
                box.className = 'tb_position_box';
                handler.className = 'tb_position_box_handle';
                label.className = 'tb_position_box_label';
                for(let i in positions){
                    let pos=document.createElement('div'),
                        tooltip=document.createElement('span'),
                        span=document.createElement('span'),
                        vals=positions[i].split(',');
                    tooltip.className='themify_tooltip';
                    span.textContent=i.replace('-',' ');
                    pos.className='tb_position_item';
                    pos.setAttribute('data-pos',positions[i]);
                    pos['style'].left=vals[0]+'%';
                    pos['style'].top=vals[1]+'%';
                    tooltip.appendChild(span);
                    pos.appendChild(tooltip);
                    box.appendChild(pos);
                }
				handler.addEventListener(ev['mousedown'],function(e){
					if(e.type==='touchstart' || e.which===1){
						e.stopImmediatePropagation();
						let timer,
						isDragged;
						const doc=this.ownerDocument,
						el=this,
						dragX=this.offsetLeft-(e.touches?e.touches[0].clientX:e.clientX),
						dragY=this.offsetTop-(e.touches?e.touches[0].clientY:e.clientY),
						maxW=_this.w,
						maxH=_this.h,
						_startDrag=function(e){
							isDragged=true;
							doc.body.classList.add('tb_start_animate','tb_move_drag');
						},
						_move=function(e){
							e.stopImmediatePropagation();
							if(timer){
								cancelAnimationFrame(timer);
							}
							timer=requestAnimationFrame(function(){
								let clientX=dragX+(e.touches?e.touches[0].clientX:e.clientX),
								clientY=dragY+(e.touches?e.touches[0].clientY:e.clientY);
								if(clientX>maxW){
								      clientX=maxW;  
								}
								else if(clientX<0){
									clientX=0;
								}
								if(clientY>maxH){
								      clientY=maxH;  
								}
								else if(clientY<0){
									clientY=0;
								}
								el.style['left']=clientX+'px';
								el.style['top']=clientY+'px';
								_this.changeUpdate(el,clientX,clientY);
							});
						};
						doc.addEventListener(ev['mouseup'], function(e){
							this.removeEventListener(ev['mousemove'], _startDrag,{passive: true,once:true});
							this.removeEventListener(ev['mousemove'],_move, {passive: true});
							if(isDragged){
								e.stopImmediatePropagation();
								if(timer){
									cancelAnimationFrame(timer);
								}
								timer=isDragged=null;
								this.body.classList.remove('tb_start_animate','tb_move_drag');
							}
							
						}, {passive: true,once:true});
						
						doc.addEventListener(ev['mousemove'], _startDrag,{passive: true,once:true});
						doc.addEventListener(ev['mousemove'], _move, {passive: true});
					}
					
				},{passive:true});
				
                box.addEventListener('click', this.click.bind(this));
                boxWrap.appendChild(handler);
                boxWrap.appendChild(box);
                wrapper.appendChild(boxWrap);
                if (data['after'] !== undefined) {
                    wrapper.appendChild(self.after(data));
                }
                wrapper.appendChild(label);
                wrapper.appendChild(input);
				self.afterRun.push(function(){
					setTimeout(function(){
						const css=window.getComputedStyle(box);
						_this.w=parseInt(css.getPropertyValue('width'));
						_this.h=parseInt(css.getPropertyValue('height'));
						_this.update(data.id,v,self);
					},700);
				});
                return wrapper;
            }
        },
        slider_range: {
            render: function(data, self) {
                const wrapper = document.createElement('div'),
                    slider = document.createElement('div'),
                    input = self.hidden.render(data,self);
				let m1=0,
                    m2=100,
                    u='%',
                    range=true,
                    def=1;
                    if(data['options']!==undefined){
                        if(data['options']['min']!==undefined){
                            m1=data['options']['min'];
                        }
                        if(data['options']['max']!==undefined){
                            m2=data['options']['max'];
                        }
                        if(data['options']['unit']!==undefined){
                            u=data['options']['unit'];
                        }
                        if(data['options']['range']!==undefined){
                            range=false;
						}
                        if(data['options']['default']!==undefined){
                            def=data['options']['default'];
                        }
                    }
                input.setAttribute('data-min',m1);
                input.setAttribute('data-max',m2);
                input.setAttribute('data-unit',u);
                wrapper.className = 'tb_slider_wrapper input-range';
                slider.className = 'range-slider';
                if (data.wrap_class !== undefined) {
                    wrapper.className = ' ' + data.wrap_class;
                }
                wrapper.appendChild(slider);
                wrapper.appendChild(input);
                const callback=function(sl){
                    const lower = document.createElement('span'),
                        upper = document.createElement('span'),
                        min=parseFloat(input.getAttribute('data-min')),
                        max=parseFloat(input.getAttribute('data-max')),
                        un=input.getAttribute('data-unit');
					let values=input.value;
                    if (range) {
                        values =!values?[min, max]:values.split(',');
                    } else {
                        values =!values?def:values;
                    }
					lower.className = 'tb_slider_label_l';
					upper.className = 'tb_slider_label_u';
                    const args = {
                        range: range,
                        min: min,
                        max: max,
                        slide: function( e, ui ) {
                            if (range) {
                            lower.textContent = ui.values[ 0 ]+ un;
                            upper.textContent = ui.values[ 1 ] + un;
                            } else {
                                lower.textContent = ui.value+ un;
                            }
                        },
                        create(e,ui){
                            const handle = this.getElementsByClassName('ui-slider-handle');
                            if (range) {
                                lower.textContent = values[ 0 ]+ un;
                                handle[0].appendChild(lower);
                                upper.textContent = values[ 1 ] + un;
                                handle[1].appendChild(upper);
                            } else {
                                lower.textContent = values+ un;
                                handle[0].appendChild(lower);
                            }
                                values=null;
                        },
                        change: function( e, ui ) {
                            if (range) {
                            input.value=ui.values[ 0 ]+','+ui.values[1];
                            } else {
                                input.value=ui.value;
                            }
                        }
                    };
                    if (range) {
                        args['values'] = values;
                    } else {
                        args['value'] = values;
                    }
                    topWindow.jQuery.fn.slider.call($(sl),args);
                };
				self.afterRun.push(function(){
					topWindow.Themify.LoadAsync(themifyBuilder.includes_url + 'js/jquery/ui/slider.min.js', function () {
							callback(slider);
						}, themify_vars.version, null, function () {
							return topWindow.jQuery.fn.slider !== undefined;
					});
					
				});
                return wrapper;

            }
        },
        range: {
            update(id, v, self) {
                const range = self.getEl( id );
                if (range !== null) {
                    range.value = v !== undefined ? v : '';
                    const unit_id = id + '_unit',
                            unit = topWindow.document.getElementById(unit_id);
                    if (unit !== null && unit.tagName === 'SELECT') {
                        let v = self.getStyleVal(unit_id);
                        if (v === undefined) {
                            v = unit[0].value;
                        }
                        unit.value = v;
                        this.setData(range, (unit.selectedIndex !== -1 ? unit[unit.selectedIndex] : unit[0]));
                    }
                }
            },
            setData(range, item) {
                const min=item.getAttribute('data-min'),
                    max=item.getAttribute('data-max'),
                    step = item.getAttribute('data-increment');
				let v=parseFloat(range.value.trim());
                
                if(v>parseFloat(max) || v<parseFloat(min)){
                    v=v>parseFloat(max)?max:min;
                    range.value = step % 1 !== 0 ? parseFloat(v).toFixed(1) : parseInt(v);
                }
                range.setAttribute('min',min);
                range.setAttribute('max',max);
                range.setAttribute('step',step);
            },
            controlChange(range, unit, event) {
                const is_select = unit !== undefined && unit.tagName === 'SELECT',
					_this = this,
					ev=api.Utils.getMouseEvents();
               
                range.addEventListener(ev['mousedown'], function (e) {
                    if (e.type==='touchstart' || e.which === 1) {
                        if(!(this.classList.contains('tb_angle_input') && !this.parentNode.getElementsByClassName('tb_angle_circle')[0])){
						e.stopImmediatePropagation();
                        }
                        let lastY = e.touches?e.touches[0].clientY:e.clientY,
							timer;
						const doc=this.ownerDocument,
							that = this,
							old_v = this.value,
							max = parseFloat(this.getAttribute('max')),
							min = parseFloat(this.getAttribute('min')),
							step= this.getAttribute('step') || 1,
							is_increment=step % 1 !== 0,
							increment = !is_increment ? parseInt(step) : parseFloat(step),
							changeValue=function (condition) {
								const cval = that.value || 0,
									val = !is_increment ? parseInt(cval) : parseFloat(cval);
								let v=0;
								if ('increase' === condition) {
									v=val >= max?max:(val + increment);
								}
								else {
									v=val <= min?min:(val - increment);
								}
								that.value = +v.toFixed(2);
                                const angle = that.parentNode.getElementsByClassName('tb_angle_dot')[0];
                                if(angle){
                                    angle.style['transform'] = 'rotate(' + v + 'deg)';
                                }
							},
							_move = function (e) {
								e.stopImmediatePropagation();
								if(timer){
									cancelAnimationFrame(timer);
								}
								timer=requestAnimationFrame(function(){
									const y=e.touches?e.touches[0].clientY:e.clientY;
									if (y < lastY) {
										changeValue('increase');
									} else if (y > lastY) {
										changeValue('decrease');
									}
									lastY = y;
									Themify.triggerEvent(that, event);
								});
							};
                        doc.addEventListener(ev['mouseup'], function(e) {
							e.stopImmediatePropagation();
                            this.removeEventListener(ev['mousemove'], _move,{passive: true});
							if(timer){
								cancelAnimationFrame(timer);
							}
							timer=lastY=null;
                            if (that.value !== old_v) { 
                                Themify.triggerEvent(that, event);
                            }
                            api.hasChanged = true;
							this.body.style['cursor']='';
                            this.body.classList.remove('tb_start_animate','tb_move_drag');
                        }, {once: true,passive: true});
						doc.body.style['cursor']=$(this).css('cursor');
                        doc.body.classList.add('tb_start_animate','tb_move_drag');
                        doc.addEventListener(ev['mousemove'], _move,{passive: true});
                        if(this.classList.contains('tb_angle_input')){
                            changeValue();
						}
                    }
                },{passive: true});
				
                if (is_select === true) {
                    unit.addEventListener('change', function (e) {
                        _this.setData(range, unit.options[ unit.selectedIndex ]);
                        Themify.triggerEvent(range,event);
                    },{passive: true});
                }
                if (unit !== undefined) {
                    _this.setData(range, is_select ? (unit.selectedIndex !== -1 ? unit[unit.selectedIndex] : unit[0]) : unit);
                }
            },
            render(data, self) {
                const wrapper = document.createElement('div'),
                    range_wrap = document.createElement('span'),
                    input = document.createElement('input'),
                    v = parseFloat( self.getStyleVal(data.id) );
                wrapper.className = 'tb_tooltip_container';
                if (data.wrap_class !== undefined) {
                    wrapper.className = ' ' + data.wrap_class;
                }
                range_wrap.className = 'tb_range_input';
                input.autocomplete = 'off';
                input.type = 'number';
                input.className = 'tb_range';
                if (v !== undefined) {
                    input.value = v;
                }
                if (self.is_repeat === true) {
                    input.className += self.is_sort===true?' tb_lb_sort_child':' tb_lb_option_child';
                    input.dataset['inputId'] = data.id;
                }
                else {
                    input.className += ' tb_lb_option';
                    input.id = data.id;
                }
                if (data.class !== undefined) {
                    input.className += ' ' + data.class;
                }
                range_wrap.appendChild(input);
                if (data.tooltip !== undefined) {
					range_wrap.appendChild(self.hint(data.tooltip));
                }
                wrapper.appendChild(range_wrap);
                let select;
                if (data['deg'] === true || data['units'] === undefined) {
                    input.min = 0;
                    input.max = data['deg'] === true ? 360 : 1500;
                    input.step = 1;
                }
				else {
                    const select_wrap = document.createElement('div'),
                            keys = Object.keys(data.units);
                    select_wrap.className = 'selectwrapper noborder';
                    if (keys.length > 1) {
                        const uv = self.getStyleVal(data.id + '_unit'),
                            select_id = data.id + '_unit';
                        select = document.createElement('select');
                        select.className = 'tb_unit';

                        if (self.is_repeat === true) {
                            select.className += self.is_sort===true?' tb_lb_sort_child':' tb_lb_option_child';
                            select.dataset['inputId'] = select_id;
                        }
                        else {
                            select.className += ' tb_lb_option';
                            select.id = select_id;
                        }
                        if (data.select_class !== undefined) {
                            select.className += ' ' + data.select_class;
                        }
                        for (let i in data.units) {
                            let opt = document.createElement('option');
							
							if(!data.units[i]){
								data.units[i]={};
							}
							if(!data.units[i].min){
								data.units[i].min=0;
							}
							if(!data.units[i].max){
								data.units[i].max=100;
							}
                            input.setAttribute('min', parseInt(data.units[i].min));
                            input.setAttribute('max', parseInt(data.units[i].max));
                            opt.value = i;
                            opt.textContent = i;
                            opt.dataset['min'] = data.units[i].min;
                            opt.dataset['max'] = data.units[i].max;
                            opt.dataset['increment'] = data.units[i].increment !== undefined ? data.units[i].increment : (i === 'em' || i === 'em' ? .1 : 1);
                            if (uv === i) {
                                opt.selected = true;
                            }
                            select.appendChild(opt);
                        }
                        self.initControl(select, {type: 'select', 'id': select_id, control: data.control});
                    } else {
                        const unit = keys[0];
						if(!data.units[unit]){
							data.units[unit]={};
						}
						if(!data.units[unit].min){
							data.units[unit].min=0;
						}
						if(!data.units[unit].max){
							data.units[unit].max=100;
						}
                        input.setAttribute('min', parseFloat(data.units[unit].min));
                        input.setAttribute('max', parseFloat(data.units[unit].max));
                        input.setAttribute('step', data.units[unit]['increment'] !== undefined?parseFloat(data.units[unit].increment):'1');
						if ( v < parseFloat( data.units[unit].min ) ) {
                            input.value = data.units[unit].min;
                        } else if ( v > parseFloat( data.units[unit].max ) ) {
                            input.value = data.units[unit].max;
                        }
                        select = document.createElement('span');
                        select.className = 'tb_unit';
                        select.id = data.id + '_unit';
                        select.dataset['min'] = data.units[unit].min;
                        select.dataset['max'] = data.units[unit].max;
                        select.dataset['increment'] = data.units[unit].increment !== undefined ? data.units[unit].increment : (unit === 'em' || unit === 'em' ? .1 : 1);
                        select.textContent = unit;
                    }
                    select_wrap.appendChild(select);
                    wrapper.appendChild(select_wrap);
                }
                if (data.after !== undefined) {
                    wrapper.appendChild(self.after(data));
                }
                if (data.description !== undefined) {
                    wrapper.appendChild(self.description(data.description));
                }
                const event = self.clicked === 'styling' ? 'keyup' : 'change';
                if(data['opposite']===true){
                    select.addEventListener('change', function(e){
                        e.stopPropagation();
                        self.margin.changeUnit(this);
                    },{passive: true});
                }
                this.controlChange(input, select, event);
                const ndata = $.extend({}, data);
                if(data['opposite']===true){
                    input.addEventListener(event, function(e){
                        e.stopPropagation();
                        self.margin.changeOppositive(this);
                    },{passive: true});
                }
                ndata.type = 'range';
                self.initControl(input, ndata);
                return wrapper;
            }
        },
        icon: {
            render(data, self) {
                const wr = document.createElement('div'),
                        input = document.createElement('input'),
                        preview = document.createElement('span'),
                        clear = document.createElement('span'),
                        v = self.getStyleVal(data.id);
                input.type = 'text';
                input.className = 'themify_field_icon';
                preview.className = 'tf_plus_icon themify_fa_toggle';
                wr.className = 'tb_icon_wrap';
                clear.className='tb_clear_input tf_close';
                if (self.is_repeat === true) {
                    input.className += self.is_sort===true?' tb_lb_sort_child':' tb_lb_option_child';
                    input.dataset['inputId'] = data.id;
                }
                else {
                    input.className += ' tb_lb_option';
                    input.id = data.id;
                }
                if (data.class !== undefined) {
                    input.className += ' ' + data.class;
                }
                if (v !== undefined) {
                    input.value = v;
                    preview.appendChild(api.Utils.getIcon(v));
                    self.afterRun.push(function () {
                        setTimeout(function(){
                            topWindow.Themify.fontAwesome(v);
                        },100);
                    });
                }
                else{
                    preview.className += ' default_icon';
                }
                wr.appendChild(self.initControl(input, data));
                wr.appendChild(preview);
                wr.appendChild(clear);
                return wr;
            }
        },
        createMarginPadding(type, data) {
            const options = data.options !== undefined ? data.options : [
                    { id: 'top', label : this.label.top },
                    { id: 'bottom', label : this.label.bottom },
                    { id: 'left', label : this.label.left },
                    { id: 'right', label : this.label.right }
                ],
                ul = document.createElement('ul'),
                self= this,
                id = data.id,
                isBorderRadius=type==='border_radius',
                range = $.extend(true, {}, data);
            range['units'] = data.units !== undefined ? data.units :{
                px: {
                    min: (type === 'margin' ? -1500 : 0),
                    max: 1500
                },
                em: {
                    min: (type === 'margin' ? -10 : 0),
                    max: 10
                },
                '%': {
                    min: (type === 'margin' ? -100 : 0)
                }
            };
            range.prop = null;
            range.opposite=true;
            ul.className = 'tb_seperate_items tf_inline_b tb_has_opposite';
            if(isBorderRadius===true){
                ul.setAttribute('data-toptext',options[0].label);
            }
			let len=options.length,
			d = document.createDocumentFragment(),
                uncheck_all=false;
            for (let i = 0; i < len; ++i) {
                let li = document.createElement('li'),
                    prop_id = id + '_' + options[i].id;

                range.id = prop_id;
                range.tooltip = options[i].label;
                range.class=data['class']===undefined?'':data['class'];
                range.class+=' tb_multi_field tb_range_'+options[i].id;
                if(isBorderRadius===true){
                    range.class+=' tb_is_border_radius';
                }
                let rangeEl=this.range.render(range, this);
                if(i!==0 && i!==3){
                    let opposite = document.createElement('li'),
                        oppId=options[i].id==='right'?'top':options[i].id;
                        opposite.className='tb_seperate_opposite tb_opposite_'+(oppId==='bottom'?'top':oppId);
                        opposite.appendChild(this.checkboxGenerate('checkbox',{
                                        id: id + '_opp_'+oppId,
                                        'class': 'style_apply_oppositive',
                                        options: [
                                            {name: '1', value:''}
                                        ],
                                        'new_line': false
                                    }
                            ));
                            let ch_op=opposite.querySelector('.style_apply_oppositive'),
                                state =document.createElement('div');
                                state.className='tb_oppositive_state';
                            ch_op.parentNode.insertBefore(state, ch_op.nextSibling);

                            ch_op.addEventListener('change',function(e){
                                e.stopPropagation();
                                self.margin.bindingOppositive(this,true);
                            },{passive: true});
                            if(ch_op.checked===true){
                                self.afterRun.push(function () {
                                    self.margin.bindingOppositive(this);
                                }.bind(ch_op));
                            }

                    d.appendChild(opposite);
                }
                li.appendChild(rangeEl);
                d.appendChild(li);
                let prop;
                if(isBorderRadius===true){
                    prop='border-';
                    if(options[i].id==='top'){
                        prop+='top-left-radius';
                    }
                    else if(options[i].id==='right'){
                        prop+='top-right-radius';
                    }
                    else if(options[i].id==='left'){
                        prop+='bottom-left-radius';
                    }
                    else if(options[i].id==='bottom'){
                        prop+='bottom-right-radius';
                    }
                }else if('transform'===data.type){
                    prop=data.prop;
                }else{
                    prop=data.prop + '-' + options[i].id;
                    if(this.is_new===true && !uncheck_all && this.values[prop_id]){
                        uncheck_all=true;
                    }
                }
                this.styles[prop_id] = {prop: prop, selector: data.selector};
            }
            ul.appendChild(d);
            d = document.createDocumentFragment();
            d.appendChild(ul);
            if (len === 4) {
                d.appendChild(self.checkboxGenerate('icon_checkbox',
                        {
                            id: 'checkbox_' + id + '_apply_all',
                            'class': 'style_apply_all',
                            options: [
                                {name: '1', value: self.label.all, icon: '<span class="apply_all_checkbox_icon">'+api.Utils.getIcon('ti-link').outerHTML+'</span>'}
                            ],
                            'default': (this.component === 'module' && this.is_new === true && !uncheck_all) ||  Object.keys(this.values).length === 0 ? '1' : false,
                            'new_line': false
                        }
                ));
                const apply_all = d.querySelector('.style_apply_all');
                apply_all.addEventListener('change', function (e) {
                    self.margin.apply_all(this, true);
                },{passive: true});
                if (apply_all.checked === true) {
                    self.afterRun.push(function () {
                        self.margin.apply_all(apply_all);
                    });
                }
            }
            return d;
        },
        margin_opposity:{
			update(id, v, self) {
				self.range.update(id, v,self);
				self.checkbox.update(id+'_opp_top', self.getStyleVal(id+'_opp_top'),self);
				self.range.update(self.stylesData[id].bottomId, self.getStyleVal(self.stylesData[id].bottomId),self);
			},
            render(data, self){
                const items = ['topId','bottomId'],
                    ul = document.createElement('ul'),
                    range = $.extend(true, {}, data);
                    ul.className='tb_seperate_items tf_inline_b tb_has_opposite';
                for(let i=0;i<2;++i){
                    let  li = document.createElement('li');
                        
                        range.id = data[items[i]];
                        range.prop=items[i]==='topId'?'margin-top':'margin-bottom';
                        range.class='tb_multi_field tb_range_'+(items[i]==='topId'?'top':'bottom');
                        range.opposite=true;
                        range.tooltip = items[i]==='topId'?self.label.top:self.label.bottom;
                        li.appendChild(self.range.render(range, self));
                        ul.appendChild(li);
                        if(i===0){
                            let opposite=document.createElement('li');
                            opposite.className='tb_seperate_opposite tb_opposite_top';
                            opposite.appendChild(self.checkboxGenerate('checkbox',
                                        {
                                            id: range.id + '_opp_top',
                                            'class': 'style_apply_oppositive',
                                            options: [
                                                {name: '1', value:''}
                                            ],
                                            'new_line': false
                                        }
                                ));
                            let ch_op=opposite.querySelector('.style_apply_oppositive'),
                                state =document.createElement('div');
                                state.className='tb_oppositive_state';
                            ch_op.parentNode.insertBefore(state, ch_op.nextSibling);
                            ch_op.addEventListener('change',function(e){
                                   e.stopPropagation();
                                   self.margin.bindingOppositive(this,true);
                            },{passive: true});
                            
                            ul.appendChild(opposite);
                        }
                        self.stylesData[data[items[i]]] =self.styles[data[items[i]]] ={id:data[items[i]],type:data.type, prop:(items[i]==='topId'?'margin-top':'margin-bottom'), selector: data.selector};
                }
                return ul;
            }
        },
        margin: {
            bindingOppositive(el,init){
                const li = el.closest('.tb_seperate_opposite'),
                    p = li.parentNode,
                    isLeft=li.classList.contains('tb_opposite_left'),
                    firstItem=isLeft===true?li.nextElementSibling:li.previousElementSibling,
                    isChecked=el.checked===true,
                    dir=this.getOppositiveDir(firstItem.getElementsByClassName('tb_range')[0]),
                    field=p.getElementsByClassName('tb_range_'+dir)[0],
                    u=field.closest('li').getElementsByClassName('tb_unit')[0];
                    if(isChecked===true){
                        field.setAttribute('data-v',field.value);
                        u.setAttribute('data-u',u.value);
                        if(init===true){
                            const firstInput = firstItem.getElementsByClassName('tb_range')[0],
                                v = firstInput.value,
                                v2=field.value;
                            if(v!=='' || v2===''){
                                field.value=v;
                                u.value=firstItem.getElementsByClassName('tb_unit')[0].value;
                            }
                            else{
                                firstInput.value=v2;
                                firstItem.getElementsByClassName('tb_unit')[0].value=u.value;
                            }
                            
                        }
                    }
                    else{
                        const v=field.getAttribute('data-v');
                        field.value=v===undefined || v===null?'':v;
                        u.value=u.getAttribute('data-u');
                    }
                    if(init===true){
                        Themify.triggerEvent(field, 'keyup');
                    }
            },
            changeUnit(el){
                 const p = el.closest('.tb_has_opposite');
                    if(!p.hasAttribute('data-checked')){
                        const input = topWindow.document.getElementById(el.getAttribute('id').replace(/_unit$/ig,'')),
                            dir=this.getOppositiveDir(input),
                            isBorder=input.classList.contains('tb_is_border_radius'),
                            chClass=dir==='top'|| (isBorder===true &&  dir==='right') || (isBorder===false && dir==='bottom')?'top':'left';
                            if(p.getElementsByClassName('tb_opposite_'+chClass)[0].getElementsByClassName('style_apply_oppositive')[0].checked===true){
                                p.getElementsByClassName('tb_range_'+dir)[0].closest('li').getElementsByClassName('tb_unit')[0].value=el.value;
                            }
                    }
            },
            getOppositiveDir(el){
                const cl = el.classList;
                let opp=cl.contains('tb_range_top')?'bottom':(cl.contains('tb_range_bottom')?'top':(cl.contains('tb_range_left')?'right':'left'));
                if(cl.contains('tb_is_border_radius')){
                    if(opp==='bottom'){
                        opp='right';
                    }
                    else if(opp==='top'){
                        opp='left';
                    }
                    else if(opp==='left'){
                        opp='top';
                    }
                    else{
                        opp='bottom';
                    }
                }
                return opp;
            },
            changeOppositive(el){
                const li = el.closest('li'),
                    p = li.parentNode;
                    if(!p.hasAttribute('data-checked')){
                        const dir = this.getOppositiveDir(el),
                            isBorder=el.classList.contains('tb_is_border_radius'),
                            ch=dir==='top'|| (isBorder===true &&  dir==='right') || (isBorder===false && dir==='bottom')?p.getElementsByClassName('tb_opposite_top')[0]:p.getElementsByClassName('tb_opposite_left')[0];
                            if(ch.getElementsByClassName('style_apply_oppositive')[0].checked===true){
                               p.getElementsByClassName('tb_range_'+dir)[0].value=el.value;
                            }
                    }
            },
            apply_all(item, trigger) {
                const ul = item.closest('.tb_input').getElementsByClassName('tb_seperate_items')[0],
					first = ul.getElementsByTagName('li')[0],
					isChecked=item.checked === true;
				let text;
                if (isChecked === true) {
                    ul.setAttribute('data-checked', 1);
                    text = ThemifyConstructor.label.all;

                }
                else {
                    ul.removeAttribute('data-checked');
                    text = ul.getAttribute('data-toptext');
                    if(!text){
                        text=ThemifyConstructor.label.top;
                    }
                }
                if (trigger === true) {
                    Themify.triggerEvent(first.getElementsByClassName('tb_multi_field')[0], 'keyup');
                }
                first.getElementsByClassName('tb_tooltip_up')[0].textContent = text;
            },
            update(id, v, self) {
                const options = ['top', 'right', 'bottom', 'left'],
                    checkbox_id = 'checkbox_' + id + '_apply_all',
                    apply_all = self.getEl(checkbox_id).getElementsByClassName('style_apply_all')[0];
                for (let i = 3; i>-1; --i) {
                    let nid = id + '_' + options[i],
                        el = topWindow.document.getElementById(nid);
                    if (el !== null) {
                        self.range.update(nid, self.getStyleVal(nid), self);
                        if(apply_all.checked!==true){
                            let oppositiveId=id + '_opp_'+options[i],
                                ch_oppositive=topWindow.document.getElementById(oppositiveId);
                            if(ch_oppositive!==null){
                                ch_oppositive.getElementsByClassName('style_apply_oppositive')[0].checked=self.getStyleVal(oppositiveId)?true:false;
                            }
                        }
                    }
                    
                }
                self.checkbox.update(checkbox_id, self.getStyleVal(checkbox_id), self);
                this.apply_all(apply_all);
            },
            render(data, self) {
                return self.createMarginPadding(data.type, data);
            }
        },
        padding: {
            render(data, self) {
                return self.createMarginPadding(data.type, data);
            }
        },
        box_shadow: {
            update(id, v, self) {
                const options = ['hOffset', 'vOffset', 'blur', 'spread'],
                    color_id = id + '_color',
                    checkbox_id = id + '_inset';
                for (let i = 3;i>-1; --i) {
                    let nid = id + '_' + options[i],
                        el = topWindow.document.getElementById(nid);
                    if (el !== null) {
                        self.range.update(nid, self.getStyleVal(nid), self);
                    }
                }
                self.color.update(color_id, self.getStyleVal(color_id), self);
                self.checkbox.update(checkbox_id, self.getStyleVal(checkbox_id), self);
            },
            render(data, self) {
                const ranges = {
                        hOffset: {
                            label: self.label.h_o,
                            units: {px: {min: -200, max: 200}, em: {max: 10}}
                        },
                        vOffset: {
                            label: self.label.v_o,
                            units: {px: {min: -200,max: 200},em: {max: 10}}
                        },
                        blur: {
                            label: self.label.bl,
                            units: {px: {max: 300}, em: { max: 10}}
                        },
                        spread: {
                            label: self.label.spr,
                            units: {px: {min: -200, max: 200}, em: {max: 10}}
                        }
                    },
                    ul = document.createElement('ul'),
                    id = data.id,
                    range = $.extend(true, {}, data);
                range['class'] = 'tb_shadow_field';
                range.prop = null;
                ul.className = 'tb_seperate_items tf_inline_b tb_shadow_inputs';
                for (let rangeField in ranges) {
                    if (ranges[rangeField]!==undefined){
                        let rField = ranges[rangeField],
                            li = document.createElement('li'),
                            prop_id = id + '_' + rangeField;
                        range.id = prop_id;
                        range.tooltip = rField.label;
                        range['units'] = rField.units;
                        range['selector'] = data.selector;
                        li.appendChild(self.range.render(range, self));
                        ul.appendChild(li);
                        self.styles[prop_id] = {prop: data.prop, selector: data.selector};
                    }
                }
                // Add color field
                let prop_id = id + '_color';
                const li = document.createElement('li'),
                    color = {id: prop_id, type:'color', class:range['class'], selector: data.selector};
                li.className = 'tb_shadow_color';
                self.styles[prop_id] = {prop: data.prop, selector: data.selector,type:'color'};
                li.appendChild(self.color.render(color, self));
                ul.appendChild(li);
                // Add inset checkbox
                prop_id = id + '_inset';
                const inset = document.createElement('li'),
                    coptions = {
                    id: prop_id,
                    origID: id,
                    type: 'checkbox',
                    class:range['class'],
                    isBoxShadow: true,
                    prop:data.prop,
                    options: [
                        {value: self.label.in_sh, name: 'inset'}
                    ]
                },
                checkboxWrap = self.checkboxGenerate('checkbox', coptions);
                self.styles[prop_id] = {prop: data.prop, selector: data.selector};
                inset.className='tb_box_shadow_inset';
                inset.appendChild(checkboxWrap);
                ul.appendChild(inset);
                return ul;
            }
        },
        text_shadow: {
            update(id, v, self) {
                const options = [self.label.h_sh, self.label.v_sh, self.label.bl],
                    color_id = id + '_color';
                for (let i = 2; i >-1; --i) {
                    let nid = id + '_' + options[i],
                        el = self.getEl(nid);
                    if (el !== null) {
                        self.range.update(nid, self.getStyleVal(nid), self);
                    }
                }
                self.color.update(color_id, self.getStyleVal(color_id), self);
            },
            render(data, self) {
                const ranges = {
                        hShadow: {
                            label: self.label.h_sh,
                            units: {px: {min: -200, max: 200}, em: {max: 10}}
                        },
                        vShadow: {
                            label: self.label.v_sh,
                            units: {px: {min: -200, max: 200}, em: { max: 10}}
                        },
                        blur: {
                            label: self.label.bl,
                            units: {px: {max: 300}, em: { max: 10}}
                        }
                    },
                    ul = document.createElement('ul'),
                    id = data.id,
                    range = $.extend(true, {}, data);
                range['class'] = 'tb_shadow_field';
                range.prop = null;
                ul.className = 'tb_seperate_items tf_inline_b tb_shadow_inputs';
                for (let rangeField in ranges) {
                    if (!ranges.hasOwnProperty(rangeField)) continue;

                    let rField = ranges[rangeField],
                        li = document.createElement('li'),
                        prop_id = id + '_' + rangeField;
                    range.id = prop_id;
                    range.tooltip = rField.label;
                    range['units'] = rField.units;
                    li.appendChild(self.range.render(range, self));
                    ul.appendChild(li);
                    self.styles[prop_id] = {prop: data.prop, selector: data.selector};
                }
                // Add color field
                const li = document.createElement('li'),
                    prop_id = id + '_color',
                    color = {id: prop_id, type:'color', class: range['class'],selector:data.selector};
                li.className = 'tb_shadow_color';
                self.styles[prop_id] = {prop: data.prop, selector: data.selector,type:'color'};
                li.appendChild(self.color.render(color, self));
                ul.appendChild(li);
                return ul;
            }
        },
        border_radius: {
            render(data, self) {
                data['options']=self.getOptions(data);
                return self.createMarginPadding(data.type, data);
            }
        },
		outline: {
			render(data, self) {
				self.styles[ data.id + '-c' ] = data.selector;
				self.styles[ data.id + '-w' ] = data.selector;
				self.styles[ data.id + '-s' ] = data.selector;
				return self.create( [
					{
						type : 'multi',
						options : [
							{
								type : 'color',
								id : data.id + '-c',
								class : 'outline_color'
							},
							{
								type : 'range',
								id : data.id + '-w',
								units : {px: { max: 300}},
								class : 'outline_width'
							},
							{
								type : 'select',
								id : data.id + '-s',
								options : self.static['border'],
								class : 'outline_style'
							}
						]
					}
				] );
			}
		},
        border: {
            changeControl(item) {
                const p = item.parentNode,
                        v = item.value,
                        items = p.parentNode.children;
                for (let i = items.length - 1; i > -1; --i) {
                    if (items[i] !== p) {
                        items[i].classList.toggle('_tb_hide_binding',v === 'none');
                    }
                }
            },
            apply_all(border, item) {
                const items = item.getElementsByTagName('input'),
                        disable = function (is_all, event) {
                            for (let i = items.length - 1; i >-1; --i) {
                                items[i].parentNode.classList.toggle('_tb_disable',is_all && items[i].value!=='all');
                            }
                            if (is_all === true) {
                                border.dataset['checked'] = 1;
                            }
                            else {
                                border.removeAttribute('data-checked');
                            }
                            if (event === true) {
                                Themify.triggerEvent(border.children[0].getElementsByTagName('select')[0], 'change');
                            }
                        };
                for (let i = items.length - 1; i > -1; --i) {
                    items[i].addEventListener('change', function () {
                        disable(this.value === 'all', true);
                    },{passive: true});
                    if (items[i].checked === true && items[i].value === 'all') {
                        disable(true, null);
                    }
                }
            },
            update(id, v, self) {
                const options = ['top', 'right', 'bottom', 'left'],
                        radio_id = id + '-type';
                for (let i = 0; i < 4; ++i) {
                    let nid = id + '_' + options[i],
                            color_id = nid + '_color',
                            style_id = nid + '_style',
                            range_id = nid + '_width';
                    self.color.update(color_id, self.getStyleVal(color_id), self);
                    self.select.update(style_id, self.getStyleVal(style_id), self);
                    this.changeControl(self.getEl(style_id));
                    self.range.update(range_id, self.getStyleVal(range_id), self);
                }
                self.radio.update(radio_id, self.getStyleVal(radio_id), self);
            },
            render(data, self) {
                const options = ['top', 'right', 'bottom', 'left'],
                        ul = document.createElement('ul'),
                        orig_id = data.id,
                        select = $.extend(true, {}, data),
                        _this = this,
                        radio = $.extend(true, {}, data);
                radio['options'] = [
                    {value: 'all', name: self.label.all, 'class': 'style_apply_all', icon: '<i class="tic-border-all"></i>', label_class: 'tb_radio_label_borders'}
                ];
                radio['option_js'] = true;
                radio.id = orig_id + '-type';
                radio.no_toggle = true;
                radio['default'] = 'top';
                radio.prop = null;

                select['options'] = self.static['border'];
                select.prop = null;

                ul.className = 'tb_seperate_items tb_borders tb_group_element_border';
                for (let  i = 0; i < 4; ++i) {
                    let li = document.createElement('li'),
                            id = orig_id + '_' + options[i];
                    radio['options'].push({value: options[i], name: self.label[options[i]], icon: '<i class="tic-border-' + options[i] + '"></i>', label_class: 'tb_radio_label_borders'});

                    li.className = 'tb_group_element_' + options[i];
                    if (options[i] === 'top') {
                        li.className += ' tb_group_element_all';
                    }
                    self.styles[id + '_color'] = {prop: 'border-' + options[i], selector: data.selector};
                    select.id = id + '_color';
                    select.type = 'color';
                    select.class = 'border_color';
                    li.appendChild(self.color.render(select, self));

                    self.styles[id + '_width'] = {prop: 'border-' + options[i], selector: data.selector};
                    select.id = id + '_width';
                    select.type = 'range';
                    select.class = 'border_width';
                    select.wrap_class = 'range_wrapper';
                    select.units = {px: { max: 300}};
                    li.appendChild(self.range.render(select, self));

                    self.styles[id + '_style'] = {prop: 'border-' + options[i], selector: data.selector};
                    select.id = id + '_style';
                    select.type = 'select';
                    select.class = 'border_style tb_multi_field';
                    let border_select = self.select.render(select, self),
                            select_item = border_select.querySelector('select');
                    li.appendChild(border_select);
                    ul.appendChild(li);
                    select_item.addEventListener('change', function (e) {
                        _this.changeControl(this);
                    },{passive: true});
                    if (select_item.value === 'none') {
                        _this.changeControl(select_item);
                    }
                }
                const d = document.createDocumentFragment();
                d.appendChild(self.radioGenerate('icon_radio', radio, self));
                _this.apply_all(ul, d.querySelector('#' + radio.id));
                d.appendChild(ul);

                return d;
            }
        },
        slider: {
            render(data, self) {
				const label = data.label;
				delete data.label;
				 // Backward compatibility #9463
                if(['crossfade','cover-fade','uncover-fade'].includes(self.values['effect_slider'])){
                    self.values['effect_slider']='fade';
                }
                return self.create( [ {
					type : 'group',
					label : label,
					display: 'accordion',
					options : self.getOptions(data),
					wrap_class : data.wrap_class
				} ] );
            }
        },
        custom_css: {
            render(data, self) {
                data.class = 'large';
                data.control = false;
                data.help=self.label.custom_css_help;
                const el = self.text.render(data, self);
                api.Utils.changeOptions(el.querySelector('#'+data.id),data.type);
                return el;
            }
        },
        custom_css_id: {
            render(data, self) {
				let options = [];
				if ( data.custom_css ) {
					options.push( {
						id : data.custom_css,
						type : 'custom_css'
					} );
				}
				options.push( {
                    id: 'custom_css_id',
                    type: 'text',
                    label:self.label.id_name,
                    help: self.label.id_help,
                    control: false,
                    'class': 'large'
                } );
                const el = self.create( [ {
					type : 'group',
					label : self.label.cc,
					display : 'accordion',
					options : options,
					wrap_class : 'tb_field_group_css',
				} ], self );
                api.Utils.changeOptions(el.querySelector('#custom_css_id'),data.type);
                return el;
            }
        },
        hidden: {
            render(data, self) {
                const input = document.createElement('input'),
                        v = self.getStyleVal(data.id);
                input.type = 'hidden';
                if (self.is_repeat === true ) {
                    input.className= self.is_sort===true?'tb_lb_sort_child':'tb_lb_option_child';
                    input.dataset['inputId'] = data.id;
                }
                else {
                    input.className= 'tb_lb_option';
                    input.id = data.id;
                }
                if (data.class !== undefined) {
                    input.className += ' ' + data.class;
                }
                if (v !== undefined) {
                    input.value = v;
                }
                else if (data.value !== undefined) {
                    input.value = data.value;
                }
                return self.initControl(input, data);
            }
        },
        frame: {
            render(data, self) {
                data.options = self.static['frame'];
                data.class = 'tb_frame tf_scrollbar';
                data['binding']={
                        'not_empty' : { 'show' : [ 'tb_frame_multi_wrap','tb_frame_color' ]},
                        'empty' : {'hide' : [ 'tb_frame_multi_wrap','tb_frame_color'] }
                };
                return self.layout.render(data, self);
            }
        },
        title: {
            render(data, self) {
                data.class = 'large';
                data.control = {event: 'keyup', control_type: 'change', selector: '.module-title'};
                return self.text.render(data, self);
            }
        },
        url: {
            render(data, self) {
                data.input_type = 'url';
                return self.text.render(data, self);
            }
        },
        advacned_link:{
            render(data,self){
                const opt = [  
                            {
				'id' : 'link',
				'type' : 'radio',
				'label' : 'l',
				'wrap_class' : ' tb_compact_radios',
				'link_to' : true,
				'binding' : {
					'permalink' : {'show' : 'open_link' , 'hide' : 'custom_link' } ,
					'custom' : { 'show' : 'custom_link' , 'hide' : 'open_link'  },
					'none' : {'hide' : ['custom_link', 'open_link', 'no_follow' ] }
                                }
                            },
                            {
                                    'id' : 'custom_link',
                                    'type' : 'url',
                                    'label' : 'cl'
                            },
                            {
								'id' : 'open_link',
								'type' : 'radio',
								'label' : 'o_l',
								'link_type' : true,
								'control':false,
								'wrap_class' : ' tb_compact_radios',
								'binding' : {
									'lightbox' : { 'show' : 'tb_t_m_lightbox' },
									'regular' : { 'hide' : 'tb_t_m_lightbox'},
									'newtab' : { 'hide' : 'tb_t_m_lightbox'}
								}
                            },
							{
							'type' : 'multi',
							'wrap_class':'tb_t_m_lightbox',
							'label' : 'lg',
							'options' : [
									{
										'id' : 'lightbox_w',
										'type' : 'range',
										'label' : 'w',
										'control' : false,
										'units' : {
											'px' : {
												'max' : 1000
											},
											'%' : ''
										}

									},
									{
										'id' : 'lightbox_h',
										'type' : 'range',
										'label' : 'ht',
										'control' : false,
										'units' : {
											'px' : {
													'max' : 1000
												},
											'%' : ''
										}
									}
                                ]
                            }
                        ];
                return self.create(opt);
            }
        },
        button: {
            render(data, self) {
                const btn = document.createElement('button');
                btn.className = 'builder_button';
                btn.id = data.id;
                if (data.class !== undefined) {
                    btn.className += ' ' + data.class;
                }
                btn.textContent = data.name;
                return self.initControl(btn, data);
            }
        },
        row_anchor: {
            render(data, self) {
                data.control = false;
                const el = self.text.render(data, self);
                api.Utils.changeOptions(el.querySelector('#'+data.id),data.type);
                return el;
            }
        },
        widget_form: {
            render(data, self) {
                const container = document.createElement('div');
                container.id = data.id;
                container.className = 'module-widget-form-container wp-core-ui tb_lb_option';
                return container;
            }
        },
        widget_select: {
            data: null,
            el: null,
            cache: [],
            mediaInit: null,
            textInit: null,
            render(data, self) {
                const d = document.createDocumentFragment(),
                        filter = document.createElement('div'),
                        loader = document.createElement('i'),
                        search = document.createElement('input'),
                        available = document.createElement('div'),
                        select = document.createElement('div');

                filter.id = 'available-widgets-filter';
                filter.className='selectwrapper';
                loader.className = 'tb_loading_widgets tf_loader';
                search.type = 'text';
                search.id = 'widgets-search';
                search.dataset.validation = 'not_empty';
                search.dataset.errorMsg = self.label.widget_validate;
                search.autocomplete = 'off';
                search.placeholder = self.label.search_widget;

                available.id = 'available-widgets';
                available.className='tf_scrollbar';
                available.tabIndex = 1;

                select.id = data.id;
                select.className = 'tb_lb_option tb_widget_select';

                this.el = select;
                filter.appendChild(loader);
                filter.appendChild(search);
                available.appendChild(select);
                d.appendChild(filter);
                d.appendChild(available);

                const _this = this,
                        val = self.values[data.id],
                        callback = function () {

                            const all_items = [],
                                select_widget = function (item, instance_widget) {
                                    for (let i = all_items.length - 1; i > -1; --i) {
                                        all_items[i].classList.remove('selected');
                                    }
                                    item.classList.add('selected');
                                    const v = item.dataset['value'];
                                    search.value = item.getElementsByClassName('widget-title')[0].textContent;
                                    available.style['display'] = 'none';

                                    _this.select(v, _this.data[v].b, instance_widget, data);

                            };
                            for (let i in _this.data) {
                                let w = document.createElement('div'),
                                        title = document.createElement('div'),
                                        h3 = document.createElement('h3');
                                w.className = 'widget-tpl ' + _this.data[i].b;
                                w.dataset['value'] = i;
                                title.className = 'widget-title';
                                h3.textContent = _this.data[i].n;
                                title.appendChild(h3);
                                w.appendChild(title);
                                w.addEventListener('click', function (e) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    self.settings[data.id] = this.dataset['value'];
                                    select_widget(this, null);
                                });
                                all_items.push(w);
                                if (_this.data[i].d !== undefined) {
                                    let desc = document.createElement('div');
                                    desc.className = 'widget-description';
                                    desc.innerHTML = _this.data[i].d;
                                    w.appendChild(desc);
                                }
                                select.appendChild(w);
                                if (val === i) {
                                    select_widget(w, self.values['instance_widget']);
                                }
                            }
                            _this.search(search, available);
                            loader.parentNode.removeChild(loader);
                            api.hasChanged = true;
                        };
                if (_this.data === null) {

                    $.ajax({
                        type: 'POST',
                        url: themifyBuilder.ajaxurl,
                        dataType: 'json',
                        data: {
                            action: 'tb_get_widget_items',
                            nonce: themifyBuilder.tb_load_nonce
                        },
                        success(data) {
                            _this.data = data;
                            callback();
                        }
                    });

                    for (let i in themifyBuilder.widget_css) {
                        topWindow.Themify.LoadCss(themifyBuilder.widget_css[i], themify_vars.version);
                    }
                    themifyBuilder.widget_css = null;

                }
                else {
                    setTimeout(callback, 5);
                }
                return d;
            },
            search(search, available) {
                const _this = this;
                search.addEventListener('focus', this.show.bind(this),{passive: true});
                search.addEventListener('blur', function (e) {
                    if (!e.relatedTarget || e.relatedTarget.id !== 'available-widgets') {
                        available.style['display'] = 'none';
                    }
                },{passive: true});
                search.addEventListener('keyup', function (e) {
                    _this.show();
                    const val = this.value.trim(),
                            r = new RegExp(val, 'i'),
                            items = _this.el.getElementsByClassName('widget-tpl');
                    for (let i = 0, len = items.length; i < len; ++i) {
                        if (val === '') {
                            items[i].style['display'] = 'block';
                        }
                        else {
                            let title = items[i].getElementsByTagName('h3')[0];
                            title = title.textContent || title.innerText;
                            if (r.test(title)) {
                                items[i].style['display'] = 'block';
                            }
                            else {
                                items[i].style['display'] = 'none';
                            }
                        }
                    }

                },{passive: true});
            },
            show() {
                //this.$el.next('.tb_field_error_msg').remove();
                this.el.closest('#available-widgets').style['display'] = 'block';
            },
            hide() {
                this.el.closest('#available-widgets').style['display'] = 'none';
            },
            select(val, base, settings_instance, args) {
                const _this = this,
                        instance = $('#instance_widget', Common.Lightbox.$lightbox),
                        callback = function (data) {
                            const initjJS = function () {
                                const form = $(data.form);
                                instance.addClass('open').html(form.html());
                                if (settings_instance) {
                                    for (let i in settings_instance) {
                                        form.find('[name="' + i + '"]').val(settings_instance[i]);
                                    }
                                }
                                if (base === 'text') {
                                    if (wp.textWidgets) {
                                        if (!_this.textInit) {
                                            _this.textInit = true;
                                            wp.textWidgets.init();
                                        }
                                        if (settings_instance) {
                                            delete wp.textWidgets.widgetControls[settings_instance['widget-id']];
                                        }
                                    }

                                } else if (wp.mediaWidgets) {
                                    if (!_this.mediaInit) {
                                        wp.mediaWidgets.init();
                                        _this.mediaInit = true;
                                    }
                                    if (settings_instance) {
                                        delete wp.mediaWidgets.widgetControls[settings_instance['widget-id']];
                                    }
                                }
                                $(document).trigger('widget-added', [instance]);
                                base === 'text' && ThemifyConstructor.initControl(instance.find('.wp-editor-area')[0], {control: {control_type: 'wp_editor', type: 'refresh'}});
                                if (api.mode === 'visual') {
                                    const settings = $.extend(true, {}, args);
                                    settings.id = instance[0].id;
                                    instance.on('change', ':input', function () {
                                        if (api.is_ajax_call === false) {
                                            ThemifyConstructor.control.widget_select(instance, settings);
                                        }
                                    });
                                    if (val) {
                                        ThemifyConstructor.control.widget_select(instance, settings);
                                    }
                                }
                                instance.removeClass('tb_loading_widgets_form').find('select').wrap('<span class="selectwrapper"/>');
                            },
                                    extra = function (data) {
                                        let str = '';
                                        if (typeof data === 'object') {
                                            for (let i in data) {
                                                if (data[i]) {
                                                    str += data[i];
                                                }
                                            }
                                        }
                                        if (str !== '') {
                                            const s = document.createElement('script'),
                                                     t = document.getElementsByTagName('script')[0];
                                            s.type = 'text/javascript';
                                            s.text = str;
                                            t.parentNode.insertBefore(s, t);
                                        }
                                    },
                                    recurisveLoader = function (js, i) {
                                        const len = js.length,
                                                loadJS = function (src, callback) {
                                                    Themify.LoadAsync(src, callback, data.v);
                                                };
                                        loadJS(js[i].src, function () {
                                            if (js[i].extra && js[i].extra.after) {
                                                extra(js[i].extra.after);
                                            }
                                            ++i;
                                            i < len ? recurisveLoader(js, i) : initjJS();
                                        });
                                    };


                            if (_this.cache[base] === undefined) {
                                data.template && document.body.insertAdjacentHTML('beforeend', data.template);
                                data.src.length > 0 ? recurisveLoader(data.src, 0) : initjJS();
                            } else {
                                initjJS();
                            }
                        };
                instance.addClass('tb_loading_widgets_form').html('<div class="tf_loader"></div>');

                // backward compatibility with how Widget module used to save data
                if (settings_instance) {
                    $.each(settings_instance, function (i, v) {
                        const old_pattern = i.match(/.*\[\d\]\[(.*)\]/);
                        if ($.isArray(old_pattern) && old_pattern[1] !== 'undefined') {
                            delete settings_instance[ i ];
                            settings_instance[ old_pattern[1] ] = v;
                        }
                    });
                }

                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: themifyBuilder.ajaxurl,
                    data: {
                        action: 'module_widget_get_form',
                        tb_load_nonce: themifyBuilder.tb_load_nonce,
                        load_class: val,
                        tpl_loaded: _this.cache[base] === 1 ? 1 : 0,
                        id_base: base,
                        widget_instance: settings_instance
                    },
                    success(data) {
                        if (data && data.form) {
                            callback(data);
                            _this.cache[base] = 1;
                        }
                    }
                });
            }
        },
        message:{
            render(data, self) {
                    const d = document.createElement('div');
                    if( data.class !== undefined ){
                        d.className += data.class;
                    }
                    d.innerHTML = data.comment;
                    return d;
            }
        },
        filters: {
            render( data, self ) {
                const ranges = {
                        hue: {
                            label: self.label.hue,
                            units: { deg: { max: 360 } },
                            prop: 'hue-rotate'
                        },
                        saturation: {
                            label: self.label.sat,
                            units: { '%': { max: 200 } },
                            prop: 'saturate'
                        },
                        brightness: {
                            label: self.label.bri,
                            units: { '%': { max: 200 } },
                            prop: 'brightness'
                        },
                        contrast: {
                            label: self.label.con,
                            units: { '%': {  max: 200 } },
                            prop: 'contrast'
                        },
                        invert: {
                            label: self.label.inv,
                            units: { '%':'' },
                            prop: 'invert'
                        },
                        sepia: {
                            label: self.label.se,
                            units: { '%':'' },
                            prop: 'sepia'
                        },
                        opacity: {
                            label: self.label.op,
                            units: { '%': '' },
                            prop: 'opacity'
                        },
                        blur: {
                            label: self.label.bl,
                            units: { px: { max: 50 } },
                            prop: 'blur'
                        }
                    },
                    ul = document.createElement( 'ul' ),
                    id = data.id,
                    range = $.extend( true, {}, data );
                range['class'] = 'tb_filters_field';
                range.prop = null;
                ul.className = 'tb_seperate_items tb_filters_fields';
                for ( let rangeField in ranges ) {
                    if ( ranges[rangeField] !== undefined ) {
                        let rField = ranges[rangeField],
                            li = document.createElement( 'li' ),
                            label = document.createElement( 'div' ),
                            labelText = document.createElement( 'span' ),
                            prop_id = id + '_' + rangeField;
                        range.id = prop_id;
                        range['units'] = rField.units;
                        range['selector'] = data.selector;
                        label.className = 'tb_label';
                        labelText.className = 'tb_label_text';
                        labelText.textContent = rField.label;
                        label.appendChild( labelText );
                        li.appendChild( label );
                        if('hue'===rangeField){
                            range.deg=true;
                            li.appendChild( self.angle.render( range, self ) );
                            delete range.deg;
                        }
						else{
							li.appendChild( self.range.render( range, self ) );
                        }
                        ul.appendChild( li );
                        self.styles[prop_id] = { prop: rField.prop, selector: data.selector };
                    }
                }
                return ul;
            }
        },
        help(text) {
            const help = document.createElement('div'),
                helpContent = document.createElement('div'),
                icon = document.createElement('i');
            help.className = 'tb_help';
            helpContent.className = 'tb_help_content';
            icon.tabIndex = -1;
            icon.className='icon';
            helpContent.innerHTML = text;
            icon.appendChild(tb_app.Utils.getIcon('ti-help'));
            help.appendChild(icon);
            help.appendChild(helpContent);
            return help;
        },
        hint(text){
            const tooltip = document.createElement('span');
            tooltip.className = 'tb_tooltip_up';
            tooltip.textContent = text;
            return tooltip;
        },
        description(text) {
            const d = document.createElement('small');
                d.innerHTML = text;
            return d;
        },
        after( data ){
            const afterElem = document.createElement('span');
            afterElem.className = 'tb_input_after';
            afterElem.textContent =  this.label[data.after] !== undefined ? this.label[data.after] : data.after;
            if ( ( data['label'] === undefined || data['label'] === '' )
                    && ( data['help'] !== undefined && data['help'] !== '' ) ){
                    afterElem.appendChild(this.help(data['help']));
            }
            return afterElem;
        },
        height: {
            update(id, v, self) {
                self.checkbox.update(id, self.getStyleVal(id), self);
            },
            render( data, self ) {
                data.isHeight = true;
                const d = document.createDocumentFragment(),
                    heightData = $.extend( true, {}, data );
                heightData.label = 'ht';
                heightData.type = 'range';
                heightData.id = data.id;
                heightData.prop = 'height';
                heightData.wrap_class = 'tb_group_element_' + data.id + '_height tf_inline_b';
                heightData.units = {
                    px: {
                        max: 1200
                    },
                    vh:'',
                    '%':'',
                    em: {
                        max: 200
                    }
                };
                self.range.render( heightData, self );
                self.styles[data.id] = {prop: 'height', selector: data.selector};
                self.styles[data.id + '_auto_height'] = {prop: 'height', selector: data.selector};
                d.appendChild( self.range.render( heightData, self ) );
                d.appendChild( self.checkboxGenerate( 'checkbox', {
                    id: data.id + '_auto_height',
                    heightID: data.id,
                    type: 'checkbox',
                    isHeight: true,
                    prop: 'height',
                    binding:{
                        checked:{hide:'tb_group_element_ht_height'},
                        not_checked:{show:'tb_group_element_ht_height'}
                    },
                    options: [
                        { value: self.label.a_ht, name: 'auto' }
                    ]
                } ) );
                return d;
            }
        },
        toggle_switch:{
            update(id, v, self) {
                self.checkbox.update(id, self.getStyleVal(id), self);
            },
            controlChange(el,args){
                el.addEventListener('change', function () {
                    this.value=this.checked===true?args['on'].name:(args['off']!==undefined?args['off'].name:'');
                    if('visibility' === ThemifyConstructor.clicked && null !== api.activeModel){
                        api.Utils.visibilityLabel(document.querySelector('.tb_element_cid_'+api.activeModel.cid),api.activeModel);
                    }
                },{passive: true });
            },
             render ( data, self ) {
                const clone = $.extend(true,{},data),
                    orig = {},
                    label = document.createElement('div');
                let state = 'off',
                    v = self.getStyleVal(data.id);
                clone['control']=false;
                if(clone['class']===undefined){
                    clone['class']='toggle_switch';
                }
                else{
                    clone['class']+=' toggle_switch';
                }
                let options = clone['options'];
                if(options===undefined || options==='simple'){
                        if(options==='simple'){
                            options = {
                                'on':{
                                    'name':'yes',
                                    'value' : self.label['y']
                                },
                                'off':{
                                    'name':'no',
                                    'value' : self.label['no']
                                }
                            };
                        }
                        else{
                            options = {
                                'on':{
                                    'name':'no',
                                    'value' : self.label['s']
                                },
                                'off':{
                                    'name':'yes',
                                    'value' :self.label['hi']
                                }
                            };
                            if(clone['default']===undefined){
                                clone['default']='on';
                            }
                        }
                } 
                if ( v === undefined ){
                    if(clone['default'] === 'on'){
                        state ='on';
                    }
                    v = state==='on'?options['on'].name:(options['off']!==undefined?options['off'].name:'');
                }
                else{
                    if(v===false){
                        v = '';
                    }
                    state=options['on'].name===v?'on':'off';
                }
                for(let i in options){
                    if ( clone['after'] === undefined && options[i]['value']!==undefined) {
                        label.setAttribute('data-'+i, self.label[options[i]['value']]!==undefined?self.label[options[i]['value']]:options[i]['value']);
                    }
                    orig[i] = options[i];
                }
                const k = Object.keys( options )[0];
                delete clone['binding'];
                delete options[k]['value'];
                delete clone['default'];
                clone['options'] = [options[k]];
                if(clone['wrap_checkbox']===undefined){
                    clone['wrap_checkbox'] = '';
                }
                clone['wrap_checkbox']+=' tb_switcher';
                label.className = 'switch_label';
                const checkBox = self.checkboxGenerate('checkbox',clone),
                sw = checkBox.querySelector('.toggle_switch');
                sw.value=v;
                sw.checked=state==='on';
                this.controlChange(sw,orig);
                sw.parentNode.appendChild(label);
                self.initControl(sw, data);
                return checkBox;
            }
        },
        width: {
            update(id, v, self) {
                self.checkbox.update(id, self.getStyleVal(id), self);
            },
            render(data, self) {
                data.isWidth = true;
                const coptions = {
                    id: data.id + '_auto_width',
                    widthID: data.id,
                    type: 'checkbox',
                    isWidth: true,
                    prop: 'width',
                    options: [
                        {value: self.label.a_wd, name: 'auto'}
                    ]
                };
                self.styles[data.id + '_auto_width'] = {prop: 'width', selector: data.selector};
                const checkboxWrap = self.checkboxGenerate('checkbox', coptions),
                    checkbox = checkboxWrap.querySelector('.tb_lb_option'),
                    checkboxInput = checkboxWrap.querySelector('input'),
                    widthData = $.extend(true, {}, data);
                checkboxInput.addEventListener('change',function(e){
                    const widthField = topWindow.document.getElementsByClassName('tb_group_element_' + data.id + '_width')[0];
					if(widthField){
						widthField.classList.toggle('hide-auto-height',e.target.checked);
					}
                },{passive:true});
                widthData.label = 'w';
                widthData.type = 'range';
                widthData.id = data.id;
                widthData.prop = 'width';
                widthData.wrap_class = 'tb_group_element_' + data.id + '_width';
                if('auto' === self.values[data.id + '_auto_width']){
                    widthData.wrap_class += ' hide-auto-height';
                }
                widthData.units = {
                    px: {
                        min: -2000,
                        max: 2000
                    },
                    '%':'',
                    em: {
                        min: -20,
                        max: 20
                    }
                };

                const width = self.create([widthData]);
                //min width
                widthData.wrap_class = '';
                widthData.label = 'mi_wd';
                widthData.id = 'min_' + data.id;
                widthData.prop = 'min-width';
                const minWidth = self.create([widthData]);
                self.styles[widthData.id] = {prop: widthData.prop, selector: data.selector};
                //max width
                widthData.label = 'ma_wd';
                widthData.id = 'max_' + data.id;
                widthData.prop = 'max-width';
                const maxWidth = self.create([widthData]);
                self.styles[widthData.id] = {prop: widthData.prop, selector: data.selector};
                self.afterRun.push(function () {
                    const field = checkbox.parentNode.closest('.tb_field');
                    field.parentNode.insertBefore(width, field);
                    field.parentNode.insertBefore(maxWidth, field.nextSibling);
                    field.parentNode.insertBefore(minWidth, field.nextSibling);
                });
                return checkboxWrap;
            }
        },
        position: {
            render(data, self) {
                const options = {'top':self.label.top, 'right':self.label.right, 'bottom':self.label.bottom, 'left':self.label.left},
                    ul = document.createElement('ul'),
                    li = document.createElement('li'),
                    f = document.createDocumentFragment(),
                    d = document.createDocumentFragment(),
                    orig_id = data.id,
                    select = $.extend(true, {}, data),
                    radio = $.extend(true, {}, data);
                radio['options'] = [];
                radio['option_js'] = true;
                radio.id = orig_id + '-type';
                radio.no_toggle = true;
                radio['default'] = 'top';
                radio.prop = null;

                ul.className = 'tb_seperate_items tb_group_element_position';
                for (let i in options) {
                    let child = document.createElement('li'),
                        id = orig_id + '_' + i;
                    radio['options'].push({value: i, name: self.label[options[i]], icon: '<i class="tic-border-' + i + '"></i>', label_class: 'tb_radio_label_borders'});
                    child.className = 'tb_group_element_' + i;
                    self.styles[id] = {prop: i, selector: data.selector};
                    select.id = id;
                    select.type = 'range';
                    select.prop = 'position';
                    select.wrap_class = 'range_wrapper ' + id;
                    select.units = {px: {min: -2000, max: 2000},'%':''};
                    child.appendChild(self.range.render(select, self));
                    self.styles[id+'_auto'] = {prop: 'position', selector: data.selector};
                    child.appendChild(self.checkboxGenerate('checkbox',
                        {
                            id: id+'_auto',
                            is_position: true,
                            posId : id,
                            prop : i,
                            type : 'checkbox',
                            selector : data.selector,
                            options: [
                                {name: 'auto', value: self.label.auto}
                            ],
                            wrap_checkbox:'tf_inline_b',
                            binding:{
                                checked:{hide:id},
                                not_checked:{show:id}
                            }
                        }
                    ));
                    f.appendChild(child);
                }
                li.appendChild(self.radioGenerate('icon_radio', radio, self));
                ul.insertBefore(li, ul.childNodes[0]);
                ul.appendChild(f);
                self.styles[orig_id] = {prop: 'position', selector: data.selector};
                select.id = orig_id;
                select.binding = {
                    'empty': { hide: 'tb_group_element_position'},
                    'absolute' : { show: 'tb_group_element_position' },
                    'fixed' : { show: 'tb_group_element_position' },
                    'relative' : { hide: 'tb_group_element_position'},
                    'static' : { hide: 'tb_group_element_position' }
                };
                select.type = 'select';
                select.prop = 'position';
                select.options = {'':'','absolute':self.label.abs,'fixed':self.label.fi,'relative':self.label.re,'static':self.label.st};
                select.class = 'tb_position_field tb_multi_field';
                d.appendChild(self.select.render(select, self));
                d.appendChild(ul);
                return d;
            }
        },
        transform: {
            _label(l){
                const label = document.createElement( 'div' ),
                    labelText = document.createElement( 'span' );
                label.className = 'tb_label';
                labelText.className = 'tb_label_text';
                labelText.textContent = l;
                label.appendChild( labelText );
                return label;
            },
            _xy(prop,unit,data,self,label){
                const li = document.createElement( 'li' ),
					args = $.extend(true, {}, data);
                li.appendChild( this._label(label) );
                args.prop=prop;
                args.orig_id=data.id;
                args['options'] = [
                    { id: 'top', label : 'X' },
                    { id: 'bottom', label : 'Y' }
                ];
                args['units'] = unit;
                args.id = data.id + '_'+prop;
                li.appendChild(self.createMarginPadding(data.type, args));
                return li;
            },
            _rotate(data,self){
				const inputs = ['x','y','z'],
                    ul = document.createElement( 'ul' ),
					li = document.createElement( 'li' );
                ul.className = 'tb_seperate_items tf_inline_b tf_left tb_tr_rotate';
                li.appendChild( this._label(self.label.ro) );
                data.orig_id=data.id;
                const args = $.extend(true, {}, data);
                for(let input in inputs){
                    if (inputs.hasOwnProperty(input)){
						let li_r = document.createElement( 'li' );
						args.id = data.id + '_rotate_' + inputs[input];
						args.prop='rotate';
						args.deg=true;
						args.tooltip=inputs[input];
						li_r.appendChild(self.angle.render(args,self));
						ul.appendChild( li_r );
					}
                }
                li.appendChild(ul);
                return li;
            },
            render(data, self) {
                const ul = document.createElement( 'ul' );
                ul.className = 'tb_seperate_items tb_transform_fields';
                // Scale
                ul.appendChild( this._xy('scale',{'x':{min:-100,max:1000,increment:0.1}},data,self,self.label.sc) );
                // Translate
                ul.appendChild(this._xy('translate',{'px':{min:-2000,max:2000},'%':{min:-100,max:100},'em':{min:0,max:100}},data,self,self.label.tl));
                // Rotate
                ul.appendChild(this._rotate(data,self));
                // Skew
                ul.appendChild(this._xy('skew',{'deg':{min:-180,max:180}},data,self,self.label.sk));
                return ul;
            }
        },
        code_editor:{
            load:(callback)=>{
                if(typeof topWindow.wp.codeEditor === 'undefined'){
                    const check = function(i){
                            delete themifyBuilder.c_e.assets[i];
                            if(Object.keys(themifyBuilder.c_e.assets).length===0){
                                delete themifyBuilder.c_e.assets;
                                Themify.trigger('codemirror_loaded');
                                if(typeof callback === 'function'){
                                    callback();
                                }
                            }
                        },
                        keys = Object.keys(themifyBuilder.c_e.assets);
                    for(let i = keys.length-1;i>-1;i--){
                        if('js'===themifyBuilder.c_e.assets[keys[i]].t){
                            topWindow.Themify.LoadAsync(themifyBuilder.c_e.assets[keys[i]].u,function(){
                                check(keys[i]);
                            },themifyBuilder.c_e.assets[keys[i]].v);
                        }else{
                            topWindow.Themify.LoadCss(themifyBuilder.c_e.assets[keys[i]].u,themifyBuilder.c_e.assets[keys[i]].v,null,null,function(){
                                check(keys[i]);
                            });
                        }
                    }
                }else if(typeof callback === 'function'){
                    callback();
                }
            },
            setHeight:(el,key)=>{
                const k='tb_code_editor',v = JSON.parse(localStorage.getItem(k));
                if(v && v[key]){
                    el.style.height = v[key] + 'px';
                }
                new ResizeObserver(en=>{
                    const h = parseInt(en[0].target.style.height);
                    if(!isNaN(h)){
                        const new_v = JSON.parse(localStorage.getItem(k)) || {};
                        new_v[key] = h;
                        localStorage.setItem(k,JSON.stringify(new_v));
                    }
                }).observe(el);
            }
        }
    };

})(jQuery, Themify, window.top, document);
