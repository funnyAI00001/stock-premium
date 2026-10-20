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
} from "@mui/material";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@emotion/react";

import { getOptions, getWeeklyExpiryDates } from "../../actions/stockAction";
import { formatDate } from "../../utils/usefulFuncs";

import LoadingOverlay from "../dialog/loadingOverlay";
import CustomAlert from "../customAlert";

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

  const strikePriceTypes = ["ATM", "5% OTM", "10% OTM"];
  const premiums = [0.01, 0.05, 0.1, 0.25, 0.5, 1, 10, 20, 40];
  const ROIs = [1, 2, 3, 4, 5, 7.5, 10];
  const annualROIs = [5, 10, 15, 20, 25, 30, 40, 50, 100, 150, 200, 250, 300];
  const OIs = [10, 25, 50, 100, 250, 500, 1000]; // Open Interest
  const BA_Spreads = ["All", "Narrow", "Moderate", "Wide", "Very Wide"]; // Bid/Ask Spreads

  const [selectedStrikePriceType, setSelectedStrikePriceType] = useState("ATM");
  const [expiryDate, setExpiryDate] = useState("5/17/2024");
  const [weeklyOption, setWeeklyOption] = useState(false);
  const [isGettingWeeklyExpiryDates, setIsGettingWeeklyExpiryDates] =
    useState(false);
  const [minPremium, setMinPremium] = useState(0.01);
  const [minTradeROI, setMinTradeROI] = useState(1);
  const [minAnnualROI, setMinAnnualROI] = useState(5);
  const [minOI, setMinOI] = useState(10);
  const [maxSpread, setMaxspread] = useState("All");
  const [totalExpirations, setTotalExpirations] = useState([]);
  const [availableExpirations, setAvailableExpirations] = useState([]); // Monthly Expiry Dates
  const expirations = useSelector((state) => state.stock.expirations);
  const [openNoSymbolSelected, setOpenNoSymbolSelected] = useState(false);
  const [isFindingOptions, setIsFindingOptions] = useState(false);
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);

  const weekly_expiry_dates = useSelector(
    (state) => state.stock.weekly_expiry_dates
  );
  const symbolsForOptionsFilter = useSelector(
    (state) => state.stock.symbolsForOptionsFilter
  ); // Filtered symbols by stock filter
  const stocks = useSelector((state) => state.stock.stocks);
  const stocksForOptionFilter = stocks.filter((item) =>
    symbolsForOptionsFilter.includes(item.symbol)
  );

  const [previousSymbolsForOptionsFilter, setPreviousSymbolsForOptionsFilter] =
    useState([symbolsForOptionsFilter]);

  const formControlStyle = {
    m: 1,
    margin: 0,
    width: isSmScreen ? "31%" : "80%",
    "& .MuiSelect-select": { borderColor: "white" },
  };

  // Weekly option select/disselect
  const handleWeeklyOption = (event) => {
    if (symbolsForOptionsFilter.length === 0) {
      setOpenNoSymbolSelected(true);
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
  };

  const handleEndGettingWeeklyOption = () => {
    setIsGettingWeeklyExpiryDates(false);
  };

  const onFindOptions = () => {
    if (selectedStocks.map((item) => item.symbol).length === 0) {
      setOpenNoSymbolSelected(true);
      return;
    }

    const data = {
      selectedStrikePriceType,
      expiryDate: formatDate(expiryDate),
      minPremium,
      minTradeROI,
      minAnnualROI,
      minOI,
      maxSpread,
      // symbolsForOptionsFilter,
      symbolsForOptionsFilter: selectedStocks.map((item) => item.symbol),
      // selectedIndustries
    };

    setIsFindingOptions(true);
    dispatch(getOptions(data, afterFindOptions));
  };

  const afterFindOptions = () => {
    setIsFindingOptions(false);
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
      let minDate = null

      for (let item of expirations) {
        const date = moment(item.date, "M/D/YYYY");
        const difference = date.diff(now, "days");

        if (difference > 8) {
          dates.push(item);
        }

        if (difference < minDifference && difference > 0) {
          minDifference = difference
          minDate = item
        }
      }

      // setExpiryDate(dates[0].date);
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

  return (
    <Box>
      <fieldset style={fieldsetStyle}>
        <legend>Options Filters</legend>
        <Grid container spacing={0}>
          <Grid item xs={4} display="flex" alignItems="center" marginTop={3}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: isSmScreen ? 18 : 14 }}
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
                  console.log(newValue);
                  const industries = newValue.map((item) => item.industry);
                  const uniqueIndustries = industries.filter(
                    (item, index) => industries.indexOf(item) === index
                  );
                  setSelectedIndustries(uniqueIndustries);
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
              />
            </Stack>
          </Grid>
        </Grid>
        <Grid container spacing={0}>
          <Grid item xs={4} display="flex" alignItems="center" marginTop={3}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: isSmScreen ? 18 : 14 }}
            >
              Strike Price
            </Typography>
          </Grid>

          <Grid
            item
            xs={8}
            marginTop={3}
            display="flex"
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
            {strikePriceTypes.map((item, index) => (
              <Button
                key={index}
                onClick={() => setSelectedStrikePriceType(item)}
                className={item === selectedStrikePriceType ? "selected" : ""}
              >
                {item}
              </Button>
            ))}
          </Grid>
        </Grid>
        <Grid container spacing={0} alignItems="center" marginTop={3}>
          <Grid item xs={4}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: isSmScreen ? 18 : 14 }}
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
                  onChange={(event) => setExpiryDate(event.target.value)}
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
                      onChange={(e) => handleWeeklyOption(e)}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                  label="Weekly Dates"
                />
              </FormGroup>
            </Stack>
          </Grid>
        </Grid>
        <Grid container spacing={0}>
          <Grid item xs={4} marginTop={3}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: isSmScreen ? 18 : 14 }}
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
        <Grid container spacing={0}>
          <Grid item xs={4} marginTop={3}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: isSmScreen ? 18 : 14 }}
            >
              Trade ROI%
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
              <InputLabel id="minROI">Min. ROI%</InputLabel>
              <Select
                labelId="minROI"
                id="minROI"
                label="Min. ROI%"
                value={minTradeROI}
                onChange={(event) => {
                  setMinTradeROI(event.target.value);
                }}
              >
                {ROIs.map((item, index) => (
                  <MenuItem value={item} key={index}>
                    {item}%
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={0}>
          <Grid item xs={4} marginTop={3}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: isSmScreen ? 18 : 14 }}
            >
              Annualized ROI%
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
              <InputLabel id="minAnnualROI">Min. Ann. ROI%</InputLabel>
              <Select
                labelId="minAnnualROI"
                id="minAnnualROI"
                label="Min. Ann. ROI%"
                value={minAnnualROI}
                onChange={(event) => {
                  setMinAnnualROI(event.target.value);
                }}
              >
                {annualROIs.map((item, index) => (
                  <MenuItem value={item} key={index}>
                    {item}%
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={0}>
          <Grid item xs={4} marginTop={3}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: isSmScreen ? 18 : 14 }}
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
                onChange={(event) => {
                  setMinOI(event.target.value);
                }}
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
        <Grid container spacing={0}>
          <Grid item xs={4} marginTop={3}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: isSmScreen ? 18 : 14 }}
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
                onChange={(event) => {
                  setMaxspread(event.target.value);
                }}
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
          openState={openNoSymbolSelected}
          onClose={() => setOpenNoSymbolSelected(false)}
          severity="warning"
          text={"Please select at least one symbol!"}
        />
      </fieldset>
      <Box textAlign="center" marginY={3}>
        <Button
          sx={{
            color: "white",
            background: theme.palette.text.third,
            border: `${theme.palette.text.third} solid 1px`,
            minWidth: 100,
          }}
          onClick={() => onFindOptions()}
        >
          Find Options
        </Button>
      </Box>
    </Box>
  );
};

export default OptionsFilters;
