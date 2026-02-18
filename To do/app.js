//global vars
var currentToken = null;
var currentUsername = null;

//dom vars
var loginSection = document.getElementById("login-section");
var registerSection = document.getElementById("register-section");
var todoSection = document.getElementById("todo-section");
var loginUsername = document.getElementById("login-username");
var loginPassword = document.getElementById("login-password");
var loginButton = document.getElementById("login-button");
var loginError = document.getElementById("login-error");
var showRegisterLink = document.getElementById("show-register-link");
var registerUsername = document.getElementById("register-username");
var registerPassword = document.getElementById("register-password");
var registerConfirm = document.getElementById("register-confirm");
var registerButton = document.getElementById("register-button");
var registerError = document.getElementById("register-error");
var registerSuccess = document.getElementById("register-success");
var showLoginLink = document.getElementById("show-login-link");
var welcomeText = document.getElementById("welcome-text");
var logoutButton = document.getElementById("logout-button");
var todoTitleInput = document.getElementById("todo-title-input");
var todoDescInput = document.getElementById("todo-desc-input");
var addTodoButton = document.getElementById("add-todo-button");
var todoList = document.getElementById("todo-list");
var todoError = document.getElementById("todo-error");

// display login form, hide register,todo
function showLoginPage() {
    loginSection.hidden = false;
    registerSection.hidden = true;
    todoSection.hidden = true;

    // clear 
    loginUsername.value = "";
    loginPassword.value = "";
    loginError.hidden = true;
}

// display registeration form, hide login,todo
function showRegisterPage() {
    loginSection.hidden = true;
    registerSection.hidden = false;
    todoSection.hidden = true;

    // clear
    registerUsername.value = "";
    registerPassword.value = "";
    registerConfirm.value = "";
    registerError.hidden = true;
    registerSuccess.hidden = true;
}

// diaply to do form, hide login, register
function showTodoPage() {
    loginSection.hidden = true;
    registerSection.hidden = true;
    todoSection.hidden = false;
    welcomeText.textContent = "Hi, " + currentUsername + "!";
}

//add register event listener
registerButton.addEventListener("click", async function () {
    var username = registerUsername.value;
    var password = registerPassword.value;
    var confirm = registerConfirm.value;

    registerError.hidden = true;
    registerSuccess.hidden = true;

    //check for required fields 
    if (!username || !password || !confirm) {
        registerError.textContent = "Please fill in all fields.";
        registerError.hidden = false;
        return;
    }

    //wrong pwd
    if (password !== confirm) {
        registerError.textContent = "Passwords do not match.";
        registerError.hidden = false;
        return;
    }

    //call api
    try {
        await api.register(username, password);
        registerSuccess.textContent = "Account successfully created!";
        registerSuccess.hidden = false;
        // Clear the form
        registerUsername.value = "";
        registerPassword.value = "";
        registerConfirm.value = "";
    } catch (err) {
        registerError.textContent = err.message;
        registerError.hidden = false;
    }
});

//login event listener
loginButton.addEventListener("click", async function () {
    var username = loginUsername.value;
    var password = loginPassword.value;

    loginError.hidden = true;

    // check for required fields
    if (!username || !password) {
        loginError.textContent = "Please fill in both fields.";
        loginError.hidden = false;
        return;
    }

    // call api
    try {
        var result = await api.login(username, password);
        currentToken = result.token;
        currentUsername = result.username;

        // store cookies
        setCookie("token", currentToken);
        setCookie("username", currentUsername);

        showTodoPage();
        loadTodos();
    } catch (err) {
        loginError.textContent = err.message;
        loginError.hidden = false;
    }
});

//logout event listener
logoutButton.addEventListener("click", async function () {
    try {
        await api.logout(currentToken);
    } catch (err) {
        console.log("Logout API error:", err);
    }

    // Clear cookies
    currentToken = null;
    currentUsername = null;
    deleteCookie("token");
    deleteCookie("username");

    showLoginPage();
});

//registration link event listener
showRegisterLink.addEventListener("click", function () {
    showRegisterPage();
});

//login link event listener
showLoginLink.addEventListener("click", function () {
    showLoginPage();
});

// get all todos and display
async function loadTodos() {
    todoError.hidden = true;

    try {
        var todos = await api.getTodos(currentToken);
        displayTodos(todos);
    } catch (err) {
        todoError.textContent = "Failed to load todos.";
        todoError.hidden = false;
    }
}

//build HTML to display to dos
function displayTodos(todos) {
    todoList.innerHTML = "";

    // empty to do list 
    if (todos.length === 0) {
        todoList.innerHTML = '<p class="empty-text">No todos available.</p>';
        return;
    }

    for (var i = 0; i < todos.length; i++) {
        var todoElement = createTodoElement(todos[i]);
        todoList.appendChild(todoElement);
    }
}

// to do list item HTML
function createTodoElement(todo) {
    var item = document.createElement("div");
    item.className = "todo-item";
    if (todo.completed) {
        item.className += " completed";
    }

    var viewHTML = "";
    viewHTML += '<div class="todo-item-header">';
    viewHTML += '<div class="todo-item-left">';
    viewHTML += '<input type="checkbox" class="todo-checkbox"' + (todo.completed ? " checked" : "") + ">";
    viewHTML += '<span class="todo-title' + (todo.completed ? " done" : "") + '">' + todo.title + "</span>";
    viewHTML += "</div>";
    viewHTML += '<div class="todo-actions">';
    viewHTML += '<button class="edit-button">Edit</button>';
    viewHTML += '<button class="delete-button">Delete</button>';
    viewHTML += "</div>";
    viewHTML += "</div>";
    if (todo.description) {
        viewHTML += '<p class="todo-description">' + todo.description + "</p>";
    }

    //on edit:
    var editHTML = "";
    editHTML += '<div class="edit-form" hidden>';
    editHTML += '<input type="text" class="edit-title-input" value="' + todo.title + '" placeholder="Title">';
    editHTML += '<input type="text" class="edit-desc-input" value="' + (todo.description || "") + '" placeholder="Description">';
    editHTML += '<div class="edit-buttons">';
    editHTML += '<button class="save-button">Save</button>';
    editHTML += '<button class="cancel-button">Cancel</button>';
    editHTML += "</div>";
    editHTML += "</div>";
    item.innerHTML = viewHTML + editHTML;

    //mark complete event listener
    var checkbox = item.querySelector(".todo-checkbox");
    checkbox.addEventListener("change", async function () {
        try {
            await api.updateTodo(currentToken, todo.id, {
                title: todo.title,
                description: todo.description,
                completed: checkbox.checked,
            });
            // Reload the whole list to show the updated state
            loadTodos();
        } catch (err) {
            todoError.textContent = "Failed to update todo.";
            todoError.hidden = false;
        }
    });

    // edit button event listener
    var editBtn = item.querySelector(".edit-button");
    var editForm = item.querySelector(".edit-form");
    var headerDiv = item.querySelector(".todo-item-header");
    var descP = item.querySelector(".todo-description");

    editBtn.addEventListener("click", function () {
        headerDiv.hidden = true;
        if (descP) descP.hidden = true;
        editForm.hidden = false;
    });

    // save button event listener
    var saveBtn = item.querySelector(".save-button");
    var editTitleInput = item.querySelector(".edit-title-input");
    var editDescInput = item.querySelector(".edit-desc-input");

    saveBtn.addEventListener("click", async function () {
        var newTitle = editTitleInput.value.trim();
        if (!newTitle) return; // title is required

        try {
            await api.updateTodo(currentToken, todo.id, {
                title: newTitle,
                description: editDescInput.value,
                completed: todo.completed,
            });
            loadTodos();
        } catch (err) {
            todoError.textContent = "TO do update failed.";
            todoError.hidden = false;
        }
    });

    // cancel button event listener
    var cancelBtn = item.querySelector(".cancel-button");
    cancelBtn.addEventListener("click", function () {
        headerDiv.hidden = false;
        if (descP) descP.hidden = false;
        editForm.hidden = true;
    });

    //delete button event listener
    var deleteBtn = item.querySelector(".delete-button");
    deleteBtn.addEventListener("click", async function () {
        try {
            await api.deleteTodo(currentToken, todo.id);
            loadTodos();
        } catch (err) {
            todoError.textContent = "Failed to delete todo.";
            todoError.hidden = false;
        }
    });

    return item;
}

// add new to do
addTodoButton.addEventListener("click", async function () {
    var title = todoTitleInput.value.trim();
    var description = todoDescInput.value.trim();
    todoError.hidden = true;

    // Title is required
    if (!title) {
        todoError.textContent = "Please enter a title.";
        todoError.hidden = false;
        return;
    }

    try {
        await api.createTodo(currentToken, title, description);
        // Clear the inputs
        todoTitleInput.value = "";
        todoDescInput.value = "";
        // Reload the list to show the new todo
        loadTodos();
    } catch (err) {
        todoError.textContent = "Failed to add todo.";
        todoError.hidden = false;
    }
});

//store cookie
function setCookie(name, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000); // 1 day
    document.cookie = name + "=" + value + ";expires=" + expires.toUTCString() + ";path=/";
}

//get cookie
function getCookie(name) {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();

        if (cookie.startsWith(name + "=")) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

// delete cookie
function deleteCookie(name) {
    document.cookie = name + "=;expires=Thu, 01 Jan 2010 00:00:00 UTC;path=/";
}

//check for existing session on page load
function checkForExistingSession() {
    var savedToken = getCookie("token");
    var savedUsername = getCookie("username");

    if (savedToken && savedUsername) {
        currentToken = savedToken;
        currentUsername = savedUsername;
        showTodoPage();
        loadTodos();
    } else {
        showLoginPage();
    }
}

// On page load, check for existing session
checkForExistingSession();