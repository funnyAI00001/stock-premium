import React, { useEffect, useState } from "react";
import {
  useMediaQuery,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Typography,
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
  const side = useSelector((state) => state.stock.side);

  useEffect(() => {
    setResult({ symbols: [] });
  }, [side]);

  const rowNames = [
    "Symbol",
    "Share price x 100",
    "Expiry Date",
    "Strike Price",
    "Premium $",
    side === "Calls" ? "ROI %" : "ROR %",
    side === "Calls" ? "Annual ROI %" : "Annual ROR %",
    "Open Interest",
    "Implied Volatility",
  ];
  const optionFilterResult = useSelector(
    (state) => state.stock.optionFilterResult
  );
  const [result, setResult] = useState({ symbols: [] });
  const bFoundOption = useSelector((state) => state.stock.bFoundOption);

  useEffect(() => {
      setResult({
        symbols: optionFilterResult.symbols,
        sharePrices: optionFilterResult.sharePrices,
        expiry_dates: optionFilterResult.expiry_dates,
        strikePrices: optionFilterResult.strikePrices,
        premiums: optionFilterResult.premiums,
        ROIs: optionFilterResult.ROIs,
        annualROIs: optionFilterResult.annualROIs,
        RORs: optionFilterResult.RORs,
        annualRORs: optionFilterResult.annualRORs,
        OIs: optionFilterResult.OIs,
        IVs: optionFilterResult.IVs,
      });
  }, [optionFilterResult]);

  return (
    bFoundOption && (
      <Box>
        <fieldset style={fieldsetStyle}>
          <legend>Options</legend>
          <Box sx={{ width: isSmScreen ? "50vw" : "80vw" }}>
            <TableContainer>
              {result.symbols.length > 0 && (
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
                      {result.symbols.map((item, index) => (
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
                      {result.sharePrices.map((item, index) => (
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
                      {result.expiry_dates.map((item, index) => (
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
                      {result.strikePrices.map((item, index) => (
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
                      {result.premiums.map((item, index) => (
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
                      {(side === "Calls" ? result.ROIs : result.RORs).map(
                        (item, index) => (
                          <TableCell align="center" key={index}>
                            {item}%
                          </TableCell>
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
                      {(side === "Calls" ? result.annualROIs : result.annualRORs).map((item, index) => (
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
                      {result.OIs.map((item, index) => (
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
                      {result.IVs.map((item, index) => (
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
          {result.symbols.length === 0 && (
            <Typography textAlign="center" variant="h3">
              No available options!
            </Typography>
          )}
        </fieldset>
      </Box>
    )
  );
};

export default OptionsResult;
