import { useState, useEffect } from "react";
import { getTodos, createTodo, updateTodo, deleteTodo, logout } from "./api";
import AddTodo from "./AddTodo";
import TodoItem from "./TodoItem";

function TodoList({ token, username, onLogout }) {
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        loadTodos();
    }, []);

    //get all todos 
    async function loadTodos() {
        try {
            const data = await getTodos(token);
            setTodos(data);
            setError("");
        } catch (err) {
            setError("Failed to load todos.");
        }
    }

    //add a new todo 
    async function handleAddTodo(title, description) {
        try {
            const newTodo = await createTodo(token, title, description);
            // Add the new todo to the end of our array
            setTodos([...todos, newTodo]);
            setError("");
        } catch (err) {
            setError("Failed to add todo.");
        }
    }

    //update a todo
    async function handleUpdateTodo(id, updates) {
        try {
            const updatedTodo = await updateTodo(token, id, updates);
            // Replace the old todo with the updated one
            setTodos(
                todos.map((todo) => (todo.id === id ? updatedTodo : todo))
            );
            setError("");
        } catch (err) {
            setError("Failed to update todo.");
        }
    }

    //delete a todo
    async function handleDeleteTodo(id) {
        try {
            await deleteTodo(token, id);
            // Remove it from our array
            setTodos(todos.filter((todo) => todo.id !== id));
            setError("");
        } catch (err) {
            setError("Failed to delete todo.");
        }
    }

    //logout
    async function handleLogout() {
        try {
            await logout(token);
        } catch (err) {
            console.log("Logout API error:", err);
        }
        // Tell App to go back to the login page
        onLogout();
    }

    return (
        <div>
            {/* Top bar with username and logout */}
            <div className="top-bar">
                <span id="welcome-text">Hello, {username}!</span>
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <h2>My Todo List</h2>

            {error && <p className="error-text">{error}</p>}

            {/* The form to add new todos */}
            <AddTodo onAdd={handleAddTodo} />

            {/* The list of todos */}
            <div>
                {todos.length === 0 ? (
                    <p className="empty-text">
                        No todos yet. Add one above to get started!
                    </p>
                ) : (
                    todos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onUpdate={handleUpdateTodo}
                            onDelete={handleDeleteTodo}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default TodoList;
