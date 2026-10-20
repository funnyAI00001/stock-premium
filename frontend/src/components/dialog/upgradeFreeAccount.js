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
import { useDispatch } from "react-redux";

import { createCheckoutSession } from "../../actions/stripeAction";

const UpgradeFreeAccount = ({ open, onClose }) => {
  const { user } = useAuth0();
  const theme = useTheme();
  const dispatch = useDispatch();

  return (
    <Dialog open={open} onClose={onClose} maxWidth={"xs"}>
      <DialogContent
        sx={{
          alignItems: "center",
          color: "black",
          background: "white",
          fontSize: 20,
        }}
      >
        <Typography
          variant="h2"
          textAlign="center"
          color={theme.palette.text.third}
          mt={2}
        >
          Let's upgrade your account!
        </Typography>
        <p style={{ textAlign: "center" }}>
          Upgrade to a paid premium account to stay on top of your options
          selling game.
        </p>
        <ul>
          <li>
            All the features you love - <strong>unlimited</strong>
          </li>
          <br />
          <li>Make the most of your portfolio</li>
          <br />
          <li>Navigate the opaque options market with ease</li>
        </ul>
        <p>Secured by our double-or-nothing profit promise!</p>
      </DialogContent>
      <DialogActions sx={{ paddingX: 2, paddingY: 2, background: "white" }}>
        <Button
          onClick={() => {
            dispatch(createCheckoutSession({ user }));
          }}
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
          Upgrade Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpgradeFreeAccount;
