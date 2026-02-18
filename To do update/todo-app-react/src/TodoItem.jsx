import { useState } from "react";

function TodoItem({ todo, onUpdate, onDelete }) {
    //track user mode(edit/view)
    const [isEditing, setIsEditing] = useState(false);

    const [editTitle, setEditTitle] = useState(todo.title);
    const [editDescription, setEditDescription] = useState(todo.description || "");

    // Toggle the completed status
    const handleToggleComplete = () => {
        onUpdate(todo.id, {
            title: todo.title,
            description: todo.description,
            completed: !todo.completed,
        });
    };

    // Save edits
    const handleSave = () => {
        if (!editTitle.trim()) return;

        onUpdate(todo.id, {
            title: editTitle,
            description: editDescription,
            completed: todo.completed,
        });
        setIsEditing(false);
    };

    // Cancel editing and reset the fields
    const handleCancel = () => {
        setEditTitle(todo.title);
        setEditDescription(todo.description || "");
        setIsEditing(false);
    };

    //edit mode
    if (isEditing) {
        return (
            <div className="todo-item">
                <div className="edit-form">
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Title"
                    />
                    <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Description"
                    />
                    <div className="edit-buttons">
                        <button className="save-button" onClick={handleSave}>
                            Save
                        </button>
                        <button className="cancel-button" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // view mode
    return (
        <div className={"todo-item" + (todo.completed ? " completed" : "")}>
            <div className="todo-item-header">
                <div className="todo-item-left">
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={handleToggleComplete}
                    />
                    <span className={"todo-title" + (todo.completed ? " done" : "")}>
                        {todo.title}
                    </span>
                </div>
                <div className="todo-actions">
                    <button className="edit-button" onClick={() => setIsEditing(true)}>
                        Edit
                    </button>
                    <button className="delete-button" onClick={() => onDelete(todo.id)}>
                        Delete
                    </button>
                </div>
            </div>
            {todo.description && (
                <p className="todo-description">{todo.description}</p>
            )}
        </div>
    );
}

export default TodoItem;
