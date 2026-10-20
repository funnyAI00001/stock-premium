import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import React, { useEffect, useState } from "react";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomAlert = ({ openState, text, severity, onClose }) => {
  const [open, setOpen] = useState(openState);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    onClose();
  };

  useEffect(() => {
    setOpen(openState);
  }, [openState]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        sx={{
          width: "100%",
          color: "white",
          "& .MuiButtonBase-root": {
            border: "none",
          },
        }}
      >
        {text}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;
