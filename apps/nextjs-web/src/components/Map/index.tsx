'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapFallback from './MapFallback';
import 'mapbox-gl/dist/mapbox-gl.css';

// Default coordinates (fallback if no stored location)
const DEFAULT_LNG = -122.4194;  // San Francisco
const DEFAULT_LAT = 37.7749;
const DEFAULT_ZOOM = 9;

// LocalStorage keys
const STORAGE_KEYS = {
    lng: 'map_last_lng',
    lat: 'map_last_lat',
    zoom: 'map_last_zoom',
} as const;

export default function Map() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [hasToken, setHasToken] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get stored coordinates or use defaults
    const getStoredLocation = () => {
        if (typeof window === 'undefined') return { lng: DEFAULT_LNG, lat: DEFAULT_LAT, zoom: DEFAULT_ZOOM };

        return {
            lng: parseFloat(localStorage.getItem(STORAGE_KEYS.lng) || '') || DEFAULT_LNG,
            lat: parseFloat(localStorage.getItem(STORAGE_KEYS.lat) || '') || DEFAULT_LAT,
            zoom: parseFloat(localStorage.getItem(STORAGE_KEYS.zoom) || '') || DEFAULT_ZOOM,
        };
    };

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

                const { lng, lat, zoom } = getStoredLocation();

                map.current = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: 'mapbox://styles/mapbox/satellite-v9',
                    center: [lng, lat],
                    zoom: zoom,
                });

                // Add navigation controls (zoom, compass, etc.)
                map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

                // Add geolocation control
                const geolocateControl = new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    trackUserLocation: true,
                    showUserHeading: true
                });

                map.current.addControl(geolocateControl, 'top-right');

                // Store location when map moves
                map.current.on('moveend', () => {
                    if (!map.current) return;
                    const center = map.current.getCenter();
                    const zoom = map.current.getZoom();

                    localStorage.setItem(STORAGE_KEYS.lng, center.lng.toString());
                    localStorage.setItem(STORAGE_KEYS.lat, center.lat.toString());
                    localStorage.setItem(STORAGE_KEYS.zoom, zoom.toString());
                });

                // Trigger geolocation on first load if no stored location
                map.current.on('load', () => {
                    console.log('Map loaded successfully');
                    if (!localStorage.getItem(STORAGE_KEYS.lat)) {
                        geolocateControl.trigger();
                    }
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
    }, [hasToken]);

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