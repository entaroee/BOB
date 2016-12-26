     // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
            	if (window.history.length <= 0 ){
            		tizen.application.getCurrentApplication().exit();
            	}
            	else{
            		window.history.back();
            	}
            } catch (ignore) {}
        }
    });


    var map, placesList;
    var pyrmont;

    function initialize() {
    	if(navigator.geolocation)
    	{
    	var watchId = navigator.geolocation.getCurrentPosition(function(position) {
    		
    		pyrmont= new google.maps.LatLng(position.coords.latitude , position.coords.longitude);
    		 map = new google.maps.Map(document.getElementById('map-canvas'), {
    			    center: pyrmont,
    			    zoom: 13
    			  });
    		 var cityCircle = new google.maps.Circle({
				strokeColor: '#FF0000',
			    strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#FF0000',
				fillOpacity: 0.35,
				map: map,
				center: pyrmont,
				radius: 500
			});

			var cityCircle = new google.maps.Circle({
				strokeColor: '#0000FF',
			    strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#0000FF',
				fillOpacity: 0.35,
				map: map,
				center: pyrmont,
				radius: 10
			});

			var cityCircle = new google.maps.Circle({
				strokeColor: '#0000FF',
			    strokeOpacity: 0,
				strokeWeight: 2,
				fillColor: '#0000FF',
				fillOpacity: 0.2,
				map: map,
				center: pyrmont,
				radius: 20
			});


    		 var request = {
    				    location: pyrmont,
    				    radius: 500,
    				    types: ['book_store']
    				  };

    				  placesList = document.getElementById('places');

    				  var service = new google.maps.places.PlacesService(map);
    				  service.nearbySearch(request, callback);
    		});
    	}
    }

    function callback(results, status) {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        return;
      } else {
        createMarkers(results);
      }
    }

    function createMarkers(places) {
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

        bounds.extend(pyrmont);
      }
      map.setZoom(15);
    }
    
    window.google.maps.event.addDomListener(window, 'load', initialize);

    

