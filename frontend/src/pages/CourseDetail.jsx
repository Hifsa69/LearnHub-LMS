import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [lessonsError, setLessonsError] = useState("");

  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentMessage, setEnrollmentMessage] = useState("");
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch course details
  useEffect(() => {
    let active = true;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/courses/${id}`);

        if (active) {
          setCourse(response.data?.course || response.data);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Course could not be loaded. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchCourse();

    return () => {
      active = false;
    };
  }, [id]);

  // Fetch lessons for this course
  useEffect(() => {
    let active = true;

    const fetchLessons = async () => {
      try {
        setLessonsLoading(true);
        setLessonsError("");

        const response = await API.get(`/lessons/course/${id}`);

        if (active) {
          setLessons(
            Array.isArray(response.data)
              ? response.data
              : response.data?.lessons || []
          );
        }
      } catch (err) {
        if (active) {
          setLessonsError(
            err.response?.data?.message ||
              "Unable to load course lessons right now."
          );
        }
      } finally {
        if (active) setLessonsLoading(false);
      }
    };

    fetchLessons();

    return () => {
      active = false;
    };
  }, [id]);

  // Check whether the logged-in student is enrolled
  useEffect(() => {
    let active = true;

    const checkEnrollment = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        const user = savedUser ? JSON.parse(savedUser) : null;

        if (token && user?.role === "student") {
          const response = await API.get("/my-courses");
          const enrolledCourses = response.data?.courses || [];

          if (active) {
            setIsEnrolled(
              enrolledCourses.some((item) => {
                const courseId = item.course?._id || item.course;
                return String(courseId) === String(id);
              })
            );
          }
        } else if (active) {
          setIsEnrolled(false);
        }
      } catch (err) {
        console.error("Enrollment check failed:", err);
      } finally {
        if (active) setCheckingEnrollment(false);
      }
    };

    setCheckingEnrollment(true);
    checkEnrollment();

    return () => {
      active = false;
    };
  }, [id, token]);

  // Enroll in course
  const handleEnroll = async () => {
    let user = null;

    try {
      const savedUser = localStorage.getItem("user");
      user = savedUser ? JSON.parse(savedUser) : null;
    } catch {
      user = null;
    }

    if (!token || !user) {
      navigate("/login");
      return;
    }

    if (user.role !== "student") {
      setEnrollmentSuccess(false);
      setEnrollmentMessage("Only student accounts can enroll in courses.");
      return;
    }

    if (isEnrolled) return;

    try {
      setEnrolling(true);
      setEnrollmentMessage("");

      const response = await API.post("/enroll", {
        courseId: id,
      });

      setIsEnrolled(true);
      setEnrollmentSuccess(true);
      setEnrollmentMessage(
        response.data?.message || "You are successfully enrolled!"
      );
    } catch (err) {
      const serverMessage = err.response?.data?.message;

      if (
        serverMessage &&
        serverMessage.toLowerCase().includes("already enrolled")
      ) {
        setIsEnrolled(true);
        setEnrollmentSuccess(true);
      } else {
        setEnrollmentSuccess(false);
      }

      setEnrollmentMessage(
        serverMessage || "Enrollment failed. Please try again."
      );
    } finally {
      setEnrolling(false);
    }
  };

  const instructorName =
    typeof course?.instructor === "object"
      ? course.instructor?.name || course.instructor?.username
      : null;

  const coursePrice = Number(course?.price ?? 0);
  const isFree = coursePrice === 0;

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-PK", {
      maximumFractionDigits: 0,
    }).format(price);

  if (loading) {
    return (
      <div className="cd-page cd-centered">
        <div className="cd-loader" />
        <h3>Loading your course</h3>
        <p className="cd-muted">Getting everything ready for you...</p>
        <style>{styles}</style>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="cd-page cd-centered">
        <style>{styles}</style>

        <div className="cd-error-card">
          <div className="cd-error-icon">!</div>
          <h2>{error ? "Something went wrong" : "Course not found"}</h2>
          <p className="cd-muted">
            {error || "This course may have been removed or is unavailable."}
          </p>
          <Link to="/courses" className="cd-primary-btn">
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cd-page">
      <style>{styles}</style>

      <div className="cd-container">
        {/* Navigation */}
        <div className="cd-topbar">
          <Link to="/courses" className="cd-back-link">
            <span>←</span> All Courses
          </Link>

          <div className="cd-brand">
            <span className="cd-brand-icon">L</span>
            <span>Learn<span className="cd-brand-accent">Hub</span></span>
          </div>
        </div>

        {/* Course Hero */}
        <section className="cd-hero">
          <div className="cd-hero-glow" />

          <div className="cd-hero-content">
            <div className="cd-hero-badges">
              <span className="cd-category">
                {course.category || "General"}
              </span>

              <span className="cd-status">
                <span className="cd-status-dot" />
                Course Overview
              </span>
            </div>

            <h1 className="cd-title">{course.title}</h1>

            <p className="cd-description">
              {course.description ||
                "Explore the course content and start building your skills."}
            </p>

            <div className="cd-hero-meta">
              <div className="cd-meta-item">
                <span className="cd-meta-icon">▤</span>
                <span>
                  <strong>{lessonsLoading ? "..." : lessons.length}</strong>
                  <small>Lessons</small>
                </span>
              </div>

              <div className="cd-meta-divider" />

              <div className="cd-meta-item">
                <span className="cd-meta-icon">◈</span>
                <span>
                  <strong>{isFree ? "Free" : "Paid"}</strong>
                  <small>Course access</small>
                </span>
              </div>

              <div className="cd-meta-divider" />

              <div className="cd-meta-item">
                <span className="cd-meta-icon">✓</span>
                <span>
                  <strong>Self-paced</strong>
                  <small>Learning style</small>
                </span>
              </div>
            </div>

            <div className="cd-hero-actions">
              {checkingEnrollment ? (
                <button className="cd-primary-btn" disabled>
                  Checking enrollment...
                </button>
              ) : isEnrolled ? (
                <Link to={`/learn/${id}`} className="cd-primary-btn">
                  Continue Learning <span>→</span>
                </Link>
              ) : (
                <button
                  className="cd-primary-btn"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? (
                    <>
                      <span className="cd-small-spinner" />
                      Enrolling...
                    </>
                  ) : (
                    <>
                      Enroll Now <span>→</span>
                    </>
                  )}
                </button>
              )}

              <a href="#course-curriculum" className="cd-secondary-btn">
                Explore Curriculum
              </a>
            </div>

            {enrollmentMessage && (
              <div
                className={`cd-message ${
                  enrollmentSuccess ? "cd-message-success" : "cd-message-error"
                }`}
                role="status"
                aria-live="polite"
              >
                <span>{enrollmentSuccess ? "✓" : "!"}</span>
                {enrollmentMessage}
              </div>
            )}
          </div>

          <div className="cd-hero-art" aria-hidden="true">
            <div className="cd-art-orbit cd-orbit-one" />
            <div className="cd-art-orbit cd-orbit-two" />

            <div className="cd-art-card">
              <div className="cd-art-top">
                <span className="cd-art-dot" />
                <span className="cd-art-dot" />
                <span className="cd-art-dot" />
                <span className="cd-art-label">LEARNHUB / COURSE</span>
              </div>

              <div className="cd-art-symbol">{"</>"}</div>

              <div className="cd-art-line cd-art-line-long" />
              <div className="cd-art-line cd-art-line-medium" />
              <div className="cd-art-line cd-art-line-short" />

              <div className="cd-art-progress">
                <span />
              </div>

              <div className="cd-art-bottom">
                <span>LEARN SOMETHING NEW</span>
                <span>✦</span>
              </div>
            </div>

            <div className="cd-floating-badge cd-floating-top">
              <span>✦</span> Keep Growing
            </div>

            <div className="cd-floating-badge cd-floating-bottom">
              <span>✓</span> Your Next Skill
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="cd-content-grid">
          <main className="cd-main-column">
            {/* Curriculum */}
            <section className="cd-section" id="course-curriculum">
              <div className="cd-section-heading">
                <div>
                  <span className="cd-eyebrow">WHAT YOU'LL LEARN</span>
                  <h2>Course Curriculum</h2>
                  <p className="cd-muted">
                    Explore the lessons included in this course.
                  </p>
                </div>

                <div className="cd-lesson-count">
                  {lessonsLoading ? "..." : lessons.length} lessons
                </div>
              </div>

              {lessonsLoading ? (
                <div className="cd-state-card">
                  <div className="cd-loader cd-loader-small" />
                  <p>Loading course lessons...</p>
                </div>
              ) : lessonsError ? (
                <div className="cd-state-card cd-state-error">
                  <span className="cd-state-symbol">!</span>
                  <h3>Lessons unavailable</h3>
                  <p>{lessonsError}</p>
                </div>
              ) : lessons.length === 0 ? (
                <div className="cd-state-card">
                  <div className="cd-empty-icon">▤</div>
                  <h3>Lessons coming soon</h3>
                  <p>
                    The instructor hasn't added lessons to this course yet.
                    Check back later for updates.
                  </p>
                </div>
              ) : (
                <div className="cd-lesson-list">
                  {lessons.map((lesson, index) => (
                    <article className="cd-lesson" key={lesson._id || index}>
                      <div className="cd-lesson-number">
                        {lesson.order ?? index + 1}
                      </div>

                      <div className="cd-lesson-info">
                        <h3>{lesson.title || `Lesson ${index + 1}`}</h3>
                        <p>
                          {lesson.description || "Explore this lesson's content."}
                        </p>

                        {lesson.videoUrl && (
                          <a
                            href={lesson.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="cd-video-link"
                          >
                            <span>▶</span> Open Lesson Video
                          </a>
                        )}
                      </div>

                      <div className="cd-lesson-mark" aria-hidden="true">
                        ▷
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* Instructor */}
            <section className="cd-section cd-instructor-section">
              <span className="cd-eyebrow">YOUR GUIDE</span>
              <h2>Meet Your Instructor</h2>

              <div className="cd-instructor-card">
                <div className="cd-instructor-avatar">
                  {(instructorName || "I").charAt(0).toUpperCase()}
                </div>

                <div className="cd-instructor-info">
                  <h3>{instructorName || "LearnHub Instructor"}</h3>
                  <p>
                    {instructorName
                      ? "Course instructor"
                      : "Instructor information is not available."}
                  </p>
                </div>

                <div className="cd-instructor-check">✓</div>
              </div>
            </section>
          </main>

          {/* Course summary sidebar */}
          <aside className="cd-sidebar">
            <div className="cd-summary-card">
              <div className="cd-summary-header">
                <span className="cd-eyebrow">COURSE SUMMARY</span>
                <span className="cd-summary-sparkle">✦</span>
              </div>

              <div className="cd-price-label">Course Price</div>

              <div className="cd-price">
                {isFree ? (
                  <span className="cd-free-price">Free</span>
                ) : (
                  <>
                    <span className="cd-currency">PKR</span>
                    {formatPrice(coursePrice)}
                  </>
                )}
              </div>

              <div className="cd-summary-divider" />

              <div className="cd-summary-row">
                <span><span className="cd-row-icon">▤</span> Total lessons</span>
                <strong>{lessonsLoading ? "..." : lessons.length}</strong>
              </div>

              <div className="cd-summary-row">
                <span><span className="cd-row-icon">◈</span> Category</span>
                <strong>{course.category || "General"}</strong>
              </div>

              <div className="cd-summary-row">
                <span><span className="cd-row-icon">✓</span> Learning mode</span>
                <strong>Self-paced</strong>
              </div>

              <div className="cd-summary-row">
                <span><span className="cd-row-icon">∞</span> Learning access</span>
                <strong>Online</strong>
              </div>

              <div className="cd-summary-divider" />

              {checkingEnrollment ? (
                <button className="cd-primary-btn cd-full-btn" disabled>
                  Checking...
                </button>
              ) : isEnrolled ? (
                <Link to={`/learn/${id}`} className="cd-primary-btn cd-full-btn">
                  Continue Learning →
                </Link>
              ) : (
                <button
                  className="cd-primary-btn cd-full-btn"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? "Enrolling..." : "Enroll in Course →"}
                </button>
              )}

              <p className="cd-secure-note">
                <span>✓</span> Learn at your own pace
              </p>
            </div>

            <div className="cd-help-card">
              <div className="cd-help-icon">✦</div>
              <h3>Ready to level up?</h3>
              <p>
                Every new lesson is a chance to learn something valuable.
                Start your journey today.
              </p>
              <Link to="/courses" className="cd-help-link">
                Discover more courses →
              </Link>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="cd-footer">
          <span>Learn<span className="cd-brand-accent">Hub</span></span>
          <span>Learn. Build. Grow.</span>
        </footer>
      </div>
    </div>
  );
}

const styles = `
  .cd-page {
    min-height: 100vh;
    padding: 28px 22px 36px;
    color: #F8FAFC;
    background:
      radial-gradient(ellipse at 12% 0%, rgba(34,211,238,.07), transparent 32%),
      radial-gradient(ellipse at 88% 28%, rgba(124,58,237,.07), transparent 35%),
      #080D1A;
  }

  .cd-container {
    width: 100%;
    max-width: 1240px;
    margin: 0 auto;
  }

  .cd-centered {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    text-align: center;
  }

  .cd-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 28px;
  }

  .cd-back-link {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    color: #94A3B8;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    transition: color .2s;
  }

  .cd-back-link:hover {
    color: #67E8F9;
  }

  .cd-back-link span {
    font-size: 19px;
  }

  .cd-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #F8FAFC;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -.6px;
  }

  .cd-brand-icon {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 11px;
    background: linear-gradient(135deg, #22D3EE, #6366F1);
    color: #08111F;
    box-shadow: 0 0 24px rgba(34,211,238,.16);
  }

  .cd-brand-accent {
    color: #22D3EE;
  }

  .cd-hero {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(260px, .75fr);
    align-items: center;
    gap: 30px;
    overflow: hidden;
    padding: 48px;
    border: 1px solid #263449;
    border-radius: 25px;
    background: linear-gradient(120deg, #111B2D 0%, #101A2C 60%, #131A31 100%);
    box-shadow: 0 24px 70px rgba(0,0,0,.23);
  }

  .cd-hero-glow {
    position: absolute;
    top: -130px;
    right: 12%;
    width: 350px;
    height: 350px;
    border-radius: 50%;
    background: rgba(34,211,238,.08);
    filter: blur(75px);
    pointer-events: none;
  }

  .cd-hero-content {
    position: relative;
    z-index: 2;
    min-width: 0;
  }

  .cd-hero-badges {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 22px;
  }

  .cd-category {
    padding: 8px 12px;
    border: 1px solid rgba(34,211,238,.25);
    border-radius: 9px;
    background: rgba(34,211,238,.09);
    color: #67E8F9;
    font-size: 12px;
    font-weight: 700;
  }

  .cd-status {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: #94A3B8;
    font-size: 12px;
  }

  .cd-status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #34D399;
    box-shadow: 0 0 10px rgba(52,211,153,.5);
  }

  .cd-title {
    max-width: 700px;
    margin: 0 0 18px;
    color: #F8FAFC;
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 850;
    line-height: 1.12;
    letter-spacing: -1.7px;
    overflow-wrap: anywhere;
  }

  .cd-description {
    max-width: 650px;
    margin: 0;
    color: #A7B4C8;
    font-size: 15px;
    line-height: 1.9;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }

  .cd-hero-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 18px;
    margin: 28px 0;
  }

  .cd-meta-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cd-meta-icon {
    display: grid;
    place-items: center;
    width: 37px;
    height: 37px;
    border: 1px solid #2B3A50;
    border-radius: 11px;
    background: #0C1525;
    color: #67E8F9;
    font-size: 17px;
  }

  .cd-meta-item strong,
  .cd-meta-item small {
    display: block;
  }

  .cd-meta-item strong {
    color: #E2E8F0;
    font-size: 12px;
  }

  .cd-meta-item small {
    margin-top: 3px;
    color: #718198;
    font-size: 11px;
  }

  .cd-meta-divider {
    width: 1px;
    height: 29px;
    background: #2B3A50;
  }

  .cd-hero-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .cd-primary-btn,
  .cd-secondary-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 47px;
    padding: 13px 19px;
    border-radius: 11px;
    font-size: 13px;
    font-weight: 800;
    text-align: center;
    text-decoration: none;
    transition: transform .2s, box-shadow .2s, background .2s;
  }

  .cd-primary-btn {
    border: 1px solid transparent;
    background: linear-gradient(105deg, #22D3EE, #06B6D4);
    color: #071823;
    cursor: pointer;
    box-shadow: 0 7px 25px rgba(34,211,238,.1);
  }

  .cd-primary-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    color: #071823;
    box-shadow: 0 10px 30px rgba(34,211,238,.2);
  }

  .cd-primary-btn:disabled {
    cursor: not-allowed;
    opacity: .65;
  }

  .cd-secondary-btn {
    border: 1px solid #334155;
    background: rgba(255,255,255,.015);
    color: #CBD5E1;
  }

  .cd-secondary-btn:hover {
    border-color: #64748B;
    background: rgba(148,163,184,.06);
    color: #F8FAFC;
  }

  .cd-small-spinner {
    width: 15px;
    height: 15px;
    border: 2px solid rgba(7,24,35,.25);
    border-top-color: #071823;
    border-radius: 50%;
    animation: cd-spin .7s linear infinite;
  }

  .cd-message {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-top: 18px;
    padding: 12px 14px;
    border-radius: 10px;
    font-size: 13px;
    line-height: 1.6;
  }

  .cd-message-success {
    border: 1px solid rgba(52,211,153,.23);
    background: rgba(16,185,129,.08);
    color: #6EE7B7;
  }

  .cd-message-error {
    border: 1px solid rgba(248,113,113,.23);
    background: rgba(239,68,68,.08);
    color: #FCA5A5;
  }

  .cd-hero-art {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 300px;
  }

  .cd-art-orbit {
    position: absolute;
    border: 1px solid rgba(34,211,238,.15);
    border-radius: 50%;
    transform: rotate(-20deg);
  }

  .cd-orbit-one {
    width: 290px;
    height: 230px;
  }

  .cd-orbit-two {
    width: 240px;
    height: 300px;
    border-color: rgba(129,140,248,.15);
    transform: rotate(40deg);
  }

  .cd-art-card {
    position: relative;
    z-index: 1;
    width: min(100%, 300px);
    padding: 19px;
    overflow: hidden;
    border: 1px solid rgba(103,232,249,.25);
    border-radius: 19px;
    background: linear-gradient(145deg, rgba(23,38,61,.97), rgba(10,19,34,.97));
    box-shadow: 0 24px 60px rgba(0,0,0,.38), 0 0 35px rgba(34,211,238,.06);
    transform: rotate(-3deg);
  }

  .cd-art-top {
    display: flex;
    align-items: center;
    gap: 5px;
    padding-bottom: 16px;
    border-bottom: 1px solid #263449;
  }

  .cd-art-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #475569;
  }

  .cd-art-dot:first-child {
    background: #F87171;
  }

  .cd-art-dot:nth-child(2) {
    background: #FBBF24;
  }

  .cd-art-dot:nth-child(3) {
    background: #34D399;
  }

  .cd-art-label {
    margin-left: auto;
    color: #718198;
    font-size: 8px;
    letter-spacing: 1px;
  }

  .cd-art-symbol {
    padding: 24px 0 18px;
    color: #67E8F9;
    font-size: 54px;
    font-weight: 900;
    letter-spacing: -5px;
    text-shadow: 0 0 25px rgba(34,211,238,.24);
  }

  .cd-art-line {
    height: 7px;
    margin-bottom: 10px;
    border-radius: 10px;
    background: #26364D;
  }

  .cd-art-line-long {
    width: 90%;
  }

  .cd-art-line-medium {
    width: 70%;
  }

  .cd-art-line-short {
    width: 48%;
  }

  .cd-art-progress {
    height: 5px;
    margin-top: 22px;
    overflow: hidden;
    border-radius: 10px;
    background: #263449;
  }

  .cd-art-progress span {
    display: block;
    width: 65%;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #22D3EE, #818CF8);
  }

  .cd-art-bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    color: #64748B;
    font-size: 8px;
    letter-spacing: 1px;
  }

  .cd-art-bottom span:last-child {
    color: #67E8F9;
  }

  .cd-floating-badge {
    position: absolute;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 13px;
    border: 1px solid #334155;
    border-radius: 11px;
    background: #111B2D;
    color: #CBD5E1;
    font-size: 11px;
    font-weight: 700;
    box-shadow: 0 10px 30px rgba(0,0,0,.24);
  }

  .cd-floating-badge span {
    color: #67E8F9;
  }

  .cd-floating-top {
    top: 18px;
    right: -3px;
  }

  .cd-floating-bottom {
    bottom: 14px;
    left: -8px;
  }

  .cd-content-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 315px;
    align-items: start;
    gap: 25px;
    margin-top: 30px;
  }

  .cd-main-column {
    min-width: 0;
  }

  .cd-section {
    padding: 28px;
    border: 1px solid #263449;
    border-radius: 20px;
    background: rgba(17,27,45,.72);
  }

  .cd-section + .cd-section {
    margin-top: 22px;
  }

  .cd-section-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 24px;
  }

  .cd-eyebrow {
    color: #22D3EE;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.6px;
  }

  .cd-section h2 {
    margin: 9px 0 8px;
    color: #F8FAFC;
    font-size: 23px;
    font-weight: 800;
    letter-spacing: -.6px;
  }

  .cd-muted {
    color: #94A3B8;
    font-size: 13px;
    line-height: 1.7;
  }

  .cd-section-heading .cd-muted {
    margin: 0;
  }

  .cd-lesson-count {
    flex-shrink: 0;
    padding: 8px 11px;
    border: 1px solid #334155;
    border-radius: 9px;
    background: #0B1220;
    color: #A5F3FC;
    font-size: 11px;
    font-weight: 700;
  }

  .cd-lesson-list {
    display: grid;
    gap: 11px;
  }

  .cd-lesson {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    padding: 17px;
    border: 1px solid #28364B;
    border-radius: 13px;
    background: #0D1728;
    transition: border-color .2s, transform .2s, background .2s;
  }

  .cd-lesson:hover {
    transform: translateY(-2px);
    border-color: rgba(34,211,238,.35);
    background: #111D30;
  }

  .cd-lesson-number {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 39px;
    height: 39px;
    border: 1px solid rgba(34,211,238,.2);
    border-radius: 11px;
    background: rgba(34,211,238,.08);
    color: #67E8F9;
    font-size: 13px;
    font-weight: 800;
  }

  .cd-lesson-info {
    min-width: 0;
    flex: 1;
  }

  .cd-lesson-info h3 {
    margin: 2px 0 7px;
    color: #E2E8F0;
    font-size: 14px;
    font-weight: 750;
    overflow-wrap: anywhere;
  }

  .cd-lesson-info p {
    margin: 0;
    color: #94A3B8;
    font-size: 12px;
    line-height: 1.7;
    overflow-wrap: anywhere;
  }

  .cd-lesson-mark {
    color: #475569;
    font-size: 20px;
  }

  .cd-video-link {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    margin-top: 12px;
    color: #67E8F9;
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
  }

  .cd-video-link:hover {
    color: #A5F3FC;
  }

  .cd-state-card {
    padding: 32px 20px;
    border: 1px dashed #334155;
    border-radius: 14px;
    background: rgba(11,18,32,.65);
    text-align: center;
  }

  .cd-state-card h3 {
    margin: 12px 0 8px;
    color: #E2E8F0;
    font-size: 15px;
    font-weight: 750;
  }

  .cd-state-card p {
    max-width: 390px;
    margin: 0 auto;
    color: #94A3B8;
    font-size: 12px;
    line-height: 1.8;
    overflow-wrap: anywhere;
  }

  .cd-empty-icon {
    color: #67E8F9;
    font-size: 30px;
  }

  .cd-state-symbol {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    margin: 0 auto;
    border-radius: 50%;
    background: rgba(248,113,113,.1);
    color: #FCA5A5;
    font-weight: 800;
  }

  .cd-instructor-section > h2 {
    margin-bottom: 20px;
  }

  .cd-instructor-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 17px;
    border: 1px solid #28364B;
    border-radius: 14px;
    background: #0D1728;
  }

  .cd-instructor-avatar {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 49px;
    height: 49px;
    border: 1px solid rgba(34,211,238,.25);
    border-radius: 15px;
    background: linear-gradient(145deg, rgba(34,211,238,.16), rgba(99,102,241,.16));
    color: #67E8F9;
    font-size: 20px;
    font-weight: 850;
  }

  .cd-instructor-info {
    flex: 1;
    min-width: 0;
  }

  .cd-instructor-info h3 {
    margin: 0 0 5px;
    color: #F1F5F9;
    font-size: 14px;
    font-weight: 750;
    overflow-wrap: anywhere;
  }

  .cd-instructor-info p {
    margin: 0;
    color: #94A3B8;
    font-size: 12px;
  }

  .cd-instructor-check {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    border: 1px solid rgba(52,211,153,.2);
    border-radius: 50%;
    background: rgba(52,211,153,.08);
    color: #6EE7B7;
    font-size: 12px;
  }

  .cd-sidebar {
    display: grid;
    gap: 18px;
  }

  .cd-summary-card {
    position: sticky;
    top: 20px;
    padding: 24px;
    border: 1px solid #2B3B51;
    border-radius: 19px;
    background: linear-gradient(155deg, #141F33, #0D1728);
    box-shadow: 0 18px 45px rgba(0,0,0,.2);
  }

  .cd-summary-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .cd-summary-sparkle {
    color: #67E8F9;
    font-size: 20px;
  }

  .cd-price-label {
    margin-top: 24px;
    color: #94A3B8;
    font-size: 12px;
  }

  .cd-price {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 7px;
    margin: 6px 0 22px;
    color: #F8FAFC;
    font-size: clamp(28px, 3vw, 35px);
    font-weight: 850;
    letter-spacing: -1.2px;
    overflow-wrap: anywhere;
  }

  .cd-currency {
    color: #67E8F9;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: .5px;
  }

  .cd-free-price {
    color: #6EE7B7;
  }

  .cd-summary-divider {
    height: 1px;
    margin: 19px 0;
    background: #29374C;
  }

  .cd-summary-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin: 16px 0;
    color: #94A3B8;
    font-size: 12px;
  }

  .cd-summary-row > span {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cd-summary-row strong {
    max-width: 50%;
    color: #E2E8F0;
    font-size: 11px;
    text-align: right;
    overflow-wrap: anywhere;
  }

  .cd-row-icon {
    color: #67E8F9;
    font-size: 14px;
  }

  .cd-full-btn {
    width: 100%;
  }

  .cd-secure-note {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 7px;
    margin: 15px 0 0;
    color: #718198;
    font-size: 10px;
  }

  .cd-secure-note span {
    color: #6EE7B7;
  }

  .cd-help-card {
    padding: 22px;
    border: 1px solid rgba(99,102,241,.2);
    border-radius: 17px;
    background: linear-gradient(145deg, rgba(99,102,241,.09), rgba(34,211,238,.035));
  }

  .cd-help-icon {
    display: grid;
    place-items: center;
    width: 37px;
    height: 37px;
    border: 1px solid rgba(129,140,248,.2);
    border-radius: 11px;
    background: rgba(99,102,241,.1);
    color: #A5B4FC;
    font-size: 17px;
  }

  .cd-help-card h3 {
    margin: 16px 0 8px;
    color: #F1F5F9;
    font-size: 15px;
    font-weight: 800;
  }

  .cd-help-card p {
    margin: 0;
    color: #94A3B8;
    font-size: 12px;
    line-height: 1.8;
  }

  .cd-help-link {
    display: inline-block;
    margin-top: 15px;
    color: #67E8F9;
    font-size: 12px;
    font-weight: 750;
    text-decoration: none;
  }

  .cd-help-link:hover {
    color: #A5F3FC;
  }

  .cd-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    margin-top: 35px;
    padding-top: 20px;
    border-top: 1px solid #202C40;
    color: #64748B;
    font-size: 11px;
  }

  .cd-footer > span:first-child {
    color: #CBD5E1;
    font-size: 13px;
    font-weight: 800;
  }

  .cd-loader {
    width: 38px;
    height: 38px;
    margin-bottom: 18px;
    border: 3px solid #263449;
    border-top-color: #22D3EE;
    border-radius: 50%;
    animation: cd-spin .8s linear infinite;
  }

  .cd-loader-small {
    width: 25px;
    height: 25px;
    margin: 0 auto 15px;
  }

  @keyframes cd-spin {
    to { transform: rotate(360deg); }
  }

  .cd-centered h3 {
    margin-bottom: 8px;
    color: #F8FAFC;
    font-size: 20px;
    font-weight: 800;
  }

  .cd-error-card {
    width: 100%;
    max-width: 500px;
    padding: 35px 25px;
    border: 1px solid #263449;
    border-radius: 20px;
    background: #111B2D;
  }

  .cd-error-icon {
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    margin: 0 auto 18px;
    border-radius: 14px;
    background: rgba(248,113,113,.1);
    color: #FCA5A5;
    font-size: 23px;
    font-weight: 900;
  }

  .cd-error-card h2 {
    margin-bottom: 10px;
    color: #F8FAFC;
    font-size: 23px;
    font-weight: 800;
  }

  .cd-error-card .cd-primary-btn {
    margin-top: 12px;
  }

  @media (max-width: 1000px) {
    .cd-hero {
      grid-template-columns: minmax(0, 1fr) 280px;
      padding: 34px;
    }

    .cd-content-grid {
      grid-template-columns: minmax(0, 1fr) 280px;
      gap: 18px;
    }

    .cd-hero-meta {
      gap: 12px;
    }

    .cd-meta-divider {
      display: none;
    }
  }

  @media (max-width: 800px) {
    .cd-hero {
      grid-template-columns: 1fr;
      padding: 30px;
    }

    .cd-hero-art {
      min-height: 270px;
    }

    .cd-content-grid {
      grid-template-columns: 1fr;
    }

    .cd-sidebar {
      grid-row: 1;
    }

    .cd-summary-card {
      position: static;
    }

    .cd-help-card {
      display: none;
    }
  }

  @media (max-width: 520px) {
    .cd-page {
      padding: 18px 12px 25px;
    }

    .cd-topbar {
      margin-bottom: 18px;
    }

    .cd-brand {
      font-size: 17px;
    }

    .cd-brand-icon {
      width: 30px;
      height: 30px;
    }

    .cd-hero {
      gap: 18px;
      padding: 23px 18px;
      border-radius: 19px;
    }

    .cd-title {
      font-size: 32px;
      letter-spacing: -1.1px;
    }

    .cd-description {
      font-size: 13px;
    }

    .cd-hero-meta {
      gap: 14px;
    }

    .cd-meta-item {
      gap: 7px;
    }

    .cd-meta-icon {
      width: 32px;
      height: 32px;
      font-size: 14px;
    }

    .cd-hero-actions {
      align-items: stretch;
      flex-direction: column;
    }

    .cd-primary-btn,
    .cd-secondary-btn {
      width: 100%;
    }

    .cd-hero-art {
      min-height: 245px;
    }

    .cd-art-card {
      max-width: 250px;
    }

    .cd-floating-top {
      right: 0;
    }

    .cd-floating-bottom {
      left: 0;
    }

    .cd-section {
      padding: 20px 15px;
      border-radius: 16px;
    }

    .cd-section-heading {
      flex-direction: column;
    }

    .cd-section h2 {
      font-size: 21px;
    }

    .cd-lesson {
      gap: 10px;
      padding: 13px;
    }

    .cd-lesson-number {
      width: 33px;
      height: 33px;
      border-radius: 9px;
      font-size: 11px;
    }

    .cd-lesson-mark {
      display: none;
    }

    .cd-summary-card {
      padding: 20px;
    }

    .cd-footer {
      align-items: flex-start;
      flex-direction: column;
      gap: 8px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cd-page *,
    .cd-page *::before,
    .cd-page *::after {
      animation-duration: .01ms !important;
      transition-duration: .01ms !important;
    }
  }
`;

export default CourseDetail;