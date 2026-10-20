import React from "react";
import { Typography, Box, useMediaQuery } from "@mui/material";

const Community = () => {
  const isSmScreen = useMediaQuery("(min-width:600px)");

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
      <Box display="flex" justifyContent="space-around" alignItems='center'>
        <a href="https://t.me/coverdoptions" target="_blank">
          <img src="/img/Telegram.png" width={isSmScreen ? "" : "70%"} />
        </a>
        <a href="https://discord.gg/6HBaQ4dxz2" target="_blank">
          <img src="/img/Discord.png" width={isSmScreen ? "" : "80%"} />
        </a>
      </Box>
    </Box>
  );
};

export default Community;
