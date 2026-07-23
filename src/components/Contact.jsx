import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Github, Send, MessageSquare } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'heshaikayanro@gmail.com', href: 'mailto:heshaikayanro@gmail.com' },
  { icon: Phone, label: 'Phone', value: '+91 8694082378', href: 'tel:8694082378' },
  { icon: MapPin, label: 'Location', value: 'Tumkur, Karnataka, India', href: null },
  { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/shaik-akhib18', href: 'https://linkedin.com/in/shaik-akhib18' },
  { icon: Github, label: 'GitHub', value: 'github.com/shaikayan18', href: 'https://github.com/shaikayan18' },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('success');
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setStatus(null), 4000);
  };

  return (
    <section id="contact" ref={ref} className="relative py-24 lg:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="blob w-96 h-96 bg-violet-600/7 rounded-full" style={{ bottom: '0%', right: '-5%' }} />
        <div className="blob w-72 h-72 bg-cyan-500/5 rounded-full" style={{ top: '10%', left: '-5%', animationDelay: '6s' }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="section-badge"><MessageSquare size={12} />Contact</span>
            <h2 className="section-title mt-4">Let's <span className="gold-text">Connect</span></h2>
            <p className="text-gray-500 text-base font-inter mt-4 max-w-xl mx-auto">
              Open to new opportunities, collaborations, and interesting projects. Let's build something great together.
            </p>
            <div className="divider mx-auto mt-5" />
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left — Info */}
            <motion.div variants={fadeUp} className="space-y-6">
              <div>
                <h3 className="text-white font-bold font-poppins text-2xl mb-2">Get In Touch</h3>
                <p className="text-gray-400 font-inter leading-relaxed">
                  Whether you have an opportunity, a project idea, or just want to say hello —
                  my inbox is always open. I'll get back to you as soon as possible!
                </p>
              </div>
              <div className="space-y-3">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="glass-card glass-card-hover p-4 rounded-xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-violet-400" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs font-inter uppercase tracking-wider">{label}</p>
                      {href ? (
                        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                          className="text-white text-sm font-medium font-inter hover:text-violet-400 transition-colors">
                          {value}
                        </a>
                      ) : (
                        <p className="text-white text-sm font-medium font-inter">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                {[
                  { icon: Github, href: 'https://github.com/shaikayan18', label: 'GitHub' },
                  { icon: Linkedin, href: 'https://linkedin.com/in/shaik-akhib18', label: 'LinkedIn' },
                  { icon: Mail, href: 'mailto:heshaikayanro@gmail.com', label: 'Email' },
                ].map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                    aria-label={label}
                    className="w-11 h-11 rounded-xl border border-white/10 flex items-center justify-center text-gray-400 hover:text-violet-400 hover:border-violet-500/30 hover:bg-violet-500/8 transition-all duration-200">
                    <Icon size={19} />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div variants={fadeUp}>
              <form onSubmit={handleSubmit} className="glass-card p-6 lg:p-8 rounded-2xl space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-500 text-xs font-inter uppercase tracking-wider">Your Name</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name"
                      className="form-input" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-500 text-xs font-inter uppercase tracking-wider">Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                      className="form-input" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-500 text-xs font-inter uppercase tracking-wider">Subject</label>
                  <input name="subject" value={form.subject} onChange={handleChange} required placeholder="Project Opportunity"
                    className="form-input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-500 text-xs font-inter uppercase tracking-wider">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                    placeholder="Tell me about your project or opportunity..."
                    className="form-input resize-none" />
                </div>
                {status === 'success' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-lg">
                    <span className="text-emerald-400 text-sm">✓</span>
                    <span className="text-emerald-400 text-sm font-inter">Message sent! I'll get back to you soon.</span>
                  </motion.div>
                )}
                <button type="submit" className="btn-primary w-full justify-center py-3">
                  <Send size={17} />Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
