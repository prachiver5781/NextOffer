import { Link } from "react-router-dom";

export default function Home({ loggedIn }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="hero-badge">🚀 Built for future developers</span>
        <p className="eyebrow">INTERVIEW PREPARATION WITHOUT THE CHAOS</p>
        
        <h1>
          Prepare today.
          <br />
          <span>Get your NextOffer.</span>
        </h1>

        <p className="hero-text">
          Practice DSA, master frontend concepts, revise React and JavaScript, 
          take mock interviews and build a stronger resume.
        </p>

        <div className="hero-actions">
          <Link
            className="primary-button large"
            to={loggedIn ? "/dashboard" : "/login"}
          >
            {loggedIn ? "Continue preparing →" : "Start preparing →"}
          </Link>
          <Link className="secondary-button large" to="/topics">
            Explore topics
          </Link>
        </div>

        <div className="hero-trust">
          <div>
            <strong>8+</strong>
            <span>Topics</span>
          </div>
          <div>
            <strong>6</strong>
            <span>Roadmap weeks</span>
          </div>
          <div>
            <strong>7</strong>
            <span>Interview questions</span>
          </div>
        </div>
      </div>

      <div className="hero-dashboard-card">
        <div className="dashboard-preview">
          <div className="preview-header">
            <div>
              <small>Today's progress</small>
              <h3>68%</h3>
            </div>
            <div className="progress-circle">68%</div>
          </div>

          <div className="preview-progress">
            <div style={{ width: "68%" }} />
          </div>

          <div className="preview-task done">
            <span>✓</span>
            Arrays revision
          </div>
          <div className="preview-task done">
            <span>✓</span>
            React props
          </div>
          <div className="preview-task">
            <span>○</span>
            Mock interview
          </div>
          <div className="preview-task">
            <span>○</span>
            Resume update
          </div>
        </div>
      </div>
    </section>
  );
}
