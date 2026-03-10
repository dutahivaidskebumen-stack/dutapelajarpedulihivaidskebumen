import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, BookOpen, HeartHandshake, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const heroImages = [
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg_bx66bY7DzYKzJjxPze5gZF6Kssfdqgv7KcGk2wuokv3Q8ffbd5Bz-0m5t2MmsCIQqQ_w_pvtCqy9BmhAq1_4_OujyQoUIAs0b8jRKOjrLrio6rBaWRjYDnPjTvxjsqOCvp2U4GRp6_px2PD_hUdGvujdEcURQrvqjpfo1XyyM5EYqUrnBi2_wItJnVQ4/s1600/1000056734.jpg",
    "https://picsum.photos/seed/youth/1920/1080?blur=2",
    "https://picsum.photos/seed/community/1920/1080?blur=2"
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [latestNews, setLatestNews] = useState<any[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    fetch('/api/berita')
      .then(res => res.json())
      .then(data => {
        setLatestNews(data.slice(0, 3));
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-blue-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence>
            <motion.img
              key={currentImage}
              src={heroImages[currentImage]}
              alt="Hero background"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.4, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="w-full h-full object-cover mix-blend-overlay absolute inset-0"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-950/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-sm font-medium mb-6 border border-amber-500/30">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Bersama Mencegah Stigma
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Edukasi, Peduli, dan <span className="text-amber-500">Lindungi Generasi</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
              Duta Pelajar Peduli HIV/AIDS Kebumen hadir untuk memberikan edukasi yang benar, menghapus stigma, dan merangkul semua kalangan demi masa depan yang lebih sehat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/edukasi" className="inline-flex justify-center items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-700 transition-colors">
                Mulai Belajar <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/informasi" className="inline-flex justify-center items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-full font-medium hover:bg-white/20 transition-colors backdrop-blur-sm">
                Tentang Kami
              </Link>
            </div>

            {/* Slideshow Indicators */}
            <div className="flex gap-2 mt-12">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${idx === currentImage ? 'w-8 bg-amber-500' : 'bg-white/30 hover:bg-white/50'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-100"
            >
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">Edukasi Tepat</h3>
              <p className="text-slate-600">Menyediakan informasi yang akurat dan mudah dipahami tentang pencegahan dan penularan HIV/AIDS.</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-100"
            >
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">Hapus Stigma</h3>
              <p className="text-slate-600">Berjuang bersama untuk menghilangkan diskriminasi terhadap Orang Dengan HIV/AIDS (ODHA).</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-100"
            >
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">Dukungan Sosial</h3>
              <p className="text-slate-600">Membangun lingkungan yang inklusif dan suportif bagi semua lapisan masyarakat di Kebumen.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Latest News Preview */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-blue-950 mb-2">Kegiatan Terbaru</h2>
              <p className="text-slate-600">Ikuti terus update kegiatan dan program kami.</p>
            </div>
            <Link to="/berita" className="hidden sm:flex items-center gap-1 text-amber-600 font-medium hover:text-amber-700">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestNews.length > 0 ? latestNews.map((item) => (
              <Link to="/berita" key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group cursor-pointer block">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6">
                  <div className="text-xs font-semibold text-amber-600 mb-2 uppercase tracking-wider">{item.category}</div>
                  <h3 className="text-lg font-bold text-blue-950 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {item.excerpt}
                  </p>
                  <div className="text-xs text-slate-400 font-medium">{item.date}</div>
                </div>
              </Link>
            )) : (
              <div className="col-span-full text-center py-8 text-slate-500">Memuat berita...</div>
            )}
          </div>
          
          <div className="mt-8 sm:hidden flex justify-center">
            <Link to="/berita" className="flex items-center gap-1 text-amber-600 font-medium hover:text-amber-700">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
