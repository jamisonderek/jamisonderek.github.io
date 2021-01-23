console.log('This is the coords-on-map.js file.');

const icons = [
    'https://placekitten.com/40/40',
    'https://placekitten.com/41/40',
    'https://placekitten.com/40/41',
    'https://placekitten.com/41/41',
    'https://placekitten.com/41/41'
];

// https://www.yelp.com/developers/display_requirements
// https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_design_web/9b34e39ccbeb/assets/img/stars/stars.png

function getMapCenterGeo(response) {
    return { 
        lat: response[0].nearby[0].lat, 
        lng: response[0].nearby[0].long
    };
}

function getYelpStarsOffset(spot) {
    var offset = -240;
    if (spot.stars>=1) {
        offset += 18;
        offset -= (spot.stars*2)*18;
    }
    return offset;
}

function addMarker(map, spot) {
    // Add a marker.
    const location = { lat: spot.lat, lng: spot.long };
    const titleString = spot.name;

    // You cannot open new window because the request was made in a sandboxed frame whose
    //  'allow-popups' permission is not set.

    const offset = getYelpStarsOffset(spot);
    const expensive = (spot.coins==0)? "" : "$$$$".substring(0,spot.coins);
    const categories = spot.categories;
    const transactions = (spot.transactions == undefined) ? '' : spot.transactions.join(',');
    const contentString = `
    <div id=content width="500px" height="300px">
        <img src="${spot.image}" height="150px"/><br/>
        <div style="font-size: 2.4rem;">${spot.name}</div>
        <div title="3.0 star rating" style="position: relative; overflow: hidden; width: 110px; height: 18px; background: url('https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_design_web/9b34e39ccbeb/assets/img/stars/stars.png') no-repeat; background-size: 132px 560px; display: inline-block; vertical-align: middle; background-position-x: 0px; background-position-y: ${offset}px; ">
        </div>
        <span style="vertical-align:middle"><font size="+1">${spot.review_count}&nbsp;&nbsp;&nbsp; ${expensive}</font></span><br/>
        <div>${categories}</div>
        <div>${transactions}</div>

            <p><a href="${spot.link}" onclick="console.log('Copying...'); var i=this.getElementsByTagName('input')[0]; i.select(); i.setSelectionRange(0, 1000); document.execCommand('copy'); console.log('Copied...'+i); return false;"><img src=
            "https://s3-media2.fl.yelpcdn.com/assets/srv0/www_pages/95212dafe621/assets/img/brand_guidelines/yelp-2c.png" height="40px">Click to copy url.<br/>
            <input type="text" value="${spot.link}" id="myInput" style="height:1px; width:150px;">
            </a>
    </div>
    `;
    const infowindow = new google.maps.InfoWindow({
        content: contentString,
    });
    const marker = new google.maps.Marker({
        position: location,
        icon: icons[spot.coins],
        map,
        title: titleString
    });
    marker.addListener("click", () => {
        infowindow.open(map, marker);
    });
}

function initMap() {
    const response = window.getResponse();
    console.log('initMap got response: '+response);

    // Center the map around the starting point.
    const centerMapSpot = getMapCenterGeo(response);
    const map = new google.maps.Map(
        document.getElementById("map"), {
        zoom: 15,
        center: centerMapSpot,
    });

    for (var i=0; i<response.length; i++) {
        for (var j=0; j<response[i].nearby.length; j++) {
            console.log('adding marker ['+i+','+j+']: '+ response[i].nearby[j]);
            addMarker(map, response[i].nearby[j]);
        }
    }
}
