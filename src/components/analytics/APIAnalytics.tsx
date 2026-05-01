import React from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useThemeStore } from '../../store/useThemeStore';
import { Activity, Clock, AlertCircle, Zap } from 'lucide-react';

interface AnalyticsProps {
  apiId?: string;
  title?: string;
}

// Mock data generation
const generateUsageData = (days: number) => {
  return Array.from({ length: days }).map((_, i) => ({
    date: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    calls: Math.floor(Math.random() * 500) + 200,
    errors: Math.floor(Math.random() * 20),
    latency: Math.floor(Math.random() * 100) + 50,
  }));
};

const topEndpoints = [
  { name: '/v1/weather', value: 4500 },
  { name: '/v1/forecast', value: 3200 },
  { name: '/v1/history', value: 1800 },
  { name: '/v1/alerts', value: 1200 },
  { name: '/v1/locations', value: 800 },
];

const errorDistribution = [
  { name: '200 OK', value: 95, color: '#10b981' },
  { name: '400 Bad Request', value: 2, color: '#f59e0b' },
  { name: '401 Unauthorized', value: 1, color: '#ef4444' },
  { name: '500 Server Error', value: 2, color: '#6366f1' },
];

export const APIAnalytics: React.FC<AnalyticsProps> = ({ apiId, title = "API Analytics" }) => {
  const { primaryColor, mode } = useThemeStore();
  const usageData = generateUsageData(30);

  const isDark = mode === 'dark';
  const textColor = isDark ? '#a1a1aa' : '#71717a';
  const gridColor = isDark ? '#27272a' : '#f4f4f5';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--foreground)]">{title}</h2>
        <div className="flex gap-2">
          <select className="text-xs font-bold bg-[var(--card)] border border-[var(--border)] rounded-lg px-3 py-1.5 outline-none">
            <option>Last 7 days</option>
            <option selected>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[var(--card)] border border-[var(--border)] p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Calls</span>
          </div>
          <div className="text-2xl font-bold">12,450</div>
          <div className="text-[10px] text-emerald-500 font-bold mt-1">↑ 12% from last month</div>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Avg Latency</span>
          </div>
          <div className="text-2xl font-bold">84ms</div>
          <div className="text-[10px] text-emerald-500 font-bold mt-1">↓ 5ms improvement</div>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Error Rate</span>
          </div>
          <div className="text-2xl font-bold">0.02%</div>
          <div className="text-[10px] text-zinc-400 font-bold mt-1">Within SLA limits</div>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Success Rate</span>
          </div>
          <div className="text-2xl font-bold">99.98%</div>
          <div className="text-[10px] text-emerald-500 font-bold mt-1">Stable performance</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Usage Chart */}
        <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold mb-6 text-zinc-500 uppercase tracking-wider">Usage Over Time</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: textColor, fontSize: 10 }}
                  interval={6}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: textColor, fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#18181b' : '#ffffff',
                    border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="calls" 
                  stroke={primaryColor} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCalls)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latency Chart */}
        <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold mb-6 text-zinc-500 uppercase tracking-wider">Latency (ms)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: textColor, fontSize: 10 }}
                  interval={6}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: textColor, fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#18181b' : '#ffffff',
                    border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="latency" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Endpoints */}
        <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold mb-6 text-zinc-500 uppercase tracking-wider">Top Endpoints</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topEndpoints} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: textColor, fontSize: 10 }}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: isDark ? '#27272a' : '#f4f4f5' }}
                  contentStyle={{ 
                    backgroundColor: isDark ? '#18181b' : '#ffffff',
                    border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="value" fill={primaryColor} radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Error Distribution */}
        <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold mb-6 text-zinc-500 uppercase tracking-wider">Response Status</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={errorDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {errorDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#18181b' : '#ffffff',
                    border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 ml-4">
              {errorDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] text-zinc-500 font-medium">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
