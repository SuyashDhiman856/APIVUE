import { motion } from 'motion/react';
import { Star, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API } from '../../types';
import { useThemeStore } from '../../store/useThemeStore';

interface APICardProps {
  api: API;
}

export const APICard = ({ api }: APICardProps) => {
  const { primaryColor, mode } = useThemeStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col h-full"
      style={{ 
        backgroundColor: mode === 'dark' ? `${primaryColor}0d` : `${primaryColor}08`,
        borderColor: mode === 'dark' ? `${primaryColor}33` : `${primaryColor}1a`
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div 
          className="w-12 h-12 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-transform"
          style={{ 
            borderColor: mode === 'dark' ? `${primaryColor}33` : `${primaryColor}1a`,
            backgroundColor: primaryColor,
            color: 'white'
          }}
        >
          {/* Placeholder for icon */}
          <div className="font-bold text-lg">{api.name[0]}</div>
        </div>
        <span 
          className="text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider"
          style={{ 
            backgroundColor: mode === 'dark' ? `${primaryColor}33` : `${primaryColor}1a`,
            color: primaryColor
          }}
        >
          {api.category}
        </span>
      </div>

      <h3 
        className="text-lg font-bold text-zinc-900 dark:text-white mb-1 transition-colors"
        style={{ '--hover-color': primaryColor } as any}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--hover-color)'}
        onMouseLeave={(e) => e.currentTarget.style.color = ''}
      >
        {api.name}
      </h3>
      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
        By {api.provider}
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 line-clamp-2 flex-grow leading-relaxed">
        {api.description}
      </p>

      <div 
        className="flex items-center justify-between mt-auto pt-4 border-t"
        style={{ borderColor: mode === 'dark' ? `${primaryColor}1a` : `${primaryColor}0d` }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <Star 
              className="w-3.5 h-3.5" 
              style={{ color: primaryColor, fill: primaryColor }} 
            />
            {api.rating}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <Users className="w-3.5 h-3.5 text-zinc-400" />
            {api.usageCount.toLocaleString()}
          </div>
        </div>
        
        <Link 
          to={`/api/${api.id}`}
          className="text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-widest"
          style={{ color: primaryColor }}
        >
          Explore <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};
