import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AddCourse() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    category: "",
    price: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    const title = formData.title.trim();
    const description = formData.description.trim();
    const instructor = formData.instructor.trim();
    const category = formData.category.trim();
    const price = Number(formData.price);

    if (!title || !description || !instructor || !category) {
      setMessage("Please fill in all required fields.");
      setMessageType("error");
      return;
    }

    if (
      formData.price.trim() === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      setMessage("Please enter a valid course price.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/courses", {
        ...formData,
        title,
        description,
        instructor,
        category,
        price,
      });

      setMessage(
        response.data?.message || "Course created successfully!"
      );
      setMessageType("success");

      setTimeout(() => {
        navigate("/courses");
      }, 1200);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to create course. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-course-page">
      <style>{`
        .add-course-page {
          min-height: 100vh;
          padding: 38px 16px;
          color: #F8FAFC;
          background:
            radial-gradient(
              ellipse at 10% 5%,
              rgba(34, 211, 238, .09),
              transparent 35%
            ),
            radial-gradient(
              ellipse at 90% 90%,
              rgba(124, 58, 237, .10),
              transparent 35%
            ),
            #080D1A;
        }

        .course-shell {
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
        }

        .course-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }

        .course-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #94A3B8;
          text-decoration: none;
          font-size: 13px;
          transition: color .2s ease;
        }

        .course-back:hover {
          color: #22D3EE;
        }

        .course-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 11px;
          border: 1px solid rgba(34, 211, 238, .22);
          border-radius: 999px;
          background: rgba(34, 211, 238, .07);
          color: #67E8F9;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .6px;
          text-transform: uppercase;
        }

        .course-panel {
          overflow: hidden;
          border: 1px solid #263449;
          border-radius: 20px;
          background: rgba(17, 27, 45, .92);
          box-shadow: 0 22px 65px rgba(0, 0, 0, .28);
          backdrop-filter: blur(18px);
        }

        .course-panel-header {
          padding: 25px 28px;
          border-bottom: 1px solid #263449;
          background: linear-gradient(
            120deg,
            rgba(34, 211, 238, .08),
            transparent 70%
          );
        }

        .course-panel-body {
          padding: 26px 28px 28px;
        }

        .course-heading {
          margin: 13px 0 8px;
          color: #F8FAFC;
          font-size: clamp(26px, 4vw, 32px);
          font-weight: 800;
          letter-spacing: -.9px;
        }

        .course-subtitle {
          max-width: 500px;
          margin: 0;
          color: #94A3B8;
          font-size: 13px;
          line-height: 1.8;
        }

        .course-form-label {
          display: block;
          margin-bottom: 8px;
          color: #E2E8F0;
          font-size: 13px;
          font-weight: 650;
        }

        .course-input {
          display: block;
          width: 100%;
          padding: 11px 13px;
          border: 1px solid #334155;
          border-radius: 10px;
          outline: none;
          background: #0B1220;
          color: #F8FAFC;
          font-size: 13px;
          transition:
            border-color .2s ease,
            box-shadow .2s ease;
        }

        .course-input::placeholder {
          color: #64748B;
        }

        .course-input:focus {
          border-color: #22D3EE;
          box-shadow: 0 0 0 3px rgba(34, 211, 238, .11);
        }

        .course-input:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .course-input option {
          background: #111B2D;
          color: #F8FAFC;
        }

        .course-help {
          display: block;
          margin-top: 6px;
          color: #64748B;
          font-size: 11px;
          line-height: 1.6;
        }

        .course-section-title {
          margin: 0 0 18px;
          color: #67E8F9;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.1px;
          text-transform: uppercase;
        }

        .course-submit {
          display: inline-flex;
          flex: 1;
          justify-content: center;
          align-items: center;
          gap: 9px;
          padding: 12px 18px;
          border: 1px solid transparent;
          border-radius: 10px;
          background: linear-gradient(100deg, #22D3EE, #06B6D4);
          color: #08202B;
          font-size: 13px;
          font-weight: 800;
          transition:
            transform .2s ease,
            box-shadow .2s ease,
            opacity .2s ease;
        }

        .course-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(34, 211, 238, .18);
        }

        .course-submit:disabled {
          cursor: not-allowed;
          opacity: .65;
        }

        .course-cancel {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 18px;
          border: 1px solid #334155;
          border-radius: 10px;
          background: transparent;
          color: #CBD5E1;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition:
            background .2s ease,
            border-color .2s ease;
        }

        .course-cancel:hover:not(:disabled) {
          border-color: #64748B;
          background: rgba(148, 163, 184, .06);
          color: #F8FAFC;
        }

        .course-alert {
          padding: 12px 14px;
          margin-bottom: 20px;
          border-radius: 10px;
          font-size: 13px;
          line-height: 1.6;
        }

        .course-alert.success {
          border: 1px solid rgba(52, 211, 153, .25);
          background: rgba(16, 185, 129, .09);
          color: #6EE7B7;
        }

        .course-alert.error {
          border: 1px solid rgba(248, 113, 113, .25);
          background: rgba(239, 68, 68, .08);
          color: #FCA5A5;
        }

        .course-footer-note {
          color: #64748B;
          font-size: 11px;
          line-height: 1.7;
        }

        @media (max-width: 576px) {
          .add-course-page {
            padding: 22px 12px;
          }

          .course-topbar {
            align-items: flex-start;
          }

          .course-badge {
            font-size: 9px;
          }

          .course-panel {
            border-radius: 16px;
          }

          .course-panel-header {
            padding: 22px 18px;
          }

          .course-panel-body {
            padding: 22px 18px;
          }

          .course-heading {
            letter-spacing: -.6px;
          }

          .course-actions {
            flex-direction: column-reverse;
          }

          .course-actions button,
          .course-actions a {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .course-back,
          .course-input,
          .course-submit,
          .course-cancel {
            transition: none;
          }
        }
      `}</style>

      <div className="course-shell">
        <div className="course-topbar">
          <button
            type="button"
            className="course-back btn p-0 border-0 bg-transparent"
            onClick={() => navigate("/instructor-dashboard")}
          >
            <span aria-hidden="true">←</span>
            Back to Dashboard
          </button>

          <span className="course-badge">
            <span aria-hidden="true">✦</span>
            LearnHub Instructor Studio
          </span>
        </div>

        <div className="course-panel">
          <div className="course-panel-header">
            <div style={{ fontSize: 31 }} aria-hidden="true">
              🎓
            </div>

            <h1 className="course-heading">Create a New Course</h1>

            <p className="course-subtitle">
              Share your knowledge with learners. Add your course details
              below to create a new learning experience.
            </p>
          </div>

          <div className="course-panel-body">
            {message && (
              <div
                className={`course-alert ${messageType}`}
                role={messageType === "error" ? "alert" : "status"}
                aria-live="polite"
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <h2 className="course-section-title">
                Course Information
              </h2>

              <div className="mb-4">
                <label
                  className="course-form-label"
                  htmlFor="course-title"
                >
                  Course Title
                </label>

                <input
                  id="course-title"
                  type="text"
                  name="title"
                  className="course-input"
                  placeholder="e.g. Complete Web Development Bootcamp"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={120}
                  autoComplete="off"
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-4">
                <label
                  className="course-form-label"
                  htmlFor="course-description"
                >
                  Course Description
                </label>

                <textarea
                  id="course-description"
                  name="description"
                  className="course-input"
                  rows={4}
                  placeholder="What will students learn in this course?"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={2000}
                  style={{ resize: "vertical" }}
                  required
                  disabled={loading}
                />

                <span className="course-help">
                  Explain the main topics and learning outcomes.
                </span>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label
                    className="course-form-label"
                    htmlFor="course-instructor"
                  >
                    Instructor User ID
                  </label>

                  <input
                    id="course-instructor"
                    type="text"
                    name="instructor"
                    className="course-input"
                    placeholder="Enter instructor MongoDB ID"
                    value={formData.instructor}
                    onChange={handleChange}
                    autoComplete="off"
                    required
                    disabled={loading}
                  />

                  <span className="course-help">
                    Use the MongoDB user ID expected by your backend.
                  </span>
                </div>

                <div className="col-md-6">
                  <label
                    className="course-form-label"
                    htmlFor="course-category"
                  >
                    Course Category
                  </label>

                  <input
                    id="course-category"
                    type="text"
                    name="category"
                    className="course-input"
                    placeholder="e.g. Programming"
                    value={formData.category}
                    onChange={handleChange}
                    maxLength={80}
                    required
                    disabled={loading}
                  />

                  <span className="course-help">
                    Choose a clear category for course discovery.
                  </span>
                </div>
              </div>

              <div className="mt-4 mb-4">
                <label
                  className="course-form-label"
                  htmlFor="course-price"
                >
                  Course Price (PKR)
                </label>

                <input
                  id="course-price"
                  type="number"
                  name="price"
                  className="course-input"
                  placeholder="e.g. 2500"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  required
                  disabled={loading}
                />

                <span className="course-help">
                  Enter 0 for a free course.
                </span>
              </div>

              <div className="course-actions d-flex gap-3 mt-4">
                <button
                  type="button"
                  className="course-cancel"
                  onClick={() => navigate("/instructor-dashboard")}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="course-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        aria-hidden="true"
                      />
                      Creating Course...
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true">＋</span>
                      Create Course
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="course-footer-note text-center mt-3 mb-0">
          LearnHub LMS · Empowering learning, one course at a time.
        </p>
      </div>
    </div>
  );
}

export default AddCourse;