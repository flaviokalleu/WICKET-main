const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AudioProcessor = require('../helpers/AudioProcessor');

const router = express.Router();

// Configuração do multer para upload de áudio
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de áudio são permitidos'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

// Endpoint para otimização de áudio em tempo real
router.post('/optimize-audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo de áudio enviado' });
    }

    const { 
      bitrate = '96k',
      sampleRate = 22050,
      format = 'mp3',
      normalize = true,
      removeNoise = true 
    } = req.body;

    const optimizedBuffer = await AudioProcessor.optimizeAudio(req.file.buffer, {
      bitrate,
      sampleRate: parseInt(sampleRate),
      format,
      normalize: normalize === 'true',
      removeNoise: removeNoise === 'true'
    });

    res.set({
      'Content-Type': `audio/${format}`,
      'Content-Length': optimizedBuffer.length,
      'Content-Disposition': `attachment; filename="optimized.${format}"`
    });

    res.send(optimizedBuffer);
  } catch (error) {
    console.error('Erro ao otimizar áudio:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Endpoint para compressão de áudio com tamanho alvo
router.post('/compress-audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo de áudio enviado' });
    }

    const { targetSizeKB = 1024 } = req.body;

    const compressedBuffer = await AudioProcessor.compressAudio(
      req.file.buffer, 
      parseInt(targetSizeKB)
    );

    res.set({
      'Content-Type': 'audio/mp3',
      'Content-Length': compressedBuffer.length,
      'Content-Disposition': 'attachment; filename="compressed.mp3"'
    });

    res.send(compressedBuffer);
  } catch (error) {
    console.error('Erro ao comprimir áudio:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Endpoint para obter duração do áudio
router.post('/audio-duration', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo de áudio enviado' });
    }

    const duration = await AudioProcessor.getAudioDuration(req.file.buffer);

    res.json({ 
      duration: duration,
      formattedDuration: formatDuration(duration)
    });
  } catch (error) {
    console.error('Erro ao obter duração do áudio:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

module.exports = router;
