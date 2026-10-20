import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

import { Box } from "@mui/material";
import { useTheme } from "@emotion/react";
import { useSelector } from "react-redux";

const CoveredCallPremiumsTable = ({
  symbols,
  sharePrices,
  ATMs,
  OTM5s,
  OTM10s,
  expiration_date,
}) => {
  const theme = useTheme();
  const OTM1percentage = useSelector((state) => state.stock.OTM1percentage)
  const OTM2percentage = useSelector((state) => state.stock.OTM2percentage)
  const rowNames = [
    "Symbol",
    "Share price x 100",
    "Expiry Date",
    "ATM",
    OTM1percentage + "% OTM",
    OTM2percentage + "% OTM",
  ];
 

  return (
    <fieldset
      style={{
        width: "60%",
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
        <TableContainer>
          <Table aria-label="covered call premiums table">
            <TableBody
              sx={{
                "&:last-child td, &:last-child th": { borderBottom: "none" },
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
                    color: theme.palette.text.third,
                    fontWeight: 600,
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
                {ATMs.map((item, index) => (
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
                  {rowNames[4]}
                </TableCell>
                {OTM5s.map((item, index) => (
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
                {OTM10s.map((item, index) => (
                  <TableCell align="center" key={index}>
                    ${item}
                  </TableCell>
                ))}
              </TableRow>
              {/* {symbols.map((symbol, index) => (
                <TableRow
                  key={symbol}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="center">
                    {symbol}
                  </TableCell>
                  <TableCell align="center">
                    $
                    {Intl.NumberFormat("en-US").format(
                      sharePrices[index] * 100
                    )}
                  </TableCell>
                  <TableCell align="center">{expiration_date}</TableCell>
                  <TableCell align="center">${ATMs[index]}</TableCell>
                  <TableCell align="center">${OTM5s[index]}</TableCell>
                  <TableCell align="center">${OTM10s[index]}</TableCell>
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <Typography variant="body1" color="initial" textAlign="right">
          Premiums per 100 shares
        </Typography> */}
      </Box>
    </fieldset>
  );
};

export default CoveredCallPremiumsTable;
