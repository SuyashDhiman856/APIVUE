import { motion } from 'motion/react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { apiClient } from '../lib/api-client';
import { APICard } from '../components/api-card/APICard';
import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';
import { useApiStore } from '../store/useApiStore';

export const MarketplacePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState('All');
  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
  const { primaryColor, mode } = useThemeStore();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { apis } = useApiStore();

  const togglePricing = (p: string) => {
    setSelectedPricing(prev => 
      prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p]
    );
  };

  const categories = ['All', 'Weather', 'Machine Learning', 'Finance', 'Location', 'Language', 'AI', 'Health', 'Security', 'News'];

  const filteredApis = useMemo(() => {
    return apis.filter(api => {
      const matchesCategory = category === 'All' || api.category === category;
      const matchesPricing = selectedPricing.length === 0 || selectedPricing.includes(api.price);
      return matchesCategory && matchesPricing;
    });
  }, [apis, category, selectedPricing]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            <span 
              className="bg-clip-text text-transparent animate-gradient-move inline-block"
              style={{ 
                backgroundImage: mode === 'dark' 
                  ? `linear-gradient(to right, #60a5fa, #22d3ee, #34d399)` 
                  : `linear-gradient(to right, #f97316, #f43f5e, #8b5cf6)`,
                backgroundSize: '200% auto'
              }}
            >
              AI-integrated API Marketplace
            </span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">Discover and integrate the world's most powerful APIs.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium transition-all hover:border-primary hover:text-primary group shadow-sm"
            style={{ '--hover-border': primaryColor, '--hover-text': primaryColor } as any}
          >
            <Filter className="w-4 h-4 text-zinc-400 group-hover:text-primary transition-colors" />
            <span className="text-zinc-600 dark:text-zinc-400 group-hover:text-primary">Filter APIs</span>
          </button>
        </div>
      </div>

      <div className="flex gap-8 relative">
        {/* Sidebar Filters */}
        <aside className={`${showMobileFilters ? 'block absolute inset-0 z-50 bg-[var(--background)] p-6 rounded-2xl border border-[var(--border)] shadow-2xl h-fit' : 'hidden'} lg:block lg:relative lg:p-0 lg:bg-transparent lg:border-none lg:shadow-none w-64 shrink-0 space-y-8`}>
          <div className="flex items-center justify-between lg:hidden mb-6">
            <h3 className="font-bold">Filters</h3>
            <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Categories</h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    if (showMobileFilters) setShowMobileFilters(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ 
                    backgroundColor: category === cat ? primaryColor : 'transparent',
                    color: category === cat ? 'white' : 'rgb(113 113 122)',
                    boxShadow: category === cat ? `0 10px 15px -3px ${primaryColor}33` : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (category !== cat) {
                      e.currentTarget.style.backgroundColor = `${primaryColor}15`;
                      e.currentTarget.style.color = primaryColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (category !== cat) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'rgb(113 113 122)';
                    }
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Pricing</h3>
            <div className="space-y-2">
              {['Free', 'Freemium', 'Paid'].map((p) => (
                <label key={p} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={selectedPricing.includes(p)}
                    onChange={() => togglePricing(p)}
                    className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 transition-all" 
                    style={{ accentColor: primaryColor }}
                  />
                  <span 
                    className="text-sm text-zinc-600 dark:text-zinc-400 transition-colors"
                    style={{ color: selectedPricing.includes(p) ? primaryColor : undefined }}
                  >
                    {p}
                  </span>
                </label>
              ))}
            </div>
          </div>
          {selectedPricing.length > 0 || category !== 'All' ? (
            <button 
              onClick={() => {
                setCategory('All');
                setSelectedPricing([]);
                setSearchParams({});
              }}
              className="w-full py-2 text-xs font-medium text-zinc-500 hover:text-primary transition-colors border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg"
            >
              Clear all filters
            </button>
          ) : null}
        </aside>

        {/* Main Grid */}
        <div className="flex-grow">
          {filteredApis.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-950 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-black dark:text-white">No APIs found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredApis.map((api) => (
                <APICard key={api.id} api={api} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
