import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  LayoutGrid, 
  BookOpen, 
  Settings, 
  LayoutDashboard, 
  Building2,
  Zap,
  CreditCard,
  Shield,
  Terminal
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const Sidebar = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  const mainLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Marketplace', path: '/marketplace', icon: LayoutGrid },
    { name: 'Documentation', path: '/docs', icon: BookOpen },
  ];

  const dashboardLinks = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Usage', path: '/dashboard/usage', icon: Zap },
    { name: 'Billing', path: '/dashboard/billing', icon: CreditCard },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const orgLinks = [
    { name: 'Organization', path: '/dashboard/org', icon: Building2 },
    { name: 'Team', path: '/dashboard/org/team', icon: Shield },
    { name: 'API Console', path: '/dashboard/org/console', icon: Terminal },
  ];

  if (!isAuthenticated) return null;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-[var(--card)] border-r border-[var(--border)] overflow-y-auto hidden xl:block">
      <div className="p-6 space-y-8">
        <div>
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 px-3">Main</h3>
          <nav className="space-y-1">
            {mainLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-[var(--foreground)]'
                    : 'text-zinc-500 hover:text-[var(--foreground)] hover:bg-zinc-50 dark:hover:bg-zinc-900'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 px-3">Dashboard</h3>
          <nav className="space-y-1">
            {dashboardLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-[var(--foreground)]'
                    : 'text-zinc-500 hover:text-[var(--foreground)] hover:bg-zinc-50 dark:hover:bg-zinc-900'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {user?.role === 'org' && (
          <div>
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 px-3">Organization</h3>
            <nav className="space-y-1">
              {orgLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-[var(--foreground)]'
                      : 'text-zinc-500 hover:text-[var(--foreground)] hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
};
