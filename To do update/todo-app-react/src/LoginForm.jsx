import { useState } from "react";
import { login } from "./api";

// Login form logic and JSX
function LoginForm({ onLogin, onSwitchToRegister }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // on submit confirm required fields exist
    const handleSubmit = async () => {

        if (!username || !password) {
            setError("Please fill in both fields.");
            return;
        }
        setError("");

        try {
            // call api
            const result = await login(username, password);
            // send username and token up to App
            onLogin(result.username, result.token);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="form-card">
            <h2>Login</h2>

            {error && <p className="error-text">{error}</p>}

            <label>Username</label>
            <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <label>Password</label>
            <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className="primary-button" onClick={handleSubmit}>
                Login
            </button>

            <p className="switch-text">
                Don't have an account?{" "}
                <span className="link" onClick={onSwitchToRegister}>
                    Register here
                </span>
            </p>
        </div>
    );
}

export default LoginForm;
