const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const taskRoutes = require('./routes/taskRoutes');

app.use(express.json());

// Add your routes and middleware here
app.use('/api', taskRoutes);

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message: err.message,
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
