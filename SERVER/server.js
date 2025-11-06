const express = require("express");
const cors = require("cors");
// const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const {routesInit} = require("./routes/configRoutes")

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
// app.use(morgan("dev"));

const connectDB = require("./config/db");
connectDB();

routesInit(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
