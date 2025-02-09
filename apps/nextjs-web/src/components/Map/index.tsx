'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Default coordinates (we can update these later)
const INITIAL_LNG = -122.4194;  // San Francisco
const INITIAL_LAT = 37.7749;
const INITIAL_ZOOM = 9;

export default function Map() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng] = useState(INITIAL_LNG);
    const [lat] = useState(INITIAL_LAT);
    const [zoom] = useState(INITIAL_ZOOM);

    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        if (!token) {
            console.error('Mapbox token not found');
            return;
        }

        mapboxgl.accessToken = token;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/satellite-v9', // Satellite imagery
            center: [lng, lat],
            zoom: zoom,
        });

        // Cleanup on unmount
        return () => {
            map.current?.remove();
        };
    }, [lng, lat, zoom]);

    return (
        <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    );
} 