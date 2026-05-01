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
  Check,
  BarChart3
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useApiStore } from '../store/useApiStore';
import { UserSubscription } from '../types';
import { useState, useMemo } from 'react';
import { APIAnalytics } from '../components/analytics/APIAnalytics';

export const UserDashboard = () => {
  const { user } = useAuthStore();
  const allSubscriptions = useApiStore(state => state.subscriptions);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [activeView, setActiveView] = useState<'subscriptions' | 'analytics'>('subscriptions');

  const subscriptions = useMemo(() => {
    if (!user) return [];
    return allSubscriptions[user.id] || [];
  }, [user, allSubscriptions]);

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
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Welcome back, {user?.name}</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Manage your API subscriptions and monitor your usage.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Last 30 days</span>
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{stat.name}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-zinc-200 dark:border-zinc-800 mb-8">
        <button 
          onClick={() => setActiveView('subscriptions')}
          className={`pb-4 text-sm font-bold transition-all relative ${
            activeView === 'subscriptions' ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Subscriptions
          </div>
          {activeView === 'subscriptions' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-white" />
          )}
        </button>
        <button 
          onClick={() => setActiveView('analytics')}
          className={`pb-4 text-sm font-bold transition-all relative ${
            activeView === 'analytics' ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </div>
          {activeView === 'analytics' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 dark:bg-white" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {activeView === 'subscriptions' ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Your Subscriptions</h2>
                <button className="text-sm font-semibold text-zinc-900 dark:text-white hover:underline">View all</button>
              </div>

              <div className="space-y-4">
                {subscriptions.length === 0 ? (
                  <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center text-zinc-500">
                    You haven't subscribed to any APIs yet. Explore the marketplace!
                  </div>
                ) : subscriptions.map((sub) => (
                  <div key={sub.apiId} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 card-hover transition-colors">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-center font-bold text-zinc-900 dark:text-white">
                          {sub.apiName[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-zinc-900 dark:text-white">{sub.apiName}</h3>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">Subscribed on {new Date(sub.subscribedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase rounded border border-emerald-100 dark:border-emerald-500/20">
                        Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Usage</div>
                        <div className="text-sm font-bold text-zinc-900 dark:text-white">{sub.usage.toLocaleString()} / 1,000</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Plan</div>
                        <div className="text-sm font-bold text-zinc-900 dark:text-white">Freemium</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">API Key</div>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-zinc-50 dark:bg-zinc-900 px-2 py-1 rounded border border-zinc-100 dark:border-zinc-800 flex-grow font-mono text-zinc-600 dark:text-zinc-400">
                            {sub.apiKey}
                          </code>
                          <button 
                            onClick={() => copyToClipboard(sub.apiKey)}
                            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                          >
                            {copiedKey === sub.apiKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-zinc-400" />}
                          </button>
                          <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
                            <RefreshCw className="w-4 h-4 text-zinc-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <APIAnalytics title="Global Usage Analytics" />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 transition-colors">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium hover:border-zinc-400 dark:hover:border-zinc-600 transition-all text-zinc-900 dark:text-white">
                <div className="flex items-center gap-3">
                  <Key className="w-4 h-4" />
                  Manage API Keys
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium hover:border-zinc-400 dark:hover:border-zinc-600 transition-all text-zinc-900 dark:text-white">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4" />
                  Billing & Plans
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium hover:border-zinc-400 dark:hover:border-zinc-600 transition-all text-zinc-900 dark:text-white">
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
