import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Edukasi', path: '/edukasi' },
    { name: 'Berita', path: '/berita' },
    { name: 'Informasi', path: '/informasi' },
  ];

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="https://yt3.googleusercontent.com/a0G2ZB9OssQCekmPvON1NDU2Y_FOAzRKR4UvdyZuq4x_BPbtDz8B__OkKmClrNZ1IwuAe5L0-8c=s160-c-k-c0x00ffffff-no-rj" 
                alt="Logo Duta Pelajar Peduli HIV/AIDS Kebumen" 
                className="w-10 h-10 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="font-bold text-lg text-blue-950 leading-tight">
                Duta Pelajar<br />
                <span className="text-amber-600 text-sm">Peduli HIV/AIDS Kebumen</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-amber-600 ${
                  location.pathname === link.path ? 'text-amber-600' : 'text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a href="https://wa.me/081328053461" target="_blank" rel="noopener noreferrer" className="bg-amber-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-amber-700 transition-colors shadow-sm">
              Hubungi Kami
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-blue-950 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-b border-slate-200"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'text-amber-600 bg-amber-50'
                    : 'text-slate-600 hover:text-amber-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="px-3 py-2">
              <a href="https://wa.me/081328053461" target="_blank" rel="noopener noreferrer" className="block text-center w-full bg-amber-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-amber-700 transition-colors">
                Hubungi Kami
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
