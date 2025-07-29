import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";


const FlowBuilderQueueModal = ({ open, onSave, data, onUpdate, close }) => {
  const safeData = data || {};
  const [queue, setQueue] = React.useState(safeData.queue || "");

  const handleSave = () => {
    onSave({ queue });
    close();
  };

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Trocar Fila</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nome da Fila"
          type="text"
          fullWidth
          value={queue}
          onChange={e => setQueue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FlowBuilderQueueModal;
