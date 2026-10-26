const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('TaskFlow Backend is running!');
});

/*app.get('/api/tasks', (req, res) => {
    res.json([
        { id: 1, name: 'Learn backend', completed: false },
        { id: 2, name: 'Connect database', completed: false }
    ]);
});*/
let tasks = [
    { id: 1, name: 'Learn backend', completed: false },
    { id: 2, name: 'Connect database', completed: false }
];
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});
app.post('/api/tasks', (req, res) => {
    const newTask = req.body;
    tasks.push(newTask);
    res.status(201).json(newTask);
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});