/**
 * Created by argos-sample.
 * User: jhershauer
 * Date: 5/22/11
 * Time: 11:05 PM
 * This sample view shows how to embed Google Maps in a view and set the text for the info window at the pin location.
 * This is just a customization example. If you want to embed Google Maps in your application, please make sure
 * you're meeting Google's license terms: http://code.google.com/apis/maps/terms.html
 *
 * ToDo: Resize map when browser window is re-sized or orientation changed.
 */
define('Mobile/Sample/Views/GoogleMap', [
    'dojo/_base/declare',
    'dojo/dom',
    'dojo/dom-geometry',
    'Mobile/SalesLogix/Format',
    'Sage/Platform/Mobile/View'
], function(
    declare,
    dom,
    domGeom,
    format,
    View
) {

    return dojo.declare('Mobile.Sample.Views.GoogleMap', [Sage.Platform.Mobile.View], {
        widgetTemplate: new Simplate([
            '<div id="{%= $.id %}" title="{%: $.titleText %}" class="panel {%= $.cls %}">',
                '<div id="mapcanvas" style="height:400px">',
                '</div>',
            '</div>'
        ]),
        id: 'googlemapview',
        expose: false,
        titleText: 'Map',
        init: function() {
            this.inherited(arguments);
            this.gcCallbackDel = this.geocodeCallback.bindDelegate(this);
            this.iwCallbackDel = this.infoWindowCallback.bindDelegate(this);
        },
        createToolLayout: function(){
            return this.tools || (this.tools = {
                'tbar': [
                    {
                        id: 'gotoGoogleButton',
                        side: 'right',
                        icon: 'content/images/icons/Map_24.png',
                        action: 'viewAddress'
                    },
                    {
                        id: 'showMapButton',
                        side: 'right',
                        icon: 'content/images/icons/srch_24.png',
                        action: 'initMap'
                    }
                ]
            });
        },
        resizeCanvas: function(){
            var barHeight = 0;
            for(var n in App.bars) {
                barHeight += domGeom.position(dojo.byId(App.bars[n].id)).h;
            };
            var canvasElement = dom.byId('mapcanvas');
            if (canvasElement)
                canvasElement.style.height = (window.innerHeight - barHeight) + 'px';
        },
        load: function() {
            this.inherited(arguments);

            this.geocoder = new google.maps.Geocoder();
            this.resizeCanvas();
        },
        initMap: function() {
            var addressText = '';

            if (this.options && this.options.address)
                addressText = this.options.address;
            else
                addressText = '85258';

            this.geocoder.geocode(
                { address: addressText },
                this.gcCallbackDel
            )
        },
        geocodeCallback: function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var latlng = results[0].geometry.location;
                // configure the default options
                var myOptions = {
                    zoom: 12,
                    center: latlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                if (!this.marker) {
                    this.marker = new google.maps.Marker({
                        position: latlng,
                        title: this.options.markerTitle
                    });
                } else
                {
                    this.marker.position = latlng;

                    this.marker.title = this.options.markerTitle;
                };

                this.markerInfo = new google.maps.InfoWindow({
                    content: '<div><h2>' +
                              this.options.markerTitle +
                             '</h2><p>' +
                              this.options.address +
                             '</p></div>'
                });

                if (this.map) {
                    //map already exists. Just center it.
                    this.map.setCenter(latlng);
                }
                // create the map, attaching it to the map_canvas element
                else {
                    var canvasElement = dom.byId('mapcanvas');
                    if (canvasElement) {
                        this.map = new google.maps.Map(
                            canvasElement, myOptions);
                    } else alert('mapcanvas not found.');
                }

                // To add the marker to the map, call setMap();
                if (this.map) this.marker.setMap(this.map);

                google.maps.event.addListener(this.marker, 'click', this.iwCallbackDel);
            } else
                alert('Unable to load map: ' + status);
        },
        infoWindowCallback: function() {
            this.markerInfo.open(this.map, this.marker);
        },
        refreshRequiredFor: function(newOptions) {
            if (this.options)
            {
                if (newOptions)
                {
                    // if the new key is different than the existing one, we need to refresh
                    if (this.options.key !== newOptions.key) return true;
                }
                // the view is being shown for the same entity; we do not need to refresh
                return false;
            }
            else
                // fall back to default handling
                return Mobile.Sample.Views.GoogleMap.superclass.refreshRequiredFor.call(this, newOptions);
        },
        refresh: function() {
            this.inherited(arguments);
            this.initMap();
        },
        viewAddress: function() {
            App.showMapForAddress(format.address(this.options.entry['Address'], true, ' '));
        }
    });
});