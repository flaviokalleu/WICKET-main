import React, { useEffect, useState, useContext } from "react";
import QRCode from "qrcode.react";
import toastError from "../../errors/toastError";
import { makeStyles } from "@material-ui/core/styles";
import { Dialog, DialogContent, Paper, Typography } from "@material-ui/core";
import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import g02 from "../QrcodeModal/g02.gif";

import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
}))

const QrcodeModal = ({ open, onClose, whatsAppId }) => {
  const classes = useStyles();
  const [qrCode, setQrCode] = useState("");
  const { user, socket } = useContext(AuthContext);

  useEffect(() => {
    const fetchSession = async () => {
      if (!whatsAppId) return;

      try {
        const { data } = await api.get(`/whatsapp/${whatsAppId}`);
        setQrCode(data.qrcode);
      } catch (err) {
        toastError(err);
      }
    };
    fetchSession();
  }, [whatsAppId]);

  useEffect(() => {
    if (!whatsAppId) return;
    const companyId = user.companyId;
    // const socket = socketConnection({ companyId, userId: user.id });

    const onWhatsappData = (data) => {
      if (data.action === "update" && data.session.id === whatsAppId) {
        setQrCode(data.session.qrcode);
      }

      if (data.action === "update" && data.session.qrcode === "") {
        onClose();
      }
    }
    socket.on(`company-${companyId}-whatsappSession`, onWhatsappData);

    return () => {
      socket.off(`company-${companyId}-whatsappSession`, onWhatsappData);
    };
  }, [whatsAppId, onClose]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      scroll="paper"
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
  <DialogContent style={{ backgroundColor: "#1a1a1a", color: "#ffffff" }}>
    <Paper elevation={0} style={{ display: "flex", alignItems: "center", backgroundColor: "#1a1a1a" }}>
      {/* GIF no lado esquerdo */}
      <img 
        src={g02} 
        alt="Gif de exemplo" 
        style={{ width: "200px", height: "200px", marginRight: "20px" }} 
      />
      
      <div>
        <Typography style={{ color: "#ffffff" }} gutterBottom>
          {i18n.t("qrCode.message")}
        </Typography>
        <div className={classes.root}>
          {qrCode ? (
            <QRCode value={qrCode} size={300} style={{ backgroundColor: "white", padding: '5px' }} />
          ) : (
            <span style={{ color: "#ffffff" }}>Aguardando pelo QR Code</span>
          )}
        </div>
      </div>
    </Paper>
  </DialogContent>
</Dialog>
  );
};

export default React.memo(QrcodeModal);
