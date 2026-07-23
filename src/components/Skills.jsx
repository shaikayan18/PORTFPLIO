import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, Globe, Database, Cloud, Search, Users, Cpu } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const skillCategories = [
  {
    icon: Cpu, title: 'Programming', color: 'violet',
    skills: [{ name: 'Core Java', level: 80 }, { name: 'JavaScript', level: 75 }, { name: 'Python', level: 65 }, { name: 'SQL', level: 72 }],
  },
  {
    icon: Globe, title: 'Frontend', color: 'cyan',
    skills: [{ name: 'HTML5', level: 90 }, { name: 'CSS3', level: 85 }, { name: 'Bootstrap', level: 78 }, { name: 'Responsive Design', level: 85 }],
  },
  {
    icon: Search, title: 'SEO', color: 'emerald',
    skills: [{ name: 'On-Page SEO', level: 85 }, { name: 'Keyword Research', level: 80 }, { name: 'Technical SEO', level: 75 }, { name: 'Google Search Console', level: 80 }, { name: 'Content Optimization', level: 78 }, { name: 'Backlinking', level: 65 }],
  },
  {
    icon: Cloud, title: 'Cloud & DB', color: 'blue',
    skills: [{ name: 'MySQL', level: 72 }, { name: 'AWS S3', level: 55 }, { name: 'AWS EC2', level: 50 }, { name: 'AWS IAM', level: 50 }],
  },
  {
    icon: Code2, title: 'Tools', color: 'pink',
    skills: [{ name: 'Git & GitHub', level: 78 }, { name: 'VS Code', level: 90 }, { name: 'Google Analytics', level: 70 }, { name: 'Agile/Scrum', level: 72 }],
  },
  {
    icon: Users, title: 'Soft Skills', color: 'purple',
    pills: ['Problem Solving', 'Team Collaboration', 'Communication', 'Leadership', 'Time Management', 'Adaptability', 'Continuous Learning'],
  },
];

const gradientMap = {
  violet: 'from-violet-500 to-purple-600',
  cyan: 'from-cyan-400 to-teal-500',
  emerald: 'from-emerald-400 to-teal-500',
  blue: 'from-blue-400 to-cyan-500',
  pink: 'from-pink-400 to-rose-500',
  purple: 'from-purple-400 to-violet-500',
};

const iconBgMap = {
  violet: 'bg-violet-500/12 border-violet-500/25 text-violet-400',
  cyan: 'bg-cyan-500/12 border-cyan-500/25 text-cyan-400',
  emerald: 'bg-emerald-500/12 border-emerald-500/25 text-emerald-400',
  blue: 'bg-blue-500/12 border-blue-500/25 text-blue-400',
  pink: 'bg-pink-500/12 border-pink-500/25 text-pink-400',
  purple: 'bg-purple-500/12 border-purple-500/25 text-purple-400',
};

function SkillBar({ name, level, color, inView }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-gray-300 text-sm font-inter">{name}</span>
        <span className="text-gray-500 text-xs font-mono">{level}%</span>
      </div>
      <div className="skill-bar-track">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${gradientMap[color]}`}
          style={{ height: '6px' }}
          initial={{ width: 0 }}
          animate={{ width: inView ? `${level}%` : 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" ref={ref} className="relative py-24 lg:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="blob w-80 h-80 bg-violet-600/6 rounded-full" style={{ top: '10%', right: '-5%' }} />
        <div className="blob w-64 h-64 bg-cyan-500/5 rounded-full" style={{ bottom: '10%', left: '-3%', animationDelay: '5s' }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="section-badge"><Code2 size={12} />Skills</span>
            <h2 className="section-title mt-4">Technologies & <span className="gold-text">Expertise</span></h2>
            <div className="divider mx-auto mt-5" />
          </motion.div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {skillCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.div key={cat.title} variants={fadeUp} className="glass-card glass-card-hover p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${iconBgMap[cat.color]}`}>
                      <Icon size={20} />
                    </div>
                    <h3 className="text-white font-bold font-poppins">{cat.title}</h3>
                  </div>
                  {cat.skills ? (
                    <div className="space-y-4">
                      {cat.skills.map(skill => (
                        <SkillBar key={skill.name} {...skill} color={cat.color} inView={inView} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {cat.pills.map(pill => (
                        <span key={pill} className="skill-pill">{pill}</span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
