const express = require('express');
const router = express.Router();
const { body, param } = require("express-validator");
const taskController = require('../controllers/taskController'); 

// Get all tasks
router.get('/tasks', taskController.getAllTasks);

// Create a Task
router.post('/tasks',
[
    body("title", "Must not be empty.").trim().not().isEmpty().escape(),
    body("description", "Must not be empty.").trim().not().isEmpty().escape(),
    body("status", "Must not be empty.").trim().not().isEmpty().escape(),
],
taskController.validation,
taskController.createTask);

// Update a Task
router.put('/tasks/:id',
[
    // body("id", "Invalid task ID").isNumeric().toInt(),
    body("title", "Must not be empty.")
        .optional()
        .trim()
        .not()
        .isEmpty()
        .escape(),
    body("description", "Must not be empty.")
        .optional()
        .trim()
        .not()
        .isEmpty()
        .escape(),
    body("status", "Must not be empty.")
        .optional()
        .trim()
        .not()
        .isEmpty()
        .escape(),
],
taskController.validation,
taskController.updateTask);

// Delete a Task
router.delete('/tasks/:id',
taskController.validation,
taskController.deleteTask);

router.get('/task-metrics', taskController.calculateTaskMetrics);

module.exports = router;
