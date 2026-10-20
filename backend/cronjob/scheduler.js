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

  for (let index = 0; index < symbolLists.length; index++) {
  // for (let index = 0; index < 0; index++) {
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
      const Beta1 = response.data.Beta;
      const SharesOutstanding = response.data.SharesOutstanding;
      const industry = response.data.Industry;
      const name = response.data.Name;

      console.log(Beta1);

      if (
        MarketCapitalization === "None" ||
        Beta1 === "None" ||
        SharesOutstanding === "None" ||
        MarketCapitalization === undefined ||
        Beta1 === undefined ||
        SharesOutstanding === undefined
      ) {
        continue;
      }

      const marketCap = parseFloat(MarketCapitalization);
      const beta = parseFloat(Beta1);
      const sharePrice = parseFloat(
        (MarketCapitalization / SharesOutstanding).toFixed(2)
      );

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

// Schedule the task to run every 3 hours
// You can modify '0 */8 * * *' to set your desired cron interval
cron.schedule("0 8 * * *", () => {
  // midnight 00:00 in PST
  main();
});
