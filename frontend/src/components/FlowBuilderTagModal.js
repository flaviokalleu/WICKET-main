import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";


const FlowBuilderTagModal = ({ open, onSave, data, onUpdate, close }) => {
  const safeData = data || {};
  const [tag, setTag] = React.useState(safeData.tag || "");
  const [action, setAction] = React.useState(safeData.action || "add");

  const handleSave = () => {
    onSave({ tag, action });
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
      <DialogTitle>Adicionar/Remover Tag</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Ação</InputLabel>
          <Select value={action} label="Ação" onChange={e => setAction(e.target.value)}>
            <MenuItem value="add">Adicionar</MenuItem>
            <MenuItem value="remove">Remover</MenuItem>
          </Select>
        </FormControl>
        <TextField
          autoFocus
          margin="dense"
          label="Tag"
          type="text"
          fullWidth
          value={tag}
          onChange={e => setTag(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FlowBuilderTagModal;
