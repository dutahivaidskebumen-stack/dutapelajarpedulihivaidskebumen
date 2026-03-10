import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import Markdown from 'react-markdown';

export default function BeritaDetail() {
  const { id } = useParams();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/berita/${id}`)
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="py-24 text-center text-slate-500">Memuat berita...</div>;
  }

  if (!news || news.error) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-2xl font-bold text-blue-950 mb-4">Berita tidak ditemukan</h2>
        <Link to="/berita" className="text-amber-600 hover:underline">Kembali ke daftar berita</Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/berita" className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Berita
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100"
        >
          <div className="h-64 sm:h-96 overflow-hidden">
            <img 
              src={news.image} 
              alt={news.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium mb-6">
              <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full uppercase tracking-wider text-xs">
                {news.category}
              </span>
              <div className="flex items-center gap-1 text-slate-500">
                <Calendar className="w-4 h-4" />
                {news.date}
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <MapPin className="w-4 h-4" />
                {news.location}
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-blue-950 mb-8 leading-tight">
              {news.title}
            </h1>
            
            <div className="prose prose-slate prose-lg max-w-none prose-headings:text-blue-950 prose-a:text-amber-600">
              <div className="markdown-body">
                <Markdown>{news.content || news.excerpt}</Markdown>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
