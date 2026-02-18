import { useState } from "react";
import { register } from "./api";

// register user logic and jsx
function RegisterForm({ onSwitchToLogin }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // submit confirm required fields exist and validate pwd
    const handleSubmit = async () => {
        // Make sure all fields are filled in
        if (!username || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            setSuccess("");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setSuccess("");
            return;
        }
        setError("");

        try {
            // Call api
            await register(username, password);
            setSuccess("Account created!");

            setUsername("");
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err.message);
            setSuccess("");
        }
    };

    return (
        <div className="form-card">
            <h2>Register</h2>

            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            <label>Username</label>
            <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <label>Password</label>
            <input
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <label>Confirm Password</label>
            <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button className="primary-button" onClick={handleSubmit}>
                Register
            </button>

            <p className="switch-text">
                Already have an account?{" "}
                <span className="link" onClick={onSwitchToLogin}>
                    Login here
                </span>
            </p>
        </div>
    );
}

export default RegisterForm;
