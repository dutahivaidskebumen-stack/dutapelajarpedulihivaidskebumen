import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('database.sqlite');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS berita (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    excerpt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS edukasi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    icon TEXT NOT NULL,
    content TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Check and add content column to berita if it doesn't exist
const tableInfo = db.pragma('table_info(berita)') as any[];
if (!tableInfo.some(col => col.name === 'content')) {
  db.exec('ALTER TABLE berita ADD COLUMN content TEXT DEFAULT ""');
  db.exec('UPDATE berita SET content = excerpt');
}

// Seed initial data if empty
const beritaCount = db.prepare('SELECT COUNT(*) as count FROM berita').get() as { count: number };
if (beritaCount.count === 0) {
  const insertBerita = db.prepare('INSERT INTO berita (title, date, location, category, image, excerpt) VALUES (?, ?, ?, ?, ?, ?)');
  insertBerita.run("Penyuluhan HIV/AIDS di SMA N 1 Kebumen", "12 Oktober 2025", "SMA N 1 Kebumen", "Kegiatan", "https://picsum.photos/seed/event1/800/600", "Duta Pelajar mengadakan sesi edukasi interaktif bersama ratusan siswa untuk meningkatkan pemahaman tentang bahaya pergaulan bebas dan pentingnya pencegahan HIV/AIDS sejak dini.");
  insertBerita.run("Peringatan Hari AIDS Sedunia 2025", "1 Desember 2025", "Alun-Alun Kebumen", "Kampanye", "https://picsum.photos/seed/event2/800/600", "Ribuan masyarakat Kebumen turut serta dalam aksi damai pembagian pita merah dan penandatanganan petisi hapus stigma terhadap ODHA di Alun-Alun Kebumen.");
  insertBerita.run("Pelatihan Konselor Sebaya Tingkat SMA", "15 November 2025", "Gedung Pemuda Kebumen", "Pelatihan", "https://picsum.photos/seed/event3/800/600", "Membekali perwakilan siswa dari berbagai sekolah dengan keterampilan konseling dasar untuk menjadi pendengar yang baik bagi teman sebaya mereka.");
}

const edukasiCount = db.prepare('SELECT COUNT(*) as count FROM edukasi').get() as { count: number };
if (edukasiCount.count === 0) {
  const insertEdukasi = db.prepare('INSERT INTO edukasi (title, icon, content) VALUES (?, ?, ?)');
  insertEdukasi.run("Apa itu HIV/AIDS?", "BookOpen", "HIV (Human Immunodeficiency Virus) adalah virus yang merusak sistem kekebalan tubuh dengan menginfeksi dan menghancurkan sel CD4. Jika makin banyak sel CD4 yang hancur, daya tahan tubuh akan makin melemah sehingga rentan diserang berbagai penyakit. AIDS (Acquired Immune Deficiency Syndrome) adalah stadium akhir dari infeksi HIV.");
  insertEdukasi.run("Cara Penularan", "AlertTriangle", "HIV menular melalui pertukaran cairan tubuh tertentu dari orang yang terinfeksi, seperti darah, ASI, cairan mani, dan cairan vagina. Penularan dapat terjadi melalui hubungan seksual yang tidak aman, penggunaan jarum suntik bergantian, transfusi darah yang tidak aman, dan dari ibu ke anak selama kehamilan, persalinan, atau menyusui. HIV TIDAK menular melalui gigitan nyamuk, sentuhan, pelukan, ciuman, atau berbagi alat makan.");
  insertEdukasi.run("Pencegahan", "ShieldCheck", "Pencegahan HIV dapat dilakukan dengan rumus ABCDE: A (Abstinence) tidak melakukan hubungan seks sebelum menikah, B (Be Faithful) setia pada satu pasangan, C (Condom) gunakan kondom bagi yang berisiko, D (Don't use drugs) tidak menggunakan narkoba suntik, dan E (Education) bekali diri dengan informasi yang benar.");
  insertEdukasi.run("Pengobatan & Perawatan", "HeartPulse", "Meskipun belum ada obat yang dapat menyembuhkan HIV secara total, terdapat pengobatan Antiretroviral (ARV) yang dapat menekan perkembangan virus dalam tubuh. Dengan mengonsumsi ARV secara rutin, Orang Dengan HIV (ODHIV) dapat hidup sehat, produktif, dan mencegah penularan ke orang lain (Undetectable = Untransmittable).");
}

const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get() as { count: number };
if (settingsCount.count === 0) {
  const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
  insertSetting.run('visi', 'Mewujudkan generasi muda Kebumen yang sehat, cerdas, peduli, dan bebas dari stigma serta diskriminasi terhadap HIV/AIDS.');
  insertSetting.run('misi', JSON.stringify([
    'Menyelenggarakan edukasi HIV/AIDS yang komprehensif di sekolah-sekolah.',
    'Membentuk kader konselor sebaya yang empatik dan berpengetahuan.',
    'Mengkampanyekan penghapusan stigma terhadap Orang Dengan HIV/AIDS (ODHA).',
    'Berkolaborasi dengan pemerintah dan lembaga terkait dalam program kesehatan remaja.'
  ]));
  insertSetting.run('alamat', 'Kebumen, Jawa Tengah');
  insertSetting.run('telepon', '+62 813 2805 3461');
  insertSetting.run('email', 'dutahivaids.kebumen@gmail.com');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Berita
  app.get('/api/berita', (req, res) => {
    const berita = db.prepare('SELECT * FROM berita ORDER BY id DESC').all();
    res.json(berita);
  });

  app.get('/api/berita/:id', (req, res) => {
    const item = db.prepare('SELECT * FROM berita WHERE id = ?').get(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });

  app.post('/api/berita', (req, res) => {
    const { title, date, location, category, image, excerpt, content } = req.body;
    const stmt = db.prepare('INSERT INTO berita (title, date, location, category, image, excerpt, content) VALUES (?, ?, ?, ?, ?, ?, ?)');
    const result = stmt.run(title, date, location, category, image, excerpt, content || excerpt);
    res.json({ id: result.lastInsertRowid });
  });

  app.put('/api/berita/:id', (req, res) => {
    const { title, date, location, category, image, excerpt, content } = req.body;
    const stmt = db.prepare('UPDATE berita SET title = ?, date = ?, location = ?, category = ?, image = ?, excerpt = ?, content = ? WHERE id = ?');
    stmt.run(title, date, location, category, image, excerpt, content || excerpt, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/berita/:id', (req, res) => {
    const stmt = db.prepare('DELETE FROM berita WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ success: true });
  });

  // Edukasi
  app.get('/api/edukasi', (req, res) => {
    const edukasi = db.prepare('SELECT * FROM edukasi').all();
    res.json(edukasi);
  });

  app.post('/api/edukasi', (req, res) => {
    const { title, icon, content } = req.body;
    const stmt = db.prepare('INSERT INTO edukasi (title, icon, content) VALUES (?, ?, ?)');
    const result = stmt.run(title, icon, content);
    res.json({ id: result.lastInsertRowid });
  });

  app.put('/api/edukasi/:id', (req, res) => {
    const { title, icon, content } = req.body;
    const stmt = db.prepare('UPDATE edukasi SET title = ?, icon = ?, content = ? WHERE id = ?');
    stmt.run(title, icon, content, req.params.id);
    res.json({ success: true });
  });

  app.delete('/api/edukasi/:id', (req, res) => {
    const stmt = db.prepare('DELETE FROM edukasi WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ success: true });
  });

  // Settings / Informasi
  app.get('/api/settings', (req, res) => {
    const settings = db.prepare('SELECT * FROM settings').all() as { key: string, value: string }[];
    const result: Record<string, any> = {};
    settings.forEach(s => {
      try {
        result[s.key] = JSON.parse(s.value);
      } catch {
        result[s.key] = s.value;
      }
    });
    res.json(result);
  });

  app.put('/api/settings', (req, res) => {
    const updates = req.body;
    const stmt = db.prepare('UPDATE settings SET value = ? WHERE key = ?');
    db.transaction(() => {
      for (const [key, value] of Object.entries(updates)) {
        const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
        stmt.run(valStr, key);
      }
    })();
    res.json({ success: true });
  });

  // Admin Auth (Simple mock auth)
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    // In a real app, use a proper hashed password and session/JWT
    if (password === 'admin123') {
      res.json({ success: true, token: 'mock-jwt-token' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid password' });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
