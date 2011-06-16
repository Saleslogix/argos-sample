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
Ext.namespace("Mobile.Sample");

Mobile.Sample.GoogleMap = Ext.extend(Sage.Platform.Mobile.View, {

    viewTemplate: new Simplate([
        '<div id="{%= $.id %}" title="{%: $.titleText %}" class="panel {%= $.cls %}">',
            '<div id="mapcanvas" style="height:400px">',
            '</div>',
        '</div>'
    ]),
    id: 'googlemapview',
    expose: false,
    titleText: 'Map',
    init: function() {
        Mobile.Sample.GoogleMap.superclass.init.apply(this, arguments);
        this.tools.tbar = [
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
        ];
        this.gcCallbackDel = this.geocodeCallback.createDelegate(this);
        this.iwCallbackDel = this.infoWindowCallback.createDelegate(this);
    },
    resizeCanvas: function(){
        var barHeight = 0;
        for(var n in App.bars) {
            barHeight += App.bars[n].el.getHeight();
        };
        var canvasElement = Ext.get('mapcanvas').dom;
        if (canvasElement)
            canvasElement.style.height = (window.innerHeight - barHeight) + 'px';
    },
    load: function() {
        Mobile.Sample.GoogleMap.superclass.load.apply(this, arguments);

        this.geocoder = new google.maps.Geocoder();
        this.resizeCanvas();
    },
    initMap: function() {

        if (this.options && this.options.address)
        {
            addressText = this.options.address;
        } else addressText = '85258';

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
                var canvasElement = Ext.get('mapcanvas').dom;//document.getElementById('mapcanvas');
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
            return Mobile.Sample.GoogleMap.superclass.refreshRequiredFor.call(this, newOptions);
    },
    refresh: function() {
        Mobile.Sample.GoogleMap.superclass.refresh.apply(this, arguments);
        this.initMap();
    },
    viewAddress: function() {
        App.showMapForAddress(Mobile.SalesLogix.Format.address(this.options.entry['Address'], true, ' '));
    }
});