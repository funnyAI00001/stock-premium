const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

require("./cronjob/scheduler");
require("dotenv").config();

let mongoConnectionUrl = "mongodb://127.0.0.1:27017/stock_app_second";

if (process.env.NODE_ENV === "production") {
  mongoConnectionUrl = process.env.MONGO_URL;
}

mongoose
  .connect(mongoConnectionUrl, {
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log(err));

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.NODE_ENV === "production"? "https://premium.coverd.io": "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/stock", require("./routes/stock"));
app.use("/api/stripe", require("./routes/stripe"));
app.use("/api/profitHorizon", require("./routes/profitHorizon"));
app.use("/api/admin", require("./routes/admin"));

app.use("/images", express.static(path.join(__dirname, "images")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../frontend", "build")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../frontend", "build", "index.html"),
      function (err) {
        if (err) {
          res.status(500).send(err);
        }
      }
    );
  });
}

// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
