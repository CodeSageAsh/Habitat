"use strict";

const express = require("express");
const router = express.Router();

const Habit = require("../models/Habit");

function getStrength(streak) {
    if (streak >= 30) {
        return "Master";
    } else if (streak >= 20) {
        return "Strong";
    } else if (streak >= 10) {
        return "Steady";
    } else if (streak >= 5) {
        return "Building";
    } else {
        return "Novice";
    }
}

router.get("/", async (req, res) => {
    try {
        const habits = await Habit.find({ active: true });

        res.render("index", {
            habits: habits,
            getStrength: getStrength
        });
    } catch (error) {
        console.log("Home habits error:", error.message);
        res.render("index", {
            habits: [],
            getStrength: getStrength
        });
    }
});

router.get("/habits/add", (req, res) => {
    res.render("addHabit");
});

router.post("/habits/add", async (req, res) => {
    try {
        const habit = new Habit({
            name: req.body.name,
            category: req.body.category,
            goal: req.body.goal,
            streak: Number(req.body.streak),
            note: req.body.note,
            active: true
        });

        await habit.save();

        res.redirect("/habits");
    } catch (error) {
        console.log("Save habit error:", error.message);
        res.send("There was a problem saving the habit.");
    }
});

router.get("/habits", async (req, res) => {
    try {
        let filter = req.query.filter;
        let search = {};

        if (filter === "active") {
            search.active = true;
        } else if (filter === "inactive") {
            search.active = false;
        } else {
            filter = "all";
        }

        const habits = await Habit.find(search);

        res.render("habits", {
            habits: habits,
            filter: filter,
            getStrength: getStrength
        });
    } catch (error) {
        console.log("Load habits error:", error.message);
        res.send("There was a problem loading the habits.");
    }
});

router.post("/habits/:id/increment", async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);

        if (habit) {
            habit.streak = habit.streak + 1;
            await habit.save();
        }

        res.redirect(req.get("Referrer") || "/habits");
    } catch (error) {
        console.log("Increment streak error:", error.message);
        res.send("There was a problem updating the streak.");
    }
});

router.post("/habits/:id/toggle", async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);

        if (habit) {
            habit.active = !habit.active;
            await habit.save();
        }

        res.redirect(req.get("Referrer") || "/habits");
    } catch (error) {
        console.log("Toggle habit error:", error.message);
        res.send("There was a problem updating the habit.");
    }
});

router.get("/habits/:id/edit", async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);

        if (habit) {
            res.render("editHabit", { habit: habit });
        } else {
            res.send("Habit not found.");
        }
    } catch (error) {
        console.log("Edit page error:", error.message);
        res.send("There was a problem loading the edit page.");
    }
});

router.post("/habits/:id/edit", async (req, res) => {
    try {
        await Habit.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            category: req.body.category,
            goal: req.body.goal,
            streak: Number(req.body.streak),
            note: req.body.note
        });

        res.redirect("/habits");
    } catch (error) {
        console.log("Edit habit error:", error.message);
        res.send("There was a problem updating the habit.");
    }
});

router.post("/habits/:id/delete", async (req, res) => {
    try {
        await Habit.findByIdAndDelete(req.params.id);

        res.redirect("/habits");
    } catch (error) {
        console.log("Delete habit error:", error.message);
        res.send("There was a problem deleting the habit.");
    }
});

module.exports = router;