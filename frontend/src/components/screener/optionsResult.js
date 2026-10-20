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
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Box,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";

import { useDispatch } from "react-redux";
import { useTheme } from "@emotion/react";

const OptionsResult = () => {
  const isSmScreen = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const fieldsetStyle = {
    borderRadius: 5,
    borderColor: theme.palette.text.third,
    marginTop: isSmScreen ? 25 : 15,
    marginBottom: isSmScreen ? 25 : 15,
    padding: isSmScreen ? "25px 100px" : "25px 15px",
  };
  const symbols = ["BABA", "AAPL"];
  const sharePrices = [74.25, 80.0];
  const strikePrices = [79, 80];
  const premiums = [80, 90.0];
  const ROIs = [3, 5];
  const annualROIs = [95, 120];
  const OIs = [345, 425];
  const IVs = [65, 80];
  const expiration_date = "5/17/2024";
  const rowNames = [
    "Symbol",
    "Share price x 100",
    "Expiry Date",
    "Strike Price",
    "Premium $",
    "ROI %",
    "Annual ROI %",
    "Open Interest",
    "Implied Volatility",
  ];

  return (
    <fieldset style={fieldsetStyle}>
      <legend>Options</legend>
      <Box sx={{ width: isSmScreen ? "50vw" : "80vw" }}>
        <TableContainer>
          <Table
            aria-label="covered call premiums table"
            sx={{ "& .MuiTableCell-body": { fontSize: 16 } }}
          >
            <TableBody
              sx={{
                "&:last-child td, &:last-child th": {
                  borderBottom: "none",
                  color: "white",
                },
              }}
            >
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  align="left"
                  sx={{
                    color: `${theme.palette.text.third} !important`,
                    fontWeight: 800,
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  {rowNames[0]}
                </TableCell>
                {symbols.map((item, index) => (
                  <TableCell align="center" key={index}>
                    {item}
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
                    color: `${theme.palette.text.third} !important`,
                    fontWeight: 600,
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  {rowNames[1]}
                </TableCell>
                {sharePrices.map((item, index) => (
                  <TableCell align="center" key={index}>
                    ${Intl.NumberFormat("en-US").format(item * 100)}
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
                    color: `${theme.palette.text.third} !important`,
                    fontWeight: 600,
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  {rowNames[2]}
                </TableCell>
                {sharePrices.map((item, index) => (
                  <TableCell align="center" key={index}>
                    {expiration_date}
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
                    color: `${theme.palette.text.third} !important`,
                    fontWeight: 600,
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  {rowNames[3]}
                </TableCell>
                {strikePrices.map((item, index) => (
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
                    color: `${theme.palette.text.third} !important`,
                    fontWeight: 600,
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  {rowNames[4]}
                </TableCell>
                {premiums.map((item, index) => (
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
                    color: `${theme.palette.text.third} !important`,
                    fontWeight: 600,
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  {rowNames[5]}
                </TableCell>
                {ROIs.map((item, index) => (
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
                    color: `${theme.palette.text.third} !important`,
                    fontWeight: 600,
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  {rowNames[6]}
                </TableCell>
                {annualROIs.map((item, index) => (
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
                    color: `${theme.palette.text.third} !important`,
                    fontWeight: 600,
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  {rowNames[7]}
                </TableCell>
                {OIs.map((item, index) => (
                  <TableCell align="center" key={index}>
                    {item}
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
                    color: `${theme.palette.text.third} !important`,
                    fontWeight: 600,
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  {rowNames[8]}
                </TableCell>
                {IVs.map((item, index) => (
                  <TableCell align="center" key={index}>
                    {item}%
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </fieldset>
  );
};

export default OptionsResult;
