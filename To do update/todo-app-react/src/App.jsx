import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import TodoList from "./TodoList";

function App() {
  //user login state: null = not logged in
  const [user, setUser] = useState(null);

  // display page based on login state
  const [page, setPage] = useState("login");

  //successful login
  function handleLogin(username, token) {
    setUser({ username, token });
  }

  //logout
  function handleLogout() {
    setUser(null);
    setPage("login");
  }

  //if logged in, show the todo list
  if (user) {
    return (
      <div className="container">
        <TodoList
          token={user.token}
          username={user.username}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  //if not logged in, show login or register
  return (
    <div className="container">
      <h1 className="app-title">Todo App</h1>
      {page === "login" ? (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToRegister={() => setPage("register")}
        />
      ) : (
        <RegisterForm
          onSwitchToLogin={() => setPage("login")}
        />
      )}
    </div>
  );
}

export default App;
