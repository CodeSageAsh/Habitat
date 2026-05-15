"use strict";

const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    goal: {
        type: String,
        required: true
    },
    streak: {
        type: Number,
        required: true
    },
    note: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    }
});

const Habit = mongoose.model("Habit", habitSchema);

module.exports = Habit;