import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, GraduationCap, Code2, Search, Users } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const highlights = [
  { icon: GraduationCap, text: 'MCA Graduate', sub: 'Siddaganga Institute of Technology, CGPA 8.6' },
  { icon: Code2, text: 'Web Development', sub: 'HTML, CSS, JavaScript & Responsive UI' },
  { icon: Search, text: 'SEO Specialist', sub: 'On-Page SEO, Keyword Strategy & GSC' },
  { icon: Users, text: 'Team Player', sub: 'Agile collaboration & effective communication' },
  { icon: MapPin, text: 'Based in Tumkur', sub: 'Karnataka, India' },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref} className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="section-badge">
              <span className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
              About Me
            </span>
            <h2 className="section-title mt-4">
              Driven by <span className="gold-text">Innovation & Impact</span>
            </h2>
            <div className="divider mx-auto mt-5" />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left — Concise Description */}
            <motion.div variants={fadeUp} className="space-y-6">
              <div className="space-y-4 text-gray-400 font-inter leading-relaxed">
                <p className="text-lg">
                  I'm <span className="text-white font-semibold">Shaik Akhib K</span>, an MCA Graduate from 
                  <span className="text-violet-400 font-medium"> Siddaganga Institute of Technology, Tumkur</span> (CGPA 8.6).
                </p>
                <p>
                  Specializing in frontend web development and SEO strategy, I build modern, fast, and accessible digital products while driving search visibility through technical and on-page optimization.
                </p>
                <p>
                  As an <span className="text-white font-medium">SEO Intern</span> and Web Developer, I focus on delivering clean code, user-centric interfaces, and measurable online growth.
                </p>
              </div>

              {/* Quick info */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { label: 'Name', value: 'Shaik Akhib K' },
                  { label: 'Email', value: 'heshaikayanro@gmail.com', small: true },
                  { label: 'Phone', value: '+91 8694082378' },
                  { label: 'Location', value: 'Tumkur, Karnataka' },
                ].map(({ label, value, small }) => (
                  <div key={label} className="glass-card p-3 rounded-xl">
                    <p className="text-gray-600 text-xs uppercase tracking-wider mb-1 font-inter">{label}</p>
                    <p className={`text-white font-medium font-inter ${small ? 'text-xs' : 'text-sm'}`}>{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Highlights Grid */}
            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map(({ icon: Icon, text, sub }) => (
                <motion.div
                  key={text}
                  variants={fadeUp}
                  className="glass-card glass-card-hover p-5 rounded-2xl flex flex-col gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <Icon size={20} className="text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold font-poppins text-sm mb-1">{text}</h3>
                    <p className="text-gray-500 text-xs font-inter leading-relaxed">{sub}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
