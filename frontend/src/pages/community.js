import React, { useEffect } from "react";
import { Typography, Box, useMediaQuery } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import { increasePageClickCount } from "../actions/adminAction";

import LoadingOverlay from "../components/dialog/loadingOverlay";

const Community = () => {
  const isSmScreen = useMediaQuery("(min-width:600px)");
  const userType = useSelector((state) => state.stripe.userType);
  const dispatch = useDispatch();
  const { isLoading } = useAuth0();

  useEffect(() => {
    // increase page click count

    dispatch(
      increasePageClickCount({
        page: "Community",
        userType: userType === null ? "Unknown" : userType,
      })
    );
  }, [dispatch, userType]);

  if (isLoading) {
    return <LoadingOverlay text="Loading..." color="success" />;
  }

  return (
    <Box
      sx={{
        "& .MuiTypography-root": {
          color: "text.third",
        },
        padding: 2,
        marginTop: 5,
      }}
    >
      <Typography variant="h1" mt={2} textAlign="center">
        You are invited!
      </Typography>
      <Typography variant="h6" textAlign="center" marginBottom={2}>
        Join the Coverd community of investors and options traders
      </Typography>
      <Typography variant="h5" textAlign="center" marginBottom={10}>
        The place to ask questions, find answers, learn from experts, and share
        your experience.
      </Typography>
      <Box display="flex" justifyContent="space-around" alignItems="center">
        <a href="https://t.me/coverdoptions" target="_blank">
          <img
            src="/img/Telegram.png"
            width={isSmScreen ? "" : "70%"}
            loading="lazy"
            alt="Telegram Logo"
          />
        </a>
        <a href="https://discord.gg/6HBaQ4dxz2" target="_blank">
          <img
            src="/img/Discord.png"
            width={isSmScreen ? "" : "80%"}
            loading="lazy"
            alt="Discord Logo"
          />
        </a>
      </Box>
    </Box>
  );
};

export default Community;
