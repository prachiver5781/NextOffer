
import { useState } from "react";
import "./styles/Roadmap.css";
import { Link } from "react-router-dom";

const careers = [
  {
    title: "Frontend Developer",
    icon: "🎨",
    description: "Build websites and interactive user interfaces.",
    skills: "HTML, CSS, JavaScript, React",
    roadmap: "/frontend",
    projects: "https://roadmap.sh/frontend/projects",
  },
  {
    title: "Backend Developer",
    icon: "⚙️",
    description: "Build APIs, server logic and database systems.",
    skills: "Node.js, APIs, SQL, databases",
    roadmap: "/backend",
    projects: "https://roadmap.sh/backend/projects",
  },
  {
    title: "Full-Stack Developer",
    icon: "💻",
    description: "Develop both the frontend and backend of applications.",
    skills: "React, Node.js, APIs, databases",
    roadmap: "/full-stack",
    projects: "https://roadmap.sh/full-stack/projects",
  },
  {
    title: "Software Engineer",
    icon: "🧩",
    description: "Design, develop, test and maintain software.",
    skills: "Programming, DSA, OOP, testing",
    roadmap: "/software-engineer",
    projects: "https://roadmap.sh/computer-science",
  },
  {
    title: "AI/ML Engineer",
    icon: "🤖",
    description: "Build applications using AI and machine learning.",
    skills: "Python, ML, data, AI tools",
    roadmap: "/ai-ml-engineer",
    projects: "https://roadmap.sh/ai-engineer/projects",
  },
  {
    title: "Data Analyst / Data Scientist",
    icon: "📊",
    description: "Analyze data and find useful patterns and insights.",
    skills: "SQL, Python, statistics, visualization",
    roadmap: "/data-analyst",
    projects: "https://roadmap.sh/data-analyst/projects",
  },
  {
    title: "Cybersecurity Engineer",
    icon: "🔐",
    description: "Help protect systems, applications and information.",
    skills: "Networking, Linux, security fundamentals",
    roadmap: "/cybersecurity-engineer",
    projects: "https://roadmap.sh/cyber-security/projects",
  },
];

export default function Roadmap() {
  const [search, setSearch] = useState("");

  const filteredCareers = careers.filter((career) =>
    `${career.title} ${career.description} ${career.skills}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="roadmap-page">
      <section className="roadmap-heading">
        <p className="roadmap-label">NEXTOFFER CAREER GUIDANCE</p>

        <h1>Choose Your Career Roadmap</h1>

        <p>
          Explore learning paths, required skills and project ideas
          to plan your career journey.
        </p>

        <input
          className="roadmap-search"
          type="search"
          placeholder="Search a career or skill..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search career roadmaps"
        />
      </section>

      <section className="career-grid">
        {filteredCareers.map((career) => (
          <article className="career-card" key={career.title}>
            <div className="career-icon">{career.icon}</div>

            <h2>{career.title}</h2>

            <p>{career.description}</p>

            <div className="career-skills">
              <strong>Skills to explore</strong>
              <p>{career.skills}</p>
            </div>

            <div className="career-actions">
              <Link
                to={`/careers/${encodeURIComponent(career.title)}`}
                className="roadmap-button"
              >
                Start Learning →
              </Link>

              <a
                href={career.projects}
                target="_blank"
                rel="noreferrer"
                className="project-link"
              >
                Explore Projects ↗
              </a>

              
<a
  href={career.roadmap.startsWith("/")
    ? `https://roadmap.sh${career.roadmap}`
    : career.roadmap}
  target="_blank"
  rel="noreferrer"
  className="roadmap-button"
>
  View Learning Path ↗
</a>

            </div>
          </article>
        ))}
      </section>

      {filteredCareers.length === 0 && (
        <p className="roadmap-empty">
          No matching careers found. Try another search.
        </p>
      )}

      <footer className="roadmap-footer">
        Project inspiration and additional resources are available at{" "}
        <a
          href="https://roadmap.sh/"
          target="_blank"
          rel="noreferrer"
        >
          roadmap.sh
        </a>.
      </footer>
    </main>
  );
}
