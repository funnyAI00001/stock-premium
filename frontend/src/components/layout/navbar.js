import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import WarningIcon from "@mui/icons-material/Warning";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import SchoolIcon from "@mui/icons-material/School";
import ForumIcon from "@mui/icons-material/Forum";
import CameraIcon from "@mui/icons-material/Camera";
import PaidIcon from "@mui/icons-material/Paid";
import "@fontsource/roboto";

import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { useMediaQuery } from "@mui/material";
import { Avatar } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

import { getInitials } from "../../utils/usefulFuncs";
import { getStripeStatus } from "../../actions/stripeAction";

import AccountPopover from "../account/accountPopover";

const drawerWidth = 240; // Width of sidebar

const DrawerAppBar = (props) => {
  const { user, isAuthenticated } = useAuth0();
  const { wind } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isMd = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const isLg = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const dispatch = useDispatch();
  const subscriptionStatus = useSelector(
    (state) => state.stripe.subscriptionStatus
  );
  const checkoutSessionId = useSelector(
    (state) => state.stripe.checkoutSessionId
  );
  const location = useLocation();

  // Set different image sizes based on screen size
  const imageStyle = {
    width: isLg ? "4vw" : isMd ? "6vw" : "15vw",
    marginRight: "1vw",
  };

  const popoverOpen = Boolean(anchorEl);
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const [isOffline, setIsOffline] = useState(!navigator.onLine); // To display whether client is offline or not
  const routes = useMemo(
    () => ["shortlist", "earn", "options_screener", "education", "community"],
    []
  );

  useEffect(() => {
    const pathname = location.pathname;
    const routeIndex = routes.indexOf(pathname.substring(1));
    setSelectedIndex(routeIndex);
  }, [location, routes]);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    document.addEventListener("offline", handleOffline);
    document.addEventListener("online", handleOnline);

    return () => {
      document.removeEventListener("offline", handleOffline);
      document.removeEventListener("online", handleOnline);
    };
  }, []);
  //

  useEffect(() => {
    if (user !== undefined) {
      dispatch(getStripeStatus(user));
    }
  }, [user, dispatch]);

  const drawer = (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent={isMd || isLg ? "space-evenly" : "center"}
        sx={{ height: 60 }}
      >
        <div>
          <Link to="/shortlist">
            <Box display="flex" alignItems="center">
              <img src="/logo.png" alt="logo" style={imageStyle} />
            </Box>
          </Link>
        </div>
        <div>
          <Typography
            variant="h6"
            component="div"
            color="text.third"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            <a href="/shortlist" style={{ textDecoration: "none" }}>
              <b style={{ color: "#BFA76F", fontFamily: "Roboto, sans-serif" }}>
                COVERD
              </b>
            </a>
          </Typography>
        </div>
      </Box>
      <Divider />
      {/* <List
        sx={{
          display: {
            sm: "none",
          },
        }}
      >
        <ListItem
          disablePadding
          sx={{ border: "solid 1px white", paddingX: 1, borderRadius: 1 }}
        >
          <InfoIcon />
          <ListItemButton sx={{ textAlign: "center" }}>
            <NavLink
              to="https://coverd.io"
              style={{ textDecoration: "none", color: "inherit" }}
              target="_blank"
            >
              <ListItemText primary="What is COVERD?" />
            </NavLink>
          </ListItemButton>
        </ListItem>
      </List> */}
      <List>
        {[
          "Shortlist",
          "Earn",
          "Options Screener",
          "Education",
          "Community",
        ].map((text, index) => (
          <ListItem
            key={text}
            disablePadding
            onClick={() => {
              setSelectedIndex(index);
            }}
          >
            <ListItemButton selected={selectedIndex === index}>
              <ListItemIcon>
                {index === 0 ? (
                  <FormatListBulletedIcon />
                ) : index === 1 ? (
                  <PaidIcon />
                ) : index === 2 ? (
                  <SchoolIcon />
                ) : index === 3 ? (
                  <CameraIcon />
                ) : (
                  <ForumIcon />
                )}
              </ListItemIcon>
              <NavLink to={routes[index]} style={{ textDecoration: "none" }}>
                <ListItemText primary={text} />
              </NavLink>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = wind !== undefined ? () => wind().document.body : undefined;

  return (
    <Box
      display={
        isAuthenticated &&
        checkoutSessionId !== null &&
        subscriptionStatus === "complete"
          ? "flex"
          : "none"
      }
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          color: "white",
          padding: 1,
          height: 60,
        }}
      >
        <Toolbar sx={{ justifyContent: "end" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h5"
            color="red"
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {isOffline && (
              <Box
                display="flex"
                alignItems="center"
                sx={{ backgroundColor: "#444", padding: 1 }}
              >
                <WarningIcon sx={{ marginRight: 1 }} />
                You are currently offline!
              </Box>
            )}
          </Typography>

          {/* <Button
            color="primary"
            variant="outlined"
            sx={{
              marginRight: 2,
              borderColor: "white",
              color: "white",
              borderRadius: 0.5,
              display: { xs: "none", sm: "inline-flex" },
            }}
          >
            <InfoIcon sx={{ marginRight: 0.5 }} />
            <Typography variant="h6" fontSize={17}>
              <NavLink
                to="https://coverd.io"
                style={{ textDecoration: "none", color: "inherit" }}
                target="_blank"
              >
                What is COVERD?
              </NavLink>
            </Typography>
          </Button> */}
          {/* </Box> */}
          <Avatar
            src={user && user.avatar}
            sx={{ width: 35, height: 35, cursor: "pointer" }}
            onClick={(event) => {
              setAnchorEl(event.currentTarget);
            }}
          >
            {user && getInitials(user.name)}
          </Avatar>
          <AccountPopover
            open={popoverOpen}
            onClose={() => {
              setAnchorEl(null);
            }}
            anchorEl={anchorEl}
            PaperProps={{ sx: { width: 200 } }}
            closePopover={() => {
              setAnchorEl(null);
            }}
          />
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
      </Box>
    </Box>
  );
};

DrawerAppBar.propTypes = {
  wind: PropTypes.func,
};

export default DrawerAppBar;
