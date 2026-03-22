import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { apiClient } from '../lib/api-client';
import { APICard } from '../components/api-card/APICard';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';

export const MarketplacePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState('All');
  const { primaryColor, mode } = useThemeStore();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setSearch(q);
    }
  }, [searchParams]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (val) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const { data: apis, isLoading } = useQuery({
    queryKey: ['apis'],
    queryFn: apiClient.getApis
  });

  const categories = ['All', 'Weather', 'Machine Learning', 'Finance', 'Location', 'Social', 'Utilities'];

  const filteredApis = apis?.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(search.toLowerCase()) || 
                         api.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || api.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">API Marketplace</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Discover and integrate the world's most powerful APIs.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium transition-all border border-zinc-200 dark:border-zinc-700"
            style={{ 
              '--hover-bg': `${primaryColor}15`,
              '--hover-text': primaryColor,
              '--hover-border': `${primaryColor}4d`
            } as any}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
              e.currentTarget.style.color = 'var(--hover-text)';
              e.currentTarget.style.borderColor = 'var(--hover-border)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '';
              e.currentTarget.style.color = '';
              e.currentTarget.style.borderColor = '';
            }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-8">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Categories</h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
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
                    className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 transition-all" 
                    style={{ accentColor: primaryColor }}
                  />
                  <span 
                    className="text-sm text-zinc-600 dark:text-zinc-400 transition-colors"
                    style={{ '--hover-color': primaryColor } as any}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--hover-color)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = ''}
                  >
                    {p}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <div className="flex-grow">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-zinc-100 rounded-xl animate-pulse border border-zinc-200" />
              ))}
            </div>
          ) : filteredApis?.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-950 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-black dark:text-white">No APIs found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredApis?.map((api) => (
                <APICard key={api.id} api={api} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
