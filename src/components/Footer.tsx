import { useState, useEffect } from 'react';
import { Mail, MapPin, Phone, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <footer className="bg-blue-950 text-slate-300 py-12 border-t border-blue-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://yt3.googleusercontent.com/a0G2ZB9OssQCekmPvON1NDU2Y_FOAzRKR4UvdyZuq4x_BPbtDz8B__OkKmClrNZ1IwuAe5L0-8c=s160-c-k-c0x00ffffff-no-rj" 
                alt="Logo Duta Pelajar Peduli HIV/AIDS Kebumen" 
                className="w-12 h-12 rounded-full object-cover bg-white p-0.5"
                referrerPolicy="no-referrer"
              />
              <span className="font-bold text-xl text-white">
                Duta Pelajar Peduli HIV/AIDS
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-6 max-w-md leading-relaxed">
              Organisasi pemuda di Kabupaten Kebumen yang berdedikasi untuk memberikan edukasi, mencegah stigma, dan meningkatkan kesadaran tentang HIV/AIDS di kalangan pelajar dan masyarakat.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/dutahivaids.kebumen/?hl=id" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@dutahivaids.kebumen" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@dutahivaids.kebumen" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-500 transition-colors flex items-center justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-amber-400 transition-colors">Beranda</Link></li>
              <li><Link to="/edukasi" className="hover:text-amber-400 transition-colors">Edukasi HIV/AIDS</Link></li>
              <li><Link to="/berita" className="hover:text-amber-400 transition-colors">Berita & Kegiatan</Link></li>
              <li><Link to="/informasi" className="hover:text-amber-400 transition-colors">Tentang Kami</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span>{settings?.alamat || 'Kebumen, Jawa Tengah'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={settings ? `https://wa.me/${settings.telepon.replace(/\D/g, '')}` : "https://wa.me/081328053461"} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">{settings?.telepon || '+62 813 2805 3461'}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{settings?.email || 'dutahivaids.kebumen@gmail.com'}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-900 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Duta Pelajar Peduli HIV/AIDS Kebumen. Hak Cipta Dilindungi.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/admin" className="hover:text-white transition-colors">Login Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
