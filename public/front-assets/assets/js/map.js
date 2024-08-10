var styleArray = [{
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [{
      "color": "#cd50ff"
    }]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [{
      "color": "#fcf6ff"
    }]
  },
  {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "road",
    "elementType": "all",
    "stylers": [{
        "saturation": -100
      },
      {
        "lightness": 45
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "all",
    "stylers": [{
      "visibility": "simplified"
    }]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.icon",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [{
      "visibility": "off"
    }]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [{
        "color": "#f7e5ff"
      },
      {
        "visibility": "on"
      }
    ]
  }
]

var mapOptions = {
  center: new google.maps.LatLng(23.739257,90.3869883),
  zoom: 5,
  styles: styleArray,
  scrollwheel: false,
  backgroundColor: '#e5ecff',
  mapTypeControl: false,
  mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map = new google.maps.Map(document.getElementsByClassName("maps")[0],
  mapOptions);
var myLatlng = new google.maps.LatLng(23.739257,90.3869883);
// var focusplace = {lat: 55.864237, lng: -4.251806};
var marker = new google.maps.Marker({
  position: myLatlng,
  map: map,
  icon: {
    url: "./assets/images/map-marker.png"
  }
})