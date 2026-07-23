import { Github, Linkedin, Mail, Code2, Heart, ArrowUpRight } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const scrollTo = (href) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="relative border-t border-white/5 bg-[#050508]">
      {/* Top gradient line */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, #8b5cf6, #22d3ee, transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <Code2 size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-poppins font-bold text-white text-sm">Shaik Akhib</span>
                <span className="text-violet-400 font-bold text-sm"> K</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-inter leading-relaxed max-w-xs">
              MCA Graduate passionate about web development, SEO, and building impactful digital experiences.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Github, href: 'https://github.com/shaikayan18', label: 'GitHub' },
                { icon: Linkedin, href: 'https://linkedin.com/in/shaik-akhib18', label: 'LinkedIn' },
                { icon: Mail, href: 'mailto:heshaikayanro@gmail.com', label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-white/8 flex items-center justify-center text-gray-600 hover:text-violet-400 hover:border-violet-500/30 transition-all duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold font-poppins text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <button onClick={() => scrollTo(link.href)}
                    className="text-gray-600 text-sm font-inter hover:text-violet-400 transition-colors flex items-center gap-1.5 group">
                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Snapshot */}
          <div>
            <h4 className="text-white font-semibold font-poppins text-sm mb-4 uppercase tracking-wider">Contact</h4>
            <div className="space-y-3 text-sm font-inter">
              <a href="mailto:heshaikayanro@gmail.com" className="block text-gray-600 hover:text-violet-400 transition-colors">heshaikayanro@gmail.com</a>
              <a href="tel:8694082378" className="block text-gray-600 hover:text-violet-400 transition-colors">+91 8694082378</a>
              <p className="text-gray-600">Tumkur, Karnataka, India</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-700 text-xs font-inter">
            © {new Date().getFullYear()} Shaik Akhib K. All rights reserved.
          </p>
          <p className="text-gray-700 text-xs font-inter flex items-center gap-1.5">
            Designed & Developed by
            <span className="text-violet-400 font-medium">Shaik Akhib K</span>
            <Heart size={11} className="text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
