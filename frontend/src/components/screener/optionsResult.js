import React from "react";
import {
  useMediaQuery,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Box,
} from "@mui/material";

import { useSelector } from "react-redux";
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
  const optionFilterResult = useSelector(
    (state) => state.stock.optionFilterResult
  );
  const bFoundOption = useSelector((state) => state.stock.bFoundOption);

  return (
    bFoundOption && (
      <fieldset style={fieldsetStyle}>
        <legend>Options</legend>
        <Box sx={{ width: isSmScreen ? "50vw" : "80vw" }}>
          <TableContainer>
            {optionFilterResult.symbols.length > 0 && (
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
                    {optionFilterResult.symbols.map((item, index) => (
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
                    {optionFilterResult.sharePrices.map((item, index) => (
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
                    {optionFilterResult.expiry_dates.map((item, index) => (
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
                      {rowNames[3]}
                    </TableCell>
                    {optionFilterResult.strikePrices.map((item, index) => (
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
                    {optionFilterResult.premiums.map((item, index) => (
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
                    {optionFilterResult.ROIs.map((item, index) => (
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
                    {optionFilterResult.annualROIs.map((item, index) => (
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
                    {optionFilterResult.OIs.map((item, index) => (
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
                    {optionFilterResult.IVs.map((item, index) => (
                      <TableCell align="center" key={index}>
                        {item * 100}%
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Box>
      </fieldset>
    )
  );
};

export default OptionsResult;
