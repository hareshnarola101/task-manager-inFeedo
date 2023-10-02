const { Task } = require('../models');
const { Op } = require('sequelize');
const { validationResult, matchedData } =  require("express-validator"); 


const validation_result = validationResult.withDefaults({
    formatter: (error) => error.msg,
});




const validation = (req, res, next) => {
const errors = validation_result(req).mapped();
if (Object.keys(errors).length) {
    return res.status(422).json({
        ok: false,
        status: 422,
        errors,
    });
}
next();
};

const getAllTasks = async (req, res, next) => {
    
try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = Number((page - 1) * limit);
    
    
    const tasks = await Task.findAndCountAll({
    limit,
    offset,
    });

    tasks.per_page = limit;
    tasks.page_numer = page;
   
    res.status(200).json({
    ok: true,
    status: 200,
    
    data: tasks});
} catch (error) {
    next(error);

//   console.error(error);
//   res.status(500).json({ error: 'Internal Server Error' });
}
};
    

const createTask = async (req, res, next) => {
try {
    const { title, description, status } = req.body;

    if (!title || !status) {
    return res.status(400).json({ 
        ok: false,
        status: 400,
        message: 'Title and status are required' });
    }

    const newTask = await Task.create({
    title,
    description,
    status,
    });

    return res.status(200).json({
        ok: true,
        status: 200,
        message: "Task has been created successfully",
        data: newTask
    });
} catch (error) {
    next(error);
//   console.error(error);
//   return res.status(500).json({ error: 'Internal Server Error' });
}
};

const updateTask = async (req, res, next) => {
try {
    const taskId = req.params.id;
    const { title, description, status } = req.body;

    // Validate input data
    if (!title || !status) {
    return res.status(400).json(
        { 
            ok: false,
            status: 400,
            message: 'Title and status are required'
        });
    }

    const task = await Task.findByPk(taskId);

    if (!task) {
    return res.status(404).json(
        { 
            ok: false,
            status: 404,
            message: 'Task not found'
        });
    }

    // Update task attributes
    task.title = title;
    task.description = description;
    task.status = status;

    await task.save();

    return res.status(200).json({
    ok: true,
    status: 200,
    message: "Task updated successfully",
    data: task}); 
} catch (error) {
    next(error);
//   console.error(error);
//   return res.status(500).json({ error: 'Internal Server Error' });
}
};

const deleteTask = async (req, res, next) => {
try {
    const taskId = req.params.id;

    const task = await Task.findByPk(taskId);

    if (!task) {
    return res.status(404).json({ 
        ok: false,
        status: 404,
        message: 'Task not found'
    });
    }

    await task.destroy();

    return res.status(200).json({
    ok: true,
    status: 200,
    message: "Task has been deleted successfully",
    }); // No content response for successful deletion
} catch (error) {
    next(error);
//   console.error(error);
//   return res.status(500).json({ error: 'Internal Server Error' });
}
};

const calculateTaskMetrics = async (req, res, next) => {
try {
    // Fetch all tasks from the database
    const tasks = await Task.findAll();
    const total_open_tasks = await Task.findAll({where: { status: 'open' },});
    const total_inprogress_tasks = await Task.findAll({where: { status: 'inprogress' },});
    const total_completed_tasks = await Task.findAll({where: { status: 'completed' },});
    // Initialize an empty metrics object
    const metrics = {};

    // Process tasks to calculate metrics
    tasks.forEach((task) => {
    const isoDateString = task.createdAt;
    const date = new Date(isoDateString);
    const options = { year: 'numeric', month: 'long' };
    const dateKey = date.toLocaleDateString(undefined, options); // Extract date without time
    const status = task.status;

    // Initialize metrics for the date if it doesn't exist
    if (!metrics[dateKey]) {
        metrics[dateKey] = {
        open_tasks: 0,
        inprogress_tasks: 0,
        completed_tasks: 0,
        };
    }

    // Increment the count for the corresponding status
    metrics[dateKey][status + '_tasks']++;
    });

    // Convert metrics object to an array of objects with date and metrics
    const metricsArray = Object.entries(metrics).map(([date, data]) => ({
        date,
        metrics: data,
      }));
      
    return res.status(200).json({
    ok: true,
    status: 200,
    message: "Task metrics",
    data: {
        total_open_tasks: total_open_tasks.length,
        total_inprogress_tasks: total_inprogress_tasks.length,
        total_completed_tasks: total_completed_tasks.length,
        metricsArray: metricsArray
    }
    });

} catch (error) {
    next(error);
//   console.error(error);
//   throw error;
}
}




module.exports = {
    validation,
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
    calculateTaskMetrics
  };

  
  
  