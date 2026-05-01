export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'org';
  avatar?: string;
}

export interface API {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  features?: string[];
  useCases?: { title: string; description: string }[];
  faq?: { question: string; answer: string }[];
  category: string;
  rating: number;
  usageCount: number;
  provider: string;
  icon?: string;
  price: 'Free' | 'Freemium' | 'Paid';
  freeLimit: number; // Number of free requests
  pricePerCall: number; // Price after limit
  endpoints: Endpoint[];
  versions: string[];
  providerId: string;
  status?: 'Published' | 'Draft' | 'Deprecated';
}

export interface Endpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  sampleRequest?: string; // JSON string
  sampleResponse?: string; // JSON string
  headers?: { name: string; type: string; description: string; required: boolean }[];
  parameters?: { name: string; type: string; description: string; required: boolean; location: 'query' | 'path' | 'header' | 'body' }[];
}

export interface UserSubscription {
  apiId: string;
  apiName: string;
  apiProvider: string;
  apiKey: string;
  status: 'active' | 'revoked';
  usage: number;
  subscribedAt: string;
}
