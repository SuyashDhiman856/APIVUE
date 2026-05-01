import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  BarChart3, 
  Users, 
  Globe, 
  MoreVertical, 
  Edit2, 
  Trash2,
  TrendingUp,
  ArrowUpRight,
  X,
  Code2,
  List,
  Database,
  HelpCircle,
  Clock,
  Code
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { useApiStore } from '../store/useApiStore';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

export const OrganizationDashboard = () => {
  const { primaryColor, mode } = useThemeStore();
  const { user } = useAuthStore();
  const { apis, addApi, deleteApi, updateApi, getApisByProvider } = useApiStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingApiId, setEditingApiId] = useState<string | null>(null);

  const orgApis = useMemo(() => {
    if (!user) return [];
    return getApisByProvider(user.id);
  }, [apis, user, getApisByProvider]);

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      handleOpenCreate();
      // Remove the param after opening
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const categories = ['Weather', 'Machine Learning', 'Finance', 'Location', 'Language', 'AI', 'Health', 'Security', 'News'];

  const [apiForm, setApiForm] = useState({
    name: '',
    category: 'AI',
    apiData: '', // JSON format
    endpoints: '',
    codeSnippets: '',
    exampleResponse: '',
    freeLimit: 1000,
    description: '',
    faq: ''
  });

  const handleOpenCreate = () => {
    setEditingApiId(null);
    setApiForm({
      name: '',
      category: 'AI',
      apiData: '',
      endpoints: '',
      codeSnippets: '',
      exampleResponse: '',
      freeLimit: 1000,
      description: '',
      faq: ''
    });
    setShowCreateModal(true);
  };

  const handleOpenEdit = (api: any) => {
    setEditingApiId(api.id);
    setApiForm({
      name: api.name,
      category: api.category || 'AI',
      apiData: JSON.stringify(api.apiData || {}, null, 2),
      endpoints: api.endpoints?.map((e: any) => `${e.method} ${e.path}`).join('\n') || '',
      codeSnippets: '',
      exampleResponse: '',
      freeLimit: api.freeLimit || 1000,
      description: api.description || '',
      faq: ''
    });
    setShowCreateModal(true);
  };

  const [showStatsModal, setShowStatsModal] = useState<string | null>(null);

  const selectedStatsApi = useMemo(() => 
    orgApis.find(a => a.id === showStatsModal),
    [orgApis, showStatsModal]
  );

  const handleDelete = (id: string, name?: string) => {
    if (confirm(`Are you sure you want to delete the API "${name || 'this API'}"? This action cannot be undone.`)) {
      deleteApi(id);
      toast.success('API deleted successfully');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiForm.name || !apiForm.description) {
      toast.error('Please fill in the required fields');
      return;
    }

    try {
      if (apiForm.apiData) {
        JSON.parse(apiForm.apiData);
      }
    } catch (e) {
      toast.error('Invalid JSON format for API Data');
      return;
    }

    if (editingApiId) {
      updateApi(editingApiId, {
        name: apiForm.name,
        category: apiForm.category,
        description: apiForm.description,
        freeLimit: apiForm.freeLimit,
      });
      toast.success('API updated successfully!');
    } else {
      const newApiObj = {
        id: Math.random().toString(36).substr(2, 9),
        name: apiForm.name,
        description: apiForm.description,
        category: apiForm.category,
        rating: 0,
        usageCount: 0,
        provider: user?.name || 'Unknown',
        providerId: user?.id || '',
        price: 'Free',
        freeLimit: apiForm.freeLimit,
        pricePerCall: 0,
        endpoints: [],
        versions: ['1.0.0'],
        status: 'Draft' as any
      };
      addApi(newApiObj as any);
      toast.success('API draft created successfully!');
    }

    setShowCreateModal(false);
  };

  const stats = useMemo(() => {
    const totalCalls = orgApis.reduce((acc, api) => acc + (api.usageCount || 0), 0);
    const totalRevenue = orgApis.reduce((acc, api) => acc + ((api.usageCount || 0) * (api.pricePerCall || 0)), 0);
    const activeUsers = orgApis.length > 0 ? Math.floor(totalCalls / 10) + 1 : 0; // Simulated
    
    return [
      { name: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: orgApis.length > 0 ? '+5.2%' : '0%', icon: TrendingUp },
      { name: 'Total Calls', value: totalCalls >= 1000 ? `${(totalCalls / 1000).toFixed(1)}k` : totalCalls.toString(), change: orgApis.length > 0 ? '+8.2%' : '0%', icon: BarChart3 },
      { name: 'Active Users', value: activeUsers.toString(), change: orgApis.length > 0 ? '+12.5%' : '0%', icon: Users },
      { name: 'Avg. Latency', value: orgApis.length > 0 ? '42ms' : '0ms', change: orgApis.length > 0 ? '-2ms' : '0ms', icon: Globe },
    ];
  }, [orgApis]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Organization Console</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Manage your API portfolio and track performance.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--primary)] text-white font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New API
        </button>
      </div>
{/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                <stat.icon className="w-5 h-5 text-zinc-900 dark:text-white" />
              </div>
              <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-zinc-400'}`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{stat.name}</div>
          </div>
        ))}
      </div>

      {/* API Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm transition-colors">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="font-bold text-zinc-900 dark:text-white">Your APIs</h2>
          <div className="flex items-center gap-2">
            <button className="text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">All</button>
            <button className="text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Published</button>
            <button className="text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Drafts</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-800/50">
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">API Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Calls</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {orgApis.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-4 text-zinc-500">
                      <p>No APIs found. Create your first API to get started!</p>
                      <button 
                        onClick={handleOpenCreate}
                        className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all"
                      >
                        Publish Your First API
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                orgApis.map((api) => (
                <tr key={api.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center font-bold text-xs uppercase">
                        {api.name[0]}
                      </div>
                      <span className="font-bold text-sm text-zinc-900 dark:text-white">{api.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      api.status === 'Published' 
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' 
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                    }`}>
                      {api.status || 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">{api.usageCount || 0}</td>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    ${((api.usageCount || 0) * (api.pricePerCall || 0)).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenEdit(api)}
                        className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setShowStatsModal(api.id)}
                        className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(api.id, api.name)}
                        className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800">
          <button className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1">
            View all APIs <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Create API Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col"
            >
              <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {editingApiId ? 'Edit API' : 'Create New API'}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Define your API specifications and documentation.</p>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                  <X className="w-6 h-6 text-zinc-500" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                <form onSubmit={handleFormSubmit} className="space-y-8">
                  {/* Basic Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">API Name</label>
                      <input 
                        type="text" 
                        required
                        value={apiForm.name}
                        onChange={(e) => setApiForm({ ...apiForm, name: e.target.value })}
                        placeholder="e.g. WeatherPro Plus" 
                        className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none focus:ring-2 transition-all dark:text-white"
                        style={{ '--tw-ring-color': `${primaryColor}33` } as any}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Category</label>
                      <select 
                        value={apiForm.category}
                        onChange={(e) => setApiForm({ ...apiForm, category: e.target.value })}
                        className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none focus:ring-2 transition-all dark:text-white appearance-none"
                        style={{ '--tw-ring-color': `${primaryColor}33` } as any}
                      >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* About / Description */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">About / Description</label>
                    <textarea 
                      rows={3}
                      required
                      value={apiForm.description}
                      onChange={(e) => setApiForm({ ...apiForm, description: e.target.value })}
                      placeholder="Describe what your API does and its main benefits..."
                      className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none focus:ring-2 transition-all dark:text-white"
                      style={{ '--tw-ring-color': `${primaryColor}33` } as any}
                    />
                  </div>

                  {/* API Data JSON */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">API Schema Data (JSON)</label>
                      <span className="text-[10px] text-zinc-500 font-mono">Format: Valid JSON Object</span>
                    </div>
                    <div className="relative group">
                      <Database className="absolute right-4 top-4 w-4 h-4 text-zinc-400 pointer-events-none group-focus-within:text-[var(--primary)]" />
                      <textarea 
                        rows={6}
                        value={apiForm.apiData}
                        onChange={(e) => setApiForm({ ...apiForm, apiData: e.target.value })}
                        placeholder='{ "version": "1.0", "base_url": "https://api.yourdomain.com/v1", ... }'
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-emerald-500 outline-none focus:ring-2 transition-all"
                        style={{ '--tw-ring-color': `${primaryColor}33` } as any}
                      />
                    </div>
                  </div>

                  {/* Endpoints & Snippets */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Endpoints List</label>
                      <textarea 
                        rows={4}
                        value={apiForm.endpoints}
                        onChange={(e) => setApiForm({ ...apiForm, endpoints: e.target.value })}
                        placeholder="GET /current&#10;POST /analyze"
                        className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-mono outline-none focus:ring-2 transition-all dark:text-white"
                        style={{ '--tw-ring-color': `${primaryColor}33` } as any}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Code Snippets</label>
                      <textarea 
                        rows={4}
                        value={apiForm.codeSnippets}
                        onChange={(e) => setApiForm({ ...apiForm, codeSnippets: e.target.value })}
                        placeholder="fetch('https://api.v1/...')&#10;  .then(res => ...)"
                        className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-mono outline-none focus:ring-2 transition-all dark:text-white"
                        style={{ '--tw-ring-color': `${primaryColor}33` } as any}
                      />
                    </div>
                  </div>

                  {/* Example Response */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Example JSON Response</label>
                    <textarea 
                      rows={5}
                      value={apiForm.exampleResponse}
                      onChange={(e) => setApiForm({ ...apiForm, exampleResponse: e.target.value })}
                      placeholder='{ "status": "success", "data": { ... } }'
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-mono text-blue-400 outline-none focus:ring-2 transition-all"
                      style={{ '--tw-ring-color': `${primaryColor}33` } as any}
                    />
                  </div>

                  {/* Rate Limits & FAQ */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Free Rate Limit (Req/month)</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input 
                          type="number" 
                          value={apiForm.freeLimit}
                          onChange={(e) => setApiForm({ ...apiForm, freeLimit: parseInt(e.target.value) })}
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none focus:ring-2 transition-all dark:text-white"
                          style={{ '--tw-ring-color': `${primaryColor}33` } as any}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">FAQ (JSON or Text)</label>
                      <div className="relative">
                        <HelpCircle className="absolute right-4 top-3 w-4 h-4 text-zinc-400" />
                        <textarea 
                          rows={2}
                          value={apiForm.faq}
                          onChange={(e) => setApiForm({ ...apiForm, faq: e.target.value })}
                          placeholder="How billing works? / Refund policy?"
                          className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none focus:ring-2 transition-all dark:text-white"
                          style={{ '--tw-ring-color': `${primaryColor}33` } as any}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button 
                      type="button" 
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 py-3 border border-zinc-200 dark:border-zinc-800 rounded-xl font-bold text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex-[2] py-3 text-white font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all"
                      style={{ backgroundColor: [primaryColor] as any }}
                    >
                      {editingApiId ? 'Save Changes' : 'Create API Draft'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stats Modal */}
      <AnimatePresence>
        {showStatsModal && selectedStatsApi && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStatsModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{selectedStatsApi.name} - Stats</h2>
                  <p className="text-sm text-zinc-500">Usage and performance overview for the last 30 days.</p>
                </div>
                <button 
                  onClick={() => setShowStatsModal(null)}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                  <p className="text-xs font-bold text-zinc-400 uppercase mb-1">Total Calls</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">{(selectedStatsApi.usageCount || 0).toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                  <p className="text-xs font-bold text-zinc-400 uppercase mb-1">Est. Revenue</p>
                  <p className="text-2xl font-bold text-emerald-500">
                    ${((selectedStatsApi.usageCount || 0) * (selectedStatsApi.pricePerCall || 0)).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Traffic Volume</h3>
                <div className="h-32 flex items-end gap-1.5">
                  {[40, 55, 30, 80, 60, 45, 90, 100, 75, 40, 65, 85].map((h, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-primary/20 rounded-t-md hover:bg-primary/40 transition-colors"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setShowStatsModal(null)}
                className="w-full mt-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl active:scale-95 transition-all"
              >
                Close View
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
