import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Mail, ExternalLink, Github, Linkedin, Phone } from 'lucide-react';

const roles = ['SEO Intern', 'Frontend Developer', 'MCA Graduate', 'Web Developer'];

export default function Hero() {
  const [displayText, setDisplayText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex];
    let timeout;
    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex(c => c + 1), 100);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex(c => c - 1), 55);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setRoleIndex(r => (r + 1) % roles.length);
    }
    setDisplayText(current.substring(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, roleIndex]);

  const scrollTo = (href) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Blobs */}
      <div className="blob w-[500px] h-[500px] bg-violet-600/8 rounded-full" style={{ top: '-10%', right: '-10%' }} />
      <div className="blob w-[400px] h-[400px] bg-cyan-500/6 rounded-full" style={{ bottom: '-5%', left: '-5%', animationDelay: '4s' }} />
      <div className="blob w-[300px] h-[300px] bg-purple-700/5 rounded-full" style={{ top: '40%', left: '30%', animationDelay: '8s' }} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.6) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh] py-12 lg:py-0">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-6 text-center lg:text-left items-center lg:items-start w-full"
          >
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <span className="section-badge">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Available for Opportunities
              </span>
            </motion.div>

            {/* Name */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <p className="text-gray-400 text-lg font-inter mb-2">Hello, I'm</p>
              <h1 className="font-poppins font-black text-white leading-none" style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)' }}>
                Shaik{' '}
                <span className="text-glow" style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Akhib K
                </span>
              </h1>
            </motion.div>

            {/* Typing Role */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex items-center justify-center lg:justify-start gap-3">
              <span className="text-gray-600 font-mono text-lg">&gt;</span>
              <div className="hero-subtitle-role">
                {displayText}
                <span className="typing-cursor" />
              </div>
            </motion.div>

            {/* Concise Description */}
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="text-gray-400 text-sm sm:text-base lg:text-lg font-inter leading-relaxed max-w-xl">
              MCA Graduate specializing in responsive frontend development and strategic SEO optimization to build high-impact web platforms.
            </motion.p>

            {/* Clean CTA Buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center lg:justify-start gap-3 w-full">
              <button onClick={() => scrollTo('#contact')} className="btn-primary">
                <Mail size={17} />Get In Touch
              </button>
              <button onClick={() => scrollTo('#projects')} className="btn-secondary">
                <ExternalLink size={17} />View Projects
              </button>
            </motion.div>

            {/* Social links */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 w-full lg:w-auto">
              <span className="text-gray-600 text-sm font-inter">Find me on</span>
              <div className="flex justify-center gap-3">
                {[
                  { icon: Github, href: 'https://github.com/shaikayan18', label: 'GitHub' },
                  { icon: Linkedin, href: 'https://linkedin.com/in/shaik-akhib18', label: 'LinkedIn' },
                  { icon: Mail, href: 'mailto:heshaikayanro@gmail.com', label: 'Email' },
                  { icon: Phone, href: 'tel:8694082378', label: 'Phone' },
                ].map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-violet-400 hover:border-violet-500/30 hover:bg-violet-500/8 transition-all duration-200">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Photo + Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center gap-8 w-full"
          >
            {/* Profile Image */}
            <div className="relative mx-auto">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 blur-xl" />
              <div className="relative w-56 h-56 xs:w-64 xs:h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 mx-auto">
                <div className="absolute inset-0 rounded-full" style={{
                  background: 'conic-gradient(from 0deg, #8b5cf6, #22d3ee, #7c3aed, #8b5cf6)',
                  padding: '3px', animation: 'spin 8s linear infinite',
                }}>
                  <div className="w-full h-full rounded-full bg-[#050508]" />
                </div>
                <div className="absolute inset-[4px] rounded-full overflow-hidden z-10">
                  <img src="/me.jpg" alt="Shaik Akhib K" className="w-full h-full object-cover" loading="eager" />
                </div>

                {/* Floating badges */}
                <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-4 -right-2 sm:-right-4 glass-card px-2.5 py-1.5 sm:px-3 sm:py-2 flex items-center gap-2 z-20">
                  <span className="text-base sm:text-lg">🎓</span>
                  <div>
                    <p className="text-white text-[10px] sm:text-xs font-semibold font-poppins">MCA Graduate</p>
                    <p className="text-violet-400 text-[9px] sm:text-[10px]">CGPA: 8.6</p>
                  </div>
                </motion.div>

                <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                  className="absolute -bottom-4 -left-2 sm:-left-4 glass-card px-2.5 py-1.5 sm:px-3 sm:py-2 flex items-center gap-2 z-20">
                  <span className="text-base sm:text-lg">⚡</span>
                  <div>
                    <p className="text-white text-[10px] sm:text-xs font-semibold font-poppins">SEO Intern</p>
                    <p className="text-emerald-400 text-[9px] sm:text-[10px]">● Active</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full max-w-sm px-4 sm:px-0">
              {[
                { number: '8.6', label: 'CGPA' },
                { number: '3+', label: 'Projects' },
                { number: '2', label: 'Internships' },
              ].map(({ number, label }) => (
                <div key={label} className="stat-card p-3 sm:p-4">
                  <div className="stat-number text-xl sm:text-2xl lg:text-3xl">{number}</div>
                  <p className="text-gray-500 text-[10px] sm:text-xs font-inter mt-1">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-gray-600 text-xs tracking-widest uppercase font-inter">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ArrowDown size={16} className="text-violet-500/60" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
