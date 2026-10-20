const checkScreenerCalculationLimit = (req, res, next) => {
  const calculationCookie = req.cookies.screener_calculationCount;
  const { isAuthenticated, subscriptionStatus } = req.body;

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  let calculationData;

  if (calculationCookie) {
    calculationData = JSON.parse(calculationCookie);
  } else {
    calculationData = { putCount: 0, date: today };
  }

  if (calculationData.date !== today) {
    calculationData.putCount = 0;
    calculationData.date = today;
  }

  // if (calculationData.putCount >= 3) {
  //   return res
  //     .status(403)
  //     .json({ message: "Calculation limit exceeded for today" });
  // }

  if (!isAuthenticated || subscriptionStatus === "trial_expired") {
    //If unknown user/trial_expired_user sends a request
    calculationData.putCount += 1;

    if (calculationData.putCount > 3) {
      return res
        .status(403)
        .json({ message: "Calculation limit exceeded for today" });
    }
  }

  res.cookie("screener_calculationCount", JSON.stringify(calculationData), {
    httpOnly: true,
  });

  next();
};

module.exports = checkScreenerCalculationLimit;
