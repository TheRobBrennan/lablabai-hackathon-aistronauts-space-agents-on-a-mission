'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapFallback from './MapFallback';
import 'mapbox-gl/dist/mapbox-gl.css';

// Default coordinates (fallback if no stored location)
const DEFAULT_LNG = -122.4194;  // San Francisco
const DEFAULT_LAT = 37.7749;
const DEFAULT_ZOOM = 9;

// Add to the existing constants
const DEFAULT_VIEW = {
    lng: DEFAULT_LNG,
    lat: DEFAULT_LAT,
    zoom: DEFAULT_ZOOM,
    bearing: 0,
    pitch: 0,
} as const;

const AVAILABLE_STYLES = {
    'Satellite': 'mapbox://styles/mapbox/satellite-v9',
    'Streets': 'mapbox://styles/mapbox/streets-v12',
    'Outdoors': 'mapbox://styles/mapbox/outdoors-v12',
    'Light': 'mapbox://styles/mapbox/light-v11',
    'Dark': 'mapbox://styles/mapbox/dark-v11',
} as const;

// LocalStorage keys
const STORAGE_KEYS = {
    lng: 'map_last_lng',
    lat: 'map_last_lat',
    zoom: 'map_last_zoom',
    style: 'map_style',
} as const;

export default function Map() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [hasToken, setHasToken] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentStyle, setCurrentStyle] = useState<string>(
        typeof window !== 'undefined'
            ? localStorage.getItem(STORAGE_KEYS.style) || AVAILABLE_STYLES.Satellite
            : AVAILABLE_STYLES.Satellite
    );

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

    // Helper function to preserve map state during style changes
    const switchMapStyle = async (map: mapboxgl.Map, styleUri: string) => {
        return new Promise<void>((resolve) => {
            const center = map.getCenter();
            const zoom = map.getZoom();
            const bearing = map.getBearing();
            const pitch = map.getPitch();

            // Remove previous listeners to avoid duplicates
            map.off('style.load');

            // Set up the style load handler before changing the style
            map.once('style.load', () => {
                map.setCenter(center);
                map.setZoom(zoom);
                map.setBearing(bearing);
                map.setPitch(pitch);
                resolve();
            });

            // Then change the style
            map.setStyle(styleUri);
        });
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

                const { lng, lat, zoom } = getStoredLocation();

                map.current = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: currentStyle,
                    center: [lng, lat],
                    zoom: zoom,
                    preserveDrawingBuffer: true, // Helps with style switches
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

                // Add style switcher
                const styleSelect = document.createElement('select');
                styleSelect.className = 'mapboxgl-ctrl mapboxgl-ctrl-group absolute top-0 left-0 m-3 p-2 bg-white dark:bg-gray-800 rounded shadow-lg text-sm';

                Object.entries(AVAILABLE_STYLES).forEach(([label, uri]) => {
                    const option = document.createElement('option');
                    option.value = uri;
                    option.text = label;
                    option.selected = uri === currentStyle;
                    styleSelect.appendChild(option);
                });

                styleSelect.addEventListener('change', async (e) => {
                    const newStyle = (e.target as HTMLSelectElement).value;
                    if (map.current) {
                        try {
                            await switchMapStyle(map.current, newStyle);
                            setCurrentStyle(newStyle);
                            localStorage.setItem(STORAGE_KEYS.style, newStyle);
                        } catch (err) {
                            console.error('Style switch failed:', err);
                            setError('Failed to switch map style');
                        }
                    }
                });

                mapContainer.current.appendChild(styleSelect);

                // Add scale bar
                map.current.addControl(
                    new mapboxgl.ScaleControl({
                        maxWidth: 150,
                        unit: 'metric'
                    }),
                    'bottom-left'
                );

                // Add fullscreen control
                map.current.addControl(
                    new mapboxgl.FullscreenControl({
                        container: mapContainer.current
                    }),
                    'top-right'
                );

                // Create custom reset view control
                class ResetViewControl {
                    _map?: mapboxgl.Map;
                    _container: HTMLDivElement;

                    onAdd(map: mapboxgl.Map) {
                        this._map = map;
                        this._container = document.createElement('div');
                        this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

                        const button = document.createElement('button');
                        button.className = 'mapboxgl-ctrl-reset-view';
                        button.type = 'button';
                        button.setAttribute('aria-label', 'Reset map view');

                        // Add home icon using HTML entity
                        button.innerHTML = `
                            <span style="font-size: 18px;" aria-hidden="true">⌂</span>
                        `;

                        button.addEventListener('click', () => {
                            if (this._map) {
                                this._map.flyTo({
                                    center: [DEFAULT_VIEW.lng, DEFAULT_VIEW.lat],
                                    zoom: DEFAULT_VIEW.zoom,
                                    bearing: DEFAULT_VIEW.bearing,
                                    pitch: DEFAULT_VIEW.pitch,
                                    duration: 1500,
                                });
                            }
                        });

                        this._container.appendChild(button);
                        return this._container;
                    }

                    onRemove() {
                        this._container.parentNode?.removeChild(this._container);
                    }
                }

                // Add reset view control
                map.current.addControl(new ResetViewControl(), 'top-right');

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
            if (map.current) {
                map.current.off('style.load');
                map.current.remove();
            }
        };
    }, [hasToken]);  // Remove currentStyle dependency

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