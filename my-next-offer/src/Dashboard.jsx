import { Link } from "react-router-dom";
import { topics, roadmap } from "./data";


export default function Dashboard({ completed, profile, streak }) {
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
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR DASHBOARD</p>
          <h2>Welcome back{profile?.name ? `, ${profile.name}` : ""} 👋</h2>
          <p>Keep learning and move one step closer to your next offer.</p>
        </div>
        <Link className="primary-button" to="/topics">
          Practice now →
        </Link>
      </div>

      <div className="dashboard-stats">
        <div className="dashboard-stat purple">
          <div className="stat-icon">📚</div>
          <strong>{completed.length}</strong>
          <span>Topics completed</span>
        </div>

        <div className="dashboard-stat blue">
          <div className="stat-icon">🎯</div>
          <strong>{remaining}</strong>
          <span>Topics remaining</span>
        </div>

        <div className="dashboard-stat green">
          <div className="stat-icon">📈</div>
          <strong>{percentage}%</strong>
          <span>Overall progress</span>
        </div>

        <div className="dashboard-stat orange">
          <div className="stat-icon">🔥</div>
          <strong>{streak}</strong>
          <span>Day streak</span>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <section className="panel progress-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-label">YOUR PROGRESS</span>
              <h3>Keep pushing forward</h3>
            </div>
            <strong className="big-percentage">{percentage}%</strong>
          </div>

          <div className="large-progress">
            <div style={{ width: `${percentage}%` }} />
          </div>

          <div className="progress-footer">
            <span>{completed.length} of {topics.length} topics</span>
            <Link to="/topics">View topics →</Link>
          </div>
        </section>

        <section className="panel daily-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-label">DAILY GOAL</span>
              <h3>Stay consistent</h3>
            </div>
            <span className="goal-icon">🎯</span>
          </div>

          <div className="daily-goal">
            <strong>{Math.min(completed.length, 4)} / 4</strong>
            <span>tasks completed</span>
          </div>

          <Link to="/topics" className="secondary-button full">
            Continue learning
          </Link>
        </section>
      </div>

      <div className="content-grid">
        <section className="panel">
          <div className="section-heading">
            <div>
              <span className="panel-label">ROADMAP</span>
              <h3>Continue your journey</h3>
            </div>
            <Link to="/roadmap">View all →</Link>
          </div>

          {roadmap.slice(0, 4).map((item, index) => (
            <div className="roadmap-row" key={item.week}>
              <div className="roadmap-number">{index + 1}</div>
              <div className="roadmap-content">
                <strong>{item.title}</strong>
                <small>{item.items.slice(0, 3).join(" • ")}</small>
              </div>
              <span className="roadmap-arrow">→</span>
            </div>
          ))}
        </section>

        <section className="panel">
          <div className="section-heading">
            <div>
              <span className="panel-label">COMPLETED</span>
              <h3>Recent achievements</h3>
            </div>
          </div>

          {completedTopics.length === 0 ? (
            <div className="empty-small">
              <span>🌱</span>
              <p>Complete your first topic to see your achievements here.</p>
            </div>
          ) : (
            completedTopics.slice(-4).reverse().map((topic) => (
              <div className="achievement" key={topic.id}>
                <span className="achievement-icon">{topic.icon}</span>
                <div>
                  <strong>{topic.title}</strong>
                  <small>{topic.type}</small>
                </div>
                <span className="check">✓</span>
              </div>
            ))
          )}
        </section>
      </div>

      <section className="quick-actions">
        <h3>Quick actions</h3>
        <div>
          <Link to="/topics" className="quick-card">
            <span>📚</span>
            <strong>Practice topics</strong>
            <small>Improve your concepts</small>
          </Link>

          <Link to="/mock-interview" className="quick-card">
            <span>🎤</span>
            <strong>Mock interview</strong>
            <small>Test yourself</small>
          </Link>

          <Link to="/resume" className="quick-card">
            <span>📄</span>
            <strong>Build resume</strong>
            <small>Showcase your skills</small>
          </Link>

          <Link to="/roadmap" className="quick-card">
            <span>🗺️</span>
            <strong>View roadmap</strong>
            <small>Know what to learn next</small>
          </Link>
        </div>
      </section>
    </section>
  );
}
