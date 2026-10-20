const checkCallCalculationLimit = (req, res, next) => {
  const calculationCookie = req.cookies.call_calculationCount;
  const { isAuthenticated, subscriptionStatus } = req.body;
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  let calculationData;

  if (calculationCookie) {
    calculationData = JSON.parse(calculationCookie);
  } else {
    calculationData = { count: 0, date: today };
  }

  if (calculationData.date !== today) {
    calculationData.count = 0;
    calculationData.date = today;
  }

  if (!isAuthenticated || subscriptionStatus === 'trial_expired') { // If unknown/trial_expired user sends a request
    calculationData.count += 1;

    if (calculationData.count > 3) {
      return res
        .status(403)
        .json({ message: "Calculation limit exceeded for today" });
    }
  }

  res.cookie("call_calculationCount", JSON.stringify(calculationData), {
    httpOnly: true,
  });

  next();
};

module.exports = checkCallCalculationLimit;
