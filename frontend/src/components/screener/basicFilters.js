import React, { useState } from "react";
import {
  Grid,
  Typography,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  ListItemText,
  Box,
  Button,
  Stack,
  Autocomplete,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";

import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";

import CustomAlert from "../customAlert";
import LoadingOverlay from "../dialog/loadingOverlay";

import { getBasicResult } from "../../actions/stockAction";

const BasicFilters = () => {
  const isSmScreen = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const dispatch = useDispatch();
  const fieldsetStyle = {
    borderRadius: 5,
    borderColor: theme.palette.text.third,
    marginTop: isSmScreen ? 25 : 15,
    padding: isSmScreen ? "25px 100px" : "25px 5px",
  };
  const [selectedBetas, setSelectedBetas] = useState(["Low", "Mid", "High"]);
  const [minSharePrice, setMinSharePrice] = useState(0);
  const [maxSharePrice, setMaxSharePrice] = useState(1000);
  const [minMarketCap, setMinMarketCap] = useState("0B");
  const [maxMarketCap, setMaxMarketCap] = useState("10T");
  const [minPE, setMinPE] = useState(-100000);
  const [maxPE, setMaxPE] = useState(10000000);
  const [minDivYield, setMinDivYield] = useState(0);
  const [maxDivYield, setMaxDivYield] = useState(100);
  const [minPB, setMinPB] = useState(-100000);
  const [maxPB, setMaxPB] = useState(10000000);
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  // const [selectedSectors, setSelectedSectors] = useState([]);

  // const sectors = [
  //   "Energy & Utilities",
  //   "Financial Services",
  //   "Healthcare & Pharmaceuticals",
  //   "Technology & Electronics",
  //   "Industrial & Manufacturing",
  //   "Consumer Goods & Services",
  //   "Food & Beverage",
  //   "Transportation & Logistics",
  //   "Real Estate & Construction",
  //   "Media, Entertainment & Recreation",
  //   "Telecommunications",
  //   "Materials & Chemicals",
  //   "Retail & Wholesale",
  //   "Automotive & Aerospace",
  //   "Insurance",
  // ];
  const betas = ["Low", "Mid", "High"];
  const [openWarningForNoSector, setOpenWarningForNoSector] = useState(false);
  const [openWarningForNoSymbol, setOpenWarningForNoSymbol] = useState(false);
  const [openWarningForNoBeta, setOpenWarningForNoBeta] = useState(false);
  const [openWarningForPE, setOpenWarningForPE] = useState(false);
  const [openWarningForPB, setOpenWarningForPB] = useState(false);
  const [isGettingBasicResult, setIsGettingBasicResult] = useState(false);
  const stocks = useSelector((state) => state.stock.stocks);
  const [selectedIndustries, setSelectedIndustries] = useState([]);

  const handleBetaChange = (event, beta) => {
    if (event.target.checked) {
      setSelectedBetas([...selectedBetas, beta]);
    } else {
      setSelectedBetas([...selectedBetas].filter((item) => item !== beta));
    }
  };

  const onGetBasicResult = async () => {
    // if (selectedSectors.length === 0) {
    //   setOpenWarningForNoSector(true);

    //   return;
    // }
    if (selectedIndustries.length === 0) {
      setOpenWarningForNoSymbol(true);

      return;
    }

    if (selectedBetas.length === 0) {
      setOpenWarningForNoBeta(true);

      return;
    }

    if (maxPE < minPE) {
      setOpenWarningForPE(true);

      return;
    }

    if (maxPB < minPB) {
      setOpenWarningForPB(true);

      return;
    }

    setIsGettingBasicResult(true);

    dispatch(
      getBasicResult(
        {
          // sectors: selectedSectors,
          industries: selectedIndustries,
          betas: selectedBetas,
          minMarketCap: minMarketCap,
          maxMarketCap: maxMarketCap,
          minSharePrice: minSharePrice !== "" ? minSharePrice : 0,
          maxSharePrice: maxSharePrice !== "" ? maxSharePrice : 1e6,
          minPE: minPE,
          maxPE: maxPE,
          minDivYield: minDivYield,
          maxDivYield: maxDivYield,
          minPB: minPB,
          maxPB: maxPB,
        },
        onEndGetBasicResult
      )
    );

  };

  const onEndGetBasicResult = () => {
    setIsGettingBasicResult(false);
  };

  return (
    <Box>
      <fieldset style={fieldsetStyle}>
        <legend>Lookalike Stock Finder</legend>
        {/* <Grid container spacing={0} alignItems="center">
          <Grid item xs={2} sm={4}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: isSmScreen ? 18 : 14 }}
            >
              Sector
            </Typography>
          </Grid>
          <Grid item xs={10} sm={8} display="flex" justifyContent="center">
            <FormControl
              sx={{
                m: 1,
                margin: 0,
                width: "100%",
                "& .MuiSelect-select": { borderColor: "white" },
              }}
            >
              <InputLabel id="sector">Sector</InputLabel>
              <Select
                multiple
                labelId="sector"
                id="sector"
                value={selectedSectors}
                label="Sector"
                renderValue={(selected) => selected.length + " Selected"}
                onChange={(event) => {
                  const {
                    target: { value },
                  } = event;
                  setSelectedSectors(
                    // On autofill we get a stringified value.
                    typeof value === "string" ? value.split(",") : value
                  );
                }}
              >
                {sectors.map((sector, index) => (
                  <MenuItem key={index} value={sector}>
                    <Checkbox checked={selectedSectors.indexOf(sector) > -1} />
                    <ListItemText primary={sector} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid> */}
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={2} sm={4}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: isSmScreen ? 18 : 14 }}
            >
              Ticker Symbol
            </Typography>
          </Grid>
          <Grid item xs={10} sm={8} justifyContent="center">
            <Stack spacing={3}>
              <Autocomplete
                multiple
                id="selected symbols"
                options={stocks}
                getOptionLabel={(stock) => `${stock.symbol} - ${stock.name}`}
                filterSelectedOptions
                value={selectedSymbols}
                onChange={(event, newValue) => {
                  setSelectedSymbols(newValue);
                  const industries = newValue.map((item) => item.industry);
                  const uniqueIndustries = industries.filter(
                    (item, index) => industries.indexOf(item) === index
                  );
                  setSelectedIndustries(uniqueIndustries);
                }}
                isOptionEqualToValue={(option, value) => {
                  return option === value;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Enter Stocks You Know To Find Lookalikes"
                    placeholder="Symbols"
                  />
                )}
              />
            </Stack>
          </Grid>
        </Grid>
        <Grid container spacing={1} marginTop={2} alignItems="center">
          <Grid item xs={2} sm={4}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: isSmScreen ? 18 : 14 }}
            >
              Share Price
            </Typography>
          </Grid>
          <Grid item xs={5} sm={4}>
            <TextField
              label="Share $ Min"
              variant="outlined"
              value={minSharePrice}
              onChange={(e) => setMinSharePrice(e.target.value)}
              fullWidth
              margin="normal"
              required
              type="number"
              sx={{
                marginTop: 2,
              }}
            />
          </Grid>
          <Grid item xs={5} sm={4}>
            <TextField
              label="Share $ Max"
              variant="outlined"
              value={maxSharePrice}
              onChange={(e) => setMaxSharePrice(e.target.value)}
              fullWidth
              margin="normal"
              required
              sx={{
                marginTop: 2,
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1} marginTop={2} alignItems="center">
          <Grid item xs={2} sm={4}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: isSmScreen ? 18 : 14 }}
            >
              Market Cap
            </Typography>
          </Grid>
          <Grid item xs={5} sm={4} display="flex" justifyContent="center">
            <FormControl
              sx={{
                m: 1,
                margin: 0,
                width: "100%",
                "& .MuiSelect-select": { borderColor: "white" },
              }}
            >
              <InputLabel id="minMarketCap">M.Cap $ Min</InputLabel>
              <Select
                labelId="minMarketCap"
                id="minMarketCap"
                label="M.Cap $ Min"
                value={minMarketCap}
                onChange={(event) => {
                  setMinMarketCap(event.target.value);
                }}
              >
                <MenuItem value={"0B"}>Min</MenuItem>
                <MenuItem value={"250M"}>$ 250M</MenuItem>
                <MenuItem value={"500M"}>$ 500M</MenuItem>
                <MenuItem value={"1B"}>$ 1B</MenuItem>
                <MenuItem value={"10B"}>$ 10B</MenuItem>
                <MenuItem value={"100B"}>$ 100B</MenuItem>
                <MenuItem value={"500B"}>$ 500B</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={5} sm={4} display="flex" justifyContent="center">
            <FormControl
              sx={{
                m: 1,
                margin: 0,
                width: "100%",
                "& .MuiSelect-select": { borderColor: "white" },
              }}
            >
              <InputLabel id="maxMarketCap">M.Cap $ Max</InputLabel>
              <Select
                labelId="maxMarketCap"
                id="maxMarketCap"
                label="M.Cap $ Max"
                value={maxMarketCap}
                onChange={(event) => {
                  setMaxMarketCap(event.target.value);
                }}
              >
                <MenuItem value={"10T"}>Max</MenuItem>
                <MenuItem value={"1T"}>$ 1T</MenuItem>
                <MenuItem value={"500B"}>$ 500B</MenuItem>
                <MenuItem value={"100B"}>$ 100B</MenuItem>
                <MenuItem value={"10B"}>$ 10B</MenuItem>
                <MenuItem value={"1B"}>$ 1B</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={1} marginTop={2} alignItems="center">
          <Grid item xs={2} sm={4}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: isSmScreen ? 18 : 14 }}
            >
              Beta
            </Typography>
          </Grid>
          <Grid
            item
            xs={10}
            sm={8}
            display="flex"
            justifyContent="space-between"
          >
            {betas.map((beta, index) => (
              <span key={index}>
                <Checkbox
                  checked={selectedBetas.includes(beta)}
                  onClick={(event) => handleBetaChange(event, beta)}
                />{" "}
                {beta}
              </span>
            ))}
          </Grid>
        </Grid>
        <Grid container spacing={1} marginTop={2} alignItems="center">
          <Grid item xs={2} sm={4}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: isSmScreen ? 18 : 14 }}
            >
              P/E
            </Typography>
          </Grid>
          <Grid item xs={5} sm={4} display="flex" justifyContent="center">
            <FormControl
              sx={{
                m: 1,
                margin: 0,
                width: "100%",
                "& .MuiSelect-select": { borderColor: "white" },
              }}
            >
              <InputLabel id="minPE">P/E Min</InputLabel>
              <Select
                labelId="minPE"
                id="minPE"
                label="P/E Min"
                value={minPE}
                onChange={(event) => {
                  setMinPE(event.target.value);
                }}
              >
                <MenuItem value={-100000}>Min</MenuItem>
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={11}>10</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={5} sm={4} display="flex" justifyContent="center">
            <FormControl
              sx={{
                m: 1,
                margin: 0,
                width: "100%",
                "& .MuiSelect-select": { borderColor: "white" },
              }}
            >
              <InputLabel id="maxPE">P/E Max</InputLabel>
              <Select
                labelId="maxPE"
                id="maxPE"
                label="P/E Max"
                value={maxPE}
                onChange={(event) => {
                  setMaxPE(event.target.value);
                }}
              >
                <MenuItem value={10000000}>Max</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={0}>0</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={1} marginTop={2} alignItems="center">
          <Grid item xs={2} sm={4}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: isSmScreen ? 18 : 14 }}
            >
              Dividend Yield
            </Typography>
          </Grid>
          <Grid item xs={5} sm={4} display="flex" justifyContent="center">
            <FormControl
              sx={{
                m: 1,
                margin: 0,
                width: "100%",
                "& .MuiSelect-select": { borderColor: "white" },
              }}
            >
              <InputLabel id="divYield">Div % Min</InputLabel>
              <Select
                labelId="divYield"
                id="divYield"
                label="Div % Min"
                value={minDivYield}
                onChange={(event) => {
                  setMinDivYield(event.target.value);
                }}
              >
                <MenuItem value={0}>Min</MenuItem>
                <MenuItem value={1}>1%</MenuItem>
                <MenuItem value={2}>2%</MenuItem>
                <MenuItem value={3}>3%</MenuItem>
                <MenuItem value={4}>4%</MenuItem>
                <MenuItem value={5}>5%</MenuItem>
                <MenuItem value={6}>6%</MenuItem>
                <MenuItem value={7}>7%</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={5} sm={4} display="flex" justifyContent="center">
            <FormControl
              sx={{
                m: 1,
                margin: 0,
                width: "100%",
                "& .MuiSelect-select": { borderColor: "white" },
              }}
            >
              <InputLabel id="divYield">Div % Max</InputLabel>
              <Select
                labelId="divYield"
                id="divYield"
                label="Div % Max"
                value={maxDivYield}
                onChange={(event) => {
                  setMaxDivYield(event.target.value);
                }}
              >
                <MenuItem value={100}>Max</MenuItem>
                <MenuItem value={7}>7%</MenuItem>
                <MenuItem value={6}>6%</MenuItem>
                <MenuItem value={5}>5%</MenuItem>
                <MenuItem value={4}>4%</MenuItem>
                <MenuItem value={3}>3%</MenuItem>
                <MenuItem value={2}>2%</MenuItem>
                <MenuItem value={1}>1%</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={1} marginTop={2} alignItems="center">
          <Grid item xs={2} sm={4}>
            <Typography
              color="white"
              variant="body1"
              sx={{ fontSize: isSmScreen ? 18 : 14 }}
            >
              P/B
            </Typography>
          </Grid>
          <Grid item xs={5} sm={4} display="flex" justifyContent="center">
            <FormControl
              sx={{
                m: 1,
                margin: 0,
                width: "100%",
                "& .MuiSelect-select": { borderColor: "white" },
              }}
            >
              <InputLabel id="minPB">P/B Min</InputLabel>
              <Select
                labelId="minPB"
                id="minPB"
                label="P/B Min"
                value={minPB}
                onChange={(event) => {
                  setMinPB(event.target.value);
                }}
              >
                <MenuItem value={-100000}>Min</MenuItem>
                <MenuItem value={0}>0</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={11}>10</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={5} sm={4} display="flex" justifyContent="center">
            <FormControl
              sx={{
                m: 1,
                margin: 0,
                width: "100%",
                "& .MuiSelect-select": { borderColor: "white" },
              }}
            >
              <InputLabel id="maxPB">P/B Max</InputLabel>
              <Select
                labelId="maxPB"
                id="maxPB"
                label="P/E Max"
                value={maxPB}
                onChange={(event) => {
                  setMaxPB(event.target.value);
                }}
              >
                <MenuItem value={10000000}>Max</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={0}>0</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </fieldset>
      <Box textAlign="center" marginY={3}>
        <Button
          sx={{
            color: "white",
            background: theme.palette.text.third,
            border: `${theme.palette.text.third} solid 1px`,
            minWidth: 100,
          }}
          onClick={() => onGetBasicResult()}
        >
          Find Stocks
        </Button>
      </Box>

      <CustomAlert
        openState={openWarningForNoSector}
        severity="warning"
        text="Please select at least one sector!"
        autoHideDuration={6000}
        onClose={() => {
          setOpenWarningForNoSector(false);
        }}
      />
      <CustomAlert
        openState={openWarningForNoSymbol}
        severity="warning"
        text="Please select at least one symbol!"
        autoHideDuration={6000}
        onClose={() => {
          setOpenWarningForNoSymbol(false);
        }}
      />
      <CustomAlert
        openState={openWarningForNoBeta}
        severity="warning"
        text="Please select at least one beta!"
        autoHideDuration={6000}
        onClose={() => {
          setOpenWarningForNoBeta(false);
        }}
      />
      <CustomAlert
        openState={openWarningForPE}
        severity="warning"
        text="The maximum PE must be greater than the minimum PE!"
        autoHideDuration={6000}
        onClose={() => {
          setOpenWarningForPE(false);
        }}
      />
      <CustomAlert
        openState={openWarningForPB}
        severity="warning"
        text="The maximum PB must be greater than the minimum PB!"
        autoHideDuration={6000}
        onClose={() => {
          setOpenWarningForPB(false);
        }}
      />

      {isGettingBasicResult && (
        <LoadingOverlay text="Filtering..." color="success" />
      )}
    </Box>
  );
};

export default BasicFilters;
