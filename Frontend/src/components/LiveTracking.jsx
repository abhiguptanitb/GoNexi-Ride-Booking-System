import React, { useState, useEffect } from 'react';
import Map, { Marker } from 'react-map-gl'; // Import Mapbox components
import 'mapbox-gl/dist/mapbox-gl.css'; // Import Mapbox styles

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN; // Add your Mapbox access token in the environment variables

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState({
        lat: 75.859207,
        lng: 22.718886,
    });
    const [viewState, setViewState] = useState({
        longitude: currentPosition.lng,
        latitude: currentPosition.lat,
        zoom: 13,
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            console.log('Position updated:', latitude, longitude);
            setCurrentPosition({
                lat: latitude,
                lng: longitude,
            });
            setViewState((prevState) => ({
                ...prevState,
                longitude,
                latitude,
            }));
        });

        const watchId = navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({
                lat: latitude,
                lng: longitude,
            });
            setViewState((prevState) => ({
                ...prevState,
                longitude,
                latitude,
            }));
        });

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    // Handle the movement of the map by the user
    const handleMove = (evt) => {
        setViewState(evt.viewState); // Update viewState with the new map position
    };
    

    return (
        <Map
            {...viewState} // Use the spread operator to update viewState dynamically
            onMove={handleMove} // Update viewState when the user drags the map
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
        >
            <Marker longitude={currentPosition.lng} latitude={currentPosition.lat} />
        </Map>
    );
};

export default LiveTracking;
