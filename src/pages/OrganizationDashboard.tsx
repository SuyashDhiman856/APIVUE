import { motion } from 'motion/react';
import { 
  Plus, 
  BarChart3, 
  Users, 
  Globe, 
  MoreVertical, 
  Edit2, 
  Trash2,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { useState } from 'react';

export const OrganizationDashboard = () => {
  const [apis] = useState([
    { id: '1', name: 'WeatherPro Global', status: 'Published', calls: '1.2M', revenue: '$4,250' },
    { id: '2', name: 'VisionAI OCR', status: 'Draft', calls: '0', revenue: '$0' },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">Organization Console</h1>
          <p className="text-zinc-500">Manage your API portfolio and track performance.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create New API
        </button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { name: 'Total Revenue', value: '$12,840', change: '+12.5%', icon: TrendingUp },
          { name: 'Total Calls', value: '4.2M', change: '+8.2%', icon: BarChart3 },
          { name: 'Active Users', value: '842', change: '+15.3%', icon: Users },
          { name: 'Avg. Latency', value: '42ms', change: '-2ms', icon: Globe },
        ].map((stat) => (
          <div key={stat.name} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-zinc-50">
                <stat.icon className="w-5 h-5 text-zinc-900" />
              </div>
              <span className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-blue-500'}`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
            <div className="text-xs text-zinc-500 mt-1">{stat.name}</div>
          </div>
        ))}
      </div>

      {/* API Table */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="font-bold text-zinc-900">Your APIs</h2>
          <div className="flex items-center gap-2">
            <button className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors">All</button>
            <button className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors">Published</button>
            <button className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors">Drafts</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">API Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Calls</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {apis.map((api) => (
                <tr key={api.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center font-bold text-xs">
                        {api.name[0]}
                      </div>
                      <span className="font-bold text-sm text-zinc-900">{api.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      api.status === 'Published' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                    }`}>
                      {api.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-600">{api.calls}</td>
                  <td className="px-6 py-4 text-sm font-medium text-zinc-600">{api.revenue}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-zinc-100 rounded-md transition-colors text-zinc-400 hover:text-zinc-900">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-zinc-100 rounded-md transition-colors text-zinc-400 hover:text-zinc-900">
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-zinc-100 rounded-md transition-colors text-zinc-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-zinc-50/50 border-t border-zinc-100">
          <button className="text-xs font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1">
            View all APIs <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
