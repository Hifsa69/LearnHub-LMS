import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import CourseCard from "../components/CourseCard";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/courses");
      const data = response.data;

      const courseList = Array.isArray(data)
        ? data
        : Array.isArray(data?.courses)
          ? data.courses
          : [];

      setCourses(courseList);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load courses. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses, refreshKey]);

  const categories = useMemo(() => {
    const unique = [
      ...new Set(
        courses
          .map((course) => course.category?.trim())
          .filter(Boolean)
      ),
    ];

    return ["All", ...unique.sort((a, b) => a.localeCompare(b))];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesCategory =
        selectedCategory === "All" ||
        course.category === selectedCategory;

      const searchableText = [
        course.title,
        course.description,
        course.category,
        typeof course.instructor === "object"
          ? course.instructor?.name
          : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesCategory && searchableText.includes(query);
    });
  }, [courses, search, selectedCategory]);

  const formatPrice = (price) => {
    const amount = Number(price ?? 0);

    if (!Number.isFinite(amount)) return "Price unavailable";
    if (amount === 0) return "Free";

    return `PKR ${new Intl.NumberFormat("en-PK", {
      maximumFractionDigits: 0,
    }).format(amount)}`;
  };

  return (
    <div className="courses-page">
      <style>{styles}</style>

      <div className="courses-container">
        {/* Navigation */}
        <nav className="courses-nav">
          <Link to="/" className="courses-brand">
            <span className="courses-brand-icon">L</span>
            <span>
              Learn<span className="courses-accent">Hub</span>
            </span>
          </Link>

          <div className="courses-nav-right">
            <span className="courses-nav-label">
              YOUR NEXT SKILL STARTS HERE
            </span>
            <span className="courses-nav-dot" />
          </div>
        </nav>

        {/* Hero */}
        <section className="courses-hero">
          <div className="courses-hero-content">
            <div className="courses-eyebrow">
              <span className="courses-eyebrow-icon">✦</span>
              EXPLORE &amp; LEARN
            </div>

            <h1>
              Learn something
              <br />
              <span>extraordinary.</span>
            </h1>

            <p className="courses-hero-description">
              Discover new skills, explore your interests, and find
              the right course to move your learning journey forward.
            </p>

            <a href="#course-library" className="courses-explore-btn">
              Explore Courses <span>↓</span>
            </a>

            <div className="courses-hero-stats">
              <div>
                <strong>{courses.length}</strong>
                <span>Courses available</span>
              </div>

              <div className="courses-stat-divider" />

              <div>
                <strong>{Math.max(categories.length - 1, 0)}</strong>
                <span>Learning categories</span>
              </div>
            </div>
          </div>

          <div className="courses-hero-art" aria-hidden="true">
            <div className="courses-orbit courses-orbit-one" />
            <div className="courses-orbit courses-orbit-two" />

            <div className="courses-art-card">
              <div className="courses-art-header">
                <div className="courses-art-logo">L</div>
                <div>
                  <span>LEARNHUB</span>
                  <small>YOUR LEARNING SPACE</small>
                </div>
                <span className="courses-art-star">✦</span>
              </div>

              <div className="courses-art-visual">
                <div className="courses-art-grid" />
                <div className="courses-art-code">
                  <span>01</span> Learn.
                  <br />
                  <span>02</span> Practice.
                  <br />
                  <span>03</span> Grow.
                </div>
                <div className="courses-art-glow" />
              </div>

              <div className="courses-art-footer">
                <span>YOUR POTENTIAL, UNLOCKED</span>
                <span>↗</span>
              </div>
            </div>

            <div className="courses-floating courses-floating-top">
              <span>✦</span> Keep Growing
            </div>

            <div className="courses-floating courses-floating-bottom">
              <span>✓</span> Start Learning
            </div>
          </div>
        </section>

        {/* Course library */}
        <section className="courses-library" id="course-library">
          <div className="courses-section-heading">
            <div>
              <span className="courses-section-eyebrow">
                FIND YOUR NEXT STEP
              </span>
              <h2>Explore the library<span>.</span></h2>
              <p>
                Browse available courses and find the right fit for you.
              </p>
            </div>

            <div className="courses-result-count">
              <span className="courses-result-dot" />
              {loading ? "Loading..." : `${filteredCourses.length} results`}
            </div>
          </div>

          {/* Search */}
          <div className="courses-tools">
            <div className="courses-search">
              <span className="courses-search-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  width="19"
                  height="19"
                >
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path d="m16 16 4.5 4.5" />
                </svg>
              </span>

              <input
                type="search"
                aria-label="Search courses"
                placeholder="Search courses, skills, categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {search && (
                <button
                  type="button"
                  className="courses-clear-search"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          {!loading && !error && courses.length > 0 && (
            <div className="courses-categories">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={`courses-category ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === "All" && (
                    <span aria-hidden="true">✦</span>
                  )}
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="courses-state courses-error" role="alert">
              <div className="courses-state-icon">!</div>
              <h3>We couldn't load your courses</h3>
              <p>{error}</p>

              <button
                type="button"
                className="courses-primary-btn"
                onClick={() => setRefreshKey((value) => value + 1)}
              >
                Try Again ↻
              </button>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="row g-4">
              {[1, 2, 3].map((item) => (
                <div className="col-12 col-md-6 col-xl-4" key={item}>
                  <div className="courses-skeleton">
                    <div className="skeleton-block skeleton-top" />
                    <div className="skeleton-block skeleton-title" />
                    <div className="skeleton-block skeleton-description" />
                    <div className="skeleton-block skeleton-description short" />
                    <div className="skeleton-block skeleton-footer" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty database state */}
          {!loading && !error && courses.length === 0 && (
            <div className="courses-state">
              <div className="courses-empty-icon">▤</div>
              <h3>Your learning journey starts soon.</h3>
              <p>
                There are no courses available right now. New learning
                opportunities will appear here once instructors add courses.
              </p>
              <button
                type="button"
                className="courses-secondary-btn"
                onClick={() => setRefreshKey((value) => value + 1)}
              >
                Refresh Courses ↻
              </button>
            </div>
          )}

          {/* No search results */}
          {!loading && !error && courses.length > 0 && filteredCourses.length === 0 && (
            <div className="courses-state">
              <div className="courses-empty-icon">⌕</div>
              <h3>No matching courses</h3>
              <p>
                Try a different keyword or choose another category.
              </p>
              <button
                type="button"
                className="courses-secondary-btn"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Course cards */}
          {!loading && !error && filteredCourses.length > 0 && (
            <>
              <div className="courses-grid row g-4">
                {filteredCourses.map((course) => (
                  <div
                    className="col-12 col-md-6 col-xl-4"
                    key={course._id}
                  >
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>

              <div className="courses-bottom-note">
                <span>✦</span>
                Keep exploring. Keep learning. Keep growing.
              </div>
            </>
          )}
        </section>

        {/* Footer */}
        <footer className="courses-footer">
          <span className="courses-footer-brand">
            Learn<span className="courses-accent">Hub</span>
          </span>
          <span>Built for curious minds.</span>
          <a href="#course-library">Back to top ↑</a>
        </footer>
      </div>
    </div>
  );
}

const styles = `
  .courses-page {
    min-height: 100vh;
    padding: 0 24px 35px;
    color: #F8FAFC;
    background:
      radial-gradient(ellipse at 12% 0%, rgba(34,211,238,.07), transparent 32%),
      radial-gradient(ellipse at 90% 20%, rgba(99,102,241,.07), transparent 32%),
      #080D1A;
  }

  .courses-container {
    max-width: 1280px;
    margin: 0 auto;
  }

  .courses-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    min-height: 78px;
    border-bottom: 1px solid #202C40;
  }

  .courses-brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: #F8FAFC;
    font-size: 21px;
    font-weight: 850;
    letter-spacing: -.7px;
    text-decoration: none;
  }

  .courses-brand-icon {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 11px;
    background: linear-gradient(135deg, #22D3EE, #6366F1);
    color: #08111F;
    box-shadow: 0 0 24px rgba(34,211,238,.15);
  }

  .courses-accent {
    color: #22D3EE;
  }

  .courses-nav-right {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .courses-nav-label {
    color: #718198;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.4px;
  }

  .courses-nav-dot,
  .courses-result-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #34D399;
    box-shadow: 0 0 10px rgba(52,211,153,.4);
  }

  .courses-hero {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(280px, .8fr);
    align-items: center;
    gap: 35px;
    min-height: 445px;
    padding: 48px 45px;
    margin-top: 25px;
    overflow: hidden;
    border: 1px solid #263449;
    border-radius: 25px;
    background: linear-gradient(120deg, #111B2D, #10192A 60%, #141A31);
    box-shadow: 0 24px 65px rgba(0,0,0,.2);
  }

  .courses-hero-content {
    position: relative;
    z-index: 2;
  }

  .courses-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 9px 13px;
    border: 1px solid rgba(34,211,238,.2);
    border-radius: 999px;
    background: rgba(34,211,238,.06);
    color: #67E8F9;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.5px;
  }

  .courses-eyebrow-icon {
    font-size: 14px;
  }

  .courses-hero h1 {
    margin: 24px 0 17px;
    color: #F8FAFC;
    font-size: clamp(37px, 4.4vw, 58px);
    font-weight: 900;
    line-height: 1.08;
    letter-spacing: -2.1px;
  }

  .courses-hero h1 span {
    color: #22D3EE;
    text-shadow: 0 0 35px rgba(34,211,238,.12);
  }

  .courses-hero-description {
    max-width: 540px;
    margin: 0;
    color: #94A3B8;
    font-size: 14px;
    line-height: 1.9;
  }

  .courses-explore-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
    margin-top: 25px;
    padding: 13px 18px;
    border: 1px solid rgba(34,211,238,.3);
    border-radius: 11px;
    background: linear-gradient(100deg, #22D3EE, #06B6D4);
    color: #071823;
    font-size: 12px;
    font-weight: 850;
    text-decoration: none;
    transition: transform .2s, box-shadow .2s;
  }

  .courses-explore-btn:hover {
    transform: translateY(-2px);
    color: #071823;
    box-shadow: 0 10px 28px rgba(34,211,238,.16);
  }

  .courses-explore-btn span {
    font-size: 17px;
  }

  .courses-hero-stats {
    display: flex;
    align-items: center;
    gap: 22px;
    margin-top: 32px;
  }

  .courses-hero-stats strong,
  .courses-hero-stats span {
    display: block;
  }

  .courses-hero-stats strong {
    color: #F8FAFC;
    font-size: 23px;
    font-weight: 850;
  }

  .courses-hero-stats span {
    margin-top: 4px;
    color: #718198;
    font-size: 11px;
  }

  .courses-stat-divider {
    width: 1px;
    height: 36px;
    background: #334155;
  }

  .courses-hero-art {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 310px;
  }

  .courses-orbit {
    position: absolute;
    border: 1px solid rgba(34,211,238,.14);
    border-radius: 50%;
    transform: rotate(-28deg);
  }

  .courses-orbit-one {
    width: 300px;
    height: 230px;
  }

  .courses-orbit-two {
    width: 230px;
    height: 320px;
    border-color: rgba(129,140,248,.16);
    transform: rotate(35deg);
  }

  .courses-art-card {
    position: relative;
    z-index: 1;
    width: min(100%, 300px);
    padding: 19px;
    overflow: hidden;
    border: 1px solid rgba(103,232,249,.24);
    border-radius: 18px;
    background: linear-gradient(145deg, #192740, #0C1525);
    box-shadow: 0 25px 60px rgba(0,0,0,.35), 0 0 35px rgba(34,211,238,.05);
    transform: rotate(-4deg);
  }

  .courses-art-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-bottom: 15px;
    border-bottom: 1px solid #29374C;
  }

  .courses-art-logo {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: linear-gradient(135deg, #22D3EE, #6366F1);
    color: #071823;
    font-weight: 900;
  }

  .courses-art-header > div:nth-child(2) span,
  .courses-art-header small {
    display: block;
  }

  .courses-art-header > div:nth-child(2) span {
    color: #E2E8F0;
    font-size: 10px;
    font-weight: 850;
    letter-spacing: 1px;
  }

  .courses-art-header small {
    margin-top: 3px;
    color: #718198;
    font-size: 7px;
    letter-spacing: .8px;
  }

  .courses-art-star {
    margin-left: auto;
    color: #67E8F9;
    font-size: 18px;
  }

  .courses-art-visual {
    position: relative;
    min-height: 165px;
    margin-top: 16px;
    overflow: hidden;
    border: 1px solid #263449;
    border-radius: 12px;
    background: #0B1220;
  }

  .courses-art-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(34,211,238,.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(34,211,238,.06) 1px, transparent 1px);
    background-size: 20px 20px;
  }

  .courses-art-code {
    position: relative;
    z-index: 2;
    padding: 22px;
    color: #E2E8F0;
    font-family: monospace;
    font-size: 20px;
    font-weight: 700;
    line-height: 1.65;
  }

  .courses-art-code span {
    margin-right: 9px;
    color: #64748B;
    font-size: 11px;
  }

  .courses-art-glow {
    position: absolute;
    right: -30px;
    bottom: -50px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: rgba(34,211,238,.2);
    filter: blur(50px);
  }

  .courses-art-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 14px;
    color: #718198;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 1px;
  }

  .courses-art-footer span:last-child {
    color: #67E8F9;
    font-size: 14px;
  }

  .courses-floating {
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
    font-size: 10px;
    font-weight: 750;
    box-shadow: 0 12px 30px rgba(0,0,0,.25);
  }

  .courses-floating span {
    color: #67E8F9;
  }

  .courses-floating-top {
    top: 15px;
    right: -5px;
  }

  .courses-floating-bottom {
    bottom: 10px;
    left: -10px;
  }

  .courses-library {
    padding-top: 65px;
    scroll-margin-top: 25px;
  }

  .courses-section-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 25px;
  }

  .courses-section-eyebrow {
    color: #22D3EE;
    font-size: 10px;
    font-weight: 850;
    letter-spacing: 1.6px;
  }

  .courses-section-heading h2 {
    margin: 10px 0 8px;
    color: #F8FAFC;
    font-size: clamp(26px, 3vw, 34px);
    font-weight: 850;
    letter-spacing: -1px;
  }

  .courses-section-heading h2 span {
    color: #22D3EE;
  }

  .courses-section-heading p {
    margin: 0;
    color: #94A3B8;
    font-size: 13px;
    line-height: 1.7;
  }

  .courses-result-count {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    flex-shrink: 0;
    padding: 10px 13px;
    border: 1px solid #263449;
    border-radius: 10px;
    background: #111B2D;
    color: #CBD5E1;
    font-size: 11px;
    font-weight: 700;
  }

  .courses-tools {
    margin-bottom: 18px;
  }

  .courses-search {
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 650px;
    min-height: 53px;
    padding: 0 15px;
    border: 1px solid #29374C;
    border-radius: 13px;
    background: #0E1728;
    transition: border-color .2s, box-shadow .2s;
  }

  .courses-search:focus-within {
    border-color: rgba(34,211,238,.55);
    box-shadow: 0 0 0 3px rgba(34,211,238,.07);
  }

  .courses-search-icon {
    display: grid;
    place-items: center;
    color: #67E8F9;
  }

  .courses-search input {
    width: 100%;
    min-width: 0;
    padding: 14px 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: #F8FAFC;
    font-size: 13px;
  }

  .courses-search input::placeholder {
    color: #64748B;
  }

  .courses-clear-search {
    border: 0;
    background: transparent;
    color: #94A3B8;
    font-size: 22px;
    cursor: pointer;
  }

  .courses-categories {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
    margin-bottom: 25px;
  }

  .courses-category {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 9px 13px;
    border: 1px solid #29374C;
    border-radius: 9px;
    background: #10192A;
    color: #94A3B8;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    transition: all .2s;
  }

  .courses-category:hover {
    border-color: #3C536D;
    color: #E2E8F0;
  }

  .courses-category.active {
    border-color: rgba(34,211,238,.4);
    background: rgba(34,211,238,.09);
    color: #67E8F9;
  }

  .courses-grid > div {
    display: flex;
  }

  .courses-grid > div > * {
    width: 100%;
  }

  .courses-state {
    padding: 55px 22px;
    border: 1px dashed #334155;
    border-radius: 18px;
    background: rgba(17,27,45,.6);
    text-align: center;
  }

  .courses-state-icon,
  .courses-empty-icon {
    display: grid;
    place-items: center;
    width: 54px;
    height: 54px;
    margin: 0 auto 18px;
    border: 1px solid #334155;
    border-radius: 16px;
    background: #111B2D;
    color: #67E8F9;
    font-size: 26px;
  }

  .courses-error .courses-state-icon {
    border-color: rgba(248,113,113,.2);
    color: #FCA5A5;
  }

  .courses-state h3 {
    margin-bottom: 10px;
    color: #F1F5F9;
    font-size: 20px;
    font-weight: 800;
  }

  .courses-state p {
    max-width: 510px;
    margin: 0 auto 20px;
    color: #94A3B8;
    font-size: 13px;
    line-height: 1.8;
    overflow-wrap: anywhere;
  }

  .courses-primary-btn,
  .courses-secondary-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 17px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    transition: transform .2s, box-shadow .2s;
  }

  .courses-primary-btn {
    border: 1px solid transparent;
    background: #22D3EE;
    color: #071823;
  }

  .courses-primary-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(34,211,238,.15);
  }

  .courses-secondary-btn {
    border: 1px solid #334155;
    background: #111B2D;
    color: #CBD5E1;
  }

  .courses-secondary-btn:hover {
    border-color: #64748B;
    color: #F8FAFC;
  }

  .courses-skeleton {
    width: 100%;
    min-height: 320px;
    padding: 19px;
    border: 1px solid #263449;
    border-radius: 17px;
    background: #111B2D;
  }

  .skeleton-block {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    background: #1D2A3E;
  }

  .skeleton-block::after {
    position: absolute;
    inset: 0;
    content: "";
    transform: translateX(-100%);
    background: linear-gradient(90deg, transparent, rgba(148,163,184,.08), transparent);
    animation: courses-shimmer 1.5s infinite;
  }

  .skeleton-top {
    height: 135px;
    margin-bottom: 22px;
  }

  .skeleton-title {
    width: 75%;
    height: 17px;
    margin-bottom: 16px;
  }

  .skeleton-description {
    width: 100%;
    height: 10px;
    margin-bottom: 10px;
  }

  .skeleton-description.short {
    width: 62%;
  }

  .skeleton-footer {
    height: 36px;
    margin-top: 22px;
  }

  @keyframes courses-shimmer {
    to { transform: translateX(100%); }
  }

  .courses-bottom-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    margin-top: 35px;
    color: #718198;
    font-size: 12px;
  }

  .courses-bottom-note span {
    color: #67E8F9;
  }

  .courses-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    margin-top: 60px;
    padding-top: 22px;
    border-top: 1px solid #202C40;
    color: #64748B;
    font-size: 11px;
  }

  .courses-footer-brand {
    color: #CBD5E1;
    font-size: 14px;
    font-weight: 850;
  }

  .courses-footer a {
    color: #94A3B8;
    text-decoration: none;
  }

  .courses-footer a:hover {
    color: #67E8F9;
  }

  @media (max-width: 900px) {
    .courses-hero {
      grid-template-columns: 1fr;
      padding: 38px;
    }

    .courses-hero-art {
      min-height: 290px;
    }
  }

  @media (max-width: 576px) {
    .courses-page {
      padding: 0 13px 25px;
    }

    .courses-nav {
      min-height: 67px;
    }

    .courses-brand {
      font-size: 18px;
    }

    .courses-brand-icon {
      width: 32px;
      height: 32px;
    }

    .courses-nav-label {
      max-width: 100px;
      font-size: 8px;
      line-height: 1.6;
      text-align: right;
    }

    .courses-hero {
      gap: 20px;
      min-height: auto;
      padding: 27px 20px;
      margin-top: 16px;
      border-radius: 19px;
    }

    .courses-hero h1 {
      margin-top: 20px;
      font-size: 39px;
      letter-spacing: -1.5px;
    }

    .courses-hero-description {
      font-size: 13px;
    }

    .courses-hero-art {
      min-height: 260px;
    }

    .courses-art-card {
      max-width: 265px;
    }

    .courses-floating-top {
      right: 0;
    }

    .courses-floating-bottom {
      left: 0;
    }

    .courses-hero-stats {
      gap: 16px;
    }

    .courses-hero-stats strong {
      font-size: 20px;
    }

    .courses-hero-stats span {
      max-width: 105px;
      line-height: 1.5;
    }

    .courses-library {
      padding-top: 45px;
    }

    .courses-section-heading {
      align-items: flex-start;
      flex-direction: column;
      gap: 15px;
    }

    .courses-section-heading h2 {
      font-size: 27px;
    }

    .courses-search {
      min-height: 49px;
    }

    .courses-category {
      padding: 9px 11px;
    }

    .courses-state {
      padding: 40px 18px;
    }

    .courses-footer {
      align-items: flex-start;
      flex-direction: column;
      gap: 11px;
      margin-top: 40px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .courses-page *,
    .courses-page *::before,
    .courses-page *::after {
      animation-duration: .01ms !important;
      transition-duration: .01ms !important;
    }
  }
`;

export default Courses;
