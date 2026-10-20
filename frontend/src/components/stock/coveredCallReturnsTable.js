import * as React from "react";
import { useState } from "react";

import {
  Box,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import PDFDocument from "./pdfDocument";
import AddCategory from "../category/addCategory";
import ConversionFreeAccount from "../dialog/conversionFreeAccount";

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
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const { isAuthenticated } = useAuth0();
  const [openConversionFreeAccountDialog, setOpenConversionFreeAccountDialog] =
    useState(false);

  React.useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    setPdfName(formattedDate + ".pdf");
  }, []);

  const handleSaveShortlist = () => {
    setOpenCategoryDialog(true);
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
                    <Tooltip
                      title="Jump to 'Profit Horizon' to compare Expiry Dates"
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
                        sx={{ cursor: "pointer", color: "text.third" }}
                        onClick={() => {
                          navigate(
                            `/profitHorizon?symbol=${available_symbols[index]}`
                          );
                        }}
                      >
                        <u>
                          {" "}
                          <i>{expiration_date}</i>
                        </u>
                      </TableCell>
                    </Tooltip>
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
            if (isAuthenticated) {
              navigate("/shortlist");
            } else {
              setOpenConversionFreeAccountDialog(true);
            }
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
            marginTop: 2,
          }}
          onClick={() => {
            if (isAuthenticated) {
              handleSaveShortlist();
            } else {
              setOpenConversionFreeAccountDialog(true);
            }
          }}
        >
          Save to shortlist
        </Button>
        <br />
        <Button
          sx={{
            backgroundColor: theme.palette.text.third,
            color: "white",
            border: `${theme.palette.text.third} solid 1px`,
            textDecoration: "none",
            marginTop: 2,
            marginBottom: 5
          }}
          onClick={() => {
            if (!isAuthenticated) {
              setOpenConversionFreeAccountDialog(true);
            }
          }}
        >
          {isAuthenticated ? (
            <PDFDownloadLink
              document={
                <PDFDocument symbols={symbols} dataForPdf={dataForPdf} />
              }
              fileName={pdfName}
              style={{ color: "white", textDecoration: "none" }}
            >
              {({ loading }) =>
                loading ? "Loading document..." : "Export To PDF"
              }
            </PDFDownloadLink>
          ) : (
            "Export To PDF"
          )}
        </Button>

        <AddCategory
          onClose={() => setOpenCategoryDialog(false)}
          open={openCategoryDialog}
          symbols={available_symbols}
        />

        <ConversionFreeAccount
          open={openConversionFreeAccountDialog}
          onClose={() => setOpenConversionFreeAccountDialog(false)}
        />
      </div>
    </>
  );
};

export default CoveredCallReturnsTable;
