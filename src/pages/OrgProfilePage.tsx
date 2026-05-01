import { useAuthStore } from '../store/useAuthStore';
import { useApiStore } from '../store/useApiStore';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, Globe, Activity, Users, Plus, ExternalLink, Mail, Shield, Calendar, MapPin, MoreVertical, Edit2, Trash2, LayoutDashboard, X, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';

export const OrgProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const { primaryColor } = useThemeStore();
  const { getApisByProvider, apis } = useApiStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });

  const orgApis = useMemo(() => {
    if (!user) return [];
    return getApisByProvider(user.id);
  }, [apis, user, getApisByProvider]);

  const apisLoading = false; // Store is local/sync

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(editForm);
    setIsEditModalOpen(false);
    toast.success('Organization profile updated');
  };

  if (!user || user.role !== 'org') return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Organization Profile Header */}
      <div className="relative overflow-hidden rounded-3xl bg-[var(--card)] border border-[var(--border)] p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border-4 border-[var(--background)] shadow-xl overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-16 h-16 text-zinc-400" />
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
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
              <div className="flex justify-center md:justify-start">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">Verified Organization</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-zinc-500">
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                <span className="text-sm">apivue.io/{user.name.toLowerCase()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Member since 2024</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/dashboard/org" className="btn-primary px-6 flex items-center justify-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="btn-secondary px-6"
            >
              Edit Profile
            </button>
            <Link 
              to="/dashboard/org?create=true"
              className="btn-primary px-6 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Post New API
            </Link>
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
                <h2 className="text-2xl font-bold">Edit Organization</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500">Organization Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-primary outline-none transition-all"
                    placeholder="Enter organization name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500">Contact Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-primary outline-none transition-all"
                    placeholder="Enter contact email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500">Logo URL</label>
                  <input
                    type="url"
                    value={editForm.avatar}
                    onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-primary outline-none transition-all"
                    placeholder="https://example.com/logo.jpg"
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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {[
          { label: 'Total APIs Posted', value: orgApis?.length || 0, icon: Globe, color: 'blue' },
          { label: 'Total Developers', value: orgApis?.reduce((acc, curr) => acc + curr.usageCount, 0).toLocaleString() || 0, icon: Users, color: 'emerald' },
          { label: 'API Health', value: '99.9%', icon: Activity, color: 'amber' },
          { label: 'Avg Rating', value: '4.8/5', icon: Shield, color: 'purple' },
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

      {/* Posted APIs */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Our Published APIs</h2>
          <Link 
            to="/dashboard/org?create=true"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add New API
          </Link>
        </div>

        {apisLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-48 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : orgApis?.length === 0 ? (
          <div className="text-center py-20 bg-[var(--card)] rounded-3xl border border-dashed border-[var(--border)]">
            <Globe className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No APIs published yet</h3>
            <p className="text-zinc-500 mt-2">Start sharing your APIs with the developer community.</p>
            <Link to="/dashboard/org?create=true" className="btn-primary mt-6 inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Publish Your First API
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orgApis?.map((api, i) => (
              <motion.div
                key={api.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 hover:border-primary/50 transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      {api.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold group-hover:text-primary transition-colors">{api.name}</h3>
                      <p className="text-xs text-zinc-500">{api.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/api/${api.id}`}
                      className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-zinc-400" />
                    </Link>
                    <button className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                      <MoreVertical className="w-4 h-4 text-zinc-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Users className="w-4 h-4" />
                      <span>{api.usageCount.toLocaleString()} active users</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-medium">
                      <span>★</span>
                      <span>{api.rating}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toast.info(`Editing ${api.name} - Coming Soon`)}
                        className="p-2 rounded-lg text-zinc-400 hover:text-primary hover:bg-primary/5 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toast.error(`Deleting ${api.name} - Coming Soon`)}
                        className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/5 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <Link 
                      to={`/api/${api.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      View Analytics
                    </Link>
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
