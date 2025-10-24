const express = require('express');
const app = express();
app.use(express.json()); // Parse JSON bodies

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
  { id: 3, task: 'Do my assignment', completed: true},
  { id: 4, task: 'Submit my assignment', completed: false},
];

// GET All – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos); // Send array as JSON
})
// GET Single – Read one Todo by ID
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id); // Convert URL param to number
  const todo = todos.find((t) => t.id === id); // Search in array

  if (!todo) {
    // If no match found
    return res.status(404).json({ message: 'Todo not found' });
  }

  // If found, send it back
  res.status(200).json(todo);
});

// GET /todos/active – Filter active (not completed) todos
app.get('/todos/active', (req, res) => {
  // Filter todos whose completed status is false
  const activeTodos = todos.filter((t) => !t.completed);

  // Respond with the filtered array
  res.status(200).json(activeTodos);
});




// POST New – Create
app.post('/todos', (req, res) => {
  const newTodo = { id: todos.length + 1, ...req.body }; // Auto-ID
  todos.push(newTodo);
  res.status(201).json(newTodo); // Echo back
});

// POST New 
app.post('/todos', (req, res) => {
  const { task, completed } = req.body; // Extract user input

  // ✅ Validation: "task" is required
  if (!task) {
    return res.status(400).json({ error: "The 'task' field is required." });
  }

  // ✅ Create new todo item
  const newTodo = {
    id: todos.length + 1,
    task,
    completed: completed || false 
  };

  todos.push(newTodo); 

  res.status(201).json(newTodo); 
});


// PATCH Update – Partial
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  Object.assign(todo, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send(); // Silent success
});

app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.json(completed); // Custom Read!
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
