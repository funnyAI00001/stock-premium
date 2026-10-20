import React, { useState } from "react";
import { Typography, useMediaQuery, Button, Box } from "@mui/material";
import { useTheme } from "@emotion/react";

import BasicFilters from "../components/screener/basicFilters";
import OptionsFilters from "../components/screener/optionsFilters";
import BasicFilterResult from "../components/screener/basicFilterResult";
import OptionsResult from "../components/screener/optionsResult";
import TempAlert from "../components/screener/tempAlert";

const OptionsScreener = () => {
  const isSmScreen = useMediaQuery("(min-width:600px)");
  const theme = useTheme();

  const [gotBasicResult, setGotBasicResult] = useState(false);
  const [gotOptionsResult, setGotOptionsResult] = useState(false);

  const getOptionsResult = () => {};

  return (
    <div
      style={
        isSmScreen
          ? { padding: 50, paddingLeft: 150, paddingRight: 150, fontSize: 16 }
          : { padding: 2, marginTop: 10 }
      }
    >
      <TempAlert />
      <Typography variant="h3" color="white">
        Find Juicy Options
      </Typography>
      <BasicFilters />
      <BasicFilterResult />
      <OptionsFilters />
      <Box textAlign="center" marginY={3}>
        <Button
          sx={{
            color: "white",
            background: theme.palette.text.third,
            border: `${theme.palette.text.third} solid 1px`,
            minWidth: 100,
          }}
          onClick={getOptionsResult()}
        >
          Find
        </Button>
      </Box>
      <OptionsResult />
      <Box textAlign="center" marginY={3}>
        <Button
          sx={{
            color: "white",
            background: theme.palette.text.third,
            border: `${theme.palette.text.third} solid 1px`,
            minWidth: 100,
          }}
        >
          Save to Shortlist
        </Button>
      </Box>
    </div>
  );
};

export default OptionsScreener;
