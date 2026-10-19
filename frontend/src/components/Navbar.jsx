import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const role = user?.role?.toLowerCase();
  const userName = user?.name || "User";

  const closeMenu = () => setMenuOpen(false);

  const linkClass = ({ isActive }) =>
    `lh-nav-link ${isActive ? "lh-nav-link-active" : ""}`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    closeMenu();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <style>{`
        .lh-navbar {
          position: sticky;
          top: 0;
          z-index: 1030;
          background: rgba(11, 17, 32, 0.94);
          border-bottom: 1px solid rgba(148, 163, 184, 0.14);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.16);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .lh-navbar .container {
          min-height: 76px;
        }

        .lh-brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          color: #f8fafc;
          text-decoration: none;
          font-size: 21px;
          font-weight: 850;
          letter-spacing: -0.7px;
          white-space: nowrap;
        }

        .lh-brand:hover {
          color: #f8fafc;
        }

        .lh-brand-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          color: #07111f;
          background: linear-gradient(135deg, #67e8f9, #22d3ee 60%, #818cf8);
          box-shadow: 0 0 24px rgba(34, 211, 238, 0.15);
          font-size: 21px;
          transition: transform 0.2s ease;
        }

        .lh-brand:hover .lh-brand-icon {
          transform: translateY(-2px);
        }

        .lh-brand-accent {
          color: #22d3ee;
        }

        .lh-navbar .navbar-toggler {
          padding: 8px 10px;
          border: 1px solid #334155;
          border-radius: 11px;
          box-shadow: none;
        }

        .lh-navbar .navbar-toggler:focus {
          border-color: #22d3ee;
          box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.1);
        }

        .lh-navbar .navbar-toggler-icon {
          width: 21px;
          height: 21px;
        }

        .lh-navbar-nav {
          align-items: center;
          gap: 5px;
        }

        .lh-nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 13px;
          border-radius: 10px;
          color: #cbd5e1;
          text-decoration: none;
          font-size: 12px;
          font-weight: 650;
          white-space: nowrap;
          transition:
            color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .lh-nav-link:hover {
          color: #67e8f9;
          background: rgba(34, 211, 238, 0.055);
        }

        .lh-nav-link-active {
          color: #67e8f9;
          background: rgba(34, 211, 238, 0.09);
          box-shadow: inset 0 0 0 1px rgba(34, 211, 238, 0.12);
        }

        .lh-nav-link-active::after {
          position: absolute;
          bottom: 3px;
          left: 50%;
          width: 15px;
          height: 2px;
          content: "";
          border-radius: 5px;
          background: #22d3ee;
          transform: translateX(-50%);
        }

        .lh-get-started,
        .lh-logout-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 40px;
          padding: 0 17px;
          border-radius: 11px;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .lh-get-started {
          color: #07131f;
          border: 1px solid transparent;
          background: linear-gradient(110deg, #67e8f9, #22d3ee);
        }

        .lh-get-started:hover {
          color: #07131f;
          transform: translateY(-2px);
          box-shadow: 0 7px 22px rgba(34, 211, 238, 0.18);
        }

        .lh-logout-button {
          color: #67e8f9;
          border: 1px solid rgba(34, 211, 238, 0.27);
          background: rgba(34, 211, 238, 0.045);
        }

        .lh-logout-button:hover {
          color: #a5f3fc;
          border-color: rgba(34, 211, 238, 0.55);
          background: rgba(34, 211, 238, 0.1);
          transform: translateY(-1px);
        }

        .lh-user-chip {
          display: flex;
          align-items: center;
          gap: 9px;
          max-width: 170px;
          margin-left: 5px;
          padding: 5px 10px 5px 6px;
          border: 1px solid rgba(148, 163, 184, 0.15);
          border-radius: 12px;
          background: rgba(17, 27, 45, 0.8);
        }

        .lh-user-avatar {
          width: 32px;
          height: 32px;
          flex: 0 0 32px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          color: #67e8f9;
          background: linear-gradient(
            145deg,
            rgba(34, 211, 238, 0.17),
            rgba(99, 102, 241, 0.16)
          );
          font-size: 12px;
          font-weight: 850;
        }

        .lh-user-info {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .lh-user-name {
          overflow: hidden;
          color: #f1f5f9;
          font-size: 11px;
          font-weight: 750;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .lh-user-role {
          color: #94a3b8;
          font-size: 9px;
          text-transform: capitalize;
        }

        .lh-navbar .navbar-collapse {
          padding-bottom: 0;
        }

        @media (max-width: 1199px) {
          .lh-navbar-nav {
            gap: 2px;
          }

          .lh-nav-link {
            padding-right: 10px;
            padding-left: 10px;
            font-size: 11px;
          }

          .lh-user-chip {
            max-width: 130px;
          }
        }

        @media (max-width: 991.98px) {
          .lh-navbar .container {
            min-height: 70px;
          }

          .lh-navbar .navbar-collapse {
            padding: 12px 0 19px;
          }

          .lh-navbar-nav {
            align-items: stretch;
            gap: 5px;
          }

          .lh-nav-link {
            justify-content: flex-start;
            padding: 12px 14px;
            font-size: 13px;
          }

          .lh-nav-link-active::after {
            top: 50%;
            right: 10px;
            bottom: auto;
            left: auto;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            transform: translateY(-50%);
          }

          .lh-user-chip {
            width: 100%;
            max-width: none;
            margin: 10px 0;
            padding: 10px;
          }

          .lh-user-avatar {
            width: 38px;
            height: 38px;
            flex-basis: 38px;
          }

          .lh-user-name {
            font-size: 12px;
          }

          .lh-user-role {
            font-size: 10px;
          }

          .lh-get-started,
          .lh-logout-button {
            width: 100%;
            margin-top: 7px;
            min-height: 43px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .lh-navbar *,
          .lh-navbar *::before,
          .lh-navbar *::after {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <nav className="navbar navbar-expand-lg navbar-dark lh-navbar">
        <div className="container">
          <Link
            className="lh-brand"
            to="/"
            onClick={closeMenu}
            aria-label="LearnHub home"
          >
            <span className="lh-brand-icon">
              <i className="bi bi-mortarboard-fill" />
            </span>

            <span>
              Learn<span className="lh-brand-accent">Hub</span>
            </span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            aria-controls="learnHubNavbar"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuOpen((previous) => !previous)}
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            id="learnHubNavbar"
            className={`collapse navbar-collapse ${
              menuOpen ? "show" : ""
            }`}
          >
            <div className="navbar-nav ms-auto lh-navbar-nav mt-3 mt-lg-0">
              <NavLink
                to="/"
                end
                className={linkClass}
                onClick={closeMenu}
              >
                <i className="bi bi-house-door me-2 d-lg-none" />
                Home
              </NavLink>

              <NavLink
                to="/courses"
                className={linkClass}
                onClick={closeMenu}
              >
                <i className="bi bi-journal-bookmark me-2 d-lg-none" />
                Courses
              </NavLink>

              {token &&
                (role === "admin" || role === "instructor") && (
                  <NavLink
                    to="/add-course"
                    className={linkClass}
                    onClick={closeMenu}
                  >
                    <i className="bi bi-plus-circle me-2 d-lg-none" />
                    Add Course
                  </NavLink>
                )}

              {token && role === "instructor" && (
                <NavLink
                  to="/instructor-dashboard"
                  className={linkClass}
                  onClick={closeMenu}
                >
                  <i className="bi bi-speedometer2 me-2 d-lg-none" />
                  Instructor
                </NavLink>
              )}

              {token && role === "admin" && (
                <NavLink
                  to="/admin-dashboard"
                  className={linkClass}
                  onClick={closeMenu}
                >
                  <i className="bi bi-shield-check me-2 d-lg-none" />
                  Admin Dashboard
                </NavLink>
              )}

              {token && role === "student" && (
                <NavLink
                  to="/my-courses"
                  className={linkClass}
                  onClick={closeMenu}
                >
                  <i className="bi bi-collection-play me-2 d-lg-none" />
                  My Learning
                </NavLink>
              )}

              {!token ? (
                <>
                  <NavLink
                    to="/login"
                    className={linkClass}
                    onClick={closeMenu}
                  >
                    <i className="bi bi-box-arrow-in-right me-2 d-lg-none" />
                    Login
                  </NavLink>

                  <Link
                    to="/register"
                    className="lh-get-started ms-lg-2"
                    onClick={closeMenu}
                  >
                    Get Started
                    <i className="bi bi-arrow-up-right" />
                  </Link>
                </>
              ) : (
                <>
                  <div className="lh-user-chip">
                    <span className="lh-user-avatar">
                      {userName.trim().charAt(0).toUpperCase() || "U"}
                    </span>

                    <span className="lh-user-info">
                      <span className="lh-user-name">{userName}</span>
                      <span className="lh-user-role">
                        {ROLE_LABELS[role] || role || "Member"}
                      </span>
                    </span>
                  </div>

                  <button
                    type="button"
                    className="lh-logout-button ms-lg-1"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

const ROLE_LABELS = {
  admin: "Administrator",
  instructor: "Instructor",
  student: "Student",
};

export default Navbar;
