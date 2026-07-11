// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

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

  try {
    const response = await fetch(url, defaultOptions)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.detail || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      )
    }

    const data = await response.json()
    return convertKeysToCamelCase(data) as T
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
