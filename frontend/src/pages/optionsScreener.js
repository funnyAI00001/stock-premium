import React from "react";
import { Typography, useMediaQuery, Button, Box } from "@mui/material";
import { useTheme } from "@emotion/react";

import BasicFilters from "../components/screener/basicFilters";
import OptionsFilters from "../components/screener/optionsFilters";
import BasicFilterResult from "../components/screener/basicFilterResult";
import OptionsResult from "../components/screener/optionsResult";
import TempAlert from "../components/screener/tempAlert";
import OptionsSearchBar from "../components/screener/optionsSearchBar";
import SearchBarFilterResult from "../components/screener/searchBarFilterResult";

const OptionsScreener = () => {
  const isSmScreen = useMediaQuery("(min-width:600px)");
  const theme = useTheme();

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
      <OptionsSearchBar />
      <SearchBarFilterResult />
    </div>
  );
};

export default OptionsScreener;
