import { useEffect, useState } from 'react'
import './App.css'

type Task = {
  id: number
  title: string
  completed: number
}

const API = 'http://localhost:3001/api/tasks'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')

  const fetchTasks = async () => {
    const res = await fetch(API)
    const data = await res.json()
    setTasks(data)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    })

    const newTask = await res.json()
    setTasks([newTask, ...tasks])
    setTitle('')
  }

  const toggleTask = async (id: number) => {
    const res = await fetch(`${API}/${id}`, { method: 'PUT' })
    const updated = await res.json()

    setTasks(tasks.map(t => (t.id === id ? updated : t)))
  }

  const deleteTask = async (id: number) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' })
    setTasks(tasks.filter(t => t.id !== id))
  }

  return (
    <div className="app">
      <h1>📝 Todo App</h1>

      <form onSubmit={addTask}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Nowe zadanie..."
        />
        <button>Dodaj</button>
      </form>

      <ul>
        {tasks.map(task => (
          <li key={task.id} className={task.completed ? 'done' : ''}>
            <input
              type="checkbox"
              checked={!!task.completed}
              onChange={() => toggleTask(task.id)}
            />
            {task.title}
            <button onClick={() => deleteTask(task.id)}>✖</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
