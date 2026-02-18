var API_URL = "http://localhost:3000";

var api = {

    // new user registration
    register: async function (username, password) {
        var response = await fetch(API_URL + "/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, password: password }),
        });

        var data = await response.json();


        if (!response.ok) {
            throw new Error(data.error || "Registration failed");
        }

        return data;
    },

    // existing user login
    login: async function (username, password) {
        var response = await fetch(API_URL + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: username, password: password }),
        });

        var data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Login failed");
        }

        return data;
    },

    //logout the current user
    logout: async function (token) {
        var response = await fetch(API_URL + "/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        });

        var data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Logout failed");
        }
        return data;
    },

    //return to do list
    getTodos: async function (token) {
        var response = await fetch(API_URL + "/todos", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
            },
        });

        var data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to get todos");
        }
        return data;
    },

    //create to do
    createTodo: async function (token, title, description) {
        var response = await fetch(API_URL + "/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({ title: title, description: description }),
        });

        var data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to create todo");
        }

        return data;
    },

    //update to do
    updateTodo: async function (token, id, updates) {
        var response = await fetch(API_URL + "/todos/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify(updates),
        });

        var data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to update todo");
        }

        return data;
    },

    // Delete todo
    deleteTodo: async function (token, id) {
        var response = await fetch(API_URL + "/todos/" + id, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete todo");
        }
    },

};

