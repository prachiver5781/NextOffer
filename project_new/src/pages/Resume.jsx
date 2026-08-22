import { useState } from "react";
import { useLocalStorage } from "../hooks";
import { resumeTips } from "../data";

export default function Resume({ profile, showToast }) {
  const [projects, setProjects] = useLocalStorage("nextoffer-projects", []);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTech, setProjectTech] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!projectName.trim() || !projectDescription.trim()) {
      return;
    }

    const newProject = {
      id: Date.now(),
      name: projectName.trim(),
      description: projectDescription.trim(),
      technologies: projectTech.trim(),
    };

    setProjects((old) => [...old, newProject]);
    setProjectName("");
    setProjectDescription("");
    setProjectTech("");

    showToast("Project added to your resume! 🎉");
  };

  const deleteProject = (id) => {
    setProjects((old) => old.filter((project) => project.id !== id));
    showToast("Project removed");
  };

  return (
    <section className="page">
      <p className="eyebrow">RESUME BUILDER</p>
      <h2>Build a resume you can explain.</h2>
      <p className="section-intro">
        Add your projects and preview your resume instantly.
      </p>

      <div className="resume-grid">
        <section className="panel">
          <h3>✨ Resume checklist</h3>
          {resumeTips.map((tip, index) => (
            <div className="tip" key={tip}>
              <strong>{index + 1}</strong>
              <span>{tip}</span>
            </div>
          ))}
        </section>

        <section className="panel">
          <h3>➕ Add a project</h3>
          <form className="project-form" onSubmit={handleSubmit}>
            <label>
              Project name
              <input
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. NextOffer"
              />
            </label>

            <label>
              Description
              <textarea
                required
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="What did you build and what problem did it solve?"
              />
            </label>

            <label>
              Technologies
              <input
                value={projectTech}
                onChange={(e) => setProjectTech(e.target.value)}
                placeholder="React, JavaScript, CSS"
              />
            </label>

            <button className="primary-button" type="submit">
              Save project
            </button>
          </form>
        </section>
      </div>

      <section className="resume-section">
        <div className="section-heading">
          <div>
            <span className="panel-label">YOUR PROJECTS</span>
            <h3>Saved projects</h3>
          </div>
          <span className="project-count">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="empty project-empty">
            <span>📁</span>
            <p>No projects added yet.</p>
          </div>
        ) : (
          <div className="saved-projects">
            {projects.map((project) => (
              <article className="saved-project" key={project.id}>
                <div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  {project.technologies && (
                    <div className="project-tech">
                      {project.technologies.split(",").map((tech) => (
                        <span key={tech}>{tech.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  className="delete-button"
                  onClick={() => deleteProject(project.id)}
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="resume-preview-section">
        <div className="section-heading">
          <div>
            <span className="panel-label">LIVE PREVIEW</span>
            <h3>Your resume</h3>
          </div>
          <button className="secondary-button" onClick={() => window.print()}>
            🖨 Print
          </button>
        </div>

        <div className="resume-paper">
          <div className="resume-header">
            <h1>{profile?.name || "Your Name"}</h1>
            <p>{profile?.email || "your.email@example.com"}</p>
            {profile?.phone && <p>{profile.phone}</p>}
          </div>

          {profile?.skills && (
            <div className="resume-block">
              <h2>Skills</h2>
              <p>{profile.skills}</p>
            </div>
          )}

          <div className="resume-block">
            <h2>Projects</h2>
            {projects.length === 0 ? (
              <p className="resume-muted">Add projects above.</p>
            ) : (
              projects.map((project) => (
                <div className="resume-project" key={project.id}>
                  <div className="resume-project-heading">
                    <strong>{project.name}</strong>
                    {project.technologies && (
                      <span>{project.technologies}</span>
                    )}
                  </div>
                  <p>{project.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </section>
  );
}
