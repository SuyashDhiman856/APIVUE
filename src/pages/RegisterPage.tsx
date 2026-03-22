import { useState } from 'react';
import { motion } from 'motion/react';
import { Terminal, ArrowRight, Github, Building2, Chrome } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { validateEmail } from '../lib/validation';
import { toast } from 'sonner';
import { useThemeStore } from '../store/useThemeStore';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const { primaryColor, mode } = useThemeStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.length < 2) {
      toast.error('Please enter your full name.');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid company or verified email address.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    
    // Mock registration delay
    setTimeout(() => {
      login({
        id: 'u1',
        name: name,
        email: email,
        role: 'user'
      }, 'mock-token');
      toast.success('Account created successfully!');
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleSignup = () => {
    setIsLoading(true);
    // Mock Google Signup
    setTimeout(() => {
      login({
        id: 'u2',
        name: 'Google User',
        email: 'user@gmail.com',
        role: 'user'
      }, 'google-token');
      toast.success('Signed up with Google');
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 py-12">
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
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Create your account</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Join the APIVUE developer community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none transition-all dark:text-white"
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
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none transition-all dark:text-white"
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
              className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none transition-all dark:text-white"
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
            {isLoading ? 'Creating account...' : 'Create Account'}
            {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-100 dark:border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-zinc-950 px-2 text-zinc-400">Or sign up with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button 
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all dark:text-white"
          >
            <Chrome className="w-4 h-4" style={{ color: primaryColor }} />
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

        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <Link 
            to="/register-org" 
            className="flex items-center justify-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 transition-all group"
            style={{ '--hover-border': primaryColor, '--hover-bg': mode === 'dark' ? 'rgb(39 39 42)' : 'white' } as any}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--hover-border)';
              e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '';
              e.currentTarget.style.backgroundColor = '';
            }}
          >
            <div 
              className="p-2 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 transition-colors"
              onMouseEnter={(e) => e.currentTarget.style.borderColor = primaryColor}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
            >
              <Building2 
                className="w-5 h-5 text-zinc-600 dark:text-zinc-400 transition-colors" 
                onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-zinc-900 dark:text-white">Create an Organization</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Publish and monetize your own APIs</div>
            </div>
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--primary)' }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
