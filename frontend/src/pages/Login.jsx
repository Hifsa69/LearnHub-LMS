
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setMessageType("");
        setLoading(true);

        try {
            const response = await API.post("/login", formData);

            const { token, user, message: responseMessage } = response.data;

            if (
                typeof token !== "string" ||
                token.split(".").length !== 3 ||
                !user ||
                !user.role
            ) {
                setMessage("Invalid login response. Please try again.");
                setMessageType("danger");
                return;
            }

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            setMessage(responseMessage || "Login successful! Welcome back.");
            setMessageType("success");

            setTimeout(() => {
                if (user.role === "admin") {
                    navigate("/admin-dashboard");
                } else if (user.role === "instructor") {
                    navigate("/instructor-dashboard");
                } else {
                    navigate("/courses");
                }
            }, 600);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Login failed. Please check your details and try again."
            );
            setMessageType("danger");
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        page: {
            minHeight: "100vh",
            background:
                "radial-gradient(ellipse at 10% 10%, rgba(6,182,212,0.13), transparent 40%), radial-gradient(ellipse at 90% 90%, rgba(139,92,246,0.14), transparent 40%), #080D1A",
            color: "#F8FAFC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 16px",
            overflow: "hidden",
        },
        card: {
            background: "rgba(17, 27, 45, 0.88)",
            border: "1px solid rgba(148,163,184,0.18)",
            borderRadius: "24px",
            backdropFilter: "blur(18px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
        },
        input: {
            background: "#0B1425",
            color: "#F8FAFC",
            border: "1px solid #2A3A52",
            borderRadius: "10px",
            padding: "12px 14px",
        },
        muted: {
            color: "#94A3B8",
        },
        cyan: "#22D3EE",
    };

    return (
        <div style={styles.page}>
            <div className="container" style={{ maxWidth: "1050px" }}>
                <div className="row align-items-center justify-content-center g-5">

                    {/* Branding Panel */}
                    <div className="col-lg-6 d-none d-lg-block">
                        <div className="pe-lg-4">
                            <div
                                className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4"
                                style={{
                                    background: "rgba(34,211,238,0.08)",
                                    border: "1px solid rgba(34,211,238,0.22)",
                                    color: styles.cyan,
                                }}
                            >
                                <span>✦</span>
                                <span className="small fw-semibold">
                                    YOUR LEARNING JOURNEY STARTS HERE
                                </span>
                            </div>

                            <h1
                                className="fw-bold mb-4"
                                style={{
                                    fontSize: "clamp(2.8rem, 5vw, 4.2rem)",
                                    lineHeight: 1.12,
                                    letterSpacing: "-2px",
                                }}
                            >
                                Learn more.
                                <br />
                                <span
                                    style={{
                                        background:
                                            "linear-gradient(90deg, #22D3EE, #818CF8)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    Become more.
                                </span>
                            </h1>

                            <p
                                className="fs-5 mb-4"
                                style={{
                                    color: "#A8B5C9",
                                    lineHeight: 1.8,
                                    maxWidth: "470px",
                                }}
                            >
                                Your next skill, your next opportunity.
                                Continue learning and take the next step
                                toward your goals with LearnHub.
                            </p>

                            <div className="d-flex flex-column gap-3 mt-5">
                                {[
                                    ["✦", "Learn at your own pace"],
                                    ["◈", "Explore your enrolled courses"],
                                    ["↗", "Track your learning progress"],
                                ].map(([icon, text]) => (
                                    <div
                                        key={text}
                                        className="d-flex align-items-center gap-3"
                                    >
                                        <div
                                            className="rounded-3 d-flex align-items-center justify-content-center"
                                            style={{
                                                width: "42px",
                                                height: "42px",
                                                flexShrink: 0,
                                                background: "rgba(34,211,238,0.09)",
                                                border: "1px solid rgba(34,211,238,0.2)",
                                                color: styles.cyan,
                                            }}
                                        >
                                            {icon}
                                        </div>

                                        <span style={{ color: "#CBD5E1" }}>
                                            {text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Login Form */}
                    <div className="col-12 col-md-9 col-lg-6">
                        <div className="card" style={styles.card}>
                            <div className="card-body p-4 p-sm-5">

                                {/* Mobile Branding */}
                                <div className="text-center d-lg-none mb-4">
                                    <div
                                        className="d-inline-flex align-items-center justify-content-center rounded-4 mb-3"
                                        style={{
                                            width: "58px",
                                            height: "58px",
                                            background: "rgba(34,211,238,0.1)",
                                            border: "1px solid rgba(34,211,238,0.25)",
                                            color: styles.cyan,
                                            fontSize: "28px",
                                        }}
                                    >
                                        ✦
                                    </div>

                                    <h2 className="fw-bold">LearnHub</h2>
                                </div>

                                <div className="mb-4">
                                    <p
                                        className="small fw-semibold mb-2"
                                        style={{
                                            color: styles.cyan,
                                            letterSpacing: "2px",
                                        }}
                                    >
                                        WELCOME BACK
                                    </p>

                                    <h2
                                        className="fw-bold mb-2"
                                        style={{
                                            fontSize: "2rem",
                                            letterSpacing: "-0.7px",
                                        }}
                                    >
                                        Sign in to LearnHub
                                    </h2>

                                    <p className="mb-0" style={styles.muted}>
                                        Enter your details to access your account.
                                    </p>
                                </div>

                                {message && (
                                    <div
                                        className="rounded-3 p-3 mb-4"
                                        role="alert"
                                        style={{
                                            background:
                                                messageType === "success"
                                                    ? "rgba(34,197,94,0.1)"
                                                    : "rgba(248,113,113,0.1)",
                                            color:
                                                messageType === "success"
                                                    ? "#86EFAC"
                                                    : "#FCA5A5",
                                            border: `1px solid ${
                                                messageType === "success"
                                                    ? "rgba(34,197,94,0.3)"
                                                    : "rgba(248,113,113,0.3)"
                                            }`,
                                        }}
                                    >
                                        {message}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    {/* Email */}
                                    <div className="mb-4">
                                        <label
                                            htmlFor="email"
                                            className="form-label fw-semibold mb-2"
                                        >
                                            Email address
                                        </label>

                                        <div className="position-relative">
                                            <span
                                                className="position-absolute top-50 translate-middle-y"
                                                style={{
                                                    left: "14px",
                                                    color: "#71829C",
                                                }}
                                            >
                                                ✉
                                            </span>

                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                style={{
                                                    ...styles.input,
                                                    paddingLeft: "42px",
                                                }}
                                                placeholder="you@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                autoComplete="email"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <label
                                                htmlFor="password"
                                                className="form-label fw-semibold mb-0"
                                            >
                                                Password
                                            </label>
                                        </div>

                                        <div className="position-relative">
                                            <span
                                                className="position-absolute top-50 translate-middle-y"
                                                style={{
                                                    left: "14px",
                                                    color: "#71829C",
                                                }}
                                            >
                                                🔒
                                            </span>

                                            <input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                className="form-control"
                                                style={{
                                                    ...styles.input,
                                                    paddingLeft: "42px",
                                                    paddingRight: "78px",
                                                }}
                                                placeholder="Enter your password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                autoComplete="current-password"
                                                required
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(!showPassword)
                                                }
                                                className="btn btn-sm position-absolute top-50 translate-middle-y"
                                                style={{
                                                    right: "7px",
                                                    color: styles.cyan,
                                                    border: "none",
                                                }}
                                                aria-label={
                                                    showPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                {showPassword ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        className="btn w-100 fw-bold py-3 mb-4"
                                        disabled={loading}
                                        style={{
                                            background:
                                                "linear-gradient(90deg, #06B6D4, #22D3EE)",
                                            color: "#07111F",
                                            border: "none",
                                            borderRadius: "10px",
                                            boxShadow: "0 8px 24px rgba(6,182,212,0.18)",
                                            opacity: loading ? 0.75 : 1,
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                />
                                                Signing you in...
                                            </>
                                        ) : (
                                            <>Sign In <span className="ms-1">→</span></>
                                        )}
                                    </button>
                                </form>

                                <div className="text-center">
                                    <p
                                        className="mb-0"
                                        style={{ color: styles.muted }}
                                    >
                                        Ready to continue your learning?
                                    </p>

                                    <Link
                                        to="/courses"
                                        className="text-decoration-none small fw-semibold d-inline-block mt-2"
                                        style={{ color: styles.cyan }}
                                    >
                                        Explore courses →
                                    </Link>
                                </div>

                                <div
                                    className="text-center mt-4 pt-3"
                                    style={{
                                        borderTop: `1px solid ${styles.card === "#151F32" ? "#263449" : "#263449"}`,
                                    }}
                                >
                                    <small style={{ color: "#64748B" }}>
                                        © {new Date().getFullYear()} LearnHub
                                    </small>
                                </div>
                            </div>
                        </div>

                        <p
                            className="text-center small mt-4 mb-0"
                            style={{ color: "#64748B" }}
                        >
                            Learn something new. Build your future.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;