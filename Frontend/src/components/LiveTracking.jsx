import React, { useState, useEffect, useRef } from 'react';
import Map, { Marker } from 'react-map-gl'; // Import Mapbox components
import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox styles

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState({
        lat: 22.9734, // Updated initial lat/lng 
        lng: 78.6569
    });
    const [viewState, setViewState] = useState({
        longitude: 78.6569,
        latitude: 22.9734,
        zoom: 13,
    });
    const mapRef = useRef(null); // Use a ref to access the map instance

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({ lat: latitude, lng: longitude });
            setViewState((prevState) => ({
                ...prevState,
                longitude,
                latitude,
            }));
        });

        const watchId = navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({ lat: latitude, lng: longitude });
            setViewState((prevState) => ({
                ...prevState,
                longitude,
                latitude,
            }));
        });

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    // Ensure the map is resized after rendering
    const handleMapLoad = () => {
        if (mapRef.current) {
            mapRef.current.resize();
        }
    };

    return (
        <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
            onLoad={handleMapLoad} 
            ref={mapRef}
        >
            <Marker longitude={currentPosition.lng} latitude={currentPosition.lat} />
        </Map>
    );
};

export default LiveTracking;
