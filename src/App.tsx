/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Navbar } from './components/navbar/Navbar';
import { Sidebar } from './components/sidebar/Sidebar';
import { ControlCenter } from './components/control-center/ControlCenter';
import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { APIDetailPage } from './pages/APIDetailPage';
import { UserDashboard } from './pages/UserDashboard';
import { OrganizationDashboard } from './pages/OrganizationDashboard';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CreateOrgPage } from './pages/CreateOrgPage';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { useEffect } from 'react';

// Protected Route Component
const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'user' | 'org' }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to="/dashboard" />;
  
  return <>{children}</>;
};

const AppContent = () => {
  const { mode, primaryColor } = useThemeStore();
  const location = useLocation();
  const isDocsPage = location.pathname.startsWith('/docs');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    document.documentElement.style.setProperty('--primary', primaryColor);
  }, [mode, primaryColor]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <Navbar />
      <div className="flex">
        {isDocsPage && <Sidebar />}
        <main className={`flex-1 transition-all duration-300 ${isDocsPage ? 'xl:pl-64' : 'w-full'}`}>
          <div className={isDocsPage ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/api/:apiId" element={<APIDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/register-org" element={<CreateOrgPage />} />
              <Route path="/docs/*" element={<div className="p-8">Documentation Content Coming Soon...</div>} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/dashboard/org" 
                element={
                  <ProtectedRoute role="org">
                    <OrganizationDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
          
          <footer className={`bg-[var(--card)] border-t border-[var(--border)] py-12 mt-20 transition-all duration-300 ${isDocsPage ? 'xl:ml-64' : ''}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                <div className="col-span-2">
                  <div className="flex items-center gap-2 mb-4">
                    <div 
                      className="w-8 h-8 rounded flex items-center justify-center transition-all duration-300"
                      style={{ 
                        backgroundColor: 'var(--primary)',
                        boxShadow: `0 0 15px ${primaryColor}80` 
                      }}
                    >
                      <span className="text-white text-xs font-bold">N</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight">APIVUE</span>
                  </div>
                  <p className="text-zinc-500 text-sm max-w-xs">
                    The modern infrastructure for API discovery and integration. 
                    Built for developers, by developers.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-4">Product</h4>
                  <ul className="space-y-2 text-sm text-zinc-500">
                    <li><Link to="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link></li>
                    <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-4">Company</h4>
                  <ul className="space-y-2 text-sm text-zinc-500">
                    <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
                    <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                    <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                  </ul>
                </div>
              </div>
              <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-zinc-400">© 2026 APIVUE Infrastructure Inc. All rights reserved.</p>
                <div className="flex gap-6 text-xs text-zinc-400">
                  <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                  <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
      <ControlCenter />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

