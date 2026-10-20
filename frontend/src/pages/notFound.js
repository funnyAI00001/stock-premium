import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      textAlign="center"
      marginTop={15}
    >
      <Typography variant="h5">404 - Not Found</Typography>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Button
        variant="outlined"
        sx={{
          backgroundColor: "text.third",
          color: "white",
          marginTop: 10,
          "&:hover": {
            backgroundColor: "text.third",
            borderColor: "white",
          },
        }}
        onClick={() => navigate("/")}
      >
        Go to homepage
      </Button>
    </Box>
  );
};

export default NotFound;
