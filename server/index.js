require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Task = require('./Task');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

app.get('/', (req, res) => {
    res.send('TaskFlow Backend is running!');
});

app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});
app.post('/api/tasks', async (req, res) => {
    const newTask = await Task.create(req.body);
    res.status(201).json(newTask);
});
app.put('/api/tasks/:id', async(req, res) => {
    const taskId = req.params.id;
    const updatedData = req.body;

    const updatedTask = await Task.findByIdAndUpdate(taskId, updatedData, {
        new: true
    });

    if (!updatedData){
        return res.status(404).json({message: 'Task not Found'});
    }

    res.json(updatedTask);
});

app.delete('/api/tasks/:id', async(req, res) => {
    const taskId = req.params.id;
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if(!deletedTask){
        return res.status(404).json({message: 'Task not found'});
    }

    res.json({message: 'Task deleted successfully from database'});

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});