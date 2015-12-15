/*
 * angular-google-maps-cluster
 *
 * Copyright (c) 2015 Davide Pedone
 * Licensed under the MIT license.
 * https://github.com/davidepedone/angular-google-maps-cluster
 */
(function() {
    'use strict';
    var getLocation = function(addressObj, fallback, callback) {
        // # Get location coords
        try {
            var lat = addressObj.geometry.location.A;
            var lng = addressObj.geometry.location.F;
            return new google.maps.LatLng(lat, lng);
        } catch (e) {
            return new google.maps.LatLng(fallback.lat, fallback.lng);
        }
    };
    angular.module('ngMapCluster', []).filter('gps', function() {
        return function(input, field) {
            var json;
            try {
                json = JSON.parse(input);
            } catch (e) {
                json = false;
            }
            return json && json[field] ? json[field] : '';
        };
    }).directive('clusterMap', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                customCallback: '&?',
                picked: '=?',
                address: '=?',
                fallback: '=?',
                mapType: '@?',
                readonly: '@?',
                responsive: '@?',
                draggable: '@?',
                toggleMapDraggable: '=?',
                placeNotFound: '=?',
                updateMarkerLabel: '=?'
            },
            controller: ['$scope', function($scope) {}],
            template: '<div class="dp-places-map-wrapper"><div class="dp-places-map-canvas"></div></div>',
            link: function($scope, element, attrs, controller) {
                var mapOptions = {
                    zoom: 1,
                };
                mapOptions.mapTypeId = google.maps.MapTypeId.HYBRID;
                // # Get place from coords and Set map center
                mapOptions.center = new google.maps.LatLng(0.1700235000, 20.7319823000);
                var canvas = element.find('div')[0];
                // # Create map
                var map = new google.maps.Map(canvas, mapOptions);
                var pos;
                var marker;
                var marker_list = [];
                var markers = [{
                    "coordinate": [9.189988136291504, 45.464176177978516]
                }, {
                    "coordinate": [12.492231369018555, 41.89020919799805]
                }, {
                    "coordinate": [7.686863899230957, 45.07033920288086]
                }, {
                    "coordinate": [9.67726993560791, 45.698265075683594]
                }, {
                    "coordinate": [10.211801528930664, 45.54155349731445]
                }, {
                    "coordinate": [9.868430137634277, 46.163551330566406]
                }, {
                    "coordinate": [9.577068328857422, 46.13368606567383]
                }, {
                    "coordinate": [9.025843620300293, 45.255985260009766]
                }];
                /*
                google.maps.event.addListener(map, 'idle', showMarkers);
				function showMarkers() {
					var bounds = map.getBounds();
					console.log(bounds);
					// Call you server with ajax passing it the bounds

					// In the ajax callback delete the current markers and add new markers
				}*/
                for (var i = 0; i < 1000; i++) {
                    //var a = markers[i].coordinate;
                    //pos = new google.maps.LatLng(a[1], a[0]);
                    pos = new google.maps.LatLng(Math.floor(Math.random() * 50), Math.floor(Math.random() * 100));
                    marker = new google.maps.Marker({
                        position: pos,
                        map: map,
                        title: 'Title'//,
                        //label: 'Label',
                        //animation: google.maps.Animation.DROP
                    });
                    var storyClick = new Function("event", "alert('Click on marker " + i + " ');");
                    google.maps.event.addListener(marker, 'click', storyClick);
                    marker_list.push(marker);
                }

                var stylez = [{
                    height: 53,
                    width: 53,
                    url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m1.png"
                },{
                    height: 53,
                    width: 53,
                    url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m1.png"
                },{
                    height: 53,
                    width: 53,
                    url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m1.png"
                },{
                    height: 53,
                    width: 53,
                    url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m1.png"
                },{
                    height: 53,
                    width: 53,
                    url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m1.png"
                },{
                    height: 53,
                    width: 53,
                    url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m1.png"
                },
                {
                    height:50,
                    width:50,
                    url:"https://placeholdit.imgix.net/~text?txtsize=9&txt=100%C3%97100&w=50&h=50"
                }];

                var markerCluster = new MarkerClusterer(map, marker_list, {
                    gridSize: 40,
                    minimumClusterSize: 4,
                    /*
                    calculator: function(markers, numStyles) {
                    	console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
                    	console.log(arguments);
                    	console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
                        return {
                            text: markers.length,
                            index: numStyles
                        };
                    }
                    */
                   styles: stylez
                });



                //markerCluster.setStyles({});

                console.log('@@@@@@@@@@@@@@@@@@@');
                console.log(markerCluster.getStyles());
                console.log('@@@@@@@@@@@@@@@@@@@');
                markerCluster.setCalculator(function(markers, numStyles){
                    return {
                        text: markers.length,
                        index: markers.length > 100 ? 7 : numStyles
                    }
                });
            }
        };
    });
}());