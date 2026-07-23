import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Calendar, CheckCircle2, ExternalLink } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

const experiences = [
  {
    role: 'SEO Intern',
    company: 'Digital Marketing Agency',
    type: 'Internship',
    duration: 'May 2026 – Present',
    status: 'active',
    color: 'emerald',
    icon: '🔍',
    description:
      'Driving organic growth through data-driven SEO strategies, technical optimization, and content enhancement for multiple client websites.',
    responsibilities: [
      'On-Page SEO optimization for improved rankings',
      'Keyword Research & competitor analysis',
      'Google Search Console — monitoring, indexing & performance',
      'Sitemap submission & crawlability optimization',
      'Meta tags, title tags, and URL structure optimization',
      'Internal linking strategies for better crawl depth',
      'Technical SEO: page speed, Core Web Vitals',
      'Basic backlinking and outreach campaigns',
      'SEO content writing for target keywords',
      'Website performance monitoring & reporting',
    ],
    tags: ['SEO', 'GSC', 'Keyword Research', 'Technical SEO', 'Content Writing', 'Analytics'],
  },
  {
    role: 'Frontend Intern',
    company: 'FacePrep',
    type: 'Internship',
    duration: '2025',
    status: 'completed',
    color: 'amber',
    icon: '💻',
    description:
      'Gained hands-on experience in frontend development through structured projects, collaborative sprints, and real-world UI challenges.',
    responsibilities: [
      'Built responsive web interfaces using HTML, CSS & JavaScript',
      'Implemented responsive web design principles',
      'Developed interactive UI components from scratch',
      'Collaborated with team members in Agile workflow',
      'Participated in code reviews and technical discussions',
      'Improved UI/UX with accessibility best practices',
      'Worked on cross-browser compatibility issues',
    ],
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive Design', 'UI Dev', 'Teamwork'],
  },
];

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="experience" ref={ref} className="relative py-24 lg:py-32">
      {/* Subtle background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="blob w-96 h-96 bg-amber-500/5 rounded-full" style={{ top: '20%', left: '-5%' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="section-badge">
              <Briefcase size={12} />
              Experience
            </span>
            <h2 className="section-title mt-4">
              Professional <span className="gold-text">Journey</span>
            </h2>
            <div className="divider mx-auto mt-5" />
          </motion.div>

          {/* Cards */}
          <div className="space-y-8 max-w-5xl mx-auto">
            {experiences.map((exp, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className="exp-card"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    exp.status === 'active'
                      ? 'bg-emerald-500/15 border border-emerald-500/25'
                      : 'bg-amber-500/15 border border-violet-500/25'
                  }`}>
                    {exp.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-white font-bold font-poppins text-xl leading-tight">{exp.role}</h3>
                        <p className="text-violet-400 font-medium font-inter mt-0.5">{exp.company}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${
                          exp.status === 'active'
                            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                            : 'bg-violet-500/10 border-violet-500/25 text-violet-400'
                        }`}>
                          {exp.status === 'active' && <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />}
                          {exp.type}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-gray-500 font-inter">
                          <Calendar size={12} />
                          {exp.duration}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm font-inter mt-3 leading-relaxed">{exp.description}</p>
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="grid sm:grid-cols-2 gap-2 mb-6">
                  {exp.responsibilities.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 size={15} className="text-violet-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-400 text-sm font-inter">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map(tag => (
                    <span key={tag} className="tag-badge">{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
