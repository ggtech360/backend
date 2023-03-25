const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = "yoyoyoyoyoyo";

const router = express.Router();

//ROUTE 1: Create a user using:POST "api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("name", "Enter a valid name").isLength({ min: 5 }),
    body("password", "Password must be atleast 8 characters long").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    let success = false;
    // If there is any error or not.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    // Check if the email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "A user with this email is already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // Create a User
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      //   res.json({ success: "User Created..." });
      success = true;
      res.json({success, authToken });
    } catch (error) {
      console.error(error);
      res.status(500).send("Something is wrong.");
    }
  }
);

//ROUTE 2: Authenticate user using:POST "api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password can't be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there is any error or not.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    // Check Email or Password and Match them with server to Authenticate
    const { email, password } = req.body;
    try {
      // Check if user email exists or not
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please enter correct credentials." });
      }

      //   Check password of user is correct or not
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ success, error: "Please enter correct credentials." });
      }

      //   send authtoken as response
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authToken });
    } catch (error) {
      // Send bad request if there is any error
      console.error(error);
      res.status(500).send("Something is wrong. Internal error");
    }
  }
);

// ROUTE 3: Get Logged in user details using:POST "/api/auth/getuser". Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something is wrong. Internal error");
  }
});

module.exports = router;
