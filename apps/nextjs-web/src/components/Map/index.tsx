'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapFallback from './MapFallback';
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
    const [hasToken, setHasToken] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // First useEffect to check token and set state
    useEffect(() => {
        const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        console.log('Token available:', !!token);
        setHasToken(Boolean(token));
    }, []);

    // Separate useEffect for map initialization
    useEffect(() => {
        if (!hasToken) return;

        const initializeMap = () => {
            if (!mapContainer.current || map.current) {
                console.log('Container check:', {
                    hasContainer: !!mapContainer.current,
                    hasMap: !!map.current
                });
                return;
            }

            try {
                const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
                mapboxgl.accessToken = token;

                map.current = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: 'mapbox://styles/mapbox/satellite-v9',
                    center: [lng, lat],
                    zoom: zoom,
                });

                // Add navigation controls (zoom, compass, etc.)
                map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

                // Add geolocation control
                map.current.addControl(
                    new mapboxgl.GeolocateControl({
                        positionOptions: {
                            enableHighAccuracy: true
                        },
                        trackUserLocation: true,
                        showUserHeading: true
                    }),
                    'top-right'
                );

                map.current.on('load', () => {
                    console.log('Map loaded successfully');
                });

                map.current.on('error', (e) => {
                    console.error('Mapbox error:', e);
                    setError(e.error.message);
                });

            } catch (err) {
                console.error('Map initialization error:', err);
                setError(err instanceof Error ? err.message : 'Failed to initialize map');
            }
        };

        requestAnimationFrame(initializeMap);

        return () => {
            map.current?.remove();
        };
    }, [hasToken, lng, lat, zoom]);

    if (error) {
        return (
            <div className="relative w-full h-[600px] rounded-lg overflow-hidden bg-red-50 dark:bg-red-900/10 flex items-center justify-center">
                <div className="text-center p-6">
                    <h3 className="text-lg font-semibold mb-2 text-red-600 dark:text-red-400">Map Error</h3>
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    if (!hasToken) {
        return <MapFallback />;
    }

    return (
        <div className="relative w-full h-[600px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    );
} 