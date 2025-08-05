import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";


const FlowBuilderFlowModal = ({ open, onSave, data, onUpdate, close }) => {
  const safeData = data || {};
  const [flow, setFlow] = React.useState(safeData.flow || "");

  const handleSave = () => {
    onSave({ flow });
    close();
  };

  return (
    <Dialog 
			open={open} 
			onClose={close}
			hideBackdrop={true}
			PaperProps={{
				style: {
					borderRadius: "12px",
					boxShadow: "0 24px 48px rgba(0,0,0,0.8)",
					background: "#1a1a1a",
					color: "#ffffff",
				}
			}}
		>
      <DialogTitle>Trocar Fluxo</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nome do Fluxo"
          type="text"
          fullWidth
          value={flow}
          onChange={e => setFlow(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FlowBuilderFlowModal;
