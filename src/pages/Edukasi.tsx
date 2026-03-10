import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, AlertTriangle, ShieldCheck, HeartPulse, Info } from 'lucide-react';

export default function Edukasi() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/edukasi')
      .then(res => res.json())
      .then(data => {
        setTopics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'BookOpen': return <BookOpen className="w-6 h-6" />;
      case 'AlertTriangle': return <AlertTriangle className="w-6 h-6" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6" />;
      case 'HeartPulse': return <HeartPulse className="w-6 h-6" />;
      default: return <Info className="w-6 h-6" />;
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-slate-500">Memuat edukasi...</div>;
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-blue-950 mb-4">Pusat Edukasi</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Pahami fakta yang benar tentang HIV/AIDS. Pengetahuan adalah senjata utama kita untuk mencegah penularan dan menghapus stigma.
          </p>
        </motion.div>

        <div className="space-y-8">
          {topics.map((topic, index) => (
            <motion.div 
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-amber-100 text-amber-600 p-3 rounded-xl">
                  {getIcon(topic.icon)}
                </div>
                <h2 className="text-2xl font-bold text-blue-950">{topic.title}</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg">
                {topic.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
