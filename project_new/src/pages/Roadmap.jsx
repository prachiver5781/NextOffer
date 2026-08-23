import { roadmap } from "../data";

export default function Roadmap({ roadmapProgress, setRoadmapProgress }) {
  const totalItems = roadmap.reduce(
    (total, week) => total + week.items.length,
    0
  );

  const completedItems = Object.values(roadmapProgress).filter(Boolean).length;
  const percentage = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  const toggleItem = (week, item) => {
    const key = `${week}-${item}`;
    setRoadmapProgress((old) => ({
      ...old,
      [key]: !old[key],
    }));
  };

  return (
    <section className="page">
      <p className="eyebrow">LEARNING PATH</p>

      <div className="page-heading">
        <div>
          <h2>Your Frontend Roadmap</h2>
          <p>Follow a structured path and track every skill you complete.</p>
        </div>

        <div className="roadmap-progress-card">
          <strong>{percentage}%</strong>
          <span>completed</span>
        </div>
      </div>

      <div className="large-progress roadmap-bar">
        <div style={{ width: `${percentage}%` }} />
      </div>

      <div className="timeline">
        {roadmap.map((item, index) => {
          const weekCompleted = item.items.filter(
            (skill) => roadmapProgress[`${item.week}-${skill}`]
          ).length;

          return (
            <article className="timeline-card" key={item.week}>
              <div className="timeline-number">{index + 1}</div>

              <div className="timeline-content">
                <div className="timeline-heading">
                  <div>
                    <span>{item.week}</span>
                    <h3>{item.title}</h3>
                  </div>
                  <strong>
                    {weekCompleted}/{item.items.length}
                  </strong>
                </div>

                <div className="roadmap-items">
                  {item.items.map((skill) => {
                    const key = `${item.week}-${skill}`;
                    const isChecked = !!roadmapProgress[key];

                    return (
                      <button
                        key={skill}
                        className={
                          isChecked ? "roadmap-item checked" : "roadmap-item"
                        }
                        onClick={() => toggleItem(item.week, skill)}
                        type="button"
                      >
                        <span>{isChecked ? "✓" : "○"}</span>
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
