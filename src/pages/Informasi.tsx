import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, Phone, Users, Target, Heart } from 'lucide-react';

export default function Informasi() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !settings) {
    return <div className="py-24 text-center text-slate-500">Memuat informasi...</div>;
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-blue-950 mb-4">Tentang Kami</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Mengenal lebih dekat Duta Pelajar Peduli HIV/AIDS Kebumen, visi, misi, dan bagaimana Anda bisa ikut berkontribusi.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-blue-950 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-amber-600" /> Visi & Misi
            </h2>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-blue-950 mb-2">Visi</h3>
              <p className="text-slate-600 mb-6">
                {settings.visi}
              </p>
              
              <h3 className="text-xl font-bold text-blue-950 mb-2">Misi</h3>
              <ul className="space-y-3 text-slate-600 list-disc list-inside">
                {settings.misi && settings.misi.map((m: string, i: number) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-blue-950 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-600" /> Hubungi Kami
            </h2>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-slate-600 mb-8">
                Punya pertanyaan, ingin berkolaborasi, atau butuh teman cerita? Jangan ragu untuk menghubungi kami. Kami siap mendengarkan dan membantu.
              </p>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="bg-amber-50 p-3 rounded-full text-amber-600 shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-950">Sekretariat</h4>
                    <p className="text-slate-600">{settings.alamat}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-amber-50 p-3 rounded-full text-amber-600 shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-950">Telepon / WhatsApp</h4>
                    <a href={`https://wa.me/${settings.telepon.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">{settings.telepon}</a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-amber-50 p-3 rounded-full text-amber-600 shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-950">Email</h4>
                    <p className="text-slate-600">{settings.email}</p>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-950 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mt-10 -mr-10 text-blue-900/50">
            <Heart className="w-64 h-64 fill-current" />
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ingin Bergabung Bersama Kami?</h2>
            <p className="text-blue-200 mb-8 text-lg">
              Jadilah bagian dari perubahan. Mari bersama-sama kita ciptakan lingkungan yang aman, sehat, dan penuh kepedulian di Kebumen.
            </p>
            <a href={`https://wa.me/${settings.telepon.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-block bg-amber-500 text-blue-950 px-8 py-3 rounded-full font-bold hover:bg-amber-400 transition-colors shadow-lg">
              Daftar Relawan
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
