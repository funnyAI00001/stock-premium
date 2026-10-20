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
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";

import { useTheme } from "@emotion/react";
import { useDispatch } from "react-redux";

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
  const [selectedBetas, setSelectedBetas] = useState(["Low"]);
  const [minSharePrice, setMinSharePrice] = useState(0);
  const [maxSharePrice, setMaxSharePrice] = useState(100);
  const [minMarketCap, setMinMarketCap] = useState("250M");
  const [maxMarketCap, setMaxMarketCap] = useState("100B");
  const [selectedSectors, setSelectedSectors] = useState([]);
  const sectors = [
    "Energy & Utilities",
    "Financial Services",
    "Healthcare & Pharmaceuticals",
    "Technology & Electronics",
    "Industrial & Manufacturing",
    "Consumer Goods & Services",
    "Food & Beverage",
    "Transportation & Logistics",
    "Real Estate & Construction",
    "Media, Entertainment & Recreation",
    "Telecommunications",
    "Materials & Chemicals",
    "Retail & Wholesale",
    "Automotive & Aerospace",
    "Insurance",
  ];
  const betas = ["Low", "Mid", "High"];
  const [openWarningForNoSector, setOpenWarningForNoSector] = useState(false);
  const [openWarningForNoBeta, setOpenWarningForNoBeta] = useState(false);
  const [isGettingBasicResult, setIsGettingBasicResult] = useState(false);

  const handleBetaChange = (event, beta) => {
    if (event.target.checked) {
      setSelectedBetas([...selectedBetas, beta]);
    } else {
      setSelectedBetas([...selectedBetas].filter((item) => item !== beta));
    }
  };

  const onGetBasicResult = async () => {
    if (selectedSectors.length === 0) {
      setOpenWarningForNoSector(true);

      return;
    }

    if (selectedBetas.length === 0) {
      setOpenWarningForNoBeta(true);

      return;
    }

    setIsGettingBasicResult(true);

    dispatch(
      getBasicResult(
        {
          sectors: selectedSectors,
          betas: selectedBetas,
          minMarketCap: minMarketCap,
          maxMarketCap: maxMarketCap,
          minSharePrice: minSharePrice !== "" ? minSharePrice : 0,
          maxSharePrice: maxSharePrice !== "" ? maxSharePrice : 1e6,
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
        <legend>Basic Filters</legend>
        <Grid container spacing={0} alignItems="center">
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
          Find
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
        openState={openWarningForNoBeta}
        severity="warning"
        text="Please select at least one beta!"
        autoHideDuration={6000}
        onClose={() => {
          setOpenWarningForNoBeta(false);
        }}
      />

      {isGettingBasicResult && (
        <LoadingOverlay text="Filtering..." color="success" />
      )}
    </Box>
  );
};

export default BasicFilters;
