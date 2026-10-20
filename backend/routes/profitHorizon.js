const express = require("express");
const router = express.Router();
const axios = require("axios");

const Expiration = require("../models/expiration");
const Category = require("../models/category");
const SymbolList = require("../models/symbolList");

require("dotenv").config();

function parseDateString(dateString) {
  const [month, day, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day); // Note: Month is 0-indexed
}

function convertDashToSlash(inputDate) {
  // Split the input string by the '-' separator
  var parts = inputDate.split("-");

  // Extract the year, month, and day from the split parts
  var year = parts[0];
  var month = parseInt(parts[1], 10);
  var day = parseInt(parts[2], 10);

  // Format the date in "mm/dd/yyyy" pattern
  var formattedDate = month + "/" + day + "/" + year;

  return formattedDate;
}

router.post("/getProfitHorizon", async (req, res) => {
  const { symbol, otm1Percentage, otm2Percentage, weeklyOption, daysInFuture } =
    req.body;
  const token = process.env.TOKEN || "";

  // Data to be returned
  const ATMs = [];
  const OTM5s = [];
  const OTM10s = [];
  const strikeATMs = [];
  const strikeOTM5s = [];
  const strikeOTM10s = [];
  const ROIs = [];
  const annualROIs = [];
  const OTM5ROIs = [];
  const OTM5annualROIs = [];
  const OTM10ROIs = [];
  const OTM10annualROIs = [];
  // End

  const today = new Date();

  // Calculate the date days from today
  const daysFromToday = new Date();
  daysFromToday.setDate(today.getDate() + daysInFuture);

  let allExpirations = await Expiration.find({});

  if (weeklyOption) {
    const resp = await axios.get(
      "https://api.marketdata.app/v1/options/expirations/" + symbol,
      {
        params: {
          Accept: "application/json",
          token: token,
        },
      }
    );

    const dates = resp.data.expirations;

    dates.forEach((date) => {
      allExpirations.push({ date: convertDashToSlash(date) });
    });

    const seenDates = new Set();

    allExpirations = allExpirations.filter((item) => {
      // Check if the date is already in the Set, if not, add it and keep the item
      if (!seenDates.has(item.date)) {
        seenDates.add(item.date);
        return true;
      }
      // Skip the item if the date is already in the Set
      return false;
    });

    // Sort the dates in ascending order
    allExpirations.sort((a, b) => {
      const dateA = parseDateString(a.date); // Convert to Date object
      const dateB = parseDateString(b.date); // Convert to Date object
      return dateA - dateB; // Compare dates
    });
  }

  // Filter expirations within the next days
  const expirationsWithinDays = allExpirations.filter((expiration) => {
    const expirationDate = parseDateString(expiration.date); // Convert to Date object
    return expirationDate >= today && expirationDate < daysFromToday;
  });

  let response = null;

  // Get the share price
  try {
    response = await axios.get(
      "https://api.marketdata.app/v1/stocks/quotes/" + symbol,
      {
        params: {
          Accept: "application/json",
          token: token,
        },
      }
    );
  } catch (error) {
    console.log("Error occurred while fetching data:", error.message);
    console.log("Data not found for symbol: " + symbol);

    res.status(500).json({ message: "Data not found for symbol: " + symbol });
  }

  if (response.data.s === "no_data") {
    res.status(500).json({ message: "service not available" });
  }

  const sharePrice = response.data.last[0];

  // End

  const indicesWithinTenDays = [];
  const indicesWithNoData = [];

  for (let index = 0; index < expirationsWithinDays.length; index++) {
    expiry_date = expirationsWithinDays[index].date;

    let daysToExpirationDate = 1;
    const startDate = new Date(expiry_date);
    const current = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = Math.abs(current.getTime() - startDate.getTime());

    // Convert the time difference from milliseconds to days
    daysToExpirationDate = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (daysToExpirationDate < 10) {
      // When the expiration date is very close the ROI% gets very large. To avoid this, ...
      indicesWithinTenDays.push(index);
    }

    try {
      const respon = await axios.get(
        `https://api.marketdata.app/v1/options/chain/${symbol}/?expiration=${expiry_date}&side=call&token=${token}`
      );

      if (respon.data.s === "no_data") {
        continue;
      }

      const strike = respon.data.strike;
      const mid = respon.data.mid;

      let ATMindex = 0,
        OTM5index = 0,
        OTM10index = 0;

      for (let index = 1; index < strike.length; index++) {
        // Finding ATM
        const diff1 = Math.abs(sharePrice - strike[ATMindex]);
        const diff2 = Math.abs(sharePrice - strike[index]);

        if (diff2 < diff1 && strike[index] > sharePrice) {
          ATMindex = index;
        }

        const diff3 = Math.abs(
          sharePrice * (1 + otm1Percentage / 100) - strike[OTM5index]
        );
        const diff4 = Math.abs(
          sharePrice * (1 + otm1Percentage / 100) - strike[index]
        );

        if (diff4 < diff3) {
          OTM5index = index;
        }

        const diff5 = Math.abs(
          sharePrice * (1 + otm2Percentage / 100) - strike[OTM10index]
        );
        const diff6 = Math.abs(
          sharePrice * (1 + otm2Percentage / 100) - strike[index]
        );

        if (diff6 < diff5) {
          OTM10index = index;
        }
      }

      const ATM = mid[ATMindex] * 100;
      const OTM5 = mid[OTM5index] * 100;
      const OTM10 = mid[OTM10index] * 100;
      const strikeATM = strike[ATMindex];
      const strikeOTM5 = strike[OTM5index];
      const strikeOTM10 = strike[OTM10index];
      const ROI = ATM / sharePrice;
      const AnnualROI =
        (Math.pow(1 + ROI / 100, 365 / daysToExpirationDate) - 1) * 100;
      const OTM5ROI = OTM5 / sharePrice;
      const OTM5AnnualROI =
        (Math.pow(1 + OTM5ROI / 100, 365 / daysToExpirationDate) - 1) * 100;
      const OTM10ROI = OTM10 / sharePrice;
      const OTM10AnnualROI =
        (Math.pow(1 + OTM10ROI / 100, 365 / daysToExpirationDate) - 1) * 100;

      ATMs.push(parseFloat(ATM.toFixed(0)));
      OTM5s.push(parseFloat(OTM5.toFixed(0)));
      OTM10s.push(parseFloat(OTM10.toFixed(0)));
      strikeATMs.push(parseFloat(strikeATM));
      strikeOTM5s.push(parseFloat(strikeOTM5));
      strikeOTM10s.push(parseFloat(strikeOTM10));
      ROIs.push(parseFloat(ROI.toFixed(2)));
      annualROIs.push(parseFloat(AnnualROI.toFixed(2)));
      OTM5ROIs.push(parseFloat(OTM5ROI.toFixed(2)));
      OTM5annualROIs.push(parseFloat(OTM5AnnualROI.toFixed(2)));
      OTM10ROIs.push(parseFloat(OTM10ROI.toFixed(2)));
      OTM10annualROIs.push(parseFloat(OTM10AnnualROI.toFixed(2)));
    } catch (err) {
      console.log(
        "Error in fetching options chain for " +
          expiry_date +
          ": " +
          err.message
      );

      if (err.response.status != 404) {
        console.log(err.response.status);
        res.status(500).json({ message: "Error in fetching options chain" });
        return;
      } else {
        indicesWithNoData.push(index);
      }
    }
  }

  res.json({
    sharePrice,
    ATMs,
    OTM5s,
    OTM10s,
    strikeATMs,
    strikeOTM5s,
    strikeOTM10s,
    ROIs,
    annualROIs,
    OTM5ROIs,
    OTM5annualROIs,
    OTM10ROIs,
    OTM10annualROIs,
    expiration_dates: expirationsWithinDays,
    indicesWithinTenDays,
    indicesWithNoData,
  });
});

router.get("/getSymbolLists", async (req, res) => {
  const symbolLists = await SymbolList.find({});

  res.status(200).json({ symbolLists });
});

router.post("/getCategory", async (req, res) => {
  const { user } = req.body;

  try {
    const categories = await Category.find({ user_email: user.email });

    res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
