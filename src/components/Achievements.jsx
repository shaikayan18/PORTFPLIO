import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const achievements = [
  {
    icon: '⚽',
    title: 'Vice-Captain — Football Team',
    org: 'Tumkur University',
    detail: 'South Zone Nationals (Calicut, 2023) — Represented university at state-level competitions as Vice-Captain.',
    color: 'from-emerald-500/20 to-teal-600/20',
    border: 'border-emerald-500/20',
    tag: 'Sports Leadership',
  },
  {
    icon: '🏅',
    title: 'NPTEL Elite Certificate',
    org: 'NPTEL — IIT',
    detail: 'Programming in Java (Jul–Oct 2024) — Earned Elite Certificate covering advanced Core Java concepts.',
    color: 'from-violet-500/20 to-purple-600/20',
    border: 'border-violet-500/20',
    tag: 'Certification',
  },
  {
    icon: '📄',
    title: 'Research Paper Publication',
    org: 'NCEAMBT 2025 National Conference',
    detail: '"ArcFace Model in Modern Face Recognition Systems" — presented at Sree Siddaganga College, Tumkur.',
    color: 'from-cyan-500/20 to-blue-600/20',
    border: 'border-cyan-500/20',
    tag: 'Research',
  },
  {
    icon: '🏆',
    title: 'Organized "Zerone"',
    org: 'Inter-College Competition',
    detail: 'Initiated and organized Zerone, a technical competition with participants from multiple colleges.',
    color: 'from-pink-500/20 to-rose-600/20',
    border: 'border-pink-500/20',
    tag: 'Leadership',
  },
];

export default function Achievements() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="achievements" ref={ref} className="relative py-24 lg:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="blob w-80 h-80 bg-violet-600/6 rounded-full" style={{ top: '20%', right: '0%' }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="section-badge"><Trophy size={12} />Achievements</span>
            <h2 className="section-title mt-4">Milestones & <span className="gold-text">Honours</span></h2>
            <div className="divider mx-auto mt-5" />
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {achievements.map((ach, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                className={`achievement-card glass-card glass-card-hover p-6 rounded-2xl bg-gradient-to-br ${ach.color} border ${ach.border} flex flex-col gap-4`}
              >
                <div className="text-4xl">{ach.icon}</div>
                <div>
                  <span className="tag-badge text-[10px] mb-2 inline-block">{ach.tag}</span>
                  <h3 className="text-white font-bold font-poppins text-base leading-snug mb-1">{ach.title}</h3>
                  <p className="text-violet-300/80 text-xs font-medium font-inter mb-2">{ach.org}</p>
                  <p className="text-gray-400 text-xs font-inter leading-relaxed">{ach.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
