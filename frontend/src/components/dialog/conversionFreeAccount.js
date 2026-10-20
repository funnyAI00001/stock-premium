import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { useAuth0 } from "@auth0/auth0-react";

const ConversionFreeAccount = ({ open, onClose }) => {
  const theme = useTheme();
  const { loginWithRedirect } = useAuth0();

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"xs"}>
      <DialogContent
        sx={{
          alignItems: "center",
          color: "black",
          background: "white",
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        <Typography
          variant="h2"
          textAlign="center"
          color={theme.palette.text.third}
          mt={2}
        >
          Sign up now!
        </Typography>
        <p style={{ color: theme.palette.text.third, textAlign: "center" }}>
          It's free.
        </p>
        <p>Sign up now and get 7 days of unlimited premium access for free.</p>
        <ul>
          <li>More income from options premiums</li>
          <li>Less capital at risk</li>
          <li>Save time</li>
        </ul>
        <p style={{ textAlign: "center" }}>No credit card required!</p>
      </DialogContent>
      <DialogActions sx={{ paddingX: 2, paddingY: 2, background: "white" }}>
        <Button
          onClick={() =>
            loginWithRedirect({
              authorizationParams: { screen_hint: "signup" },
            })
          }
          sx={{
            textTransform: "none",
            textAlign: "center",
            margin: "auto",
            height: 50,
            width: 200,
            background: theme.palette.text.third,
            color: "white",
            borderRadius: "5px",
            fontSize: 20,
            marginBottom: 2,
            "&:hover": {
              background: theme.palette.text.third,
              border: `${theme.palette.text.third} solid 1px`,
            },
          }}
        >
          Sign up
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConversionFreeAccount;
