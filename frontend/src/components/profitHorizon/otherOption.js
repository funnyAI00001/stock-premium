import React, { useState } from "react";

import {
  Box,
  Typography,
  TextField,
  Button,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";

import CustomAlert from "../customAlert";
import LoadingOverlay from "../dialog/loadingOverlay";

import {
  getProfitHorizon,
  clearResult,
} from "../../actions/profitHorizonAction";

const OtherOption = ({ onPdfExport }) => {
  const [symbol, setSymbol] = useState("");
  const theme = useTheme();
  const isSmScreen = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const isMdScreen = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const isLgScreen = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const [openStateForCustomalert, setOpenStateForCustomalert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  const dispatch = useDispatch();

  const daysInFuture = useSelector((state) => state.profitHorizon.daysInFuture);
  const otm1Percentage = useSelector(
    (state) => state.profitHorizon.otm1Percentage
  );
  const otm2Percentage = useSelector(
    (state) => state.profitHorizon.otm2Percentage
  );
  const weeklyOption = useSelector((state) => state.profitHorizon.weeklyOption);

  const buttonStyle = {
    color: "white",
    background: theme.palette.text.third,
    border: `${theme.palette.text.third} solid 1px`,
    minWidth: 100,
  };

  const handleSymbolChange = (e) => {
    const input = e.target.value.toUpperCase(); // Convert input text to uppercase
    const onlyUppercase = input.replace(/[^A-Z]/g, ""); // Remove any characters that are not uppercase letters
    setSymbol(onlyUppercase);
  };

  const handleCalculate = () => {
    if (symbol === "") {
      setOpenStateForCustomalert(true);
      setAlertText("Please add the symbol!");

      return;
    }

    const data = {
      symbol,
      weeklyOption,
      daysInFuture,
      otm1Percentage,
      otm2Percentage,
    };

    setIsCalculating(true);

    dispatch(getProfitHorizon(data, afterCalculate));
  };

  const afterCalculate = () => {
    setIsCalculating(false);
  };

  const onClearResult = () => {
    dispatch(clearResult());
  };

  const handlePDFExport = () => {
    onPdfExport();
  };

  return (
    <Box
      textAlign="center"
      sx={{
        "@media (min-width: 600px)": {
          width: "auto", // Set to auto for screens wider than 600px
        },
      }}
    >
      <Typography variant="h5" color="white" mt={1.5}>
        Enter Another Ticker Symbol
      </Typography>
      <TextField
        value={symbol}
        autoComplete="off"
        onChange={(e) => handleSymbolChange(e)}
        variant="outlined"
        sx={{
          marginTop: 2,
          marginBottom: 2,
          background: "white",
          borderRadius: "10px",
        }}
        inputProps={{
          autoComplete: "new-email",
        }}
        InputProps={{
          style: { color: "black" }, // This will apply the text color to the input
        }}
      />
      <Typography
        variant="body1"
        paddingX={
          isLgScreen ? "20vw" : isMdScreen ? "10vw" : isSmScreen ? "4vw" : 1
        }
        marginY={3}
      >
        We'll keep all your settings the same so you can compare charts on one
        page.
      </Typography>

      <Button
        sx={buttonStyle}
        onClick={() => {
          handleCalculate();
        }}
      >
        Calculate
      </Button>
      <br />
      <Button
        sx={buttonStyle}
        style={{ marginTop: 50, minWidth: 200 }}
        onClick={handlePDFExport}
      >
        Export to PDF
      </Button>
      <br />
      <Button
        sx={{
          marginTop: 2,
          marginBottom: 7,
          border: `${theme.palette.text.third} solid 1px`,
          color: "white",
        }}
        onClick={onClearResult}
      >
        Clear Results
      </Button>

      <CustomAlert
        openState={openStateForCustomalert}
        severity="warning"
        text={alertText}
        autoHideDuration={6000}
        onClose={() => {
          setOpenStateForCustomalert(false);
        }}
      />

      {isCalculating && (
        <LoadingOverlay color="success" text="Calculating..." />
      )}
    </Box>
  );
};

export default OtherOption;
