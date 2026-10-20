const express = require("express");
const moment = require("moment-timezone");

const router = express.Router();
const User = require("../models/user");
const PageClickCount = require("../models/pageClickCount");
const TickersSearch = require("../models/tickersSearch");
const UnknownUser = require("../models/unknownUser");

router.post("/getAnalyticsData", async (req, res) => {
  const activeUsers = [0, 0, 0];
  const newAccounts = [0, 0, 0];
  let pagesClicked = [];
  let tickersSearched = [];
  const { timeFrame } = req.body;

  try {
    // active & unknown users
    activeUsers[0] = (await UnknownUser.find({})).length;
    // Active users
    activeUsers[1] = // The count of active users for free trial
      (await User.find({ type: "Free" })).length;
    // The count of active & paid users
    activeUsers[2] = await User.countDocuments({
      type: "Paid",
    });

    let recentFreeUsers, recentPaidUsers;

    // Convert current date to CST timezone
    const cstTimeZone = "America/Chicago";
    const currentDateCST = moment.tz(moment(), cstTimeZone);
    const freeUsers = await User.find({ type: "Free" })
      .sort({ created_at: -1 }) // Sort by createdAt in descending order
      .limit(10); // Limit the results to the last 10 users
    const paidUsers = await User.find({ type: "Paid" })
      .sort({ created_at: -1 }) // Sort by createdAt in descending order
      .limit(10);

    // New accounts
    switch (timeFrame) {
      case "7 days":
        const sevenDaysAgoCST = moment(currentDateCST).subtract(7, "days");
        // sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        recentFreeUsers = await User.find({
          created_at: { $gte: sevenDaysAgoCST.toDate() },
          type: "Free",
        });
        recentPaidUsers = await User.find({
          created_at: { $gte: sevenDaysAgoCST.toDate() },
          type: "Paid",
        });

        tickersSearched = await TickersSearch.find({
          date: { $gte: sevenDaysAgoCST.toDate() },
        });

        newAccounts[1] = recentFreeUsers.length;
        newAccounts[2] = recentPaidUsers.length;
        break;

      case "30 days":
        const thirtyDaysAgoCST = moment(currentDateCST).subtract(30, "days");
        // thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        recentFreeUsers = await User.find({
          created_at: { $gte: thirtyDaysAgoCST.toDate() },
          type: "Free",
        });
        recentPaidUsers = await User.find({
          created_at: { $gte: thirtyDaysAgoCST.toDate() },
          type: "Paid",
        });

        tickersSearched = await TickersSearch.find({
          date: { $gte: thirtyDaysAgoCST.toDate() },
        });

        newAccounts[1] = recentFreeUsers.length;
        newAccounts[2] = recentPaidUsers.length;
        break;

      case "All time":
        recentFreeUsers = await User.find({
          type: "Free",
        });
        recentPaidUsers = await User.find({
          type: "Paid",
        });

        tickersSearched = await TickersSearch.find({});

        newAccounts[1] = recentFreeUsers.length;
        newAccounts[2] = recentPaidUsers.length;
        break;

      default:
        break;
    }

    tickersSearched = await aggregateTickers(tickersSearched);

    // Pages clicked
    pagesClicked = await PageClickCount.find({});

    res.status(200).json({
      activeUsers,
      newAccounts,
      pagesClicked,
      tickersSearched,
      freeUsers,
      paidUsers,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.post("/increasePageClickCount", async (req, res) => {
  const { page, userType } = req.body;

  try {
    const existingPage = await PageClickCount.findOne({ page, userType });

    if (existingPage) {
      const clickCount = existingPage.clickCount;

      await PageClickCount.findOneAndUpdate(
        { page, userType },
        {
          $set: {
            clickCount: clickCount + 1,
          },
        }
      );
    } else {
      const newPageClickCount = new PageClickCount({ page, userType });

      await newPageClickCount.save();
    }

    res.status(200).json({
      message: "success",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "server error: " + error.message,
    });
  }
});

const aggregateTickers = async (tickers) => {
  try {
    const symbolCounts = tickers.reduce((acc, item) => {
      if (acc[item.symbol]) {
        acc[item.symbol] += item.count;
      } else {
        acc[item.symbol] = item.count;
      }
      return acc;
    }, {});

    const uniqueTickers = Object.entries(symbolCounts)
      .map(([symbol, count]) => ({ symbol, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 25); // Sort by count in descending order
    return uniqueTickers;
  } catch (error) {
    console.error("Error fetching tickers:", error);
    return [];
  }
};

module.exports = router;
