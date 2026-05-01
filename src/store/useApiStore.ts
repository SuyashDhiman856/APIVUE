import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API, UserSubscription } from '../types';

interface ApiState {
  apis: API[];
  subscriptions: Record<string, UserSubscription[]>; // userId -> subscriptions
  
  // Actions for APIs
  addApi: (api: API) => void;
  updateApi: (id: string, updates: Partial<API>) => void;
  deleteApi: (id: string) => void;
  
  // Actions for Subscriptions
  subscribeToApi: (userId: string, api: API) => void;
  unsubscribeFromApi: (userId: string, apiId: string) => void;
  
  // Getters
  getApisByProvider: (providerId: string) => API[];
  getSubscriptionsByUser: (userId: string) => UserSubscription[];
}

export const useApiStore = create<ApiState>()(
  persist(
    (set, get) => ({
      apis: [
        {
          id: '1',
          name: 'WeatherPro Global',
          description: 'Real-time weather data for over 200,000 cities worldwide with 99.9% uptime.',
          category: 'Weather',
          rating: 4.8,
          usageCount: 12500,
          provider: 'MeteorLogic Inc.',
          providerId: 'o1',
          price: 'Freemium',
          freeLimit: 1000,
          pricePerCall: 0.01,
          endpoints: [
            { id: 'e1', name: 'Current Weather', method: 'GET', path: '/current', description: 'Current weather' },
            { id: 'e2', name: '7-Day Forecast', method: 'GET', path: '/forecast', description: '7-day forecast' }
          ],
          versions: ['1.0.0'],
          status: 'Published'
        },
        {
          id: '3',
          name: 'StockMarket Insights',
          description: 'Low-latency financial data, stock quotes, and historical market performance indicators.',
          category: 'Finance',
          rating: 4.7,
          usageCount: 45200,
          provider: 'MeteorLogic Inc.',
          providerId: 'o1',
          price: 'Paid',
          freeLimit: 100,
          pricePerCall: 0.10,
          endpoints: [
            { id: 'e3', name: 'Real-time Quote', method: 'GET', path: '/quote/{symbol}', description: 'Real-time quote' },
            { id: 'e4', name: 'Historical Data', method: 'GET', path: '/history', description: 'Historical data' }
          ],
          versions: ['2.1.0'],
          status: 'Published'
        },
        {
          id: '4',
          name: 'TranslateAnywhere Pro',
          description: 'Enterprise-grade translation API supporting over 120 languages with neural machine translation.',
          category: 'Language',
          rating: 4.9,
          usageCount: 85400,
          provider: 'MeteorLogic Inc.',
          providerId: 'o1',
          price: 'Freemium',
          freeLimit: 5000,
          pricePerCall: 0.15,
          endpoints: [
            { id: 'e5', name: 'Translate Text', method: 'POST', path: '/translate', description: 'Translate text' },
            { id: 'e6', name: 'Supported Languages', method: 'GET', path: '/languages', description: 'Supported languages' }
          ],
          versions: ['1.5.0'],
          status: 'Published'
        },
        {
          id: '5',
          name: 'GeoLocation Master',
          description: 'High-precision IP geolocation and address validation services for global applications.',
          category: 'Location',
          rating: 4.5,
          usageCount: 22100,
          provider: 'MeteorLogic Inc.',
          providerId: 'o1',
          price: 'Free',
          freeLimit: 10000,
          pricePerCall: 0,
          endpoints: [
            { id: 'e7', name: 'Geo-locate IP', method: 'GET', path: '/ip/{address}', description: 'Geo-locate IP' },
            { id: 'e8', name: 'Validate Address', method: 'POST', path: '/validate', description: 'Validate address' }
          ],
          versions: ['1.0.0'],
          status: 'Published'
        },
        {
          id: '2',
          name: 'VisionAI OCR',
          description: 'Extract text from images with high precision using advanced neural networks.',
          category: 'Machine Learning',
          rating: 4.9,
          usageCount: 8900,
          provider: 'DeepVision',
          providerId: 'o-legacy-1',
          price: 'Paid',
          freeLimit: 100,
          pricePerCall: 0.05,
          endpoints: [],
          versions: ['1.0.0'],
          status: 'Published'
        }
      ],
      subscriptions: {},

      addApi: (api) => set((state) => ({ apis: [api, ...state.apis] })),
      
      updateApi: (id, updates) => set((state) => ({
        apis: state.apis.map((api) => api.id === id ? { ...api, ...updates } : api)
      })),
      
      deleteApi: (id) => set((state) => ({
        apis: state.apis.filter((api) => api.id !== id)
      })),

      subscribeToApi: (userId, api) => {
        const subscriptions = get().subscriptions[userId] || [];
        if (subscriptions.some(s => s.apiId === api.id)) return;

        const newSub: UserSubscription = {
          apiId: api.id,
          apiName: api.name,
          apiProvider: api.provider,
          apiKey: 'nx_live_' + Math.random().toString(36).substr(2, 9),
          status: 'active',
          usage: 0,
          subscribedAt: new Date().toISOString().split('T')[0]
        };

        set((state) => ({
          subscriptions: {
            ...state.subscriptions,
            [userId]: [...subscriptions, newSub]
          }
        }));
      },

      unsubscribeFromApi: (userId, apiId) => set((state) => ({
        subscriptions: {
          ...state.subscriptions,
          [userId]: (state.subscriptions[userId] || []).filter(s => s.apiId !== apiId)
        }
      })),

      getApisByProvider: (providerId) => get().apis.filter(api => api.providerId === providerId),
      
      getSubscriptionsByUser: (userId) => get().subscriptions[userId] || [],
    }),
    {
      name: 'apivue-api-storage',
    }
  )
);
