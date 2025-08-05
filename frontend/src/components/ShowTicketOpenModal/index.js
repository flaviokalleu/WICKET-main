import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { i18n } from '../../translate/i18n';
import CancelIcon from '@mui/icons-material/Cancel';

const ShowTicketOpen = ({ isOpen, handleClose, user, queue }) => {
  return (
    <Dialog 
      open={isOpen} 
      onClose={handleClose}
      hideBackdrop={true}
      PaperProps={{
        style: {
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
          border: "1px solid #333333",
          borderRadius: "12px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.8)",
        }
      }}
    >
      <DialogTitle
        style={{
          backgroundColor: "#000000",
          color: "#ffffff",
          padding: "16px 24px",
          borderBottom: "1px solid #333333",
        }}
      >
        {i18n.t("showTicketOpenModal.title.header")}
      </DialogTitle>
      <DialogContent
        style={{
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
          padding: "24px",
        }}
      >
        {user !== undefined && queue !== undefined && (
          <DialogContentText style={{ color: "#ffffff" }}>
            {i18n.t("showTicketOpenModal.form.message")} <br></br>
            { `${i18n.t("showTicketOpenModal.form.user")}: ${user}`}<br></br>
            {`${i18n.t("showTicketOpenModal.form.queue")}: ${queue}`}<br></br>
          </DialogContentText>
        )}
        {!user && (
          <DialogContentText style={{ color: "#ffffff" }}>
            {i18n.t("showTicketOpenModal.form.messageWait")} <br></br>
            {queue && (`${i18n.t("showTicketOpenModal.form.queue")}: ${queue}`)}<br></br>
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions
        style={{
          backgroundColor: "#1a1a1a",
          borderTop: "1px solid #333333",
          padding: "16px 24px",
        }}
      >
        <Button
          startIcon={<CancelIcon />}
          onClick={handleClose}
	  style={{
          color: "white",
          backgroundColor: "#db6565",
          boxShadow: "none",
          borderRadius: 0,
          fontSize: "12px",
          }}
           >
          Fechar
        </Button>
      </DialogActions>
    </Dialog >
  );
};

export default ShowTicketOpen;
