import React from "react";
import { Popover, Box, Typography } from "@mui/material";
import { Divider } from "@mui/material";
import { MenuList, MenuItem } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { createPortalSession } from "../../actions/stripeAction";

import { useDispatch } from "react-redux";

const AccountPopover = (props) => {
  const { open, onClose, anchorEl } = props;
  const { logout, user, loginWithRedirect } = useAuth0();
  const dispatch = useDispatch();

  const onLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
    loginWithRedirect();
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
        <MenuItem
          sx={{ justifyContent: "center" }}
          onClick={() => dispatch(createPortalSession({ user: user }))}
        >
          Billing Info
        </MenuItem>
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
