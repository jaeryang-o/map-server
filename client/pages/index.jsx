import React, {
  useState
} from 'react';
import ReactMapGL, {Source, Layer} from 'react-map-gl';
import './main.css';

const TILE_SERVER_HOST = process.env.TILE_SERVER_HOST || 'localhost';

export default () => {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: '100%',
    longitude: 127.0276241,
    latitude: 37.49795268,
    zoom: 16
  });

  return (
    <div id="map">
      <ReactMapGL
        {...viewport}
        mapOptions={{
          attributionControl: false,
          localIdeographFontFamily: false,
        }}
        mapStyle={'mapbox://styles/mapbox/streets-v9'}
        mapboxApiAccessToken={'pk.eyJ1IjoiZWdhb25la28iLCJhIjoiY2pkYnJtdWg4N3Y0ejMzbzV2NHkzanJodCJ9.509Ns7trg6hi_lZKGyWzew'}
        onViewportChange={nextViewport => setViewport(nextViewport)}
      >
        <Source
          id="osm-building"
          type="vector"
          tiles={['http://localhost:8080/tile/{z}/{x}/{y}.pbf']}>
          <Layer
            id="osm-building"
            source-layer="buildings"
            type="fill"
            paint={{
              'fill-color': '#007cbf'
            }} />
        </Source>
      </ReactMapGL>
    </div>
  );
}
