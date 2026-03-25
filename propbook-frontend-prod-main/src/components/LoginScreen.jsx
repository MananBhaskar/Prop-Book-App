import { useState } from "react";
import { loginUser } from "../api/auth";

/**
 * Full-page login screen with email + password for Firebase Auth.
 * @param {Object} props
 * @param {Function} props.onLogin - Called with the user's display name (or email) on success
 */
export default function LoginScreen({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const mail = email.trim();
        const pass = password.trim();
        if (!mail || !pass) {
            setError("Please enter both email and password");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const cred = await loginUser(mail, pass);
            onLogin(cred.user.displayName || cred.user.email);
        } catch (err) {
            const code = err.code;
            if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
                setError("Invalid email or password");
            } else if (code === "auth/invalid-email") {
                setError("Please enter a valid email address");
            } else {
                setError("Login failed. Please try again.");
            }
        }
        setLoading(false);
    };

    const inputStyle = {
        width: "100%", padding: "12px 16px", borderRadius: 10,
        border: "2px solid #e2e8f0", fontSize: 15, color: "#1e293b",
        outline: "none", boxSizing: "border-box", marginBottom: 14,
        background: "#ffffff",
        transition: "border-color 0.2s",
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f4c75 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}>
            <div style={{
                background: "#ffffff", borderRadius: 20, padding: "40px 36px",
                width: "100%", maxWidth: 400,
                boxShadow: "0 25px 60px rgba(0,0,0,0.35)", textAlign: "center",
            }}>
                <div style={{ fontSize: 52, marginBottom: 4 }}>🏘️</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", marginTop: 4 }}>
                    PropBook
                </div>
                <div style={{ color: "#64748b", fontSize: 14, marginTop: 6, marginBottom: 28 }}>
                    Real Estate Inventory — sign in to continue
                </div>

                {error && (
                    <div style={{
                        background: "#fef2f2", color: "#dc2626", border: "1px solid #fca5a5",
                        borderRadius: 10, padding: "10px 14px", marginBottom: 14,
                        fontSize: 13, fontWeight: 600, textAlign: "left",
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Email"
                    autoFocus
                    style={inputStyle}
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Password"
                    style={inputStyle}
                />

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        width: "100%", padding: "13px",
                        background: loading ? "#94a3b8" : "linear-gradient(135deg, #0f3460, #1e88e5)",
                        color: "#fff", border: "none", borderRadius: 10,
                        fontWeight: 800, fontSize: 16, cursor: loading ? "wait" : "pointer",
                        boxShadow: "0 4px 15px rgba(15,52,96,0.35)",
                        transition: "all 0.2s",
                    }}
                >
                    {loading ? "⟳ Signing in…" : "Sign In →"}
                </button>

                <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 18 }}>
                    🔒 Secured with Firebase Authentication
                </div>
            </div>
        </div>
    );
}
