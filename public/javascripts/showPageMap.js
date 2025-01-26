maptilersdk.config.apiKey = maptilerApiKey;

    // Initialize the map
 const map = new maptilersdk.Map({
        container: "map", // ID of the HTML element where the map will be rendered
        style: maptilersdk.MapStyle.STREET, // Map style
        center: campground.geometry.coordinates, // Should print something like [longitude, latitude]
      
        zoom: 10, // Starting zoom level
        key: maptilerApiKey, // MapTiler API key
      });
    
      // Add a marker
      new maptilersdk.Marker()
        .setLngLat(campground.geometry.coordinates)
        .setPopup(
            new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
            .addTo(map) 
