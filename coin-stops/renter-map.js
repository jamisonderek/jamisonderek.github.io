pm.visualizer.set(
    `
        <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
        <script>window.getResponse = function() { 
            var r = "{{response}}";
            while (r.indexOf("&quot;") > 0) {
                r = r.replace(/&quot;/g, '\\"');
            }
            
            var j = JSON.parse(r);
            return j;
        }</script>
        <script src='{{javascriptUri}}'></script>
        <script
      src="https://maps.googleapis.com/maps/api/js?key={{googleMapsApiKey}}&callback=initMap&libraries=&v=weekly"
      defer
    ></script>
        <style>
         #map { height: 100%; }
        html,body { height: 100%; margin: 0; padding: 0; }
        </style>
        <div id="map"></div>
        <div>Map should render above here...  If you see "Oops! Something went wrong." then make sure your googlemap_api_key environment variable is set correctly.</div>
    `
    ,
    {
        response: JSON.stringify(aggregateResults),
        googleMapsApiKey: googleMapsApiKey,
        javascriptUri: javascriptUri
    }
);
