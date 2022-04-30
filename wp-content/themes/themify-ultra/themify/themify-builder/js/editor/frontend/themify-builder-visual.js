(function ($, Themify, window, topWindow, document, api, Common) {
    'use strict';

    const tb_shorcodes = [],
        module_cache = [],
        propNames = {},
        cssModules={};

    api.mode = 'visual';
    api.iframe = '';
    api.id = '';
    api.is_ajax_call = false;

    api.Mixins.Frontend = {
        render_visual(callback) {
            // collect all jobs
            const constructData = {},
                    batch = Themify.convert(this.el.querySelectorAll('[data-cid]'));
            batch.unshift(this.el);
            for (let i = 0, len = batch.length; i < len; ++i) {
                let model = api.Models.Registry.lookup(batch[i].getAttribute('data-cid'));
                if (model) {
                    constructData[model.cid] = model.toJSON();
                }
            }
            api.bootstrap(constructData, callback);
        },
        change_callback() {
            const el = this.$el;
            el[0].insertAdjacentHTML('afterbegin', '<span class="tf_lazy tb_preview_component"></span>');
            this.render_visual(function () {
                el.find('.tb_preview_component').remove();
                api.Utils.setCompactMode(el[0].getElementsByClassName('module_column'));
                const cid = api.eventName === 'row' ? el.data('cid') : api.beforeEvent.data('cid');
                api.undoManager.push(cid, api.beforeEvent, el, api.eventName);
                api.Utils.runJs(el,null,true);
            });
        },
        createEl(markup) {
            const type = this.model.get('elType'),
                    temp = document.createElement('div');
            temp.innerHTML = markup;
            const item = temp.getElementsByClassName('module_' + type)[0],
                cl = item.classList,
                attr = item.attributes,
				el=type==='subrow'?this.el.getElementsByClassName('module_subrow')[0]:this.el,
				$el=type==='subrow'?$(el):this.$el;
            for (var i = cl.length-1;i>-1;--i) {
                el.classList.add(cl[i]);
            }
            for (i = attr.length - 1; i > -1; --i) {
				let n = attr[i].name;
                if (n!== 'class') {
                    el.setAttribute(n, attr[i].value);
                    if (n.indexOf('data-') === 0) {
                        $el.data(n.replace('data-', ''), attr[i].value);
                    }
                }
            }
            const cover = item.getElementsByClassName('builder_row_cover')[0],
                    dc = item.getElementsByClassName('tbp_dc_styles')[0],
                    slider = item.getElementsByClassName(type + '-slider')[0],
                    frames = item.getElementsByClassName('tb_row_frame_wrap')[0];
            if (frames !== undefined && frames.parentNode === item) {
                const _frames = el.getElementsByClassName('tb_row_frame_wrap')[0];
                if (_frames !== undefined) {
                    el.replaceChild(frames, _frames);
                } else {
                    el.insertBefore(frames, el.firstChild);
                }
            }
            if (dc !== undefined && dc.parentNode === item) {
                const _dc = el.getElementsByClassName('tbp_dc_styles')[0];
                if (_dc !== undefined) {
                    el.replaceChild(dc, _dc);
                } else {
                    el.appendChild(dc);
                }
            }
            if (cover !== undefined && cover.parentNode === item) {
                const _cover = el.getElementsByClassName('builder_row_cover')[0];
                if (_cover !== undefined) {
                    el.replaceChild(cover, _cover);
                } else {
                    el.insertAdjacentElement('afterbegin', cover);
                }
            }
            if (slider !== undefined && slider.parentNode === item) {
                const _slider = el.getElementsByClassName(type + '-slider')[0];
                if (_slider !== undefined) {
                    el.replaceChild(slider, _slider);
                } else {
                    el.insertAdjacentElement('afterbegin', slider);
                }
            }
        },
        restoreHtml(rememberedEl) {
            const tmp = document.createElement('div');
            tmp.innerHTML = rememberedEl;
            rememberedEl = tmp.firstChild;
			api.ActionBar.clear();
			api.ActionBar.clearClicked();
			api.ActionBar.clearSelected();
			for(let items=rememberedEl.getElementsByClassName('tb_action_wrap'),i=items.length-1;i>-1;--i){
				while (items[i].firstChild!==null) {
					items[i].removeChild(items[i].lastChild);
				}
			}
			
			for(let items=Themify.selectWithParent('[contenteditable]',rememberedEl),i=items.length-1;i>-1;--i){
				items[i].setAttribute('contenteditable','false');
				let p=items[i].closest('.tb_editor_on');
				if(p){
					p.classList.remove('tb_editor_on','tb_editor_clicked');
				}
			}
			for (let items=Themify.selectWithParent('tb_element_clicked',rememberedEl),i=items.length-1; i>-1;--i) {
				items[i].classList.remove('tb_element_clicked');
			}
            for (let items=Themify.selectWithParent('[data-cid]',rememberedEl),i=items.length-1;i>-1;--i) {
                let model = api.Models.Registry.lookup(items[i].getAttribute('data-cid'));
                if (model) {
                    model.trigger('change:view', items[i]);
                }
            }
			api.liveStylingInstance.$liveStyledElmt[0].replaceWith(rememberedEl);
            api.Utils.runJs($(rememberedEl),null,true);
        }
    };


    api.previewVisibility = function () {
        const el = this.el,
			cl=el.classList,
                visible = 'row' === this.model.get('elType') ? this.model.get('styling') : this.model.get('mod_settings');

        if (api.isPreview) {
            if ('hide_all' === visible['visibility_all']) {
                cl.add('hide-all');
            } else {
                if ('hide' === visible['visibility_desktop']) {
                    cl.add('hide-desktop');
                }

                if ('hide' === visible['visibility_tablet']) {
                    cl.add('hide-tablet');
                }

                if ('hide' === visible['visibility_tablet_landscape']) {
                    cl.add('hide-tablet_landscape');
                }

                if ('hide' === visible['visibility_mobile']) {
                    cl.add('hide-mobile');
                }
            }
        

            if (!_.isEmpty(visible['custom_parallax_scroll_reverse'])) {
                el.dataset.parallaxElementReverse = true;
            }

            if (!_.isEmpty(visible['custom_parallax_scroll_fade'])) {
                el.dataset.parallaxFade = true;
            }
			if (!_.isEmpty(visible['custom_parallax_scroll_speed'])) {
                el.dataset.parallaxElementSpeed = parseInt(visible['custom_parallax_scroll_speed']);
				// Themify.parallaxScrollingInit($el, true);
            }

        } else {
			cl.remove('hide-desktop', 'hide-tablet', 'hide-tablet_landscape', 'hide-mobile','hide-all');
        }
    };

    Object.assign(api.Views.BaseElement.prototype, api.Mixins.Frontend);

    api.Views.register_row({
        initialize() {
            this.listenTo(this.model, 'create:element', this.createEl);
            this.listenTo(this.model, 'visual:change', this.change_callback);
            this.listenTo(this.model, 'custom:restorehtml', this.restoreHtml);

            api.vent.on('dom:preview', api.previewVisibility.bind(this));
        }
    });

    api.Views.register_subrow({
        initialize() {
            this.listenTo(this.model, 'create:element', this.createEl);
            this.listenTo(this.model, 'visual:change', this.change_callback);
            this.listenTo(this.model, 'custom:restorehtml', this.restoreHtml);
        }
    });

    api.Views.register_column({
        initialize() {
            this.listenTo(this.model, 'create:element', this.createEl);
            this.listenTo(this.model, 'visual:change', this.change_callback);
            this.listenTo(this.model, 'custom:restorehtml', this.restoreHtml);
        }
    });

    api.Views.register_module({
        _jqueryXhr: false,
        templateVisual(settings) {
            const tpl = wp.template('builder-' + this.model.get('mod_name') + '-content');
            return tpl(settings);
        },
        initialize() {
            this.listenTo(this.model, 'create:element', this.createEl);
            this.listenTo(this.model, 'visual:change', this.change_callback);
            this.listenTo(this.model, 'custom:restorehtml', this.restoreHtml);
            this.listenTo(this.model, 'custom:preview:live', this.previewLive);
            this.listenTo(this.model, 'custom:preview:refresh', this.previewReload);

            api.vent.on('dom:preview', api.previewVisibility.bind(this));
        },
        createEl(markup) {
            const temp = document.createElement('div'),
					fr=document.createDocumentFragment(),
                    mod_name = document.createElement('div'),
                    actionBtn = document.createElement('div'),
                    actionWrap = document.createElement('div'),
                    visibilityLabel = document.createElement('div'),
                    slug = this.model.get('mod_name');
            temp.innerHTML = markup;
            const module = temp.getElementsByClassName('module')[0],
                    css = temp.querySelector('#tb_module_styles');
            if (module === undefined) {
                if (!api.is_ajax_call) {
                    api.Models.Registry.remove(this.model.cid);
                    this.model.destroy();
                }
                return false;
            }
            if (css !== null) {
                const cssList = JSON.parse(css.innerText);
                for (let i in cssList) {
                    if (!Themify.cssLazy[i] && cssList[i].s) {
                        Themify.cssLazy[i] = true;
                        Themify.LoadCss(cssList[i].s, cssList[i].v);
                    }
                }
            }
			while (this.el.firstChild!==null) {
				this.el.firstChild.remove();
			}
            // Visibility Label
            visibilityLabel.className = 'tb_visibility_hint';
            visibilityLabel.appendChild(api.Utils.getIcon('ti-eye'));
			
            api.Utils.visibilityLabel(visibilityLabel,this.model);
            
            mod_name.className = 'tb_data_mod_name';
            mod_name.innerHTML = themifyBuilder.modules[slug].name;
            actionBtn.className = 'tf_plus_icon tb_column_btn_plus tb_module_btn_plus tb_disable_sorting';
            actionWrap.className = 'tb_action_wrap tb_module_action';
			module.classList.add('module-' + slug,'tb_'+this.model.get('element_id'));
			module.appendChild(mod_name);
			fr.appendChild(actionWrap);
			fr.appendChild(module);
            fr.appendChild(visibilityLabel);
            fr.appendChild(actionBtn);
			this.el.appendChild(fr);
            if (slug === 'image' && Themify.is_builder_loaded === true && api.id === false) {
                let el = this.el;
                setTimeout(function () {
                    api.Utils.calculateHeight();
					el=null;
                }, 500);
            }
			
        },
        shortcodeToHTML(content) {
            const shorcodes = [],
                shorcode_list = themifyBuilder.available_shortcodes;
            let is_shortcode = false;
            for (let i = 0, len = shorcode_list.length; i < len; ++i) {
                content = wp.shortcode.replace(shorcode_list[i], content, function (atts) {
                    let sc_string = wp.shortcode.string(atts),
                            k = Themify.hash(sc_string),
                            replace = '';
                    if (tb_shorcodes[k] === undefined) {
                        shorcodes.push(sc_string);
                        replace = '<span class="tmp' + k + '">[loading shortcode...]</span>'
                    } else {
                        replace = tb_shorcodes[k];
                    }
                    is_shortcode = true;
                    return replace;
                });
            }
            if (is_shortcode && shorcodes.length > 0) {
				const self = this;
				if (self._shortcodeXhr !== undefined && 4 !== self._shortcodeXhr) {
                    self._shortcodeXhr.abort();
                }
                self._shortcodeXhr = $.ajax({
                    type:'POST',
                    url: themifyBuilder.ajaxurl,
                    dataType: 'json',
                    data: {
                        action: 'tb_render_element_shortcode',
                        shortcode_data: JSON.stringify(shorcodes),
                        tb_load_nonce: themifyBuilder.tb_load_nonce
                    },
                    success(data) {
                        if (data.success) {
                            const shortcodes = data.data.shortcodes,
                                    styles = data.data.styles;
                            if (styles) {
                                for (let i = 0, len = styles.length; i < len; ++i) {
									if ( styles[i].s ) {
										Themify.LoadCss(styles[i].s, styles[i].v, null, styles[i].m);
									}
                                }
                            }
                            for (let i = 0, len = shortcodes.length; i < len; ++i) {
                                let k = Themify.hash(shortcodes[i].key);
                                self.$el.find('.tmp' + k).replaceWith(shortcodes[i].html);
                                tb_shorcodes[k] = shortcodes[i].html;
                                if (Themify.is_builder_loaded) {
                                    api.Utils.runJs(self.$el, 'module',true);
                                }
                            }
                        }
                    }
                });
            }
            return  {'content': content, 'found': is_shortcode};
        },
        previewLive(data, is_shortcode, cid, selector, value) {
            api.is_ajax_call = false;
            if (this._jqueryXhr && 4 !== this._jqueryXhr) {
                this._jqueryXhr.abort();
            }
            let is_selector = api.activeModel !== null && selector,
                    tmpl,
                    timer = 300;
            data['cid'] = cid ? cid : api.activeModel.cid;
            if (!is_selector || is_shortcode === true) {
                tmpl = this.templateVisual(data);
                if (api.is_ajax_call) {//if previewReload is calling from visual template 
                    return;
                }
                if (is_shortcode === true) {
                    const shr = this.shortcodeToHTML(tmpl);
                    if (shr.found) {
                        timer = 1000;
                        tmpl = shr.content;
                        is_selector = null;
                    }
                }
            }
			Themify.trigger('tbDisableInline');
            if (is_selector) {
                const len = selector.length;
                if (len === undefined) {
                    selector.innerHTML = value;
                } else {
                    for (let i = len-1; i>-1 ;--i) {
                        selector[i].innerHTML = value;
                    }
                }
                api.Utils.calculateHeight();
            } else {
                this.createEl(tmpl);
                if (Themify.is_builder_loaded===true) {
                    if (!cid) {
                        api.liveStylingInstance.$liveStyledElmt = this.$el;
                        const self = this;
                        if (this.timeout) {
                            clearTimeout(this.timeout);
                        }
                        this.timeout = setTimeout(function () {
                            api.Utils.runJs(self.$el, 'module');
                            api.Utils.calculateHeight();
                        }, timer);
                    } else {
                        api.Utils.calculateHeight();
                        api.Utils.runJs(this.$el, 'module');
                    }
                }
            }
        },
        previewReload(settings, selector, value) {
            if (selector && api.activeModel.cid && value) {
                const len = selector.length;
                if (len === undefined) {
                    selector.innerHTML = value;
                } else {
                    for (let i = 0; i < len; ++i) {
                        selector[i].innerHTML = value;
                    }
                }
                api.Utils.calculateHeight();
                return;
            }
			
            const that = this;
            if (this._jqueryXhr && 4 !== this._jqueryXhr) {
                this._jqueryXhr.abort();
            }
            api.is_ajax_call = true;
			Themify.trigger('tbDisableInline');
            function callback(data) {
                that.createEl(data);
                api.liveStylingInstance.$liveStyledElmt = that.$el;
                api.Utils.runJs(that.$el, 'module',true);
                that.$el.find('.tb_preview_component').remove();
                api.Utils.calculateHeight();
            }

            const name = this.model.get('mod_name'),
                    unsetKey = settings['unsetKey'];

            that.el.insertAdjacentHTML('afterbegin', '<span class="tb_preview_component tf_lazy"></span>');
            delete settings['cid'];
            delete settings['unsetKey'];
            delete settings['element_id'];

            settings = api.Utils.clear(settings);
            settings['module_' + name + '_slug'] = 1; //unique settings
            settings = JSON.stringify(settings);
            const key = Themify.hash(settings);
            if (module_cache[key] !== undefined && !unsetKey) {
                callback(module_cache[key]);
                return;
            }
            this._jqueryXhr = $.ajax({
                type: 'POST',
                url: themifyBuilder.ajaxurl,
                data: {
                    action: 'tb_load_module_partial',
                    tb_post_id: themifyBuilder.post_ID,
                    tb_cid: this.model.cid,
                    element_id: this.model.get('element_id'),
                    tb_module_slug: name,
                    tb_module_data: settings,
                    tb_load_nonce: themifyBuilder.tb_load_nonce
                },
                success(data) {
                    module_cache[key] = data;
                    callback(data);
                    api.is_ajax_call = that._jqueryXhr = false;
                },
                error() {
                    that.$el.removeClass('tb_preview_loading');
                }
            });
            return this;
        }
    });

    api.bootstrap = function (settings, callback, gsData) {
        // collect all jobs
        const jobs = [];
            let set_rules = true;
        if (!settings) {
            set_rules = false;
            settings = api.Models.Registry.items;
        }
        for (let cid in settings) {
            let model = api.Models.Registry.items[cid],
                    data = model.toJSON(),
                    type = data.elType,
                    key = type === 'module' ? 'mod_settings' : 'styling',
                    styles = data[key];
            if (styles && Object.keys(styles).length > 0) {
                if (set_rules === true) {
                    api.liveStylingInstance.setCss([data], (type === 'module' ? data['mod_name'] : type));
                }
            } else if ('module' !== type) {
                continue;
            }
            if ('module' === type && 'tile' !== data['mod_name'] && data['mod_settings']['__dc__'] === undefined && themifyBuilder.modules[data['mod_name']].type !== 'ajax') {
                const is_shortcode = 'accordion' === data['mod_name'] || 'box' === data['mod_name'] || 'feature' === data['mod_name'] || 'tab' === data['mod_name'] || 'text' === data['mod_name'] || 'plain-text' === data['mod_name'] || 'pointers' === data['mod_name'] || 'pro-image' === data['mod_name'] || 'countdown' === data['mod_name'] || 'button' === data['mod_name'] || 'pro-slider' === data['mod_name'] || 'timeline' === data['mod_name'];

                model.trigger('custom:preview:live', data['mod_settings'], is_shortcode, cid);
                continue;
            }
            if ('column' === type) {
                delete data.modules;
            } else if ('row' === type || 'module' === type || type === 'subrow') {
                if (type === 'row' && styles['custom_css_row'] === 'tb-page-break') {
                    continue;
                }
                delete data.cols;
            }
            jobs.push({jobID: cid, data: data});

        }
        settings = null;
        this.batch_rendering(jobs, 0, 360, callback, gsData);
    };

    api.batch_rendering = function (jobs, current, size, callback, gsData) {
        if (current >= jobs.length) {
            // load callback
            if (typeof callback === 'function') {
                callback.call(this);
            }
            api.toolbar.pageBreakModule.countModules();
			Themify.trigger('tb_css_visual_modules_load');
            return;
        } else {
            const smallerJobs = jobs.slice(current, current + size);
            this.render_element(smallerJobs, gsData).done(function () {
                api.batch_rendering(jobs, current += size, size, callback);
            });
        }
    };

    api.render_element = function (constructData, gsData) {
        const data = {
            action: 'tb_render_element',
            tmpGS: gsData ? JSON.stringify(gsData) : '',
            batch: JSON.stringify(constructData),
            tb_load_nonce: themifyBuilder.tb_load_nonce,
            tb_post_id: themifyBuilder.post_ID
        };
        return $.ajax({
            type: 'POST',
            url: themifyBuilder.ajaxurl,
            dataType: 'json',
            data: data,
            success(data) {
                for (let cid in data) {
                    if (cid !== 'tb_module_styles' && cid !== 'gs') {
                        api.Models.Registry.lookup(cid).trigger('create:element', data[cid]);
                    }
                }
                if (data['tb_module_styles']) {
                    const cssList = data['tb_module_styles'];
                    for (let i in cssList) {
						let href=cssList[i].s;
                        if (!Themify.cssLazy[i] && href) {
                            Themify.cssLazy[i] = true;
							cssModules[href]=true;
                            Themify.LoadCss(href, cssList[i].v,null,null,function(){
								delete cssModules[href];
								if(Object.keys(cssModules).length===0){
									Themify.trigger('tb_css_visual_modules_load');
								}
							});
                        }
                    }
                }
				else{
					Themify.trigger('tb_css_visual_modules_load');
				}
            }
        });
    };

    function get_visual_templates(callback) {
        if (api.Forms.LayoutPart.init) {
            if (callback) {
                callback();
            }
            return;
        }
        const key = 'tb_visual_templates';
        function getData() {
            if (themifyBuilder.debug) {
                return false;
            }
            try {
                let record = localStorage.getItem(key),
                    m=themify_vars.version;
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
        }
        function setData(value) {
            try {
                let m = themify_vars.version;
                for (let s in themifyBuilder.modules) {
                    m += s;
                }
				if(themifyBuilder.cache_data){
					m += themifyBuilder.cache_data;
				}
                const record = {val: value, h: Themify.hash(m)};
                localStorage.setItem(key, JSON.stringify(record));
                return true;
            } catch (e) {
                return false;
            }
        }

        function insert(data) {
            let tmp = '';
            for (let i in data) {
                tmp += data[i];
            }
            document.body.insertAdjacentHTML('beforeend', tmp);
            if (callback) {
                callback();
            }
        }
        const data = getData();
        if (data) {//cache visual templates)
            insert(data);
            return;
        }
        $.ajax({
            type: 'POST',
            url: themifyBuilder.ajaxurl,
            dataType: 'json',
            data: {
                action: 'tb_load_visual_templates',
                tb_load_nonce: themifyBuilder.tb_load_nonce
            },
            success(resp) {
                if (resp) {
                    insert(resp);
                    setData(resp);
                }
            }
        });
    }
    ;

    api.render = function () {
        get_visual_templates(function () {
            const items = document.getElementsByClassName('themify_builder_content'),
                    id = themifyBuilder.post_ID;
                let builder = null;
            for (let i = items.length - 1; i > -1; --i) {
                if (items[i].getAttribute('data-postid') != id) {
                    items[i].classList.add('not_editable_builder');
                } 
                else if (builder === null) {
                    builder = items[i];
                    builder.setAttribute('id', 'themify_builder_content-' + id);
                    builder.setAttribute('data-postid', id);
                    builder.classList.remove('not_editable_builder');
                    builder.classList.add('tb_active_builder');
                }
            }
            let data = window['builderdata_' + id] ? window['builderdata_' + id].data : [];
            if (!Array.isArray(data) || data.length === 0) {
                data = {};
            } else {
                data = data.filter(function (e) {
                    return e && Object.keys(e).length > 0;
                });
            }
            window['builderdata_' + id] = null;
            api.id = id;
            api.Instances.Builder[api.builderIndex] = new api.Views.Builder({el: builder, collection: new api.Collections.Rows(data), type: api.mode});
            api.Instances.Builder[api.builderIndex].render();
            data = null;
            api.bootstrap(null, function () {
                ThemifyStyles.init(ThemifyConstructor.data, ThemifyConstructor.breakpointsReverse, id);
                api.liveStylingInstance = new ThemifyLiveStyling();
                api.liveStylingInstance.setCss(api.Mixins.Builder.toJSON(api.Instances.Builder[0].el));
                setTimeout(verticalResponsiveBars, 2000);
                Themify.on('tb_css_visual_modules_load',function(){
                    
                        const topSvg=topWindow.document.getElementById('tf_svg'),
                            svg=document.getElementById('tf_svg');
                        topSvg.parentNode.replaceChild(svg,topSvg);
                        api.toolbar.el.style.display = 'block';
                        topWindow.Themify.trigger('themify_builder_ready');
                        topWindow.jQuery('body').trigger('themify_builder_ready');//deprecated, Backward compatibility use instead Themify.trigger
                        api.Utils.runJs(null,null,true);
                        api.Instances.Builder[api.builderIndex].$el.triggerHandler('tb_init');
                        Themify.is_builder_loaded = true;
                        api.id = false;
                        setTimeout(function () {
                            Themify.fontAwesome();
                            api.EdgeDrag.init();
                        }, 500);
                },true);
            });
        });
    };
    // Initialize Builder
    Themify.body.one('builderiframeloaded.themify', function (e, iframe) {
		Themify.w = window.innerWidth;
		Themify.h = window.innerHeight;
        api.iframe = $(iframe);
        setTimeout(function () {
            Themify.loadAnimateCss();
        }, 1);
        Common.setToolbar();
        api.toolbar = new api.Views.Toolbar({el: '#tb_toolbar'});
        api.toolbar.render();
        api.GS.init();
        Themify.LoadAsync(tbLocalScript.builder_url + '/js/editor/themify-constructor.js', function () {
            //use top iframe js files
            window.wp.media = window.top.wp.media;
            window.MediaElementPlayer = window.top.MediaElementPlayer;
            jQuery.fn.mediaelementplayer = window.top.jQuery(window.top.document).mediaelementplayer;
            window.wp.mediaelement = window.top.wp.mediaelement;
            window.tinyMCE = window.top.tinyMCE;
            window.tinyMCEPreInit = window.top.tinyMCEPreInit;
            window.tinymce = window.top.tinymce;
            window.switchEditors = window.top.switchEditors;
            // Used in WP widgets
            window.wpApiSettings = window.top.wpApiSettings;
            
            ThemifyConstructor.getForms(api.render);
        }, null, null, function () {
            return typeof ThemifyConstructor !== 'undefined';
        });
        // Disable Links and Submit forms in live builder
        document.addEventListener('submit',function(e){
            e.preventDefault();
        });
        document.addEventListener('click',function(e){
            const target = e.target,
                el = 'A'===target.tagName?target:target.closest('a');
            if(el &&  el.target!=='_blank' && ('#' === el.href || !el.href || el.href.replace(new URL(el.href).hash,'') !== window.top.location.href.replace(location.hash,''))){
                e.preventDefault();
            }
        });
    });
	

	function findIndex(rules, selector) {
		for (let i = rules.length - 1; i > -1; --i) {
			if (selector === rules[i].selectorText.replace(/\s*>\s*/g, '>').replace(/\,\s/g, ',')) {
				return i;
			}
		}
		return false;
	}

	function renameProp(p) {
		if (propNames[p] === undefined) {
			const old_p = p;
			if (p.indexOf('-') !== -1) {
				const temp = p.toLowerCase().split('-');
				p = temp[0] + temp[1].charAt(0).toUpperCase() + temp[1].slice(1);
				if (temp[2] !== undefined) {
					p += temp[2].charAt(0).toUpperCase() + temp[2].slice(1);
				}
				if (temp[3] !== undefined) {
					p += temp[3].charAt(0).toUpperCase() + temp[3].slice(1);
				}
			}
			propNames[old_p] = p;
			return p;
		}
		return propNames[p];
	}
	
	

        const ThemifyLiveStyling=function () {
            this.$context = $('#tb_lightbox_parent', topWindow.document);
            this.$liveStyledElmt = null;
            this.module_rules = {};
            this.rulesCache = {};
            this.currentStyleObj = {};
        };
        ThemifyLiveStyling.prototype.init = function (isInline, isGlobal) {
            let type,
				elId = api.activeModel.get('element_id');
            this.type = api.activeModel.get('elType');
            this.group = this.type === 'module' ? api.activeModel.get('mod_name') : this.type;
            if (isGlobal === true && api.GS.previousModel !== null) {
                const tmp_m = api.Models.Registry.lookup(api.GS.previousModel);
                type = tmp_m.get('elType');
                if (type === 'module') {
                    type = tmp_m.get('mod_name');
                }
                elId = tmp_m.get('element_id');
            } else {
                type = this.group;
            }
            this.prefix = ThemifyStyles.getBaseSelector(type, elId);
            this.$liveStyledElmt = isGlobal ? $(document.querySelector(this.prefix)) : api.Instances.Builder[api.builderIndex].$el.find('.tb_element_cid_'+api.activeModel.cid).first();
            this.currentStyleObj = {};
            this.tempData = {};
            this.undoData = {};
            this.undoData[api.activeBreakPoint] = {};
            this.tempData[api.activeBreakPoint] = {};
            if (this.rulesCache[api.activeBreakPoint] === undefined) {
                this.rulesCache[api.activeBreakPoint] = {};
            }
            this.currentSheet = this.getSheet(api.activeBreakPoint, isGlobal);
            if (isInline !== true) {
                if (this.type !== 'column' && this.type !== 'subrow') {
                    this.bindAnimation();
                }
                this.bindTabsSwitch();
                this.initModChange();
            }
        };


        ThemifyLiveStyling.prototype.setCss = function (data, type, isGlobal) {
            const css = api.GS.createCss(data, type, undefined),
                    fonts = [];
            for (let p in  css) {
                if ('fonts' === p || 'cf_fonts' === p) {
                    for (let f in css[p]) {
                        let v = f;
                        if (css[p][f].length > 0) {
                            v += ':' + css[p][f].join(',');
                        }
                        fonts.push(v);
                    }
                } else if ('gs' === p) {
                    let st = css[p];
                    for (let bp in st) {
                        let sheet = this.getSheet(bp, true),
                                rules = sheet.cssRules ? sheet.cssRules : sheet.rules;
                        for (let k in st[bp]) {
                            if (findIndex(rules, k) === false) {
                                sheet.insertRule(k + '{' + st[bp][k].join('') + ';}', rules.length);
                            }
                        }
                    }
                } else if (p !== 'bg') {
                    let sheet = this.getSheet(p, isGlobal),
                            rules = sheet.cssRules ? sheet.cssRules : sheet.rules;
                    for (let k in css[p]) {
                        if (findIndex(rules, k) === false) {
                            sheet.insertRule(k + '{' + css[p][k].join('') + ';}', rules.length);
                        }
                    }
                }
            }
            ThemifyConstructor.font_select.loadGoogleFonts(fonts.join('|'));
            return css;
        };
        /**
         * Apply CSS rules to the live styled element.
         *
         * @param {string} containing CSS rules for the live styled element.
         * @param {mixed) 
         * @param {Array} selectors List of selectors to apply the newStyleObj to (e.g., ['', 'h1', 'h2']).
         */
        ThemifyLiveStyling.prototype.setLiveStyle = function (prop, val, selectors) {
            if (!selectors) {
                selectors = [''];
            } else if (typeof selectors === 'string') {
                selectors = [selectors];
            }
            selectors = ThemifyStyles.getNestedSelector(selectors);
            let fullSelector = '';
            const rules = this.currentSheet.cssRules ? this.currentSheet.cssRules : this.currentSheet.rules;
            for (let i = 0, len = selectors.length; i < len; ++i) {
                let isPseudo = this.styleTabId === 'h' ? selectors[i].endsWith(':after') || selectors[i].endsWith(':before') : true;
                if (isPseudo === false && selectors[i].indexOf(':hover') === -1) {
                    selectors[i] += ':hover';
                }
                fullSelector += this.prefix + selectors[i];
                if (isPseudo === false) {
                    fullSelector += ',' + this.prefix + selectors[i].replace(':hover', '.tb_visual_hover');
                }
                if (i !== (len - 1)) {
                    fullSelector += ',';
                }
            }
            if (this.isChanged === true) {
                let hover_items;
                if (this.styleTabId === 'h') {
                    const hover_selectors = fullSelector.split(',');
                    for (let i = hover_selectors.length - 1; i > -1; --i) {
                        if (hover_selectors[i].indexOf('tb_visual_hover') === -1) {
                            hover_items = document.querySelectorAll(hover_selectors[i].split(':hover')[0]);
                            for (let j = hover_items.length - 1; j > -1; --j) {
                                hover_items[j].classList.add('tb_visual_hover');
                            }
                        }
                    }
                } else {
                    this.$liveStyledElmt[0].classList.remove('tb_visual_hover');
                    hover_items = this.$liveStyledElmt[0].getElementsByClassName('tb_visual_hover');
                    for (let i = hover_items.length - 1; i > -1; --i) {
                        hover_items[i].classList.remove('tb_visual_hover');
                    }
                }
            }
            fullSelector = fullSelector.replace(/\s{2,}/g, ' ').replace(/\s*>\s*/g, '>').replace(/\,\s/g, ',');
            const hkey = Themify.hash(fullSelector),
                orig_v = val,
                old_prop = prop;
                let index = this.rulesCache[api.activeBreakPoint][hkey] !== undefined ? this.rulesCache[api.activeBreakPoint][hkey] : findIndex(rules, fullSelector);
            if (val === false) {
                val = '';
            }
            prop = renameProp(prop);
            if (index === false || !rules[index]) {
                index = rules.length;
                this.currentSheet.insertRule(fullSelector + '{' + old_prop + ':' + val + ';}', index);
                if (this.tempData[api.activeBreakPoint][index] === undefined) {
                    this.tempData[api.activeBreakPoint][index] = {};
                }
                this.tempData[api.activeBreakPoint][index][prop] = '';
            } else {
                if (this.tempData[api.activeBreakPoint][index] === undefined) {
                    this.tempData[api.activeBreakPoint][index] = {};
                }
                if (this.tempData[api.activeBreakPoint][index][prop] === undefined) {
                    this.tempData[api.activeBreakPoint][index][prop] = rules[index].style[prop];
                }
                rules[index].style[prop] = val;

            }
            this.rulesCache[api.activeBreakPoint][hkey] = index;
            if (this.undoData[api.activeBreakPoint][index] === undefined) {
                this.undoData[api.activeBreakPoint][index] = {};
            }
            this.undoData[api.activeBreakPoint][index][prop] = {'a': val, 'b': this.tempData[api.activeBreakPoint][index][prop]};
            Themify.body.triggerHandler('tb_' + this.type + '_styling', [this.group, prop, val, orig_v, this.$liveStyledElmt]);
            if (api.activeBreakPoint !== 'desktop' && (prop.indexOf('padding') === 0 || prop.indexOf('margin') === 0 || prop === 'height' || prop === 'width')) {
                api.Utils.calculateHeight();
            }
        };


        ThemifyLiveStyling.prototype.initModChange = function (off) {
            if (off === true) {
                Themify.body.off('themify_builder_change_mode.tb_visual_mode');
                return;
            }
            const self = this;
            Themify.body.on('themify_builder_change_mode.tb_visual_mode', function (e, prevbreakpoint, breakpoint) {
                self.setMode(breakpoint, api.GS.activeGS !== null);
            });
        };

        ThemifyLiveStyling.prototype.setMode = function (breakpoint, isGlobal) {
            if (this.tempData[breakpoint] === undefined) {
                this.tempData[breakpoint] = {};
            }
            if (this.rulesCache[breakpoint] === undefined) {
                this.rulesCache[breakpoint] = {};
            }
            if (this.undoData[breakpoint] === undefined) {
                this.undoData[breakpoint] = {};
            }
            this.currentSheet = this.getSheet(breakpoint, isGlobal);
        };

        ThemifyLiveStyling.prototype.revertRules = function (isGlobal) {
            for (let points in this.tempData) {
                let sheet = this.getSheet(points, isGlobal),
                        rules = sheet.cssRules ? sheet.cssRules : sheet.rules;
                for (let i in this.tempData[points]) {
                    if (rules[i]) {
                        for (let j in this.tempData[points][i]) {
                            rules[i].style[j] = this.tempData[points][i][j];
                        }
                    }
                }
            }
            this.undoData = {};
            this.tempData = {};
        };
        ThemifyLiveStyling.prototype.getSheet = function (breakpoint, isGlobal) {
            return ThemifyStyles.getSheet(breakpoint, isGlobal);
        };

        ThemifyLiveStyling.prototype.reset = function () {
            this.rulesCache = {};
            this.tempData = {};
            this.undoData = {};
            const points = ThemifyConstructor.breakpointsReverse;
            for (let i = points.length - 1; i > -1; --i) {
                let sheet = this.getSheet(points[i]),
                        rules = sheet.cssRules;
                for (let j = rules.length - 1; j > -1; --j) {
                    sheet.deleteRule(j);
                }
                sheet = this.getSheet(points[i], true);
                rules = sheet.cssRules;
                for (let j = rules.length - 1; j > -1; --j) {
                    sheet.deleteRule(j);
                }
            }
        };


        //closing lightbox
        ThemifyLiveStyling.prototype.clear = function () {
            const self = this,
                    el = this.$liveStyledElmt[0];
            if (el !== undefined) {
                el.classList.remove('animated','hover-wow','tb_visual_hover');
            }
            self.module_rules = {};
            this.styleTab = this.styleTabId = this.currentField = this.isChanged = null;
            if (!api.saving && api.hasChanged) {
                self.revertRules(api.GS.activeGS !== null);
                if (self.type && self.type !== 'module' && api.GS.activeGS === null) {
                    const styling = api.activeModel.get('styling');
                    if (styling && (styling['background_type'] === 'slider' && styling['background_slider'])) {
                        self.bindBackgroundSlider();
                    }
                }
            } else {
                const hover_items = el.getElementsByClassName('tb_visual_hover');
                for (let k = hover_items.length - 1; k > -1; --k) {
                    hover_items[k].classList.remove('tb_visual_hover');
                }
            }
            self.bindAnimation(true);
            self.bindTabsSwitch(true);
            self.initModChange(true);
            self.undoData = {};
            self.tempData = {};
            this.$liveStyledElmt = this.currentStyleObj = this.currentSheet = null;
        };
        ThemifyLiveStyling.prototype.addOrRemoveFrame = function (_this, settings) {
            if (this.type === 'module') {
                return;
            }
            let self = this,
				$el = this.$liveStyledElmt.hasClass( 'active_subrow' ) ? this.$liveStyledElmt.find( '> .module_subrow' ) : this.$liveStyledElmt,
				isLive = typeof _this === 'string',
				side = isLive ? _this : _this.closest('.tb_tab').id.split('_').pop(),
				selector,
				frame_wrap = $el.children( '.tb_row_frame_wrap' )[0];
			if ( ! frame_wrap ) {
				frame_wrap = document.createElement( 'div' );
                                frame_wrap.className='tb_row_frame_wrap tf_overflow tf_abs';
				$el.children( '.tb_action_wrap' ).after( frame_wrap );
			}
			let frame = frame_wrap.querySelector( '.tb_row_frame_' + side );
            if (undefined === settings) {
                settings = {};
				selector = this.getValue(side + '-frame_type').selector;
				const options = ['custom', 'location', 'width', 'height', 'width_unit', 'height_unit', 'repeat', 'type', 'layout', 'color', 'sh_x', 'sh_y', 'sh_b', 'sh_c'];
                for (let i = 0, len = options.length; i < len; ++i) {
                    let item = topWindow.document.getElementById(side + '-frame_' + options[i]),
                            v;
                    if (options[i] === 'type') {
                        v = item.querySelector('input:checked').value;
                    } else if (options[i] === 'layout') {
                        v = item.getElementsByClassName('selected')[0].id;
                    } else if (options[i] === 'color' || options[i] === 'sh_c' ) {
                        v = api.Utils.getColor(item);
                        if (v === '') {
                            continue;
                        }
                    } else {
                        v = item.value;
                    }
                    settings[options[i]] = v;
                }
            }
            if (settings.type === side + '-presets' || settings.type === side + '-custom') {
                if ((settings.type === side + '-presets' && (!settings.layout || settings.layout === 'none')) || (settings.type === side + '-custom' && !settings.custom)) {
                    if (api.activeBreakPoint === 'desktop') {
                        if (!isLive) {
                            this.setLiveStyle('background-image', '', selector);
                        }
                    } else if (settings.layout === 'none') {
                        this.setLiveStyle('background-image', 'none', selector);
                    }
                    return;
                }
                if ( ! frame ) {
                    frame = document.createElement('div');
                    frame.className = 'tf_abs tf_overflow tb_row_frame tb_row_frame_' + side;
                    frame.className+=(side==='left' || side==='right')?' tf_h':' tf_w';
                    if (settings.location !== undefined) {
                        frame.className += ' ' + settings.location;
                    }
                    frame_wrap.appendChild( frame );
                } else {
                    frame.classList.remove( 'behind_content', 'in_front' );
                    if ( settings.location !== undefined ) {
                        frame.classList.add( settings.location );
                    }
                }
            }
            if (!isLive) {
                if (settings.type === side + '-presets') {
                    const layout = (side === 'left' || side === 'right') ? settings.layout + '-l' : settings.layout,
                            key = Themify.hash(layout),
                            callback = function (svg) {
                                if (settings.color) {
                                    svg = svg.replace(/\#D3D3D3/ig, settings.color);
                                }
                                self.setLiveStyle('background-image', 'url("data:image/svg+xml;utf8,' + encodeURIComponent(svg) + '")', selector);
                            };
                    if (ThemifyStyles.fields.frameCache[key] !== undefined) {
                        callback(ThemifyStyles.fields.frameCache[key]);
                    } else {
                        const frame_tmpl = document.getElementById('tmpl-frame_' + layout);
                        if (frame_tmpl !== null) {
                            ThemifyStyles.fields.frameCache[key] = frame_tmpl.textContent.trim();
                            callback(ThemifyStyles.fields.frameCache[key]);
                        } else {
                            $.ajax({
                                dataType: 'text',
                                url: tbLocalScript.builder_url + '/img/row-frame/' + layout + '.svg',
                                success(svg) {
                                    ThemifyStyles.fields.frameCache[key] = svg;
                                    callback(svg);
                                }
                            });
                        }
                    }

                } else {
                    self.setLiveStyle('background-image', 'url("' + settings.custom + '")', selector);
                }
                self.setLiveStyle('width', (settings.width ? (settings.width + settings.width_unit) : ''), selector);
                self.setLiveStyle('height', (settings.height ? (settings.height + settings.height_unit) : ''), selector);
				if (settings.repeat) {
                    if (side === 'left' || side === 'right') {
                        self.setLiveStyle('background-size', '100% ' + (100 / settings.repeat) + '%', selector);
                    } else {
                        self.setLiveStyle('background-size', (100 / settings.repeat) + '% 100%', selector);
                    }
                } else {
                    self.setLiveStyle('background-size', '', selector);
                }

				/* frame shadow */
				if ( settings.sh_b && settings.sh_c ) {
					let shadow = [
						settings.sh_x ? settings.sh_x + 'px' : 0, // horizontal offset
						settings.sh_y ? settings.sh_y + 'px' : 0, // vertical offset
						settings.sh_b + 'px', // blur
						settings.sh_c //  color
					];
					self.setLiveStyle( 'filter', 'drop-shadow(' + shadow.join( ' ' ) + ')' , selector );
				} else {
					self.setLiveStyle( 'filter', '' , selector );
				}
            }
        };


        ThemifyLiveStyling.prototype.overlayType = function (val) {
            if (this.type === 'module') {
                return;
            }
            const is_color = val === 'color' || val === 'hover_color',
                    cl = is_color ? 'tfminicolors-input' : 'themify-gradient-type',
                    el = this.styleTab.getElementsByClassName('tb_group_element_' + val)[0].getElementsByClassName(cl)[0];
            if (is_color) {
                let v = el.value;
                if (v) {
                    v = api.Utils.getColor(el);
                }
                Themify.triggerEvent(el, 'themify_builder_color_picker_change', {val: v});
            } else {
                Themify.triggerEvent(el, 'change');

            }
        };

        ThemifyLiveStyling.prototype.addOrRemoveComponentOverlay = function (type, id, v) {
            if (this.type === 'module') {
                return;
            }
            let overlayElmt = this.getComponentBgOverlay(this.type);
			const data = this.getValue(id),
                    selector = data.selector,
                    isset = overlayElmt.length !== 0;
            this.$liveStyledElmt[0].classList.toggle('tb_visual_hover',this.styleTabId === 'h');
            if (v === '' && id) {
                this.setLiveStyle('backgroundImage', '', selector);
                this.setLiveStyle('backgroundColor', '', selector);
            } else {
                if (!isset) {
                    overlayElmt = document.createElement('div');
                    overlayElmt.className = 'builder_row_cover tf_abs';
                    this.$liveStyledElmt.find('.tb_action_wrap').first().before(overlayElmt);
                }
                // To prevent error if runs from GS
                if (!data) {
                    return;
                }
                if (type === 'color') {
                    this.setLiveStyle('backgroundImage', 'none', selector);
                } else {
                    this.setLiveStyle('backgroundColor', false, selector);
                }
                this.setLiveStyle(data.prop, v, selector);
            }
        };

        ThemifyLiveStyling.prototype.outline = function (el) {
			const self = this,
				selector = self.getValue(el.id);
			const container = el.closest( '.tb_multi_fields' ),
				color = api.Utils.getColor( container.getElementsByClassName( 'outline_color' )[0] ),
				width = parseFloat( container.getElementsByClassName( 'outline_width' )[0].value ),
				style = container.getElementsByClassName( 'outline_style' )[0].value;
				
			if ( style === 'none' ) {
				self.setLiveStyle( 'outline', 'none', selector );
			} else if ( ! isNaN( width ) && width !== '' && color !== '' ) {
				self.setLiveStyle( 'outline', width + 'px ' + style + ' ' + color, selector );
			}
		};

        ThemifyLiveStyling.prototype.bindMultiFields = function (_this, data) {
            const self = this;
			data = self.getValue(_this.id);
            function setFullWidth(val, prop) {
                if (is_border === false && is_border_radius === false) {
                    if (self.type === 'row' && tbLocalScript.fullwidth_support !== undefined && ((is_checked && (prop === 'padding' || prop === 'margin')) || prop === 'padding-left' || prop === 'padding-right' || prop === 'margin-left' || prop === 'margin-right')) {
                        const type = prop.split('-'),
                                k = api.activeBreakPoint + '-' + type[0];
                        if (is_checked) {
                            val = val + ',' + val;
                        } else {
                            let old_val = self.$liveStyledElmt.data(k);
                            if (!old_val) {
                                old_val = [];
                            } else {
                                old_val = old_val.split(',');
                            }
                            if (type[1] === 'left') {
                                old_val[0] = val;
                            } else {
                                old_val[1] = val;
                            }
                            val = old_val.join(',');
                        }
                        self.$liveStyledElmt.attr('data-' + k, val).data(k, val);
                        ThemifyBuilderModuleJs.loadOnAjax(self.$liveStyledElmt,self.type,true);
                    }
                    if ((is_checked && prop === 'padding') || prop.indexOf('padding') === 0) {
                        setTimeout(function () {
                           Themify.trigger('tfsmartresize');
                        }, 600);
                    }
                }
            }
            if (data) {
                var parent = _this.closest('.tb_seperate_items'),
                        prop = data.prop.split('-'),
                        is_border_radius = prop[3] !== undefined,
                        is_border = is_border_radius === false && prop[0] === 'border',
                        is_checked = parent.hasAttribute('data-checked'),
                        items = parent.getElementsByClassName('tb_multi_field'),
                        getCssValue = function (el) {
                            let v='';
                            if (is_border === true) {
								const p = el.closest('li'),
									width = parseFloat(p.getElementsByClassName('border_width')[0].value.trim()),
									style = p.getElementsByClassName('border_style')[0].value,
									color_val = api.Utils.getColor(p.getElementsByClassName('tfminicolors-input')[0]);
                                if (style === 'none') {
                                    v = style;
                                }
								else if (!isNaN(width) && width !== '' && color_val !== '') {
                                    v = width + 'px ' + style + ' ' + color_val;
                                }
                            } 
							else {
                                v = el.value.trim();
                                if (v !== '') {
                                    v = parseFloat(v);
                                    if (isNaN(v)) {
                                        v = '';
                                    } else {
                                        v += el.closest('.tb_input').querySelector('#' + el.id + '_unit').value;
                                    }
                                }
                            }
                            return v;
                        },
                        val = is_checked === true ? getCssValue(_this) : null;
                prop = prop[0];
                for (let i = items.length - 1; i > -1; --i) {
                    if (is_checked === false) {
                        val = getCssValue(items[i]);
                    }
                    prop = self.getValue(items[i].id).prop;
                    self.setLiveStyle(prop, val, data.selector);
                    setFullWidth(val, prop);
                }
                if (is_border === false) {
                    api.ActionBar.hoverCid = null;
                }

                items = null;
            }
        };

        ThemifyLiveStyling.prototype.bindRowWidthHeight = function (id, val, el) {
            if (!el) {
                el = this.$liveStyledElmt;
            }
            if (id === 'row_height') {
                if (val === 'fullheight') {
                    el[0].classList.add(val);
                } else {
                    el[0].classList.remove('fullheight');
                }
            } else {
                if (val === 'fullwidth') {
                    el.removeClass('fullwidth').addClass('fullwidth_row_container');
                    ThemifyBuilderModuleJs.loadOnAjax(el,this.type,true);
                } else if (val === 'fullwidth-content') {
                    el.removeClass('fullwidth_row_container').addClass('fullwidth');
                    ThemifyBuilderModuleJs.loadOnAjax(el,this.type,true);
                } else {
                    el.removeClass('fullwidth fullwidth_row_container')
                            .css({
                                'margin-left': '',
                                'margin-right': '',
                                'padding-left': '',
                                'padding-right': '',
                                'width': ''
                            });
                }
            }
            Themify.trigger('tfsmartresize');
        };
        ThemifyLiveStyling.prototype.bindAnimation = function (off) {
            const self = this;
            if (off === true) {
                this.$context.off('change.tb_animation');
                return;
            }
            this.$context.on('change.tb_animation', '#animation_effect,#animation_effect_delay,#animation_effect_repeat,#hover_animation_effect', function () {
                const is_hover = this.id === 'hover_animation_effect',
                        key = is_hover ? 'hover_animation_effect' : 'animation_effect',
                        effect = is_hover ? this.value: self.$context.find('#animation_effect').val(),
                        animationEffect = self.currentStyleObj[key] !== undefined ? self.currentStyleObj[key] : ThemifyConstructor.values[key],
                        el = self.$liveStyledElmt;
                if (animationEffect) {
                    el.removeClass(animationEffect + ' wow').css({'animation-name': '', 'animation-delay': '', 'animation-iteration-count': ''});
                }
                el.removeClass('animated tb_hover_animate');
                self.currentStyleObj[key] = effect;
                if (effect) {
					const delay = is_hover?'':parseFloat(self.$context.find('#animation_effect_delay').val()),
                        repeat = is_hover?'':parseInt(self.$context.find('#animation_effect_repeat').val()),
						saveOld= tbLocalScript['is_animation'];
                    el.css({'animation-delay': ((delay > 0 && !isNaN(delay))? delay + 's' : ''), 'animation-iteration-count': ((repeat > 0 && !isNaN(repeat))? repeat : '')})
					.addClass('wow').attr('data-tf-animation',effect);
                    tbLocalScript['is_animation']=true;
                    ThemifyBuilderModuleJs.wowInit(el,null,false);
                    tbLocalScript['is_animation']=saveOld;
                }
            });
        };
        ThemifyLiveStyling.prototype.getRowAnchorClass = function (rowAnchor) {
            return rowAnchor.length > 0 ? 'tb_has_section tb_section-' + rowAnchor : '';
        };

        ThemifyLiveStyling.prototype.getStylingVal = function (stylingKey) {
            return this.currentStyleObj[stylingKey] !== undefined ? this.currentStyleObj[stylingKey] : '';
        };

        ThemifyLiveStyling.prototype.setStylingVal = function (stylingKey, val) {
            this.currentStyleObj[stylingKey] = val;
        };

        ThemifyLiveStyling.prototype.bindBackgroundMode = function (val, id) {

            const bgValues = {
                'repeat': 'repeat',
                'repeat-x': 'repeat-x',
                'repeat-y': 'repeat-y',
                'repeat-none': 'no-repeat',
                'no-repeat': 'no-repeat',
                'fullcover': 'cover',
                'best-fit-image': 'contain',
                'builder-parallax-scrolling': 'cover',
                'builder-zoom-scrolling': '100%',
                'builder-zooming': '100%'
            },
			el=this.$liveStyledElmt[0];
            if (bgValues[val] !== undefined) {
                let propCSS = {},
                        data = this.getValue(id),
                        item = topWindow.document.getElementById(data.origId);
                if (item !== null && item.value.trim() === '') {
                    val = null;
                    propCSS = {
                        'background-repeat': '',
                        'background-size': '',
                        'background-position': '',
                        'background-attachment': ''
                    };
                } else {
                    if (val.indexOf('repeat') !== -1) {
                        propCSS['background-repeat'] = bgValues[val];
                        propCSS['background-size'] = 'auto';
                    } else {
                        propCSS['background-size'] = bgValues[val];
                        propCSS['background-repeat'] = 'no-repeat';

                        if (bgValues[val] === 'best-fit-image' || bgValues[val] === 'builder-zooming') {
                            propCSS['background-position'] = 'center center';
                        } else if (bgValues[val] === 'builder-zoom-scrolling') {
                            propCSS['background-position'] = '50%';
                        }
                    }
                }
                el.classList.remove('builder-parallax-scrolling','builder-zooming','builder-zoom-scrolling');
                el.style['backgroundSize'] = el.style['backgroundPosition'] = '';
                if (this.type === 'module' && (val === 'builder-parallax-scrolling' || val === 'builder-zooming' || val === 'builder-zoom-scrolling' || val === 'best-fit-image')) {
                    return;
                }
                if (val === 'builder-parallax-scrolling') {
                    el.classList.add('builder-parallax-scrolling');
                } else if (val === 'builder-zooming') {
                    el.classList.add('builder-zooming');
                } else if (val === 'builder-zoom-scrolling') {
                    el.classList.add('builder-zoom-scrolling');
                }
                for (let key in propCSS) {
                    this.setLiveStyle(key, propCSS[key], data.selector);
                }
                if(val === 'builder-zoom-scrolling' || val === 'builder-zooming' || val === 'builder-parallax-scrolling'){
                    ThemifyBuilderModuleJs.loadOnAjax(this.$liveStyledElmt,null,true);
                }
            }
        };

        ThemifyLiveStyling.prototype.position = function (val, id) {
            if (val && val.length > 0) {
                const data = this.getValue(id);
                if (data) {
                    const v2 = val.split(',')
                    this.setLiveStyle(data.prop, v2[0] + '% ' + v2[1] + '%', data.selector);
                }
            }
        };

        ThemifyLiveStyling.prototype.bindBackgroundSlider = function (data) {
            if (this.type === 'module') {
                return;
            }
            const self = this,
				images = self.$context.find('#' + data.id).val().trim();
				self.removeBgSlider();
			
            if (images) {
                if (this.cahce === undefined) {
                    this.cahce = {};
                }
                const options = {
                    shortcode: encodeURIComponent(images),
                    mode: self.$context.find('#background_slider_mode').val(),
                    speed: self.$context.find('#background_slider_speed').val(),
                    size: self.$context.find('#background_slider_size').val()
                },
				callback=function(slider) {
					const $bgSlider = $(slider),
							bgCover = self.getComponentBgOverlay( self.type );
					if (bgCover.length > 0) {
						bgCover.after($bgSlider);
					} else {
						self.$liveStyledElmt.prepend($bgSlider);
					}
					ThemifyBuilderModuleJs.loadOnAjax($bgSlider.parent(),self.type,true);
				};
				let hkey = '';

                for (let i in options) {
                    hkey += Themify.hash(i + options[i]);
                }
                if (this.cahce[hkey] !== undefined) {
                    callback(this.cahce[hkey]);
                    return;
                }
                options['type'] = self.type;

                $.post(themifyBuilder.ajaxurl, {
                    nonce: themifyBuilder.tb_load_nonce,
                    action: 'tb_slider_live_styling',
                    tb_background_slider_data: options
                },
                        function (slider) {
                            if (slider.length < 10) {
                                return;
                            }
                            self.cahce[hkey] = slider;
                            callback(slider);
                        }
                );
            }
        };
        ThemifyLiveStyling.prototype.videoOptions = function (item, val) {
            if (this.type === 'module') {
                return;
            }
            let video = this.$liveStyledElmt.find('.big-video-wrap').first(),
                    el = '',
                    is_checked = item.checked === true,
                    type = '';
            if (video[0] === undefined) {
                return;
            }
            if (video[0].classList.contains('themify_ytb_wrapper')) {
                el = this.$liveStyledElmt;
                type = 'ytb';
            } else if (video[0].classList.contains('themify-video-vmieo')) {
                el = $f(video.children('iframe')[0]);
                if (el) {
                    type = 'vimeo';
                }
            } else {
                el = this.$liveStyledElmt.data('plugin_ThemifyBgVideo');
                type = 'local';
            }

            if (val === 'mute') {
                if (is_checked) {
                    if (type === 'ytb') {
                        el.ThemifyYTBMute();
                    } else if (type === 'vimeo') {
                        el.api('setVolume', 0);
                    } else if (type === 'local') {
                        el.muted(true);
                    }
                    this.$liveStyledElmt.data('mutevideo', 'mute');
                } else {
                    if (type === 'ytb') {
                        el.ThemifyYTBUnmute();
                    } else if (type === 'vimeo') {
                        el.api('setVolume', 1);
                    } else if (type === 'local') {
                        el.muted(false);
                    }
                    this.$liveStyledElmt.data('mutevideo', '');
                }
            } else if (val === 'unloop') {
                if (is_checked) {
                    if (type === 'vimeo') {
                        el.api('setLoop', 0);
                    } else if (type === 'local') {
                        el.loop(false);
                    }
                    this.$liveStyledElmt.data('unloopvideo', '');
                } else {
                    if (type === 'vimeo') {
                        el.api('setLoop', 1);
                    } else if (type === 'local') {
                        el.loop(true);
                    }
                    this.$liveStyledElmt.data('unloopvideo', 'loop');

                }
            }
        };
        ThemifyLiveStyling.prototype.bindBackgroundTypeRadio = function (bgType) {
            let el = 'tb_uploader_input';
            if (this.type !== 'module') {
                if (bgType !== 'slider') {
                    if (this.styleTabId === 'n') {
                        this.removeBgSlider();
                    }
                } else {
                    el = 'tb_shortcode_input';
                }
                if (bgType !== 'video' && this.styleTabId === 'n') {
                    this.removeBgVideo();
                }
            }
            if (bgType !== 'gradient') {
                this.setLiveStyle('backgroundImage', 'none');
            } else {
                el = 'themify-gradient-type';
            }
            const group = this.styleTab.getElementsByClassName('tb_group_element_' + bgType)[0];
            Themify.triggerEvent(group.getElementsByClassName(el)[0], 'change');
            if (bgType === 'image' && this.type === 'module') {
                el = group.getElementsByClassName('tfminicolors-input')[0];
                if (el) {
                    Themify.triggerEvent(el, 'themify_builder_color_picker_change', {val: el.value});
                }
            }
        };

        ThemifyLiveStyling.prototype.bindFontColorType = function (v, id, type) {
            if (type === 'radio') {
                const is_color = v.indexOf('_solid') !== -1,
					uid = is_color === true ? v.replace(/_solid$/ig, '') : v.replace(/_gradient$/ig, '-gradient-type'),
					el = topWindow.document.getElementById(uid);
                if (is_color === true) {
                    let v = api.Utils.getColor(el);
                    if (v === undefined || v === '') {
                        v = '';
                    }
                    Themify.triggerEvent(el, 'themify_builder_color_picker_change', {val: v});
                } else {
                    Themify.triggerEvent(el, 'change');
                }
                return;
            }
            let prop = type,
				selector = this.getValue(id).selector;
            if (prop === 'color') {


                if (v === undefined || v === '') {
                    v = '';
                    this.setLiveStyle('WebkitBackgroundClip', '', selector);
                    this.setLiveStyle('backgroundClip', '', selector);
                    this.setLiveStyle('backgroundImage', '', selector);
                } else {
                    this.setLiveStyle('WebkitBackgroundClip', 'border-box', selector);
                    this.setLiveStyle('backgroundClip', 'border-box', selector);
                    this.setLiveStyle('backgroundImage', 'none', selector);
                }
            } else if (v !== '') {
                prop = 'backgroundImage';
                this.setLiveStyle('color', 'transparent', selector);
                this.setLiveStyle('WebkitBackgroundClip', 'text', selector);
                this.setLiveStyle('backgroundClip', 'text', selector);
            }
            if (v !== '' || prop === 'color')
                this.setLiveStyle(prop, v, selector);
        };

        ThemifyLiveStyling.prototype.shadow = function (el, id, prop) {
            const data = this.getValue(id);
            if (data) {
                let items = el.closest('.tb_seperate_items').getElementsByClassName('tb_shadow_field'),
                        inset = '',
                        allisEmpty = true,
                        val = '';
                for (let i = 0, len = items.length; i < len; ++i) {
                    if (items[i].classList.contains('tb-checkbox')) {
                        inset = items[i].checked ? 'inset ' : '';
                    } else {
                        let v = items[i].value.trim();
                        if (ThemifyConstructor.styles[items[i].id].type === 'color') {
                            v = api.Utils.getColor(items[i]);
                        } else {
                            if (v === '') {
                                v = 0;
                            } else {
                                allisEmpty = false;
                                v += items[i].closest('.tb_input').querySelector('#' + items[i].id + '_unit').value;
                            }

                        }
                        val += v + ' ';
                    }
                }
                val = allisEmpty === true ? '' : inset + val;
                this.setLiveStyle(data.prop, val, data.selector);
            }
        };
        ThemifyLiveStyling.prototype.filters = function (el, id) {
            let items = el.closest('.tb_filters_fields').getElementsByClassName('tb_filters_field'),
                    val = '',
                    data;
            for (let i = 0, len = items.length; i < len; ++i) {
                let v = items[i].value.trim();
                if ('' === v) {
                    continue;
                }
                data = this.getValue(items[i].id);
                v += 'hue-rotate' === data.prop?'deg':items[i].closest('.tb_seperate_items').querySelector('#' + items[i].id + '_unit').textContent;
                v = data.prop + '(' + v + ')';
                val += v + ' ';
            }
            data = this.getValue(id);
            this.setLiveStyle('filter', val, data.selector);
        };
    ThemifyLiveStyling.prototype.transform = function (el, id) {
        let css='',unit;
        const wrap = el.closest('.tb_transform_fields'),
            data = this.getValue(id),
            options = ['scale','translate','rotate','skew'],
            orig_id = id.split('_')[0];
        for (let i = 0, len = options.length; i < len; ++i) {
            switch (options[i]) {
                case 'scale':
                case 'translate':
                case 'skew':
                    const x = wrap.querySelector('#'+orig_id+'_'+options[i]+'_top').value.trim(),
                        y = wrap.querySelector('#'+orig_id+'_'+options[i]+'_bottom').value.trim();
                    if('translate'===options[i]){
                        unit={
                            x:wrap.querySelector('#'+orig_id+'_'+options[i]+'_top_unit').value,
                            y:wrap.querySelector('#'+orig_id+'_'+options[i]+'_bottom_unit').value
                        };
                    }else{
                        unit='skew'===options[i]?'deg':'';
                    }
                    if('' !== x || '' !== y) {
                        if ('' !== x && wrap.querySelector('#'+orig_id + '_'+options[i]+'_opp_bottom .style_apply_oppositive').checked) {
                            css += options[i]+'(' + x+('translate'===options[i]?unit.x:unit)+ ') ';
                        } else if ('' !== x && '' !== y) {
                            css += options[i]+'(' + x+('translate'===options[i]?unit.x:unit) + ',' + y+('translate'===options[i]?unit.y:unit) + ') ';
                        } else {
                            css += '' !== x ? options[i]+'X(' + x+('translate'===options[i]?unit.x:unit) + ') ' : options[i]+'Y(' + y+('translate'===options[i]?unit.y:unit) + ') ';
                        }
                    }
                    break;
                case 'rotate':
                    const inputs = ['x','y','z'];
                    for(let k in inputs){
                        if (!inputs.hasOwnProperty(k)) continue;
                        const v = wrap.querySelector('#'+orig_id+'_'+options[i]+'_'+inputs[k]).value.trim();
                        if(''!==v){
                            css += options[i]+inputs[k].toUpperCase()+'(' + v+ 'deg) ';
                        }
                    }
                    break;
            }
        }
        this.setLiveStyle('transform', css.trim(), data.selector);
    };

        ThemifyLiveStyling.prototype.setData = function (id, prop, val) {
            const data = this.getValue(id);

            if (data) {
                if (prop === '') {
                    prop = data.prop;
                }
                this.setLiveStyle(prop, val, data.selector);
            }
        };

        ThemifyLiveStyling.prototype.bindEvents = function (el, data) {
            if (el.classList.contains('style_apply_all')) {
                return;
            }

            const self = this;

            function getTab(el) {
                if (self.currentField !== el.id || '' === self.currentField) {
                    self.currentField = el.type === 'radio' ? false : el.id;
                    self.isChanged = true;
                    self.styleTab = null;
                    self.styleTabId = 'n';
                    let tab = el.closest('.tb_tab');
                    if (tab === null) {
                        tab = el.closest('.tb_expanded_opttions');
                        if (tab === null) {
                            tab = topWindow.document.getElementById('tb_options_styling');
                        }
                    } else {
                        self.styleTabId = tab.id.split('_').pop();
                    }
                    self.styleTab = tab;
                } else {
                    self.isChanged = false;
                }
            }
            (function () {
                let event,
                        type = data['type'],
                        prop = data['prop'],
                        id = data['id'];
                if (type === 'color') {
                    event = 'themify_builder_color_picker_change';
                } else if (type === 'gradient') {
                    event = 'themify_builder_gradient_change';
                } else {
                    event = type === 'text' || type === 'range' || type === 'textarea' ? 'keyup' : 'change';
                }
                el.addEventListener(event, function (e) {
                    var cl = this.classList,
                            val,
                            is_select = this.tagName === 'SELECT',
                            is_radio = !is_select && this.type === 'radio';
                    getTab(this);
                    api.hasChanged = true;
                    if (e.detail && e.detail.val) {
                        val = e.detail.val;
                    } else if (type === 'frame') {
                        val = this.id;
                    } else {
                        val = this.value;
                    }
                    val = val !== undefined && val !== 'undefined' ? val.trim() : '';
					if ( cl.contains( 'outline_color' ) || cl.contains( 'outline_width' ) || cl.contains( 'outline_style' ) ) {
						self.outline( this, data );
						return;
					}
                    if (cl.contains('tb_transform_field')) {
                        self.transform(this, id);
                        return;
                    }
                    else if ((type === 'color' && cl.contains('border_color')) || (is_select === true && cl.contains('border_style')) || (event === 'keyup' && (cl.contains('border_width') || cl.contains('tb_multi_field')))) {
                        self.bindMultiFields(this);
                        return;
                    } else if (prop === 'frame-custom' || type === 'frame' || cl.contains('tb_frame')) {
                        if (self.type !== 'module') {
                            self.addOrRemoveFrame(this);

                        }
                        return;
                    } else if (cl.contains('tb_shadow_field')) {
                        self.shadow(this, id);
                        return;
                    } else if (cl.contains('tb_filters_field')) {
                        self.filters(this, id);
                        return;
                    }
                    if (event === 'keyup') {
                        if (val !== '') {
                            if (prop === 'column-rule-width') {
                                val += 'px';
                                const bid = id.replace('_width', '_style'),
                                        border = topWindow.document.getElementById(bid);
                                if (border !== null) {
                                    self.setData(bid, '', border.value);
                                }
                            } else if (prop === 'column-gap') {
                                val += 'px';
                            } else {
                                const unit = topWindow.document.getElementById(id + '_unit');
                                if (unit !== null) {
                                    val += unit.value ? unit.value : 'px';
                                }
                            }
                        }
                        self.setData(id, '', val);
                        return;
                    }
                    if (data.isFontColor === true) {
                        self.bindFontColorType(val, id, type);
                        return;
                    }
                    if (is_select === true) {
                        if (prop === 'font-weight') {
                            // load the font variant
                            const font = this.getAttribute('data-selected'),
                                    wrap = self.styleTab.getElementsByClassName('tb_multi_fonts')[0]; // if the fontWeight has "italic" style, toggle the font_style option
                            if (font !== null && font !== '' && font !== 'default' && ThemifyConstructor.font_select.safe[font] === undefined) {
                                ThemifyConstructor.font_select.loadGoogleFonts(font + ':' + val);
                            }
                            if(wrap){
                                let el;
                                if (val.indexOf('italic') !== -1) {
                                    val = parseInt(val.replace('italic', ''));
                                    el = wrap.querySelector('[value="italic"]');
                                } else {
                                    el = wrap.querySelector('[value="normal"]');
                                }
                                if (el.checked === false) {
                                    el.parentNode.click();
                                }
                            }
                        } else if (type === 'font_select') {
                            if (val !== '' && val !== 'default' && ThemifyConstructor.font_select.safe[val] === undefined) {
                                let weight = this.closest('.tb_tab').getElementsByClassName('font-weight-select')[0],
                                        request;

                                request = val;
                                if (weight !== undefined) {
                                    request += ':' + weight.value;
                                } else {
                                    self.setLiveStyle('font-weight', '', data.selector);
                                }
                                ThemifyConstructor.font_select.loadGoogleFonts(request);
                            } else if (val === 'default') {
                                val = '';
                            }
                            if (val !== '') {
                                val = ThemifyStyles.parseFontName(val);
                            }
                        } else if (cl.contains('tb_unit')) {
                            Themify.triggerEvent(self.$context.find('#' + id.replace('_unit', ''))[0], 'keyup');
                            return;
                        } else if (prop === 'background-mode') {
                            self.bindBackgroundMode(val, id);
                            return;
                        } else if (prop === 'column-count' && val == 0) {
                            val = '';
                        } else if (cl.contains('tb_position_field')) {
                            const pos = ['top', 'right', 'bottom', 'left'],
                                    wrap = this.closest('.tb_input');
									
                            for (let i = pos.length - 1; i > -1; --i) {
                                let posVal = '';
								if('absolute' === val || 'fixed' === val){
									let selector = '#' + data.id + '_' + pos[i];
										posVal='auto';
									if(!wrap.querySelector(selector + '_auto input').checked){
										posVal=(wrap.querySelector(selector).value.trim() + wrap.querySelector(selector + '_unit').value.trim());
									}
								}
                                self.setLiveStyle(pos[i], posVal, data.selector);
                            }
                        } else if (prop === 'display') {
                            if ('none' === val) {
                                return false;
                            } else if ('inline-block' === val) {
                                self.setLiveStyle('width', 'auto', data.selector);
                            } else {
                                self.setLiveStyle('width', '100%', data.selector);
                            }
                        } else if (prop === 'vertical-align') {
                            if ('' !== val) {
                                let flexVal;
                                if ('top' === val) {
                                    flexVal = 'flex-start';
                                } else if ('middle' === val) {
                                    flexVal = 'center';
                                } else {
                                    flexVal = 'flex-end';
                                }
                                self.setLiveStyle('align-self', flexVal, data.selector);
                            }
                        }
                    } else if (type === 'gallery' && self.type !== 'module') {
                        self.bindBackgroundSlider(data);
                        return;
                    } else if (is_radio === true) {
                        id = this.closest('.tb_lb_option').id;
                        if (this.checked === false) {
                            val = '';
                        }
                        if (type === 'imageGradient' || data.is_background === true) {
                            self.bindBackgroundTypeRadio(val);
                            return;
                        } else if (data.is_overlay === true) {
                            if (self.type !== 'module') {
                                self.overlayType(val);
                            }
                            return;
                        }
                    } else if (type === 'color' || type === 'gradient') {
                        if (type === 'gradient') {
                            id = this.dataset['id'];
                        }

                        if (data.is_overlay === true) {
                            if (self.type !== 'module') {
                                self.addOrRemoveComponentOverlay(type, id, val);
                            }
                            return;
                        }
                        if (type === 'color') {
                            let image = null;
                            //for modules
                            if (self.type === 'module' && data.colorId !== undefined && data.origId !== undefined) {
                                image = topWindow.document.getElementById(data.origId);
                                if (image !== null && image.closest('.tb_input').querySelector('input:checked').value !== 'image') {
                                    image = null;
                                }
                            }//for rows/column
                            else if (self.type !== 'module' && self.styleTabId === 'h') {
                                image = self.styleTab.getElementsByClassName('tb_uploader_input')[0];
                            }
                            if (image && image.value.trim() === '') {
                                self.setLiveStyle('background-image', (val !== '' ? 'none' : ''), data.selector);
                            }
                        }

                    } else if (type === 'image' || type === 'video') {
                        if (type === 'video') {
                            if (val.length > 0) {
                                if (self.type !== 'module') {
                                    self.$liveStyledElmt.data('tbfullwidthvideo', val).attr('data-tbfullwidthvideo', val);
                                    if (_.isEmpty(self.$liveStyledElmt.data('mutevideo')) && self.$context.find('#background_video_options_mute').is(':checked')) {
                                        self.$liveStyledElmt.data('mutevideo', 'mute');
                                    }
                                    ThemifyBuilderModuleJs.fullwidthVideo(self.$liveStyledElmt);
                                }
                            } else {
                                self.removeBgVideo();
                            }
                            return false;
                        } else {
                            if (val) {
                                val = 'url(' + val + ')';
                            } else {
                                val = '';
                                if (data.colorId !== undefined && self.styleTabId === 'h') {
                                    const color = topWindow.document.getElementById(data.colorId);
                                    if (color !== null && color.value.trim() !== '') {
                                        val = 'none';
                                    }
                                }
                            }
                            const group = self.styleTab.getElementsByClassName('tb_image_options');
                            for (let i = group.length - 1; i > -1; --i) {
                                let opt = group[i].getElementsByClassName('tb_lb_option');
                                for (let j = opt.length - 1; j > -1; --j) {
                                    Themify.triggerEvent(opt[j], 'change');

                                }
                            }
                        }
                    } else if (type === 'position_box') {
                        self.position(val, id);
                        return;
                    } else if (type === 'checkbox') {
                        if (this.closest('#background_video_options') !== null) {
                            self.videoOptions(this, val);
                            return;
                        } else if (('height' === prop && id.indexOf('_auto_height') !== -1) || ('width' === prop && id.indexOf('_auto_width') !== -1)) {
                            const mainID = 'height' === prop ? data.heightID : data.widthID;
                            if (this.checked) {
                                self.setData(mainID, prop, 'auto');
                            } else {
                                const mainValue = self.styleTab.querySelector('#' + mainID).value.trim();
                                if (mainValue !== '') {
                                    self.setData(mainID, prop, mainValue + $(self.styleTab).find('#' + mainID + '_unit').val());
                                } else {
                                    self.setData(mainID, prop, '');
                                }
                            }
                            return;
                        } else if (true === data.is_position) {
                            const selector = '#' + data.posId,
                                    wrap = this.closest('.tb_input');
                            if (this.checked) {
                                val = 'auto';
                            } else {
                                val = wrap.querySelector(selector).value.trim();
                                val = '' !== val && !isNaN(val) ? val + wrap.querySelector(selector + '_unit').value : '';
                            }
                            self.setLiveStyle(data.prop, val, data.selector);
                            return;
                        }else if('background-image' === prop){
                            if (!this.checked) {
                                val = false;
                        }
                            self.setLiveStyle(data.prop, val, data.selector);
                            return;
                    }
                    }
                    self.setData(id, '', val);
                }, {passive: true});
            })();
        };

        ThemifyLiveStyling.prototype.getValue = function (id) {
            return this.module_rules[id] !== undefined ? this.module_rules[id] : false;

        };

        ThemifyLiveStyling.prototype.bindTabsSwitch = function (off) {
            const self = this;
            if (off === true) {
                Themify.body.off('themify_builder_tabsactive.hoverTabs');
                return;
            }

            Themify.body.on('themify_builder_tabsactive.hoverTabs', function (e, id, container) {
                if (ThemifyConstructor.clicked === 'styling') {
                    let hover_items;
                    if (id.split('_').pop() !== 'h') {
                        self.$liveStyledElmt[0].classList.remove('tb_visual_hover');
                        hover_items = self.$liveStyledElmt[0].getElementsByClassName('tb_visual_hover');
                        for (let i = hover_items.length - 1; i > -1; --i) {
                            hover_items[i].classList.remove('tb_visual_hover');
                        }
                    } else {
                        if (self.type !== 'module') {
                            let radio = container.previousElementSibling.getElementsByClassName('background_type')[0];
                            if (radio) {
                                radio = radio.querySelector('input:checked').value;
                                if (radio === 'image' || radio === 'gradient') {
                                    container.classList.remove('tb_disable_hover');
                                } else {
                                    container.classList.add('tb_disable_hover');
                                }
                            }
                        }
                        setTimeout(function () {
                            hover_items = container.getElementsByClassName('tb_lb_option');
                            let selectors = [];
                            for (let i = hover_items.length - 1; i > -1; --i) {
                                let elId = hover_items[i].id,
                                        is_gradient = hover_items[i].classList.contains('themify-gradient');
                                if (is_gradient === true) {
                                    elId = hover_items[i].dataset['id'];
                                }
                                if (self.module_rules[elId] !== undefined && (is_gradient || hover_items[i].offsetParent !== null)) {
                                    if (self.module_rules[elId]['is_overlay'] !== undefined) {
                                        self.$liveStyledElmt[0].classList.add('tb_visual_hover');
                                    }
                                    let select = Array.isArray(self.module_rules[elId].selector) ? self.module_rules[elId].selector : [self.module_rules[elId].selector];
                                    for (let j = select.length - 1; j > -1; --j) {
                                        let k = select[j].split(':hover')[0];
                                        selectors[k] = 1;
                                    }
                                }
                            }
                            selectors = Object.keys(selectors);
                            if (selectors.length > 0) {
                                for (let i = selectors.length - 1; i > -1; --i) {
                                    hover_items = document.querySelectorAll(self.prefix + selectors[i]);
                                    for (let j = hover_items.length - 1; j > -1; --j) {
                                        hover_items[j].classList.add('tb_visual_hover');
                                    }
                                }
                            }

                        }, 10);

                    }
                }
            });
        };


        /**
         * Returns component's background cover element wrapped in jQuery.
         */
        ThemifyLiveStyling.prototype.getComponentBgOverlay = function (type) {
			if(!type){
				type=this.type;
			}
			const selector = type === 'subrow' ? '> .module_subrow > .builder_row_cover' : '> .builder_row_cover';
            return this.$liveStyledElmt.find( selector );
        };

        /**
         * Returns component's background slider element wrapped in jQuery.
         */
        ThemifyLiveStyling.prototype.getComponentBgSlider = function () {
            const type = this.type === 'colum' && api.activeModel.get('component_name') === 'sub-column' ? 'sub-col' : (this.type === 'colum' ? 'col' : this.type);
            return this.$liveStyledElmt.children('.' + type + '-slider');
        };

        /**
         * Removes background slider if there is any in $component.
         */
        ThemifyLiveStyling.prototype.removeBgSlider = function () {
            this.getComponentBgSlider().add(this.$liveStyledElmt.children('.tb_backstretch')).remove();
            this.$liveStyledElmt.css({
                'position': '',
                'background': '',
                'z-index': ''
            });
        };




        /**
         * Removes background video if there is any in $component.
         */
        ThemifyLiveStyling.prototype.removeBgVideo = function () {
            this.$liveStyledElmt.removeAttr('data-tbfullwidthvideo').data('tbfullwidthvideo', '').children('.big-video-wrap').remove();
        };



    function verticalResponsiveBars() {
        const items = topWindow.document.getElementsByClassName('tb_middle_bar'),
				ev = api.Utils.getMouseEvents(),
                resizeBarMousedownHandler = function (e) {
					if(e.type==='touchstart' || e.which === 1){
						e.stopPropagation();
						let start_x = e.clientX,
							bar = this.id === 'tb_right_bar' ? 'right' : 'left',
							breakpoints = tbLocalScript.breakpoints,
							max_width = api.toolbar.$el.width(),
							start_with = api.iframe.css('transition', 'none').width(),
							tooltip = topWindow.document.getElementsByClassName('tb_vertical_change_tooltip')[0],
							vertical_bars = topWindow.document.getElementsByClassName('tb_vertical_bars')[0],
							cover = document.createElement('div');
						cover.className = 'tb_mousemove_cover';
						if (tooltip) {
							tooltip.parentNode.removeChild(tooltip);
						}
						tooltip = document.createElement('div');
						tooltip.className = 'tb_vertical_change_tooltip';
						this.appendChild(tooltip);
						vertical_bars.appendChild(cover);
						vertical_bars.className += ' tb_resizing_start';
						api.iframe[0].classList.add('tb_resizing_start');
						const _move = function (e) {
							e.stopPropagation();
							let diff = e.clientX - start_x;
							diff *= 2;
							if (bar === 'left') {
								diff = -diff;
							}
							let min_width = 320,
									breakpoint,
									w = (start_with + diff) < min_width ? min_width : (start_with + diff);

							if (w <= breakpoints.mobile)
								breakpoint = 'mobile';
							else if (w <= breakpoints.tablet[1])
								breakpoint = 'tablet';
							else if (w <= breakpoints.tablet_landscape[1])
								breakpoint = 'tablet_landscape';
							else {
								breakpoint = 'desktop';
								if (w > (max_width - 17)) {
									w = max_width;
								}
							}
							tooltip.textContent = w + 'px';
							api.iframe.css('width', w);
							if (api.activeBreakPoint !== breakpoint) {
								ThemifyConstructor.lightboxSwitch(breakpoint);
							}
						};

						cover.addEventListener(ev['mouseup'], function(e) {
							e.stopPropagation();
							this.removeEventListener(ev['mousemove'], _move, {passive: true});

							this.parentNode.removeChild(this);
							tooltip.parentNode.removeChild(tooltip);

							api.iframe.css('transition', '');
							vertical_bars.classList.remove('tb_resizing_start');
							api.iframe[0].classList.remove('tb_resizing_start');
							document.body.classList.remove('tb_start_animate','tb_start_change_mode');
							api.Utils._onResize(true);
							cover=vertical_bars=tooltip=start_with=breakpoints=bar=start_x=max_width=null;

						}, {once: true, passive: true});
						cover.addEventListener(ev['mousemove'], _move, {passive: true});
						document.body.classList.add('tb_start_animate','tb_start_change_mode');
					}
                };

        for (let i = items.length - 1; i > -1; --i) {
            items[i].addEventListener(ev['mousedown'], resizeBarMousedownHandler, {passive: true});
        }
    }

    api.EdgeDrag = {
        undoData:{},
        _onDrag: null,
        init() {
			const ev=api.Utils.getMouseEvents();
            if (null === this._onDrag) {
                this._onDrag = api.EdgeDrag.drag.bind(this);
            }
            if (!localStorage.getItem('tb_disable_padding_dragging')) {
                api.Instances.Builder[api.builderIndex].el.addEventListener(ev['mousedown'], this._onDrag,{passive:true});
                Themify.body[0].classList.remove('tb_disable_padding_dragging');
            } else {
                Themify.body[0].classList.add('tb_disable_padding_dragging');
                api.Instances.Builder[api.builderIndex].el.removeEventListener(ev['mousedown'], this._onDrag,{passive:true});
                api.toolbar.el.getElementsByClassName('tb_padding_dragging_mode')[0].checked = false;
            }
        },
        addEdgesOptions(item) {
            const el = item.closest('.tb_dragger');
            if (!el.getElementsByClassName('tb_dragger_lightbox')[0]) {
                const type = el.classList.contains('tb_dragger_margin') ? 'margin' : 'padding',
					model = api.Models.Registry.lookup(el.closest('[data-cid]').getAttribute('data-cid')),
					elType = model.get('elType'),
					hide_apply_all = type === 'margin' && (elType === 'column' || elType === 'row'),
					units = ['%','em','px'],
					applyTypes = hide_apply_all?['opposite']:['all','opposite'],
					dir = el.classList.contains('tb_dragger_top') || el.classList.contains('tb_dragger_bottom') ? 's' : 'e',
					id=hide_apply_all?'margin-top_opp_top':'checkbox_#id#_apply_all',
					isAllChecked=this.getCurrentStyling(id,model,type)==='1',
					u = el.dataset['u'] || 'px',
					wrap = document.createElement('div'),
					apply = document.createElement('ul'),
					ul = document.createElement('ul');
				wrap.className = 'tb_dragger_lightbox';
				ul.className = 'tb_dragger_units';
				apply.className = 'tb_dragger_types';
				for (let j = units.length-1; j>-1; --j) {
					let li = document.createElement('li');
					li.textContent = units[j];
					if (units[j] === u) {
						li.className = 'current';
					}
					ul.appendChild(li);
				}
				for (let j = applyTypes.length-1; j>-1;--j) {
					let li = document.createElement('li'),
							span = document.createElement('span'),
							isChecked = false;
					li.className = 'tb_apply tb_apply_'+applyTypes[j];
					if (!hide_apply_all && applyTypes[j] === 'opposite') {
						if (!isAllChecked) {
							let checkId='#id#_opp_';
							checkId+= dir === 's' ?'top' : 'left';
							isChecked = this.getCurrentStyling(checkId,model,type)=='1';
						}
					} 
					else {
						isChecked = isAllChecked;
					}
					if (isChecked) {
						li.className += ' current';
					}
					li.appendChild(span);
					apply.appendChild(li);
				}
				wrap.appendChild(ul);
				wrap.appendChild(apply);
				el.getElementsByClassName('tb_dragger_options')[0].appendChild(wrap);
			}
        },
        clearEdges() {
         
        },
        addEdges(slug, model, el) {
            if (slug === 'divider' || (slug==='row' && el.classList.contains('tb-page-break'))) {
                return;
            }
            const types = ['padding', 'margin'],
				edge = ['right', 'bottom','left','top'],
				elType=model.get('elType'),
				items=[],
				len = edge.length;
            for (let i=types.length-1;i>-1;--i) {
				
                let f = document.createDocumentFragment(),
					type = types[i],
					childs=elType==='module' && type==='padding'?el.getElementsByClassName('module')[0]:el,
					len2,
					hide_apply_all=(type === 'margin' && (slug === 'column' || slug === 'row')),
					v,
					u;
				if(elType==='subrow' && type==='padding'){
					childs=el.getElementsByClassName('module_subrow')[0];
				}
				if(childs){
					childs=childs.children;
					len2=childs.length-1;
				}
				if(hide_apply_all){
					if(this.getCurrentStyling('margin-top_opp_top',model,type)=='1'){
						v = this.getCurrentStyling('margin-top',model,type),
						u = this.getCurrentStyling('margin-top_unit',model,type) || 'px';
					}
				}
                else if (this.getCurrentStyling('checkbox_#id#_apply_all',model,type)=='1') {
                    v = this.getCurrentStyling('#id#_top',model,type),
					u = this.getCurrentStyling('#id#_top_unit',model,type) || 'px';
                }
                for (let j = len - 1; j > -1; --j) {
                    if (type === 'margin' && (slug === 'column' || slug === 'row') && (edge[j] === 'right' || edge[j] === 'left')) {
                        continue;
                    }
					
					let ed,
						unit,
						u2=u,
						v2=v;
					if(childs){
						for(let k=len2;k>-1;--k){
							if(childs[k] && childs[k].classList.contains('tb_dragger_' + edge[j]) && childs[k].classList.contains('tb_dragger_' + type)){
								ed=childs[k];
								break;
							}
						}
					}
					if(!ed){
						ed = document.createElement('div');
						unit = document.createElement('span');
						ed.className = 'tb_dragger tb_dragger_' + edge[j] + ' tb_dragger_' + type;
						unit.className = 'tb_dragger_value';
						let edgeOptions = document.createElement('div'),
                            arrow = document.createElement('span');
							arrow.className = 'tb_dragger_arrow';
							edgeOptions.className = 'tb_dragger_options';
							edgeOptions.tabIndex=-1;
						edgeOptions.appendChild(unit);
						edgeOptions.appendChild(arrow);
						ed.appendChild(edgeOptions);
						f.appendChild(ed);
					}
					else{
						unit=ed.getElementsByClassName('tb_dragger_value')[0];
					}
                    if (!u2) {
						let id = hide_apply_all?'#id#-' + edge[j]:'#id#_' + edge[j];
                        v2 = this.getCurrentStyling(id,model,type),
						u2 = this.getCurrentStyling(id+'_unit',model,type) || 'px';
                    }
					if (v2 !== undefined && v2 !== null && v2!=='') {
						let old_u= ed.dataset['u'] || 'px';
						if(old_u!==u2 || ed.dataset['v']!==v2){
							ed.dataset['u']=u2;
							ed.dataset['v']=v2;
							unit.textContent = v2 + u2;
							if (type!=='padding') {
								items.push(ed);
							}
						}
					}
                }
				if(type==='margin' || (elType!=='module' && elType!=='subrow')){
					el.appendChild(f);
				}
				else{
					const sel=elType==='subrow'?'module_subrow':'module',
					m=el.getElementsByClassName(sel)[0];
					if(m){
						m.appendChild(f);
					}
				}
				if (type!=='padding') {
					for(let i=items.length-1;i>-1;--i){
						this.setValueByType(items[i],slug,items[i].dataset['v'],items[i].dataset['u']);
					}
				}
				if(elType!=='row'){
					let next=elType==='module' || elType==='subrow'?'column':(el.classList.contains('sub_column')?'subrow':'row'),
						nextItem=el.closest('.module_'+next);
					if(next==='subrow'){
						nextItem=nextItem.parentNode;
					}
					this.addEdges(next,api.Models.Registry.lookup(nextItem.dataset['cid']), nextItem);
				}
            }
        },
        optionsClick(e) {
            e.preventDefault();
            e.stopPropagation();
            api.ActionBar.disable = true;
            this.addEdgesOptions(e.target.closest('.tb_dragger_options'));
            const target = e.target.nodeName === 'LI' ? e.target : e.target.parentNode;
            if (target.nodeName === 'LI') {
                if (!target.classList.contains('current') && target.parentNode.classList.contains('tb_dragger_units')) {
                    this.changeUnit(target);
                } else if (target.parentNode.classList.contains('tb_dragger_types')) {
                    this.changeApply(target);
                }
            }
            api.ActionBar.disable = null;
        },
        changeUnit(el) {
            const lightbox = el.closest('.tb_dragger_lightbox'),
				edge = lightbox.closest('.tb_dragger'),
				baseProp = edge.classList.contains('tb_dragger_padding') ? 'padding' : 'margin',
				dir = edge.classList.contains('tb_dragger_top') || edge.classList.contains('tb_dragger_bottom') ? 's' : 'e',
				u = el.textContent || 'px',
				v = edge.dataset['v'],
				prevValue=edge.dataset['u'] || 'px',
				baseEl = edge.parentNode,
				currentSheet=ThemifyStyles.getSheet(api.activeBreakPoint),
				cssRules=currentSheet.cssRules;
				
			let apply = edge.getElementsByClassName('tb_dragger_types')[0],
				items = baseEl.children,
				item=baseEl.closest('[data-cid]'),
				index,
				res = v !== '' ? this.convert(edge, prevValue, u, v) : '',
				model = api.Models.Registry.lookup(item.getAttribute('data-cid')),
				elType = model.get('elType'),
				before = Common.clone(item),
				before_settings = $.extend(true, {}, model.get(elType === 'module' ? 'mod_settings' : 'styling'));
			if(apply){
				apply=apply.getElementsByClassName('current')[0];
				if(apply){
					apply=apply.classList.contains('tb_apply_all') ? 'all' : 'opposite';
				}
			}
            if (elType === 'module') {
                elType = model.get('mod_name');
            }
			const selector=ThemifyStyles.getBaseSelector(elType, model.get('element_id'));
			index = findIndex(cssRules, selector);
            document.body.classList.add('tb_edge_drag_start');
         
            for (let i = items.length - 1; i > -1; --i) {
				let cl=items[i].classList;
                if (cl.contains('tb_dragger_' + baseProp)) {
					let itemDir='left';
					if(cl.contains('tb_dragger_bottom')){
						itemDir='bottom';
					}
					else if(cl.contains('tb_dragger_right')){
						itemDir='right';
					}
					else if(cl.contains('tb_dragger_top')){
						itemDir='top';
					}
					if (items[i] !== edge && (!apply || (apply === 'opposite' && ((dir === 's' && (itemDir==='left' || itemDir==='right')) || (dir === 'e' && (itemDir==='top' || itemDir==='bottom')))))){
						continue;
					}
                    let units = items[i].getElementsByClassName('tb_dragger_units')[0],
						prop=baseProp+'-'+itemDir,
						prevStyle='',
						value=res+u,
						id=(baseProp === 'margin' && (elType === 'column' || elType === 'row'))?('#id#-' + itemDir):('#id#_' + itemDir);
					if (index === false || !cssRules[index]) {
						index = cssRules.length;
						currentSheet.insertRule(selector + '{' + prop + ':' + value + ';}', index);
					} else {
						prevStyle=cssRules[index].style[renameProp(prop)];
						cssRules[index].style[renameProp(prop)] = value;
					}
					if(units){
						units=units.children;
						for (let j = units.length - 1; j > -1; --j) {
						   units[j].classList.toggle('current',units[j].textContent === u);
						}
					}
					if(u!=='em' && res!==''){
						res=Math.round(res);
					}
					if (baseProp!=='padding') {
						this.setValueByType(items[i],elType,res,u);
					}
                    items[i].getElementsByClassName('tb_dragger_value')[0].textContent = res === '' ? '' : value;
					items[i].dataset['v']=res;
					items[i].dataset['u']=u;
					cl.add('tb_dragger_dragged');
					this.setData(model, this.getFieldId(id,model,baseProp), res, u);
					this.setUndoData(index,prop,value,prevStyle);
                }
            }
            const _this = this;
            setTimeout(function () {
                for (let i = items.length - 1; i > -1; --i) {
                    items[i].classList.remove('tb_dragger_dragged');
                }
                document.body.classList.remove('tb_edge_drag_start');
				if(u!==prevValue){
					_this.addUndo(before, before_settings);
				}
				before=before_settings=items=null;
            }, 500);
        },
        changeApply(el) {
            const edge = el.closest('.tb_dragger'),
				base = edge.parentNode,
				type = edge.classList.contains('tb_dragger_padding') ? 'padding' : 'margin',
				dir = edge.classList.contains('tb_dragger_top') || edge.classList.contains('tb_dragger_bottom') ? 's' : 'e',
				item=base.closest('[data-cid]'),
				model = api.Models.Registry.lookup(item.getAttribute('data-cid')),
				elType=model.get('elType'),
				before = Common.clone(item),
				before_settings = $.extend(true, {}, model.get(elType === 'module' ? 'mod_settings' : 'styling')),
				remove = el.classList.contains('current')?'':'1',
				next=el.nextSibling?el.nextElementSibling:el.previousElementSibling;
				
				let id1='margin-top_opp_top',
					id2;
				if(!(type === 'margin' && (elType === 'column' || elType === 'row'))){
					id2='checkbox_#id#_apply_all';
					id1='#id#_opp_';
					id1+= dir === 's' ?'top' : 'left';
					if( el.classList.contains('tb_apply_all') ){
						const tmp=id1;
						id1=id2;
						id2=tmp;
					}
				}
			
				if(next){
					next.classList.remove('current');
				}
				el.classList.toggle('current',remove);
				this.setData(model, this.getFieldId(id1,model,type), remove);
				if(id2){
					this.setData(model, this.getFieldId(id2,model,type),'');
				}
				this.changeUnit(edge.getElementsByClassName('tb_dragger_units')[0].getElementsByClassName('current')[0]);
				this.onChange();
				this.addUndo(before, before_settings);
        },
		convert(el, prevU, u, v) {
			if (!v) {
				return 0;
			}
			if(!prevU){
				prevU='px';
			}
			if(!u){
				u='px';
			}
			if (prevU === u) {
				return v;
			}
			let res,
				p = el.parentNode;
			if(p.classList.contains('active_module')){
				const sel=p.classList.contains('active_subrow')?'module_subrow':'module';
				p=p.getElementsByClassName(sel)[0];
			}
			const emSize = u === 'em' || prevU === 'em' ? parseFloat(getComputedStyle(p).fontSize) : null,
				pWidth = u === '%' || prevU === '%' ? p.parentNode.offsetWidth : null;
			if (prevU === 'px') {
				if (u === 'em') {
					res = +(parseFloat(v / emSize)).toFixed(2);
				} else if (u === '%') {
					res = parseFloat((v * 100) / pWidth);
				}
			} else if (prevU === '%') {
				res = parseFloat((v * pWidth) / 100);
				res = u === 'em' ? (+(parseFloat(res / emSize)).toFixed(2)) : parseFloat(res);
			} else {
				res = parseFloat(v * emSize);
				if (u === '%') {
					res = parseFloat((res * 100) / pWidth);
				}
				res = parseFloat(res);
			}
			return Number(res.toFixed(2));
		},
        setValueByType(el,slug,v,u) {
            let prop ='margin';
			if(!u){
				u='px';
			}
			const cl=el.classList;
			for(let i=cl.length-1;i>-1;--i){
				if(cl[i]==='tb_dragger_top' || cl[i]==='tb_dragger_bottom' || cl[i]==='tb_dragger_left' || cl[i]==='tb_dragger_right'){
					prop+='-'+cl[i].replace('tb_dragger_','');
					break;
				}
			}
			if (u !== 'px' && v!=='') {
				v=this.convert(el,u,'px',v);
                u = 'px';
            }
			if(v===undefined || v===null){
				v='';
			} 
			const p = prop==='margin-top' || prop==='margin-bottom'? 'height' : 'width';
			el.style[p] = v===''?'':	((v > 0 ? v : (-v)) + u);
			if(slug==='row' || slug==='column'){
				el.style[prop]= v===''?'':((-v)+u);
			}
        },
		getFieldId(id,model,type){
			const slug=model.get('elType'),
			options=ThemifyStyles.getStyleOptions((slug === 'module' ? model.get('mod_name') : slug));
			if(!(type==='margin' && (slug==='row' || slug==='column')) && (options[type+'_top']===undefined || options[type+'_top'].type!==type)){//the id in general tab can be padding or p, margin or m
				type=type[0];
			}
			return id.replace('#id#',type);
		},
        getCurrentStyling(id,model,type) {
			const slug=model.get('elType'),
				st = slug === 'row' || slug === 'column' || slug === 'subrow' ? model.get('styling') : model.get('mod_settings');
			id=this.getFieldId(id,model,type);
			if (api.activeModel !== null && api.activeModel.cid === model.cid) {
                let field = Common.Lightbox.$lightbox[0].querySelector('#' + id);
                if (field !== null) {
                    if (field.classList.contains('themify-checkbox')) {
                        field = field.getElementsByClassName('tb-checkbox')[0];
                        if (field) {
                            return field.checked? field.value : false;
                        }
                    } 
					else {
                       return field.value;
                    }
                }
            }
			if(api.activeBreakPoint ==='desktop'){
				return st[id];
			}
			const bp = ThemifyConstructor.breakpointsReverse,
				index = bp.indexOf(api.activeBreakPoint);
			for (let i = index, len = bp.length; i < len; ++i) {
				 if (bp[i] !== 'desktop') {
					if (st['breakpoint_' + bp[i]] !== undefined && st['breakpoint_' + bp[i]][id] !== undefined && st['breakpoint_' + bp[i]][id] !== '') {
						return st['breakpoint_' + bp[i]][id];
					}
				}
				else if (st[id] !== '') {
					return st[id];
				}
			}
			return undefined;
        },
        setData(model, id, v, u) {
			if(v && u && u!=='em'){
				v=Number(v);
			}
            if (api.activeModel !== null && model.cid === api.activeModel.cid) {
                let field = Common.Lightbox.$lightbox[0].querySelector('#' + id);
                if (field !== null) {
                    if (field.classList.contains('themify-checkbox')) {
                        field = field.getElementsByClassName('tb-checkbox')[0];
                        if (field) {
                            field.checked = !!v;
                        }
                    } else {
                        field.value = v;
                        field = Common.Lightbox.$lightbox[0].querySelector('#' + id + '_unit');
                        if (field) {
                            field.value = u;
                        }
                    }
					if (field) {
						Themify.triggerEvent(field, 'change');
					}
					return;
                }
				else{
					if (api.activeBreakPoint === 'desktop'){
						ThemifyConstructor.values[id] = v;
						if(u){
							ThemifyConstructor.values[id + '_unit'] = u;
						}
					}
					else{
						if (!ThemifyConstructor.values['breakpoint_' + api.activeBreakPoint]) {
							ThemifyConstructor.values['breakpoint_' + api.activeBreakPoint] = {};
						}
						ThemifyConstructor.values['breakpoint_' + api.activeBreakPoint][id] = v;
						if(u){
							ThemifyConstructor.values['breakpoint_' + api.activeBreakPoint][id + '_unit'] = u;
						}
					}
				}
            }
            const k = model.get('elType') === 'module' ? 'mod_settings' : 'styling',
				st = $.extend(true, {}, model.get(k)),
				data = {};
            if (api.activeBreakPoint !== 'desktop') {
                if (!st['breakpoint_' + api.activeBreakPoint]) {
                    st['breakpoint_' + api.activeBreakPoint] = {};
                }
                st['breakpoint_' + api.activeBreakPoint][id] = v;
                if (u) {
                    st['breakpoint_' + api.activeBreakPoint][id + '_unit'] = u;
                }
            } else {
				if(!v){
					delete st[id];
				}
				else{
					st[id] = v;
				}
                if (u) {
					if(u==='px'){
						delete st[id + '_unit'];
					}
					else{
						st[id + '_unit'] = u;
					}
                }
            }
            data[k] = st;
            model.set(data, {silent: true});
        },
        onChange() {
            setTimeout(function () {
                api.Utils._onResize(true);
            }, 1500);
        },
		setUndoData(index,prop,val,prevVal){
			if(this.undoData[api.activeBreakPoint]===undefined){
				this.undoData[api.activeBreakPoint]={};
			}
            if (this.undoData[api.activeBreakPoint][index] === undefined) {
                this.undoData[api.activeBreakPoint][index] = {};
            }
			prop=renameProp(prop);
			const data=this.undoData[api.activeBreakPoint][index];
			if(data[prop]===undefined){
				data[prop]={};
			}
			data[prop]['a'] = val;
			if(data[prop]['b']===undefined){
				data[prop]['b'] =prevVal;
			}
		},
        addUndo(before, before_settings) {
            const cid = before[0].getAttribute('data-cid');
			if (api.activeModel === null || api.activeModel.cid !== cid) {
				const m = api.Models.Registry.lookup(cid),
					isChanged = api.hasChanged === true,
					styles = $.extend(true, {}, this.undoData),
					after_settings = $.extend(true, {}, m.get('elType') === 'module' ? m.get('mod_settings') : m.get('styling')),
					after = Common.clone(document.getElementsByClassName('tb_element_cid_' + cid)[0]);
				before[0].classList.remove('tb_element_clicked');
				after[0].classList.remove('tb_element_clicked');
				api.hasChanged = true;
				api.undoManager.push(cid, before, after, 'save', {bsettings: before_settings, asettings: after_settings, styles: styles, 'column': false});
				api.hasChanged = isChanged;
			}
			this.undoData={};
        },
        setModulePosition(dragger) {
            const expand = api.ActionBar.prevExpand;
            if (expand) {
                const dragVal = dragger.getElementsByClassName('tb_dragger_value')[0];
                expand.style['top'] = '';
                if (dragVal && dragVal.firstChild) {
                    const drOffset = dragVal.getBoundingClientRect(),
                            expandOffset = expand.getBoundingClientRect();
                    if (expandOffset.bottom >= drOffset.top) {
                        expand.style['top'] = (dragger.offsetHeight / 2) + drOffset.height + 'px';
                    }
                }
            }
        },
        drag(e) {
            if (e.type==='touchstart' || e.which === 1) {
				if(e.target.closest('.tb_dragger_options')){
					const ev=api.Utils.getMouseEvents(),
					self = this,
					t=e.target;
					document.addEventListener(ev['mouseup'], function (e) {
						if(t===e.target){
							if(e.target.classList.contains('tb_dragger_arrow')){
								if (api.ActionBar.isHoverMode !== true) {
									api.ActionBar.el.classList.remove('tb_show_toolbar');
								}
								this.body.classList.add('tb_dragger_options_open');
								let dragger = t.closest('.tb_dragger');
								const _blur = function (e) {
									if (e.type === 'mouseout' || !e.target.closest('.tb_dragger_options')) {
										if (api.ActionBar.isHoverMode !== true) {
											api.ActionBar.el.classList.add('tb_show_toolbar');
										}
										document.removeEventListener('click', _blur,{passive:true});
										topWindow.document.removeEventListener('click', _blur,{passive:true});
										dragger.removeEventListener('mouseleave', _blur, {once: true,passive:true});
										if (dragger.classList.contains('tb_dragger_padding') && dragger.classList.contains('tb_dragger_top')) {
											self.setModulePosition(dragger);
										}
										document.body.classList.remove('tb_dragger_options_open');
										const lb=dragger.getElementsByClassName('tb_dragger_lightbox')[0];
										if(lb){
											lb.remove();
										}
										dragger = null;
									}
								};
								dragger.addEventListener('mouseleave', _blur, {once: true,passive:true});
								this.addEventListener('click', _blur,{passive:true});
								topWindow.document.addEventListener('click', _blur,{passive:true});
							}
							self.optionsClick(e);
						}
					}, {once: true});
					return;
				}
				if(!e.target.classList.contains('tb_dragger')){
					return;
				}
				e.stopImmediatePropagation();
                const el = e.target,
					self = this,
					ev=api.Utils.getMouseEvents(),
					baseEl = el.closest('[data-cid]'),
					model = api.Models.Registry.lookup(baseEl.getAttribute('data-cid'));
				
                if (model) {
                let items = [],
					module,
					timer,
					prevY = e.clientX,
					prevX = e.clientY,
					current,
					apply,
					before,
					isSame,
					before_settings,
					currentSheet,
					cssRules,
					selector='',
					index;
					
				const elType = model.get('elType'),
					componentName = elType === 'module' ? model.get('mod_name') : elType,
					baseProp = el.classList.contains('tb_dragger_padding') ? 'padding' : 'margin',
					dir = el.classList.contains('tb_dragger_top') || el.classList.contains('tb_dragger_bottom') ? 's' : 'e',
					type = dir === 's' ? (el.classList.contains('tb_dragger_top') ? 'top' : 'bottom') : (el.classList.contains('tb_dragger_left') ? 'left' : 'right'),
					u = el.dataset['u'] || 'px',
					getSpeed = function (x, y) {
						let k = u === 'px' || u === '%' ? 1 : .1,
							box = el.getBoundingClientRect(),
							diff = 0;
						if(dir === 'e'){
							diff = type === 'left'?(x - box.right):(box.left - x);
						} 
						else{
							diff = type === 'top'?(y - box.bottom):(box.top - y);
						}
						if((dir==='e' && box.width>40 && (x<box.left || x>box.right)) || (dir==='s'&& box.height>40 && (y<box.top || y>box.bottom))){
							if((u==='%' && current>65) || (u==='px' && current>51) || (u==='em' && current>1.5)){
								if(diff<0){
									diff*=-1;
								}
								if (diff > 50) {
									if (diff >100) {
										if (diff >300) {
											k *= 6;
										}
										else{
											k *= diff > 150?(diff > 200?5:4):3;
										}
										
									}
									else {
										k *= 2;
									}
								}
							}
						}
						return k;
					},
					_start=function(e){
						e.stopImmediatePropagation();
						document.body.classList.add('tb_start_animate','tb_edge_drag_start');
						topWindow.document.body.classList.add('tb_start_animate','tb_edge_drag_start');
						document.body.style['cursor']=$(el).css('cursor');
						api.ActionBar.hideContextMenu();
						api.ActionBar.clear();
						api.ActionBar.disable = true;
						const lb=el.getElementsByClassName('tb_dragger_lightbox')[0];
						if(lb){
							lb.remove();
						}
						self.addEdgesOptions(el);
						current = parseFloat(el.dataset['v']) || 0;
						current=u!=='em'?parseInt(current):Number(current.toFixed(2));
						apply = el.getElementsByClassName('tb_dragger_types')[0];
						if(apply){
							apply=apply.getElementsByClassName('current')[0];
							if(apply){
								apply=apply.classList.contains('tb_apply_all') ? 'all' : 'opposite';
							}
						}
						before = Common.clone(baseEl);
						before_settings = $.extend(true, {}, model.get(elType === 'module' ? 'mod_settings' : 'styling'));
						isSame=api.activeModel!==null && api.activeModel.cid===model.cid;
						selector=ThemifyStyles.getBaseSelector(componentName, model.get('element_id'));
						currentSheet=ThemifyStyles.getSheet(api.activeBreakPoint);
						cssRules=currentSheet.cssRules;
						index = findIndex(cssRules, selector);
						module=elType === 'module'?baseEl.getElementsByClassName('module')[0]:(elType==='subrow'?baseEl.getElementsByClassName('module_subrow')[0]:baseEl);
						baseEl.style['willChange']=baseProp;
						const tmp=el.parentNode.children;
						for(let i=tmp.length-1;i>-1;--i){
							let cl=tmp[i].classList;
							if(cl.contains('tb_dragger_'+baseProp)){
								let itemDir='left';
								if(cl.contains('tb_dragger_bottom')){
									itemDir='bottom';
								}
								else if(cl.contains('tb_dragger_right')){
									itemDir='right';
								}
								else if(cl.contains('tb_dragger_top')){
									itemDir='top';
								}
								if (type!==itemDir && (!apply || (apply === 'opposite' && ((dir === 's' && (itemDir==='left' || itemDir==='right')) || (dir === 'e' && (itemDir==='top' || itemDir==='bottom')))))){
									continue;
								}
								tmp[i].classList.add('tb_dragger_dragged');
								items.push({el:tmp[i],prop:(baseProp+'-'+itemDir),text:tmp[i].getElementsByClassName('tb_dragger_value')[0]});
							}
						}
						baseEl.classList.add('tb_element_clicked');
					},
					_move = function (e) {
						e.stopImmediatePropagation();
						if(timer){
							cancelAnimationFrame(timer);
						}
						timer=requestAnimationFrame(function(){
							const x = e.clientX,
								y = e.clientY,
								koef = getSpeed(x, y);
							if (dir === 'e') {
								if (x !== prevX) {
									if (x > prevX) {
										if (type === 'left') {
											current += koef;
										} else {
											current -= koef;
										}
									} 
									else {
										if (type === 'left') {
											current -= koef;
										} else {
											current += koef;
										}
									}
								}
							} 
							else if (y !== prevY) {
								if (y > prevY) {
									current += koef;
								} else {
									current -= koef;
								}
							}
							prevX = x;
							prevY = y;
							if (current < 0 && baseProp === 'padding') {
								current = 0;
							} 
							else if (current % 1 !== 0) {
								current = parseFloat(current.toFixed(1));
							}
							const v = current + u;
							for (let i = items.length - 1; i > -1; --i) {
								let prop = items[i].prop,
									item=items[i].el,
									text=items[i].text;
                                module.style[prop]=v;
								if(isSame===true){
                                    api.liveStylingInstance.setLiveStyle(prop,v,selector);
								}
								if (baseProp === 'margin') {
									let p = item.classList.contains('tb_dragger_top') || item.classList.contains('tb_dragger_bottom') ? 'height' : 'width',
										v2 = current,
										u2 = u;
									if (u2 !== 'px') {
										v2 = self.convert(item, u2, 'px', v2);
										u2 = 'px';
									}
									if(elType==='row' || elType==='column'){
										item.style[prop]= v===''?'':((-v2)+u2);
									}
									item.style[p] = current < 0 ? ((-v2) + u2) : (v2 + u2);
								}
								text.textContent = current === 0 ? '' : v;
							}
						});
					};
                    document.addEventListener(ev['mouseup'], function (e) {
							this.removeEventListener(ev['mousemove'], _start, {passive: true,once:true});
							this.removeEventListener(ev['mousemove'], _move, {passive: true});
							Themify.trigger('tbDisableInline');
							if(before){
								if(timer){
									cancelAnimationFrame(timer);
								}
								this.body.style['cursor']=baseEl.style['willChange']='';
								this.body.classList.remove('tb_start_animate','tb_edge_drag_start');
								topWindow.document.body.classList.remove('tb_start_animate','tb_edge_drag_start');
								Themify.trigger('tbresizeImageEditor');
								requestAnimationFrame(function(){
									baseEl.classList.remove('tb_element_clicked');
									for (let i = items.length - 1; i > -1; --i) {
										let item=items[i].el,
											prop=items[i].prop,
											v=module.style[prop],
											edge=prop.replace(baseProp+'-',''),
											prevVal='',
											id=(baseProp === 'margin' && (elType === 'column' || elType === 'row'))?('#id#-' + edge):('#id#_' + edge),
											lb=item.getElementsByClassName('tb_dragger_lightbox')[0];
										if (current === 0 && baseProp === 'margin') {
											item.style[renameProp(items[i].prop)]=item.style['width'] = item.style['height'] = '';
										}
										if(lb){
											lb.remove();
										}
										if (index === false || !cssRules[index]) {
											index = cssRules.length;
											currentSheet.insertRule(selector + '{' + prop + ':' + v + ';}', index);
										} else {
											prevVal=cssRules[index].style[renameProp(prop)];
											cssRules[index].style[renameProp(prop)] = v;
										}
										module.style[prop]='';
										
										if(isSame===false){
											self.setUndoData(index,prop,v,prevVal);
										}
										item.dataset['v']=current;
										item.dataset['u']=u;
										item.classList.remove('tb_dragger_dragged');
										self.setData(model, self.getFieldId(id,model,baseProp), current, u);
									}
									
									if (baseProp === 'padding' && type === 'top' && elType === 'module') {
										self.setModulePosition(items[0].el);
									}
									self.onChange();
									api.Utils.runJs($(baseEl),null,true);
									if(isSame===false){
										self.addUndo(before, before_settings);
									}
									api.ActionBar.disable=apply =module= api.ActionBar.hoverCid = timer=currentSheet=cssRules=index=selector=isSame=items=before=before_settings=current=prevY=prevX=null;
									api.hasChanged=true;
								});
							}
							
							
					}, {once: true, passive: true});
					document.addEventListener(ev['mousemove'], _start, {passive: true,once:true});
                    document.addEventListener(ev['mousemove'], _move, {passive: true});
                }
            }
        }
    };
    api.createStyleInstance = function () {
        return new ThemifyLiveStyling();
    };


}(jQuery, Themify, window, window.top, document, tb_app, ThemifyBuilderCommon));