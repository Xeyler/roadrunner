import { MapContainer, TileLayer, useMapEvents, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import React, {useState, useEffect} from 'react';
import './Map.css'
import { useMediaQuery } from 'react-responsive';
import { useOutletContext } from 'react-router-dom';

function UserLocationCenter() {
    const map = useMapEvents({
      locationfound: (location) => {
        map.setView(location.latlng)
      },
    })
    map.locate()
    return null
}

var tiles = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? "	https://tile.openstreetmap.org/{z}/{x}/{y}.png" : "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"

export function FullscreenMap() {
    const {activities, user} = useOutletContext();
    const [isDark, setIsDark] = useState(false);
    const defaultCenter = [51.515, -0.09];

    const systemPrefersDark = useMediaQuery(
        {
            query: "(prefers-color-scheme: dark)",
        },
        undefined,
        (isSystemDark) => setIsDark(isSystemDark)
    )

    const geojson = activities ? activities.map(activity =>
        <GeoJSON key={activity['id']} data={activity['geojson']} />
    ) : null;

    console.log(activities)

    return (
        <MapContainer
            center={defaultCenter}
            zoom={13}
            style={{width: '100%', height: '100%'}}
            maxZoom={17}
            minZoom={4}
            attributionControl={false}
        >
            <UserLocationCenter />
            <TileLayer
                url={isDark ? "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" : "https://tile.openstreetmap.org/{z}/{x}/{y}.png"}
            />
            {geojson}
        </MapContainer>
    );
}