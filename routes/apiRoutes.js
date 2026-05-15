"use strict";

const express = require("express");
const router = express.Router();

router.get("/advice", async (req, res) => {
    try {
        const response = await fetch("https://api.adviceslip.com/advice");
        const data = await response.json();

        res.json({
            advice: data.slip.advice
        });
    } catch (error) {
        res.json({
            advice: "Small steps every day build strong habits."
        });
    }
});

module.exports = router;