import MuiAlert from "@mui/material/Alert";
import React, { useEffect, useState } from "react";
import { useMediaQuery, Snackbar } from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomAlert2 = ({
  openState,
  text,
  severity,
  onClose,
  autoHideDuration = 5000,
}) => {
  const isSmScreen = useMediaQuery("(min-width:600px)");
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
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{
        transform: "none !important",
        WebkitTransform: "none",
        position: "inherit",
        width: isSmScreen ? "60%" : "90%",
        zIndex: 1000,
      }}
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

export default CustomAlert2;
