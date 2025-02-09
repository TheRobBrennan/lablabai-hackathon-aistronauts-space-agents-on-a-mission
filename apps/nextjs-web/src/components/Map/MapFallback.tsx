export default function MapFallback() {
    return (
        <div className="relative w-full h-[600px] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <div className="text-center p-6">
                <h3 className="text-lg font-semibold mb-2">Map Configuration Required</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Please configure your Mapbox access token to view satellite imagery.
                </p>
                <a
                    href="https://account.mapbox.com/auth/signup/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    Get a Mapbox Access Token →
                </a>
            </div>
        </div>
    );
} 