import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="lh-footer">
      <style>{`
        .lh-footer {
          position: relative;
          width: 100%;
          margin: 0;
          padding: 25px 0 12px;
          overflow: hidden;
          box-sizing: border-box;
          background: #080D19;
          color: #F8FAFC;
          border-top: 1px solid #263449;
          font-family: inherit;
        }

        .lh-footer *,
        .lh-footer *::before,
        .lh-footer *::after {
          box-sizing: border-box;
        }

        .lh-footer::before {
          content: "";
          position: absolute;
          top: -90px;
          left: 12%;
          width: 230px;
          height: 150px;
          border-radius: 50%;
          background: rgba(34, 211, 238, 0.08);
          filter: blur(65px);
          pointer-events: none;
        }

        .lh-footer-inner {
          position: relative;
          z-index: 1;
        }

        .lh-footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 10px;
          color: #F8FAFC;
          font-size: 20px;
          font-weight: 800;
          text-decoration: none;
          letter-spacing: -0.6px;
        }

        .lh-footer-logo {
          display: grid;
          place-items: center;
          width: 35px;
          height: 35px;
          border-radius: 10px;
          color: #07111D;
          background: linear-gradient(135deg, #22D3EE, #818CF8);
          box-shadow: 0 4px 14px rgba(34, 211, 238, 0.16);
        }

        .lh-footer-description {
          max-width: 290px;
          margin: 0;
          color: #94A3B8;
          font-size: 13px;
          line-height: 1.7;
        }

        .lh-footer-heading {
          margin: 5px 0 13px;
          color: #E2E8F0;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.7px;
          text-transform: uppercase;
        }

        .lh-footer-links {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 9px;
        }

        .lh-footer-links a {
          color: #94A3B8;
          font-size: 13px;
          text-decoration: none;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .lh-footer-links a:hover {
          color: #22D3EE;
          transform: translateX(3px);
        }

        .lh-footer-socials {
          display: flex;
          gap: 8px;
          margin-top: 14px;
        }

        .lh-footer-socials a {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border: 1px solid #263449;
          border-radius: 9px;
          color: #94A3B8;
          background: #111B2D;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .lh-footer-socials a:hover {
          color: #22D3EE;
          border-color: #22D3EE;
          transform: translateY(-2px);
        }

        .lh-footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 23px;
          padding-top: 13px;
          border-top: 1px solid #1E293B;
          color: #64748B;
          font-size: 11px;
        }

        .lh-footer-bottom p {
          margin: 0;
        }

        .lh-footer-accent {
          color: #22D3EE;
        }

        @media (max-width: 767px) {
          .lh-footer {
            padding-top: 22px;
          }

          .lh-footer-main {
            row-gap: 22px;
          }

          .lh-footer-description {
            max-width: 100%;
          }

          .lh-footer-bottom {
            align-items: flex-start;
            flex-direction: column;
            gap: 7px;
            margin-top: 19px;
          }
        }
      `}</style>

      <div className="container lh-footer-inner">
        <div className="row lh-footer-main gy-3">
          <div className="col-12 col-md-6 col-lg-5">
            <Link to="/" className="lh-footer-brand">
              <span className="lh-footer-logo">
                <i className="bi bi-mortarboard-fill"></i>
              </span>
              <span>
                Learn<span className="lh-footer-accent">Hub</span>
              </span>
            </Link>

            <p className="lh-footer-description">
              Learn new skills, discover opportunities, and build
              your future with LearnHub.
            </p>

            <div className="lh-footer-socials">
              <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub">
                <i className="bi bi-github"></i>
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="mailto:hello@learnhub.com" aria-label="Email">
                <i className="bi bi-envelope-fill"></i>
              </a>
            </div>
          </div>

          <div className="col-6 col-md-3 col-lg-3">
            <h6 className="lh-footer-heading">Explore</h6>
            <div className="lh-footer-links">
              <Link to="/">Home</Link>
              <Link to="/courses">Browse Courses</Link>
              <Link to="/register">Create Account</Link>
            </div>
          </div>

          <div className="col-6 col-md-3 col-lg-4">
            <h6 className="lh-footer-heading">Learning</h6>
            <div className="lh-footer-links">
              <Link to="/my-courses">My Courses</Link>
              <Link to="/login">Sign In</Link>
              <a href="mailto:hello@learnhub.com">Contact Us</a>
            </div>
          </div>
        </div>

        <div className="lh-footer-bottom">
          <p>© {currentYear} LearnHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;