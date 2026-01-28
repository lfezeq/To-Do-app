import express from 'express';
import cors from 'cors';
import db from '../db/db.js';
const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  db.run('INSERT INTO tasks (title) VALUES (?)', [title], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(row);
    });
  });
});
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, task) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const newStatus = task.completed ? 0 : 1;
    db.run('UPDATE tasks SET completed = ? WHERE id = ?', [newStatus, id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      task.completed = newStatus;
      res.json(task);
    });
  });
});
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ success: true });
  });
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));
