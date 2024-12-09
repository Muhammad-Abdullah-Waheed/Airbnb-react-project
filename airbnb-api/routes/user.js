const express = require("express");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password, name, usernumber } = req.body;

  // Basic validation
  if (!email || !password || !name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create and save the user
    const user = new User({
      email,
      password,
      name,
      usernumber,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create a JWT token upon successful login
    const token = await jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.cookie("token", token).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});





router.get('/profile', async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: 'Token is not provided' });
  }

  try {
    // Verify the JWT token
    const userdata = jwt.verify(token, process.env.JWT_SECRET);
    // Ensure the token contains an ID
    if (!userdata.id) {
      return res.status(400).json({ message: 'Invalid token: User ID not found' });
    }

    // Query the user from the database
    const user = await User.findOne({ _id: userdata.id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user data
    return res.json(user);
  } catch (err) {
    console.error('Error verifying token or querying user:', err);
    return res.status(500).json({ message: 'An error occurred' });
  }
});


router.get('/logout',(req,res)=>{
  res.clearCookie('token').send('Logged out successfully');
});









// eVfcTffHXvqfIHTu

module.exports = router;

//                mongodb+srv://abdullah:eVfcTffHXvqfIHTu@cluster0.s6f77.mongodb.net/sample_airbnb
