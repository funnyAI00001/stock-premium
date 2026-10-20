import React from "react";
import { Dialog, DialogContent, CircularProgress } from "@mui/material";

export default function LoadingOverlay({ text, color }) {
  return (
    <Dialog open={true} disableEscapeKeyDown={true}>
      <DialogContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress color={color}/>
          <p>{text}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
