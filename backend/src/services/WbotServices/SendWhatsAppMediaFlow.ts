import { WAMessage, AnyMessageContent, WAPresence } from "@whiskeysockets/baileys";
import * as Sentry from "@sentry/node";
import fs from "fs";
import { exec } from "child_process";
import path from "path";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import AppError from "../../errors/AppError";
import GetTicketWbot from "../../helpers/GetTicketWbot";
import Ticket from "../../models/Ticket";
import mime from "mime-types";
import Contact from "../../models/Contact";

interface Request {
  media: Express.Multer.File;
  ticket: Ticket;
  body?: string;
}

interface RequestFlow {
  media: string;
  ticket: Ticket;
  body?: string;
  isFlow?: boolean;
  isRecord?: boolean;
}

const publicFolder = path.resolve(__dirname, "..", "..", "..", "public");

const processAudio = async (audio: string): Promise<string> => {
  const outputAudio = `${publicFolder}/${new Date().getTime()}.mp3`;
  return new Promise((resolve, reject) => {
    exec(
      `${ffmpegPath.path} -i ${audio} -vn -ab 128k -ar 44100 -f ipod ${outputAudio} -y`,
      (error, _stdout, _stderr) => {
        if (error) reject(error);
        //fs.unlinkSync(audio);
        resolve(outputAudio);
      }
    );
  });
};

const processAudioFile = async (audio: string): Promise<string> => {
  const outputAudio = `${publicFolder}/${new Date().getTime()}.mp3`;
  return new Promise((resolve, reject) => {
    exec(
      `${ffmpegPath.path} -i ${audio} -vn -ar 44100 -ac 2 -b:a 192k ${outputAudio}`,
      (error, _stdout, _stderr) => {
        if (error) reject(error);
        //fs.unlinkSync(audio);
        resolve(outputAudio);
      }
    );
  });
};

// Função para verificar se o vídeo precisa de conversão
const needsVideoConversion = (filePath: string): boolean => {
  const extension = path.extname(filePath).toLowerCase();
  
  // Formatos que sempre precisam de conversão
  const needConversion = ['.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v'];
  
  // Se não é MP4, precisa converter
  if (extension !== '.mp4') {
    return true;
  }
  
  // MP4 já otimizado pode não precisar (mas vamos converter mesmo assim para garantir compatibilidade)
  return true;
};

const processVideo = async (video: string): Promise<string> => {
  const outputVideo = `${publicFolder}/${new Date().getTime()}.mp4`;
  return new Promise((resolve, reject) => {
    console.log(`Convertendo vídeo: ${video} -> ${outputVideo}`);
    
    // Comando FFmpeg otimizado para WhatsApp
    // -c:v libx264: codec de vídeo H.264 (compatível com WhatsApp)
    // -c:a aac: codec de áudio AAC (compatível com WhatsApp)
    // -crf 23: qualidade balanceada (0-51, menor = melhor qualidade)
    // -preset medium: velocidade de encoding balanceada
    // -movflags +faststart: otimização para streaming
    // -vf scale: redimensiona se necessário (máximo 1280x720 para WhatsApp)
    const ffmpegCommand = `${ffmpegPath.path} -i "${video}" -c:v libx264 -c:a aac -crf 23 -preset medium -movflags +faststart -vf "scale='min(1280,iw)':'min(720,ih)':force_original_aspect_ratio=decrease" -r 30 -b:v 2M -maxrate 3M -bufsize 6M "${outputVideo}"`;
    
    exec(ffmpegCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('Erro na conversão do vídeo:', error);
        console.error('stderr:', stderr);
        reject(error);
        return;
      }
      
      // Verificar se o arquivo foi criado com sucesso
      if (!fs.existsSync(outputVideo)) {
        reject(new Error('Arquivo de vídeo convertido não foi criado'));
        return;
      }
      
      const stats = fs.statSync(outputVideo);
      console.log(`Vídeo convertido com sucesso. Tamanho: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
      resolve(outputVideo);
    });
  });
};

// Função melhorada para descobrir o nome do arquivo
const nameFileDiscovery = (pathMedia: string) => {
  const normalizedPath = pathMedia.replace(/\\/g, '/');
  const spliting = normalizedPath.split('/');
  const fileName = spliting[spliting.length - 1];
  return fileName.split(".")[0];
};

// Função para detectar tipo de arquivo por extensão quando MIME falha
const getFileTypeByExtension = (filePath: string): string => {
  const extension = path.extname(filePath).toLowerCase();
  
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v'];
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.mpeg', '.mpg'];
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  
  if (videoExtensions.includes(extension)) return 'video';
  if (audioExtensions.includes(extension)) return 'audio';
  if (imageExtensions.includes(extension)) return 'image';
  
  return 'document';
};

// Função para validar se o arquivo existe
const validateFileExists = (filePath: string): boolean => {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    console.log(`Erro ao verificar arquivo: ${error.message}`);
    return false;
  }
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const typeSimulation = async (ticket: Ticket, presence: WAPresence) => {
  const wbot = await GetTicketWbot(ticket);

  let contact = await Contact.findOne({
    where: {
      id: ticket.contactId,
    }
  });

  await wbot.sendPresenceUpdate(presence, `${contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`);
  await delay(5000);
  await wbot.sendPresenceUpdate('paused', `${contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`);
};

const SendWhatsAppMediaFlow = async ({
  media,
  ticket,
  body,
  isFlow = false,
  isRecord = false
}: RequestFlow): Promise<WAMessage> => {
  try {
    const wbot = await GetTicketWbot(ticket);

    // Normalizar o caminho do arquivo
    const pathMedia = path.resolve(media);
    
    console.log(`Tentando acessar arquivo: ${pathMedia}`);
    
    // Verificar se o arquivo existe
    if (!validateFileExists(pathMedia)) {
      console.error(`Arquivo não encontrado: ${pathMedia}`);
      throw new AppError(`Arquivo não encontrado: ${pathMedia}`);
    }

    // Tentar detectar o mimetype
    let mimetype = String(mime.lookup(pathMedia));
    console.log(`MIME type detectado: ${mimetype}`);
    
    // Correções específicas para mimetypes incorretos
    const extension = path.extname(pathMedia).toLowerCase();
    
    if (mimetype === 'application/mp4') {
      console.log('Corrigindo mimetype de application/mp4 para video/mp4');
      mimetype = 'video/mp4';
    }
    
    // Correção específica para arquivos .mpeg que são áudios
    if (extension === '.mpeg' || extension === '.mpg') {
      console.log('Arquivo .mpeg detectado - tratando como áudio');
      mimetype = 'audio/mpeg';
    }
    
    // Se não conseguir detectar o mimetype, usar fallback
    if (!mimetype || mimetype === 'false') {
      console.log('MIME type não detectado, usando detecção por extensão');
      const fileType = getFileTypeByExtension(pathMedia);
      
      switch (fileType) {
        case 'video':
          mimetype = 'video/mp4';
          break;
        case 'audio':
          mimetype = 'audio/mp3';
          break;
        case 'image':
          mimetype = 'image/jpeg';
          break;
        default:
          mimetype = 'application/octet-stream';
      }
    }

    const typeMessage = mimetype.split("/")[0];
    const mediaName = nameFileDiscovery(pathMedia);
    
    // Verificação adicional para garantir que vídeos sejam tratados corretamente
    const fileExtension = path.extname(pathMedia).toLowerCase();
    const isVideoFile = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v'].includes(fileExtension);
    const isAudioFile = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.mpeg', '.mpg'].includes(fileExtension);
    
    console.log(`Tipo de mensagem: ${typeMessage}`);
    console.log(`Extensão do arquivo: ${fileExtension}`);
    console.log(`É arquivo de vídeo: ${isVideoFile}`);
    console.log(`É arquivo de áudio: ${isAudioFile}`);
    console.log(`Nome do arquivo: ${mediaName}`);

    let options: AnyMessageContent;

    // Priorizar detecção por extensão para arquivos de vídeo
    if (isVideoFile && !isAudioFile) {
      console.log('Enviando como vídeo');
      
      try {
        let videoPath = pathMedia;
        
        // Verificar se precisa converter
        if (needsVideoConversion(pathMedia)) {
          console.log('Vídeo precisa de conversão, processando...');
          videoPath = await processVideo(pathMedia);
          console.log(`Vídeo convertido: ${videoPath}`);
        } else {
          console.log('Vídeo já está em formato compatível');
        }
        
        options = {
          video: fs.readFileSync(videoPath),
          caption: body,
          fileName: `${mediaName}.mp4`,
          mimetype: 'video/mp4'
        };
        
        // Limpar arquivo convertido após um tempo (se foi convertido)
        if (videoPath !== pathMedia) {
          setTimeout(() => {
            try {
              if (fs.existsSync(videoPath)) {
                fs.unlinkSync(videoPath);
                console.log(`Arquivo convertido removido: ${videoPath}`);
              }
            } catch (cleanupError) {
              console.warn('Erro ao limpar arquivo convertido:', cleanupError);
            }
          }, 10000); // 10 segundos após o envio
        }
        
      } catch (conversionError) {
        console.error('Erro na conversão do vídeo, enviando arquivo original:', conversionError);
        // Fallback: enviar arquivo original se a conversão falhar
        options = {
          video: fs.readFileSync(pathMedia),
          caption: body,
          fileName: `${mediaName}.mp4`,
          mimetype: 'video/mp4'
        };
      }
    } else if (isAudioFile || typeMessage === "audio") {
      console.log('Enviando como áudio');
      console.log('É gravação?', isRecord);
      
      if (isRecord) {
        const convert = await processAudio(pathMedia);
        options = {
          audio: fs.readFileSync(convert),
          mimetype: "audio/mp4",
          ptt: true
        };
      } else {
        const convert = await processAudioFile(pathMedia);
        options = {
          audio: fs.readFileSync(convert),
          mimetype: "audio/mp4",
          ptt: false
        };
      }
    } else if (typeMessage === "image") {
      console.log('Enviando como imagem');
      options = {
        image: fs.readFileSync(pathMedia),
        caption: body,
        fileName: mediaName,
        mimetype: mimetype
      };
    } else if (typeMessage === "document" || typeMessage === "application") {
      console.log('Enviando como documento');
      options = {
        document: fs.readFileSync(pathMedia),
        caption: body,
        fileName: mediaName,
        mimetype: mimetype
      };
    } else {
      // Fallback para extensões conhecidas
      const fileType = getFileTypeByExtension(pathMedia);
      console.log(`Fallback: tipo detectado por extensão: ${fileType}`);
      
      if (fileType === 'video') {
        console.log('Fallback: Enviando como vídeo');
        try {
          let videoPath = pathMedia;
          
          if (needsVideoConversion(pathMedia)) {
            console.log('Fallback: Vídeo precisa de conversão, processando...');
            videoPath = await processVideo(pathMedia);
            console.log(`Fallback: Vídeo convertido: ${videoPath}`);
          }
          
          options = {
            video: fs.readFileSync(videoPath),
            caption: body,
            fileName: `${mediaName}.mp4`,
            mimetype: 'video/mp4'
          };
          
          if (videoPath !== pathMedia) {
            setTimeout(() => {
              try {
                if (fs.existsSync(videoPath)) {
                  fs.unlinkSync(videoPath);
                  console.log(`Arquivo convertido removido: ${videoPath}`);
                }
              } catch (cleanupError) {
                console.warn('Erro ao limpar arquivo convertido:', cleanupError);
              }
            }, 10000);
          }
        } catch (conversionError) {
          console.error('Fallback: Erro na conversão do vídeo, enviando arquivo original:', conversionError);
          options = {
            video: fs.readFileSync(pathMedia),
            caption: body,
            fileName: `${mediaName}.mp4`,
            mimetype: 'video/mp4'
          };
        }
      } else if (fileType === 'audio') {
        console.log('Fallback: Enviando como áudio');
        if (isRecord) {
          const convert = await processAudio(pathMedia);
          options = {
            audio: fs.readFileSync(convert),
            mimetype: "audio/mp4",
            ptt: true
          };
        } else {
          const convert = await processAudioFile(pathMedia);
          options = {
            audio: fs.readFileSync(convert),
            mimetype: "audio/mp4",
            ptt: false
          };
        }
      } else if (fileType === 'image') {
        console.log('Fallback: Enviando como imagem');
        options = {
          image: fs.readFileSync(pathMedia),
          caption: body,
          fileName: mediaName,
          mimetype: 'image/jpeg'
        };
      } else {
        console.log('Fallback: Enviando como documento');
        options = {
          document: fs.readFileSync(pathMedia),
          caption: body,
          fileName: mediaName,
          mimetype: mimetype || 'application/octet-stream'
        };
      }
    }

    let contact = await Contact.findOne({
      where: {
        id: ticket.contactId,
      }
    });

    const sentMessage = await wbot.sendMessage(
      `${contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`,
      {
        ...options
      }
    );

    await ticket.update({ lastMessage: mediaName });

    return sentMessage;
  } catch (err) {
    Sentry.captureException(err);
    console.error('Erro ao enviar mídia:', err);
    throw new AppError("ERR_SENDING_WAPP_MSG");
  }
};

export default SendWhatsAppMediaFlow;