import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'todo.db');
const db = new sqlite3.Database(dbPath);
db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
db.get("SELECT COUNT(*) AS count FROM tasks", (err, row) => {
  if (err) return console.error(err);
  if (row.count === 0) {
    const tasks = [
      ['Nauczyć się Gita', 0],
      ['Zrobić backend', 1],
      ['Zrobić frontend', 0],
      ['Merge PR', 0],
      ['Oddać projekt', 0]
    ];
    const stmt = db.prepare("INSERT INTO tasks (title, completed) VALUES (?, ?)");
    tasks.forEach(t => stmt.run(t[0], t[1]));
    stmt.finalize();
    console.log('Baza została zainicjalizowana seedem.');
  }
});
export default db;
