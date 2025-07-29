import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  makeStyles,
  Typography,
  Modal,
  Button,
  TextField,
  Avatar,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import EmojiPicker from "emoji-picker-react";
import GetAppIcon from "@material-ui/icons/GetApp";

import { AuthContext } from "../../context/Auth/AuthContext";
import { useDate } from "../../hooks/useDate";
import api from "../../services/api";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    flex: 1,
    overflow: "hidden",
    borderRadius: 0,
    height: "100%",
    backgroundColor: "#0f0f0f",
  },
  chatHeader: {
    padding: theme.spacing(2),
    backgroundColor: "#1e1e1e",
    borderBottom: "1px solid #333333",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
  },
  headerAvatar: {
    backgroundColor: "#00d4aa",
    width: 40,
    height: 40,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: "#ffffff",
    fontWeight: 600,
    fontSize: "1.1rem",
    margin: 0,
  },
  headerSubtitle: {
    color: "#a0a0a0",
    fontSize: "0.875rem",
    margin: 0,
  },
  messageList: {
    position: "relative",
    overflowY: "auto",
    height: "100%",
    padding: theme.spacing(1),
    backgroundColor: "#0f0f0f",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#0f0f0f",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#333333",
      borderRadius: "3px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#404040",
    },
  },
  inputArea: {
    position: "relative",
    backgroundColor: "#1e1e1e",
    borderTop: "1px solid #333333",
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1.5, 2),
    gap: theme.spacing(1),
  },
  messageInput: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: "24px",
    "& .MuiInputBase-input": {
      color: "#ffffff",
      padding: "12px 16px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .MuiInputBase-input::placeholder": {
      color: "#a0a0a0",
      opacity: 1,
    },
  },
  sendButton: {
    backgroundColor: "#00d4aa",
    color: "#ffffff",
    borderRadius: "50%",
    minWidth: "40px",
    width: "40px",
    height: "40px",
    "&:hover": {
      backgroundColor: "#00b894",
    },
  },
  emojiButton: {
    color: "#a0a0a0",
    "&:hover": {
      backgroundColor: "#333333",
      color: "#ffffff",
    },
  },
  boxLeft: {
    padding: "12px 16px",
    margin: "8px 0",
    marginRight: "25%",
    position: "relative",
    backgroundColor: "#2a2a2a",
    color: "#ffffff",
    borderRadius: "18px",
    borderBottomLeftRadius: "4px",
    border: "none",
    wordWrap: "break-word",
    fontSize: "0.875rem",
    lineHeight: 1.4,
  },
  boxRight: {
    padding: "12px 16px",
    margin: "8px 0",
    marginLeft: "25%",
    position: "relative",
    backgroundColor: "#00d4aa",
    color: "#ffffff",
    textAlign: "left",
    borderRadius: "18px",
    borderBottomRightRadius: "4px",
    border: "none",
    wordWrap: "break-word",
    fontSize: "0.875rem",
    lineHeight: 1.4,
  },
  messageTime: {
    fontSize: "0.75rem",
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: "4px",
    textAlign: "right",
  },
  emojiPicker: {
    position: "absolute",
    bottom: "100%",
    right: 0,
    zIndex: 10,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#1e1e1e",
    color: "#ffffff",
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    textAlign: "center",
    border: "1px solid #333333",
  },
  modalImage: {
    maxWidth: "90%",
    maxHeight: "80vh",
    marginBottom: theme.spacing(2),
  },
  downloadButton: {
    marginTop: theme.spacing(2),
    backgroundColor: "#00d4aa",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#00b894",
    },
  },
}));

export default function ChatMessages({
  chat,
  messages,
  handleSendMessage,
  handleLoadMore,
  scrollToBottomRef,
  pageInfo,
  loading,
}) {
  const classes = useStyles();
  const { user, socket } = useContext(AuthContext);
  const { datetimeToClient } = useDate();
  const baseRef = useRef();

  const [contentMessage, setContentMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Estado para controlar a exibição do seletor de emojis
  const [selectedImage, setSelectedImage] = useState(null); // Estado para controlar a imagem selecionada para ampliar

  const scrollToBottom = () => {
    if (baseRef.current) {
      baseRef.current.scrollIntoView({});
    }
  };

  const unreadMessages = (chat) => {
    if (chat !== undefined) {
      const currentUser = chat.users.find((u) => u.userId === user.id);
      return currentUser.unreads > 0;
    }
    return 0;
  };

  useEffect(() => {
    if (unreadMessages(chat) > 0) {
      try {
        api.post(`/chats/${chat.id}/read`, { userId: user.id });
      } catch (err) {}
    }
    scrollToBottomRef.current = scrollToBottom;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = (e) => {
    const { scrollTop } = e.currentTarget;
    if (!pageInfo.hasMore || loading) return;
    if (scrollTop < 600) {
      handleLoadMore();
    }
  };

  const handleSend = () => {
    if (contentMessage.trim() !== "") {
      handleSendMessage(contentMessage);
      setContentMessage("");
    }
  };

  // Função para adicionar emoji ao conteúdo da mensagem
  const handleEmojiClick = (emojiObject) => {
    setContentMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false); // Fecha o seletor de emojis após a seleção
  };

  // Função para abrir a imagem no modal
  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  // Função para baixar a imagem
  const handleDownloadImage = () => {
    if (selectedImage) {
      const link = document.createElement("a");
      link.href = selectedImage;
      link.download = "image.png"; // Nome do arquivo para download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Configuração da barra de ferramentas do editor
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // Negrito, Itálico, Sublinhado, Taxado
      ["image"], // Inserir imagem
    ],
  };

  // Efeito para adicionar eventos de clique nas imagens após o render
  useEffect(() => {
    const images = document.querySelectorAll(".messageContent img");
    images.forEach((img) => {
      img.style.cursor = "pointer";
      img.addEventListener("click", () => handleImageClick(img.src));
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("click", () => handleImageClick(img.src));
      });
    };
  }, [messages]);

  return (
    <div className={classes.mainContainer}>
      {/* Header do chat */}
      <div className={classes.chatHeader}>
        <Avatar className={classes.headerAvatar}>
          {chat.title ? chat.title.charAt(0).toUpperCase() : "C"}
        </Avatar>
        <div className={classes.headerInfo}>
          <Typography className={classes.headerTitle}>
            {chat.title}
          </Typography>
          <Typography className={classes.headerSubtitle}>
            Participants: {chat.users?.length || 0}
          </Typography>
        </div>
      </div>

      {/* Lista de mensagens */}
      <div onScroll={handleScroll} className={classes.messageList}>
        {Array.isArray(messages) &&
          messages.map((item, key) => {
            if (item.senderId === user.id) {
              return (
                <Box key={key} className={classes.boxRight}>
                  <div
                    className="messageContent"
                    dangerouslySetInnerHTML={{ __html: item.message }}
                  />
                  <div className={classes.messageTime}>
                    {datetimeToClient(item.createdAt)}
                  </div>
                </Box>
              );
            } else {
              return (
                <Box key={key} className={classes.boxLeft}>
                  <Typography 
                    variant="caption" 
                    style={{ 
                      color: "#00d4aa", 
                      fontWeight: 600, 
                      fontSize: "0.75rem",
                      marginBottom: "4px",
                      display: "block"
                    }}
                  >
                    {item.sender.name}
                  </Typography>
                  <div
                    className="messageContent"
                    dangerouslySetInnerHTML={{ __html: item.message }}
                  />
                  <div className={classes.messageTime}>
                    {datetimeToClient(item.createdAt)}
                  </div>
                </Box>
              );
            }
          })}
        <div ref={baseRef}></div>
      </div>

      {/* Área de input */}
      <div className={classes.inputArea}>
        <IconButton
          className={classes.emojiButton}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <InsertEmoticonIcon />
        </IconButton>
        
        <TextField
          className={classes.messageInput}
          placeholder="Write your message..."
          variant="outlined"
          fullWidth
          multiline
          maxRows={3}
          value={contentMessage}
          onChange={(e) => setContentMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        
        <IconButton
          className={classes.sendButton}
          onClick={handleSend}
          disabled={!contentMessage.trim()}
        >
          <SendIcon />
        </IconButton>

        {showEmojiPicker && (
          <div className={classes.emojiPicker}>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

      {/* Modal para exibir a imagem ampliada */}
      <Modal
        open={!!selectedImage}
        onClose={handleCloseModal}
        className={classes.modal}
      >
        <div className={classes.modalContent}>
          <img
            src={selectedImage}
            alt="Ampliada"
            className={classes.modalImage}
          />
          <Button
            variant="contained"
            startIcon={<GetAppIcon />}
            onClick={handleDownloadImage}
            className={classes.downloadButton}
          >
            Baixar Imagem
          </Button>
        </div>
      </Modal>
    </div>
  );
}