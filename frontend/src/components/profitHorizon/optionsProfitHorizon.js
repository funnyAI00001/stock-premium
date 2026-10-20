import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import {
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";

import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";

import CustomAlert from "../customAlert";
import CalculationLimitDialog from "../dialog/calculationLimitDialog";
import ConversionFreeAccount from "../dialog/conversionFreeAccount";
import UpgradeFreeAccount from "../dialog/upgradeFreeAccount";
import LoadingOverlay from "../dialog/loadingOverlay";
import CoveredCallPremiumsAndReturnsOverTime from "./coveredCallPremiumsAndReturnsOverTime";

import { getProfitHorizon } from "../../actions/profitHorizonAction";

const OptionsProfitHorizon = forwardRef((props, ref) => {
  const theme = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();
  const childRef = useRef(null);
  const [openWarningForCalculationLimit, setOpenWarningForCalculationLimit] = useState(false);
  const [openConversionFreeAccountDialog, setOpenConversionFreeAccountDialog] = useState(false);

  const [openUpgradeFreeAccountDialog, setOpenUpgradeFreeAccountDialog] = useState(false);
  const { isAuthenticated } = useAuth0();
  const subscriptionStatus = useSelector((state) => state.stripe.subscriptionStatus);

  const urlParams = new URLSearchParams(location.search);
  const symbolParam = urlParams.get("symbol");
  let initialSymbol = "";

  if (symbolParam === null) {
    initialSymbol = "";
  } else {
    initialSymbol = symbolParam;
  }

  const availablePercentages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 25, 30, 40, 50];
  const [weeklyOption, setWeeklyOption] = useState(false);
  const availableDaysInFuture = [30, 90, 180];

  const [symbol, setSymbol] = useState(initialSymbol);
  const [openWarningForNoSupportSymbol, setOpenWarningForNoSupportSymbol] = useState(false);
  const [otm1Percentage, setOtm1Percentage] = useState(5);
  const [otm2Percentage, setOtm2Percentage] = useState(10);
  const [daysInFuture, setDaysInFuture] = useState(90);

  const [openStateForCustomalert, setOpenStateForCustomalert] = useState(false);
  const autoHideDuration = 6000;
  const [alertText, setAlertText] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const gotFirstResult = useSelector((state) => state.profitHorizon.gotFirstResult);

  const handleOTMPercentageClick = () => {
    if (!isAuthenticated) {
      setOpenConversionFreeAccountDialog(true);
    } else if (isAuthenticated && subscriptionStatus === "trial_expired") {
      setOpenUpgradeFreeAccountDialog(true);
    }
  };

  const handleDaysInFutureClick = () => {
    if (!isAuthenticated) {
      setOpenConversionFreeAccountDialog(true);
    } else if (isAuthenticated && subscriptionStatus === "trial_expired") {
      setOpenUpgradeFreeAccountDialog(true);
    }
  };

  const handleWeeklyOption = (event) => {
    if (!isAuthenticated) {
      setOpenConversionFreeAccountDialog(true);
    } else if (isAuthenticated && subscriptionStatus === "trial_expired") {
      setOpenUpgradeFreeAccountDialog(true);
    } else if (isAuthenticated && subscriptionStatus !== "trial_expired") {
      setWeeklyOption(event.target.checked);
      setOpenWarningForNoSupportSymbol(false);
    }
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

  const handleSymbolChange = (e) => {
    const input = e.target.value.toUpperCase(); // Convert input text to uppercase
    const onlyUppercase = input.replace(/[^A-Z]/g, ""); // Remove any characters that are not uppercase letters
    setSymbol(onlyUppercase);
  };

  useEffect(() => {
    if (isAuthenticated && subscriptionStatus === "trial_expired") {
      setOpenUpgradeFreeAccountDialog(true);

      return;
    }
  }, [isAuthenticated, subscriptionStatus]);

  useImperativeHandle(ref, () => ({
    handlePDFExport() {
      if (childRef.current) {
        childRef.current.handlePDFExport(); // Call child's function
      }
    },
  }));

  useEffect(() => {
    if (symbolParam) {
      handleCalculate();
    }
  }, [symbolParam]);

  return (
    <Box>
      <fieldset
        style={{
          width: "60%",
          margin: "auto",
          borderColor: theme.palette.text.third,
          borderRadius: 5,
          marginTop: "3vh",
        }}
      >
        <legend>Options Profit Horizon</legend>

        <Box
          textAlign="center"
          sx={{
            width: "80vw",
            "@media (min-width: 600px)": {
              width: "auto",
            },
          }}
        >
          <Typography variant="body1" color="white" mt={1.5}>
            Enter stock ticker symbol
          </Typography>
          <Grid container display="flex" alignItems="center">
            <Grid item xs={2} sm={3} textAlign="right"></Grid>
            <Grid item xs={8} sm={6} sx={{ "& .MuiInputBase-input": { color: "black" } }}>
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
                style={{ color: "black !important" }}
              />
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography>Time Horizon for Expiries</Typography>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="otm1">Days in Future</InputLabel>
              <Select
                labelId="daysInFuture"
                id="daysInFuture"
                label="Days in Future"
                value={daysInFuture}
                onChange={(event) => {
                  setDaysInFuture(event.target.value);
                }}
                onClick={() => {
                  handleDaysInFutureClick();
                }}
                disabled={!isAuthenticated || subscriptionStatus === "trial_expired"}
              >
                {availableDaysInFuture.map((item, index) => (
                  <MenuItem value={item} key={index}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={weeklyOption}
                    disabled={daysInFuture === 180}
                    onChange={(e) => {
                      handleWeeklyOption(e);
                    }}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label="Include Weekly Dates"
                labelPlacement="start"
              />
            </FormGroup>
          </div>

          <Box>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="otm1">OTM 1(%)</InputLabel>
              <Select
                labelId="otm1"
                id="otm1"
                label="OTM 1(%)"
                value={otm1Percentage}
                onChange={(event) => {
                  setOtm1Percentage(event.target.value);
                }}
                onClick={() => {
                  handleOTMPercentageClick();
                }}
                disabled={!isAuthenticated || subscriptionStatus === "trial_expired"}
              >
                {availablePercentages.map((item, index) => (
                  <MenuItem value={item} key={index}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="otm2">OTM 2(%)</InputLabel>
              <Select
                labelId="otm2"
                id="otm2"
                label="OTM 2(%)"
                value={otm2Percentage}
                disabled={!isAuthenticated || subscriptionStatus === "trial_expired"}
                onClick={() => {
                  handleOTMPercentageClick();
                }}
                onChange={(event) => {
                  setOtm2Percentage(event.target.value);
                }}
              >
                {availablePercentages.map((item, index) => (
                  <MenuItem value={item} key={index}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box mx="25%" textAlign="center"></Box>
      </fieldset>
      <Box textAlign="center" marginTop={3} marginBottom={8}>
        <Button
          sx={{
            color: "white",
            background: theme.palette.text.third,
            border: `${theme.palette.text.third} solid 1px`,
            minWidth: 100,
          }}
          onClick={() => handleCalculate()}
        >
          Calculate
        </Button>
      </Box>

      {gotFirstResult && <CoveredCallPremiumsAndReturnsOverTime ref={childRef} />}

      <CalculationLimitDialog
        open={openWarningForCalculationLimit}
        onClose={() => setOpenWarningForCalculationLimit(false)}
      />

      <ConversionFreeAccount
        open={openConversionFreeAccountDialog}
        onClose={() => setOpenConversionFreeAccountDialog(false)}
      />

      <UpgradeFreeAccount
        open={openUpgradeFreeAccountDialog}
        onClose={() => {
          setOpenUpgradeFreeAccountDialog(false);
        }}
      />

      <CustomAlert
        openState={openStateForCustomalert}
        severity="warning"
        text={alertText}
        autoHideDuration={autoHideDuration}
        onClose={() => {
          setOpenStateForCustomalert(false);
        }}
      />
      <CustomAlert
        openState={openWarningForNoSupportSymbol && weeklyOption}
        severity="warning"
        text="Symbols that do not support the selected weekly expiry date are not displayed."
        autoHideDuration={10000}
        onClose={() => setOpenWarningForNoSupportSymbol(false)}
      />

      {isCalculating && <LoadingOverlay color="success" text="Calculating..." />}
    </Box>
  );
});

export default OptionsProfitHorizon;
