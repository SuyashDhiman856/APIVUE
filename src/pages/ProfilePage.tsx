import { useAuthStore } from '../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { motion, AnimatePresence } from 'motion/react';
import { Key, Activity, Calendar, ExternalLink, Shield, User as UserIcon, Mail, Building2, Globe, LayoutDashboard, X, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';
import { useState } from 'react';
import { toast } from 'sonner';

export const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const { primaryColor } = useThemeStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });

  const { data: subscriptions, isLoading: subsLoading } = useQuery({
    queryKey: ['user-subscriptions'],
    queryFn: () => apiClient.getUserSubscriptions(),
  });

  const { data: apis, isLoading: apisLoading } = useQuery({
    queryKey: ['apis'],
    queryFn: () => apiClient.getApis(),
  });

  const subscribedApis = subscriptions?.map(sub => {
    const api = apis?.find(a => a.id === sub.apiId);
    return { ...sub, api };
  }).filter(s => s.api);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(editForm);
    setIsEditModalOpen(false);
    toast.success('Profile updated successfully');
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-3xl bg-[var(--card)] border border-[var(--border)] p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border-4 border-[var(--background)] shadow-xl overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-16 h-16 text-zinc-400" />
              )}
            </div>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-zinc-500">
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                <span className="text-sm capitalize">{user.role} Account</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Joined Jan 2024</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/dashboard" className="btn-primary px-6 flex items-center justify-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="btn-secondary px-6"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Profile</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-primary outline-none transition-all"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-primary outline-none transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500">Avatar URL</label>
                  <input
                    type="url"
                    value={editForm.avatar}
                    onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-primary outline-none transition-all"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Active Subscriptions', value: subscribedApis?.length || 0, icon: Globe, color: 'blue' },
          { label: 'Total API Calls', value: subscribedApis?.reduce((acc, curr) => acc + curr.usage, 0) || 0, icon: Activity, color: 'emerald' },
          { label: 'API Keys', value: subscribedApis?.length || 0, icon: Key, color: 'amber' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-500`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-zinc-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Subscribed APIs */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">My Subscribed APIs</h2>
          <Link to="/marketplace" className="text-sm font-medium text-primary hover:underline">
            Browse Marketplace
          </Link>
        </div>

        {subsLoading || apisLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-48 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : subscribedApis?.length === 0 ? (
          <div className="text-center py-20 bg-[var(--card)] rounded-3xl border border-dashed border-[var(--border)]">
            <Globe className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No active subscriptions</h3>
            <p className="text-zinc-500 mt-2">Explore the marketplace to find APIs for your next project.</p>
            <Link to="/marketplace" className="btn-primary mt-6 inline-block">
              Explore Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subscribedApis?.map((sub, i) => (
              <motion.div
                key={sub.apiId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 hover:border-primary/50 transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      {sub.api?.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold group-hover:text-primary transition-colors">{sub.api?.name}</h3>
                      <p className="text-xs text-zinc-500">{sub.api?.provider}</p>
                    </div>
                  </div>
                  <Link 
                    to={`/api/${sub.apiId}`}
                    className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-zinc-400" />
                  </Link>
                </div>

                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-[var(--border)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">API Key</span>
                      <Shield className="w-3 h-3 text-emerald-500" />
                    </div>
                    <code className="text-xs font-mono block truncate text-zinc-700 dark:text-zinc-300">
                      {sub.apiKey}
                    </code>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Activity className="w-4 h-4" />
                      <span>{sub.usage.toLocaleString()} calls</span>
                    </div>
                    <div className="text-zinc-400 text-xs">
                      Subscribed {new Date(sub.subscribedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
