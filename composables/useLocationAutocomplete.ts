interface GeoapifyFeature {
  properties: {
    formatted: string;
    country?: string;
    city?: string;
    state?: string;
    lon?: number;
    lat?: number;
  };
}

interface GeoapifyResponse {
  features?: GeoapifyFeature[];
}

export async function fetchLocationSuggestions(query: string): Promise<string[]> {
  if (!query || query.length < 3) return []

  // ✅ Este uso debe estar DENTRO de la función
  const config = useRuntimeConfig()
  const apiKey = config.public.geoapifyKey

  const response = await fetch(
    `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${apiKey}`
  )

  const data: GeoapifyResponse = await response.json()

  if (!data.features || !Array.isArray(data.features)) {
    console.warn('⚠️ Geoapify respondió sin "features":', data)
    return []
  }

  return data.features.map(f => {
  const props = f.properties
  const city = props.city || props.state || props.name || props.formatted
  const country = props.country || ''
  return `${city}, ${country}`.trim()
})
}
