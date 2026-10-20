const express = require("express");
const router = express.Router();
const axios = require("axios");
const multer = require("multer");
const csv = require("fast-csv");
const moment = require("moment");
const fs = require("fs");

const Expiration = require("../models/expiration");
const Category = require("../models/category");
const SymbolList = require("../models/symbolList");
const Stock = require("../models/stock");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

require("dotenv").config();

router.post("/getCoveredcallPremium", async (req, res) => {
  const { symbols, expiration_date, otm1Percentage, otm2Percentage } = req.body;
  const token = process.env.TOKEN || "";

  let expiry_date = expiration_date;

  // Data to be returned
  const sharePrices = [];
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
  const available_symbols = [];
  // END //

  for (let index = 0; index < symbols.length; index++) {
    const symbol = symbols[index];

    let response = null;

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
      res.status(500).json({ message: "Data not found for symbol" });
      return;
    }

    if (response.data.bid == 0.0) {
      res.status(500).json({ message: "service not available" });
    }

    // sharePrices.push(response.data.bid);

    let daysToExpirationDate = 1;
    const startDate = new Date(expiry_date);
    const current = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = Math.abs(current.getTime() - startDate.getTime());

    // Convert the time difference from milliseconds to days
    daysToExpirationDate = Math.ceil(timeDifference / (1000 * 3600 * 24));

    try {
      const respon = await axios.get(
        `https://api.marketdata.app/v1/options/chain/${symbol}/?expiration=${expiry_date}&side=call&token=${token}`
      );

      if (respon.data.s === "no_data") {
        // res.status(400).json({ message: "Error in fetching options chain" });
        // return;

        continue;
      }

      const sharePrice = response.data.bid;
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

        // const diff3 = Math.abs(sharePrice * 1.05 - strike[OTM5index]);
        const diff3 = Math.abs(
          sharePrice * (1 + otm1Percentage / 100) - strike[OTM5index]
        );
        // const diff4 = Math.abs(sharePrice * 1.05 - strike[index]);
        const diff4 = Math.abs(
          sharePrice * (1 + otm1Percentage / 100) - strike[index]
        );

        if (diff4 < diff3) {
          OTM5index = index;
        }

        // const diff5 = Math.abs(sharePrice * 1.1 - strike[OTM10index]);
        const diff5 = Math.abs(
          sharePrice * (1 + otm2Percentage / 100) - strike[OTM10index]
        );
        // const diff6 = Math.abs(sharePrice * 1.1 - strike[index]);
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

      ATMs.push(ATM.toFixed(0));
      OTM5s.push(OTM5.toFixed(0));
      OTM10s.push(OTM10.toFixed(0));
      strikeATMs.push(strikeATM);
      strikeOTM5s.push(strikeOTM5);
      strikeOTM10s.push(strikeOTM10);
      ROIs.push(ROI.toFixed(2));
      annualROIs.push(AnnualROI.toFixed(2));
      OTM5ROIs.push(OTM5ROI.toFixed(2));
      OTM5annualROIs.push(OTM5AnnualROI.toFixed(2));
      OTM10ROIs.push(OTM10ROI.toFixed(2));
      OTM10annualROIs.push(OTM10AnnualROI.toFixed(2));
      sharePrices.push(response.data.bid);
      available_symbols.push(symbol);
    } catch (err) {
      console.log("Error in fetching options chain: " + err.message);
      if (err.response.status != 404) {
        console.log(err.response.status);
        res.status(500).json({ message: "Error in  fetching options chain" });
        return;
      }
    }
  }

  res.json({
    sharePrices,
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
    expiration_date: expiry_date,
    available_symbols,
  });
});

router.get("/getExpirations", async (req, res) => {
  const expirations = await Expiration.find({});

  res.status(200).json({ expirations });
});

router.get("/getSymbolLists", async (req, res) => {
  const symbolLists = await SymbolList.find({});

  res.status(200).json({ symbolLists });
});

router.post(
  "/uploadExpirations",
  upload.single("expirations"),
  async (req, res) => {
    try {
      await Expiration.deleteMany({});
      const csvData = [];
      csv
        .parseString(req.file.buffer.toString(), { headers: true })
        .on("data", (row) => {
          csvData.push({
            date: row.date,
          });
        })
        .on("end", () => {
          // Save data to MongoDB

          Expiration.insertMany(csvData)
            .then(async () => {
              console.log("expirations has been successfully uploaded!");
              const expirations = await Expiration.find({});
              res.status(200).json({ expirations });
            })
            .catch((err) => {
              res.status(500).json({ message: err.message });
            });
        });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error processing the Excel file" });
    }
  }
);

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

router.post("/addCategory", async (req, res) => {
  const { user, name } = req.body;

  try {
    const existingCategory = await Category.findOne({
      user_email: user.email,
      name,
    });

    if (existingCategory) {
      res.status(200).json({ message: "The same category already exists." });
      return;
    }

    const newCategory = new Category({ user_email: user.email, name });
    await newCategory.save();
    const categories = await Category.find({ user_email: user.email });

    res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

router.post("/updateCategory", async (req, res) => {
  const { user, oldCategoryName, newCategoryName, symbols } = req.body;

  try {
    if (oldCategoryName == newCategoryName) {
      // If the category name changes, change only symbols
      await Category.updateOne(
        { user_email: user.email, name: oldCategoryName },
        {
          $set: {
            symbols: symbols,
          },
        }
      );
    } else {
      // If the category name changes, delete the previous one, and create a new document
      await Category.deleteOne({
        user_email: user.email,
        name: oldCategoryName,
      });

      const newCategory = new Category({
        user_email: user.email,
        name: newCategoryName,
        symbols,
      });

      await newCategory.save();
    }

    const categories = await Category.find({ user_email: user.email });

    res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

router.post("/deleteCategory", async (req, res) => {
  const { user_email, oldName, newName } = req.body;

  try {
    const existingCategory = await Category.findOne({
      user_email,
      name: oldName,
    });

    // We don't know if user saved change of category name
    if (existingCategory) {
      await Category.deleteOne({ name: oldName, user_email });
    } else {
      await Category.deleteOne({ name: newName, user_email });
    }

    const categories = await Category.find({ user_email });

    res.status(200).json({ categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
});

router.post("/getWeeklyExpiryDates", async (req, res) => {
  const commonDates = {};
  const { symbols } = req.body;
  const token = process.env.TOKEN || "";

  for (let index = 0; index < symbols.length; index++) {
    const symbol = symbols[index];

    try {
      const response = await axios.get(
        "https://api.marketdata.app/v1/options/expirations/" + symbol,
        {
          params: {
            Accept: "application/json",
            token: token,
          },
        }
      );

      const dates = response.data.expirations; // Assuming response.data is an array of dates

      // Collect dates into commonDates object
      dates.forEach((date) => {
        if (commonDates[date]) {
          commonDates[date]++;
        } else {
          commonDates[date] = 1;
        }
      });
    } catch (err) {
      if (err.response.status === 404) {
        continue;
      }

      console.log(err);
      res.status(500).json({ message: "server error" });
    }
  }

  // Filter out dates that are present for all symbols
  // const commonDatesArray = Object.keys(commonDates).filter(
  //   (date) => commonDates[date] === symbols.length
  // );
  const dates = Object.keys(commonDates);

  // Filter out dates which are within the next 45 days
  // const next45DaysDates = commonDatesArray.filter((date) => {
  const next45DaysDates = dates.filter((date) => {
    const targetDate = new Date(date);
    const currentDate = new Date();
    const daysDifference = Math.ceil(
      (targetDate - currentDate) / (1000 * 60 * 60 * 24)
    );

    return daysDifference >= 0 && daysDifference <= 45;
  });

  const formatChanged = next45DaysDates.map((item) => {
    const [year, month, day] = item.split("-");
    return `${parseInt(month)}/${parseInt(day)}/${year}`;
  });

  res.status(200).json({ weeklyExpiryDates: formatChanged });
});

// Upload symbol list using CSV
router.post(
  "/uploadSymbolLists",
  upload.single("symbolFile"),
  async (req, res) => {
    try {
      await SymbolList.deleteMany({});
      const csvData = [];

      csv
        .parseString(req.file.buffer.toString(), { headers: true })
        .on("data", (row) => {
          if (row.assetType === "Stock") {
            csvData.push({
              symbol: row.symbol,
              status: row.status,
            });
          }
        })
        .on("end", () => {
          // Save data to MongoDB

          SymbolList.insertMany(csvData)
            .then(async () => {
              console.log("SymbolLists has been successfully uploaded!");
              const symbolLists = await SymbolList.find({});
              res.status(200).json({ symbolLists });
            })
            .catch((err) => {
              res.status(500).json({ message: err.message });
            });
        });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error processing the Excel file" });
    }
  }
);

router.post("/getBasicResult", async (req, res) => {
  let industries = [];
  const {
    sectors,
    betas,
    minMarketCap,
    maxMarketCap,
    minSharePrice,
    maxSharePrice,
    minPE,
    maxPE,
    // divYield,
    minDivYield,
    maxDivYield,
    minPB,
    maxPB,
  } = req.body;

  const jsonData = fs.readFileSync("sectorsData.json", "utf8");
  const allSectors = JSON.parse(jsonData);

  sectors.forEach((sector) => {
    industries = [...industries, ...allSectors[sector]];
  });

  const beta = {
    Low: { $lt: 0.9 },
    Mid: { $gte: 0.9, $lte: 1.1 },
    High: { $gt: 1.1 },
  };

  const betaQuery = betas.map((category) => ({ beta: beta[category] }));
  // let divYieldQuery;

  // switch (divYield) {
  //   case 0:
  //     divYieldQuery = { $eq: 0 };
  //     break;

  //   case 1:
  //     divYieldQuery = { $gt: 0, $lte: 0.02 };
  //     break;

  //   case 2:
  //     divYieldQuery = { $gt: 0.02, $lte: 0.05 };
  //     break;

  //   case 3:
  //     divYieldQuery = { $gt: 0.05, $lte: 0.07 };
  //     break;

  //   case 4:
  //     divYieldQuery = { $gt: 0.07 };
  //     break;

  //   default:
  //     break;
  // }

  const minMarketCapQuery = convertStringToNumber(minMarketCap);
  const maxMarketCapQuery = convertStringToNumber(maxMarketCap);

  const basicFilterResult = await Stock.find({
    industry: { $in: industries },
    sharePrice: { $gte: minSharePrice, $lte: maxSharePrice },
    marketCap: { $gte: minMarketCapQuery, $lte: maxMarketCapQuery },
    PE: { $gte: minPE, $lte: maxPE },
    PB: { $gte: minPB, $lte: maxPB },
    $or: betaQuery,
    DividendYield: { $gte: minDivYield / 100, $lte: maxDivYield / 100 },
  });

  res.status(200).json({ basicFilterResult });
});

const convertStringToNumber = (str) => {
  const suffixes = {
    B: 1e9, // Billion
    M: 1e6, // Million
    T: 1e12, // Trillion
  };

  // Extract the numeric part of the string
  const numericPart = parseFloat(str);

  // Extract the suffix from the string
  const suffix = str.charAt(str.length - 1).toUpperCase();

  // Check if the suffix is valid
  if (suffixes.hasOwnProperty(suffix)) {
    // Multiply the numeric part by the corresponding scale factor
    return numericPart * suffixes[suffix];
  } else {
    // If the suffix is not valid, return NaN (Not a Number)
    return NaN;
  }
};

router.post("/getOptions", async (req, res) => {
  const {
    selectedStrikePriceType,
    expiryDate,
    minPremium,
    minTradeROI,
    minAnnualROI,
    minOI,
    maxSpread,
    symbolsForOptionsFilter,
  } = req.body;

  const premiums = [];
  const ROIs = [];
  const annualROIs = [];
  const OIs = [];
  const BAs = [];
  const sharePrices = [];
  const strikePrices = [];
  const IVs = [];
  const expiry_dates = [];
  const filteredSymbols = [];
  const token = process.env.TOKEN || "";

  for (let index = 0; index < symbolsForOptionsFilter.length; index++) {
    const symbol = symbolsForOptionsFilter[index];

    let response = null;

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

      if (error.response.status == 404) {
        continue;
      }
      res.status(500).json({ message: "Data not found for symbol" });
      return;
    }

    if (response.data.bid == 0.0) {
      res.status(500).json({ message: "service not available" });
    }

    let daysToExpirationDate = 1;
    const startDate = new Date(expiryDate);
    const current = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = Math.abs(current.getTime() - startDate.getTime());

    // Convert the time difference from milliseconds to days
    daysToExpirationDate = Math.ceil(timeDifference / (1000 * 3600 * 24));

    try {
      const respon = await axios.get(
        `https://api.marketdata.app/v1/options/chain/${symbol}/?expiration=${expiryDate}&side=call&token=${token}`
      );

      if (respon.data.s === "no_data") {
        continue;
      }

      const sharePrice = response.data.bid[0];
      const strike = respon.data.strike;
      const mid = respon.data.mid;
      const openInterest = respon.data.openInterest;
      const impliedVolatility = respon.data.iv;
      const bid = respon.data.iv;
      const ask = respon.data.ask;

      let OTMindex = 0;
      let OTMpercent = 0;

      switch (selectedStrikePriceType) {
        case "ATM":
          OTMpercent = 0;
          break;

        case "5% OTM":
          OTMpercent = 5;
          break;

        case "10% OTM":
          OTMpercent = 10;
          break;

        default:
          break;
      }

      for (let index = 1; index < strike.length; index++) {
        // Finding ATM
        const diff1 = Math.abs(
          sharePrice * (1 + OTMpercent / 100) - strike[OTMindex]
        );
        // const diff4 = Math.abs(sharePrice * 1.05 - strike[index]);
        const diff2 = Math.abs(
          sharePrice * (1 + OTMpercent / 100) - strike[index]
        );

        if (diff2 < diff1 && strike[index] > sharePrice) {
          OTMindex = index;
        }
      }

      const premium = mid[OTMindex] * 100;
      const strikePrice = strike[OTMindex];
      const ROI = premium / sharePrice;
      const annualROI =
        (Math.pow(1 + ROI / 100, 365 / daysToExpirationDate) - 1) * 100;
      const OI = openInterest[OTMindex];
      const iv = impliedVolatility[OTMindex];
      const BA = (bid[OTMindex] / ask[OTMindex]) * 100;

      if (
        premium < minPremium ||
        ROI < minTradeROI ||
        annualROI < minAnnualROI ||
        OI < minOI
      ) {
        continue;
      }

      switch (maxSpread) {
        case "All":
          break;

        case "Narrow":
          if (!(BA > 0 && BA <= 1)) {
            continue;
          }

          break;

        case "Moderate":
          if (!(BA > 1 && BA <= 2.5)) {
            continue;
          }

          break;

        case "Wide":
          if (!(BA > 2.5 && BA <= 5)) {
            console.log("test");
            continue;
          }

          break;

        case "Very Wide":
          if (!(BA > 5)) {
            continue;
          }

          break;

        default:
          break;
      }

      sharePrices.push(sharePrice);
      expiry_dates.push(expiryDate);
      strikePrices.push(strikePrice);
      premiums.push(premium.toFixed(0));
      ROIs.push(ROI.toFixed(2));
      annualROIs.push(annualROI.toFixed(2));
      OIs.push(OI);
      IVs.push(iv.toFixed(2));
      BAs.push(BA.toFixed(2));
      filteredSymbols.push(symbol);
    } catch (err) {
      console.log("Error in fetching options chain: " + err.message);
      if (err.response.status != 404) {
        console.log(err.response.status);
        res.status(500).json({ message: "Error in  fetching options chain" });
        return;
      }
    }
  }

  // console.log({
  //   symbols: filteredSymbols,
  //   sharePrices,
  //   expiry_dates,
  //   strikePrices,
  //   premiums,
  //   ROIs,
  //   annualROIs,
  //   OIs,
  //   IVs,
  //   BAs,
  // });

  res.status(200).json({
    optionFilterResult: {
      symbols: filteredSymbols,
      sharePrices,
      expiry_dates,
      strikePrices,
      premiums,
      ROIs,
      annualROIs,
      OIs,
      IVs,
    },
  });
});

router.get("/getStocks", async (req, res) => {
  const stocks = await Stock.find({});

  res.status(200).json({ stocks });
});

router.post("/getSearchResult", async (req, res) => {
  const {
    industries,
    betas,
    minMarketCap,
    maxMarketCap,
    minSharePrice,
    maxSharePrice,
    minPE,
    maxPE,
    minDivYield,
    maxDivYield,
    minPB,
    maxPB,
  } = req.body;

  const beta = {
    Low: { $lt: 0.9 },
    Mid: { $gte: 0.9, $lte: 1.1 },
    High: { $gt: 1.1 },
  };

  const betaQuery = betas.map((category) => ({ beta: beta[category] }));

  const minMarketCapQuery = convertStringToNumber(minMarketCap);
  const maxMarketCapQuery = convertStringToNumber(maxMarketCap);

  const searchFilterResult = await Stock.find({
    industry: { $in: industries },
    sharePrice: { $gte: minSharePrice, $lte: maxSharePrice },
    marketCap: { $gte: minMarketCapQuery, $lte: maxMarketCapQuery },
    PE: { $gte: minPE, $lte: maxPE },
    PB: { $gte: minPB, $lte: maxPB },
    $or: betaQuery,
    DividendYield: { $gte: minDivYield / 100, $lte: maxDivYield / 100 },
  });

  res.status(200).json({ searchFilterResult });
});

module.exports = router;
