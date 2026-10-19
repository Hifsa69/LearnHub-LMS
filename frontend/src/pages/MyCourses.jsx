
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function MyCourses() {
    const navigate = useNavigate();

    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const theme = {
        background: "#0B1120",
        card: "#151F32",
        border: "#263449",
        text: "#F8FAFC",
        muted: "#94A3B8",
        cyan: "#22D3EE",
    };

    useEffect(() => {
        const user = JSON.parse(
            localStorage.getItem("user") || "null"
        );
        const token = localStorage.getItem("token");

        if (!token || !user) {
            navigate("/login");
            return;
        }

        if (user.role !== "student") {
            setError("This dashboard is available to students only.");
            setLoading(false);
            return;
        }

        const fetchMyCourses = async () => {
            try {
                const response = await API.get("/my-courses");
                setEnrollments(response.data.courses || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load your courses. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMyCourses();
    }, [navigate]);

    if (loading) {
        return (
            <div
                className="container-fluid py-5 text-center"
                style={{
                    background: theme.background,
                    color: theme.text,
                    minHeight: "100vh",
                }}
            >
                <div
                    className="spinner-border mb-3"
                    style={{ color: theme.cyan }}
                    role="status"
                />
                <h4>Loading Your Courses...</h4>
                <p style={{ color: theme.muted }}>
                    Please wait while we load your learning dashboard.
                </p>
            </div>
        );
    }

    return (
        <div
            className="container-fluid py-5 px-3 px-md-4"
            style={{
                background: theme.background,
                color: theme.text,
                minHeight: "100vh",
            }}
        >
            <div className="container-fluid px-0">
                {/* Dashboard Header */}
                <div className="mb-5">
                    <span
                        className="badge rounded-pill px-3 py-2 mb-3"
                        style={{
                            background: "rgba(34, 211, 238, 0.1)",
                            color: theme.cyan,
                            border: `1px solid ${theme.border}`,
                        }}
                    >
                        STUDENT DASHBOARD
                    </span>

                    <h1
                        className="fw-bold display-5 mb-3"
                        style={{ color: theme.text }}
                    >
                        My Learning Dashboard
                    </h1>

                    <p style={{ color: theme.muted }}>
                        View your enrolled courses and track your learning progress.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div
                        className="alert border"
                        role="alert"
                        style={{
                            background: "rgba(239, 68, 68, 0.1)",
                            color: "#FCA5A5",
                            borderColor: "#7F1D1D",
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Empty State */}
                {!error && enrollments.length === 0 && (
                    <div
                        className="card shadow-lg border"
                        style={{
                            background: theme.card,
                            borderColor: theme.border,
                            color: theme.text,
                            borderRadius: "16px",
                        }}
                    >
                        <div className="card-body text-center py-5 px-3">
                            <div className="display-3 mb-3">📚</div>

                            <h4 className="fw-bold mb-3">
                                No Enrolled Courses Yet
                            </h4>

                            <p
                                className="mb-4"
                                style={{ color: theme.muted }}
                            >
                                Explore available courses and enroll to start
                                your learning journey.
                            </p>

                            <Link
                                to="/courses"
                                className="btn fw-semibold px-4 py-2"
                                style={{
                                    background: theme.cyan,
                                    color: "#0B1120",
                                    border: "none",
                                    borderRadius: "8px",
                                }}
                            >
                                Explore Courses →
                            </Link>
                        </div>
                    </div>
                )}

                {/* Enrolled Course Cards */}
                <div className="row g-4">
                    {enrollments.map((enrollment) => {
                        const course = enrollment.course;

                        if (!course) {
                            return null;
                        }

                        const progress = Math.min(
                            100,
                            Math.max(0, Number(enrollment.progress) || 0)
                        );

                        return (
                            <div
                                className="col-12 col-md-6 col-xl-4"
                                key={enrollment._id}
                            >
                                <div
                                    className="card shadow-lg h-100 border"
                                    style={{
                                        background: theme.card,
                                        borderColor: theme.border,
                                        color: theme.text,
                                        borderRadius: "16px",
                                        transition: "transform 0.2s ease",
                                    }}
                                >
                                    <div className="card-body p-4 d-flex flex-column">
                                        {/* Category */}
                                        <div className="mb-3">
                                            <span
                                                className="badge px-3 py-2"
                                                style={{
                                                    background:
                                                        "rgba(6, 182, 212, 0.15)",
                                                    color: theme.cyan,
                                                    border: "1px solid #164E63",
                                                }}
                                            >
                                                {course.category || "General"}
                                            </span>
                                        </div>

                                        {/* Course Title */}
                                        <h4
                                            className="fw-bold mb-3"
                                            style={{ color: theme.text }}
                                        >
                                            {course.title}
                                        </h4>

                                        {/* Description */}
                                        <p
                                            className="mb-4"
                                            style={{
                                                color: theme.muted,
                                                lineHeight: "1.7",
                                            }}
                                        >
                                            {course.description}
                                        </p>

                                        {/* Instructor */}
                                        <p
                                            className="mb-2"
                                            style={{ color: "#CBD5E1" }}
                                        >
                                            <strong>Instructor:</strong>{" "}
                                            {course.instructor?.name ||
                                                "Not available"}
                                        </p>

                                        {/* Progress Header */}
                                        <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
                                            <span
                                                className="fw-semibold"
                                                style={{ color: "#CBD5E1" }}
                                            >
                                                Learning Progress
                                            </span>

                                            <span
                                                className="fw-bold"
                                                style={{ color: theme.cyan }}
                                            >
                                                {progress}%
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div
                                            className="progress mb-4"
                                            style={{
                                                height: "8px",
                                                background: theme.border,
                                                borderRadius: "10px",
                                            }}
                                            role="progressbar"
                                            aria-label="Course progress"
                                            aria-valuenow={progress}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            <div
                                                className="progress-bar"
                                                style={{
                                                    width: `${progress}%`,
                                                    background: theme.cyan,
                                                    borderRadius: "10px",
                                                    transition: "width 0.4s ease",
                                                }}
                                            />
                                        </div>

                                        {/* Course Actions */}
                                        <div className="mt-auto">
                                            <Link
                                                to={`/courses/${course._id}`}
                                                className="btn w-100 fw-semibold py-2"
                                                style={{
                                                    color: theme.cyan,
                                                    border: `1px solid ${theme.cyan}`,
                                                    borderRadius: "8px",
                                                    background: "transparent",
                                                }}
                                            >
                                                View Course →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default MyCourses;
