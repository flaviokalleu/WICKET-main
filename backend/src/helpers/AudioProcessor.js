const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

class AudioProcessor {
  static async optimizeAudio(inputBuffer, options = {}) {
    const {
      bitrate = '64k',
      sampleRate = 22050,
      channels = 1,
      format = 'mp3',
      normalize = true,
      removeNoise = true
    } = options;

    return new Promise((resolve, reject) => {
      const tempInputPath = path.join(__dirname, '../../temp', `input_${Date.now()}.webm`);
      const tempOutputPath = path.join(__dirname, '../../temp', `output_${Date.now()}.${format}`);

      // Criar diretório temp se não existir
      const tempDir = path.dirname(tempInputPath);
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // Escrever buffer para arquivo temporário
      fs.writeFileSync(tempInputPath, inputBuffer);

      let command = ffmpeg(tempInputPath)
        .audioBitrate(bitrate)
        .audioFrequency(sampleRate)
        .audioChannels(channels)
        .format(format);

      // Filtros de áudio para melhorar qualidade
      const audioFilters = [];

      // Normalização de volume
      if (normalize) {
        audioFilters.push('loudnorm=I=-12:TP=-1.0:LRA=7:print_format=summary');
      }

      // Redução de ruído
      if (removeNoise) {
        audioFilters.push('highpass=f=80'); // Remove frequências muito baixas
        audioFilters.push('lowpass=f=8000'); // Remove frequências muito altas para voz
        audioFilters.push('afftdn=nf=-25'); // Noise reduction
      }

      // Compressão para melhorar inteligibilidade
      audioFilters.push('acompressor=threshold=0.05:ratio=4:attack=150:release=800');

      // EQ para voz com boost adicional
      audioFilters.push('equalizer=f=1000:width_type=h:width=800:g=3'); // Boost nas frequências de voz
      audioFilters.push('equalizer=f=3000:width_type=h:width=1000:g=4'); // Boost adicional para clareza

      // Amplificação final
      audioFilters.push('volume=1.8');

      if (audioFilters.length > 0) {
        command = command.audioFilters(audioFilters);
      }

      command
        .on('end', () => {
          try {
            const outputBuffer = fs.readFileSync(tempOutputPath);
            
            // Limpar arquivos temporários
            fs.unlinkSync(tempInputPath);
            fs.unlinkSync(tempOutputPath);
            
            resolve(outputBuffer);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          // Limpar arquivos temporários em caso de erro
          if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
          if (fs.existsSync(tempOutputPath)) fs.unlinkSync(tempOutputPath);
          
          reject(error);
        })
        .save(tempOutputPath);
    });
  }

  static async convertToWhatsAppFormat(inputBuffer) {
    return this.optimizeAudio(inputBuffer, {
      bitrate: '96k',
      sampleRate: 16000,
      channels: 1,
      format: 'mp3',
      normalize: true,
      removeNoise: true
    });
  }

  static async getAudioDuration(inputBuffer) {
    return new Promise((resolve, reject) => {
      const tempInputPath = path.join(__dirname, '../../temp', `duration_${Date.now()}.webm`);
      
      // Criar diretório temp se não existir
      const tempDir = path.dirname(tempInputPath);
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      fs.writeFileSync(tempInputPath, inputBuffer);

      ffmpeg.ffprobe(tempInputPath, (err, metadata) => {
        // Limpar arquivo temporário
        fs.unlinkSync(tempInputPath);
        
        if (err) {
          reject(err);
        } else {
          resolve(metadata.format.duration);
        }
      });
    });
  }

  static async compressAudio(inputBuffer, targetSizeKB = 1024) {
    const duration = await this.getAudioDuration(inputBuffer);
    const targetBitrate = Math.floor((targetSizeKB * 8) / duration);
    
    return this.optimizeAudio(inputBuffer, {
      bitrate: `${Math.max(32, Math.min(128, targetBitrate))}k`,
      sampleRate: 22050,
      channels: 1,
      format: 'mp3',
      normalize: true,
      removeNoise: true
    });
  }
}

module.exports = AudioProcessor;
