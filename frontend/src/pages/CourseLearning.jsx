
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";

function CourseLearning() {
    const { courseId } = useParams();

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const loadLearningData = async () => {
            try {
                setLoading(true);
                setError("");

                const enrollmentResponse = await API.get("/my-courses");
                const enrollments = enrollmentResponse.data.courses || [];

                const enrollment = enrollments.find(
                    (item) =>
                        String(item.course?._id || item.course) === courseId
                );

                if (!enrollment) {
                    setError("You are not enrolled in this course.");
                    return;
                }

                setCourse(enrollment.course);
                setProgress(enrollment.progress || 0);
                setCompletedLessons(
                    (enrollment.completedLessons || []).map(
                        (lesson) => String(lesson._id || lesson)
                    )
                );

                const lessonsResponse = await API.get(
                    `/lessons/course/${courseId}`
                );

                const fetchedLessons = lessonsResponse.data.lessons || [];
                setLessons(fetchedLessons);

                const completed = enrollment.completedLessons || [];
                const firstIncompleteIndex = fetchedLessons.findIndex(
                    (lesson) =>
                        !completed.some(
                            (item) =>
                                String(item._id || item) === String(lesson._id)
                        )
                );

                if (firstIncompleteIndex !== -1) {
                    setCurrentIndex(firstIncompleteIndex);
                }
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load your learning panel."
                );
            } finally {
                setLoading(false);
            }
        };

        loadLearningData();
    }, [courseId]);

    const currentLesson = lessons[currentIndex];

    const markComplete = async () => {
        if (!currentLesson || completedLessons.includes(currentLesson._id)) {
            return;
        }

        try {
            setSaving(true);

            const response = await API.patch(
                "/enroll/complete-lesson",
                {
                    courseId,
                    lessonId: currentLesson._id
                }
            );

            setCompletedLessons((previous) =>
                previous.includes(currentLesson._id)
                    ? previous
                    : [...previous, currentLesson._id]
            );

            setProgress(response.data.progress ?? progress);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to save lesson progress."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div
                className="container-fluid py-5 text-center"
                style={{ background: "#0B1120", color: "#F8FAFC", minHeight: "100vh" }}
            >
                <div className="spinner-border text-info" />
                <p className="mt-3">Loading your classroom...</p>
            </div>
        );
    }

    if (error && !course) {
        return (
            <div
                className="container-fluid py-5 px-4"
                style={{ background: "#0B1120", color: "#F8FAFC", minHeight: "100vh" }}
            >
                <div className="alert alert-warning">{error}</div>
                <Link to="/my-courses" className="btn btn-outline-info">
                    Back to My Courses
                </Link>
            </div>
        );
    }

    return (
        <div
            className="container-fluid py-4 px-3 px-md-4"
            style={{ background: "#0B1120", color: "#F8FAFC", minHeight: "100vh" }}
        >
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                    <Link
                        to="/my-courses"
                        className="text-info text-decoration-none small"
                    >
                        ← My Courses
                    </Link>
                    <h2 className="fw-bold mt-2 mb-1">
                        {course?.title || "Course Classroom"}
                    </h2>
                    <p style={{ color: "#94A3B8" }} className="mb-0">
                        Your learning space
                    </p>
                </div>

                <div style={{ minWidth: "180px" }}>
                    <div className="d-flex justify-content-between small mb-2">
                        <span>Course progress</span>
                        <span className="text-info">{progress}%</span>
                    </div>
                    <div
                        className="progress"
                        style={{ background: "#263449", height: "8px" }}
                    >
                        <div
                            className="progress-bar bg-info"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {lessons.length === 0 ? (
                <div className="card p-4" style={{ background: "#151F32", color: "#F8FAFC" }}>
                    No lessons have been added to this course yet.
                </div>
            ) : (
                <div className="row g-4">
                    <div className="col-lg-8">
                        <div
                            className="card overflow-hidden"
                            style={{ background: "#151F32", borderColor: "#263449" }}
                        >
                            <div
                                className="ratio ratio-16x9"
                                style={{ background: "#050914" }}
                            >
                                {currentLesson?.videoUrl ? (
                                    <iframe
                                        src={currentLesson.videoUrl}
                                        title={currentLesson.title}
                                        allowFullScreen
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        style={{ border: 0 }}
                                    />
                                ) : (
                                    <div className="d-flex align-items-center justify-content-center text-center p-4">
                                        <div>
                                            <div className="display-4 mb-2">▶</div>
                                            <p className="mb-0 text-secondary">
                                                No video available for this lesson
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="card-body p-4">
                                <span className="badge bg-info text-dark mb-3">
                                    Lesson {currentIndex + 1} of {lessons.length}
                                </span>

                                <h3 className="fw-bold">
                                    {currentLesson?.title}
                                </h3>

                                <hr style={{ borderColor: "#334155" }} />

                                <h5 className="fw-semibold mb-3">
                                    Lesson Notes
                                </h5>

                                <p
                                    style={{
                                        color: "#CBD5E1",
                                        whiteSpace: "pre-wrap",
                                        lineHeight: 1.8
                                    }}
                                >
                                    {currentLesson?.description}
                                </p>

                                <div className="d-flex flex-wrap gap-2 mt-4">
                                    <button
                                        className="btn btn-outline-info"
                                        disabled={currentIndex === 0}
                                        onClick={() =>
                                            setCurrentIndex((index) => index - 1)
                                        }
                                    >
                                        ← Previous
                                    </button>

                                    <button
                                        className="btn btn-info fw-semibold"
                                        disabled={
                                            saving ||
                                            completedLessons.includes(currentLesson?._id)
                                        }
                                        onClick={markComplete}
                                    >
                                        {saving
                                            ? "Saving..."
                                            : completedLessons.includes(currentLesson?._id)
                                            ? "✓ Completed"
                                            : "Mark as Complete"}
                                    </button>

                                    <button
                                        className="btn btn-outline-info ms-md-auto"
                                        disabled={currentIndex === lessons.length - 1}
                                        onClick={() =>
                                            setCurrentIndex((index) => index + 1)
                                        }
                                    >
                                        Next →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div
                            className="card"
                            style={{
                                background: "#151F32",
                                borderColor: "#263449",
                                color: "#F8FAFC"
                            }}
                        >
                            <div className="card-body">
                                <h5 className="fw-bold mb-1">Course Content</h5>
                                <p className="small mb-3" style={{ color: "#94A3B8" }}>
                                    {completedLessons.length} of {lessons.length} lessons completed
                                </p>

                                <div
                                    className="progress mb-4"
                                    style={{ height: "5px", background: "#263449" }}
                                >
                                    <div
                                        className="progress-bar bg-info"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>

                                <div className="list-group list-group-flush">
                                    {lessons.map((lesson, index) => {
                                        const isCompleted = completedLessons.includes(
                                            lesson._id
                                        );
                                        const isActive = index === currentIndex;

                                        return (
                                            <button
                                                key={lesson._id}
                                                type="button"
                                                className="list-group-item list-group-item-action d-flex align-items-start gap-3 text-start"
                                                onClick={() => {
                                                    setCurrentIndex(index);
                                                    setError("");
                                                }}
                                                style={{
                                                    background: isActive ? "#123344" : "#111B2D",
                                                    color: "#F8FAFC",
                                                    borderColor: "#263449",
                                                    borderLeft: isActive
                                                        ? "3px solid #22D3EE"
                                                        : "3px solid transparent"
                                                }}
                                            >
                                                <span className="text-info">
                                                    {isCompleted ? "✓" : "▶"}
                                                </span>

                                                <span>
                                                    <span className="d-block small mb-1" style={{ color: "#94A3B8" }}>
                                                        Lesson {index + 1}
                                                    </span>
                                                    <span className="fw-semibold">
                                                        {lesson.title}
                                                    </span>
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CourseLearning;
