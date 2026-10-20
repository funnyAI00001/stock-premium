import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import { connect } from "react-redux";

const ExpirationTable = ({ expirations }) => {
  const theme = useTheme();

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
        {expirations.length > 0 ? (
          <TableContainer>
            <Table
              aria-label="covered call premiums table"
              sx={{ "& .MuiTableCell-body": { color: "white" } }}
            >
              <TableHead sx={{ textTransform: "none" }}>
                <TableRow>
                  <TableCell align="center">Number</TableCell>
                  <TableCell align="center">Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  "&:last-child td, &:last-child th": { borderBottom: "none" },
                }}
              >
                {expirations.map((expiration, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{expiration['date']}</TableCell>
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

const mapStateToProps = (state) => ({
  expirations: state.stock.expirations,
});

export default connect(mapStateToProps)(ExpirationTable);
