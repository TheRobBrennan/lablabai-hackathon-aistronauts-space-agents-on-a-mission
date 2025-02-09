const API_PORT = process.env.NEXT_PUBLIC_API_PORT || '8000'
const API_HOST = process.env.NEXT_PUBLIC_API_HOST || 'localhost'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `http://${API_HOST}:${API_PORT}`

export async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    })

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
    }

    return response.json()
}

// API endpoints
export const api = {
    health: () => fetchFromAPI('/health'),
    satellite: {
        info: () => fetchFromAPI('/api/v1/satellite'),
    }
} 