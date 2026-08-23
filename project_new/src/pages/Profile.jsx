import { useState } from "react";

export default function Profile({ profile, setProfile, showToast }) {
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [skills, setSkills] = useState(profile?.skills || "");

  const completion =
    [name, email, phone, skills].filter(Boolean).length * 25;

  const handleSubmit = (e) => {
    e.preventDefault();

    const updated = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      skills: skills.trim(),
    };

    setProfile(updated);
    showToast("Profile saved successfully! ✓");
  };

  const avatarLetter = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <section className="page narrow">
      <p className="eyebrow">YOUR PROFILE</p>
      <h2>Make your profile yours.</h2>
      <p className="section-intro">
        Your information is saved locally and can be used in your resume.
      </p>

      <div className="profile-layout">
        <section className="profile-card">
          <div className="large-profile-avatar">{avatarLetter}</div>
          <h3>{name || "Your Name"}</h3>
          <p>{email || "Add your email"}</p>

          <div className="profile-completion">
            <div className="completion-header">
              <span>Profile completion</span>
              <strong>{completion}%</strong>
            </div>
            <div className="small-progress">
              <div style={{ width: `${completion}%` }} />
            </div>
          </div>
        </section>

        <form className="profile-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </label>

          <label>
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </label>

          <label>
            Phone
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </label>

          <label>
            Skills
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Java, Python, React, JavaScript..."
            />
          </label>

          <button className="primary-button" type="submit">
            Save profile
          </button>
        </form>
      </div>
    </section>
  );
}
