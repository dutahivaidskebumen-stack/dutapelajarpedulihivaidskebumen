import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Berita() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/berita')
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="py-24 text-center text-slate-500">Memuat berita...</div>;
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-blue-950 mb-4">Berita & Kegiatan</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Ikuti perjalanan kami dalam menebarkan kebaikan, edukasi, dan dukungan di seluruh penjuru Kabupaten Kebumen.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {news.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/berita/${item.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col sm:flex-row group cursor-pointer h-full">
                <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 sm:w-3/5 flex flex-col justify-center">
                  <div className="text-xs font-semibold text-amber-600 mb-2 uppercase tracking-wider">{item.category}</div>
                  <h3 className="text-xl font-bold text-blue-950 mb-3 group-hover:text-amber-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mt-auto">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {item.location}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
