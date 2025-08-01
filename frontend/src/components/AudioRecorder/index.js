import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IconButton, makeStyles, Tooltip, CircularProgress } from '@material-ui/core';
import { Mic, Stop, Send, Delete, VolumeUp, CloudUpload } from '@material-ui/icons';
import api from '../../services/api';

const useStyles = makeStyles((theme) => ({
  audioRecorderContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    padding: theme.spacing(0.5),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`,
  },
  recordButton: {
    color: '#f44336',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      transform: 'scale(1.1)',
    },
  },
  stopButton: {
    color: '#ff9800',
    animation: '$pulse 1s infinite',
    '&:hover': {
      backgroundColor: 'rgba(255, 152, 0, 0.1)',
    },
  },
  sendButton: {
    color: '#4caf50',
    '&:hover': {
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
    },
  },
  deleteButton: {
    color: '#757575',
    '&:hover': {
      backgroundColor: 'rgba(117, 117, 117, 0.1)',
    },
  },
  optimizeButton: {
    color: '#2196f3',
    '&:hover': {
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
    },
  },
  waveform: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    padding: theme.spacing(0, 1),
    minWidth: 60,
  },
  wave: {
    width: 3,
    backgroundColor: '#2196f3',
    borderRadius: 2,
    transition: 'height 0.1s ease',
  },
  timeDisplay: {
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
    minWidth: 35,
    textAlign: 'center',
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.1)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
  audioPlayer: {
    maxWidth: 200,
    height: 32,
  },
  recordingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(0, 1),
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: theme.shape.borderRadius,
  },
  recordingText: {
    color: '#f44336',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  qualityIndicator: {
    fontSize: '0.7rem',
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(0.5),
  },
  optimized: {
    color: '#4caf50',
  },
  processing: {
    color: '#ff9800',
  },
}));

const AudioRecorder = ({ 
  onSendAudio, 
  disabled = false, 
  maxDuration = 300000,
  className = '',
  autoOptimize = true
}) => {
  const classes = useStyles();
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [waveData, setWaveData] = useState(new Array(12).fill(10));
  const [isOptimized, setIsOptimized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const intervalRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const updateWaveform = useCallback(() => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    const avgFrequency = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const normalizedHeight = Math.max(5, (avgFrequency / 255) * 30);
    
    setWaveData(prev => {
      const newData = [...prev];
      newData.shift();
      newData.push(normalizedHeight);
      return newData;
    });
    
    if (isRecording) {
      animationRef.current = requestAnimationFrame(updateWaveform);
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 1,
          latency: 0.01,
        }
      });

      streamRef.current = stream;

      // Setup audio analysis
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const options = {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 96000,
      };

      // Fallback para diferentes navegadores
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'audio/mp4';
        options.audioBitsPerSecond = 96000;
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options.mimeType = 'audio/wav';
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            delete options.mimeType;
            delete options.audioBitsPerSecond;
          }
        }
      }

      const recorder = new MediaRecorder(stream, options);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const mimeType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(chunks, { type: mimeType });
        
        // Verificar tamanho mínimo
        if (blob.size < 1000) {
          alert('Gravação muito curta. Tente novamente.');
          return;
        }
        
        setAudioBlob(blob);
        setIsOptimized(false);

        // Auto otimização se habilitada
        if (autoOptimize) {
          await optimizeAudio(blob);
        }
      };

      recorder.start(100);
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);

      // Iniciar animação da forma de onda
      updateWaveform();

      // Timer para contagem e limite máximo
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1000;
          if (newTime >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newTime;
        });
      }, 1000);

    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      if (error.name === 'NotAllowedError') {
        alert('Permissão para usar o microfone foi negada. Verifique as configurações do navegador.');
      } else if (error.name === 'NotFoundError') {
        alert('Nenhum microfone encontrado. Verifique se há um microfone conectado.');
      } else {
        alert('Erro ao acessar o microfone. Tente novamente.');
      }
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    
    cleanup();
    setIsRecording(false);
  }, [mediaRecorder, cleanup]);

  const optimizeAudio = async (blob = audioBlob) => {
    if (!blob) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'audio.webm');
      formData.append('bitrate', '96k');
      formData.append('sampleRate', '22050');
      formData.append('format', 'mp3');
      formData.append('normalize', 'true');
      formData.append('removeNoise', 'true');

      const response = await api.post('/api/audio/optimize-audio', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const optimizedBlob = new Blob([response.data], { type: 'audio/mpeg' });
      setAudioBlob(optimizedBlob);
      setIsOptimized(true);
    } catch (error) {
      console.error('Erro ao otimizar áudio:', error);
      alert('Erro ao otimizar áudio. O arquivo original será mantido.');
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setRecordingTime(0);
    setWaveData(new Array(12).fill(10));
    setIsOptimized(false);
    setIsProcessing(false);
  };

  const sendAudio = () => {
    if (audioBlob && onSendAudio) {
      // Determinar extensão baseada no tipo MIME
      let extension = 'mp3';
      if (audioBlob.type.includes('webm')) extension = 'webm';
      else if (audioBlob.type.includes('mp4')) extension = 'mp4';
      else if (audioBlob.type.includes('wav')) extension = 'wav';
      
      const fileName = `audio_${Date.now()}.${extension}`;
      onSendAudio(audioBlob, fileName);
      deleteRecording();
    }
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const renderWaveform = () => {
    return (
      <div className={classes.waveform}>
        {waveData.map((height, i) => (
          <div
            key={i}
            className={classes.wave}
            style={{
              height: Math.max(4, height),
              backgroundColor: isRecording ? '#f44336' : '#2196f3',
            }}
          />
        ))}
      </div>
    );
  };

  // Estado: gravação finalizada (mostrar player e controles)
  if (audioBlob) {
    return (
      <div className={`${classes.audioRecorderContainer} ${className}`}>
        <audio controls className={classes.audioPlayer}>
          <source src={URL.createObjectURL(audioBlob)} type={audioBlob.type} />
        </audio>
        <div>
          <div className={classes.timeDisplay}>
            {formatTime(recordingTime)}
          </div>
          <div className={classes.qualityIndicator}>
            {formatFileSize(audioBlob.size)}
            {isProcessing && <span className={classes.processing}> • Processando...</span>}
            {isOptimized && !isProcessing && <span className={classes.optimized}> • ✓ Otimizado</span>}
          </div>
        </div>
        
        {!autoOptimize && !isOptimized && !isProcessing && (
          <Tooltip title="Otimizar áudio">
            <IconButton
              className={classes.optimizeButton}
              onClick={() => optimizeAudio()}
              size="small"
            >
              <CloudUpload />
            </IconButton>
          </Tooltip>
        )}
        
        {isProcessing && (
          <CircularProgress size={20} />
        )}
        
        <Tooltip title="Enviar áudio">
          <IconButton
            className={classes.sendButton}
            onClick={sendAudio}
            size="small"
            disabled={isProcessing}
          >
            <Send />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Descartar gravação">
          <IconButton
            className={classes.deleteButton}
            onClick={deleteRecording}
            size="small"
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </div>
    );
  }

  // Estado: gravando
  if (isRecording) {
    return (
      <div className={`${classes.audioRecorderContainer} ${className}`}>
        <div className={classes.recordingIndicator}>
          <VolumeUp style={{ fontSize: 16, color: '#f44336' }} />
          <span className={classes.recordingText}>REC</span>
        </div>
        {renderWaveform()}
        <span className={classes.timeDisplay}>
          {formatTime(recordingTime)}
        </span>
        <Tooltip title="Parar gravação">
          <IconButton
            className={classes.stopButton}
            onClick={stopRecording}
            size="small"
          >
            <Stop />
          </IconButton>
        </Tooltip>
      </div>
    );
  }

  // Estado: inicial (botão para iniciar gravação)
  return (
    <Tooltip title="Gravar áudio">
      <IconButton
        className={classes.recordButton}
        onClick={startRecording}
        disabled={disabled}
        size="small"
      >
        <Mic />
      </IconButton>
    </Tooltip>
  );
};

export default AudioRecorder;
