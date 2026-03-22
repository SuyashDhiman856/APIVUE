import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Palette, X } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useControlCenterStore } from '../../store/useControlCenterStore';

export const ControlCenter = () => {
  const { isOpen, setIsOpen } = useControlCenterStore();
  const { mode, setMode, primaryColor, setPrimaryColor } = useThemeStore();

  const colors = [
    { name: 'Pink', value: '#ec4899' },
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Violet', value: '#8b5cf6' },
    { name: 'Zinc', value: '#09090b' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-80 bg-zinc-950 border-l border-zinc-800 z-[70] p-8 shadow-2xl text-white"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white">Appearance</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Mode</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMode('light')}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl border transition-all"
                    style={{ 
                      borderColor: mode === 'light' ? primaryColor : 'rgb(39 39 42)',
                      backgroundColor: mode === 'light' ? `${primaryColor}1a` : 'rgb(24 24 27)',
                      color: mode === 'light' ? primaryColor : 'rgb(161 161 170)'
                    }}
                  >
                    <Sun className="w-4 h-4" />
                    <span className="text-sm font-medium">Light</span>
                  </button>
                  <button
                    onClick={() => setMode('dark')}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl border transition-all"
                    style={{ 
                      borderColor: mode === 'dark' ? primaryColor : 'rgb(39 39 42)',
                      backgroundColor: mode === 'dark' ? `${primaryColor}1a` : 'rgb(24 24 27)',
                      color: mode === 'dark' ? primaryColor : 'rgb(161 161 170)'
                    }}
                  >
                    <Moon className="w-4 h-4" />
                    <span className="text-sm font-medium">Dark</span>
                  </button>
                </div>
              </div>

                <div>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Primary Color</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setPrimaryColor(color.value)}
                        className="group flex flex-col items-center gap-2"
                      >
                        <div 
                          className="w-10 h-10 rounded-full border-2 transition-all"
                          style={{ 
                            backgroundColor: color.value,
                            borderColor: primaryColor === color.value ? primaryColor : 'transparent',
                            transform: primaryColor === color.value ? 'scale(1.1)' : 'scale(1)',
                            boxShadow: primaryColor === color.value ? `0 0 10px ${primaryColor}80` : 'none'
                          }}
                        />
                        <span className="text-[10px] font-medium text-zinc-400 group-hover:text-white">{color.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-6">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">Custom Color Picker</label>
                    <div className="flex gap-3 items-center">
                      <div className="relative w-12 h-12 rounded-xl border border-zinc-800 overflow-hidden shadow-sm">
                        <input 
                          type="color" 
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                        />
                      </div>
                      <div className="flex-grow">
                        <input 
                          type="text" 
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-white outline-none transition-colors"
                          style={{ '--focus-border': primaryColor } as any}
                          onFocus={(e) => e.currentTarget.style.borderColor = 'var(--focus-border)'}
                          onBlur={(e) => e.currentTarget.style.borderColor = 'rgb(39 39 42)'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  Theme settings are saved locally and will persist across sessions.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
