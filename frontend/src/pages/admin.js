import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import {
  Box,
  Typography,
  useMediaQuery,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
} from "@mui/material";

import { getAnalyticsData } from "../actions/adminAction";

const Admin = () => {
  const userType = useSelector((state) => state.stripe.userType);
  const activeUsers = useSelector((state) => state.admin.activeUsers);
  const newAccounts = useSelector((state) => state.admin.newAccounts);
  const pagesClicked = useSelector((state) => state.admin.pagesClicked);
  const tickersSearched = useSelector((state) => state.admin.tickersSearched);
  const freeUsers = useSelector((state) => state.admin.freeUsers);
  const paidUsers = useSelector((state) => state.admin.paidUsers);
  const pageClickCountsForUnknown = pagesClicked.filter(
    (item) => item.userType === "Unknown"
  );
  const pageClickCountsForFree = pagesClicked.filter(
    (item) => item.userType === "Free"
  );
  const pageClickCountsForPaid = pagesClicked.filter(
    (item) => item.userType === "Paid"
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSmScreen = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const possibleTimeFrames = ["7 days", "30 days", "All time"];
  const [timeFrame, setTimeFrame] = useState("7 days");

  useEffect(() => {
    if (userType !== "Admin") {
      navigate("/");
    }
  }, [navigate, userType]);

  const onTimeFrameChange = (event) => {
    setTimeFrame(event.target.value);

    dispatch(getAnalyticsData({ timeFrame: event.target.value }));
  };

  const handleExportCSV = () => {
    const maxLength = Math.max(freeUsers.length, paidUsers.length);

    const rows = [
      ["Free Users", "Paid Users"],
      ...Array.from({ length: maxLength }, (_, index) => [
        freeUsers[index] ? freeUsers[index].email : "",
        paidUsers[index] ? paidUsers[index].email : "",
      ]),
    ];

    // Convert rows to CSV format
    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");

    // Create a link element to trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");

    document.body.appendChild(link); // Required for FF

    link.click(); // Trigger download

    document.body.removeChild(link); // Clean up
  };

  return (
    <Box>
      <Box
        sx={{ width: isSmScreen ? "60vw" : "90vw", margin: "auto" }}
        textAlign="center"
      >
        <Typography marginTop={4} variant="h5" textAlign="left">
          What gets measured gets improved
        </Typography>

        <TableContainer
          sx={{
            marginY: 4,
            border: `solid 2px ${theme.palette.text.third}`,
            borderRadius: 1,
          }}
        >
          <FormControl sx={{ marginY: 3 }}>
            <InputLabel id="timeFrame">Time Frame</InputLabel>
            <Select
              labelId="timeFrame"
              id="timeFrame"
              label="Time Frame"
              value={timeFrame}
              onChange={(event) => {
                onTimeFrameChange(event);
              }}
            >
              {possibleTimeFrames.map((item, index) => (
                <MenuItem value={item} key={index}>
                  {item}
                </MenuItem>
              ))}{" "}
            </Select>
          </FormControl>
          <Table
            aria-label="admin table"
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
                ></TableCell>
                <TableCell align="center">Active Users</TableCell>
                <TableCell align="center">New Accounts</TableCell>
                <TableCell align="center">Pages Clicked</TableCell>
                <TableCell align="center">Tickers Searched</TableCell>
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
                  Unknown Users
                </TableCell>
                <TableCell align="center">{activeUsers[0]}</TableCell>
                <TableCell align="center">N/A</TableCell>
                <TableCell align="center">
                  {pageClickCountsForUnknown.map((one, index) => (
                    <div key={index}>
                      {one.page} = {one.clickCount}{" "}
                    </div>
                  ))}
                </TableCell>
                <TableCell align="center" rowSpan={4}>
                  {tickersSearched.map((item, index) => (
                    <div>
                      {item.symbol} {" = "}
                      {item.count}
                    </div>
                  ))}
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
                    color: `${theme.palette.text.third} !important`,
                    fontWeight: 600,
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  Free Users
                </TableCell>
                <TableCell align="center">{activeUsers[1]}</TableCell>
                <TableCell align="center">{newAccounts[1]}</TableCell>
                <TableCell align="center">
                  {pageClickCountsForFree.map((one, index) => (
                    <div key={index}>
                      {one.page} = {one.clickCount}{" "}
                    </div>
                  ))}
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
                    color: `${theme.palette.text.third} !important`,
                    fontWeight: 600,
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  Paid Users
                </TableCell>
                <TableCell align="center">{activeUsers[2]}</TableCell>
                <TableCell align="center">{newAccounts[2]}</TableCell>
                <TableCell align="center">
                  {pageClickCountsForPaid.map((one, index) => (
                    <div key={index}>
                      {one.page} = {one.clickCount}{" "}
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography marginTop={4} variant="h5" textAlign="left">
          Recent users
        </Typography>

        <TableContainer
          sx={{
            marginY: 4,
            border: `solid 2px ${theme.palette.text.third}`,
            borderRadius: 1,
          }}
        >
          <Table
            aria-label="admin table"
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
                <TableCell align="center">Free Users</TableCell>
                <TableCell align="center">Paid Users</TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">
                  {freeUsers.map((user, index) => (
                    <span key={index}>
                      {user.email}
                      <br />
                    </span>
                  ))}
                </TableCell>
                <TableCell align="center">
                  {paidUsers.map((user, index) => (
                    <span key={index}>
                      {user.email}
                      <br />
                    </span>
                  ))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Button
          sx={{
            margin: "auto",
            marginBottom: 6,
            background: `${theme.palette.text.third}`,
            border: `${theme.palette.text.third} solid 1px`,
            color: "white",
          }}
          onClick={handleExportCSV}
        >
          Export To CSV
        </Button>
      </Box>
    </Box>
  );
};

export default Admin;
