/**
 * AngularJS reverse geocoding directive
 * @author Guilherme Assemany <guilhermeassemany@hotmail.com> (http://assemany.com)
 * @version 1.0.0
 */
(function () {
    var moduleName = angular.module('AngularReverseGeocode', [])
    .service('reverseGeocode', ['$http', function($http){

      var vm = this;

      vm.geocodePosition = geocodePosition;
      vm.parsePositionArray = parsePositionArray;

      var geocoder = new google.maps.Geocoder();

      function geocodePosition(lat, lng, successCallback, errorCallback, responseType) {
        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({
          latLng: latlng
        }, function(responses) {
          if (responses && responses.length > 0) {
              if(responseType && responseType==='json'){
                  successCallback(angular.fromJson(responses[0]));
              }else{
                  successCallback(responses[0].formatted_address);
              }
          } else {
              errorCallback({status:'KO',reason:'Error while trying to find the location'});
          }
        });
      }

        function parsePositionArray(jsonPositionArray) {
            var _returnObject = {};
            angular.forEach(jsonPositionArray,function (_positionObject) {
                _returnObject[_positionObject.types[0]] = _positionObject.short_name;
            });
            return _returnObject;
        }
    }])
    .directive('reverseGeocode', function () {
        return {
            restrict: 'E',
            template: '<div></div>',
            link: function (scope, element, attrs) {
                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(attrs.lat, attrs.lng);
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            element.text(results[0].formatted_address);
                        } else {
                            element.text('Location not found');
                        }
                    } else {
                        element.text('Geocoder failed due to: ' + status);
                    }
                });
            },
            replace: true
        };
    }).name;

    return moduleName;
})();
