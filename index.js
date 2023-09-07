import hospitals from "./hospital.json" assert { type: "json" };

var map;
var geocoder = new google.maps.Geocoder();
var infoWindow = new google.maps.InfoWindow({
  disableAutoPan: true,
});
var center = new google.maps.LatLng(38.78436574258653, -77.0150403423293);
var bounds;
var zoom = 6;
var markers = [];
const table_body = document.getElementById("table_body");
const dialog_btn = document.getElementById("dialog_btn");
const close_dialog_btn = document.getElementById("close_dialog_btn");
const dialog = document.getElementById("dialog");
const list_store = document.getElementById("list-store");
const postcode_el = document.getElementById("homepoint");
const icon_marker =
  '<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 10C19 13.9765 12 21 12 21C12 21 5 13.9765 5 10C5 6.02355 8.13401 3 12 3C15.866 3 19 6.02355 19 10Z" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><circle cx="12" cy="10" r="3" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg>';
const title = document.getElementById("title");
let data = hospitals;
async function init() {
  data = data.filter((item) => item.Latitude && item.Longtitude);
  var mapOptions = {
    zoom: zoom,
    tilt: 45,
    center: center,
    mapTypeControl: false,
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  setMarkers(data);
}

dialog_btn.addEventListener("click", function () {
  dialog.showModal();
});

close_dialog_btn.addEventListener("click", function () {
  dialog.close();
});

postcode_el.addEventListener("change", function () {
  markers.forEach((marker) => marker.setMap(null));
  markers = [];
  if (this.value) setMarkersNearbyPostcode(this.value);
  else setMarkers(data);
});

window.onload = () => {
  init();
};

function createContent(item) {
  let content = `<div class="col-sm-12 text-secondary title-address">${item.Name}</div>`;
  let locations = [
    item.BillingCity,
    item.BillingState,
    item.BillingPostalCode,
    item.BillingCountry,
  ];
  locations = locations.filter((x) => x);
  const location = locations.join(", ");
  content += `<div class="col-sm-12 item-content">
                            <div>${icon_marker}
                            <span class="text-dark">${location}</span>
                        </div>`;
  content;
  content += "</div>";
  return (
    "<div class='row no-gutters' style='max-width: 400px'>" + content + "</div>"
  );
}
function setListStores(item, marker, infoWindow) {
  let locations = [
    item.BillingCity,
    item.BillingState,
    item.BillingPostalCode,
    item.BillingCountry,
  ];
  locations = locations.filter((x) => x);
  const location = locations.join(", ");
  let item_content = `<div class="col-12 col-sm-12 pr-0 pb-4 pt-2">
                                    <div style="font-size:18px; font-weight: 700; color: gray">${item.Name}</div>
                                    <div class="text-dark">${icon_marker} <span style="font-size:14px; font-weight: 500">${location}</span>
                                </div>`;
  item_content += "</div>";
  const node = document.createElement("div");
  node.className = "row flex-row px-2 card";
  node.style.borderBottom = "thin solid rgba(0,0,0,.12)";
  node.style.marginRight = "1rem";
  node.style.marginLeft = "0.5rem";
  node.innerHTML = item_content;
  list_store.appendChild(node);

  node.addEventListener("mouseover", function () {
    infoWindow.setContent(createContent(item));
    infoWindow.open(map, marker);
  });
  node.addEventListener("mouseout", function () {
    infoWindow.close();
  });
}
function setMarkers(items) {
  onAddData(items);

  bounds = new google.maps.LatLngBounds();
  title.innerHTML = "Store list";
  const node = document.createElement("span");
  node.innerHTML = ` (${items.length} results)`;
  title.appendChild(node);
  list_store.innerHTML = "";
  for (const key in items) {
    if (Number(items[key].Latitude) && Number(items[key].Longtitude)) {
      const latLng = new google.maps.LatLng(
        items[key].Latitude,
        items[key].Longtitude
      );
      markers[key] = new google.maps.Marker({
        position: latLng,
        map: map,
        clickable: true,
      });
      bounds.extend(latLng);
      infoWindow.setPosition(latLng);
      markers[key].addListener("mouseover", function () {
        infoWindow.close();
        infoWindow.setContent(createContent(items[key]));
        infoWindow.open(map, this);
      });
      markers[key].addListener("mouseout", function () {
        infoWindow.close();
      });
      setListStores(items[key], markers[key], infoWindow);
    }
  }
  if (items.length > 0) map.fitBounds(bounds);
}
function haversineDistance(mk1, mk2) {
  var R = 3958.8; // Radius of the Earth in miles
  var rlat1 = parseInt(mk1.lat) * (Math.PI / 180); // Convert degrees to radians
  var rlat2 = parseInt(mk2.lat) * (Math.PI / 180); // Convert degrees to radians
  var difflat = rlat2 - rlat1; // Radian difference (latitudes)
  var difflon = (parseInt(mk2.lng) - parseInt(mk1.lng)) * (Math.PI / 180); // Radian difference (longitudes)
  var d =
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
          Math.cos(rlat1) *
            Math.cos(rlat2) *
            Math.sin(difflon / 2) *
            Math.sin(difflon / 2)
      )
    );
  return d;
}
function setMarkersNearbyPostcode(postcode) {
  var postcode_marker;
  geocoder.geocode(
    {
      componentRestrictions: {
        country: "US",
        postalCode: postcode,
      },
    },
    function (results, status) {
      if (status == "OK") {
        const latLng = results[0].geometry.location;
        postcode_marker = {
          lat: latLng.lat(),
          lng: latLng.lng(),
        };
        let items = data.map((item) => {
          return {
            ...item,
            distance: haversineDistance(postcode_marker, {
              lat: item.Latitude,
              lng: item.Longtitude,
            }),
          };
        });
        items = items.sort((a, b) => {
          if (a.distance < b.distance) return -1;
          if (a.distance > b.distance) return 1;
          return 0;
        });
        items = items.slice(0, 25);
        setMarkers(items);
      } else {
        window.alert(
          "Geocode was not successful for the following reason: " + status
        );
      }
    }
  );
}

function onAddData(items) {
  table_body.innerHTML = "";
  let new_items = [...items];
  new_items = new_items.map(
    ({ Latitude, Longtitude, distance, ...rest }) => rest
  );
  if (new_items.length > 0) {
    for (const item of new_items) {
      const row = document.createElement("tr");
      let table_content = "";
      Object.keys(items[0]).forEach((key) => {
        if (typeof item[key] != "undefined")
          table_content += `<td>${item[key]}</td>`;
      });
      row.innerHTML = table_content;
      table_body.appendChild(row);
    }
  }
}
