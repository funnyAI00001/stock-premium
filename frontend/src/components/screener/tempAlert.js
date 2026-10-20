import React from "react";

import { Box } from "@mui/material";

const TempAlert = () => {
  return (
    <Box
      sx={{
        backgroundColor: "text.third",
        padding: 1,
        marginBottom: 2,
        color: "black",
        textAlign: "center",
        fontWeight: 600,
      }}
    >
      Coming Soon: This feature is under development - if you find a bug please let us know!!
    </Box>
  );
};

export default TempAlert;
