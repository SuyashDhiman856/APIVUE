import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Menu, X, Terminal, LayoutDashboard, LogIn, Moon, Sun, LogOut, Palette, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useControlCenterStore } from '../../store/useControlCenterStore';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { mode, setMode, primaryColor } = useThemeStore();
  const { setIsOpen: setControlCenterOpen } = useControlCenterStore();
  const location = useLocation();

  const navLinks = [
    { name: 'Marketplace', path: '/marketplace' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                style={{ 
                  backgroundColor: 'var(--primary)',
                  boxShadow: `0 0 15px ${primaryColor}80` 
                }}
              >
                <Terminal className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-[var(--foreground)]">APIVUE</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-medium transition-colors"
                  style={{ 
                    color: location.pathname === link.path ? 'var(--primary)' : 'rgb(113 113 122)' 
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== link.path) {
                      e.currentTarget.style.color = 'var(--primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== link.path) {
                      e.currentTarget.style.color = 'rgb(113 113 122)';
                    }
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search APIs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-primary rounded-full text-sm w-64 transition-all outline-none text-black dark:text-white placeholder:text-zinc-400 shadow-sm"
              />
            </form>

            <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-2" />

            <button
              onClick={() => setControlCenterOpen(true)}
              className="p-2 text-zinc-500 rounded-lg transition-all"
              style={{ 
                '--hover-bg': `${primaryColor}15`,
                '--hover-text': primaryColor
              } as any}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                e.currentTarget.style.color = 'var(--hover-text)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'rgb(113 113 122)';
              }}
              title="Theme Settings"
            >
              <Palette className="w-5 h-5" />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to={user?.role === 'org' ? '/dashboard/org' : '/dashboard'} className="flex items-center gap-2 p-1.5 rounded-full border border-[var(--border)] hover:border-primary/50 transition-all">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <User className="w-4 h-4 text-zinc-500" />
                  </div>
                  <span className="text-sm font-medium pr-2 hidden lg:block">{user?.name}</span>
                </Link>
                <button onClick={logout} className="text-zinc-400 hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-zinc-500 hover:text-primary">
                  Sign in
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary py-1.5 text-sm transition-all duration-300"
                  style={{ boxShadow: `0 0 15px ${primaryColor}4d` }}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setControlCenterOpen(true)}
              className="p-2 text-zinc-500"
            >
              <Palette className="w-5 h-5" />
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-zinc-500">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[var(--card)] border-b border-[var(--border)] px-4 py-4 space-y-4"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="block text-base font-medium transition-colors"
              style={{ color: location.pathname === link.path ? primaryColor : 'rgb(113 113 122)' }}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-[var(--border)] flex flex-col gap-3">
            <Link to="/login" className="btn-secondary text-center" onClick={() => setIsOpen(false)}>Login</Link>
            <Link to="/register" className="btn-primary text-center" onClick={() => setIsOpen(false)}>Get Started</Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};
