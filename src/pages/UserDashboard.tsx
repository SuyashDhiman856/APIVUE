import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { 
  Key, 
  Activity, 
  Settings, 
  CreditCard, 
  RefreshCw, 
  Copy, 
  ExternalLink,
  ArrowUpRight,
  Zap,
  ShieldCheck,
  Check
} from 'lucide-react';
import { apiClient } from '../lib/api-client';
import { useAuthStore } from '../store/useAuthStore';
import { UserSubscription } from '../types';
import { useState } from 'react';

export const UserDashboard = () => {
  const { user } = useAuthStore();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { data: subscriptions, isLoading } = useQuery<UserSubscription[]>({
    queryKey: ['subscriptions'],
    queryFn: apiClient.getUserSubscriptions
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const stats = [
    { name: 'Active Subscriptions', value: subscriptions?.length || 0, icon: Zap, color: 'text-emerald-500' },
    { name: 'Monthly API Calls', value: '12,450', icon: Activity, color: 'text-blue-500' },
    { name: 'Success Rate', value: '99.98%', icon: ShieldCheck, color: 'text-purple-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Welcome back, {user?.name}</h1>
        <p className="text-zinc-500">Manage your API subscriptions and monitor your usage.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-zinc-50 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Last 30 days</span>
            </div>
            <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
            <div className="text-xs text-zinc-500 mt-1">{stat.name}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-900">Your Subscriptions</h2>
              <button className="text-sm font-semibold text-zinc-900 hover:underline">View all</button>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                [1, 2].map(i => <div key={i} className="h-24 bg-zinc-50 animate-pulse rounded-2xl" />)
              ) : subscriptions?.map((sub) => (
                <div key={sub.apiId} className="bg-white border border-zinc-200 rounded-2xl p-6 card-hover">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-center font-bold">
                        W
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-900">WeatherPro Global</h3>
                        <p className="text-xs text-zinc-500">Subscribed on {sub.subscribedAt}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase rounded border border-emerald-100">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Usage</div>
                      <div className="text-sm font-bold">{sub.usage.toLocaleString()} / 1,000</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Plan</div>
                      <div className="text-sm font-bold">Freemium</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">API Key</div>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-zinc-50 px-2 py-1 rounded border border-zinc-100 flex-grow font-mono text-zinc-600">
                          {sub.apiKey}
                        </code>
                        <button 
                          onClick={() => copyToClipboard(sub.apiKey)}
                          className="p-1.5 hover:bg-zinc-100 rounded-md transition-colors"
                        >
                          {copiedKey === sub.apiKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-zinc-400" />}
                        </button>
                        <button className="p-1.5 hover:bg-zinc-100 rounded-md transition-colors">
                          <RefreshCw className="w-4 h-4 text-zinc-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-200">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium hover:border-zinc-400 transition-all">
                <div className="flex items-center gap-3">
                  <Key className="w-4 h-4" />
                  Manage API Keys
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium hover:border-zinc-400 transition-all">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4" />
                  Billing & Plans
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium hover:border-zinc-400 transition-all">
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4" />
                  Account Settings
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-bold mb-2">Need help?</h3>
            <p className="text-zinc-400 text-xs mb-4">Our developer support team is available 24/7 to help you with your integration.</p>
            <button className="w-full bg-white text-black py-2 rounded-lg text-sm font-bold hover:bg-zinc-100 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
