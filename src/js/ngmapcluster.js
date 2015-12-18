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
                onClickCallback: '=?',
                markerIcon: '=?',
                clusterIcon: '=?',
                clusterCalculator: '=?',
                updateMarker: '=?'
            },
            controller: ['$scope', function($scope) {}],
            template: '<div class="dp-places-map-wrapper"><div class="dp-places-map-canvas"></div></div>',
            link: function($scope, element, attrs, controller) {
                var isCurrentlyDraggable = $scope.draggable == 'true';
                var mapOptions = {
                    zoom: 1,
                };
                mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
                // # Get place from coords and Set map center
                mapOptions.center = new google.maps.LatLng(0.1700235000, 20.7319823000);
                var canvas = element.find('div')[0];
                // # Create map
                var map = new google.maps.Map(canvas, mapOptions);
                var pos;
                var marker;
                var markerList = [];
                var markerDictionary = {};
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
                var getMarkerIcon = function(object) {
                    if ($scope.markerIcon && typeof $scope.markerIcon === 'function') {
                        return $scope.markerIcon(object);
                    } else {
                        // will use default google maps marker icon
                        return null;
                    }
                };
                var markerIconUrl = '';
                var createMarker = function(object) {
                    pos = new google.maps.LatLng(object.latitude, object.longitude);
                    markerIconUrl = getMarkerIcon(object);
                    marker = new google.maps.Marker({
                        position: pos,
                        map: map,
                        originalObject: object,
                        icon: markerIconUrl
                    });
                    google.maps.event.addListener(marker, 'click', markerClick(marker));
                    // If marker is already in dictionary delete it
                    if (markerDictionary[object.id]) {
                        delete markerDictionary[object.id];
                    }
                    // Add to dictionary
                    markerDictionary[object.id] = marker;
                    return marker;
                };
                for (var i = 0; i < $scope.places.length; i++) {
                    markerList.push(createMarker($scope.places[i]));
                }
                $scope.updateMarkerInternal = $scope.updateMarker || {};
                $scope.updateMarkerInternal.bulkUpdate = function(markersToUpdate) {
                    if (Object.prototype.toString.call(markersToUpdate) !== '[object Array]') {
                        return;
                    }
                    var markersToRemove = [];
                    var markersToAdd = [];
                    var currentProcesssingMarker = {};
                    var currentId = '';
                    var repaint = false;
                    for (var i = 0, markers = markersToUpdate.length; i < markers; i++) {
                        currentProcesssingMarker = markersToUpdate[i];
                        currentId = currentProcesssingMarker.id;
                        try {
                            // get previous marker instance
                            markersToRemove.push(markerDictionary[currentId]);
                            // add new instance
                            markersToAdd.push(createMarker(currentProcesssingMarker));
                        } catch (e) {}
                    }
                    if (markersToRemove.length > 0) {
                        repaint = true;
                        markerCluster.removeMarkers(markersToRemove);
                    }
                    if (markersToAdd.length > 0) {
                        repaint = true;
                        markerCluster.addMarkers(markersToAdd);
                    }
                    if (repaint) {
                        markerCluster.repaint();
                    }
                };
                var markerClusterOptions = {
                    gridSize: 40,
                    minimumClusterSize: 2
                };
                if ($scope.clusterIcon && typeof $scope.clusterIcon === 'object') {
                    markerClusterOptions.styles = $scope.clusterIcon;
                }
                var markerCluster = new MarkerClusterer(map, markerList, markerClusterOptions);
                if ($scope.clusterCalculator && typeof $scope.clusterCalculator === 'function') {
                    markerCluster.setCalculator(function(marker, totalStyles) {
                        return $scope.clusterCalculator(marker, totalStyles);
                    });
                }
            }
        };
    });
}());