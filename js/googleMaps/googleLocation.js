/*******************************************************************************
 * @author Tomasz Scislo <<ahref='mailto:t.scislo@samsung.com'>t.scislo@samsung.com</a>>
 * @author Lukasz Jagodzinski <<ahref='mailto:l.jagodzinsk@samsung.com'>l.jagodzinsk@samsung.com</a>>
 * Copyright (c) 2013 Samsung Electronics All Rights Reserved.
 ******************************************************************************/

var googleLocation = (function ($, logger, view, network, ajax) {
    var appKey, internetConnectionCheck;

    appKey = "AIzaSyDiemDnjZbjSNLQdwcDBzx38SDRFahSkoU";

    /**
     * Asynch method to check the network connection
     * @private
     */
    internetConnectionCheck = function () {
        network.isInternetConnection(function (isConnection) {
            if (!isConnection) {
                view.hideLoader();
                view.showPopup("No Internet connection. Application may not work properly.");s
            }
        });
    };
    
    var myLatitude, myLongitude;
    var infowindow;
    return {
        /**
         * Provides initialization for the app
         */
        initialize: function () {
            var that = this;
            ajax();
            $.extend($.mobile, {
                defaultPageTransition: "flip",
                loadingMessageTextVisible: true,
                pageLoadErrorMessage: "Unable to load page",
                pageLoadErrorMessageTheme: "d",
                touchOverflowEnabled: true,
                loadingMessage: "Please wait...",
                allowCrossDomainPages: true,
                ajaxEnabled: false
            });
            logger.info("googleLocation.initialize()");
            internetConnectionCheck();
            
            $('#main').live('pageshow', function () {
                internetConnectionCheck();
                $(this).find("li#myLocation").bind({
                    click: function (event) {
                        event.preventDefault();
                        view.showLoader();
                        that.getCurrentLocation();
                    }
                });
            });     
                    
            //New Function for assignment
            $('#feeel1').live('pageshow', function () {
            	infowindow = new google.maps.InfoWindow();
                logger.info("My Location Google Map View");
                internetConnectionCheck();
                
                //get current location
                that.getCurrentLocation();
                logger.info(myLatitude);
                logger.info(myLongitude);
                
                // draw map                
            	logger.info("Create map");
            	var map = that.createMapForGivenContainer("map_canvas", {
                    zoom: 15,
                    lat: myLatitude,
                    lon: myLongitude,                                
                    streetViewControl: false,
                    mapTypeId: google.maps.MapTypeId.HYBRID
                });
            	logger.info("Create Marker");
            	new google.maps.Marker({
            	    position: {lat: myLatitude, lng: myLongitude},
            	    animation: google.maps.Animation.DROP,
            	    title:"You are Here!",
            	    map: map
            	});
            	logger.info("Create Cirlces");
            	var cityCircle = new google.maps.Circle({
					strokeColor: '#FF0000',
			        strokeOpacity: 0.8,
					strokeWeight: 2,
					fillColor: '#FF0000',
					fillOpacity: 0.35,
					map: map,
					center: {lat: myLatitude, lng: myLongitude},
					radius: 500
				});

				var cityCircle = new google.maps.Circle({
					strokeColor: '#0000FF',
			        strokeOpacity: 0.8,
					strokeWeight: 2,
					fillColor: '#0000FF',
					fillOpacity: 0.35,
					map: map,
					center: {lat: myLatitude, lng: myLongitude},
					radius: 10
				});

				var cityCircle = new google.maps.Circle({
					strokeColor: '#0000FF',
			        strokeOpacity: 0,
					strokeWeight: 2,
					fillColor: '#0000FF',
					fillOpacity: 0.2,
					map: map,
					center: {lat: myLatitude, lng: myLongitude},
					radius: 20
				});
				logger.info("Places Service");
				placesList = document.getElementById('places');
            	var service = new google.maps.places.PlacesService(map);
				service.nearbySearch({
					location: {lat: myLatitude, lng: myLongitude},
					radius: 500,
					types: ['book_store']
					}, that.callback
				);
				
            }); 
        },

        /**
         * Method that can be used for basic google.maps.Map creation for given container
         * @param container
         * @param options
         * @returns {Object} google.maps.Map
         */
        createMapForGivenContainer: function (container, options) {
            var mapOptions, map;

            mapOptions = {
                center: new google.maps.LatLng(options.lat, options.lon),
                zoom: options.zoom,
                mapTypeId: options.mapTypeId,
                streetViewControl: options.streetViewControl
            };
            map = new google.maps.Map(document.getElementById(container), mapOptions);
            return map;
        },

        /**
         * Method that can be used to get current device geolocation according to W3C Geolocation API
         * @returns
         */
        getCurrentLocation: function () {
            logger.info('getCurrentLocation');
            if (navigator && navigator.geolocation && navigator.geolocation.getCurrentPosition) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    view.hideLoader();
                    // Currently Tizen returns coords as 0 0 and we should treat this as an error
                    if (position.coords.latitude === 0 && position.coords.longitude === 0) {
                        view.showPopup('Unable to acquire your location');
                    } else {
                        view.showPopup('Latitude: ' + position.coords.latitude + "<br />" + 'Longitude: ' + position.coords.longitude);
                        myLatitude = position.coords.latitude; 
                        myLongitude =  position.coords.longitude;
                    }
                    return position;
                }, function (error) {
                    view.hideLoader();
                    view.showPopup('Unable to acquire your location');
                    logger.err('GPS error occurred. Error code: ', JSON.stringify(error));
                });
            } else {
                view.hideLoader();
                view.showPopup('Unable to acquire your location');
                logger.err('No W3C Geolocation API available');
            }
        },
        /*
        callback: function(results, status) {
        	logger.info("Callback for places service");
        	var that = this;
        	logger.info(status + "vs" + google.maps.places.PlacesServiceStatus.OK);
        	if (status === google.maps.places.PlacesServiceStatus.OK) {
        		logger.info("Loop in!"+results.length);
        		for (var i = 0; i < results.length; i++) {
        			logger.info("Loop in for places service"+i);
        			that.createMarker(results[i]);
        		}
        	}

        },

        createMarker: function(place) {
        	logger.info("Create Marker for place service");
        	var map = that.createMapForGivenContainer("map_canvas", {
                zoom: 15,
                lat: myLatitude,
                lon: myLongitude,
                streetViewControl: false,
                mapTypeId: google.maps.MapTypeId.HYBRID
            });
        	
        	var placeLoc = place.geometry.location;
        	logger.info("Create Marker");
        	var marker = new google.maps.Marker({
        					map: map,
        					position: place.geometry.location
        				});

        	google.maps.event.addListener(marker, 'click', function() {
        		infowindow.setContent(place.name);
        		infowindow.open(map, this);
        		});
        }
        */
        callback: function (results, status) {
            if (status != google.maps.places.PlacesServiceStatus.OK) {
              return;
            } else {
              createMarkers(results);
            }
          },

          createMarkers: function (places) {
            var bounds = new google.maps.LatLngBounds();

            for (var i = 0, place; place = places[i]; i++) {
              var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
              };

              var marker = new google.maps.Marker({
                map: map,
                icon: image,
                title: place.name,
                position: place.geometry.location
              });

              bounds.extend(place.geometry.location);
            }
            map.fitBounds(bounds);
          }
    };
}($, tlib.logger, tlib.view, tlib.network, tlib.ajax));

googleLocation.initialize();
