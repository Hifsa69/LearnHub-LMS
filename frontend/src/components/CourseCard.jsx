import { Link } from "react-router-dom";

function CourseCard({ course }) {
  const price = Number(course?.price);
  const isFree = Number.isFinite(price) && price === 0;

  return (
    <>
      <article className="lh-course-card h-100">
        {/* Premium Cover */}
        <div className="lh-course-cover">
          <div className="lh-cover-orb lh-cover-orb-one"></div>
          <div className="lh-cover-orb lh-cover-orb-two"></div>

          <div className="lh-cover-top">
            <span className="lh-course-category">
              <i className="bi bi-grid-fill"></i>
              {course?.category || "General"}
            </span>

            <span className="lh-course-badge">
              <i className="bi bi-stars"></i>
              Featured
            </span>
          </div>

          <div className="lh-course-art">
            <div className="lh-course-art-inner">
              <i className="bi bi-mortarboard-fill"></i>
            </div>
            <span className="lh-art-spark lh-spark-one">✦</span>
            <span className="lh-art-spark lh-spark-two">✧</span>
          </div>

          <div className="lh-cover-bottom">
            <span className="lh-cover-caption">LEARN SOMETHING NEW</span>
            <span className="lh-cover-line"></span>
          </div>
        </div>

        {/* Course Details */}
        <div className="lh-course-content">
          <div className="lh-course-main">
            <div className="lh-course-title-row">
              <h5 className="lh-course-title">
                {course?.title || "Untitled Course"}
              </h5>
              <i className="bi bi-arrow-up-right lh-title-arrow"></i>
            </div>

            <p className="lh-course-description">
              {course?.description ||
                "Explore this course and start building your skills."}
            </p>
          </div>

          {/* Instructor */}
          <div className="lh-course-instructor">
            <div className="lh-instructor-avatar">
              <i className="bi bi-person-fill"></i>
            </div>

            <div className="lh-instructor-info">
              <span className="lh-instructor-label">YOUR INSTRUCTOR</span>
              <span className="lh-instructor-name">
                {course?.instructor?.name || "LearnHub Instructor"}
              </span>
            </div>

            <span className="lh-verified" title="Instructor">
              <i className="bi bi-patch-check-fill"></i>
            </span>
          </div>

          {/* Price + CTA */}
          <div className="lh-course-footer">
            <div className="lh-course-price">
              <span className="lh-price-label">COURSE PRICE</span>
              <span className="lh-price-value">
                {!Number.isFinite(price)
                  ? "Contact us"
                  : isFree
                    ? "Free"
                    : `Rs. ${price.toLocaleString("en-PK")}`}
              </span>
            </div>

            <Link
              to={`/courses/${course?._id}`}
              className="lh-course-button"
              aria-label={`View details for ${course?.title || "course"}`}
            >
              <span>Explore Course</span>
              <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </article>

      <style>{`
        .lh-course-card {
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-width: 0;
          overflow: hidden;
          color: #F8FAFC;
          background: linear-gradient(160deg, #151F32 0%, #0E1728 100%);
          border: 1px solid #263449;
          border-radius: 20px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
          transition: transform 0.28s ease, border-color 0.28s ease,
                      box-shadow 0.28s ease;
        }

        .lh-course-card:hover {
          transform: translateY(-5px);
          border-color: rgba(34, 211, 238, 0.5);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.24),
                      0 0 24px rgba(34, 211, 238, 0.055);
        }

        /* Cover */
        .lh-course-cover {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 178px;
          padding: 16px 17px 13px;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(ellipse at 50% 60%, rgba(34, 211, 238, 0.13), transparent 55%),
            linear-gradient(135deg, #172A40 0%, #111B2D 55%, #1A1A35 100%);
          border-bottom: 1px solid rgba(148, 163, 184, 0.12);
        }

        .lh-cover-orb {
          position: absolute;
          z-index: -1;
          border: 1px solid rgba(103, 232, 249, 0.12);
          border-radius: 50%;
          pointer-events: none;
        }

        .lh-cover-orb-one {
          top: 20px;
          right: -35px;
          width: 145px;
          height: 145px;
        }

        .lh-cover-orb-two {
          top: 38px;
          right: -18px;
          width: 110px;
          height: 110px;
          border-color: rgba(129, 140, 248, 0.15);
        }

        .lh-cover-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          min-width: 0;
        }

        .lh-course-category,
        .lh-course-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          max-width: 68%;
          padding: 6px 9px;
          overflow: hidden;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 700;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .lh-course-category {
          color: #A5F3FC;
          background: rgba(8, 13, 25, 0.52);
          border: 1px solid rgba(34, 211, 238, 0.2);
        }

        .lh-course-badge {
          max-width: 43%;
          color: #DDD6FE;
          background: rgba(129, 140, 248, 0.09);
          border: 1px solid rgba(167, 139, 250, 0.2);
        }

        .lh-course-art {
          position: absolute;
          top: 50%;
          left: 50%;
          display: grid;
          place-items: center;
          width: 80px;
          height: 80px;
          transform: translate(-50%, -40%);
        }

        .lh-course-art-inner {
          display: grid;
          place-items: center;
          width: 66px;
          height: 66px;
          color: #67E8F9;
          background: linear-gradient(145deg, rgba(34, 211, 238, 0.16), rgba(129, 140, 248, 0.12));
          border: 1px solid rgba(103, 232, 249, 0.32);
          border-radius: 22px;
          box-shadow: 0 0 35px rgba(34, 211, 238, 0.12),
                      inset 0 0 20px rgba(34, 211, 238, 0.04);
          font-size: 30px;
          transition: transform 0.28s ease, box-shadow 0.28s ease;
        }

        .lh-course-card:hover .lh-course-art-inner {
          transform: translateY(-3px) rotate(-4deg);
          box-shadow: 0 0 38px rgba(34, 211, 238, 0.2);
        }

        .lh-art-spark {
          position: absolute;
          color: #67E8F9;
          font-size: 17px;
        }

        .lh-spark-one {
          top: 3px;
          right: 1px;
        }

        .lh-spark-two {
          bottom: 7px;
          left: 1px;
          color: #C4B5FD;
          font-size: 20px;
        }

        .lh-cover-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .lh-cover-caption {
          color: #647C96;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.6px;
        }

        .lh-cover-line {
          width: 28px;
          height: 2px;
          border-radius: 5px;
          background: linear-gradient(90deg, #22D3EE, #818CF8);
        }

        /* Content */
        .lh-course-content {
          display: flex;
          flex: 1;
          flex-direction: column;
          padding: 19px;
        }

        .lh-course-main {
          flex: 1;
          min-width: 0;
        }

        .lh-course-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 9px;
        }

        .lh-course-title {
          margin: 0 0 9px;
          color: #F1F5F9;
          font-size: 16px;
          font-weight: 750;
          line-height: 1.45;
          letter-spacing: -0.3px;
          overflow-wrap: anywhere;
          transition: color 0.2s ease;
        }

        .lh-course-card:hover .lh-course-title {
          color: #A5F3FC;
        }

        .lh-title-arrow {
          flex-shrink: 0;
          margin-top: 2px;
          color: #52657E;
          font-size: 14px;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .lh-course-card:hover .lh-title-arrow {
          color: #22D3EE;
          transform: translate(2px, -2px);
        }

        .lh-course-description {
          display: -webkit-box;
          min-height: 61px;
          margin: 0 0 16px;
          overflow: hidden;
          color: #94A3B8;
          font-size: 12.5px;
          line-height: 1.7;
          overflow-wrap: anywhere;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }

        /* Instructor */
        .lh-course-instructor {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          padding: 13px 0;
          margin-bottom: 15px;
          border-top: 1px solid rgba(148, 163, 184, 0.12);
          border-bottom: 1px solid rgba(148, 163, 184, 0.12);
        }

        .lh-instructor-avatar {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          width: 36px;
          height: 36px;
          color: #C4B5FD;
          background: linear-gradient(145deg, rgba(129, 140, 248, 0.17), rgba(34, 211, 238, 0.07));
          border: 1px solid rgba(129, 140, 248, 0.2);
          border-radius: 12px;
          font-size: 17px;
        }

        .lh-instructor-info {
          display: flex;
          flex: 1;
          flex-direction: column;
          min-width: 0;
          gap: 4px;
        }

        .lh-instructor-label,
        .lh-price-label {
          color: #64748B;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .lh-instructor-name {
          overflow: hidden;
          color: #CBD5E1;
          font-size: 12px;
          font-weight: 650;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .lh-verified {
          display: grid;
          flex-shrink: 0;
          place-items: center;
          width: 25px;
          height: 25px;
          color: #22D3EE;
          background: rgba(34, 211, 238, 0.08);
          border-radius: 8px;
          font-size: 12px;
        }

        /* Footer */
        .lh-course-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: auto;
        }

        .lh-course-price {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }

        .lh-price-value {
          color: #67E8F9;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.4px;
          overflow-wrap: anywhere;
        }

        .lh-course-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 10px 12px;
          color: #07111D;
          background: linear-gradient(115deg, #67E8F9, #22D3EE);
          border: 1px solid transparent;
          border-radius: 10px;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
          box-shadow: 0 5px 16px rgba(34, 211, 238, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .lh-course-button:hover {
          color: #07111D;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(34, 211, 238, 0.22);
        }

        .lh-course-button:focus-visible {
          outline: 2px solid #67E8F9;
          outline-offset: 3px;
        }

        @media (max-width: 420px) {
          .lh-course-content {
            padding: 16px;
          }

          .lh-course-cover {
            min-height: 165px;
          }

          .lh-course-footer {
            align-items: stretch;
            flex-direction: column;
          }

          .lh-course-button {
            width: 100%;
            padding: 11px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .lh-course-card,
          .lh-course-art-inner,
          .lh-course-button,
          .lh-course-title,
          .lh-title-arrow {
            transition: none;
          }

          .lh-course-card:hover,
          .lh-course-card:hover .lh-course-art-inner,
          .lh-course-card:hover .lh-course-button {
            transform: none;
          }
        }
      `}</style>
    </>
  );
}

export default CourseCard;
