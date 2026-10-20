import React from "react";
import { useTheme } from "@emotion/react";
import {
  useMediaQuery,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Box,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";

import { useSelector } from "react-redux";
import { formatNumber } from "../../utils/usefulFuncs";

const BasicFilterResult = () => {
  const theme = useTheme();
  const isSmScreen = useMediaQuery("(min-width:600px)");
  const fieldsetStyle = {
    borderRadius: 5,
    borderColor: theme.palette.text.third,
    marginTop: isSmScreen ? 25 : 15,
    padding: isSmScreen ? "25px 100px" : "25px 5px",
    color: "white",
  };

  const rowNames = [
    "",
    "Symbol",
    "Company Name",
    "Share price",
    "Market Cap",
    "Beta",
    "P/E",
    "Dividend Yield",
    "P/B",
    "Industry",
  ];
  const basicFilterResult = useSelector(
    (state) => state.stock.basicFilterResult
  );

  return (
    <fieldset style={fieldsetStyle}>
      <legend>Stocks</legend>

      <Box sx={{ maxWidth: isSmScreen ? "50vw" : "85vw" }}>
        <TableContainer sx={{ "& .MuiTableCell-body": { fontSize: 16 } }}>
          {basicFilterResult.length > 0 && (
            <Table aria-label="covered call premiums table">
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
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    {rowNames[0]}
                  </TableCell>
                  {basicFilterResult.map((item, index) => (
                    <TableCell key={index} align="center">
                      <Checkbox inputProps={{ "aria-label": "controlled" }} />
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
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    {rowNames[1]}
                  </TableCell>
                  {basicFilterResult.map((item, index) => (
                    <TableCell align="center" key={index}>
                      {item.symbol}
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
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    {rowNames[2]}
                  </TableCell>
                  {basicFilterResult.map((item, index) => (
                    <TableCell align="center" key={index}>
                      {item.name}
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
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    {rowNames[3]}
                  </TableCell>
                  {basicFilterResult.map((item, index) => (
                    <TableCell align="center" key={index}>
                      ${item.sharePrice}
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
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    {rowNames[4]}
                  </TableCell>
                  {basicFilterResult.map((item, index) => (
                    <TableCell align="center" key={index}>
                      ${formatNumber(item.marketCap)}
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
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    {rowNames[5]}
                  </TableCell>
                  {basicFilterResult.map((item, index) => (
                    <TableCell align="center" key={index}>
                      {item.beta}
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
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    {rowNames[6]}
                  </TableCell>
                  {basicFilterResult.map((item, index) => (
                    <TableCell align="center" key={index}>
                      {item.PE}
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
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    {rowNames[7]}
                  </TableCell>
                  {basicFilterResult.map((item, index) => (
                    <TableCell align="center" key={index}>
                      {(item.DividendYield * 100).toFixed(2)}%
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
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    {rowNames[8]}
                  </TableCell>
                  {basicFilterResult.map((item, index) => (
                    <TableCell align="center" key={index}>
                      {item.PB}
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
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      backgroundColor: theme.palette.background.default,
                    }}
                  >
                    {rowNames[9]}
                  </TableCell>
                  {basicFilterResult.map((item, index) => (
                    <TableCell align="center" key={index}>
                      {item.industry}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </Box>
    </fieldset>
  );
};

export default BasicFilterResult;
