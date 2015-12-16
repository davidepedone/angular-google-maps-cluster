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
                var markerClick = function(marker) {
                    return function() {
                        $scope.onClickCallback(marker, map);
                    };
                };
                for (var i = 0; i < $scope.places.length; i++) {
                    pos = new google.maps.LatLng($scope.places[i].latitude, $scope.places[i].longitude);
                    marker = new google.maps.Marker({
                        position: pos,
                        map: map,
                        originalObject: $scope.places[i],
                        icon: markerIconUrl
                    });
                    google.maps.event.addListener(marker, 'click', markerClick(marker));
                    marker_list.push(marker);
                }
                var markerCluster = new MarkerClusterer(map, marker_list, {
                    gridSize: 40,
                    minimumClusterSize: 2
                });
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