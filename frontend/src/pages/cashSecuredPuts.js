import React, { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  IconButton,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { useSelector, connect, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import moment from "moment";

import CashSecuredPutsReturnTable from "../components/stock/cashSecuredPutsReturnsTable";
import LoadingOverlay from "../components/dialog/loadingOverlay";
import CustomAlert from "../components/customAlert";
import CustomAlert2 from "../components/customAlert2";
import ConversionFreeAccount from "../components/dialog/conversionFreeAccount";
import UpgradeFreeAccount from "../components/dialog/upgradeFreeAccount";

import { useAuth0 } from "@auth0/auth0-react";

import {
  getCashSecuredPuts,
  getExpirations,
  setOTMITMPercentages,
  getWeeklyExpiryDates,
  getMarketStatus,
} from "../actions/stockAction";
import { increasePageClickCount } from "../actions/adminAction";
import CalculationLimitDialog from "../components/dialog/calculationLimitDialog";

const formatDate = (inputDate) => {
  // Split the input date string by "/"
  const parts = inputDate.split("/");

  // Create a new Date object with the parsed parts
  const date = new Date(parts[2], parts[0] - 1, parts[1]);

  // Format the date to 'YYYY-MM-DD' format
  const formattedDate =
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0");

  return formattedDate;
};

const CashSecuredPuts = ({
  sharePrices,
  ATMs,
  OTMs,
  ITMs,
  getCashSecuredPuts,
  strikeATMs,
  strikeOTMs,
  strikeITMs,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const location = useLocation();
  const [selectedButton, setSelectedButton] = useState("ATM");
  const [gotFirstResult, setGotFirstResult] = useState(false);
  const [firstCalculate, setFirstCalculate] = useState(false);
  const [premium, setPremium] = useState([]);
  const [strikePrices, setStrikePrices] = useState([]);

  const [maxReturns, setMaxReturns] = useState([]);
  const [maxRisks, setMaxRisks] = useState([]);
  const [maxRORs, setMaxRORs] = useState([]);
  const [annualMaxRORs, setAnnualMaxRORs] = useState([]);

  const [maxReturns1, setMaxReturns1] = useState([]);
  const [maxRisks1, setMaxRisks1] = useState([]);
  const [maxRORs1, setMaxRORs1] = useState([]);
  const [annualMaxRORs1, setAnnualMaxRORs1] = useState([]);

  const [maxReturns2, setMaxReturns2] = useState([]);
  const [maxRisks2, setMaxRisks2] = useState([]);
  const [maxRORs2, setMaxRORs2] = useState([]);
  const [annualMaxRORs2, setAnnualMaxRORs2] = useState([]);

  const [maxReturns3, setMaxReturns3] = useState([]);
  const [maxRisks3, setMaxRisks3] = useState([]);
  const [maxRORs3, setMaxRORs3] = useState([]);
  const [annualMaxRORs3, setAnnualMaxRORs3] = useState([]);

  const [openNoExpirationError, setOpenNoExpirationError] = useState(false);
  const [openExpiryNotSelectedError, setOpenExpiryNotSelectedError] =
    useState(false);
  const [openMaxSymbolCounts, setOpenMaxSymbolCounts] = useState(false);
  const [openWarningForNoSupportSymbol, setOpenWarningForNoSupportSymbol] =
    useState(false);
  const [openNoSymbolError, setOpenNoSymbolError] = useState(false);
  const [openWarningForCalculationLimit, setOpenWarningForCalculationLimit] =
    useState(false);
  const [openWarningMarketClosed1, setOpenWarningMarketClosed1] =
    useState(false);

  const put_calculationLimit = useSelector(
    (state) => state.stock.put_calculationLimit
  );
  const service_error = useSelector((state) => state.stock.service_error);
  const server_error = useSelector((state) => state.stock.server_error);
  const symbol_error = useSelector(
    (state) => state.stock.symbol_not_found_error_message
  );
  const option_error = useSelector(
    (state) => state.stock.options_not_found_error_message
  );

  const expirations = useSelector((state) => state.stock.expirations);
  const marketStatus = useSelector((state) => state.stock.marketStatus);
  const available_symbols = useSelector(
    (state) => state.stock.available_symbols
  );
  const weekly_expiry_dates = useSelector(
    (state) => state.stock.weekly_expiry_dates
  );
  const availablePercentages = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 25, 30, 40, 50,
  ];
  const [expiration_date, setExpirationDate] = useState("");
  const [availableExpirations, setAvailableExpirations] = useState([]); // Monthly Expiry Dates
  const [otmPercentage, setOtmPercentage] = useState(5);
  const [itmPercentage, setItmPercentage] = useState(5);
  const [weeklyOption, setWeeklyOption] = useState(false);
  const [isGettingWeeklyExpiryDates, setIsGettingWeeklyExpiryDates] =
    useState(false);
  const [totalExpirations, setTotalExpirations] = useState([]);
  const { isAuthenticated, user, isLoading } = useAuth0();
  const subscriptionStatus = useSelector(
    (state) => state.stripe.subscriptionStatus
  );
  const userType = useSelector((state) => state.stripe.userType);
  const selectedSymbolsForPut = useSelector(
    (state) => state.stock.selectedSymbolsForPut
  );

  const urlParams = new URLSearchParams(location.search);
  let symbolParam = urlParams.get("symbol");

  if (symbolParam === null) {
    symbolParam = [""];
  } else {
    symbolParam = symbolParam.split(",");
  }

  const [symbols, setSymbols] = useState(symbolParam);
  const [openConversionFreeAccountDialog, setOpenConversionFreeAccountDialog] =
    useState(false);
  const [openUpgradeFreeAccountDialog, setOpenUpgradeFreeAccountDialog] =
    useState(false);

  useEffect(() => {
    if (marketStatus === "closed") {
      setOpenWarningMarketClosed1(true);
    }
  }, [marketStatus]);

  // Initiate symbols with one received from shortlist
  useEffect(() => {
    // If the user directly goes to earn page, initiate symbols with one empty field
    if (selectedSymbolsForPut.length === 0) {
      return;
    }

    setSymbols(selectedSymbolsForPut);
    setGotFirstResult(false);
  }, [selectedSymbolsForPut]);

  useEffect(() => {
    if (ATMs.length > 0) {
      setGotFirstResult(true);
    } else {
      setGotFirstResult(false);
    }
  }, [ATMs]);

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

      setExpirationDate(minDate.date);
      setAvailableExpirations(dates);
    }
  }, [expirations]);

  // Set tab of the cashSecuredPutsReturntable as ATM whenever calculation result is updated
  useEffect(() => {
    setPremium(ATMs);
    setStrikePrices(strikeATMs);
    handleButtonClick("ATM"); //eslint-disable-next-line

    let risks, RORs, annualMaxRORs, daysToExpirationDate;

    // For ATM

    risks = strikeATMs.map((item, index) => {
      return (item * 100 - ATMs[index]).toFixed(0);
    });

    RORs = ATMs.map((item, index) => {
      return ((item / risks[index]) * 100).toFixed(2);
    });

    // Convert the time difference from milliseconds to days
    daysToExpirationDate = getDaysToExpirationDate();

    annualMaxRORs = RORs.map((item) => {
      return (
        (Math.pow(1 + item / 100, 365 / daysToExpirationDate) - 1) *
        100
      ).toFixed(2);
    });

    setMaxReturns1(ATMs);
    setMaxRisks1(risks);
    setMaxRORs1(RORs);
    setAnnualMaxRORs1(annualMaxRORs);

    setMaxReturns(ATMs);
    setMaxRisks(risks);
    setMaxRORs(RORs);
    setAnnualMaxRORs(annualMaxRORs);

    // For OTM

    risks = strikeOTMs.map((item, index) => {
      return (item * 100 - OTMs[index]).toFixed(0);
    });

    RORs = OTMs.map((item, index) => {
      return ((item / risks[index]) * 100).toFixed(2);
    });

    // Convert the time difference from milliseconds to days
    daysToExpirationDate = getDaysToExpirationDate();

    annualMaxRORs = RORs.map((item) => {
      return (
        (Math.pow(1 + item / 100, 365 / daysToExpirationDate) - 1) *
        100
      ).toFixed(2);
    });

    setMaxReturns2(OTMs);
    setMaxRisks2(risks);
    setMaxRORs2(RORs);
    setAnnualMaxRORs2(annualMaxRORs);

    // For ATM10

    risks = strikeITMs.map((item, index) => {
      return (item * 100 - ITMs[index]).toFixed(0);
    });

    RORs = ITMs.map((item, index) => {
      return ((item / risks[index]) * 100).toFixed(2);
    });

    // Convert the time difference from milliseconds to days
    daysToExpirationDate = getDaysToExpirationDate();

    annualMaxRORs = RORs.map((item) => {
      return (
        (Math.pow(1 + item / 100, 365 / daysToExpirationDate) - 1) *
        100
      ).toFixed(2);
    });

    setMaxReturns3(ITMs);
    setMaxRisks3(risks);
    setMaxRORs3(RORs);
    setAnnualMaxRORs3(annualMaxRORs);
  }, [ATMs, strikeATMs, ITMs, OTMs]);

  // Set total expiry dates
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
    // increase page click count

    dispatch(
      increasePageClickCount({
        page: "Puts",
        userType: userType === null ? "Unknown" : userType,
      })
    );
    dispatch(getMarketStatus());
  }, [dispatch, userType]);

  useEffect(() => {
    if (put_calculationLimit && !isAuthenticated) {
      //  For unknown users who are not logged in
      setOpenWarningForCalculationLimit(true);

      return;
    } else if (
      put_calculationLimit &&
      isAuthenticated &&
      subscriptionStatus === "trial_expired"
    ) {
      setOpenUpgradeFreeAccountDialog(true);

      return;
    }
  }, [put_calculationLimit, isAuthenticated]);

  const handleSymbolChange = (e, index) => {
    const input = e.target.value.toUpperCase(); // Convert input text to uppercase
    const onlyUppercase = input.replace(/[^A-Z]/g, ""); // Remove any characters that are not uppercase letters
    const values = [...symbols];
    values[index] = onlyUppercase;
    setSymbols(values);
  };

  // When 'calculate' button is clicked
  const handleCalculate = () => {
    if (put_calculationLimit && !isAuthenticated) {
      //  For unknown users who are not logged in
      setOpenWarningForCalculationLimit(true);

      return;
    } else if (
      put_calculationLimit &&
      isAuthenticated &&
      subscriptionStatus === "trial_expired"
    ) {
      setOpenUpgradeFreeAccountDialog(true);

      return;
    }

    // If expiry date isn't selected
    if (expiration_date === null || expiration_date === "") {
      setOpenExpiryNotSelectedError(true);
      return;
    }

    dispatch(
      setOTMITMPercentages({ percentages: [otmPercentage, itmPercentage] })
    );

    const filteredSymbols = symbols.filter((item) => item !== "");

    if (filteredSymbols.length === 0) {
      setOpenNoSymbolError(true);

      return;
    }

    setSymbols(filteredSymbols);

    if (expirations.length === 0) {
      setOpenNoExpirationError(true);

      return;
    }

    const data = {
      symbols: filteredSymbols,
      expiration_date: formatDate(expiration_date),
      isEarn: false,
      otmPercentage,
      itmPercentage,
      isAuthenticated,
      subscriptionStatus,
      userType: userType ? userType : "Unknown",
      email: isAuthenticated ? user.email : "Unknown",
    };

    setFirstCalculate(true);
    getCashSecuredPuts(data, firstCalculateSuccess);
  };

  const getDaysToExpirationDate = () => {
    let daysToExpirationDate = 1;
    const startDate = new Date(formatDate(expiration_date));
    const current = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = Math.abs(current.getTime() - startDate.getTime());

    // Convert the time difference from milliseconds to days
    daysToExpirationDate = Math.ceil(timeDifference / (1000 * 3600 * 24));

    return daysToExpirationDate;
  };

  // ATM, OTM...%, OTM...% buttons are clicked
  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);

    switch (buttonName) {
      case "ATM":
        setStrikePrices(strikeATMs);
        setPremium(ATMs);

        setMaxReturns(maxReturns1);
        setMaxRisks(maxRisks1);
        setMaxRORs(maxRORs1);
        setAnnualMaxRORs(annualMaxRORs1);

        break;

      case otmPercentage + "%OTM":
        setStrikePrices(strikeOTMs);
        setPremium(OTMs);

        setMaxReturns(maxReturns2);
        setMaxRisks(maxRisks2);
        setMaxRORs(maxRORs2);
        setAnnualMaxRORs(annualMaxRORs2);

        break;

      case itmPercentage + "%ITM":
        setStrikePrices(strikeITMs);
        setPremium(ITMs);

        setMaxReturns(maxReturns3);
        setMaxRisks(maxRisks3);
        setMaxRORs(maxRORs3);
        setAnnualMaxRORs(annualMaxRORs3);

        break;

      default:
        break;
    }
  };

  // This is called when the calculation is successful!
  const firstCalculateSuccess = () => {
    setFirstCalculate(false);
    setOpenWarningForNoSupportSymbol(true);
    // setOpenWarningMarketClosed1(true);
  };

  // Add symbol
  const addField = () => {
    if (!isAuthenticated && symbols.length >= 3) {
      setOpenConversionFreeAccountDialog(true);

      return;
    }

    if (symbols.length >= 10) {
      setOpenMaxSymbolCounts(true);
      return;
    }

    setSymbols([...symbols, ""]);
  };

  const handleDeleteSymbol = (index) => {
    const cutSymbols = [...symbols];
    cutSymbols.splice(index, 1);

    setSymbols(cutSymbols);
  };

  // Weekly option select/disselect
  const handleWeeklyOption = (event) => {
    if (!isAuthenticated) {
      setOpenConversionFreeAccountDialog(true);
    } else if (isAuthenticated && subscriptionStatus === "trial_expired") {
      setOpenUpgradeFreeAccountDialog(true);
    } else if (isAuthenticated && subscriptionStatus !== "trial_expired") {
      const filteredSymbols = symbols.filter((item) => item !== "");

      if (filteredSymbols.length === 0) {
        setOpenNoSymbolError(true);

        return;
      }

      setWeeklyOption(event.target.checked);
      setOpenWarningForNoSupportSymbol(false);

      if (event.target.checked) {
        setSymbols(filteredSymbols);
        setIsGettingWeeklyExpiryDates(true);

        dispatch(
          getWeeklyExpiryDates(
            { symbols: filteredSymbols },
            handleEndGettingWeeklyOption
          )
        );
      }
    }
  };

  const handleEndGettingWeeklyOption = () => {
    setIsGettingWeeklyExpiryDates(false);
  };

  const handleOTM_ITM_PercentageClick = () => {
    if (!isAuthenticated) {
      setOpenConversionFreeAccountDialog(true);
    } else if (isAuthenticated && subscriptionStatus === "trial_expired") {
      setOpenUpgradeFreeAccountDialog(true);
    }
  };

  if (isLoading) {
    return <LoadingOverlay text="Loading..." color="success" />;
  }

  return (
    <div
      sx={{
        "& .MuiButton-root": {
          backgroundColor: theme.palette.text.third,
        },
      }}
    >
      {/* Section 1 */}
      <section>
        <Typography
          variant="h3"
          color="text.third"
          textAlign="center"
          mx={2}
          mt={3}
        >
          Cash-Secured Puts{" "}
        </Typography>
        <Typography variant="h6" color="white" textAlign="center" mx={2} mt={3}>
          Enter tickers that you would like to own, but perhaps at a lower
          price.
        </Typography>
        <fieldset
          style={{
            width: "40%",
            margin: "auto",
            borderColor: theme.palette.text.third,
            borderRadius: 5,
            marginTop: "3vh",
          }}
        >
          <Box
            textAlign="center"
            sx={{
              width: "80vw",
              "@media (min-width: 600px)": {
                width: "auto", // Set to auto for screens wider than 600px
              },
            }}
          >
            <Typography variant="body1" color="white" mt={1.5}>
              Enter stock ticker symbol
            </Typography>
            {symbols.map((symbol, index) => (
              <Grid container display="flex" alignItems="center" key={index}>
                <Grid item xs={2} sm={3} textAlign="right">
                  <Typography variant="body1" color="white" paddingRight={1}>
                    {index + 1}
                    {"."}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={8}
                  sm={6}
                  sx={{ "& .MuiInputBase-input": { color: "black" } }}
                >
                  <TextField
                    key={index}
                    value={symbol}
                    autoComplete="off"
                    onChange={(e) => handleSymbolChange(e, index)}
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
                <Grid
                  item
                  xs={2}
                  sm={3}
                  sx={{ paddingRight: { xs: 0, md: 3 } }}
                >
                  {index !== 0 && (
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        handleDeleteSymbol(index);
                      }}
                    >
                      <RemoveCircleIcon />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            ))}
            <div>
              <IconButton
                aria-label="add"
                onClick={addField}
                size="large"
                style={{ marginY: 2 }}
              >
                <AddCircleIcon />
              </IconButton>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={weeklyOption}
                      onChange={(e) => {
                        handleWeeklyOption(e);
                      }}
                      inputProps={{ "aria-label": "controlled" }}
                      // disabled={
                      //   !isAuthenticated ||
                      //   subscriptionStatus === "trial_expired"
                      // }
                    />
                  }
                  label="Weekly Dates"
                />
              </FormGroup>
            </div>
            <FormControl sx={{ m: 1, minWidth: 150 }}>
              <InputLabel id="expiration">Expiry Date</InputLabel>
              <Select
                labelId="expiration"
                id="expiration_date"
                value={expiration_date}
                label="Expiry Date"
                onChange={(event) => setExpirationDate(event.target.value)}
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
            <Box>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="itm">ITM(%)</InputLabel>
                <Select
                  labelId="itm"
                  id="itm"
                  label="ITM(%)"
                  value={itmPercentage}
                  disabled={
                    !isAuthenticated || subscriptionStatus === "trial_expired"
                  }
                  onChange={(event) => {
                    setItmPercentage(event.target.value);
                    setGotFirstResult(false);
                  }}
                  onClick={() => {
                    handleOTM_ITM_PercentageClick();
                  }}
                >
                  {availablePercentages.map((item, index) => (
                    <MenuItem value={item} key={index}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="otm">OTM(%)</InputLabel>
                <Select
                  labelId="otm"
                  id="otm"
                  label="OTM(%)"
                  value={otmPercentage}
                  disabled={
                    !isAuthenticated || subscriptionStatus === "trial_expired"
                  }
                  onChange={(event) => {
                    setOtmPercentage(event.target.value);
                    setGotFirstResult(false);
                  }}
                  onClick={() => {
                    handleOTM_ITM_PercentageClick();
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
        <Box textAlign="center">
          <Button
            sx={{
              margin: "auto",
              marginTop: 2,
              marginBottom: 8,
              background: `${theme.palette.text.third}`,
              border: `${theme.palette.text.third} solid 1px`,
              color: "white",
            }}
            onClick={handleCalculate}
          >
            Calculate
          </Button>
        </Box>
      </section>

      {/* Section 2 */}
      {gotFirstResult && (
        <section>
          <Typography variant="h4" color="text.third" textAlign="center" mt={3}>
            Assumptions
          </Typography>
          <fieldset
            style={{
              width: "40%",
              margin: "auto",
              borderColor: theme.palette.text.third,
              borderRadius: 5,
              marginTop: "3vh",
            }}
          >
            <Box
              textAlign="center"
              sx={{
                width: "80vw",
                "@media (min-width: 600px)": {
                  width: "auto", // Set to auto for screens wider than 600px
                },
              }}
            >
              <ul style={{ textAlign: "left", fontSize: 18 }}>
                <li>Selling Cash-Secured Puts</li>
                <li>5% In The Money (5% ITM)</li>
                <li>At The Money (ATM)</li>
                <li>
                  {otmPercentage}% Out of The Money ({otmPercentage}% OTM)
                </li>
                <li>
                  Must have enough cash in trading account to cover "Max Risk"!
                </li>
              </ul>
            </Box>
          </fieldset>
        </section>
      )}

      {/* Section 3 */}
      {gotFirstResult && (
        <section>
          <Typography
            variant="h4"
            color="text.third"
            textAlign="center"
            mt={5}
            mb={4}
          >
            Cash-Secured Puts Premiums and % Returns
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            mx={2}
            my={2}
            sx={{
              "& .MuiButton-root": {
                backgroundColor: "transparent",
                color: "white",
                border: `1px solid ${theme.palette.text.third}`,
                paddingY: 0,
                paddingX: 2,
              },
              "& .selected": {
                backgroundColor: `${theme.palette.text.third} !important`,
              },
            }}
            gap={2}
          >
            <Button
              className={
                selectedButton === itmPercentage + "%ITM" ? "selected" : ""
              }
              onClick={() => handleButtonClick(itmPercentage + "%ITM")}
            >
              {itmPercentage}% <br /> ITM
            </Button>
            <Button
              className={selectedButton === "ATM" ? "selected" : ""}
              onClick={() => handleButtonClick("ATM")}
            >
              ATM
            </Button>
            <Button
              className={
                selectedButton === otmPercentage + "%OTM" ? "selected" : ""
              }
              onClick={() => handleButtonClick(otmPercentage + "%OTM")}
            >
              {otmPercentage}% <br /> OTM
            </Button>
          </Box>

          <Box display="flex" justifyContent="center">
            <CustomAlert2
              openState={openWarningMarketClosed1}
              severity="warning"
              text="Options premium data may have errors outside of trading hours of major US exchanges. If you see $0 premium value, 
        try again once markets open. We are working with our data provider to resolve this issue."
              autoHideDuration={null}
              onClose={() => {
                setOpenWarningMarketClosed1(false);
              }}
            />
          </Box>
          <CashSecuredPutsReturnTable
            symbols={symbols}
            premium={premium}
            strikePrices={strikePrices}
            expiration_date={expiration_date}
            setGotFirstResult={setGotFirstResult}
            maxReturns={maxReturns}
            maxRisks={maxRisks}
            maxRORs={maxRORs}
            annualMaxRORs={annualMaxRORs}
            available_symbols={available_symbols}
            sharePrices={sharePrices}
            dataForPdf={{
              sharePrices,
              ATMs,
              OTMs,
              ITMs,
              expiration_date,
              strikeATMs,
              strikeOTMs,
              strikeITMs,
              otmPercentage,
              itmPercentage,
              maxReturns1,
              maxRisks1,
              maxRORs1,
              annualMaxRORs1,
              maxReturns2,
              maxRisks2,
              maxRORs2,
              annualMaxRORs2,
              maxReturns3,
              maxRisks3,
              maxRORs3,
              annualMaxRORs3,
            }}
          />
        </section>
      )}

      {/* Show a progress bar while main calcuation is being performed */}
      {firstCalculate && (
        <LoadingOverlay text="Calculating..." color="success" />
      )}

      {/* Show a progress bar while getting weekly expiry dates */}
      {isGettingWeeklyExpiryDates && (
        <LoadingOverlay text="Getting Weekly Expiries..." color="success" />
      )}

      {/* Symbol not found error */}
      <CustomAlert
        openState={symbol_error}
        severity="warning"
        text="Ticker entered does not exist!"
      />

      {/* Option not found error */}
      <CustomAlert
        openState={option_error}
        severity="warning"
        text="No options available for ticker!"
      />

      {/* Service not available error */}
      <CustomAlert
        openState={service_error}
        severity="warning"
        text="Some tickers will not work on trading holidays. On the paid version, you can plan your trades also on trading holidays"
      />

      {/* Server error */}
      <CustomAlert
        openState={server_error}
        severity="warning"
        text="Server Error"
      />

      {/* Expiry dates not found error */}
      <CustomAlert
        openState={openNoExpirationError}
        severity="warning"
        text="Please upload expiration dates in the expiration page!"
        onClose={() => setOpenNoExpirationError(false)}
      />

      {/* Expiry date not selected error */}
      <CustomAlert
        openState={openExpiryNotSelectedError}
        severity="warning"
        text="Please select expiry date!"
        onClose={() => setOpenExpiryNotSelectedError(false)}
      />

      {/* Error for max count */}
      <CustomAlert
        openState={openMaxSymbolCounts}
        severity="warning"
        text="You can select ten symbols at max!"
        onClose={() => setOpenMaxSymbolCounts(false)}
      />

      {/* A notification is displayed on top of the screen that says:  */}
      <CustomAlert
        openState={openWarningForNoSupportSymbol && weeklyOption}
        severity="warning"
        text="Symbols that do not support the selected weekly expiry date are not displayed."
        autoHideDuration={10000}
        onClose={() => setOpenWarningForNoSupportSymbol(false)}
      />

      <CustomAlert
        openState={openNoSymbolError}
        severity="warning"
        text="Please add at least one symbol!"
        autoHideDuration={6000}
        onClose={() => {
          setOpenNoSymbolError(false);
        }}
      />

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
        onClose={() => setOpenUpgradeFreeAccountDialog(false)}
      />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  getCashSecuredPuts: (data, callback) =>
    dispatch(getCashSecuredPuts(data, callback)),
  getExpirations: () => dispatch(getExpirations()),
});

const mapStateToProps = (state) => ({
  sharePrices: state.stock.sharePrices,
  ATMs: state.stock.ATMs,
  OTMs: state.stock.OTMs,
  ITMs: state.stock.ITMs,
  strikeATMs: state.stock.strikeATMs,
  strikeOTMs: state.stock.strikeOTMs,
  strikeITMs: state.stock.strikeITMs,
  expirations: state.stock.expirations,
});

export default connect(mapStateToProps, mapDispatchToProps)(CashSecuredPuts);
