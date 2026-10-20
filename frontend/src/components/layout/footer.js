import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";

const Footer = ({ isAuthenticated }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [isMessagesPage, setIsMessagesPage] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMessagesPage(location.pathname.includes("messages"));
  }, [location]);

  return isMessagesPage ? null : (
    <Box
      py={5}
      pt={10}
      color="white"
      textAlign="center"
      display={isAuthenticated ? "block" : "none"}
      boxShadow={2}
    >
      <Grid container alignItems="center" color="text.secondary" fontSize={14}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          Copyright @ {currentYear} Call Option Calculator
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Footer);
