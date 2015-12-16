/*
 * angular-google-maps-cluster
 *
 * Copyright (c) 2015 Davide Pedone
 * Licensed under the MIT license.
 * https://github.com/davidepedone/angular-google-maps-cluster
 */
(function() {
    'use strict';
    angular.module('ngMapCluster', []).directive('clusterMap', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                places: '=',
                mapType: '@?',
                readonly: '@?',
                responsive: '@?',
                draggable: '@?',
                onClickCallback: '=?'
            },
            controller: ['$scope', function($scope) {}],
            template: '<div class="dp-places-map-wrapper"><div class="dp-places-map-canvas"></div></div>',
            link: function($scope, element, attrs, controller) {
                var isCurrentlyDraggable = $scope.draggable == 'true';
                var mapOptions = {
                    zoom: 1,
                };
                var markerIconUrl = 'http://marker.local/sample/building.png';

                mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
                // # Get place from coords and Set map center
                mapOptions.center = new google.maps.LatLng(0.1700235000, 20.7319823000);
                var canvas = element.find('div')[0];
                // # Create map
                var map = new google.maps.Map(canvas, mapOptions);
                var pos;
                var marker;
                var marker_list = [];
                if ($scope.draggable && $scope.draggable == 'false') {
                    mapOptions.draggable = false;
                    mapOptions.scrollwheel = false;
                }
                // # Set map type if provided
                if ($scope.mapType && google.maps.MapTypeId[$scope.mapType]) {
                    mapOptions.mapTypeId = google.maps.MapTypeId[$scope.mapType];
                }
                if ($scope.responsive && $scope.responsive == 'true') {
                    canvas.className += ' responsive';
                }
                /*
                google.maps.event.addListener(map, 'idle', showMarkers);
                function showMarkers() {
                    var bounds = map.getBounds();
                    console.log(bounds);
                    // Call you server with ajax passing it the bounds

                    // In the ajax callback delete the current markers and add new markers
                }*/
                var markerClick = function(marker){
                    return function(){
                        $scope.onClickCallback(marker, map);
                    };
                };
                for (var i = 0; i < $scope.places.length; i++) {
                    pos = new google.maps.LatLng($scope.places[i].latitude, $scope.places[i].longitude);
                    marker = new google.maps.Marker({
                        position: pos,
                        map: map,
                        originalObject : $scope.places[i],
                        icon : markerIconUrl
                            /*,
                                                    title : 'Title',
                                                    label : 'Label',*/
                    });
                    //var storyClick = new Function("event", "alert('Click on marker " + i + " ');");
                    /*
                    google.maps.event.addListener(marker, 'click', function(){
                        alert('Click on marker '+i);
                    });
                    */
                    google.maps.event.addListener(marker, 'click', markerClick(marker));
                    marker_list.push(marker);
                }
                /*
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
                */
                /*
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
                */
                var markerCluster = new MarkerClusterer(map, marker_list, {
                    gridSize: 40,
                    minimumClusterSize: 2,
                    /*
                    calculator: function(markers, numStyles) {
                        console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
                        console.log(arguments);
                        console.log('@@@@@@@@@@@@@@@@@@@@@@@@');
                        return {
                            text: markers.length,
                            index: numStyles
                        };
                    },
                   styles: stylez
                    */
                });
                //markerCluster.setStyles({});
                /*
                console.log('@@@@@@@@@@@@@@@@@@@');
                console.log(markerCluster.getStyles());
                console.log('@@@@@@@@@@@@@@@@@@@');
                */
                markerCluster.setCalculator(function(markers, numStyles) {
                    return {
                        text: markers.length,
                        index: numStyles
                    };
                });
            }
        };
    });
}());