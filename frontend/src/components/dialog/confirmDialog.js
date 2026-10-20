import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function ConfirmationDialog({ open, onClose, onConfirm, title, text }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ display: "flex", alignItems: "center" }}>
        <DeleteIcon sx={{ color: "red" }} />
        {text}
      </DialogContent>
      <DialogActions sx={{ marginRight: 2, marginBottom: 2 }}>
        <Button
          onClick={onClose}
          color="primary"
          variant="outlined"
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
          variant="outlined"
          sx={{ textTransform: "none" }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
