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
    providerId: 'o1',
    longDescription: 'WeatherPro Global provides highly accurate, hyperlocal weather forecasts. Our proprietary AI models ingest data from thousands of sources to give you real-time updates on temperature, precipitation, wind speed, and more. Perfect for travel apps, agricultural planning, and hyper-local delivery services.',
    features: [
      'Real-time atmospheric data',
      'Hyperlocal forecasts (1km resolution)',
      'Global coverage for 200,000+ cities',
      'Historical weather data access',
      'Extreme weather alerts via Webhooks'
    ],
    useCases: [
      { title: 'Logistics & Delivery', description: 'Optimize delivery routes based on real-time rain and snow alerts to prevent delays.' },
      { title: 'Travel & Tourism', description: 'Show current weather and 10-day forecasts to help users plan their trips better.' },
      { title: 'Agriculture', description: 'Monitor soil moisture and precise rainfall to maximize crop yield.' }
    ],
    faq: [
      { question: 'How often is the data updated?', answer: 'Our real-time endpoints update every 15 minutes, while forecast data is refreshed every hour.' },
      { question: 'Do you support coordinates?', answer: 'Yes, you can query by city name, zip code, or latitude/longitude coordinates.' }
    ],
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
          { name: 'q', type: 'string', description: 'The location to get weather for. Can be a city name (e.g., "London"), a US zip code, a UK postcode, or latitude/longitude coordinates.', required: true, location: 'query' },
          { name: 'units', type: 'string', description: 'The unit system for measurements. Use "metric" for Celsius/km/h or "imperial" for Fahrenheit/mph.', required: false, location: 'query' },
          { name: 'lang', type: 'string', description: 'The language for the weather condition text. Supports over 40 languages (e.g., "en", "es", "fr").', required: false, location: 'query' }
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
          { name: 'q', type: 'string', description: 'The location to get the forecast for. Supports city names, zip codes, and coordinates.', required: true, location: 'query' },
          { name: 'days', type: 'integer', description: 'The number of days for the forecast. Must be an integer between 1 and 10.', required: true, location: 'query' }
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
          { name: 'q', type: 'string', description: 'The search query to find locations. Can be a city name, partial name, or zip code.', required: true, location: 'query' }
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
    providerId: 'o2',
    longDescription: 'VisionAI OCR is a state-of-the-art optical character recognition service that leverages deep learning to extract text from images and documents with unparalleled accuracy. It handles complex layouts, handwriting, and low-quality scans with ease.',
    features: [
      'Multi-language support (80+ languages)',
      'Handwriting recognition',
      'Table and form structure extraction',
      'High-resolution image processing',
      'Auto-rotation and cleaning'
    ],
    useCases: [
      { title: 'Data Entry Automation', description: 'Automatically extract data from invoices and receipts into your accounting software.' },
      { title: 'Document Digitization', description: 'Convert historical archives and paper documents into searchable digital formats.' },
      { title: 'Identity Verification', description: 'Extract information from passports and IDs for secure user onboarding.' }
    ],
    faq: [
      { question: 'What image formats are supported?', answer: 'We support JPG, PNG, WebP, and multi-page PDFs.' },
      { question: 'Is my data stored?', answer: 'By default, images are processed and deleted immediately. We offer an optional storage service for auditing if required.' }
    ],
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
          { name: 'X-Vision-Priority', type: 'string', description: 'Determines the processing priority of the request. Options: "high", "normal", "low". Default is "normal".', required: false }
        ],
        parameters: [
          { name: 'image_url', type: 'string', description: 'The publicly accessible URL of the image to analyze. Supports JPG, PNG, and WebP formats.', required: true, location: 'body' },
          { name: 'language', type: 'string', description: 'The ISO 639-1 language code to optimize OCR for specific scripts (e.g., "en", "ja").', required: false, location: 'body' },
          { name: 'detect_orientation', type: 'boolean', description: 'Whether to automatically detect and correct the image orientation before processing.', required: false, location: 'body' }
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
          { name: 'image_url', type: 'string', description: 'The URL of the image to process for object detection.', required: true, location: 'body' },
          { name: 'min_confidence', type: 'number', description: 'The minimum confidence score (0.0 to 1.0) for an object to be included in the results.', required: false, location: 'body' }
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
    providerId: 'o3',
    longDescription: 'CryptoTrack Realtime provides institutional-grade cryptocurrency data. We aggregate prices from over 500 exchanges globally to provide a single, clean source of truth for market caps, volume, and 24h price changes. Whether you are building a wallet, an exchange, or a tax tool, CryptoTrack has the data you need.',
    features: [
      '500+ Exchange aggregations',
      'WebSocket & REST support',
      'Historical OHLCV data',
      'Global market cap tracking',
      'Smart contract event monitoring'
    ],
    useCases: [
      { title: 'Portfolio Management', description: 'Real-time tracking of asset values against global averages.' },
      { title: 'Arbitrage Bots', description: 'Low-latency data to find price discrepancies between exchanges.' },
      { title: 'Tax & Compliance', description: 'Full historical audit trail of prices in local fiat currencies.' }
    ],
    faq: [
      { question: 'What exchanges are included?', answer: 'We include major exchanges like Binance, Coinbase, Kraken, and decentralized exchanges like Uniswap.' },
      { question: 'Is the data adjusted for inflation?', answer: 'Data is presented in nominal terms of the base currency selected.' }
    ],
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
          { name: 'vs_currency', type: 'string', description: 'The target currency for price data (e.g., "usd", "eur", "jpy", "gbp").', required: false, location: 'query' },
          { name: 'ids', type: 'string', description: 'A comma-separated list of coin IDs to filter by (e.g., "bitcoin,ethereum"). If omitted, all coins are returned.', required: false, location: 'query' }
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
          { name: 'id', type: 'string', description: 'The unique identifier of the cryptocurrency (e.g., "bitcoin").', required: true, location: 'path' },
          { name: 'days', type: 'integer', description: 'The number of days of historical data to retrieve.', required: true, location: 'query' }
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
    providerId: 'o4',
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
          { name: 'text', type: 'string', description: 'The address or place name to search for (e.g., "1600 Amphitheatre Pkwy, Mountain View, CA").', required: true, location: 'query' },
          { name: 'boundary.country', type: 'string', description: 'Filter results by a specific country using the ISO-3166 alpha-3 code (e.g., "USA", "GBR").', required: false, location: 'query' }
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
          { name: 'lat', type: 'number', description: 'The latitude coordinate of the location.', required: true, location: 'query' },
          { name: 'lon', type: 'number', description: 'The longitude coordinate of the location.', required: true, location: 'query' }
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
  },
  {
    id: '5',
    name: 'TranslateFlow',
    description: 'Neural machine translation for 100+ languages with context awareness.',
    category: 'Language',
    rating: 4.7,
    usageCount: 15400,
    provider: 'LinguistAI',
    providerId: 'o5',
    price: 'Paid',
    freeLimit: 5000,
    pricePerCall: 0.005,
    endpoints: [
      {
        id: 'e6',
        name: 'Translate Text',
        method: 'POST',
        path: '/translate',
        description: 'Translate text from one language to another.',
        parameters: [
          { name: 'text', type: 'string', description: 'The source text to be translated. Maximum 5000 characters per request.', required: true, location: 'body' },
          { name: 'source', type: 'string', description: 'The ISO 639-1 code of the source language. If omitted, the system will auto-detect the language.', required: false, location: 'body' },
          { name: 'target', type: 'string', description: 'The ISO 639-1 code of the target language for translation.', required: true, location: 'body' }
        ],
        sampleResponse: JSON.stringify({ success: true, translatedText: "Hola mundo", detectedSourceLanguage: "en" }, null, 2)
      }
    ],
    versions: ['1.0.0', '2.1.0']
  },
  {
    id: '6',
    name: 'StockPulse API',
    description: 'Real-time stock market data, historical charts, and financial indicators.',
    category: 'Finance',
    rating: 4.5,
    usageCount: 21000,
    provider: 'MarketDataCorp',
    providerId: 'o1',
    price: 'Freemium',
    freeLimit: 100,
    pricePerCall: 0.10,
    endpoints: [
      {
        id: 'e7',
        name: 'Get Quote',
        method: 'GET',
        path: '/quote/{symbol}',
        description: 'Get real-time quote for a stock symbol.',
        parameters: [
          { name: 'symbol', type: 'string', description: 'The stock ticker symbol to retrieve data for (e.g., "AAPL", "MSFT", "GOOGL").', required: true, location: 'path' }
        ],
        sampleResponse: JSON.stringify({ symbol: "AAPL", price: 185.92, change: 1.25, percentChange: 0.68 }, null, 2)
      }
    ],
    versions: ['1.0.0']
  },
  {
    id: '7',
    name: 'ImageGen Pro',
    description: 'Generate high-quality images from text descriptions using stable diffusion.',
    category: 'AI',
    rating: 4.9,
    usageCount: 12000,
    provider: 'CreativeAI',
    providerId: 'o7',
    price: 'Paid',
    freeLimit: 10,
    pricePerCall: 0.25,
    endpoints: [
      {
        id: 'e8',
        name: 'Generate Image',
        method: 'POST',
        path: '/generate',
        description: 'Generate an image from a text prompt.',
        parameters: [
          { name: 'prompt', type: 'string', description: 'A detailed text description of the image you want to generate.', required: true, location: 'body' },
          { name: 'size', type: 'string', description: 'The desired dimensions of the generated image (e.g., "256x256", "512x512", "1024x1024").', required: false, location: 'body' }
        ],
        sampleResponse: JSON.stringify({ success: true, imageUrl: "https://example.com/generated.png" }, null, 2)
      }
    ],
    versions: ['1.0.0', '1.1.0']
  },
  {
    id: '8',
    name: 'HealthMetric API',
    description: 'Track fitness metrics, sleep patterns, and nutritional data.',
    category: 'Health',
    rating: 4.4,
    usageCount: 5600,
    provider: 'FitTech',
    providerId: 'o8',
    price: 'Freemium',
    freeLimit: 1000,
    pricePerCall: 0.02,
    endpoints: [
      {
        id: 'e9',
        name: 'Log Activity',
        method: 'POST',
        path: '/activity',
        description: 'Log a new fitness activity.',
        parameters: [
          { name: 'type', type: 'string', description: 'The type of fitness activity (e.g., "running", "cycling", "swimming").', required: true, location: 'body' },
          { name: 'duration', type: 'number', description: 'The duration of the activity in minutes.', required: true, location: 'body' }
        ],
        sampleResponse: JSON.stringify({ success: true, activityId: "act_123" }, null, 2)
      }
    ],
    versions: ['1.0.0']
  },
  {
    id: '9',
    name: 'SecureAuth MFA',
    description: 'Multi-factor authentication via SMS, Email, and TOTP.',
    category: 'Security',
    rating: 4.8,
    usageCount: 34000,
    provider: 'SafeGuard',
    providerId: 'o9',
    price: 'Paid',
    freeLimit: 100,
    pricePerCall: 0.03,
    endpoints: [
      {
        id: 'e10',
        name: 'Send OTP',
        method: 'POST',
        path: '/otp/send',
        description: 'Send a one-time password.',
        parameters: [
          { name: 'to', type: 'string', description: 'The recipient identifier, such as a phone number for SMS or an email address.', required: true, location: 'body' },
          { name: 'channel', type: 'string', description: 'The delivery channel for the OTP. Supported values: "sms", "email".', required: true, location: 'body' }
        ],
        sampleResponse: JSON.stringify({ success: true, requestId: "req_555" }, null, 2)
      }
    ],
    versions: ['1.0.0', '2.0.0']
  },
  {
    id: '10',
    name: 'NewsWire API',
    description: 'Real-time news headlines and articles from 5000+ sources.',
    category: 'News',
    rating: 4.3,
    usageCount: 18000,
    provider: 'GlobalNews',
    providerId: 'o10',
    price: 'Free',
    freeLimit: 10000,
    pricePerCall: 0,
    endpoints: [
      {
        id: 'e11',
        name: 'Get Headlines',
        method: 'GET',
        path: '/headlines',
        description: 'Get latest news headlines.',
        parameters: [
          { name: 'country', type: 'string', description: 'The 2-letter ISO 3166-1 country code to filter news by (e.g., "us", "gb", "in").', required: false, location: 'query' },
          { name: 'category', type: 'string', description: 'The news category to filter by (e.g., "business", "technology", "sports").', required: false, location: 'query' }
        ],
        sampleResponse: JSON.stringify({ status: "ok", totalResults: 38, articles: [] }, null, 2)
      }
    ],
    versions: ['1.0.0']
  }
];

// In-memory store for subscriptions to simulate persistence during the session
let userSubscriptions: UserSubscription[] = [
  {
    apiId: '1',
    apiName: 'WeatherPro Global',
    apiProvider: 'MeteorLogic',
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
  getOrgApis: async (orgName: string): Promise<API[]> => {
    await new Promise(r => setTimeout(r, 700));
    return MOCK_APIS.filter(api => api.provider === orgName);
  },
  subscribeToApi: async (apiId: string): Promise<UserSubscription> => {
    await new Promise(r => setTimeout(r, 1000));
    
    // Check if already subscribed
    const existing = userSubscriptions.find(s => s.apiId === apiId);
    if (existing) return existing;

    const api = MOCK_APIS.find(a => a.id === apiId);
    if (!api) throw new Error('API not found');

    const randomKey = 'nx_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newSubscription: UserSubscription = {
      apiId,
      apiName: api.name,
      apiProvider: api.provider,
      apiKey: randomKey,
      status: 'active',
      usage: 0,
      subscribedAt: new Date().toISOString().split('T')[0]
    };
    
    userSubscriptions.push(newSubscription);
    return newSubscription;
  }
};
