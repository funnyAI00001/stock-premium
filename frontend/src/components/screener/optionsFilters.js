import React, { useState } from "react";
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
} from "@mui/material";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";

import { useDispatch } from "react-redux";
import { useTheme } from "@emotion/react";

import { getWeeklyExpiryDates } from "../../actions/stockAction";

import LoadingOverlay from "../dialog/loadingOverlay";

const OptionsFilters = () => {
  const isSmScreen = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
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
  const [symbols, setSymbols] = useState([]);
  const [minPremium, setMinPremium] = useState(0.01);
  const [minTradeROI, setMinTradeROI] = useState(1);
  const [minAnnualROI, setMinAnnualROI] = useState(5);
  const [minOI, setMinOI] = useState(10);
  const [maxSpread, setMaxspread] = useState("All");
  const dispatch = useDispatch();
  const formControlStyle = {
    m: 1,
    margin: 0,
    width: isSmScreen ? "31%" : "80%",
    "& .MuiSelect-select": { borderColor: "white" },
  };

  // Weekly option select/disselect
  const handleWeeklyOption = (event) => {
    setWeeklyOption(event.target.checked);

    // if (event.target.checked) {
    //   const filteredSymbols = symbols.filter((item) => item !== "");
    //   setSymbols(filteredSymbols);
    //   setIsGettingWeeklyExpiryDates(true);

    //   dispatch(
    //     getWeeklyExpiryDates(
    //       { symbols: filteredSymbols },
    //       handleEndGettingWeeklyOption
    //     )
    //   );
    // }
  };

  const handleEndGettingWeeklyOption = () => {
    setIsGettingWeeklyExpiryDates(false);
  };

  return (
    <fieldset style={fieldsetStyle}>
      <legend>Options Filters</legend>
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
              <InputLabel id="expiryDate">Expiry Date</InputLabel>
              <Select
                labelId="expiryDate"
                id="expiryDate"
                label="Expiry Date"
                value={expiryDate}
                onChange={(event) => {
                  setExpiryDate(event.target.value);
                }}
              >
                <MenuItem value="5/17/2024">5/17/2024</MenuItem>
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
    </fieldset>
  );
};

export default OptionsFilters;
