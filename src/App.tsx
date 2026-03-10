import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Edukasi from './pages/Edukasi';
import Berita from './pages/Berita';
import BeritaDetail from './pages/BeritaDetail';
import Informasi from './pages/Informasi';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/edukasi" element={<Edukasi />} />
            <Route path="/berita" element={<Berita />} />
            <Route path="/berita/:id" element={<BeritaDetail />} />
            <Route path="/informasi" element={<Informasi />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </Router>
  );
}
