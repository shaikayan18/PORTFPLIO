import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

const education = [
  { degree: 'Master of Computer Applications (MCA)', institution: 'Siddaganga Institute of Technology', location: 'Tumkur, Karnataka', duration: '2024 – 2025', score: 'CGPA: 8.6', icon: '🎓', highlight: true },
  { degree: 'Bachelor of Computer Applications (BCA)', institution: 'Sree Siddaganga College of Arts, Science and Commerce', location: 'Tumkur, Karnataka', duration: '2020 – 2023', score: 'CGPA: 7.5', icon: '📚', highlight: false },
  { degree: 'Pre-University (PUC)', institution: 'Sarvodaya PU College', location: 'Tumkur, Karnataka', duration: '2018 – 2020', score: '72%', icon: '🏫', highlight: false },
];

export default function Education() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="education" ref={ref} className="relative py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="section-badge"><GraduationCap size={12} />Education</span>
            <h2 className="section-title mt-4">Academic <span className="gold-text">Background</span></h2>
            <div className="divider mx-auto mt-5" />
          </motion.div>

          <div className="relative pl-12">
            <div className="timeline-line" />
            <div className="space-y-8">
              {education.map((edu, idx) => (
                <motion.div key={idx} variants={fadeUp} className="relative">
                  <div className="absolute -left-[30px] top-5 timeline-dot">
                    <span className="text-sm">{edu.icon}</span>
                  </div>
                  <div className={`glass-card glass-card-hover p-6 rounded-2xl ${edu.highlight ? 'border-violet-500/25 glow-primary' : ''}`}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-white font-bold font-poppins text-lg leading-tight">{edu.degree}</h3>
                        <p className="text-violet-400 font-medium font-inter text-sm mt-1">{edu.institution}</p>
                        <p className="text-gray-600 text-xs font-inter mt-0.5">{edu.location}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className="text-xs text-gray-500 font-mono">{edu.duration}</span>
                        <span className="px-3 py-1 bg-violet-500/15 border border-violet-500/25 rounded-full text-violet-400 text-xs font-semibold">
                          {edu.score}
                        </span>
                      </div>
                    </div>
                    {edu.highlight && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                        <span className="text-emerald-400 text-xs font-mono">✓</span>
                        <span className="text-gray-500 text-xs font-inter">Highest academic achievement — currently pursuing advanced coursework</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
