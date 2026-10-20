const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const router = express.Router();

const User = require("../models/user");
const UnknownUser = require("../models/unknownUser");
let backendUrl = "http://localhost:5001/";
require("dotenv").config();

if (process.env.NODE_ENV === "production") {
  backendUrl = "";
}

router.post("/trackVisitor", async (req, res) => {
  try {
    const { visitorId } = req.body;

    const existingVisitor = await UnknownUser.findOne({ visitorId });

    if (!existingVisitor) {
      const newVisitor = new UnknownUser({ visitorId });
      await newVisitor.save();
    }

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({ message: error.message });
  }
});

router.post("/checkUser", async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    } else {
      return res.status(200).json({ message: "The same user doesn't exist!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash the pwd
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({
        message: "Unregistered User",
      });
    } else {
      // check password
      bcrypt.compare(password, user.password, (error, isMatch) => {
        if (error) {
          res.status(401).json({ message: error });
        } else if (isMatch) {
          console.log(user.email + "Login success");

          // Create and sign a JWT token
          const token = jwt.sign({ id: user._id }, "secretKey", {
            expiresIn: 7200,
          });

          User.find({})
            .then((users) => {
              res.status(200).json({ token, user, users });
            })
            .catch((err) => {
              res.status(400).json({ message: err.response.data });
            });
        } else {
          // Passwords do not match, user is not authenticated
          console.log("Incorrect password");
          res.status(400).json({ message: "Wrong password" });
        }
      });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server error" });
  }
});

router.post("/updatePassword", async (req, res) => {
  const { newPassword, email } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  User.updateOne(
    { email: email },
    {
      $set: {
        password: hashedPassword,
      },
    }
  )
    .then(() => {
      res
        .status(200)
        .json({ message: "The passwrd has been updated successfully!" });
      console.log("The password has been updated successfully!");
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

router.post("/updateUser", async (req, res) => {
  const { name, email, role, phone } = req.body;

  User.findOneAndUpdate(
    { email: email },
    {
      $set: {
        name: name,
        phone: phone,
        role: role,
      },
    },
    { new: true }
  )
    .then((user) => {
      console.log("updated user:");
      console.log(user);
      res.status(200).json({ user });
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

// Multer configuration
const storage = multer.diskStorage({
  destination: "images/avatars", // Specify the path where you want to save the uploaded files

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.post("/uploadAvatar", upload.single("avatar"), async (req, res) => {
  // router.post("/uploadAvatar", async (req, res) => {
  // Check if a file was provided in the request
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // If you reached here, the file was successfully uploaded
  const uploadedFilePath = req.file.path;
  const { email } = req.body;

  User.findOneAndUpdate(
    { email: email },
    {
      $set: {
        avatar: backendUrl + uploadedFilePath,
      },
    },
    { new: true }
  )
    .then((user) => {
      res.status(200).json({ user });
      console.log(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

module.exports = router;
