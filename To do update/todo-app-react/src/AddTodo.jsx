import { useState } from "react";

//add to do item logic and jsx
function AddTodo({ onAdd }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleAdd = () => {

        if (!title.trim()) {
            return;
        }

        onAdd(title, description);
        setTitle("");
        setDescription("");
    };

    return (
        <div className="add-todo-box">
            <h3>Add New Todo</h3>
            <input
                type="text"
                placeholder="Todo title (required)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button className="add-button" onClick={handleAdd}>
                + Add Todo
            </button>
        </div>
    );
}

export default AddTodo;