const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

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