import * as React from "react";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

import { Box, Button, Divider } from "@mui/material";
import { useTheme } from "@emotion/react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useNavigate } from "react-router-dom";

import PDFDocument from "./pdfDocument";

const CoveredCallReturnsTable = ({
  symbols,
  sharePrices,
  premium,
  ROIs,
  annualROIs,
  expiration_date,
  strikePrices,
  dataForPdf,
  setGotFirstResult,
  maxReturns,
  maxRisks,
  maxRORs,
  annualMaxRORs,
  available_symbols,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const rowNames = [
    "Symbol",
    "Share price x 100",
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

  const [pdfName, setPdfName] = useState("");

  React.useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    setPdfName(formattedDate + ".pdf");
  }, []);

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
                  {available_symbols.map((item, index) => (
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
                  {premium.map((item, index) => (
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
                  {annualROIs.map((item, index) => (
                    <TableCell align="center" key={index}>
                      {item}%
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell colSpan={sharePrices.length + 1}>
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
        <Button
          sx={{
            backgroundColor: theme.palette.text.third,
            color: "white",
            border: `${theme.palette.text.third} solid 1px`,
            marginTop: 2,
          }}
          onClick={() => {
            setGotFirstResult(false);
          }}
        >
          Back
        </Button>
        <br />
        <Button
          sx={{
            backgroundColor: theme.palette.text.third,
            color: "white",
            border: `${theme.palette.text.third} solid 1px`,
            marginTop: 2,
          }}
          onClick={() => {
            navigate("/shortlist");
          }}
        >
          Go to Shortlists
        </Button>
        <br />
        <Button
          sx={{
            backgroundColor: theme.palette.text.third,
            color: "white",
            border: `${theme.palette.text.third} solid 1px`,
            textDecoration: "none",
            marginTop: 2,
          }}
        >
          <PDFDownloadLink
            document={<PDFDocument symbols={symbols} dataForPdf={dataForPdf} />}
            fileName={pdfName}
            style={{ color: "white", textDecoration: "none" }}
          >
            {({ loading }) =>
              loading ? "Loading document..." : "Export To PDF"
            }
          </PDFDownloadLink>
        </Button>
      </div>
    </>
  );
};

export default CoveredCallReturnsTable;
