// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5503;
const multer = require('multer');

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/my_database');
 
// Statik dosyaları sunma
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
// Örneğin, 'public' klasöründeki dosyaları sunmak için
app.use(express.static('uploads'));


// Kullanıcı modeli
const User = mongoose.model('User', {
  name: String,
  email: String,
  password: String
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Üyelik kaydı endpoint'i
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;


  try {
      // MongoDB'ye kullanıcıyı kaydet
      const user = new User({ name, email, password });
      await user.save();

      // Başarı durumu
      res.status(200).json({ success: true, message: 'Başarıyla kaydedildi.' });

  } catch (error) {
      // Hata durumu
      res.status(500).json({ success: false, message: 'Bir hata oluştu.' });
  }
});



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index1.html'));
  });


// Sunucuyu dinle
app.listen(PORT, () => {
  console.log('Server is running on http://localhost:'+PORT);
});


// Üyeleri getiren endpoint
app.get('/members', async (req, res) => {
  try {
    // Tüm kullanıcıları getir
    const members = await User.find({}, 'name email');
    res.json(members);

  } catch (error) {
    res.status(500).json({ success: false, message: 'Bir hata oluştu.' });
  }
});


// Üyeyi silen endpoint
app.delete('/deleteUser/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await User.deleteOne({ _id: userId });
    
    if (result.deletedCount > 0) {
      res.json({ success: true, message: 'Üye başarıyla silindi.' });
    } else {
      res.json({ success: false, message: 'Üye bulunamadı veya silinemedi.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Bir hata oluştu.' });
  }
});

// Üyeyi güncelleyen endpoint
app.put('/updateUser/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email } = req.body;

    // Kullanıcıyı güncelle
    const result = await User.findByIdAndUpdate(userId, { name, email }, { new: true });

    if (result) {
      res.json({ success: true, message: 'Üye başarıyla güncellendi.' });
    } else {
      res.json({ success: false, message: 'Üye bulunamadı veya güncellenemedi.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Bir hata oluştu.' });
  }
});



// Şema (Model) tanımı
const Makale = mongoose.model('Makale', {
    ad: String,
    soyad: String,
    tarih: Date,
    pdfDosya: String, // PDF dosyasının adını saklamak için bir string alan
  });
  
  // Multer konfigürasyonu
  const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage: storage });
  
  // Sunucuya dosya yükleme endpoint'i
  app.post('/dosya-yukle', upload.single('pdfDosya'), (req, res) => {
    res.json({ dosya: req.file.filename });
  });
  
  // Form verilerini MongoDB'ye ekleme endpoint'i
  app.post('/form-gonder', (req, res) => {
    const { ad, soyad, tarih, dosyaAdi } = req.body;
  
    // MongoDB'ye veriyi ekleme
    const yeniMakale = new Makale({
      ad,
      soyad,
      tarih,
      pdfDosya: dosyaAdi,
    });
  

    yeniMakale.save()
  .then(result => {
    res.json({ mesaj: 'Veri başarıyla kaydedildi.' });
    


  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ hata: 'Veri kaydedilemedi.' });
  });

  
  });
  // Örnek bir Express endpoint'i
app.get('/api/makaleler', (req, res) => {
    // MongoDB'den makale verilerini çek
    Makale.find({})
    .then(makaleler => {
      res.json(makaleler);
    })
    .catch(err => {
      console.error('Makaleleri çekerken hata:', err);
      res.status(500).json({ hata: 'Makaleleri çekerken bir hata oluştu.' });
    });
  
  });

// Makale silme endpoint'i
app.delete('/api/makaleler/:id', (req, res) => {
  const makaleId = req.params.id;

  Makale.findByIdAndDelete(makaleId)
      .then(() => {
          res.json({ mesaj: 'Makale başarıyla silindi.' });
      })
      .catch(err => {
          console.error('Makale silme hatası:', err);
          res.status(500).json({ hata: 'Makale silme sırasında bir hata oluştu.' });
      });
});