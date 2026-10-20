import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box } from "@mui/material";
import { useTheme } from "@emotion/react";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [createData("74.25", 'Feb-16’24', '$284', '3.82%', '81.43%')];

const CoveredCallReturnsTable = ({ symbol }) => {

  const theme = useTheme()

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
        <legend>{symbol}</legend>
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
        <Table
          aria-label="covered call premiums table"
          sx={{ "& .MuiTableCell-body": { color: "white", paddingTop: 0 } }}
        >
          <TableHead sx={{ textTransform: "none" }}>
            <TableRow>
              <TableCell align="center">Share price</TableCell>
              <TableCell align="center">Expiry Date</TableCell>
              <TableCell align="center">Premium</TableCell>
              <TableCell align="center">ROI</TableCell>
              <TableCell align="center"> Annual. ROI</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              "&:last-child td, &:last-child th": { borderBottom: "none" },
            }}
          >
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" align="center">
                  {row.name}
                </TableCell>
                <TableCell align="center">{row.calories}</TableCell>
                <TableCell align="center">{row.fat}</TableCell>
                <TableCell align="center">{row.carbs}</TableCell>
                <TableCell align="center">{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer>
        <Table
          aria-label="covered call premiums table"
          sx={{ "& .MuiTableCell-body": { color: "white", paddingTop:0 } }}
        >
          <TableHead sx={{ textTransform: "none" }}>
            <TableRow>
              <TableCell align="center">Strike</TableCell>
              <TableCell align="center"> Max Risk </TableCell>
              <TableCell align="center">Max Return</TableCell>
              <TableCell align="center">Max Return on Risk</TableCell>
              <TableCell align="center">Annual.</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              "&:last-child td, &:last-child th": { borderBottom: "none" },
            }}
          >
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" align="center">
                  {row.name}
                </TableCell>
                <TableCell align="center">{row.calories}</TableCell>
                <TableCell align="center">{row.fat}</TableCell>
                <TableCell align="center">{row.carbs}</TableCell>
                <TableCell align="center">{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
    </fieldset>
  );
};

export default CoveredCallReturnsTable;
