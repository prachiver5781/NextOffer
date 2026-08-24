import { Link } from "react-router-dom";
import { topics, roadmap } from "./data";

export default function Dashboard({
  completed = [],
  profile = {},
  streak = 0,
}) {
  const percentage =
    topics.length === 0
      ? 0
      : Math.round((completed.length / topics.length) * 100);

  const remaining = Math.max(topics.length - completed.length, 0);

  const completedTopics = topics.filter((topic) =>
    completed.includes(topic.id)
  );

  return (
    <section className="page">

      {/* =========================
          HERO SECTION
      ========================= */}
      <section className="dashboard-hero-card">

        <div className="hero-left-content">
          <p className="eyebrow">YOUR DASHBOARD</p>

          <h1>
            Welcome back
            {profile?.name ? `, ${profile.name}` : ""} 👋
          </h1>

          <p>
            Keep learning and move one step closer to your next offer.
          </p>

          <div className="hero-btn-group">
            <Link to="/topics" className="primary-button">
              Practice now →
            </Link>

            <Link to="/roadmap" className="secondary-button">
              View roadmap
            </Link>
          </div>
        </div>

        {/* Animated streak radar */}
        <div className="hero-radar-wrapper">

          <div className="orbit-circle orbit-1"></div>
          <div className="orbit-circle orbit-2"></div>
          <div className="orbit-circle orbit-3"></div>

          <div className="orbit-particle particle-1">
            📚
          </div>

          <div className="orbit-particle particle-2">
            🎯
          </div>

          <div className="orbit-particle particle-3">
            ⚡
          </div>

          <div className="radar-center-badge">
            <span className="streak-num">
              {streak}
            </span>

            <span className="streak-lbl">
              Day Streak
            </span>
          </div>

        </div>
      </section>


      {/* =========================
          STAT CARDS
      ========================= */}
      <div className="dashboard-horizontal-grid">

        <section className="dashboard-panel-card">

          <div className="panel-header-row">
            <div className="panel-title-group">
              <h3>📚 Topics completed</h3>
              <p>Your completed practice topics</p>
            </div>

            <strong>
              {completed.length}
            </strong>
          </div>

          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{
                width: `${percentage}%`,
              }}
            ></div>
          </div>

          <p style={{ marginTop: "10px" }}>
            {percentage}% of your topics completed
          </p>

        </section>


        <section className="dashboard-panel-card">

          <div className="panel-header-row">
            <div className="panel-title-group">
              <h3>🎯 Topics remaining</h3>
              <p>Keep practicing to complete them</p>
            </div>

            <strong>
              {remaining}
            </strong>
          </div>

          <Link
            to="/topics"
            className="panel-link-text"
          >
            Start practicing →
          </Link>

        </section>

      </div>


      {/* =========================
          PROGRESS + DAILY GOAL
      ========================= */}
      <div className="dashboard-horizontal-grid">

        {/* Progress */}
        <section className="dashboard-panel-card">

          <div className="panel-header-row">

            <div className="panel-title-group">
              <h3>Your progress</h3>
              <p>Keep pushing forward</p>
            </div>

            <strong>
              {percentage}%
            </strong>

          </div>

          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{
                width: `${percentage}%`,
              }}
            ></div>
          </div>

          <p style={{ marginTop: "12px" }}>
            {completed.length} of {topics.length} topics completed
          </p>

          <Link
            to="/topics"
            className="panel-link-text"
          >
            View topics →
          </Link>

        </section>


        {/* Daily goal */}
        <section className="dashboard-panel-card">

          <div className="panel-header-row">

            <div className="panel-title-group">
              <h3>🎯 Daily goal</h3>
              <p>Stay consistent every day</p>
            </div>

            <strong>
              {Math.min(completed.length, 4)} / 4
            </strong>

          </div>

          <div className="progress-bar-track">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.min(
                  (completed.length / 4) * 100,
                  100
                )}%`,
              }}
            ></div>
          </div>

          <p style={{ marginTop: "12px" }}>
            {Math.min(completed.length, 4)} / 4 tasks completed
          </p>

          <Link
            to="/topics"
            className="panel-link-text"
          >
            Continue learning →
          </Link>

        </section>

      </div>


      {/* =========================
          DAILY CHALLENGE + CONTINUE
      ========================= */}
      <div className="dashboard-horizontal-grid">

        {/* Daily challenge */}
        <section className="dashboard-panel-card">

          <div className="panel-header-row">

            <div className="panel-title-group">
              <h3>🔥 Daily Challenge</h3>
              <p>Test yourself today</p>
            </div>

            <span className="panel-link-text">
              Today
            </span>

          </div>

          <div className="daily-challenge-box">

            <span className="challenge-number-watermark">
              01
            </span>

            <div className="challenge-details">

              <div className="challenge-tags-top">
                <span>🎯</span>
                <span>Practice</span>
              </div>

              <h4>
                Master your next concept
              </h4>

              <p>
                Choose a topic and complete a practice
                challenge to improve your placement preparation.
              </p>

              <div className="tag-pills-row">
                <span className="field-constraint-tag">
                  DSA
                </span>

                <span className="field-constraint-tag">
                  JavaScript
                </span>
              </div>

            </div>

            <Link
              to="/topics"
              className="challenge-action-circle"
            >
              →
            </Link>

          </div>

        </section>


        {/* Continue learning */}
        <section className="dashboard-panel-card">

          <div className="panel-header-row">

            <div className="panel-title-group">
              <h3>📚 Continue Learning</h3>
              <p>Pick up where you left off</p>
            </div>

            <Link
              to="/topics"
              className="panel-link-text"
            >
              View all →
            </Link>

          </div>

          <div className="continue-learning-list">

            {topics.slice(0, 3).map((topic) => {

              const isCompleted = completed.includes(topic.id);

              return (
                <Link
                  to="/topics"
                  className="continue-learning-item"
                  key={topic.id}
                >

                  <span className="cl-icon">
                    {topic.icon || "📘"}
                  </span>

                  <div className="cl-progress-info">

                    <div className="cl-title-row">

                      <strong>
                        {topic.title}
                      </strong>

                      <span>
                        {isCompleted ? "100%" : "0%"}
                      </span>

                    </div>

                    <div className="progress-bar-track">

                      <div
                        className="progress-bar-fill"
                        style={{
                          width: isCompleted ? "100%" : "0%",
                        }}
                      ></div>

                    </div>

                  </div>

                  <span className="cl-arrow">
                    →
                  </span>

                </Link>
              );
            })}

          </div>

        </section>

      </div>


      {/* =========================
          ROADMAP + ACHIEVEMENTS
      ========================= */}
      <div className="dashboard-horizontal-grid">

        {/* Roadmap */}
        <section className="dashboard-panel-card">

          <div className="panel-header-row">

            <div className="panel-title-group">
              <h3>🗺️ Continue your journey</h3>
              <p>Follow your placement roadmap</p>
            </div>

            <Link
              to="/roadmap"
              className="panel-link-text"
            >
              View all →
            </Link>

          </div>

          <div className="continue-learning-list">

            {roadmap.slice(0, 4).map((item, index) => (

              <Link
                to="/roadmap"
                className="continue-learning-item"
                key={item.week}
              >

                <span className="cl-icon">
                  {index + 1}
                </span>

                <div className="cl-progress-info">

                  <div className="cl-title-row">

                    <strong>
                      {item.title}
                    </strong>

                    <span>
                      Week {item.week}
                    </span>

                  </div>

                  <span style={{ fontSize: "11px" }}>
                    {item.items.slice(0, 2).join(" • ")}
                  </span>

                </div>

                <span className="cl-arrow">
                  →
                </span>

              </Link>

            ))}

          </div>

        </section>


        {/* Achievements */}
        <section className="dashboard-panel-card">

          <div className="panel-header-row">

            <div className="panel-title-group">
              <h3>🏆 Recent achievements</h3>
              <p>Your completed topics</p>
            </div>

          </div>

          <div className="continue-learning-list">

            {completedTopics.length === 0 ? (

              <div className="daily-challenge-box">

                <div className="challenge-details">

                  <h4>
                    🌱 Start your journey
                  </h4>

                  <p>
                    Complete your first topic to see
                    your achievements here.
                  </p>

                </div>

              </div>

            ) : (

              completedTopics
                .slice(-4)
                .reverse()
                .map((topic) => (

                  <div
                    className="continue-learning-item"
                    key={topic.id}
                  >

                    <span className="cl-icon">
                      {topic.icon || "✅"}
                    </span>

                    <div className="cl-progress-info">

                      <div className="cl-title-row">

                        <strong>
                          {topic.title}
                        </strong>

                        <span>
                          ✓ Completed
                        </span>

                      </div>

                    </div>

                  </div>

                ))

            )}

          </div>

        </section>

      </div>


      {/* =========================
          QUICK ACTIONS
      ========================= */}
      <section className="dashboard-panel-card">

        <div className="panel-header-row">

          <div className="panel-title-group">
            <h3>⚡ Quick actions</h3>
            <p>Jump straight into your preparation</p>
          </div>

        </div>

        <div className="dashboard-horizontal-grid">

          <Link
            to="/topics"
            className="continue-learning-item"
          >
            <span className="cl-icon">📚</span>

            <div className="cl-progress-info">
              <strong>Practice topics</strong>
              <span>Improve your concepts</span>
            </div>

            <span className="cl-arrow">→</span>
          </Link>


          <Link
            to="/mock-interview"
            className="continue-learning-item"
          >
            <span className="cl-icon">🎤</span>

            <div className="cl-progress-info">
              <strong>Mock interview</strong>
              <span>Test yourself</span>
            </div>

            <span className="cl-arrow">→</span>
          </Link>


          <Link
            to="/resume"
            className="continue-learning-item"
          >
            <span className="cl-icon">📄</span>

            <div className="cl-progress-info">
              <strong>Build resume</strong>
              <span>Showcase your skills</span>
            </div>

            <span className="cl-arrow">→</span>
          </Link>


          <Link
            to="/roadmap"
            className="continue-learning-item"
          >
            <span className="cl-icon">🗺️</span>

            <div className="cl-progress-info">
              <strong>View roadmap</strong>
              <span>Know what to learn next</span>
            </div>

            <span className="cl-arrow">→</span>
          </Link>

        </div>

      </section>

    </section>
  );
}