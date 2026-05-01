import { useState } from 'react';
import { motion } from 'motion/react';
import { Terminal, ArrowRight, Github, Chrome } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { validateEmail } from '../lib/validation';
import { toast } from 'sonner';
import { useThemeStore } from '../store/useThemeStore';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const { findUser } = useUserStore();
  const { primaryColor } = useThemeStore();

  const [activeRole, setActiveRole] = useState<'user' | 'org'>('user');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid company or verified email address.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    
    // Mock login delay
    setTimeout(() => {
      const user = findUser(email);

      if (!user) {
        toast.error('Account not found. Please register first.');
        setIsLoading(false);
        return;
      }

      if (user.role !== activeRole) {
        toast.error(`This account is not registered as an ${activeRole === 'user' ? 'Developer' : 'Organization'}`);
        setIsLoading(false);
        return;
      }

      // In a real app we'd check password, but we'll mock it here
      // For this demo, let's assume 'password123' or the registered password works
      if (password !== 'password123' && password !== user.password) {
        toast.error('Invalid password.');
        setIsLoading(false);
        return;
      }

      login({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }, 'mock-token');

      toast.success('Welcome back!');
      navigate(activeRole === 'user' ? '/dashboard' : '/dashboard/org');
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Mock Google Login
    setTimeout(() => {
      login({
        id: activeRole === 'user' ? 'u2' : 'o2',
        name: activeRole === 'user' ? 'Google User' : 'Google Auth Org',
        email: 'user@gmail.com',
        role: activeRole
      }, 'google-token');
      toast.success('Signed in with Google');
      navigate(activeRole === 'user' ? '/dashboard' : '/dashboard/org');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-[var(--background)] transition-colors">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl"
      >
        <div className="text-center mb-8">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300"
            style={{ 
              backgroundColor: 'var(--primary)',
              boxShadow: `0 0 20px ${primaryColor}4d` 
            }}
          >
            <Terminal className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Welcome back</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Sign in to your APIVUE account</p>
        </div>

        {/* Role Toggle */}
        <div className="flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl mb-6">
          <button
            onClick={() => setActiveRole('user')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeRole === 'user' 
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            Developer
          </button>
          <button
            onClick={() => setActiveRole('org')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeRole === 'org' 
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            Organization
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none transition-all dark:text-white"
              style={{ '--focus-ring': primaryColor } as any}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 2px ${primaryColor}33`;
                e.currentTarget.style.borderColor = primaryColor;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgb(228 228 231)';
              }}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none transition-all dark:text-white"
              style={{ '--focus-ring': primaryColor } as any}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 2px ${primaryColor}33`;
                e.currentTarget.style.borderColor = primaryColor;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgb(228 228 231)';
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 group transition-all disabled:opacity-50"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
            {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-100 dark:border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-zinc-950 px-2 text-zinc-400">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all dark:text-white"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>
          <button 
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all dark:text-white"
          >
            <Github className="w-4 h-4" />
            GitHub
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500">
          New to APIVUE?{' '}
          <Link to="/register" className="font-semibold hover:underline" style={{ color: 'var(--primary)' }}>
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
