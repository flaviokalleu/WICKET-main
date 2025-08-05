import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";


const FlowBuilderConditionIfElseModal = ({ open, onSave, data, onUpdate, close }) => {
  const safeData = data || {};
  const [conditionText, setConditionText] = React.useState(safeData.conditionText || "");
  const [ifLabel, setIfLabel] = React.useState(safeData.ifLabel || "");
  const [elseLabel, setElseLabel] = React.useState(safeData.elseLabel || "");

  const handleSave = () => {
    onSave({ conditionText, ifLabel, elseLabel });
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
      <DialogTitle>Condição IF/Else</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Condição (ex: cliente falou X)"
          type="text"
          fullWidth
          value={conditionText}
          onChange={e => setConditionText(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Ação IF (verdadeiro)"
          type="text"
          fullWidth
          value={ifLabel}
          onChange={e => setIfLabel(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Ação ELSE (falso)"
          type="text"
          fullWidth
          value={elseLabel}
          onChange={e => setElseLabel(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FlowBuilderConditionIfElseModal;
