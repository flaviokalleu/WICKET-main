import React, { useEffect, useRef } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CheckoutPage from "../CheckoutPage";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginRight: theme.spacing(1),
    flex: 1,
  },

  extraAttr: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  btnWrapper: {
    position: "relative",
  },

  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

const ContactModal = ({ open, onClose, Invoice, contactId, initialValues, onSave }) => {
  const classes = useStyles();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleClose = () => {
    onClose();
  };

  return (
    <div className={classes.root}>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
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
        <DialogContent 
          dividers
          style={{ 
            backgroundColor: "#1a1a1a", 
            color: "#ffffff" 
          }}
        >
          <CheckoutPage
            Invoice={Invoice}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactModal;
