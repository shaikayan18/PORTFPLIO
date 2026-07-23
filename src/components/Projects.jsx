import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Github, ExternalLink, Code2 } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

const projects = [
  {
    title: 'Face Recognition Attendance System',
    subtitle: 'ArcFace Model Implementation',
    description: 'Python-based facial recognition system automating attendance via real-time face detection & ArcFace embeddings with cosine similarity. Presented as research paper at NCEAMBT 2025 National Conference, Sree Siddaganga College.',
    gradient: 'from-purple-600/30 to-blue-600/30',
    icon: '🤖',
    features: ['Real-time face detection & recognition', 'ArcFace model + cosine similarity', 'Secure attendance data storage', 'Team-collaborative debugging', 'Research at NCEAMBT 2025'],
    tech: ['Python', 'ArcFace', 'OpenCV', 'Machine Learning'],
    github: 'https://github.com/shaikayan18/arcface-model',
    live: null,
    badge: '🏆 Research Paper',
  },
  {
    title: 'Mobifixx — Mobile Repair Platform',
    subtitle: 'Full-Stack Business Website',
    description: 'Digital platform for Mobifixx, a local mobile repair shop. Handles service listings, customer inquiries, location mapping, and hosting. Fully SEO-optimized and deployed live at mobifixx.in.',
    gradient: 'from-amber-600/30 to-orange-600/30',
    icon: '🔧',
    features: ['Service listings with categories', 'Customer inquiry & booking forms', 'Location mapping integration', 'SEO-optimized (mobifixx.in)', 'Admin content management'],
    tech: ['HTML', 'CSS', 'JavaScript', 'MySQL', 'PHP'],
    github: 'https://github.com/shaikayan18',
    live: 'https://mobifixx.in/?i=1',
    badge: '🌐 Live Site',
  },
  {
    title: 'FunFusion — Web Game Hub',
    subtitle: 'Vanilla JS Game Platform',
    description: 'Responsive, interactive web-based game hub featuring multiple lightweight browser-friendly mini-games. Built with zero external dependencies — pure HTML, CSS, and JavaScript only.',
    gradient: 'from-emerald-600/30 to-teal-600/30',
    icon: '🎮',
    features: ['Multiple mini-games in one platform', 'Zero external libraries', 'Cross-browser compatibility', 'Smooth responsive design'],
    tech: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    github: 'https://github.com/shaikayan18/Fun-Fusion',
    live: null,
    badge: '⚡ Vanilla JS',
  },
];

const techColors = {
  Python: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
  ArcFace: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
  OpenCV: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
  'Machine Learning': 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
  HTML: 'bg-orange-500/15 text-orange-300 border-orange-500/25',
  CSS: 'bg-blue-400/15 text-blue-300 border-blue-400/25',
  JavaScript: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/25',
  MySQL: 'bg-teal-500/15 text-teal-300 border-teal-500/25',
  PHP: 'bg-purple-400/15 text-purple-300 border-purple-400/25',
  'Responsive Design': 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
};

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="projects" ref={ref} className="relative py-24 lg:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="blob w-96 h-96 bg-amber-500/5 rounded-full" style={{ bottom: '10%', left: '5%' }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="section-badge"><Code2 size={12} />Projects</span>
            <h2 className="section-title mt-4">Featured <span className="gold-text">Work</span></h2>
            <p className="text-gray-500 text-base font-inter mt-4 max-w-xl mx-auto">Projects showcasing web development, machine learning, and live deployments.</p>
            <div className="divider mx-auto mt-5" />
          </motion.div>

          <div className="space-y-8">
            {projects.map((proj, idx) => (
              <motion.article key={idx} variants={fadeUp} className="project-card group">
                <div className="grid lg:grid-cols-5 gap-0 min-h-[280px]">
                  <div className={`lg:col-span-2 relative overflow-hidden bg-gradient-to-br ${proj.gradient} flex items-center justify-center p-8 min-h-[200px]`}>
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                    <div className="relative z-10 text-center">
                      <div className="text-7xl mb-4">{proj.icon}</div>
                      <span className="glass-card px-3 py-1.5 text-xs font-semibold text-white/80">{proj.badge}</span>
                    </div>
                    <div className="absolute top-4 left-4 text-white/10 font-poppins font-black text-6xl select-none">0{idx + 1}</div>
                  </div>

                  <div className="lg:col-span-3 p-6 lg:p-8 flex flex-col justify-between">
                    <div>
                      <p className="text-violet-400/70 text-xs font-mono tracking-wider uppercase mb-1">{proj.subtitle}</p>
                      <h3 className="text-white font-bold font-poppins text-xl lg:text-2xl leading-tight mb-3">{proj.title}</h3>
                      <p className="text-gray-400 text-sm font-inter leading-relaxed mb-4">{proj.description}</p>
                      <div className="grid sm:grid-cols-2 gap-1.5 mb-4">
                        {proj.features.map((f, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-violet-500 text-xs mt-0.5">▸</span>
                            <span className="text-gray-500 text-xs font-inter">{f}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {proj.tech.map(t => (
                          <span key={t} className={`px-2.5 py-1 rounded-md text-xs font-medium border ${techColors[t] || 'bg-violet-500/15 text-violet-300 border-violet-500/25'}`}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <a href={proj.github} target="_blank" rel="noreferrer" className="btn-secondary text-sm py-2.5 px-5">
                        <Github size={16} />GitHub
                      </a>
                      {proj.live && (
                        <a href={proj.live} target="_blank" rel="noreferrer" className="btn-primary text-sm py-2.5 px-5">
                          <ExternalLink size={16} />Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div variants={fadeUp} className="text-center mt-12">
            <a href="https://github.com/shaikayan18" target="_blank" rel="noreferrer" className="btn-secondary inline-flex">
              <Github size={18} />View All on GitHub
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
