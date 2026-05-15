"use strict";

require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const habitRoutes = require("./routes/habitRoutes");
const apiRoutes = require("./routes/apiRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));


mongoose.connect(process.env.MONGO_URI, {
    family: 4
})
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(error => {
        console.log("MongoDB connection error:", error.message);
    });

app.use("/", habitRoutes);
app.use("/api", apiRoutes);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});