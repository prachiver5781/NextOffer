import { Link, useParams, Navigate } from "react-router-dom";
import { topics } from "../data";

export default function TopicDetails({ completed, setCompleted, showToast }) {
  const { topicId } = useParams();

  const topic = topics.find((item) => item.id === topicId);

  if (!topic) {
    return <Navigate to="/404" replace />;
  }

  const isDone = completed.includes(topic.id);

  const handleMarkComplete = () => {
    if (!isDone) {
      setCompleted((old) => [...old, topic.id]);
      showToast("Topic completed! 🎉");
    }
  };

  return (
    <section className="page narrow">
      <Link className="back-link" to="/topics">
        ← Back to topics
      </Link>

      <div className="detail-card">
        <div className="detail-header">
          <div className="detail-icon">{topic.icon}</div>
          <div>
            <span className="topic-type">{topic.type}</span>
            <span className="level-badge">{topic.level}</span>
          </div>
        </div>

        <h2>{topic.title}</h2>
        <p className="detail-description">{topic.description}</p>

        <div className="detail-stats">
          <div>
            <strong>{topic.questions.length}</strong>
            <span>Questions</span>
          </div>
          <div>
            <strong>{topic.level}</strong>
            <span>Difficulty</span>
          </div>
          <div>
            <strong>{topic.type}</strong>
            <span>Category</span>
          </div>
        </div>

        <h3>Practice questions</h3>

        <div className="question-list">
          {topic.questions.map((question, index) => (
            <div className="practice-question" key={question}>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <span>{question}</span>
              <span>→</span>
            </div>
          ))}
        </div>

        <button
          className="primary-button"
          onClick={handleMarkComplete}
          disabled={isDone}
        >
          {isDone ? "✓ Topic completed" : "Mark topic as complete"}
        </button>
      </div>
    </section>
  );
}
