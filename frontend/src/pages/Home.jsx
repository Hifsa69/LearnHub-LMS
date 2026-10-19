import { Link } from "react-router-dom";

function Home() {
  const features = [
    {
      icon: "✦",
      number: "01",
      title: "Quality Courses",
      description:
        "Explore thoughtfully organized courses designed to help you understand concepts and build practical skills.",
      color: "#22D3EE",
    },
    {
      icon: "◈",
      number: "02",
      title: "Expert Guidance",
      description:
        "Learn step by step with structured lessons that make your learning journey easier and more effective.",
      color: "#A78BFA",
    },
    {
      icon: "↗",
      number: "03",
      title: "Grow Your Skills",
      description:
        "Keep learning, track your progress, and move closer to your personal and professional goals.",
      color: "#F9A8D4",
    },
  ];

  const benefits = [
    {
      icon: "▶",
      title: "Learn Your Way",
      text: "Access your lessons and learn at your own pace.",
    },
    {
      icon: "◎",
      title: "Track Progress",
      text: "Keep track of completed lessons and your learning journey.",
    },
    {
      icon: "✧",
      title: "Build Confidence",
      text: "Turn what you learn into skills you can use.",
    },
  ];

  return (
    <main className="learnhub-home">
      <style>{`
        .learnhub-home {
          --bg: #080D1A;
          --panel: #111B2D;
          --border: rgba(148, 163, 184, 0.16);
          --cyan: #22D3EE;
          --purple: #A78BFA;
          background: var(--bg);
          color: #F8FAFC;
          overflow: hidden;
          font-family: inherit;
        }

        .lh-hero {
          position: relative;
          isolation: isolate;
          background:
            radial-gradient(ellipse at 80% 30%, rgba(124, 58, 237, 0.18), transparent 38%),
            radial-gradient(ellipse at 15% 65%, rgba(6, 182, 212, 0.13), transparent 38%),
            linear-gradient(135deg, #080D1A 0%, #0D172A 55%, #101027 100%);
        }

        .lh-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          opacity: 0.15;
          background-image: radial-gradient(#94A3B8 0.7px, transparent 0.7px);
          background-size: 25px 25px;
          mask-image: linear-gradient(to bottom, black, transparent 90%);
        }

        .lh-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 9px 15px;
          border: 1px solid rgba(34, 211, 238, 0.24);
          border-radius: 100px;
          color: #A5F3FC;
          background: rgba(34, 211, 238, 0.07);
          font-size: 0.82rem;
          letter-spacing: 0.4px;
        }

        .lh-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22D3EE;
          box-shadow: 0 0 12px #22D3EE;
        }

        .lh-gradient-text {
          background: linear-gradient(100deg, #67E8F9 5%, #A78BFA 55%, #F0ABFC 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .lh-subtitle {
          max-width: 570px;
          color: #A6B3C8;
          line-height: 1.9;
          font-size: 1.06rem;
        }

        .lh-primary-btn {
          background: linear-gradient(110deg, #22D3EE, #06B6D4);
          color: #07111F;
          border: 1px solid transparent;
          border-radius: 12px;
          padding: 13px 22px;
          font-weight: 700;
          box-shadow: 0 8px 28px rgba(6, 182, 212, 0.16);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .lh-primary-btn:hover {
          color: #07111F;
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(6, 182, 212, 0.3);
        }

        .lh-secondary-btn {
          color: #E2E8F0;
          border: 1px solid rgba(148, 163, 184, 0.3);
          background: rgba(15, 23, 42, 0.48);
          border-radius: 12px;
          padding: 13px 22px;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          transition: all 0.25s ease;
        }

        .lh-secondary-btn:hover {
          color: #67E8F9;
          border-color: #22D3EE;
          background: rgba(34, 211, 238, 0.06);
          transform: translateY(-3px);
        }

        .lh-preview {
          position: relative;
          max-width: 470px;
          margin: 0 auto;
          padding: 22px;
          border: 1px solid rgba(148, 163, 184, 0.22);
          border-radius: 26px;
          background: linear-gradient(145deg, rgba(23, 35, 57, 0.95), rgba(13, 20, 37, 0.92));
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255,255,255,0.05);
          transform: rotate(1deg);
        }

        .lh-preview-label {
          color: #94A3B8;
          font-size: 0.78rem;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }

        .lh-preview-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: rgba(34, 211, 238, 0.12);
          color: #67E8F9;
          font-size: 1.45rem;
        }

        .lh-mini-card {
          padding: 15px;
          border: 1px solid rgba(148, 163, 184, 0.13);
          border-radius: 15px;
          background: rgba(8, 13, 26, 0.55);
          transition: border-color 0.25s ease, transform 0.25s ease;
        }

        .lh-mini-card:hover {
          transform: translateY(-3px);
          border-color: rgba(34, 211, 238, 0.38);
        }

        .lh-progress {
          height: 6px;
          overflow: hidden;
          border-radius: 20px;
          background: #263449;
        }

        .lh-progress-fill {
          width: 68%;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #22D3EE, #A78BFA);
        }

        .lh-section {
          padding: 90px 0;
          background: #080D1A;
        }

        .lh-section-kicker {
          color: #67E8F9;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .lh-section-description {
          max-width: 620px;
          margin: 0 auto;
          color: #94A3B8;
          line-height: 1.8;
        }

        .lh-feature-card {
          position: relative;
          height: 100%;
          padding: 30px;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: linear-gradient(145deg, #131E32, #0D1525);
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .lh-feature-card:hover {
          transform: translateY(-7px);
          border-color: rgba(34, 211, 238, 0.38);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.2);
        }

        .lh-feature-number {
          position: absolute;
          top: 22px;
          right: 24px;
          color: rgba(148, 163, 184, 0.25);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .lh-feature-icon {
          display: grid;
          place-items: center;
          width: 58px;
          height: 58px;
          border-radius: 17px;
          font-size: 1.65rem;
          margin-bottom: 26px;
        }

        .lh-benefit {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          height: 100%;
          padding: 22px;
          border: 1px solid var(--border);
          border-radius: 17px;
          background: rgba(17, 27, 45, 0.65);
        }

        .lh-benefit-icon {
          flex-shrink: 0;
          display: grid;
          place-items: center;
          width: 43px;
          height: 43px;
          border-radius: 13px;
          color: #67E8F9;
          background: rgba(34, 211, 238, 0.1);
          font-size: 1.2rem;
        }

        .lh-cta {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(34, 211, 238, 0.22);
          border-radius: 26px;
          padding: 55px 30px;
          background:
            radial-gradient(ellipse at 100% 0%, rgba(124, 58, 237, 0.2), transparent 45%),
            radial-gradient(ellipse at 0% 100%, rgba(6, 182, 212, 0.13), transparent 45%),
            #111B2D;
        }

        .lh-muted { color: #A6B3C8; }
        .lh-border { border-color: var(--border) !important; }

        @media (max-width: 767px) {
          .lh-section { padding: 65px 0; }
          .lh-preview { padding: 17px; transform: none; }
          .lh-cta { padding: 40px 22px; }
          .lh-hero-title { font-size: clamp(2.65rem, 12vw, 4rem) !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .lh-feature-card, .lh-mini-card, .lh-primary-btn, .lh-secondary-btn {
            transition: none;
          }
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="lh-hero py-5">
        <div className="container position-relative py-lg-5">
          <div className="row align-items-center g-5 py-4 py-lg-3">
            <div className="col-lg-7">
              <span className="lh-eyebrow mb-4">
                <span className="lh-status-dot" />
                YOUR NEXT CHAPTER STARTS HERE
              </span>

              <h1
                className="lh-hero-title display-2 fw-bold mb-4"
                style={{ lineHeight: 1.12, letterSpacing: "-2px" }}
              >
                Learn something
                <br />
                <span className="lh-gradient-text">extraordinary.</span>
              </h1>

              <p className="lh-subtitle mb-4">
                Discover new possibilities with LearnHub. Explore courses,
                build meaningful skills, and turn your curiosity into progress
                — one lesson at a time.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-5">
                <Link to="/courses" className="lh-primary-btn">
                  Explore Courses <span aria-hidden="true">↗</span>
                </Link>

                <Link to="/register" className="lh-secondary-btn">
                  Get Started <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="d-flex flex-wrap gap-4">
                <div className="d-flex align-items-center gap-2">
                  <span style={{ color: "#22D3EE", fontSize: "1.2rem" }}>
                    ✓
                  </span>
                  <span className="lh-muted small">Learn at your own pace</span>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span style={{ color: "#A78BFA", fontSize: "1.2rem" }}>
                    ✓
                  </span>
                  <span className="lh-muted small">A journey built around you</span>
                </div>
              </div>
            </div>

            {/* Learning Dashboard Preview */}
            <div className="col-lg-5">
              <div className="lh-preview">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div>
                    <div className="lh-preview-label mb-2">
                      YOUR LEARNING SPACE
                    </div>
                    <h4 className="fw-bold mb-0">Welcome, learner ✨</h4>
                  </div>
                  <div className="lh-preview-icon">✦</div>
                </div>

                <div
                  className="p-3 rounded-4 mb-4"
                  style={{
                    background:
                      "linear-gradient(115deg, rgba(34,211,238,0.12), rgba(167,139,250,0.1))",
                    border: "1px solid rgba(34,211,238,0.15)",
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="d-grid place-items-center rounded-3"
                      style={{
                        width: 54,
                        height: 54,
                        flexShrink: 0,
                        display: "grid",
                        placeItems: "center",
                        background: "rgba(34,211,238,0.13)",
                        color: "#67E8F9",
                        fontSize: "1.6rem",
                      }}
                    >
                      ▶
                    </div>
                    <div>
                      <div className="small lh-muted mb-1">
                        YOUR NEXT STEP
                      </div>
                      <div className="fw-semibold">Explore a new course</div>
                      <div className="small mt-1" style={{ color: "#67E8F9" }}>
                        Start learning today →
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="fw-semibold">A better way to learn</span>
                  <span className="small lh-muted">Made for growth</span>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <div className="lh-mini-card h-100">
                      <div className="mb-3" style={{ color: "#67E8F9", fontSize: "1.35rem" }}>
                        ◉
                      </div>
                      <div className="fw-semibold mb-1">Learn</div>
                      <div className="small lh-muted">Discover new ideas</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="lh-mini-card h-100">
                      <div className="mb-3" style={{ color: "#C4B5FD", fontSize: "1.35rem" }}>
                        ↗
                      </div>
                      <div className="fw-semibold mb-1">Improve</div>
                      <div className="small lh-muted">Grow your abilities</div>
                    </div>
                  </div>
                </div>

                <div
                  className="d-flex align-items-center gap-3 pt-3"
                  style={{ borderTop: "1px solid rgba(148,163,184,0.15)" }}
                >
                  <div
                    className="rounded-circle d-grid"
                    style={{
                      width: 39,
                      height: 39,
                      flexShrink: 0,
                      placeItems: "center",
                      display: "grid",
                      color: "#67E8F9",
                      background: "rgba(34,211,238,0.12)",
                    }}
                  >
                    ✧
                  </div>
                  <div className="flex-grow-1">
                    <div className="small fw-semibold">Every expert starts somewhere.</div>
                    <div className="small lh-muted">Make today count.</div>
                  </div>
                  <span style={{ color: "#A78BFA", fontSize: "1.3rem" }}>✦</span>
                </div>
              </div>

              <div className="text-center mt-4 small lh-muted">
                <span style={{ color: "#67E8F9" }}>✦</span>{" "}
                Your learning journey, your way.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION STRIP */}
      <section
        className="py-4"
        style={{
          background: "#0D1525",
          borderTop: "1px solid rgba(148,163,184,0.12)",
          borderBottom: "1px solid rgba(148,163,184,0.12)",
        }}
      >
        <div className="container">
          <div className="row g-3 text-center">
            <div className="col-12 col-md-4">
              <div className="fw-semibold">
                <span style={{ color: "#22D3EE" }}>✦</span>{" "}
                Knowledge that moves you forward
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="fw-semibold">
                <span style={{ color: "#A78BFA" }}>✧</span>{" "}
                Lessons with purpose
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="fw-semibold">
                <span style={{ color: "#F0ABFC" }}>↗</span>{" "}
                Progress at your pace
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="lh-section">
        <div className="container">
          <div className="text-center mb-5">
            <div className="lh-section-kicker mb-3">THE LEARNHUB DIFFERENCE</div>

            <h2
              className="display-5 fw-bold mb-3"
              style={{ letterSpacing: "-1px" }}
            >
              Your goals. <span className="lh-gradient-text">Your growth.</span>
            </h2>

            <p className="lh-section-description">
              Learning should feel exciting, organized, and rewarding.
              LearnHub gives you a space to explore knowledge and keep moving
              forward.
            </p>
          </div>

          <div className="row g-4">
            {features.map((feature) => (
              <div className="col-12 col-md-6 col-lg-4" key={feature.number}>
                <article className="lh-feature-card">
                  <span className="lh-feature-number">{feature.number}</span>

                  <div
                    className="lh-feature-icon"
                    style={{
                      color: feature.color,
                      background: `${feature.color}14`,
                      border: `1px solid ${feature.color}30`,
                    }}
                  >
                    {feature.icon}
                  </div>

                  <h3 className="h4 fw-bold mb-3">{feature.title}</h3>

                  <p className="lh-muted mb-4" style={{ lineHeight: 1.85 }}>
                    {feature.description}
                  </p>

                  <Link
                    to="/courses"
                    className="text-decoration-none fw-semibold"
                    style={{ color: feature.color }}
                  >
                    Discover more <span aria-hidden="true">→</span>
                  </Link>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEARNING BENEFITS */}
      <section
        className="py-5"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.08), transparent 55%), #0B1120",
        }}
      >
        <div className="container py-lg-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <div className="lh-section-kicker mb-3">MORE THAN JUST LESSONS</div>

              <h2 className="display-6 fw-bold mb-4">
                Small steps.
                <br />
                <span className="lh-gradient-text">Big possibilities.</span>
              </h2>

              <p className="lh-muted mb-4" style={{ lineHeight: 1.9 }}>
                Every new concept you understand is progress. Build a learning
                routine that works for you and keep discovering what you are
                capable of.
              </p>

              <Link to="/courses" className="lh-primary-btn">
                Find Your Next Course <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className="col-lg-7">
              <div className="row g-3">
                {benefits.map((benefit) => (
                  <div className="col-12" key={benefit.title}>
                    <div className="lh-benefit">
                      <div className="lh-benefit-icon">{benefit.icon}</div>
                      <div>
                        <h3 className="h5 fw-bold mb-2">{benefit.title}</h3>
                        <p className="lh-muted mb-0" style={{ lineHeight: 1.8 }}>
                          {benefit.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="pb-5 pt-4">
        <div className="container pb-5">
          <div className="lh-cta text-center">
            <div className="lh-section-kicker mb-3">YOUR JOURNEY STARTS NOW</div>

            <h2 className="display-5 fw-bold mb-3">
              Ready to <span className="lh-gradient-text">level up?</span>
            </h2>

            <p
              className="lh-muted mx-auto mb-4"
              style={{ maxWidth: 570, lineHeight: 1.85 }}
            >
              Your next skill, fresh idea, or exciting discovery could be one
              lesson away. Take the first step with LearnHub.
            </p>

            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/courses" className="lh-primary-btn">
                Explore Courses <span aria-hidden="true">↗</span>
              </Link>

              <Link to="/register" className="lh-secondary-btn">
                Join LearnHub <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="small lh-muted mt-4">
              Made for curious minds and ambitious learners.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;