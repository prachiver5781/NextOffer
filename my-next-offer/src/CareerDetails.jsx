import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { roadmapData } from "./data/roadmapData";
import "./styles/CareerDetails.css";

export default function CareerDetails() {
  const { title } = useParams();
  const careerName = title || "";

  const career = roadmapData.roleDescriptions[careerName];
  const specialization = roadmapData.specializations[careerName];

  const storageKey = `nextoffer-career-${encodeURIComponent(careerName)}`;

  const [completed, setCompleted] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(`${storageKey}-checklist`) || "[]"
      );
    } catch {
      return [];
    }
  });

  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(`${storageKey}-topics`) || "[]"
      );
    } catch {
      return [];
    }
  });

  const [showFoundations, setShowFoundations] = useState(true);

  useEffect(() => {
    localStorage.setItem(
      `${storageKey}-checklist`,
      JSON.stringify(completed)
    );
  }, [storageKey, completed]);

  useEffect(() => {
    localStorage.setItem(
      `${storageKey}-topics`,
      JSON.stringify(completedTopics)
    );
  }, [storageKey, completedTopics]);

  if (!career || !specialization) {
    return (
      <main className="career-details">
        <div className="career-not-found">
          <h1>Career not found</h1>
          <p>Please select a career from the roadmap page.</p>

          <Link className="career-primary-button" to="/roadmap">
            Back to Career Roadmaps ΓåÆ
          </Link>
        </div>
      </main>
    );
  }

  const checklist = roadmapData.placementChecklist;

  const progress = checklist.length
    ? Math.round((completed.length / checklist.length) * 100)
    : 0;

  const toggleTask = (id) => {
    setCompleted((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const allTopics = [
    ...roadmapData.foundations,
    ...specialization,
  ].flatMap((semesterItem) =>
    semesterItem.topics.map((topic) => ({
      id: `${semesterItem.semester}-${topic.name}`,
      name: topic.name,
    }))
  );

  const completedTopicCount = allTopics.filter((topic) =>
    completedTopics.includes(topic.id)
  ).length;

  const topicProgress = allTopics.length
    ? Math.round((completedTopicCount / allTopics.length) * 100)
    : 0;

  const toggleTopic = (id) => {
    setCompletedTopics((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const renderSemester = (item) => (
    <article className="semester-card" key={item.semester}>
      <div className="semester-card-header">
        <span className="semester-number">
          SEMESTER {item.semester}
        </span>

        <span className="semester-status">Learning path</span>
      </div>

      <h4 className="semester-title">{item.title}</h4>

      <p className="semester-goal">{item.goal}</p>

      <div className="semester-prerequisite">
        <span className="info-icon">Γåù</span>

        <div>
          <strong>Prerequisites</strong>
          <p>{item.prerequisites}</p>
        </div>
      </div>

      <div className="semester-content-section">
        <div className="subsection-heading">
          <span className="subsection-icon">01</span>

          <div>
            <h5>Topics to learn</h5>
            <p>Understand the concepts and practise as you go.</p>
          </div>
        </div>

        <div className="topic-list">
          {item.topics.map((topic, index) => {
            const topicId = `${item.semester}-${topic.name}`;
            const isCompleted = completedTopics.includes(topicId);

            return (
              <article
                className={`topic-item ${
                  isCompleted ? "topic-completed" : ""
                }`}
                key={topicId}
              >
                <div className="topic-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="topic-content">
                  <h5>{topic.name}</h5>

                  <p className="topic-explanation">{topic.why}</p>

                  <div className="practice-box">
                    <span className="practice-label">Γ£ª TRY IT</span>
                    <p>{topic.practice}</p>
                  </div>
                </div>

                <label
                  className="topic-completion"
                  title={
                    isCompleted
                      ? "Completed"
                      : "Mark as completed"
                  }
                >
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => toggleTopic(topicId)}
                    aria-label={`Mark ${topic.name} as completed`}
                  />
                </label>
              </article>
            );
          })}
        </div>
      </div>

      <div className="semester-project">
        <div className="project-icon">Γ£º</div>

        <div className="project-content">
          <span className="content-eyebrow">
            PUT IT INTO PRACTICE
          </span>

          <h5>Semester project</h5>
          <p>{item.project}</p>
        </div>
      </div>

      <div className="semester-content-section resources-section">
        <div className="subsection-heading">
          <span className="subsection-icon">02</span>

          <div>
            <h5>Learning resources</h5>
            <p>Explore these resources to learn in greater depth.</p>
          </div>
        </div>

        <div className="resource-list">
          {item.resources.map((resource) => (
            <a
              className="resource-link"
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              key={resource.url}
            >
              <span className="resource-icon">Γåù</span>
              <span>{resource.label}</span>
              <span className="resource-arrow">ΓåÆ</span>
            </a>
          ))}
        </div>
      </div>
    </article>
  );

  return (
    <main className="career-details">
      <Link className="back-link" to="/roadmap">
        ΓåÉ All Career Roadmaps
      </Link>

      {/* Career overview */}
      <header className="career-details-header">
        <div className="header-glow" />

        <p className="career-eyebrow">
          <span className="eyebrow-dot" />
          NEXTOFFER CAREER PLANNER
        </p>

        <div className="career-title">
          <span className="career-icon-large">{career.icon}</span>

          <div>
            <p className="career-title-label">YOUR CAREER PATH</p>
            <h1>{careerName}</h1>
          </div>
        </div>

        <p className="career-summary">{career.summary}</p>

        <div className="career-fit">
          <span className="fit-icon">Γ£ª</span>

          <div>
            <strong>Is this career for you?</strong>
            <p>{career.fit}</p>
          </div>
        </div>

        <p className="career-skills-heading">SKILLS YOU'LL BUILD</p>

        <div className="skill-chips">
          {career.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </header>

      {/* Topic completion progress */}
      <section className="roadmap-progress-card">
        <div>
          <p className="career-eyebrow">YOUR PROGRESS</p>
          <h2>Topic completion</h2>

          <p>
            {completedTopicCount} of {allTopics.length} topics marked
            complete
          </p>
        </div>

        <strong>{topicProgress}%</strong>

        <div className="roadmap-progress-track">
          <span style={{ width: `${topicProgress}%` }} />
        </div>
      </section>

      {/* Main roadmap */}
      <section className="learning-section">
        <div className="section-heading">
          <div>
            <p className="career-eyebrow">YOUR LEARNING JOURNEY</p>

            <h2>Your Personalized Learning Roadmap</h2>

            <p className="section-description">
              Follow a structured, semester-wise learning plan
              designed around your chosen career. Learn the
              fundamentals, practise your skills, build projects,
              and prepare for placementsΓÇöall in one place.
            </p>
          </div>

          <span className="journey-badge">
            Γ£º 8-semester journey
          </span>
        </div>

        {/* Common foundations */}
        <section className="roadmap-group">
          <div className="roadmap-group-heading">
            <div className="group-icon">01</div>

            <div className="group-heading-copy">
              <h3>Common Foundations</h3>
              <p>Semesters 1ΓÇô4 ┬╖ Build your core technical skills</p>
            </div>

            <button
              className="secondary-button"
              onClick={() =>
                setShowFoundations((value) => !value)
              }
              aria-expanded={showFoundations}
            >
              {showFoundations ? "Hide Γåæ" : "Show Γåô"}
            </button>
          </div>

          {showFoundations && (
            <div className="semester-list">
              {roadmapData.foundations.map(renderSemester)}
            </div>
          )}
        </section>

        {/* Career specialization */}
        <section className="roadmap-group specialization-section">
          <div className="roadmap-group-heading">
            <div className="group-icon">02</div>

            <div className="group-heading-copy">
              <h3>Career Specialization</h3>
              <p>Semesters 5ΓÇô8 ┬╖ Focus on {careerName}</p>
            </div>
          </div>

          <p className="group-introduction">
            Apply your fundamentals to role-specific tools,
            advanced concepts, and practical projects.
          </p>

          <div className="semester-list">
            {specialization.map(renderSemester)}
          </div>
        </section>
      </section>

      {/* Placement checklist */}
      <section className="placement-section">
        <div className="placement-header">
          <div className="placement-icon">Γ£ô</div>

          <div>
            <p className="career-eyebrow">YOUR NEXT BIG STEP</p>
            <h2>Placement Checklist</h2>

            <p>
              Track your preparation as you work towards
              internships and job opportunities.
            </p>
          </div>
        </div>

        <div className="checklist-progress">
          <div className="progress-label-row">
            <span>Your progress</span>
            <strong>{progress}%</strong>
          </div>

          <div
            className="progress-track"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Placement checklist progress"
          >
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="progress-caption">
            {completed.length} of {checklist.length} tasks completed
          </p>
        </div>

        <div className="placement-task-list">
          {checklist.map((task) => {
            const isCompleted = completed.includes(task.id);

            return (
              <label
                className={`placement-task ${
                  isCompleted ? "is-completed" : ""
                }`}
                key={task.id}
              >
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => toggleTask(task.id)}
                />

                <span className="custom-checkbox">
                  {isCompleted ? "Γ£ô" : ""}
                </span>

                <span className="placement-task-content">
                  <strong>{task.title}</strong>
                  <small>{task.detail}</small>
                </span>

                <span className="task-status">
                  {isCompleted ? "Completed" : "To do"}
                </span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="career-details-footer">
        <div className="footer-brand-area">
          <span className="footer-brand">NextOffer</span>

          <p>
            Your next opportunity starts with what you learn today.
          </p>
        </div>

        <div className="footer-links">
          <Link to="/roadmap">ΓåÉ Explore another career</Link>

          <a
            className="external-roadmap-link"
            href="https://roadmap.sh/"
            target="_blank"
            rel="noreferrer"
          >
            Explore more roadmaps
            <span aria-hidden="true"> Γåù</span>
          </a>
        </div>
      </footer>
    </main>
  );
}
