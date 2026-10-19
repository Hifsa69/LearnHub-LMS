import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../services/api";

const STAT_CONFIG = [
  {
    key: "totalUsers",
    label: "Total Users",
    icon: "bi-people-fill",
    tone: "cyan",
    description: "Registered accounts",
  },
  {
    key: "totalStudents",
    label: "Students",
    icon: "bi-mortarboard-fill",
    tone: "blue",
    description: "Learning community",
  },
  {
    key: "totalInstructors",
    label: "Instructors",
    icon: "bi-person-workspace",
    tone: "purple",
    description: "Course creators",
  },
  {
    key: "totalCourses",
    label: "Total Courses",
    icon: "bi-journal-bookmark-fill",
    tone: "orange",
    description: "Available courses",
  },
  {
    key: "totalEnrollments",
    label: "Enrollments",
    icon: "bi-clipboard-check-fill",
    tone: "green",
    description: "Student registrations",
  },
];

const ROLE_OPTIONS = [
  { value: "all", label: "All roles" },
  { value: "student", label: "Students" },
  { value: "instructor", label: "Instructors" },
  { value: "admin", label: "Admins" },
];

const ROLE_LABELS = {
  student: "Student",
  instructor: "Instructor",
  admin: "Admin",
};

function getErrorMessage(error, fallback) {
  return error.response?.data?.message || fallback;
}

function getUserName(user) {
  return user.name?.trim() || "Unnamed User";
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function formatDate(date) {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Not available";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const loadDashboard = useCallback(async ({ refresh = false } = {}) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");
    setMessage("");

    try {
      const [analyticsResponse, usersResponse] = await Promise.all([
        API.get("/admin/analytics"),
        API.get("/admin/users"),
      ]);

      const nextAnalytics = analyticsResponse.data?.analytics;
      const nextUsers = usersResponse.data?.users;

      if (!nextAnalytics || !Array.isArray(nextUsers)) {
        throw new Error("The server returned an unexpected dashboard response.");
      }

      setAnalytics(nextAnalytics);
      setUsers(nextUsers);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          err.message ||
            "Unable to load dashboard. Check your login and backend server."
        )
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      const matchesSearch =
        !normalizedSearch ||
        [user.name, user.email, user.role]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(normalizedSearch)
          );

      return matchesRole && matchesSearch;
    });
  }, [users, search, roleFilter]);

  const handleRoleChange = async (userId, nextRole) => {
    const currentUser = users.find((user) => user._id === userId);

    if (!currentUser || currentUser.role === nextRole) return;

    // The logged-in user's ID can be checked here if your auth system
    // exposes it. The backend must enforce self-demotion restrictions.
    const previousRole = currentUser.role;

    setError("");
    setMessage("");
    setUpdatingId(userId);

    // Optimistic UI update.
    setUsers((previous) =>
      previous.map((user) =>
        user._id === userId ? { ...user, role: nextRole } : user
      )
    );

    try {
      await API.put(`/admin/users/${userId}/role`, {
        role: nextRole,
      });

      setMessage(
        `${getUserName(currentUser)}'s role updated to ${
          ROLE_LABELS[nextRole] || nextRole
        }.`
      );
    } catch (err) {
      // Restore the original role if the API request fails.
      setUsers((previous) =>
        previous.map((user) =>
          user._id === userId ? { ...user, role: previousRole } : user
        )
      );

      setError(getErrorMessage(err, "Failed to update user role."));
    } finally {
      setUpdatingId("");
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Delete ${getUserName(user)}'s account?\n\nThis action may be permanent.`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");
    setDeletingId(user._id);

    try {
      await API.delete(`/admin/users/${user._id}`);

      setUsers((previous) =>
        previous.filter((item) => item._id !== user._id)
      );

      // Refresh analytics after deleting a user.
      try {
        const response = await API.get("/admin/analytics");
        setAnalytics(response.data?.analytics ?? analytics);
      } catch {
        // User deletion succeeded; don't report the entire operation as failed.
      }

      setMessage(`${getUserName(user)} was deleted successfully.`);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete user."));
    } finally {
      setDeletingId("");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("all");
  };

  if (loading) {
    return (
      <main className="admin-dashboard">
        <AdminStyles />

        <div className="admin-loading">
          <div className="admin-brand-mark">
            <i className="bi bi-mortarboard-fill" />
          </div>

          <div className="admin-loading-spinner" />

          <h2>Preparing your dashboard</h2>
          <p>Loading analytics and user information...</p>

          <div className="admin-loading-grid">
            {[1, 2, 3, 4, 5].map((item) => (
              <div className="admin-skeleton" key={item} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-dashboard">
      <AdminStyles />

      <div className="admin-shell">
        {/* Header */}
        <header className="admin-topbar">
          <a className="admin-brand" href="/" aria-label="LearnHub home">
            <span className="admin-brand-mark">
              <i className="bi bi-mortarboard-fill" />
            </span>

            <span>
              <strong>LearnHub</strong>
              <small>ADMIN CONSOLE</small>
            </span>
          </a>

          <div className="admin-topbar-right">
            <span className="admin-status">
              <span className="admin-status-dot" />
              Admin workspace
            </span>

            <button
              type="button"
              className="admin-refresh-button"
              onClick={() => loadDashboard({ refresh: true })}
              disabled={refreshing}
            >
              <i
                className={`bi bi-arrow-clockwise ${
                  refreshing ? "admin-spin" : ""
                }`}
              />
              <span>{refreshing ? "Refreshing..." : "Refresh data"}</span>
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className="admin-hero">
          <div className="admin-hero-copy">
            <div className="admin-eyebrow">
              <span />
              PLATFORM OVERVIEW
            </div>

            <h1>
              Admin <span>Dashboard</span>
            </h1>

            <p>
              Manage your learning platform, monitor activity and keep your
              community running smoothly.
            </p>

            <div className="admin-hero-meta">
              <span>
                <i className="bi bi-shield-check" />
                Administration
              </span>
              <span>
                <i className="bi bi-activity" />
                Live data on refresh
              </span>
            </div>
          </div>

          <div className="admin-hero-art" aria-hidden="true">
            <div className="admin-orbit admin-orbit-one" />
            <div className="admin-orbit admin-orbit-two" />
            <div className="admin-hero-icon">
              <i className="bi bi-bar-chart-line-fill" />
            </div>
            <span className="admin-float-icon admin-float-one">
              <i className="bi bi-people-fill" />
            </span>
            <span className="admin-float-icon admin-float-two">
              <i className="bi bi-journal-check" />
            </span>
            <span className="admin-float-icon admin-float-three">
              <i className="bi bi-graph-up-arrow" />
            </span>
          </div>
        </section>

        {/* Feedback */}
        {error && (
          <div className="admin-alert admin-alert-error" role="alert">
            <i className="bi bi-exclamation-triangle-fill" />
            <span>{error}</span>
            <button
              type="button"
              aria-label="Dismiss error"
              onClick={() => setError("")}
            >
              <i className="bi bi-x-lg" />
            </button>
          </div>
        )}

        {message && (
          <div className="admin-alert admin-alert-success" role="status">
            <i className="bi bi-check-circle-fill" />
            <span>{message}</span>
            <button
              type="button"
              aria-label="Dismiss message"
              onClick={() => setMessage("")}
            >
              <i className="bi bi-x-lg" />
            </button>
          </div>
        )}

        {/* Analytics */}
        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <span className="admin-section-kicker">AT A GLANCE</span>
              <h2>Platform analytics</h2>
              <p>Your platform's key numbers in one place.</p>
            </div>

            <span className="admin-updated-label">
              <i className="bi bi-bar-chart-fill" />
              Overview
            </span>
          </div>

          <div className="admin-stats-grid">
            {STAT_CONFIG.map((item) => (
              <article
                className={`admin-stat-card tone-${item.tone}`}
                key={item.key}
              >
                <div className="admin-stat-top">
                  <span className="admin-stat-icon">
                    <i className={`bi ${item.icon}`} />
                  </span>

                  <span className="admin-stat-indicator">
                    <i className="bi bi-arrow-up-right" />
                  </span>
                </div>

                <p className="admin-stat-label">{item.label}</p>

                <div className="admin-stat-value">
                  {Number(analytics?.[item.key] ?? 0).toLocaleString()}
                </div>

                <p className="admin-stat-description">
                  <span />
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Users */}
        <section className="admin-users-section">
          <div className="admin-users-heading">
            <div className="admin-users-title">
              <div className="admin-users-heading-icon">
                <i className="bi bi-people-fill" />
              </div>

              <div>
                <h2>User management</h2>
                <p>Review accounts and manage platform roles.</p>
              </div>
            </div>

            <div className="admin-user-count">
              <strong>{users.length}</strong>
              <span>Total users</span>
            </div>
          </div>

          {/* Search and filters */}
          <div className="admin-toolbar">
            <div className="admin-search">
              <i className="bi bi-search" />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email or role..."
                aria-label="Search users"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <i className="bi bi-x-circle-fill" />
                </button>
              )}
            </div>

            <div className="admin-filter">
              <i className="bi bi-funnel" />

              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                aria-label="Filter users by role"
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {(search || roleFilter !== "all") && (
              <button
                type="button"
                className="admin-clear-button"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="admin-table-summary">
            <span>
              Showing <strong>{filteredUsers.length}</strong> of{" "}
              <strong>{users.length}</strong> users
            </span>

            <span className="admin-table-secure">
              <i className="bi bi-shield-lock" />
              Restricted actions
            </span>
          </div>

          {/* Responsive table */}
          {filteredUsers.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">
                <i
                  className={`bi ${
                    users.length === 0
                      ? "bi-people"
                      : "bi-search"
                  }`}
                />
              </div>

              <h3>
                {users.length === 0
                  ? "No users registered yet"
                  : "No matching users"}
              </h3>

              <p>
                {users.length === 0
                  ? "Registered accounts will appear here."
                  : "Try a different search term or update your filters."}
              </p>

              {(search || roleFilter !== "all") && (
                <button
                  type="button"
                  className="admin-primary-button"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">USER</th>
                    <th scope="col">EMAIL ADDRESS</th>
                    <th scope="col">ROLE</th>
                    <th scope="col">DATE JOINED</th>
                    <th scope="col">ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => {
                    const isUpdating = updatingId === user._id;
                    const isDeleting = deletingId === user._id;

                    return (
                      <tr key={user._id}>
                        <td>
                          <div className="admin-user-cell">
                            <span className="admin-avatar">
                              {getInitials(getUserName(user)) || (
                                <i className="bi bi-person-fill" />
                              )}
                            </span>

                            <div className="admin-user-details">
                              <strong>{getUserName(user)}</strong>
                              <small>
                                ID: {String(user._id).slice(-8)}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="admin-email">
                            {user.email || "No email provided"}
                          </span>
                        </td>

                        <td>
                          <div className="admin-role-control">
                            <span
                              className={`admin-role-dot role-${user.role}`}
                            />

                            <select
                              className="admin-role-select"
                              value={user.role || "student"}
                              disabled={isUpdating || isDeleting}
                              onChange={(event) =>
                                handleRoleChange(
                                  user._id,
                                  event.target.value
                                )
                              }
                              aria-label={`Role for ${getUserName(user)}`}
                            >
                              <option value="student">Student</option>
                              <option value="instructor">Instructor</option>
                              <option value="admin">Admin</option>
                            </select>

                            {isUpdating && (
                              <span
                                className="admin-mini-spinner"
                                aria-label="Updating role"
                              />
                            )}
                          </div>
                        </td>

                        <td>
                          <span className="admin-date">
                            <i className="bi bi-calendar3" />
                            {formatDate(user.createdAt)}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="admin-delete-button"
                            disabled={
                              user.role === "admin" ||
                              isDeleting ||
                              isUpdating
                            }
                            onClick={() => handleDeleteUser(user)}
                            title={
                              user.role === "admin"
                                ? "Admin accounts cannot be deleted here"
                                : "Delete user"
                            }
                          >
                            {isDeleting ? (
                              <>
                                <span className="admin-mini-spinner" />
                                Deleting
                              </>
                            ) : (
                              <>
                                <i className="bi bi-trash3" />
                                Delete
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <footer className="admin-table-footer">
            <span>
              <i className="bi bi-info-circle" />
              Changes are sent to the server immediately.
            </span>

            <span>
              LearnHub <span className="admin-footer-dot">•</span> Admin
              Console
            </span>
          </footer>
        </section>

        <footer className="admin-page-footer">
          <span>© {new Date().getFullYear()} LearnHub LMS</span>
          <span>Built for better learning management.</span>
        </footer>
      </div>
    </main>
  );
}

function AdminStyles() {
  return (
    <style>{`
      .admin-dashboard {
        --admin-bg: #0b1120;
        --admin-panel: #111b2d;
        --admin-panel-hover: #162239;
        --admin-border: #263449;
        --admin-text: #f8fafc;
        --admin-muted: #94a3b8;
        --admin-cyan: #22d3ee;
        min-height: 100vh;
        color: var(--admin-text);
        background:
          radial-gradient(ellipse at 12% 0%, rgba(34,211,238,.075), transparent 33%),
          radial-gradient(ellipse at 100% 18%, rgba(139,92,246,.075), transparent 30%),
          var(--admin-bg);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        padding: 0 0 28px;
      }

      .admin-dashboard * { box-sizing: border-box; }

      .admin-shell {
        width: min(1540px, 100%);
        padding: 0 34px;
        margin: 0 auto;
      }

      .admin-topbar {
        min-height: 86px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        border-bottom: 1px solid rgba(148,163,184,.12);
      }

      .admin-brand {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        color: var(--admin-text);
        text-decoration: none;
      }

      .admin-brand:hover { color: var(--admin-text); }

      .admin-brand-mark {
        width: 44px;
        height: 44px;
        display: grid;
        place-items: center;
        color: #07131f;
        font-size: 21px;
        border-radius: 14px;
        background: linear-gradient(135deg, #67e8f9, #22d3ee 60%, #818cf8);
        box-shadow: 0 0 26px rgba(34,211,238,.17);
      }

      .admin-brand strong {
        display: block;
        font-size: 18px;
        letter-spacing: -.5px;
      }

      .admin-brand small {
        display: block;
        margin-top: 2px;
        color: var(--admin-muted);
        font-size: 9px;
        letter-spacing: 2px;
        font-weight: 800;
      }

      .admin-topbar-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: wrap;
        gap: 15px;
      }

      .admin-status {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: #cbd5e1;
        font-size: 12px;
      }

      .admin-status-dot, .admin-stat-description span {
        width: 7px;
        height: 7px;
        display: inline-block;
        flex: 0 0 auto;
        border-radius: 50%;
        background: #34d399;
        box-shadow: 0 0 10px rgba(52,211,153,.5);
      }

      .admin-refresh-button, .admin-primary-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        min-height: 42px;
        padding: 0 16px;
        color: #07131f;
        border: 1px solid transparent;
        border-radius: 11px;
        background: linear-gradient(110deg, #67e8f9, #22d3ee);
        font-size: 12px;
        font-weight: 800;
        transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
      }

      .admin-refresh-button:hover, .admin-primary-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 26px rgba(34,211,238,.16);
      }

      .admin-refresh-button:disabled, .admin-delete-button:disabled {
        opacity: .45;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }

      .admin-hero {
        position: relative;
        overflow: hidden;
        min-height: 248px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 25px;
        margin: 30px 0 38px;
        padding: 38px 43px;
        border: 1px solid rgba(103,232,249,.16);
        border-radius: 25px;
        background:
          radial-gradient(ellipse at 85% 15%, rgba(34,211,238,.12), transparent 35%),
          radial-gradient(ellipse at 65% 100%, rgba(139,92,246,.1), transparent 35%),
          linear-gradient(120deg, rgba(17,27,45,.98), rgba(14,25,43,.93));
        box-shadow: 0 18px 50px rgba(0,0,0,.12);
      }

      .admin-hero-copy { position: relative; z-index: 2; max-width: 670px; }

      .admin-eyebrow, .admin-section-kicker {
        display: flex;
        align-items: center;
        gap: 9px;
        color: var(--admin-cyan);
        font-size: 10px;
        letter-spacing: 2px;
        font-weight: 900;
      }

      .admin-eyebrow > span {
        width: 20px;
        height: 2px;
        border-radius: 4px;
        background: var(--admin-cyan);
      }

      .admin-hero h1 {
        margin: 15px 0 12px;
        color: var(--admin-text);
        font-size: clamp(32px, 4vw, 47px);
        line-height: 1.12;
        font-weight: 850;
        letter-spacing: -1.8px;
      }

      .admin-hero h1 span {
        color: var(--admin-cyan);
        text-shadow: 0 0 24px rgba(34,211,238,.13);
      }

      .admin-hero-copy > p {
        max-width: 560px;
        margin: 0;
        color: #a9b7cb;
        font-size: 14px;
        line-height: 1.8;
      }

      .admin-hero-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-top: 23px;
      }

      .admin-hero-meta span {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        color: #cbd5e1;
        font-size: 11px;
      }

      .admin-hero-meta i { color: var(--admin-cyan); }

      .admin-hero-art {
        position: relative;
        width: 245px;
        height: 195px;
        flex: 0 0 245px;
        display: grid;
        place-items: center;
      }

      .admin-orbit {
        position: absolute;
        border: 1px solid rgba(34,211,238,.17);
        border-radius: 50%;
      }

      .admin-orbit-one { width: 160px; height: 160px; }
      .admin-orbit-two { width: 215px; height: 215px; border-color: rgba(139,92,246,.16); }

      .admin-hero-icon {
        width: 105px;
        height: 105px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(103,232,249,.3);
        border-radius: 30px;
        color: var(--admin-cyan);
        background: linear-gradient(145deg, #182e45, #111b2d);
        box-shadow: 0 0 50px rgba(34,211,238,.13), inset 0 0 25px rgba(34,211,238,.05);
        font-size: 44px;
      }

      .admin-float-icon {
        position: absolute;
        width: 39px;
        height: 39px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(148,163,184,.18);
        border-radius: 12px;
        color: #c4b5fd;
        background: #18243a;
        box-shadow: 0 8px 20px rgba(0,0,0,.2);
      }

      .admin-float-one { top: 12px; right: 34px; }
      .admin-float-two { bottom: 13px; left: 17px; color: #67e8f9; }
      .admin-float-three { bottom: 13px; right: 16px; color: #86efac; }

      .admin-alert {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        margin: 0 0 22px;
        padding: 15px 17px;
        border: 1px solid;
        border-radius: 13px;
        font-size: 13px;
        line-height: 1.6;
      }

      .admin-alert > i { margin-top: 2px; }
      .admin-alert > span { flex: 1; }
      .admin-alert > button {
        padding: 2px 4px;
        color: inherit;
        border: 0;
        background: transparent;
      }

      .admin-alert-error {
        color: #fca5a5;
        border-color: rgba(248,113,113,.25);
        background: rgba(127,29,29,.18);
      }

      .admin-alert-success {
        color: #86efac;
        border-color: rgba(74,222,128,.22);
        background: rgba(20,83,45,.18);
      }

      .admin-section { margin-bottom: 43px; }

      .admin-section-heading {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 20px;
      }

      .admin-section-kicker { margin-bottom: 9px; font-size: 9px; }

      .admin-section-heading h2, .admin-users-heading h2 {
        margin: 0;
        color: var(--admin-text);
        font-size: 22px;
        font-weight: 800;
        letter-spacing: -.6px;
      }

      .admin-section-heading p, .admin-users-heading p {
        margin: 7px 0 0;
        color: var(--admin-muted);
        font-size: 12px;
        line-height: 1.6;
      }

      .admin-updated-label {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 9px 12px;
        border: 1px solid var(--admin-border);
        border-radius: 10px;
        color: #a5b4fc;
        background: rgba(17,27,45,.8);
        font-size: 11px;
      }

      .admin-stats-grid {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 16px;
      }

      .admin-stat-card {
        position: relative;
        overflow: hidden;
        min-width: 0;
        padding: 21px 20px 19px;
        border: 1px solid var(--admin-border);
        border-radius: 18px;
        background: linear-gradient(145deg, rgba(21,31,50,.97), rgba(15,25,42,.98));
        transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease;
      }

      .admin-stat-card::after {
        position: absolute;
        content: "";
        width: 105px;
        height: 105px;
        top: -53px;
        right: -45px;
        border-radius: 50%;
        background: var(--stat-color);
        opacity: .075;
        filter: blur(2px);
        pointer-events: none;
      }

      .admin-stat-card:hover {
        transform: translateY(-4px);
        border-color: color-mix(in srgb, var(--stat-color) 40%, var(--admin-border));
        box-shadow: 0 13px 35px rgba(0,0,0,.15);
      }

      .tone-cyan { --stat-color: #22d3ee; }
      .tone-blue { --stat-color: #60a5fa; }
      .tone-purple { --stat-color: #a78bfa; }
      .tone-orange { --stat-color: #fb923c; }
      .tone-green { --stat-color: #4ade80; }

      .admin-stat-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 24px;
      }

      .admin-stat-icon {
        width: 43px;
        height: 43px;
        display: grid;
        place-items: center;
        border: 1px solid color-mix(in srgb, var(--stat-color) 24%, transparent);
        border-radius: 13px;
        color: var(--stat-color);
        background: color-mix(in srgb, var(--stat-color) 10%, transparent);
        font-size: 19px;
      }

      .admin-stat-indicator {
        color: var(--stat-color);
        font-size: 15px;
        opacity: .75;
      }

      .admin-stat-label {
        margin: 0 0 7px;
        color: #b4c0d2;
        font-size: 12px;
        font-weight: 600;
      }

      .admin-stat-value {
        color: var(--stat-color);
        font-size: clamp(25px, 2.1vw, 34px);
        font-weight: 850;
        letter-spacing: -1px;
        line-height: 1.2;
        overflow-wrap: anywhere;
      }

      .admin-stat-description {
        display: flex;
        align-items: center;
        gap: 7px;
        margin: 13px 0 0;
        color: #7f91a9;
        font-size: 10px;
      }

      .admin-stat-description span {
        width: 5px;
        height: 5px;
        background: var(--stat-color);
        box-shadow: none;
      }

      .admin-users-section {
        overflow: hidden;
        border: 1px solid var(--admin-border);
        border-radius: 21px;
        background: rgba(17,27,45,.91);
        box-shadow: 0 18px 45px rgba(0,0,0,.1);
      }

      .admin-users-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        padding: 25px 26px;
        border-bottom: 1px solid rgba(148,163,184,.12);
      }

      .admin-users-title {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .admin-users-heading-icon {
        width: 47px;
        height: 47px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(34,211,238,.2);
        border-radius: 14px;
        color: var(--admin-cyan);
        background: rgba(34,211,238,.08);
        font-size: 19px;
      }

      .admin-user-count {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 3px;
      }

      .admin-user-count strong {
        color: var(--admin-cyan);
        font-size: 24px;
        line-height: 1;
      }

      .admin-user-count span {
        color: var(--admin-muted);
        font-size: 10px;
      }

      .admin-toolbar {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 20px 26px 16px;
      }

      .admin-search, .admin-filter {
        min-height: 44px;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 13px;
        border: 1px solid #2b3b53;
        border-radius: 11px;
        color: #8193aa;
        background: #0d1728;
        transition: border-color .2s ease, box-shadow .2s ease;
      }

      .admin-search { flex: 1; min-width: 160px; }
      .admin-search:focus-within, .admin-filter:focus-within {
        border-color: rgba(34,211,238,.55);
        box-shadow: 0 0 0 3px rgba(34,211,238,.07);
      }

      .admin-search input {
        width: 100%;
        min-width: 0;
        color: var(--admin-text);
        border: 0;
        outline: none;
        background: transparent;
        font-size: 12px;
      }

      .admin-search input::placeholder { color: #64748b; }

      .admin-search button {
        padding: 3px;
        color: #8193aa;
        border: 0;
        background: transparent;
      }

      .admin-filter { min-width: 155px; }
      .admin-filter select {
        width: 100%;
        color: #dbe5f2;
        border: 0;
        outline: none;
        background: transparent;
        font-size: 12px;
        cursor: pointer;
      }

      .admin-filter option, .admin-role-select option {
        color: #f8fafc;
        background: #111b2d;
      }

      .admin-clear-button {
        padding: 9px 11px;
        color: var(--admin-cyan);
        border: 1px solid rgba(34,211,238,.2);
        border-radius: 9px;
        background: rgba(34,211,238,.06);
        font-size: 11px;
        white-space: nowrap;
      }

      .admin-table-summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 0 26px 15px;
        color: #8091a8;
        font-size: 10px;
      }

      .admin-table-summary strong { color: #dbe5f2; }

      .admin-table-secure {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: #a5b4fc;
      }

      .admin-table-wrapper { width: 100%; overflow-x: auto; }

      .admin-table {
        width: 100%;
        min-width: 850px;
        margin: 0;
        border-collapse: separate;
        border-spacing: 0;
        color: #dbe5f2;
      }

      .admin-table thead th {
        padding: 14px 19px;
        border-top: 1px solid rgba(148,163,184,.1);
        border-bottom: 1px solid rgba(148,163,184,.12);
        color: #71839d;
        background: #0e1829;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 1px;
        white-space: nowrap;
      }

      .admin-table thead th:first-child,
      .admin-table tbody td:first-child { padding-left: 26px; }

      .admin-table thead th:last-child,
      .admin-table tbody td:last-child { padding-right: 26px; }

      .admin-table tbody td {
        padding: 17px 19px;
        border-bottom: 1px solid rgba(148,163,184,.085);
        background: transparent;
        vertical-align: middle;
        font-size: 12px;
        white-space: nowrap;
      }

      .admin-table tbody tr { transition: background .18s ease; }
      .admin-table tbody tr:hover td { background: rgba(34,211,238,.025); }
      .admin-table tbody tr:last-child td { border-bottom: 0; }

      .admin-user-cell {
        display: flex;
        align-items: center;
        gap: 11px;
      }

      .admin-avatar {
        width: 40px;
        height: 40px;
        flex: 0 0 40px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(34,211,238,.19);
        border-radius: 13px;
        color: #67e8f9;
        background: linear-gradient(145deg, rgba(34,211,238,.14), rgba(99,102,241,.1));
        font-size: 12px;
        font-weight: 850;
      }

      .admin-user-details { display: flex; flex-direction: column; gap: 5px; }
      .admin-user-details strong { color: #f1f5f9; font-size: 12px; font-weight: 700; }
      .admin-user-details small { color: #64748b; font-size: 9px; }
      .admin-email { color: #a9b8cc; }

      .admin-role-control { display: flex; align-items: center; gap: 7px; }

      .admin-role-dot {
        width: 6px;
        height: 6px;
        flex: 0 0 6px;
        border-radius: 50%;
      }

      .role-student { background: #60a5fa; }
      .role-instructor { background: #a78bfa; }
      .role-admin { background: #fbbf24; }

      .admin-role-select {
        min-width: 105px;
        padding: 8px 26px 8px 10px;
        border: 1px solid #2a3a51;
        border-radius: 9px;
        outline: none;
        color: #dbe5f2;
        background: #0d1728;
        font-size: 11px;
        cursor: pointer;
      }

      .admin-role-select:focus {
        border-color: rgba(34,211,238,.5);
        box-shadow: 0 0 0 2px rgba(34,211,238,.07);
      }

      .admin-role-select:disabled { opacity: .55; cursor: wait; }

      .admin-date {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        color: #94a3b8;
        font-size: 11px;
      }

      .admin-date i { color: #64748b; }

      .admin-delete-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        min-height: 33px;
        padding: 0 11px;
        border: 1px solid rgba(248,113,113,.22);
        border-radius: 9px;
        color: #fca5a5;
        background: rgba(127,29,29,.12);
        font-size: 10px;
        font-weight: 700;
        transition: background .2s ease, border-color .2s ease;
      }

      .admin-delete-button:not(:disabled):hover {
        border-color: rgba(248,113,113,.5);
        background: rgba(127,29,29,.25);
      }

      .admin-mini-spinner {
        width: 12px;
        height: 12px;
        display: inline-block;
        border: 2px solid rgba(148,163,184,.25);
        border-top-color: var(--admin-cyan);
        border-radius: 50%;
        animation: admin-spin .7s linear infinite;
      }

      .admin-empty {
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 58px 20px;
        text-align: center;
      }

      .admin-empty-icon {
        width: 68px;
        height: 68px;
        display: grid;
        place-items: center;
        border: 1px solid rgba(34,211,238,.16);
        border-radius: 22px;
        color: var(--admin-cyan);
        background: rgba(34,211,238,.07);
        font-size: 27px;
      }

      .admin-empty h3 { margin: 18px 0 8px; color: #f1f5f9; font-size: 17px; font-weight: 800; }
      .admin-empty p { margin: 0 0 19px; color: #94a3b8; font-size: 12px; line-height: 1.7; }
      .admin-primary-button { min-height: 38px; font-size: 11px; cursor: pointer; }

      .admin-table-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 15px 26px;
        border-top: 1px solid rgba(148,163,184,.1);
        color: #64748b;
        background: rgba(11,17,32,.25);
        font-size: 10px;
      }

      .admin-table-footer > span:first-child { display: inline-flex; align-items: center; gap: 7px; }
      .admin-table-footer i { color: var(--admin-cyan); }
      .admin-footer-dot { color: var(--admin-cyan); padding: 0 4px; }

      .admin-page-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 23px 2px 0;
        color: #64748b;
        font-size: 10px;
      }

      .admin-loading {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 30px;
        text-align: center;
      }

      .admin-loading .admin-brand-mark { margin-bottom: 25px; }
      .admin-loading-spinner {
        width: 30px;
        height: 30px;
        margin-bottom: 18px;
        border: 3px solid rgba(34,211,238,.15);
        border-top-color: var(--admin-cyan);
        border-radius: 50%;
        animation: admin-spin .75s linear infinite;
      }

      .admin-loading h2 { margin: 0 0 8px; color: #f8fafc; font-size: 20px; font-weight: 800; }
      .admin-loading p { margin: 0; color: #94a3b8; font-size: 12px; }

      .admin-loading-grid {
        width: min(800px, 90vw);
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 12px;
        margin-top: 35px;
      }

      .admin-skeleton {
        height: 110px;
        border: 1px solid rgba(148,163,184,.08);
        border-radius: 15px;
        background: linear-gradient(100deg, #111b2d 25%, #1a2940 45%, #111b2d 65%);
        background-size: 200% 100%;
        animation: admin-shimmer 1.5s infinite linear;
      }

      .admin-spin { animation: admin-spin .8s linear infinite; }
      @keyframes admin-spin { to { transform: rotate(360deg); } }
      @keyframes admin-shimmer { to { background-position-x: -200%; } }

      @media (max-width: 1199px) {
        .admin-stats-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      }

      @media (max-width: 767px) {
        .admin-shell { padding: 0 17px; }
        .admin-topbar { min-height: 75px; }
        .admin-brand-mark { width: 39px; height: 39px; }
        .admin-status { display: none; }
        .admin-refresh-button { min-height: 38px; padding: 0 11px; font-size: 11px; }
        .admin-hero { min-height: 0; margin: 22px 0 31px; padding: 28px 24px; border-radius: 19px; }
        .admin-hero-art { display: none; }
        .admin-hero h1 { font-size: 35px; }
        .admin-hero-copy > p { font-size: 12px; }
        .admin-hero-meta { gap: 12px; }
        .admin-section-heading h2, .admin-users-heading h2 { font-size: 19px; }
        .admin-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 11px; }
        .admin-stat-card { padding: 17px 15px; border-radius: 15px; }
        .admin-stat-top { margin-bottom: 18px; }
        .admin-stat-icon { width: 38px; height: 38px; }
        .admin-stat-value { font-size: 27px; }
        .admin-stat-description { font-size: 9px; }
        .admin-users-heading { padding: 20px 17px; }
        .admin-users-heading-icon { width: 40px; height: 40px; }
        .admin-toolbar { flex-wrap: wrap; padding: 16px 17px 13px; }
        .admin-search { flex-basis: 100%; }
        .admin-filter { flex: 1; }
        .admin-table-summary { padding: 0 17px 14px; }
        .admin-table thead th:first-child,
        .admin-table tbody td:first-child { padding-left: 17px; }
        .admin-table thead th:last-child,
        .admin-table tbody td:last-child { padding-right: 17px; }
        .admin-table-footer { align-items: flex-start; flex-direction: column; padding: 15px 17px; }
        .admin-page-footer { flex-direction: column; align-items: flex-start; }
      }

      @media (max-width: 420px) {
        .admin-shell { padding: 0 12px; }
        .admin-brand { gap: 8px; }
        .admin-brand strong { font-size: 15px; }
        .admin-brand small { font-size: 8px; letter-spacing: 1.4px; }
        .admin-topbar-right { gap: 0; }
        .admin-refresh-button { gap: 5px; padding: 0 8px; }
        .admin-hero { padding: 25px 18px; }
        .admin-hero h1 { font-size: 30px; letter-spacing: -1px; }
        .admin-hero-meta { flex-direction: column; gap: 9px; }
        .admin-stats-grid { gap: 9px; }
        .admin-stat-card { padding: 14px 12px; }
        .admin-stat-value { font-size: 24px; }
        .admin-section-heading { align-items: flex-start; }
        .admin-updated-label { display: none; }
        .admin-users-title { gap: 10px; }
        .admin-users-heading h2 { font-size: 16px; }
        .admin-users-heading p { max-width: 210px; font-size: 10px; }
        .admin-user-count strong { font-size: 20px; }
        .admin-user-count span { font-size: 9px; }
        .admin-table-summary { align-items: flex-start; flex-direction: column; }
        .admin-loading-grid { grid-template-columns: repeat(2, 1fr); }
      }

      @media (prefers-reduced-motion: reduce) {
        .admin-dashboard *, .admin-dashboard *::before, .admin-dashboard *::after {
          animation-duration: .01ms !important;
          animation-iteration-count: 1 !important;
          scroll-behavior: auto !important;
          transition-duration: .01ms !important;
        }
      }
    `}</style>
  );
}

export default AdminDashboard;