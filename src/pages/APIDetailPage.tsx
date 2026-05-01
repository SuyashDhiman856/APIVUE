import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Star, 
  Users, 
  ShieldCheck, 
  ExternalLink, 
  Key, 
  BookOpen, 
  Activity,
  Play,
  Copy,
  Check,
  Lock,
  Search,
  Terminal,
  ChevronDown,
  Info,
  X,
  Loader2,
  BarChart3
} from 'lucide-react';
import { apiClient } from '../lib/api-client';
import { APIDocumentation } from '../components/api-docs/APIDocumentation';
import { APIAnalytics } from '../components/analytics/APIAnalytics';
import { APIPlayground } from '../components/api-docs/APIPlayground';
import { useState, useMemo, useEffect } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { useApiStore } from '../store/useApiStore';
import { toast } from 'sonner';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const APIDetailPage = () => {
  const { apiId } = useParams<{ apiId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'endpoints' | 'pricing' | 'analytics'>('overview');
  const [selectedEndpoint, setSelectedEndpoint] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showMobileEndpoints, setShowMobileEndpoints] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  
  const { primaryColor, mode } = useThemeStore();
  const { isAuthenticated, user } = useAuthStore();
  const { apis, subscribeToApi } = useApiStore();
  const allSubscriptions = useApiStore(state => state.subscriptions);
  const [copied, setCopied] = useState(false);

  const api = useMemo(() => apis.find(a => a.id === apiId), [apis, apiId]);
  
  const subscriptions = useMemo(() => {
    if (!user) return [];
    return allSubscriptions[user.id] || [];
  }, [user, allSubscriptions]);

  const subscription = useMemo(() => subscriptions.find(s => s.apiId === apiId), [subscriptions, apiId]);

  useEffect(() => {
    if (api && !selectedVersion) {
      setSelectedVersion(api.versions[api.versions.length - 1]);
    }
    if (api && !selectedEndpoint && api.endpoints.length > 0) {
      setSelectedEndpoint(api.endpoints[0]);
    }
  }, [api]);

  const filteredEndpoints = useMemo(() => {
    if (!api) return [];
    return api.endpoints.filter(ep => 
      ep.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.path.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [api, searchQuery]);

  const handleSubscribeClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to subscribe to APIs');
      navigate('/login', { state: { from: `/api/${apiId}` } });
      return;
    }
    setShowDisclaimer(true);
  };

  const confirmSubscription = () => {
    if (!user || !api) return;
    setIsSubscribing(true);
    // Mock network delay
    setTimeout(() => {
      subscribeToApi(user.id, api);
      toast.success('Successfully subscribed to API!');
      setShowDisclaimer(false);
      setIsSubscribing(false);
    }, 800);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('API Key copied to clipboard');
  };

  if (!api) return <div className="text-center py-20">API not found</div>;

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--card)] sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Link to="/marketplace" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-zinc-500" />
              </Link>
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold text-white border shrink-0"
                style={{ 
                  backgroundColor: primaryColor,
                  borderColor: mode === 'dark' ? `${primaryColor}33` : `${primaryColor}1a`,
                  boxShadow: `0 0 15px ${primaryColor}4d`
                }}
              >
                {api.name[0]}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <h1 className="text-lg sm:text-xl font-bold text-[var(--foreground)] truncate">{api.name}</h1>
                  
                  {/* Version Dropdown */}
                  <div className="relative group">
                    <button 
                      className="flex items-center gap-1.5 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded border bg-[var(--background)] hover:border-zinc-400 transition-colors shrink-0"
                      style={{ 
                        color: primaryColor,
                        borderColor: mode === 'dark' ? `${primaryColor}33` : `${primaryColor}1a`
                      }}
                    >
                      v{selectedVersion}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <div className="absolute top-full left-0 mt-1 w-24 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      {api.versions.map(v => (
                        <button
                          key={v}
                          onClick={() => setSelectedVersion(v)}
                          className="w-full text-left px-3 py-1.5 text-[10px] font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          v{v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs text-zinc-500 truncate">by <span className="font-semibold text-[var(--foreground)]">{api.provider}</span></p>
              </div>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-4 sm:ml-auto">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: primaryColor, fill: primaryColor }} />
                  {api.rating}
                </div>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-zinc-500">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {api.usageCount.toLocaleString()}
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4">
                {!subscription ? (
                  <button 
                    onClick={handleSubscribeClick}
                    disabled={isSubscribing}
                    className="btn-primary px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-300 whitespace-nowrap"
                    style={{ boxShadow: `0 0 15px ${primaryColor}4d` }}
                  >
                    {isSubscribing ? 'Subscribing...' : 'Subscribe for Free'}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button 
                      onClick={() => {
                        setActiveTab('analytics');
                        const playground = document.getElementById('api-playground');
                        playground?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl border border-[var(--border)] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Analytics
                    </button>
                    <button 
                      onClick={() => {
                        setActiveTab('endpoints');
                        const playground = document.getElementById('api-playground');
                        playground?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl border border-[var(--border)] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                    >
                      <Play className="w-4 h-4" />
                      Test API
                    </button>
                    <div className="p-1.5 sm:p-2 bg-zinc-50 dark:bg-zinc-800 border border-[var(--border)] rounded-lg flex items-center gap-2 sm:gap-3 max-w-[140px] sm:max-w-none">
                      <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 shrink-0" />
                      <code className="text-[10px] sm:text-xs font-mono text-emerald-500 truncate">{subscription.apiKey}</code>
                      <button onClick={() => copyToClipboard(subscription.apiKey)} className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors shrink-0">
                        {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Endpoint Selector (Sticky) */}
      <div className="lg:hidden border-b border-[var(--border)] bg-[var(--card)] sticky top-[73px] sm:top-[89px] z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
              selectedEndpoint?.method === 'GET' ? 'bg-blue-500/10 text-blue-500' : 
              selectedEndpoint?.method === 'POST' ? 'bg-emerald-500/10 text-emerald-500' :
              'bg-amber-500/10 text-amber-500'
            }`}>
              {selectedEndpoint?.method}
            </span>
            <span className="text-sm font-bold truncate text-[var(--foreground)]">
              {selectedEndpoint?.name || 'Select Endpoint'}
            </span>
          </div>
          <button 
            onClick={() => setShowMobileEndpoints(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all shrink-0"
          >
            Endpoints
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex-grow flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 border-r border-[var(--border)] bg-white dark:bg-zinc-950 flex flex-col hidden lg:flex transition-colors">
          <div className="p-4 border-b border-[var(--border)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search Endpoints..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none focus:ring-2 transition-all text-black dark:text-white"
                style={{ '--tw-ring-color': `${primaryColor}33` } as any}
              />
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto custom-scrollbar p-2">
            <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Endpoints</div>
            <div className="space-y-1">
              {filteredEndpoints.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => {
                    setSelectedEndpoint(ep);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex flex-col gap-1 ${
                    selectedEndpoint?.id === ep.id 
                      ? 'bg-zinc-100 dark:bg-zinc-800' 
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      ep.method === 'GET' ? 'bg-blue-500/10 text-blue-500' : 
                      ep.method === 'POST' ? 'bg-emerald-500/10 text-emerald-500' :
                      ep.method === 'PUT' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {ep.method}
                    </span>
                    <span className={`text-xs font-bold truncate ${selectedEndpoint?.id === ep.id ? 'text-[var(--foreground)]' : 'text-zinc-500'}`}>
                      {ep.name}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 truncate pl-1">
                    {ep.path}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-grow overflow-y-auto custom-scrollbar bg-[var(--background)]">
          <div className="max-w-5xl mx-auto p-4 sm:p-8">
            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-[var(--border)] mb-8">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`pb-4 text-sm font-bold transition-all relative ${
                  activeTab === 'overview' ? 'text-[var(--foreground)]' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                Overview
                {activeTab === 'overview' && (
                  <motion.div layoutId="activeDetailTab" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: primaryColor }} />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('endpoints')}
                className={`pb-4 text-sm font-bold transition-all relative ${
                  activeTab === 'endpoints' ? 'text-[var(--foreground)]' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                Endpoints
                {activeTab === 'endpoints' && (
                  <motion.div layoutId="activeDetailTab" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: primaryColor }} />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`pb-4 text-sm font-bold transition-all relative ${
                  activeTab === 'analytics' ? 'text-[var(--foreground)]' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                Analytics
                {activeTab === 'analytics' && (
                  <motion.div layoutId="activeDetailTab" className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: primaryColor }} />
                )}
              </button>
            </div>

            {activeTab === 'overview' ? (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Hero Section of Overview */}
                <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 border border-[var(--border)] bg-zinc-50 dark:bg-zinc-900/50">
                  <div className="max-w-3xl">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">About {api.name}</h2>
                    <p className="text-lg text-zinc-500 leading-relaxed mb-8">
                      {api.longDescription || api.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                       <button 
                        onClick={() => setActiveTab('endpoints')}
                        className="px-6 py-2.5 rounded-xl font-bold text-white transition-all shadow-lg hover:brightness-110 active:scale-95"
                        style={{ backgroundColor: primaryColor }}
                       >
                        Explore Documentation
                       </button>
                       <Link to="/marketplace" className="px-6 py-2.5 rounded-xl font-bold border border-[var(--border)] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                        Similar APIs
                       </Link>
                    </div>
                  </div>
                </div>

                {/* Features & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                       <ShieldCheck className="w-6 h-6" style={{ color: primaryColor }} />
                       Key Features
                    </h3>
                    <ul className="space-y-4">
                      {(api.features || ['High Uptime', 'Global Scale', 'Easy Integration']).map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-zinc-500">
                          <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[var(--card)] border border-[var(--border)] p-8 rounded-3xl space-y-6">
                     <h3 className="text-xl font-bold">Reliability</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-[var(--border)]">
                           <div className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Uptime</div>
                           <div className="text-2xl font-bold text-emerald-500">99.9%</div>
                        </div>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-[var(--border)]">
                           <div className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Avg. Latency</div>
                           <div className="text-2xl font-bold" style={{ color: primaryColor }}>120ms</div>
                        </div>
                     </div>
                     <p className="text-xs text-zinc-400">
                        Historical data based on the last 30 days of performance monitoring.
                     </p>
                  </div>
                </div>

                {/* Use Cases */}
                {api.useCases && api.useCases.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Use Cases</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {api.useCases.map((uc, i) => (
                        <div key={i} className="p-6 border border-[var(--border)] rounded-2xl bg-white dark:bg-zinc-950">
                           <h4 className="font-bold mb-2" style={{ color: primaryColor }}>{uc.title}</h4>
                           <p className="text-sm text-zinc-500 leading-relaxed">{uc.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQ */}
                {api.faq && api.faq.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                      {api.faq.map((item, i) => (
                        <details key={i} className="group border border-[var(--border)] rounded-2xl p-4 bg-[var(--card)] transition-all overflow-hidden cursor-pointer">
                          <summary className="flex items-center justify-between font-bold text-sm sm:text-base list-none">
                            {item.question}
                            <ChevronDown className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform" />
                          </summary>
                          <div className="pt-4 text-sm text-zinc-500 leading-relaxed">
                            {item.answer}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'endpoints' ? (
              selectedEndpoint ? (
                <div className="space-y-8 sm:space-y-12">
                  {/* Endpoint Header */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded ${
                        selectedEndpoint.method === 'GET' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {selectedEndpoint.method}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold">{selectedEndpoint.name}</h2>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl font-mono text-xs sm:text-sm overflow-hidden shadow-inner">
                      <span className="text-zinc-500 truncate">https://api.apivue.com/v1</span>
                      <span className="text-[var(--foreground)] font-bold break-all sm:break-normal">{selectedEndpoint.path}</span>
                    </div>
                    <p className="text-sm sm:text-base text-zinc-500 leading-relaxed">{selectedEndpoint.description}</p>
                  </div>

                {/* Documentation & Examples */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[var(--foreground)] uppercase tracking-wider mb-4 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Parameters
                      </h3>
                      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm min-w-[400px]">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-[var(--border)]">
                              <tr>
                                <th className="text-left px-4 py-3 font-bold text-zinc-500 uppercase text-[10px]">Name</th>
                                <th className="text-left px-4 py-3 font-bold text-zinc-500 uppercase text-[10px]">Type</th>
                                <th className="text-left px-4 py-3 font-bold text-zinc-500 uppercase text-[10px]">Description</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                              {/* Default Auth Header */}
                              <tr>
                                <td className="px-4 py-3 font-mono text-xs text-primary">Authorization</td>
                                <td className="px-4 py-3 text-xs text-zinc-400">header</td>
                                <td className="px-4 py-3 text-xs text-zinc-500">Bearer token for authentication</td>
                              </tr>
                              
                              {/* Custom Headers */}
                              {selectedEndpoint.headers?.map((header, idx) => (
                                <tr key={`header-${idx}`}>
                                  <td className="px-4 py-3 font-mono text-xs text-primary">{header.name}</td>
                                  <td className="px-4 py-3 text-xs text-zinc-400">header ({header.type})</td>
                                  <td className="px-4 py-3 text-xs text-zinc-500">
                                    {header.description}
                                    {header.required && <span className="ml-2 text-[10px] font-bold text-red-500 uppercase">Required</span>}
                                  </td>
                                </tr>
                              ))}

                              {/* Parameters */}
                              {selectedEndpoint.parameters?.map((param, idx) => (
                                <tr key={`param-${idx}`}>
                                  <td className="px-4 py-3 font-mono text-xs text-primary">{param.name}</td>
                                  <td className="px-4 py-3 text-xs text-zinc-400">{param.location} ({param.type})</td>
                                  <td className="px-4 py-3 text-xs text-zinc-500">
                                    {param.description}
                                    {param.required && <span className="ml-2 text-[10px] font-bold text-red-500 uppercase">Required</span>}
                                  </td>
                                </tr>
                              ))}

                              {!selectedEndpoint.parameters && selectedEndpoint.method === 'POST' && (
                                <tr>
                                  <td className="px-4 py-3 font-mono text-xs text-primary">body</td>
                                  <td className="px-4 py-3 text-xs text-zinc-400">object</td>
                                  <td className="px-4 py-3 text-xs text-zinc-500">Request payload in JSON format</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[var(--foreground)] uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Example Response
                      </h3>
                      <div className="bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-xl transition-colors">
                        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-zinc-800">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-zinc-500" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                              Sample Response
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500">application/json</span>
                        </div>
                        <div className="p-0 bg-zinc-950 overflow-x-auto scrollbar-hide transition-colors">
                          <SyntaxHighlighter
                            language="json"
                            style={atomDark}
                            wrapLines={false}
                            customStyle={{
                              margin: 0,
                              padding: '1.25rem sm:1.5rem',
                              fontSize: '0.75rem sm:0.875rem',
                              lineHeight: '1.5',
                              backgroundColor: 'transparent',
                              minWidth: 'fit-content'
                            }}
                          >
                            {selectedEndpoint.sampleResponse || '{}'}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[var(--foreground)] uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Terminal className="w-4 h-4" />
                        Code Snippets
                      </h3>
                      <APIDocumentation 
                        apiName={api.name} 
                        endpoint={selectedEndpoint} 
                        apiKey={subscription?.apiKey}
                      />
                    </div>

                  <div className="space-y-8">
                    <div id="api-playground" className="scroll-mt-24">
                      <APIPlayground 
                        endpoint={selectedEndpoint} 
                        apiKey={subscription?.apiKey}
                        primaryColor={primaryColor}
                      />
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Activity className="w-12 h-12 sm:w-16 sm:h-16 text-zinc-200 mb-4" />
                <h2 className="text-lg sm:text-xl font-bold text-zinc-400">Select an endpoint to view documentation</h2>
              </div>
            )
          ) : (
            <APIAnalytics apiId={apiId} title={`${api.name} Usage Analytics`} />
          )}
          </div>
        </main>
      </div>

      {/* Disclaimer Modal */}
      <AnimatePresence>
        {showDisclaimer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDisclaimer(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setShowDisclaimer(false)}
                className="absolute top-4 right-4 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6">
                  <Info className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500" />
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold mb-4">Free Usage Disclaimer</h3>
                <div className="space-y-4 text-zinc-500 leading-relaxed mb-8">
                  <p className="text-sm sm:text-base">
                    By subscribing to <span className="font-bold text-[var(--foreground)]">{api.name}</span>, you will be granted a free tier for development and testing.
                  </p>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-[var(--border)]">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Free Request Limit</div>
                    <div className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">{api.freeLimit.toLocaleString()}</div>
                    <div className="text-[10px] text-zinc-400 mt-1">requests per month</div>
                  </div>
                  <p className="text-xs sm:text-sm">
                    Once you exceed this limit, additional requests will be billed at <span className="font-bold text-[var(--foreground)]">${api.pricePerCall}</span> per call.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button 
                    onClick={() => setShowDisclaimer(false)}
                    className="flex-1 py-3 rounded-xl font-bold border border-[var(--border)] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm sm:text-base order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmSubscription}
                    disabled={isSubscribing}
                    className="flex-1 py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 text-sm sm:text-base order-1 sm:order-2"
                    style={{ 
                      backgroundColor: primaryColor,
                      boxShadow: `0 0-20px ${primaryColor}4d`
                    }}
                  >
                    {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {isSubscribing ? 'Subscribing...' : 'I Understand'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Endpoints Drawer */}
      <AnimatePresence>
        {showMobileEndpoints && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileEndpoints(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-[85%] max-w-sm bg-[var(--card)] border-l border-[var(--border)] shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                <h3 className="font-bold">Endpoints</h3>
                <button 
                  onClick={() => setShowMobileEndpoints(false)}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
              
              <div className="p-4 border-b border-[var(--border)]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Search Endpoints..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none focus:ring-2 transition-all"
                    style={{ '--tw-ring-color': `${primaryColor}33` } as any}
                  />
                </div>
              </div>
              
              <div className="flex-grow overflow-y-auto p-2 space-y-1">
                {filteredEndpoints.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => {
                      setSelectedEndpoint(ep);
                      setShowMobileEndpoints(false);
                    }}
                    className={`w-full text-left px-3 py-3 rounded-xl transition-all flex flex-col gap-1 ${
                      selectedEndpoint?.id === ep.id 
                        ? 'bg-zinc-100 dark:bg-zinc-800' 
                        : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        ep.method === 'GET' ? 'bg-blue-500/10 text-blue-500' : 
                        ep.method === 'POST' ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {ep.method}
                      </span>
                      <span className={`text-xs font-bold truncate ${selectedEndpoint?.id === ep.id ? 'text-[var(--foreground)]' : 'text-zinc-500'}`}>
                        {ep.name}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400 truncate pl-1">
                      {ep.path}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
