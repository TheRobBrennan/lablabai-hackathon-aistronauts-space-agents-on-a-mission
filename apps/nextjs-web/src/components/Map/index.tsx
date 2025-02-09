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
    style: 'map_style',
} as const;

// Default view state for reset functionality
const DEFAULT_VIEW = {
    center: [DEFAULT_LNG, DEFAULT_LAT] as [number, number],
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
        return new Promise<void>((resolve, reject) => {
            try {
                const currentCenter = map.getCenter();
                const currentZoom = map.getZoom();
                const currentBearing = map.getBearing();
                const currentPitch = map.getPitch();

                const styleLoadHandler = () => {
                    try {
                        requestAnimationFrame(() => {
                            map.setCenter(currentCenter);
                            map.setZoom(currentZoom);
                            map.setBearing(currentBearing);
                            map.setPitch(currentPitch);
                            resolve();
                        });
                    } catch (err) {
                        reject(err);
                    }
                };

                // Clean up existing handlers
                if (map.loaded()) {
                    map.off('style.load', styleLoadHandler);
                }

                // Set up new handler
                map.once('style.load', styleLoadHandler);

                // Change the style
                map.setStyle(styleUri);

            } catch (err) {
                reject(err);
            }
        });
    };

    // Separate useEffect for map initialization
    useEffect(() => {
        if (!hasToken || !currentStyle) return;

        let mapInstance: mapboxgl.Map | null = null;

        const initializeMap = () => {
            if (!mapContainer.current || mapInstance) return;

            try {
                const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
                mapboxgl.accessToken = token;

                const { lng, lat, zoom } = getStoredLocation();

                mapInstance = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: currentStyle,
                    center: [lng, lat],
                    zoom: zoom,
                    preserveDrawingBuffer: true,
                });

                map.current = mapInstance;

                // Wait for map to load before adding controls
                mapInstance.on('load', () => {
                    // Add navigation controls
                    mapInstance?.addControl(new mapboxgl.NavigationControl(), 'top-right');

                    // Add geolocation control
                    const geolocateControl = new mapboxgl.GeolocateControl({
                        positionOptions: {
                            enableHighAccuracy: true
                        },
                        trackUserLocation: true,
                        showUserHeading: true
                    });

                    mapInstance?.addControl(geolocateControl, 'top-right');

                    // Add fullscreen control
                    mapInstance?.addControl(
                        new mapboxgl.FullscreenControl({
                            container: mapContainer.current
                        }),
                        'top-right'
                    );

                    // Add scale control
                    mapInstance?.addControl(
                        new mapboxgl.ScaleControl({
                            maxWidth: 150,
                            unit: 'metric'
                        }),
                        'bottom-left'
                    );

                    // Add style switcher
                    if (mapContainer.current) {
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
                            if (mapInstance) {
                                try {
                                    await switchMapStyle(mapInstance, newStyle);
                                    setCurrentStyle(newStyle);
                                    localStorage.setItem(STORAGE_KEYS.style, newStyle);
                                } catch (err) {
                                    console.error('Style switch failed:', err);
                                    setError('Failed to switch map style');
                                    styleSelect.value = currentStyle;
                                }
                            }
                        });

                        mapContainer.current.appendChild(styleSelect);
                    }

                    // Add reset view control
                    class ResetViewControl {
                        _map?: mapboxgl.Map;
                        _container!: HTMLDivElement;

                        constructor() {
                            this._container = document.createElement('div');
                            this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
                        }

                        onAdd(map: mapboxgl.Map) {
                            this._map = map;

                            const button = document.createElement('button');
                            button.className = 'mapboxgl-ctrl-reset-view';
                            button.type = 'button';
                            button.setAttribute('aria-label', 'Reset map view');

                            button.innerHTML = `
                                <span style="font-size: 18px;" aria-hidden="true">⌂</span>
                            `;

                            button.addEventListener('click', () => {
                                if (this._map) {
                                    this._map.flyTo({
                                        ...DEFAULT_VIEW,
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
                    mapInstance?.addControl(new ResetViewControl(), 'top-right');

                    // Trigger geolocation if no stored location
                    if (!localStorage.getItem(STORAGE_KEYS.lat)) {
                        geolocateControl.trigger();
                    }
                });

                // Store location when map moves
                mapInstance.on('moveend', () => {
                    if (!mapInstance) return;
                    const center = mapInstance.getCenter();
                    const zoom = mapInstance.getZoom();

                    localStorage.setItem(STORAGE_KEYS.lng, center.lng.toString());
                    localStorage.setItem(STORAGE_KEYS.lat, center.lat.toString());
                    localStorage.setItem(STORAGE_KEYS.zoom, zoom.toString());
                });

                mapInstance.on('error', (e) => {
                    console.error('Mapbox error:', e);
                    setError(e.error?.message || 'An error occurred with the map');
                });

            } catch (err) {
                console.error('Map initialization error:', err);
                setError(err instanceof Error ? err.message : 'Failed to initialize map');
            }
        };

        requestAnimationFrame(initializeMap);

        return () => {
            if (mapInstance) {
                mapInstance.remove();
            }
            map.current = null;
        };
    }, [hasToken, currentStyle]);

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