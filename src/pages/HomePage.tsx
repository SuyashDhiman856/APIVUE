import { motion } from 'motion/react';
import { ArrowRight, Zap, Shield, Globe, Code2, CheckCircle2, Play, Star, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useThemeStore } from '../store/useThemeStore';

export const HomePage = () => {
  const { mode, primaryColor } = useThemeStore();
  
  const usps = [
    {
      title: "Unified API Key",
      description: "Access thousands of premium APIs with a single, secure API key. No more managing multiple credentials.",
      icon: Zap
    },
    {
      title: "Real-time Analytics",
      description: "Monitor your API usage, latency, and costs in real-time with our advanced dashboard.",
      icon: Shield
    },
    {
      title: "Auto-generated SDKs",
      description: "Get started in seconds with automatically generated SDKs for your favorite languages.",
      icon: Code2
    }
  ];

  const differences = [
    {
      title: "Zero Configuration",
      description: "Unlike other marketplaces that require complex setup, APIVUE works out of the box with zero configuration."
    },
    {
      title: "Enterprise-Grade Security",
      description: "We provide built-in OAuth2, rate limiting, and threat protection for every API in our marketplace."
    },
    {
      title: "Transparent Pricing",
      description: "No hidden fees. Pay only for what you use with our clear, usage-based pricing model."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO at TechFlow",
      content: "APIVUE has completely transformed how we integrate third-party services. The unified key is a game-changer.",
      avatar: "https://picsum.photos/seed/sarah/100/100"
    },
    {
      name: "James Wilson",
      role: "Lead Developer at CloudScale",
      content: "The documentation and auto-generated SDKs saved us weeks of development time. Highly recommended!",
      avatar: "https://picsum.photos/seed/james/100/100"
    },
    {
      name: "Elena Rodriguez",
      role: "Founder of AI Startup",
      content: "Finding reliable APIs used to be a chore. With APIVUE, I can discover and test APIs in minutes.",
      avatar: "https://picsum.photos/seed/elena/100/100"
    }
  ];

  const team = [
    {
      name: "Alex Rivera",
      role: "Founder & CEO",
      avatar: "https://picsum.photos/seed/alex/200/200"
    },
    {
      name: "Maya Patel",
      role: "Head of Engineering",
      avatar: "https://picsum.photos/seed/maya/200/200"
    },
    {
      name: "David Kim",
      role: "Product Designer",
      avatar: "https://picsum.photos/seed/david/200/200"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div 
            className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] animate-pulse" 
            style={{ 
              backgroundColor: mode === 'dark' ? `${primaryColor}1a` : `${primaryColor}4d` 
            }}
          />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/20 dark:bg-indigo-500/10 rounded-full blur-[120px]" />
          <div 
            className="absolute inset-0 opacity-30 dark:opacity-20"
            style={{ 
              backgroundImage: `radial-gradient(circle at 2px 2px, var(--border) 1px, transparent 0)`,
              backgroundSize: '40px 40px' 
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-xs font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Now in Public Beta
            </span>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--foreground)] mb-6">
              The Modern Infrastructure <br />
              <span className="text-zinc-400">for API Discovery.</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg text-zinc-500 mb-10">
              APIVUE is the world's most advanced API marketplace. 
              Discover, test, and integrate premium APIs into your stack in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/marketplace" className="btn-primary px-8 py-3 text-lg flex items-center gap-2 group">
                Explore Marketplace
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/register-org" className="btn-secondary px-8 py-3 text-lg">
                Build your API
              </Link>
            </div>
          </motion.div>

          {/* Hero Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="relative mx-auto max-w-5xl rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
              <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072" 
                alt="Global API Connectivity" 
                className="w-full h-full object-cover opacity-80 dark:opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent" />
              
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-lg text-center transform transition-transform hover:scale-105">
                  <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-white mx-auto mb-4" />
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">Unified API Access</h3>
                  <p className="text-white/80 text-sm sm:text-base">
                    One key, thousands of APIs. APIVUE handles the complexity so you can focus on building.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Description Section */}
      <section className="py-24 bg-[var(--card)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">See APIVUE in Action</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">Watch how easy it is to discover, test, and integrate APIs using our platform.</p>
          </div>
          <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden border border-[var(--border)] shadow-2xl aspect-video bg-zinc-900 flex items-center justify-center group cursor-pointer">
            <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/video/1920/1080')] bg-cover bg-center opacity-50 group-hover:scale-105 transition-transform duration-700" />
            <div className="relative z-10 w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
            <div className="absolute bottom-8 left-8 right-8 text-white z-10">
              <p className="text-sm font-medium opacity-80 mb-1">Platform Walkthrough</p>
              <h3 className="text-xl font-bold">Integrating your first API in under 60 seconds</h3>
            </div>
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose APIVUE?</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">We've built the ultimate developer experience for API consumption.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {usps.map((usp, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${primaryColor}1a` }}>
                  <usp.icon className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
                <h3 className="text-xl font-bold mb-3">{usp.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{usp.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How we are different Section */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50 border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">How we are different</h2>
              <p className="text-zinc-500 text-lg mb-10">
                While other marketplaces focus on volume, we focus on quality and developer experience. We curate every API to ensure it meets our high standards.
              </p>
              <div className="space-y-6">
                {differences.map((diff, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{diff.title}</h4>
                      <p className="text-zinc-500 text-sm">{diff.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 border border-[var(--border)] overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/diff/800/800" 
                  alt="Differentiation" 
                  className="w-full h-full object-cover opacity-50 mix-blend-overlay"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center p-12">
                  <div className="space-y-4 w-full">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-12 bg-white dark:bg-zinc-800 rounded-xl border border-[var(--border)] shadow-sm animate-pulse" style={{ width: `${100 - i * 15}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Loved by Developers</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">Join thousands of developers who trust APIVUE for their infrastructure.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] relative">
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 italic mb-8">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border border-[var(--border)]" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold text-sm">{t.name}</h4>
                    <p className="text-xs text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Meet the Team</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-16">The passionate individuals building the future of API infrastructure.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {team.map((member, i) => (
              <div key={i} className="group">
                <div className="relative mb-6 mx-auto w-48 h-48 rounded-full overflow-hidden border-4 border-zinc-800 group-hover:border-primary transition-colors duration-300">
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                </div>
                <h4 className="text-xl font-bold mb-1">{member.name}</h4>
                <p className="text-zinc-500 text-sm mb-4">{member.role}</p>
                <div className="flex justify-center gap-4">
                  <Twitter className="w-4 h-4 text-zinc-600 hover:text-white cursor-pointer transition-colors" />
                  <Linkedin className="w-4 h-4 text-zinc-600 hover:text-white cursor-pointer transition-colors" />
                  <Github className="w-4 h-4 text-zinc-600 hover:text-white cursor-pointer transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

