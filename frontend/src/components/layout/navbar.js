import * as React from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Typography,
  useMediaQuery,
  Button,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import WarningIcon from "@mui/icons-material/Warning";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import SchoolIcon from "@mui/icons-material/School";
import ForumIcon from "@mui/icons-material/Forum";
import CameraIcon from "@mui/icons-material/Camera";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import HandshakeIcon from "@mui/icons-material/Handshake";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import "@fontsource/roboto";

import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";

import { getInitials } from "../../utils/usefulFuncs";
import {
  getStripeStatus,
  getCheckoutSessionId,
} from "../../actions/stripeAction";
import { getExpirations } from "../../actions/stockAction";
import { getAnalyticsData } from "../../actions/adminAction";
import { trackVisitor } from "../../actions/authActions";

import AccountPopover from "../account/accountPopover";

const drawerWidth = 260; // Width of sidebar

const DrawerAppBar = (props) => {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const { wind } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isMd = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const isLg = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const isSm = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const dispatch = useDispatch();
  const subscriptionStatus = useSelector(
    (state) => state.stripe.subscriptionStatus
  );
  const userType = useSelector((state) => state.stripe.userType);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

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
  const isAdmin = userType === "Admin";
  const routes =
    isAuthenticated && isAdmin
      ? [
          "shortlist",
          "earn",
          "profitHorizon",
          "options_screener",
          "cashSecuredPuts",
          "education",
          "community",
          "admin",
          "contactus",
        ]
      : isAuthenticated
      ? [
          "shortlist",
          "earn",
          "profitHorizon",
          "options_screener",
          "cashSecuredPuts",
          "education",
          "community",
          "contactus",
        ]
      : [
          "earn",
          "profitHorizon",
          "options_screener",
          "cashSecuredPuts",
          "education",
          "community",
          "contactus",
        ];

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

  useEffect(() => {
    if (user !== undefined) {
      dispatch(getStripeStatus(user));
      dispatch(getCheckoutSessionId({ user: user }));
    }

    dispatch(getExpirations());
  }, [user, dispatch]);

  useEffect(() => {
    if (userType === "Admin") {
      dispatch(getAnalyticsData({ timeFrame: "7 days" }));
    }
  }, [userType, dispatch]);

  // Set cookie, and send it to the backend to count the number of unknown visitors
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // If the current user is unknown one
      const visitorId = getCookie("visitor_id");

      if (!visitorId) {
        const newVisitorId =
          "visitor_" + Math.random().toString(36).substr(2, 9);
        setCookie("visitor_id", newVisitorId, 365);

        dispatch(trackVisitor({ visitorId: newVisitorId }));
      }
    }
  }, [isAuthenticated, isLoading]);

  const getCookie = (name) => {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  };

  const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  };

  const handleShortList = () => {
    navigate("/shortlist");
  };

  const handleCoverdCall = () => {
    navigate("/earn");
  };

  const handleProfitHorizon = () => {
    navigate("/profitHorizon");
  };

  const handleOptionsScreener = () => {
    navigate("/options_screener");
  };

  const handleCashSecuredPuts = () => {
    navigate("/cashSecuredPuts");
  };

  const drawer = (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent={isMd || isLg ? "space-evenly" : "center"}
        sx={{ height: 60 }}
      >
        <div>
          <Link to={isAuthenticated ? "/shortlist" : "/earn"}>
            <Box display="flex" alignItems="center">
              <img
                src="/logo.png"
                alt="logo"
                style={imageStyle}
                loading="lazy"
              />
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
                {/* COVERD */}
              </b>
            </a>
          </Typography>
        </div>
      </Box>
      <Divider />

      <List>
        {(isAuthenticated && isAdmin
          ? [
              "Shortlist",
              "Coverd Calls",
              "Profit Horizon",
              "Options Screener",
              "Cash Secured Puts",
              "Education",
              "Community",
              "Admin Dashboard",
            ]
          : isAuthenticated
          ? [
              "Shortlist",
              "Coverd Calls",
              "Profit Horizon",
              "Options Screener",
              "Cash Secured Puts",
              "Education",
              "Community",
            ]
          : [
              "Coverd Calls",
              "Profit Horizon",
              "Options Screener",
              "Cash Secured Puts",
              "Education",
              "Community",
            ]
        ).map((text, index) => (
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
                  isAuthenticated ? (
                    <FormatListBulletedIcon />
                  ) : (
                    <KeyboardDoubleArrowUpIcon />
                  )
                ) : index === 1 ? (
                  isAuthenticated ? (
                    <KeyboardDoubleArrowUpIcon />
                  ) : (
                    <AttachMoneyIcon />
                  )
                ) : index === 2 ? (
                  isAuthenticated ? (
                    <AttachMoneyIcon />
                  ) : (
                    <CameraIcon />
                  )
                ) : index === 3 ? (
                  isAuthenticated ? (
                    <CameraIcon />
                  ) : (
                    <KeyboardDoubleArrowDownIcon />
                  )
                ) : index === 4 ? (
                  isAuthenticated ? (
                    <KeyboardDoubleArrowDownIcon />
                  ) : (
                    <SchoolIcon />
                  )
                ) : index === 5 ? (
                  isAuthenticated ? (
                    <SchoolIcon />
                  ) : (
                    <ForumIcon />
                  )
                ) : index === 6 ? (
                  <ForumIcon />
                ) : (
                  <></>
                )}
                {isAdmin && index === 7 && <AdminPanelSettingsIcon />}
              </ListItemIcon>
              <NavLink
                to={routes[index]}
                style={{ textDecoration: "none", color: "white" }}
              >
                <ListItemText primary={text} />
              </NavLink>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List sx={{ marginTop: 5 }}>
        <ListItem
          disablePadding
          onClick={() => {
            setSelectedIndex(6);
          }}
        >
          <ListItemButton
            selected={selectedIndex === (isAdmin ? 8 : isAuthenticated ? 7 : 6)}
          >
            <ListItemIcon>
              <HandshakeIcon />
            </ListItemIcon>
            <NavLink
              to={isAdmin ? routes[8] : isAuthenticated ? routes[7] : routes[6]}
              style={{ textDecoration: "none", color: "white" }}
            >
              <ListItemText primary="Contact Us" />
            </NavLink>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container = wind !== undefined ? () => wind().document.body : undefined;

  const pathname = location.pathname.substring(1);

  return (
    <Box
      display={
        (isAuthenticated &&
          pathname === "shortlist" &&
          subscriptionStatus === null) ||
        (isAuthenticated && pathname.substring(0, 6) === "stripe")
          ? "none"
          : "flex"
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
        <Toolbar sx={{ justifyContent: isSm ? "end" : "space-between" }}>
          <Box sx={{ display: { sm: "none" } }}>
            <Link to={isAuthenticated ? "/shortlist" : "/earn"}>
              <Box display="flex" alignItems="center">
                <img
                  src="/logo.png"
                  alt="logo"
                  style={imageStyle}
                  loading="lazy"
                />
              </Box>
            </Link>
          </Box>
          <div style={{ display: "flex", justifyContent: "end" }}>
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

            {/* Log in, Log out buttons */}
            {!isAuthenticated && (
              <Box display="flex" gap={2} mr={1}>
                <Button
                  variant="outlined"
                  style={{
                    float: "right",
                    color: "white",
                    borderColor: theme.palette.text.third,
                  }}
                  onClick={() => {
                    loginWithRedirect();
                  }}
                >
                  Log In
                </Button>
                <Button
                  variant="outlined"
                  style={{
                    float: "right",
                    color: "white",
                    background: theme.palette.text.third,
                    border: theme.palette.text.third,
                  }}
                  onClick={() =>
                    loginWithRedirect({
                      authorizationParams: { screen_hint: "signup" },
                    })
                  }
                >
                  Sign Up
                </Button>
              </Box>
            )}

            {isAuthenticated && (
              <Avatar
                src={user && user.avatar}
                sx={{ width: 35, height: 35, cursor: "pointer" }}
                onClick={(event) => {
                  setAnchorEl(event.currentTarget);
                }}
              >
                {user && getInitials(user.name)}
              </Avatar>
            )}
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
          </div>
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

      <AppBar
        position="fixed"
        color="primary"
        sx={{
          top: "auto",
          bottom: 0,
          width: "auto",
          left: 0,
          height: 50,
          justifyContent: 'center',
          display: { sm: "none" },
        }}
      >
        <Toolbar sx={{ justifyContent: "space-around" }}>
          {isAuthenticated &&<IconButton color="inherit" aria-label="open drawer" onClick={handleShortList}>
            <FormatListBulletedIcon />
          </IconButton>}
          <IconButton color="inherit" onClick={handleCoverdCall}>
            <KeyboardDoubleArrowUpIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleProfitHorizon}>
            <AttachMoneyIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleOptionsScreener}>
            <CameraIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleCashSecuredPuts}>
            <KeyboardDoubleArrowDownIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

DrawerAppBar.propTypes = {
  wind: PropTypes.func,
};

export default DrawerAppBar;
