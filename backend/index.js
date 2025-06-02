const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect('mongodb://localhost:27017/BirdWatcher');

const Bird = mongoose.model('Bird', {
  name: String,
  species: String,
  description: String,
  photo: String,
  audio: String,
  latitude: Number,
  longitude: Number,
  city: String,
  country: String,
  dateObserved: { type: Date, default: Date.now },
  notes: String
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Aceita imagens e arquivos de áudio
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo não suportado. Apenas imagens e áudio são permitidos.'));
    }
  }
});

// Upload de múltiplos arquivos (foto e áudio)
const uploadFields = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'audio', maxCount: 1 }
]);

app.get('/birds', async (req, res) => {
  try {
    const birds = await Bird.find().sort({ dateObserved: -1 });
    res.json(birds);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar registros de pássaros' });
  }
});

app.post('/birds', uploadFields, async (req, res) => {
  try {
    const { name, species, description, latitude, longitude, city, country, notes } = req.body;
    const photo = req.files.photo ? req.files.photo[0].path : null;
    const audio = req.files.audio ? req.files.audio[0].path : null;

    const bird = new Bird({
      name,
      species,
      description,
      photo,
      audio,
      latitude,
      longitude,
      city,
      country,
      notes
    });

    await bird.save();
    res.json(bird);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar o pássaro' });
  }
});

// Rota para excluir um pássaro
app.delete('/birds/:id', async (req, res) => {
  try {
    const bird = await Bird.findById(req.params.id);
    
    if (!bird) {
      return res.status(404).json({ message: 'Pássaro não encontrado' });
    }

    // Remove os arquivos de mídia se existirem
    if (bird.photo) {
      // Extrai apenas o nome do arquivo do caminho completo
      const photoFileName = path.basename(bird.photo);
      const photoPath = path.join(__dirname, 'uploads', photoFileName);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    if (bird.audio) {
      // Extrai apenas o nome do arquivo do caminho completo
      const audioFileName = path.basename(bird.audio);
      const audioPath = path.join(__dirname, 'uploads', audioFileName);
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }
    }

    // Remove o registro do banco de dados
    await Bird.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Pássaro excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir pássaro:', error);
    // Adiciona mais detalhes ao erro para debug
    res.status(500).json({ 
      message: 'Erro ao excluir pássaro',
      error: error.message,
      details: error.stack
    });
  }
});

// Rota para atualizar um pássaro
app.put('/birds/:id', uploadFields, async (req, res) => {
  try {
    const birdId = req.params.id;
    const { name, species, description, latitude, longitude, city, country, notes } = req.body;
    
    // Busca o pássaro existente
    const existingBird = await Bird.findById(birdId);
    if (!existingBird) {
      return res.status(404).json({ message: 'Pássaro não encontrado' });
    }

    // Prepara os dados para atualização
    const updateData = {
      name,
      species,
      description,
      latitude,
      longitude,
      city,
      country,
      notes
    };

    // Atualiza a foto se uma nova foi enviada
    if (req.files && req.files.photo) {
      // Remove a foto antiga se existir
      if (existingBird.photo) {
        const oldPhotoPath = path.join(__dirname, existingBird.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
      updateData.photo = req.files.photo[0].path;
    }

    // Atualiza o áudio se um novo foi enviado
    if (req.files && req.files.audio) {
      // Remove o áudio antigo se existir
      if (existingBird.audio) {
        const oldAudioPath = path.join(__dirname, existingBird.audio);
        if (fs.existsSync(oldAudioPath)) {
          fs.unlinkSync(oldAudioPath);
        }
      }
      updateData.audio = req.files.audio[0].path;
    }

    // Atualiza o registro no banco de dados
    const updatedBird = await Bird.findByIdAndUpdate(
      birdId,
      updateData,
      { new: true }
    );

    res.json(updatedBird);
  } catch (error) {
    console.error('Erro ao atualizar pássaro:', error);
    res.status(500).json({ message: 'Erro ao atualizar pássaro' });
  }
});

app.listen(3000, () => console.log('Backend do BirdWatcher rodando na porta 3000'));