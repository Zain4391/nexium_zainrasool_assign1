"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import TodoFilters from "@/components/TodoFilters";

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

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    priority: "all",
    completed: "all",
    sort: "createdAt",
    order: "desc",
  });

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/todos?${params}`);

      if (response.ok) {
        const data = await response.json();
        setTodos(data.todos);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchTodos();
    }
  }, [session, filters]);

  // Add new todo
  const addTodo = async (
    todoData: Omit<Todo, "_id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoData),
      });

      if (response.ok) {
        fetchTodos(); // Refresh the list
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Update todo
  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        fetchTodos(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTodos(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
              <p className="text-sm text-gray-600">
                Welcome back, {session.user?.name}!
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Add Todo Form */}
            <div className="lg:col-span-1">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Add New Todo
                  </h3>
                  <TodoForm onSubmit={addTodo} />
                </div>
              </div>
            </div>

            {/* Right Column - Todo List */}
            <div className="lg:col-span-2">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Your Todos ({todos.length})
                    </h3>
                  </div>

                  {/* Filters */}
                  <TodoFilters filters={filters} onFilterChange={setFilters} />

                  {/* Todo List */}
                  {loading ? (
                    <div className="text-center py-8">Loading todos...</div>
                  ) : (
                    <TodoList
                      todos={todos}
                      onUpdate={updateTodo}
                      onDelete={deleteTodo}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
