import React from "react";
import { Dialog, DialogContent, Button, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";

const SelectCallOrPut = ({ open, onClose, onCall, onPut, text }) => {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          border: "solid 1px white",
          borderRadius: 1,
          gap: 3,
          padding: 6,
          "& .MuiButtonBase-root": {
            color: "white !important",
            border: "solid 1px",
            borderColor: theme.palette.text.third,
          },
        }}
      >
        <Typography textAlign="center">{text}</Typography>
        <Button
          onClick={onCall}
          color="primary"
          variant="outlined"
          sx={{
            textTransform: "none",
          }}
        >
          Covered Calls
        </Button>
        <Button
          onClick={onPut}
          color="primary"
          variant="outlined"
          sx={{ textTransform: "none" }}
        >
          Cash-Secured Puts
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SelectCallOrPut;
