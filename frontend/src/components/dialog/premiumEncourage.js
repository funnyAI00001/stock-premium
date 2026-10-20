import React from "react";
import { Dialog, DialogContent, DialogActions, Button } from "@mui/material";
import { useTheme } from "@emotion/react";

const PremiumEncourage = ({ open, onClose }) => {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent
        sx={{
          alignItems: "center",
          color: "black",
          background: "white",
          textAlign: "center",
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        <p style={{ fontSize: 26 }}>
          <u>Premium Feature</u>
        </p>
        <p>
          You need <br></br>
          <a
            href="https://coverd.io/waitlist"
            target="_blank"
            rel="nonreferrer"
            style={{ color: "black" }}
          >
            COVERD EARLY ACCESS
          </a>{" "}
          <br></br>
          to use premium features.
        </p>
        <p>
          SECURE YOUR LIFETIME <br></br>DISCOUNT BY SIGNING UP NOW!
        </p>
        <p>Click below to learn more.</p>
      </DialogContent>
      <DialogActions sx={{ paddingX: 2, paddingY: 2, background: "white" }}>
        <Button
          onClick={() => {
            window.open("https://coverd.io/waitlist", "_blank");
          }}
          sx={{
            textTransform: "none",
            textAlign: "center",
            margin: "auto",
            height: 30,
            background: theme.palette.text.third,
            color: "white",
            borderRadius: "5px",
            "&:hover": {
              background: theme.palette.text.third,
              border: `${theme.palette.text.third} solid 1px`,
            },
          }}
        >
          Learn More
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PremiumEncourage;
