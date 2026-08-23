export default function Settings({
  darkMode,
  setDarkMode,
  setCompleted,
  setRoadmapProgress,
  showToast,
}) {
  const clearProgress = () => {
    if (
      window.confirm(
        "Are you sure you want to clear your learning progress?"
      )
    ) {
      setCompleted([]);
      setRoadmapProgress({});
      showToast("Learning progress cleared");
    }
  };

  const clearProjects = () => {
    if (
      window.confirm("Are you sure you want to delete all saved projects?")
    ) {
      localStorage.removeItem("nextoffer-projects");
      showToast("Projects cleared. Refresh the page.");
    }
  };

  return (
    <section className="page narrow">
      <p className="eyebrow">SETTINGS</p>
      <h2>Customize NextOffer.</h2>
      <p className="section-intro">
        Manage your preferences and saved data.
      </p>

      <div className="settings-list">
        <div className="settings-item">
          <div>
            <span className="settings-icon">{darkMode ? "🌙" : "☀️"}</span>
            <div>
              <strong>Appearance</strong>
              <p>Switch between light and dark mode.</p>
            </div>
          </div>

          <button
            className="toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            <span
              className={darkMode ? "toggle-dot active" : "toggle-dot"}
            />
          </button>
        </div>

        <div className="settings-item">
          <div>
            <span className="settings-icon">📚</span>
            <div>
              <strong>Learning progress</strong>
              <p>Clear completed topics and roadmap progress.</p>
            </div>
          </div>

          <button className="danger-outline" onClick={clearProgress}>
            Clear progress
          </button>
        </div>

        <div className="settings-item">
          <div>
            <span className="settings-icon">📄</span>
            <div>
              <strong>Resume projects</strong>
              <p>Remove all saved projects.</p>
            </div>
          </div>

          <button className="danger-outline" onClick={clearProjects}>
            Clear projects
          </button>
        </div>
      </div>
    </section>
  );
}
