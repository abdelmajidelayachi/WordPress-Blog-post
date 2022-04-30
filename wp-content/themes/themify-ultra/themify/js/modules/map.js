/**
 * map module
 */
;
var ThemifyGoogleMap,
    ThemifyBingMap;
((Themify,win,fwVars)=>{
    'use strict';
    let googleIsinit=null,
        bingIsinit=null,
        googleGeoCode=null,
        bingGeoCodeLoaded=null,
        googleCallback = function(items){
            if(googleGeoCode===null){
                googleGeoCode=new google.maps.Geocoder();
                const st=document.createElement('style');
                st.textContent='.gmnoprint{overflow-wrap:normal}.themify_builder_map_info_window{color:#000}';
                document.head.appendChild(st);
            }
            for(let i=items.length-1;i>-1;--i){
                let el=items[i];
                if ( el.classList.contains( 'tf_map_loaded' ) ) {
                        continue;
                }
                el.classList.add( 'tf_map_loaded' );
                Themify.requestIdleCallback(()=>{
                    let latlng = new google.maps.LatLng(-34.397, 150.644),
                        address = el.getAttribute('data-address'),
                        type = el.getAttribute('data-type'),
                        revGeocoding = el.getAttribute('data-reverse-geocoding'),
                        geolatlng=null,
                        geoParams,
                        mapOptions = {
                            zoom: parseInt(el.getAttribute('data-zoom')),
                            center: latlng,
                            mapTypeId: google.maps.MapTypeId.ROADMAP,
                            scrollwheel: el.getAttribute('data-scroll') === '1',
                            draggable: el.getAttribute('data-drag') === '1',
                            disableDefaultUI: el.getAttribute('data-control') === '1'
                        };
						if(Themify.isTouch && el.getAttribute('data-mdrag')!=='0'){
							mapOptions['draggable']=false;
						}
                    switch (type.toUpperCase()) {
                        case 'ROADMAP':
                            mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
                            break;
                        case 'SATELLITE':
                            mapOptions.mapTypeId = google.maps.MapTypeId.SATELLITE;
                            break;
                        case 'HYBRID':
                            mapOptions.mapTypeId = google.maps.MapTypeId.HYBRID;
                            break;
                        case 'TERRAIN':
                            mapOptions.mapTypeId = google.maps.MapTypeId.TERRAIN;
                            break;
                    }

                    let map = new google.maps.Map(el, mapOptions);
                    google.maps.event.addListenerOnce(map, 'idle', ()=>{
                        Themify.trigger('themify_map_loaded',[el,map]);
                    });

                    /* store a copy of the map object in the dom node, for future reference */
                    el.setAttribute('data-gmap_object', map);

                    if (revGeocoding && revGeocoding!=='false') {
                        let latlngStr = address.split(',', 2);
                            geolatlng = new google.maps.LatLng(parseFloat(latlngStr[0]), parseFloat(latlngStr[1]));
                            geoParams = {'latLng': geolatlng};
                    } else {
                        geoParams = {'address': address};
                    }
                    googleGeoCode.geocode(geoParams, (results, status)=> {
                        if (status == google.maps.GeocoderStatus.OK) {
                            const position = geolatlng!==null ? geolatlng : results[0].geometry.location,
                                marker = new google.maps.Marker({
                                map: map,
                                position: position
                            }),
                            info = el.getAttribute('data-info-window');
                            map.setCenter(position);
                            if (info) {
                                const contentString = '<div class="themify_builder_map_info_window">' + info + '</div>',
                                    infowindow = new google.maps.InfoWindow({
                                        content: contentString
                                    });

                                win['google'].maps.event.addListener(marker, 'click', ()=> {
                                    infowindow.open(map, marker);
                                });
                            }
                        }
                    });
                },  (i+1) * 1000);
            }
    },
    bingCallback=function(items){
        const callback = (items)=>{
            const geocodeQuery =  (manager,map,info,query)=>{
                    //Make the geocode request.
                    manager.geocode({
                        where: query,
                        count:1,
                        userData:{'map':map,'info':info},
                        callback(r,userdata) {
                            //Add the first result to the map and zoom into it.
                            if (r && r.results && r.results.length > 0) {
                                map=userdata['map'];
                                info=userdata['info'];
                                map.setView({
                                    center: r.results[0].bestView.center
                                });

                                const pushpin = new Microsoft.Maps.Pushpin(map.getCenter(), null);
                                if (info) {

                                    const infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
                                        description: info,
                                        visible: false});
                                    infobox.setMap(map);
                                    //Add a click event handler to the pushpin.
                                    win['Microsoft'].Maps.Events.addHandler(pushpin, 'click',  (e)=> {
                                        infobox.setOptions({visible: true});
                                    });

                                }
                                map.entities.push(pushpin);
                            }
                        }
                    });
            };
            for(let i=items.length-1;i>-1;--i){
                let el=items[i];
                Themify.requestIdleCallback(()=> {
                    const address = el.getAttribute('data-address').split(','),
                        type = el.getAttribute('data-type'),
                        info = el.getAttribute('data-info-window'),
                        mapArgs = {
                           disableBirdseye: true,
                           disableScrollWheelZoom: el.getAttribute('data-scroll') !== '1',
                           showDashboard: el.getAttribute('data-control') !== 1,
                           credentials: fwVars.bing_map_key,
                           disablePanning: el.getAttribute('data-drag') !== '1',
                           zoom: parseInt(el.getAttribute('data-zoom'))
                        };
                        switch (type) {
                            case 'aerial' :
                                mapArgs.mapTypeId = Microsoft.Maps.MapTypeId.aerial;
                                break;
                            case 'road' :
                                mapArgs.mapTypeId = Microsoft.Maps.MapTypeId.road;
                                break;
                            case 'streetside':
                                mapArgs.mapTypeId = Microsoft.Maps.MapTypeId.streetside;
                                break;
                            case 'canvasDark':
                                mapArgs.mapTypeId = Microsoft.Maps.MapTypeId.canvasDark;
                                break;
                            case 'canvasLight':
                                mapArgs.mapTypeId = Microsoft.Maps.MapTypeId.canvasLight;
                                break;
                            case 'birdseye' :
                                mapArgs.mapTypeId = Microsoft.Maps.MapTypeId.birdseye;
                                break;
                            case 'ordnanceSurvey':
                                mapArgs.mapTypeId = Microsoft.Maps.MapTypeId.ordnanceSurvey;
                                break;
                            case 'grayscale':
                                mapArgs.mapTypeId = Microsoft.Maps.MapTypeId.grayscale;
                                break;
                        }
                    let map = new Microsoft.Maps.Map(el, mapArgs);
                    geocodeQuery(new Microsoft.Maps.Search.SearchManager(map),map,info,address);

                },  (i+1) * 1000);
            }
        };
        if(bingGeoCodeLoaded===null){
            Microsoft.Maps.loadModule('Microsoft.Maps.Search', function (items) {
                bingGeoCodeLoaded=true;
                callback(items);
            }.bind(null,items));
        }
        else{
            callback(items);
        }
    };
    ThemifyGoogleMap=function(){
        googleIsinit=true;
        Themify.trigger('themify_google_map_loaded');
    };
    ThemifyBingMap=function(){
        bingIsinit=true;
        Themify.trigger('themify_bing_map_loaded');
    };
    Themify.on('tf_map_init',(items)=>{
        const google=[],
            bing=[];
        if(items instanceof jQuery){
            items=items.get();
        }
        for(let i=items.length-1;i>-1;--i){
            if(items[i].classList.contains('themify_bing_map')){
                bing.push(items[i]);
            }
            else{
                google.push(items[i]);
            }
        }
        items=null;
        if(google.length>0){
            if (googleIsinit===null && (!win['google'] || typeof win['google'].maps !== 'object')) {
                if (!fwVars.map_key) {
                    fwVars.map_key = '';
                }
                Themify.LoadAsync('//maps.googleapis.com/maps/api/js', ()=>{
                    if(googleIsinit===true){
                        googleCallback(google);
                    }
                    else{
                        Themify.on('themify_google_map_loaded',googleCallback.bind(null,google),true);
                    }
                }, 'v=3.exp&callback=ThemifyGoogleMap&key=' + fwVars.map_key, null, ()=> {
                    return  !!win['google'] && typeof win['google'].maps === 'object';
                });
            } else {
                googleIsinit=true;
                googleCallback(google);
            }
        }
        if (bing.length > 0) {
            if (!win['Microsoft'] || typeof win['Microsoft'].Maps !== 'object') {
                if(!fwVars.bing_map_key){
                    fwVars.bing_map_key='';
                }
                Themify.LoadAsync('//www.bing.com/api/maps/mapcontrol', ()=>{
                     if(bingIsinit===true){
                        bingCallback(bing);
                    }
                    else{
                        Themify.on('themify_bing_map_loaded',bingCallback.bind(null,bing),true);
                    }
                    
                }, '&callback=ThemifyBingMap&key=' + fwVars.bing_map_key, true, ()=> {
                    return !!win['Microsoft'] && typeof win['Microsoft'].Maps === 'object';
                });
            } else {
                bingCallback(bing);
            }
        }
    });

})(Themify,window,themify_vars);
