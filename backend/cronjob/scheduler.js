const cron = require("node-cron");
const Stock = require("../models/stock");
const SymbolList = require("../models/symbolList");
const axios = require("axios");

require("dotenv").config();

// Define the function to be called periodically
const main = async () => {
  // Place your logic here that you want to execute every few hours
  console.log("Function called every few hours");
  // Call your desired function here
  // Get stock data using alphavantage overview
  // const fs = require("fs");

  // const distinctSectors = await Stock.distinct("sector");
  // const distinctIndustries = await Stock.distinct("industry");
  // // console.log(distinctSectors);
  // // console.log(distinctIndustries);
  // const data = distinctIndustries.join("\n");

  // fs.writeFile("a.txt", data, (err) => {
  //   if (err) {
  //     console.error("Error writing to file:", err);
  //     return;
  //   }
  //   console.log("Data saved to a.txt successfully");
  // });

  const symbolLists = await SymbolList.find({});

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // Function to introduce delay

  const requestsPerMinute = 75; // Number of API requests allowed per minute
  const requestDelay = Math.ceil((60 * 1000) / requestsPerMinute); // Delay between each request in milliseconds
  const length = process.env.NODE_ENV === 'production' ? symbolLists.length : 0;

  for (let index = 0; index < length; index++) {
    const element = symbolLists[index];
    const symbol = element.symbol;

    let response = null;

    try {
      response = await axios.get(
        "https://www.alphavantage.co/query?function=OVERVIEW&symbol=" +
          symbol +
          "&apikey=" +
          process.env.ALPHAVANTAGE_API_KEY
      );

      const sector = response.data.Sector;
      const MarketCapitalization = response.data.MarketCapitalization;
      let Beta1 = response.data.Beta;
      let SharesOutstanding = response.data.SharesOutstanding;
      const industry = response.data.Industry;
      const name = response.data.Name;
      let PERatio = response.data.PERatio;
      let dividend_Yield = response.data.DividendYield;
      let PriceToBookRatio = response.data.PriceToBookRatio;

      console.log(Beta1, PriceToBookRatio);

      if (
        MarketCapitalization === "None" ||
        // Beta1 === "None" ||
        // SharesOutstanding === "None" ||
        // PERatio === "None" ||
        // dividend_Yield === "None" ||
        // PriceToBookRatio === "None" ||
        MarketCapitalization === undefined ||
        MarketCapitalization === "-"
        // Beta1 === undefined ||
        // SharesOutstanding === undefined ||
        // PERatio === undefined ||
        // dividend_Yield === undefined ||
        // PriceToBookRatio === undefined
      ) {
        continue;
      }

      const convertToZeroIfNone = (value) =>
        value === "None" || value === undefined || value === "-"
          ? 0
          : parseFloat(value);
      Beta1 = convertToZeroIfNone(Beta1);
      SharesOutstanding = convertToZeroIfNone(SharesOutstanding);
      PERatio = convertToZeroIfNone(PERatio);
      dividend_Yield = convertToZeroIfNone(dividend_Yield);
      PriceToBookRatio = convertToZeroIfNone(PriceToBookRatio);

      // if (Beta1 === "None" || Beta1 === undefined) {
      //   Beta1 = 0;
      // }

      // if (SharesOutstanding === "None" || SharesOutstanding === undefined) {
      //   SharesOutstanding = 0;
      // }

      // if (PERatio === "None" || PERatio === undefined) {
      //   PERatio = 0;
      // }

      // if (dividend_Yield === "None" || dividend_Yield === undefined) {
      //   dividend_Yield = 0;
      // }

      // if (PriceToBookRatio === "None" || PriceToBookRatio === undefined) {
      //   PriceToBookRatio = 0;
      // }

      const marketCap = parseFloat(MarketCapitalization);
      const beta = parseFloat(Beta1);
      const sharePrice = parseFloat(
        (MarketCapitalization / SharesOutstanding).toFixed(2)
      );
      const PE = parseFloat(PERatio);
      const DividendYield = parseFloat(dividend_Yield);
      const PB = parseFloat(PriceToBookRatio);

      const existingStock = await Stock.findOne({ symbol });

      if (existingStock) {
        Stock.findOneAndUpdate(
          { symbol },
          {
            $set: {
              sector,
              industry,
              marketCap,
              beta,
              sharePrice,
              name,
              PE,
              DividendYield,
              PB,
              date: new Date(),
            },
          },
          { new: true }
        );
      } else {
        const newStock = new Stock({
          symbol,
          sector,
          industry,
          marketCap,
          beta,
          sharePrice,
          name,
          PE,
          DividendYield,
          PB,
          date: new Date(),
        });

        await newStock.save();
      }

      await delay(requestDelay); // Introduce delay between API requests
    } catch (error) {
      console.log("Error occurred while fetching data:", error.message);
    }
  }
};

main();

// Schedule the task to run every one day
// You can modify '0 */8 * * *' to set your desired cron interval
cron.schedule("0 8 * * *", () => {
  // midnight 00:00 in PST
  main();
});
