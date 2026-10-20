import React, { useEffect, useState } from "react";
import { Typography, useMediaQuery, Button, Box } from "@mui/material";
import { useTheme } from "@emotion/react";

import BasicFilters from "../components/screener/basicFilters";
import OptionsFilters from "../components/screener/optionsFilters";
import BasicFilterResult from "../components/screener/basicFilterResult";
import OptionsResult from "../components/screener/optionsResult";
import LoadingOverlay from "../components/dialog/loadingOverlay";

import { useSelector, useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import { increasePageClickCount } from "../actions/adminAction";
import { getMarketStatus } from "../actions/stockAction";

import AddCategory from "../components/category/addCategory";

const OptionsScreener = () => {
  const isSmScreen = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const optionFilterResult = useSelector((state) => state.stock.optionFilterResult);
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.stripe.userType);
  const { isLoading } = useAuth0();
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  useEffect(() => {
    // increase page click count

    dispatch(
      increasePageClickCount({
        page: "Screener",
        userType: userType === null ? "Unknown" : userType,
      })
    );
    dispatch(getMarketStatus());
  }, [dispatch, userType]);

  const handleSaveShortlist = () => {
    setOpenCategoryDialog(true);
  };

  if (isLoading) {
    return <LoadingOverlay text="Loading..." color="success" />;
  }

  return (
    <div
      style={
        isSmScreen ? { padding: 50, paddingLeft: 150, paddingRight: 150, fontSize: 16 } : { padding: 2, marginTop: 10 }
      }
    >
      <Typography variant="h3" color="white">
        Find Stocks with Juicy Options Premiums
      </Typography>
      <BasicFilters />
      <BasicFilterResult />
      <OptionsFilters />
      <OptionsResult />
      {optionFilterResult.symbols.length > 0 && (
        <Box textAlign="center" marginY={3}>
          <Button
            sx={{
              color: "white",
              background: theme.palette.text.third,
              border: `${theme.palette.text.third} solid 1px`,
              minWidth: 100,
            }}
            onClick={() => {
              handleSaveShortlist();
            }}
          >
            Save to Shortlist
          </Button>
        </Box>
      )}

      <AddCategory
        open={openCategoryDialog}
        onClose={() => setOpenCategoryDialog(false)}
        symbols={optionFilterResult.symbols}
      />
    </div>
  );
};

export default OptionsScreener;
