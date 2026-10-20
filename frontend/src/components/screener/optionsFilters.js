import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  useMediaQuery,
  Button,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  FormGroup,
  FormControlLabel,
  Box,
  Autocomplete,
  TextField,
  Stack,
  Checkbox,
} from "@mui/material";
import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import { useAuth0 } from "@auth0/auth0-react";

import {
  getOptions,
  getWeeklyExpiryDates,
  set_Side,
} from "../../actions/stockAction";
import { formatDate } from "../../utils/usefulFuncs";

import LoadingOverlay from "../dialog/loadingOverlay";
import CustomAlert from "../customAlert";
import CustomAlert2 from "../customAlert2";
import ConversionFreeAccount from "../dialog/conversionFreeAccount";
import UpgradeFreeAccount from "../dialog/upgradeFreeAccount";

const OptionsFilters = () => {
  const isSmScreen = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const dispatch = useDispatch();
  const fieldsetStyle = {
    borderRadius: 5,
    borderColor: theme.palette.text.third,
    marginTop: isSmScreen ? 25 : 15,
    marginBottom: isSmScreen ? 25 : 15,
    padding: isSmScreen ? "25px 100px" : "25px 15px",
  };

  const marketStatus = useSelector((state) => state.stock.marketStatus);

  const premiums = [0.01, 0.05, 0.1, 0.25, 0.5, 1, 10, 20, 40];
  const ROIs = [1, 2, 3, 4, 5, 7.5, 10];
  const annualROIs = [5, 10, 15, 20, 25, 30, 40, 50, 100, 150, 200, 250, 300];
  const RORs = [1, 2, 3, 4, 5, 7.5, 10];
  const annualRORs = [5, 10, 15, 20, 25, 30, 40, 50, 100, 150, 200, 250, 300];
  const OIs = [10, 25, 50, 100, 250, 500, 1000]; // Open Interest
  const BA_Spreads = ["All", "Narrow", "Moderate", "Wide", "Very Wide"]; // Bid/Ask Spreads

  const [side, setSide] = useState("Calls");
  const [openWarningMarketClosed, setOpenWarningMarketClosed] = useState(false);
  const [expiryDate, setExpiryDate] = useState("5/17/2024");
  const [weeklyOption, setWeeklyOption] = useState(false);
  const [isGettingWeeklyExpiryDates, setIsGettingWeeklyExpiryDates] =
    useState(false);
  const [minPremium, setMinPremium] = useState(0.01);
  const [minTradeROI, setMinTradeROI] = useState(1);
  const [minAnnualROI, setMinAnnualROI] = useState(5);
  const [minTradeROR, setMinTradeROR] = useState(1);
  const [minAnnualROR, setMinAnnualROR] = useState(5);
  const [minOI, setMinOI] = useState(10);
  const [maxSpread, setMaxspread] = useState("All");
  const [totalExpirations, setTotalExpirations] = useState([]);
  const [availableExpirations, setAvailableExpirations] = useState([]); // Monthly Expiry Dates
  const [openAlert, setOpenAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [isFindingOptions, setIsFindingOptions] = useState(false);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [openConversionFreeAccountDialog, setOpenConversionFreeAccountDialog] =
    useState(false);
  const [openUpgradeFreeAccountDialog, setOpenUpgradeFreeAccountDialog] =
    useState(false);

  const fontSize = isSmScreen ? 18 : 14;

  const expirations = useSelector((state) => state.stock.expirations);
  const weekly_expiry_dates = useSelector(
    (state) => state.stock.weekly_expiry_dates
  );
  const symbolsForOptionsFilter = useSelector(
    (state) => state.stock.symbolsForOptionsFilter
  ); // Filtered symbols by stock filter
  const stocks = useSelector((state) => state.stock.stocks);
  const bFoundOption = useSelector((state) => state.stock.bFoundOption);

  const subscriptionStatus = useSelector(
    (state) => state.stripe.subscriptionStatus
  );
  const userType = useSelector((state) => state.stripe.userType);
  const { isAuthenticated, user } = useAuth0();
  const bFilterLocked =
    !isAuthenticated || subscriptionStatus === "trial_expired";

  const [previousSymbolsForOptionsFilter, setPreviousSymbolsForOptionsFilter] =
    useState([symbolsForOptionsFilter]);

  const buttonTextsForCalls = ["ATM", "5% OTM", "10% OTM"];
  const buttonTextsForPuts = ["5% ITM", "ATM", "5% OTM"];
  const [selectedButtonText, setSelectedButtonText] = useState("ATM");

  const formControlStyle = {
    m: 1,
    margin: 0,
    width: isSmScreen ? "31%" : "80%",
    "& .MuiSelect-select": { borderColor: "white" },
  };

  const buttonSelectionChange = (id) => {
    if (side === "Calls") {
      setSelectedButtonText(buttonTextsForCalls[id]);
    } else {
      setSelectedButtonText(buttonTextsForPuts[id]);
    }
  };

  // Weekly option select/disselect
  const handleWeeklyOption = (event) => {
    if (!isAuthenticated) {
      setOpenConversionFreeAccountDialog(true);
    } else if (isAuthenticated && subscriptionStatus === "trial_expired") {
      setOpenUpgradeFreeAccountDialog(true);
    } else if (isAuthenticated && subscriptionStatus !== "trial_expired") {
      if (selectedStocks.length === 0) {
        // setOpenNoSymbolSelected(true);
        setAlertText("Please select at least one symbol!");
        setOpenAlert(true);
        return;
      }

      setWeeklyOption(event.target.checked);

      if (event.target.checked) {
        setIsGettingWeeklyExpiryDates(true);

        dispatch(
          getWeeklyExpiryDates(
            { symbols: symbolsForOptionsFilter },
            handleEndGettingWeeklyOption
          )
        );
      }
    }
  };

  const handleEndGettingWeeklyOption = () => {
    setIsGettingWeeklyExpiryDates(false);
  };

  const onFindOptions = () => {
    if (selectedStocks.map((item) => item.symbol).length === 0) {
      setAlertText("Please select at least one symbol!");
      setOpenAlert(true);
      return;
    }

    const data = {
      expiryDate: formatDate(expiryDate),
      minPremium,
      minTradeROI,
      minAnnualROI,
      minTradeROR,
      minAnnualROR,
      minOI,
      maxSpread,
      symbolsForOptionsFilter: selectedStocks.map((item) => item.symbol),
      side: side === "Calls" ? "call" : "put",
      strikeType: selectedButtonText,
      userType: userType ? userType : "Unknown",
      email: isAuthenticated ? user.email : "Unknown",
    };

    setIsFindingOptions(true);
    dispatch(getOptions(data, afterFindOptions));
  };

  const afterFindOptions = () => {
    setIsFindingOptions(false);
    // setOpenWarningMarketClosed(true);
  };

  const showConversionFreeAccountDialog = () => {
    if (!isAuthenticated) {
      setOpenConversionFreeAccountDialog(true);
    } else if (isAuthenticated && subscriptionStatus === "trial_expired") {
      setOpenUpgradeFreeAccountDialog(true);
    }
  };

  useEffect(() => {
    let total = [...availableExpirations].map((item) => item.date);

    if (weeklyOption) {
      total = [
        ...total,
        ...weekly_expiry_dates.filter(
          (item) => !availableExpirations.some((one) => one.date === item)
        ),
      ];
    }

    const sortedDates = total
      .map((dateStr) => new Date(dateStr))
      .sort((a, b) => a - b)
      .map((date) => date.toLocaleDateString("en-US"));

    setTotalExpirations(sortedDates);
  }, [weeklyOption, availableExpirations, weekly_expiry_dates]);

  useEffect(() => {
    if (expirations.length > 0) {
      const now = moment();
      let dates = [];
      let minDifference = 1000;
      let minDate = null;

      for (let item of expirations) {
        const date = moment(item.date, "M/D/YYYY");
        const difference = date.diff(now, "days");

        if (difference > 8) {
          dates.push(item);
        }

        if (difference < minDifference && difference > 8) {
          minDifference = difference;
          minDate = item;
        }
      }

      setExpiryDate(minDate.date);
      setAvailableExpirations(dates);
    }
  }, [expirations]);

  // Whenever checked symbols are changed in stock filter
  useEffect(() => {
    if (symbolsForOptionsFilter.length === 0) {
      return;
    }

    const customStocks = stocks.filter((item) =>
      symbolsForOptionsFilter.includes(item.symbol)
    );
    const combinedArray = [...customStocks, ...selectedStocks];

    const uniqueStocks = combinedArray.filter(
      (stock, index, self) =>
        index === self.findIndex((s) => s.symbol === stock.symbol)
    );

    const removedSymbol = previousSymbolsForOptionsFilter.filter(
      (item) => !symbolsForOptionsFilter.includes(item)
    );

    if (removedSymbol.length !== 0) {
      const updatedUniqueStocks = uniqueStocks.filter(
        (stock) => stock.symbol !== removedSymbol[0]
      );
      setSelectedStocks(updatedUniqueStocks);
    } else {
      setSelectedStocks(uniqueStocks);
    }

    setPreviousSymbolsForOptionsFilter(symbolsForOptionsFilter);
  }, [symbolsForOptionsFilter, stocks]);

  useEffect(() => {
    dispatch(set_Side({ side: side }));
    setSelectedButtonText("ATM");
  }, [side, dispatch]);

  useEffect(() => {
    if (marketStatus === "closed") {
      setOpenWarningMarketClosed(true);
    }
  }, [marketStatus]);

  return (
    <Box>
      <fieldset style={fieldsetStyle}>
        <legend>Options Filters</legend>
        <Grid container spacing={0}>
          <Grid item xs={4} display="flex" alignItems="center" marginTop={3}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: fontSize }}
            >
              Ticker Symbol
            </Typography>
          </Grid>

          <Grid
            item
            xs={8}
            marginTop={3}
            justifyContent="flex-start"
            gap={isSmScreen ? 2 : 1}
            sx={{
              "& .MuiButton-root": {
                color: "white",
                border: `solid 1px ${theme.palette.text.third}`,
                minWidth: isSmScreen ? 100 : 10,
              },
              "& .selected": {
                backgroundColor: `${theme.palette.text.third} !important`,
              },
            }}
          >
            <Stack spacing={3}>
              <Autocomplete
                multiple
                id="selected symbols"
                options={stocks}
                getOptionLabel={(stock) => `${stock.symbol} - ${stock.name}`}
                filterSelectedOptions
                value={selectedStocks}
                onChange={(event, newValue) => {
                  setSelectedStocks(newValue);
                }}
                isOptionEqualToValue={(option, value) => {
                  return option.symbol === value.symbol;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select from Stock Finder above or enter directly"
                    placeholder="Symbols"
                  />
                )}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    paddingRight: "0px !important",
                  },
                }}
              />
            </Stack>
          </Grid>
        </Grid>
        <Grid container spacing={0}>
          <Grid item xs={4} display="flex" alignItems="center" marginTop={3}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: fontSize }}
            >
              Side
            </Typography>
          </Grid>

          <Grid
            item
            xs={4}
            marginTop={3}
            display="flex"
            justifyContent="flex-start"
            sx={{
              "& .MuiButton-root": {
                color: "white",
                border: `solid 1px ${theme.palette.text.third}`,
                minWidth: isSmScreen ? 100 : 10,
              },
              "& .selected": {
                backgroundColor: `${theme.palette.text.third} !important`,
              },
            }}
          >
            <Button
              sx={{ width: "94%", fontSize: fontSize }}
              className={side === "Calls" ? "selected" : ""}
              onClick={() => {
                setSide("Calls");
              }}
            >
              Calls
            </Button>
          </Grid>
          <Grid
            item
            xs={4}
            marginTop={3}
            display="flex"
            justifyContent="flex-end"
            sx={{
              "& .MuiButton-root": {
                color: "white",
                border: `solid 1px ${theme.palette.text.third}`,
                minWidth: isSmScreen ? 100 : 10,
              },
              "& .selected": {
                backgroundColor: `${theme.palette.text.third} !important`,
              },
            }}
          >
            <Button
              sx={{ width: "94%", fontSize: fontSize }}
              className={side === "Puts" ? "selected" : ""}
              onClick={() => {
                setSide("Puts");
              }}
            >
              Puts
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={0} alignItems="center" marginTop={3}>
          <Grid item xs={4}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: fontSize }}
            >
              Strike Price
            </Typography>
          </Grid>
          <Grid item xs={8} display="flex" justifyContent="flex-start">
            <Box
              sx={{
                "& .MuiButton-root": {
                  backgroundColor: "transparent",
                  color: "white",
                  border: `1px solid ${theme.palette.text.third}`,
                  paddingY: 1,
                  paddingX: isSmScreen ? 2 : 1,
                },
                "& .selected": {
                  backgroundColor: `${theme.palette.text.third} !important`,
                },
              }}
              gap={isSmScreen ? 2 : 0.4}
              display="flex"
              justifyContent="center"
            >
              {(side === "Calls"
                ? buttonTextsForCalls
                : buttonTextsForPuts
              ).map((text, index) => (
                <Button
                  key={index}
                  className={selectedButtonText === text ? "selected" : ""}
                  onClick={() => buttonSelectionChange(index)}
                >
                  {text}
                </Button>
              ))}
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={0} alignItems="center" marginTop={3}>
          <Grid item xs={4}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: fontSize }}
            >
              Expiry Date
            </Typography>
          </Grid>
          <Grid item xs={8} display="flex" justifyContent="flex-start">
            <Stack
              direction={isSmScreen ? "row" : "column"}
              spacing={{ xs: 1, sm: 5 }}
            >
              <FormControl
                sx={{
                  m: 1,
                  margin: 0,
                  width: "100%",
                  "& .MuiSelect-select": { borderColor: "white" },
                }}
              >
                <InputLabel id="expiration">Expiry Date</InputLabel>
                <Select
                  labelId="expiration"
                  id="expiration_date"
                  value={expiryDate}
                  label="Expiry Date"
                  disabled={bFilterLocked}
                  onChange={(event) => setExpiryDate(event.target.value)}
                  onClick={() => showConversionFreeAccountDialog()}
                >
                  {totalExpirations.map((item, index) => {
                    if (
                      availableExpirations.some(
                        (expItem) => expItem.date === item
                      )
                    ) {
                      return (
                        <MenuItem value={item} key={index}>
                          {item + " (M)"}
                        </MenuItem>
                      );
                    } else {
                      return (
                        <MenuItem value={item} key={index}>
                          {item}
                        </MenuItem>
                      );
                    }
                  })}
                </Select>
              </FormControl>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={weeklyOption}
                      onChange={(e) => {
                        handleWeeklyOption(e);
                      }}
                      // onClick={() => showConversionFreeAccountDialog()}
                      // disabled={bFilterLocked}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label="Weekly Dates"
                />
              </FormGroup>
            </Stack>
          </Grid>
        </Grid>
        <Grid container spacing={0} alignItems="center">
          <Grid item xs={4} marginTop={3}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: fontSize }}
            >
              Premium $
            </Typography>
          </Grid>
          <Grid
            item
            xs={8}
            marginTop={3}
            display="flex"
            justifyContent="space-between"
            sx={{
              "& .MuiButton-root": {
                color: "white",
                border: `solid 1px ${theme.palette.text.third}`,
                minWidth: isSmScreen ? 100 : 10,
              },
            }}
          >
            <FormControl sx={formControlStyle}>
              <InputLabel id="minPremium">Min. Premium $</InputLabel>
              <Select
                labelId="minPremium"
                id="minPremium"
                value={minPremium}
                label="Min. Premium $"
                disabled={bFilterLocked}
                onClick={() => showConversionFreeAccountDialog()}
                onChange={(event) => {
                  setMinPremium(event.target.value);
                }}
              >
                {premiums.map((item, index) => (
                  <MenuItem value={item} key={index}>
                    ${item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={0} alignItems="center">
          <Grid item xs={4} marginTop={3}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: fontSize }}
            >
              {side === "Calls" ? "Trade ROI%" : "Trade ROR%"}
            </Typography>
          </Grid>
          <Grid
            item
            xs={8}
            marginTop={3}
            display="flex"
            justifyContent="space-between"
            sx={{
              "& .MuiButton-root": {
                color: "white",
                border: `solid 1px ${theme.palette.text.third}`,
                minWidth: isSmScreen ? 100 : 10,
              },
            }}
          >
            {side === "Calls" ? (
              <FormControl sx={formControlStyle}>
                <InputLabel id="minROI">Min. ROI%</InputLabel>
                <Select
                  labelId="minROI"
                  id="minROI"
                  label="Min. ROI%"
                  value={minTradeROI}
                  disabled={bFilterLocked}
                  onChange={(event) => {
                    setMinTradeROI(event.target.value);
                  }}
                  onClick={() => showConversionFreeAccountDialog()}
                >
                  {ROIs.map((item, index) => (
                    <MenuItem value={item} key={index}>
                      {item}%
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <FormControl sx={formControlStyle}>
                <InputLabel id="minROR">Min. ROR%</InputLabel>
                <Select
                  labelId="minROR"
                  id="minROR"
                  label="Min. ROR%"
                  value={minTradeROR}
                  disabled={bFilterLocked}
                  onChange={(event) => {
                    setMinTradeROR(event.target.value);
                  }}
                  onClick={() => showConversionFreeAccountDialog()}
                >
                  {RORs.map((item, index) => (
                    <MenuItem value={item} key={index}>
                      {item}%
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={0} alignItems="center">
          <Grid item xs={4} marginTop={3}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: fontSize }}
            >
              {side === "Calls" ? "Annualized ROI%" : "Annualized ROR%"}
            </Typography>
          </Grid>
          <Grid
            item
            xs={8}
            marginTop={3}
            display="flex"
            justifyContent="space-between"
            sx={{
              "& .MuiButton-root": {
                color: "white",
                border: `solid 1px ${theme.palette.text.third}`,
                minWidth: isSmScreen ? 100 : 10,
              },
            }}
          >
            {side === "Calls" ? (
              <FormControl sx={formControlStyle}>
                <InputLabel id="minAnnualROI">Min. Ann. ROI%</InputLabel>
                <Select
                  labelId="minAnnualROI"
                  id="minAnnualROI"
                  label="Min. Ann. ROI%"
                  value={minAnnualROI}
                  disabled={bFilterLocked}
                  onChange={(event) => {
                    setMinAnnualROI(event.target.value);
                  }}
                  onClick={() => showConversionFreeAccountDialog()}
                >
                  {annualROIs.map((item, index) => (
                    <MenuItem value={item} key={index}>
                      {item}%
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <FormControl sx={formControlStyle}>
                <InputLabel id="minAnnualROR">Min. Ann. ROR%</InputLabel>
                <Select
                  labelId="minAnnualROR"
                  id="minAnnualROR"
                  label="Min. Ann. ROR%"
                  value={minAnnualROR}
                  disabled={bFilterLocked}
                  onChange={(event) => {
                    setMinAnnualROR(event.target.value);
                  }}
                  onClick={() => showConversionFreeAccountDialog()}
                >
                  {annualRORs.map((item, index) => (
                    <MenuItem value={item} key={index}>
                      {item}%
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={0} alignItems="center">
          <Grid item xs={4} marginTop={3}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: fontSize }}
            >
              Open Interest
            </Typography>
          </Grid>
          <Grid
            item
            xs={8}
            marginTop={3}
            display="flex"
            justifyContent="space-between"
            sx={{
              "& .MuiButton-root": {
                color: "white",
                border: `solid 1px ${theme.palette.text.third}`,
                minWidth: isSmScreen ? 100 : 10,
              },
            }}
          >
            <FormControl sx={formControlStyle}>
              <InputLabel id="minOI">Min. OI</InputLabel>
              <Select
                labelId="minOI"
                id="minOI"
                label="Min. OI"
                value={minOI}
                disabled={bFilterLocked}
                onChange={(event) => {
                  setMinOI(event.target.value);
                }}
                onClick={() => showConversionFreeAccountDialog()}
              >
                {OIs.map((item, index) => (
                  <MenuItem value={item} key={index}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={0} alignItems="center">
          <Grid item xs={4} marginTop={3}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: fontSize }}
            >
              Bid/Ask Spread
            </Typography>
          </Grid>
          <Grid
            item
            xs={8}
            marginTop={3}
            display="flex"
            justifyContent="space-between"
            sx={{
              "& .MuiButton-root": {
                color: "white",
                border: `solid 1px ${theme.palette.text.third}`,
                minWidth: isSmScreen ? 100 : 10,
              },
            }}
          >
            <FormControl sx={formControlStyle}>
              <InputLabel id="maxSpread">Max Spread %</InputLabel>
              <Select
                labelId="maxSpread"
                id="maxSpread"
                label="Max Spread %"
                value={maxSpread}
                disabled={bFilterLocked}
                onChange={(event) => {
                  setMaxspread(event.target.value);
                }}
                onClick={() => showConversionFreeAccountDialog()}
              >
                {BA_Spreads.map((item, index) => (
                  <MenuItem value={item} key={index}>
                    {item}
                    {" Spreads"}
                  </MenuItem>
                ))}{" "}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {isGettingWeeklyExpiryDates && (
          <LoadingOverlay text="Getting Weekly Expiries..." color="success" />
        )}

        {isFindingOptions && (
          <LoadingOverlay text="Finding Options..." color="success" />
        )}

        {/* Warning when no symbols selected */}
        <CustomAlert
          openState={openAlert}
          onClose={() => setOpenAlert(false)}
          severity="warning"
          text={alertText}
        />
      </fieldset>
      <Box textAlign="center" marginTop={3} marginBottom={8}>
        <Button
          sx={{
            color: "white",
            background: theme.palette.text.third,
            border: `${theme.palette.text.third} solid 1px`,
            minWidth: 100,
          }}
          disabled={
            subscriptionStatus === "trial_expired" ||
            subscriptionStatus === null
          }
          onClick={() => onFindOptions()}
        >
          Find Options
        </Button>
      </Box>

      <Box display="flex" justifyContent="center">
        <CustomAlert2
          openState={openWarningMarketClosed && bFoundOption}
          severity="warning"
          text="Options premium data may have errors outside of trading hours of major US exchanges. If you see $0 premium value, 
        try again once markets open. We are working with our data provider to resolve this issue."
          autoHideDuration={null}
          onClose={() => {
            setOpenWarningMarketClosed(false);
          }}
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
      </Box>
    </Box>
  );
};

export default OptionsFilters;
