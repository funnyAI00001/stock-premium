import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Grid,
  Typography,
  TextField,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { useDispatch } from "react-redux";

import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

import { updateCategory, deleteCategory } from "../../actions/stockAction";

import LoadingOverlay from "../dialog/loadingOverlay";
import CustomAlert from "../customAlert";
import ConfirmationDialog from "../dialog/confirmDialog";

const EditCategory = ({ onCancel, onSave, name, parentSymbols, user }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [symbols, setSymbols] = useState(parentSymbols);
  const [newName, setNewName] = useState(name);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openSaveSuccess, setOpenSaveSuccess] = useState(false);
  const [openDeleteSuccess, setOpenDeleteSuccess] = useState(false);
  const [openSaveFailure, setOpenSaveFailure] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openEmptySymbolsAlert, setOpenEmptySymbolsAlert] = useState(false);
  const [openTenSymbolsAlert, setOpenTenSymbolsAlert] = useState(false);

  const handleSymbolChange = (e, index) => {
    const input = e.target.value.toUpperCase(); // Convert input text to uppercase
    const onlyUppercase = input.replace(/[^A-Z]/g, ""); // Remove any characters that are not uppercase letters
    const values = [...symbols];
    values[index] = onlyUppercase;
    setSymbols(values);
  };

  const handleDeleteSymbol = (index) => {
    const cutSymbols = [...symbols];
    cutSymbols.splice(index, 1);

    setSymbols(cutSymbols);
  };

  const handleNewNameChange = (e) => {
    setNewName(e.target.value);
  };

  const addSymbol = () => {
    if (symbols.length === 10) {
      setOpenTenSymbolsAlert(true);
      return;
    }

    setSymbols([...symbols, ""]);
  };

  const handleSave = async () => {
    if (symbols.length === 0) {
      setOpenEmptySymbolsAlert(true);
      return;
    }

    const data = {
      symbols: symbols,
      oldCategoryName: name,
      newCategoryName: newName,
      user: user,
    };

    setIsSaving(true);
    const result = dispatch(updateCategory(data));
    setIsSaving(false);

    if (result) {
      setOpenSaveSuccess(true);
    } else {
      setOpenSaveFailure(true);
    }

    setTimeout(() => {
      onSave();
    }, 1000);
  };

  const onDelete = () => {
    setOpenDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    const data = {
      user_email: user.email,
      oldName: name,
      newName: newName,
    };
    setIsDeleting(true);
    await dispatch(deleteCategory(data));
    setIsDeleting(false);

    setOpenDeleteConfirm(false);
    setOpenDeleteSuccess(true);

    setTimeout(() => {
      setOpenDeleteSuccess(false);
      onCancel();
    }, 2000);
  };

  return (
    <Box
      sx={{
        "& .MuiButtonBase-root": {
          color: "white !important",
          border: "solid 1px",
          borderColor: theme.palette.text.third,
          width: "50%",
        },
      }}
    >
      <fieldset
        style={{
          borderColor: theme.palette.text.third,
          borderRadius: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          padding: 25,
        }}
      >
        <legend>{name}</legend>
        <TextField
          value={newName}
          autoComplete="off"
          onChange={(e) => handleNewNameChange(e)}
          placeholder="Please type a new name"
          label="Category Name"
          variant="filled"
          sx={{
            marginTop: 2,
            marginBottom: 2,
            background: "white",
            // borderRadius: "10px",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
          inputProps={{
            style: {
              color: "black",
            },
          }}
          InputLabelProps={{
            style: {
              color: theme.palette.text.third,
              fontSize: 18,
            },
          }}
        />
        {symbols.map((symbol, index) => (
          <Grid container display="flex" alignItems="center" key={index}>
            <Grid item xs={2} sm={3} textAlign="right">
              <Typography variant="body1" color="white" paddingRight={1}>
                {index + 1}
                {"."}
              </Typography>
            </Grid>
            <Grid
              item
              xs={8}
              sm={6}
              sx={{ "& .MuiInputBase-input": { color: "black" } }}
            >
              <TextField
                key={index}
                value={symbol}
                autoComplete="off"
                onChange={(e) => handleSymbolChange(e, index)}
                variant="outlined"
                sx={{
                  marginTop: 1,
                  marginBottom: 1,
                  background: "white",
                  borderRadius: "10px",
                }}
                inputProps={{
                  autoComplete: "new-email",
                }}
                style={{ color: "black !important" }}
              />
            </Grid>
            <Grid
              item
              xs={2}
              sm={3}
              textAlign="center"
              sx={{ paddingRight: { xs: 0, md: 3 } }}
            >
              {index !== 0 && (
                <IconButton
                  aria-label="delete"
                  sx={{
                    border: "none !important",
                    width: "unset",
                  }}
                  onClick={() => {
                    handleDeleteSymbol(index);
                  }}
                >
                  <RemoveCircleIcon />
                </IconButton>
              )}
            </Grid>
          </Grid>
        ))}
        <div style={{ textAlign: "center" }}>
          <IconButton
            aria-label="add"
            size="large"
            style={{
              border: "none",
              width: "unset",
            }}
            onClick={addSymbol}
          >
            <AddCircleIcon />
          </IconButton>
        </div>
        <Box display="flex" width="100%" justifyContent="space-between" gap={5}>
          <Button
            startIcon={<SaveIcon />}
            onClick={() => {
              handleSave();
            }}
          >
            Save
          </Button>
          <Button
            startIcon={<CloseIcon />}
            onClick={() => {
              onCancel();
            }}
          >
            Close
          </Button>
          <IconButton
            aria-label="add"
            style={{
              border: "none",
              width: "unset",
            }}
            onClick={onDelete}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </fieldset>

      {/* Show save progress */}
      {isSaving && <LoadingOverlay color="success" text="Saving..." />}
      {isDeleting && <LoadingOverlay color="secondary" text="Deleting..." />}
      {/* Alert for success save change */}
      <CustomAlert
        openState={openSaveSuccess}
        severity="success"
        text="The changes have been saved successfully!"
        onClose={() => setOpenSaveSuccess(false)}
      />
      <CustomAlert
        openState={openDeleteSuccess}
        severity="success"
        text="The category has been removed successfully!"
        onClose={() => setOpenDeleteSuccess(false)}
      />
      <CustomAlert
        openState={openSaveFailure}
        severity="warning"
        text="Something went wrong!"
        onClose={() => setOpenSaveFailure(false)}
      />
      <CustomAlert
        openState={openEmptySymbolsAlert}
        severity="warning"
        text="Please add one symbol at least!"
        onClose={() => setOpenEmptySymbolsAlert(false)}
      />
      <CustomAlert
        openState={openTenSymbolsAlert}
        severity="warning"
        text="One category can have ten symbols at max!"
        onClose={() => setOpenTenSymbolsAlert(false)}
      />
      <ConfirmationDialog
        text="Are you sure you want to delete the category?"
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
        title="Confirm Dialog"
        onConfirm={() => {
          handleDeleteConfirm();
        }}
      />
    </Box>
  );
};

export default EditCategory;
