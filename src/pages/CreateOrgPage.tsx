import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Mail, 
  Globe, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Users,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import { toast } from 'sonner';

export const CreateOrgPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const { addUser, findUser } = useUserStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    description: '',
    size: '1-10 employees',
    industry: '',
    location: '',
    email: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isPublicEmail = (email: string) => {
    const publicDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'aol.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return publicDomains.includes(domain);
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Organization name is required';
      if (!formData.website.trim()) newErrors.website = 'Website URL is required';
      else if (!/^https?:\/\/.*/.test(formData.website)) newErrors.website = 'Invalid URL format (must start with http/https)';
      if (!formData.description.trim()) newErrors.description = 'Business description is required';
    } else if (currentStep === 2) {
      if (!formData.industry.trim()) newErrors.industry = 'Industry is required';
      if (!formData.location.trim()) newErrors.location = 'Headquarters location is required';
      if (!formData.email.trim()) newErrors.email = 'Contact email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
      else if (isPublicEmail(formData.email)) {
        newErrors.email = 'Please use a genuine company email (non-public domain)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    } else {
      toast.error('Please fix the errors before continuing');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(2)) return;

    const existingUser = findUser(formData.email);
    if (existingUser) {
      toast.error('An account with this email already exists.');
      return;
    }

    const orgId = `org-${Math.random().toString(36).substr(2, 9)}`;
    const newOrg = {
      id: orgId,
      name: formData.name,
      email: formData.email,
      role: 'org' as const,
      password: 'password123', // Default for now
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`
    };

    addUser(newOrg);

    // Mock org creation
    login({
      id: newOrg.id,
      name: newOrg.name,
      email: newOrg.email,
      role: newOrg.role,
      avatar: newOrg.avatar
    }, 'mock-token');

    toast.success('Organization created successfully!');
    navigate('/profile/org');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Create your Organization</h1>
        <p className="text-zinc-500">Everything you need to start publishing and monetizing your APIs on APIVUE.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="flex items-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-grow h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: step >= s ? '100%' : '0%' }}
                className="h-full bg-zinc-900 dark:bg-white"
              />
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Organization Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="APIVUE Infrastructure Inc." 
                        className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-800 border ${errors.name ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'} rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900`} 
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Website URL</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input 
                        type="url" 
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://apivue.com" 
                        className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-800 border ${errors.website ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'} rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900`} 
                      />
                    </div>
                    {errors.website && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.website}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Business Description</label>
                    <textarea 
                      rows={4} 
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Tell us about your organization and the APIs you plan to publish..." 
                      className={`w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border ${errors.description ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'} rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900`} 
                    />
                    {errors.description && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.description}</p>}
                  </div>
                </div>
                <button type="button" onClick={handleNext} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                  Continue to Details <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold mb-6">Organization Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Organization Size</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <select 
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900 appearance-none"
                      >
                        <option>1-10 employees</option>
                        <option>11-50 employees</option>
                        <option>51-200 employees</option>
                        <option>201+ employees</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Industry</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input 
                        type="text" 
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        placeholder="Technology, Finance, etc." 
                        className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-800 border ${errors.industry ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'} rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900`} 
                      />
                    </div>
                    {errors.industry && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.industry}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Headquarters</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input 
                        type="text" 
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="San Francisco, CA" 
                        className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-800 border ${errors.location ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'} rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900`} 
                      />
                    </div>
                    {errors.location && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.location}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Contact Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="support@apivue.com" 
                        className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-800 border ${errors.email ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'} rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-900`} 
                      />
                    </div>
                    {errors.email && (
                      <p className={`text-xs flex items-center gap-1 ${errors.email.includes('genuine') ? 'text-amber-500' : 'text-red-500'}`}>
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-grow py-3">Back</button>
                  <button type="button" onClick={handleNext} className="btn-primary flex-[2] py-3 flex items-center justify-center gap-2">
                    Finalize Setup <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold">Ready to Launch</h2>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl text-left space-y-3 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Organization</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Contact</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Industry</span>
                    <span className="font-medium">{formData.industry}</span>
                  </div>
                </div>
                <p className="text-zinc-500 max-w-md mx-auto text-sm">
                  By clicking "Create Organization", you agree to our Marketplace Terms of Service and API Provider Agreement.
                </p>
                <div className="flex gap-4 mt-12">
                  <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-grow py-3">Back</button>
                  <button type="submit" className="btn-primary flex-[2] py-3">Create Organization</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
};
