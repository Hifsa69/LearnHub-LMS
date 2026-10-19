import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function InstructorDashboard() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingCourse, setEditingCourse] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const loadDashboard = useCallback(async () => {
    let user = null;

    try {
      user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      user = null;
    }

    const token = localStorage.getItem("token");

    if (!token || !user) {
      navigate("/login");
      return;
    }

    if (user.role !== "instructor") {
      setError("Access denied. Instructor access is required.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await API.get("/courses");

      const allCourses = Array.isArray(response.data)
        ? response.data
        : response.data?.courses || [];

      const currentInstructorId = String(user.id || user._id || "");

      const visibleCourses = allCourses.filter((course) => {
        const instructorId =
          typeof course.instructor === "object"
            ? course.instructor?._id
            : course.instructor;

        return String(instructorId || "") === currentInstructorId;
      });

      setCourses(visibleCourses);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load courses. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard, refreshKey]);

  const startEditing = (course) => {
    setNotice("");
    setError("");

    setEditingCourse({
      _id: course._id,
      title: course.title || "",
      description: course.description || "",
      category: course.category || "",
      price: course.price ?? 0,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditingCourse((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleUpdateCourse = async (event) => {
    event.preventDefault();

    if (!editingCourse) return;

    if (
      !editingCourse.title.trim() ||
      !editingCourse.description.trim() ||
      !editingCourse.category.trim() ||
      !Number.isFinite(Number(editingCourse.price)) ||
      Number(editingCourse.price) < 0
    ) {
      setError(
        "Please enter valid course details and a non-negative price."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setNotice("");

      const { _id, title, description, category, price } = editingCourse;

      await API.put(`/courses/${_id}`, {
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        price: Number(price),
      });

      setEditingCourse(null);
      setNotice("Course updated successfully.");
      setRefreshKey((value) => value + 1);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update the course. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async (course) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(course._id);
      setError("");
      setNotice("");

      const response = await API.delete(`/courses/${course._id}`);

      if (editingCourse?._id === course._id) {
        setEditingCourse(null);
      }

      setNotice(response.data?.message || "Course deleted successfully.");
      setRefreshKey((value) => value + 1);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete the course. Please try again."
      );
    } finally {
      setDeletingId("");
    }
  };

  const categories = useMemo(
    () => [
      "All",
      ...new Set(courses.map((course) => course.category).filter(Boolean)),
    ],
    [courses]
  );

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !query ||
        course.title?.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || course.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [courses, search, category]);

  const totalValue = courses.reduce(
    (total, course) => total + (Number(course.price) || 0),
    0
  );

  const formatPrice = (price) =>
    `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;

  if (loading) {
    return (
      <main className="id-page d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div
            className="spinner-border mb-3"
            role="status"
            aria-label="Loading dashboard"
            style={{ color: "#22D3EE" }}
          />
          <h5 className="text-white fw-semibold">
            Preparing your workspace...
          </h5>
          <p className="id-muted mb-0">Loading your courses</p>
        </div>

        <style>{dashboardStyles}</style>
      </main>
    );
  }

  return (
    <main className="id-page">
      <style>{dashboardStyles}</style>

      <div className="container-fluid px-3 px-lg-5 py-4 py-lg-5 id-content">
        {/* Top navigation */}
        <nav className="id-topbar d-flex flex-wrap align-items-center justify-content-between gap-3 mb-5">
          <Link to="/" className="id-brand text-decoration-none">
            <span className="id-brand-icon">L</span>
            <span>
              Learn<span className="id-gradient">Hub</span>
              <small className="d-block id-muted id-brand-caption">
                INSTRUCTOR STUDIO
              </small>
            </span>
          </Link>

          <div className="d-flex align-items-center flex-wrap gap-2">
            <Link to="/courses" className="id-button id-button-secondary">
              <span>⌕</span> Browse Courses
            </Link>

            <button
              type="button"
              className="id-button id-button-secondary"
              onClick={() => setRefreshKey((value) => value + 1)}
              disabled={loading}
            >
              ↻ Refresh
            </button>

            <Link to="/add-course" className="id-button id-button-primary">
              <span>＋</span> Create Course
            </Link>
          </div>
        </nav>

        {/* Welcome header */}
        <section className="id-hero mb-4">
          <div className="id-hero-orb id-orb-one" />
          <div className="id-hero-orb id-orb-two" />

          <div className="position-relative">
            <div className="id-eyebrow mb-3">
              <span className="id-live-dot" />
              YOUR INSTRUCTOR WORKSPACE
            </div>

            <h1 className="id-hero-title fw-bold mb-3">
              Teach. Inspire.
              <br />
              <span className="id-gradient">Make an impact.</span>
            </h1>

            <p className="id-hero-description mb-0">
              Manage your courses, refine your content, and create a better
              learning experience for your students.
            </p>

            <div className="d-flex flex-wrap gap-3 mt-4">
              <Link to="/add-course" className="id-button id-button-primary">
                Create a New Course <span>↗</span>
              </Link>

              <a href="#course-management" className="id-button id-button-glass">
                Manage My Courses <span>↓</span>
              </a>
            </div>
          </div>

          <div className="id-hero-decoration" aria-hidden="true">
            <div className="id-decoration-ring id-ring-one" />
            <div className="id-decoration-ring id-ring-two" />
            <div className="id-decoration-core">✦</div>
          </div>
        </section>

        {/* Alerts */}
        {error && (
          <div className="id-alert id-alert-error mb-4" role="alert">
            <span className="id-alert-icon">!</span>
            <div className="flex-grow-1">
              <strong>Something needs your attention</strong>
              <div className="small mt-1">{error}</div>
            </div>
            <button
              type="button"
              className="id-alert-close"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {notice && (
          <div className="id-alert id-alert-success mb-4" role="status">
            <span className="id-alert-icon">✓</span>
            <div className="flex-grow-1">{notice}</div>
            <button
              type="button"
              className="id-alert-close"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}

        {/* Edit course form */}
        {editingCourse && (
          <section className="id-panel mb-5" id="edit-course">
            <div className="id-panel-heading">
              <div className="d-flex align-items-center gap-3">
                <div className="id-heading-icon">✎</div>
                <div>
                  <h2 className="h4 fw-bold mb-1">Edit Course</h2>
                  <p className="id-muted small mb-0">
                    Update your course information below.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="id-icon-button"
                onClick={() => setEditingCourse(null)}
                disabled={saving}
                aria-label="Close edit form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateCourse} className="p-3 p-md-4">
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <label htmlFor="editTitle" className="id-label">
                    Course Title
                  </label>
                  <input
                    id="editTitle"
                    name="title"
                    className="form-control id-input"
                    value={editingCourse.title}
                    onChange={handleEditChange}
                    maxLength={150}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="editCategory" className="id-label">
                    Category
                  </label>
                  <input
                    id="editCategory"
                    name="category"
                    className="form-control id-input"
                    value={editingCourse.category}
                    onChange={handleEditChange}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="editDescription" className="id-label">
                    Course Description
                  </label>
                  <textarea
                    id="editDescription"
                    name="description"
                    className="form-control id-input"
                    rows="4"
                    value={editingCourse.description}
                    onChange={handleEditChange}
                    maxLength={5000}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="editPrice" className="id-label">
                    Course Price (PKR)
                  </label>
                  <input
                    id="editPrice"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-control id-input"
                    value={editingCourse.price}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="col-12 d-flex flex-wrap gap-2 pt-2">
                  <button
                    type="submit"
                    className="id-button id-button-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Saving Changes...
                      </>
                    ) : (
                      <>✓ Save Changes</>
                    )}
                  </button>

                  <button
                    type="button"
                    className="id-button id-button-secondary"
                    onClick={() => setEditingCourse(null)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </section>
        )}

        {/* Stats */}
        <section className="row g-3 g-xl-4 mb-5">
          <div className="col-12 col-sm-6 col-xl-4">
            <article className="id-stat-card id-stat-cyan">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="id-muted mb-2">Total Courses</p>
                  <h2 className="id-stat-number">{courses.length}</h2>
                  <span className="id-stat-caption">Courses you manage</span>
                </div>
                <div className="id-stat-icon">▤</div>
              </div>
              <div className="id-stat-bottom">
                <span>COURSE LIBRARY</span>
                <span>↗</span>
              </div>
            </article>
          </div>

          <div className="col-12 col-sm-6 col-xl-4">
            <article className="id-stat-card id-stat-purple">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="id-muted mb-2">Categories</p>
                  <h2 className="id-stat-number">
                    {Math.max(categories.length - 1, 0)}
                  </h2>
                  <span className="id-stat-caption">
                    Across your course collection
                  </span>
                </div>
                <div className="id-stat-icon">◈</div>
              </div>
              <div className="id-stat-bottom">
                <span>CONTENT ORGANIZATION</span>
                <span>✦</span>
              </div>
            </article>
          </div>

          <div className="col-12 col-sm-6 col-xl-4">
            <article className="id-stat-card id-stat-green">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="id-muted mb-2">Listed Course Value</p>
                  <h2 className="id-stat-price">{formatPrice(totalValue)}</h2>
                  <span className="id-stat-caption">
                    Combined listed prices
                  </span>
                </div>
                <div className="id-stat-icon">₨</div>
              </div>
              <div className="id-stat-bottom">
                <span>PRICE OVERVIEW</span>
                <span>↗</span>
              </div>
            </article>
          </div>
        </section>

        {/* Course management */}
        <section className="id-panel" id="course-management">
          <div className="id-panel-heading">
            <div className="d-flex align-items-center gap-3">
              <div className="id-heading-icon">▤</div>
              <div>
                <h2 className="h4 fw-bold mb-1">Course Management</h2>
                <p className="id-muted small mb-0">
                  Search, edit, and organize your learning content.
                </p>
              </div>
            </div>

            <span className="id-count-badge">
              {filteredCourses.length}{" "}
              {filteredCourses.length === 1 ? "COURSE" : "COURSES"}
            </span>
          </div>

          <div className="p-3 p-md-4">
            {/* Search and filter */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-lg-7">
                <label htmlFor="courseSearch" className="id-label">
                  Search your courses
                </label>
                <div className="id-search-wrap">
                  <span className="id-search-icon" aria-hidden="true">
                    ⌕
                  </span>
                  <input
                    id="courseSearch"
                    type="search"
                    className="form-control id-input id-search-input"
                    placeholder="Search by course title or description..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 col-lg-5">
                <label htmlFor="courseCategory" className="id-label">
                  Filter by category
                </label>
                <select
                  id="courseCategory"
                  className="form-select id-input"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Course table or empty state */}
            {filteredCourses.length === 0 ? (
              <div className="id-empty-state">
                <div className="id-empty-icon">
                  {courses.length === 0 ? "✦" : "⌕"}
                </div>

                <h3 className="h5 fw-bold mb-2">
                  {courses.length === 0
                    ? "Your course library is waiting"
                    : "No matching courses found"}
                </h3>

                <p className="id-muted mb-4">
                  {courses.length === 0
                    ? "Create your first course and start building your learning content."
                    : "Try a different keyword or select another category."}
                </p>

                {courses.length === 0 ? (
                  <Link
                    to="/add-course"
                    className="id-button id-button-primary"
                  >
                    ＋ Create Your First Course
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="id-button id-button-secondary"
                    onClick={() => {
                      setSearch("");
                      setCategory("All");
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="table-responsive id-table-wrap">
                <table className="table id-table align-middle mb-0">
                  <thead>
                    <tr>
                      <th scope="col">COURSE DETAILS</th>
                      <th scope="col">CATEGORY</th>
                      <th scope="col">PRICE</th>
                      <th scope="col" className="text-end">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr key={course._id}>
                        <td>
                          <div className="d-flex align-items-start gap-3">
                            <div className="id-course-avatar">
                              {(course.title || "C")
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="id-course-info">
                              <div className="fw-semibold id-course-title">
                                {course.title}
                              </div>
                              <p className="id-course-description mb-0">
                                {course.description ||
                                  "No description provided."}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="id-category-badge">
                            {course.category || "General"}
                          </span>
                        </td>

                        <td>
                          <span className="id-price">
                            {formatPrice(course.price)}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex flex-wrap justify-content-end gap-2">
                            <Link
                              to={`/courses/${course._id}`}
                              className="id-action id-action-view"
                              aria-label={`View ${course.title}`}
                            >
                              View
                            </Link>

                            <button
                              type="button"
                              className="id-action id-action-edit"
                              onClick={() => startEditing(course)}
                              disabled={Boolean(deletingId) || saving}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="id-action id-action-lessons"
                              onClick={() =>
                                navigate(`/instructor/lessons/${course._id}`)
                              }
                              disabled={Boolean(deletingId) || saving}
                            >
                              Lessons
                            </button>

                            <button
                              type="button"
                              className="id-action id-action-delete"
                              onClick={() => handleDeleteCourse(course)}
                              disabled={Boolean(deletingId) || saving}
                            >
                              {deletingId === course._id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="id-table-footer d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
              <span className="id-muted small">
                Showing {filteredCourses.length} of {courses.length} courses
              </span>

              <span className="id-muted small">
                <span className="id-live-dot d-inline-block me-2" />
                Instructor workspace
              </span>
            </div>
          </div>
        </section>

        <footer className="id-footer text-center mt-5 pt-4">
          <div className="id-brand justify-content-center mb-2">
            <span className="id-brand-icon id-brand-icon-small">L</span>
            <span>
              Learn<span className="id-gradient">Hub</span>
            </span>
          </div>
          <p className="id-muted small mb-0">
            Create. Teach. Inspire. Keep growing.
          </p>
        </footer>
      </div>
    </main>
  );
}

const dashboardStyles = `
  .id-page {
    min-height: 100vh;
    color: #F8FAFC;
    background:
      radial-gradient(ellipse at 5% 0%, rgba(6,182,212,.08), transparent 30%),
      radial-gradient(ellipse at 100% 45%, rgba(124,58,237,.07), transparent 35%),
      #080D1A;
    font-family: inherit;
  }

  .id-content { max-width: 1800px; margin: 0 auto; }

  .id-muted { color: #94A3B8; }

  .id-gradient {
    background: linear-gradient(100deg, #67E8F9, #A78BFA, #F0ABFC);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .id-topbar {
    padding-bottom: 22px;
    border-bottom: 1px solid rgba(148,163,184,.13);
  }

  .id-brand {
    display: inline-flex;
    align-items: center;
    gap: 11px;
    color: #F8FAFC;
    font-size: 1.35rem;
    font-weight: 800;
  }

  .id-brand:hover { color: #F8FAFC; }

  .id-brand-icon {
    width: 43px;
    height: 43px;
    display: grid;
    place-items: center;
    border-radius: 13px;
    background: linear-gradient(135deg, #67E8F9, #A78BFA);
    color: #08111F;
    font-size: 1.35rem;
    box-shadow: 0 5px 22px rgba(34,211,238,.16);
  }

  .id-brand-icon-small {
    width: 29px;
    height: 29px;
    font-size: 1rem;
    border-radius: 9px;
  }

  .id-brand-caption {
    font-size: .6rem;
    letter-spacing: 1.6px;
    font-weight: 600;
  }

  .id-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 42px;
    padding: 10px 16px;
    border: 1px solid transparent;
    border-radius: 11px;
    font-size: .88rem;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
  }

  .id-button:hover { transform: translateY(-2px); }
  .id-button:disabled { opacity: .55; cursor: not-allowed; transform: none; }

  .id-button-primary {
    color: #07111F;
    background: linear-gradient(110deg, #67E8F9, #22D3EE);
    box-shadow: 0 5px 20px rgba(34,211,238,.12);
  }

  .id-button-primary:hover {
    color: #07111F;
    box-shadow: 0 8px 25px rgba(34,211,238,.25);
  }

  .id-button-secondary {
    color: #CBD5E1;
    background: rgba(17,27,45,.8);
    border-color: #2B3950;
  }

  .id-button-secondary:hover,
  .id-button-glass:hover {
    color: #67E8F9;
    border-color: rgba(34,211,238,.5);
  }

  .id-button-glass {
    color: #F8FAFC;
    background: rgba(255,255,255,.04);
    border-color: rgba(148,163,184,.22);
  }

  .id-hero {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    padding: clamp(28px, 5vw, 65px);
    border: 1px solid rgba(148,163,184,.17);
    border-radius: 25px;
    background:
      radial-gradient(ellipse at 85% 15%, rgba(124,58,237,.22), transparent 38%),
      radial-gradient(ellipse at 10% 100%, rgba(6,182,212,.13), transparent 45%),
      linear-gradient(135deg, #111C30, #0D1526 65%, #13132A);
  }

  .id-hero-orb {
    position: absolute;
    z-index: -1;
    width: 230px;
    height: 230px;
    border-radius: 50%;
    filter: blur(75px);
    opacity: .16;
    pointer-events: none;
  }

  .id-orb-one { background: #22D3EE; right: 15%; top: 0; }
  .id-orb-two { background: #A78BFA; right: 0; bottom: -90px; }

  .id-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 8px 13px;
    border: 1px solid rgba(34,211,238,.25);
    border-radius: 100px;
    color: #A5F3FC;
    background: rgba(34,211,238,.07);
    font-size: .7rem;
    letter-spacing: 1.4px;
    font-weight: 700;
  }

  .id-live-dot {
    width: 7px;
    height: 7px;
    flex-shrink: 0;
    border-radius: 50%;
    background: #34D399;
    box-shadow: 0 0 10px rgba(52,211,153,.6);
  }

  .id-hero-title {
    position: relative;
    z-index: 1;
    font-size: clamp(2.2rem, 4.4vw, 3.65rem);
    line-height: 1.12;
    letter-spacing: -1.7px;
  }

  .id-hero-description {
    position: relative;
    z-index: 1;
    max-width: 610px;
    color: #A6B3C8;
    line-height: 1.9;
    font-size: 1rem;
  }

  .id-hero-decoration {
    position: absolute;
    width: 240px;
    height: 240px;
    right: 8%;
    top: 50%;
    transform: translateY(-50%);
    display: grid;
    place-items: center;
    pointer-events: none;
  }

  .id-decoration-ring {
    position: absolute;
    border: 1px solid rgba(103,232,249,.16);
    border-radius: 50%;
  }

  .id-ring-one { width: 150px; height: 150px; }
  .id-ring-two { width: 220px; height: 220px; border-color: rgba(167,139,250,.14); }

  .id-decoration-core {
    width: 76px;
    height: 76px;
    display: grid;
    place-items: center;
    border-radius: 25px;
    color: #07111F;
    font-size: 2rem;
    background: linear-gradient(135deg, #67E8F9, #A78BFA);
    box-shadow: 0 0 60px rgba(34,211,238,.22);
  }

  .id-alert {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 15px 17px;
    border: 1px solid;
    border-radius: 13px;
  }

  .id-alert-error {
    color: #FECACA;
    background: rgba(127,29,29,.18);
    border-color: rgba(248,113,113,.28);
  }

  .id-alert-success {
    color: #BBF7D0;
    background: rgba(6,78,59,.2);
    border-color: rgba(52,211,153,.25);
  }

  .id-alert-icon {
    width: 25px;
    height: 25px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border: 1px solid currentColor;
    border-radius: 50%;
    font-weight: 800;
  }

  .id-alert-close {
    padding: 0 5px;
    color: inherit;
    background: transparent;
    border: none;
    font-size: 1.4rem;
    line-height: 1;
  }

  .id-stat-card {
    position: relative;
    height: 100%;
    min-height: 175px;
    padding: 25px;
    overflow: hidden;
    border: 1px solid rgba(148,163,184,.17);
    border-radius: 19px;
    background: linear-gradient(145deg, rgba(20,31,51,.98), rgba(12,20,35,.98));
    transition: transform .25s ease, border-color .25s ease;
  }

  .id-stat-card:hover { transform: translateY(-4px); }

  .id-stat-cyan:hover { border-color: rgba(34,211,238,.4); }
  .id-stat-purple:hover { border-color: rgba(167,139,250,.4); }
  .id-stat-green:hover { border-color: rgba(52,211,153,.4); }

  .id-stat-icon {
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    border-radius: 15px;
    font-size: 1.5rem;
  }

  .id-stat-cyan .id-stat-icon {
    color: #67E8F9;
    background: rgba(34,211,238,.11);
  }

  .id-stat-purple .id-stat-icon {
    color: #C4B5FD;
    background: rgba(167,139,250,.12);
  }

  .id-stat-green .id-stat-icon {
    color: #6EE7B7;
    background: rgba(52,211,153,.1);
  }

  .id-stat-number {
    font-size: 2.65rem;
    line-height: 1.1;
    font-weight: 800;
    letter-spacing: -1px;
    color: #F8FAFC;
  }

  .id-stat-price {
    font-size: clamp(1.4rem, 2.3vw, 2rem);
    font-weight: 800;
    color: #F8FAFC;
    overflow-wrap: anywhere;
  }

  .id-stat-caption { color: #94A3B8; font-size: .82rem; }

  .id-stat-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    padding-top: 14px;
    border-top: 1px solid rgba(148,163,184,.12);
    color: #64748B;
    font-size: .65rem;
    letter-spacing: 1.2px;
    font-weight: 700;
  }

  .id-panel {
    overflow: hidden;
    border: 1px solid rgba(148,163,184,.17);
    border-radius: 20px;
    background: rgba(17,27,45,.82);
    box-shadow: 0 15px 45px rgba(0,0,0,.12);
  }

  .id-panel-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 15px;
    padding: 23px 25px;
    border-bottom: 1px solid rgba(148,163,184,.13);
    background: rgba(255,255,255,.015);
  }

  .id-heading-icon {
    width: 45px;
    height: 45px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border: 1px solid rgba(34,211,238,.2);
    border-radius: 14px;
    color: #67E8F9;
    background: rgba(34,211,238,.09);
    font-size: 1.35rem;
  }

  .id-count-badge {
    padding: 8px 12px;
    border: 1px solid rgba(34,211,238,.2);
    border-radius: 9px;
    color: #A5F3FC;
    background: rgba(34,211,238,.07);
    font-size: .7rem;
    letter-spacing: .8px;
    font-weight: 700;
  }

  .id-label {
    display: block;
    margin-bottom: 9px;
    color: #CBD5E1;
    font-size: .83rem;
    font-weight: 600;
  }

  .id-input {
    min-height: 46px;
    border: 1px solid #2B3950;
    border-radius: 10px;
    background-color: #0B1425;
    color: #F8FAFC;
    padding: 11px 13px;
  }

  .id-input::placeholder { color: #718096; }

  .id-input:focus {
    border-color: #22D3EE;
    background-color: #0B1425;
    color: #F8FAFC;
    box-shadow: 0 0 0 3px rgba(34,211,238,.1);
  }

  .id-input option {
    color: #F8FAFC;
    background: #111B2D;
  }

  .id-search-wrap { position: relative; }

  .id-search-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    z-index: 2;
    transform: translateY(-50%);
    color: #67E8F9;
    font-size: 1.4rem;
    line-height: 1;
    pointer-events: none;
  }

  .id-search-input { padding-left: 42px; }

  .id-table-wrap {
    border: 1px solid rgba(148,163,184,.12);
    border-radius: 13px;
  }

  .id-table {
    --bs-table-bg: transparent;
    --bs-table-color: #E2E8F0;
    --bs-table-border-color: rgba(148,163,184,.12);
    --bs-table-hover-bg: rgba(34,211,238,.035);
    --bs-table-hover-color: #F8FAFC;
    color: #E2E8F0;
    min-width: 850px;
  }

  .id-table thead th {
    padding: 15px 16px;
    color: #94A3B8;
    background: #0D1728;
    border-bottom: 1px solid rgba(148,163,184,.16);
    font-size: .68rem;
    letter-spacing: 1px;
    font-weight: 700;
    white-space: nowrap;
  }

  .id-table tbody td {
    padding: 18px 16px;
    vertical-align: middle;
  }

  .id-table tbody tr:last-child td { border-bottom: none; }

  .id-course-avatar {
    width: 43px;
    height: 43px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border: 1px solid rgba(34,211,238,.23);
    border-radius: 13px;
    color: #67E8F9;
    background: linear-gradient(135deg, rgba(34,211,238,.14), rgba(167,139,250,.13));
    font-size: 1.1rem;
    font-weight: 800;
  }

  .id-course-info { min-width: 0; max-width: 370px; }
  .id-course-title { color: #F8FAFC; margin-bottom: 5px; }
  .id-course-description {
    color: #94A3B8;
    font-size: .79rem;
    line-height: 1.65;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    overflow-wrap: anywhere;
  }

  .id-category-badge {
    display: inline-block;
    max-width: 180px;
    padding: 7px 10px;
    border: 1px solid rgba(34,211,238,.2);
    border-radius: 8px;
    color: #A5F3FC;
    background: rgba(34,211,238,.07);
    font-size: .75rem;
    overflow-wrap: anywhere;
  }

  .id-price {
    color: #6EE7B7;
    font-weight: 700;
    white-space: nowrap;
  }

  .id-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 32px;
    padding: 6px 10px;
    border: 1px solid;
    border-radius: 8px;
    background: transparent;
    font-size: .76rem;
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    transition: background .2s ease, border-color .2s ease;
  }

  .id-action:disabled { opacity: .45; cursor: not-allowed; }

  .id-action-view { color: #67E8F9; border-color: rgba(34,211,238,.3); }
  .id-action-view:hover { color: #A5F3FC; background: rgba(34,211,238,.1); }

  .id-action-edit { color: #C4B5FD; border-color: rgba(167,139,250,.3); }
  .id-action-edit:hover { color: #DDD6FE; background: rgba(167,139,250,.1); }

  .id-action-lessons { color: #6EE7B7; border-color: rgba(52,211,153,.3); }
  .id-action-lessons:hover { color: #A7F3D0; background: rgba(52,211,153,.1); }

  .id-action-delete { color: #FDA4AF; border-color: rgba(251,113,133,.3); }
  .id-action-delete:hover { color: #FECDD3; background: rgba(251,113,133,.1); }

  .id-empty-state {
    padding: 55px 20px;
    text-align: center;
    border: 1px dashed rgba(148,163,184,.23);
    border-radius: 15px;
    background: rgba(8,13,26,.32);
  }

  .id-empty-icon {
    width: 65px;
    height: 65px;
    display: grid;
    place-items: center;
    margin: 0 auto 20px;
    border: 1px solid rgba(34,211,238,.22);
    border-radius: 21px;
    color: #67E8F9;
    background: rgba(34,211,238,.08);
    font-size: 1.8rem;
  }

  .id-table-footer {
    padding-top: 13px;
    border-top: 1px solid rgba(148,163,184,.1);
  }

  .id-icon-button {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border: 1px solid #344256;
    border-radius: 10px;
    color: #CBD5E1;
    background: #0B1425;
    font-size: 1.4rem;
  }

  .id-icon-button:hover { color: #67E8F9; border-color: #22D3EE; }
  .id-icon-button:disabled { opacity: .5; }

  .id-footer {
    border-top: 1px solid rgba(148,163,184,.12);
    color: #94A3B8;
  }

  @media (max-width: 991px) {
    .id-hero-decoration { right: 1%; opacity: .25; }
    .id-hero-description { max-width: 560px; }
  }

  @media (max-width: 767px) {
    .id-hero { padding: 28px 22px; border-radius: 19px; }
    .id-hero-decoration { right: -65px; opacity: .12; }
    .id-hero-title { letter-spacing: -1px; }
    .id-panel-heading { padding: 18px; }
    .id-stat-card { padding: 20px; }
    .id-topbar { align-items: flex-start !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    .id-button, .id-stat-card, .id-action { transition: none; }
  }
`;

export default InstructorDashboard;