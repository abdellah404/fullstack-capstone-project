const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const connectToDatabase = require("../models/db");
const router = express.Router();
const dotenv = require("dotenv");
const pino = require("pino"); // Import Pino logger

const logger = pino(); // Create a Pino logger instance
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = await db.collection("users");
    const user = await collection.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hash = bcryptjs.hashSync(req.body.password, 10);
    const newUser = await collection.insertOne({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash,
      createdAt: new Date(),
    });

    const payload = {
      user: {
        id: newUser.insertedId,
      },
    };

    const authtoken = jwt.sign(payload, JWT_SECRET);
    logger.info("User registered successfully");
    res.json({ authtoken, email: req.body.email });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error" + err);
  }
});


router.post('/login', async (req, res) => {

    try {
        const db = await connectToDatabase();
        const collection = await db.collection("users");
        const user = await collection.findOne({ email: req.body.email });
        if (!user) {
            logger.error('User not found');
            return res.status(400).json({ message: "User not found or not registred yet" });
        }
        else {
            const isMatch = bcryptjs.compareSync(req.body.password, user.password);
            if (!isMatch) {
                logger.error('Passwords do not match');
                return res.status(404).json({ message: "Invalid Password" });
            }
            const payload = {
                user: {
                    id: user._id,
                },
            };
            const authtoken = jwt.sign(payload, JWT_SECRET);
            logger.info("User logged in successfully");
            res.json({ authtoken, email: req.body.email , firstName: user.firstName });
        }
            
} catch (err) {
    res.status(500).send("Internal Server Error" + err);
}}

);



router.put('/update', async (req, res) => {
    // Task 2: Validate the input using `validationResult` and return approiate message if there is an error;
    const errors = validationResult(req);
if (!errors.isEmpty()) {
  logger.error('Validation errors in update request', errors.array());
  return res.status(400).json({ errors: errors.array() });
}

try {
    // Task 3: Check if `email` is present in the header and throw an appropriate error message if not present.
    const email = req.headers.email;

    if (!email) {
        logger.error('Email not found in the request headers');
        return res.status(400).json({ error: "Email not found in the request headers" });
    }
    // Task 4: Connect to MongoDB
    const db = await connectToDatabase();
    // Task 5: find user credentials in database
        const collection = db.collection("users");



    existingUser.updatedAt = new Date();

    // Task 6: update user credentials in database
    const updatedUser = await collection.findOneAndUpdate(
        { email },
        { $set: existingUser },
        { returnDocument: 'after' }
    );    // Task 7: create JWT authentication using secret key from .env file
    const payload = {
        user: {
            id: existingUser._id.toString(),
        },
    };
    const authtoken = jwt.sign(payload, JWT_SECRET);
    res.json({authtoken});
} catch (e) {
     return res.status(500).send('Internal server error');

}
});
module.exports = router;
