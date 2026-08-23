import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ setLoggedIn, setProfile, showToast }) {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const saved = localStorage.getItem("nextoffer-account");

    if (mode === "create") {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }

      if (!email.trim()) {
        setError("Please enter your email.");
        return;
      }

      if (password.length < 6) {
        setError("Password must contain at least 6 characters.");
        return;
      }

      if (saved) {
        setError("An account already exists. Please log in.");
        return;
      }

      const account = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      };

      localStorage.setItem("nextoffer-account", JSON.stringify(account));

      const profileData = {
        name: account.name,
        email: account.email,
        phone: "",
        skills: "",
      };

      localStorage.setItem("nextoffer-profile", JSON.stringify(profileData));
      setProfile(profileData);
      setLoggedIn(true);
      showToast("Account created successfully! 🎉");
      navigate("/dashboard");
      return;
    }

    // Login mode
    if (!saved) {
      setError("No account found. Create an account first.");
      return;
    }

    const account = JSON.parse(saved);

    if (
      email.trim().toLowerCase() !== account.email ||
      password !== account.password
    ) {
      setError("Incorrect email or password.");
      return;
    }

    const savedProfile = localStorage.getItem("nextoffer-profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    setLoggedIn(true);
    showToast("Welcome back! 👋");
    navigate("/dashboard");
  };

  return (
    <section className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <Link className="brand login-brand" to="/">
          Next<span>Offer</span>
        </Link>

        <div className="login-icon">{mode === "login" ? "👋" : "🚀"}</div>

        <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
        <p>
          {mode === "login"
            ? "Continue your interview preparation journey."
            : "Start preparing for your next opportunity."}
        </p>

        {mode === "create" && (
          <label>
            Your name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </label>
        )}

        <label>
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </label>

        <label>
          Password
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              mode === "create"
                ? "Minimum 6 characters"
                : "Enter your password"
            }
          />
        </label>

        {error && <p className="form-error">⚠ {error}</p>}

        <button className="primary-button full" type="submit">
          {mode === "login" ? "Log in →" : "Create account →"}
        </button>

        <div className="login-switch">
          {mode === "login" ? (
            <>
              Don't have an account?
              <button
                type="button"
                onClick={() => {
                  setMode("create");
                  setError("");
                }}
              >
                Create account
              </button>
            </>
          ) : (
            <>
              Already have an account?
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
              >
                Log in
              </button>
            </>
          )}
        </div>
      </form>
    </section>
  );
}
