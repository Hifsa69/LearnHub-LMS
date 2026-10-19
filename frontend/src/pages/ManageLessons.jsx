import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";

function ManageLessons() {
    const { courseId } = useParams();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [order, setOrder] = useState(1);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");
    const [loading, setLoading] = useState(false);
    const [lessons, setLessons] = useState([]);
    const [fetchingLessons, setFetchingLessons] = useState(true);

    const fetchLessons = useCallback(async () => {
        setFetchingLessons(true);

        try {
            const response = await API.get(`/lessons/course/${courseId}`);
            const data = response.data;
            setLessons(Array.isArray(data.lessons) ? data.lessons : []);
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Unable to fetch lessons."
            );
            setMessageType("danger");
        } finally {
            setFetchingLessons(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchLessons();
    }, [fetchLessons]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!title.trim() || !description.trim()) {
            setMessage("Please enter the lesson title and description.");
            setMessageType("danger");
            return;
        }

        if (!Number.isInteger(Number(order)) || Number(order) < 1) {
            setMessage("Lesson order must be a whole number starting from 1.");
            setMessageType("danger");
            return;
        }

        setLoading(true);

        try {
            const response = await API.post("/lessons", {
                title: title.trim(),
                description: description.trim(),
                courseId,
                videoUrl: videoUrl.trim(),
                order: Number(order),
            });

            setMessage(
                response.data.message || "Lesson created successfully."
            );
            setMessageType("success");

            setTitle("");
            setDescription("");
            setVideoUrl("");
            setOrder(lessons.length + 2);

            await fetchLessons();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to create lesson. Please try again."
            );
            setMessageType("danger");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="lh-manage-page">
            <style>{`
                .lh-manage-page {
                    min-height: 100vh;
                    padding: 38px 16px 55px;
                    color: #F8FAFC;
                    background:
                        radial-gradient(ellipse at 10% 0%, rgba(34,211,238,.07), transparent 35%),
                        radial-gradient(ellipse at 100% 25%, rgba(129,140,248,.06), transparent 30%),
                        #0B1120;
                }

                .lh-manage-container {
                    max-width: 900px;
                    margin: 0 auto;
                }

                .lh-manage-back {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 20px;
                    color: #94A3B8;
                    font-size: 13px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: color .2s ease;
                }

                .lh-manage-back:hover {
                    color: #22D3EE;
                }

                .lh-manage-heading {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                    margin-bottom: 25px;
                }

                .lh-manage-heading-icon {
                    display: grid;
                    flex-shrink: 0;
                    place-items: center;
                    width: 52px;
                    height: 52px;
                    color: #67E8F9;
                    background: linear-gradient(145deg, rgba(34,211,238,.15), rgba(129,140,248,.12));
                    border: 1px solid rgba(34,211,238,.22);
                    border-radius: 16px;
                    font-size: 23px;
                }

                .lh-manage-eyebrow {
                    margin-bottom: 5px;
                    color: #22D3EE;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 1.8px;
                }

                .lh-manage-title {
                    margin: 0 0 7px;
                    color: #F8FAFC;
                    font-size: clamp(24px, 4vw, 32px);
                    font-weight: 800;
                    letter-spacing: -1px;
                }

                .lh-manage-subtitle {
                    margin: 0;
                    color: #94A3B8;
                    font-size: 13px;
                    line-height: 1.7;
                }

                .lh-manage-panel {
                    overflow: hidden;
                    margin-bottom: 23px;
                    background: linear-gradient(145deg, #151F32, #111A2B);
                    border: 1px solid #263449;
                    border-radius: 18px;
                    box-shadow: 0 15px 35px rgba(0,0,0,.12);
                }

                .lh-manage-panel-header {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    padding: 18px 22px;
                    border-bottom: 1px solid #263449;
                }

                .lh-manage-panel-header i {
                    color: #22D3EE;
                    font-size: 18px;
                }

                .lh-manage-panel-header h3 {
                    margin: 0;
                    color: #F8FAFC;
                    font-size: 15px;
                    font-weight: 750;
                }

                .lh-manage-form {
                    padding: 22px;
                }

                .lh-manage-label {
                    display: block;
                    margin-bottom: 8px;
                    color: #CBD5E1;
                    font-size: 12px;
                    font-weight: 700;
                }

                .lh-manage-required {
                    color: #22D3EE;
                }

                .lh-manage-input,
                .lh-manage-textarea {
                    display: block;
                    width: 100%;
                    padding: 11px 13px;
                    color: #F8FAFC;
                    background: #0B1323;
                    border: 1px solid #2B3A50;
                    border-radius: 10px;
                    outline: none;
                    font-size: 13px;
                    line-height: 1.6;
                    transition: border-color .2s ease, box-shadow .2s ease;
                }

                .lh-manage-input {
                    min-height: 43px;
                }

                .lh-manage-textarea {
                    min-height: 112px;
                    resize: vertical;
                }

                .lh-manage-input::placeholder,
                .lh-manage-textarea::placeholder {
                    color: #64748B;
                }

                .lh-manage-input:focus,
                .lh-manage-textarea:focus {
                    border-color: #22D3EE;
                    box-shadow: 0 0 0 3px rgba(34,211,238,.09);
                }

                .lh-manage-help {
                    display: block;
                    margin-top: 7px;
                    color: #64748B;
                    font-size: 11px;
                    line-height: 1.6;
                }

                .lh-manage-field {
                    margin-bottom: 18px;
                }

                .lh-manage-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    margin-top: 22px;
                }

                .lh-manage-primary,
                .lh-manage-secondary {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    min-height: 42px;
                    padding: 10px 16px;
                    border-radius: 10px;
                    font-size: 12px;
                    font-weight: 800;
                    text-decoration: none;
                    transition: transform .2s ease, background .2s ease;
                }

                .lh-manage-primary {
                    color: #07111D;
                    background: linear-gradient(110deg, #67E8F9, #22D3EE);
                    border: 1px solid transparent;
                    box-shadow: 0 5px 16px rgba(34,211,238,.1);
                }

                .lh-manage-primary:hover:not(:disabled) {
                    color: #07111D;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(34,211,238,.2);
                }

                .lh-manage-primary:disabled {
                    cursor: not-allowed;
                    opacity: .65;
                }

                .lh-manage-secondary {
                    color: #CBD5E1;
                    background: #111B2D;
                    border: 1px solid #334155;
                }

                .lh-manage-secondary:hover {
                    color: #67E8F9;
                    background: #17263B;
                    border-color: #22D3EE;
                }

                .lh-manage-alert {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 12px 14px;
                    margin-bottom: 18px;
                    border: 1px solid;
                    border-radius: 10px;
                    font-size: 12px;
                    line-height: 1.6;
                }

                .lh-manage-alert.success {
                    color: #A7F3D0;
                    background: rgba(16,185,129,.08);
                    border-color: rgba(16,185,129,.25);
                }

                .lh-manage-alert.danger {
                    color: #FCA5A5;
                    background: rgba(239,68,68,.08);
                    border-color: rgba(239,68,68,.25);
                }

                .lh-manage-alert.info {
                    color: #A5F3FC;
                    background: rgba(34,211,238,.07);
                    border-color: rgba(34,211,238,.2);
                }

                .lh-lessons-count {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 27px;
                    height: 25px;
                    padding: 0 8px;
                    color: #67E8F9;
                    background: rgba(34,211,238,.09);
                    border: 1px solid rgba(34,211,238,.2);
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 800;
                }

                .lh-lesson-list {
                    display: flex;
                    flex-direction: column;
                    gap: 11px;
                    padding: 16px;
                }

                .lh-lesson-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 13px;
                    min-width: 0;
                    padding: 15px;
                    background: rgba(11,19,35,.75);
                    border: 1px solid #263449;
                    border-radius: 13px;
                    transition: border-color .2s ease, transform .2s ease;
                }

                .lh-lesson-item:hover {
                    border-color: rgba(34,211,238,.3);
                    transform: translateY(-1px);
                }

                .lh-lesson-number {
                    display: grid;
                    flex-shrink: 0;
                    place-items: center;
                    width: 37px;
                    height: 37px;
                    color: #67E8F9;
                    background: rgba(34,211,238,.09);
                    border: 1px solid rgba(34,211,238,.18);
                    border-radius: 11px;
                    font-size: 12px;
                    font-weight: 800;
                }

                .lh-lesson-details {
                    flex: 1;
                    min-width: 0;
                }

                .lh-lesson-title {
                    margin: 1px 0 6px;
                    color: #F1F5F9;
                    font-size: 13px;
                    font-weight: 750;
                    overflow-wrap: anywhere;
                }

                .lh-lesson-description {
                    margin: 0;
                    color: #94A3B8;
                    font-size: 12px;
                    line-height: 1.7;
                    overflow-wrap: anywhere;
                    white-space: pre-wrap;
                }

                .lh-lesson-status {
                    display: inline-flex;
                    flex-shrink: 0;
                    align-items: center;
                    gap: 5px;
                    padding: 5px 8px;
                    color: #A7F3D0;
                    background: rgba(16,185,129,.08);
                    border: 1px solid rgba(16,185,129,.18);
                    border-radius: 7px;
                    font-size: 9px;
                    font-weight: 800;
                }

                .lh-lesson-video {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    margin-top: 10px;
                    color: #67E8F9;
                    font-size: 11px;
                    font-weight: 700;
                    text-decoration: none;
                }

                .lh-lesson-video:hover {
                    color: #CFFAFE;
                }

                .lh-manage-empty {
                    padding: 34px 20px;
                    text-align: center;
                    color: #94A3B8;
                }

                .lh-manage-empty-icon {
                    display: grid;
                    place-items: center;
                    width: 52px;
                    height: 52px;
                    margin: 0 auto 13px;
                    color: #67E8F9;
                    background: rgba(34,211,238,.08);
                    border: 1px solid rgba(34,211,238,.17);
                    border-radius: 16px;
                    font-size: 22px;
                }

                .lh-manage-empty h4 {
                    margin: 0 0 6px;
                    color: #E2E8F0;
                    font-size: 14px;
                    font-weight: 750;
                }

                .lh-manage-empty p {
                    margin: 0;
                    font-size: 12px;
                }

                .lh-manage-loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 30px 15px;
                    color: #94A3B8;
                    font-size: 12px;
                }

                .lh-manage-spinner {
                    width: 18px;
                    height: 18px;
                    border: 2px solid #263449;
                    border-top-color: #22D3EE;
                    border-radius: 50%;
                    animation: lh-manage-spin .7s linear infinite;
                }

                @keyframes lh-manage-spin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 575px) {
                    .lh-manage-page {
                        padding: 26px 12px 38px;
                    }

                    .lh-manage-heading {
                        gap: 12px;
                    }

                    .lh-manage-heading-icon {
                        width: 44px;
                        height: 44px;
                        border-radius: 13px;
                        font-size: 20px;
                    }

                    .lh-manage-form {
                        padding: 17px;
                    }

                    .lh-manage-panel-header {
                        padding: 15px 17px;
                    }

                    .lh-manage-actions {
                        flex-direction: column;
                    }

                    .lh-manage-primary,
                    .lh-manage-secondary {
                        width: 100%;
                    }

                    .lh-lesson-item {
                        gap: 10px;
                        padding: 12px;
                    }

                    .lh-lesson-status {
                        font-size: 0;
                        padding: 6px;
                    }

                    .lh-lesson-status i {
                        font-size: 11px;
                    }

                    .lh-lesson-list {
                        padding: 11px;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .lh-manage-page *,
                    .lh-manage-page *::before,
                    .lh-manage-page *::after {
                        animation-duration: .01ms !important;
                        transition-duration: .01ms !important;
                    }
                }
            `}</style>

            <div className="lh-manage-container">
                <Link to="/instructor-dashboard" className="lh-manage-back">
                    <i className="bi bi-arrow-left"></i>
                    Back to Instructor Dashboard
                </Link>

                <header className="lh-manage-heading">
                    <div className="lh-manage-heading-icon">
                        <i className="bi bi-journal-bookmark-fill"></i>
                    </div>

                    <div>
                        <div className="lh-manage-eyebrow">
                            INSTRUCTOR WORKSPACE
                        </div>
                        <h1 className="lh-manage-title">Manage Lessons</h1>
                        <p className="lh-manage-subtitle">
                            Build your course lesson by lesson. Add notes,
                            video resources, and keep content organized.
                        </p>
                    </div>
                </header>

                {message && (
                    <div
                        className={`lh-manage-alert ${messageType}`}
                        role="alert"
                    >
                        <i
                            className={`bi ${
                                messageType === "success"
                                    ? "bi-check-circle-fill"
                                    : messageType === "danger"
                                      ? "bi-exclamation-circle-fill"
                                      : "bi-info-circle-fill"
                            }`}
                        ></i>
                        <span>{message}</span>
                    </div>
                )}

                {/* Add Lesson Form */}
                <section className="lh-manage-panel">
                    <div className="lh-manage-panel-header">
                        <i className="bi bi-plus-circle"></i>
                        <h3>Add a New Lesson</h3>
                    </div>

                    <form className="lh-manage-form" onSubmit={handleSubmit}>
                        <div className="lh-manage-field">
                            <label className="lh-manage-label" htmlFor="lessonTitle">
                                Lesson Title <span className="lh-manage-required">*</span>
                            </label>
                            <input
                                id="lessonTitle"
                                type="text"
                                className="lh-manage-input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Introduction to React"
                                maxLength={150}
                                required
                            />
                        </div>

                        <div className="lh-manage-field">
                            <label className="lh-manage-label" htmlFor="lessonDescription">
                                Description & Notes <span className="lh-manage-required">*</span>
                            </label>
                            <textarea
                                id="lessonDescription"
                                className="lh-manage-textarea"
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What will students learn in this lesson?"
                                maxLength={5000}
                                required
                            />
                        </div>

                        <div className="row g-3">
                            <div className="col-12 col-md-8">
                                <div className="lh-manage-field mb-0">
                                    <label className="lh-manage-label" htmlFor="videoUrl">
                                        Video URL <span style={{ color: "#64748B", fontWeight: 500 }}>(optional)</span>
                                    </label>
                                    <input
                                        id="videoUrl"
                                        type="url"
                                        className="lh-manage-input"
                                        value={videoUrl}
                                        onChange={(e) => setVideoUrl(e.target.value)}
                                        placeholder="https://www.youtube.com/embed/..."
                                    />
                                    <small className="lh-manage-help">
                                        Use a valid video link supported by your learning player.
                                    </small>
                                </div>
                            </div>

                            <div className="col-12 col-md-4">
                                <div className="lh-manage-field mb-0">
                                    <label className="lh-manage-label" htmlFor="lessonOrder">
                                        Lesson Number <span className="lh-manage-required">*</span>
                                    </label>
                                    <input
                                        id="lessonOrder"
                                        type="number"
                                        className="lh-manage-input"
                                        min="1"
                                        step="1"
                                        value={order}
                                        onChange={(e) => setOrder(e.target.value)}
                                        required
                                    />
                                    <small className="lh-manage-help">
                                        Controls lesson sequence.
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div className="lh-manage-actions">
                            <button
                                type="submit"
                                className="lh-manage-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Saving Lesson...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-plus-lg"></i>
                                        Add Lesson
                                    </>
                                )}
                            </button>

                            <Link
                                to="/instructor-dashboard"
                                className="lh-manage-secondary"
                            >
                                <i className="bi bi-arrow-left"></i>
                                Back to Dashboard
                            </Link>
                        </div>
                    </form>
                </section>

                {/* Existing Lessons */}
                <section className="lh-manage-panel">
                    <div className="lh-manage-panel-header">
                        <i className="bi bi-collection-play"></i>
                        <h3>Course Lessons</h3>
                        <span className="lh-lessons-count">
                            {lessons.length}
                        </span>
                    </div>

                    {fetchingLessons ? (
                        <div className="lh-manage-loading">
                            <span className="lh-manage-spinner"></span>
                            Loading course lessons...
                        </div>
                    ) : lessons.length === 0 ? (
                        <div className="lh-manage-empty">
                            <div className="lh-manage-empty-icon">
                                <i className="bi bi-journal-plus"></i>
                            </div>
                            <h4>No lessons yet</h4>
                            <p>Add your first lesson using the form above.</p>
                        </div>
                    ) : (
                        <div className="lh-lesson-list">
                            {[...lessons]
                                .sort((a, b) => Number(a.order) - Number(b.order))
                                .map((lesson) => (
                                    <article className="lh-lesson-item" key={lesson._id}>
                                        <div className="lh-lesson-number">
                                            {lesson.order}
                                        </div>

                                        <div className="lh-lesson-details">
                                            <h4 className="lh-lesson-title">
                                                {lesson.title}
                                            </h4>
                                            <p className="lh-lesson-description">
                                                {lesson.description}
                                            </p>

                                            {lesson.videoUrl && (
                                                <a
                                                    href={lesson.videoUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="lh-lesson-video"
                                                >
                                                    <i className="bi bi-play-circle-fill"></i>
                                                    Open Lesson Video
                                                    <i className="bi bi-arrow-up-right"></i>
                                                </a>
                                            )}
                                        </div>

                                        <span className="lh-lesson-status">
                                            <i className="bi bi-check-circle-fill"></i>
                                            Saved
                                        </span>
                                    </article>
                                ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

export default ManageLessons;
