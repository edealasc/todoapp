"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, Circle, Plus, Trash2 } from "lucide-react"

interface Todo {
  id: string
  name: string
  description: string
  dueDate: string
  completed: boolean
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dueDate: "",
  })
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all")
  const [formError, setFormError] = useState<string | null>(null)

  // Fetch tasks from backend on mount
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/tasks/")
      .then((res) => res.json())
      .then((data) => {
        // Map backend fields to frontend Todo type
        const mapped = data.map((item: any) => ({
          id: String(item.id),
          name: item.task_name,
          description: item.task_description,
          dueDate: item.due_date,
          completed: item.task_status === "completed",
        }))
        setTodos(mapped)
      })
      .catch((err) => {
        console.error("Failed to fetch todos:", err)
      })
  }, [])

  const addTodo = async () => {
    setFormError(null)
    if (!formData.name.trim() || !formData.dueDate.trim()) {
      setFormError("Task name and due date are required.")
      return
    }
    try {
      const response = await fetch("http://127.0.0.1:8000/api/tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task_name: formData.name,
          task_description: formData.description,
          due_date: formData.dueDate,
        }),
      })
      if (!response.ok) {
        throw new Error("Failed to add task")
      }
      // Fetch updated tasks from backend
      const tasksRes = await fetch("http://127.0.0.1:8000/api/tasks/")
      const tasksData = await tasksRes.json()
      const mapped = tasksData.map((item: any) => ({
        id: String(item.id),
        name: item.task_name,
        description: item.task_description,
        dueDate: item.due_date,
        completed: item.task_status === "completed",
      }))
      setTodos(mapped)
      setFormData({ name: "", description: "", dueDate: "" })
      setIsDialogOpen(false)
    } catch (err) {
      setFormError("Failed to add todo. Please try again.")
      console.error("Failed to add todo:", err)
    }
  }

  const toggleTodo = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
        method: "PUT",
      })
      if (!response.ok) {
        throw new Error("Failed to mark as completed")
      }
      // Fetch updated tasks from backend
      const tasksRes = await fetch("http://127.0.0.1:8000/api/tasks/")
      const tasksData = await tasksRes.json()
      const mapped = tasksData.map((item: any) => ({
        id: String(item.id),
        name: item.task_name,
        description: item.task_description,
        dueDate: item.due_date,
        completed: item.task_status === "completed",
      }))
      setTodos(mapped)
    } catch (err) {
      console.error("Failed to mark as completed:", err)
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete task")
      }
      // Fetch updated tasks from backend
      const tasksRes = await fetch("http://127.0.0.1:8000/api/tasks/")
      const tasksData = await tasksRes.json()
      const mapped = tasksData.map((item: any) => ({
        id: String(item.id),
        name: item.task_name,
        description: item.task_description,
        dueDate: item.due_date,
        completed: item.task_status === "completed",
      }))
      setTodos(mapped)
    } catch (err) {
      console.error("Failed to delete todo:", err)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed
    if (filter === "pending") return !todo.completed
    return true // 'all'
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">My Tasks</h1>
          <p className="text-slate-600">Stay organized and get things done</p>
        </div>

        {/* Add Task Button */}
        <div className="flex justify-center mb-8">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                <Plus className="w-5 h-5 mr-2" />
                Add New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-slate-800">Add New Task</DialogTitle>
                <DialogDescription className="text-slate-600">
                  Create a new task to add to your todo list.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-slate-700">
                    Task Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter task name..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-slate-200 focus:border-blue-400"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-slate-700">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Enter task description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="border-slate-200 focus:border-blue-400 min-h-[80px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate" className="text-slate-700">
                    Due Date
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="border-slate-200 focus:border-blue-400"
                  />
                </div>
                {formError && (
                  <div className="text-red-600 text-sm mt-1">{formError}</div>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    setFormError(null)
                  }}
                  className="border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button onClick={addTodo} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Add Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-white/70 backdrop-blur-sm rounded-lg p-1 border border-slate-200">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-800"}
            >
              All ({todos.length})
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("pending")}
              className={
                filter === "pending" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-800"
              }
            >
              Pending ({todos.filter((t) => !t.completed).length})
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("completed")}
              className={
                filter === "completed" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-800"
              }
            >
              Completed ({todos.filter((t) => t.completed).length})
            </Button>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <Card className="border-slate-200 bg-white/70 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">
                  {filter === "all"
                    ? "No tasks yet"
                    : filter === "completed"
                      ? "No completed tasks"
                      : "No pending tasks"}
                </h3>
                <p className="text-slate-500 text-center">
                  {filter === "all"
                    ? 'Click the "Add New Task" button to create your first task'
                    : filter === "completed"
                      ? "Complete some tasks to see them here"
                      : "All your tasks are completed! Great job!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTodos.map((todo) => (
              <Card
                key={todo.id}
                className={`border-slate-200 bg-white/70 backdrop-blur-sm transition-all hover:shadow-md ${
                  todo.completed ? "opacity-75" : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTodo(todo.id)}
                        className="p-0 h-auto hover:bg-transparent"
                      >
                        {todo.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-400 hover:text-blue-600" />
                        )}
                      </Button>
                      <div className="flex-1">
                        <CardTitle
                          className={`text-lg ${todo.completed ? "line-through text-slate-500" : "text-slate-800"}`}
                        >
                          {todo.name}
                        </CardTitle>
                        {todo.description && (
                          <CardDescription className={`mt-1 ${todo.completed ? "text-slate-400" : "text-slate-600"}`}>
                            {todo.description}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                {todo.dueDate && (
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <Badge
                        variant={isOverdue(todo.dueDate) && !todo.completed ? "destructive" : "secondary"}
                        className={
                          isOverdue(todo.dueDate) && !todo.completed
                            ? "bg-red-100 text-red-700 hover:bg-red-100"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                        }
                      >
                        {isOverdue(todo.dueDate) && !todo.completed ? "Overdue: " : "Due: "}
                        {formatDate(todo.dueDate)}
                      </Badge>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Stats */}
        {todos.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-6 bg-white/70 backdrop-blur-sm rounded-lg px-6 py-3 border border-slate-200">
              <div className="text-sm">
                <span className="font-medium text-slate-800">{todos.filter((t) => t.completed).length}</span>
                <span className="text-slate-600"> completed</span>
              </div>
              <div className="w-px h-4 bg-slate-300"></div>
              <div className="text-sm">
                <span className="font-medium text-slate-800">{todos.filter((t) => !t.completed).length}</span>
                <span className="text-slate-600"> remaining</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
