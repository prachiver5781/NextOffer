// Projects & Professional ATS Resume Builder Component - NextOffer
// Designed for B.Tech CSE Project Evaluation II
// Demonstrates:
// 1. Structured resume management (Personal Info, Summary, Education, Skills, Projects, Experience, Certifications, Achievements)
// 2. Full Add, Edit, Save, and Delete workflows with field validation
// 3. Live ATS-friendly single-column resume preview
// 4. Print-to-PDF via browser print media queries and JSON data backup export
// 5. Preserves user state and synchronization with global context and localStorage

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProfessionalLinksBar from "./components/ProfessionalLinksBar";

export default function Resume({ currentUser, updateUser }) {
  const location = useLocation();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined" && window.location.pathname.includes("/projects")) {
      return "projects";
    }
    return "preview";
  });

  useEffect(() => {
    if (location.pathname.includes("/projects")) {
      setActiveTab("projects");
    }
  }, [location.pathname]);

  // Toast feedback message
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3200);
  };

  // Safe data extraction from currentUser
  const profile = currentUser?.profile || {};
  const projects = currentUser?.projects || [];
  const education = profile.education || [];
  const experience = profile.experience || [];
  const skills = profile.skills || ["JavaScript", "React", "Python", "DSA", "HTML5", "CSS3"];
  const certifications = profile.certifications || [];
  const achievements = profile.achievements || [];
  const links = profile.links || {};

  // ==========================================
  // SECTION 1: PERSONAL INFO & SUMMARY STATE
  // ==========================================
  const [personalName, setPersonalName] = useState(profile.name || currentUser?.name || "");
  const [personalHeadline, setPersonalHeadline] = useState(profile.title || "Full Stack Developer · Student");
  const [personalEmail, setPersonalEmail] = useState(profile.email || currentUser?.email || "");
  const [personalPhone, setPersonalPhone] = useState(profile.phone || "");
  const [personalLocation, setPersonalLocation] = useState(profile.location || "");
  const [personalSummary, setPersonalSummary] = useState(profile.about || "");
  const [linkGithub, setLinkGithub] = useState(links.github || "");
  const [linkLinkedin, setLinkLinkedin] = useState(links.linkedin || "");
  const [linkLeetcode, setLinkLeetcode] = useState(links.leetcode || "");
  const [linkHackerrank, setLinkHackerrank] = useState(links.hackerrank || "");
  const [linkPortfolio, setLinkPortfolio] = useState(links.portfolio || "");

  const handleSavePersonalInfo = (e) => {
    e.preventDefault();
    const updatedProfile = {
      ...profile,
      name: personalName.trim(),
      title: personalHeadline.trim(),
      email: personalEmail.trim(),
      phone: personalPhone.trim(),
      location: personalLocation.trim(),
      about: personalSummary.trim(),
      links: {
        ...links,
        github: linkGithub.trim(),
        linkedin: linkLinkedin.trim(),
        leetcode: linkLeetcode.trim(),
        hackerrank: linkHackerrank.trim(),
        portfolio: linkPortfolio.trim()
      }
    };

    updateUser({
      ...currentUser,
      name: personalName.trim(),
      email: personalEmail.trim(),
      profile: updatedProfile
    });

    showToast("✓ Personal details and summary saved!");
  };

  // ==========================================
  // SECTION 2: PROJECTS STATE & HANDLERS
  // ==========================================
  const [projName, setProjName] = useState("");
  const [projTech, setProjTech] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projGithub, setProjGithub] = useState("");
  const [projLive, setProjLive] = useState("");
  const [editingProjectId, setEditingProjectId] = useState(null);

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!projName.trim() || !projDesc.trim()) return;

    if (editingProjectId) {
      // UPDATE PROJECT
      const updatedProjects = projects.map((p) =>
        p.id === editingProjectId
          ? {
              ...p,
              name: projName.trim(),
              technologies: projTech.trim() || "Web Technologies",
              description: projDesc.trim(),
              githubUrl: projGithub.trim(),
              liveUrl: projLive.trim()
            }
          : p
      );
      updateUser({
        ...currentUser,
        projects: updatedProjects,
        profile: {
          ...profile,
          stats: {
            ...profile.stats,
            projects: updatedProjects.length
          }
        }
      });
      showToast(`✓ Project "${projName.trim()}" updated!`);
      setEditingProjectId(null);
    } else {
      // ADD PROJECT
      const newProject = {
        id: Date.now(),
        name: projName.trim(),
        technologies: projTech.trim() || "Web Technologies",
        description: projDesc.trim(),
        githubUrl: projGithub.trim(),
        liveUrl: projLive.trim()
      };
      const updatedProjects = [newProject, ...projects];
      updateUser({
        ...currentUser,
        projects: updatedProjects,
        profile: {
          ...profile,
          stats: {
            ...profile.stats,
            projects: updatedProjects.length
          }
        }
      });
      showToast(`✓ Project "${newProject.name}" added to resume!`);
    }

    setProjName("");
    setProjTech("");
    setProjDesc("");
    setProjGithub("");
    setProjLive("");
  };

  const handleStartEditProject = (p) => {
    setEditingProjectId(p.id);
    setProjName(p.name);
    setProjTech(p.technologies || "");
    setProjDesc(p.description || "");
    setProjGithub(p.githubUrl || "");
    setProjLive(p.liveUrl || "");
  };

  const handleDeleteProject = (id) => {
    const updated = projects.filter((p) => p.id !== id);
    updateUser({
      ...currentUser,
      projects: updated,
      profile: {
        ...profile,
        stats: {
          ...profile.stats,
          projects: updated.length
        }
      }
    });
    if (editingProjectId === id) {
      setEditingProjectId(null);
      setProjName("");
      setProjTech("");
      setProjDesc("");
    }
    showToast("Project removed from resume.");
  };

  // ==========================================
  // SECTION 3: EDUCATION STATE & HANDLERS
  // ==========================================
  const [eduDegree, setEduDegree] = useState("");
  const [eduInst, setEduInst] = useState("");
  const [eduYear, setEduYear] = useState("");
  const [eduScore, setEduScore] = useState("");
  const [editingEduId, setEditingEduId] = useState(null);

  const handleSaveEducation = (e) => {
    e.preventDefault();
    if (!eduDegree.trim() || !eduInst.trim()) return;

    if (editingEduId) {
      const updated = education.map((item) =>
        item.id === editingEduId
          ? {
              ...item,
              degree: eduDegree.trim(),
              institution: eduInst.trim(),
              year: eduYear.trim() || "2024 - 2028",
              score: eduScore.trim() || "First Class"
            }
          : item
      );
      updateUser({
        ...currentUser,
        profile: { ...profile, education: updated }
      });
      showToast("✓ Education entry updated!");
      setEditingEduId(null);
    } else {
      const newEdu = {
        id: `edu_${Date.now()}`,
        degree: eduDegree.trim(),
        institution: eduInst.trim(),
        year: eduYear.trim() || "2024 - 2028",
        score: eduScore.trim() || "First Class"
      };
      updateUser({
        ...currentUser,
        profile: { ...profile, education: [...education, newEdu] }
      });
      showToast("✓ Education entry added!");
    }

    setEduDegree("");
    setEduInst("");
    setEduYear("");
    setEduScore("");
  };

  const handleStartEditEducation = (item) => {
    setEditingEduId(item.id);
    setEduDegree(item.degree);
    setEduInst(item.institution);
    setEduYear(item.year || "");
    setEduScore(item.score || "");
  };

  const handleDeleteEducation = (id) => {
    const updated = education.filter((e) => e.id !== id);
    updateUser({
      ...currentUser,
      profile: { ...profile, education: updated }
    });
    if (editingEduId === id) setEditingEduId(null);
    showToast("Education entry removed.");
  };

  // ==========================================
  // SECTION 4: TECHNICAL SKILLS HANDLERS
  // ==========================================
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = (e) => {
    e.preventDefault();
    const clean = newSkill.trim();
    if (!clean || skills.includes(clean)) return;

    const updated = [...skills, clean];
    updateUser({
      ...currentUser,
      profile: { ...profile, skills: updated }
    });
    setNewSkill("");
    showToast(`✓ Added "${clean}" to skills!`);
  };

  const handleDeleteSkill = (skillToDelete) => {
    const updated = skills.filter((s) => s !== skillToDelete);
    updateUser({
      ...currentUser,
      profile: { ...profile, skills: updated }
    });
  };

  // ==========================================
  // SECTION 5: EXPERIENCE STATE & HANDLERS
  // ==========================================
  const [expRole, setExpRole] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expDuration, setExpDuration] = useState("");
  const [expLocation, setExpLocation] = useState("");
  const [expDesc, setExpDesc] = useState("");
  const [editingExpId, setEditingExpId] = useState(null);

  const handleSaveExperience = (e) => {
    e.preventDefault();
    if (!expRole.trim() || !expCompany.trim()) return;

    if (editingExpId) {
      const updated = experience.map((item) =>
        item.id === editingExpId
          ? {
              ...item,
              role: expRole.trim(),
              company: expCompany.trim(),
              duration: expDuration.trim() || "Present",
              location: expLocation.trim() || "Remote",
              description: expDesc.trim() || "Contributed to software development."
            }
          : item
      );
      updateUser({
        ...currentUser,
        profile: { ...profile, experience: updated }
      });
      showToast("✓ Experience entry updated!");
      setEditingExpId(null);
    } else {
      const newExp = {
        id: `exp_${Date.now()}`,
        role: expRole.trim(),
        company: expCompany.trim(),
        duration: expDuration.trim() || "Present",
        location: expLocation.trim() || "Remote",
        description: expDesc.trim() || "Contributed to software development."
      };
      updateUser({
        ...currentUser,
        profile: { ...profile, experience: [...experience, newExp] }
      });
      showToast("✓ Experience entry added!");
    }

    setExpRole("");
    setExpCompany("");
    setExpDuration("");
    setExpLocation("");
    setExpDesc("");
  };

  const handleStartEditExperience = (item) => {
    setEditingExpId(item.id);
    setExpRole(item.role);
    setExpCompany(item.company);
    setExpDuration(item.duration || "");
    setExpLocation(item.location || "");
    setExpDesc(item.description || "");
  };

  const handleDeleteExperience = (id) => {
    const updated = experience.filter((e) => e.id !== id);
    updateUser({
      ...currentUser,
      profile: { ...profile, experience: updated }
    });
    if (editingExpId === id) setEditingExpId(null);
    showToast("Experience entry removed.");
  };

  // ==========================================
  // SECTION 6: CERTIFICATIONS STATE & HANDLERS
  // ==========================================
  const [certName, setCertName] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certYear, setCertYear] = useState("");
  const [certLink, setCertLink] = useState("");
  const [editingCertId, setEditingCertId] = useState(null);

  const handleSaveCertification = (e) => {
    e.preventDefault();
    if (!certName.trim() || !certIssuer.trim()) return;

    if (editingCertId) {
      const updated = certifications.map((c) =>
        c.id === editingCertId
          ? {
              ...c,
              name: certName.trim(),
              issuer: certIssuer.trim(),
              year: certYear.trim() || "2026",
              link: certLink.trim()
            }
          : c
      );
      updateUser({
        ...currentUser,
        profile: { ...profile, certifications: updated }
      });
      showToast("✓ Certification entry updated!");
      setEditingCertId(null);
    } else {
      const newCert = {
        id: `cert_${Date.now()}`,
        name: certName.trim(),
        issuer: certIssuer.trim(),
        year: certYear.trim() || "2026",
        link: certLink.trim()
      };
      updateUser({
        ...currentUser,
        profile: { ...profile, certifications: [...certifications, newCert] }
      });
      showToast("✓ Certification added to resume!");
    }

    setCertName("");
    setCertIssuer("");
    setCertYear("");
    setCertLink("");
  };

  const handleStartEditCert = (c) => {
    setEditingCertId(c.id);
    setCertName(c.name);
    setCertIssuer(c.issuer);
    setCertYear(c.year || "");
    setCertLink(c.link || "");
  };

  const handleDeleteCert = (id) => {
    const updated = certifications.filter((c) => c.id !== id);
    updateUser({
      ...currentUser,
      profile: { ...profile, certifications: updated }
    });
    if (editingCertId === id) setEditingCertId(null);
    showToast("Certification removed.");
  };

  // ==========================================
  // SECTION 7: ACHIEVEMENTS STATE & HANDLERS
  // ==========================================
  const [achTitle, setAchTitle] = useState("");
  const [achOrg, setAchOrg] = useState("");
  const [achYear, setAchYear] = useState("");
  const [achDesc, setAchDesc] = useState("");
  const [editingAchId, setEditingAchId] = useState(null);

  const handleSaveAchievement = (e) => {
    e.preventDefault();
    if (!achTitle.trim()) return;

    if (editingAchId) {
      const updated = achievements.map((a) =>
        a.id === editingAchId
          ? {
              ...a,
              title: achTitle.trim(),
              organization: achOrg.trim(),
              year: achYear.trim() || "2026",
              description: achDesc.trim()
            }
          : a
      );
      updateUser({
        ...currentUser,
        profile: { ...profile, achievements: updated }
      });
      showToast("✓ Achievement updated!");
      setEditingAchId(null);
    } else {
      const newAch = {
        id: `ach_${Date.now()}`,
        title: achTitle.trim(),
        organization: achOrg.trim(),
        year: achYear.trim() || "2026",
        description: achDesc.trim()
      };
      updateUser({
        ...currentUser,
        profile: { ...profile, achievements: [...achievements, newAch] }
      });
      showToast("✓ Achievement added to resume!");
    }

    setAchTitle("");
    setAchOrg("");
    setAchYear("");
    setAchDesc("");
  };

  const handleStartEditAch = (a) => {
    setEditingAchId(a.id);
    setAchTitle(a.title);
    setAchOrg(a.organization || "");
    setAchYear(a.year || "");
    setAchDesc(a.description || "");
  };

  const handleDeleteAch = (id) => {
    const updated = achievements.filter((a) => a.id !== id);
    updateUser({
      ...currentUser,
      profile: { ...profile, achievements: updated }
    });
    if (editingAchId === id) setEditingAchId(null);
    showToast("Achievement removed.");
  };

  // ==========================================
  // EXPORT HANDLERS: PDF & JSON
  // ==========================================
  const handlePrintPdf = () => {
    setActiveTab("preview");
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleExportJson = () => {
    const resumeData = {
      personal: {
        name: profile.name || currentUser?.name,
        headline: profile.title,
        email: profile.email || currentUser?.email,
        phone: profile.phone,
        location: profile.location,
        summary: profile.about
      },
      links: profile.links,
      education: profile.education,
      skills: profile.skills,
      projects: currentUser?.projects,
      experience: profile.experience,
      certifications: profile.certifications,
      achievements: profile.achievements,
      exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${(profile.name || "Student").replace(/\s+/g, "_")}_Resume.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("✓ Resume JSON exported successfully!");
  };

  return (
    <section>
      {/* Header with Title and Action Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px"
        }}
      >
        <div>
          <div className="badge-tag-purple">📁 RESUME BUILDER & PORTFOLIO</div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-main)", marginBottom: "6px" }}>
            ATS Placement Resume & Projects
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            Build, edit, and export an industry-ready single-column ATS resume tailored for campus placements and technical interviews.
          </p>
        </div>

        {/* Action Buttons: Download PDF and Export JSON */}
        <div className="resume-actions-toolbar" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            type="button"
            className="btn-primary-gradient"
            onClick={handlePrintPdf}
            title="Export standard 1-page PDF using browser print"
          >
            <span>🖨️ Download PDF / Print</span>
          </button>
          <button
            type="button"
            className="btn-secondary-dark"
            onClick={handleExportJson}
            title="Download complete resume JSON backup"
          >
            <span>💾 Export JSON</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <nav className="resume-tabs-nav">
        <button
          type="button"
          className={`resume-tab-btn ${activeTab === "preview" ? "active" : ""}`}
          onClick={() => setActiveTab("preview")}
        >
          <span>👁️ Live ATS Resume Preview</span>
        </button>
        <button
          type="button"
          className={`resume-tab-btn ${activeTab === "personal" ? "active" : ""}`}
          onClick={() => setActiveTab("personal")}
        >
          <span>👤 Personal Info & Summary</span>
        </button>
        <button
          type="button"
          className={`resume-tab-btn ${activeTab === "education" ? "active" : ""}`}
          onClick={() => setActiveTab("education")}
        >
          <span>🎓 Education ({education.length})</span>
        </button>
        <button
          type="button"
          className={`resume-tab-btn ${activeTab === "skills" ? "active" : ""}`}
          onClick={() => setActiveTab("skills")}
        >
          <span>⚡ Skills ({skills.length})</span>
        </button>
        <button
          type="button"
          className={`resume-tab-btn ${activeTab === "projects" ? "active" : ""}`}
          onClick={() => setActiveTab("projects")}
        >
          <span>💻 Projects ({projects.length})</span>
        </button>
        <button
          type="button"
          className={`resume-tab-btn ${activeTab === "experience" ? "active" : ""}`}
          onClick={() => setActiveTab("experience")}
        >
          <span>💼 Experience ({experience.length})</span>
        </button>
        <button
          type="button"
          className={`resume-tab-btn ${activeTab === "certifications" ? "active" : ""}`}
          onClick={() => setActiveTab("certifications")}
        >
          <span>📜 Certifications ({certifications.length})</span>
        </button>
        <button
          type="button"
          className={`resume-tab-btn ${activeTab === "achievements" ? "active" : ""}`}
          onClick={() => setActiveTab("achievements")}
        >
          <span>🏆 Achievements ({achievements.length})</span>
        </button>
      </nav>

      {/* =========================================================
         TAB 1: LIVE ATS RESUME PREVIEW
         ========================================================= */}
      {activeTab === "preview" && (
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              padding: "12px 18px",
              background: "var(--bg-surface)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-main)",
              flexWrap: "wrap",
              gap: "10px"
            }}
          >
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              📄 <strong>ATS Single-Column Format:</strong> High parseability for placement ATS scanners. Click <strong>"Download PDF / Print"</strong> above to save.
            </span>
            <button
              type="button"
              className="btn-secondary-dark"
              style={{ fontSize: "12px", padding: "6px 14px" }}
              onClick={() => setActiveTab("personal")}
            >
              ✏️ Edit Resume Content
            </button>
          </div>

          {/* ATS Resume Paper Document */}
          <div className="ats-resume-paper">
            {/* Header */}
            <header className="ats-resume-header">
              <h1 className="ats-resume-name">
                {profile.name || currentUser?.name || "Student Developer"}
              </h1>
              <div className="ats-resume-headline">
                {profile.title || "Full Stack Developer · Student"}
              </div>

              {/* Contact Information & Clickable Links */}
              <div className="ats-resume-contacts">
                {(profile.email || currentUser?.email) && <span>📧 {profile.email || currentUser?.email}</span>}
                {profile.phone && <span>📱 {profile.phone}</span>}
                {profile.location && <span>📍 {profile.location}</span>}

                {/* Clickable Icons Row */}
                <span style={{ display: "inline-flex", gap: "8px", marginLeft: "4px", flexWrap: "wrap" }}>
                  {links.github && (
                    <a href={links.github} target="_blank" rel="noopener noreferrer">
                      🐙 GitHub
                    </a>
                  )}
                  {links.linkedin && (
                    <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
                      💼 LinkedIn
                    </a>
                  )}
                  {links.leetcode && (
                    <a href={links.leetcode} target="_blank" rel="noopener noreferrer">
                      ⚡ LeetCode
                    </a>
                  )}
                  {links.hackerrank && (
                    <a href={links.hackerrank} target="_blank" rel="noopener noreferrer">
                      🟩 HackerRank
                    </a>
                  )}
                  {links.portfolio && (
                    <a href={links.portfolio} target="_blank" rel="noopener noreferrer">
                      🌐 Portfolio
                    </a>
                  )}
                </span>
              </div>
            </header>

            {/* Professional Summary */}
            {profile.about && (
              <div>
                <h2 className="ats-section-title">Professional Summary</h2>
                <p className="ats-bullet-text">{profile.about}</p>
              </div>
            )}

            {/* Technical Skills Section */}
            <div>
              <h2 className="ats-section-title">Technical Skills</h2>
              <div className="ats-skills-list">
                <strong>Core Competencies: </strong>
                {skills.join(" • ")}
              </div>
            </div>

            {/* Projects Section */}
            <div>
              <h2 className="ats-section-title">Key Projects & Systems</h2>
              {projects.length === 0 ? (
                <p className="ats-bullet-text" style={{ fontStyle: "italic", color: "#64748b" }}>
                  No projects added yet. Open the Projects tab to add your development work.
                </p>
              ) : (
                projects.map((proj) => (
                  <div key={proj.id} style={{ marginBottom: "12px" }}>
                    <div className="ats-entry-row">
                      <span className="ats-entry-title">{proj.name}</span>
                      <span style={{ fontSize: "12px", color: "#475569" }}>
                        {proj.technologies}
                      </span>
                    </div>
                    <p className="ats-bullet-text">{proj.description}</p>
                    {(proj.githubUrl || proj.liveUrl) && (
                      <div style={{ fontSize: "11.5px", display: "flex", gap: "12px", marginTop: "-4px", marginBottom: "8px" }}>
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb" }}>
                            🔗 Source Code ↗
                          </a>
                        )}
                        {proj.liveUrl && (
                          <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb" }}>
                            🌐 Live Application ↗
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Work Experience Section */}
            <div>
              <h2 className="ats-section-title">Work Experience & Internships</h2>
              {experience.length === 0 ? (
                <p className="ats-bullet-text" style={{ fontStyle: "italic", color: "#64748b" }}>
                  Available for software developer internships and full-time placement roles.
                </p>
              ) : (
                experience.map((exp) => (
                  <div key={exp.id} style={{ marginBottom: "12px" }}>
                    <div className="ats-entry-row">
                      <span className="ats-entry-title">
                        {exp.role} — {exp.company}
                      </span>
                      <span className="ats-entry-date">{exp.duration}</span>
                    </div>
                    {exp.location && (
                      <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "3px" }}>
                        📍 {exp.location}
                      </div>
                    )}
                    <p className="ats-bullet-text">{exp.description}</p>
                  </div>
                ))
              )}
            </div>

            {/* Education Section */}
            <div>
              <h2 className="ats-section-title">Education</h2>
              {education.length === 0 ? (
                <p className="ats-bullet-text" style={{ fontStyle: "italic", color: "#64748b" }}>
                  No education entries recorded. Add your degree from the Education tab.
                </p>
              ) : (
                education.map((edu) => (
                  <div key={edu.id} style={{ marginBottom: "8px" }}>
                    <div className="ats-entry-row">
                      <span className="ats-entry-title">{edu.degree}</span>
                      <span className="ats-entry-date">{edu.year}</span>
                    </div>
                    <div className="ats-entry-row">
                      <span className="ats-entry-sub">{edu.institution}</span>
                      <span style={{ fontSize: "12px", color: "#2563eb", fontWeight: 600 }}>
                        {edu.score}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Certifications Section */}
            {certifications.length > 0 && (
              <div>
                <h2 className="ats-section-title">Certifications & Licenses</h2>
                {certifications.map((cert) => (
                  <div key={cert.id} style={{ marginBottom: "8px" }}>
                    <div className="ats-entry-row">
                      <span className="ats-entry-title">{cert.name}</span>
                      <span className="ats-entry-date">{cert.year}</span>
                    </div>
                    <div className="ats-entry-row">
                      <span className="ats-entry-sub">{cert.issuer}</span>
                      {cert.link && (
                        <a href={cert.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11.5px", color: "#2563eb" }}>
                          Verify Credential ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Achievements Section */}
            {achievements.length > 0 && (
              <div>
                <h2 className="ats-section-title">Honors & Achievements</h2>
                {achievements.map((ach) => (
                  <div key={ach.id} style={{ marginBottom: "8px" }}>
                    <div className="ats-entry-row">
                      <span className="ats-entry-title">{ach.title}</span>
                      <span className="ats-entry-date">{ach.year}</span>
                    </div>
                    {ach.organization && (
                      <span className="ats-entry-sub" style={{ display: "block" }}>
                        {ach.organization}
                      </span>
                    )}
                    {ach.description && <p className="ats-bullet-text">{ach.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
         TAB 2: PERSONAL INFORMATION & PROFESSIONAL SUMMARY
         ========================================================= */}
      {activeTab === "personal" && (
        <div className="resume-editor-section">
          <div className="dashboard-panel-card">
            <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "4px" }}>
              👤 Personal Information & Professional Summary
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "18px" }}>
              These details appear at the top of your ATS resume and online profile.
            </p>

            <form onSubmit={handleSavePersonalInfo} className="custom-form">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-field-group">
                  <label>Full Name *</label>
                  <input
                    required
                    className="custom-input"
                    value={personalName}
                    onChange={(e) => setPersonalName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
                <div className="form-field-group">
                  <label>Professional Headline *</label>
                  <input
                    required
                    className="custom-input"
                    value={personalHeadline}
                    onChange={(e) => setPersonalHeadline(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science | Full Stack Developer"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <div className="form-field-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    className="custom-input"
                    value={personalEmail}
                    onChange={(e) => setPersonalEmail(e.target.value)}
                    placeholder="e.g. rahul@example.com"
                  />
                </div>
                <div className="form-field-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    className="custom-input"
                    value={personalPhone}
                    onChange={(e) => setPersonalPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="form-field-group">
                  <label>Location</label>
                  <input
                    className="custom-input"
                    value={personalLocation}
                    onChange={(e) => setPersonalLocation(e.target.value)}
                    placeholder="e.g. Delhi NCR, India"
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label>Professional Summary & Bio</label>
                <textarea
                  className="custom-textarea"
                  rows={4}
                  value={personalSummary}
                  onChange={(e) => setPersonalSummary(e.target.value)}
                  placeholder="Passionate Computer Science student with strong foundations in Data Structures, Algorithms, React, and Full Stack Development. Eager to contribute to high-impact software engineering teams..."
                />
              </div>

              <h4 style={{ fontSize: "14px", fontWeight: 700, marginTop: "12px", color: "var(--text-main)" }}>
                🔗 Professional Profiles & Portfolios
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div className="form-field-group">
                  <label>GitHub Profile URL</label>
                  <input
                    type="url"
                    className="custom-input"
                    value={linkGithub}
                    onChange={(e) => setLinkGithub(e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="form-field-group">
                  <label>LinkedIn Profile URL</label>
                  <input
                    type="url"
                    className="custom-input"
                    value={linkLinkedin}
                    onChange={(e) => setLinkLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="form-field-group">
                  <label>LeetCode Profile URL</label>
                  <input
                    type="url"
                    className="custom-input"
                    value={linkLeetcode}
                    onChange={(e) => setLinkLeetcode(e.target.value)}
                    placeholder="https://leetcode.com/u/username"
                  />
                </div>
                <div className="form-field-group">
                  <label>Portfolio / Personal Website</label>
                  <input
                    type="url"
                    className="custom-input"
                    value={linkPortfolio}
                    onChange={(e) => setLinkPortfolio(e.target.value)}
                    placeholder="https://yourportfolio.dev"
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "14px" }}>
                <button type="submit" className="btn-primary-gradient">
                  ✓ Save Personal Information & Summary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
         TAB 3: EDUCATION
         ========================================================= */}
      {activeTab === "education" && (
        <div className="resume-editor-section">
          {/* Form */}
          <div className="dashboard-panel-card">
            <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "4px" }}>
              {editingEduId ? "✏️ Edit Education Entry" : "+ Add Education Entry"}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "16px" }}>
              List your degrees, college/university, duration, and CGPA or percentage.
            </p>

            <form onSubmit={handleSaveEducation} className="custom-form">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-field-group">
                  <label>Degree / Qualification *</label>
                  <input
                    required
                    className="custom-input"
                    value={eduDegree}
                    onChange={(e) => setEduDegree(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science & Engineering"
                  />
                </div>
                <div className="form-field-group">
                  <label>College / Institution *</label>
                  <input
                    required
                    className="custom-input"
                    value={eduInst}
                    onChange={(e) => setEduInst(e.target.value)}
                    placeholder="e.g. Delhi Technological University"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-field-group">
                  <label>Duration / Graduation Year</label>
                  <input
                    className="custom-input"
                    value={eduYear}
                    onChange={(e) => setEduYear(e.target.value)}
                    placeholder="e.g. 2022 - 2026"
                  />
                </div>
                <div className="form-field-group">
                  <label>Score / CGPA</label>
                  <input
                    className="custom-input"
                    value={eduScore}
                    onChange={(e) => setEduScore(e.target.value)}
                    placeholder="e.g. 8.8 CGPA or 85%"
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                {editingEduId && (
                  <button
                    type="button"
                    className="btn-secondary-dark"
                    onClick={() => {
                      setEditingEduId(null);
                      setEduDegree("");
                      setEduInst("");
                      setEduYear("");
                      setEduScore("");
                    }}
                  >
                    Cancel
                  </button>
                )}
                <button type="submit" className="btn-primary-gradient">
                  {editingEduId ? "✓ Update Education" : "+ Add Education Entry"}
                </button>
              </div>
            </form>
          </div>

          {/* List of saved education */}
          <div>
            <h4 style={{ fontSize: "15px", fontWeight: 700, margin: "16px 0 10px", color: "var(--text-main)" }}>
              Saved Education ({education.length})
            </h4>
            {education.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No education entries added yet.</p>
            ) : (
              education.map((item) => (
                <div key={item.id} className="resume-item-card">
                  <div className="resume-item-card-header">
                    <div>
                      <div className="resume-item-title">{item.degree}</div>
                      <div className="resume-item-subtitle">{item.institution}</div>
                      <div className="resume-item-meta">{item.year} · {item.score}</div>
                    </div>
                    <div className="resume-item-actions">
                      <button
                        type="button"
                        className="view-code-btn"
                        onClick={() => handleStartEditEducation(item)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        className="view-code-btn"
                        style={{ color: "#f87171" }}
                        onClick={() => handleDeleteEducation(item.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =========================================================
         TAB 4: TECHNICAL SKILLS
         ========================================================= */}
      {activeTab === "skills" && (
        <div className="resume-editor-section">
          <div className="dashboard-panel-card">
            <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "4px" }}>
              ⚡ Technical Skills & Technologies
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "16px" }}>
              Add programming languages, frameworks, developer tools, and databases relevant to placements.
            </p>

            <form onSubmit={handleAddSkill} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <input
                className="custom-input"
                style={{ maxWidth: "340px" }}
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g. TypeScript, Docker, PostgreSQL..."
              />
              <button type="submit" className="btn-primary-gradient">
                + Add Skill
              </button>
            </form>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {skills.map((skill) => (
                <span key={skill} className="resume-skill-chip">
                  <span>{skill}</span>
                  <button
                    type="button"
                    className="resume-skill-delete-btn"
                    onClick={() => handleDeleteSkill(skill)}
                    title={`Remove ${skill}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
         TAB 5: PROJECTS (PRESERVES EXISTING PROJECTS)
         ========================================================= */}
      {activeTab === "projects" && (
        <div className="resume-editor-section">
          {/* Form */}
          <div className="dashboard-panel-card">
            <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "4px" }}>
              {editingProjectId ? "✏️ Edit Shipped Project" : "+ Add Shipped Project"}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "16px" }}>
              Highlight full stack, DSA, AI/ML, or systems projects with live and code repository links.
            </p>

            <form onSubmit={handleSaveProject} className="custom-form">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-field-group">
                  <label>Project Title *</label>
                  <input
                    required
                    className="custom-input"
                    value={projName}
                    onChange={(e) => setProjName(e.target.value)}
                    placeholder="e.g. NextOffer Placement Platform"
                  />
                </div>
                <div className="form-field-group">
                  <label>Technologies Used *</label>
                  <input
                    required
                    className="custom-input"
                    value={projTech}
                    onChange={(e) => setProjTech(e.target.value)}
                    placeholder="e.g. React 18, Node.js, Express, MongoDB, Tailwind"
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label>Description & Impact *</label>
                <textarea
                  required
                  className="custom-textarea"
                  rows={3}
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder="Built an interactive placement portal with DSA challenge explorer, real-time code submission, ATS resume builder, and mock interview testing..."
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-field-group">
                  <label>GitHub Repository URL</label>
                  <input
                    type="url"
                    className="custom-input"
                    value={projGithub}
                    onChange={(e) => setProjGithub(e.target.value)}
                    placeholder="https://github.com/username/project"
                  />
                </div>
                <div className="form-field-group">
                  <label>Live Deployed URL</label>
                  <input
                    type="url"
                    className="custom-input"
                    value={projLive}
                    onChange={(e) => setProjLive(e.target.value)}
                    placeholder="https://my-app.vercel.app"
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                {editingProjectId && (
                  <button
                    type="button"
                    className="btn-secondary-dark"
                    onClick={() => {
                      setEditingProjectId(null);
                      setProjName("");
                      setProjTech("");
                      setProjDesc("");
                      setProjGithub("");
                      setProjLive("");
                    }}
                  >
                    Cancel
                  </button>
                )}
                <button type="submit" className="btn-primary-gradient">
                  {editingProjectId ? "✓ Update Project" : "+ Save Project to Resume"}
                </button>
              </div>
            </form>
          </div>

          {/* List of saved projects */}
          <div>
            <h4 style={{ fontSize: "15px", fontWeight: 700, margin: "16px 0 10px", color: "var(--text-main)" }}>
              Projects in Portfolio ({projects.length})
            </h4>
            {projects.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No projects added yet.</p>
            ) : (
              projects.map((proj) => (
                <div key={proj.id} className="resume-item-card">
                  <div className="resume-item-card-header">
                    <div>
                      <div className="resume-item-title">{proj.name}</div>
                      <div className="resume-item-subtitle">{proj.technologies}</div>
                      <div className="resume-item-desc">{proj.description}</div>
                      <div style={{ display: "flex", gap: "14px", marginTop: "8px", fontSize: "12px" }}>
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#818cf8" }}>
                            🔗 GitHub Repo ↗
                          </a>
                        )}
                        {proj.liveUrl && (
                          <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#34d399" }}>
                            🌐 Live Demo ↗
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="resume-item-actions">
                      <button
                        type="button"
                        className="view-code-btn"
                        onClick={() => handleStartEditProject(proj)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        className="view-code-btn"
                        style={{ color: "#f87171" }}
                        onClick={() => handleDeleteProject(proj.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =========================================================
         TAB 6: EXPERIENCE & INTERNSHIPS
         ========================================================= */}
      {activeTab === "experience" && (
        <div className="resume-editor-section">
          {/* Form */}
          <div className="dashboard-panel-card">
            <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "4px" }}>
              {editingExpId ? "✏️ Edit Experience Entry" : "+ Add Work Experience / Internship"}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "16px" }}>
              Include internships, campus tech leads, open source contributions, or industry roles.
            </p>

            <form onSubmit={handleSaveExperience} className="custom-form">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-field-group">
                  <label>Role / Job Title *</label>
                  <input
                    required
                    className="custom-input"
                    value={expRole}
                    onChange={(e) => setExpRole(e.target.value)}
                    placeholder="e.g. Frontend Developer Intern"
                  />
                </div>
                <div className="form-field-group">
                  <label>Company / Organization *</label>
                  <input
                    required
                    className="custom-input"
                    value={expCompany}
                    onChange={(e) => setExpCompany(e.target.value)}
                    placeholder="e.g. TechCorp Solutions"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-field-group">
                  <label>Duration</label>
                  <input
                    className="custom-input"
                    value={expDuration}
                    onChange={(e) => setExpDuration(e.target.value)}
                    placeholder="e.g. May 2025 - July 2025"
                  />
                </div>
                <div className="form-field-group">
                  <label>Location</label>
                  <input
                    className="custom-input"
                    value={expLocation}
                    onChange={(e) => setExpLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, India (Remote)"
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label>Key Contributions & Responsibilities</label>
                <textarea
                  className="custom-textarea"
                  rows={3}
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="Developed responsive user interfaces with React, implemented RESTful API integration, improved page load speed by 25%..."
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                {editingExpId && (
                  <button
                    type="button"
                    className="btn-secondary-dark"
                    onClick={() => {
                      setEditingExpId(null);
                      setExpRole("");
                      setExpCompany("");
                      setExpDuration("");
                      setExpLocation("");
                      setExpDesc("");
                    }}
                  >
                    Cancel
                  </button>
                )}
                <button type="submit" className="btn-primary-gradient">
                  {editingExpId ? "✓ Update Experience" : "+ Add Experience Entry"}
                </button>
              </div>
            </form>
          </div>

          {/* List of saved experience */}
          <div>
            <h4 style={{ fontSize: "15px", fontWeight: 700, margin: "16px 0 10px", color: "var(--text-main)" }}>
              Saved Experience ({experience.length})
            </h4>
            {experience.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No experience entries added yet.</p>
            ) : (
              experience.map((item) => (
                <div key={item.id} className="resume-item-card">
                  <div className="resume-item-card-header">
                    <div>
                      <div className="resume-item-title">{item.role}</div>
                      <div className="resume-item-subtitle">{item.company}</div>
                      <div className="resume-item-meta">{item.duration} · {item.location}</div>
                      <div className="resume-item-desc">{item.description}</div>
                    </div>
                    <div className="resume-item-actions">
                      <button
                        type="button"
                        className="view-code-btn"
                        onClick={() => handleStartEditExperience(item)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        className="view-code-btn"
                        style={{ color: "#f87171" }}
                        onClick={() => handleDeleteExperience(item.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =========================================================
         TAB 7: CERTIFICATIONS & LICENSES
         ========================================================= */}
      {activeTab === "certifications" && (
        <div className="resume-editor-section">
          {/* Form */}
          <div className="dashboard-panel-card">
            <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "4px" }}>
              {editingCertId ? "✏️ Edit Certification" : "+ Add Certification / Credential"}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "16px" }}>
              Add verified technical certificates from AWS, Google Cloud, HackerRank, Meta, or Coursera.
            </p>

            <form onSubmit={handleSaveCertification} className="custom-form">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-field-group">
                  <label>Certification Title *</label>
                  <input
                    required
                    className="custom-input"
                    value={certName}
                    onChange={(e) => setCertName(e.target.value)}
                    placeholder="e.g. AWS Certified Cloud Practitioner"
                  />
                </div>
                <div className="form-field-group">
                  <label>Issuing Organization *</label>
                  <input
                    required
                    className="custom-input"
                    value={certIssuer}
                    onChange={(e) => setCertIssuer(e.target.value)}
                    placeholder="e.g. Amazon Web Services (AWS)"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-field-group">
                  <label>Year / Issue Date</label>
                  <input
                    className="custom-input"
                    value={certYear}
                    onChange={(e) => setCertYear(e.target.value)}
                    placeholder="e.g. 2026"
                  />
                </div>
                <div className="form-field-group">
                  <label>Credential Verification URL</label>
                  <input
                    type="url"
                    className="custom-input"
                    value={certLink}
                    onChange={(e) => setCertLink(e.target.value)}
                    placeholder="https://www.credly.com/badges/..."
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                {editingCertId && (
                  <button
                    type="button"
                    className="btn-secondary-dark"
                    onClick={() => {
                      setEditingCertId(null);
                      setCertName("");
                      setCertIssuer("");
                      setCertYear("");
                      setCertLink("");
                    }}
                  >
                    Cancel
                  </button>
                )}
                <button type="submit" className="btn-primary-gradient">
                  {editingCertId ? "✓ Update Certification" : "+ Add Certification"}
                </button>
              </div>
            </form>
          </div>

          {/* List of saved certifications */}
          <div>
            <h4 style={{ fontSize: "15px", fontWeight: 700, margin: "16px 0 10px", color: "var(--text-main)" }}>
              Saved Certifications ({certifications.length})
            </h4>
            {certifications.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No certifications added yet.</p>
            ) : (
              certifications.map((item) => (
                <div key={item.id} className="resume-item-card">
                  <div className="resume-item-card-header">
                    <div>
                      <div className="resume-item-title">{item.name}</div>
                      <div className="resume-item-subtitle">{item.issuer}</div>
                      <div className="resume-item-meta">{item.year}</div>
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "#818cf8", marginTop: 4, display: "inline-block" }}>
                          Verify Credential ↗
                        </a>
                      )}
                    </div>
                    <div className="resume-item-actions">
                      <button
                        type="button"
                        className="view-code-btn"
                        onClick={() => handleStartEditCert(item)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        className="view-code-btn"
                        style={{ color: "#f87171" }}
                        onClick={() => handleDeleteCert(item.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =========================================================
         TAB 8: ACHIEVEMENTS & HONORS
         ========================================================= */}
      {activeTab === "achievements" && (
        <div className="resume-editor-section">
          {/* Form */}
          <div className="dashboard-panel-card">
            <h3 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "4px" }}>
              {editingAchId ? "✏️ Edit Achievement" : "+ Add Achievement / Award"}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "16px" }}>
              Showcase hackathon prizes, coding contest rankings, competitive awards, or academic honors.
            </p>

            <form onSubmit={handleSaveAchievement} className="custom-form">
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
                <div className="form-field-group">
                  <label>Achievement Title *</label>
                  <input
                    required
                    className="custom-input"
                    value={achTitle}
                    onChange={(e) => setAchTitle(e.target.value)}
                    placeholder="e.g. 1st Place - Smart India Hackathon 2025"
                  />
                </div>
                <div className="form-field-group">
                  <label>Year</label>
                  <input
                    className="custom-input"
                    value={achYear}
                    onChange={(e) => setAchYear(e.target.value)}
                    placeholder="e.g. 2025"
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label>Organization / Event Host</label>
                <input
                  className="custom-input"
                  value={achOrg}
                  onChange={(e) => setAchOrg(e.target.value)}
                  placeholder="e.g. Ministry of Education / TechFest"
                />
              </div>

              <div className="form-field-group">
                <label>Brief Description / Key Highlight</label>
                <textarea
                  className="custom-textarea"
                  rows={2}
                  value={achDesc}
                  onChange={(e) => setAchDesc(e.target.value)}
                  placeholder="Developed an automated resume verification tool, competing against 500+ engineering teams nationwide..."
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                {editingAchId && (
                  <button
                    type="button"
                    className="btn-secondary-dark"
                    onClick={() => {
                      setEditingAchId(null);
                      setAchTitle("");
                      setAchOrg("");
                      setAchYear("");
                      setAchDesc("");
                    }}
                  >
                    Cancel
                  </button>
                )}
                <button type="submit" className="btn-primary-gradient">
                  {editingAchId ? "✓ Update Achievement" : "+ Add Achievement"}
                </button>
              </div>
            </form>
          </div>

          {/* List of saved achievements */}
          <div>
            <h4 style={{ fontSize: "15px", fontWeight: 700, margin: "16px 0 10px", color: "var(--text-main)" }}>
              Saved Achievements ({achievements.length})
            </h4>
            {achievements.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No achievements added yet.</p>
            ) : (
              achievements.map((item) => (
                <div key={item.id} className="resume-item-card">
                  <div className="resume-item-card-header">
                    <div>
                      <div className="resume-item-title">{item.title}</div>
                      {item.organization && <div className="resume-item-subtitle">{item.organization}</div>}
                      <div className="resume-item-meta">{item.year}</div>
                      {item.description && <div className="resume-item-desc">{item.description}</div>}
                    </div>
                    <div className="resume-item-actions">
                      <button
                        type="button"
                        className="view-code-btn"
                        onClick={() => handleStartEditAch(item)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        type="button"
                        className="view-code-btn"
                        style={{ color: "#f87171" }}
                        onClick={() => handleDeleteAch(item.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && <div className="toast-popup">{toastMessage}</div>}
    </section>
  );
}
