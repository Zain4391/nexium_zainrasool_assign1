"use client";

import { useState } from "react";

interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface TodoListProps {
  todos: Todo[];
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({ todos, onUpdate, onDelete }: TodoListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const startEdit = (todo: Todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const saveEdit = (id: string) => {
    onUpdate(id, {
      title: editTitle,
      description: editDescription,
    });
    cancelEdit();
  };

  const toggleComplete = (id: string, completed: boolean) => {
    onUpdate(id, { completed: !completed });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-6xl mb-4">📝</div>
        <p className="text-lg">No todos yet!</p>
        <p className="text-sm">Add your first todo to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      {todos.map((todo) => (
        <div
          key={todo._id}
          className={`border rounded-lg p-4 transition-all ${
            todo.completed
              ? "bg-gray-50 border-gray-200"
              : "bg-white border-gray-300"
          }`}
        >
          <div className="flex items-start justify-between">
            {/* Left side - Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo._id, todo.completed)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />

                {/* Title */}
                {editingId === todo._id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 text-lg font-medium text-gray-900 border-b-2 border-indigo-500 focus:outline-none"
                  />
                ) : (
                  <h3
                    className={`text-lg font-medium ${
                      todo.completed
                        ? "text-gray-500 line-through"
                        : "text-gray-900"
                    }`}
                  >
                    {todo.title}
                  </h3>
                )}

                {/* Priority Badge */}
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                    todo.priority
                  )}`}
                >
                  {todo.priority}
                </span>
              </div>

              {/* Description */}
              {(todo.description || editingId === todo._id) && (
                <div className="mb-2">
                  {editingId === todo._id ? (
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={2}
                      className="w-full text-sm text-gray-600 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Add description..."
                    />
                  ) : todo.description ? (
                    <p
                      className={`text-sm ${
                        todo.completed ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {todo.description}
                    </p>
                  ) : null}
                </div>
              )}

              {/* Meta info */}
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>Created: {formatDate(todo.createdAt)}</span>
                {todo.dueDate && (
                  <span
                    className={`font-medium ${
                      new Date(todo.dueDate) < new Date() && !todo.completed
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    Due: {formatDate(todo.dueDate)}
                  </span>
                )}
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2 ml-4">
              {editingId === todo._id ? (
                <>
                  <button
                    onClick={() => saveEdit(todo._id)}
                    className="text-green-600 hover:text-green-800 font-medium text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(todo)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(todo._id)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                    onDoubleClick={(e) => e.stopPropagation()}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
