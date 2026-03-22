import { API, UserSubscription } from '../types/index';

// Mock data
const MOCK_APIS: API[] = [
  {
    id: '1',
    name: 'WeatherPro Global',
    description: 'Real-time weather data for over 200,000 cities worldwide with 99.9% uptime.',
    category: 'Weather',
    rating: 4.8,
    usageCount: 12500,
    provider: 'MeteorLogic',
    price: 'Freemium',
    freeLimit: 1000,
    pricePerCall: 0.01,
    endpoints: [
      { 
        id: 'e1', 
        name: 'Get Current Weather',
        method: 'GET', 
        path: '/current', 
        description: 'Get current weather for a location with detailed atmospheric data.',
        parameters: [
          { name: 'q', type: 'string', description: 'City name or coordinates', required: true, location: 'query' },
          { name: 'units', type: 'string', description: 'metric or imperial', required: false, location: 'query' },
          { name: 'lang', type: 'string', description: 'Language code (e.g., en, fr, de)', required: false, location: 'query' }
        ],
        sampleResponse: JSON.stringify({
          success: true,
          data: {
            location: {
              name: "London",
              region: "City of London",
              country: "United Kingdom",
              lat: 51.52,
              lon: -0.11,
              timezone_id: "Europe/London",
              localtime: "2026-03-22 18:00",
              localtime_epoch: 1774202400
            },
            current: {
              last_updated_epoch: 1774202400,
              last_updated: "2026-03-22 18:00",
              temp_c: 18.5,
              temp_f: 65.3,
              is_day: 1,
              condition: {
                text: "Partly Cloudy",
                icon: "//cdn.weatherpro.com/weather/64x64/day/116.png",
                code: 1003
              },
              wind_mph: 7.7,
              wind_kph: 12.4,
              wind_degree: 240,
              wind_dir: "WSW",
              pressure_mb: 1012.0,
              pressure_in: 29.88,
              precip_mm: 0.0,
              precip_in: 0.0,
              humidity: 65,
              cloud: 25,
              feelslike_c: 18.5,
              feelslike_f: 65.3,
              vis_km: 10.0,
              vis_miles: 6.0,
              uv: 5.0,
              gust_mph: 10.5,
              gust_kph: 16.9,
              air_quality: {
                co: 230.3,
                no2: 12.5,
                o3: 45.1,
                so2: 2.1,
                pm2_5: 5.2,
                pm10: 8.4,
                "us-epa-index": 1,
                "gb-defra-index": 1
              }
            }
          }
        }, null, 2)
      },
      { 
        id: 'e2', 
        name: 'Get 7-Day Forecast',
        method: 'GET', 
        path: '/forecast', 
        description: 'Get 7-day forecast for a location including hourly data and astronomical information.',
        parameters: [
          { name: 'q', type: 'string', description: 'City name or coordinates', required: true, location: 'query' },
          { name: 'days', type: 'integer', description: 'Number of days (1-10)', required: true, location: 'query' }
        ],
        sampleResponse: JSON.stringify({
          success: true,
          data: {
            location: { name: "London", country: "United Kingdom" },
            forecast: {
              forecastday: [
                {
                  date: "2026-03-23",
                  date_epoch: 1774224000,
                  day: {
                    maxtemp_c: 19.2,
                    mintemp_c: 11.5,
                    avgtemp_c: 15.4,
                    maxwind_kph: 15.0,
                    totalprecip_mm: 0.0,
                    totalsnow_cm: 0.0,
                    avgvis_km: 10.0,
                    avghumidity: 62.0,
                    daily_will_it_rain: 0,
                    daily_chance_of_rain: 0,
                    daily_will_it_snow: 0,
                    daily_chance_of_snow: 0,
                    condition: { text: "Sunny", icon: "//cdn.weatherpro.com/64x64/day/113.png" },
                    uv: 6.0
                  },
                  astro: {
                    sunrise: "06:02 AM",
                    sunset: "06:15 PM",
                    moonrise: "08:45 AM",
                    moonset: "11:30 PM",
                    moon_phase: "Waxing Gibbous",
                    moon_illumination: "82"
                  },
                  hour: [
                    { time: "2026-03-23 00:00", temp_c: 12.1, condition: { text: "Clear" } },
                    { time: "2026-03-23 01:00", temp_c: 11.8, condition: { text: "Clear" } },
                    { time: "2026-03-23 02:00", temp_c: 11.5, condition: { text: "Clear" } }
                  ]
                }
              ]
            }
          }
        }, null, 2)
      },
      {
        id: 'e1-2',
        name: 'Search Locations',
        method: 'GET',
        path: '/search', 
        description: 'Search for city locations by name, zip code, or coordinates.',
        parameters: [
          { name: 'q', type: 'string', description: 'Search query', required: true, location: 'query' }
        ],
        sampleResponse: JSON.stringify({
          success: true,
          results: [
            { id: 2643743, name: "London", region: "City of London", country: "United Kingdom", lat: 51.5085, lon: -0.1257, url: "london-city-of-london-united-kingdom" },
            { id: 2801268, name: "London", region: "Ontario", country: "Canada", lat: 42.9834, lon: -81.233, url: "london-ontario-canada" },
            { id: 4119617, name: "London", region: "Kentucky", country: "United States of America", lat: 37.129, lon: -84.0833, url: "london-kentucky-united-states-of-america" }
          ]
        }, null, 2)
      }
    ],
    versions: ['1.0.0', '1.1.0', '2.0.0']
  },
  {
    id: '2',
    name: 'VisionAI OCR',
    description: 'Extract text from images with high precision using advanced neural networks.',
    category: 'Machine Learning',
    rating: 4.9,
    usageCount: 8900,
    provider: 'DeepVision',
    price: 'Paid',
    freeLimit: 100,
    pricePerCall: 0.05,
    endpoints: [
      { 
        id: 'e3', 
        name: 'Analyze Image',
        method: 'POST', 
        path: '/analyze', 
        description: 'Analyze image and extract text with detailed layout analysis and confidence scores.',
        headers: [
          { name: 'X-Vision-Priority', type: 'string', description: 'Priority level (high, normal, low)', required: false }
        ],
        parameters: [
          { name: 'image_url', type: 'string', description: 'Publicly accessible URL of the image', required: true, location: 'body' },
          { name: 'language', type: 'string', description: 'Language code for OCR', required: false, location: 'body' },
          { name: 'detect_orientation', type: 'boolean', description: 'Automatically detect image orientation', required: false, location: 'body' }
        ],
        sampleRequest: JSON.stringify({
          image_url: "https://example.com/receipt.jpg",
          language: "en",
          detect_orientation: true
        }, null, 2),
        sampleResponse: JSON.stringify({
          success: true,
          request_id: "v-ocr-987654321",
          processing_time_ms: 450,
          data: {
            text: "APIVUE API Marketplace Receipt\nDate: 2026-03-22\nTotal: $125.50\nTax: $10.04",
            confidence: 0.992,
            language: "en",
            orientation: 0,
            pages: [
              {
                page_number: 1,
                width: 1200,
                height: 1800,
                blocks: [
                  { 
                    id: "b1",
                    type: "header",
                    text: "APIVUE API Marketplace", 
                    box: [100, 100, 500, 150],
                    confidence: 0.998,
                    lines: [
                      { text: "APIVUE API Marketplace", confidence: 0.998 }
                    ]
                  },
                  { 
                    id: "b2",
                    type: "content",
                    text: "Receipt", 
                    box: [100, 160, 200, 200],
                    confidence: 0.995
                  },
                  {
                    id: "b3",
                    type: "table",
                    text: "Total: $125.50",
                    box: [100, 400, 400, 450],
                    confidence: 0.985
                  }
                ]
              }
            ],
            metadata: {
              image_format: "jpeg",
              image_size: "1.2MB",
              dpi: 300
            }
          }
        }, null, 2)
      },
      {
        id: 'e3-2',
        name: 'Detect Objects',
        method: 'POST',
        path: '/detect',
        description: 'Detect and classify objects within an image.',
        parameters: [
          { name: 'image_url', type: 'string', description: 'URL of the image', required: true, location: 'body' },
          { name: 'min_confidence', type: 'number', description: 'Minimum confidence threshold (0-1)', required: false, location: 'body' }
        ],
        sampleResponse: JSON.stringify({
          success: true,
          data: {
            objects: [
              { label: "person", confidence: 0.98, box: [50, 50, 200, 400] },
              { label: "laptop", confidence: 0.95, box: [250, 300, 500, 600] },
              { label: "coffee cup", confidence: 0.88, box: [450, 400, 500, 450] }
            ]
          }
        }, null, 2)
      }
    ],
    versions: ['1.0.0', '1.2.4', '2.0.1']
  },
  {
    id: '3',
    name: 'CryptoTrack Realtime',
    description: 'Live cryptocurrency prices, market cap, and volume across 500+ exchanges.',
    category: 'Finance',
    rating: 4.7,
    usageCount: 45000,
    provider: 'CoinData',
    price: 'Free',
    freeLimit: 50000,
    pricePerCall: 0,
    endpoints: [
      { 
        id: 'e4', 
        name: 'Get All Prices',
        method: 'GET', 
        path: '/prices', 
        description: 'Get latest prices for all major cryptocurrencies with market cap and 24h change.',
        parameters: [
          { name: 'vs_currency', type: 'string', description: 'Target currency (usd, eur, jpy)', required: false, location: 'query' },
          { name: 'ids', type: 'string', description: 'Comma separated list of coin IDs', required: false, location: 'query' }
        ],
        sampleResponse: JSON.stringify({
          success: true,
          timestamp: "2026-03-22T18:50:00Z",
          base_currency: "usd",
          data: [
            { id: "bitcoin", symbol: "btc", name: "Bitcoin", current_price: 65432.10, market_cap: 1280000000000, price_change_24h: 2.5, total_volume: 35000000000 },
            { id: "ethereum", symbol: "eth", name: "Ethereum", current_price: 3456.78, market_cap: 415000000000, price_change_24h: -1.2, total_volume: 15000000000 },
            { id: "solana", symbol: "sol", name: "Solana", current_price: 145.20, market_cap: 65000000000, price_change_24h: 5.8, total_volume: 4000000000 },
            { id: "cardano", symbol: "ada", name: "Cardano", current_price: 0.45, market_cap: 16000000000, price_change_24h: 0.5, total_volume: 500000000 },
            { id: "polkadot", symbol: "dot", name: "Polkadot", current_price: 7.89, market_cap: 11000000000, price_change_24h: -0.8, total_volume: 200000000 }
          ]
        }, null, 2)
      },
      {
        id: 'e4-2',
        name: 'Get Market History',
        method: 'GET',
        path: '/history',
        description: 'Get historical market data for a specific coin.',
        parameters: [
          { name: 'id', type: 'string', description: 'Coin ID', required: true, location: 'path' },
          { name: 'days', type: 'integer', description: 'Number of days back', required: true, location: 'query' }
        ],
        sampleResponse: JSON.stringify({
          success: true,
          data: {
            id: "bitcoin",
            prices: [
              [1774116000, 64000.5],
              [1774120000, 64200.8],
              [1774124000, 64500.2]
            ],
            market_caps: [
              [1774116000, 1250000000000],
              [1774120000, 1255000000000]
            ]
          }
        }, null, 2)
      }
    ],
    versions: ['1.0.0', '1.1.11', '2.0.2']
  },
  {
    id: '4',
    name: 'GeoSearch Pro',
    description: 'High-speed geocoding and reverse geocoding for global addresses.',
    category: 'Location',
    rating: 4.6,
    usageCount: 3200,
    provider: 'MapStack',
    price: 'Freemium',
    freeLimit: 500,
    pricePerCall: 0.02,
    endpoints: [
      { 
        id: 'e5', 
        name: 'Forward Geocoding',
        method: 'GET', 
        path: '/search', 
        description: 'Search for coordinates by address with detailed components.',
        parameters: [
          { name: 'text', type: 'string', description: 'Address to search for', required: true, location: 'query' },
          { name: 'boundary.country', type: 'string', description: 'ISO-3166 alpha-3 country code', required: false, location: 'query' }
        ],
        sampleResponse: JSON.stringify({
          success: true,
          data: {
            query: "1600 Amphitheatre Parkway, Mountain View, CA",
            results: [
              {
                id: "addr_12345",
                name: "1600 Amphitheatre Parkway",
                street: "Amphitheatre Parkway",
                housenumber: "1600",
                postalcode: "94043",
                city: "Mountain View",
                state: "California",
                state_code: "CA",
                country: "United States",
                country_code: "USA",
                lat: 37.422388,
                lon: -122.084106,
                confidence: 1.0,
                match_type: "exact",
                formatted_address: "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA",
                bbox: [-122.085, 37.421, -122.083, 37.423]
              }
            ]
          }
        }, null, 2)
      },
      {
        id: 'e5-2',
        name: 'Reverse Geocoding',
        method: 'GET',
        path: '/reverse',
        description: 'Get address information from coordinates.',
        parameters: [
          { name: 'lat', type: 'number', description: 'Latitude', required: true, location: 'query' },
          { name: 'lon', type: 'number', description: 'Longitude', required: true, location: 'query' }
        ],
        sampleResponse: JSON.stringify({
          success: true,
          data: {
            lat: 37.422,
            lon: -122.084,
            address: {
              name: "Googleplex",
              road: "Amphitheatre Parkway",
              city: "Mountain View",
              county: "Santa Clara County",
              state: "California",
              postcode: "94043",
              country: "United States"
            }
          }
        }, null, 2)
      }
    ],
    versions: ['1.0.0', '1.5.0']
  }
];

// In-memory store for subscriptions to simulate persistence during the session
let userSubscriptions: UserSubscription[] = [
  {
    apiId: '1',
    apiKey: 'nx_live_51M...9a2',
    status: 'active',
    usage: 450,
    subscribedAt: '2024-01-15'
  }
];

export const apiClient = {
  getApis: async () => {
    await new Promise(r => setTimeout(r, 800));
    return MOCK_APIS;
  },
  getApiById: async (id: string) => {
    await new Promise(r => setTimeout(r, 500));
    return MOCK_APIS.find(api => api.id === id);
  },
  getUserSubscriptions: async (): Promise<UserSubscription[]> => {
    await new Promise(r => setTimeout(r, 600));
    return [...userSubscriptions];
  },
  subscribeToApi: async (apiId: string): Promise<UserSubscription> => {
    await new Promise(r => setTimeout(r, 1000));
    
    // Check if already subscribed
    const existing = userSubscriptions.find(s => s.apiId === apiId);
    if (existing) return existing;

    const randomKey = 'nx_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newSubscription: UserSubscription = {
      apiId,
      apiKey: randomKey,
      status: 'active',
      usage: 0,
      subscribedAt: new Date().toISOString().split('T')[0]
    };
    
    userSubscriptions.push(newSubscription);
    return newSubscription;
  }
};
