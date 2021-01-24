console.log('This is the coords-on-map.js file.');

// There is a limit on mock server calls, so just host the coinstop images on github.com.
const icons = [
    'https://jamisonderek.github.io/coin-stops/0-coins.png',
    'https://jamisonderek.github.io/coin-stops/1-coins.png',
    'https://jamisonderek.github.io/coin-stops/2-coins.png',
    'https://jamisonderek.github.io/coin-stops/3-coins.png',
    'https://jamisonderek.github.io/coin-stops/4-coins.png'
];

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

var infowindows = [];

function closeAllInfoWindows() {
    for(var i=0; i<infowindows.length;i++) {
        if (infowindows[i] !== undefined) {
            infowindows[i].close();
        }
    }
}

function addStartMarker(map, spot) {
    const location = { lat: spot.lat, lng: spot.long };
    const titleString = spot.stopName;
    const mode = spot.mode;
    const headsign = spot.headsign;
    const transportName = spot.transportName;
    const color = spot.color;
    
    const contentString = `
        <div id=content width="500px" height="300px">
           <div style="font-size: 2.4rem;">${spot.name}</div>
           <div style="foreground-color: ${color}; background-color: ${color}">............</div>
           <div>${mode}  ${headsign}</div>
           <div>${transportName}</div>
        </div>`;
    
    const infowindow = new google.maps.InfoWindow({
        content: contentString,
    });
    
    const marker = new google.maps.Marker({
        position: location,
        map,
        title: titleString
    });

    marker.addListener("click", () => {
        closeAllInfoWindows();
        infowindow.open(map, marker);
        event.stopPropagation();
    });
}

function addBusinessMarker(map, spot) {
    // Add a marker.
    const location = { lat: spot.lat, lng: spot.long };
    const titleString = spot.name;

    // Sadly, the Visualizer was made in a sandboxed frame whose 'allow-popups' permission is not set.
    // So we can't navigate to the help page, best we can do is allow the user to copy the url.
    
    // NOTE: https://www.yelp.com/developers/display_requirements has restrictions on how we show the star ratings
    // and where we show the yelp burst (above the fold).
    const offset = getYelpStarsOffset(spot);
    
    // Convert coins back into $ when we show in the popup.
    const expensive = (spot.coins==0)? "" : "$$$$".substring(0,spot.coins);

    // Other interesting data to show in the popup.
    const categories = spot.categories;
    const transactions = (spot.transactions == undefined) ? '' : spot.transactions.join(',');
    
    // NOTE: yelp.com br
    
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
        closeAllInfoWindows();
        infowindow.open(map, marker);
        event.stopPropagation();
    });
    
    return infowindow;
}

function initMap() {
    const response = window.getResponse();

    // Center the map around the starting point.
    const centerMapSpot = getMapCenterGeo(response);
    const map = new google.maps.Map(
        document.getElementById("map"), {
        zoom: 15,
        center: centerMapSpot,
    });

    for (var i=0; i<response.length; i++) {
        
        if (response[i].kind === 'start') {
            infowindows.push(addStartMarker(map, response[i]));
        }
        
        for (var j=0; j<response[i].nearby.length; j++) {
            infowindows.push(addBusinessMarker(map, response[i].nearby[j]));
        }
    }
    
    map.addListener("click", () => {
       closeAllInfoWindows();
    });
}
