//url 
const API_URL = "http://localhost:5173";

//new user registration
export async function register(username, password) {
    const response = await fetch(API_URL + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Registration failed");
    }

    return data;
}

//existing user login 
export async function login(username, password) {
    const response = await fetch(API_URL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Login failed");
    }

    return data;
}

//logout the current user
export async function logout(token) {
    const response = await fetch(API_URL + "/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Logout failed");
    }

    return data;
}

//return to do list
export async function getTodos(token) {
    const response = await fetch(API_URL + "/todos", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to get todos");
    }

    return data;
}

//create to do
export async function createTodo(token, title, description) {
    const response = await fetch(API_URL + "/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({ title, description }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to create todo");
    }

    return data;
}

//update to do
export async function updateTodo(token, id, updates) {
    const response = await fetch(API_URL + "/todos/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to update todo");
    }

    return data;
}

//Delete todo
export async function deleteTodo(token, id) {
    const response = await fetch(API_URL + "/todos/" + id, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete todo");
    }
}