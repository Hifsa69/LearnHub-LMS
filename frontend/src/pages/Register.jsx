import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
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
    setIsError(false);
    setIsLoading(true);

    try {
      const response = await API.post("/register", {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      setMessage(response.data.message || "Registration successful!");

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );

      setIsError(true);
      setMessage(
        error.response?.data?.message ||
          (error.response
            ? "Registration failed. Please check your details."
            : "Cannot connect to server. Make sure the backend is running.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="register-page"
      style={{
        minHeight: "100vh",
        background: "#080D1A",
        color: "#F8FAFC",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        .register-page {
          background:
            radial-gradient(ellipse at 15% 15%, rgba(6,182,212,.13), transparent 38%),
            radial-gradient(ellipse at 90% 85%, rgba(124,58,237,.16), transparent 40%),
            #080D1A !important;
        }

        .register-card {
          background: rgba(17, 27, 45, .88);
          border: 1px solid rgba(148, 163, 184, .19);
          border-radius: 24px;
          box-shadow: 0 25px 80px rgba(0,0,0,.3);
          backdrop-filter: blur(16px);
        }

        .register-logo {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          margin: 0 auto 20px;
          border-radius: 18px;
          font-size: 27px;
          font-weight: 800;
          color: #07111F;
          background: linear-gradient(135deg, #67E8F9, #A78BFA);
          box-shadow: 0 8px 30px rgba(34,211,238,.18);
        }

        .register-gradient {
          background: linear-gradient(100deg, #67E8F9, #A78BFA, #F0ABFC);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .register-page .form-control {
          background: #0B1425;
          color: #F8FAFC;
          border: 1px solid #2B3950;
          border-radius: 11px;
          min-height: 49px;
          padding: 12px 14px;
          transition: border-color .2s ease, box-shadow .2s ease;
        }

        .register-page .form-control::placeholder {
          color: #718096;
        }

        .register-page .form-control:focus {
          background: #0B1425;
          color: #F8FAFC;
          border-color: #22D3EE;
          box-shadow: 0 0 0 3px rgba(34,211,238,.12);
        }

        .register-page .form-control:disabled {
          background: #162237;
          color: #CBD5E1;
          opacity: 1;
        }

        .register-submit {
          border: none;
          border-radius: 11px;
          min-height: 50px;
          color: #07111F;
          background: linear-gradient(110deg, #67E8F9, #22D3EE, #A78BFA);
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .register-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(34,211,238,.2);
          color: #07111F;
        }

        .register-submit:disabled {
          opacity: .7;
        }

        .register-link {
          color: #67E8F9;
          text-decoration: none;
          font-weight: 600;
        }

        .register-link:hover {
          color: #A5F3FC;
          text-decoration: underline;
        }

        .register-divider {
          border-color: rgba(148,163,184,.15);
        }

        .register-side-note {
          border: 1px solid rgba(34,211,238,.15);
          border-radius: 12px;
          background: rgba(34,211,238,.05);
          color: #A6B3C8;
        }
      `}</style>

      <div className="container py-5 position-relative">
        <div className="row justify-content-center align-items-center">
          <div className="col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="text-center mb-4">
              <Link
                to="/"
                className="text-decoration-none d-inline-block mb-3"
                aria-label="Go to LearnHub home"
              >
                <div className="register-logo">L</div>
                <div className="fs-4 fw-bold text-white">
                  Learn<span className="register-gradient">Hub.</span>
                </div>
              </Link>

              <div
                className="small mb-3"
                style={{
                  color: "#67E8F9",
                  letterSpacing: "2px",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                }}
              >
                YOUR LEARNING JOURNEY STARTS HERE
              </div>

              <h1 className="display-6 fw-bold mb-2">
                Create your <span className="register-gradient">account.</span>
              </h1>

              <p style={{ color: "#94A3B8", lineHeight: 1.8 }}>
                Join our learning community and discover what you can achieve.
              </p>
            </div>

            <div className="register-card">
              <div className="card-body p-4 p-md-5">
                <div className="mb-4">
                  <h2 className="h4 fw-bold mb-2">Let's get you started ✨</h2>
                  <p className="small mb-0" style={{ color: "#94A3B8" }}>
                    Fill in your details to create your student account.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label
                      htmlFor="name"
                      className="form-label fw-semibold small"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="e.g. Hifsa Bashir"
                      value={formData.name}
                      onChange={handleChange}
                      minLength={2}
                      autoComplete="name"
                      maxLength={100}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className="form-label fw-semibold small"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold small"
                    >
                      Password
                    </label>

                    <div className="position-relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control pe-5"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                        minLength={6}
                        autoComplete="new-password"
                        required
                      />

                      <button
                        type="button"
                        className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          color: "#94A3B8",
                          border: "none",
                          background: "transparent",
                        }}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>

                    <small
                      className="d-block mt-2"
                      style={{ color: "#94A3B8" }}
                    >
                      Use at least 6 characters.
                    </small>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="accountType"
                      className="form-label fw-semibold small"
                    >
                      Account Type
                    </label>

                    <input
                      id="accountType"
                      type="text"
                      className="form-control"
                      value="Student"
                      disabled
                      readOnly
                    />

                    <small
                      className="d-block mt-2"
                      style={{ color: "#94A3B8" }}
                    >
                      Instructor and admin access is managed separately.
                    </small>
                  </div>

                  <button
                    type="submit"
                    className="btn register-submit w-100 fw-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        />
                        Creating your account...
                      </>
                    ) : (
                      <>
                        Create My Account <span className="ms-2">→</span>
                      </>
                    )}
                  </button>
                </form>

                {message && (
                  <div
                    className={`alert mt-4 mb-0 ${
                      isError ? "alert-danger" : "alert-success"
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {message}
                  </div>
                )}

                <div className="text-center my-4">
                  <div
                    className="d-flex align-items-center gap-3"
                    style={{ color: "#64748B", fontSize: "0.8rem" }}
                  >
                    <hr className="flex-grow-1 register-divider" />
                    <span>ALREADY A MEMBER?</span>
                    <hr className="flex-grow-1 register-divider" />
                  </div>
                </div>

                <p className="text-center mb-0" style={{ color: "#CBD5E1" }}>
                  Already have an account?{" "}
                  <Link to="/login" className="register-link">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            <div
              className="text-center small mt-4"
              style={{ color: "#64748B" }}
            >
              <Link to="/" className="text-decoration-none" style={{ color: "#94A3B8" }}>
                ← Back to LearnHub
              </Link>
              <div className="mt-3">
                LearnHub · Learn something extraordinary.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Register;