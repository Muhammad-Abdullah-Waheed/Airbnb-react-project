// index.js
const express = require("express");
const app = express();


const cors = require("cors"); // Enable CORS for cross-origin requests

const globals = require("./globals");
const cookieParser = require("cookie-parser");

const mongoose = require("mongoose");
const dotenv = require("dotenv");

const UserRoute = require("./routes/user");
const ListingRoute = require("./routes/listings");

dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: globals.originalConnectionString, // Only allow requests from the frontend application
    credentials: true, // Enable sending cookies over the request/response cycle
  })
);
app.use(cookieParser());

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,  
      useUnifiedTopology: true,
      dbName: 'sample_airbnb'
    });
    console.log("Connected to MongoDB Atlas from Abdullah's computer");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
connectToMongoDB();

app.use("/api",UserRoute );
app.use("/api",ListingRoute );




// fasb4uudrsOZ1iHG
// Define a route
app.get("/test", (req, res) => {
  res.json("test ok");
});

// eVfcTffHXvqfIHTu

// Start the server
app.listen(globals.port, () => {
  console.log("Server is running on port 4000");
});
