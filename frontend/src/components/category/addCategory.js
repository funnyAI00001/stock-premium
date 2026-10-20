import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { addCategory } from "../../actions/stockAction";

import LoadingOverlay from "../dialog/loadingOverlay";
import CustomAlert from "../customAlert";

const AddCategory = ({ open, onClose, symbols = [] }) => {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const { user } = useAuth0();
  const [saving, setSaving] = useState(false);
  const [added, setAdded] = useState(false);
  const [openSameCategoryAlert, setOpenSameCategoryAlert] = useState(false);

  const onConfirm = async () => {
    if (name === "") {
      alert("Please input the name correctly!");
      return;
    }
    setSaving(true);
    dispatch(addCategory({ user, name, symbols }, saveCompleted));
  };

  const saveCompleted = (result) => {
    setSaving(false);

    if (!result) {
      setOpenSameCategoryAlert(true);
    } else {
      setAdded(true);
    }

    setTimeout(() => {
      onClose();
    }, 4000);
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ minWidth: "250px !important" }}>
      <DialogTitle>Add Category</DialogTitle>
      <DialogContent
        sx={{ display: "flex", alignItems: "center", minWidth: 350 }}
      >
        <TextField
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
          sx={{
            marginTop: 2,
          }}
        />
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
          Add
        </Button>
      </DialogActions>
      {saving && <LoadingOverlay text="Saving" color="success" />}
      <CustomAlert
        openState={added}
        text="A new category has been created successfully!"
        severity="success"
        autoHideDuration={2000}
        onClose={() => setAdded(false)}
      />
      <CustomAlert
        openState={openSameCategoryAlert}
        text="The same category already exists!"
        severity="warning"
        autoHideDuration={2000}
        onClose={() => setOpenSameCategoryAlert(false)}
      />
    </Dialog>
  );
};

export default AddCategory;
