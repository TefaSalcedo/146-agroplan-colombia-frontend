// API Configuration
// NEXT_PUBLIC_API_URL is expected to include the /api/v1 prefix.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Base URL without the API path prefix, used for static assets (e.g. crop images).
function getApiBaseUrl(): string {
  try {
    return new URL(API_URL).origin
  } catch {
    return 'http://localhost:8000'
  }
}

export const API_BASE_URL = getApiBaseUrl()

// Simple in-memory cache for GET requests
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Convert snake_case API keys to camelCase for the frontend
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function convertKeysToCamelCase(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase)
  }

  if (obj !== null && typeof obj === "object") {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      result[toCamelCase(key)] = convertKeysToCamelCase(value)
    }
    return result
  }

  return obj
}

// Error handling
export class ApiError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public response?: any
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Retry with exponential backoff
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit,
  maxRetries = 3,
  baseDelay = 1000
): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options)
      return response
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error("Max retries exceeded")
}

// HTTP Client with proper error handling and typing
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  // Check cache for GET requests
  if (!options.method || options.method === "GET") {
    const cacheKey = `${url}:${JSON.stringify(defaultOptions)}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data as T
    }
  }

  try {
    const response = await fetchWithRetry(url, defaultOptions)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.detail || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      )
    }

    const data = await response.json()
    const convertedData = convertKeysToCamelCase(data) as T

    // Cache successful GET responses
    if (!options.method || options.method === "GET") {
      const cacheKey = `${url}:${JSON.stringify(defaultOptions)}`
      cache.set(cacheKey, { data: convertedData, timestamp: Date.now() })
    }

    return convertedData
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Unknown error occurred"
    )
  }
}

export const API_CONFIG = {
  baseUrl: API_URL,
}

// Function to clear cache (useful for testing or manual refresh)
export function clearApiCache(): void {
  cache.clear()
}
