import React, { useContext, useState } from "react";
import {
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Avatar,
  ListItemAvatar,
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import { useHistory, useParams } from "react-router-dom";
import { AuthContext } from "../../context/Auth/AuthContext";
import { useDate } from "../../hooks/useDate";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";

import ConfirmationModal from "../../components/ConfirmationModal";
import api from "../../services/api";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#1a1a1a",
  },
  searchContainer: {
    padding: theme.spacing(2),
    borderBottom: "1px solid #333333",
  },
  searchInput: {
    backgroundColor: "#2a2a2a",
    borderRadius: "8px",
    "& .MuiInputBase-input": {
      color: "#ffffff",
      padding: "12px 16px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .MuiInputAdornment-root": {
      color: "#a0a0a0",
    },
  },
  chatList: {
    position: "relative",
    flex: 1,
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#1a1a1a",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#333333",
      borderRadius: "3px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#404040",
    },
  },
  listItemActive: {
    cursor: "pointer",
    backgroundColor: "#00d4aa",
    margin: "2px 8px",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#00b894",
    },
    "& .MuiListItemText-primary": {
      color: "#ffffff",
      fontWeight: 600,
    },
    "& .MuiListItemText-secondary": {
      color: "rgba(255, 255, 255, 0.8)",
    },
  },
  listItem: {
    cursor: "pointer",
    backgroundColor: "transparent",
    margin: "2px 8px",
    borderRadius: "8px",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#2a2a2a",
    },
    "& .MuiListItemText-primary": {
      color: "#ffffff",
      fontWeight: 500,
    },
    "& .MuiListItemText-secondary": {
      color: "#a0a0a0",
    },
  },
  listItemAvatar: {
    minWidth: "56px",
  },
  avatar: {
    width: "44px",
    height: "44px",
    backgroundColor: "#00d4aa",
    color: "#ffffff",
    fontWeight: 600,
  },
  unreadBadge: {
    backgroundColor: "#00d4aa",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "2px 8px",
    fontSize: "0.75rem",
    fontWeight: 600,
    marginLeft: "8px",
  },
  actionButtons: {
    display: "flex",
    gap: "4px",
  },
  actionButton: {
    padding: "6px",
    borderRadius: "6px",
    minWidth: "auto",
    "&.edit": {
      backgroundColor: "#40BFFF",
      "&:hover": {
        backgroundColor: "#1a8ccc",
      },
    },
    "&.delete": {
      backgroundColor: "#FF6B6B",
      "&:hover": {
        backgroundColor: "#e55555",
      },
    },
  },
}));

export default function ChatList({
  chats,
  handleSelectChat,
  handleDeleteChat,
  handleEditChat,
  pageInfo,
  loading,
}) {
  const classes = useStyles();
  const history = useHistory();
  const { user, socket } = useContext(AuthContext);
  const { datetimeToClient } = useDate();

  const [confirmationModal, setConfirmModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState({});

  const { id } = useParams();

  const goToMessages = async (chat) => {
    if (unreadMessages(chat) > 0) {
      try {
        await api.post(`/chats/${chat.id}/read`, { userId: user.id });
      } catch (err) {}
    }

    if (id !== chat.uuid) {
      history.push(`/chats/${chat.uuid}`);
      handleSelectChat(chat);
    }
  };

  const handleDelete = () => {
    handleDeleteChat(selectedChat);
  };

  const unreadMessages = (chat) => {
    const currentUser = chat.users.find((u) => u.userId === user.id);
    return currentUser.unreads;
  };

  const getPrimaryText = (chat) => {
    const mainText = chat.title;
    const unreads = unreadMessages(chat);
    return (
      <>
        {mainText}
        {unreads > 0 && (
          <Chip
            size="small"
            style={{ marginLeft: 5 }}
            label={unreads}
            color="secondary"
          />
        )}
      </>
    );
  };

  const getSecondaryText = (chat) => {
    return datetimeToClient(chat.updatedAt); // Exibe apenas a data e horário da última atualização
  };

  return (
    <>
      <ConfirmationModal
        title={"Excluir Conversa"}
        open={confirmationModal}
        onClose={setConfirmModalOpen}
        onConfirm={handleDelete}
      >
        Esta ação não pode ser revertida, confirmar?
      </ConfirmationModal>
      <div className={classes.mainContainer}>
        <div className={classes.searchContainer}>
          <TextField
            className={classes.searchInput}
            placeholder="Search conversations..."
            variant="outlined"
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className={classes.chatList}>
          <List component="nav" disablePadding>
            {Array.isArray(chats) &&
              chats.length > 0 &&
              chats.map((chat, key) => (
                <ListItem
                  onClick={() => goToMessages(chat)}
                  key={key}
                  className={chat.uuid === id ? classes.listItemActive : classes.listItem}
                  button
                >
                  <ListItemAvatar className={classes.listItemAvatar}>
                    <Avatar className={classes.avatar}>
                      {chat.title.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span>{chat.title}</span>
                        {unreadMessages(chat) > 0 && (
                          <span className={classes.unreadBadge}>
                            {unreadMessages(chat)}
                          </span>
                        )}
                      </div>
                    }
                    secondary={datetimeToClient(chat.updatedAt)}
                  />
                  {chat.ownerId === user.id && (
                    <ListItemSecondaryAction className={classes.actionButtons}>
                      <IconButton
                        className={`${classes.actionButton} edit`}
                        onClick={() => {
                          goToMessages(chat).then(() => {
                            handleEditChat(chat);
                          });
                        }}
                        size="small"
                        title="Editar Conversa"
                      >
                        <EditIcon style={{ color: "#fff", fontSize: "18px" }} />
                      </IconButton>

                      <IconButton
                        className={`${classes.actionButton} delete`}
                        onClick={() => {
                          setSelectedChat(chat);
                          setConfirmModalOpen(true);
                        }}
                        size="small"
                        title="Excluir Conversa"
                      >
                        <DeleteIcon style={{ color: "#fff", fontSize: "18px" }} />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
          </List>
        </div>
      </div>
    </>
  );
}