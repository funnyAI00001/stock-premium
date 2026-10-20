import React from "react";
import {
  Popover,
  Box,
  Typography,
  Divider,
  MenuList,
  MenuItem,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { createPortalSession } from "../../actions/stripeAction";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AccountPopover = (props) => {
  const { open, onClose, anchorEl } = props;
  const { logout, user } = useAuth0();
  const dispatch = useDispatch();
  const subscriptionStatus = useSelector(
    (state) => state.stripe.subscriptionStatus
  );
  const navigate = useNavigate();

  const onLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Box p={1} textAlign="center">
        <Typography variant="h6" fontWeight={500}>
          {user ? user.name : ""}
        </Typography>
      </Box>
      <Divider />
      <MenuList sx={{ padding: 0 }}>
        {(subscriptionStatus === "trial" ||
          subscriptionStatus === "trial_expired") && (
          <MenuItem
            sx={{ justifyContent: "center" }}
            onClick={() => {
              navigate("/stripe");
              onClose();
            }}
          >
            Upgrade plan
          </MenuItem>
        )}
        {subscriptionStatus !== "trial" &&
          subscriptionStatus !== "trial_expired" &&
          subscriptionStatus !== null && (
            <MenuItem
              sx={{ justifyContent: "center" }}
              onClick={() => dispatch(createPortalSession({ user: user }))}
            >
              Billing Info
            </MenuItem>
          )}
        <MenuItem
          onClick={onLogout}
          sx={{ fontSize: 14, justifyContent: "center", padding: 1 }}
        >
          Log out
        </MenuItem>
      </MenuList>
    </Popover>
  );
};

export default AccountPopover;
