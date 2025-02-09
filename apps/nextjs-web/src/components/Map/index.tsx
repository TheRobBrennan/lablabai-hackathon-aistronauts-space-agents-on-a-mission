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
    const [isLocating, setIsLocating] = useState(false);

    // First useEffect to check token and set state
    useEffect(() => {
        const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        console.log('Token available:', !!token);
        setHasToken(Boolean(token));
    }, []);

    const centerOnUserLocation = () => {
        setIsLocating(true);
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (map.current) {
                    map.current.flyTo({
                        center: [position.coords.longitude, position.coords.latitude],
                        zoom: 12,
                        essential: true
                    });
                }
                setIsLocating(false);
            },
            (error) => {
                setError(`Location error: ${error.message}`);
                setIsLocating(false);
            }
        );
    };

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
            <button
                onClick={centerOnUserLocation}
                disabled={isLocating}
                className="absolute bottom-4 right-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-md shadow-lg 
                         text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isLocating ? 'Locating...' : 'Center on My Location'}
            </button>
        </div>
    );
} 