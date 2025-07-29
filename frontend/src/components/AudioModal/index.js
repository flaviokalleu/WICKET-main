import React, { useRef, useEffect, useState } from "react";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { PlayArrow, Pause, MoreVert, GetApp, Speed } from "@material-ui/icons";
import styled, { keyframes } from "styled-components";

const LS_NAME = 'audioMessageRate';

// Animação de pulsação para o botão de play/pause
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

// Animação das ondas sonoras
const waveAnimation = keyframes`
  0%, 100% { height: 4px; }
  50% { height: 12px; }
`;

const waveAnimation2 = keyframes`
  0%, 100% { height: 8px; }
  50% { height: 16px; }
`;

const waveAnimation3 = keyframes`
  0%, 100% { height: 6px; }
  50% { height: 10px; }
`;

// Container principal do player
const PlayerContainer = styled.div`
  display: flex;
  align-items: center;
  background: #2a2a2a;
  padding: 8px 12px;
  border-radius: 18px;
  color: #ffffff;
  width: 280px;
  gap: 12px;
  border: 1px solid #333333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

// Controles do player
const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

// Botão de play/pause estilizado (estilo WhatsApp Dark)
const PlayPauseButton = styled(IconButton)`
  background: #00d4aa;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 212, 170, 0.3);
  animation: ${({ isPlaying }) => (isPlaying ? pulse : "none")} 1.5s infinite;
  transition: all 0.2s ease;

  &:hover {
    background: #00b894;
    transform: scale(1.05);
  }

  .MuiSvgIcon-root {
    font-size: 20px;
  }
`;

// Container das ondas sonoras
const WaveContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  height: 20px;
  flex: 1;
  justify-content: center;
`;

// Barra de onda individual
const WaveBar = styled.div`
  width: 3px;
  background: ${({ isPlaying }) => (isPlaying ? '#00d4aa' : '#555')};
  border-radius: 2px;
  transition: background 0.3s ease;
  animation: ${({ isPlaying, delay }) => 
    isPlaying 
      ? `${delay === 0 ? waveAnimation : delay === 1 ? waveAnimation2 : waveAnimation3} 0.8s ease-in-out infinite` 
      : 'none'
  };
  animation-delay: ${({ delay }) => delay * 0.1}s;
`;

// Componente das ondas sonoras
const SoundWaves = ({ isPlaying }) => {
  const waves = Array.from({ length: 30 }, (_, i) => i);
  
  return (
    <WaveContainer>
      {waves.map((_, index) => (
        <WaveBar 
          key={index} 
          isPlaying={isPlaying}
          delay={index % 3}
          style={{ height: isPlaying ? '8px' : `${4 + (index % 3) * 2}px` }}
        />
      ))}
    </WaveContainer>
  );
};

// Exibição do tempo (estilo WhatsApp Dark)
const TimeDisplay = styled.div`
  font-size: 12px;
  color: #a0a0a0;
  font-weight: 500;
  min-width: 35px;
  text-align: right;
`;

// Botão de menu (3 pontinhos)
const MenuButton = styled(IconButton)`
  color: #a0a0a0;
  width: 28px;
  height: 28px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #00d4aa;
  }

  .MuiSvgIcon-root {
    font-size: 16px;
  }
`;

// Estilo customizado para o Menu
const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    background-color: #1a1a1a !important;
    border: 1px solid #333333 !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
  }

  .MuiMenuItem-root {
    color: #ffffff !important;
    padding: 8px 16px !important;
    font-size: 14px !important;
    
    &:hover {
      background-color: #333333 !important;
    }

    .MuiSvgIcon-root {
      margin-right: 8px;
      color: #00d4aa;
      font-size: 18px;
    }
  }
`;

// Função para formatar o tempo em mm:ss
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const AudioModal = ({ url }) => {
    const audioRef = useRef(null);
    const [audioRate, setAudioRate] = useState(parseFloat(localStorage.getItem(LS_NAME) || "1"));
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // Atualiza a taxa de reprodução no localStorage
    useEffect(() => {
        audioRef.current.playbackRate = audioRate;
        localStorage.setItem(LS_NAME, audioRate);
    }, [audioRate]);

    // Atualiza o tempo atual e a duração do áudio
    useEffect(() => {
        const audio = audioRef.current;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    // Alternar entre play e pause
    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    };

    // Alternar a velocidade de reprodução
    const toggleRate = () => {
        const rates = [0.5, 1, 1.5, 2];
        const currentIndex = rates.indexOf(audioRate);
        const newRate = rates[(currentIndex + 1) % rates.length];
        setAudioRate(newRate);
        setAnchorEl(null);
    };

    // Abrir menu
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Fechar menu
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Download do áudio
    const downloadAudio = () => {
        const link = document.createElement('a');
        link.href = url;
        link.download = `audio_${Date.now()}.${isIOS ? 'mp3' : 'ogg'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setAnchorEl(null);
    };

    // Atualizar o volume
    const handleVolumeChange = (event, newValue) => {
        setVolume(newValue);
        audioRef.current.volume = newValue;
        setIsMuted(newValue === 0);
    };

    // Alternar entre mudo e desmudo
    const toggleMute = () => {
        if (isMuted) {
            audioRef.current.volume = volume;
        } else {
            audioRef.current.volume = 0;
        }
        setIsMuted(!isMuted);
    };

    // Atualizar o tempo do áudio ao arrastar a barra de progresso
    const handleSeek = (event, newValue) => {
        audioRef.current.currentTime = newValue;
        setCurrentTime(newValue);
    };

    // Obter a fonte do áudio (compatível com iOS)
    const getAudioSource = () => {
        let sourceUrl = url;

        if (isIOS) {
            sourceUrl = sourceUrl.replace(".ogg", ".mp3");
        }

        return (
            <source src={sourceUrl} type={isIOS ? "audio/mp3" : "audio/ogg"} />
        );
    };

    return (
        <PlayerContainer>
            <PlayPauseButton isPlaying={isPlaying} onClick={togglePlayPause}>
                {isPlaying ? <Pause /> : <PlayArrow />}
            </PlayPauseButton>
            
            <Controls>
                <SoundWaves isPlaying={isPlaying} />
            </Controls>
            
            <TimeDisplay>
                {formatTime(duration)}
            </TimeDisplay>
            
            <MenuButton onClick={handleMenuClick}>
                <MoreVert />
            </MenuButton>

            <StyledMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={downloadAudio}>
                    <GetApp />
                    Baixar áudio
                </MenuItem>
                <MenuItem onClick={toggleRate}>
                    <Speed />
                    Velocidade {audioRate}x
                </MenuItem>
            </StyledMenu>
            
            <audio ref={audioRef}>
                {getAudioSource()}
            </audio>
        </PlayerContainer>
    );
};

export default AudioModal;