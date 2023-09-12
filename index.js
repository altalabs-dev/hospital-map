var map;
var geocoder = new google.maps.Geocoder();
var infoWindow = new google.maps.InfoWindow({
  // disableAutoPan: true,
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
const icon_money = `<svg fill="#000000" height="24px" width="24px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 490.2 490.2" xml:space="preserve"> <g> <g> <path d="M368.4,245.1c0,12.9-10.5,23.4-23.4,23.4s-23.4-10.5-23.4-23.4s10.5-23.4,23.4-23.4S368.4,232.2,368.4,245.1z M76.1,245.1 c0,12.9,10.5,23.4,23.4,23.4s23.4-10.5,23.4-23.4s-10.5-23.4-23.4-23.4S76.1,232.2,76.1,245.1z M38.5,382.7h268v-32.9H78.1 c0.4-2.3,0.7-4.7,0.7-7.2c0-21.5-17.5-39-39-39c-2.3,0-4.6,0.2-6.8,0.6V185.9c2.2,0.4,4.5,0.6,6.8,0.6c21.5,0,39-17.5,39-39 c0-2.5-0.2-4.8-0.7-7.2h286.1c-0.8,3-1.2,6.2-1.2,9.5c0,21.5,17.5,39,39,39c3.3,0,6.6-0.4,9.6-1.2v79.9h32.9V146 c0-21.2-17.3-38.5-38.5-38.5H38.5C17.3,107.5,0,124.8,0,146v198.2C0,365.4,17.3,382.7,38.5,382.7z M321.6,355.1 c-2.7,0-4.9,2.2-4.9,4.9v17.8c0,2.7,2.2,4.9,4.9,4.9h118c2.7,0,4.9-2.2,4.9-4.9V360c0-2.7-2.2-4.9-4.9-4.9H321.6z M467.4,339.1 v-17.8c0-2.7-2.2-4.9-4.9-4.9h-118c-2.7,0-4.9,2.2-4.9,4.9v17.8c0,2.7,2.2,4.9,4.9,4.9h118C465.2,344,467.4,341.8,467.4,339.1z M485.3,277.7h-118c-2.7,0-4.9,2.2-4.9,4.9v17.8c0,2.7,2.2,4.9,4.9,4.9h118c2.7,0,4.9-2.2,4.9-4.9v-17.8 C490.2,279.9,488,277.7,485.3,277.7z M222.3,160.7c46.6,0,84.4,37.8,84.4,84.4s-37.8,84.4-84.4,84.4s-84.4-37.8-84.4-84.4 S175.6,160.7,222.3,160.7z M229.7,182.4h-9.6c-1.5,0-2.6,1.2-2.6,2.6v11.5c-7.3,1.1-13.3,3.7-17.8,8.1c-5,4.8-7.5,10.9-7.5,18.4 c0,8.2,2.4,14.5,7.1,18.7c4.7,4.2,12.3,8.4,22.6,12.6c4.3,1.8,7.2,3.7,8.9,5.6c1.7,1.9,2.5,4.6,2.5,8.1c0,3-0.8,5.4-2.4,7.3 c-1.6,1.8-4,2.8-7.2,2.8c-3.8,0-6.9-1.2-9.2-3.6c-1.9-2-3.1-5-3.4-9c-0.1-1.6-1.5-2.8-3.1-2.7l-15.8,0.3c-1.7,0-3.1,1.5-3.1,3.2 c0.4,8.4,3.1,14.8,8.1,19.4c5.4,4.9,12.2,7.9,20.3,8.8v10.8c0,1.5,1.2,2.6,2.6,2.6h9.6c1.5,0,2.6-1.2,2.6-2.6v-11.2 c6.5-1.2,11.8-3.8,15.9-7.7c4.8-4.7,7.2-10.8,7.2-18.5c0-8-2.4-14.2-7.2-18.6c-4.8-4.3-12.3-8.7-22.5-13c-4.4-1.9-7.4-3.8-9-5.7 s-2.4-4.4-2.4-7.4s0.7-5.4,2.2-7.4c1.5-1.9,3.8-2.9,6.9-2.9c3.1,0,5.5,1.2,7.4,3.5c1.5,1.9,2.4,4.5,2.7,8c0.1,1.6,1.6,2.7,3.1,2.7 l15.8-0.2c1.7,0,3.2-1.5,3.1-3.2c-0.4-6.9-2.6-12.7-6.7-17.4c-4.2-4.9-9.7-8-16.6-9.4V185C232.3,183.5,231.1,182.4,229.7,182.4z" /> </g> </g> </svg>`;
const icon_owner = `<svg fill="#000000" width="24px" height="24px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z"/></svg>`;
const title = document.getElementById("title");
let data = [];
async function init() {
  data = await fetch("./hospital.json").then((res) => res.json());
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
                                    <div class="text-dark">${icon_marker} <span style="font-size:14px; font-weight: 500">${location}</span></div>`;
  if (item.AnnualRevenue)
    item_content += `<div>${icon_money} <span style="font-size:14px; font-weight: 500">${item.AnnualRevenue}</span></div>`;
  item_content += '<div class="row" style="font-size:12px; font-weight: 500">';
  const medicares = [
    { key: "Medicare_CKD_Patients__c", text: "Medicare CKD Patients" },
    {
      key: "Medicare_Congestive_Heart_Disease_Patien__c",
      text: "Medicare Congestive Heart Disease Patients",
    },
    { key: "Medicare_COPD_Patients__c", text: "Medicare COPD Patients" },
    {
      key: "Medicare_Diabetes_Patients__c",
      text: "Medicare Diabetes Patients",
    },
    {
      key: "Medicare_Hyptension_Patients__c",
      text: "Medicare Hyptension Patients",
    },
    { key: "Medicare_IHD_Patients__c", text: "Medicare IHD Patients" },
  ];
  for (const medicare of medicares) {
    if (parseInt(item[medicare.key])) {
      item_content += `<div class="col-10 col-sm-10 pt-1" style="font-weight: 600">${medicare.text}</div>`;
      item_content += `<div class="col-2 col-sm-2 px-0" style="color: gray">${numberWithCommas(
        item[medicare.key]
      )}</div>`;
    }
  }
  item_content += "</div>";
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
  title.innerHTML = "Hospital list";
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

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function getLatLngFromData() {
  const items = await fetch("./new.json").then((res) => res.json());
  for (const key in items) {
    if (items[key].BillingPostalCode) {
      geocoder.geocode(
        {
          componentRestrictions: {
            country: "US",
            postalCode: items[key].BillingPostalCode,
          },
        },
        function (results, status) {
          if (status == "OK") {
            const latLng = results[0].geometry.location;
            items[key].Latitude = latLng.lat();
            items[key].Longtitude = latLng.lng();
          } else {
            window.alert(
              "Geocode was not successful for the following reason: " + status
            );
          }
        }
      );
    }
  }
}
