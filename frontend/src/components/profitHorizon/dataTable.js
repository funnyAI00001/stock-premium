import * as React from "react";
import { useState, useEffect } from "react";

import {
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { useSelector } from "react-redux";

import ConversionFreeAccount from "../dialog/conversionFreeAccount";

const getDaysToExpirationDate = (expiration_date) => {
  let daysToExpirationDate = 1;
  const startDate = new Date(formatDate(expiration_date));
  const current = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = Math.abs(current.getTime() - startDate.getTime());

  // Convert the time difference from milliseconds to days
  daysToExpirationDate = Math.ceil(timeDifference / (1000 * 3600 * 24));

  return daysToExpirationDate;
};

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

const DataTable = ({
  sharePrice,
  strikeATMs,
  strikeOTM5s,
  strikeOTM10s,
  ATMs,
  OTM5s,
  OTM10s,
  ROIs,
  OTM5ROIs,
  OTM10ROIs,
  annualROIs,
  OTM5annualROIs,
  OTM10annualROIs,
  expiration_dates,
  indicesWithinTenDays,
  indicesWithNoData,
  symbol,
  selectedButton,
}) => {
  const theme = useTheme();
  const rowNames = [
    "Symbol",
    "Share Price x 100",
    "Expiry Date",
    "Strike Price",
    "Premium",
    "ROI",
    "Annual. ROI",
    "Max Return",
    "Max Risk",
    "Max ROR",
    "Annual. Max ROR",
  ];

  const [openConversionFreeAccountDialog, setOpenConversionFreeAccountDialog] =
    useState(false);
  const [hideTable, setHideTable] = useState(false);
  const daysInFuture = useSelector((state) => state.profitHorizon.daysInFuture);

  const [selectedPremiums, setselectedPremiums] = useState(ATMs);
  const [selectedROIs, setselectedROIs] = useState(ROIs);
  const [selectedAnnualROIs, setselectedAnnualROIs] = useState(annualROIs);
  const [selectedStrikePrice, setselectedStrikePrice] = useState(strikeATMs);

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

  const otm1Percentage = useSelector(
    (state) => state.profitHorizon.otm1Percentage
  );
  const otm2Percentage = useSelector(
    (state) => state.profitHorizon.otm2Percentage
  );

  useEffect(() => {
    setselectedStrikePrice(strikeATMs);
    setselectedPremiums(ATMs);
    setselectedROIs(ROIs);
    setselectedAnnualROIs(annualROIs);

    let returns, risks, RORs, annualMaxRORs;

    // For ATM
    returns = strikeATMs.map((item, index) => {
      return parseFloat(
        (item * 100 - sharePrice * 100 + parseFloat(ATMs[index])).toFixed(0)
      );
    });

    risks = ATMs.map((item, index) => {
      return parseFloat((sharePrice * 100 - item).toFixed(0));
    });

    RORs = returns.map((item, index) => {
      return parseFloat(((item / risks[index]) * 100).toFixed(2));
    });

    // Convert the time difference from milliseconds to days

    annualMaxRORs = RORs.map((item, index) => {
      return parseFloat(
        (
          (Math.pow(
            1 + item / 100,
            365 / getDaysToExpirationDate(expiration_dates[index].date)
          ) -
            1) *
          100
        ).toFixed(2)
      );
    });

    setMaxReturns1(returns);
    setMaxRisks1(risks);
    setMaxRORs1(RORs);
    setAnnualMaxRORs1(annualMaxRORs);

    setMaxReturns(returns);
    setMaxRisks(risks);
    setMaxRORs(RORs);
    setAnnualMaxRORs(annualMaxRORs);

    // For ATM5
    returns = strikeOTM5s.map((item, index) => {
      return parseFloat(
        (item * 100 - sharePrice * 100 + parseFloat(OTM5s[index])).toFixed(0)
      );
    });

    risks = OTM5s.map((item, index) => {
      return parseFloat((sharePrice * 100 - item).toFixed(0));
    });

    RORs = returns.map((item, index) => {
      return parseFloat(((item / risks[index]) * 100).toFixed(2));
    });

    // Convert the time difference from milliseconds to days

    annualMaxRORs = RORs.map((item, index) => {
      return parseFloat(
        (
          (Math.pow(
            1 + item / 100,
            365 / getDaysToExpirationDate(expiration_dates[index].date)
          ) -
            1) *
          100
        ).toFixed(2)
      );
    });

    setMaxReturns2(returns);
    setMaxRisks2(risks);
    setMaxRORs2(RORs);
    setAnnualMaxRORs2(annualMaxRORs);

    // For ATM10
    returns = strikeOTM10s.map((item, index) => {
      return parseFloat(
        (item * 100 - sharePrice * 100 + parseFloat(OTM10s[index])).toFixed(0)
      );
    });

    risks = OTM10s.map((item, index) => {
      return parseFloat((sharePrice * 100 - item).toFixed(0));
    });

    RORs = returns.map((item, index) => {
      return parseFloat(((item / risks[index]) * 100).toFixed(2));
    });

    // Convert the time difference from milliseconds to days
    annualMaxRORs = RORs.map((item, index) => {
      return parseFloat(
        (
          (Math.pow(
            1 + item / 100,
            365 / getDaysToExpirationDate(expiration_dates[index].date)
          ) -
            1) *
          100
        ).toFixed(2)
      );
    });

    setMaxReturns3(returns);
    setMaxRisks3(risks);
    setMaxRORs3(RORs);
    setAnnualMaxRORs3(annualMaxRORs);
  }, [sharePrice, strikeATMs, ATMs, ROIs, annualROIs]);

  useEffect(() => {
    switch (selectedButton) {
      case "ATM":
        setselectedStrikePrice(strikeATMs);
        setselectedPremiums(ATMs);
        setselectedROIs(ROIs);
        setselectedAnnualROIs(annualROIs);
        setMaxReturns(maxReturns1);
        setMaxRisks(maxRisks1);
        setMaxRORs(maxRORs1);
        setAnnualMaxRORs(annualMaxRORs1);

        break;

      case otm1Percentage + "%OTM":
        setselectedStrikePrice(strikeOTM5s);
        setselectedPremiums(OTM5s);
        setselectedROIs(OTM5ROIs);
        setselectedAnnualROIs(OTM5annualROIs);
        setMaxReturns(maxReturns2);
        setMaxRisks(maxRisks2);
        setMaxRORs(maxRORs2);
        setAnnualMaxRORs(annualMaxRORs2);

        break;

      case otm2Percentage + "%OTM":
        setselectedStrikePrice(strikeOTM10s);
        setselectedPremiums(OTM10s);
        setselectedROIs(OTM10ROIs);
        setselectedAnnualROIs(OTM10annualROIs);
        setMaxReturns(maxReturns3);
        setMaxRisks(maxRisks3);
        setMaxRORs(maxRORs3);
        setAnnualMaxRORs(annualMaxRORs3);

        break;
    }
  }, [selectedButton, maxReturns, maxRORs, maxRisks]);

  const handleHideTable = () => {
    setHideTable(!hideTable);
  };

  return (
    <>
      <fieldset
        style={{
          width: "60%",
          margin: "auto",
          borderColor: theme.palette.text.third,
          borderRadius: 5,
          marginTop: "3vh",
        }}
      >
        <legend>{`"${symbol}" over the next ${daysInFuture} days`}</legend>
        <Box
          textAlign="center"
          sx={{
            width: "80vw",
            color: "white",
            "@media (min-width: 600px)": {
              width: "auto", // Set to auto for screens wider than 600px
            },
          }}
        >
          <TableContainer>
            <Table aria-label="covered call premiums and returns over table">
              <TableBody
                sx={{
                  "&:last-child td, &:last-child th": { borderBottom: "none" },
                  "& tr td": { color: "white" },
                }}
              >
                <TableRow>
                  <TableCell
                    colSpan={selectedPremiums.length + 1}
                    sx={{ padding: 0 }}
                  >
                    <Button
                      sx={{
                        float: "right",
                        color: "text.secondary",
                        paddingY: 0,
                      }}
                      onClick={() => {
                        handleHideTable();
                      }}
                    >
                      {!hideTable ? "Hide" : "Show"} Table
                    </Button>
                  </TableCell>
                </TableRow>
                {!hideTable && (
                  <>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        align="left"
                        sx={{
                          color: theme.palette.text.third,
                          fontWeight: 600,
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          backgroundColor: theme.palette.background.default,
                        }}
                      >
                        {rowNames[1]}
                      </TableCell>
                      <TableCell align="center">
                        ${Intl.NumberFormat("en-US").format(sharePrice * 100)}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        align="left"
                        sx={{
                          color: theme.palette.text.third,
                          fontWeight: 600,
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          backgroundColor: theme.palette.background.default,
                        }}
                      >
                        {rowNames[3]}
                      </TableCell>
                      <TableCell align="center">
                        ${selectedStrikePrice[0]}
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        align="left"
                        sx={{
                          color: theme.palette.text.third,
                          fontWeight: 600,
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          backgroundColor: theme.palette.background.default,
                        }}
                      >
                        {rowNames[2]}
                      </TableCell>
                      {expiration_dates.map((date, index) =>
                        indicesWithinTenDays.includes(index) &&
                        !indicesWithNoData.includes(index) ? (
                          <Tooltip
                            title="This date is <10 days away and would skew the graph"
                            enterTouchDelay={0}
                            leaveTouchDelay={1500}
                            placement="top"
                            key={index}
                            PopperProps={{
                              modifiers: [
                                {
                                  name: "offset",
                                  options: {
                                    offset: [0, 0],
                                  },
                                },
                              ],
                            }}
                          >
                            <TableCell
                              align="center"
                              key={index}
                              sx={{ cursor: "pointer" }}
                            >
                              {`${date.date}*`}
                            </TableCell>
                          </Tooltip>
                        ) : !indicesWithinTenDays.includes(index) &&
                          !indicesWithNoData.includes(index) ? (
                          <TableCell align="center" key={index}>
                            {date.date}
                          </TableCell>
                        ) : (
                          <></>
                        )
                      )}
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        align="left"
                        sx={{
                          color: theme.palette.text.third,
                          fontWeight: 600,
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          backgroundColor: theme.palette.background.default,
                        }}
                      >
                        {rowNames[4]}
                      </TableCell>
                      {selectedPremiums.map((item, index) => (
                        <TableCell align="center" key={index}>
                          ${item}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        align="left"
                        sx={{
                          color: theme.palette.text.third,
                          fontWeight: 600,
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          backgroundColor: theme.palette.background.default,
                        }}
                      >
                        {rowNames[5]}
                      </TableCell>
                      {selectedROIs.map((item, index) => (
                        <TableCell align="center" key={index}>
                          {item}%
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        align="left"
                        sx={{
                          color: theme.palette.text.third,
                          fontWeight: 600,
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          backgroundColor: theme.palette.background.default,
                        }}
                      >
                        {rowNames[6]}
                      </TableCell>
                      {selectedAnnualROIs.map((item, index) => (
                        <TableCell align="center" key={index}>
                          {item}%
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={ROIs.length + 1}>
                        <Divider sx={{ backgroundColor: "text.third" }} />
                      </TableCell>
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        align="left"
                        sx={{
                          color: theme.palette.text.third,
                          fontWeight: 600,
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          backgroundColor: theme.palette.background.default,
                        }}
                      >
                        {rowNames[7]}
                      </TableCell>
                      {maxReturns.map((item, index) => (
                        <TableCell align="center" key={index}>
                          ${item}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        align="left"
                        sx={{
                          color: theme.palette.text.third,
                          fontWeight: 600,
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          backgroundColor: theme.palette.background.default,
                        }}
                      >
                        {rowNames[8]}
                      </TableCell>
                      {maxRisks.map((item, index) => (
                        <TableCell align="center" key={index}>
                          ${item}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        align="left"
                        sx={{
                          color: theme.palette.text.third,
                          fontWeight: 600,
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          backgroundColor: theme.palette.background.default,
                        }}
                      >
                        {rowNames[9]}
                      </TableCell>
                      {maxRORs.map((item, index) => (
                        <TableCell align="center" key={index}>
                          {item}%
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        align="left"
                        sx={{
                          color: theme.palette.text.third,
                          fontWeight: 600,
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          backgroundColor: theme.palette.background.default,
                        }}
                      >
                        {rowNames[10]}
                      </TableCell>
                      {annualMaxRORs.map((item, index) => (
                        <TableCell align="center" key={index}>
                          {item}%
                        </TableCell>
                      ))}
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </fieldset>
      <div
        style={{
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        <ConversionFreeAccount
          open={openConversionFreeAccountDialog}
          onClose={() => setOpenConversionFreeAccountDialog(false)}
        />
      </div>
    </>
  );
};

export default DataTable;
