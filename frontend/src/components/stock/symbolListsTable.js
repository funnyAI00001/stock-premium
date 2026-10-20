import * as React from "react";

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { useSelector } from "react-redux";

const SymbolListTable = () => {
  const theme = useTheme();
  const symbolLists = useSelector((state) => state.stock.symbolLists);

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
          height: "60vh",
          overflow: "scroll",
          "@media (min-width: 600px)": {
            width: "auto", // Set to auto for screens wider than 600px
          },
        }}
      >
        {symbolLists.length > 0 ? (
          <TableContainer>
            <Table
              aria-label="covered call premiums table"
              sx={{ "& .MuiTableCell-body": { color: "white" } }}
            >
              <TableHead sx={{ textTransform: "none" }}>
                <TableRow>
                  <TableCell align="center">Number</TableCell>
                  <TableCell align="center">Symbol</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  "&:last-child td, &:last-child th": { borderBottom: "none" },
                }}
              >
                {symbolLists.map((symbolList, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{symbolList["symbol"]}</TableCell>
                    <TableCell align="center">{symbolList["status"]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography
            variant="h1"
            color="white"
            sx={{ opacity: 0.7, padding: 2 }}
          >
            No Data
          </Typography>
        )}
      </Box>
    </fieldset>
  );
};

export default SymbolListTable;
