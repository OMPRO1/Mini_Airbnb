console.log(mapToken);
    mapboxgl.accessToken = "pk.eyJ1IjoicnV0dXJhajEwIiwiYSI6ImNsc3pqd2M4MTBsc2Eya28yZzFxcGs0Y3cifQ.ba4SN0h1pC5GIpKbFmG2iQ";
      const map = new mapboxgl.Map({
          container: 'map', // container ID
          center: coordinates, // starting position [lng, lat]
          zoom: 9 // starting zoom
      });

      console.log(coordinates);
      const marker = new mapboxgl.Marker({color:"red"})
      .setLngLat(coordinates)
      .addTo(map);